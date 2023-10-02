# Creating the ServiceList

This is a step by step cookbook for creating the  _ServiceList_.  

**Please, read the background information about the [Concept of the  _ServiceList_](../ConceptOfServiceList/ConceptOfServiceList.md) before working in the _ServiceList_.**   
**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**  


### Preparation  

* If not yet existing, create an _Issue_ for elaborating the _ServiceList_.  
* Open a local feature branch for elaborating the _ServiceList_.  


### File Handling  

* Assure that there is a copy of the latest [template for the  _ServiceList_](https://github.com/openBackhaul/ApplicationPattern/blob/develop/spec/ApplicationPattern+services.yaml) in the _develop_ branch of your application's repository. The latest ApplicationPattern+services.yaml can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop/spec).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.  


### General  

* Re-using already implemented function at other applications is very much recommended.  
* Information about existing applications can be found e.g. in the _GenericRepresentationApplication_.  
* In case clarification about existing _Operations_ would be needed, the responsible _ApplicationOwner_ has to be addressed for complementing the documentation of his application.  


### HttpServer and TcpServer  

* Add the official _ApplicationName_ and _ReleaseNumber_ of the application.  
* Add fake address from [official List](../../TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IpAddresses.md).  


### OperationServers  

* Add _OperationServers_ that are specific to this application.  
  * Add the following two lines for every _OperationServer_ the application shall provide:  
```
    - operation-name:
      uuid:
```
  * Fill in an _OperationName_ according to [structure of _OperationNames_](../../ElementsApplicationPattern/Names/StructureOfServiceNames/StructureOfServiceNames.md).  
  * Put them into a reasonable order.  
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  


### ElasticSearch  

* If connecting a database would be required, add official [Fake Index Alias from the List](../../TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IndexAliases.md).  
* Otherwise, just delete the _ElasticSearchClient_ from the _ServiceList_.  


### OldRelease  

* Add official _ReleaseNumber_ of the operational version of the application. In case of new application, put the same value as in _HttpServer_ above.  
* Add fake address of the operational version of the application. In case of new application, put the same value as in TcpServer above.  


### NewRelease  

* Add same value as in _HttpServer_ above as the substituting _ReleaseNumber_.  
* Add fake address from _TcpServer_ above as IP address and TCP port of the substituting release.  
* Add _OperationsClients_ that will be required for handing-over the configuration information to the _NewRelease_.  
  * Add the following two lines for every _OperationsClient_ that shall be defined:  
```
    - operation-name:
      uuid:
```
  * Fill in the _OperationName_ according to _OperationServer_ definitions from above.  
  * Put them into execution sequence.  
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  


### From RegistryOffice to OperationKeyManagement  

* If your application would address one or several applications of the _TinyApplicationController_,  
  * the following two lines for defining an _OperationClient_ have to be added into the individual service section of the affected applications of the _TinyApplicationController_:  
```
    - operation-name:
      uuid:
```
  * Fill in the _OperationName_, which shall be addressed.
  * Fill in UUIDs according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### Further OperationClients  

* If further applications would have to be addressed, create additional entries into the clients list.  
* Take the last entry as a template (and delete it, if no longer needed).  
* Start with specifying the HttpClients and TcpClients.  
  * Add the official _ApplicationName_ and _ReleaseNumber_ of the application, which shall be addressed, into the _HttpClient_.  
  * Add a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  
  * Add the fake address of the application to be addressed to the _TcpClient_.  
  * Add a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).  
* Add the usual two lines for defining an _OperationClient_ to the _operation-clients/service/individual_ section:  
```
    - operation-name:
      uuid:
```
  * Fill in the name of the _Operation_, which shall be addressed.
  * Fill in a UUID according to [structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md). 


### Validation and Finalization  

* Double check your _ServiceList_.  
* _Commit_ to your local feature branch.  
* _Push_ your local feature branch to the remote repository.  
* Create a _Pull-Request_.  
* Please, regard the test results of the YAML linting in the _Pull-Request_. Correct the syntax of the _ServiceList_, if errors are indicated (warnings need not to be regarded), and _commit_ and _push_ again until the _ServiceList_ in the remote repository is successfully validated.  
* Select a _Reviewer_ from the team.  
* Assign the _Pull-Request_ to yourself.  