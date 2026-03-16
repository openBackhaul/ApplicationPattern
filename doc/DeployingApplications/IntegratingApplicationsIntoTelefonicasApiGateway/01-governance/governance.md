01-governance

# Purpose of API Management and the API Gateway 

The Telefónica MW-SDN-Domain offers a large and contunously increasing number of APIs that are used by a contunously increasing number of customers and tools. 

To safely expose these APIs, a secure platform is needed for publishing and making them accessible to any interested party within the organization.

The API Gateway fulfills this need by providing a unified environment to publish, manage, secure, and monitor APIs throughout their lifecycle. It is designed for any Telefónica team or application that needs to expose REST APIs to internal or external consumers. 
Telefónica uses the WSO2 product as their API Gateway ( API Management Platform).

Telefónica API developers and publishers define their APIs and deploy them in different API Gateway environments (ICT, E2E2, E2E1, and PROD). In the API Gateway, publishers register and publish their APIs using the OpenAPI specification. These specifications are then used by subscribers for their applications in parallel. API subscribers are consumer applications or teams that use APIs published on the API Gateway.


# Roles and responsibilities

The integration of APIs into the API Gateway comprises two distinct processes, respectively associated to two different roles:

1. Publishing (and managing) an API:
* Role at WSO2 API-Manager: PUBLISHER
* Responsibility: Application Owner of the MW-SDN Domain
* Where it happens: **Publisher Portal** 


2. Subscribing to an API
* Role at WSO2 API-Manager: SUBSCRIBER
* Responsibility: Any user who will consume the application
* Where it happens: **Subscriber Portal**, also known as the Developer Portal (**DevPortal**)
* Subscribing to an API is mandatory in order to consume its services or ressources (API endpoints)


# API - Gateway Environments (ICT, E2E2, E2E1, PROD)


The API Gateway supports multiple environments to manage development, testing, and production workflows. Each environment serves a specific purpose:

* **Production:**  
  The live environment where APIs are available to end-users and external systems. All changes must be thoroughly tested in lower environments before deployment.
* **E2E2 (End-to-End Testing Stage 2):**  
  A secondary end-to-end testing environment for simulating near-production scenarios.
* **E2E1 (End-to-End Testing Stage 1):**  
  The first stage of end-to-end testing.
* **ICT (Integration \& Component Testing):**  
  Used for initial integration testing of APIs and components by developers in testbed.

As per discussion MWSDN application is onboarded and has access to every environment mentioned here. Currently main focus is on PROD for live applications and E2E1 for testing in local before go to live in API Gateway.

The following table displays the **current** mapping between API Gateway environments and the MW-SDN Domain environments. It also provides links to the Publisher Portal and Developer Portal (DevPortal) for each respective API Gateway environment.

 | Environment             | Backend Environment Mapping | Publisher Portal Link | Subscriber (Dev) Portal Link |
