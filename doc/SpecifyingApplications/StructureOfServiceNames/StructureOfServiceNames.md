# Structure of Service Names

The name of a service shall be formulated like an order (e.g. _calculate-mw-capacity_); meaning it shall start with a verb, followed by an object and potentially further details.

It shall be composed from two to five meaningful words.  
The service shall already be explained by its naming.  
The purpose of the application shall be clear from reading the service names.  

Service names must be unique, at least within scope of the individual application.  
It is recommended to read service names at several existing applications, preferably with similar purpose, for becoming sensitive for choosing names, which allow to distinguish from existing services at other applications.  

Since POST method shall exclusively be used in the service section of the OpenApiSpecification
* services, which could be implemented by a _GET_ method, might start with "provide..."
* services, which could be implemented by a _PUT_ method, might start with "create..." (repeatedly calling the same operation results in several **separate instances**)
* services, which could be implemented by _PATCH_ method, might start with "update..." (repeatedly calling the same operation results in setting the values of the **selfsame** object)  

If an alternative verb would describe the effect of the operation more precisely, the alternative verb shall be preferred.

Service names shall start with a slash followed by a version identifier (e.g. /v1).  
A second slash shall separate the version identifier from the descriptive part of the service name.  
Hyphens have to be used for separating words in the descriptive part of the service name.  

Example: _/v1/provide-proper-service-names_

Please, take already existing definitions in the ServiceList template or other applications as a reference.




