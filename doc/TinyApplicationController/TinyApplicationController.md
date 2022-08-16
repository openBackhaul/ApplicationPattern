# Components of the TinyApplicationController

### RegistryOffice
All applications will automatically register at the RegistryOffice (RO).

**What is the purpose of RegistryOffice?**  
The RegistryOffice application is the entry point for all applications to get provisioned in the SDN application layer microservice architecture. It provides functionality to register and deregister an application from the MS environment. Its main purpose it to create accurate records of the registered applications and forward it to appropriate tiny application controllers for further formalities.  
It administrates the list of registered applications.

**Role in provisioning and deprovisioning an application to/from the ApplicationLayer**  
* The de-/registration services offered by the RegistryOffice (e.g. */v1/register-application*, */v1/deregister-application*) can be used by other applications to change their registration status. 
    * E.g. if a new application calls the register-application service, its application information is registered and related details are transported into the registry office. After successful registration the RO sends the registered application information to the TypeApprovalRegistry for type approval. 
    * On the other hand, a successful deregistration leads to the RO sending the deregistered application information to other applications that subscribed for the deregistration notification.  

* Other applications can use the RO notification services (e.g. */v1/notify-approval*) to subscribe for notifications about approval or registration status. If an applicationd has dependencies to other applications it needs to know if these applications services are available and can be used or not.

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### TypeApprovalRegister
The TypeApprovalRegister (TAR) stores already granted approvals.

**What is the purpose of TypeApprovalRegister?**  
When a new application wants to register at the RegistryOffice the RegistryOffice requests the of this application from the TypeApprovalRegistry. 
The actual approval is done by a human. After the human has decided about the approval, the related information is sent back to the RegistryOffice.  
The TypeApprovalRegister stores already granted approvals.

**What is the importance of documenting an approval status of an application by a Type approver?**  
Only after the approval has been granted an application will be embedded into the MS environment and can be used by users and other applications. 
I.e. applications without approval are not (or no longer) available for usage. To ensure this functionality, the approvals have to be maintained 
in the type approval register.


![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### ExecutionAndTraceLog
ExecutionAndTraceLog is logging all service activities.


**What is the purpose of ExecutionAndTraceLog (EATL)?**  

**How does EATL help to troubleshoot a failure/successful end to end flow?**  


![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### OamLog
OamLog is logging all administrative activities

**What is the purpose of OamLog (OL)?**  

### AdministratorAdministration
AdministratorAdministration is authenticating OaM requests

**What is the purpose of AdministratorAdministration (AA)?**  

**What type of services will be authenthicated using AA?**  



![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)


### ApplicationLayerTopology
ApplicationLayerTopology represents interfaces and forwardings.

**What is the purpose of ApplicationLayerTopology (ALT)?**  
The ALT stores interface and forwarding information not only for itself, but also for all the other applications which are part of the ApplicationLayer. 

**How does ALT help to enable communication across microservices in the ApplicationLayer?**
By providing a central place where interface and forwarding information is stored, other applications from the ApplicationLayer always know where to lookup interface and forwarding information about other applications, they need to communicate with. The ALT e.g. provides the following information  
* a list of names of operations a given application offers
* a list of applications and names of operations consumed by a given application
* a list of applications and names of operations that are addressed in case of incoming requests
* a list of applications and names of operations that are connected to a given application by links (applications can also subscribe for notifications about updates of those links)

**What is the difference between the config file of this application and other applications in the ApplicationLayer?**  
Other applications only store config information about themselves, while the config file of the ApplicationLayerTopology stores the config information of all registered applications. 

**Why do all Microservices in the ApplicationLayer updated their control construct information to the ALT?**  
By sending their control construct information to the ALT the ALT is able to store the interface and forwarding information for all of these applications. They get integrated into the ALTs own control construct.

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)


### OperationKeyManagement
OperationKeyManagement keeps operation keys in synch

**What is the purpose of OperationKeyManagement (OKM)?**  

**How are operation keys frequently updated using the OKM application?**   


![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)

### Relations between basic services and TinyApplicationController apps

Some of the basic services offer configuring the client side with one of the applications in the TinyApplicationController.

| Catgory | Basic Service | Related Application |
| --- | --- | --- |
| own oam / basic | /v1/embed-yourself |  | 
| own oam / basic | /v1/end-subscription |  | 
| own oam / basic | /v1/inquire-oam-request-approvals | Is related to AdministratorAdministration that offers configuring the client side for sending information about topology changes | 
| own oam / basic | /v1/list-ltps-and-fcs |  | 
| own oam / basic | /v1/redirect-oam-request-information | Is related to OAMLog that offers configuring the client side for logging the oam request | 
| own oam / basic | /v1/redirect-service-request-information | Is related to ExecutionAndTraceLog that offers configuring the client side for logging the individual and basic service request | 
| own oam / basic | /v1/redirect-topology-change-information | Is related to ApplicationLayerTopology that offers configuring the client side for approval of OaM requests | 
| own oam / basic | /v1/register-yourself | Is related to RegistryOffice as it register the application there | 
| own oam / basic | /v1/update-client |  | 
| own oam / basic | /v1/update-operation-client |  | 
| own oam / basic | /v1/update-operation-key |  | 
| service / basic | /v1/inform-about-application |  | 
| service / basic | /v1/inform-about-application-in-generic-representation |  | 
| service / basic | /v1/inform-about-release-history |  | 
| service / basic | /v1/inform-about-release-history-in-generic-representation |  | 

[<- Back to Specifying](../SpecifyingApplications/SpecifyingApplications.md) - - - [Up to Main](../Main.md) - - - [Ahead to ApplicationPattern ->](../ElementsApplicationPattern/ElementsApplicationPattern.md)
