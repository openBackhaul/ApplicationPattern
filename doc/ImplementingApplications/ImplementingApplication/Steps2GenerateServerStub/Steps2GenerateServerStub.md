## Server Stub Generation

The server-side code is generated from the API specification according to the following process:
1)	Go to https://editor.swagger.io/
2)	Copy the Yaml file content to the swagger editor
3)	Go to Menu -> Generate Server -> Nodejs-server
4)	This will generate server-side stub in a zip file, and it will be downloaded to $USER_HOME/Downloads/nodejs-server-server-generated.zip.

Reference : https://github.com/swagger-api/swagger-codegen/tree/3.0.0

The generated server-side stub will have the following folders and files. Details of each component is as follow, 

* **.swagger** contains a version file that provides the swagger jar version used for the code generator
* **api** folder contains openapi.yaml (from the one provided by the ApplicationOwner). This will be used as an input for the swagger UI. This file will be utilized by the express framework to validate the incoming request.
* **controllers** folder consists of modules that are responsible for interacting with the WEB part. From the controller , the control will be passed to the appropriate service in the service layer
* **Service** folder consists of modules that are responsible for the business logic , if require from here the control will go to ta model layer that interacts with the satabase.
* **utils** folder contains common utilities.(for the current project , this folder contians a javascript that writes json onject to the response payload.
* **index.js** file will be kick started when we start the application. This file will have the httpserver , router(that routes the incoming request to the appropriate controller methods) definitions.
* **Package.json** file has the prerequisites to run the application. Also, it will proide the npm dependency details.



[<- Back to Code Collaboration](CodeCollaboration.md)  - - - [Up to Integrating load file](IntegratingLoadFile.md) 

