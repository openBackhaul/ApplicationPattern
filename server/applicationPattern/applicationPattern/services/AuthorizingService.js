// @ts-check
'use strict';
const RequestHeader = require('../rest/client/RequestHeader');
const RequestBuilder = require('../rest/client/RequestBuilder');

const onfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');

const OperationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
const HttpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const ForwardingDomain = require('../onfModel/models/ForwardingDomain');
const FcPort = require('../onfModel/models/FcPort');

/**
 * This function authorizes the user credentials
 * @param {String} authorizationCode authorization code received from the header
 * @param {String} method is the https method name
 * @returns {Promise<Object>} authStatus
 */
exports.isAuthorized = async function (authorizationCode, method) {
    let authStatus = {
        "isAuthorized": false
    }
    let operationClientUuid = await getOperationClientToAuthenticateTheRequest();
    let operationKey = await OperationClientInterface.getOperationKeyAsync(operationClientUuid);
    let userName = exports.decodeAuthorizationCodeAndExtractUserName(authorizationCode);
    let applicationName = await HttpServerInterface.getApplicationNameAsync();
    let applicationReleaseNumber = await HttpServerInterface.getReleaseNumberAsync();
    let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new RequestHeader(userName, applicationName, "", "", "unknown", operationKey));
    let httpRequestBody = formulateRequestBody(applicationName, applicationReleaseNumber, authorizationCode, method);
    let response = await RequestBuilder.BuildAndTriggerRestRequest(operationClientUuid, "POST", httpRequestHeader, httpRequestBody);
    if (response && response.status === 200) {
        if (response.data["oam-request-is-approved"] == true) {
            authStatus.isAuthorized = true;
        } else if (response.data["reason-of-objection"] == 'METHOD_NOT_ALLOWED') {
            authStatus.status = 403;
        }
    } else if (response && response.status === 408) {
        authStatus.status = 408;
        authStatus.message = "Application that authenticates the OAM request is down." +
            "Therefore, authentication is not verified. Please try again later.";
    }
    return authStatus;
}

 /**
  * This function formulates the request body with the required attributes that needs to be sent to the Administrator Administration application
  * @param {String} applicationName name of the application
  * @param {String} releaseNumber release number of the application
  * @param {String} authorizationCode authorization code to access the OAM layer
  * @param {String} method HTTP method of the OAM layer call. It can be PUT,GET
  * @returns {Object} formulated requestBody
  */
 function formulateRequestBody(applicationName, releaseNumber, authorizationCode, method) {
    return {
        "application-name": applicationName,
        "release-number": releaseNumber,
        "Authorization": authorizationCode,
        "method": method
    };
}

async function getOperationClientToAuthenticateTheRequest() {
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        "OamRequestCausesInquiryForAuthentication");
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

/**
 * @description To decode base64 authorization code from authorization header
 * @param {String} authorizationCode base64 encoded authorization code
 * @returns {String|undefined} user name based on the decoded authorization code
 **/
exports.decodeAuthorizationCodeAndExtractUserName = function (authorizationCode) {
    try {
        let base64EncodedString = authorizationCode.split(" ")[1];
        let base64BufferObject = Buffer.from(base64EncodedString, "base64");
        let base64DecodedString = base64BufferObject.toString("utf8");
        let userName = base64DecodedString.split(":")[0];
        console.log(`decoded user name: ${userName}`);
        return userName;
    } catch (error) {
        console.error(`Could not decode authorization code "${authorizationCode}". Got ${error}.`);
        return undefined;
    }
}
