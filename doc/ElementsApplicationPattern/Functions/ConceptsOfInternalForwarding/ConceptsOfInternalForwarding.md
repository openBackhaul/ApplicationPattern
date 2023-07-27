# Concept of Internal Forwarding  

**Background**  
There are a lot of interactions between the applications of the modular application layer, which all are based on REST requests. Every individual application needs to know the related information about other applications for properly addressing them. (E.g. the URIs of these REST requests must comprise e.g. TCP/IP address and _OperationName_.)
- These information cannot be hard coded, as the implementation of an individual application would out-date as soon as the TCP/IP address of one of its serving applications would change.
- Thus, TCP/IP addresses and _OperationName_ get documented in the CONFIGfiles of the individual applications.
Interaction example: whenever an application receives a request, it has to send one to the _ExecutionAndTraceLog_ application for documenting the processing of the received request.

**CONFIGfiles**  
- A stack of _TcpClient_, _HttpClient_ and _OperationClient_ is used for documenting the information, which is required for addressing a consumed service.
  - Address information of an already known application could be altered by modifying the values of the attributes inside these _Clients_.
  - This could be done manually in the CONFIGfile or via the OaM segment of the REST API during runtime.
To some extend it is even automated via the service segment of the REST API.
- example for the relationships between _OperationServers_ and _OperationClients_: '... whenever an application receives a request, it has to send one to the ExecutionAndTraceLog....'
- If these relationships would be hardcoded, it would not be possible to redirect the flow from event to reaction, and a dynamic change of the application layer would not be possible.
Thus, the relationships need to be documented in the CONFIGfiles of the individual applications, too.

**Forwarding Components**  
- _ForwardingDomains_ and _ForwardingConstructs_ are used for documenting the relationships between received (_OperationServer_) and to be sent requests (_OperationClients_).
- _ForwardingConstructs_ are used for representing a wide range of relationships from process flows to calculations.
The _ForwardingConstructs_ could be changed manually in the CONFIGfile or in automated way via the service segment of the REST API.
- The _ForwardingList_ is supporting designing the relationships before documenting them in a syntactically pre-defined way in the OpenApiSpecification and the CONFIGfile.
