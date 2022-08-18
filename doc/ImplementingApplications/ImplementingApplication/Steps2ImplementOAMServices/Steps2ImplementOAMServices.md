## Implement OAM services

OAM services are used to view and edit the entities of the CONFIGFile.

### controller 
#### Response Formulation :
* Import the ResponseBuilder, ResponseCode from `onf-core-model-ap/applicationPattern/rest/server` module,
  ```
  var responseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
  var responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
  ```
* After processing a request , response code should be decided based on the execution result. Appropriate response code should be taken from the 'responseCodeEnum.code' enum. For example , for a successful request , 
  ```
  let responseCode = responseCodeEnum.code.OK;
  ```
* To build the final response that needs to be fed to the client , the following line needs to be added , 
  ```
  responseBuilder.buildResponse(res, responseCode, responseBody);
  ```
  where, res is the response object stub which you can see in the argument of the function. responseCode and responseBody referes to the http response code and the body of the response respectively.

#### Logging :

* All OAM services shall be logged to the OAMLog application , please refer the [Steps to integrate logging application](./Steps2IntegrateLoggingApplication/Steps2IntegrateLoggingApplication.md)  for details.

#### Processing Request
* In the controller/ folder, in files related to OAMService , in each method , there will be call to a function in the service/ folder. To this function the request url should be passed. This request url will have the complete path of the resource to be accessed.
```
req.url
```
#### Reference 
Please refer the [file](https://github.com/openBackhaul/RegistryOffice/blob/develop/server/controllers/HttpClient.js) to get a view.

### services
* In the services/ folder , in the files related to OAMService , in each method , include an additional argument to receive the request url ,
  ```
  requestUrl
  ```
* import the JSONDriver from `onf-core-model-ap/applicationPattern/databaseDriver` module , 
  ```
  var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
  ```
* Use the readFromDatabaseAsync method to read an entry from the CONFIGFile. 
* Use the writeToDatabaseAsync method to modify an entry in the CONFIGFile. 

#### Reference 
Please refer the [file](https://github.com/openBackhaul/RegistryOffice/blob/develop/server/service/HttpClientService.js) to get a view.
