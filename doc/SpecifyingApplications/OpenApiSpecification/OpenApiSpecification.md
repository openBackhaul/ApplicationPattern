# OpenApiSpecification

The OpenApiSpecification is the detailed description of the REST API of the application.

Before starting to specify, the [latest template](https://github.com/openBackhaul/ApplicationPattern/tree/tsi) is to be downloaded from the TSI branch of the ApplicationPattern repository.

All services listed in the green area of the ServiceList must result in a path in the OpenApiSpecification.
All forwardings added to the ForwardingList must result in a callback in the OpenApiSpecification.

**Individualization**
* Find template here 
* Load into Postman
* Individualize Application Information
* Delete unnecessary segments

**Defining Services**
* Define all services in detail, but not the callbacks
* Double check internal data structure in parallel
* Describe where to put (request body) or get (response body) the attributes’ values in descriptions
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
