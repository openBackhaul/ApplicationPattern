# Introduction

Overall target is implementing an SDN, which facilitates vendor agnostic network automation.

The device layer is composed from many different device types and a wide variety of management interfaces.
Mediators are used to translate individual management interfaces towards a single, harmonized NETCONF/YANG interface.
An OpenDaylight SDN Controller is translating from NETCONF to RESTCONF.

The application layer is modular for being more flexible and cost efficient than former dominance of monolithic blocks.
It is sub-structured into

* data sanitation and caching layer, which is for providing a high performance network interface
* business layer, which is for holding domain specific functions that are either implementing automation or supporting humans in configuration activities
* representation layer, which is for providing user interfaces that are representing the functions of the business layer.

![Substructure of the Modular MW SDN Application Layer](https://user-images.githubusercontent.com/15265413/151411515-49b13bcb-01d6-45a9-bbad-30a6329b9ed0.png)

The applications of the lower two layers are implemented as REST servers. This makes them very efficient to implement, to test and to deploy.

The ApplicationPattern is required to assure smooth integration into an operation and maintenance infrastructure.
It defines

* headers, for providing information that is required by central management functions
* services, for
  * supporting centralized functions like access management
  * informing about the application itself
  * administrating the application, e.g. in case of update
* and an OaM layer that makes the internal resources of the application available for configuration.

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

# Preparing for specifying Applications

The following steps have to be taken to prepare for becoming an ApplicationOwner.

### GitHub

A detailed documentation is required to be efficient in developing the application layer. All ApplicationOwners are very much invited to contribute to the guidelines. 

The guidelines as well as the later specifications are hosted and managed on [github.com/openBackhaul](https://github.com/openBackhaul/Overview). It is recommended to create a bookmark in the browser for jumping into the Overview.

All information about the ApplicationPattern can be found in the [TSI branch of the ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/tsi).

Documentation and templates are linked into the readme. Need for change or completion of the ApplicationPattern is addressed in the [Issues](https://github.com/openBackhaul/ApplicationPattern/issues).

An own GitHub account is required to collaborate. Cooperation will be easier, if real names are used. [Guidance for creating a free account](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account).

In the beginning, no local installation is required for working with GitHub. Later, linking with VisualStudio or another development environment might make sense. [Guidance on how to connect VisualStudio on OfficeLaptop with GitHub](./VisualStudio2GitHub/VisualStudio2GitHub.md).

GitHub is providing a [vast documentation](https://docs.github.com/en). The section about [Collaborating with pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) is of special importance.

All documentation, readme and issues on GitHub are edited in MarkDown syntax. [Basic syntax of MarkDown](https://www.markdownguide.org/basic-syntax/).

**If you would find need for correcting or complementing these guideline, please feel very much invited to create pull requests, which are proposing improved formulations.**

### Postman

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is simulating the API. The mock helps verifying correctness of the specification and it is very supportive while writing the TestCases.

The basic Postman is for free. Installing it according to [this guideline](./InstallingPostman/InstallingPostman.md) will facilitate smooth connection to the SDN laboratory environment.

Also Postman is providing a [vast documentation](https://learning.postman.com/docs/getting-started/introduction/). The section about [designing APIs](https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/) is complementing the specific guidance given in [elaborating the OpenApiSpecification](./OpenApiSpecification/OpenApiSpecification.md).

Postman is synchronizing into its own cloud. So the ApplicationOwner can seamlessly work on his APIs and TestCases on multiple devices. It is also possible to work in teams, but this requires chargeable licenses, which are available to limited extend.

### Open API specification (Swagger) and YAML

Automated code generation requires syntactically well defined specifications.

OpenAPI Specification (formerly Swagger Specification) has been choosen for describing REST APIs. [Very good documentation](https://swagger.io/docs/specification/basic-structure/).

YAML format has been choosen for writing the OpenApiSpecifications. It is based on indents and is easy to learn from the examples in the Swagger Specifications.

### JSON and Notepad++

LOADfiles are written in JSON. Reading through existing examples like e.g. in [RegistryOffice](../../../../RegistryOffice/tree/tsi/) or [ExecutionAndTraceLog](../../../../ExecutionAndTraceLog/tree/tsi/) is probably the easiest way of learning the necessary structures and formats.

LOADfiles are of several thousands of lines. Notepad++ or other feature rich editors are very much preferred over the standard Editor provided with Windows. Notepad++ can be loaded from the corporate app store.

### JavaScript

TestCases are sequences of Requests in Postman. A Postman Request combines a Pre-request Script, an actual HTTP request and a Test Script. The Pre-request Script is for preparing the HTTP request. The Test Script is for assessing the response to the HTTP request. Both Pre-request and Test Script are little JavaScript programs, which are executed in the Postman JavaScript sandbox.

This sandbox relieves the ApplicationOwner from many, many tasks, which would have to be done in "real" JavaScript programming.
Reading about
* language core (e.g. variables, datatypes, operations, conditions, loops, functions, error handling)
* composed datatypes and references
should suffice for preparing.

It is necessary to read the chapter [Writing Scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/) at the Postman learning center to understand the specifics of the sandbox and particularly the handling of variables of different layers (e.g. Environment, Collection).

Further on, it is recommended to new ApplicationOwners to study existing testcase collections for getting familiar with the basic structures.

# Specifying Applications

More detailed guidance is given for the following components of the specification.

* [ServiceList](./ServiceList/ServiceList.md)
* [ForwardingList](./ForwardingList/ForwardingList.md)
* [OpenApiSpecification](./OpenApiSpecification/OpenApiSpecification.md)
* [LOADfile](./LoadFile/LoadFile.md)
* [TestCases](./TestCases/TestCases.md)

# Components of the TinyApplicationController

### RegistryOffice
All applications will automatically register at the RegistryOffice

### TypeApprovalRegister
The TypeApprovalRegister stores already granted approvals

### ExecutionAndTraceLog
ExecutionAndTraceLog is logging all service activities

### OamLog
OamLog is logging all administrative activities

### AdministratorAdministration
AdministratorAdministration is authenticating OaM requests

### ApplicationLayerTopology
ApplicationLayerTopology represents interfaces and forwardings

### OperationKeyManagement
OperationKeyManagement keeps operation keys in synch

# Elements of the ApplicationPattern
* Header

* Basic Services

**StartApplicationInGenericRepresentatio**

* OaM layer
