
const moment = require('moment');
const requestHeader = require('onf-core-model-ap/applicationPattern/rest/client/RequestHeader');
const requestBuilder = require('onf-core-model-ap/applicationPattern/rest/client/RequestBuilder');

const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');

const HttpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const forwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain'); 
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');


/**
 * This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application<br>
 * @param {string} xCorrelator correlation tag of the current execution<br>
 * @param {string} traceIndicator sequence number of the execution<br>
 * @param {string} userName name of the user who is accessed the service<br>
 * @param {string} originator originator of the request<br>
 * @param {string} operationName name of the called service<br>
 * @param {string} responseCode response code of the rest call execution<br>
 * @param {string} requestBody  request body<br>
 * @param {string} responseBody  response body<br>
 * @returns {object} return the formulated responseBody<br>
 */
exports.recordServiceRequest = function (xCorrelator, traceIndicator, userName, originator,
    operationName, responseCode, requestBody, responseBody) {
    return new Promise(async function (resolve, reject) {
        try {
            let operationClientUuid = await getOperationClientToLogServiceRequest();
            let serviceName = await operationClientInterface.getOperationNameAsync(operationClientUuid);
            let ipAddressAndPort = await operationClientInterface.getTcpIpAddressAndPortAsyncAsync(operationClientUuid);
            let operationKey = await operationClientInterface.getOperationKeyAsync(operationClientUuid);
            let timestamp = moment().format();
            let applicationName = await HttpServerInterface.getApplicationNameAsync();
            let applicationReleaseNumber = await HttpServerInterface.getReleaseNumberAsync();
            let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new requestHeader(userName, applicationName, "", "", "unknown", operationKey));
            let stringifiedRequestBody = JSON.stringify(requestBody);
            let stringifiedResponseBody = JSON.stringify(responseBody);
            let httpRequestBody = formulateResponseBody(xCorrelator, traceIndicator, userName, originator, applicationName, applicationReleaseNumber,
                operationName, responseCode, timestamp, stringifiedRequestBody, stringifiedResponseBody);
            let response = await requestBuilder.BuildAndTriggerRestRequest(ipAddressAndPort, serviceName, "POST", httpRequestHeader, httpRequestBody);
            if (response !== undefined && response.status === 200) {
                resolve(true);
            }
            resolve(false);
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

/**
 * This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application<br>
 * @param {string} xCorrelator correlation tag of the current execution<br>
 * @param {string} traceIndicator sequence number of the execution<br>
 * @param {string} userName name of the user who is accessed the service<br>
 * @param {string} originator originator of the request<br>
 * @param {string} applicationName name of the calling application<br>
 * @param {string} applicationReleaseNumber release number of the calling application<br>
 * @param {string} operationName name of the called service<br>
 * @param {string} responseCode response code of the rest call execution<br>
 * @param {string} timestamp timestamp of the execution<br>
 * @param {string} stringifiedBody stringified request body<br>
 * @param {string} stringifiedResponse stringified response body<br>
 * @returns {object} return the formulated responseBody<br>
 */
function formulateResponseBody(xCorrelator, traceIndicator, userName, originator, applicationName, applicationReleaseNumber,
    operationName, responseCode, timestamp, stringifiedBody, stringifiedResponse) {
    let httpRequestBody = {};
    try {
        httpRequestBody = {
            "x-correlator": xCorrelator,
            "trace-indicator": traceIndicator,
            "user": userName,
            "originator": originator,
            "application-name": applicationName,
            "application-release-number": applicationReleaseNumber,
            "operation-name": operationName,
            "response-code": responseCode,
            "timestamp": timestamp,
            "stringified-body": stringifiedBody,
            "stringified-response": stringifiedResponse
        };
        return httpRequestBody;
    } catch (error) {
        console.log(error);
        return httpRequestBody;
    }
}

/**
 * This function returns the operation client uuid of the service that needs to be called to log the service requests<br>
 * @returns {string} return the uuid of the operation client of the service that needs to be addressed to log the service request<br>
 * This method performs the following step,<br>
 * step 1: extract the forwarding-construct ServiceRequestCausesLoggingRequest<br>
 * step 2: get the output fc-port from the forwarding-construct<br>
 */
async function getOperationClientToLogServiceRequest() {
    return new Promise(async function (resolve, reject) {
        try {
            let operationClientUuid = undefined;
            let forwardingConstruct = await forwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                "ServiceRequestCausesLoggingRequest");
            if (forwardingConstruct) {
                let fcPortList = forwardingConstruct["fc-port"];
                for (let i = 0; i < fcPortList.length; i++) {
                    let fcPort = fcPortList[i];
                    let fcPortDirection = fcPort["port-direction"];
                    if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                        operationClientUuid = fcPort["logical-termination-point"];
                    }
                }
            }
            resolve(operationClientUuid);
        } catch (error) {
            reject(error);
        }
    });
}