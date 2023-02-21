# Information Model Overview

The configuration information inside an application and inside its CONFIGfile is structured according to the ONF Core Information Model (ONF TR-512).  
The ONF Core Model provides a basic structure that can be applied on all kinds of networks.  
Wherever needed, the ONF Core Model can be augmented by technology-specific attributes.  

![OnfCoreIm](./pictures/InsideApplications.png)  

The [ControlConstruct](../ControlConstruct/ControlConstruct.md) is the top level element of the data tree inside the application.  
The [LayerTerminationPoint](../LogicalTerminationPoint/LogicalTerminationPoint.md) and its attached classes are representing the input and output interfaces of the application.  
ForwardingDomain and [ForwardingConstruct](../ForwardingConstruct/ForwardingConstruct.md) are describing event-reaction-relationships.  
The [Profile](../Profile/Profile.md) class allows storing parameters that are required for calculations or processes that are executed inside the application.  

The Profile and the LayerProtocol classes get augmented by attributes that are specific for the applications of the MW SDN application layer.  
