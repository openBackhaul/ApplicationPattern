// @ts-check
'use strict';

const operationServerInterface = require('../onfModel/models/layerProtocols/OperationServerInterface');
const authorizingService = require('../services/AuthorizingService');
const oamLogService = require('../services/OamLogService');
const executionAndTraceService = require('../services/ExecutionAndTraceService');

/**
 * Options for express-openapi-validator middleware
 */
const openApiValidatorOptions = {
    validateRequests: true,
    validateResponses: true,
    validateSecurity: {
        handlers: {
            apiKeyAuth: validateOperationKey,
            basicAuth: validateBasicAuth
        }
    }
}

/**
 * Setup an express application with settings common for all applications.
 * @param {object} app express Application
 */
function setupExpressApp(app) {
    // format all json responses written via res.json()
    app.set('json spaces', 2);
    // remove last middleware, which is errorHandler initialized in oas3Tools ExpressAppConfig constructor
    app._router.stack.pop();
    // add custom error handler which logs bad requests
    app.use(loggingErrorHandler);
}

/**
 * Function compares "operation-key" from request header to operation-key from load file.
 * The function is meant as a handler for validateSecurity option from express-openapi-validator.
 * @param {object} request express request
 * @param {string[]} scopes security scopes
 * @param {object} schema SecuritySchemeObject
 * @returns {Promise<boolean>} Promise is true when operation keys are equal.
 */
async function validateOperationKey(request, scopes, schema) {
    const operationUuid = await operationServerInterface.getOperationServerUuidAsync(request.url);
    const operationKeyFromLoadfile = await operationServerInterface.getOperationKeyAsync(operationUuid);
    const isAuthorized = operationKeyFromLoadfile === request.headers['operation-key'];
    return isAuthorized;
}

/**
 * Function asks AdministratorAdministration application to validate "authorization" header from a request.
 * The function is meant as a handler for validateSecurity option from express-openapi-validator.
 * @param {object} request express request
 * @param {string[]} scopes security scopes
 * @param {object} schema SecuritySchemeObject
 * @returns {Promise<boolean>} Promise is true when operation keys are equal.
 */
async function validateBasicAuth(request, scopes, schema) {
    const isAuthorized = await authorizingService.isAuthorized(request.headers.authorization, request.method);
    return isAuthorized;
}

/**
 * Express error handler function which records request/response to ExecutionAndTraceLog or OamLog application.
 * It is used as last middleware in express application.
 * @param {object} err express error
 * @param {object} req express request
 * @param {object} res express response
 * @param {function} next express next middleware function
 */
function loggingErrorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const errorBody = {
        message: err.message,
        errors: err.errors,
    }
    if (statusCode >= 400 && statusCode < 500) { // record client errors
        if (req.url.startsWith('/core-model')) { // record request for OAM resource
            oamLogService.recordOamRequest(req.url, req.body, statusCode, req.headers.authorization, req.method);
        } else { // record request for service resource
            const xCorrelator = req.headers['x-correlator'];
            const traceIndicator = req.headers['trace-indicator'];
            const user = req.headers.user;
            const originator = req.headers.originator;
            executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, statusCode, req.body, errorBody);
        }
    }
    console.log(`loggingErrorHandler - caught error, returning response with status code "${statusCode}" and body ${JSON.stringify(errorBody)}`);
    res.status(statusCode).json(errorBody);
}

module.exports = {
    openApiValidatorOptions,
    setupExpressApp,
    validateOperationKey,
    validateBasicAuth,
    loggingErrorHandler
};