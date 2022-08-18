## Integrating ApplicationPattern Package

The ApplicationPattern is generic across all the Microservices in the ApplicationLayer. 

This library provides APIs,
- to manipulate the CONFIGFile, which is structured in the ONF Core model.
- to configure the LogicalTerminationPoint instances  
- to configure and automate the forwardings between applications (please refer chapter about ForwardingList to learn more about forwarding)
- to configure the profile instances in the ProfileCollection
- to log the service request to the Execution And Trace Log(EATL) and OAM Log Application.
- to authenticate the OAM request in AdministratorAdministration Application.

To integrate the ApplicationPattern package,

1.	Include the dependency to the package.json, 
```
"dependencies": {    
   "onf-core-model-ap": "1.0.0"
  }
```
2.	After including this dependency , run `npm install` 
3. `npm install` will download the "onf-core-model-ap" package from the npm repository
4. The downloaded packages will be available in the "node_modules/onf-core-model-ap/`

 
[<- Back to Integrating load file](IntegratingLoadFile.md)   - - - [Up to How to model an Individual service](HowToModelAnIndividualService.md)
