## Understanding the Requirement

To understand the requirement, it is necessary to know in advance the application pattern specific concepts, based on which the load file and the Open API specification is modelled.

### Understanding the Load file

- [What is this CONFIGfile ?](../../ElementsApplicationPattern/Principles/ConfigFile/ConfigFile.md)
- Entities of Load files
  - [ControlConstruct](../../ElementsApplicationPattern/InformationModel/ControlConstruct/ControlConstruct.md) 
  - [LogicalTerminationPoint](../../ElementsApplicationPattern/InformationModel/LogicalTerminationPoint/LogicalTerminationPoint.md)
  - ForwardingDomain: The ForwardingDomain(FD) aggregates one or more ForrwardingConstruct(FC). Theoretically CC consists of a list of FDs. But practically a Microservice consists of a single FD instance. FDs are identified by a uuid.
  - [ForwardingConstruct](../../ElementsApplicationPattern/InformationModel/ForwardingConstruct/ForwardindConstruct.md)

### Understanding the OAS 
One of the most popular API description languages is OpenAPI (OAS 3, formerly called Swagger).
To understand the generic terminologies and aspects of the OpenAPI specification , please take a look into https://swagger.io/specification/ .

After understanding the generic concepts of the OAS specification , please go through the following topics.

- [How to get a high-level overview](./UnderstandingTheOAS/HighLevelOverview.md)
- [Associating specification and load file](./UnderstandingTheOAS/AssociatingSpecificationAndLoadFile.md)
- [Types of Services](./UnderstandingTheOAS/TypesOfServices.md)



[<- Back to Getting Started](../GettingStarted/GettingStarted.md) - - - [Up to What is this load file ?](WhatIsALoadFile.md)
