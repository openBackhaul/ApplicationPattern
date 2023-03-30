# Structure of the OAS  

The OAS of the MW SDN domain shall be written in YAML.  


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
  - Individual Services  
  - Basic Services  
  - Individual OaM  
  - Basic OaM  

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
>>>>>>It starts with the name of the attribute. Ideally, the attribute's name is clearly and concisely describing the attribute.  
>>>>>>
>>>>>>The attribute's datatype is to be stated next.  
>>>>>>
>>>>>>In case of String attributes a _pattern:_ statement together with a Regex string might follow.  
>>>>>>
>>>>>>>#### description:
>>>>>>>The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  
>>>>>>>
>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used.  
>>>>>>>
>>>>>>>Where to get or put the attribute's value in the internal datastructure is to be stated next.  
>>>>>>>There are strict definitions for the verbs that are to be used.  
>>>>>>>
>>>>>>>  - _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
>>>>>>>  - _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with the key attribute having this value. This represents the case of a _subscription_.  
>>>>>>>  - _update_: The value of the attribute shall be used for updating the referenced position in the datatree (, if the dataset that is identified by the key attribute's value could be found).  
>>>>>>>  - _update or create_: The value of the attribute shall be used for updating the referenced position in the datatree. (In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.)  
>>>>>>>
>>>>>>>The paths that are identifying the positions in the datatree are usually containing UUIDs.  
>>>>>>>These UUIDs shall be as precise as possible.  
>>>>>>>Unknown segments of the UUIDs shall be covered by '*'.
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
>>>>Description of what just happend as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>
>>>#### 200:  
>>>If the response would need to contain attributes, successful requests would be indicated by HTTP status code 200.  
>>>In these cases the structure of the ResponseBodies is as individual as of RequestBodies.  
>>>
>>>>#### description:  
>>>>Description of what just happend as the request has been successfully executed.  
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
>>>>>>>>The description of the individual attributes shall follow the same structure as in the RequestBody, but be less detailled:  
>>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.
>>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.
>>>>>>>> - The _description:_ statement shall not explain the meaning/use of the attribute.  
>>>>>>>> - _from_ shall be used for referencing the position in the datatree from where the value of the attribute shall be taken.  
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
>>>>>>_from_ shall be used for referencing the position in the datatree from where the life cycle state of the attribute shall be taken (many existing specifications might contain a wrong word).  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks
§2§All _Forwardings_ that are described in the ForwardingList must result in a _callback_ definition in the OAS.  
§2§
§2§**Where to locate the Forwardings/Callbacks?**
§2§According to the basic principles, a _callback_ definition should be located inside the definitions of the _path_ (OperationServer), which is initiating sending the _callback_ request.  
§2§This principle gets into trouble when receiving requests on multiple, different OperationServers shall result in sending the same _callback_.  
§2§Example: Receiving a request at any of the application's OperationServers shall result in sending a request to the ExecutionAndTracyLog application.  
§2§MW SDN design team decided against repeating the same _callback_ definition in multiple _paths_.  
§2§
§2§The _path_ for holding the _callback_ definition is to be selected according to the ordering of the _paths_ in the description of the _forwarding_ according to the template of the ForwardingList or the definitions in the [Structure of Forwardings](../StructureOfForwardingList/StructureOfForwardingList.md).  
§2§
§2§Consequently, the _callback_ definition, which is implementing a _forwarding_ from the ForwardingList, is usually allocated inside the definition of the _path_, which is stated to be the management request for updating the OperationClient.  
§2§If no OperationServer for updating the OperationClient would be stated in the description of the _forwarding_, the OperationServer for updating the FcPorts, or for deleting the FcPorts, or for deleting the OperationClients would have to be chosen (in this ordering) instead.  
§2§If there would be no management requests stated in the description of a _forwarding_ in the ForwardingList, the _path_ of the OperationServer that is initiating sending the _callback_ shall be chosen for allocatin the _callback_ definition.  
§2§
§2§As soon as the correct _path_ could be identified, a _callbacks:_ statement is to be added after the _responses:_ block.  
§2§
§3§#### Callback Name  
§3§The forwarding-name from within the ForwardingList has to be copied beneath the _callbacks:_ statement.  
§3§If several forwarding-names have to be added to the same _path_, the _callbacks:_ statement shall not be repeated.  
§3§
§4§#### URL  
§4§In the original OpenApi Specification, a concrete URL is following the _callback_ name.  
§4§This is not ideal, since the URL statement would outdate whenever the IP address or port of the receiver of the _callback_ would change.  
§4§Instead the configurable attributes of the internal data tree shall be referenced.  
§4§This gives concrete guidance about how to compose the URL to the ApplicationImplementer.  
§4§A couple of tricks need to be applied for avoiding YAML validation to indicate an error.  
§4§
§4§The URL statement shall start with "url: ".  
§4§A "#" shall follow for marking the rest of the line to be a comment that is excluded from syntax validation.  
§4§The URL gets composed from references into the internal data tree and concrete symbols that are common in URLs.  
§4§References are enclosed by square brackets.  
§4§The following concrete symbols are included "://" and ":".  
§4§[Reference to protocol]://[Reference to domain name and IP address]:[Reference to port][Reference to operation name]
§4§
§5§#### Method
§5§The rest of the _callback_ definition is basically a copy of the original definition of the _method_ inside the _path_ that is to be addressed.  
§5§
§5§This redundancy bears the risk of getting outdated in case of an update of the original _path_ definition.  
§5§
§5§Part of the problem:
§5§The descriptions of the attributes in the original _path_ definition contain referenced into the datatree of the application that offers the OperationServer (-> where to put the received values).  
§5§The descriptions of the attributes in the _callback_ definition contain referenced into the datatree of the application that holds the OperationClient (-> where to get the values that are to be send).  
§5§Thus, it is not possible to just copy the latest state of the original definitions of the _path_ into the _callback_ definition.  
§5§
§5§Future need for updating the _callback_ implementation should be minimized as much as possible.  
§5§E.g. _minimum:_ and _maximum:_ statements at Integer attributes or _pattern:_ amd _enum:_ statements at Strings should be avoided.  
§5§
§5§_required:_ statements and multiplicities should not be deleted from the _callback_ definitions as they are guiding the ApplicationImplementer to create proper requests.  
§5§


### Basic Services  

The basic service section is embedding the application into the MW SDN framework and it implements a couple of services that must be supported by all applications.  

The content of the basic service section must be identical in all applications.  

It is a copy of the basic service section of the ApplicationPattern.  
Just UUIDs need to be adapted.  


### Individual OaM  

The individual OaM section is required for OaM _paths_ that are specific to the application.  

Entirely new _paths_ might be required e.g. for managing individual Profile definitions.   
All the Profiles from the ProfileList need to be covered by read and write _Paths_ for the respective attributes.  
Apart from that, it's hard to anticipate need for additional management _paths_.  

The _/core-model-1-4:control-construct:_ and the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ are listed in the individual OaM section, because they might need to be complemented by additional elements like Profile definitions.  

The format of the _paths_ for managing the applications shall be identical with a RESTCONF interface of a MW device that is exposed at the controller NBI.  

The structure of the _paths_ for managing applications shall be identical to the RESTCONF interface that is exposed at the controller NBI for managing MW devices.  



>#### parameters:
>Every _path_ description has to start with the parameters.  
>
>In the Service layer, all _paths_ must support the same set of header parameters. These parameters are defined in a separate section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ statements. The entire _parameters:_ statement needs just to be copied from any service in the ApplicationPattern.  
>
>In the OaM layer, no header parameters are required, but _paths_ might contain variable segments likea a UUID. These variable segments of the _paths_ have to be expressed as _in: path_ parameters. If it would be required to define an individual OaM _path_ and the variable segment would represent a UUID, an existing parameter definition shall be copied and the _pattern:_ and the _example:_ statements shall be updated. If a new kind of variable segment would be required, the _name:_ statement needs to be adapted to the parameter name defined inside the curly brackets in the _path_.  
>
>#### Method
>The _parameters:_ statement has always to be followed by an HTTP method.  
>
>In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  
>
>In the OaM layer, all _paths_ have to support the GET method. If the resource, which shall be addressed by the _path_, is located within a Configuration class, the PUT method has to be supported, too. Consequently, there is always a _get:_ statement following the _parameters:_ statement and in some cases a _put:_ statement beneath.  
>
>>#### operationId:
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the Service layer, the OperationId shall be the original OperationName, but expressed in lowerCamelCase (e.g. registerApplication).  
>>
>>In the OaM layer, the OperationId shall be composed from the methode (get or put), the object type (e.g. OperationServer, ActionProfile) and the attribute's name  (e.g. LifeCycleState, ConsequentOperationReference). Again lowerCamelCase style is applied (e.g. getOperationServerLifeCycleState, putActionProfileConsequentOperationReference).  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:
>>The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.    
>>
>>In the Service layer, the following tags have to be applied:  
>>  - _IndividualServices_: Automatically generated artifacts have to be completed by individual code.  
>>  - _BasicServices_: References to existing code modules have to be added.  
>>
>>Obviously, ApplicationOwners can generally be expected to enter the tag _IndividualServices_.  
>>
>>In the OaM layer, the following tags have been defined for grouping modules that are required for managing the same kind of objects:  
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
>>E.g. if a new kind of _Profile_ would be defined by the ApplicationOwner, a new tag would have to be used, too. Clearly, an additionally defined tag must be distinct from the existing ones.  
>>
>>#### security:  
>>The _security:_ statement serves to protect the path against unauthorized use.  
>>
>>The following security methods are supported:
>>
>>- **none** : _Paths_ like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests.  In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system. These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  
>>- **_apiKeyAuth: []_** : According to the MW SDN design, addressing Services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to Services is restricted on applications, respectively OperationClients, instead of humans. Services shall, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  
>>- **_basicAuth: []_** : OaM _paths_ are for humans configuring the application. Consequently, they are not part of the operation key management, but rather of an authentication procedure that relates to humans. OaM _paths_ shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the central administration of administrators during the application's runtime.  
>>
>>#### RequestBody  
>>The _requestBody:_ statement is optional. 
>>
>>In the Service layer, it has to be added whenever additional information is required for executing a Service.  
>>
>>In the OaM layer, a RequestBody is usually not required for GET requests; for PUT requests, the RequestBody is evidently unavoidable.  
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
>>>>>>It starts with the name of the attribute. Ideally, the attribute's name is clearly and concisely describing the attribute.  
>>>>>>
>>>>>>The attribute's datatype is to be stated next.  
>>>>>>
>>>>>>In case of String attributes a _pattern:_ statement together with a Regex string might follow.  
>>>>>>
>>>>>>>#### description:
>>>>>>>The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  
>>>>>>>
>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used.  
>>>>>>>
>>>>>>>Where to get or put the attribute's value in the internal datastructure is to be stated next.  
>>>>>>>There are strict definitions for the verbs that are to be used.  
>>>>>>>
>>>>>>>  - _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
>>>>>>>  - _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with the key attribute having this value. This represents the case of a _subscription_.  
>>>>>>>  - _update_: The value of the attribute shall be used for updating the referenced position in the datatree (, if the dataset that is identified by the key attribute's value could be found).  
>>>>>>>  - _update or create_: The value of the attribute shall be used for updating the referenced position in the datatree. (In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.)  
>>>>>>>
>>>>>>>The paths that are identifying the positions in the datatree are usually containing UUIDs.  
>>>>>>>These UUIDs shall be as precise as possible.  
>>>>>>>Unknown segments of the UUIDs shall be covered by '*'.
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
>>>>Description of what just happend as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>
>>>#### 200:  
>>>If the response would need to contain attributes, successful requests would be indicated by HTTP status code 200.  
>>>In these cases the structure of the ResponseBodies is as individual as of RequestBodies.  
>>>
>>>>#### description:  
>>>>Description of what just happend as the request has been successfully executed.  
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
>>>>>>>>The description of the individual attributes shall follow the same structure as in the RequestBody, but be less detailled:  
>>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.
>>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.
>>>>>>>> - The _description:_ statement shall not explain the meaning/use of the attribute.  
>>>>>>>> - _from_ shall be used for referencing the position in the datatree from where the value of the attribute shall be taken.  
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
>>>>>>_from_ shall be used for referencing the position in the datatree from where the life cycle state of the attribute shall be taken (many existing specifications might contain a wrong word).  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks
§2§All _Forwardings_ that are described in the ForwardingList must result in a _callback_ definition in the OAS.  
§2§
§2§**Where to locate the Forwardings/Callbacks?**
§2§According to the basic principles, a _callback_ definition should be located inside the definitions of the _path_ (OperationServer), which is initiating sending the _callback_ request.  
§2§This principle gets into trouble when receiving requests on multiple, different OperationServers shall result in sending the same _callback_.  
§2§Example: Receiving a request at any of the application's OperationServers shall result in sending a request to the ExecutionAndTracyLog application.  
§2§MW SDN design team decided against repeating the same _callback_ definition in multiple _paths_.  
§2§
§2§The _path_ for holding the _callback_ definition is to be selected according to the ordering of the _paths_ in the description of the _forwarding_ according to the template of the ForwardingList or the definitions in the [Structure of Forwardings](../StructureOfForwardingList/StructureOfForwardingList.md).  
§2§
§2§Consequently, the _callback_ definition, which is implementing a _forwarding_ from the ForwardingList, is usually allocated inside the definition of the _path_, which is stated to be the management request for updating the OperationClient.  
§2§If no OperationServer for updating the OperationClient would be stated in the description of the _forwarding_, the OperationServer for updating the FcPorts, or for deleting the FcPorts, or for deleting the OperationClients would have to be chosen (in this ordering) instead.  
§2§If there would be no management requests stated in the description of a _forwarding_ in the ForwardingList, the _path_ of the OperationServer that is initiating sending the _callback_ shall be chosen for allocatin the _callback_ definition.  
§2§
§2§As soon as the correct _path_ could be identified, a _callbacks:_ statement is to be added after the _responses:_ block.  
§2§
§3§#### Callback Name  
§3§The forwarding-name from within the ForwardingList has to be copied beneath the _callbacks:_ statement.  
§3§If several forwarding-names have to be added to the same _path_, the _callbacks:_ statement shall not be repeated.  
§3§
§4§#### URL  
§4§In the original OpenApi Specification, a concrete URL is following the _callback_ name.  
§4§This is not ideal, since the URL statement would outdate whenever the IP address or port of the receiver of the _callback_ would change.  
§4§Instead the configurable attributes of the internal data tree shall be referenced.  
§4§This gives concrete guidance about how to compose the URL to the ApplicationImplementer.  
§4§A couple of tricks need to be applied for avoiding YAML validation to indicate an error.  
§4§
§4§The URL statement shall start with "url: ".  
§4§A "#" shall follow for marking the rest of the line to be a comment that is excluded from syntax validation.  
§4§The URL gets composed from references into the internal data tree and concrete symbols that are common in URLs.  
§4§References are enclosed by square brackets.  
§4§The following concrete symbols are included "://" and ":".  
§4§[Reference to protocol]://[Reference to domain name and IP address]:[Reference to port][Reference to operation name]
§4§
§5§#### Method
§5§The rest of the _callback_ definition is basically a copy of the original definition of the _method_ inside the _path_ that is to be addressed.  
§5§
§5§This redundancy bears the risk of getting outdated in case of an update of the original _path_ definition.  
§5§
§5§Part of the problem:
§5§The descriptions of the attributes in the original _path_ definition contain referenced into the datatree of the application that offers the OperationServer (-> where to put the received values).  
§5§The descriptions of the attributes in the _callback_ definition contain referenced into the datatree of the application that holds the OperationClient (-> where to get the values that are to be send).  
§5§Thus, it is not possible to just copy the latest state of the original definitions of the _path_ into the _callback_ definition.  
§5§
§5§Future need for updating the _callback_ implementation should be minimized as much as possible.  
§5§E.g. _minimum:_ and _maximum:_ statements at Integer attributes or _pattern:_ amd _enum:_ statements at Strings should be avoided.  
§5§
§5§_required:_ statements and multiplicities should not be deleted from the _callback_ definitions as they are guiding the ApplicationImplementer to create proper requests.  
§5§



### Basic OaM  

The Basic OaM section is required for 


_The following text needs to be adapted._


>#### parameters:
>Every _path_ description has to start with the parameters.  
>
>In the Service layer, all _paths_ must support the same set of header parameters. These parameters are defined in a separate section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ statements. The entire _parameters:_ statement needs just to be copied from any service in the ApplicationPattern.  
>
>In the OaM layer, no header parameters are required, but _paths_ might contain variable segments likea a UUID. These variable segments of the _paths_ have to be expressed as _in: path_ parameters. If it would be required to define an individual OaM _path_ and the variable segment would represent a UUID, an existing parameter definition shall be copied and the _pattern:_ and the _example:_ statements shall be updated. If a new kind of variable segment would be required, the _name:_ statement needs to be adapted to the parameter name defined inside the curly brackets in the _path_.  
>
>#### Method
>The _parameters:_ statement has always to be followed by an HTTP method.  
>
>In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  
>
>In the OaM layer, all _paths_ have to support the GET method. If the resource, which shall be addressed by the _path_, is located within a Configuration class, the PUT method has to be supported, too. Consequently, there is always a _get:_ statement following the _parameters:_ statement and in some cases a _put:_ statement beneath.  
>
>>#### operationId:
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the Service layer, the OperationId shall be the original OperationName, but expressed in lowerCamelCase (e.g. registerApplication).  
>>
>>In the OaM layer, the OperationId shall be composed from the methode (get or put), the object type (e.g. OperationServer, ActionProfile) and the attribute's name  (e.g. LifeCycleState, ConsequentOperationReference). Again lowerCamelCase style is applied (e.g. getOperationServerLifeCycleState, putActionProfileConsequentOperationReference).  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:
>>The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.    
>>
>>In the Service layer, the following tags have to be applied:  
>>  - _IndividualServices_: Automatically generated artifacts have to be completed by individual code.  
>>  - _BasicServices_: References to existing code modules have to be added.  
>>
>>Obviously, ApplicationOwners can generally be expected to enter the tag _IndividualServices_.  
>>
>>In the OaM layer, the following tags have been defined for grouping modules that are required for managing the same kind of objects:  
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
>>E.g. if a new kind of _Profile_ would be defined by the ApplicationOwner, a new tag would have to be used, too. Clearly, an additionally defined tag must be distinct from the existing ones.  
>>
>>#### security:  
>>The _security:_ statement serves to protect the path against unauthorized use.  
>>
>>The following security methods are supported:
>>
>>- **none** : _Paths_ like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests.  In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system. These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  
>>- **_apiKeyAuth: []_** : According to the MW SDN design, addressing Services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to Services is restricted on applications, respectively OperationClients, instead of humans. Services shall, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  
>>- **_basicAuth: []_** : OaM _paths_ are for humans configuring the application. Consequently, they are not part of the operation key management, but rather of an authentication procedure that relates to humans. OaM _paths_ shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the central administration of administrators during the application's runtime.  
>>
>>#### RequestBody  
>>The _requestBody:_ statement is optional. 
>>
>>In the Service layer, it has to be added whenever additional information is required for executing a Service.  
>>
>>In the OaM layer, a RequestBody is usually not required for GET requests; for PUT requests, the RequestBody is evidently unavoidable.  
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
>>>>>>It starts with the name of the attribute. Ideally, the attribute's name is clearly and concisely describing the attribute.  
>>>>>>
>>>>>>The attribute's datatype is to be stated next.  
>>>>>>
>>>>>>In case of String attributes a _pattern:_ statement together with a Regex string might follow.  
>>>>>>
>>>>>>>#### description:
>>>>>>>The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  
>>>>>>>
>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used.  
>>>>>>>
>>>>>>>Where to get or put the attribute's value in the internal datastructure is to be stated next.  
>>>>>>>There are strict definitions for the verbs that are to be used.  
>>>>>>>
>>>>>>>  - _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
>>>>>>>  - _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with the key attribute having this value. This represents the case of a _subscription_.  
>>>>>>>  - _update_: The value of the attribute shall be used for updating the referenced position in the datatree (, if the dataset that is identified by the key attribute's value could be found).  
>>>>>>>  - _update or create_: The value of the attribute shall be used for updating the referenced position in the datatree. (In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.)  
>>>>>>>
>>>>>>>The paths that are identifying the positions in the datatree are usually containing UUIDs.  
>>>>>>>These UUIDs shall be as precise as possible.  
>>>>>>>Unknown segments of the UUIDs shall be covered by '*'.
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
>>>>Description of what just happend as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>
>>>#### 200:  
>>>If the response would need to contain attributes, successful requests would be indicated by HTTP status code 200.  
>>>In these cases the structure of the ResponseBodies is as individual as of RequestBodies.  
>>>
>>>>#### description:  
>>>>Description of what just happend as the request has been successfully executed.  
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
>>>>>>>>The description of the individual attributes shall follow the same structure as in the RequestBody, but be less detailled:  
>>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.
>>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.
>>>>>>>> - The _description:_ statement shall not explain the meaning/use of the attribute.  
>>>>>>>> - _from_ shall be used for referencing the position in the datatree from where the value of the attribute shall be taken.  
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
>>>>>>_from_ shall be used for referencing the position in the datatree from where the life cycle state of the attribute shall be taken (many existing specifications might contain a wrong word).  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks
§2§All _Forwardings_ that are described in the ForwardingList must result in a _callback_ definition in the OAS.  
§2§
§2§**Where to locate the Forwardings/Callbacks?**
§2§According to the basic principles, a _callback_ definition should be located inside the definitions of the _path_ (OperationServer), which is initiating sending the _callback_ request.  
§2§This principle gets into trouble when receiving requests on multiple, different OperationServers shall result in sending the same _callback_.  
§2§Example: Receiving a request at any of the application's OperationServers shall result in sending a request to the ExecutionAndTracyLog application.  
§2§MW SDN design team decided against repeating the same _callback_ definition in multiple _paths_.  
§2§
§2§The _path_ for holding the _callback_ definition is to be selected according to the ordering of the _paths_ in the description of the _forwarding_ according to the template of the ForwardingList or the definitions in the [Structure of Forwardings](../StructureOfForwardingList/StructureOfForwardingList.md).  
§2§
§2§Consequently, the _callback_ definition, which is implementing a _forwarding_ from the ForwardingList, is usually allocated inside the definition of the _path_, which is stated to be the management request for updating the OperationClient.  
§2§If no OperationServer for updating the OperationClient would be stated in the description of the _forwarding_, the OperationServer for updating the FcPorts, or for deleting the FcPorts, or for deleting the OperationClients would have to be chosen (in this ordering) instead.  
§2§If there would be no management requests stated in the description of a _forwarding_ in the ForwardingList, the _path_ of the OperationServer that is initiating sending the _callback_ shall be chosen for allocatin the _callback_ definition.  
§2§
§2§As soon as the correct _path_ could be identified, a _callbacks:_ statement is to be added after the _responses:_ block.  
§2§
§3§#### Callback Name  
§3§The forwarding-name from within the ForwardingList has to be copied beneath the _callbacks:_ statement.  
§3§If several forwarding-names have to be added to the same _path_, the _callbacks:_ statement shall not be repeated.  
§3§
§4§#### URL  
§4§In the original OpenApi Specification, a concrete URL is following the _callback_ name.  
§4§This is not ideal, since the URL statement would outdate whenever the IP address or port of the receiver of the _callback_ would change.  
§4§Instead the configurable attributes of the internal data tree shall be referenced.  
§4§This gives concrete guidance about how to compose the URL to the ApplicationImplementer.  
§4§A couple of tricks need to be applied for avoiding YAML validation to indicate an error.  
§4§
§4§The URL statement shall start with "url: ".  
§4§A "#" shall follow for marking the rest of the line to be a comment that is excluded from syntax validation.  
§4§The URL gets composed from references into the internal data tree and concrete symbols that are common in URLs.  
§4§References are enclosed by square brackets.  
§4§The following concrete symbols are included "://" and ":".  
§4§[Reference to protocol]://[Reference to domain name and IP address]:[Reference to port][Reference to operation name]
§4§
§5§#### Method
§5§The rest of the _callback_ definition is basically a copy of the original definition of the _method_ inside the _path_ that is to be addressed.  
§5§
§5§This redundancy bears the risk of getting outdated in case of an update of the original _path_ definition.  
§5§
§5§Part of the problem:
§5§The descriptions of the attributes in the original _path_ definition contain referenced into the datatree of the application that offers the OperationServer (-> where to put the received values).  
§5§The descriptions of the attributes in the _callback_ definition contain referenced into the datatree of the application that holds the OperationClient (-> where to get the values that are to be send).  
§5§Thus, it is not possible to just copy the latest state of the original definitions of the _path_ into the _callback_ definition.  
§5§
§5§Future need for updating the _callback_ implementation should be minimized as much as possible.  
§5§E.g. _minimum:_ and _maximum:_ statements at Integer attributes or _pattern:_ amd _enum:_ statements at Strings should be avoided.  
§5§
§5§_required:_ statements and multiplicities should not be deleted from the _callback_ definitions as they are guiding the ApplicationImplementer to create proper requests.  
§5§

