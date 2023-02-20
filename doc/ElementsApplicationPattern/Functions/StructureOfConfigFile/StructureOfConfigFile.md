# Structure of the CONFIGfile

The structure of the CONFIGfile is harmonized across all microservices in the MW SDN application layer.  
Since it mainly involves information for describing traffic relationships, the same information model used to describe traffic relationships in the transport network is applied.  
Consequently, the REST servers composing the MW SDN application layer are exposing a management interface, which is almost 100% identical to the RESTCONF interface of the devices that are managed by them.  
That essentially makes the applications for managing applications a miniature version of those required for managing devices.  




It inherits the concepts of the ONF CoreModel.  


