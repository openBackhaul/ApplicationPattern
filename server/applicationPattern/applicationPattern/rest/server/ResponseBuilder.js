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
  if (typeof responseBody === 'object') {
    responseBody = JSON.stringify(
      responseBody, 
      null, 
      2);
  }
  let stringifiedResponseHeader = {
    'Content-Type': 'application/json'
  };
  if (responseHeader != undefined) {
    stringifiedResponseHeader = OnfAttributeFormatter.
    modifyJsonObjectKeysToKebabCase(responseHeader);
  }
  Object.keys(stringifiedResponseHeader).forEach(key => {
    response.setHeader(
      key, 
      stringifiedResponseHeader[key]
      );
  });
  response.writeHead(responseCode);
  response.end(responseBody);
}