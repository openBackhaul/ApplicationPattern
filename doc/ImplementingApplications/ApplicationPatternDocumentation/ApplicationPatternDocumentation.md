# Application Pattern Documentation

**Purpose**

The purpose of this document is to outline the technical design of the application pattern generic modules in detail.  

It is detailing  
* the functionality provided by each class/file in the modules
* the functionality, which will be provided by each component and shows how various components interacts in the design

This document will be updated based on the changing requirement in the application pattern specification.  

**Scope**

The application pattern design charted in this document is based on the scope defined in the requirement (OAS).  
This document is not intended to address the installation and configuration of the deployment.  

**Introduction**

Application pattern module is a ready-made framework that provides components and solutions that has generic functionalities specific to the SDN application pattern microservice specifications.  
![apd_image1](https://user-images.githubusercontent.com/57349523/153877928-28f4ec8b-2889-4c5e-bd54-dec7f2355528.png)

This framework provides APIs,
* to manipulate the LOADfile, which is in the ONF Core model.
* to configure and automate the forwardings between applications (please refer chapter about [ForwardingList](../../SpecifyingApplications/ForwardingList/ForwardingList.md) to learn more about forwarding)
* to log the service and the oam request to ExecutionAndTraceLog and OamLog application respectively.
* to validate authentication by interacting with the AdministratorAdministration application.

By including this already existing framework, one can focus on business logics rather than developing their own logic to provision their application into the microservice architecture.  

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### Application Pattern Modules Overview

The following application pattern modules are each described in one of the subsequent chapters: 
* [Callbacks](#callbacks-module)
* [Database](#database-module)
* [DatabaseDriver](#databasedriver-module)
* [Logging](#logging-module)
* [onfModel](#onfmodel-module)
* [Rest](#rest-module)
* [Security](#security-module)
* [Softwareupgrade](#softwareupgrade-module)

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### CALLBACKS Module

([up &uarr;](#application-pattern-modules-overview)) Callback module provides functionality to formulate and dispatch the HTTP request to a target REST server.  

The callback module has the following components:
* [requestBodyFactory](#requestbodyfactory)
    * basicservices.js
    * individualServices.js
* [eventDispatcher.js](#eventdispatcherjs)

|![apd_image2](https://user-images.githubusercontent.com/57349523/153877932-5f065e0d-6196-48b1-a4b6-48142fd110b1.png)|
|---|

#### **requestBodyFactory**

The requestBodyFactory provides functionality for formulating the request body of HTTP requests for both basic services and individual services. 

***

**basicservices.js**

Provides functionality to formulate HTTP request body for the forwarding HTTP requests that are part of the basic services. This module is generic across all the application that are having core-model-1-4:control-construct as the root entity of their LOADfile.  

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**prepareRequestBody**: <br>this function formulates and returns the request <br>body based on the operationName, clientApplicationName and the attribute list passed from the service layer.|{String} **clientApplicationName** name of the client application. <br>{String} **operationName** name of the client operation that needs to be addressed. <br>{String} **attributeList** list of attributes that needs to be included in the request body based on the operation name.| {Promise} **httpRequestBody** formulated JSON HTTP request body.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**individualservices.js**

Provides functionality to formulate HTTP request body for the forwarding HTTP requests that are part 
of the individual services. This file should be modified according to the individual service forwarding 
requirements.eventDispatcher.js.

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**prepareRequestBody**: <br>this function formulates and returns the request <br>body based on the operationName, clientApplicationName and the attribute list passed from the service layer.|{String} **clientApplicationName** name of the client application. <br>{String} **operationName** name of the client operation that needs to be addressed. <br>{String} **attributeList** list of attributes that needs to be included in the request body based on the operation name.| {Promise} **httpRequestBody** formulated JSON HTTP request body.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **eventDispatcher.js**

This module provides functionalities to trigger and dispatch the HTTP REST request from this application to other applications.  
This module associates with the requestBodyFactory to formulate the httpRequestBody in JSON format and interacts with the Axios REST client in the rest/client module to trigger the formulated HTTP request.  

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**dispatchEvent**: <br>This function formulates the HTTP request header <br> and body and dispatches the event to the corresponding target REST server.|{String} **serviceType** provides "basic" if the service comes from the basicservice layer or "individual" otherwise. <br>{String} **serviceType** provides "basic" if the service comes from the basicservice layer or "individual" otherwise. <br>{String} **remoteIpAndPort** ip address and port of the client application in the format \<ipaddress>:\<port>. <br>{String} **clientApplicationName** name of the client application to which the request is going to be sent. <br>{String} **operationKey** operation key to access the service in the client application. <br>{String} **attributeList** list of attribuges that needs to be included in the request body based on the operation name. <br>{String} **user** username of the request iniator. <br>{String} **xCorrelator** UUID for the service execution flow that allows to correlate requests and responses. <br>{String} **traceIndicator** sequence number of the request. <br>{String} **customerJourney** holds information supporting the customers journey to which the execution applies.|{Promise} true if the operation is successful.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### DATABASE Module

([up &uarr;](#application-pattern-modules-overview)) This folder contains load.json file that consists of the ONF CoreModel representation of the application configuration.  

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### DATABASEDRIVER Module

([up &uarr;](#application-pattern-modules-overview)) This module consists of functionalities, which we can interact with the load.json file in ONF CoreModel.   

#### **JSONDriver.js**

This class provides functionality to perform CURD operation on the JSON database LOADfile, which is in the ONF CoreModel format.  
The interaction with the file system will be performed with the use of 'fs module', which enables interacting with the file system in a way modeled on standard Portable Operating System Interface for UNIX(POSIX) functions.  
Also, by using the 'path' module that provides utilities for working with files and directory paths. This module uses its own mechanism to traverse the ONF model JSON file based on the provided JSONPath.  

Please refer the following flow for the ‘readFromDatabase’ operation:  
|![apd_image3](https://user-images.githubusercontent.com/57349523/153877934-3d7dbb55-3e67-4b83-9362-be652dd3b54a.png)|
|---|

Please refer the following flow for the ‘write/deleteFromDatabase’ operation:  
|![apd_image4](https://user-images.githubusercontent.com/57349523/153877937-fbf2bde8-a906-4817-842c-34b2b6fe145c.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**readFromDatabase** <br>This function reads the requested JSONPath from the core-model.|{String} **JSONPath** JSON path that leads to the destined attribute.|return the requested value.|
|**writeToDatabase** <br>This function updates an existing instance or creates <br>a new instance in the LOADfile which is in ONF CoreModel based on the JSONPath and input parameters.|{String} **JSONPath** JSON path that leads to the destined attribute. <br>{JSONObject\|String} **valueToBeUpdated** value that needs to be updated. <br>{boolean} **isAList** a boolean flag that represents whether the value to be updated is a list instance.|return true if the value is updated, otherwise return false.|  
|**deleteFromDatabase** <br>This function deletes the requested data in the JSONPath from the core-model.|{string} **JSONPath** JSON path that leads to the destined attribute. <br>{JSONObject\|String} **valueToBeDeleted** value that needs to be deleted. <br>{boolean} **isAList** a boolean flag that represents whether the value to be deleted is a list.|{Promise} return true if the value is deleted, otherwise return false.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**PrimaryKey.js**

This file contains the primary key for the list attributes in core-model. If a new list is getting added, then the key attribute of the list should be updated in this file to make the JSONDriver functionalities to work as expected.  

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### LOGGING Module

([up &uarr;](#application-pattern-modules-overview)) 

**ExecutionAndTraceService.js**

This class provides functionalities to log the Service request to the ExecutionAndTraceLog application in the SDN microservice architecture. A REST call will be initiated from the current application to the ExecutionAndTracelog application to record the transaction happened in the service layer.  
|![apd_image5](https://user-images.githubusercontent.com/57349523/153877939-8cce1d2e-4811-4702-8ba5-ba76b3dda4a4.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**recordServiceRequest**: <br>This function formulates the request body with the <br>required attributes that needs to be sent to record the service request in the ExecutionAndTraceLog application.|{string} **xCorrelator** correlation tag of the current execution. <br>{string} **traceIndicator** sequence number of the execution. <br>{string} **userName** name of the user who is accessed the service. <br>{string} **originator** originator of the request. <br>{string} **operationName** name of the called service. <br>{string} **responseCode** response code of the REST call execution. <br>{string} **requestBody** request body of the executed REST call. <br>{string} **responseBody** response body of the executed REST call.|{Promise} return true if the operation is successful otherwise returns false.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**OAMLogServices.js**

This class provides functionality to log the OaM request to the OAMLog application in the SDN Microservice architecture.  
A REST call will be initiated from this application to the OAMLog application to record the transaction happened in the OAM layer.  

|![apd_image6](https://user-images.githubusercontent.com/57349523/153877940-54471ad3-d2a3-454f-84ed-6bfd866c7f60.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**recordOamRequest**: <br>This function formulates the request body with the <br>required attributes that needs to be sent to record the OaM request in the OamLog application.|{string} **oamPath** oam path that is accessed during the request. <br>{string} **requestBody** incase if it is a put request, then the request body of the request. <br>{string} **responseCode** response code of the REST call execution. <br>{string} **authorizationCode** authorization code used to access the oam layer. This will then be decoded to find out the username. <br>{string} **method** HTTP method of the OAM layer call. It can be PUT, GET.|{promise} return the requested value.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### ONFMODEL Module

<!-- moved to own document for better readability due to too many subparagraphs -->
([up &uarr;](#application-pattern-modules-overview)) The detailed Onf model description covers details to the following contents and can be found **[here](ApplicationPatternDocumentation_onfmodel.md)**.

* model
    * CoreModel.js
* LogicalTerminationPoint.js 
    * LayerProtocols.js
    * ForwardingDomain.js
    * ForwardingConstruct.js
    * ProfileCollection.js
    * Profile.js
* LayerProtocol
    * TcpServerInterface.js
    * HttpServerInterface.js
    * OperationServierInterface.js
    * TcpClientInterface.js
    * HttpClientInterface.js
        * OperationClientInterface.js
* profiles
    * Application Profile.js
* Services
    * LogicalTerminationPointService.js
        * ForwardingConstructServices.js
    * Utility
        * ONfAttributeFormatter.js

<!--
The table gives only a brief overview of the purpose of the different classes and modules. 

|**Package**|**(Sub)Class/module**|**Purpose**|
|---|---|---|
|Model|CoreModel.js|Provides a stub for ONF core-model. Consolidates technology specific extensions and provides functionality to manipulate attributes in the core-model.|
|LogicalTerminationPoint.js|LogicalTerminationPoint.js|Encapsulates the termination and adaptation functions of technology specific layers represented LayerProtocol instances. Provides a stub to instantiate and generate a JSON object for a LTP.|
|LogicalTerminationPoint.js|LayerProtocols.js|Provides a stub to instantiate and generate a JSON object for a LayerProtocol.|
|LogicalTerminationPoint.js|ForwardingDomain.js|Models the component that represents a forwarding capability that provides the opportunity to enable forwarding.|
|LogicalTerminationPoint.js|ForwardingConstruct.js|Represents enabled constrained potential for forwarding between two or more FcPorts at a particular specific layerProtocol.|
|LogicalTerminationPoint.js|ProfileCollection.js|Models the component representing profiles collection in the CoreModel.|
|LogicalTerminationPoint.js|Profile.js|Models the component representing a profile. Extend this class for new profile types.|
|LayerProtocol|TcpServerInterface.js|Provides a stub to instantiate and generate a JSON object for a tcpServerInterface layer protocol.|
|LayerProtocol|HttpServerInterface.js|Provides a stub to instantiate and generate a JSON object for a httpServerInterface layer protocol.|
|LayerProtocol|OperationServierInterface.js|Provides a stub to instantiate and generate a JSON object for an operationServerInterface layer protocol.|
|LayerProtocol|TcpClientInterface.js|Provides a stub to instantiate and generate a JSON object for a tcpClientInterface layer protocol.|
|LayerProtocol|HttpClientInterface.js|Provides a stub to instantiate and generate a JSON object for a httpClientInterface layer protocol.|
|LayerProtocol/ HttpClientInterface.js|OperationClientInterface.js|Provides a stub to instantiate and generate a JSON object for an operationClientIInterface layer protocol. |
|Profiles|Application Profile.js|Provides a stub to instantiate and generate a JSON object for a ApplicationProfile. Used by TypeApprovalApplication to store the application's approval status.|
|Services|LogicalTerminationPointService.js|Provides functionality to manipulate the logical termination point.|
|Services/ LogicalTerminationPointService.js|ForwardingConstructServices.js|Provides functionality to configure, unconfigure and automate the ForwardingConstruct.|
|Services/Utility|ONfAttributeFormatter.js|Provides functionalities that converts the attributes to ONF CoreModel format.|
-->

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### REST Module

The rest module description contains the following content:

* [Client](#client)
    * Client.js
    * RequestBuilder.js
    * RequestHeader.js
* [Server](#server)
    * ResponseBuilder.js
    * RequestHeader.js
    * responseBody
        * ConsequentAction.js
        * ResponseValue.js

![colorline_orange](https://user-images.githubusercontent.com/57349523/154718643-53fee4f0-a146-40e8-9b1c-108fc035aa82.jpg)

#### **Client**
([up &uarr;](#rest-module)) The module in this package provides a REST client which is used to communicate with the REST server in other applications.  
|![apd_image14](https://user-images.githubusercontent.com/57349523/153877957-edfc9d5c-89cb-4af8-9931-e154d5725c99.png)|
|---|

***

**Client.js**

This module provides functionality to perform HTTP request to client application. It uses the AXIOS package as a REST client.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**post** <br>This function performs HTTP POST method.|{object} **request** object that consists of the httpRequestBody, httpRequestHeader, url.|{promise} return the response code.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

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

#### **Server**
([up &uarr;](#rest-module)) The modules and classes in this package provide functionality to support the REST server to formulate the HTTP response (header, body, response code) as per the requirement of the "ApplicationPattern specification".

***

**ResponseBuilder.js**

This module provides functionality to build the HTTP response object.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**buildResponse** <br>This function builds the HTTP response object.|{JSONObject} **response** HTTP response object. <br>{String} **responseCode** HTTP response code.  <br>{JSONObject} **responseBody** HTTP response body.  <br>{JSONObject} **responseHeader** HTTP response header.||

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**RequestHeader.js**

This class provides functionality to create a HTTP response header.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|xCorrelator|
|String|execTime|
|String|backendTime|
|String|lifeCylceStatement|
|String|contentType|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new response header instance. |{String} **xCorrelator** User identifier from the system starting the service call. If not available, originator value will be copied to this attribute. <br>{String} **execTime** Identification for the system consuming the API, name of the current application. <br>{String} **backendTime** UUID for the service execution flow that allows to correlate requests and responses. <br>{String} **lifeCycleState** Sequence of request numbers along the flow, if it is empty, set it to 1.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**xCorrelatorGenerator** <br>This function generates a xCorrelator based on the regular expression provided in the specification.||{promise} return the xCorrelator.| 
|**executionTimeInMilliseconds** <br>This function calculates the execution time for processing the request.|{JSONObject} **startTime** start time of the request. |{promise} return the execution time in milli seconds.| 
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

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new consequent action list.|{String} **label** of the consequent action. <br>{String} **request** url that needs to be addressed to perform the consequent action. <br>{String} **displayInNewBrowserWindow** should be true if the consequent action needs to be displayed in a new tab.|

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

### SECURITY Module

([up &uarr;](#application-pattern-modules-overview)) This package contains modules that provides authorizing service.  
|![apd_image15](https://user-images.githubusercontent.com/57349523/153877959-5d4016c0-220f-491a-98d5-cb4ee00ec750.png)|
|---|

#### **AuthorizingService.js**

This module provides functionality to authenticate an OAM layer request by getting an approval from the AdministratorAdministration.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**isAuthorized** <br>This function authorizes the user credentials.|{string} **authorizationCode** authorization code received from the header. <br>{string} **method** is the https method name.|{boolean} return the authorization result.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **AuthorizationDecoder.js**

This module provides functionality to decode an authorization code.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**decodeAuthorizationCodeAndExtractUserName** <br>To decode base64 authorization code from authorization header.|{string} **authorizationCode** <br>base64 encoded authorization code.|{Promise} returns user name based on the decoded authorization code.| 

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### SOFTWAREUPGRADE Module

([up &uarr;](#application-pattern-modules-overview))

#### **BequeathYourDataAndDie.js**

This module provides functionality to migrate data from the current version to the next version. This file should be modified according to the individual service forwarding requirements.
 
[Up to ImplementingApplications](../ImplementingApplications.md)
