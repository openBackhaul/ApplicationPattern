# Understanding the CONFIG file

- [What is this CONFIGfile ?](../../ElementsApplicationPattern/Principles/ConfigFile/ConfigFile.md)
- Entities of Load files
  - [UUIDs](https://github.com/openBackhaul/ApplicationPattern/blob/openBackhaul/issue454/doc/ElementsApplicationPattern/Names/StructureOfUuids/StructureOfUuids.md)
    - All UUIDs are invariant: UUIDs get created during instantiation of a logical object. They get deleted while deleting the object. They get never changed during existence of the object.
    - UUIDs have to be treated as fortuitous Strings: UUIDs shall not be parsed and interpreted for controlling the program flow, but taken as random Strings for identifying logical objects that hold attributes, which are containing the searched information. Navigating through the data tree has to be done based on the attributes' values.
 
  - [ControlConstruct](../../ElementsApplicationPattern/InformationModel/ControlConstruct/ControlConstruct.md) 
  - [LogicalTerminationPoint](../../ElementsApplicationPattern/InformationModel/LogicalTerminationPoint/LogicalTerminationPoint.md)
  - ForwardingDomain: The ForwardingDomain(FD) aggregates one or more ForrwardingConstruct(FC). Theoretically CC consists of a list of FDs. But practically a Microservice consists of a single FD instance. FDs are identified by a uuid.
  - [ForwardingConstruct](../../ElementsApplicationPattern/InformationModel/ForwardingConstruct/ForwardingConstruct.md)




