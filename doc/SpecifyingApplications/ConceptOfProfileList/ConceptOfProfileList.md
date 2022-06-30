# Concepts of ProfileList and ProfileInstanceList 


### Concept of ProfileList

The ProfileList is a compact notation for designing the Profiles as classes.  
It provides full focus on composing the set of necessary attributes and their datatypes.  
The ProfileList is preparing for defining the individual section of the OaM part of the OpenApiSpecification.  

Definition of the Profiles gives much more freedom to the ApplicationOwner than defining the interfaces.  
The template of the ProfileList contains the definitions of the existings Profiles.  
Unused definitions need to be deleted from the application specific copy of the template.  
Additional definitions can be added, if needed.  


### Concept of ProfileInstanceList 

The ProfileInstanceList is a compact notation of the instances of Profiles that are required to define the configuration of the application.  
It provides full focus on the values that shall be used right after instantiation.  
The ProfileInstanceList is preparing for writing the profile section of the CONFIGfile of the applications. 

The template of the ProfileInstanceList contains the instances of ActionProfile, which are necessary for the basic functions in generic representation.  
Further on, it contains forms for creating additional instances of IntegerProfile, StringProfile or ActionProfile.  
These forms shall provide guidance while filling in concrete values.
Unused forms need to be deleted from the application specific copy of the template.  

Additional instances can be described for additional definitions of Profiles, if needed.

**Be aware that the template must not be altered outside the zones indicated by comments starting with '##'.**   
