const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');

const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');

const forwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const prepareALTForwardingAutomation = require('./PrepareALTForwardingAutomation');

exports.embedYourself = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus, oldApplicationName = '') {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let forwardingAutomation;
            if (oldApplicationName != "OldRelease") {
                /***********************************************************************************
                 * PromptForEmbeddingCausesRequestForBequeathingData /v1/bequeath-your-data-and-die
                 ************************************************************************************/
                let bequeathYourDataAndDieForwardingName = "PromptForEmbeddingCausesRequestForBequeathingData";
                let bequeathYourDataAndDieContext;
                let bequeathYourDataAndDieRequestBody = {};
                bequeathYourDataAndDieRequestBody.newApplicationName = await httpServerInterface.getApplicationNameAsync();
                bequeathYourDataAndDieRequestBody.newApplicationRelease = await httpServerInterface.getReleaseNumberAsync();
                bequeathYourDataAndDieRequestBody.newApplicationProtocol = await tcpServerInterface.getLocalProtocol();                
                bequeathYourDataAndDieRequestBody.newApplicationAddress = await tcpServerInterface.getLocalAddressForForwarding();
                bequeathYourDataAndDieRequestBody.newApplicationPort = await tcpServerInterface.getLocalPort();
                bequeathYourDataAndDieRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(bequeathYourDataAndDieRequestBody);
                forwardingAutomation = new forwardingConstructAutomationInput(
                    bequeathYourDataAndDieForwardingName,
                    bequeathYourDataAndDieRequestBody,
                    bequeathYourDataAndDieContext
                );
                forwardingConstructAutomationList.push(forwardingAutomation);
            }

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.registerYourself = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus, oldApplicationName, oldReleaseNumber) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let forwardingAutomation;
            let controlConstructUuid = await fileOperation.readFromDatabaseAsync(onfPaths.CONTROL_CONSTRUCT_UUID);
            /***********************************************************************************
             * PromptForRegisteringCausesRegistrationRequest /v1/register-application
             ************************************************************************************/
            let registrationApplicationForwardingName = "PromptForRegisteringCausesRegistrationRequest";
            let registrationApplicationContext;
            let registrationApplicationRequestBody = {};
            let tcpServerList = [];
            registrationApplicationRequestBody.applicationName = await httpServerInterface.getApplicationNameAsync();
            registrationApplicationRequestBody.releaseNumber = await httpServerInterface.getReleaseNumberAsync();
            registrationApplicationRequestBody.embeddingOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-001");
            registrationApplicationRequestBody.clientUpdateOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-007");
            registrationApplicationRequestBody.operationClientUpdateOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-011");

            // formulate the tcp-server-list
            let tcpHttpAddress = await tcpServerInterface.getLocalAddressOfTheProtocol("HTTP");
            let tcpHttpPort = await tcpServerInterface.getLocalPortOfTheProtocol("HTTP");
            if (tcpHttpAddress != undefined && tcpHttpPort != undefined) {
                if ("ipv-4-address" in tcpHttpAddress) {
                    tcpHttpAddress = {
                        "ip-address": tcpHttpAddress
                    }
                }
                let tcpServer = {
                    protocol: "HTTP",
                    port: tcpHttpPort,
                    address: tcpHttpAddress
                }
                tcpServerList.push(tcpServer);
            }
            let tcpHttpsAddress = await tcpServerInterface.getLocalAddressOfTheProtocol("HTTPS");
            let tcpHttpsPort = await tcpServerInterface.getLocalPortOfTheProtocol("HTTPS");
            if (tcpHttpsAddress != undefined && tcpHttpsPort != undefined) {
                if ("ipv-4-address" in tcpHttpsAddress) {
                    tcpHttpsAddress = {
                        "ip-address": tcpHttpsAddress
                    }
                }
                let tcpServer = {
                    protocol: "HTTPS",
                    port: tcpHttpsPort,
                    address: tcpHttpsAddress
                }
                tcpServerList.push(tcpServer);
            }

            registrationApplicationRequestBody.tcpServerList = tcpServerList;
            registrationApplicationRequestBody.precedingApplicationName = oldApplicationName;
            registrationApplicationRequestBody.precedingReleaseNumber = oldReleaseNumber;
            registrationApplicationRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(registrationApplicationRequestBody);
            forwardingAutomation = new forwardingConstructAutomationInput(
                registrationApplicationForwardingName,
                registrationApplicationRequestBody,
                registrationApplicationContext
            );
            forwardingConstructAutomationList.push(forwardingAutomation);

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.endSubscription = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology 
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTUnConfigureForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.inquireOamRequestApprovals = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.redirectOamRequestInformation = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.redirectServiceRequestInformation = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.redirectTopologyChangeInformation = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.updateOperationClient = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}


exports.updateClient = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus, applicationName) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            let currentApplicationName = await httpServerInterface.getApplicationNameAsync();
            if (currentApplicationName == applicationName) {
                let operationServerUuidList = await logicalTerminationPoint.getUuidListForTheProtocolAsync(
                    LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER
                );
                for (let i = 0; i < operationServerUuidList.length; i++) {
                    let operationServerUuid = operationServerUuidList[i];
                    let lifeCycleState = await operationServerInterface.getLifeCycleState(operationServerUuid);
                    if (isLifeCycleStateDeprecated(lifeCycleState)) {
                        let oldOperationName = await operationServerInterface.getOperationNameAsync(operationServerUuid);
                        let newOperationName = await operationServerInterface.getNextVersionOfOperationNameIfExists(
                            oldOperationName);
                        /***********************************************************************************
                         * Send relay operation update /v1/relay-operation-update
                         ************************************************************************************/
                        if (newOperationName) {
                            let operationUpdateForwardingName = "PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation";
                            let operationUpdateContext;
                            let operationUpdateRequestBody = {};
                            operationUpdateRequestBody.applicationName = applicationName;
                            operationUpdateRequestBody.releaseNumber = await httpServerInterface.getReleaseNumberAsync();
                            operationUpdateRequestBody.oldOperationName = oldOperationName;
                            operationUpdateRequestBody.newOperationName = newOperationName;
                            operationUpdateRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(operationUpdateRequestBody);
                            let forwardingAutomation = new forwardingConstructAutomationInput(
                                operationUpdateForwardingName,
                                operationUpdateRequestBody,
                                operationUpdateContext
                            );
                            forwardingConstructAutomationList.push(forwardingAutomation);
                        }
                    }
                }
            }

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

function isLifeCycleStateDeprecated(lifeCycleState) {
    let deprecatedLifeCycleState = operationServerInterface.OperationServerInterfacePac.OperationServerInterfaceConfiguration.lifeCycleStateEnum.DEPRECATED
    let lifeCycleStateEnum = operationServerInterface.OperationServerInterfacePac.OperationServerInterfaceConfiguration.lifeCycleStateEnum;
        for (let lifeCycleStateKey in lifeCycleStateEnum) {
            if (lifeCycleStateEnum[lifeCycleStateKey] === deprecatedLifeCycleState && lifeCycleStateKey === lifeCycleState)  {
                return true;
            }
        }
}

function removeAttribute(jsonObject, attributeName) {

    for (var element in jsonObject) {

        if (jsonObject.hasOwnProperty(element)) {

            if (element == attributeName) {
                delete jsonObject[element];

            } else if (typeof jsonObject[element] == 'object') {
                removeAttribute(jsonObject[element], attributeName);
            }
        }
    }
    return jsonObject;
}