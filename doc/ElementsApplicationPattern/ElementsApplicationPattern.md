# Elements of the ApplicationPattern


### Concepts

**General Design Principles**
* **Idempotence**: In general, executing the same request (applies on Services and OaM) with the same set of attributes again, shall just lead to the same state. There shall be no error messages, which would indicate that no change has been made. This shall apply in general. Few exceptions might occur (hypothetical example: /v1/create-additional-instance), but not contradict the general principle.

**Functions**
* [Structure of Services](./StructureOfServices/StructureOfServices.md)
* [Concept of Profiles](./ConceptOfProfiles/ConceptOfProfiles.md)
* [Concepts of Forwarding](./ConceptsOfForwarding/ConceptsOfForwarding.md)

**Names and IDs**
* [Structure of ApplicationNames](./StructureOfApplicationNames/StructureOfApplicationNames.md)
* [Structure of ServiceNames](./StructureOfServiceNames/StructureOfServiceNames.md)
* [Structure of Release Numbers](./StructureOfReleaseNumbers/StructureOfReleaseNumbers.md)
* [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md)
* [Structure of CallbackNames](./StructureOfCallbackNames/StructureOfCallbackNames.md)


### Underlying Information Model

**Overview Information Model**

**Classes**
* [ControlConstruct](./EntitiesOfLoadFiles/ControlConstruct.md) 
* [LogicalTerminationPoint](./EntitiesOfLoadFiles/LogicalTerminationPoint.md)
* LayerProtocol
* Profile
* **ForwardingDomain**: The ForwardingDomain(FD) aggregates one or more ForrwardingConstruct(FC). Theoretically CC consists of a list of FDs. But practically a Microservice consists of a single FD instance. FDs are identified by a uuid.
* [ForwardingConstruct](./EntitiesOfLoadFiles/ForwardindConstruct.md)
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
