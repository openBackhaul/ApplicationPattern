# Application pattern package

ApplicationPattern modules consists of the following sub-modules:

### Commons
This module represents common functionality for the app.

**SubModules**
* [AppCommons](./SubModulesOfCommon/AppCommons.md)

### DatabaseDriver
This module consists of functionalities using which the CONFIGfile shall be manipulated.

**SubModules**
* [JSONDriver](./SubModulesOfDatabaseDriver/JSONDriver.md)
* [PrimaryKey](./SubModulesOfDatabaseDriver/PrimaryKey.md)
  
### ONFModel
This module consists of classes that defines the ONF core model.
The model is described in separate document [here](../../ImplementingApplications/ApplicationPatternDocumentation/ApplicationPatternDocumentation_onfmodel.md).

### Rest
This module consists of classes related to REST API. 

**SubModules**
* [client](./SubModulesOfRest/client.md)
* [server](./SubModulesOfRest/server.md)
  
### Services
This module consists of service classes.

**SubModules**
* [AuthorizingService](./SubModulesOfServices/AuthorizingService.md)
* [ElasticsearchService](./SubModulesOfServices/ElasticsearchService.md)
* [ExecutionAndTraceService](./SubModulesOfServices/ExecutionAndTraceService.md)
* [OamLogService](./SubModulesOfServices/OamLogService.md)
  





