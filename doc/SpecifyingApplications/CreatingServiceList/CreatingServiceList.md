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

* Add the official name and the official release number of the application.
* Add fake IP address and TCP port from [official List](../../TestingApplications/Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md).


### OperationServers

* Add OperationServers that are specific to this application.
  * Add the following two lines for every service the application shall provide:  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to [structure of service names](../../ElementsApplicationPattern/Names/StructureOfServiceNames/StructureOfServiceNames.md).
  * Put them into a reasonable order.
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### OldRelease

* Add official release number of the operational version of the application. In case of new application, put the same value as in HttpServer above.
* Add fake IP address and TcpPort of the operational version of the application. In case of new application, put the same value as in TcpServer above.


### NewRelease

* Add same value as in HttpServer above as the substituting release number.  
* Add fake IP address and TcpPort from TcpServer above as IpAddress and TcpPort of the substituting release.  
* Add OperationsClients that need to be configured at the OldRelease for addressing OperationServers at the NewRelease to handover configuration and data.  
  * Add the following two lines for every service client that shall be defined:  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to OperationServer definitions from above.  
  * Put them into execution sequence.  
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  


### From RegistryOffice to OperationKeyManagement

* If your application would address all other applications including the ones forming the TinyApplicationController at the same OperationServer (which is very unlikely),  
  * add the following two lines for defining a service client in the basic service sections of all applications of the TinyApplicationController:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which is identically available at all applications.  
  * Fill in a UUID starting with "op-c-2", followed by two digits that are identifying the application and a sequence number.  
* If your application would _not_ address all other applications at the same OperationServer (which is very likely), just delete the todo "Add Clients specific to this application, but addressing all other applications" throughout the entire ServiceList.  
* If your application would address one or several applications of the TinyApplicationController,  
  * the following two lines for defining a service client have to be added into the individual service section of the affected applications of the TinyApplicationController:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### Further OperationClients

* If further applications would have to be addressed, create additional entries into the clients list.  
* Take the last entry as a template (and delete it, if no longer needed).  
* Start with specifying the HTTP and TCP clients.  
  * Add the official name and release number of the application, which shall be addressed, into the HttpClient.  
  * Add a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  
  * Add the fake IP address and TCP port of the application to be addressed to the TcpClient.  
  * Add a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  
* If some service would be consumed from one or several, but not all other applications, it shall be listed in the _operation-clients/service/individual_ section; Add the usual two lines for defining a service client:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md). 
* In the extremely unlikely case that the application is addressing the same service at all other applications, the following two lines have to be added to the _operation-clients/service/basic_ section:  
```
    - service-name:
      uuid:
```
  * Fill in the name of the service, which shall be addressed.
  * Fill in a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md). 


### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ServiceList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ServiceList is fine, if YAML validator indicates "Valid YAML!"
