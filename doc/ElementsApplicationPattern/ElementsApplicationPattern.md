# Elements of the ApplicationPattern


### Concepts

**General Design Principles**
* [API-First Approach](./Principles/ApiFirst/ApiFirst.md)
* [RESTful](./Principles/Restful/Restful.md)
* [Microservice](./Principles/Microservice/Microservice.md)
* [CONFIGfile](./Principles/ConfigFile/ConfigFile.md)

**Functions**
* [Structure of Services](./Functions/StructureOfServices/StructureOfServices.md)
* [Concept of Profiles](./Functions/ConceptOfProfiles/ConceptOfProfiles.md)
* [Concepts of Internal Forwarding](./Functions/ConceptsOfForwarding/ConceptsOfForwarding.md)

**Names and IDs**
* [Structure of ApplicationNames](./Names/StructureOfApplicationNames/StructureOfApplicationNames.md)
* [Structure of ServiceNames](./Names/StructureOfServiceNames/StructureOfServiceNames.md)
* [Structure of Release Numbers](./Names/StructureOfReleaseNumbers/StructureOfReleaseNumbers.md)
* [Structure of UUIDs](./Names/StructureOfUuids/StructureOfUuids.md)
* [Structure of CallbackNames](./Names/StructureOfCallbackNames/StructureOfCallbackNames.md)


### Underlying Information Model

**Overview Information Model**

**Classes**
* [ControlConstruct](./InformationModel/ControlConstruct/ControlConstruct.md) 
* [LogicalTerminationPoint](./InformationModel/LogicalTerminationPoint/LogicalTerminationPoint.md)
* LayerProtocol
* Profile
* **ForwardingDomain**: The ForwardingDomain(FD) aggregates one or more ForrwardingConstruct(FC). Theoretically CC consists of a list of FDs. But practically a Microservice consists of a single FD instance. FDs are identified by a uuid.
* [ForwardingConstruct](./InformationModel/ForwardingConstruct/ForwardingConstruct.md)
* ForwardingConstructPort
* NetworkControlDomain
* Link


### Basic Services

* /v1/bequeath-your-data-and-die
* /v1/start-application-in-generic-representation
* /v1/register-yourself
* /v1/embed-yourself
* /v1/redirect-service-request-information
* /v1/redirect-oam-request-information
* /v1/end-subscription
* /v1/inquire-oam-request-approvals
* /v1/update-client
* /v1/list-ltps-and-fcs
* /v1/redirect-topology-change-information
* /v1/update-operation-key
* /v1/update-operation-client
* /v1/inform-about-application
* /v1/inform-about-application-in-generic-representation
* /v1/inform-about-release-history
* /v1/inform-about-release-history-in-generic-representation


### Headers

* user
* originator
* x-correlator
* trace-indicator
* customer-journey
