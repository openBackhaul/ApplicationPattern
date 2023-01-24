# Concept of the ServiceList

The _ServiceList_ is a compact notation for designing the _OperationNames_ and allocating the UUIDs.  
It provides full focus on composing a complete and well-structured set of _Operations_ before adding parameter and body details in the OpenApiSpecification.  

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   


### HttpServer and TcpServer

* The _ApplicationName_ must be identical with the one stated in the repository.
* The _ReleaseNumber_ ...
  * ... has to follow the definitions in [Structure of _ReleaseNumbers_](../../ElementsApplicationPattern/Names/StructureOfReleaseNumbers/StructureOfReleaseNumbers.md),
  * ... has to identify the version resulting from the specification (if originally planned to fix some bugs and later decided to add functionality the _ReleaseNumber_ has to be changed accordingly).  
* The CONFIGfile contains all data that is necessary to establish the connections, which are required for properly operating the application. TCP/IP addresses, _OperationNames_ and _ReleaseNumber_ might depend on the environment (e.g. SDN test laboratory or live network) in which the application gets instantiated in. As a consequence the CONFIGfile has to be adapted to the environment before instantiation. This adaption shall be automated. For supporting the automation, fake IP addresses have to be put into the _ServiceList_ during specification. Fake IP addresses will be replaced by environmental specific addresses during the creation of docker image. New IP addresses and TCP ports will be assigned by the _PlatformOwner_. Please, request for an address and look it up at [Fake TCP/IP addresses](../../TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IpAddresses.md).


### OperationServers

* _Operations_, which shall be provided by the new application, have to be added into the section _operation-servers/service/individual_.
* While brainstorming new _OperationServers_, think about ...
  * the _Operations_, which shall be provided to other applications,
  * different styles of responses (e.g. filtered, formatted, compressed, generic representation),
  * potentially required inversions (e.g. ending subscriptions, de-activation of some automation) or restoring the original state,
  * parameters or functionality, which need to be pre-configured at this application,
  * data that shall be available as a data base dump.
* While defining the individual _Operations_, think carefully about sub-structuring and other aspects discussed in [Structuring of _Operations_](../../ElementsApplicationPattern/Functions/StructureOfServices/StructureOfServices.md).
* While naming the individual _Operations_, be as descriptive as possible and follow the recommendations made in [Structuring of _OperationNames_](../../ElementsApplicationPattern/Names/StructureOfServiceNames/StructureOfServiceNames.md).
* The order of the _Operations_ shall support understanding the purpose of the individual _Operation_ while reading through the API description.
  * Reflecting the expected sequence of appliance of the _Operations_ might be helpful.
  * Grouping _Operations_, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* Sleep over, double check the definitions and probably discuss them with a colleague.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### Planning Clients

* The subset of _OperationClients_, which are required for embedding into the microservice management, need not to be planned. They will just be copied.  
* While brainstorming the individual _OperationClients_, think about ...  
  * problems or calculations that have already been solved in existing implementations,  
  * input data, which is needed,  
  * event notifications, which need to be subscribed for triggering activities,  
  * additional _Operations_, which are needed for inverting originally desired conditions (e.g. stop subscription) or for restoring an original or default state,  
* Knowing the existing _Operations_ is required for efficient microservice specification. It is very much recommended to use e.g. the GenericRepresentation application to browse the API descriptions of existing implementations.  
* While considering consumption of data provided by other applications, take special care for  
  * exact meaning of the provided attributes  
  * update period of the provided information  
  * life cycle state of the consumed _Operation_ (e.g. obsolete _Operations_ will be discontinued soon)  


### HttpClients and TcpClients

* It is recommended to update the _HttpClients_ and _TcpClients_ in the _ServiceList_ before adding the _OperationClients_.
* **Do not delete the _HttpClients_ and _TcpClients_ supporting _OperationClients_ with UUIDs containing ApiSegments _bm_ or _bs_**. These clients are required for embedding the application into the microservice layer.
* The _HttpClients_ and _TcpClients_ holding the _OperationClients_ listed during the brainstorming shall be added. Take care for correct application names and latest _ReleaseNumbers_.
* Please, find the latest [Fake TCP/IP addresses](../../TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IpAddresses.md), which have to be applied here, for later replacement.
* It would be helpful, if the sequence of _HttpClients_ and _TcpClients_ would be the same across all applications. So please, take a look into existing specifications (e.g. RegistryOffice, TypeApprovalRegister) and put the _HttpClients_ and _TcpClients_ into the same order.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md). In most cases it makes sense to just copy the UUIDs from existing _ServiceLists_ or _CONFIGfiles_.


### OperationClients

* _OperationClients_ get categorized.
* It is not expected that _ApplicationOwners_ will have to add _OperationClients_ into the OwnOam section or the basic category. These should be covered by the _ApplicationPattern_ definitions.
* So, most likely all the _OperationClients_ from the brainstorming have to be added into the _operation-clients/service/individual_ section. Take care for correct _OperationNames_.
* The order of the _Operations_ shall support understanding the purpose of the individual _Operation_.
  * Reflecting the expected sequence of appliance of the _Operations_ might be helpful.
  * Grouping _Operations_, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### ElasticSearchClients

* In case the application is expected to create a lot of internal data, it is better to write it into a database instead of a datafile.  
* An _ElasticSearchClient_ shall be used for documenting the REST connection to the database.  
* The latest template of the _ServiceList_ is containing such an _ElasticSearchClient_.  
* It just has to be completed by a [Fake Index Alias from the List](../../TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IndexAliases.md). Potentially, the _PlatformOwner_ has to be asked to add another Fake Index Alias to the list.
* If connecting a database would not be required, the _ElasticSearchClient_ has to be deleted from the _ServiceList_.  


### Commenting

The template of the _ServiceList_ is prepared in such a way that comments (## TODO:) have to be replaced by changes that are individual to the application under specification.  
If this initial concept would be followed, the _ServiceList_ would be finalized as soon as all "## TODO:" would either be replaced or deleted.  
If someone would find it helpful to add his thoughts into the _ServiceList_, he would be free to add own comments, but these comments should not start with "TODO:" after finalizing the _ServiceList_.  
If someone would decide to add comments into the _ServiceList_, it would be recommended to properly indent the additional lines.


### Validation

Automatically transferring the content of the _ServiceList_ into the OpenApiSpecification is planned for the future.  
Proper YAML files are required for facilitating such tool support.  
Please, regard the test results of the YAML linting in the _Pull-Request_ and correct the syntax, if errors are indicated (warnings need not to be regarded).  
