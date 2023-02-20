# ForwardingDomain, ForwardingConstruct and ForwardingConstructPort



- **ForwardingDomain**: The ForwardingDomain(FD) aggregates one or more ForrwardingConstruct(FC). Theoretically CC consists of a list of FDs. But practically a Microservice consists of a single FD instance. FDs are identified by a uuid.




ForwardingConstructs (FC) describe the relationships between OperationServers and OperationClients.  
FCs are the crucial component for documenting which microservice is allowed to communicate with other microservices in the application layer.  

The ForwardingConstruct comprises:
- **UUID**: Like LTP and FD, the FC also has an unique identifier. Details can be found in [Structure of UUIDs](../../Names/StructureOfUuids/StructureOfUuids.md)  
- **FcPort**: Each FC consists of a list of FcPorts. The association of the FC to LTPs is always made via FcPorts. The traffic forwarding between the associated FcPorts of the FC depends upon the type of FC.  

The FcPort comprises:
  - **LocalId**: Identifies an FcPort in the list of FcPorts at the FC. It is unique just within the residing FC.  
  - **LogicalTerminationPoint**: Contains the OperationClient or OperationServer UUIDs.  
  - **PortDirection**: The direction can be any one of the following:  
    - **MANAGEMENT**: FcPort of this type is always pointing towards an OperationServer that influences the creation/deletion or modification of FcPorts in an FC. An FC may have zero to n MANAGEMENT Ports. For example, if an OperationServer “v1/service” is represented as a MANAGEMENT FcPort, then whenever “v1/service” is addressed, either a new FcPort will be created for the context of that particular request or an existing FcPort will be removed from the FcPort list of the FC.  
    - **INPUT**: FcPort of this PortDirection is always represented by an OperationServer. This influence in executing one or many output FcPorts of the FC. For example , if an OperationServer “v1/service” is listed as a INPUT FcPort, then whenever “v1/service” is addressed, one or many OUTPUT FcPorts will be triggered.  
    - **OUTPUT**: FcPort of this PortDirection is always represented by an OperationClient. This provides information about the services of other applications that needs to be consumed when one of the INPUT FcPorts of the FC gets addressed.  	
- **name**: This property is a list of key value pair consisting of the following keys,  
  - **ForwardingName**: Provides a unique self-explanatory name for the FC  
  - **ForwardingKind**: The value for this key should be any one of the following types,  
    - **INVARIANT_PROCESS_SNIPPET**: means all the OUPUT FcPorts will be executed. Adding or deleting of FcPorts is not allowed as this FC is invariant.  
    - **PROCESS_SNIPPET**: means any one or two or all of the OUTPUT FcPorts will be executed based on the context and requirement. Addition or deletion of FcPorts are allowed.  
    - **SUBSCRIPTION**: means all the OUTPUT FcPorts will be executed. Addition or deletion of FcPorts are allowed.  
