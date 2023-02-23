# ForwardingDomain, ForwardingConstruct and ForwardingConstructPort


### ForwardingDomain

The ForwardingDomain (FD) represents a potential for _Forwarding_.  
_Forwarding_ is typically supported on multiple layers inside networks and devices.  
That's why the ControlConstruct class holds a list of ForwardingDomains.  

A ForwardingDomain usually holds a list of references to interfaces between which connections of a certain layer could be configured, as well as a list of connections (ForrwardingConstruct) that belong to the same layer and are already configured.  

In case of the applications of the MW SDN domain, a potential for _Forwarding_ is only expressed on the _Operations_ level.  
An explicit listing of references to all the _OperationServers_ and _OperationClients_ is not included.  
Just a list of ForwardingConstructs is comprised.  

The ForwardingDomain comprises the following attributes:
- **uuid**: Identifier that is unique within the entire MW SDN application layer. Details can be found in [Structure of UUIDs](../../Names/StructureOfUuids/StructureOfUuids.md).
- **forwardingConstruct**: List of connections that are configured within this ForwardingDomain.


### ForwardingConstruct

The ForwardingConstruct (FC) represents the actually configured _Forwarding_.  
It can be used to represent a wide range of forwarding behaviors, from simple packet forwarding to complex traffic engineering and policy-based routing.  
Since multiple _Forwardings_ can typically exist in parallel between the interfaces of the same layer, the ForwardingDomain contains a list of ForwardingConstructs.  

In case of the applications of the MW SDN domain, ForwardingConstructs are describing event-reaction-relationships on the _Operation_ layer.  
This means the relationships between receiving a request at a specific OperationServer (event) and sending requests through one or more OperationClients (reaction).  

The ForwardingConstruct comprises the following attributes:  
- **uuid**: Identifier that is unique within the entire MW SDN application layer. Details can be found in [Structure of UUIDs](../../Names/StructureOfUuids/StructureOfUuids.md).  
- **name**: List of two instances of a composed datatype that holds a valueName and a value attribute. The name attribute is basically some backdoor for adding additional attributes to the ONF Core modelling.  
- **name::valueName**: Name of the attribute that shall be added to the modelling. The following entries shall be made into two separate instances 'ForwardingKind' and 'ForwardingName'.  
- **name::value**: Value of the attribute that shall be added to the modelling.  
- **name::value if valueName==ForwardingKind**: In this case, the value of the value attribute is to be chosen from:  
  - core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET: Number of FcPorts is invariant.  
  - core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION: Number of FcPorts is variant, but they get all activated by an event.  
  - core-model-1-4:FORWARDING_KIND_TYPE_PROCESS_SNIPPET: Number of FcPorts might be variant. A sophisticated logic implements the _Forwarding_ based on case by case decisions. This might involve variable subsets of Outputs to be activated dependent on the characteristics of the individual event.
- **name::value if valueName==ForwardingName**: Name of the forwarding as already defined in the ForwardingList.  
- **fcPort**: List of references to LogicalTerminationPoints that are part of the _Forwarding_.  


### ForwardingConstructPort

The ForwardingConstructPort (FcPort) describes the reference to an interface that is part of an actually configured _Forwarding_.  
In principle, the interfaces could also be referenced from within the ForwardingConstruct itself, but the ForwardingConstructPort as an intermediate element allows adding attributes to the reference.  
This is of particular importance, if the interfaces that are belonging to the same _Forwarding_ distinguish roles like e.g. ingress and egress.  

In case of the applications of the MW SDN domain, ForwardingConstructPorts are exclusively referencing OperationServers and OperationClients.  

The ForwardingConstructPort comprises the following attributes:  
- **localId**: Identifier that is unique just within the residing ForwardingConstruct.  
- **portDirection**: Role of the referenced OperationClient or OperationServer inside the _Forwarding_.  
  - **core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT**: FcPorts of this type are always referencing an OperationServer that influences the creation, deletion or modification of FcPorts of type Output inside the same ForwardingConstruct. A ForwardingConstruct may have zero to n Managements. A common case of managing a ForwardingConstruct comprises an OperationServer for subscribing to a specific kind of notifications and a generic OperationServer for unsubscribing.  
  - **core-model-1-4:PORT_DIRECTION_TYPE_INPUT**: FcPorts of this type are referencing an OperationServer. Receiving a request at such OperationServer leads to sending a request via one or several Outputs of the same ForwardingConstruct. A ForwardingConstruct may have one to n Inputs. In rare cases, Outputs get activated based on a cyclic process inside the application, but not an individual event at an Input. In such case, the OperationServer that servers as Management for starting the cyclic process shall be listed as an Input, too.  
  - **core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT**: FcPorts of this type are referencing an OperationClient. Depending on the type of _Forwarding_ one or several Output get activated at a time. A ForwardingConstruct may have one to n Outputs.  
- **logicalTerminationPoint**: UUID of the referenced OperationClient or OperationServer.  
