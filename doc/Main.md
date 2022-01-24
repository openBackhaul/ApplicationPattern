# Documentation of the ApplicationPattern

### Introduction

Overall target is implementing an SDN, which facilitates vendor agnostic network automation.

The device layer is composed from many different device types and a wide variety of management interfaces.
Mediators are used to translate individual management interfaces towards a single, harmonized NETCONF/YANG interface.
An OpenDaylight SDN Controller is translating from NETCONF to RESTCONF.

The application layer is modular for being more flexible and cost efficient than former dominance of monolithic blocks.
It is sub-structured into

* data sanitation and caching layer, which is for providing a high performance network interface
* business layer, which is for holding domain specific functions that are either implementing automation or supporting humans in configuration activities
* representation layer, which is for providing user interfaces that are representing the functions of the business layer.

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

The **Name of the application** must describe the application's role in the modular application layer in few, but meaningful words. It must be written in UpperCamelCase and it must be unique. The uppercase letters of the name must form an abbreviation, which is also unique within the modular application layer.

The **Purpose of the application** must be expressed in a single sentence. It must be most comprehensive and precise.

The **ServiceList** must represent all services, which are either provided or consumed by the application.

The **ForwardingList** must describe all relationships between events and reactions that need to be documented and configurable at the application.

The **OpenApiSpecification** represents the detailed specification of the REST API of the application.

The **LOADfile** describes the data structure inside the application and on the disk. The defined values represent the initial state of the application directly after instantiation.

The **TestCases** are a Postman collection of requests for 
* describing the business logic, which is to be implemented behind the REST API
* supporting testing during implementation
* acceptance testing
* continuous integration testing


### Preparing for specifying Applications

The following steps have to be taken to become an ApplicationOwner.

#### **GitHub**

A detailed documentation is required to be efficient in developing the application layer. All ApplicationOwners are very much invited to contribute to the guidelines. 

The guidelines as well as the later specifications are hosted and managed on [github.com/openBackhaul](./https://github.com/openBackhaul/Overview). It is recommended to create a bookmark for jumping into the Overview.

All information about the ApplicationPattern can be found in the [TSI branch of the ApplicationPattern repository](./https://github.com/openBackhaul/ApplicationPattern/tree/tsi).

Documentation and templates are linked into the readme. Need for change or completion of the ApplicationPattern is addressed in the [Issues](.https://github.com/openBackhaul/ApplicationPattern/issues).

An own GitHub account is required to collaborate. Cooperation will be easier, if real names are used. [Guidance for creating a free account](.https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account).

In the beginning, no local installation is required for working with GitHub. Later, linking with VisualStudio or another development environment might make sense.

GitHub is providing a [vast documentation](./https://docs.github.com/en). The section about [Collaborating with pull requests](./https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) is of special importance.

All documentation, readme and issues on GitHub are edited in MarkDown syntax. [Basic syntax of MarkDown](./https://www.markdownguide.org/basic-syntax/).

> If you would have found need for correction or completion on these guideline, please feel very much invited to create pull requests, which are proposing improved formulations.

#### **Postman**

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is representing the API. The mock helps verifying correctness of the specification and it is very supportive while writing the TestCases.

The basic Postman is for free. Installing it according to [this guideline](./?) will facilitate smooth connection to the SDN laboratory environment.

Also Postman is providing a [vast documentation](./https://learning.postman.com/docs/getting-started/introduction/). The section about [designing APIs](./https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/) is complementing the specific guidance given in [elaborating the OpenApiSpecification](./?).

Postman is synchronizing into its own cloud. So the ApplicationOwner can seamlessly work on his APIs and TestCases on multiple devices. It is also possible to work in teams, but this requires chargeable licenses, which are available to limited extend.

#### **Open API specification (Swagger)**


#### **YAML**


#### **Notepad++**


#### **JSON**


#### **JavaScript**





### Guidance for specifying Applications

Additional guidance is given in the following aspects.



* [High Level Structure of Specifications](./HighLevelStructureOfSpecifications.md)
