// @ts-check
'use strict';

const OperationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
const HttpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const RequestHeader = require('../rest/client/RequestHeader');
const RequestBuilder = require('../rest/client/RequestBuilder');
const onfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');
const FcPort = require('../onfModel/models/FcPort');
const ForwardingDomain = require('../onfModel/models/ForwardingDomain');
const moment = require('moment');

/**
 * This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application<br>
 * @param {string} serverApplicationName application name of the server side<br>
 * @param {string} serverApplicationReleaseNumber application release number of the server side<br>
 * @param {string} xCorrelator correlation tag of the current execution<br>
 * @param {string} traceIndicator sequence number of the execution<br>
 * @param {string} userName name of the user who is accessed the service<br>
 * @param {string} originator originator of the request<br>
 * @param {string} operationName name of the called service<br>
 * @param {number} responseCode response code of the rest call execution<br>
 * @param {object} requestBody  request body<br>
 * @param {object} responseBody  response body<br>
 * @returns {Promise<boolean>} returns true if the operation is successful. Promise is never rejected.<br>
 */
exports.recordServiceRequestFromClient = async function (serverApplicationName, serverApplicationReleaseNumber, xCorrelator, traceIndicator, userName, originator,
    operationName, responseCode, requestBody, responseBody) {
    let httpRequestBody = {};
    try {
        let operationClientUuid = await getOperationClientToLogServiceRequest();
        let detailedLoggingIsOn = await OperationClientInterface.getDetailedLoggingIsOnAsync(operationClientUuid);
        let operationKey = await OperationClientInterface.getOperationKeyAsync(operationClientUuid);
        let timestamp = moment().format();
        let applicationName = await HttpServerInterface.getApplicationNameAsync();                                                                                            
        let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new RequestHeader(userName, applicationName, "", "", "unknown", operationKey));
        let stringifiedRequestBody = JSON.stringify(requestBody);
        let stringifiedResponseBody = JSON.stringify(responseBody);
        let httpRequestBody = formulateRequestBody(xCorrelator, traceIndicator, userName, originator, serverApplicationName, serverApplicationReleaseNumber,
            operationName, responseCode, timestamp, stringifiedRequestBody, stringifiedResponseBody, detailedLoggingIsOn);
        let response = await RequestBuilder.BuildAndTriggerRestRequest(operationClientUuid, "POST", httpRequestHeader, httpRequestBody);
        let responseCodeValue = response.status.toString();
        if (responseCodeValue.startsWith("2")) {
            return true;
        }
        console.log(`recordServiceRequestFromClient - record service request from client with body ${JSON.stringify(httpRequestBody)} failed with response status: ${response.status}`);
        return false;
    } catch (error) {
        console.log(`recordServiceRequestFromClient - record service request from client with body ${JSON.stringify(httpRequestBody)} failed with error: ${error.message}`);
        return false;
    }
}

/**
 * This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application<br>
 * @param {string} xCorrelator correlation tag of the current execution<br>
 * @param {string} traceIndicator sequence number of the execution<br>
 * @param {string} userName name of the user who is accessed the service<br>
 * @param {string} originator originator of the request<br>
 * @param {string} operationName name of the called service<br>
 * @param {number} responseCode response code of the rest call execution<br>
 * @param {object} requestBody  request body<br>
 * @param {object} responseBody  response body<br>
 * @returns {Promise<boolean>} returns true if the operation is successful. Promise is never rejected.<br>
 */
exports.recordServiceRequest = async function (xCorrelator, traceIndicator, userName, originator,
    operationName, responseCode, requestBody, responseBody) {
    let httpRequestBody = {};
    try {
        let operationClientUuid = await getOperationClientToLogServiceRequest();
        let detailedLoggingIsOn = await OperationClientInterface.getDetailedLoggingIsOnAsync(operationClientUuid);
        let operationKey = await OperationClientInterface.getOperationKeyAsync(operationClientUuid);
        let timestamp = moment().format();
        let applicationName = await HttpServerInterface.getApplicationNameAsync();
        let applicationReleaseNumber = await HttpServerInterface.getReleaseNumberAsync();
        let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new RequestHeader(userName, applicationName, "", "", "unknown", operationKey));
        let stringifiedRequestBody = JSON.stringify(requestBody);
        let stringifiedResponseBody = JSON.stringify(responseBody);
        let httpRequestBody = formulateRequestBody(xCorrelator, traceIndicator, userName, originator, applicationName, applicationReleaseNumber,
            operationName, responseCode, timestamp, stringifiedRequestBody, stringifiedResponseBody, detailedLoggingIsOn);
        let response = await RequestBuilder.BuildAndTriggerRestRequest(operationClientUuid, "POST", httpRequestHeader, httpRequestBody);
        let responseCodeValue = response.status.toString();
        if (responseCodeValue.startsWith("2")) {
            return true;
        }
        console.log(`recordServiceRequest - record service request with body ${JSON.stringify(httpRequestBody)} failed with response status: ${response.status}`);
        return false;
    } catch (error) {
        console.log(`recordServiceRequest - record service request with body ${JSON.stringify(httpRequestBody)} failed with error: ${error.message}`);
        return false;
    }
}

/**
 * This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application<br>
 * @param {String} xCorrelator correlation tag of the current execution<br>
 * @param {String} traceIndicator sequence number of the execution<br>
 * @param {String} userName name of the user who is accessed the service<br>
 * @param {String} originator originator of the request<br>
 * @param {String} applicationName name of the calling application<br>
 * @param {String} applicationReleaseNumber release number of the calling application<br>
 * @param {String} operationName name of the called service<br>
 * @param {Number} responseCode response code of the rest call execution<br>
 * @param {String} timestamp timestamp of the execution<br>
 * @param {String} stringifiedBody stringified request body<br>
 * @param {String} stringifiedResponse stringified response body<br>
 * @param {Boolean} detailedLoggingIsOn
 * @returns {Object} return the formulated responseBody<br>
 */
function formulateRequestBody(xCorrelator, traceIndicator, userName, originator, applicationName, applicationReleaseNumber,
    operationName, responseCode, timestamp, stringifiedBody, stringifiedResponse, detailedLoggingIsOn) {
    let httpRequestBody = {
        "x-correlator": xCorrelator,
        "trace-indicator": traceIndicator,
        "user": userName,
        "originator": originator,
        "application-name": applicationName,
        "release-number": applicationReleaseNumber,
        "operation-name": operationName,
        "response-code": responseCode
    };
    if (detailedLoggingIsOn) {
        httpRequestBody["timestamp"] = timestamp;
        httpRequestBody["stringified-body"] = stringifiedBody;
        httpRequestBody["stringified-response"] = stringifiedResponse;
    }
    return httpRequestBody;
}

async function getOperationClientToLogServiceRequest() {
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        "ServiceRequestCausesLoggingRequest");
    if (forwardingConstruct) {
        let fcPortList = forwardingConstruct["fc-port"];
        for (let fcPort of fcPortList) {
            if (FcPort.portDirectionEnum.OUTPUT === fcPort["port-direction"]) {
                return fcPort["logical-termination-point"];
            }
        }
    }
    return undefined;
}
