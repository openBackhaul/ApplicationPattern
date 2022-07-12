# Creating a ProfileInstanceList

This is a step by step cookbook for creating the ProfileInstanceList.  

**Please, read the background information about the [Concept of Profiles](../ConceptOfProfiles/ConceptOfProfiles.md) and the [Concept of the ProfileInstanceList](../ConceptOfProfileList/ConceptOfProfileList.md) before working at the ProfileList.**   


### File Handling

* Assure that there is a copy of the latest [template for the ProfileInstanceList](https://github.com/openBackhaul/ApplicationPattern/blob/develop/ApplicationPattern%2BprofileInstances.yaml) in the develop Branch of your application's repository. The latest ApplicationPattern+profileInstances.yaml can be downloaded from the [ApplicationPattern repository](https://github.com/openBackhaul/ApplicationPattern/tree/develop).  
* Rename the file, by replacing "ApplicationPattern" by your application's name.  


### General  

* Re-using already existing descriptions of instances of Profiles from ProfileInstanceLists of other applications is very much recommended.  


### Further Instances of ActionProfile  

* Check your ServiceList for services that are implementing the concept of generic representation.  
* If you would need to add further instances of ActionProfile please look into existing applications' ProfileInstanceLists and the template to get familiar with the concept.  
* Copy/paste and alter additional instances of ActionProfile for configuring a step-by-step-clicking-through-process after starting with /v1/start-application-in-generic-representation.  
* Finally, just delete the form that waits for completion.  

**ProfileName**  
* The ProfileName shall be set on "ActionProfile".  

**UUID**  
* The UUID shall follow the [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).  
* The LayerID shall be set on "action".  
* The ObjectType shall be set on "p" (Profile).  
* The ApiSegment shall be set on "1" (management, which is individual to this application).  
* The ApplicationNumber shall be set on "0" (the application itself).  
* The SequenceNumber shall start at "00" and must be unique within the scope of instances of Profiles with the same LayerID.  

**OperationName**  
* Fill in the path of the request that shall transport the information about labels, input values and consequent requests in its response body to the GenericRepresentation.  

**Label**  
* Fill in the text that shall be printed on the label, which shall be represented in the GenericRepresentation.  

**InputValueList::FieldName**
* If the Request needs to send parameters in its body, these parameters have to be defined in the InputValueList.  
* Don't represent the InputValueList, if not required.  
* Be aware that the FieldName will not just be sent as an attribute's name in the body of the request, but also be represented by the GenericRepresentation besides an input field.  
* Fill in the FieldName in UpperCamelCase notation.  

**InputValueList::Unit**
* The Unit will be represented by the GenericRepresentation besides an input field.  
* Don't represent this stereotype, if not required.  

**DisplayInNewBrowserWindow**  
* Usually, DisplayInNewBrowserWindow is set on false and the response to the described request will be presented in the same browser window.  
* If the response to clicking the button shall be represented in a new window of the GenericRepresentation, DisplayInNewBrowserWindow has to be set on true.  

**Request**  
* Fill in the complete URL that shall be addressed by the GenericRepresentation whenever the button gets pressed.  
* Several parts (e.g. IP address, TCP port, operationName) of the URL might be subject to the configuration of some interface. These parts have to be substituted by references into the data tree. The references have to be put into cornered brackets "[]".  
* UUIDs comprised in the references have to match the ServiceList content (otherwise the implementers will fill wrong data into the response bodies of the generic representation requests).  


### Instances of IntegerProfile  

* Whenever you would like to make an aspect of the application's behavior configurable and this aspect can be expressed as an Integer value, an additional instance of IntegerProfile is required.  
* Just copy/paste the form prepared for completion or copy from existing ProfileInstanceLists of other applications.  
* Finally, just delete the form that waits for completion.  

**ProfileName**  
* The ProfileName shall be set on "IntegerProfile".  

**UUID**  
* The UUID shall follow the [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).  
* The LayerID shall be set on "integer".  
* The ObjectType shall be set on "p" (Profile).  
* The ApiSegment shall be set on "1" (management, which is individual to this application).  
* The ApplicationNumber shall be set on "0" (the application itself).  
* The SequenceNumber shall start at "00" and must be unique within the scope of instances of Profiles with the same LayerID.  

**IntegerName**  
* Document the attribute's name.  

**Unit**  
* Document the attribute's unit.  
* Don't represent this stereotype, if not required.  

**Minimum**  
* Fill in the minimum value that shall be accepted, while configuring the attribute via the individual OaM section of the REST API.  
* Don't represent this stereotype, if not required.  

**Maximum**  
* Fill in the maximum value that shall be accepted, while configuring the attribute via the individual OaM section of the REST API.  
* Don't represent this stereotype, if not required.  

**IntegerValue**  
* Fill in the current value, respectively the value that shall be applied right after instantiating the application.  


### Instances of StringProfile  

* Whenever you would like to make an aspect of the application's behavior configurable and this aspect needs to be expressed as a String, an additional instance of StringProfile is required.  
* Just copy/paste the form prepared for completion or copy from existing ProfileInstanceLists of other applications.  
* Finally, just delete the form that waits for completion.  

**ProfileName**  
* The ProfileName shall be set on "StringProfile".  

**UUID**  
* The UUID shall follow the [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).  
* The LayerID shall be set on "string".  
* The ObjectType shall be set on "p" (Profile).  
* The ApiSegment shall be set on "1" (management, which is individual to this application).  
* The ApplicationNumber shall be set on "0" (the application itself).  
* The SequenceNumber shall start at "00" and must be unique within the scope of instances of Profiles with the same LayerID.  

**StringName**  
* Document the attribute's name.  

**Enumeration**  
* If only a predefined set of values (e.g. operation modes) shall be accepted, while configuring the attribute via the individual OaM section of the REST API, put a comma separated list of these values into cornered brackets here.  
* Don't represent this stereotype, if not required.  

**Pattern**  
* If only strings that are following a generic definition shall be accepted, while configuring the attribute via the individual OaM section of the REST API, a Regex expression can be defined as a pattern.  
* Formulating Regex is not easy. Potentially [this documentation](https://user.phil.hhu.de/~seyffarth/classes/python2020/09-01%20Regular%20Expressions%20schreiben.html) might be helpful.  
* [Test the Regex](https://regex101.com/).  
* Don't represent this stereotype, if not required.  

**StringValue**  
* Fill in the current value, respectively the value that shall be applied right after instantiating the application.  


### New Profiles  

* You are free to instantiate as many objects based on the self-defined Profiles as you like.  
* Just copy/paste the lines for ProfileName and UUID from an existing definition and the additional stereotypes of your attribute or composed datatype.  
* Be aware that you just need to describe the structuring of configuration information. Application data shall be encapsulated by the application.  

**ProfileName**  
* The ProfileName shall comply with the rules stated in [Concept of Profiles](../ConceptOfProfiles/ConceptOfProfiles.md).  

**UUID**  
* The UUID shall follow the [Structure of UUIDs](../StructureOfUuids/StructureOfUuids.md).  
* Choose a meaningful LayerID.  
* The ObjectType shall be set on "p" (Profile).  
* The ApiSegment shall be set on "1" (management, which is individual to this application).  
* The ApplicationNumber shall be set on "0" (the application itself).  
* The SequenceNumber shall start at "00" and must be unique within the scope of instances of Profiles with the same LayerID.  

**Further Stereotypes**  
* Add the stereotypes of your profile definition.  
* Don't forget to define the attribute's value during instantiation of the application.  


### Validation

* Open the YAML validator at [www.yamllint.com](http://www.yamllint.com/)
* Click into the ProfileList, Control+A, Control+C
* Click into YAML validator editor, Control+V, Push "Go" button
* Syntax of ProfileList is fine, if YAML validator indicates "Valid YAML!"
