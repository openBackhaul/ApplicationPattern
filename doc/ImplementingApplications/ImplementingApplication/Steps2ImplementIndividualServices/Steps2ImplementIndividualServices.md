## Implement OAM services

The services specific to the applications use-cases should be modelled based on the requirement specified in the Open API Specification.

### controller 
The following changes required in the controller/IndividualServices.js. 
All methods in this file require this changes. 

#### Response Formulation :
* Import the ResponseBuilder, ResponseCode, ResponseHeader from `onf-core-model-ap/applicationPattern/rest/server` module,
  ```
  var responseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
  var responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
  var restResponseHeader = require('onf-core-model-ap/applicationPattern/rest/server/ResponseHeader');
  ```
* After processing a request , response code should be decided based on the execution result. Appropriate response code should be taken from the 'responseCodeEnum.code' enum. For example , for a successful request , 
  ```
  let responseCode = responseCodeEnum.code.OK;
  ```
* To calculate the exec-time response header , the following line needs to be included in all the methods , 
  ```
  let startTime = process.hrtime();
  ```
* To formulate the response header , include the following line before building the response, 
  ```
  let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  ```
  A formulated response header will consists of the xCorrelator sent in the request , exec-time and the lifecycle-state of the request url.
* To build the final response that needs to be fed to the client , the following line needs to be added , 
  ```
  responseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  ```
  where, res is the response object stub which you can see in the argument of the function. responseCode and responseBody referes to the http response code and the body of the response respectively.  

#### Logging :

* All Individual services shall be logged to the EATL application , please refer the [Steps to integrate logging application](./Steps2IntegrateLoggingApplication/Steps2IntegrateLoggingApplication.md)  for details.

#### Processing Request
* In the controller/ folder, in the IndividualServices.js , in each method , there will be call to a function in the service/individualServicesService.js. To this function the request url should be passed. This request url will have the complete path of the resource to be accessed.
  ```
  req.url
  ```
#### Reference 
Please refer the [file](https://github.com/openBackhaul/RegistryOffice/blob/develop/server/controllers/IndividualServices.js) to get a view.

### services
* In the services/ folder , in the service/individualServicesService.js , in each method , include an additional argument to receive the request url ,
  ```
  requestUrl
  ```
* Further , as per the specification needs to model the logic.

#### Reference 
Please refer the [file](https://github.com/openBackhaul/RegistryOffice/blob/develop/server/service/HttpClientService.js) to get a view.
