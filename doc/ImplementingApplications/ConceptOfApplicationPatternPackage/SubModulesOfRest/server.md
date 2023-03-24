#### **Server**
The modules and classes in this package provide functionality to support the REST server to formulate the HTTP response (header, body, response code) as per the requirement of the "ApplicationPattern specification".

The rest module description contains the following content:

* [Server](#server)
    * ResponseBuilder.js
    * ResponseCode.js
    * ResponseHeader.js
    * responseBody
        * ConsequentAction.js
        * ResponseValue.js

**ResponseBuilder.js**

This module provides functionality to build the HTTP response object.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**buildResponse** <br>This function builds the HTTP response object.|{JSONObject} **response** HTTP response object. <br>{String} **responseCode** HTTP response code.  <br>{JSONObject} **responseBody** HTTP response body.  <br>{JSONObject} **responseHeader** HTTP response header.||

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**ResponseCode.js**

This class provides an enumeration of HTTP status codes.

**ResponseHeader.js**

This class provides functionality to create a HTTP response header.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|xCorrelator|
|String|execTime|
|String|lifeCycleState|
|String|contentType|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new response header instance. |{String} **xCorrelator** UUID for the service execution flow that allows to correlate requests and responses. <br>{String} **startTime** Time when this request was initiated. <br>{String} **lifeCycleState** Sequence of request numbers along the flow, if it is empty, set it to 1.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**xCorrelatorGenerator** <br>This function generates a xCorrelator based on the regular expression provided in the specification.||{String} return the xCorrelator.|
|**executionTimeInMilliseconds** <br>This function calculates the execution time for processing the request.|{JSONObject} **startTime** start time of the request. |{integer} return the execution time in milli seconds.| 
|**createResponseHeader** <br>This function creates response header based on the provided input values. |{JSONObject} **xCorrelator** of the request. <br>{JSONObject} **startTime** start time of the request. <br>{JSONObject} **operationName** of the request.|{promise} return the response header.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**responseBody**

This package contains classes that are used to represent generic response bodies.

***

**_ConsequentAction.js_**

This class provides a stub for the consequent action list.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|label|
|String|request|
|String|displayInNewBrowserWindow|
|String|inputValueList|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new consequent action list.|{String} **label** of the consequent action. <br>{String} **request** url that needs to be addressed to perform the consequent action. <br>{String} **displayInNewBrowserWindow** should be true if the consequent action needs to be displayed in a new tab.<br> {String} **inputValueList**|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**_ResponseValue.js_**

This class provides a stub for the consequent action list.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|fieldName|
|String|value|
|String|datatype|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new ResponseValue object.|{String} **fieldName** field name of the response value. <br>{String} **value** of the field name. <br>{String} **datatype** data type of the value.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)