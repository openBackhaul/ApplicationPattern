# Concepts of the ForwardingList

The FordingList is basically a list of homogenous elements that are describing an individual Forwarding.

### ForwardingName
The ForwardingName has to be defined according to the rules stated in [Structure of CallbackNames](../StructureOfCallbackNames/StructureOfCallbackNames.md).


### UUID
The UUID has to be defined according to the rules stated in [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).


### ForwardingType
The ForwardingType has to be chosen from the ones that have been explained in chapter "Types of Forwardings" of [Concepts of Forwarding](../ConceptsOfForwarding/ConceptsOfForwarding.md).


### ManagementRequests - OperationClientUpdate - ServerName / UUID:
The service and its UUID that are stated here must have been defined in the ServiceList before.  
Referencing it here just means that it is used for updating or creating an OperationClient that gets activated by this Forwarding.  
(OperationServers don't get configured, because own service names are invariant for the livetime of the application.)  
It is like configuring or creating an interface.  


### ManagementRequests - FcPortUpdate - ServerName / UUID:
The service and its UUID that are stated here must have been defined in the ServiceList before.  
Referencing it here just means that it is used for adding an interface to the Forwarding.  
It is like activating transmission on an existing interface.  






### What is expressed?


### Structure of the ForwardingList

The template of the ForwardingList contains already a vast amount of forwardings.  
This is mainly for automating the embedding of the application into the modular application layer and for handing-over from a former release of the same application.  

