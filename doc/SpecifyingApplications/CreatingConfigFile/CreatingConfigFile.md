# Creating the CONFIGfile

This is the step by step cookbook for creating the _CONFIGfile_.

Please read the following conceptual documents before working on the _CONFIGfile_:  
- [Concepts of application configuration](../../ElementsApplicationPattern/Functions/ConceptOfApplicationConfiguration/ConceptOfApplicationConfiguration.md)  
- [Structure of application configuration](../../ElementsApplicationPattern/Functions/StructureOfApplicationConfiguration/StructureOfApplicationConfiguration.md)  
- [Concepts of the _CONFIGfile_](../ConceptsOfConfigFile/ConceptsOfConfigFile.md)  
- [Structure of the _CONFIGfile_](../StructureOfConfigFile/StructureOfConfigFile.md)  


### File Handling  

- Assure that there is a copy of the latest [template of the _CONFIGfile_](../../../spec/ApplicationPattern%2Bconfig.json) in the _develop_ branch of your application's repository. The latest _ApplicationPattern+config.yaml_ can be downloaded from the [_ApplicationPattern_ repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
- Rename the file, by replacing "ApplicationPattern" by your application's name.  


### Preparation  

- If not yet existing, create an _Issue_ for elaborating the _CONFIGfile_.  
- Open a local feature branch for elaborating the _CONFIGfile_.  


### Individualization  

Please, don't alter the existing entries in the _CONFIGfile_, except for the following individualization.  
- Use CTRL+h for replacing 'xx-1-0-0' by the abbreviation of your application's name and release number e.g. 'ro-2-0-1'.  
- ## weitere ergänzen


## hier geht's weiter


The following proceeding is recommended:
- Copy an empty description block and put a descriptive _ForwardingName_ for every _Forwarding_ you need.  
- After completing the list, double check the ordering of the blocks.  
- Add the _ForwardingType_ at all blocks.  
- Add _InitiatingRequests_ and _ConsequentRequests_ (but without UUIDs) at all blocks.  
- Add the _ManagementRequests_ at all blocks.  
- After double checking the result and particularly the ordering, add the UUIDs of the _Forwardings_.  
- If you are sure that the _ServiceList_ is stable, add the UUIDs of the _OperationsServers_ and _OperationClients_.  


### Validation and Finalization  

* Double check your _CONFIGfile_.  
* _Commit_ to your local feature branch.  
* _Push_ your local feature branch to the remote repository.  
* Create a _Pull-Request_.  
* Please, regard the test results of the YAML linting in the _Pull-Request_. Correct the syntax of the _CONFIGfile_, if errors are indicated (warnings need not to be regarded), and _commit_ and _push_ again until the _CONFIGfile_ in the remote repository is successfully validated.  
* Select a _Reviewer_ from the team.  
* Assign the _Pull-Request_ to yourself.  
