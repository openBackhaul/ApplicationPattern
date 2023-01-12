# Structure of OperationNames

The name of an _Operation_ shall be formulated like an order (e.g. _calculate-mw-capacity_); meaning it shall start with a verb, followed by an object and potentially further details.  

It shall be composed from two to five meaningful words (another three words would be put on top for "InGenericRepresentation", wherever applicable).  
The _Operation_ shall already be explained by its naming.  
The purpose of the application shall be clear from reading the _OperationNames_.  

_OperationNames_ must be unique, at least within scope of the individual application.  
It is recommended to read the list of _OperationNames_ at several existing applications, preferably with similar purpose, for becoming sensitive for choosing names, which allow to distinguish from existing _Operations_ at other applications.  

_Operations_, which are for ...
* ... retrieving data, might start with "provide...".
* ... creating multiple **separate instances** every time they get called, might start with "create..." (remark: not idempotent!).
* ... overwriting the values of the **selfsame** object every time they get called, might start with "update...".

If an alternative verb would describe the effect of the _Operation_ more precisely, the alternative verb shall be preferred.

_OperationNames_ shall start with a slash followed by a version identifier (e.g. /v1).  
A second slash shall separate the version identifier from the descriptive part of the _OperationName_.  
Hyphens have to be used for separating words in the descriptive part of the _OperationName_.  
_OperationNames_ shall exclusively contain lower case letters.  
They must not contain any special characters (like &, * , ?) apart from hyphens.  

Example: _/v1/provide-proper-operation-names_

Please, take already existing definitions in the ServiceList template or other applications as a reference.  
