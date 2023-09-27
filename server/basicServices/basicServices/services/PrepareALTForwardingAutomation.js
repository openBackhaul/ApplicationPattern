// @ts-check
const ForwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const ControlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');
// eslint-disable-next-line no-unused-vars
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
// eslint-disable-next-line no-unused-vars
const ForwardingConstructConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ConfigurationStatus')

/**
 * @param {LogicalTerminationPointConfigurationStatus} ltpConfigurationStatus
 * @param {ForwardingConstructConfigurationStatus} fcConfigurationStatus
 * @returns {Promise<Array<ForwardingConstructAutomationInput>>}
 */
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

/**
 * This function should be used for creating delete-ltp-and-dependents forwardings when an application is
 * removed. Since delete-ltp-and-dependents will remove all traces of an LTP (including fc-ports),
 * there is no need to send each LTP individually, only tcp-clients are necessary.
 * 
 * @param {LogicalTerminationPointConfigurationStatus} ltpConfigurationStatus
 * @returns {Array<ForwardingConstructAutomationInput>} list of forwardings
 */
exports.getALTUnConfigureForwardingAutomationInputAsync = function (ltpConfigurationStatus) {
    if (ltpConfigurationStatus === undefined ||
        ltpConfigurationStatus.tcpClientConfigurationStatusList === undefined) {
        return [];
    }
    let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
    let tcpClientForwardingAutomationList = getUnconfigurableTcpClientForwardingAutomationInput(tcpClientConfigurationStatusList);
    return tcpClientForwardingAutomationList;
}

/**
 * @param {String} uuid
 * @returns {Promise<Array<ForwardingConstructAutomationInput>>}
 */
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

    if (httpClientForwardingAutomation) {
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

/**
 * Creates forwardings for delete-fc-port.
 * @param {ForwardingConstructConfigurationStatus} fcConfigurationStatus
 * @returns {Array<ForwardingConstructAutomationInput>} list of forwardings
 */
exports.getFDUnconfigureForwardingAutomationInputList = function(fcConfigurationStatus) {
    if (fcConfigurationStatus === undefined ||
        fcConfigurationStatus.forwardingConstructConfigurationStatusList === undefined) {
        return [];
    }
    let fcPortConfigurationStatusList = fcConfigurationStatus.fcPortConfigurationStatusList;
    return getFCPortDeleteForwardingAutomationInputList(fcPortConfigurationStatusList);
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
    if (operationClientConfigurationStatusList) {
        for (let operationClientConfigurationStatus of operationClientConfigurationStatusList) {
            if (operationClientConfigurationStatus.updated) {
                let body = await ControlConstruct.getLogicalTerminationPointAsync(
                    operationClientConfigurationStatus.uuid);
                body = removeAttribute(body, "operation-key")
                let forwardingAutomation = new ForwardingConstructAutomationInput(fwName, body, undefined);
                forwardingConstructAutomationList.push(forwardingAutomation);
            }
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
