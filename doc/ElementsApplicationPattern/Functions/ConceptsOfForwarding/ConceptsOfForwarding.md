# Concept of Internal Forwarding  


### Purpose of Internal Forwarding  

There are a lot of interactions between the applications of the modular application layer.  
For example, whenever an application receives a request, it has to send one to the _ExecutionAndTraceLog_ application for documenting the processing of the received request.  

All these interactions between the applications are based on REST requests.  
The URIs of these REST requests must comprise e.g. TCP/IP address and _OperationName_.  
Thus, every individual application needs to know these information about other applications for properly addressing them.  

If these information would be hard coded, the implementation of an individual application would out-date as soon as the TCP/IP address of one of its serving applications would change.  
Thus, TCP/IP addresses and _OperationName_ get documented in the CONFIGfiles of the individual applications.  

A stack of _TcpClient_, _HttpClient_ and _OperationClient_ is used for documenting the information, which is required for addressing a consumed service.  
Address information of an already known application could be altered by modifying the values of the attributes inside these _Clients_.  
This could be done manually in the CONFIGfile or via the OaM segment of the REST API during runtime.  
To some extend it is even automated via the service segment of the REST API.  

'... whenever an application receives a request, it has to send one to the _ExecutionAndTraceLog_...' represents an example for the relationships between _OperationServers_ and _OperationClients_.  
If these relationships would be hardcoded, it would not be possible to redirect the flow from event to reaction, and a dynamic change of the application layer would not be possible.  
Thus, the relationships need to be documented in the CONFIGfiles of the individual applications, too.  

_ForwardingDomains_ and _ForwardingConstructs_ are used for documenting the relationships between received (_OperationServer_) and to be sent requests (_OperationClients_).  
_ForwardingConstructs_ are used for representing process flows as well as calculations.  
Alike the _Clients_, the _ForwardingConstructs_ could be changed manually in the CONFIGfile or via the OaM segment of the REST API or in automated way via the service segment of the REST API.  

The _ForwardingList_ is supporting designing the relationships before documenting them syntactically correct in the OpenApiSpecification and the CONFIGfile.  


### Structure of Internal Forwardings

_ForwardingConstructs_ are describing relationships between events and reactions.  
Since we are dealing with REST servers,  
- an event is a request, which has been received (_Input_) by one of the _OperationServers_ offered by the application and  
- the reaction is a request, which has to be sent (_Output_) via one of the _OperationClients_ that are for connecting another application.  
Obviously, a definition of a _ForwardingConstruct_ must comprise at least one _Input_ (reference to an _OperationServer_) and at least one _Output_ (reference to an _OperationClient_).  

As described above, we are documenting the relationships, because we want to be able to modify them.  
If we want to automate the modification, there must be services available on the REST API for facilitating this.  
Thus, a definition of a _ForwardingConstruct_ needs also to comprise a _Management_ (reference to an _OperationServer_), whenever it shall be possible to automate changes (otherwise the _ForwardingConstruct_ could still be changed manually via OaM segment or altering the CONFIGfile).  

Example:  
The _TypeApprovalRegister_ is subscribing for notifications about new registrations at the _RegistryOffice_.  
A _Forwarding_ from registration to notifying the _TypeApprovalRegister_ has to be defined in the _RegistryOffice_.  
This _Forwarding_ has to comprise the following _Servers_ and _Clients_:  
- _Management_: The _TypeApprovalRegister_ is informing the _RegistryOffice_ about its TCP/IP address and _OperationName_ for receiving notifications about new registrations by addressing the _RegistryOffice's OperationServer /v1/inquire-application-type-approvals_. The _RegistryOffice_ creates or updates a stack of _Clients_ with these information and it complements the corresponding _ForwardingConstruct_ by an _Output_ reference to the _OperationClient_.  
- _Input_: Some new application is addressing the _RegistryOffice's OperationServer /v1/register-application_ for registering.  
- _Output_: The _RegistryOffice_ is activating its _OperationClient /v1/regard-application_ for sending the notification to the _TypeApprovalRegister_.  


### Types of Internal Forwardings

_Forwardings_ can be distinguished by the way of reacting on _Management_.  

**InvariantProcessSnippet**
Whenever an _InvariantProcessSnippet_ receives new address information at its _Management_, it updates the existing _OperationClient_, which is referenced as _Output_.  
Example: Every application has to inform the _OamLog_ about requests that are addressing the OaM segment of its REST API.  
Of course, it would not be wished, if third parties would receive copies of this information.  
Thus, the _Forwarding_ towards the _OamLog_ is defined in such a way that just a single _OperationClient_ can be referenced as _Output_.  

**Subscription**
Whenever a _Subscription_ receives new contact information at its _Management_, it creates another stack of _Clients_ and adds another _Output_ to the _ForwardingConstruct_.  
Consequently, the _Subscription_ needs a second _Management_ for removing an _Output_ from the _ForwardingConstruct_.  
In case of the _Subscription_, all the existing _Outputs_ are reacting on an event at the _Input_.  

**ProcessSnippet**
Whenever a _ProcessSnippet_ receives new contact information at its _Management_, it updates one out of the already existing _Outputs_.  
In principle, the number of _Outputs_ is not restricted, but it is invariant after the specification of the application has been handed over to implementation.  
This restriction is due to the individual logic, which is implemented by the _ProcessSnippet_.  
The _ProcessSnippet_ is activating one or several of the _Outputs_ for reacting on an event.  
The reactions usually depend on the content of the _Input_, and it requires an internal decision to determine.  
Obviously, the _ProcessSnippet_ is at least close to, maybe even crossing the boundaries between _Forwarding_ and _Processing_.  
Up to now, the only way of describing the logic, which is implemented by the _ProcessSnippet_, is scripting _TestCases_.  


### Substructure of Management of Internal Forwarding

As already mentioned above, separate _Managements_ are used for subscribing and unsubscribing.  
Subscribing is creating _Clients_ and adding references to the _ForwardingConstruct_.  
Unsubscribing is removing references from the _ForwardingConstruct_ and potentially deleting the _Clients_.  
Thus, in general there might be several _Managements_ defined on a _Forwarding_ and the _ForwardingList_ allows to distinguish their roles.  

In principle, _Forwarding_ defines just an _Input_-_Output_-relationship between at least two interfaces.  
These interfaces could exist idenpendently from the _ForwardingConstruct_.  
 
The _ForwardingList_ allows distinguishing the following kinds of _Management_ by an individual _OperationServer_:  
- Just changing already existing and connected interfaces  
- Just connecting already existing interfaces  
- Just disconnecting, but not deleting an interface  

(Deleting, but not disconnecting doesn't make sense.)  
Unfortunately, the _ForwardingList_ is exceeding the capabilities of the syntax of the OpenApiSpecification v3.0 is these regards.  
How to code the information into description statements will be described in later chapters.  
