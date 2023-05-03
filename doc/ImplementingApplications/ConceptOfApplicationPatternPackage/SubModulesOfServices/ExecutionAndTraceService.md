**ExecutionAndTraceService.js**

This class provides functionalities to log the Service request to the ExecutionAndTraceLog application in the SDN microservice architecture. A REST call will be initiated from the current application to the ExecutionAndTracelog application to record the transaction happened in the service layer.
|![apd_image5](https://user-images.githubusercontent.com/57349523/153877939-8cce1d2e-4811-4702-8ba5-ba76b3dda4a4.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**recordServiceRequest**: <br>This function formulates the request body with the <br>required attributes that needs to be sent to record the service request in the ExecutionAndTraceLog application.|{string} **xCorrelator** correlation tag of the current execution. <br>{string} **traceIndicator** sequence number of the execution. <br>{string} **userName** name of the user who is accessed the service. <br>{string} **originator** originator of the request. <br>{string} **operationName** name of the called service. <br>{string} **responseCode** response code of the REST call execution. <br>{string} **requestBody** request body of the executed REST call. <br>{string} **responseBody** response body of the executed REST call.|{Promise} return true if the operation is successful otherwise returns false.|
|**recordServiceRequestFromClient**: <br> This function formulates the response body with the required attributes that needs to be sent to the Execution and Trace Log application.|{string} **serverApplicationName** application name of the server side. <br>{string} **serverApplicationReleaseNumber** application release number of the server side. <br>{string} **xCorrelator** correlation tag of the current execution. <br>{string} **traceIndicator** sequence number of the execution. <br>{string} **userName** name of the user who is accessed the service. <br>{string} **originator** originator of the request. <br>{string} **operationName** name of the called service. <br>{string} **responseCode** response code of the REST call execution. <br>{string} **requestBody** request body of the executed REST call. <br>{string} **responseBody** response body of the executed REST call.|{Promise} return true if the operation is successful otherwise returns false.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)
