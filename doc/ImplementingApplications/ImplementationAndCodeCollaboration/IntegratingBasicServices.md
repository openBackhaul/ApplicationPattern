## Integrating basic services

As mentioned , the basic services are generic across all the Microservices in the application layer. 

We have a npm package "onf-core-model-ap-bs" . This package offers, 
1.	The complete implementation of the 15 basic services.
2.	Loggings services that record the service and OAM logs to EaTL and OL respectively
3.	Authentication service to approve the OAM request ,
4.	Forwarding services to ALT to update the change in topology information.

To integrate the application pattern basic services package,

1.	Include the dependency to the package.json, 
```
"dependencies": {    
   "onf-core-model-ap-bs": "0.0.9"
  }
```
2.	After including this dependency , we have to redirect the service request to the '**onf-core-model-ap-bs/basicServices/ BasicServicesService**’ instead of the '**../service/BasicServicesService**'

Also please refer the https://github.com/openBackhaul/RegistryOffice/blob/develop/server/controllers/BasicServices.js to see how to modify the functions. Even copy pasting this file is fine.



 
[<- Back to Integrating load file](IntegratingLoadFile.md)   - - - [Up to How to model an Individual service](HowToModelAnIndividualService.md)
