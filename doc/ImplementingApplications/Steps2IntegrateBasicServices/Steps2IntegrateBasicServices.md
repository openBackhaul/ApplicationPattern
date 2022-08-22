## Integrate Basic services

### controller 
The following changes required in the controller/BasicServices.js. 
All methods in this file require this changes. 

#### Integrating Basic services from onf-core-model-ap-bs package

* import the BasicServicesService from `onf-core-model-ap-bs/basicServices` module , 
  ```
  var BasicServices = require('onf-core-model-ap-bs/basicServices/BasicServicesService');
  ```
* Remove the following import  ,
  ```
  var BasicServices = require('../service/BasicServicesService');
  ```
Now , the basic services implemented in the onf-core-model-ap-bs/basicServices module will be utilized.

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

* All Basic services shall be logged to the EATL application , please refer the [Steps to integrate logging application](./Steps2IntegrateLoggingApplication/Steps2IntegrateLoggingApplication.md)  for details.
 

