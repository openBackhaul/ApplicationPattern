# OpenApiSpecification

The OpenApiSpecification is the detailed description of the REST API of the application.

Before starting to specify, the [latest template](https://github.com/openBackhaul/ApplicationPattern/tree/tsi) is to be downloaded from the TSI branch of the ApplicationPattern repository.

All services listed in the "individual" sections must result in a path in the OpenApiSpecification.
All forwardings added to the ForwardingList must result in a callback in the OpenApiSpecification.

**Individualization**
* Find template here 
* Load into Postman
* Individualize Application Information
* Delete unnecessary segments

**Defining Services**
* Define all services in detail, but not the callbacks
  * Be aware that services shall be designed in such a way that a target state is described, but not a change (idempotence). Example: /v1/end-process shall not indicate an error in case the process wasn't running before service has been started
* Double check internal data structure in parallel
* Describe where to put (request body) or get (response body) the attributes’ values in descriptions, buy using the following keywords:

  * "find" is indicating a key attribute, which has to have the same value for identifying the data set to be updated
  * "update" is indicating an attribute, which has to be changed to match the received value
  * "create" is indicating that the number of interfaces connected to the ForwardingConstruct is not invariant, and a new interface is to be instantiated and connected to the ForwardingConstruct in case no existing instance with a matching key attribute value ("find") can be found.
  * "from" is identifying the source of information, which is to be sent in the described attribute.

* Distinguish key attributes (find or create) from others (update or create)
* Be precise on the data formats, define patterns and enumerations

**Defining Forwardings and Clients**
* Wait until service definitions are stable
* Define all callbacks (re-use names of forwardings) beneath the respective management request
* Copy service definitions
* Remove service id, tags and security scheme
* Remove patterns and enumerations (filtering is on the ingress)
* Update descriptions about where to put (request body) or get (response body) the attributes’ values

**Create Mock**
* Save the specification
* Create mock server with proper naming

**Review**
* Check services against the Excel
* Check callbacks against the other Excel
* Check mock for correct responses, particularly in case of arrays
* Ask colleague for review of the OAS
