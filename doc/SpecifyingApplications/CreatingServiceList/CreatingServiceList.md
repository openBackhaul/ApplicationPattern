# Creating the ServiceList

This is a step by step cookbook for creating the ServiceList.  

**Please, read the background information about the [Concept of the ServiceList](../ConceptOfServiceList/ConceptOfServiceList.md) before working in the ServiceList.**   
**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**


### File Handling

* Assure that there is a copy of the latest [template for the ServiceList](https://github.com/openBackhaul/ApplicationPattern/blob/develop/ApplicationPattern+services.yaml) in the develop branch of your application's repository. The latest ApplicationPattern+services.yaml can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.


### General

* Re-using already existing services for avoiding redundant code is very much recommended.
* Information about existing applications can be found e.g. in the GenericRepresentationApplication.
* In case clarification about existing services would be needed, the responsible ApplicationOwner has to be addressed for complementing the documentation of his application.


### HTTP and TCP Server

* Replace "## OwnApplicationName" by the official name of the application.
* Replace "## OwnReleaseNumber (e.g. 0.0.1)" by the official release number.
* Replace "## OwnIpAddress" by the expected IP address.
* Replace "## OwnTcpPort" by the expected TCP port.


### OperationServers

* Replace "## Services specific to this application" by the OperationServers that shall be provided by the application.
  * Add the following two lines for every service the application shall provide:  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to [structure of service names](../StructureOfServiceNames/StructureOfServiceNames.md).
  * Put them into a reasonable order.
  * Fill in UUIDs according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).


### OldRelease and NewRelease

* Replace "## Number of Release to be substituted (e.g. 0.0.1)" by the official release number of the operational version of the application. In case of new applications, put the same value as in "## OwnReleaseNumber (e.g. 0.0.1)" from above.
* Replace "## IpAddress of Release to be substituted" by the IP address of the operational version of the application.
* Replace "## TcpPort of Release to be substituted" by the TCP port of the operational version of the application.
* Replace "## Number of substituting Release (e.g. 0.0.2)" by the same value as in "## OwnReleaseNumber (e.g. 0.0.1)" from above.
* Replace "## IpAddress of substituting Release" by the same value as in "## OwnIpAddress" from above.
* Replace "## TcpPort of substituting Release by the same value as in "## OwnTcpPort" from above.
* Replace "## Services required for handing-over configuration or data during update" by OperationsClients at the OldRelease, which are required for addressing OperationServers at the NewRelease to handover configuration and data.
  * Add the following two lines for every service client that shall be defined:  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to OperationServer definitions from above.
  * Put them into execution sequence.
  * Fill in UUIDs starting with "op-c-101" and add a sequence number.


### From RegistryOffice to OperationKeyManagement

* If your application would address all other applications including the ones forming the TinyApplicationController at the same OperationServer (which is very unlikely), 
  * "## Clients specific to this application, but addressing all other applications" would have to be replaced by the usual two lines for defining a service client at all applications of the TinyApplicationController:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which is identically available at all applications.
  * Fill in a UUID starting with "op-c-2", followed by two digits that are identifying the application and a sequence number.
* If your application would _not_ address all other applications at the same OperationServer (which is very likely), the "## Clients specific to this application, but addressing all other applications" needs to be deleted throughout the entire ServiceList.
* If your application would address one or several applications of the TinyApplicationController, 
  * "## Clients specific to this application" would have to be replaced by the usual two lines for defining a service client at the affected applications of the TinyApplicationController:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
    * Fill in a UUID starting with "op-c-3", followed by two digits that are identifying the application and a sequence number.
* "## Clients specific to this application" has to be deleted at all other applications of the TinyApplicationController.
  

### Further OperationClients

* If further applications would have to be addressed, create additional entries into the clients list.  
* Take the last entry as a template (and delete it, if no longer needed).  
* Start with specifying the http and tcp clients.
  * Replace "## Name of application to be addressed" by the official name of the application, which shall be addressed.
  * Replace "## Release number of application to be addressed" by the number of the operational release.
  * Replace "## UUID of the HttpClient" by a string 
    * starting with "http-c-"
    * followed by one digit indicating the highest class of service consumed at the application ("2" for basic service, "3" for individual service)
    * followed by a two digit sequence number, which is unique for the individual application and centrally administrated for that reason.
    * followed by a "0".
  * Replace "## IP address of application to be addressed" by the IP address of the application to be addressed.
  * Replace "## TCP port of application to be addressed" by the TCP port of the application to be addressed.
  * Replace "## UUID of the TcpClient" by a string 
    * starting with "tcp-c-"
    * followed by the same four digit number applied for the UUID of the HttpClient.
* If some service would be consumed from one or several, but not all other applications, it shall be listed in the _operation-clients/service/individual_ section; replace "## Clients specific to this application" by the usual two lines for defining a service client:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID 
    * starting with "op-c-"
    * followed by "3" indicating that an individual service gets addressed
    * followed by the same two digit sequence number, which is unique for the individual application, like at the HttpClient
    * followed by a sequence number starting at "0" and incrementing for every additional individual service to be addressed at the same application.
* In the extremely unlikely case that the application is addressing the same service at all other applications, the "## Clients specific to this application, but addressing all other applications" has to be replaced by the usual two lines for defining a service client:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID 
    * starting with "op-c-"
    * followed by "2" indicating that a basic service gets addressed
    * followed by the same two digit sequence number, which is unique for the individual application, like at the HttpClient
    * followed by a sequence number starting at "0" and incrementing for every additional basic service to be addressed at the same application.


### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ServiceList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ServiceList is fine, if YAML validator indicates "Valid YAML!"
