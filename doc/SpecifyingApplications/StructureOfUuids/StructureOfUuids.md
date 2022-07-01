# Structure of UUIDs  

UUIDs are used for identifying the individual objects within the structure of the configuration data inside the applications.  
Example: If interfaces A and B are identified by UUIDs, it suffices to list the two UUIDs to express a connection between the two interfaces.  
Obviously, UUIDs have to be unique within the network domain for expressing connections between interfaces at different applications.  
Harmonizing UUIDs across all applications helps reading and navigating through the configuration data of the individual applications.  


**UUIDs are composed from the following information:**  
[ApplicationID]-[ReleaseNumber]-[LayerID]-[ObjectType]-[ApiSegment][ApplicationNumber][SequenceNumber]  

**ApplicationID**  
Official abbreviation of the application name composed from the uppercase letters of the application name (e.g. RO, TAR), but transferred into lowercase letters (e.g. ro, tar).  
(Now, it should be clear why [Structure of ApplicationNames](../StructureOfApplicationNames/StructureOfApplicationNames.md) prescribes abbreviations to be unique within the modular application layer.)  
This application identifier relates to the application that contains the data object that is identified by the UUID (name space).  

**ReleaseNumber**  
Official release number of the specification of the application that contains the data object.  
Dots to be replaced by hyphens (e.g. 1-0-0, 1-0-1).  

If someone would find it more convinient, UUIDs in ServiceList and ForwardingList could abstract ApplicationID and ReleaseNumber, but latest OAS, CONFIGfile and test cases must contain complete UUIDs.

**LayerID**  
Currently the following layers are defined:  
- op = Operation  
- http = HTTP  
- tcp = TCP/IP  
- meth = Method  
- prot = Protocol  

If the ObjectType identifies an instance of a Profile (p), the LayerID is used for identifying the type of Profile.  
In principle, the ApplicationOwner is free in defining Profiles and choosing the LayerID, because instances of Profile just exist within the application itself.  
If an already existing Profile definition is re-used, it is recommended to re-use the same LayerID, too.  
The following LayerIDs are already in use for Profiles:  
- integer = For storing a single Integer  
- string = For storing a single String  
- action = For describing the consequent action in a generic representation  

**ObjectType**  
Within the respective layers the following types of objects are defined:  
- c = Client  
- s = Server  
- fd = ForwardingDomain (potential forwarding inside applications)  
- fc = ForwardingConstruct (actual forwarding inside applications)  
- link = Link (actual forwarding outside applications)  
- p = Profile  

_The consequence definitions for ApiSegment, ApplicationNumber and SequenceNumber apply for Clients, Servers and Profiles._  
_Similar rules for ForwardingDomain, ForwardingConstruct and Link will be added during writing the guidelines for elaborating the ForwardingList._  

**ApiSegment**  
The API (REST interface) of the application is sub-structured in regards to the following two aspects:  
- Own Management vs. Offered Services  
- Basic to all applications vs. Individual to this application  

This results in four categories:  
- 0 = Management, which is available at this application, but all other applications, too  
- 1 = Management, which is individual to this application  
- 2 = Services, which have to be provided by all applications  
- 3 = Services, which are individual to this application  

(Now, it's clear why (almost) all numbers within the UUIDs inside the ApplicationPattern are starting either with 0 or 2.)  

Profiles always relate to Management, which is individual to this application (1).  

**ApplicationNumber**  
This application identifier relates to the application that is connected by the described interface object.  
Counting is hexadecimal.  

If the ObjectType indicates a server (s) or a Profile (p):  
- 0 = The ApplicationNumber can just relate to the application itself.  

If the ObjectType indicates a client (c), the ApplicationNumber identifies a client to connect to the following application:  
- 00 = OldRelease of the same application  
- 01 = NewRelease of the same application  
- 02 = RegistryOffice  
- 03 = TypeApprovalRegister  
- 04 = ExecutionAndTraceLog  
- 05 = OamLog  
- 06 = AdministratorAdministration  
- 07 = ApplicationLayerTopology  
- 08 = OperationKeyManagement  
- 09 - 2f = _reserved for further applications of the TinyApplicationController_  
- 30 = CurrentController  
- 31 = MicroWaveDeviceInventory  
- 32 - ff = _future applications_  

**SequenceNumber**  
The SequenceNumber is just distinguishing objects of the same kind.  
Counting is hexadecimal.  
If the ObjectType indicates a server (s) or a Profile (p), the SequenceNumber has two digits.  
If the ObjectType indicates a client (c), the SequenceNumber has just one digit.  
If the defined numbers of digits would not suffice in some case (e.g. provided servers or clients towards one application) additional digits must be added to all UUIDs inside the same application.  

**Examples**  
- ro-1-0-0-op-s-0004 = OperationServer (for /v1/end-subscription) inside the RegistryOffice release 1.0.0  
- ol-1-0-0-op-c-002a = OperationClient (for /v1/relay-server-replacement) that is addressing the RegistryOffice (0**02**a) inside the OamLog release 1.0.0  
- ol-1-0-0-http-c-0070 = HttpClient that is addressing the ApplicationLayerTopology (0**07**0) inside the OamLog release 1.0.0  
- aa-1-0-0-op-fc-0005 = ForwardingConstruct on the OperationLayer inside the AdministratorAdministration release 1.0.0  
- eatl-1-0-1-integer-p-1000 = Profile storing an Integer value inside the ExecutionAndTraceLog release 1.0.1  
