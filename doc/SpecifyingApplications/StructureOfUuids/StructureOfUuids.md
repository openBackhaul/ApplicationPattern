# Structure of UUIDs

UUIDs are used for identifying the individual objects within the data structure.  

Example: If interfaces A and B are identified by UUIDs, it suffices to list the two UUIDs to express a connection between the two interfaces.  

Obviously, UUIDs have to be unique within the data domain for expressing connections between interfaces at different applications.  

On the other hand, harmonizing UUIDs accross all applications helps reading and navigating through the data of the individual applications.  


**UUIDs are composed from the following information:**  
[ApplicationID]-[ReleaseNumber]-[LayerID]-[ObjectType]-[ApiSegment][ApplicationNumber][SequenceNumber]  

**ApplicationID**  
Official abbreviation of the application name composed from the uppercase letters of the name (e.g. RO, TAR).  
(Now, it should be clear why [Structure of ApplicationNames](../StructureOfApplicationNames/StructureOfApplicationNames.md) prescribes that abbreviations need to be unique within the modular application layer.)  

**ReleaseNumber**  
Official release number of the specification.  
Dots to be replaced by hyphens (e.g. 1-0-0, 1-0-1).  

**LayerID**  
Currently the following layers are defined:  
- op = Operation
- http = HTTP
- tcp = TCP/IP

**ObjectType**  
Within the respective layers the following types of objects are defined:
- c = Client
- s = Server
- fd = ForwardingDomain (potential forwarding)
- fc = ForwardingConstruct (actual forwarding)

**ApiSegment**  
The API (REST interface) of the application is substructured in regards to the following two aspects:  
- Own Management vs. Offered Services  
- Basic to all vs. Individual to this application  

This results in four cathegories:  
- 0 = Management, which is available at this application, but all other applications, too  
- 1 = Management, which is individual to this application  
- 2 = Services, which have to be provided by all applications  
- 3 = Services, which are individual to this application  

Knowing this, it's clear why (almost) all numbers within the UUIDs that are comming with the ApplicationPattern are starting either with 0 or 2.

**ApplicationNumber**

[   Das ist redundant   -   Jetzt etwas ändern?   ]

