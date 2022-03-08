# Specifying Applications

Automated code generation and testing requires the applications being specified in syntactically well defined way.  
Any specification has to comprise the following components.

### Name of the Application

The Application needs a proper naming.  
This issue must not be underestimated. The ApplicationName is treated as an identifier (means e.g. that it must be invariant). Right after starting the specification and implementation process, resources will be referenced by ApplicationName and also during later operation, important processes will reference the ApplicationName (and ReleaseNumber).

**Concepts**
* [Structure of ApplicationNames](./StructureOfApplicationNames/StructureOfApplicationNames.md)

### Purpose of the Application

The Purpose of the application must be expressed in a single sentence. It must be most comprehensive and precise.

### Repository

**Concepts**
* [Standardized ApplicationRepository](./StandardizedApplicationRepository/StandardizedApplicationRepository.md)

**Step-by-Step Guidelines**
* [Getting the ApplicationRepository](./GettingApplicationRepository/GettingApplicationRepository.md)
* [Starting the Specification](./StartingToSpecify/StartingToSpecify.md)


### ServiceList

The ServiceList must represent all services, which are either provided or consumed by the application.

[ServiceList](./ServiceList/ServiceList.md)

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

[LOADfile](./LoadFile/LoadFile.md)

### TestCases

The TestCases are a Postman collection of requests for 
  * describing the business logic, which is to be implemented behind the REST API
  * supporting testing during implementation
  * acceptance testing
  * continuous integration testing

  [TestCases](./TestCases/TestCases.md)





  [<- Back to Preparing](../PreparingSpecifying/PreparingSpecifying.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)
