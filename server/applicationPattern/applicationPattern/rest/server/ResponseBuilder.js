/**
 * @file This module provides funtionality to build the response
 **/

'use strict';
const createHttpError = require("http-errors");
const OnfAttributeFormatter = require("../../onfModel/utility/OnfAttributeFormatter");

/**
 * when a response header is given -1, it means it is not valid.
 * The corresponding header will be removed.
 **/
exports.buildResponse = function (response, responseCode, responseBody, responseHeader) {
  if (createHttpError.isHttpError(responseBody)) {
    responseCode = responseBody.statusCode;
    responseBody = {
      code: responseCode,
      message: responseBody.message,
    }
  } else if (responseCode == undefined || responseCode == 500) {
    responseCode = 500;
    responseBody = {
      code: responseCode,
      message: createHttpError.InternalServerError().message
    }
  }
  let headers = undefined;
  if (responseHeader != undefined) {
    Object.keys(responseHeader).forEach((header) => {
      if (responseHeader[header] == -1) {
        delete responseHeader[header];
      }
    })
    headers = OnfAttributeFormatter.modifyJsonObjectKeysToKebabCase(responseHeader);
    response.set(headers);
  }
  response.status(responseCode).json(responseBody);
  return {
    code: responseCode,
    headers: headers,
    body: responseBody,
  }
}
