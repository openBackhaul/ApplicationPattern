// @ts-check

/**
 * This class provides functionality to construct a rest request
 **/
const restClient = require('./Client');
const OperationClientInterface = require('../../onfModel/models/layerProtocols/OperationClientInterface');
const createHttpError = require('http-errors');
const Qs =  require('qs');

/**
 * This function trigger a rest request by calling the restClient class<br>
 * @param {string} operationClientUuid of service that needs to be addressed in the client application
 * @param {string} method http method for the REST request
 * @param {object} requestHeader http request header for the REST call
 * @param {object} requestBody request body for the REST call
 * @param {Object} params object of pathParams<Map> and queryParams<Object> 
 *                 (Example :  params = {"query" : {},"path" : new Map()})
 * @returns {Promise<Object>} returns the http response received
 */
exports.BuildAndTriggerRestRequest = async function (operationClientUuid, method, requestHeader, requestBody, params) {
    try {
        let queryParams;
        let pathParams;
        let operationName = await OperationClientInterface.getOperationNameAsync(operationClientUuid);
       if(params) {
        queryParams =  params.query;
        pathParams = params.path;
        if(pathParams) {
        pathParams.forEach((value, param) => {
         operationName = operationName.replace(param,value)
        });
       }
       }   
       if (operationName.indexOf("/") !== 0) {
            operationName = "/" + operationName
        }
        let clientConnectionInfo = await OperationClientInterface.getTcpClientConnectionInfoAsync(operationClientUuid);
        let url = clientConnectionInfo + operationName;
        let request = {
            params : queryParams,
            method: method,
            url: url,
            headers: requestHeader,
            data: requestBody,
            paramsSerializer: function (params) {
                return Qs.stringify(params, {arrayFormat: 'brackets'})
            }
        }
        let response = await restClient.post(request);
        console.log("\n callback : " + method + " " + url + " header :" + JSON.stringify(requestHeader) +
            "body :" + JSON.stringify(requestBody) + "response code:" + response.status)
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log(`Request errored with ${error}`);
            return new createHttpError.RequestTimeout();
        }
        console.log(`Unknown request error: ${error}`);
        return new createHttpError.InternalServerError();
    }
}