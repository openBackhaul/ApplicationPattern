# Specifying Applications

Automated code generation and testing requires the applications being specified in syntactically well defined way.  
Any specification, which shall be published for implementation, has to comprise OpenApiSpecification, CONFIGfile and TestCases.  
A couple of additional documents have to be elaborated to ease creation of the three main documents.  
In general the following sequence of activities is recommended:

![Workflow for Specifying Applications](https://www.plantuml.com/plantuml/png/bPBHJiCm34NV-Gh_0UzZcZOLTPg4rgf5uZdhdCqYZOEJhXfVZpiGb4qLuYrophsvjhECoKZgMWSlBA_MSG-M1Ug03Tap-GEiGd3Kc4Jiuzrith1ZcQq5qIyUqPB7CL7q7cL-Vu4M3pTuR8Hs26KdWIC2MqZ7N_efQUQCQ1x8Ex_NK9FOaGVVaU7Mj3X5L_ZMOKoNXaUI2ZKS9PRpv3FS1eS9eKOvKODF5DEVR2bioVsBtNZTZh_n_yPobjx8C921q1kTC1qyPCKstwm7XvzQ4T2l0dqkzgjJlQrr8o71iyuXCn6ZbYey4VPwo3NKEyArfEnsZkBnkhv4lzT_z040 "Workflow for Specifying Applications")


## Purpose of the Application

The Purpose of the application shall be expressed in a single sentence. It must be most comprehensive and precise.  


## Name of the Application

The ApplicationName is treated as an identifier (means e.g. that it must be invariant).  
Right after starting the specification and implementation process, resources will be referenced by ApplicationName and also during later operation, important processes will reference the ApplicationName (and ReleaseNumber).  
Guidance can be found in [Structure of ApplicationNames](./../ElementsApplicationPattern/Names/StructureOfApplicationNames/StructureOfApplicationNames.md).  


## Repository

Every Application needs an own repository, which will exist in parallel to the Application over its entire lifespan.  
Initial specification, but also implementation and later bug fixing and potential expansion of the Application will be organized through this repository.  

**Concepts**
- [Creating the ApplicationRepository](./CreatingApplicationRepository/CreatingApplicationRepository.md)
- [Standardized ApplicationRepository](./StandardizedApplicationRepository/StandardizedApplicationRepository.md)

**Step-by-Step Guidelines**
- [Starting the Specification Process](./StartingToSpecify/StartingToSpecify.md)


## ServiceList

The ServiceList must represent all services, which are either provided or consumed by the application.  
The ServiceList is a compact notation for designing the service names and allocating the UUIDs.  
It provides full focus on composing a complete and well-structured set of services before adding parameter and body details in the OpenApiSpecification.  

**Concepts**
- [Concept of ServiceList](./ConceptOfServiceList/ConceptOfServiceList.md)

**Step-by-Step Guidelines**
- [Creating the ServiceList](./CreatingServiceList/CreatingServiceList.md)

## Sequence Diagrams

The sequence diagrams are a visualization of interaction chains between operation servers and operation clients and the basis for the individual forwardings in the forwardingList.  

**Concepts**  
- [Concepts of Sequence Diagrams](./ConceptOfSequenceDiagrams/ConceptOfSequenceDiagrams.md)

**Step-by-Step Guidelines**
- [Creating the Sequence Diagrams](./CreatingSequenceDiagrams/CreatingSequenceDiagrams.md)


## ProfileList and ProfileInstanceList

The ProfileList and the ProfileInstanceList must represent all Profiles, which are used inside the application.  
Profiles are used for storing configuration information, which is not directly related to a specific interface.  
The ProfileList describes the Profiles as classes and supports creating the OpenApiSpecification.  
The ProfileInstanceList lists all objects created from the Profile classes; it supports creating the CONFIGfile.  

**Concepts**
- [Concepts of ProfileList and ProfileInstanceList](./ConceptOfProfileList/ConceptOfProfileList.md)

**Step-by-Step Guidelines**
- [Creating the ProfileList](./CreatingProfileList/CreatingProfileList.md)
- [Creating the ProfileInstanceList](./CreatingProfileInstanceList/CreatingProfileInstanceList.md)


## ForwardingList

The ForwardingList must describe all relationships between events and reactions that need to be documented and configurable at the application.

**Concepts**
- [Concepts of the _ForwardingList_](./ConceptsOfForwardingList/ConceptsOfForwardingList.md)  
- [Structure of the _ForwardingList_](./StructureOfForwardingList/StructureOfForwardingList.md)  
- [Structure of a Description of a _Forwarding_](./StructureOfForwardingDescription/StructureOfForwardingDescription.md)

**Step-by-Step Guidelines**
- [Creating the ForwardingList](./CreatingForwardingList/CreatingForwardingList.md)


## OpenApiSpecification

The OpenApiSpecification (OAS) represents the detailed specification of the REST API of the application.

**Concepts**
- [Structure of the OAS](./StructureOfOas/StructureOfOas.md)  

**Step-by-Step Guidelines**
- [Creating the OAS](./CreatingOas/CreatingOas.md)


## CONFIGfile

The CONFIGfile describes the data structure inside the application and on the disk. The defined values represent the initial state of the application directly after instantiation.

**Step-by-Step Guidelines**
- [Creating the CONFIGfile](./CreatingConfigFile/CreatingConfigFile.md)


## TestCaseCollection

The TestCaseCollection (TCC) must describe the business logic that must be implemented inside the application.  

**Concepts**

**Step-by-Step Guidelines**
- [Creating a Mock Server](./TestCaseCollection/CreatingMockServer/CreatingMockServer.md)
- [Creating a TestCaseCollection](./TestCaseCollection/CreatingTestCaseCollection/CreatingTestCaseCollection.md)
- [Creating a Test Case](./TestCaseCollection/CreatingTestCase/CreatingTestCase.md)

**Documentation**
- [Creating workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/creating-workspaces/)
- [Version control in postman](https://learning.postman.com/docs/collaborating-in-postman/version-control/)
- [Importing and exporting collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)
- [Documenting API](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/)


## Publishing

After finishing specification work on a release, files have to be published for initiating next steps.

**Concepts**
- [Publishing a Specification](./PublishingSpecification/PublishingSpecification.md)


[<- Back to Preparing](../PreparingSpecifying/PreparingSpecifying.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)
