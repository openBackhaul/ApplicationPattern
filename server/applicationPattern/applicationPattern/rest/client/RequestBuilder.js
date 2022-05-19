/**
 * This class provides functionality to construct a rest request
 **/

const restClient = require('./Client');
const protocol = "http";

/**
 * This function trigger a rest request by calling the restClient class<br>
 * @param {string} remoteIpAddressAndPort ip address,port of the client application in the format <ipaddress>:<port>.
 * @param {string} operationName service that needs to be addressed in the client application 
 * @param {string} method http method for the REST request
 * @param {string} requestHeader http request header for the REST call
 * @param {string} requestBody request body for the REST call
 * @returns {promise} returns the http response received
 */
exports.BuildAndTriggerRestRequest = function (remoteIpAddressAndPort ,operationName, method,  requestHeader, requestBody) {
    return new Promise(async function (resolve, reject) {
        try {
            let url = protocol + "://" + remoteIpAddressAndPort + operationName;
            let request = {
            method: method,
            url: url ,
            headers: requestHeader,
            data: requestBody
            }
            let response = await restClient.post(request);
            console.log("\n callback : " + method + " " + url + " header :" + JSON.stringify(requestHeader) + 
            "body :" + JSON.stringify(requestBody) + "response code:" + response.status)
            resolve(response);
        } catch (error) {
            console.log(error);
            resolve({"status" : 500});
        }
    });
}
