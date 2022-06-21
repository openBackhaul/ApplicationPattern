# Structure of Service Names

The name of a service shall be formulated like an order (e.g. _calculate-mw-capacity_); meaning it shall start with a verb, followed by an object and potentially further details.

It shall be comprised from two to five meaningful words.  
The service shall already be explained by its naming. The purpose of the application shall be clear from reading the service names.

Service names must be unique, at least within scope of the individual application. It is recommended to read service names at several existing applications, preferably with similar purpose, for becoming sensitive for choosing names, which allow to distinguish from existing services at other applications.

Since POST method shall exclusively be used in the service section of the OpenApiSpecification
* services, which could be implemented by a _GET_ method, might start with "provide..."
* services, which could be implemented by a _PUT_ method, might start with "create..." (repeatedly calling the same operation results in several **separate instances**)
* services, which could be implemented by _PATCH_ method, might start with "update..." (repeatedly calling the same operation results in setting the values of the **same** element)  

If an alternative verb would describe the effect of the operation more precisely, the alternative verb shall be applied.

Service names shall start with a version identifier (e.g. v1). A slash shall be set before and after the version identifier. Hyphens have to be used for separating words in the service name; 

Example: _/v1/provide-proper-service-names_

Please, take already existing definitions in the ServiceList template as a reference.




