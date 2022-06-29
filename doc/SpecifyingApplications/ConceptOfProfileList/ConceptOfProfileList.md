# Concepts of ProfileList and ProfileInstanceList 


### Concept of ProfileList

The ProfileList is a compact notation for designing the Profiles.  
It provides full focus on composing the set of necessary attributes.  
The ProfileList is preparing for defining the individual section of the OaM part of the OpenApiSpecification.  

Definition of the Profiles gives much more freedom to the ApplicationOwner than defining the interfaces.  

The template of the ProfileList contains the definitions of the existings Profiles.
Unused definitions need to be deleted from the application specific copy of the template.
Additional definitions can be added, if needed.


### Concept of ProfileInstanceList 

The ProfileInstanceList is a compact notation of the instances of Profiles that are required right after instantiation of the application.  
It provides full focus on the values that shall be used after instantiation.  
The ProfileInstanceList is preparing for writing the profile section of the CONFIGfile of the applications. 

The template of the ProfileInstanceList provides guidance on the ActionProfiles, which are necessary for the services that are required for the basic functions in generic representation.  
Apart from that the ApplicationOwner is totally free to add further entries in the list, if needed.  

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   
