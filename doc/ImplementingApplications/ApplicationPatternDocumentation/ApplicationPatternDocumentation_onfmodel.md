# Application Pattern Documentation - ONFMODEL 

### Outline

<!-- links to anchors inside a document (= headings) with dot in the heading title: omit the dot from the link as follows:
    heading example:
        ### myheading.foo 
    link as:
        [mylink](#headingfoo)

    For links to files keep the dot, as it is part of the filename!
-->

The description outline is as follows:

* [model](#Model)
    * [CoreModel.js](#CoreModeljs)
* [LogicalTerminationPoint.js](#LogicalTerminationPointjs)
    * [LayerProtocols.js](#LayerProtocolsjs)
    * [ForwardingDomain.js](#forwardingdomainjs)
    * [ForwardingConstruct.js](#forwardingconstructjs)
    * [ProfileCollection.js](#profilecollectionjs)
    * [Profile.js](#profilejs)
* [LayerProtocol](#LayerProtocol)
    * [TcpServerInterface.js](#tcpserverinterfacejs)
    * [HttpServerInterface.js](#httpserverinterfacejs)
    * [OperationServerInterface.js](#operationserverinterfacejs)
    * [TcpClientInterface.js](#tcpclientinterfacejs)
    * [HttpClientInterface.js](#httpclientinterfacejs)
        * OperationClientInterface.js
* [Profiles](#profiles)
    * [Application Profile.js](#application-profilejs)
* [Services](#Services)
    * [LogicalTerminationPointService.js](#logicalterminationpointservicejs)
        * ForwardingConstructServices.js
    * [Utility](#utility)
        * ONfAttributeFormatter.js

[Back to Application Pattern Documentation](ApplicationPatternDocumentation.md)

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### Model

#### **CoreModel.js**

([top &uarr;](#Outline)) This class provides a stub for ONF core-model. This class consolidates the technology specific extensions and provides functionality to manipulate the attributes in the core-model.  

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|uuid|
|JSONarray of LogicalTerminationPoint|logicalTerminationPointList|
|JSONarray of forwardingDomain|forwardingDomainList|
|JSON object of profileCollection|profileCollection|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getUuid** <br>This function returns the uuid of core-model instance.||{promise} returns uuid.|
|**createLogicalTerminationPoint** <br> This function adds a new logical-termination-point instance to the logical-termination-point list.|{JSONObject} **logicalTerminationPoint** an instance of the logical-termination-point.|{promise} returns true if the instance is added successfully to the logical-termination-point list.|
|**deleteLogicalTerminationPoint** <br> This function deletes an instance from the logical-termination-point list. |{String} **uuid** of the logical-termination-point instance that needs to be deleted. |{promise} returns true if the instance is deleted successfully from the logical termination point list.|
|**getLogicalTerminationPoint** <br>This function returns an instance from the logical-termination-point list for the provided uuid.|{String} **uuid** of the logical-termination-point instance that needs to be retrieved.|{promise} returns the logical-termination-point instance.|
|**getLogicalTerminationPointList** <br> This function returns the list of logical-termination-point instances for the provided layer-protocol-name.|{String} **layerProtocolName** protocol name of the layer.|{promise} returns logical-termination-point instance list.|
|**getForwardingDomainList** <br>This function returns the entire forwarding-domain list inside the core-model.||{promise} returns forwarding-domain list.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### LogicalTerminationPoint.js

([top &uarr;](#Outline)) The LogicalTerminationPoint (LTP) class encapsulates the termination and adaptation functions of one or more technology specific layers represented by instances of LayerProtocol. This class provides a stub to instantiate and generate a JSON object for a LogicalTerminationPoint. 
 
*Field summary*:
|**Type**|**Field**|
|---|---|
|String|uuid|
|ltpDirectionEnum (SINK,SOURCE)|ltpDirection|
|Array of uuid|clientLTP|
|Array of uuid|serverLTP|
|JSON object of layerProtocol|layerProtocol|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new logicalTerminationPoint instance.|{String} **uuid** unified resource identifier for the httpClient. <br>{String} **ltpDirection** direction of the LTP, it will be SINK for clients and SOURCE for servers. <br>{String} **clientLTP** client LTPs ((operation-client/server) associated with http-client/server, ((http-client/server) associated with tcp-client/server)). <br>{String} **serverLTP** server LTPs ((tcp-client/server) associated with http-client/server, ((http-client/server) associated with operation-client/server)). <br>{String} **layerProtocol** an instance of the LayerProtocol class. |

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getServerLtpList** <br>This function returns the server-ltp list for the given logical-termination-point uuid.|{String} **uuid** of the logical-termination-point. |{promise} returns the server-ltp list of the LTP.|
|**getClientLtpList** <br>This function returns the client-ltp list for the given logical-termination-point uuid. |{String} **uuid** of the logical-termination-point. |{promise} returns the client-ltp list of the LTP.| 
|**setClientLtpList** <br>This function modifies the client-ltp list for the given logical-termination-point uuid. |{String} **uuid** of the logical-termination-point. <br>{array} **clientUuidList** array of client uuids that needs to be updated. |{promise} returns true if the value is updated otherwise false.| 
|**setServerLtpList** <br>This function modifies the server-ltp list for the given logical-termination-point uuid. |{String} **uuid** of the logical-termination-point. <br>{array} **serverUuidList** array of client uuids that needs to be updated. |{promise} returns true if the value is updated otherwise false.| 
|**getUuidListForTheProtocol** <br>This function returns the list of logical-termination-point uuid for the provided layer-protocol-name. |{String} **layerProtocolName** protocol name of the layer. |{promise} returns logical-termination-point uuid List.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **LayerProtocols.js**

([top &uarr;](#Outline)) The projection of an LTP into each technology specific layer is represented by a LayerProtocol (LP) instance. This class provides a stub to instantiate and generate a JSON object for a LayerProtocol. 

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|localId|
|String (OPERATION_CLIENT, HTTP_CLIENT, TCP_CLIENT, <br>OPERATION_SERVER, HTTP_SERVER, TCP_SERVER)|layerProtocolName|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new layerProtocolName instance.|{String} **localId** local identifier for the layerProtocol. <br>{String} **layerProtocolName** name of the layer protocol (it can be <br>tcp-server, tcp-client, http-server, http-client, operation-server, <br>operation-client).|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getLayerProtocolName** <br>This function returns the layer-protocol-name for <br>the given logical-termination-point uuid.|{String} **uuid** of the logical-termination-point.|{promise} returns the layerProtocolName of the LTP.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **ForwardingDomain.js**

([top &uarr;](#Outline)) The ForwardingDomain (FD) class models the component that represents a forwarding capability that provides the opportunity to enable forwarding (of specific transport characteristic information at one or more protocol layers) between points. 

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|uuid|
|JSONarray of ForwardingConstruct|forwardingConstructList|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This creates a new ForwardingDomain instance.|{String} **uuid** unique identifier of the forwarding-domain. <br>{String} **forwardingConstructList** list of forwarding-construct.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getForwardingConstructForTheUuid** <br>This function returns the forwarding-construct instance for the given forwarding-construct uuid.|{string} **forwardingConstructUuid** forwarding-construct uuid in the forwarding-construct list in forwarding-domain.|{promise} returns forwarding-construct instance.|
|**getForwardingConstructList** <br>This function returns the entire list of forwarding-construct instances inside all forwarding domains.||{promise} returns all forwarding-construct instance list.| 
|**getForwardingConstructForTheFCName** <br>This function returns the forwarding-construct instance that matches the forwarding-construct name.|{string} **forwardingName** forwardingName of the forwarding-construct.|{promise} returns forwarding-construct instance.| 
|**getForwardingConstructListForTheFcPortManagementDirection** <br>This function returns the forwarding-construct instance list for the fc-port management direction.|{string} **FcPortManagementDirectionUuid** fc-port management direction logical-termination-point attribute value.|{promise} returns forwarding-construct instance list.|
|**getForwardingConstructListForTheFcPortOutputDirection** <br>This function returns the forwarding-construct instance list for the fc-port output direction.|{string} **FcPortOutputDirectionUuid** fc-port output direction logical-termination-point attribute value.|{promise} returns forwarding-construct instance list.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **ForwardingConstruct.js**

([top &uarr;](#Outline)) The ForwardingConstruct class (FC) represents enabled constrained potential for forwarding between two or more FcPorts at a particular specific layerProtocol.

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|uuid|
|JSONArray of key value pair|nameList|
|JSONArray of FCPort|fcPortList|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new ForwardingConstruct instance.|{String} uuid unified resource identifier for the forwarding-construct. <br>{String} nameList name list that holds the forwardingName and forwardingKind details. <br>{String} fcPortList fcPort instance list.|

*Inner class summary*:
|**Inner class and description**|**Field summary**|**Constructor summary**|
|---|---|---|
|**name** <br>This class provides stub for the name list.|valueName (String) <br>name (String)|constructor (valueName, name)|  
|**FcPort** <br>This class provides stub to instantiate a fc-port.|localId (String) <br>portDirection (MANAGEMENT, INPUT, OUTPUT) <br>logicalTerminationPoint (String)|constructor (localId, portDirection, logicalTerminationPoint)| 

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getForwardingNameForTheUuid** <br>This function returns the forwarding-construct/name/value-name=ForwardingName instance for the given forwarding construct uuid.|{string} **forwardingConstructUuid** forwarding-construct uuid.|{promise} returns ForwardingName of the matched forwarding-construct.| 
|**getForwardingKindForTheUuid** <br>This function returns the forwarding-construct/name/value-name=ForwardingKind instance for the given forwarding construct uuid.|{string} **forwardingConstructUuid** forwarding-construct uuid.|{promise} returns ForwardingKind of the matched forwarding-construct.| 
|**getFcPortOutputDirectionLogicalTerminationPointListForTheForwardingName** <br>This function returns the logical-termination-point(uuid) list of the fc-port in the output direction for the forwardingName.|{string} **forwardingConstructName** forwarding construct name as in forwarding-domain/forwarding-construct/name/value-name.|{Promise} return the logical-termination-point(uuid) list of the fc-port in the output direction for the forwardingName.|
|**getFcPortOutputDirectionLogicalTerminationPointListForTheFcPortInputDirection** <br>This function returns the logical-termination-point(uuid) list of the fc-port in the output direction for the input fcport.|{string} **fcPortLogicalTerminationPoint** logical-termination-point of the fc-port input direction. <br>{string} **context** if we want to filter the output fc-port for a specific application (for example to perform /embed-yourself only for the specific application).|{Promise} return the logical-termination-point(uuid) list of the fc-port in the output direction for the input fcport.|
|**getFcPortOutputDirectionLogicalTerminationPointListForTheUuid** <br>This function returns the logical-termination-point(uuid) list of the fc-port in the output direction for the forwarding-construct uuid.|{string} **forwardingConstructUuid** forwarding-construct uuid.|{Promise} return the logical-termination-point(uuid) list of the fc-port in the output direction for the forwarding-construct uuid.|
|**generateNextFcPortLocalId** <br>This function returns the next available uuid for the fc-port based on the provided forwarding-construct uuid.|{String} **forwardingConstructUuid** uuid of the forwarding-construct.|{promise} returns the next free uuid instance that can be used for the fc-port creation.|
|**modifyFcPortLogicalTerminationPointUuid** <br>This function updates the logical-termination-point attribute of the fc-port.|{String} **forwardingConstructUuid** uuid of the forwarding-construct. <br>{String} **fcPortLocalId** local-id of the fc-port. <br>{String} **fcPortNewLogicalTerminationPoint** new logical-termination-point that needs to be updated.|{promise} returns true if the value is updated.|
|**isFcPortExists** <br>This function returns true if a fc-port is already available for the provided logical-termination-point of an operation(client/server) Uuid|{String} **forwardingConstructUuid** uuid of the forwarding-construct <br>{String} **operationUuid** logical-termination-point of an operation(client/server) Uuid|{promise} returns true if a fc-port is already available.|
|**getFcPortLocalId** <br>This function returns the fc-port local-id for the provided logical-termination-point of an operation|{String} **forwardingConstructUuid** uuid of the forwarding-construct <br>{String} **operationUuid** logical-termination-point of an operation(client/server)Uuid|{promise} returns the fc-port local-id.|
|**addFcPort <br>This function** adds a Fc port to the forwarding-construct|{String} **forwardingConstructUuid** uuid of the forwarding-construct <br>{String} **fcPortLocalId** local-id of the fc-port <br>{String} **fcPortDirection** direction of the fc-port <br>{String} **fcPortLogicalTermincationPoint** logical-termination-point of the fc-port|{promise} returns true if the fc-port is added to the list.| 
|**deleteFcPort** <br>This function deletes a Fc port from the forwarding-construct|{String} **forwardingConstructUuid** uuid of the forwarding-construct <br>{String} **fcPortLocalId** fc-port local id|{promise} returns true if the fc-port is added to the list.|  

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **ProfileCollection.js**

([top &uarr;](#Outline)) The ProfileCollection class models the component that represents profiles collection in the CoreModel.

*Field summary*:
|**Type**|**Field**|
|---|---|
|JSONArray of Profile|profileList|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new ProfileCollection instance.|{JSONArray} **profileList** list of profiles.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getProfileInstanceForTheUuid** <br>This function returns an instance from the profile list for the provided uuid. |{String} **uuid** of the profile instance that needs to be retrieved.|{promise} returns profile instance.|
|**isProfileExists** <br>This function returns true if the profile uuid exists in the profile list.|{String} **profileUuid** uuid of the profile instance that needs to be retrieved. |{promise} returns true if the profile uuid exists in the profile list.|
|**getProfileList** <br>This function returns the profile list.||{promise} returns profile instance.|
|**addProfile** <br>This function includes an instance to the profile list.|{Profile} **profileInstance** profile instance to be included. |{promise} returns true if the operation is success.|
|**deleteProfile** <br>This function deletes a profile.| {String} **profileUuid** uuid of the profile.|{promise} returns true if the operation is successful.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **Profile.js**

([top &uarr;](#Outline)) The Profile class models the component that represents a profile. New profile types can extend this class.  

*Field summary*:
|**Type**|**Field**|
|---|---|
|String|uuid|
|String (APPLICATION_PROFILE, INTEGER_PROFILE, OAM_RECORD_PROFILE, <br>SERVICE_RECORD_PROFILE, ADMIN_PROFILE)|profileName|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new profile instance.|{String} **uuid** unified resource identifier for the profile. <br>{String} **profileName** name of the profile.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getUuidListForTheProfileName** <br>This function returns the list of profile uuid for the <br>provided profile-name.|{String} **profileNameType** name of the profile.|{promise} returns profile uuid List.| 

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### LayerProtocol

([top &uarr;](#Outline)) This package consists of a list of sub classes for the layerProtocol class.

#### **TcpServerInterface.js**

([top &uarr;](#Outline)) This class provides a stub to instantiate and generate a JSON object for a tcpServerInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the tcpServerInterfacePac: 
|![apd_image7](https://user-images.githubusercontent.com/57349523/153877944-2652e2db-0acf-4ef1-9db6-ef99b72eee61.png)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new tcp server layer protocol.|{string} **localAddress** tcp server ipaddress where the application is hosted. <br>{string} **localPort** tcp server port where the application is running.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getLocalAddress** <br>This function returns the IpV4 address of the current application.||{promise} returns ip address of the current application.|
|**getLocalPort** <br>This function returns the port where the current application is running.||{promise} returns the port where the current application is running.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **HttpServerInterface.js**

([top &uarr;](#Outline)) This class provides a stub to instantiate and generate a JSON object for a httpServerInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the httpServerInterfacePac:  
|![apd_image8](https://user-images.githubusercontent.com/57349523/153877946-4878bc4e-0f74-448a-bf76-9e59f128fb34.jpeg)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new HTTP server layer protocol.|{string} **applicationName** name of the current application. <br>{string} **releaseNumber** release number of the current application. <br>{string} **applicationPurpose** purpose of the current application. <br>{string} **dataUpdatePeriod** data update period can be 24hr, 1hr, manual or realtime. <br>{string} **ownerName** name of the application owner. <br>{string} **ownerEmailAddress** email address of the application owner. <br>{string} **releaseList** release list of the application along with its history.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getHttpServerCapability** <br>This function returns the HTTP server capability.  ||{promise} returns the capability of the HTTP server.| 
|**getApplicationName** <br>This function returns the name of the current application. ||{promise} returns the name of current application.| 
|**getReleaseNumber** <br>This function returns the release number of the current application. ||{promise} returns release number of current applications.| 
|**getReleaseList** <br>This function returns the list of releases for the application.||{promise} returns the release list of the application.|   

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **OperationServerInterface.js**

([top &uarr;](#Outline)) This class provides a stub to instantiate and generate a JSON object for an operationServerInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the operationServerInterfacePac:  
|![apd_image9](https://user-images.githubusercontent.com/57349523/153877948-e45a6cd6-7c62-47aa-a172-a417c3a4d33b.jpeg)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new operation server layer protocol.|{String} **operationName** name of the operation.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getOperationName** <br>This function returns the operation name for the given operation server uuid.|{String} **operationServerUuid** uuid of the operation server instance. |{promise} returns operation name of the operation server instance.| 
|**getOperationKey** <br>This function returns the operation key of the operation server. |{String} **operationServerUuid** uuid of the operation server. |{promise} returns the operation key.| 
|**setOperationKey** <br>This function sets the operation key of the operation server. |{String} **operationServerUuid** uuid of the operation server <br>{String} **operationKey** operation key that needs to be updated. |{promise} returns true if the operation is successful.|
|**getLifeCycleState** <br>This function returns the life-cycle-state for the given operation server uuid. |{String} **operationServerUuid** uuid of the operation server instance. |{promise} returns life-cycle-state of the operation server instance.| 
|**getOperationServerUuidFor** <br>TheOperationName This function returns the operation server uuid for the given operation name. |{String} **operationName** operation name of the operation server. |{promise} returns operation server uuid.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **TcpClientInterface.js**

([top &uarr;](#Outline)) This class provides a stub to instantiate and generate a JSON object for a tcpClientInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the tcpClientInterfacePac:  
|![apd_image10](https://user-images.githubusercontent.com/57349523/153877949-9a74cb01-9299-4659-840e-c6749ad4d3d1.jpeg)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new tcp client layer protocol.|{string} **remoteAddress** tcp ipaddress where the application is hosted. <br>{string} **remotePort** tcp port where the application is running.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getTcpIpAddressAndPort** <br>This function returns the tcp ip address and port (in the format <ipaddress>:<port>) where the client application is running.|{String} **tcpClientUuid** uuid of the tcp client.|{promise} returns tcp ip address and port (in the format <ipaddress>:<port>).|  
|**getRemoteAddress** <br>This function returns the tcp ip address where the client application is running.|{String} **tcpClientUuid** uuid of the tcp client.|{promise} returns tcp ip address.|
|**getRemotePort** <br>This function returns the tcp port where the client application is running.|{String} **tcpClientUuid** uuid of the tcp client.|{promise} returns tcp port.| 
|**generateNextUuid** <br>This function generates the tcp-client uuid for the given http-client uuid.|{String} **httpClientUuid** uuid of the http-client-interface logical-termination-point.|{promise} returns the tcp-client uuid generated for the given http-client uuid.| 
|**createTcpClientInterfaceAnd** <br>AddtoLogicalTerminationPoint This function creates a new tcp-client-interface and update the created instance to the logical-termination-point list.|{String} **httpClientUuid** http-client uuid for the application for which we are going to create the tcp-client-interface. <br>{String} **tcpClientUuid** tcp-client uuid to create the new tcp-client instance. <br>{String} **ipv4Address** ipaddress where the application is hosted. <br>{String} **port** where the application is running.|{promise} returns true if the tcp-client interface is created.|
|**setTcpRemoteAddressAndPortForTheUuid** <br>This function modifies the tcp-client remote-address and remote-port for the provided tcp client uuid.|{String} **tcpClientUuid** uuid of the tcp-client. <br>{String} **remoteAddress** that needs to be modified. <br>{String} **remotePort** that needs to be modified.|{promise} returns true if the value is updated or return false.|
  
![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

#### **HttpClientInterface.js**

([top &uarr;](#Outline)) This class provides a stub to instantiate and generate a JSON object for a httpClientInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the httpClientInterfacePac:  
|![apd_image11](https://user-images.githubusercontent.com/57349523/153877951-89662ee9-e66b-45d2-85ac-b37d6f90f59e.jpeg)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new HTTP client layer protocol.|{string} **applicationName** name of the client application. <br>{string} **releaseNumber** release number of the client application.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getApplicationName** <br>This function returns the application name for the HTTP client uuid.|{String} **httpClientUuid** uuid of the http-client-interface. |{promise} returns the application name.|
|**getReleaseNumber** <br>This function returns the release number for the HTTP client uuid.|{String} **httpClientUuid** uuid of the http-client-interface. |{promise} returns the release number.| 
|**setReleaseNumber** <br>This function sets the release number for the HTTP client uuid.|{String} **httpClientUuid** uuid of the http-client-interface. <br>{String} **newReleaseNumber** new release number of the http-client-interface. |{promise} returns true if the value is set.| 
|**generateNextUuid** <br>This function returns the next available uuid for the http-client-interface.||{promise} returns the next free uuid instance that can be used for the http-client-interface ltp creation.| 
|**getHttpClientUuidForTheApplicationAndReleaseNumber** <br>This function returns the uuid of the http-client-interface for the application-name and release-number.|{String} **applicationName** name of the application. <br>{String} **releaseNumber** release number of the application.|{promise} returns HTTP logical-termination-point uuid or undefined incase if there is no match found.| 
|**getHttpClientUuidForTheApplicationName** <br>This function returns the uuid of the http-client-interface for the application-name and release-number.|{String} **applicationName** name of the application. <br>{String} **releaseNumber** release number of the application.|{promise} returns HTTP logical-termination-point uuid or undefined incase if there is no match found.| 
|**createHttpClientInterfaceAndAddtoLogicalTerminationPoint** <br>This function creates a new http-client-interface and update the created instance to the logical-termination-point list.|{String} **httpClientUuid** HTTP client unique identifier for the new application. <br>{String} **operationClientUuidList** associated services for the application. <br>{String} **tcpClientUuid** tcp client uuid that provides information about the ip address and portnumber of the application. <br>{String} **applicationName** name of the application. <br>{String} **releaseNumber** release number of the application.|{promise} returns true if the http-client interface is created.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**_OperationClientInterface.js_**

This class provides a stub to instantiate and generate a JSON object for an operationClientIInterface layer protocol. This class is a sub class for LayerProtocol. This class has the following model that represents the operationClientInterfacePac:  
|![apd_image12](https://user-images.githubusercontent.com/57349523/153877952-aa9eb063-9936-4a4b-b79e-30091e6a82bb.jpeg)|
|---|


*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new operation client layer protocol.|{string} **operationName** operation name of the client 
that needs to be called back.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getOperationName** <br>This function returns the operation name of the operation client.|{String} **operationClientUuid** uuid of the operation client.|{promise} returns the operation name.| 
|**getOperationKey** <br>This function returns the operation key of the operation client.|{String} **operationClientUuid** uuid of the operation client.|{promise} returns the operation key.|
|**setOperationKey** <br>This function sets the operation key of the operation client.|{String} **operationClientUuid** uuid of the operation client. <br>{String} **operationKey** operation key that needs to be updated.|{promise} returns true if the operation is successful.| 
|**getTcpIpAddressAndPortForTheOperationClient** <br>This function returns the tcp ip address and port where the application that provides the operation-client operation is running.|{String} **operationClientUuid** uuid of the operation.|{promise} returns the tcp ip address and port where the application that provides the operation-client operation is running.| 
|**getOperationClientUuidFor** <br>TheOperationName This function returns the operation client uuid information for the given http-client uuid and operation name.|{String} **httpClientUuid** uuid of the http-client. <br>{String} **operationName** name of the operation.|{promise} returns the operation client uuid for the operation name.| 
|**generateNextUuid** <br>This function generates the operation client uuid for the given HTTP client uuid and operation name.|{String} **httpClientUuid** uuid of the HTTP client logical termination point. <br>{String} **operationName** operation name of the operation client.|{promise} returns the operation client uuid generated for the given HTTP uuid.| 
|**createOperationClientInterfaceAndAddtoLogicalTerminationPoint** <br>This function creates a new http-client-interface and update the created instance to the logical-termination-point list.|{String} **httpClientUuid** http-client unique identifier for the new application in which the operation exists. <br>{String} **operationClientUuid** operation-client uuid for the new operation. <br>{String} **operationName** name of the operation.|{promise} returns true if the operation-client interface is created.|
|**setOperationNameForTheUuid** <br> This function modifies the operation name for the provided operation client uuid.|{String} **operationClientUuid** uuid of the operation-client. <br>{String} **operationName** name of the operation.|{promise} returns true if the value is updated or return false.|
  
![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### Profiles

([top &uarr;](#Outline)) This package consists of a list of sub classes for the profile class.

#### **Application Profile.js**

This class provides a stub to instantiate and generate a JSON object for a ApplicationProfile. This class is a sub class for profile. This Application profile is being utilized by TypeApprovalApplication to store the application's approval status. This class has the following model that represents the applicationProfilePac.  
|![apd_image13](https://user-images.githubusercontent.com/57349523/153877955-3bbdc473-7aba-4a01-97a5-b6bd73379195.jpeg)|
|---|

*Constructor summary*:
|**Constuctor and description**|**parameters**|
|---|---|
|This instantiates a new application profile.|{string} **applicationName** name of the client application. <br>{string} **releaseNumber** release number of the client application. <br>{string} **approvalStatus** approval status of the client application.|

*Method Summary*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**getApprovalStatusForTheUuid** <br>This function returns the approval status for the provided application profile uuid.|{String} **uuid** of the application profile.|{promise} returns the approval status.|
|**getApplicationNameForTheUuid** <br> This function returns the application name for the provided application profile uuid.|{String} **uuid** of the application profile.|{promise} returns the application name.| 
|**getApplicationReleaseNumberForTheUuid** <br> This function returns the application release number for the provided application profile uuid.|{String} **uuid** of the application profile.|{promise} returns the application release number.| 
|**getApprovalStatus** <br> This function returns the approval status for the provided application and release number.|{String} **applicationName** name of the application <br>{String} **releaseNumber** release number of the application.|{promise} returns the approval status.| 
|**getProfileUuid** <br> This function returns the approval status for the provided application and release number.|{String} **applicationName** name of the application <br>{String} **releaseNumber** release number of the application.|{promise} returns the approval status.| 
|**isProfileExists** <br> This function returns true if a profile exists for the provided application and release number.|{String} **applicationName** name of the application. <br>{String} **releaseNumber** release number of the application.|{promise} returns true if the profile exists.| 
|**setApprovalStatus** <br> This function sets the approval-status for the provided application-name and release-number.|{String} **applicationName** name of the application. <br>{String} **releaseNumber** release number of the application. <br>{String} **approvalStatus** approval status of the application.|{promise} returns true if the value is set.| 
|**createProfile** <br> This function creates a new application profile.|{String} **profileName** name of the profile <br>{array} **profileAttributes** list of attributes for the profile creation.|{promise} returns uuid of the created profile.| 
|**generateNextUuid** <br> This function returns the next available uuid of the application-profile.||{promise} returns the next free uuid instance that can be used for the application profile creation.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### Services 

#### **LogicalTerminationPointService.js**

([top &uarr;](#Outline)) This module provides functionality to manipulate the logical termination point. For example, to instantiate client instances for a new application in the LOADfile, this module provides a service 
called "createLogicalTerminationPointInstanceGroup" which will instantiate the tcp, http, operation client instances for the new application and updates it to the logical-termination-point list.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**createLogicalTerminationPointInstanceGroup** <br>This function creates the tcp, http, operation client instances (if it doesn’t exist) and link them together.|{String} applicationName name of the client application. <br>{String} releaseNumber release of the client application.<br>{String} ipv4Address ip address of the client application. <br>{String} port of the client application. <br>{array} operationList list of operation client that needs to be created.|{object} operationClientUuid InformationInstance returns the generatedoperation client information.| 
|**updateLogicalTerminationPointInstanceGroup** <br>This function updates the tcp, http, operation client instances that linked together with the new values provided in the input|{String} applicationName name of the client application <br>{String} releaseNumber release of the client application <br>{String} ipv4Address ip address of the client application <br>{String} port of the client application <br>{array} operationList list of operation client that needs to be created|{promise} return true if the value is updated, otherwise returns false.|
|**deleteLogicalTerminationPointInstanceGroup** <br>This function deletes the tcp, http, operation client for the provided application and release number|{String} applicationName name of the client application <br>{String} releaseNumber release of the client application|{Promise} returns the deleted OperationClientLists associated to the application.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)

**_ForwardingConstructServices.js_**

This module provides functionality to configure, unconfigure and automate the ForwardingConstruct.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**configureAndAutomateForwardingConstruct** <br>This function configures the forwarding construct based on the provided new operation client information and automates the already existing forwarding construct.|{String} **serviceType** service type can be basic or individual. <br>{String} **operationServerUuid** operation server uuid of the request url. <br>{String} **forwardingConstructConfigurationList** list of operation uuid along with the forwarding name that needs to be modified. <br>{list} **attributeList** list of attributes required during forwarding construct automation (to send in the request body). <br>{String} **user** who initiates this request. <br>{string} **xCorrelator** flow id of this request.<br>{string} **traceIndicator** trace indicator of the request. <br>{string} **customerJourney** customer journey of the request.||
|**unConfigureAndAutomateForwardingConstruct** <br>This function removes the configured operation clients in the forwarding construct based on the provided operation client information and automates the forwarding construct.|{String} **serviceType** service type can be basic or individual. <br>{String} **operationServerUuid** operation server uuid of the request url. <br>{String} **operationClientUuidLists** list of operation client uuids that needs to be deleted. <br>{list} **attributeList** list of attributes required during forwarding construct automation (to send in the request body). <br>{String} **user** who initiates this request.<br>{string} **xCorrelator** flow id of this request. <br>{string} **traceIndicator** trace indicator of the request. <br>{string} **customerJourney** customer journey of the request.||

#### **Utility**

([top &uarr;](#Outline)) 

**_ONfAttributeFormatter.js_**

This module provides functionalities that converts the attributes to ONF CoreModel format.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**modifyJSONObjectKeysToKebabCase** <br>This function modifies the JSON object keys from lower camelCase to kebabCase.|{Object} *JSONObject* JSON object for which the keys need to be modified to kebabCase.|{Object} modified JSON object in kebabcase.

[Up to Application Pattern Documentation](ApplicationPatternDocumentation.md)
