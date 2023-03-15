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

#### parameters:
Every path description has to start with the parameters.  

In the Service layer, all paths must support the same set of header parameters. These parameters are defined in a separate section at the end of the OAS, but these definitions need to be referenced from within the individual _parameters:_ statements. The entire _parameters:_ statement needs just to be copied from any service in the ApplicationPattern.  

In the OaM layer, no header parameters are required, but paths might contain variable segments likea a UUID. These variable segments of the paths have to be expressed as _in: path_ parameters. If it would be required to define an individual OaM path and the variable segment would represent a UUID, an existing parameter definition should be copied and the _pattern:_ and the _example:_ statements should be updated. If a new kind of variable segment would be required, the _name:_ statement needs to be adapted to the parameter name defined inside the curly brackets in the path.  

#### Method
The _parameters:_ statement has always to be followed by an HTTP method.  

In the Service layer, it is always a _post:_ statement, because POST is the only method applied for calling services at other applications of the MW SDN application layer.  

In the OaM layer, all paths have to support the GET method. If the resource, which shall be addressed by the path, is located within a Configuration class, the PUT method has to be supported, too. Consequently, there is always a _get:_ statement following the _parameters:_ statement and in some cases a _put:_ statement beneath.  

#### operationId:
The OperationId is required to distinguish the code modules after automated code generation. It must be unique.  

In the Service layer, the OperationId shall be the original OperationName, but expressed in lowerCamelCase (e.g. registerApplication).  

In the OaM layer, the OperationId shall be composed from the methode (get or put), the object type (e.g. OperationServer, ActionProfile) and the attribute's name  (e.g. LifeCycleState, ConsequentOperationReference). Again lowerCamelCase style is applied (e.g. getOperationServerLifeCycleState, putActionProfileConsequentOperationReference).  

#### summary:  
The _summary:_ statement is for describing the effect of a service call. Ideally, words that are different from the service name get used.  

It is recommended to develop meaningful and concise phrasings, as the content of the _summary:_ statement will be displayed prominently in the Swagger API documentation during later operation of the application.  

#### tags:
The _tags:_ statement is for grouping code modules. It supports targeted handling of the automatically generated program structure.    

In the Service layer, the following tags have to be applied:  
  - _IndividualServices_: Automatically generated artifacts have to be completed by individual code.  
  - _BasicServices_: References to existing code modules have to be added.  
Obviously, ApplicationOwners can generally be expected to enter the tag _IndividualServices_.  

In the OaM layer, the following tags have been defined for grouping modules that are required for managing the same kind of objects:  
  - _Core_  
  - _ActionProfile_  
  - _GenericResponseProfile_  
  - _FileProfile_  
  - _IntegerProfile_  
  - _StringProfile_  
  - _OperationServer_  
  - _HttpServer_  
  - _TcpServer_  
  - _OperationClient_  
  - _HttpClient_  
  - _TcpClient_  
  - _ElasticsearchClient_  
E.g. if a new kind of _Profile_ would be defined by the ApplicationOwner, a new tag would have to be used, too. Clearly, an additionally defined tag must be distinct from the existing ones.  

#### security:
The _security:_ statement serves to protect the path against unauthorized use.  

The following security methods are supported:

**none**
Paths like e.g. _/v1/register-application:_ and _/v1/start-application-in-generic-representation:_ are not protected at all. This has been decided to facilitate initiating their execution by simple requests.  
In general, not adding any _security:_ statement is an option for read-only tasks that do neither expose critical information nor produce a significant load to the system.  
These requirements coincide with the ones that are applying on generic representation, but foregoing a _security:_ statement is not necessarily limited to generic representation.  

**_apiKeyAuth: []_**  
According to the MW SDN design, addressing Services is used for communication between applications and applications are rather for implementing automation than providing access to the network to humans. Consequently, access to Services is restricted on applications, respectively OperationClients, instead of humans.  
Services should, by default, have a _security:_ statement with an _apiKeyAuth: []_ statement to be integrated into the operation key management during the application's runtime.  

**_basicAuth: []_**  
OaM paths are for humans configuring the application. Consequently, they are not part of the operation key management, but rather of an authentication procedure that relates to humans.  
OaM paths shall always have a _security:_ statement with a _basicAuth: []_ statement, in order to be integrated into the central administration of administrators during the application's runtime.  

### RequestBody  
The _requestBody:_ statement is optional. 

