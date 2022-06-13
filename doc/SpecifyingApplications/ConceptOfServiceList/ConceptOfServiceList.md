# ServiceList

* Be aware that the template must not be altered outside the zones indicated by comments starting with '##'


### Preparing HTTP and TCP Server
* Release number has to semantic versioning.
  * New applications get 1.0.0. 
  * Bugfixes and updates, which do not add functionality have to increment the last digit.
  * Releases adding minor and backward compatible functionality have to increment the second digit.
  * Major updates, particularly if containing non-backward compatible changes have to increment the first digit.

### Planning Operation Servers

* Add the Services, which shall be provided by the new application, into the section operation-servers/service/individual.
* While creating new OperationServers, think about 
  * the services, which shall be provided to other applications,
  * parameters, which might be needed to be pre-configured at this application,
  * different responses (e.g. filtered)
  * potentially required inversions (e.g. stop subscription) or restoring the original state


### Planning Operation Clients

* While creating new OperationClients, think about
  * which input data is needed from outside to fulfil the application's tasks
  * which event notifications need to be subscribed for triggering activities inside the application
  * potentially required inversions (e.g. stop subscription) or restoring the original state

* Take the servers at the existing applications as a base
* While considering consumption of data provided by other applications that special care for 
    * exact meaning of the provided attributes
    * update period of the provided information
    * life cycle state of the consumed service (e.g. obsolete services will be discontinued soon)

* If some service would be consumed at all other applications, it shall be listed in the operation-clients/service/basic section
* If some service would be consumed from one or several, but not all other applications, it shall be listed in the operation-clients/service


### Validation

It is planned to support automatically transferring the content of the ServiceList into the OpenApiSpecification in future.
Proper YAML files are required for facilitating such tool support.
This requires validating the ServiceList.yaml for proper YAML syntax before saving.