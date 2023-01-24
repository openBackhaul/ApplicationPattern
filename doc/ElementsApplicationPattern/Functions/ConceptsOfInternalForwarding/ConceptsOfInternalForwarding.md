# Concept of Internal Forwarding  

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
