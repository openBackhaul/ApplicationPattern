// @ts-check
'use strict';

const operationServerInterface = require('../onfModel/models/layerProtocols/OperationServerInterface');
const authorizingService = require('../services/AuthorizingService');
const oamLogService = require('../services/OamLogService');
const executionAndTraceService = require('../services/ExecutionAndTraceService');

const httpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('../onfModel/models/layerProtocols/TcpServerInterface');
const ForwardingDomain = require('../onfModel/models/ForwardingDomain');
const FcPort = require('../onfModel/models/FcPort');
const OnfAttributeFormatter = require('../onfModel/utility/OnfAttributeFormatter');
const onfAttributes = require('../onfModel/constants/OnfAttributes');
const restClient = require('../rest/client/Client');
const RequestHeader = require('../rest/client/RequestHeader');

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
// eslint-disable-next-line no-unused-vars
async function validateOperationKey(request, scopes, schema) {
    let pathDefinedInOpenApi = request.openapi.openApiRoute;
    const operationUuid = await operationServerInterface.getOperationServerUuidAsync(pathDefinedInOpenApi);
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
 * @returns {Promise} Promise is true when authentication is successful. If not , then a JSON object with the status code will be sent.
 */
// eslint-disable-next-line no-unused-vars
async function validateBasicAuth(request, scopes, schema) {
    const authStatus = await authorizingService.isAuthorized(request.headers.authorization, request.method);
    if (authStatus.isAuthorized == true) {
        return true;
    } else {
        throw authStatus;
    }
}

/**
 * Express error handler function which records request/response to ExecutionAndTraceLog or OamLog application.
 * It is used as last middleware in express application.
 * @param {object} err express error
 * @param {object} req express request
 * @param {object} res express response
 * @param {function} next express next middleware function
 */
// eslint-disable-next-line no-unused-vars
function loggingErrorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const errorBody = {
        code : statusCode,
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

/**
 * Function to initiates application registration
 * Register-yourself basic service will be triggered to the own application with no requestbody.
 * 
 */
async function performApplicationRegistration() {
    let registrationOperationServerUuid = await getRegisterYourselfOperationServerUuid();
    if (registrationOperationServerUuid) {
        formulateAndSendRequest(registrationOperationServerUuid);
    }
}

/**
 * Function to get the operation-server uuid of the register-yourself API
 */
async function getRegisterYourselfOperationServerUuid() {
    let registerYourselfOperationServerUuid;
    try {
        let registeringCausesRegistrationRequestFCName = "PromptForRegisteringCausesRegistrationRequest";
        let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(registeringCausesRegistrationRequestFCName);
        let fcPortInputDirectionLogicalTerminationPointList = [];
        let fcPortList = forwardingConstructInstance[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        for (const fcPort of fcPortList) {
            const portDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
            if (FcPort.portDirectionEnum.INPUT === portDirection) {
                fcPortInputDirectionLogicalTerminationPointList.push(fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]);
            }
        }
        registerYourselfOperationServerUuid = fcPortInputDirectionLogicalTerminationPointList.length >= 1 ? fcPortInputDirectionLogicalTerminationPointList[0] : undefined;
    } catch (error) {
        console.log(error);
    }
    return registerYourselfOperationServerUuid;
}

/**
 * Function to formulate and initiate REST Request
 * @param {string} registrationOperationServerUuid operation-server uuid of the register-yourself service
 */
async function formulateAndSendRequest(registrationOperationServerUuid) {
    try {
        let operationName = await operationServerInterface.getOperationNameAsync(registrationOperationServerUuid);
        let operationKey = await operationServerInterface.getOperationKeyAsync(registrationOperationServerUuid);
        let originator = await httpServerInterface.getApplicationNameAsync()
        let httpRequestHeader = new RequestHeader(
            undefined,
            originator,
            undefined,
            undefined,
            undefined,
            operationKey
        );
        httpRequestHeader = OnfAttributeFormatter.modifyJsonObjectKeysToKebabCase(httpRequestHeader);
        let tcpServerProtocol = await tcpServerInterface.getLocalProtocol();
        let tcpServerIpV4Address = (await tcpServerInterface.getLocalAddress())[onfAttributes.TCP_SERVER.IPV_4_ADDRESS];
        let tcpServerPort = await tcpServerInterface.getLocalPort();
        let registerYourselfUrl = tcpServerProtocol +
            "://" +
            tcpServerIpV4Address +
            ":" +
            tcpServerPort +
            operationName;
        let request = {
            method: "POST",
            url: registerYourselfUrl,
            headers: httpRequestHeader
        }
        let result = await restClient.post(request);
        console.log("Initiated application registration to " + registerYourselfUrl + " expected 204 is " + result.status);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    openApiValidatorOptions,
    setupExpressApp,
    validateOperationKey,
    validateBasicAuth,
    loggingErrorHandler,
    performApplicationRegistration
};