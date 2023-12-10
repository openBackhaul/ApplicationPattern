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

const OperationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
const HttpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const RequestHeader = require('../rest/client/RequestHeader');
const RequestBuilder = require('../rest/client/RequestBuilder');
const onfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');
const FcPort = require('../onfModel/models/FcPort');
const ForwardingDomain = require('../onfModel/models/ForwardingDomain');
const AuthorizingService = require('./AuthorizingService');
const moment = require('moment');

/**
 * This function recods the OAM request to the OAM lof application
 * @param {String} oamPath oam path that is accessed during the request
 * @param {Object} requestBody incase if it is a put request, then the request body of the request
 * @param {Number} responseCode response code of the rest call execution
 * @param {String} authorizationCode authorization code used to access the oam layer. This will then decoded to findout the username
 * @param {String} method HTTP method of the OAM layer call. It can be PUT,GET
 * @returns {Promise<Boolean>} returns true if the operation is successful
 * This method performs the following step,<br>
 * step 1: Get the operation client of the OAM log application that needs to be executed to log the OAM request <br>
 * 2. If user value is empty , then the value from originator will be copied<br>
 * 3. If xCorrelator is empty , then a new X-correlator string will be created by using the method xCorrelatorGenerator<br>
 * 4. If the customerJourney is empty , then the value "unknown value" will be added<br>
 * 5. If trace-indicator value is empty , then the value will be assigned to 1<br>
 */
exports.recordOamRequest = async function (oamPath, requestBody, responseCode, authorizationCode, method) {
    let httpRequestBody = {};
    try {
        let operationClientUuid = await getOperationClientToLogOamRequest();
        let operationKey = await OperationClientInterface.getOperationKeyAsync(operationClientUuid);
        let timestamp = moment().format();
        let applicationName = await HttpServerInterface.getApplicationNameAsync();
        let releaseNumber = await HttpServerInterface.getReleaseNumberAsync();
        let userName = AuthorizingService.decodeAuthorizationCodeAndExtractUserName(authorizationCode);
        let stringifiedBody = JSON.stringify(requestBody);
        let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new RequestHeader(userName, applicationName, "", "", "unknown", operationKey));
        httpRequestBody = formulateRequestBody(method, oamPath, stringifiedBody, responseCode, userName, timestamp, applicationName, releaseNumber);
        let response = await RequestBuilder.BuildAndTriggerRestRequest(operationClientUuid, "POST", httpRequestHeader, httpRequestBody);
        let responseCodeValue = response.status.toString();
        if (responseCodeValue.startsWith("2")) {
            return true;
        }
        console.log(`recordOamRequest - record OAM request with body ${JSON.stringify(httpRequestBody)} failed with response status: ${response.status}`);
        return false;
    } catch (error) {
        console.log(`recordOamRequest - record OAM request with body ${JSON.stringify(httpRequestBody)} failed with error: ${error.message}`);
        return false;
    }
}

/**
 * This function formulates the request body with the required attributes that needs to be sent to the OAMLog application
 * @param {String} method HTTP method of the OAM layer call. It can be PUT,GET
 * @param {String} oamPath oam path that is accessed during the request
 * @param {String} stringifiedBody incase if it is a put request, then the request body of the request
 * @param {Number} responseCode response code of the rest call execution
 * @param {String} userName name of the user who accessed the OAM layer
 * @param {String} timestamp timestamp of the execution
 * @param {String} applicationName name of the application
 * @param {String} releaseNumber release number of the application
 * @returns {Object} return the formulated requestBody
 */
function formulateRequestBody(method, oamPath, stringifiedBody, responseCode, userName, timestamp, applicationName, releaseNumber) {
    return {
        "application-name": applicationName,
        "release-number": releaseNumber,
        "method": method,
        "resource": oamPath,
        "stringified-body": stringifiedBody,
        "response-code": responseCode,
        "user-name": userName,
        "timestamp": timestamp
    };
}

async function getOperationClientToLogOamRequest() {
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        "OamRequestCausesLoggingRequest");
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

