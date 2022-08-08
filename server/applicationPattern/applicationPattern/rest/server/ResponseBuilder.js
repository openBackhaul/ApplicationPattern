/**
 * @file This module provides funtionality to build the response
 **/

'use strict';
const OnfAttributeFormatter = require("../../onfModel/utility/OnfAttributeFormatter");

exports.buildResponse = function (response, responseCode, responseBody, responseHeader) {  
  if (responseCode == undefined 
    || responseCode.length == 0 
    || responseCode == 500) {
    responseCode = 500;
    responseBody = {
      "message": "Internal server error"
    }
  } else if (responseCode == 401) {
    responseBody = {
      "message": "Unauthorized Access"
    }
  }
  if (responseHeader != undefined) {
    const stringifiedResponseHeader = OnfAttributeFormatter.
    modifyJsonObjectKeysToKebabCase(responseHeader);
    response.set(stringifiedResponseHeader);
  }
  response.status(responseCode).json(responseBody);
}