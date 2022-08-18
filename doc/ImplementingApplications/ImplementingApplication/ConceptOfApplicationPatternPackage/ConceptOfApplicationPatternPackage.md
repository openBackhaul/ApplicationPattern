# Application pattern package

Application pattern Package is a ready-made library that has functionalities specific to the ApplicationPattern specification.

This library provides APIs,
- to manipulate the CONFIGFile, which is structured in the ONF Core model.
- to configure the LogicalTerminationPoint instances  
- to configure and automate the forwardings between applications (please refer chapter about ForwardingList to learn more about forwarding)
- to configure the profile instances in the ProfileCollection
- to log the service request to the Execution And Trace Log(EATL) and OAM Log Application.
- to authenticate the OAM request in AdministratorAdministration Application.

    ![ApplicationPatternPackages](Images/ApplicationPatternPackages.png)

## Application Pattern Modules

ApplicationPattern modules consists of the followin sub-modules

### DatabaseDriver
This module consists of functionalities using which the CONFIGfile  shall be manipulated.

**SubModules**
* [JSONDriver](./SubModulesOfDatabaseDriver/JSONDriver.md)
* [PrimaryKey](./SubModulesOfDatabaseDriver/PrimaryKey.md)
  
### ONFModel
This module consists of classes that defines the ONFModel core model. 

**SubModules**
* [constants](./SubModulesOfONFModel/constants.md)
* [models](./SubModulesOfONFModel/models.md)
* [services](./SubModulesOfONFModel/services.md)
* [utility](./SubModulesOfONFModel/utility.md)

### Rest
This module consists of classes that defines the ONFModel core model. 

**SubModules**
* [client](./SubModulesOfRest/client.md)
* [server](./SubModulesOfRest/server.md)
  
### Services
This module consists of classes that defines the ONFModel core model. 

**SubModules**
* [AuthorizingService](./SubModulesOfServices/AuthorizingService.md)
* [ExecutionAndTraceService](./SubModulesOfServices/ExecutionAndTraceService.md)
* [OamLogService](./SubModulesOfServices/OamLogService.md)
  
### Common
This module consists of classes that defines the ONFModel core model. 

**SubModules**
* [AppCommons](./SubModulesOfCommon/AppCommons.md)


[<- Back to Code Collaboration](CodeCollaboration.md)  - - - [Up to Integrating load file](IntegratingLoadFile.md) 

