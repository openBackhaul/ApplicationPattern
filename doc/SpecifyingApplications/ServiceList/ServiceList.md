# ServiceList

This is the step by step cookbook for filling the ServiceList.

* Before starting to create a new specification, download a copy of the latest [ServiceList template](../../../../../tree/tsi/ApplicationPattern+services.yaml).
* Be aware that the template must not be altered outside the zones indicated by comments starting with '##'

**Planning Operation Servers**

* Add the Services, which shall be provided by the new application, into the section operation-servers/service/individual.
  * Service names shall start with a version identifier (e.g. v1)
  * Service names shall be formulated like orders (e.g. calculate-mw-capacity); means they shall start with a verb, followed by an object; further details might follow
  * Chose meaningful verbs and objects, so the service is already explained by its naming and it’s possible to conclude on the purpose of the application from reading the service names
  * Start and separate version identifier from service name with slash; use hyphens to separate words in the service name; e.g. /v1/service-name
  * Please, take already existing definitions in the ServiceList template as a reference
* While creating new Services, think about 
  * the services, which shall be provided to other applications,
  * parameters, which might be needed to be pre-configured at this application,
  * different responses (e.g. filtered)
  * potentially required inversions (e.g. stop subscription) or restoring the original state
* Put them into a reasonable order (potentially following the sequence they might be applied during regular operation)
* Assign UUIDs to the provided services
* Complement the HTTP (ApplicationName, ReleaseNumber) and TCP server (IP address, TCP port) information in the sections, which are marked by '##'.

**Planning Operation Clients**

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

**Validation**

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ServiceList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ServiceList is fine, if YAML validator indicates "Valid YAML!"
