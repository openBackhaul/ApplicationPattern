# Creating the OpenAPI Specification

This is the step by step cookbook for creating the OpenAPI Specification (OAS).  

Please read the following conceptual documents before working on the OAS:  
- 
- 
- 


### File Handling  

- Assure that there is a copy of the latest [template of the OAS](???) in the _develop_ branch of your application's repository.    
- Rename the file, by replacing "ApplicationPattern" by your application's name.  


### Preparation  

- If not yet existing, create an _Issue_ for elaborating the OAS.  
- Open a local feature branch for elaborating the OAS.  


### Individualization  

#### General
Please, be careful while altering the existing entries in the OAS.  
Most of them will require just a little adjustment.  
Very few need to be deleted.  
Several need to be added, and it is recommended to copy and paste the existing objects.

- CTRL+f for '  title:' and put your application's name and release number.  
- Use CTRL+h for replacing '*-1-0-0' by the abbreviation of your application's name and release number e.g. 'ro-2-0-1'.  

- /v1/inform-about-application
- /v1/inform-about-release-history
- /v1/inform-about-application-in-generic-representation
- /v1/inform-about-release-history-in-generic-representation


### Service Layer
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


#### Paths


#### Parameters


#### Request


#### Responses


#### Callbacks
_chapter to be formulated_
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



### OAM Layer

#### File Profile


#### ElasticSearchClient

#### Individual Profiles






### Reviewing the OpenAPI Specification

_chapter to be formulated_
* Check services against the Excel
* Check callbacks against the other Excel
* Check mock for correct responses, particularly in case of arrays
* Ask colleague for review of the OAS
