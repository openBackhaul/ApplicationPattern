const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');

const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const ControlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const forwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const prepareALTForwardingAutomation = require('./PrepareALTForwardingAutomationV2');
const TcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');

exports.disposeRemaindersOfDeregisteredApplication = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
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

exports.embedYourself = function (ltpConfigurationList, oldApplicationName = '') {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let forwardingAutomation;
            if (oldApplicationName != "OldRelease" && oldApplicationName != '') {
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
                let oldReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidFromForwarding(bequeathYourDataAndDieForwardingName);
                let oldReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(oldReleaseHttpClientUuid))[0];
                let oldReleaseProtocol = await TcpClientInterface.getRemoteProtocolAsync(oldReleaseTcpClientUuid);
                let oldReleaseAddress = await TcpClientInterface.getRemoteAddressAsync(oldReleaseTcpClientUuid);
                let oldReleasePort = await TcpClientInterface.getRemotePortAsync(oldReleaseTcpClientUuid);
                if (!(oldReleaseProtocol == bequeathYourDataAndDieRequestBody.newApplicationProtocol &&
                        JSON.stringify(oldReleaseAddress) == JSON.stringify(bequeathYourDataAndDieRequestBody.newApplicationAddress) &&
                        oldReleasePort == bequeathYourDataAndDieRequestBody.newApplicationPort)) {
                    bequeathYourDataAndDieRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(bequeathYourDataAndDieRequestBody);
                    forwardingAutomation = new forwardingConstructAutomationInput(
                        bequeathYourDataAndDieForwardingName,
                        bequeathYourDataAndDieRequestBody,
                        bequeathYourDataAndDieContext
                    );
                    forwardingConstructAutomationList.push(forwardingAutomation);
                }
            }

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                ltpConfigurationList
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

exports.registerYourself = function (oldApplicationName, oldReleaseNumber) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let forwardingAutomation;
            let controlConstructUuid = await fileOperation.readFromDatabaseAsync(onfPaths.CONTROL_CONSTRUCT_UUID);            

            /***********************************************************************************
             * PromptForRegisteringCausesRegistrationRequest2 /v2/register-application
             ***********************************************************************************/
            let registrationRequest2ForwardingName = "PromptForRegisteringCausesRegistrationRequest2";
            let registrationRequest2Context;
            let registrationRequest2RequestBody = {};
            let registrationRequest2TcpServer;
            registrationRequest2RequestBody.applicationName = await httpServerInterface.getApplicationNameAsync();
            registrationRequest2RequestBody.releaseNumber = await httpServerInterface.getReleaseNumberAsync();
            registrationRequest2RequestBody.embeddingOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-001");
            registrationRequest2RequestBody.clientUpdateOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-007");
            registrationRequest2RequestBody.operationClientUpdateOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-011");
            registrationRequest2RequestBody.disposeRemaindersOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-013");
            registrationRequest2RequestBody.precedingReleaseOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-014");
            registrationRequest2RequestBody.subsequentReleaseOperation = await operationServerInterface.getOperationNameAsync(controlConstructUuid + "-op-s-bm-015");

            // formulate the tcp-server-list
            let registrationRequest2TcpHttpAddress = await tcpServerInterface.getLocalAddressOfTheProtocol("HTTP");
            let registrationRequest2TcpHttpPort = await tcpServerInterface.getLocalPortOfTheProtocol("HTTP");
            if (registrationRequest2TcpHttpAddress != undefined && registrationRequest2TcpHttpPort != undefined) {
                if ("ipv-4-address" in registrationRequest2TcpHttpAddress) {
                    registrationRequest2TcpHttpAddress = {
                        "ip-address": registrationRequest2TcpHttpAddress
                    }
                }
                registrationRequest2TcpServer = {
                    protocol: "HTTP",
                    port: registrationRequest2TcpHttpPort,
                    address: registrationRequest2TcpHttpAddress
                }
            }

            registrationRequest2RequestBody.tcpServer = registrationRequest2TcpServer;
            if (oldApplicationName) {
                registrationRequest2RequestBody.precedingApplicationName = oldApplicationName;
            }
            if (oldReleaseNumber) {
                registrationRequest2RequestBody.precedingReleaseNumber = oldReleaseNumber;
            }
            registrationRequest2RequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(registrationRequest2RequestBody);
            let registrationRequest2forwardingAutomation = new forwardingConstructAutomationInput(
                registrationRequest2ForwardingName,
                registrationRequest2RequestBody,
                registrationRequest2Context
            );
            forwardingConstructAutomationList.push(registrationRequest2forwardingAutomation);

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

            registrationApplicationRequestBody.tcpServerList = tcpServerList;
            if (oldApplicationName) {
                registrationApplicationRequestBody.precedingApplicationName = oldApplicationName;
            }
            if (oldReleaseNumber) {
                registrationApplicationRequestBody.precedingReleaseNumber = oldReleaseNumber;
            }
            registrationApplicationRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(registrationApplicationRequestBody);
            forwardingAutomation = new forwardingConstructAutomationInput(
                registrationApplicationForwardingName,
                registrationApplicationRequestBody,
                registrationApplicationContext
            );
            forwardingConstructAutomationList.push(forwardingAutomation);

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.endSubscription = function (forwardingConstructConfigurationStatus) {
    return prepareALTForwardingAutomation.getFDUnconfigureForwardingAutomationInputList(
        forwardingConstructConfigurationStatus
    );
}

exports.updateClient = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus, applicationName) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let currentApplicationName = await httpServerInterface.getApplicationNameAsync();
            if (currentApplicationName == applicationName) {
                let operationServerList = await ControlConstruct.getLogicalTerminationPointListAsync(LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER);
                for (let operationServer of operationServerList) {
                    const opSPac = operationServer["layer-protocol"][0]["operation-server-interface-1-0:operation-server-interface-pac"];
                    const opSCap = opSPac["operation-server-interface-capability"];
                    const opSConf = opSPac["operation-server-interface-configuration"];
                    let lifeCycleState = opSConf["life-cycle-state"];
                    if (isLifeCycleStateDeprecated(lifeCycleState)) {
                        let oldOperationName = opSCap["operation-name"];
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

exports.updateLtpToALT = function (ltpConfigurationList) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                ltpConfigurationList
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
        if (lifeCycleStateEnum[lifeCycleStateKey] === deprecatedLifeCycleState && lifeCycleStateKey === lifeCycleState) {
            return true;
        }
    }
}
