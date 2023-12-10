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
// eslint-disable-next-line no-unused-vars
const ForwardingAutomationInput = require('./models/forwardingConstruct/AutomationInput');

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerName operation server uuid of the request url
 * @param {Array<ForwardingAutomationInput>} forwardingAutomationInputList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 **/
exports.automateForwardingConstructAsync = async function (operationServerName, forwardingAutomationInputList, user,
    xCorrelator, traceIndicator, customerJourney) {
    let newTraceIndicator = traceIndicator + ".0";
    let operationServerUuid = await OperationServerInterface.getOperationServerUuidAsync(operationServerName);
    for (let forwardingAutomationInput of forwardingAutomationInputList) {
        let forwardingName = forwardingAutomationInput.forwardingName;
        let attributeList = forwardingAutomationInput.attributeList;
        let context = forwardingAutomationInput.context;
        newTraceIndicator = await automateForwardingsAsync(forwardingName,
            attributeList,
            context,
            operationServerUuid,
            user,
            xCorrelator,
            newTraceIndicator,
            customerJourney
        );
    }
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {Array<ForwardingAutomationInput>} forwardingAutomationInputList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 **/
exports.automateForwardingConstructWithoutInputAsync = async function (forwardingAutomationInputList, user,
    xCorrelator, traceIndicator, customerJourney) {
    let newTraceIndicator = traceIndicator + ".0";
    for (let forwardingAutomationInput of forwardingAutomationInputList) {
        let forwardingName = forwardingAutomationInput.forwardingName;
        let attributeList = forwardingAutomationInput.attributeList;
        let context = forwardingAutomationInput.context;
        newTraceIndicator = await automateForwardingsWithoutInputAsync(forwardingName,
            attributeList,
            context,
            user,
            xCorrelator,
            newTraceIndicator,
            customerJourney
        );
    }
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingName
 * @param {Object} attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} context
 * @param {String} operationServerUuid
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 * @returns {Promise<String>} new trace indicator
 **/
async function automateForwardingsAsync(forwardingName, attributeList, context, operationServerUuid, user,
    xCorrelator, traceIndicator, customerJourney) {
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        forwardingName);
    let _isOperationServerIsInputFcPort = FcPort.isOperationOfFcPortType(
        forwardingConstruct,
        operationServerUuid,
        FcPort.portDirectionEnum.INPUT
    );
    let newTraceIndicator = traceIndicator;
    if (_isOperationServerIsInputFcPort) {
        let _isForwardingConstructIsProcessSnippet = isForwardingConstructIsProcessSnippet(
            forwardingConstruct);
        if (_isForwardingConstructIsProcessSnippet) {
            newTraceIndicator = await automateProcessSnippetAsync(forwardingConstruct,
                attributeList,
                context,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney
            );
        } else {
            newTraceIndicator = await automateSubscriptionsAsync(forwardingConstruct,
                attributeList,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney
            );
        }
    }
    return newTraceIndicator;
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingName
 * @param {Object} attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} context
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 * @returns {Promise<String>} new trace indicator
 **/
async function automateForwardingsWithoutInputAsync(forwardingName, attributeList, context, user,
    xCorrelator, traceIndicator, customerJourney) {
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        forwardingName);
    let newTraceIndicator = traceIndicator;
    if (forwardingConstruct) {
        let _isForwardingConstructIsProcessSnippet = isForwardingConstructIsProcessSnippet(
            forwardingConstruct);
        if (_isForwardingConstructIsProcessSnippet) {
            newTraceIndicator = await automateProcessSnippetAsync(forwardingConstruct,
                attributeList,
                context,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney
            );
        } else {
            newTraceIndicator = await automateSubscriptionsAsync(forwardingConstruct,
                attributeList,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney
            );
        }
    }
    return newTraceIndicator;
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingConstruct
 * @param {Object} attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} context
 * @param {String} user user who initiates this request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 * @returns {Promise<String>} new trace indicator
 **/
async function automateProcessSnippetAsync(forwardingConstruct, attributeList, context, user, xCorrelator, traceIndicator, customerJourney) {
    let incrementedTraceIndicator = traceIndicator;
    let fcPortList = forwardingConstruct["fc-port"];
    for (let fcPort of fcPortList) {
        let fcPortDirection = fcPort["port-direction"];
        if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
            let isOutputMatchesContext = await isOutputMatchesContextAsync(fcPort, context);
            if (isOutputMatchesContext) {
                let fcPortLogicalTerminationPoint = fcPort["logical-termination-point"];
                incrementedTraceIndicator = incrementTraceIndicator(incrementedTraceIndicator);
                eventDispatcher.dispatchEvent(
                    fcPortLogicalTerminationPoint,
                    attributeList,
                    user,
                    xCorrelator,
                    incrementedTraceIndicator,
                    customerJourney
                );
            }
        }
    }
    return incrementedTraceIndicator;
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingConstruct
 * @param {Object} attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 * @returns {Promise<String>} new trace indicator
 **/
async function automateSubscriptionsAsync(forwardingConstruct, attributeList,
    user, xCorrelator, traceIndicator, customerJourney) {
    let incrementedTraceIndicator = traceIndicator;
    let fcPortList = forwardingConstruct["fc-port"];
    for (let fcPort of fcPortList) {
        let fcPortLogicalTerminationPoint = fcPort["logical-termination-point"];
        let fcPortDirection = fcPort["port-direction"];
        if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
            incrementedTraceIndicator = incrementTraceIndicator(incrementedTraceIndicator);
            eventDispatcher.dispatchEvent(
                fcPortLogicalTerminationPoint,
                attributeList,
                user,
                xCorrelator,
                incrementedTraceIndicator,
                customerJourney
            );
        }
    }
    return incrementedTraceIndicator;
}

function isForwardingConstructIsProcessSnippet(forwardingConstruct) {
    let isForwardingConstructIsProcessSnippet = false;
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
}

async function isOutputMatchesContextAsync(fcPort, context) {
    let fcLogicalTerminationPoint = fcPort["logical-termination-point"];
    let serverLtpList = await logicalTerminationPoint.getServerLtpListAsync(fcLogicalTerminationPoint);
    let httpClientUuid = serverLtpList[0];
    let applicationName = await HttpClientInterface.getApplicationNameAsync(httpClientUuid);
    let releaseNumber = await HttpClientInterface.getReleaseNumberAsync(httpClientUuid);
    return (context == (applicationName + releaseNumber));
}

function getValueFromKey(nameList, key) {
    for (let i = 0; i < nameList.length; i++) {
        let valueName = nameList[i]["value-name"];
        if (valueName == key) {
            return nameList[i]["value"];
        }
    }
    return undefined;
}

function incrementTraceIndicator(traceIndicator) {
    const indexOfDot = traceIndicator.lastIndexOf(".");
    const incLastDigit = parseInt(traceIndicator.substring(indexOfDot + 1)) + 1;
    return traceIndicator.substring(0, indexOfDot + 1) + incLastDigit.toString();
}
