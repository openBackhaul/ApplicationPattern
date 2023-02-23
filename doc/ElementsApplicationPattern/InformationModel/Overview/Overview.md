# Information Model Overview

The configuration information inside the applications and inside their CONFIGfiles is structured according to the ONF Core Information Model (ONF TR-512).  

The ONF Core Information Model (CIM) is a standardized data model developed by the Open Networking Foundation (ONF).  
It provides a common language and structure for describing network resources and services.  

The ONF CIM defines a set of objects, relationships, and attributes that can be used to represent various aspects of a network, including devices, interfaces, traffic flows, and policies.  
It is designed to be vendor-neutral and technology-agnostic, meaning that it can be used to represent network resources and services regardless of the underlying technologies or vendors involved.  

![OnfCoreIm](./pictures/InsideApplications.png)  

These base objects, relationships, and attributes get complemented by technology specific augmentations.  
In case of the information model that is used inside the applications, the ...
- [LayerTerminationPoint](../LogicalTerminationPoint/LogicalTerminationPoint.md) and its attached classes get complemented by attributes that are specific to the kinds of input and output interfaces that have to be configured at the applications.  
- [Profile](../Profile/Profile.md) class gets augmented by attributes for storing parameters that are required for calculations or processes that are executed inside the applications.  

The [ControlConstruct](../ControlConstruct/ControlConstruct.md) is the top level element of the data tree inside the applications.  
ForwardingDomain and [ForwardingConstruct](../ForwardingConstruct/ForwardingConstruct.md) are describing event-reaction-relationships similar to a traffic flow.  

