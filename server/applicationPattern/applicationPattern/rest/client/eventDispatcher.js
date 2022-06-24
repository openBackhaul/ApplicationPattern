// @ts-check

/**
 * @file This module provides funtionality to trigger and dispatch rest request from this application to other applications  
 * This class consolidates the technology specific extensions.
 **/

'use strict';

const RequestHeader = require('./RequestHeader');
const OnfAttributeFormatter = require("../../onfModel/utility/OnfAttributeFormatter");
const RestRequestBuilder = require('./RequestBuilder');
const httpServerInterface = require('../../onfModel/models/layerProtocols/HttpServerInterface');
const { recordServiceRequestFromClient } = require('../../services/ExecutionAndTraceService');
const OperationClientInterface = require('../../onfModel/models/layerProtocols/OperationClientInterface');
const HttpClientInterface = require('../../onfModel/models/layerProtocols/HttpClientInterface');
const LogicalTerminationPoint = require('../../onfModel/models/LogicalTerminationPoint');

/**
 * This funtion formulates the request body based on the operation name and application 
 * @param {String} operationClientUuid uuid of the client operation that needs to be addressed
 * @param {object} httpRequestBody request body for the operation
 * @param {String} user username of the request initiator. 
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses. 
 * @param {String} traceIndicator Sequence number of the request. 
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies.
 */
exports.dispatchEvent = function (operationClientUuid, httpRequestBody, user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        let result = false;
        try {
            let operationKey = await OperationClientInterface.getOperationKeyAsync(
                operationClientUuid);
            let operationName = await OperationClientInterface.getOperationNameAsync(
                operationClientUuid);
            let remoteIpAndPort = await OperationClientInterface.getTcpIpAddressAndPortAsyncAsync(
                operationClientUuid);
            let originator = await httpServerInterface.getApplicationNameAsync();
            let httpRequestHeader = new RequestHeader(
                user, 
                originator,
                xCorrelator, 
                traceIndicator, 
                customerJourney, 
                operationKey
                );
            httpRequestHeader = OnfAttributeFormatter.modifyJsonObjectKeysToKebabCase(httpRequestHeader);
            let response = await RestRequestBuilder.BuildAndTriggerRestRequest(
                remoteIpAndPort, 
                operationName, 
                "POST", 
                httpRequestHeader, 
                httpRequestBody
                );
            let responseCode = response.status;
            if (responseCode.toString().startsWith("2")) {
                result = true;
            } else if (responseCode.toString().startsWith("5")) {
                let httpClientUuid = await LogicalTerminationPoint.getServerLtpListAsync(operationClientUuid);
                let serverApplicationName = await HttpClientInterface.getApplicationNameAsync(httpClientUuid);
                let serverApplicationReleaseNumber = await HttpClientInterface.getReleaseNumberAsync(httpClientUuid);
                recordServiceRequestFromClient(serverApplicationName, serverApplicationReleaseNumber, xCorrelator, traceIndicator, user, originator, operationName, responseCode, httpRequestBody, response.data)
                    .catch((error) => console.log(`record service request ${JSON.stringify({
                        xCorrelator,
                        traceIndicator,
                        user,
                        originator,
                        serverApplicationName,
                        serverApplicationReleaseNumber,
                        operationName,
                        responseCode,
                        reqBody: httpRequestBody,
                        resBody: response.data
                    })} failed with error: ${error.message}`));
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
