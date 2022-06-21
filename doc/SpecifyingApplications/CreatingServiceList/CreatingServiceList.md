# Creating the ServiceList

This is a step by step cookbook for creating the ServiceList.  
**Be aware that the template must not be altered outside the zones indicated by comments starting with '##' !**


### File Handling

* Assure that there is a copy of the ApplicationPattern+services.yaml in the develop branch of your application's repository.
  In case it is missing from there, get it from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern).
* Rename the file, by replacing "ApplicationPattern" by your application's name.


### HTTP and TCP Server
* Replace "## OwnApplicationName" by the official name of the application
* Replace "## OwnReleaseNumber (e.g. 0.0.1)" by the official release number
* Replace "## OwnIpAddress" by the expected IP address
* Replace "## OwnTcpPort" by the expected TCP port


### OperationServers

* Replace "## Services specific to this application" by the OperationServers
  * Add the following two lines for every service the application shall provide  
```
    - service-name:
      uuid:
```
  * Fill in a name of the service according to [structure of service names](../StructureOfServiceNames/StructureOfServiceNames.md)
  * Put them into a reasonable order (potentially following the sequence they might be applied during regular operation)
  * Fill in UUIDs to the provided services according to [structure of UUIDs](../StructureOfUuids/StructureOfUuids.md)


### OperationClients
* Add additional http and tcp clients if required
* Continue filling in the ServiceList template from above
* Add the services, which need to be consumed by the new application
  * Search the list of clients for the application, which is providing the needed service
  * If not yet available, add an additional section at the bottom of the list
  * Add the service name as it is already specified in the serving application
    * If some service would be consumed at all other applications, it shall be listed in the _operation-clients/service/basic_ section
    * If some service would be consumed from one or several, but not all other applications, it shall be listed in the _operation-clients/service/individual_ section
  * Find info about existing applications e.g. in the GenericRepresentationApplication
  * Put them into a reasonable order (potentially following the sequence they might be consumed during regular operation)
  * Assign UUIDs to the consumed services
* Take care that application name and release number are properly filled.
* Fill in latest IP address and TCP port information

### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ServiceList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ServiceList is fine, if YAML validator indicates "Valid YAML!"
