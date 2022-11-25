# Creating a ProfileList

This is a step by step cookbook for creating the ProfileList.  

**Please, read the background information about the [Concept of Profiles](../../ElementsApplicationPattern/Functions/ConceptOfProfiles/ConceptOfProfiles.md) and the [Concept of the ProfileList](../ConceptOfProfileList/ConceptOfProfileList.md) before working at the ProfileList.**   


### File Handling

* Assure that there is a copy of the latest [template for the ProfileList](https://github.com/openBackhaul/ApplicationPattern/blob/develop/ApplicationPattern+profiles.yaml) in the develop Branch of your application's repository. The latest ApplicationPattern+profiles.yaml can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.  


### Definitions

* The ActionProfile and the GenericResponseProfile are needed for representing the application in the GenericRepresentation, which is obligatory. Consequently, the ActionProfile and the GenericResponseProfile are assumed to be kept in the ProfileList.  
* Remove unnecessary Profile definitions from the template.  
* Add required Profile definitions according to the specifications made in [Concept of Profiles](../../ElementsApplicationPattern/Functions/ConceptOfProfiles/ConceptOfProfiles.md) and [Concept of the ProfileList](../ConceptOfProfileList/ConceptOfProfileList.md) at the end of the file.  
* Re-using already existing definitions of Profiles from ProfileLists of other applications is very much recommended.  
* Define patterns for String attributes, wherever reasonable (Potentially [this documentation](https://user.phil.hhu.de/~seyffarth/classes/python2020/09-01%20Regular%20Expressions%20schreiben.html) might be helpful. [Test the Regex](https://regex101.com/).).  
* Put attributes, which are invariant during runtime of the application into a capability section.  
* Put attributes, which shall be available for configuration during runtime of the application into a configuration section.  

### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ProfileList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ProfileList is fine, if YAML validator indicates "Valid YAML!"
