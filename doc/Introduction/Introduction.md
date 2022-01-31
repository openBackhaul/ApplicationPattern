# Introduction

Overall target is implementing an SDN, which facilitates vendor agnostic network automation.

The device layer is composed from many different device types and a wide variety of management interfaces.
Mediators are used to translate individual management interfaces towards a single, harmonized NETCONF/YANG interface.
An OpenDaylight SDN Controller is translating from NETCONF to RESTCONF.

The application layer is modular for being more flexible and cost efficient than former dominance of monolithic blocks.
It is sub-structured into

* data sanitation and caching layer, which is for providing a high performance network interface
* business layer, which is for holding domain specific functions that are either implementing automation or supporting humans in configuration activities
* representation layer, which is for providing user interfaces that are representing the functions of the business layer.

![Substructure of the Modular MW SDN Application Layer](https://user-images.githubusercontent.com/15265413/151411515-49b13bcb-01d6-45a9-bbad-30a6329b9ed0.png)

The applications of the lower two layers are implemented as REST servers. This makes them very efficient to implement, to test and to deploy.

The ApplicationPattern, which is required for assuring smooth integration into an operation and maintenance infrastructure for applications, defines:

* headers for authentication and providing information, which is required by central management functions,
* services for
  * supporting centralized functions like logging and tracing
  * informing about the application itself
  * administrating the application, e.g. in case of updates
* and an OaM layer that makes the internal resources of the application available for configuration.

[Up to Main](../Main.md) - - - [Ahead to Preparing->](../PreparingSpecifying/PreparingSpecifying.md)
