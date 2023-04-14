# Structure of the OAS  

The OAS of the MW SDN domain shall be written in YAML.  
Single quotes are used to indicate values of string attributes (e.g. examples, patterns and enumerations), summaries, descriptions and references, but not for IDs or tags.  

## Metadata  

#### openapi:  
The version of the OpenAPI Specification shall be '3.0.0'.  

#### info:  
The info section shall contain the _title_ and the _version_ statements.  

#### title:  
The official name of the application shall be stated in the _title_ statement.  

#### version:  
The number of the release that gets specified in this OAS shall be stated in the _version_ statement.  


## Service Paths  

The _paths_ provided on the API are structured into four categories:  
- [Individual Services](#individual-services)  
- [Basic Services](#basic-services)  
- [Individual OaM](#individual-oam)  
- [Basic OaM](#basic-oam)  

95% of specification work will be done in the Individual Service section. Whatever specified here will define the purpose of the application. 

The Basic Service section contains the services that are required for integrating the application into the MW SDN application layer. It will be filled by copying the content of the ApplicationPattern and making some adaptions on the UUIDs.  

### Individual Services  

The services in the Individual Services section are representing the offering to potential users. The offered services should be oriented to the needs of the users and integrate into a clearly structured application layer.  
Maximizing the value of the individual services and maximizing their re-usability (decoupling) need to be balanced while having the overall purpose of the application in mind.  

Hypothetical example:  
Data is to be obtained from the network and made available.  
If the application fetches "all" data and offers the same as is, the value of the application is limited to buffering.  
If the application fetches "all" data and filters and aggregates it until exactly the currently requested KPI can be provided, the future reuse of the application is limited to the reuse of the KPI.  

Both make sense, but a mixture doesn't contribute to a transparent structure.  
Therefore, it is important to have a clear picture of the role and purpose of the application while defining the individual services.  

Probably not necessary to mention that concise OperationNames also contribute greatly to transparency.  

>#### parameters:  
>Every _path_ description has to start with the _parameters_ block.  
>
>In the Service layer, all _paths_ must support the same set of header parameters. These parameters are defined in the Common Components section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ blocks.  
>
>#### Method  
>The _parameters:_ statement has always to be followed by an HTTP method.  
>
>In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  
>
>>#### operationId:  
>>The OperationId is required to distinguish the code modules after automated code generation. So, it is mostly for supporting the ApplicationImplementers.  
>>The OperationId must be unique.  
>>
>>In the Service layer, the OperationId shall be the original OperationName, but expressed in lowerCamelCase (e.g. registerApplication).  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call.  
>>Ideally, words that are different from the service name get used.  
>>
>>It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:  
>>The _tags:_ statement is for grouping code modules.  
>>It supports the ApplicationImplementers in targeted handling of the automatically generated program structure and code modules.  
>>In the individual service section, _IndividualServices_ has to be chosen for tag.  
>>It tells the ApplicationImplementer to complement the automatically generated code modules with individual programming.  
>>
>>#### security:  
>>The _security:_ statement serves to protect the OperationServer against unauthorized use.  
>>
>>The following security methods come into question in the individual service section:
>>- **_apiKeyAuth: []_** : According to the MW SDN design, addressing services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to services is restricted on applications, respectively OperationClients, instead of humans. Services shall, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  
>>- **none** : _Paths_ like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests. In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system. These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  
>>
>>#### RequestBody  
>>The _requestBody:_ statement is optional.  
>>In the service layer, it has to be added whenever additional information is required for executing an OperationServer.  
>>
>>>#### required:  
>>>If a _required:_ statement is added at this position, it relates to the RequestBody as a whole.  
>>>Just in extremely rare cases, a RequestBody is either required as a whole or not at all.  
>>>In general, if there is a _requestBody:_ statement, there shall be also a _required: true_ statement.  
>>>
>>>#### content:  
>>>The description of the content of the RequestBody starts.  
>>>If there is a _requestBody:_ statement, there shall also be a _content:_ statement.  
>>>
>>>>#### Media Type  
>>>>The content of the RequestBody could be expressed in multiple alternative syntax (e.g. JSON, HMTL, PDF).  
>>>>In case of the MW SDN, the content of the RequestBody shall always be expressed in JSON.  
>>>>So, just one media type shall be described in the content.  
>>>>The mandatory _requestBody:_ statement shall always be followed by an _application/json:_ statement.  
>>>>
>>>>>#### schema:  
>>>>>The _application/json:_ statement shall always be followed by a _schema:_ statement.  
>>>>>The _schema:_ statement starts the description of the structure of the JSON object that is forming the RequestBody.  
>>>>>
>>>>>>#### Datatype of the RequestBody   
>>>>>>As a first statement inside the schema definition, the datatype of the RequestBody has to be defined.  
>>>>>>The schema of RequestBodies shall always be wrapped into an object.  
>>>>>>That means that the JSON will start and end with a curly bracket and the attributes will be represented with their names and values inside.  
>>>>>>So, the _schema:_ statements in the RequestBodies shall always be followed by a _type: object_ statement.  
>>>>>>
>>>>>>OpenAPI Specification allows defining objects in the Common Components section and to just put references to these definitions into the _schema:_ blocks of the individual RequestBodies.  
>>>>>>This practice should be limited to comprehensive objects that get referenced for at least two or three times.  
>>>>>>
>>>>>>An object description must define the included attributes and specify whether and which combinations of these attributes must be present in a valid Body.  
>>>>>>This can be expressed through different combinations of statements.  
>>>>>>
>>>>>>The description of an object starts with the statements about the necessity of the included attributes.  
>>>>>>Next, the attributes have to be described in detail.  
>>>>>>Finally, a concrete example has to follow.  
>>>>>>
>>>>>>#### required: and Multiplicities  
>>>>>>In most cases the description of an object starts with a _required:_ statement and a list of names of attributes that must be present in a valid service or OaM request. Listing the names of required attributes is a clean and clear way of assuring that the defined attributes are actually provided in a RequestBody.  
>>>>>>
>>>>>>In case just subsets of attributes need to be included, _minProperties:_ and _maxProperties:_ statements might support formulating boundaries. An _additionalProperties: false_ statement might support enforcing the quantity rules. In practice, these restrictions are usually imprecise and therefore not ideal. Formulating alternative object structures and combining them by e.g. an _oneOf:_ statement should be considered.  
>>>>>>
>>>>>>#### properties:  
>>>>>>The individual attributes get described in detail in this section.  
>>>>>>
>>>>>>Services shall be designed in such a way that a target state gets prescribed, but not a specific kind of change ([concept of idempotent](https://www.vocabulary.com/dictionary/idempotent)).  
>>>>>>
>>>>>>Hypothetical example:  
>>>>>>_/v1/assure-the-process-not-to-run_ shall not indicate an error, if the process wasn't running before the service had been called.  
>>>>>>If the process doesn't run after the service had been called, the service was successfully executed.  
>>>>>>
>>>>>>Naming, style and description of the attributes shall support the concept of idempotent services.  
>>>>>>
>>>>>>>#### Attribute's Name  
>>>>>>>It starts with the name of the attribute.  
>>>>>>>Potential users of the application need to understand the purpose of the OperationServer from reading the attributes' names in the API description.  
>>>>>>>
>>>>>>>>#### type:  
>>>>>>>>The attribute's datatype is to be stated next.  
>>>>>>>>There are virtually no restrictions regarding the structure of the RequestBody.  
>>>>>>>>Most attributes will be of a primitive data type.  
>>>>>>>>But nested composite objects that are to be considered valid in different variants are also possible.  
>>>>>>>>
>>>>>>>>In case of string attributes a _pattern:_ statement together with a Regex string might follow, or valid values get predefined in an _enum:_ statement.  
>>>>>>>>Values of integer attributes could be restricted by e.g. _minimum:_ and _maximum:_ statements.  
>>>>>>>>
>>>>>>>>It is recommended to describe the input data on the ingress as precise as possible, because this ultimately determines the quality of the application's data content during runtime.  
>>>>>>>>
>>>>>>>>#### description:
>>>>>>>>The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  
>>>>>>>>
>>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used.  
>>>>>>>>
>>>>>>>>Where to get or put the attribute's value in the internal data structure is to be stated next.  
>>>>>>>>There are strict definitions for the verbs that are to be used.  
>>>>>>>>
>>>>>>>>- _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
>>>>>>>>- _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with the key attribute having this value. This represents the case of a _subscription_.  
>>>>>>>>- _update_: The value of the attribute shall be used for updating the referenced position in the data tree, if the dataset that is identified by the key attribute's value could be found.  
>>>>>>>>- _update or create_: The value of the attribute shall be used for updating the referenced position in the data tree. In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.  
>>>>>>>>
>>>>>>>>The paths that are identifying the positions in the data tree are usually containing UUIDs.  
>>>>>>>>These UUIDs shall be as precise as possible.  
>>>>>>>>Unknown segments of the UUIDs shall be covered by '*'.  
>>>>>>
>>>>>>#### example:  
>>>>>>The _example:_ statement has to be arranged with the same number of indents as the _type: object_ statement.  
>>>>>>The example has to comply with the specifications of the object.  
>>>>>>This includes not just the attributes' names and datatypes, but also the rulings of availability and multiplicity.  
>>>>>>(In existing specifications, _example:_ statements might be located deeper in the schema description, maybe even beneath the attribute. This is outdated style and should not be copied.)  
>>>>>>
>>>>>>In most cases the list of attributes can be copied from the _required:_ statement, hyphens have to be removed and proper values have to be added.  
>>>>>>
>>#### responses:  
>>The _responses:_ statement is mandatory.  
>>Even in case no attributes have to be returned in a response, the HTTP status codes have to be defined.  
>>
>>The following HTTP status codes have always to be supported for indicating errors:  
>>- 400  
>>- 401  
>>- 403  
>>- 404  
>>- 500  
>>- default  
>>
>>Standard schemas have already been defined for these codes in the Common Components section.  
>>These schemas need just to be referenced.  
>>A code block that is describing these HTTP status codes and references is identical for all service _paths_.  
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
>>>In these cases, the ResponseBodies are as individual as RequestBodies.  
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
>>>>>>As the format of the data has already been harmonized on the ingress, the schema definition of the ResponseBody does not need to be specific in regards of structure of the objects or format of the attributes.  
>>>>>>
>>>>>>>#### Datatype of the ResponseBody  
>>>>>>>The attributes of the ResponseBody shall always be wrapped into at least an object, so they get represented with their names and values.  
>>>>>>>In difference to the RequestBody, the ResponseBody might contain a list of objects.  
>>>>>>>In such case, it is necessary to wrap the entire object into an array.  
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
>>>>>>>So, the _uniqueItems:_ statement must be followed by an _item:_ statement.  
>>>>>>>
>>>>>>>>#### type: object  
>>>>>>>>The _type: object_ statement must either follow the _schema:_ statement or the _items:_ statement.  
>>>>>>>>In the case of a simple object, the number of indentations is one times two less than in the case of a list of objects.  
>>>>>>>>
>>>>>>>>#### required: and Multiplicities  
>>>>>>>>It is assumed that the data in the application matches the desired formats, after being filtered accordingly on the ingress already.  
>>>>>>>>Unlike existing specifications, _required:_, _minProperties:_, _maxProperties:_ or _additionalProperties: false_ statements shall not be added to the schema of the ResponseBody.  
>>>>>>>>
>>>>>>>>#### properties:  
>>>>>>>>The _properties:_ statement is following the _type: object_ statement.  
>>>>>>>>The description of the individual attributes shall follow the same structure as in the RequestBody, but be less detailed.  
>>>>>>>>There shall be no patterns or enumerations filtering the string attributes on the egress.  
>>>>>>>>There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.  
>>>>>>>>
>>>>>>>>Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name are used. 
>>>>>>>>_from_ shall be used for referencing the position in the data tree from where the value of the attribute shall be taken.  
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
>>>>The header definition of an HTTP status code 200 are identical for all _paths_ except the description of a single attribute.  
>>>>
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>_from_ shall be used for referencing the position in the data tree from where the life cycle state of the attribute shall be taken (some existing specifications might contain a wrong word).  
>>>>>>The UUID has to point to the correct position in the data tree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks  
>>All _Forwardings_ that are described in the ForwardingList must result in a _callback_ definition in the OAS.  
>>
>>**Where to locate the Forwardings/Callbacks?**  
>>According to the basic principles, a _callback_ definition should be located inside the definitions of the _path_ (OperationServer), which is initiating sending the _callback_ request.  
>>This principle gets into trouble when receiving requests on multiple, different OperationServers shall result in sending the same _callback_.  
>>
>>Example:  
>>Receiving a request at any of the application's OperationServers shall result in sending a request to the ExecutionAndTraceLog application.  
>>
>>MW SDN design team decided against repeating the same _callback_ definition in multiple _paths_.  
>>Instead, the _path_ for holding the _callback_ definition is to be selected according to the ordering of the _paths_ in the description of the _forwarding_ in the ForwardingList (which is assuming that the ForwardingList has been created 
 according to the definitions in the [Structure of Forwardings](../StructureOfForwardingList/StructureOfForwardingList.md)).  
>>
>>>#### Callback Name  
>>>The name of the _callback_ shall be equivalent to the forwarding-name from within the ForwardingList.  
>>>
>>>>#### URL  
>>>>In the original OpenApi Specification, a concrete URL is following the _callback_ name.  
>>>>This is not ideal, since the URL statement would outdate whenever the IP address or port of the receiver of the _callback_ would change. In cases the same _callback_ has to reach several applications, this rule anyway doesn't make sense.  
>>>>
>>>>Instead the configurable attributes of the internal data tree shall be referenced.  
>>>>This gives concrete guidance about how to compose the URL to the ApplicationImplementer.  
>>>>A couple of tricks need to be applied for avoiding YAML validation to indicate an error.  
>>>>
>>>>The URL statement starts with "url: ".  
>>>>A "#" follows for marking the rest of the line to be a comment that is excluded from syntax validation.  
>>>>The URL gets composed from references into the internal data tree and concrete symbols that are common in URLs.  
>>>>References are enclosed by square brackets.  
>>>>The following concrete symbols are included "://" and ":".  
>>>>[Reference to protocol]://[Reference to domain name and IP address]:[Reference to port][Reference to operation name]
>>>>
>>>>>#### Method  
>>>>>The rest of the _callback_ definition is basically a copy of the original definition of the _method_ inside the _path_ that is to be addressed.  
>>>>>
>>>>>This redundancy bears the risk of getting outdated in case of updates of the original _path_ definition.  
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

The basic service section is embedding the application into the MW SDN framework and it implements a couple of services that must be supported by all applications (e.g. documentation).  

The content of the basic service section must be identical in all applications.  

It is a copy of the basic service section of the ApplicationPattern.  
Just UUIDs need to be adapted.  


## OaM Paths  

The structure of the _paths_ for managing applications shall be identical to the RESTCONF interface that is exposed at the controller NBI for managing microwave devices. [Structure of OAM Paths](../../ElementsApplicationPattern/Names/StructureOfOamPaths/StructureOfOamPaths.md) is providing concrete guidance for formulating the _paths_.  

_Paths_ that are required for management that is individual to this application shall be located in the Individual OaM section. Two _paths_ are pre-defined but might require individualization of their ResponseBodies.  

The Basic OaM section comprises OaM _paths_ that are inherited from the ApplicationPattern. These _paths_ are identical in all applications of the MW SDN application layer.  

### Individual OaM  

The individual OaM section hosts the OaM _paths_ that are specific to the application.  

The _/core-model-1-4:control-construct:_ and the _/core-model-1-4:control-construct/profile-collection/profile={uuid}:_ are listed in the individual OaM section, because they might need to be complemented by additional elements like Profile definitions.  

Entirely new _paths_ might be required e.g. for managing individual Profile definitions.  
All the Profiles from the ProfileList need to be covered by read and write _paths_ for the respective attributes.  

>#### parameters:  
>Unlike the services, there is no pre-defined set of parameters that are to be supported by all OaM _paths_, but the individual OaM _paths_ might contain variable segments like e.g. a UUID or a local ID.  
>
>>#### in: path  
>>For every variable segment of the _path_ that got enclosed in curly brackets an _- in: path_ statement has to be added beneath the _parameters:_ statement.  
>>
>>#### name:  
>>The _name:_ statement needs to be adapted to the parameter name enclosed inside the curly brackets in the _path_.  
>>
>>#### required: true  
>>In-path parameters are usually needed to identify the correct resource and cannot be neglected.  
>>If the variable segment cannot be neglected, _required: true_ must be added.  
>>
>>#### schema:  
>>The _schema:_ statement is always required when describing an in-path parameter.  
>>
>>>#### type:  
>>>It is to be expected that in-path parameters are of a primitive datatype (not an object).  
>>>Most often, it will be a string. Integer is also possible.  
>>>
>>>Usually, values of in-path parameters are following a concrete structure that is kept during creating the key attribute's value while instantiating the respective object in the data tree or they are chosen from a set of predefined values.  
>>>The format of the variable segments of the _path_ should be described in detail for successful appliance of the API.  
>>>
>>>#### pattern:  
>>>If the in-path parameter is a string that is following a structure, the expected format should be expressed as a RegEx in a _pattern:_ statement.  
>>>
>>>#### enum:  
>>>If the in-path parameter is a string that can only take certain values, it is recommended to add an _enum:_ statement and to list all supported values.  
>>>
>>>#### example:  
>>>A coherent example value that complies with the pattern or enumeration definition shall be added.  
>>>
>#### get:  
>The _parameters:_ block has always to be followed by a GET method in the OaM layer.  
>
>>#### operationId:  
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the OaM layer, the OperationId shall be composed from the method (GET or PUT), the object type (e.g. OperationServer, ActionProfile) and the attribute's name (e.g. LifeCycleState, ConsequentOperationReference).  
>>lowerCamelCase style is applied, like e.g. getOperationServerLifeCycleState.  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>The phrasing in the _summary:_ statement shall be meaningful and concise as it will be displayed prominently in the Swagger API documentation during later operation of the application.  
>>
>>#### tags:  
>>The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.  
>>
>>In the OaM layer, the following tags have been defined for grouping _paths_ that are required for managing the same kind of objects:  
>>- _Core_  
>>- _ActionProfile_  
>>- _GenericResponseProfile_  
>>- _FileProfile_  
>>- _IntegerProfile_  
>>- _StringProfile_  
>>- _OperationServer_  
>>- _HttpServer_  
>>- _TcpServer_  
>>- _OperationClient_  
>>- _HttpClient_  
>>- _TcpClient_  
>>- _ElasticsearchClient_  
>>
>>If a new kind of _Profile_ would be defined by the ApplicationOwner, a new tag would have to be used, too.  
>>Obviously, an additionally defined tag must be distinct from the existing ones.  
>>
>>#### security:  
>>All _paths_ on the OaM layer have to be protected by a _security:_ statement against unauthorized use.  
>>
>>>#### basicAuth:  
>>>OaM _paths_ are for humans configuring the application.  
>>>They shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the centralized administration of administrators during the application's runtime.  
>>>
>>#### RequestBody  
>>A RequestBody is not required in the GET requests of the OaM layer.  
>>Consequently, there is no _requestBody:_ statement.  
>>
>>#### responses:  
>>The _responses:_ statement is mandatory.  
>>
>>>#### 200:  
>>>The GET requests of the OaM layer are for retrieving data.  
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
>>>>>>
>>>>>>>#### _type: object_  
>>>>>>>Even if most the _paths_ on the OaM layer are addressing just a single attribute, the ResponseBody shall always be wrapped into an object.  
>>>>>>>Thus a _type: object_ statement has to follow the _schema:_ statement.  
>>>>>>>
>>>>>>>#### required:  
>>>>>>>_required:_ statement and multiplicities shall not be used to filter internal data on the egress.  
>>>>>>>Unlike existing specifications, _required:_ statements shall not be added to the schema of the response body.  
>>>>>>>
>>>>>>>#### properties:  
>>>>>>>The _properties:_ statement is following the _type: object_ statement.  
>>>>>>>The description of the individual attributes shall follow the same structure as in a RequestBody, but be less detailed:  
>>>>>>>- There shall be no patterns or enumerations filtering the string attributes on the egress.  
>>>>>>>- There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.  
>>>>>>>- A _description:_ statement shall not be added.  
>>>>>>>
>>>>>>>>#### Attribute's Name  
>>>>>>>>The OaM interface shall look and feel like a RESTCONF interface.  
>>>>>>>>If some resource would be addressed at a RESTCONF interface, the answered attribute would be lead by the name of its namespace.  
>>>>>>>>On the OaM layer, this namespace is identical with the module's name that already got defined in the _tags:_ statement above.  
>>>>>>>>So, the attribute's name is concatenated from the value of the _tags:_ statement, but written in HTTP style with hyphens instead of capital letters, a release number of the module definition, a colon and the actual attribute's name from the data tree.  
>>>>>>>>
>>>>>>>#### example:  
>>>>>>>The _example:_ statement shall be arranged one level beneath the _schema:_ statement.  
>>>>>>>(Existing specifications might be outdated in this regard.)  
>>>>>>>
>>>>>>>The attribute needs to be stated including its name and value.  
>>>>>>>Reasonable values should be chosen to support validation of the testcases.  
>>>>>>>
>>>#### Error Codes  
>>>The following HTTP status codes have always to be supported for indicating errors:  
>>>- 400  
>>>- 401  
>>>- 403  
>>>- 404  
>>>- 500  
>>>- default  
>>>
>>>Standard objects have already been defined for these codes in the Common Components section.  
>>>These objects need just to be referenced.  
>>>The code block that is describing these HTTP status codes and references is identical for all OaM _paths_.  
>>>
>#### put:  
>If the resource that is addressed by the _path_ is located within a Configuration class, the PUT method has to be supported, too.  
>In such cases, a _put:_ block needs to follow the _get:_ block.  
>
>>#### operationId:  
>>The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  
>>
>>In the OaM layer, the OperationId shall be composed from the method (GET or PUT), the object type (e.g. OperationServer, ActionProfile) and the attribute's name (e.g. LifeCycleState, ConsequentOperationReference).  
>>lowerCamelCase style is applied, like e.g. putActionProfileConsequentOperationReference.  
>>
>>#### summary:  
>>The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  
>>
>>The phrasing in the _summary:_ statement shall be meaningful and concise as it will be displayed prominently in the Swagger API documentation during later operation of the application.  
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
>>>>>>>If some resource would be addressed at a RESTCONF interface, the namespace of the attribute would be stated, too.  
>>>>>>>On the OaM layer, this namespace is identical with the module's name that already got defined in the _tags:_ statement above.  
>>>>>>>So, the top level attribute's name is concatenated from  
>>>>>>>- the value of the _tags:_ statement, but written in HTTP style with hyphens instead of capital letters,  
>>>>>>>- a release number of the module definition,  
>>>>>>>- a colon and  
>>>>>>>- the actual attribute's name from the data tree.  
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
>>>>>>If so, the example has to comply with the defined structure of the object.  
>>>>>>This includes not just the attributes' names, datatypes, patterns and so on, but also the rulings in regards of availability and multiplicity of the attributes.  
>>>>>>
>>>>>>Reasonable values should be chosen to support validation of the testcases.  
>>>>>>
>>#### responses:
>>The _responses:_ statement is mandatory.  
>>Even in case no attributes have to be returned in a ResponseBody, the HTTP status codes have to be defined.  
>>
>>>#### 204:  
>>>The response of OaM PUT requests is assumed not to contain any attributes.  
>>>Consequently, successful requests are indicated by HTTP status code 204.  
>>>
>>>>#### description:  
>>>>The description is assumed to be the only attribute of the HTTP status code 204 that requires individualization in case of the PUT method.  
>>>>It shall describe what just happened as the request has been successfully executed.  
>>>>
>>>>#### headers:  
>>>>Headers are not used in the OaM section.  
>>>>
>>>#### Error Codes  
>>>The following HTTP status codes have always to be supported for indicating errors:  
>>>- 400  
>>>- 401  
>>>- 403  
>>>- 404  
>>>- 500  
>>>- default  
>>>
>>>Standard objects have already been defined for these codes in the Common Components section.  
>>>These objects need just to be referenced.  
>>>The code block that is describing these HTTP status codes and references is identical for all OaM _paths_.  

### Basic OaM  

The Basic OaM section contains the OaM _paths_ that are identical to all applications belonging to the MW SDN application layer.  
If some objects, such as the FileProfile or the ElasticSearchClient would not be needed, the corresponding _paths_ should not occur here.  


## Common Components  

The _components_ block contains definitions that get referenced from within the other sections of the OAS.  
They are identical to all applications belonging to the MW SDN application layer.  

If the definitions in the service or OaM sections would contain exact repetitions of object definition, these objects could be added to the _schema:_ section of the _components:_ block and replaced by references at their original locations.  
