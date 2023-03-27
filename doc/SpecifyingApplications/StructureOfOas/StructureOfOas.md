# Structure of the OAS  

The OAS of the MW SDN domain shall be written in YAML.  


### Metadata  

#### openapi:  
The version of the OpenAPI Specification shall be '3.0.0'.  

#### info:  
The info section shall contain the _title_ and the _version_ statements.  

#### title:  
The official name of the application shall be stated in the _title_ statement.  

#### version:  
The number of the release that gets specified in this OAS shall be stated in the _version_ statement.  


### Paths  

The paths provided on the API are structured into four categories:  
  - Individual Services  
  - Basic Services  
  - Individual OaM  
  - Basic OaM  

95% of specification work will be done in the Individual Service section. Whatever specified here will provide the individual value of the application. The OperationNames of the OperationServers defined in the ServiceList's individual service section shall be listed beneath the _/v1/bequeath-your-data-and-die:_ . The ordering should be kept in synch.  

The Basic Service section contains the services that are required for integrating the application into the MW SDN application layer. It will be filled by copying the content of the ApplicationPattern and making some adaptions on the UUIDs.  

Paths that are required for management activities that are individual to this application shall be located in the Individual OaM section. Two paths are pre-defined, but require adaptation in most cases.  

The Basic OaM section comprises standard OaM paths that can be put together from the paths that are already comprised in the ApplicationPattern.  

>#### parameters:
>Every path description has to start with the parameters.  
>
>In the Service layer, all paths must support the same set of header parameters. These parameters are defined in a separate section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ statements. The entire _parameters:_ statement needs just to be copied from any service in the ApplicationPattern.  
>
>In the OaM layer, no header parameters are required, but paths might contain variable segments likea a UUID. These variable segments of the paths have to be expressed as _in: path_ parameters. If it would be required to define an individual OaM path and the variable segment would represent a UUID, an existing parameter definition shall be copied and the _pattern:_ and the _example:_ statements shall be updated. If a new kind of variable segment would be required, the _name:_ statement needs to be adapted to the parameter name defined inside the curly brackets in the path.  
>
>#### Method
>The _parameters:_ statement has always to be followed by an HTTP method.  
>
>In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  
>
>In the OaM layer, all paths have to support the GET method. If the resource, which shall be addressed by the path, is located within a Configuration class, the PUT method has to be supported, too. Consequently, there is always a _get:_ statement following the _parameters:_ statement and in some cases a _put:_ statement beneath.  
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
>>- **none** : Paths like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests.  In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system. These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  
>>- **_apiKeyAuth: []_** : According to the MW SDN design, addressing Services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to Services is restricted on applications, respectively OperationClients, instead of humans. Services shall, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  
>>- **_basicAuth: []_** : OaM paths are for humans configuring the application. Consequently, they are not part of the operation key management, but rather of an authentication procedure that relates to humans. OaM paths shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the central administration of administrators during the application's runtime.  
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
>>A code block that is describing these codes and references can be copied from any existing path in the ApplicationPattern.  
>>
>>>#### 204:  
>>>If the response would not contain any ResponseBody, successful requests would be indicated by HTTP status code 204.  
>>>It is recommended to copy an existing code block that is describing an HTTP status code 204 from another path and to replace the values of the following attributes.  
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
>>>> description:  
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
>>>>>>The schema definition in the RequestBody is for informing consumers of the application about how to formulate proper requests, respectively about how to provide data for storing it in a harmonized way.  
>>>>>>The schema definition in the ResponseBody is for informing the implementer of the application about which data to be provided on the egress.  
>>>>>>As the format of the data has already been harmonized on the ingress, the schema definition of the ResponseBody does not need to be equally detailed.  
>>>>>>
>>>>>>>#### Datatype of the ResponseBody  
>>>>>>>The attributes of the ResponseBody shall always be wrapped into an object, so they get represented with their names and values.  
>>>>>>>Unlike the RequestBody, the ResponseBody might contain entire lists of values.  
>>>>>>>In such cases it is necessary to wrap the entire object into an array.  
>>>>>>>
>>>>>>>As a first statement inside the schema definition, the datatype of the ResponseBody has to be defined.  
>>>>>>>Obviously, the _type: object_ statement is to be used when one or more attributes are to be returned at most once and the _type: array_ statement is to be used when the same set of attributes has to be returned multiple times as a list.  
>>>>>>>
>>>>>>>#### uniqueItems:  
>>>>>>>If a _type: array_ statement has been applied, it has to be defined whether the same set of values could occur multiple times.  
>>>>>>>If this would be true, a _uniqueItems: false_ statement should follow.  
>>>>>>>If not, a _uniqueItems: true_ statement must follow.  
>>>>>>>
>>>>>>>#### items:  
>>>>>>>If the _type: array_ statement has been applied, the item to be displayed repeatedly must be described next.  
>>>>>>>So, the _type: array_ statement, respectively the _uniqueItems:_ statement must be followed by an _item:_ statement.  
>>>>>>>
>>>>>>>>#### type: object
>>>>>>>>The _type: object_ statement must either follow the _schema:_ statement or the _items:_ statement.  
>>>>>>>>In the case of a simple object, the number of indentations is one less than in the case of a list of objects.  
>>>>>>>>
>>>>>>>>#### required: and Multiplicities
>>>>>>>>It has to be understood that _required:_ statement and multiplicities shall not be used to describe validation criteria for datasets to be represented on the egress.  
>>>>>>>>Data within the application shall already comply with the wished formats as corresponding criteria have been applied on the ingress (RequestBody) already.  
>>>>>>>>Unlike existing specifications, it is not recommended to add _required:_ statements to the schema of the response body.  
>>>>>>>>Multiplicities have already been avoided before, because there is always a risk that they will be forgotten when the specifications are updated on the ingress and end up contradicting the structure of the internal information.  
>>>>>>>>
>>>>>>>>#### properties:
>>>>>>>>It is necessary to describe the individual attributes in detail in this section.  
>>>>>>>>
>>>>>>>>The way of describing the attributes is almost identical with the RequestBody, but much less comprehensive.  
>>>>>>>>
>>>>>>>>The following exceptions have to be regarded:
>>>>>>>> - There shall be no patterns or enumerations filtering the string attributes on the egress.
>>>>>>>> - There shall be no minimum, maximum etc. limitations to the integer attributes on the egress.
>>>>>>>> - The _description:_ statement shall not explain the meaning/use of the attribute.  
>>>>>>>> - _from_ shall be used for referencing the position in the datatree from where the value of the attribute shall be taken.  
>>>>>>>>
>>>>>>>#### example:
>>>>>>>The _example:_ statement shall be arranged one level beneath the _schema:_ statement.
>>>>>>>If the datatype would be a bare object, a single set of attributes shall be provided.  
>>>>>>>The composition of the attributes shall represent a realistic case.  
>>>>>>>If the datatype would be an array, two sets of attributes shall be provided.  
>>>>>>>A leading hyphen shall be used to separate the two independent sets. 
>>>>>>>Both compositions of attributes shall represent realistic cases.  
>>>>>>>Ideally, the two sets of attributes depict cases that are as different as possible.  
>>>>>>>
>>>>#### headers:  
>>>>It is recommended to copy an existing code block that is describing the headers of an HTTP status code 200 from another path and to replace the values of the following attributes.  
>>>>
>>>>>#### life-cycle-state:  
>>>>>>#### description:  
>>>>>>The UUID has to point to the correct position in the datatree for retrieving the life cycle state of the OperationServer.  
>>>>>>
>>#### Callbacks
>>
§2§
§2§
§2§




Hier geht's weiter.