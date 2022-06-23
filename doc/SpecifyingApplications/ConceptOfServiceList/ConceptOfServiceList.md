# Concept of the ServiceList

The ServiceList is a compact notation for designing the service names and allocating the uuids.  
It provides full focus on composing a complete and well-structured set of services before adding parameter and body details in the OpenApiSpecification.  

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   


### HTTP and TCP Server

* The application name must be identical with the one stated in the repository.
* The release number has to follow the concept of semantic versioning.
  * New applications get 1.0.0. 
  * Bugfixes and updates, which do not add functionality have to increment the last digit.
  * Releases adding minor and backward compatible functionality have to increment the second digit.
  * Major updates, particularly if containing non-backward compatible changes have to increment the first digit.
  * The release number has to identify the version resulting from the specification. If originally planned to fix some bugs and later decided to add functionality the release number has to be adapted accordingly.
* IP address and TCP port will be assigned by the platform owner. Please, request for an address.


### Operation Servers

* Services, which shall be provided by the new application, have to be added into the section _operation-servers/service/individual_.
* While brainstorming new OperationServers, think about ...
  * the services, which shall be provided to other applications,
  * different styles of responses (e.g. filtered, formatted, compressed, generic representation),
  * potentially required inversions (e.g. ending subscriptions, de-activation of some automation) or restoring the original state,
  * parameters or functionality, which need to be pre-configured at this application,
  * data that shall be available as a data base dump.
* While defining the individual services, think carefully about substructuring and other aspects discussed in [Structuring of Services](../StructureOfServices/StructureOfServices.md).
* While naming the individual services, be as descriptive as possible and follow the recommendations made in [Structuring of Service Names](../StructureOfServiceNames/StructureOfServiceNames.md).
* The order of the services shall support understanding the purpose of the individual service while reading through the API description.
  * Reflecting the expected sequence of appliance of the services might be helpful.
  * Grouping services, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* Sleep over, double check the definitions and probably discuss them with a colleague.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md) and contain "op-s-" to indicate that they are identifying an OperationServer.


### Planning Clients

* OperationClients required for embedding into the microservice management, need not to be planned. They will just be copied.
* While brainstorming OperationClients, think about ...
  * problems or calculations that have already been solved in existing implementations,
  * input data, which is needed,
  * event notifications, which need to be subscribed for triggering activities,
  * additional services, which are needed for inverting originally desired conditions (e.g. stop subscription) or for restoring an original or default state,
* Knowing the existing services is crucial for efficient microservice specification. It is very much recommended to use e.g. the GenericRepresentation application to brows the API descriptions of existing implementations
* While considering consumption of data provided by other applications, take special care for 
  * exact meaning of the provided attributes
  * update period of the provided information
  * life cycle state of the consumed service (e.g. obsolete services will be discontinued soon)


### HTTP and TCP Clients

* It is recommended to update the HTTP and TCP Clients in the ServiceList before adding the OperationClients.
* **Do not delete the HTTP and TCP Clients with UUIDs containing numbers lower than 2300**. These Clients are required for embedding the application into the microservice management environment.
* The HTTP and TCP Clients holding the OperationClients listed during the brainstorming shall be added. Take care for correct application names and latest release numbers.
* Ask the platform owner for latest IP addresses and TCP ports.
* It would be helpful, if the sequence of HTTP and TCP Clients would be the same accross all applications. So please, take a look into the defintion of the ApplicationNumber in [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md) and put the HTTP and TCP Clients into the same order.
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md) and contain "http-c-"/"tcp-c-" to indicate that they are identifying an HTTP, respectively TCP Client. In most cases it makes sense to just copy the UUIDs from existing ServiceLists or CONFIGfiles.


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
* As a last step, assign the UUIDs. They shall follow the specifications made in [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md) and contain "op-c-" to indicate that they are identifying an OperationClient.


### Validation

It is planned to support automatical transfer the ServiceList content into the OpenApiSpecification in future.
Proper YAML files are required for facilitating such tool support.
It is recommended to validate the ServiceList.yaml for proper YAML syntax before publishing.
This could be done by copying the content of the file into the [YAML Validator](https://jsonformatter.org/yaml-validator).
