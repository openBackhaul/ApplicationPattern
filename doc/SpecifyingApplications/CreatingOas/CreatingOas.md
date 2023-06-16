# Creating the OAS

This is the step by step cookbook for creating the OAS.  

Please read the following conceptual documents before working on the OAS:  
- [Concept of Microservice](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/Microservice/Microservice.md)  
- [Introduction to HTTP Requests](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/Http/Http.md)  
- [API-First Approach](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/ApiFirst/ApiFirst.md)  
- [OpenAPI Specification](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/Principles/OpenApiSpecification/OpenApiSpecification.md)  
- [OpenAPI Guide from Basic Structure to Using $ref](https://swagger.io/docs/specification/basic-structure/)  
 
 Furthermore, it is recommended to study an existing OAS (e.g. [RegistryOffice](https://github.com/openBackhaul/RegistryOffice/blob/develop/spec/RegistryOffice.yaml)) in deep detail while reading [Structure of the OAS](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/SpecifyingApplications/StructureOfOas/StructureOfOas.md) in parallel.  


### File Handling  

Unfortunately, the handling of the OAS file is not 100% satisfactorily solved.  
On one hand, the OAS must be part of the application specification on Github and participate in the regular version management.  
On the other hand, editing is better supported in Postman and finally the functions of Postman (e.g. mock server creation) are also needed to test the coding of the test cases.  

It is up to the individual ApplicationOwner whether he prefers writing the OAS in VSCode or in Postman.  
If Postman is chosen, the file content has to be copied regularly between the two editors. This involves some risks that might be mitigated by an [online text compare tool](https://text-compare.com/).  
If VSCode is preferred, the content must be transferred towards Postman before editing the test cases and afterwards been permanently kept in synch.  

Assure that there is a copy of the latest [template of the OAS](https://github.com/openBackhaul/ApplicationPattern/blob/develop/spec/ApplicationPattern.yaml) in the _develop_ branch of your application's repository.  
Rename the file, by replacing "ApplicationPattern" by your application's name.  
Use CTRL+h for replacing '*-1-0-0' by the abbreviation of your application's name and release number e.g. 'ro-2-0-1'.  
Update the _title:_ and _version:_ values by the content of the HttpServer in your ServiceList.  
Save the OAS file in your develop branch and commit it and create a feature for completing the OAS.

**Preparation:**
- If not yet existing, create an _Issue_ for elaborating the OAS.  
- Note all your ideas, plans and questions that are not yet documented in ServiceList, ForwardingList etc. into the _Issue_.  
- Open a local feature branch for elaborating the OAS.  

**Preparing Postman:**
- Open your local Postman installation.  
- Change to workspace "MW_SDN_Applications".  
- Click the _APIs_ folder at the very left of the Postman window.  
- Click the "+" for creating a new API.  
- Enter the official application name as a Name of the API definition.  
- Enter a low version number like e.g. 0.0.1 (you will be able to adapt the version number at any time).  
- Define Schema type to be "OpenAPI 3.0" and Schema format to be "YAML" and create the API.  
- After the API has been created, click on the just created version.  
- Click on "Definition".  
- Click into the editor, CTRL+a, delete all default content.  
- Open the OAS in the VSCode, click into the editor, CTRL+a, CTRL+c.  
- Change into the VSCode editor, CTRL+v, CTRL+s.  

Now, you lifted VSCode and Postman to the same level and should decide where to continue specifying.  

### Individualization  

#### General  
Please, be careful while altering the existing code blocks in the Basic Service, Basic OaM and Common Components sections of the OAS.  
Most of them will require just a little adjustment at their IDs.  
Some code blocks might be obsolete (e.g. ElasticSearchClient) in your specific application and need to be deleted.  

Several individual code blocks need to be added.  
It is recommended to copy similar, already existing code blocks and to customize them.  
(Existing code blocks could be taken from the ApplicationPattern, alternatively and probably more appropriate, from existing applications like the RegistryOffice or other microservices of the TinyApplicationController. Please, don't forget to CTRL+h the UUIDs after pasting.)  

### Individual Service Section  

#### Paths  
Add the OperationNames from the individual OperationServers section of your ServiceList beneath the _/v1/bequeath-your-data-and-die:_ into the Individual Service Section of the OAS. The ordering should be kept in synch.  

#### Parameters  
Copy the entire _parameters:_ block either from the _/v1/bequeath-your-data-and-die:_ or any other service in the ApplicationPattern and paste it beneath each of the new _paths_ statements.  

#### Method  
All services are exclusively supporting the _post_ method.  
>Pick the next _path_ and make some extra notes about:  
>- Are attributes required to be send as an input to the OperationServer?  
>- If yes, note the attributes that are required.  
>- Are attributes expected to be responded as an output by the OperationServer?  
>- If yes, note the attributes that will be responded.  
>Check existing specifications for a _path_ definition that is similar.  
>Obviously, it is unlikely that there is a _path_ that has the exact same input and output attributes, but you should at least chose a _path_ that comprises _requestBody:_ and _responses:_ blocks, if you need those in the new _path_.  
>Make a copy of the chosen _post:_ block beneath the _parameters:_ block.  
>Delete from the the copied block whatever you no longer need.  
>  
>#### Administrational Stuff
>_operationId:_, _summary:_, _tags:_ and _security:_ statements to be updated in accordance with the respective chapters in [Structure of the OAS](../StructureOfOas/StructureOfOas.md#method).  
>
>#### RequestBody
>Transfer the attributes' names from your notes into the _required:_ block.  
>
>Remark:
>OpenAPI Specification allows defining the structure of objects in the Common Components section at the end of the OAS and to just put references to these definitions into the _schema:_ blocks of the individual RequestBodies or ResponseBodies.  
>In principle, the ApplicationPattern processes are supporting this, but appliance should be limited to comprehensive objects that get referenced for at least two or three times.  
>Anyway, it is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
>Reading the OAS is much easier when following this order during specification work.
>
>So please, take your time and chose as descriptive as possible attributes' names.  
>Delete the already existing, but obsolete attributes' names from the _required:_ block.  
>
>Add a couple of empty lines beneath the _properties:_ statement.  
>>Pick the next attribute from the _required:_ block and decide about its datatype.  
>>Search the already existing attributes for one that is as similar as possible.  
>>Copy that one and paste it beneath the _properties:_ statement.  
>>
>>Adapt the attribute's name.  
>>Adapt the datatype in the _type:_ statement, if required.  
>>
>>Add _pattern:_, _enum:_, _minimum:_, _maximum:_ etc. statements for detailing the format of the expected data on the ingress, if appropriate.  
>>
>>Help for formulating proper regular expressions could be found [here](https://www.geeksforgeeks.org/write-regular-expressions/) or [here](https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285).  
>>A validator for testing regular expressions could be found [here](https://regex101.com/).  
>>It is recommended not to attempt optimizing the length of the regular expression to a minimum number of symbols, but to optimize for easy-to-read explanations of the format.  
>>
>>Describe the meaning of the attribute in connection with the operation in the first line of the _description: >_ statement.  
>>Example: 'IP address of the device that shall be messed up  
>>(Please regard that there is a single quote at the beginning of the line, but none at its end.)  
>>
>>If the sent attribute shall serve for altering internal data of the application, the second line of the _description: >_ statement is needed for describing a reference.  
>>One of the terms _find in_, _find or create_, _update_ and _update or create_ has to be chosen in accordance with the definitions in [Structure of the OAS](../StructureOfOas/StructureOfOas.md#description).  
>>The path towards the resource, which is either to be identified or to be altered, has to be added.  
>>Maybe, the same resource has already been referenced in an existing definition (CTRL+f for the name of the attribute from the internal data tree) and the path can be copied from there (please, regard that the same attribute name might occur several times inside the internal data tree).  
>>If you would need to formulate the entire path manually, [Structure of OaM paths](../../ElementsApplicationPattern/Names/StructureOfOamPaths/StructureOfOamPaths.md) might help.  
>>After describing the path, some included UUID or local-ID might need to be adapted.  
>>Looking into the CONFIGfile might support finding the right identifier.  
>>Often, the input is adding another instance to a list, or identifying an instance from a list.  
>>The UUID cannot address a concrete instance in these cases.  
>>The variant segments of the UUID need to be replaced by "*" for describing the list of objects that are affected by the operation.  
>>(Please take care that the second line ends with a single quote.)  
>>
>Repeat these steps until you described all the attributes from the _required:_ block in the _properties:_ block.  
>Delete the already existing, but obsolete attribute descriptions from the _properties:_ block.  
>
>Change into the _example:_ block and delete the already existing, but obsolete attribute names.  
>Copy the attribute names from the _required:_ block into the _example:_ block.  
>Remove the hyphens in front of the attributes' names.  
>Add colons behind the attributes' names.  
>If the _schema_ definition would be sub-structured into further objects, the example would need to be sub-structured by the additionally required attributes, too.  
>Add reasonable values that are complying the restrictions made on the format.  
>
>Be aware:  
>If you would add an example, which does not comply with the structure of the objects or the formats of the attributes, the mock server that gets created from the OaS will not be able to provide a proper ResponseBody and validation of the test cases will not be possible.  
>
>#### Responses  
>If there are no attributes to be returned as an output:  
>- Double check that there is a _204:_ block in your _responses:_.  
>- Update the _description:_.  
>- Update the UUID in the _description: >_ of the _life-cycle-state:_ parameter.  
>
>If there are attributes to be returned:  
>- Double check that there is a _200:_ block in your _responses:_.  
>- Update the _description:_ by a explanation of what just happened as the request has been successfully executed.  
>
>Add a couple of empty lines beneath the _properties:_ statement.  
>Transfer the attributes' names from your notes into the _properties:_ block (_required:_ statement not required on the output).  
>Please, regard that you and potential users of your application have to understand the purpose of the OperationServer from reading its _path_ (operation name) and the attributes' names in the API description.  
>So please, take your time and chose as descriptive as possible attributes' names.  
>
>>Pick the next attribute from the _properties:_ block and decide about its datatype.  
>>Search the already existing attributes for one that is as similar as possible.  
>>Copy its definition (datatype, description etc.) and paste it beneath the attribute's name.  
>>
>>Adapt the datatype in the _type:_ statement, if required.  
>>
>>Detailing the format of the provided data is not required (enumerations might be an exception as they ease consequent processing of the data).  
>>
>>Describe the meaning of the attribute in relation with the operation in the first line of the _description: >_ statement.  
>>Example: 'IP address of the device that has just been successfully messed up  
>>(Please regard that there is a single quote at the beginning of the line, but none at its end.)  
>>
>>If the provided attribute is retrieved from internal data of the application, the second line of the _description: >_ statement is needed for referencing the exact source.  
>>The term _from_ has to be chosen.  
>>The path towards the resource that is holding the data that is to be provide has to be added.  
>>Maybe, the same resource has already been referenced in an existing definition (CTRL+f for the name of the attribute in the internal data tree) and the path can be copied from there.  
>>If you would need to formulate it manually, [Structure of OaM paths](../../ElementsApplicationPattern/Names/StructureOfOamPaths/StructureOfOamPaths.md) might help.  
>>After describing the path, some included UUID or local-ID might need to be adapted.  
>>Looking into the CONFIGfile might support finding the right identifier.  
>>Often, the output is providing data from an object instance in a list.  
>>As the object instance is identified by the key attribute's value, which is handed over in the RequestBody, the UUID in the specification cannot identify a concrete instance.  
>>Consequently, the variable segments of the UUID need to be replaced by "*" for describing a list of objects that come into question.  
>>(Please take care that the second line ends with a single quote.)  
>>
>Repeat these steps until you described all the attributes the _properties:_ block.  
>Delete the remaining, but obsolete attribute descriptions from the _properties:_ block.  
>
>Change into the _example:_ block and delete the already existing, but obsolete attribute names.  
>Copy the attribute names from the _properties:_ block into the _example:_ block.  
>Add colons behind the attributes' names.  
>If the _schema_ definition would be sub-structured into further objects, the example would need to be substructured, too.  
>Add reasonable values that are complying the restrictions that are made on the ingress of the data.  
>
>Update the UUID in the _description: >_ of the _life-cycle-state:_ parameter in the _headers:_ block.  
>
Repeat adding _post:_ blocks until all the _paths_ in your OAS are covered.  

#### Callbacks
It is recommended to first describe all RequestBodies and all ResponseBodies before adding the first _callback_ to the OAS.  

Finding the right location for adding a _callback_ is the first step in its description.  
The simplest procedure is to open the ForwardingList and to assign all _forwardings_ one after another to one of the existing _paths_.  
The _callback_ definition, which is implementing a _forwarding_ from the ForwardingList, is usually allocated inside the definition of the _path_, which is stated to be the management request for updating the OperationClient.  
If no OperationServer for updating the OperationClient would be stated in the description of the _forwarding_, the OperationServer for updating the FcPorts, or for deleting the FcPorts, or for deleting the OperationClients would have to be chosen (in this ordering) instead.  
If there would be no management requests stated in the description of a _forwarding_ in the ForwardingList, the _path_ of the OperationServer that is initiating sending the _callback_ shall be chosen for allocating the _callback_ definition.  
As soon as the correct _path_ could be identified, a _callbacks:_ statement is to be added after the _responses:_ block.  
The forwarding-name from within the ForwardingList has to be copied beneath the _callbacks:_ statement.  
If several forwarding-names have to be added to the same _path_, the _callbacks:_ statement shall not be repeated.  

After all _forwardings_ from the ForwardingList have been transferred into the OAS, the individual callbacks have to be defined in detail.  

>The URL statement is a bit hard to describe, but it supports the ApplicationImplementer to create a correct request from application internal data.  
>Maybe it is a good proceeding to  
>- copy a URL statement from an existing _callback_ definition  
>- temporarily add line breaks after every "]",  
>- adapt the UUIDs of protocol, IP address, domain name, port, and operation name references and  
>- remove the line breaks again.  
>
>It is recommended to wait until the original _path_ definitions are really stable, before copying the entire method block (most likely _post:_) from the original _path_ definition into the _callback_ definition.  
>The entire block is to be marked for correcting the indents.  
>_operationId:_, _tags:_ and _security:_ statements are to be removed.  
>All statements that are filtering the to be sent requests for specific values of the attributes (e.g. patterns or enumerations at String attributes, minimum or maximum values at Integer attributes) are to be removed, too.  
>In the RequestBody, change all descriptions to "from " and replace the existing reference by the reference to the location where to get the value to be sent.  
>In the ResponseBody, change all descriptions to _find in_/_update_ or _find or create_/_update or create_ and replace the existing references by references to the locations where to store the answered values.  
>In the _headers:_, the description at the _life-cycle-state:_ shall be replaced by the simple formulation 'Life cycle state of the consumed service'.  
>
Repeat describing the callbacks in detail until all _forwardings_ from the ForwardingList have been covered.  


### Basic Service Section
No changes required in the Basic Service Section.


### Individual OaM Section
If you would have defined additional Profiles in the ProfileList, you would now have to add a definition of these Profiles into the _/core-model-1-4:control-construct:_ and the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_.  

Click into the _path_ statement of the _/core-model-1-4:control-construct:_ and CTRL+f for "oneOf:".  
Collapse all entries inside the _oneOf:_ block.  
>Mark the StringProfile definition and CTRL+c.  
>CTRL+v the same at the end of the list of profile definitions.  
>Update the _description:_ statement of the copied block.  
>Carefully CTRL+h "string-profile" by the name of the Profile, which you would like to add, inside the copied block.  
>Change into the _enum:_ statement and create a copy of the last entry.  
>The second last entry has to be changed from your Profile's name back to "string-profile-1-0".  
>In the last entry, "STRING_PROFILE" has to be replaced by your Profile's name.  
>
>In the next step, the attributes of the Profile have to be described.  
>The _/core-model-1-4:control-construct:_ and the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ provide GET method only.  
>It is not needed to filter data on the egress.  
>In contrary to current definitions a _required:_ statement shall not be added in the _capability:_ and _configuration:_ blocks.  
>
>Add a couple of empty lines beneath the _properties:_ statement inside the _capability:_ block.  
>Transfer the names and datatypes of the read-only capability attributes from your ProfileList.  
>Delete the obsolete attribute definitions.  
>
>Jump into the _enum:_ statement of the _profile-name:_ attribute of your new Profile definition.  
>Mark the additional entry that is identifying your new Profile and CTRL+c.  
>CTRL+v the same into the _enum:_ statements of the _profile-name:_ attributes of all existing Profile definitions.  
>
Repeat these steps until all the additional Profiles you defined in the ProfileList have been transferred into the OAS.  

After defining all the additional Profiles in _/core-model-1-4:control-construct:_, mark the new blocks and CTRL+c.  

Click into the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ and CTRL+f for "oneOf:".  
Collapse all entries inside the _oneOf:_ block.  
CTRL+v the new Profile definition at the end of the list of existing Profile definitions.  
Mark the new blocks and adapt the indents.  

Jump into the _enum:_ statement of the _profile-name:_ attribute of one of your new Profile definitions.  
Mark the additional entries that are identifying your new Profiles and CTRL+c.  
CTRL+v the same into the _enum:_ statements of the _profile-name:_ attributes of the existing Profile definitions.  

Apart from updating the _paths_ for reading the entire ControlConstruct and the list of Profile instances, new _paths_ for reading and writing the individual attributes of new Profiles have to be created.  

If Profile contains at least a single Capability (read-only) attribute:  
- CTRL+c the entire block of an existing OaM _path_ of a Capability attribute.  
- CTRL+v this block beneath the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ in the Individual OaM Section.  
- Just change the attribute's name at the end of the _path_ statement.  

If there is also a Configuration (read/write) attribute in the new Profile:  
- CTRL+c the entire block of an existing OaM _path_ of a Configuration attribute.  
- CTRL+v this block beneath the Capability block from above.  

Click into the _path_ statement of the Capability block and carefully CTRL+h the ProfileName and ReleaseNumber of the existing Profile by the ProfileName and "-1-0" of your new Profile until you reached the end of the new Configuration block.  

To be done in both blocks:  
- Update the _pattern:_ and the _example:_ statements of the _parameters:_ blocks by the new ProfileName.  
- Update the _tags:_ statements in all method blocks by the new ProfileName.  

If required, replicate the half-way adapted Capability block and adapt the attribute's name at the end of the _path_ statement until all required Capability attributes of the new Profile are covered.  
If required, replicate the half-way adapted Configuration block and adapt the attribute's name at the end of the _path_ statement until all required Configuration attributes of the new Profile are covered.  

To be done in all method blocks concerning the new Profile:  
- Update the _operationId:_ statements.  
- Describe the purpose of the request in the summary statements.  
- Describe the effect of a successful request in the _description:_ statements of the responses with HTTP response code 200 or 204.  
- (If required, delete the required block from old fashioned responses with HTTP response code 200 or 204.)
- Update the attribute's name in the _properties:_ statements.  
- Adapt the datatypes, if required.  
- (If required, rearrange the _example:_ statement so that it is one level below the _schema:_ statement. Please note that the attributes need to be stated including their names and values at this position).  
- Update the _example:_ statement with reasonable values.  

To be done in the PUT method blocks only:
- Add detailed definitions of the format of the ingress data (e.g. _enum:_, _pattern:_, _minimum:_, _maximum:_ and so on).  
- Add detailed definitions of the structure of the ingress data (e.g. _required:_, _oneOf:_ and so on).  


### Basic OaM Section
Delete obsolete _paths_ from the OAS.  
This could apply e.g. on Profiles or the ElasticSearchClient.  
The UUIDs need to be adapted to the abbreviation and release number of the new application.  

### Common Components
No changes required in the Common Components Section.
The UUIDs need to be adapted to the abbreviation and release number of the new application. 

### Verifying the OAS
Check, whether all individual OperationServers have been transferred from the ServiceList into the OAS.  
Check, whether all Profiles from ProfileList  
- are included in the _/core-model-1-4:control-construct:_  
- are included in the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_  
- have been covered by dedicated _paths_ for their individual attributes (assure the Configuration attributes being covered by PUT methods) 
Check, whether all the _forwardings_ from the ForwardingList have been transferred into callbacks.  

If you did not work in Postman:  
- Copy the OAS into the API file that you created in the beginning.  
- Save it.  

For verifying your examples (required for validating the test case collection) in Postman:  
- Click "Generate Collection".  
- Name your collection by application name and release number and tick "API Mocking".  
- Copy Mock URL.  
- Click the _Collections_ folder at the very left of the Postman window.  
- Click on your newly created collection.  
- Click on Variables.  
- Search for "baseUrl" and CTRL+v into the CurrentValue field.  
- Now, the Mock URL should be pasted into CurrentValue field of the baseUrl variable.  
- CTRL+s.  
- Check your individual services and OaM _paths_ for a correct RequestBodies.  
- If you would push "Send", your newly created mock server would answer.  
- It is a matter of coincidence, which status code the mock server answers, but if you would expand the list of answers for the request, you could find the 200 or 204 as the top-level entry in the list.  
- Here you could check the ResponseBodies of the successfully processed requests.  
- Actually, you just see the examples you defined in the OAS.  
- If you would not find the expected attributes, you most likely entered an example that is contradicting the structure or format definitions.  


### Review and Finalization  
- Make sure that Postman and VSCode are both holding the latest OAS.  
- _Commit_ to your local feature branch.  
- _Push_ your local feature branch to the remote repository.  
- Create a _Pull-Request_.  
- Please, regard the test results of the YAML linting in the _Pull-Request_. Correct the syntax of the OAS, if errors are indicated (warnings need not to be regarded), and _commit_ and _push_ again until the OAS in the remote repository is successfully validated.  
- Select one or two _Reviewers_ from the team of ApplicationOwners.  
- Assign the _Pull-Request_ to yourself.  

