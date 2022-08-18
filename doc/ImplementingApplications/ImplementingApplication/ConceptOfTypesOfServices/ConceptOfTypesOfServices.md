## Services
The services specified in the specification are divided into three categories. 

![TypesOfServices](./Images/TypesOfServices.png)

**Individual and basic services have the following concepts in common,**
- An API can have different version and Versioning is usually done with /v1/, /v2/, etc. added at the start of the API path. This way, we can gradually phase out old endpoints instead of forcing everyone to move to the new API at the same time.

- Individual services can be authorized by validating the authorization key with the “operation-key” value of the corresponding OperationServer instance.

- There are few APIs with prefix “in-generic-representation” , this APIs are specially designed to provide a step-by-step approach to utilize the functionalities exposed by the Microservice. This “generic representation” services consist of a consequent-action-list, that hold information about the next requests that can be performed.
- All the service requests are recorded to the ExecutionandTraceLog(EaTL) Microservice which is specially designed to record the service logs of the application layer.
- All services are of HTTP method POST.
- All service expects the five mandatory custom headers in the request. 
  - **Concepts**
    - [Request Header](../ConceptOfRequestHeader/ConceptOfRequestHeader.md)

## What are Individual Services ?
The service under this category consists of APIs specific to the usecase for which this Microservice is specified for. 

## What are Basic Services ?

The basic services are generic across all the Microservices in the application layer. This consists of APIs using which a Microservice can be integrated into the application layer environment. 
  - **Concepts**
    - [Basic service](../ConceptOfBasicServices/ConceptOfBasicServices.md)

## What are OAM services ?
The path of the OAM service points to a resource in the load file. Using this service an administrator can tune the parameters of the load file. Unlike Individual or basic services, Operation and Maintenance services doesn’t start with a version number. 
The OAM services are of HTTP methods GET/PUT/DELETE as its focusing on a modifying or reading a resource in the load file.
The OAM service requests are authenticated by the AA Microservice.
All the OAM service requests should log the OAM request to the OL Microservice.

[<- Back to Associating specification and load file](./AssociatingSpecificationAndLoadFile.md) - - - [Up to Implementation and Collaboration](./../../ImplementationAndCodeCollaboration/ImplementationAndCodeCollaboration.md)


