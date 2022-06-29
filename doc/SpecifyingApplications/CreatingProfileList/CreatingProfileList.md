# Creating a ProfileList

This is a step by step cookbook for creating the ProfileList.  

**Please, read the background information about the [Structure of Profiles](../StructureOfProfiles/) and the [Concept of the ProfileList](../ConceptOfProfileList/ConceptOfProfileList.md) before working at the ProfileList.**   


### File Handling

* Assure that there is a copy of the latest [template for the ProfileList](https://github.com/openBackhaul/ApplicationPattern/blob/develop/ApplicationPattern+profiles.yaml) in the develop Branch of your application's repository. The latest ApplicationPattern+profiles.yaml can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.


### Definitions

* The ActionProfile is needed for representing the application in the GenericRepresentation, which is obligatory. Consequently, the ActionProfile is assumed to be kept in the ProfileList.
* Remove unnecessary Profile definitions from the template.
* Add required Profile definitions according to the specifications made in [Structure of Profiles](../StructureOfProfiles/) at the end of the file.


### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ProfileList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ProfileList is fine, if YAML validator indicates "Valid YAML!"
