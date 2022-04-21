## LogicalTerminationPoint
CC consists of a list of LogicalTerminationPoint(LTP) instance. Each LTP in the list is unique and is identified by a uuid.
The LTP class represents the own application information, details of the exposed and the consumed services. The data represented by a LTP depends on the type of the underlying layer protocol. There are 6 types of layer protocols , 

![LayerProtocolTypes](pictures/LayerProtocol.png)

The server interfaces provide information about the Own application. 

- The HttpServer provides the current application name , release number , owner, and the revision history. There will be only one HttpServer instance per application.
- The TcpServer provides the IPv4 address and port where the current application is running. There will be only one TcpServer instance per application.
- The services exposed by the application will be represented as OperationServer. The number of OperationServer depends on the exposed service. If a application exposes 4 services, then for each service , there will be a OperationClient instance available in the LTP list. The OperationServer consists of the name, operation key to validate the authorization and the lifecycle state of the service.

The client interfaces provide information about the consumed services and their application and transport details.

- The OperationClient interface provides information about the consumed services. The major property of this interface is the name of the consumed service and the operation key using which we can authorize the service.
- The HttpClient represents the details of a client application whose APIs are consumed. HttpClient acts as a server to the OperationClient. There is a one-to-many mapping between HttpClient to OperationClient.
- The TcpClient provides information about the IPv4 address and port at which a client application is running. There is a one-to-one mapping between a HttpClient and a TcpClient.

The association between the Tcp, Http and Operation client/server are represented by the properties “ClientLtp” and “ServerLtp”.

![ClientServerRelationships](pictures/clientServerLtp.png)

The LTP uuid’s generic syntax is `<CC-uuid>-[tcp|http|op]-[c|s]- d{4}`. 
For example , for a TcpServer interface of the Registry Office application , the uuid will be ro-0-0-1-tcp-s-0000.


[<- Back to ControlConstruct](./ControlConstruct.md) - - - [Up to ForwardingConstruct](./ForwardindConstruct.md)