# Structure of Service Names

The name of a service shall be formulated like an order (e.g. _calculate-mw-capacity_); meaning it shall start with a verb, followed by an object and potentially further details.

It shall be composed from two to five meaningful words (another three words would be put on top for "InGenericRepresentation", wherever applicable).  
The service shall already be explained by its naming.  
The purpose of the application shall be clear from reading the service names.  

Service names must be unique, at least within scope of the individual application.  
It is recommended to read service names at several existing applications, preferably with similar purpose, for becoming sensitive for choosing names, which allow to distinguish from existing services at other applications.  

Services, which are for ...
* ... retrieving data, might start with "provide...".
* ... creating multiple **separate instances** every time they get called, might start with "create...".
* ... overwriting the values of the **selfsame** object every time they get called, might start with "update...".

If an alternative verb would describe the effect of the operation more precisely, the alternative verb shall be preferred.

Service names shall start with a slash followed by a version identifier (e.g. /v1).  
A second slash shall separate the version identifier from the descriptive part of the service name.  
Hyphens have to be used for separating words in the descriptive part of the service name.  
Service names shall exclusively contain lower case letters.  
They must not contain any special characters (like &, * , ?) apart from hyphens.  

Example: _/v1/provide-proper-service-names_

Please, take already existing definitions in the ServiceList template or other applications as a reference.




