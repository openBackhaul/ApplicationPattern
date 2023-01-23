# Substructure of Management of Internal Forwarding

As already mentioned above, separate _Managements_ are used for subscribing and unsubscribing.  
Subscribing is creating _Clients_ and adding references to the _ForwardingConstruct_.  
Unsubscribing is removing references from the _ForwardingConstruct_ and potentially deleting the _Clients_.  
Thus, in general there might be several _Managements_ defined on a _Forwarding_ and the _ForwardingList_ allows to distinguish their roles.  

In principle, _Forwarding_ defines just an _Input_-_Output_-relationship between at least two interfaces.  
These interfaces could exist idenpendently from the _ForwardingConstruct_.  
 
The _ForwardingList_ allows distinguishing the following kinds of _Management_ by an individual _OperationServer_:  
- Just changing already existing and connected interfaces  
- Just connecting already existing interfaces  
- Just disconnecting, but not deleting an interface  

(Deleting, but not disconnecting doesn't make sense.)  
Unfortunately, the _ForwardingList_ is exceeding the capabilities of the syntax of the OpenApiSpecification v3.0 is these regards.  
How to code the information into description statements will be described in later chapters.  
