# Specifying Applications

Automated code generation and testing requires the applications being specified in syntactically well defined way. Any specification has to comprise the following components.

* The **Name of the application** must describe the application's role in the modular application layer in few, but meaningful words. It must be written in UpperCamelCase and it must be unique. The uppercase letters of the name must form an abbreviation, which is also unique within the modular application layer.
* The **Purpose of the application** must be expressed in a single sentence. It must be most comprehensive and precise.
* The **ServiceList** must represent all services, which are either provided or consumed by the application.
* The **ForwardingList** must describe all relationships between events and reactions that need to be documented and configurable at the application.
* The **OpenApiSpecification** represents the detailed specification of the REST API of the application.
* The **LOADfile** describes the data structure inside the application and on the disk. The defined values represent the initial state of the application directly after instantiation.
* The **TestCases** are a Postman collection of requests for 
  * describing the business logic, which is to be implemented behind the REST API
  * supporting testing during implementation
  * acceptance testing
  * continuous integration testing

More detailed guidance is given for the following components of the specification.

* [ServiceList](./ServiceList/ServiceList.md)
* [ForwardingList](./ForwardingList/ForwardingList.md)
* [OpenApiSpecification](./OpenApiSpecification/OpenApiSpecification.md)
* [LOADfile](./LoadFile/LoadFile.md)
* [TestCases](./TestCases/TestCases.md)

[<- Back to Preparing](../PreparingSpecifying/PreparingSpecifying.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)
