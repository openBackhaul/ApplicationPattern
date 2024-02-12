# Application Pattern Documentation - COMMONS 

### Outline
The description outline is as follows:

* [AppsCommon.js](#appscommonjs)

### AppsCommon.js

This file contains some generic functions that could be commonly used for all applications. 

*Method Summary*:

|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**openApiValidatorOptions** <br>This is a _constant_ variable contains Options for express-openapi-validator middleware.|**validateRequests** true if the incoming request shall be schematically validated.<br> **validateResponses** true if the responses shall be schematically validated. **validateSecurity** This function contains following handlers for validating security. <br> 1. **apiKeyAuth**: this validates operationkey when the service is defined with apiKeyAuth in specification <br> 2. **basicAuth**: this validates the authorization code with external authorizing application when a service is defined with basicAuth in specification.| |
|**setupExpressApp** <br> Setup an express application with settings common for all applications.| {object} **app** express Application | |
|**validateOperationKey** <br> Function compares "operation-key" from request header to operation-key from load file.The function is meant as a handler for validateSecurity option from express-openapi-validator.|{object} **request** express request <br> {string[]} **scopes** security scopes <br> {object} **schema** SecuritySchemeObject | {Promise<boolean>} Promise is true when operation keys are equal.|
|**validateBasicAuth** <br> Function asks AdministratorAdministration application to validate "authorization" header from a request. The function is meant as a handler for validateSecurity option from express-openapi-validator.|{object} **request** express request <br> {string[]} **scopes** security scopes <br> {object} **schema** SecuritySchemeObject | {Promise<boolean>} Promise Promise is true when authentication is successful. If not , then a JSON object with the status code will be sent.|
|**loggingErrorHandler** <br> Express error handler function which records request/response to ExecutionAndTraceLog or OamLog application. It is used as last middleware in express application.| {object} **err** express error <br> {object} **req** express request <br> {object} **res** express response <br> {function} **next** express next middleware function. |
|**performApplicationRegistration** <br> Function to initiates application registration. Register-yourself basic service will be triggered to the own application with no requestbody. | | |
|**getRegisterYourselfOperationServerUuid** <br> Function to get the operation-server uuid of the register-yourself API | | |
|**formulateAndSendRequest** <br> Function to formulate and initiate REST Request | {string} **registrationOperationServerUuid** operation-server uuid of the register-yourself service | |



[Up to Implementing Applications](../../ImplementingApplications.md)
