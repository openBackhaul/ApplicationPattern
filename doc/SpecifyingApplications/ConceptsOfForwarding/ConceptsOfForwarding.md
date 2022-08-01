# Concept of Internal Forwarding  


### Purpose of Internal Forwarding  

There are a lot of interactions between the applications of the modular application layer.  
For example, whenever an application receives a request, it has to send one to the ExecutionAndTraceLog application for documenting processing of the received request.  
All these interactions between the applications are based on REST requests.  
These REST requests comprise TCP/IP address and service name.  
Certainly, somehow an application needs to know, which TCP/IP address and service name to use for example for documenting successful processing of a request.  
If the information would be hard coded, the implementation of an application would out-date as soon as the TCP/IP address of one of its serving applications would change.  
Thus, TCP/IP addresses and service names must at least be stored in parameter files, but manual changes on that files don't really fit together with an application layer of several tens or hundrets of applications.  
This is why we did not just put these values into a CONFIGfile, but also made them available for configuration via the REST interface of the application.  
Even better, communication and configuration of many changes to the traffic relationships between the applications got automated, - but also these automations require to be documented as Forwardings.  


### Structure of Internal Forwardings

Forwardings are describing relationships between Events and Reactions.  
Since we are dealing with REST servers,  
- an Event is a request, which has been received on one of the services offered by the application and  
- the Reaction is a request, which has to be sent to another application.  

As described above, these relationships shall be configurable.  
Since we are dealing with REST servers, also configuration of the Forwardings is done by requests addressing a service offered by the application.  

Thus, a Forwarding has to be described by requests for Input, Output and Management.  
Obviously, Input and Management are represented by references on OperationServers and Output by references on OperationClients.  

Example: The TypeApprovalRegister is requesting for notifications about registrations at the RegistryOffice.  
Management: The TypeApprovalRegister is informing about its TCP/IP address and service name by addressing the /v1/inquire-application-type-approvals service at the RegistryOffice.  
Input/Event: Some new application is addressing the /v1/register-application service at the RegistryOffice.  
Output/Reaction: The RegistryOffice is addressing the service that has been prescribed by the TypeApprovalRegister in the initial Management request.  


### Types of Internal Forwardings

Forwardings can be distinguished by the way of reacting on Management requests.  

**InvariantProcessSnippet**
Whenever an InvariantProcessSnippet receives new contact information at its Management, it updates the existing Output.  
Example: Every application has to inform the OamLog about requests that are addressing its OaM part of the REST interface.  
Of course, it would not be wished, if third parties would receive copies of this information.  
Thus, the Forwarding to the OamLog is made in such a way that only a single OperationClient (Reaction) gets activated by an Event.  

**Subscription**
Whenever a Subscription receives new contact information at its Management, it adds another Output.  
Consequently, the Subscription needs a second Management for removing an Output from the list.  
In case of the Subscription, all the existing OperationClients react on an Event.  

**ProcessSnippet**
Whenever a ProcessSnippet receives new contact information at its Management, it updates one out of the already existing Outputs.  
In principle, the number of Outputs is not restricted, but it is invariant after the specification of the application has been handed over to implementation.  
The ProcessSnippet is activating one or several of the OperationClients for reacting on an Event.  
The reactions usually depend on the content of the Input, and it requires an internal decision to determine.  
Obviously, the ProcessSnippet is at least close to, maybe even crossing the boundaries between Forwarding and Processing.  
Up to now, the only way of describing Processing is scripting TestCases.  

Anyway, meaningful ServiceNames and ForwardingNames are supporting understanding the application from reading the OpenApiSpecification.


### Management of Internal Forwarding

In principle, Forwarding defines an Event-Reaction-relationship between at least two interfaces.  
These interfaces can exist idenpendently from the Forwarding.  
Thus, management of the Forwarding must destinguish e.g. removing the interface from the Forwarding and deleting it, because it might still be used for other purposes.  
In practice, creating the interface and connecting it with the Forwarding is usually done by the same Management request, and it is left to the implementation to just create the interface, in case it is not already existing.  
Also disconnecting the interface from the Forwarding and deleting it is usually done by the same Management request, and it is left to the implementation to just delete the interface (only clients!), if it is not referenced by any other Forwarding.  
Nevertheless, the FowardingList allows expressing:
- Just changing already existing and connected interfaces
- Just connecting already existing interfaces
- Just disconnecting, but not deleting an interface
(Deleting, but not disconnecting doesn't make sense.)


# Concept of External Forwarding  
_Documentation about External Forwarding to be added_
