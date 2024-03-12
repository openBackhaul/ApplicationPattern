# Creating the CONFIGfile

This is the step by step cookbook for creating the _CONFIGfile_.

Please read the following conceptual documents before working on the _CONFIGfile_:  
- [Concept of the CONFIGfile](../../ElementsApplicationPattern/Functions/ConceptOfConfigFile/ConceptOfConfigFile.md)  
- [Structure of the CONFIGfile](../../ElementsApplicationPattern/Functions/StructureOfConfigFile/StructureOfConfigFile.md)  
- [ONF Core Information Model](../../ElementsApplicationPattern/InformationModel/Overview/Overview.md)  


### File Handling  

- Assure that there is a copy of the latest [template of the _CONFIGfile_](../../../spec/ApplicationPattern%2Bconfig.json) in the _develop_ branch of your application's repository. The latest _ApplicationPattern+config.json_ can be downloaded from the [_ApplicationPattern_ repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
- Rename the file, by replacing "ApplicationPattern" by your application's name.  


### Preparation  

- If not yet existing, create an _Issue_ for elaborating the _CONFIGfile_.  
- Open a local feature branch for elaborating the _CONFIGfile_.  


### Individualization  

#### General

Please, be careful while altering the existing entries in the _CONFIGfile_.  
Most of them will require just a little adjustment.  
Very few need to be deleted.  
Several need to be added, and it is recommended to copy and paste the existing objects.

- Use CTRL+h for replacing 'xx-1-0-0' by the abbreviation of your application's name and release number e.g. 'ro-2-0-1'.  
- Use CTRL+f for searching '"http-server-interface-1-0:http-server-interface-pac":', and update the information about your application. Keep being consistent with the ServiceList.  
- Use CTRL+f for searching '"tcp-server-interface-1-0:tcp-server-interface-pac":', and update the fake TCP port of your application. Keep being consistent with the ServiceList. It might be required to add or delete a TcpServer instance.  

#### Profiles

- Compare the list of existing Profile instances with the content of your ProfileInstanceList.  
- Delete existing Profile instances that do not match your ProfileInstanceList.  
- Copy and Paste existing instances of ActionProfile and ResponseProfile and adapt them to the content of your ProfileInstanceList until those two kinds of Profiles are totally consistent with your ProfileInstanceList.  
- Copy and Paste existing instances of FileProfile (e.g. [TypeApprovalRegister](https://github.com/openBackhaul/TypeApprovalRegister/blob/develop/spec/TypeApprovalRegister+config.json)), IntegerProfile (e.g. [RegistryOffice](https://github.com/openBackhaul/RegistryOffice/blob/develop/spec/RegistryOffice+config.json)) and StringProfile (e.g. [OperationKeyManagement](https://github.com/openBackhaul/OperationKeyManagement/blob/develop/spec/OperationKeyManagement+config.json)) from existing applications into your CONFIGfile and adapt them to the content of your ProfileInstanceList until also those kinds of Profiles are totally consistent with your ProfileInstanceList.  
- If you would have defined individual kinds of Profile in your ProfileList and your ProfileInstanceList:  
  - Copy an existing instance of Profile (take care that you pick one that contains both a capability and a configuration section).  
  - Delete the existing attributes from the capability and configuration sections.  
  - Adapt the UUID to the pattern you defined in your ProfileList.  
  - Update the value of the ProfileName attribute in the CONFIGfile in accordance with the ProfileName attribute from the ProfileList. Regard that the value has to be updated at two separate positions, the name space and the enumeration value. Regard the syntax!  
  - Replace the profile name in the attributes' names of the pac (name space and attribute), the capability and the configuration objects.  
  - Add the read-only attributes to the capability object.  
  - Add the read-write attributes to the configuration object.  
- After you created all instances of Profile in accordance with your ProfileInstanceList, double check the attributes values.  
- In a last step, adapt the sequence numbers in the UUIDs.  

#### LogicalTerminationPoints  

- Compare the list of existing OperationServers with the content of your ServiceList.  
- Delete existing OperationServers that do not match your ServiceList.  
- Copy and Paste an existing instance of OperationServer and adapt the value of the OperatioName attribute until the list of OperationServers in the CONFIGfile is consistent with your ServiceList.  
- Update the API segment and the sequence number in the UUIDs until they are matching your ServiceList.  
- Search for 'http-s-000",' and put the same UUIDs into the clientLtp list attribute.  

- Check the HttpClients in the CONFIGfile and delete all stacks of OperationClients, HttpClients and TcpClients that belong to HttpClients that are not required in your ServiceList.  
- Step through the HttpClients in your ServiceList and check, whether all the required OperationClients are available in the CONFIGfile. If not, copy a stack of one OperationClient, an HttpClient and a TcpClient, adapt the values of the applicationName and releaseNumber attributes at the HttpClient and the fake TCP port at the TcpClient. Take care that the UUIDs at the three new objects get update with the official abbreviation of the application's name.  
- Double check that all the HttpClients of the ServiceList are now covered in the same ordering as in the CONFIGfile.  
- Step through the list of HttpClients in the CONFIGfile and check, whether all the OperationClients from the ServiceList are available in the CONFIGfile. If not, copy an existing OperationClient object on the same HttpClient and replace the value of the operationName attribute. Delete obsolete OperationClient objects. Update the clientLtp list attribute at the HttpClient objects.  
- After you updated the OperationClients at all the HttpClients, double check whether the ordering of the OperationClients is consistent with the ServiceList.  
- After assuring that, double check, whether the abbreviation of the application's name inside the UUIDs of all the OperationClients, HttpClients and TcpClients is correct.  
- Finally, double check the sequence number inside the UUIDs of all the OperationClients, HttpClients and TcpClients.  

- Also ensure that the [operationKey](./OperationKeys.md) fields of OperationClients and OperationServers are set correctly.
 
#### ForwardingConstructs  

- Compare the list of existing ForwardingConstructs in the CONFIGfile with the content of your ForwardingList.  
- Delete existing ForwardingConstructs that do not match your ForwardingList.  
- Copy and Paste an existing instance of ForwardingConstruct and adapt the value of the ForwardingName and the ForwardingKind attributes until the list of ForwardingConstructs in the CONFIGfile is consistent with the _Forwardings_ in your ForwardingList.  
- Step through the list of _Forwardings_ in the ForwardingList and assure that the exact same ForwardingConstructPorts are available in the ForwardingConstructs in the CONFIGfile, too. Focus on correct UUID of the referenced LTP and port direction.  
- Review the local IDs of all ForwardingConstructPorts.  
- Get through the UUIDs of the referenced LTPs and check by CTRL+f, whether the found OperationServer/OperationClient from the CONFIGfile matches the one from the ForwardingList.  
- Review the UUIDs of all ForwardingConstructs.  


### Validation and Finalization  

- Save the resulting CONFIGfile.  
- If VSCode would detect any syntax errors in the JSON, the name of the \*+config.json would now be marked in red in the file explorer.  
- If you would now klick on the error indicator ...  
  ![Error Indicator](./pictures/Error%20indicator.png)  
- ... the list of errors would open ...  
  ![Error List](./pictures/Error%20description.png)  
- ... and you could click on the entries in the list to jump into the faulty line for making the corrections.  
- After correcting all mistakes, save again and _Commit_ to your local feature branch.  
- _Push_ your local feature branch to the remote repository.  
- Create a _Pull-Request_.  
- Select a _Reviewer_ from the team.  
- Assign the _Pull-Request_ to yourself.  
