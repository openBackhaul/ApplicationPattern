# Integrating Applications into Telefónica's API Gateway

### Overview

### Description
This page provides a concise overview of the prerequisites and procedures for integrating applications of the MW-SDN Domain into Telefónica’s API Gateway.

There integration of applications into the API Gateway comprises two distinct processes:

1. Publishing (and managing) an Application:
* Responsibility: Application Owner
* Where it happens: **Publisher Portal**
* Full documentation and instructions: TEF Internal Link 1

2. Subscribing to an Application
* Responsibility: Any user who will consume the application
* Where it happens: **Subscriber Portal**, also known as the Developer Portal (**DevPortal**)
* Subscribing to an application is mandatory in order to consume its APIs
* Full documentation and instructions are available at TEF Internal Link 2

 ### Purpose

To securely expose APIs across the Telefónica organization, a reliable and centralized platform is essential. Telefónica uses the WSO2 API-Manager. The API Gateway fulfills this need by providing a unified environment to publish, manage, secure, and monitor APIs throughout their lifecycle. It is designed for any Telefónica team or application that needs to expose REST APIs to internal or external consumers.

### MW-SDN Application Group on TEF's API-Gateway

On the API Gateway, the Microwave SDN domain has been assigned the Application-Group identifier (U-Number) U-1792. Application Owners will publish their applications under this application group.

The Application-Group U-1792 has two roles: Publisher and Subscriber, each with a corresponding credential pairs Client ID and Client Secret:

* Publisher credentials will be needed to publish applications ('Import API @ Gateway' Service).

* Subscriber credentials will be used to obtain user authentication when subscribing to APIs.

If you wish to obtain these credentials, please write an eMail to : ana.cabello-barrera@telefonica.com

Remark: In addition to the Client ID and Client Secret credentials associated with the U-1792 Group, individual user credentials are required to access the Publisher and Developer Portals.

 ### Environments

 The API Gateway operates across four environments, each of them meant for an specific purpose:
 

* **ICT (Integration \& Component Testing):**  Used for initial integration testing of APIs and components by developers in testbed.
* **E2E1 (End-to-End Testing Stage 1):**  The first stage of end-to-end testing.
* **E2E2 (End-to-End Testing Stage 2):**  A secondary end-to-end testing environment for simulating near-production scenarios.
 * **PROD (Production)** : The live environment where APIs are available to end-users and external systems. All changes must be thoroughly tested in lower environments before deployment in PROD.

The only environments currently in use are PROD for live applications and E2E1 for testing before going live in PROD the API Gateway.

 Each environment has a separate Publisher Portal (for application owners) and DevPortal (for users consuming the APIs).

 Access to each environment requires distinct user credentials, which must be requested and granted individually.

The following table displays the **current** mapping between API Gateway environments and the MW-SDN Domain environments. It also provides links to the Publisher Portal and Developer Portal (DevPortal) for each respective API Gateway environment.

 | Environment             | Backend Environment Mapping | Publisher Portal Link | Developer Portal Link |
|-----------------         | -------------------------|--------------------|--------------------|
| ICT  (_Currently not in use_) |   _NONE_      | [Publisher Portal](#) | [DevPortal](#)      |
| E2E1                     | MW-SDN TestLab     | [Publisher Portal](#) | [DevPortal](#)      |
| E2E2 (_Currently not in use_)|   _NONE_       | [Publisher Portal](#) | [DevPortal](#)      |
| PROD                     | MW-SDN Production  | [Publisher Portal](#) | [DevPortal](#)      |


### User Onboard

User Onboard refers to the process of “signing up” a user into Telefónica's API Gateway for the first time. It is a one-time activity. The process varies slightly depending on the environment. Below is a high-level overview along with a link to detailed documentation.

<ins>User Onboarding in PROD</ins>

* The process is self-service via TSM: _Catalog > Application Services > General > User On-Boarding in APIGW > Request Now_

* Fields in the Request:
>>
    Antrag / Erlaubnis: MW SDN Production
    Betrieb: CREATE
    Beschreibung: (Free text)
    Role Type: PUBLISHER / SUBSCRIBER
>>

Note: The process must be completed twice — once for the Publisher role and once for the Subscriber role.

For step-by-step instructions, refer to the detailed extended documentation [link here].
 
<ins>User Onboarding in Lower Environments (E2E1, ~~E2E2, ICT~~)  </ins>

* 1st Pre-condition: Onboard user into the MetaDB application (authoritative source system in Telefónica.)  A CRQ must be raised to the support team to add the user to Meta DB. Reference TSM ticket raised internally for ourteam [CRQ000005534595](https://bmc-helix-innovation-suite-prd-smartit.tsmtefg.de/smartit/app/#/changePV/IDGJX5QMCQ6YOATDUPT1TDUPT18A9A). For more detailed information, please refer to the onboarding process here [User Add to MetaDB ](https://confluence.telefonica.de/spaces/IAM/pages/1140989159/Draft+Improvement+of+IDAM+User+Guide#Draft%2FImprovementofIDAMUserGuide-IftheSailPointteaminformsyouthattheuserismissingintheTESTMetaDB).

* Once user added to MetaDB and TSM Forge, please use the information and try to access the environments using this documentation



### Offboarding Users

User access deactivation and removal is managed through IDAM for secure and consistent offboarding.

* **Production Environment (API Gateway PROD):**  
  Requests must be submitted via **TSM** and refer detailed information here [User Offboarding](https://confluence.telefonica.de/spaces/AG/pages/990569399/NEW+-+Application+and+User+onboarding+and+offboarding+in+API+Gateway#NEWApplicationandUseronboardingandoffboardinginAPIGateway-UseroffboardinginTSMDigitalWorkplace).
* **Lower Environments (ICT, E2E2, E2E1):**  
  Requests should be submitted via SailPoint GUI
  [User Offboarding](https://confluence.telefonica.de/spaces/AG/pages/990569399/NEW+-+Application+and+User+onboarding+and+offboarding+in+API+Gateway#NEWApplicationandUseronboardingandoffboardinginAPIGateway-UseroffboardinginSailpoint) .


### OAS Requirements and Guidelines
Once an application is published in the API Gateway, subscribers can view and test the application in the DevPortal using the Swagger UI. This interface provides the URLs and displays all available API paths and resources that can be consumed.

The Application Owner (API Publisher) is responsible for publishing the API by uploading, among other things, an OpenAPI Specification (OAS) file. This OAS file defines the Swagger documentation visible to subscribers.

The OAS to be uploaded towards the API-GW via 'import-API' must comply with specific requirements. Typically, it is created by making a few adjustments to the original OAS produced by the Application Owner, which followwed the structure defined in the Application Pattern of OpenBackhaul.

Guidelines:

* The OAS must be in .json format.  (Conversion from .yaml to .json can be easily done with [online converter](https://onlineyamltools.com/convert-yaml-to-json))
* The OAS must contain an 
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
