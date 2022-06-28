# Structure of Profiles


### Purpose of Profiles  

Profiles are data structures for holding information that is not directly connected with an individual interface.  
Contained information could relate e.g.  
* to all or a group of interfaces  
* or to a process or calculation that is executed inside the application.  

Profiles are for holding configuration information (which is different from application data).  
While data is entering the application through body or response body of some service, configuration information is read and set through GET and PUT requests in the OaM section of the REST API.  
So, the ProfileList is for supporting designing the individual part of the OaM section of the REST API.  


### Structure of Profiles  

Every definition of a Profile has to contain:  
* ProfileName for identifying the kind of Profile  
* UUID for identifying the instance of Profile  
* Set of additional attributes that are specific to the individual kind of Profile  

Its independence from individual interfaces is also obvious from the core information model and the Profile class being separated from the LogicalTerminationPoint, respectively the LayerProtocol.  
![Location of Profiles](./pictures/220628_core_classes_profile_s.png)  


### ProfileName  

The name of the Profile must describe the data object in one or two meaningful nouns followed by "Profile".  
The name must be written in UpperCamelCase and it must be unique within the scope of the individual application.  


### UUIDs  

UUIDs of Profiles have to comply with the rules defined in [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).  


### Additional Attributes  

The ApplicationOwner is free to define a set of additional attributes.  
It is recommended to check, whether one of the [already existing Profiles](../ProfileLibrary/ProfileLibrary.md) fulfils the needs, and to re-use whenever possible.  
