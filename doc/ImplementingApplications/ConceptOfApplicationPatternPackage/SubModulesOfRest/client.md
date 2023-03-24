#### **Client**
The module in this package provides a REST client which is used to communicate with the REST server in other applications.
|![apd_image14](https://user-images.githubusercontent.com/57349523/153877957-edfc9d5c-89cb-4af8-9931-e154d5725c99.png)|
|---|

The rest module description contains the following content:

* [Client](#client)
    * Client.js
    * eventDispatcher.js
    * RequestBuilder.js
    * RequestHeader.js

**Client.js**

This module provides functionality to perform HTTP request to client application. It uses the AXIOS package as a REST client.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**post** <br>This function performs HTTP POST method.|{object} **request** object that consists of the httpRequestBody, httpRequestHeader, url.|{promise} return the response code.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**eventDispatcher.js**

This module provides functionalities to trigger and dispatch the HTTP REST request from this application to other applications.
This module associates with the requestBodyFactory to formulate the httpRequestBody in JSON format and interacts with the Axios REST client in the rest/client module to trigger the formulated HTTP request.

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**dispatchEvent**: <br>This function formulates the HTTP request header <br> and body and dispatches the event to the corresponding target REST server.|{String} **operationClientUuid** uuid of the client operation that needs to be addressed. <br>{String} **httpRequestBody** list of attributes that needs to be included in the request body based on the operation name. <br>{String} **user** username of the request iniator. <br>{String} **xCorrelator** UUID for the service execution flow that allows to correlate requests and responses. <br>{String} **traceIndicator** sequence number of the request. <br>{String} **customerJourney** holds information supporting the customers journey to which the execution applies.|{Promise} true if the operation is successful.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

**RequestBuilder.js**

This module provides functionality to construct a REST request.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**BuildAndTriggerRESTRequest** <br>This function triggers a REST request by calling the RESTClient |{string} **remoteIpAddressAndPort** ip address, port of the client application in the format <ipaddress>:<port>. <br>{string} **operationName** service that needs to be addressed in the client application. <br>{string} **method** HTTP method for the REST request. <br>{string} **requestHeader** HTTP request header for the REST call. <br>{string} **requestBody** request body for the REST call. |{promise} returns the HTTP response received.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**RequestHeader.js**

This class provides functionality to create a HTTP request header.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|user|
|String|originator|
|String|xCorrelator|
|String|traceIndicator|
|String|customerJourney|
|String|operationKey|
|String|contentType|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new Request header instance.|{String} **user** identifier from the system starting the service call. If not available, originator value will be copied to this attribute. <br>{String} **xCorrelator** UUID for the service execution flow that allows to correlate requests and responses. <br>{String} **traceIndicator** Sequence of request numbers along the flow, if it is empty, set it to 1. <br>{String} **customerJourney** Holds information supporting customer’s journey to which the execution applies. <br>{String} **operationKey** operation key to access the service in the client application.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**xCorrelatorGenerator** <br>This function generates a xCorrelator based on the <br>regular expression provided in the specification.||{promise} return the xCorrelator.|

![colorline_orange](https://user-images.githubusercontent.com/57349523/154718643-53fee4f0-a146-40e8-9b1c-108fc035aa82.jpg)
