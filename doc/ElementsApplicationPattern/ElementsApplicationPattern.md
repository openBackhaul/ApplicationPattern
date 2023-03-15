# Elements of the ApplicationPattern


### Concepts

**General Design Principles**
- [Microservice](./Principles/Microservice/Microservice.md)
- [HTTP Request](./Principles/Http/Http.md)
- [RESTful](./Principles/Restful/Restful.md)
- [API-First Approach](./Principles/ApiFirst/ApiFirst.md)
- [OpenAPI Specificatgion](./Principles/OpenApiSpecification/OpenApiSpecification.md)

**Functions**
- [Structure of Services](./Functions/StructureOfServices/StructureOfServices.md)
- [Concept of Profiles](./Functions/ConceptOfProfiles/ConceptOfProfiles.md)
- [Concepts of Internal Forwarding](./Functions/ConceptsOfInternalForwarding/ConceptsOfInternalForwarding.md)
- [Structure of Internal Forwarding](./Functions/StructureOfInternalForwarding/StructureOfInternalForwarding.md)
- [Types of Internal Forwarding](./Functions/TypesOfInternalForwardings/TypesOfInternalForwardings.md)
- [Substructure of Management of Internal Forwarding](./Functions/SubstructureOfManagementOfInternalForwardings/SubstructureOfManagementOfInternalForwardings.md)
- [Concept of _CONFIGfile_](./Functions/ConceptOfConfigFile/ConceptOfConfigFile.md)
- [Concept of _DATAfile_](./Functions/ConceptOfDataFile/ConceptOfDataFile.md)
- [Structure of _CONFIGfile_](./Functions/StructureOfConfigFile/StructureOfConfigFile.md)
- [Concept of OpenApiSpecification](./Functions/ConceptOfOas/ConceptOfOas.md)
- [Structure of OpenApiSpecification](./Functions/StructureOfOas/StructureOfOas.md)
- [Concept of TestCases](./Functions/ConceptOfTestCases/ConceptOfTestCases.md)
- [Structure of TestCases](./Functions/StructureOfTestCases/StructureOfTestCases.md)

**Names and IDs**
- [Structure of ApplicationNames](./Names/StructureOfApplicationNames/StructureOfApplicationNames.md)
- [Structure of ServiceNames](./Names/StructureOfServiceNames/StructureOfServiceNames.md)
- [Structure of Release Numbers](./Names/StructureOfReleaseNumbers/StructureOfReleaseNumbers.md)
- [Structure of UUIDs](./Names/StructureOfUuids/StructureOfUuids.md)
- [Structure of Internal Forwarding Names](./Names/StructureOfInternalForwardingNames/StructureOfInternalForwardingNames.md)


### Underlying Information Model

**Classes**
- [ControlConstruct](./InformationModel/ControlConstruct/ControlConstruct.md) 
- [LogicalTerminationPoint and LayerProtocol](./InformationModel/LogicalTerminationPoint/LogicalTerminationPoint.md)
- [ForwardingDomain, ForwardingConstruct and ForwardingConstructPort](./InformationModel/ForwardingConstruct/ForwardingConstruct.md) 
- [ProfileCollection and Profile](./InformationModel/Profile/Profile.md) 
- [NetworkControlDomain and Link](./InformationModel/Link/Link.md) 


### Basic Services

- /v1/bequeath-your-data-and-die
- /v1/start-application-in-generic-representation
- /v1/register-yourself
- /v1/embed-yourself
- /v1/redirect-service-request-information
- /v1/redirect-oam-request-information
- /v1/end-subscription
- /v1/inquire-oam-request-approvals
- /v1/update-client
- /v1/list-ltps-and-fcs
- /v1/redirect-topology-change-information
- /v1/update-operation-key
- /v1/update-operation-client
- /v1/inform-about-application
- /v1/inform-about-application-in-generic-representation
- /v1/inform-about-release-history
- /v1/inform-about-release-history-in-generic-representation


### Headers

- user
- originator
- x-correlator
- trace-indicator
- customer-journey