In the Service layer, it has to be added whenever additional information is required for executing a Service.  

In the OaM layer, a RequestBody is usually not required for GET requests; for PUT requests, the RequestBody is evidently unavoidable.  

#### required:  
If a _required:_ statement is added at this position, it relates to the RequestBody as a whole. Only in extremely rare cases is a RequestBody required as a whole or not at all.  

In general, if there is a _requestBody:_ statement, there should be also a _required: true_ statement.  

#### content:
The description of the content of the RequestBody starts.  
If there is a _requestBody:_ statement, there shall also be a _content:_ statement.  

#### Media Type
The content of the RequestBody could be expressed in multiple syntax (e.g. JSON, HMTL, PDF).  
In case of the MW SDN, the content of the RequestBody and the ResponseBody shall always be expressed in JSON.  
So, just one media type shall be described in the content.  
Consequently, the mandatory _requestBody:_ statement shall always be followed by a _application/json:_ statement.  

#### schema:  
The _application/json:_ statement shall always be followed by a _schema:_ statement.  
The _schema:_ statement starts the description of the structure of the JSON object that is forming the RequestBody.  

OpenAPI Specification allows to define the structure of the JSON object in a separate section at the end of the OAS and to just put a reference to this definition into the Schema section of an individual RequestBody.  
It is recommended to formulate the schemas of all RequestBodies and ResponseBodies first and to search for redundancies afterwards.  
Reading the OAS is easier when following this order during specification work.  

#### Datatype of the Body  
As a first statement inside the schema definition, the datatype of the Body has to be defined.  
The schema of RequestBodies and ResponseBodies shall always be wrapped into an object.  
That means that the JSON will start and end with a curly bracket and the attributes will be represented with their names and values inside.  
So, the _schema:_ statements in the RequestBodies and ResponseBodies shall always be followed by a _type: object_ statement.  

#### Object Descriptions  
An object description must define the included attributes and specify whether and in which combination these attributes must be present in a valid Body.  
This can be expressed through different combinations of statements.  

It is recommended to always start the description of an object with statements about the necessity of the included attributes, then describe the attributes in detail, and conclude with a concrete example.  

#### required: and Multiplicities
In most cases the description of an object starts with a _required:_ statement and a list of names of attributes that must be present in a valid service or OaM request. Listing the names of required attributes is a clean and clear way of assuring that the defined attributes are actually provided in a Body.  

In cases just some of the attributes need to be included, _minProperties:_ and _maxProperties:_ statements might support formulating boundaries. An _additionalProperties: false_ might support enforcing the quantity rules. In practice, these restrictions are usually imprecise and therefore not ideal. Formulating alternative object structures and combining them by e.g. an _oneOf:_ statement should be considered.  

#### properties:
The individual attributes get described in detail in this section.  

It starts with the name of the attribute. Ideally, the attribute's name is clearly and concisely describing the attribute.  

The attribute's datatype is to be stated next.  

In case of String attributes a _pattern:_ statement together with a Regex string might follow.  

#### description:
The _description:_ statement is essentially a free-text field, but a clear structure has been defined in the ApplicationPattern.  

Content of the _description:_ statement shall start with a meaning/use of the attribute. Ideally, words that are different from the attribute's name get used.  

Where to get or put the attribute in the internal datastructure of the application is to be stated next.  
There are strict definitions for the verbs to be used.  

In the RequestBody:  
  - _find in_: The attribute serves as a key attribute and its value is for identifying a specific dataset in a list of datasets. If the value could not be found in the list, nothing shall happen. This represents the case of an _invariant process snippet_.  
  - _find or create_: This combination identifies a key attribute. Its value has to be found in a list of datasets for manipulating the other attributes of the same set. If the value could not be found in the list, a new entry is to be created with its value. This represents the case of a _subscription_.  
  - _update_: The value of the attribute shall be used for updating the referenced position in the datatree (, if the dataset that is identified by the key attribute's value could be found).  
  - _update or create_: The value of the attribute shall be used for updating the referenced position in the datatree. (In cases the dataset, which would be identified by the key attribute's value, would not yet exist, a new one would be created.)  

In the ResponseBody:
  - _from_: The value of the attribute shall be taken from the referenced position in the datatree for returning it in the ResponseBody.   

The path statements that are identifying the positions in the datatree are usually containing UUIDs.  
These UUIDs shall be as precise as possible.  
Unknown segments of the UUIDs have to be covered by '*'.


Hier geht's weiter.