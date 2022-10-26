## Integrate Logging Application

### Framework Logs
The individual/Basic service request and OAM request which are rejected by the express framework itself should also be logged into the EATL and OL applications respectively.
The following modifications needs to be done in the `index.js` file , 

* import the AppCommons from `onf-core-model-ap/applicationPattern/commons` module , 
  ```
  var appCommons = require('onf-core-model-ap/applicationPattern/commons/AppCommons');
  ```
* Before initializing the Swagger middleware the ErrorHandler in the `onf-core-model-ap/applicationPattern/commons/AppCommons` should be included , 
  ```
  appCommons.setupExpressApp(app);
  ```
Note : add this line just before the line 'http.createServer(app)'

### OAM Request Logs

To redirect the logs to OAMLog application , following changes needs to be done in all the files responsible for the OAM services in the /controllers folder , 

* import the OamLogService from `onf-core-model-ap/applicationPattern/services` module , 
  ```
  var oamLogService = require('onf-core-model-ap/applicationPattern/services/OamLogService');
  ```
* In the end of processing every request , include the followin line ,
  ```
  oamLogService.recordOamRequest(req.url, req.body, responseCode, req.headers.authorization, req.method);
  ```
Note :  If you are using a different variable to store the response code, replace `responseCode` variable with that one.

### Basic and Individual Service Logs

To redirect the logs to EATL application , following changes needs to be done in the BasicServices.js and IndividualServices.js  in the /controllers folder , 

* import the ExecutionAndTraceService from `onf-core-model-ap/applicationPattern/services` module , 
  ```
  var executionAndTraceService = require('onf-core-model-ap/applicationPattern/services/ExecutionAndTraceService');
  ```
* In the end of processing every request , include the following line ,
  ```
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
  ```
Note :  If you are using a different variable to store the response code and response body , replace `responseCode` and `responseBody` variable with that.
