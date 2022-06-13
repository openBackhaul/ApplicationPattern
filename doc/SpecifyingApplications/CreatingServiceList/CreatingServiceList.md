# Creating the ServiceList

### OperationServers

This is a step by step cookbook for filling the ServiceList.

* Assure that a copy of the ApplicationPattern+services.yaml is in the develop Branch of your application's repository.
  If not already there, download a copy of the latest [ServiceList template](../../../../../tree/tsi/ApplicationPattern+services.yaml) and put it there.
* Rename the file, by replacing "ApplicationPattern" by your application's name.

! Be aware that the template must not be altered outside the zones indicated by comments starting with '##' !

* Put them into a reasonable order (potentially following the sequence they might be applied during regular operation)
* Assign UUIDs to the provided services
* Complement the HTTP (ApplicationName, ReleaseNumber) and TCP server (IP address, TCP port) information in the sections, which are marked by '##'.

* fill in offered services 
* name offered services according to structure of service names
* add additional http and tcp clients if required

### OperationClients

* Continue filling in the ServiceList template from above
* Add the services, which need to be consumed by the new application
  * Search the list of clients for the application, which is providing the needed service
  * If not yet available, add an additional section at the bottom of the list
  * Add the service name as it is already specified in the serving application
    * If some service would be consumed at all other applications, it shall be listed in the operation-clients/service/basic section
    * If some service would be consumed from one or several, but not all other applications, it shall be listed in the operation-clients/service/individual section
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
