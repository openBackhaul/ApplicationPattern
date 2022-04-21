## Associating specification and load file

To understand the requirement in detail , 
 - Read the **summary** provided for every service(or path)
 - Read and **understand the description** provided for each property of the request and response body.In most of the description of property , the purpose of the attribute along with a reference to a resource in the load file will be there. This resource reference will be always mentioned within a square bracket with any one of the following prefixes , 
   - **Find** : means find the instance based on the value of the attribute that matches the resource mentioned in the path
   - **Find or create** : means find the instance based on the value of the attribute that matches the resource mentioned in the path. If there is no match , then create a new instance with the information provided in the request body.
   - **update or create** : means find the instance based on the value of the attribute that matches the resource mentioned in the path. If a match is found , then update the instance based on the information provided in the request body. If there is no match , then create a new instance with the information provided in the request body.
   - **From** : means read the resource mentioned in the path
   - **From … with** : means read the resource that satisfies the condition provided after the “with” keyword
- If there is a **callback** defined for a service , then 
  - copy the name of the callback specified in the specification 
  - open the load file of this application
  - search the copied callback name in load file
  - There will be a FC available for this callback name 
  - Have a look into the INPUT, OUTPUT and MANAGEMENT FcPorts of this FC and understand the purpose of this callback and make yourself aware of the flow.


[<- Back to How to get a high-level overview](./HighLevelOverview.md) - - - [Up to Types of Services](./TypesOfServices.md)