|-----------------         | -------------------------|--------------------|--------------------|
| ICT  (_Currently not in use_) |   _NONE_      | [🔒Publisher Portal](https://ict.high.apigw-test.aws.de.pri.o2.com/publisher) | [🔒DevPortal](https://ict.high.apigw-test.aws.de.pri.o2.com/devportal)      |
| E2E1                     | MW-SDN TestLab ??    | [🔒Publisher Portal](https://e2e1.high.apigw-test.aws.de.pri.o2.com/publisher) | [🔒DevPortal](https://e2e1.high.apigw-test.aws.de.pri.o2.com/devportal)      |
| E2E2 (_Currently not in use_)|   _NONE_       | [🔒Publisher Portal](https://e2e2.high.apigw-test.aws.de.pri.o2.com/publisher) | [🔒DevPortal](https://e2e2.high.apigw-test.aws.de.pri.o2.com/devportal)      |
| PROD                     | MW-SDN Production  | [🔒Publisher Portal](https://prod.high.apigw-prod.aws.de.pri.o2.com/publisher) | [🔒DevPortal](https://prod.high.apigw-prod.aws.de.pri.o2.com/devportal)

# _Applications_ and Users in API Gateway. User On-boarding

In the context of Telefónica’s WSO2 API Manager, the term _Application_ (italicized throughout this guide) does not refer to the actual deployed app code that implements your API endpoints. Instead, an _Application_ is a management construct within WSO2 that governs how APIs are accessed.

An _Application_ functions as a container for users, representing a platform, tool, team, or project that can either/both:

* Publish APIs – acting as a “publisher platform”

* Consume APIs – acting as a “subscriber platform”

_Applications_ can be thought of as projects that organize users. Each Application can own APIs, subscribe to APIs, and manage keys and scopes on behalf of all its associated users.

```
Application (Tool with U-Number)
├─ Associated ROLES:
│    ├─ API Publishing Capabilities
│    └─ API Consumption / Subscriptions
├─ Associated USERS:
│    ├─ User A (PUBLISHER)
│    ├─ User B (SUBSCRIBER)
│    └─ User C (PUBLISHER, SUBSCRIBER)

```
 ### The MW-SDN _Application_ 

 Onboarding an Application is a **one-time activity**. The MW-SDN domain has been onboarded to the API Gateway and with its tool U-Number: **U-1792.**

The MW-SDN Application has both PUBLISHER and SUBSCRIBER roles associated.


Additionally an _Application_ , needs to get Publisher Credentials from IDAM  (**client_id / client_secret**) from IDAM. Details 

<ins>**This proccess has already been done for the MW-SDN Domain and does not need to be repeated**</ins>

 For more details on how an _Application_ gets onboarded into Telefónicas API-Gateway please refer to [🔒Telefónica's Documentation on _Application_ Role Onboarding](https://confluence.telefonica.de/spaces/AG/pages/990569399/NEW+-+Application+and+User+onboarding+and+offboarding+in+API+Gateway)
Instructions on how an _Application_ obtains Publisher Credentials  (**client_id / client_secret**) from IDAM are found [🔒here](https://confluence.telefonica.de/spaces/IAM/pages/1201657354/APIGW+Client+ID+Creation+Process).

### User-Onboarding

To Publish an API, a user must:

1. Be onboarded (assigned) to the appropriate _Application_ that will own the API
2. Be assigned the **PUBLISHER** role

In order to Consume/Subscribe to an API, a user needs to:

1. Be onboarded (assigned) to the Application that will consume the API (*)
2. Be assigned the **SUBSCRIBER** role


User onboarding (and offboarding) for a given Application and role requires a **separate request per {Application + Role} and per environment.**. The proccess is slightly different for Production Envrionment and for lower Environments (ICT, E2E1, E2E2). 



* **Production Environment** – managed via **TSM**.
 Detailed instructions: [here🔒](https://confluence.telefonica.de/spaces/AG/pages/990569399/NEW+-+Application+and+User+onboarding+and+offboarding+in+API+Gateway#NEWApplicationandUseronboardingandoffboardinginAPIGateway-UseronboardinginTSMDigitalWorkplace)

* **Lower Environments** (ICT, E2E1, E2E2) – managed via Sailpoint UI.

  - **MetaDB Request** : To get access, the user must first be onboarded to the Meta DB application, which is the authoritative source system in Telefónica. A CRQ must be raised to the support team to add the user to Meta DB.
      Reference TSM ticket raised internally for ourteam [🔒CRQ000005534595 ](https://bmc-helix-innovation-suite-prd-smartit.tsmtefg.de/smartit/app/#/changePV/IDGJX5QMCQ6YOATDUPT1TDUPT18A9A).

      For more detailed information, please refer to the onboarding process here [🔒User Add to MetaDB ](https://confluence.telefonica.de/spaces/IAM/pages/1140989159/Draft+Improvement+of+IDAM+User+Guide#Draft%2FImprovementofIDAMUserGuide-IftheSailPointteaminformsyouthattheuserismissingintheTESTMetaDB).

   -  Once the user is added to MetaDB and TSM Forge, please use the information and try to access the environments using this documentation [🔒User Onboarding](https://confluence.telefonica.de/spaces/AG/pages/990569399/NEW+-+Application+and+User+onboarding+and+offboarding+in+API+Gateway#NEWApplicationandUseronboardingandoffboardinginAPIGateway-UseronboardinginSailpoint) .


# API publication

APIs have to be published using the REST API-Import Service (not manually over the GUI of the Publisher Portal). The following steps must be followed:

1. Prepare all the API-Ressources and compress them into a ZIP File following the Guidelines. For detailed instructions on how to prepare the API resources from the Specs of the MW-SDN Domain (OAS), refer to [03-API-resources-preparation](../03-API-resources-preparation/03-API-resources-preparation.md)

2. Construct the curl Command:

    * Determine the target APIGW environment URL:

      | Environment | URL |
      |---|---|
      | ICT | https://ict-publisher-service.high.apigw-test.aws.de.pri.o2.com/apigw/v1/importApi |
      | E2E2 | https://e2e2-publisher-service.high.apigw-test.aws.de.pri.o2.com/apigw/v1/importApi |
      | E2E1 | https://e2e1-publisher-service.high.apigw-test.aws.de.pri.o2.com/apigw/v1/importApi |
      | NFR/PERF | https://perf-publisher-service.high.apigw-test.aws.de.pri.o2.com/apigw/v1/importApi |
      | PROD | https://prod-publisher-service.high.apigw-prod.aws.de.pri.o2.com/apigw/v1/importApi |

   * Construct the curl command with the appropriate headers and form data:

   ```    -X POST: HTTP POST request.
    -H 'authorization: Basic <Base64(client_id:client_secret)>': Authorization header.
    -H 'content-type: multipart/form-data;': Content type header.
    -F zipFile=@<ZipFileName.zip>: File upload for the API resource zip.
    
* Execure the curl command


# API subscription

## Creating an **Application**

The first requisite to consume an application is to subscribe to it at the DEvPortal. 
Subscriptions to Applications in the DevPortal are not done directly to users , it is required to 

  1. [🔒Create an **Application**](https://confluence.telefonica.de/spaces/AG/pages/985234951/NEW+-+API+Gateway+Subscriber+Guide#NEWAPIGatewaySubscriberGuide-CreateanApplication)
  .

  An **Application** ( bold-written throughout this guide) is the entity used in the WSO2 Portal 

  ```
  **Application**
  ├─ Associated to _Application_ in the PublisherPortal (Tool with U-Number):
  │    ├─ Associated USERS:
  │    ├─ User A (PUBLISHER)
  │    ├─ User B (SUBSCRIBER)
  │    └─ User C (PUBLISHER, SUBSCRIBER)
  │
  │─ Associated SCOPES

  ```

2. [🔒Subscribe to an API](https://confluence.telefonica.de/spaces/AG/pages/985234951/NEW+-+API+Gateway+Subscriber+Guide#NEWAPIGatewaySubscriberGuide-SubscribetoanAPI).

3. [Linking credentials to the _Application_ in the DevPortal](https://confluence.telefonica.de/spaces/AG/pages/985234951/NEW+-+API+Gateway+Subscriber+Guide#NEWAPIGatewaySubscriberGuide-LinkingyourcredentialstoyourApplication)

4. **Obtain the required OAuth2 Access Tokens for Subscriber applications**  To Access we require set of OAuth credentials. The credentials have to be requested directly. This request submitted via creating a Jira Support Request in the IDAM project. As part of the IDAM ticket we have to provide information about the desired Key-Manager, scope,  consumer-key etc. Reference IDAM tickets ([IDAM-5393](https://jira.telefonica.de/browse/IDAM-5393) and [IDAM-6050](https://jira.telefonica.de/browse/IDAM-6050)) raised and resolved as part of MWSDN application for different environments. For more detailed information please refer [OAuth2 Access Token](https://confluence.telefonica.de/spaces/AG/pages/985234951/NEW+-+API+Gateway+Subscriber+Guide#NEWAPIGatewaySubscriberGuide-APISecurity-OAuth2AccessToken)
   

# Lifecycle governance (coming soon)