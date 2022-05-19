# Transferring the ForwardingList content into the OAS

All forwardings added to the ForwardingList must result in a callback in the OpenApiSpecification.

_chapter to be formulated_

**Defining Forwardings and Clients**
* Wait until service definitions are stable
* Define all callbacks (re-use names of forwardings) beneath the respective management request
* Copy service definitions
* Remove service id, tags and security scheme
* Remove patterns and enumerations (filtering is on the ingress)
* Update descriptions about where to put (request body) or get (response body) the attributes’ values