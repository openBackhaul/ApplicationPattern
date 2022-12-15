# Concepts of ProfileList and ProfileInstanceList 


### Concept of ProfileList

The ProfileList is a compact notation for designing the Profiles as classes.  
It provides full focus on composing the set of necessary attributes and their datatypes.  
In case of String datatype, it also allows defining generic expression about the allowed values of the String.  
This must be applied on the UUIDs and can be applied on any other String attribute.  
The ProfileList distinguishes invariant and configurable attributes.
The ProfileList is preparing for defining the individual section of the OaM part of the OpenApiSpecification.  

Definition of the Profiles gives much more freedom to the ApplicationOwner than defining the interfaces.  
The template of the ProfileList contains the definitions of the existing Profiles.  
Unused definitions need to be deleted from the application specific copy of the template.  
Additional definitions can be added, if needed.  


### Concept of ProfileInstanceList

The ProfileInstanceList is a compact notation of the instances of Profiles that are required to define the configuration of the application.  
It provides full focus on the values that shall be used right after instantiation.  
The ProfileInstanceList is preparing for writing the profile section of the CONFIGfile of the applications. 

The template of the ProfileInstanceList contains the instances of ActionProfile and GenericResponseProfile, which are necessary for the basic functions in generic representation.  
Further on, it contains forms for creating additional instances of ActionProfile, FileProfile, GenericResponseProfile, IntegerProfile and StringProfile.
These forms shall provide guidance while filling in concrete values.
Unused forms need to be deleted from the application specific copy of the template.  

Additional instances can be described for additional definitions of Profiles, if needed.


### Commenting

The template of the ProfileList and the ProfileInstanceList is prepared in such a way that comments (## TODO:) have to be replaced by changes that are individual to the application under specification.  
If this initial concept would be followed, the ProfileList and the ProfileInstanceList would be finalized as soon as all "## TODO:" would either be replaced or deleted.  
If someone would find it helpful to add his thoughts into the ProfileList or the ProfileInstanceList, he would be free to add own comments, but these comments should not start with "TODO:" after finalizing the respective list.  
If someone would decide to add comments into the ProfileList or the ProfileInstanceList, it would be strongly recommended to properly indent the additional lines.


### Profiles and ProfileInstances

![Profiles and Instances](./pictures/ProfileAndInstance.png)  

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   
