# Structure of Forwarding Description



### ForwardingName
The ForwardingName has to be defined according to the rules stated in [Structure of CallbackNames](../../ElementsApplicationPattern/Names/StructureOfCallbackNames/StructureOfCallbackNames.md).


### UUID
The UUID has to be defined according to the rules stated in [Structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### ForwardingType
The ForwardingType has to be chosen from the ones that have been explained in chapter "Types of Forwardings" of [Concepts of Forwarding](../../ElementsApplicationPattern/Functions/ConceptsOfForwarding/ConceptsOfForwarding.md).


### ManagementRequests - OperationClientUpdate - ServerName / UUID:
The service and its UUID that are stated here must have been defined in the ForwardingList before.  
Referencing it here just means that it is used for updating or creating an OperationClient that gets activated by this Forwarding.  
(OperationServers don't get configured, because own service names are invariant for the livetime of the application.)  
It is like configuring or creating an interface.  


### ManagementRequests - FcPortUpdate - ServerName / UUID:
The service and its UUID that are stated here must have been defined in the ForwardingList before.  
Referencing it here just means that it is used for adding an interface to the Forwarding.  
It is like activating transmission on an existing interface.  






### What is expressed?


