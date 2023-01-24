# Creating a ProfileList  

This is a step by step cookbook for creating the _ProfileList_.  

**Please, read the background information about the [Concept of _Profiles_](../../ElementsApplicationPattern/Functions/ConceptOfProfiles/ConceptOfProfiles.md) and the [Concept of the _ProfileList_](../ConceptOfProfileList/ConceptOfProfileList.md) before working at the _ProfileList_.**   


### Preparation  

* If not yet existing, create an _Issue_ for elaborating the _ProfileList_.  
* Open a local feature branch for elaborating the _ProfileList_.  

### File Handling  

* Assure that there is a copy of the latest [template for the _ProfileList_](https://github.com/openBackhaul/ApplicationPattern/blob/develop/spec/ApplicationPattern+profiles.yaml) in the _develop_ branch of your application's repository. The latest _ApplicationPattern+profiles.yaml_ can be downloaded from the [_ApplicationPattern_ repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.  


### Definitions  

* The _ActionProfile_ and the _GenericResponseProfile_ are needed for representing the application in the _GenericRepresentation_ application, which is obligatory. Consequently, the _ActionProfile_ and the _GenericResponseProfile_ must be kept in the _ProfileList_.  
* Remove unnecessary _Profile_ definitions from the template.  
* Add required _Profile_ definitions according to the specifications made in [Concept of _Profiles_](../../ElementsApplicationPattern/Functions/ConceptOfProfiles/ConceptOfProfiles.md) and [Concept of the _ProfileList_](../ConceptOfProfileList/ConceptOfProfileList.md) at the end of the file.  
* Re-using already existing definitions of _Profiles_ from _ProfileLists_ of other applications is recommended.  
* Define patterns for String attributes, wherever reasonable (Potentially [this documentation](https://user.phil.hhu.de/~seyffarth/classes/python2020/09-01%20Regular%20Expressions%20schreiben.html) might be helpful. [Test the Regex](https://regex101.com/).).  
* Put attributes, which are invariant during runtime of the application into a capability section.  
* Put attributes, which shall be available for configuration during runtime of the application into a configuration section.  


### Validation and Finalization  

* Double check your _ProfileList_.  
* _Commit_ to your local feature branch.  
* _Push_ your local feature branch to the remote repository.  
* Create a _Pull-Request_.  
* Please, regard the test results of the YAML linting in the _Pull-Request_. Correct the syntax of the _ProfileList_, if errors are indicated (warnings need not to be regarded), and _commit_ and _push_ again until the _ProfileList_ in the remote repository is successfully validated.  
* Select a _Reviewer_ from the team.  
* Assign the _Pull-Request_ to yourself.  