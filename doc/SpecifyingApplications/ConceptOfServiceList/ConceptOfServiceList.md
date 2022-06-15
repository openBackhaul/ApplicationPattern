# ServiceList

The ServiceList is a compact notation for designing the service names and alocating the uuids.  
It provides full focus on composing a complete and well-structured set of services before adding parameter and body datails in the OpenApiSpecification.  

The latest [template for the ServiceList](https://github.com/openBackhaul/ApplicationPattern/blob/develop/ApplicationPattern+services.yaml) can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**


### HTTP and TCP Server

* Release number has to follow the concept of semantic versioning.
  * New applications get 1.0.0. 
  * Bugfixes and updates, which do not add functionality have to increment the last digit.
  * Releases adding minor and backward compatible functionality have to increment the second digit.
  * Major updates, particularly if containing non-backward compatible changes have to increment the first digit.
* IP address and TCP port will be asigned by the platform owner. Please, request for an address.


### Operation Servers

* Services, which shall be provided by the new application, have to be added into the section operation-servers/service/individual.
* While brainstorming new OperationServers, think about ...
  * the services, which shall be provided to other applications,
  * different styles of responses (e.g. filtered, formatted, compressed, generic representation)
  * potentially required inversions (e.g. ending subscriptions, de-activation of some automation) or restoring the original state
  * parameters or functionality, which needed to be pre-configured at this application,
  * data that shall be available as a data base dump.
* While defining the individual services, think carefully about substructuring and other aspects discussed in [Structuring of Services](../StructureOfServices/StructureOfServices.md).
* While naming the individual services, be as descriptive as possible and follow the recommendations made in [Structuring of Service Names](../StructureOfServiceNames/StructureOfServiceNames.md).
* The order of the services shall support understanding the purpose of the individual service while reading through the API description.
  * Reflecting the expected sequence of appliance of the services might be helpful.
  * Grouping services, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* Sleep over, double check the definitions and probably discuss them with a colleague.
* As a last step, assign the UUIDs. They shall start with "op-s-" to indicate that it identifies an OperationServer. The consequent number shall start counting at 3000. It must be unique within the scope of the individual application, but it does not necessarily need to be sequencial.


### Planing Clients

* OperationClients, which are required for embedding into the microservice management, need not to be planned. They will just be copied.
* While brainstorming OperationClients, think about ...
  * problems or calculations that have already been solved in existing implementations
  * input data, which is needed,
  * event notifications, which need to be subscribed for triggering activities,
  * additional services, which are needed for inverting originally wished conditions (e.g. stop subscription) or for restoring an original or default state
* Knowing the existing services is crucial for efficient microservice specification. It is very much recommended to use e.g. the GenericRepresentation application to brows the API descriptions of existing implementations
* While considering consumption of data provided by other applications, take special care for 
  * exact meaning of the provided attributes
  * update period of the provided information
  * life cycle state of the consumed service (e.g. obsolete services will be discontinued soon)


### HTTP and TCP Clients

* It is recommended to update the HTTP and TCP Clients in the ServiceList before adding the OperationClients.
* **Do not delete the HTTP and TCP Clients with UUID sequence numbers lower than 2300**. These Clients are required for embedding the application into the microservice management environment.
* The HTTP and TCP Clients holding the OperationClients listed during the brainstorming shall be added. Take care for correct application names and latest release numbers.
* Ask platform owner for latest IP addresses and TCP ports.
* It would be helpful, if the sequence of HTTP and TCP Clients would be the same accross all applications. So please, look into one or several existing ServiceLists or CONFIGfiles and maybe even copy.
* In principle, UUIDs of clients could differ from application to application, but live would be easier, if the numbers would be identical accross all applications. So maybe just copy from existing ServiceLists of CONFIGfiles.


### Operation Clients

* OperationClients get categorized.
* It is not expected that ApplicationOwners will have to add OperationClients into the OwnOam section. These should be covered by the ApplicationPattern definitions.
* The Service section distinguishes OperationClients, which are addressing all existing applications in the same way (basic), and OperationClients, which are addressing individual applications (individual).
* Example for basic OperationClients: The request for sending notification about OaM activities is send by the OamLog application to all other applications.
* It is rather unlikely that ApplicationOwners will have to define an  OperationClient into the basic section.
* So, most likely all the OperationClients from the brainstorming have to be added into the operation-clients/service/individual section. Take care for correct service names.
* The order of the services shall support understanding the purpose of the individual service.
  * Reflecting the expected sequence of appliance of the services might be helpful.
  * Grouping services, which are either doing similar stuff or are for inverting some condition, might also ease understanding.
* As a last step, assign the UUIDs. They shall start with "op-c-" to indicate that they are identifying an OperationClient. The consequent number of an individual service shall start with 3. The next two digits have to be identical with the second and third digit of the UUID of the HTTP Client. The last digit is for counting, but it does not necessarily need to be sequencial.


### Validation

It is planned to support automatically transferring the content of the ServiceList into the OpenApiSpecification in future.
Proper YAML files are required for facilitating such tool support.
It is recommended to validate the ServiceList.yaml for proper YAML syntax before publishing.
This could be done by copying the content of the file into the [YAML Validator](https://jsonformatter.org/yaml-validator).
