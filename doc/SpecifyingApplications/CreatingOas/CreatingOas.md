# Creating the OAS

This is the step by step cookbook for creating the OAS.  

Please read the following conceptual documents before working on the OAS:  
 - [Concept of Microservice](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/Microservice/Microservice.md)  
 - [Introduction to HTTP Requests](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/Http/Http.md)  
 - [API-First Approach](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/ApiFirst/ApiFirst.md)  
 - [OpenAPI Specification](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/OpenApiSpecification/OpenApiSpecification.md)  
 - [OpenAPI Guide from Basic Structure to Using $ref](https://swagger.io/docs/specification/basic-structure/)  
 
 Furthermore, it is recommended to study an existing OAS (e.g. [RegistryOffice](https://github.com/openBackhaul/RegistryOffice/blob/develop/spec/RegistryOffice.yaml)) in deep detail while reading [Structure of the OAS](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/SpecifyingApplications/StructureOfOas/StructureOfOas.md) in parallel.  


### File Handling  

Unfortunately, the handling of the OAS file is not satisfactorily solved.  
On one hand, the OAS must be part of the application specification on Github, and also participate in the regular version management.  
On the other hand, editing is better supported in Postman and finally the functions of Postman (e.g. mock server creation) are also needed to test the coding of the test cases.  

It is up to the individual ApplicationOwner whether he prefers to write the OAS in VSCode or in Postman.  
If Postman is chosen, the file content has to be copied regularly between the two editors (which involves some risks).  
If VSCode is preferred, the content must be transferred towards Postman before editing the test cases and afterwards been permanently kept in synch.  




hier geht's weiter



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


### Individual Service Section
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
It is recommended to first describe all RequestBodies and all ResponseBodies before adding the first _callback_ to the OAS.  

Finding the right place for the description of a _callback_ is the first step in its description.  
The simplest procedure is to open the ForwardingList and to assign all _forwardings_ one after another to one of the already existing _paths_.  
The [Structure of the OAS](../StructureOfOas/StructureOfOas.md) is defining the rules for allocating the _callback_ definitions.

The URL statement is a bit hard to describe, but it supports the ApplicationImplementer to create a correct request from application internal data.  
Maybe it is helpful to 
- copy a URL statement from an existing _callback_ definition
- temporarily add line breaks after every "]", 
- adapt the UUIDs of protocol, IP address, domain name, port, and operation name references and 
- remove the line breaks again.  


It is recommended to wait until the original _path_ definitions are  really stable, before copying the entire method block (most likely _post:_) from the original _path_ definition into the _callback_ definition.  
The entire block is to be marked for correcting the indents.  
_operationId:_, _tags:_ and _security:_ statements are to be removed.  
All statements that are filtering the to be sent requests for specific values of the attributes (e.g. patterns or enumerations at String attributes, minimum or maximum values at Integer attributes) are to be removed, too.  
In the RequestBody, change all descriptions to "from " and replace the existing reference by the reference to the location where to get the value to be sent.  
In the ResponseBody, change all descriptions to _find in_/_update_ or _find or create_/_update or create_ and replace the existing references by references to the locations where to store the answered values.  
In the _headers:_, the description at the _life-cycle-state:_ shall be replaced by the simple formulation 'Life cycle state of the consumed service'.  

### Basic Service Section
As there could be parallel activities at the ApplicationPattern, it is recommended to create the copy of the basic service section right before finalizing the individual specification.  

The following proceeding is recommended:  
- CTRL+c the basic service section of the latest ApplicationPattern OAS into a separate text editor.  
- CTRL+h "*-1-0-0" by the abbreviation of your application's name and release number.  
- CTRL+a and CTRL+c the content of the separate text editor into the basic service section of your application's OAS.  


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
