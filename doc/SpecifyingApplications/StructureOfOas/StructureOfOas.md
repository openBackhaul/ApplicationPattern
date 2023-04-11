# Structure of the OAS  

The OAS of the MW SDN domain shall be written in YAML.  
Single quotes are used to indicate values of string attributes (e.g. examples, patterns and enumerations), summaries, descriptions and references, but not for IDs or tags that are parts of the specification.  

## Metadata  

#### openapi:  
The version of the OpenAPI Specification shall be '3.0.0'.  

#### info:  
The info section shall contain the _title_ and the _version_ statements.  

#### title:  
The official name of the application shall be stated in the _title_ statement.  

#### version:  
The number of the release that gets specified in this OAS shall be stated in the _version_ statement.  


## Paths  

The _paths_ provided on the API are structured into four categories:  
  - [Individual Services](#individual-services)  
  - [Basic Services](#basic-services)  
  - [Individual OaM](#individual-oam)  
  - [Basic OaM](#basic-oam)  

95% of specification work will be done in the Individual Service section. Whatever specified here will define the purpose of the application. 

The Basic Service section contains the services that are required for integrating the application into the MW SDN application layer. It will be filled by copying the content of the ApplicationPattern and making some adaptions on the UUIDs.  

_Paths_ that are required for management activities that are individual to this application shall be located in the Individual OaM section. Two _paths_ are pre-defined, but might require adaptation.  

The Basic OaM section comprises standard OaM _paths_ that can be put together from the _paths_ that are already comprised in the ApplicationPattern.  


### Individual Services  

The OperationNames of the OperationServers defined in the ServiceList's individual service section shall be listed beneath the _/v1/bequeath-your-data-and-die:_ . The ordering should be kept in synch.  

>#### parameters:
>Every _path_ description has to start with the parameters.  
>
>In the Service layer, all _paths_ must support the same set of header parameters. These parameters are defined in a separate section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ statements. The entire _parameters:_ statement needs just to be copied from any service in the ApplicationPattern.  
>
>#### Method
>The _parameters:_ statement has always to be followed by an HTTP method.  
>
>In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  
>
>>#### operationId:
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the Service layer, the OperationId shall be the original OperationName, but expressed in lowerCamelCase (e.g. registerApplication).  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:
>>The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.  
>>In the individual service section, _IndividualServices_ has to be chosen for tag.  
>>It tells the ApplicationImplementer to complete automatically generated code artifacts with individual programming.  
>>
>>#### security:  
>>The _security:_ statement serves to protect the path against unauthorized use.  
>>
>>The following security methods come into question in the individual service section:
>>- **_apiKeyAuth: []_** : According to the MW SDN design, addressing Services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to Services is restricted on applications, respectively OperationClients, instead of humans. Services shall, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  
>>- **none** : _Paths_ like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests.  In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system. These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  
>>
>>#### RequestBody  
>>The _requestBody:_ statement is optional. 
>>
>>In the Service layer, it has to be added whenever additional information is required for executing a Service.  
>>
>>>#### required:  
>>>If a _required:_ statement is added at this position, it relates to the RequestBody as a whole.  
>>>Only in extremely rare cases is a RequestBody required as a whole or not at all.  
>>>In general, if there is a _requestBody:_ statement, there shall be also a _required: true_ statement.  
>>>
>>>#### content:
>>>The description of the content of the RequestBody starts.  
>>>If there is a _requestBody:_ statement, there shall also be a _content:_ statement.  
>>>
>>>>#### Media Type
>>>>The content of the RequestBody could be expressed in multiple syntax (e.g. JSON, HMTL, PDF).  
>>>>In case of the MW SDN, the content of the RequestBody shall always be expressed in JSON.  
>>>>So, just one media type shall be described in the content.  
>>>>The mandatory _requestBody:_ statement shall always be followed by an _application/json:_ statement.  
>>>>
>>>>>#### schema:  
>>>>>The _application/json:_ statement shall always be followed by a _schema:_ statement.  
>>>>>The _schema:_ statement starts the description of the structure of the JSON object that is forming the RequestBody.  
>>>>>
>>>>>OpenAPI Specification allows to define the structure of the JSON object in a separate section at the end of the OAS and to just put a reference to this definition into the Schema section of an individual RequestBody.  
>>>>>It is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
>>>>>Reading the OAS is easier when following this order during specification work.  
>>>>>
>>>>>>#### Datatype of the RequestBody   
>>>>>>As a first statement inside the schema definition, the datatype of the RequestBody has to be defined.  
>>>>>>The schema of RequestBodies shall always be wrapped into an object.  
>>>>>>That means that the JSON will start and end with a curly bracket and the attributes will be represented with their names and values inside.  
>>>>>>So, the _schema:_ statements in the RequestBodies shall always be followed by a _type: object_ statement.  
>>>>>>
>>>>>>An object description must define the included attributes and specify whether and in which combination these attributes must be present in a valid Body.  
>>>>>>This can be expressed through different combinations of statements.  
>>>>>>
>>>>>>It is recommended to always start the description of an object with the statements about the necessity of the included attributes, then describe the attributes in detail, and conclude with a concrete example.  
>>>>>>
>>>>>>#### required: and Multiplicities
>>>>>>In most cases the description of an object starts with a _required:_ statement and a list of names of attributes that must be present in a valid service or OaM request. Listing the names of required attributes is a clean and clear way of assuring that the defined attributes are actually provided in a Body.  
>>>>>>
>>>>>>In cases just some of the attributes need to be included, _minProperties:_ and _maxProperties:_ statements might support formulating boundaries. An _additionalProperties: false_ statement might support enforcing the quantity rules. In practice, these restrictions are usually imprecise and therefore not ideal. Formulating alternative object structures and combining them by e.g. an _oneOf:_ statement should be considered.  
>>>>>>
>>>>>>#### properties:
>>>>>>The individual attributes get described in detail in this section.  
>>>>>>
>>>>>>>#### Attribute's Name  
>>>>>>>It starts with the name of the attribute. Ideally, the attribute's name is clearly and concisely describing the attribute.  
>>>>>>>
>>>>>>>>#### type:
>>>>>>>>The attribute's datatype is to be stated next.  
>>>>>>>>There are virtually no restrictions regarding the structure of the RequestBody.  
>>>>>>>>In most cases it will be a single attribute of a primitive data type.  
>>>>>>>>But nested composite objects that are to be considered valid in different variants are also possible.  
>>>>>>>>
>>>>>>>>In case of string attributes a _pattern:_ statement together with a Regex string might follow, or valid values get predefined in an _enum:_ statement.  
>>>>>>>>Values of integer attributes could also be restricted in various ways.  
>>>>>>>>
>>>>>>>>It is recommended to describe the input data as precise as possible because this ultimately determines the quality of the application's data content at runtime.  
>>>>>>>>
>>>>>>>>#### description:
>>>>>>>>The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  
>>>>>>>>
>>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used.  
>>>>>>>>
>>>>>>>>Where to get or put the attribute's value in the internal data structure is to be stated next.  
>>>>>>>>There are strict definitions for the verbs that are to be used.  
>>>>>>>>
>>>>>>>>  - _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
>>>>>>>>  - _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with the key attribute having this value. This represents the case of a _subscription_.  
>>>>>>>>  - _update_: The value of the attribute shall be used for updating the referenced position in the data tree (, if the dataset that is identified by the key attribute's value could be found).  
>>>>>>>>  - _update or create_: The value of the attribute shall be used for updating the referenced position in the data tree. (In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.)  
>>>>>>>>
>>>>>>>>The paths that are identifying the positions in the data tree are usually containing UUIDs.  
>>>>>>>>These UUIDs shall be as precise as possible.  
>>>>>>>>Unknown segments of the UUIDs shall be covered by '*'.
>>>>>>
>>>>>>#### example:
>>>>>>If the _example:_ statement is arranged with the same number of indents as the _type: object_ statement, the example has to comply with the specifications of the object. This includes not just the attributes' names and datatypes, but also the rulings of availability and multiplicity.  
>>>>>>
>>>>>>In most cases the list of attributes can be copied from the _required:_ statement, hyphens have to be removed and proper values have to be added.  
>>>>>>
>>#### responses:
>>The _responses:_ statement is mandatory.  
>>Even in case no attributes have to be returned in a ResponseBody, the HTTP status codes have to be defined.  
>>
>>The following HTTP status codes have always to be supported for indicating errors:  
>> - 400  
>> - 401  
>> - 403  
>> - 404  
>> - 500  
>> - default  
>>
>>Standard schemas have already been defined for these codes.  
>>These schemas need just to be referenced.  
>>A code block that is describing these codes and references can be copied from any existing _path_ in the ApplicationPattern.  
>>
>>>#### 204:  
>>>If the response would not contain any ResponseBody, successful requests would be indicated by HTTP status code 204.  
>>>It is recommended to copy an existing code block that is describing an HTTP status code 204 from another _path_ and to replace the values of the following attributes.  
>>>
>>>>#### description:  
>>>>Description of what just happened as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>The UUID has to point to the correct position in the data tree for retrieving the life cycle state of the OperationServer.  
>>>
>>>#### 200:  
>>>If the response would need to contain attributes, successful requests would be indicated by HTTP status code 200.  
>>>In these cases the structure of the ResponseBodies is as individual as of RequestBodies.  
>>>
>>>>#### description:  
>>>>Description of what just happened as the request has been successfully executed.  
>>>>
>>>>#### content:  
>>>>The description of the content of the ResponseBody starts.  
>>>>If there is a _'200':_ statement, there shall also be a _content:_ statement.  
>>>>
>>>>>#### Media Type  
>>>>>In case of the MW SDN, the content of the ResponseBody shall always be expressed in JSON.  
>>>>>So, just one media type shall be described in the content.  
>>>>>The _content:_ statement shall always be followed by an _application/json:_ statement.  
>>>>>
>>>>>>#### schema:  
>>>>>>The _application/json:_ statement shall always be followed by a _schema:_ statement.  
>>>>>>The _schema:_ statement starts the description of the structure of the JSON object that is forming the ResponseBody.  
>>>>>>It is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
>>>>>>
>>>>>>As the format of the data has already been harmonized on the ingress, the schema definition of the ResponseBody does not need to be equally detailed in regards of patterns or combinations of parameters.  
>>>>>>
>>>>>>>#### Datatype of the ResponseBody  
>>>>>>>The attributes of the ResponseBody shall always be wrapped into at least an object, so they get represented with their names and values.  
>>>>>>>In difference to the RequestBody, the ResponseBody often contains lists of these objects.  
>>>>>>>In such cases it is necessary to wrap the entire object into an array.  
>>>>>>>
>>>>>>>As a first statement inside the schema definition, the datatype of the ResponseBody has to be defined.  
>>>>>>>The _type: object_ statement is to be used when one or more attributes are to be returned once.  
>>>>>>>The _type: array_ statement is to be used when the same set of attributes has to be returned multiple times as a list.  
>>>>>>>
>>>>>>>#### uniqueItems:  
>>>>>>>If a _type: array_ statement has been applied, it has to be defined whether the same set of values could occur multiple times.  
>>>>>>>If this would be true, a _uniqueItems: false_ statement should follow.  
>>>>>>>If not, a _uniqueItems: true_ statement must follow.  
>>>>>>>
>>>>>>>#### items:  
>>>>>>>If the _type: array_ statement has been applied, the data structure to be displayed repeatedly must be described next.  
>>>>>>>So, the _type: array_ statement, respectively the _uniqueItems:_ statement must be followed by an _item:_ statement.  
>>>>>>>
>>>>>>>>#### type: object
>>>>>>>>The _type: object_ statement must either follow the _schema:_ statement or the _items:_ statement.  
>>>>>>>>In the case of a simple object, the number of indentations is one less than in the case of a list of objects.  
>>>>>>>>
>>>>>>>>#### required: and Multiplicities
>>>>>>>>_required:_ statement and multiplicities shall not be used to filter internal data on the egress.  
>>>>>>>>It is assumed that the data in the application matches the desired formats, after being filtered accordingly on the ingress already.  
>>>>>>>>Unlike existing specifications, it is not recommended to add _required:_ statements to the schema of the response body.  
>>>>>>>>Multiplicity statements like _minProperties:_, _maxProperties:_ or _additionalProperties: false_ statements don't make sense as the data content shall be exported as is.  
>>>>>>>>Adding _required:_ or multiplicity statements, bears the risk of forgetting to update them in case of changes to the specifications on the ingress.  
>>>>>>>>
>>>>>>>>#### properties:
>>>>>>>>The _properties:_ statement is following the _type: object_ statement in most cases.  
>>>>>>>>The description of the individual attributes shall follow the same structure as in the RequestBody, but be less detailed:  
>>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.
>>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.
>>>>>>>> - The _description:_ statement shall not explain the meaning/use of the attribute.  
>>>>>>>> - _from_ shall be used for referencing the position in the data tree from where the value of the attribute shall be taken.  
>>>>>>>>
>>>>>>>#### example:
>>>>>>>The _example:_ statement shall be arranged one level beneath the _schema:_ statement.  
>>>>>>>
>>>>>>>If the datatype would be a bare object, a single set of attributes shall be provided.  
>>>>>>>The composition of the attributes shall represent a realistic case.  
>>>>>>>
>>>>>>>If the datatype would be an array, two sets of attributes shall be provided.  
>>>>>>>A leading hyphen shall be used to separate the two independent sets.  
>>>>>>>Both compositions of attributes shall represent realistic cases.  
>>>>>>>Ideally, the two sets of attributes depict cases that are as different as possible.  
>>>>>>>
>>>>#### headers:  
>>>>It is recommended to copy an existing code block that is describing the headers of an HTTP status code 200 from another _path_ and to replace the value of the following attribute.  
>>>>
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>_from_ shall be used for referencing the position in the data tree from where the life cycle state of the attribute shall be taken (many existing specifications might contain a wrong word).  
>>>>>>The UUID has to point to the correct position in the data tree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks
>>All _Forwardings_ that are described in the ForwardingList must result in a _callback_ definition in the OAS.  
>>
>>**Where to locate the Forwardings/Callbacks?**
>>According to the basic principles, a _callback_ definition should be located inside the definitions of the _path_ (OperationServer), which is initiating sending the _callback_ request.  
>>This principle gets into trouble when receiving requests on multiple, different OperationServers shall result in sending the same _callback_.  
>>Example: Receiving a request at any of the application's OperationServers shall result in sending a request to the ExecutionAndTraceLog application.  
>>MW SDN design team decided against repeating the same _callback_ definition in multiple _paths_.  
>>
>>The _path_ for holding the _callback_ definition is to be selected according to the ordering of the _paths_ in the description of the _forwarding_ according to the template of the ForwardingList or the definitions in the [Structure of Forwardings](../StructureOfForwardingList/StructureOfForwardingList.md).  
>>
>>Consequently, the _callback_ definition, which is implementing a _forwarding_ from the ForwardingList, is usually allocated inside the definition of the _path_, which is stated to be the management request for updating the OperationClient.  
>>If no OperationServer for updating the OperationClient would be stated in the description of the _forwarding_, the OperationServer for updating the FcPorts, or for deleting the FcPorts, or for deleting the OperationClients would have to be chosen (in this ordering) instead.  
>>If there would be no management requests stated in the description of a _forwarding_ in the ForwardingList, the _path_ of the OperationServer that is initiating sending the _callback_ shall be chosen for allocating the _callback_ definition.  
>>
>>As soon as the correct _path_ could be identified, a _callbacks:_ statement is to be added after the _responses:_ block.  
>>
>>>#### Callback Name  
>>>The forwarding-name from within the ForwardingList has to be copied beneath the _callbacks:_ statement.  
>>>If several forwarding-names have to be added to the same _path_, the _callbacks:_ statement shall not be repeated.  
>>>
>>>>#### URL  
>>>>In the original OpenApi Specification, a concrete URL is following the _callback_ name.  
>>>>This is not ideal, since the URL statement would outdate whenever the IP address or port of the receiver of the _callback_ would change.  
>>>>Instead the configurable attributes of the internal data tree shall be referenced.  
>>>>This gives concrete guidance about how to compose the URL to the ApplicationImplementer.  
>>>>A couple of tricks need to be applied for avoiding YAML validation to indicate an error.  
>>>>
>>>>The URL statement shall start with "url: ".  
>>>>A "#" shall follow for marking the rest of the line to be a comment that is excluded from syntax validation.  
>>>>The URL gets composed from references into the internal data tree and concrete symbols that are common in URLs.  
>>>>References are enclosed by square brackets.  
>>>>The following concrete symbols are included "://" and ":".  
>>>>[Reference to protocol]://[Reference to domain name and IP address]:[Reference to port][Reference to operation name]
>>>>
>>>>>#### Method
>>>>>The rest of the _callback_ definition is basically a copy of the original definition of the _method_ inside the _path_ that is to be addressed.  
>>>>>
>>>>>This redundancy bears the risk of getting outdated in case of an update of the original _path_ definition.  
>>>>>
>>>>>Part of the problem:
>>>>>The descriptions of the attributes in the original _path_ definition contain referenced into the data tree of the application that offers the OperationServer (-> where to put the received values).  
>>>>>The descriptions of the attributes in the _callback_ definition contain referenced into the data tree of the application that holds the OperationClient (-> where to get the values that are to be send).  
>>>>>Thus, it is not possible to just copy the latest state of the original definitions of the _path_ into the _callback_ definition.  
>>>>>
>>>>>Future need for updating the _callback_ implementation should be minimized as much as possible.  
>>>>>E.g. _minimum:_ and _maximum:_ statements at Integer attributes or _pattern:_ and _enum:_ statements at Strings should be avoided.  
>>>>>
>>>>>_required:_ statements and multiplicities should not be deleted from the _callback_ definitions as they are guiding the ApplicationImplementer to create proper requests.  
>>>>>


### Basic Services  

The basic service section is embedding the application into the MW SDN framework and it implements a couple of services that must be supported by all applications.  

The content of the basic service section must be identical in all applications.  

It is a copy of the basic service section of the ApplicationPattern.  
Just UUIDs need to be adapted.  


### Individual OaM  

The individual OaM section is required for OaM _paths_ that are specific to the application.  

Entirely new _paths_ might be required e.g. for managing individual Profile definitions.  
All the Profiles from the ProfileList need to be covered by read and write _paths_ for the respective attributes.  

The _/core-model-1-4:control-construct:_ and the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ are listed in the individual OaM section, because they might need to be complemented by additional elements like Profile definitions.  

The structure of the _paths_ for managing applications shall be identical to the RESTCONF interface that is exposed at the controller NBI for managing microwave devices.  [Structure of OAM Paths](../../ElementsApplicationPattern/Names/StructureOfOamPaths/StructureOfOamPaths.md) is providing concrete guidance for formulating the _paths_.  

>#### parameters:  
>Every _path_ description has to start with the parameters.  
>
>There is no specific set of parameters that are to be supported by all _paths_ of the OaM layer, but the individual OaM _paths_ might contain variable segments like e.g. a UUID or a local ID.  
>
>>#### in: path  
>>A variable segment of a _path_ has to be expressed in curly brackets and as _in: path_ parameter.  
>>
>>If it would be required to define an additional individual OaM _path_ and the variable segment would represent a UUID, an existing parameter definition shall be copied and the _pattern:_ and the _example:_ statements shall be updated. 
>>
>>#### name:  
>>If a new kind of variable segment would be required, the _name:_ statement needs to be adapted to the parameter name defined inside the curly brackets in the _path_.  
>>
>>#### required: true  
>>In-path parameters are usually needed to identify the correct resource and cannot be neglected.  
>>If the variable segment cannot be neglected, _required: true_ must be added.  
>>
>>#### schema:  
>>The _schema:_ statement is always required when describing an in-path parameter.  
>>The _schema:_ statement starts the description of the structure of the JSON object that is to be included into the _path_. 
>>
>>>#### type:  
>>>It is to be expected that in-path parameters are of a primitive datatype. Most often, it will be a string. Integer is also possible.  
>>>
>>>Usually, values of in-path parameters are following a concrete structure that is kept during creating the key attribute's value while instantiating the respective object in the data tree or they are a choice from a set of predefined values.  
>>>Anyway, it is very much recommended to explicitly describe also the variable segments of the _path_ for successful appliance of the API.  
>>>
>>>#### pattern:  
>>>If the in-path parameter is a string that is following a structure, it is recommended to express the expected format as a RegEx in a _pattern:_ statement.  
>>>Help for formulating proper regular expressions could be found [here](https://www.geeksforgeeks.org/write-regular-expressions/) or [here](https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285).  
>>>A validator for testing regular expressions could be found [here](https://regex101.com/).  
>>>It is recommended not to attempt optimizing the length of the regular expression to a minimum number of symbols, but to optimize for easy to read explanations of the format.  
>>>
>>>#### enum:  
>>>If the in-path parameter is a string that can only take certain values, it is recommended to add an _enum:_ statement and to list all supported values.  
>>>
>>>#### example:  
>>>A coherent example value that complies with the pattern or enumeration definition shall be added.  
>>>
>#### get:  
>The _parameters:_ block has always to be followed by an HTTP method.  
>In the OaM layer, all _paths_ have to support the _get_ method.  
>
>>#### operationId:
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the OaM layer, the OperationId shall be composed from the method (get or put), the object type (e.g. OperationServer, ActionProfile) and the attribute's name  (e.g. LifeCycleState, ConsequentOperationReference).  
>>lowerCamelCase style is applied, like e.g. getOperationServerLifeCycleState.  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:
>>The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.  
>>
>>In the OaM layer, the following tags have been defined for grouping _paths_ that are required for managing the same kind of objects:  
>>  - _Core_  
>>  - _ActionProfile_  
>>  - _GenericResponseProfile_  
>>  - _FileProfile_  
>>  - _IntegerProfile_  
>>  - _StringProfile_  
>>  - _OperationServer_  
>>  - _HttpServer_  
>>  - _TcpServer_  
>>  - _OperationClient_  
>>  - _HttpClient_  
>>  - _TcpClient_  
>>  - _ElasticsearchClient_  
>>
>>If a new kind of _Profile_ would be defined by the ApplicationOwner, a new tag would have to be used, too.  
>>Obviously, an additionally defined tag must be distinct from the existing ones.  
>>
>>#### security:  
>>All _paths_ on the OaM layer have to be protected by a _security:_ statement against unauthorized use.  
>>
>>>#### basicAuth:
>>>OaM _paths_ are for humans configuring the application.  
>>>Consequently, they are not part of the operation key management, but rather of an authentication procedure that relates to humans.  
>>>OaM _paths_ shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the centralized administration of administrators during the application's runtime.  
>>>
>>#### RequestBody  
>>A RequestBody is not required in the _get_ requests of the OaM layer.  
>>Consequently, there is no _requestBody:_ statement.
>>
>>#### responses:
>>The _responses:_ statement is mandatory.  
>>
>>>#### 200:  
>>>The _get_ requests of the OaM layer are for retrieving data.  
>>>As the response will contain one or several attributes, successful requests will be indicated by HTTP status code 200.  
>>>
>>>>#### description:  
>>>>Description of what just happened as the request has been successfully executed.  
>>>>
>>>>#### content:  
>>>>The description of the content of the ResponseBody starts.  
>>>>If there is a _'200':_ statement, there shall also be a _content:_ statement.  
>>>>
>>>>>#### Media Type  
>>>>>In case of the MW SDN, the content of the ResponseBody shall always be expressed in JSON.  
>>>>>So, just one media type shall be described in the content.  
>>>>>The _content:_ statement shall always be followed by an _application/json:_ statement.  
>>>>>
>>>>>>#### schema:  
>>>>>>The _application/json:_ statement shall always be followed by a _schema:_ statement.  
>>>>>>The _schema:_ statement starts the description of the structure of the JSON object that is forming the ResponseBody.  
>>>>>>It is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
>>>>>>
>>>>>>As the format of the data has already been harmonized on the ingress, the schema definition of the ResponseBody does not need to be equally detailed in regards of patterns or combinations of parameters.  
>>>>>>
>>>>>>>#### _type: object_  
>>>>>>>Even if most the _paths_ on the OaM layer are addressing just a single attribute, the ResponseBody shall always be wrapped into an object.  
>>>>>>>Thus a _type: object_ statement has to follow the _schema:_ statement.  
>>>>>>>
>>>>>>>#### required:  
>>>>>>>_required:_ statement and multiplicities shall not be used to filter internal data on the egress.  
>>>>>>>Unlike existing specifications, it is not recommended to add _required:_ statements to the schema of the response body.  
>>>>>>>
>>>>>>>#### properties:
>>>>>>>The _properties:_ statement is following the _type: object_ statement.  
>>>>>>>The description of the individual attributes shall follow the same structure as in a RequestBody, but be less detailed:  
>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.  
>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.  
>>>>>>> - A _description:_ statement shall not be added.  
>>>>>>>
>>>>>>>>#### Attribute's Name  
>>>>>>>>It has to be regarded that the interface shall look and feel like a RESTCONF interface.  
>>>>>>>>If some resource is addressed at a RESTCONF interface, the answered attribute would be lead by the name of its namespace.  
>>>>>>>>On the OaM layer, this namespace is identical with the module's name that already got defined in the _tags:_ statement above.  
>>>>>>>>So, the attribute's name is concatenated from the value of the _tags:_ statement, but written in HTTP style with hyphens instead of capital letters, a release number of the module definition, a colon and the actual attribute's name from the data tree.  
>>>>>>>>
>>>>>>>#### example:  
>>>>>>>The _example:_ statement shall be arranged one level beneath the _schema:_ statement.  
>>>>>>>
>>>>>>>The attribute needs to be stated including its name and value.  
>>>>>>>Reasonable values should be chosen to support validation of the testcases.  
>>>>>>>
>>>#### Error Codes  
>>>The following HTTP status codes have always to be supported for indicating errors:  
>>> - 400  
>>> - 401  
>>> - 403  
>>> - 404  
>>> - 500  
>>> - default  
>>>
>>>Standard schemas have already been defined for these codes.  
>>>These schemas need just to be referenced.  
>>>A code block that is describing these codes and references can be copied from any existing _path_ in the ApplicationPattern.  
>>>
>#### put:  
>If the resource, which shall be addressed by the _path_, is located within a Configuration class, the _put_ method has to be supported, too.  
>In such cases, a _put:_ block needs to follow the _get:_ block.  
>
>>#### operationId:
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the OaM layer, the OperationId shall be composed from the method (get or put), the object type (e.g. OperationServer, ActionProfile) and the attribute's name  (e.g. LifeCycleState, ConsequentOperationReference).  
>>lowerCamelCase style is applied, like e.g. putActionProfileConsequentOperationReference.  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:  
>>Obviously, the same value as in the _get:_ block has to be applied in the _put:_ block, too.
>>
>>#### security:  
>>All _paths_ on the OaM layer have to be protected by a _security:_ statement against unauthorized use.  
>>
>>>#### basicAuth:
>>>OaM _paths_ shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the centralized administration of administrators during the application's runtime.  
>>>
>>#### RequestBody  
>>The _requestBody:_ statement is evidently unavoidable for PUT requests in the OaM layer.  
>>
>>>#### required:  
>>>If a _required:_ statement is added at this position, it relates to the RequestBody as a whole.  
>>>If there is a _requestBody:_ statement, there shall be also a _required: true_ statement.  
>>>
>>>#### content:  
>>>The description of the content of the RequestBody starts.  
>>>If there is a _requestBody:_ statement, there shall also be a _content:_ statement.  
>>>
>>>>#### Media Type  
>>>>In case of the MW SDN, the content of the RequestBody shall always be expressed in JSON.  
>>>>So, just one media type shall be described in the content.  
>>>>If there is a _content:_ statement, there shall also be a _application/json:_ statement.  
>>>>
>>>>>#### schema:  
>>>>>The _application/json:_ statement shall always be followed by a _schema:_ statement.  
>>>>>The _schema:_ statement starts the description of the structure of the JSON object that is forming the RequestBody.  
>>>>>
>>>>>It is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
>>>>>Reading the OAS is easier when following this order during specification work.  
>>>>>
>>>>>>#### type: object 
>>>>>>As a first statement inside the schema definition, the datatype of the RequestBody has to be defined.  
>>>>>>The schema of RequestBodies shall always be wrapped into an object.  
>>>>>>That means that the JSON will start and end with a curly bracket and the attributes will be represented with their names and values inside.  
>>>>>>So, the _schema:_ statements in the RequestBodies shall always be followed by a _type: object_ statement.  
>>>>>>
>>>>>>An object description must define the included attributes and specify whether and in which combination these attributes must be present in a valid Body.  
>>>>>>This can be expressed through different combinations of statements.  
>>>>>>Precision of the description of the RequestBodies of the OaM layer supports later quality of the internal configuration data.  
>>>>>>
>>>>>>It is recommended to always start the description of an object with the statements about the necessity of the included attributes, then describe the attributes in detail, and conclude with a concrete example.  
>>>>>>
>>>>>>#### required: and Multiplicities  
>>>>>>In most cases the description of a RequestBody starts with a _required:_ statement and a list of names of attributes that must be present.  
>>>>>>Listing the names of required attributes is a clean and clear way of assuring that the defined attributes are actually provided in a request.  
>>>>>>
>>>>>>In cases just some of the attributes need to be included, _minProperties:_ and _maxProperties:_ statements might support formulating boundaries. An _additionalProperties: false_ statement might support enforcing the quantity rules. In practice, these restrictions are usually imprecise and therefore not ideal.  
>>>>>>
>>>>>>In case of a datatype that is composed from several attributes that might occur in diverse valid combinations, formulating alternative object structures and combining them by e.g. an _oneOf:_ statement should be considered.  
>>>>>>
>>>>>>#### properties:  
>>>>>>The individual attributes get described in detail in this section.  
>>>>>>Precision of the description of the attributes supports later quality of the internal configuration data.  
>>>>>>
>>>>>>>#### Attribute's Name  
>>>>>>>It has to be regarded that the OaM interface of the application shall look and feel like a RESTCONF interface.  
>>>>>>>If some resource is addressed at a RESTCONF interface, the namespace of the attribute needs to be stated, too.  
>>>>>>>On the OaM layer, this namespace is identical with the module's name that already got defined in the _tags:_ statement above.  
>>>>>>>So, the top level attribute's name is concatenated from  
>>>>>>> - the value of the _tags:_ statement, but written in HTTP style with hyphens instead of capital letters,  
>>>>>>> - a release number of the module definition,  
>>>>>>> - a colon and  
>>>>>>> - the actual attribute's name from the data tree.  
>>>>>>>
>>>>>>>>#### type:  
>>>>>>>>There are virtually no restrictions regarding the structure of the RequestBody.  
>>>>>>>>In most cases it will be a single attribute of a primitive data type.  
>>>>>>>>But nested composite objects that are to be considered valid in different variants are also possible.  
>>>>>>>>Either way, it is recommended to describe the input data as precise as possible because this ultimately determines the quality of the application's data content at runtime.  
>>>>>>>>
>>>>>>>>In case of string attributes a _pattern:_ statement together with a Regex string might follow, or valid values get predefined in an _enum:_ statement.  
>>>>>>>>Values of integer attributes could also be restricted in various ways.  
>>>>>>>>
>>>>>>#### example:  
>>>>>>The _example:_ statement shall have the same number of indents as the _type: object_ statement.  
>>>>>>If so, the example has to comply with the specifications of the object.  
>>>>>>This includes not just the attributes' names, datatypes, patterns and so on, but also the rulings in regards of availability and multiplicity of the attributes.  
>>>>>>
>>>>>>Reasonable values should be chosen to support validation of the testcases.  
>>>>>>
>>#### responses:
>>The _responses:_ statement is mandatory.  
>>Even in case no attributes have to be returned in a ResponseBody, the HTTP status codes have to be defined.  
>>
>>While defining the put method of an additional _path_ in the individual OaM section, it is recommended to just copy an entire _responses:_ block from an existing OaM _path_ in the ApplicationPattern.  
>>
>>>#### 204:  
>>>The response is assumed not to contain any attributes.  
>>>Consequently, successful requests are indicated by HTTP status code 204.  
>>>
>>>>#### description:  
>>>>The description of the HTTP status code 204 is assumed to be the only attribute that requires individualization in case of the put method of an additional _path_ in the individual OaM section.   
>>>>It shall describe what just happened as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>Headers are not used in the OaM section.  
>>>>
>>>#### Error Codes  
>>>The code blocks that are describing the HTTP response codes >204 are not to be modified.  
>>>


### Basic OaM  

The Basic OaM section contains the OaM _paths_ that are identical to all applications belonging to the MW SDN application layer.  
They get just copied from the latest version of the ApplicationPattern.  
If some objects, such as the FileProfile or the ElasticSearchClient are not needed, the corresponding _paths_ should be removed.  

The UUIDs need to be adapted to the abbreviation and release number of the new application.  


## Common Components  

The _components_ block contains definitions that get referenced from within the other sections of the OAS.  
They are identical to all applications belonging to the MW SDN application layer.  
The _components_ block gets just copied from the latest version of the ApplicationPattern.  
The UUIDs need to be adapted to the abbreviation and release number of the new application.  

If the definitions in the service or OaM sections would contain exact repetitions of object definition, these objects could be added to the _schema:_ section of the _components:_ block and replaced by references at their original locations.  

