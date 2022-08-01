# Concept of the ServiceList

The ServiceList is a compact notation for designing the service names and allocating the UUIDs.  
It provides full focus on composing a complete and well-structured set of services before adding parameter and body details in the OpenApiSpecification.  

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   


### HTTP and TCP Server

* The application name must be identical with the one stated in the repository.
* The release number ...
  * has to follow the definitions in [Structure of Release Numbers](../../ElementsApplicationPattern/StructureOfReleaseNumbers/StructureOfReleaseNumbers.md),
  * has to identify the version resulting from the specification (if originally planned to fix some bugs and later decided to add functionality the release number has to be changed accordingly).
* IP address and TCP port will be assigned by the platform owner. Please, request for an address and look it up at [Fake TCP/IP addresses](../../TestingApplications/Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md).


### Operation Servers

* Services, which shall be provided by the new application, have to be added into the section _operation-servers/service/individual_.
* While brainstorming new OperationServers, think about ...
  * the services, which shall be provided to other applications,
  * different styles of responses (e.g. filtered, formatted, compressed, generic representation),
  * potentially required inversions (e.g. ending subscriptions, de-activation of some automation) or restoring the original state,
  * parameters or functionality, which need to be pre-configured at this application,
  * data that shall be available as a data base dump.
* While defining the individual services, think carefully about sub-structuring and other aspects discussed in [Structuring of Services](../../ElementsApplicationPattern/StructureOfServices/StructureOfServices.md).
* While naming the individual services, be as descriptive as possible and follow the recommendations made in [Structuring of Service Names](../../ElementsApplicationPattern/StructureOfServiceNames/StructureOfServiceNames.md).
* The order of the services shall support understanding the purpose of the individual service while reading through the API description.
  * Reflecting the expected sequence of appliance of the services might be helpful.
  * Grouping services, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* Sleep over, double check the definitions and probably discuss them with a colleague.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/StructureOfUuids/StructureOfUuids.md) and contain "op-s-" to indicate that they are identifying an OperationServer. The consequent number shall start counting at 3001. It must be unique within the scope of the individual application, but it does not necessarily need to be sequential.


### Planning Clients

* OperationClients required for embedding into the microservice management, need not to be planned. They will just be copied.
* While brainstorming OperationClients, think about ...
  * problems or calculations that have already been solved in existing implementations,
  * input data, which is needed,
  * event notifications, which need to be subscribed for triggering activities,
  * additional services, which are needed for inverting originally desired conditions (e.g. stop subscription) or for restoring an original or default state,
* Knowing the existing services is crucial for efficient microservice specification. It is very much recommended to use e.g. the GenericRepresentation application to browse the API descriptions of existing implementations
* While considering consumption of data provided by other applications, take special care for 
  * exact meaning of the provided attributes
  * update period of the provided information
  * life cycle state of the consumed service (e.g. obsolete services will be discontinued soon)


### HTTP and TCP Clients

* It is recommended to update the HTTP and TCP Clients in the ServiceList before adding the OperationClients.
* **Do not delete the HTTP and TCP Clients with UUIDs containing numbers lower than 2300**. These Clients are required for embedding the application into the microservice management environment.
* The HTTP and TCP Clients holding the OperationClients listed during the brainstorming shall be added. Take care for correct application names and latest release numbers.
* Ask the platform owner for latest IP addresses and TCP ports.
* It would be helpful, if the sequence of HTTP and TCP Clients would be the same across all applications. So please, take a look into the definition of the ApplicationNumber in [Structure of UUIDs](../../ElementsApplicationPattern/StructureOfUuids/StructureOfUuids.md) and put the HTTP and TCP Clients into the same order.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/StructureOfUuids/StructureOfUuids.md) and contain "http-c-"/"tcp-c-" to indicate that they are identifying an HTTP, respectively TCP Client. In most cases it makes sense to just copy the UUIDs from existing ServiceLists or CONFIGfiles.


### Operation Clients

* OperationClients get categorized.
* It is not expected that ApplicationOwners will have to add OperationClients into the OwnOam section. These should be covered by the ApplicationPattern definitions.
* The Service section distinguishes OperationClients, which are addressing all existing applications in the same way (basic), and OperationClients, which are addressing individual applications (individual).
* Example for basic OperationClients: The request for sending notification about OaM activities is send by the OamLog application to all other applications.
* It is rather unlikely that ApplicationOwners will have to define an OperationClient into the basic section.
* So, most likely all the OperationClients from the brainstorming have to be added into the _operation-clients/service/individual_ section. Take care for correct service names.
* The order of the services shall support understanding the purpose of the individual service.
  * Reflecting the expected sequence of appliance of the services might be helpful.
  * Grouping services, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](../../ElementsApplicationPattern/StructureOfUuids/StructureOfUuids.md) and contain "op-c-" to indicate that they are identifying an OperationClient. The consequent number of an individual service shall start with 3. The next two digits have to be identical with the second and third digit of the UUID of the HTTP Client. The last digit is for counting, but it does not necessarily need to be sequential.


### Commenting

The template of the ServiceList is prepared in such a way that comments (## TODO:) have to be replaced by changes that are individual to the application under specification.  
If this initial concept would be followed, the ServiceList would be finalized as soon as all "## TODO:" would either be replaced or deleted.  
If someone would find it helpful to add his thoughts into the ServiceList, he would be free to add own comments, but these comments should not start with "TODO:" after finalizing the ServiceList.  
If someone would decide to add comments into the ServiceList, it would be strongly recommended to properly indent the additional lines.


### Validation

Supporting to automatically transfer the ServiceList content into the OpenApiSpecification is planned for the future.  
Proper YAML files are required for facilitating such tool support.  
It is recommended to validate the ServiceList.yaml for proper YAML syntax before publishing.  
This could be done by copying the content of the file into the YAML validator at [www.yamllint.com](http://www.yamllint.com/).  
