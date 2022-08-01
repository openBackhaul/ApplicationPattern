## ControlConstruct :
It represents the complete capability and functionality of the application. The generic template of the control construct looks as represented in the diagram. 

 ![RESTfuleService](./pictures/ControlConstruct.png)  
 
Apart from these entities , a ControlConstruct(CC) consists of a universally unique identifier(uuid) which is unique across the Microservices in the application layer. 
```
The syntax of a CC uuid is ,
 <shorthand notation of the application name>-<release number in kebab-case>
```

For example, if the application name is Registry Office , then the shorthand notation of the application is RO. And let’s say the release number of the application is 0.0.1 , then the uuid is ro-0-0-1.
