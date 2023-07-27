# OpenAPI Specification

The OpenAPI Specification defines a standard and programming language-agnostic interface description for HTTP APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic.  

When properly defined via OpenAPI, a consumer can understand and interact with the remote service with minimal implementation logic. Similar to what interface descriptions do for lower-level programming, the OpenAPI Specification removes the guesswork in calling a service.  

Applying OpenAPI Specification provides the following outputs that are also relevant in the MW SDN domain:  
- interactive documentation  
- code generation for documentation, clients, and servers  
- automation of test cases  

OpenAPI documents are represented in YAML or JSON formats.  
YAML has been chosen in the MW SDN domain.  

The OpenAPI interface description may be produced and served statically or generated dynamically from an application.  
As we are applying the API-first approach, the interface description (OAS) gets statically produced in the MW SDN domain.  

The capabilities of the services that are provided on the API, have to be described according to the structure of the OpenAPI Specification for achieving above mentioned outputs.  
It would exceed the know-how required for properly specifying applications in the MW SDN domain, but this would be the link towards the [definition of the OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasDocument).  

Instead it is recommended to read the [OpenAPI Guide from Basic Structure](https://swagger.io/docs/specification/basic-structure/) to [Using $ref](https://swagger.io/docs/specification/using-ref/).  