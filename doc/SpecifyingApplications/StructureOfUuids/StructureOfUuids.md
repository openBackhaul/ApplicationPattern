# Structure of UUIDs  

UUIDs are used for identifying the individual objects within the structure of the configuration data inside the applications.  
Example: If interfaces A and B are identified by UUIDs, it suffices to list the two UUIDs to express a connection between the two interfaces.  
Obviously, UUIDs have to be unique within the network domain for expressing connections between interfaces at different applications.  
Harmonizing UUIDs accross all applications helps reading and navigating through the configuration data of the individual applications.  


**UUIDs are composed from the following information:**  
[ApplicationID]-[ReleaseNumber]-[LayerID]-[ObjectType]-[ApiSegment][ApplicationNumber][SequenceNumber]  

**ApplicationID**  
Official abbreviation of the application name composed from the uppercase letters of the application name (e.g. RO, TAR).  
(Now, it should be clear why [Structure of ApplicationNames](../StructureOfApplicationNames/StructureOfApplicationNames.md) prescribes abbreviations to be unique within the modular application layer.)  
This application identifier relates to the application that contains the data object that is identified by the UUID (name space).  

**ReleaseNumber**  
Official release number of the specification.  
Dots to be replaced by hyphens (e.g. 1-0-0, 1-0-1).  

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
- string = For storing a single String  
- integer = For storing a single Integer  
- action = For describing the consequent action in a generic representation  
- admin = For storing information to authenticate an administrator  
- application = For storing the approval status of an application  

**ObjectType**  
Within the respective layers the following types of objects are defined:  
- c = Client  
- s = Server  
- fd = ForwardingDomain (potential forwarding inside applications)  
- fc = ForwardingConstruct (actual forwarding inside applications)  
- link = Link (actual forwarding outside applications)  
- p = Profile  

**ApiSegment**  
The API (REST interface) of the application is substructured in regards to the following two aspects:  
- Own Management vs. Offered Services  
- Basic to all applications vs. Individual to this application  

This results in four cathegories:  
- 0 = Management, which is available at this application, but all other applications, too  
- 1 = Management, which is individual to this application  
- 2 = Services, which have to be provided by all applications  
- 3 = Services, which are individual to this application  

(Now, it's clear why (almost) all numbers within the UUIDs inside the ApplicationPattern are starting either with 0 or 2.)  

**ApplicationNumber**  
This application identifier relates to the application that is connected by the described interface object.  

If the ObjectType indicates a server:  
- 0 = The ApplicationNumber can just relate to the application itself.  

If the ObjectType indicates a client, the ApplicationNumber identifies a client to connect to the following application:  
- 00 = OldRelease of the same application  
- 01 = NewRelease of the same application  
- 02 = RegistryOffice  
- 03 = TypeApprovalRegister  
- 04 = ExecutionAndTraceLog  
- 05 = OamLog  
- 06 = AdministratorAdministration  
- 07 = ApplicationLayerTopology  
- 08 = OperationKeyManagement  
- 09 - 29 = _reserved for further applications of the TinyApplicationController_  
- 30 = MicroWaveDeviceInventory  
- 31 ... = _future applications_  

**SequenceNumber**  
The SequenceNumber is just distinguishing objects of the same kind.  
If the ObjectType indicates a server, the SequenceNumber has two digets.  
If the ObjectType indicates a client, the SequenceNumber has just one digit.  
