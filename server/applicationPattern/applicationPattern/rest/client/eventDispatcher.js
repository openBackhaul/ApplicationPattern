/**
 * @file This module provides funtionality to trigger and dispatch rest request from this application to other applications  
 * This class consolidates the technology specific extensions.
 **/

'use strict';

const RequestHeader = require('./RequestHeader');
const OnfAttributeFormatter = require("../../onfModel/utility/OnfAttributeFormatter");
const RestRequestBuilder = require('./RequestBuilder');
const httpServerInterface = require('../../onfModel/models/layerProtocols/HttpServerInterface');

/**
 * This funtion formulates the request body based on the operation name and application 
 * @param {string} serviceType provides "basic" if the service comes from the basicservice layer or else "individual"
 * @param {String} remoteIpAndPort ip address,port of the client application in the format <ipaddress>:<port>.
 * @param {String} clientApplicationName name of the client application to which we are going to sent the request.
 * @param {String} operationName name of the client operation that needs to be addressed. 
 * @param {String} operationKey operation key to access the service in the client application. 
 * @param {String} attributeList list of attributes that needs to be included in the request body based on the operation name. 
 * @param {String} user username of the request initiator. 
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses. 
 * @param {String} traceIndicator Sequence number of the request. 
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies.
 */
exports.dispatchEvent = function (remoteIpAndPort, operationName, operationKey,
    httpRequestBody, user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        let result = false;
        try {
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
            let responseCode = response.status.toString();
            if (response !== undefined && responseCode.startsWith("2")) {
                result = true;
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
