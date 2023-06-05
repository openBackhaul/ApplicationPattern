 // @ts-check
 'use strict';
 const requestHeader = require('../rest/client/RequestHeader');
 const restRequestBuilder = require('../rest/client/RequestBuilder');
 
 const onfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');

 const operationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
 const httpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
 const forwardingDomain = require('../onfModel/models/ForwardingDomain');
 const FcPort = require('../onfModel/models/FcPort');
 
 /**
  * This function authorizes the user credentials<br>
  * @param {string} authorizationCode authorization code received from the header<br>
  * @param {string} method is the https method name<br>
  * @returns {Promise} authStatus return the authorization result<br>
  */
 exports.isAuthorized = function (authorizationCode, method) {
     return new Promise(async function (resolve, reject) {
        let authStatus = {
            "isAuthorized" : false,
            "status" : 403
        }
        try {
             let operationClientUuid = await getOperationClientToAuthenticateTheRequest();
             let operationKey = await operationClientInterface.getOperationKeyAsync(operationClientUuid);
             let userName = decodeAuthorizationCodeAndExtractUserName(authorizationCode);
             let applicationName = await httpServerInterface.getApplicationNameAsync();
             let applicationReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
             let httpRequestHeader = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(new requestHeader(userName, applicationName, "", "", "unknown", operationKey));
             let httpRequestBody = formulateResponseBody(applicationName, applicationReleaseNumber, authorizationCode, method)
             let response = await restRequestBuilder.BuildAndTriggerRestRequest(operationClientUuid, "POST", httpRequestHeader, httpRequestBody);
             if (response !== undefined && response.status === 200) {
                 let responseBody = response.data;
                 if (responseBody["oam-request-is-approved"] == true) {
                    authStatus.isAuthorized = true;
                 }else{
                    if(responseBody["reason-of-objection"] == 'METHOD_NOT_ALLOWED'){
                    authStatus.status = 403;
                    }
                 }
             }
             resolve(authStatus);
         } catch (error) {
             console.log(error);
             resolve(authStatus);
         }
     });
 }
 
 /**
  * This function formulates the response body with the required attributes that needs to be sent to the Administrator Administration application<br>
  * @param {string} applicationName name of the application<br>
  * @param {string} releaseNumber release number of the application<br>
  * @param {string} authorizationCode authorization code to access the OAM layer<br>
  * @param {string} method HTTP method of the OAM layer call. It can be PUT,GET<br>
  * @returns {object} return the formulated responseBody<br>
  */
 function formulateResponseBody(applicationName, releaseNumber, authorizationCode, method) {
     let httpRequestBody = {};
     try {
         httpRequestBody = {
             "application-name": applicationName,
             "release-number": releaseNumber,
             "Authorization": authorizationCode,
             "method": method
         };
         return httpRequestBody;
     } catch (error) {
         return httpRequestBody;
     }
 }
 
 /**
  * This function returns the operation client uuid of the service that needs to be called to authenticate the OAM requests<br>
  * @returns {Promise<string>} return the uuid of the operation client of the service that needs to be addressed to authenticate the OAM request<br>
  * This method performs the following step,<br>
  * step 1: extract the forwarding-construct OamRequestCausesInquiryForAuthentication<br>
  * step 2: get the output fc-port from the forwarding-construct<br>
  */
 async function getOperationClientToAuthenticateTheRequest() {
     return new Promise(async function (resolve, reject) {
         try {
             let operationClientUuid = undefined;
             let forwardingConstruct = await forwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                 "OamRequestCausesInquiryForAuthentication");
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
  **/
 function decodeAuthorizationCodeAndExtractUserName(authorizationCode) {
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
 