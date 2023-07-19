const ForwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const ControlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

exports.getALTForwardingAutomationInputAsync = async function (ltpConfigurationStatus, fcConfigurationStatus) {
    let forwardingConstructAutomationList = [];
    let ltpforwardingConstructAutomationInputList = await getLTPForwardingAutomationInputListAsync(
        ltpConfigurationStatus
    );
    forwardingConstructAutomationList.push(ltpforwardingConstructAutomationInputList);
    let fdforwardingConstructAutomationInputList = await getFDForwardingAutomationInputListAsync(
        fcConfigurationStatus
    );
    forwardingConstructAutomationList.push(fdforwardingConstructAutomationInputList);
    return forwardingConstructAutomationList.flat();
}

exports.getALTUnConfigureForwardingAutomationInputAsync = function (ltpConfigurationStatus, fcConfigurationStatus) {
    let forwardingConstructAutomationList = [];
    let ltpforwardingConstructAutomationInputList = getLTPUnconfigureForwardingAutomationInputList(
        ltpConfigurationStatus
    );
    forwardingConstructAutomationList.push(ltpforwardingConstructAutomationInputList);
    let fdforwardingConstructAutomationInputList = getFDUnconfigureForwardingAutomationInputList(
        fcConfigurationStatus
    );
    forwardingConstructAutomationList.push(fdforwardingConstructAutomationInputList);
    return forwardingConstructAutomationList.flat();
}

exports.getALTForwardingAutomationInputForOamRequestAsync = async function (uuid) {
    let forwardingConstructAutomationList = [];
    let fwName = "OamRequestCausesLtpUpdateRequest";
    if (uuid) {
        let body = await ControlConstruct.getLogicalTerminationPointAsync(uuid);
        let layerProtocolName = body["layer-protocol"][0]["layer-protocol-name"];
        if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.OPERATION_CLIENT ||
            layerProtocolName == LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER) {
            body = removeAttribute(body, "operation-key");
        }
        let ltpforwardingConstructAutomationInput = new ForwardingConstructAutomationInput(fwName, body, undefined);
        forwardingConstructAutomationList.push(ltpforwardingConstructAutomationInput);
    }    
    return forwardingConstructAutomationList;
}

async function getLTPForwardingAutomationInputListAsync(ltpConfigurationStatus) {
    if (ltpConfigurationStatus === undefined ||
        ltpConfigurationStatus.httpClientConfigurationStatus === undefined) {
        return [];
    }
    let forwardingConstructAutomationList = [];
    let httpClientConfigurationStatus = ltpConfigurationStatus.httpClientConfigurationStatus;
    let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
    let operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;

    let httpClientForwardingAutomation = await getHttpClientForwardingAutomationInputAsync(httpClientConfigurationStatus);
    let tcpClientForwardingAutomationList = await getTcpClientForwardingAutomationInputAsync(tcpClientConfigurationStatusList);
    let operationClientForwardingAutomationList = await getOperationClientForwardingAutomationInputListAsync(operationClientConfigurationStatusList);

    if (httpClientConfigurationStatus) {
        forwardingConstructAutomationList.push(httpClientForwardingAutomation);
    }
    forwardingConstructAutomationList.push(tcpClientForwardingAutomationList);
    forwardingConstructAutomationList.push(operationClientForwardingAutomationList);
    return forwardingConstructAutomationList.flat();
}

function getLTPUnconfigureForwardingAutomationInputList(ltpConfigurationStatus) {
    if (ltpConfigurationStatus === undefined ||
        ltpConfigurationStatus.httpClientConfigurationStatus === undefined) {
        return [];
    }
    let forwardingConstructAutomationList = [];
    let httpClientConfigurationStatus = ltpConfigurationStatus.httpClientConfigurationStatus;
    let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
    let operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;

    let httpClientForwardingAutomation = getUnconfigurableHttpClientForwardingAutomationInput(httpClientConfigurationStatus);
    let tcpClientForwardingAutomationList = getUnconfigurableTcpClientForwardingAutomationInput(tcpClientConfigurationStatusList);
    let operationClientForwardingAutomationList = getUnconfigurableOperationClientForwardingAutomationInputList(operationClientConfigurationStatusList);

    if (httpClientConfigurationStatus) {
        forwardingConstructAutomationList.push(httpClientForwardingAutomation);
    }
    forwardingConstructAutomationList.push(tcpClientForwardingAutomationList);
    forwardingConstructAutomationList.push(operationClientForwardingAutomationList);
    return forwardingConstructAutomationList.flat();
}

async function getFDForwardingAutomationInputListAsync(fcConfigurationStatus) {
    let forwardingConstructAutomationList = [];
    if (fcConfigurationStatus === undefined ||
        fcConfigurationStatus.forwardingConstructConfigurationStatusList === undefined) {
        return [];
    }
    let fcConfigurationStatusList = fcConfigurationStatus.forwardingConstructConfigurationStatusList;
    let fcforwardingConstructAutomationInputList = await getFCForwardingAutomationInputList(fcConfigurationStatusList);
    forwardingConstructAutomationList.push(fcforwardingConstructAutomationInputList);

    let fcPortConfigurationStatusList = fcConfigurationStatus.fcPortConfigurationStatusList;
    let fcPortforwardingConstructAutomationInputList = await getFCPortForwardingAutomationInputList(fcPortConfigurationStatusList);
    forwardingConstructAutomationList.push(fcPortforwardingConstructAutomationInputList);

    return forwardingConstructAutomationList.flat();
}

