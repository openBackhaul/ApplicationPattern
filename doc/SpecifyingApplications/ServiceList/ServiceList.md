# ServiceList

This is the step by step cookbook for filling the ServiceList.

* Before starting to create a new specification, fetch the latest Services Template [here](../../../../../tree/tsi).
* Be aware that the grey areas of the template must not be altered; they are describing services, which are common to all applications

**Planning Operation Servers**

* Create a copy of the “Template” tab
* Rename the new tab with the abbreviation identifying the new application
* Add the Services, which shall be provided by the new application, into the green area of the template
  * Service names shall start with a version identifier (e.g. v1)
  * Service names shall be formulated like orders (e.g. calculate-mw-capacity); means they shall start with a verb, followed by an object; further details might follow
  * Chose meaningful verbs and objects, so the service is already explained by its naming and it’s possible to conclude on the purpose of the application from reading the service names
  * Start and separate version identifier from service name with slash; use hyphens to separate words in the service name; e.g. /v1/service-name
  * Please, take already existing definitions in the Services Template as a reference
* While creating new Services, think about 
  * the services, which shall be provided to other applications,
  * parameters, which might need to be pre-configured at this application,
  * different responses (e.g. filtered)
  * potentially required inversions (e.g. stop subscription) or restoring the original state
* Put them into a reasonable order (potentially following the sequence they might be applied during regular operation)
* Assign UUIDs to the provided services

**Planning Operation Clients**

* Continue filling in the Service Template from above
* Add the services, which need to be consumed by the new application
  * Search the template for the application, which is providing the needed service
  * If not yet documented, add an additional section at the bottom of the list
  * Add the service name as it is already specified in the providing application to the blue areas
  * Find info about existing applications e.g. in the GenericRepresentationApplication
* Put them into a reasonable order (potentially following the sequence they might be consumed during regular operation)
* Assign UUIDs to the consumed services
