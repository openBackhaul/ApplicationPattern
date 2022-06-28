# Specifying Applications

Automated code generation and testing requires the applications being specified in syntactically well defined way.  
Any specification, which shall be published for implementation, has to comprise OpenApiSpecification, CONFIGfile and TestCases.  
A couple of additional documents have to be elaborated to ease creation of the three main documents.  
In general the following sequence of activities is recommended:

![Workflow for Specifying Applications](https://user-images.githubusercontent.com/57349523/175539673-fc620814-681f-48b2-8e42-8063afc855be.jpg)


### Purpose of the Application

The Purpose of the application shall be expressed in a single sentence. It must be most comprehensive and precise.


### Name of the Application

The ApplicationName is treated as an identifier (means e.g. that it must be invariant).
Right after starting the specification and implementation process, resources will be referenced by ApplicationName and also during later operation, important processes will reference the ApplicationName (and ReleaseNumber).  

**Concepts**
* [Structure of ApplicationNames](./StructureOfApplicationNames/StructureOfApplicationNames.md)


### Repository

Every Application needs an own repository, which will exist in parallel to the Application over its entire lifespan. Initial specification, but also implementation and later bug fixing and potential expansion of the Application will be organized through this repository.

**Concepts**
* [Creating the ApplicationRepository](./CreatingApplicationRepository/CreatingApplicationRepository.md)
* [Standardized ApplicationRepository](./StandardizedApplicationRepository/StandardizedApplicationRepository.md)

**Step-by-Step Guidelines**
* [Starting the Specification](./StartingToSpecify/StartingToSpecify.md)


### ServiceList

The ServiceList must represent all services, which are either provided or consumed by the application. The ServiceList is a compact notation for designing the service names and allocating the UUIDs. It provides full focus on composing a complete and well-structured set of services before adding parameter and body details in the OpenApiSpecification.  

**Concepts**
* [Structure of Services](./StructureOfServices/StructureOfServices.md)
* [Structure of ServiceNames](./StructureOfServiceNames/StructureOfServiceNames.md)
* [Structure of Release Numbers](./StructureOfReleaseNumbers/StructureOfReleaseNumbers.md)
* [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md)
* [Concept of ServiceList](./ConceptOfServiceList/ConceptOfServiceList.md)

**Step-by-Step Guidelines**
* [Creating the ServiceList](./CreatingServiceList/CreatingServiceList.md)


### ProfileList

The ProfileList must represent all Profiles, which are used inside the application. Profiles are used for storing configuration information, which is not directly related to a specific interface. The ProfileList is a compact notation for designing Profiles.

**Concepts**
* [Structure of UUIDs](./StructureOfUuids/StructureOfUuids.md)
* [Concept of Profiles](./ConceptOfProfiles/ConceptOfProfiles.md)

**Step-by-Step Guidelines**
* [Creating the ProfileList](./CreatingServiceList/CreatingServiceList.md)
* [Library of Profiles](./ProfileLibrary/ProfileLibrary.md)


### ForwardingList

The ForwardingList must describe all relationships between events and reactions that need to be documented and configurable at the application.
[ForwardingList](./ForwardingList/ForwardingList.md)


### OpenApiSpecification

The OpenApiSpecification represents the detailed specification of the REST API of the application.

**Step-by-Step Guidelines**
* [Getting Template](./GettingOasTemplate/GettingOasTemplate.md)
* [Individualizing the Template](./IndividualizingOasTemplate/IndividualizingOasTemplate.md)
* [Transferring ServiceList content](./TransferringServiceList/TransferringServiceList.md)
* [Detailing the Services](./DetailingServices/DetailingServices.md)
* [Transferring ForwardingList content](./TransferringForwardingList/TransferringForwardingList.md)
* [Creating Mock](./CreatingMock/CreatingMock.md)
* [Reviewing the OAS](./ReviewingOas/ReviewingOas.md)


### LOADfile

The LOADfile describes the data structure inside the application and on the disk. The defined values represent the initial state of the application directly after instantiation.

**Concepts**
* [LOADfile](./LoadFile/LoadFile.md)


### TestCases

The TestCases are a Postman collection of requests for 
  * describing the business logic, which is to be implemented behind the REST API
  * supporting testing during implementation
  * acceptance testing
  * continuous integration testing

**Concepts**
* [TestCases](./TestCases/TestCases.md)


### Publishing

After finishing specification work on a release, files have to be published for initiating next steps.

**Concepts**
* [Publishing a Specification](./PublishingSpecification/PublishingSpecification.md)


[<- Back to Preparing](../PreparingSpecifying/PreparingSpecifying.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)
