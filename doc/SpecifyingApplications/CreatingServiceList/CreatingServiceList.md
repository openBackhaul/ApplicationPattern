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
* Replace "## OwnReleaseNumber (e.g. 1.0.0)" by the official release number.
* Replace "## OwnIpAddress" by fake IP address from [official List](../../TestingApplications/Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md).
* Replace "## OwnTcpPort" by fake TCP port from [official List](../../TestingApplications/Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md).


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

* Replace "## Number of Release to be substituted (e.g. 1.0.0)" by the official release number of the operational version of the application. In case of new applications, put the same value as in "## OwnReleaseNumber (e.g. 1.0.0)" from above.
* Replace "## IpAddress of Release to be substituted" by fake IP address of the operational version of the application.
* Replace "## TcpPort of Release to be substituted" by fake TCP port of the operational version of the application.
* Replace "## Number of substituting Release (e.g. 2.0.0)" by the same value as in "## OwnReleaseNumber (e.g. 1.0.0)" from above.
* Replace "## IpAddress of substituting Release" by the same value as in "## OwnIpAddress" from above.
* Replace "## TcpPort of substituting Release" by the same value as in "## OwnTcpPort" from above.
* Replace "## Services required for handing-over configuration or data during update" by OperationsClients at the OldRelease, which are required for addressing OperationServers at the NewRelease to handover configuration and data.
  * Add the following two lines for every service client that shall be defined:  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to OperationServer definitions from above.
  * Put them into execution sequence.
  * Fill in UUIDs according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).


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
  * Fill in UUIDs according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).
* "## Clients specific to this application" has to be deleted at all other applications of the TinyApplicationController.
  

### Further OperationClients

* If further applications would have to be addressed, create additional entries into the clients list.  
* Take the last entry as a template (and delete it, if no longer needed).  
* Start with specifying the HTTP and TCP clients.
  * Replace "## Name of application to be addressed" by the official name of the application, which shall be addressed.
  * Replace "## Release number of application to be addressed" by the number of the operational release.
  * Replace "## UUID of the HttpClient" by a UUID according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md). 
  * Replace "## IP address of application to be addressed" by the fake IP address of the application to be addressed.
  * Replace "## TCP port of application to be addressed" by the fake TCP port of the application to be addressed.
  * Replace "## UUID of the TcpClient" by a UUID according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md). 
* If some service would be consumed from one or several, but not all other applications, it shall be listed in the _operation-clients/service/individual_ section; replace "## Clients specific to this application" by the usual two lines for defining a service client:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md). 
* In the extremely unlikely case that the application is addressing the same service at all other applications, the "## Clients specific to this application, but addressing all other applications" has to be replaced by the usual two lines for defining a service client:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md). 


### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ServiceList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ServiceList is fine, if YAML validator indicates "Valid YAML!"
