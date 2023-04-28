/**
 * @file This class provides a stub for onf core-model.  
 * This class consolidates the technology specific extensions.
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       23.09.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG* 
 **/

'use strict';

const ForwardingDomain = require('../models/ForwardingDomain');
const logicalTerminationPoint = require('../models/LogicalTerminationPoint');
const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const eventDispatcher = require('../../rest/client/eventDispatcher');
const ForwardingConstruct = require('../models/ForwardingConstruct');
const FcPort = require('../models/FcPort');
var traceIndicatorIncrementer = 1;

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
exports.automateForwardingConstructAsync = function (operationServerName, forwardingAutomationInputList, user,
    xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            traceIndicatorIncrementer = 1;
            let operationServerUuid = await OperationServerInterface.getOperationServerUuidAsync(operationServerName);
            for (let i = 0; i < forwardingAutomationInputList.length; i++) {
                let forwardingAutomationInput = forwardingAutomationInputList[i];
                let forwardingName = forwardingAutomationInput.forwardingName;
                let attributeList = forwardingAutomationInput.attributeList;
                let context = forwardingAutomationInput.context;
                await automateForwardingsAsync(forwardingName,
                    attributeList,
                    context,
                    operationServerUuid,
                    user,
                    xCorrelator,
                    traceIndicator,
                    customerJourney
                );
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
exports.automateForwardingConstructWithoutInputAsync = function (forwardingAutomationInputList, user,
    xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            traceIndicatorIncrementer = 1;
            for (let i = 0; i < forwardingAutomationInputList.length; i++) {
                let forwardingAutomationInput = forwardingAutomationInputList[i];
                let forwardingName = forwardingAutomationInput.forwardingName;
                let attributeList = forwardingAutomationInput.attributeList;
                let context = forwardingAutomationInput.context;
                await automateForwardingsWithoutInputAsync(forwardingName,
                    attributeList,
                    context,
                    user,
                    xCorrelator,
                    traceIndicator,
                    customerJourney
                );
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function automateForwardingsAsync(forwardingName, attributeList, context, operationServerUuid, user,
    xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                forwardingName);
            let _isOperationServerIsInputFcPort = FcPort.isOperationOfFcPortType(
                forwardingConstruct,
                operationServerUuid,
                FcPort.portDirectionEnum.INPUT
            );
            if (_isOperationServerIsInputFcPort) {
                let _isForwardingConstructIsProcessSnippet = isForwardingConstructIsProcessSnippet(
                    forwardingConstruct);
                if (_isForwardingConstructIsProcessSnippet) {
                    automateProcessSnippetAsync(forwardingConstruct,
                        attributeList,
                        context,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                } else {
                    automateSubscriptionsAsync(forwardingConstruct,
                        attributeList,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });

}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function automateForwardingsWithoutInputAsync(forwardingName, attributeList, context, user,
    xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                forwardingName);

            if (forwardingConstruct) {
                let _isForwardingConstructIsProcessSnippet = isForwardingConstructIsProcessSnippet(
                    forwardingConstruct);
                if (_isForwardingConstructIsProcessSnippet) {
                    automateProcessSnippetAsync(forwardingConstruct,
                        attributeList,
                        context,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                } else {
                    automateSubscriptionsAsync(forwardingConstruct,
                        attributeList,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });

}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function automateProcessSnippetAsync(forwardingConstruct, attributeList, context, user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        let response;
        try {
            let fcPortList = forwardingConstruct["fc-port"];
            for (let i = 0; i < fcPortList.length; i++) {
                let fcPort = fcPortList[i];
                let fcPortDirection = fcPort["port-direction"];
                if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                    let isOutputMatchesContext = await isOutputMatchesContextAsync(fcPort, context);
                    if (isOutputMatchesContext) {
                        let fcPortLogicalTerminationPoint = fcPort["logical-termination-point"];
                        response = await eventDispatcher.dispatchEvent(
                            fcPortLogicalTerminationPoint,
                            attributeList,
                            user,
                            xCorrelator,
                            traceIndicator + "." + (traceIndicatorIncrementer++),
                            customerJourney
                        );
                    }
                }
            }
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function automateSubscriptionsAsync(forwardingConstruct, attributeList,
    user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        let response;
        try {
            let fcPortList = forwardingConstruct["fc-port"];
            for (let i = 0; i < fcPortList.length; i++) {
                let fcPort = fcPortList[i];
                let fcPortLogicalTerminationPoint = fcPort["logical-termination-point"];
                let fcPortDirection = fcPort["port-direction"];
                if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                    response = await eventDispatcher.dispatchEvent(
                        fcPortLogicalTerminationPoint,
                        attributeList,
                        user,
                        xCorrelator,
                        traceIndicator + "." + (traceIndicatorIncrementer++),
                        customerJourney
                    );
                }
            }
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function isForwardingConstructIsProcessSnippet(forwardingConstruct) {
    let isForwardingConstructIsProcessSnippet = false;
    try {
        let nameList = forwardingConstruct["name"];
        for (let i = 0; i < nameList.length; i++) {
            let valueName = getValueFromKey(
                nameList,
                "ForwardingKind"
            );
            if (valueName == ForwardingConstruct.forwardingConstructKindEnum.PROCESS_SNIPPET) {
                isForwardingConstructIsProcessSnippet = true;
            }
        }
        return isForwardingConstructIsProcessSnippet;
    } catch (error) {
        throw error;
    }
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function isOutputMatchesContextAsync(fcPort, context) {
    return new Promise(async function (resolve, reject) {
        let isOutputMatchesContext = false;
        try {
            let fcPortDirection = fcPort["port-direction"];
            if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                let fcLogicalTerminationPoint = fcPort["logical-termination-point"];
                let serverLtpList = await logicalTerminationPoint.
                getServerLtpListAsync(fcLogicalTerminationPoint);
                let httpClientUuid = serverLtpList[0];
                let applicationName = await HttpClientInterface.
                getApplicationNameAsync(httpClientUuid);
                let releaseNumber = await HttpClientInterface.
                getReleaseNumberAsync(httpClientUuid);
                if (context == (applicationName + releaseNumber)) {
                    isOutputMatchesContext = true;
                }
            }
            resolve(isOutputMatchesContext);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function getValueFromKey(nameList, key) {
    for (let i = 0; i < nameList.length; i++) {
        let valueName = nameList[i]["value-name"];
        if (valueName == key) {
            return nameList[i]["value"];
        }
    }
    return undefined;
}
