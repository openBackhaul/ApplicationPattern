# Detailing the Service definitions

_chapter to be formulated_

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