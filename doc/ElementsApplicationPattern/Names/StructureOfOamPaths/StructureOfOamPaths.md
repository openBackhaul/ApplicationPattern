# Structure of OAM Paths

The requests for application management shall be as close as possible to those for device management.  
Consequently, the OaM _paths_ look and feel like a RESTCONF interface of a device as it is exposed at the controller NBI.  

The structure of the classes and attributes is according to the [ONF Core modelling](../../../ElementsApplicationPattern/InformationModel/Overview/Overview.md).  
The syntax is determined by the YANG and RESTCONF definitions.  

The uppercase letters in the original class and attribute names of the ONF modelling are represented as hyphens and lowercase letters.  
Module names must be inserted at the beginning of the _path_ and wherever there is a transition between models in the _path_.  
Variable components of the _paths_, such as UUIDs or LocalIDs, must be enclosed in curly brackets and defined in the _parameter:_ statement.  

![OaM path segements](./pictures/oam%20path%20segments.png)

