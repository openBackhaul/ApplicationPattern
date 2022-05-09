/**
 * This module provides functionality to interact with other rest servers
 **/

const axios = require('axios');
/**
 * This function initiates a post method for the provided request object
 * @param {object} request : http request object
 * @returns {promise} object response
 */
exports.post = async function (request) {
    return new Promise(async function (resolve, reject) {
        try {
            let response = await axios(request);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}