# Integrating Applications into Telefónica's API Gateway

### Overview
  

### Description
This page provides a concise overview of the prerequisites and procedures for integrating applications into Telefónica’s API Gateway.

There are two distinct processes for integrating applications into the API Gateway:

1. Publishing an Application:
* Responsibility: Application Owner
* Occurs on the **Publisher Portal**
* Detailed documentation and instructions: TEF Internal Link 1

2. Subscribing to an Application
* Responsibility: Any user consuming the application
* Occurs on the **Subscriber Portal**, also known as Developer Portal (**DevPortal**)
* Detailed documentation and instructions: TEF Internal Link 2

### Purpose

 ### Environments

 The API Gateway operates across four environments:
 
 | Environment | Backend Mapping          | Publisher Portal Link | Developer Portal Link |
|------------|-------------------------|--------------------|--------------------|
| ICT        | MW-SDN TestLab          | [Publisher Portal](#) | [DevPortal](#)      |
| E2E1       | MW-SDN Pre-Production   | [Publisher Portal](#) | [DevPortal](#)      |
| E2E2       | MW-SDN Pre-Production   | [Publisher Portal](#) | [DevPortal](#)      |
| PROD       | MW-SDN Production       | [Publisher Portal](#) | [DevPortal](#)      |


Each environment has a separate Publisher Portal (for application owners) and DevPortal (for users consuming the application).

Access to each portal in each environment requires distinct user credentials, which must be requested and granted individually.


### Application and User Onboard







### OAS Requirements and Guidelines
Once an application is published in the API Gateway, subscribers can view and test the application using the Swagger UI. This interface displays all available API paths and resources that can be consumed.

The Application Owner (API Publisher) is responsible for publishing the API by uploading, among other things, an OpenAPI Specification (OAS) file. This OAS file defines the Swagger documentation visible to subscribers.

The OAS must comply with specific guidelines and requirements. Typically, it is created by making a few adjustments to the original OAS produced by the Application Owner, which followwed the structure defined in the Application Pattern of OpenBackhaul.

Guidelines:

*
*
*

### Configuration-file Requirements and Guidelines

### API Import Process

### Contents
- [Documentation](./doc/Main.md)
- [Specification](./spec/)
- [TestSuite](./testing/)
- [Implementation](./server/)

### Comments
./.