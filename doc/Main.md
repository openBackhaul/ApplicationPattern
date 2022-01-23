# Documentation of the ApplicationPattern

### Introduction

Overall target is implementing an SDN, which facilitates vendor agnostic network automation.

The device layer is composed from many different device types and a wide variety of management interfaces.
Mediators are used to translate individual management interfaces towards a single, harmonized NETCONF/YANG interface.
An OpenDaylight SDN Controller is basically just translating from NETCONF to RESTCONF.

The application layer is modular for being more flexible and cost efficient than former dominance of monolithic blocks.
It is sub-structured into

* data sanitation and caching layer, which is for providing a high performance network interface
* business layer, which is for holding domain specific functions that are either implementing automation or supporting humans in configuration activities
* representation layer, which is for providing user interfaces that are representing the functions of the business layer.

The applications of the lower two layers are implemented as bare REST servers. This makes them very efficient to implement, to test and to deploy.

The ApplicationPattern is required to asure smooth integration into an operation and maintenance infrastructure.
It defines

* headers, for providing information that is required by central management functions
* services, for
  * supporting centralized functions like access management
  * informing about the application itself
  * administrating the application, e.g. in case of update
* and an OaM layer that makes the internal resources of the application available for configuration.

Automated code generation and testing requires the applications being specified in syntactically well defined way. Any specification has to comprise the following components.

The **name of the application** must describe the application's role in the modular application layer in few, but meaningful words. It must be written in UpperCamelCase and be unique. The uppercase letters of the name of must form an abbreviation, which is also unique within the modular application layer.

The **purpose of the application** must be expressed in a single sentence. It must be most comprehensive and precise.

The **ServiceList** must represent all services, which are either provided or consumed by the application.

The **ForwardingList** must describe all relationships between events and reactions that need to be documented and configurable at the application.

The **OpenApiSpecification** represents the detailed specification of the REST API of the application.

The **LOADfile** describes the data structure inside the application and on the disk. The contained values represent the initial state of the application directly after instantiation.

The **TestCases** are a Postman collection of requests for 
* defining the business logic, which is to be implemented behind the REST API
* supporting testing during implementation
* acceptance testing
* continuous integration testing


### Guidance for specifying Applications

* [High Level Structure of Specifications](./HighLevelStructureOfSpecifications.md)
