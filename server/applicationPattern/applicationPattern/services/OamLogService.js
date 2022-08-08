// @ts-check
'use strict';

/**
 * <p>This class provides functionality to log the OAM request to the OAM Log application in the framework.
 * A rest call will be initiated from this application to the OAM Log application to report the transaction happend in the OAM layer.</p>  
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       05.09.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG
 * @module OAMLog
 **/

const operationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
const HttpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const requestHeader = require('../rest/client/RequestHeader');
const requestBuilder = require('../rest/client/RequestBuilder');
const onfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');
const FcPort = require('../onfModel/models/FcPort');
const forwardingDomain = require('../onfModel/models/ForwardingDomain');
const moment = require('moment');

/**
 * This function recods the OAM request to the OAM lof application<br>
 * @param {string} oamPath oam path that is accessed during the request<br>
 * @param {object} requestBody incase if it is a put request, then the request body of the request<br>
 * @param {number} responseCode response code of the rest call execution<br>
 * @param {string} authorizationCode authorization code used to access the oam layer. This will then decoded to findout the username<br>
 * @param {string} method HTTP method of the OAM layer call. It can be PUT,GET<br>
 * @returns {Promise<boolean>} returns true if the operation is successful. Promise is never rejected.<br>
 * This method performs the following step,<br>
 * step 1: Get the operation client of the OAM log application that needs to be executed to log the OAM request <br>
 * 2. If user value is empty , then the value from originator will be copied<br>
 * 3. If xCorrelator is empty , then a new X-correlator string will be created by using the method xCorrelatorGenerator<br>
 * 4. If the customerJourney is empty , then the value "unknown value" will be added<br>
 * 5. If trace-indicator value is empty , then the value will be assigned to 1<br>
 */
exports.recordOamRequest = function (oamPath, requestBody, responseCode, authorizationCode, method) {
    return new Promise(async function (resolve, reject) {
        let httpRequestBody = {};
        try {
            let operationClientUuid = await getOperationClientToLogOamRequest();
            let serviceName = await operationClientInterface.getOperationNameAsync(operationClientUuid);
            let ipAddressAndPort = await operationClientInterface.getTcpIpAddressAndPortAsyncAsync(operationClientUuid);
            let operationKey = await operationClientInterface.getOperationKeyAsync(operationClientUuid);
            let timestamp = moment().format();
            let applicationName = await HttpServerInterface.getApplicationNameAsync();
            let releaseNumber = await HttpServerInterface.getReleaseNumberAsync();
            let userName = decodeAuthorizationCodeAndExtractUserName(authorizationCode);
            let stringifiedBody = JSON.stringify(requestBody);
            let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new requestHeader(userName, applicationName, "", "", "unknown", operationKey));
            httpRequestBody = formulateResponseBody(method, oamPath, stringifiedBody, responseCode, userName, timestamp, applicationName, releaseNumber);
            let response = await requestBuilder.BuildAndTriggerRestRequest(ipAddressAndPort, serviceName, "POST", httpRequestHeader, httpRequestBody);
            if (response !== undefined && response.status === 200) {
                resolve(true);
            }
            console.log(`recordOamRequest - record OAM request with body ${JSON.stringify(httpRequestBody)} failed with response status: ${response.status}`);
            resolve(false);
        } catch (error) {
            console.log(`recordOamRequest - record OAM request with body ${JSON.stringify(httpRequestBody)} failed with error: ${error.message}`);
            resolve(false);
        }
    });
}

/**
 * This function formulates the response body with the required attributes that needs to be sent to the OAMLog application<br>
 * @param {string} method HTTP method of the OAM layer call. It can be PUT,GET<br>
 * @param {string} oamPath oam path that is accessed during the request<br>
 * @param {string} stringifiedBody incase if it is a put request, then the request body of the request<br>
 * @param {number} responseCode response code of the rest call execution<br>
 * @param {string} userName name of the user who accessed the OAM layer<br>
 * @param {string} timeStamp timestamp of the execution<br>
 * @returns {object} return the formulated responseBody<br>
 */
function formulateResponseBody(method, oamPath, stringifiedBody, responseCode, userName, timeStamp, applicationName, releaseNumber) {
    let httpRequestBody = {};
    try {
        httpRequestBody = {
            "application-name": applicationName,
            "release-number": releaseNumber,
            "method": method,
            "resource": oamPath,
            "stringified-body": stringifiedBody,
            "response-code": responseCode,
            "user-name": userName,
            "timestamp": timeStamp
        };
        return httpRequestBody;
    } catch (error) {
        console.log(error);
        return httpRequestBody;
    }
}


async function getOperationClientToLogOamRequest() {
    return new Promise(async function (resolve, reject) {
        try {
            let operationClientUuid = undefined;
            let forwardingConstruct = await forwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                "OamRequestCausesLoggingRequest");
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

/**
 * @description To decode base64 authorization code from authorization header<br> 
 * @param {string} authorizationCode base64 encoded authorization code<br>
 * @returns {string} returns user name based on the decoded authorization code
 * <b><u>Procedure :</u></b><br>
 * <b>step 1 :</b> Get the authorization code from the header<br>
 * <b>step 2 :</b> split the authorization code with delimiter "space" to ignore the prefix "basic" from the authorization code<br>
 * <b>step 3 :</b> decode the encoded string (which will result in the format username:password)<br>
 * <b>step 3 :</b> split the text with delimiter ":" to get the username<br>
 **/
function decodeAuthorizationCodeAndExtractUserName(authorizationCode) {
    if (authorizationCode == undefined) {
        return "";
    }
    try {
        let base64EncodedString = authorizationCode.split(" ")[1];
        let base64BufferObject = Buffer.from(base64EncodedString, "base64");
        let base64DecodedString = base64BufferObject.toString("utf8");
        let userName = base64DecodedString.split(":")[0];
        console.log("Authorization code : " + authorizationCode);
        console.log("decoded user name: " + userName);
        return userName;
    } catch (error) {
        console.log(error);
        return "";
    }
}