# Structure of Forwarding Descriptions

### ForwardingName

The ForwardingNames have to be defined according to the rules stated in [Structure of Internal _ForwardingNames_](../../ElementsApplicationPattern/Names/StructureOfInternalForwardingNames/StructureOfInternalForwardingNames.md).  


### UUID

The UUID has to be defined according to the rules stated in [Structure of UUIDs](../../ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md).


### ForwardingType

The ForwardingType has to be chosen from the ones that have been explained in [Types of Internal _Forwardings_](../../ElementsApplicationPattern/Functions/TypesOfInternalForwardings/TypesOfInternalForwardings.md).  


### ManagementRequests

_ManagementRequests_ are for configuring the _Forwarding_.  
_ManagementRequests_ are a subset of the _OperationServers_ defined in the _ServiceList_.  

_OperationClients_, _ForwardingConstructs_ or _ForwardingConstructPorts_ are affected by the _Management_.  
_OperationServers_ are invariant.  

_OperationServers_ stated in ...  
- _OperationClientUpdate_ have to contain all necessary information (e.g. _OperationName_, IP address and TCP port) about where to send the _ConsequentRequest_  
- _FcPortUpdate_ are used for activating the _Forwarding_  
- _FcPortDeletion_ are used for stopping the _Forwarding_  
- _OperationClientDeletion_ are used for stopping the _Forwarding_ and deleting the _OperationClient_ (if the last _OperationClient_ would be deleted, the _HttpClient_ and the _TcpClient_ would be deleted, too)  

These different types of _Management_ are required, because sometimes they are provided by different sources.  
Example:  
An application might wish to receive notifications, so it sends all data about where to send the _ConsequentRequest_, but sending notifications cannot start until another application approved.

If some _Management_ would cover several types of changes, the same _OperationServer_ would have to be stated multiple times.  


### InitiatingRequests

_InitiatingRequests_ are for initiating the individual sending of a _ConsequentRequest_.  
They are the event that causes some reaction.  
There must always be at least one _InitiatingRequest_, but there could be many, too.  
_InitiatingRequests_ have to be chosen from the list of _OperationServers_ in the _ServiceList_.  
The _InitiatingRequest_ might be identical to the _ManagementRequest_.
Example:  
The _/v1/register-yourself_ prompts the application (_InitiatingRequests_) to register at the _RegistryOffice_, at the same time the _/v1/register-yourself_ contains IP address and port of the _RegistryOffice_.


### ConsequentRequests

_ConsequentRequests_ are representing the reaction on some event.  
There must always be at least one _ConsequentRequests_, but there could be several.  
_ConsequentRequests_ have to be chosen from the list of _OperationClients_ in the _ServiceList_.  
