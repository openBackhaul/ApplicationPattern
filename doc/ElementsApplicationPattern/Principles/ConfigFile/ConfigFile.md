# CONFIGfile  

The values defined in a CONFIGfile indicate the initial state of the application as soon as it is installed.  
It can be customized if require.  
Changes to the configuration of the application, which are happening during operation of the application, are also written into the CONFIGfile.  
So, in case of failure, a new instance of the application could be started with the exact latest configuration of the broken instance.  
Consequently, the CONFIGfile is time variant.  

The CONFIGfile provides information about:  
- the Microservice and its purpose, 
- the exposed services, 
- the consumed services,
- relationships between the exposed and the consumed services,
- hints on how the application interact with rest of the microservices.

The CONFIGfile shall not contain data, which is resulting from the business purpose of the application, but it might contain information required for connecting to a database holding exact such information.  

The format of the CONFIGfile is harmonized across all microservices in the MW SDN application layer.  
It is written in JSON and it inherits the concepts of the ONF CoreModel.  
As a consequence, the REST servers composing the MW SDN application layer are exposing a management interface, which is almost 100% identical to the RESTCONF interface of the devices that are managed by them.  
