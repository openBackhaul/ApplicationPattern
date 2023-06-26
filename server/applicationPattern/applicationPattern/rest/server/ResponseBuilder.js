/**
 * @file This module provides funtionality to build the response
 **/

'use strict';
const createHttpError = require("http-errors");
const OnfAttributeFormatter = require("../../onfModel/utility/OnfAttributeFormatter");

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
