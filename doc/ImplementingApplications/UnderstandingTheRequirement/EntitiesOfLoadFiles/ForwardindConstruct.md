## ForwardingConstruct:
FC objects describes the connection between OperationServers and OperationClients. The FCs are the crucial component using which one Microservice can communicate with other Microservice in the application layer.
Let’s have a look into the significance and usage of each property of FCs.
- **uuid** : Like LTP and FD , FCs also has its own unique identifier. The generic syntax is <CC uuid>-op-fc-d{4}
- **FcPort** : Each FC consists of a list of FcPorts. The association of the FC to LTPs is always made via FcPorts. The traffic forwarding between the associated FcPorts of the FC depends upon the type of FC.
The FcPort consists of the following properties , 
  - **LocalId** : to identify a FcPort , this id is unique within that residing FC
  - **LogicalTerminationPoint** : represent the OperationClient or OperationServer uuid
  - **PortDirection**: The direction can be any one of the following , 
    - **MANAGEMENT**: FcPort of this type is always represented by an OperationServer. This influences the creation/deletion or modification of FcPorts in a FC. A FC may consist of zero to n-number of MANAGEMENT Port.For example , if an OperationServer “v1/service” is represented as a MANAGEMENT FcPort , then whenever “v1/service” is consumed , either a new FcPort will be created for the context of that particular request or an existing FcPort will be removed from the FcPort list of the FC. 
    - **INPUT** : FcPort of this PortDirection is always represented by an OperationServer. This influence in executing one or many output FcPorts of the FC. For example , if an OperationServer “v1/service” is listed as a INPUT FcPort , then whenever “v1/service” is executed , one or many OUTPUT FcPorts will be triggered with proper request formulation.
    - **OUTPUT** : FcPort of this PortDirection is always represented by an OperationClient. This provide information about the services that needs to be consumed when one of the INPUT FcPort of the FC is executed.
	
- **name** : This property is a list of key value pair consists of the following keys,
  - **ForwardingName** : Provides a unique self-explanatory name for the FC
  - **ForwardingKind** : The value for this key should be any one of the following types, 
    - **INVARIANT_PROCESS_SNIPPET** : means all the OUPUT FcPorts will be executed. Addition or deletion of FcPorts are not allowed as this FC is invariant.
    - **PROCESS_SNIPPET** : means any one or two or all of the OUTPUT FcPorts will be executed based on the context and requirement. Addition or deletion of FcPorts are allowed.
    - **SUBSCRIPTION** : means all the OUTPUT FcPorts will be executed. Addition or deletion of FcPorts are allowed.

[<- Back to LogicalTerminationPoint](./LogicalTerminationPoint.md) - - - [Up to How to get a high-level overview](../UnderstandingTheOAS/HighLevelOverview.md)