function getFDUnconfigureForwardingAutomationInputList(fcConfigurationStatus) {
    if (fcConfigurationStatus === undefined ||
        fcConfigurationStatus.forwardingConstructConfigurationStatusList === undefined) {
        return [];
    }
    let fcPortConfigurationStatusList = fcConfigurationStatus.fcPortConfigurationStatusList;
    let fcPortforwardingConstructAutomationInputList = getFCPortDeleteForwardingAutomationInputList(fcPortConfigurationStatusList);
    return fcPortforwardingConstructAutomationInputList;
}

async function getHttpClientForwardingAutomationInputAsync(httpClientConfigurationStatus) {
    let fwName = "ServiceRequestCausesLtpUpdateRequest";
    if (httpClientConfigurationStatus.updated) {
        let body = await ControlConstruct.getLogicalTerminationPointAsync(
            httpClientConfigurationStatus.uuid);
        return new ForwardingConstructAutomationInput(fwName, body, undefined);
    }
    return undefined;
}

function getUnconfigurableHttpClientForwardingAutomationInput(httpClientConfigurationStatus) {
    let fwName = "ServiceRequestCausesLtpDeletionRequest";
    if (httpClientConfigurationStatus.updated) {
        let body = { uuid: httpClientConfigurationStatus.uuid };
        body = onfFormatter.modifyJsonObjectKeysToKebabCase(body);
        return new ForwardingConstructAutomationInput(fwName, body, undefined);
    }
    return undefined;
}

async function getTcpClientForwardingAutomationInputAsync(tcpClientConfigurationStatusList) {
    let fwName = "ServiceRequestCausesLtpUpdateRequest";
    let forwardingAutomationList = [];

    for (let tcpClientConfigurationStatus of tcpClientConfigurationStatusList) {
        if (tcpClientConfigurationStatus.updated) {
            let body = await ControlConstruct.getLogicalTerminationPointAsync(
                tcpClientConfigurationStatus.uuid);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingAutomationList;
}

function getUnconfigurableTcpClientForwardingAutomationInput(tcpClientConfigurationStatusList) {
    let fwName = "ServiceRequestCausesLtpDeletionRequest";
    let forwardingAutomationList = [];

    for (let tcpClientConfigurationStatus of tcpClientConfigurationStatusList) {
        if (tcpClientConfigurationStatus.updated) {
            let body = { uuid: tcpClientConfigurationStatus.uuid };
            body = onfFormatter.modifyJsonObjectKeysToKebabCase(body);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingAutomationList;
}

async function getOperationClientForwardingAutomationInputListAsync(operationClientConfigurationStatusList) {
    let forwardingConstructAutomationList = [];
    let fwName = "ServiceRequestCausesLtpUpdateRequest";

    for (let operationClientConfigurationStatus of operationClientConfigurationStatusList) {
        if (operationClientConfigurationStatus.updated) {
            let body = await ControlConstruct.getLogicalTerminationPointAsync(
                operationClientConfigurationStatus.uuid);
            body = removeAttribute(body, "operation-key")
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingConstructAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingConstructAutomationList;
}

function getUnconfigurableOperationClientForwardingAutomationInputList(operationClientConfigurationStatusList) {
    let fwName = "ServiceRequestCausesLtpDeletionRequest";
    let forwardingConstructAutomationList = [];

    for (let operationClientConfigurationStatus of operationClientConfigurationStatusList) {
        if (operationClientConfigurationStatus.updated) {
            let body = { uuid: operationClientConfigurationStatus.uuid };
            body = onfFormatter.modifyJsonObjectKeysToKebabCase(body);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingConstructAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingConstructAutomationList;
}

async function getFCForwardingAutomationInputList(fcConfigurationStatusList) {
    let fwName = "ServiceRequestCausesFcUpdateRequest";
    let forwardingConstructAutomationList = [];
    for (let fcConfigurationStatus of fcConfigurationStatusList) {
        if (fcConfigurationStatus.updated) {
            let body = await ForwardingDomain.getForwardingConstructAsync(
                fcConfigurationStatus.uuid);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingConstructAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingConstructAutomationList
}

async function getFCPortForwardingAutomationInputList(fcPortConfigurationStatusList) {
    let fwName = "ServiceRequestCausesFcPortUpdateRequest";
    let forwardingConstructAutomationList = [];

    for (let fcPortConfigurationStatus of fcPortConfigurationStatusList) {
        if (fcPortConfigurationStatus.updated) {
            let body = { fcUuid: fcPortConfigurationStatus.uuid };
            body.fcPort = await ForwardingConstruct.getFcPortAsync(
                fcPortConfigurationStatus.uuid,
                fcPortConfigurationStatus.localId
            );
            body = onfFormatter.modifyJsonObjectKeysToKebabCase(body);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingConstructAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingConstructAutomationList;
}

function getFCPortDeleteForwardingAutomationInputList(fcPortConfigurationStatusList) {
    let fwName = "ServiceRequestCausesFcPortDeletionRequest";
    let forwardingConstructAutomationList = [];

    for (let fcPortConfigurationStatus of fcPortConfigurationStatusList) {
        if (fcPortConfigurationStatus.updated) {
            let body = { fcUuid: fcPortConfigurationStatus.uuid };
            body.fcPortLocalId = fcPortConfigurationStatus.localId;
            body = onfFormatter.modifyJsonObjectKeysToKebabCase(body);
            let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
            forwardingConstructAutomationList.push(forwardingAutomation);
        }
    }
    return forwardingConstructAutomationList;
}

function removeAttribute(jsonObject, attributeName) {
    for (var element in jsonObject) {
        if (element == attributeName) {
            delete jsonObject[element];
        } else if (typeof jsonObject[element] == 'object') {
            removeAttribute(jsonObject[element], attributeName);
        }
    }
    return jsonObject;
}
