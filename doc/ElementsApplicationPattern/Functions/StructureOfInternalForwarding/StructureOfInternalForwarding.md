# Structure of Internal Forwardings

_ForwardingConstructs_ are describing relationships between events and reactions.  
Since we are dealing with REST servers,  
- an event is a request, which has been received (_Input_) by one of the _OperationServers_ offered by the application and  
- the reaction is a request, which has to be sent (_Output_) via one of the _OperationClients_ that are for addressing other applications.  

Obviously, a definition of a _ForwardingConstruct_ must comprise at least one _Input_ (reference to an _OperationServer_) and at least one _Output_ (reference to an _OperationClient_).  

![scheme](https://user-images.githubusercontent.com/57349523/230372750-3ad03353-7854-49d6-a7ab-4b2780806de5.jpg)

We are documenting the relationships, because we want to be able to modify them.  
If we want to automate the modification (e.g. creating a subscription), there must be services available on the REST API for facilitating this.  
In this case, the definition of a _ForwardingConstruct_ needs also to comprise a _Management_ (reference to an _OperationServer_).  
Otherwise, the _ForwardingConstruct_ would have to be altered by editing in the CONFIGfile.  

![fc](https://user-images.githubusercontent.com/57349523/230372906-aef8be4b-38e2-43bd-a5d5-4553628eba4c.jpg)

---
Example:  
The _TypeApprovalRegister_ is subscribing for notifications about new registrations at the _RegistryOffice_.  
A _Forwarding_ from registration to notifying the _TypeApprovalRegister_ has to be defined in the _RegistryOffice_.  
This _Forwarding_ has to comprise the following _Servers_ and _Clients_:  
- _Management_: The _TypeApprovalRegister_ is informing the _RegistryOffice_ about its TCP/IP address and _OperationName_ for receiving notifications about new registrations by addressing the _RegistryOffice's OperationServer /v1/inquire-application-type-approvals_. The _RegistryOffice_ creates or updates a stack of _Clients_ with these information and it complements the corresponding _ForwardingConstruct_ by an _Output_ reference to the _OperationClient_.  
- _Input_: Some new application is addressing the _RegistryOffice's OperationServer /v1/register-application_ for registering.  
- _Output_: The _RegistryOffice_ is activating its _OperationClient_ _TypeApprovalRegister://v1/regard-application_ for sending the notification to the _TypeApprovalRegister_.  

![example](https://user-images.githubusercontent.com/57349523/230372426-089b8ee3-9244-4570-b98f-879b67d64c7d.jpg)
