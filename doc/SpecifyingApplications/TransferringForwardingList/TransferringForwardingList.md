# Transferring the ForwardingList content into the OAS

All forwardings added to the ForwardingList must result in a Callback in the OpenApiSpecification.  
Callbacks are allocated beneath the Path, which is describing the request that shall initiate sending the Callback request.  
A Callback can be located beneath just a single Path.  
The [Structure of Forwardings] defines two types of requests that get received - Management and Input.  
Because there are basic Forwardings that define many Input requests (e.g. logging service requests), but (until now) no Forwarding that defines more than two Management requests, it has been decided to allocate the Callback, which is translated from the Forwarding, preferably at the Management request.  
If there would be more that one Management request, the constructive one (e.g. for creating the subscription) is to be preferred over the destructive one (e.g. for canceling the subscription).  
If there would be no Management request, the Callback shall be located beneath the most relevant Input. The Input, which holds the Callback definition, shall be listed first in the ForwardingList.


**Defining Forwardings and Clients**
* Wait until service definitions are stable
* Define all callbacks (re-use names of forwardings) beneath the respective management request
* Copy service definitions
* Remove service id, tags and security scheme
* Remove patterns and enumerations (filtering is on the ingress)
* Update descriptions about where to put (request body) or get (response body) the attributes’ values