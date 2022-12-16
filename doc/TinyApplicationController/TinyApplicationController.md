# Components of the TinyApplicationController

### RegistryOffice
All applications will automatically register at the RegistryOffice (RO).  

**What is the purpose of RegistryOffice?**  
The RegistryOffice is the entry point for all applications to get provisioned in the MW SDN application layer microservice architecture.  
It provides functionality to register and deregister an application from the MS environment.  
Its main purpose it to create accurate records of the registered applications and to forward it to other components of the TinyApplicationController for further proceeding.  
It administrates the list of registered applications.  

**Role in provisioning and deprovisioning an application to/from the ApplicationLayer**  
- The de-/registration services offered by the RegistryOffice (e.g. /v1/register-application, /v1/deregister-application) can be used by other applications to change their registration status.  
    - E.g. if a new application calls /v1/register-application, its application information is registered and related details are stored inside the RegistryOffice. After successful registration the RO sends the registered application information to the TypeApprovalRegistry for type approval.  
    - On the other hand, a successful deregistration leads to the RO sending the deregistered application information to other applications that subscribed for the deregistration notification.  
- Other applications can use the RO notification services (e.g. /v1/notify-approval) to subscribe for notifications about approval or registration status changes.  

The graphic shows the interactions of the RegistryOffice with the other applications of the TinyApplicationController for adding a new application to the ApplicationLayer.  
![TAC_newApp](https://user-images.githubusercontent.com/57349523/185092676-bbfb167b-3430-466c-a03f-7e5a8156c01e.jpg)

A description of a sample implementation of version 1.0.0 of the specification can be found [here](./RegistryOffice.md).


### TypeApprovalRegister
The TypeApprovalRegister (TAR) stores already granted approvals.  

**What is the purpose of TypeApprovalRegister?**  
When a new application registered at the RegistryOffice, the RegistryOffice requests for the approval status of this application at the TypeApprovalRegistry.  
The actual approval is done by an operator.  
After the operator has decided about the approval, the related information is sent back to the RegistryOffice.  
The TypeApprovalRegister stores already granted approvals.  

**What is the importance of documenting and storing the approval status of an application?**  
Only after the approval has been granted an application will be embedded into the MS environment and can be used by users and other applications.  
I.e. applications without approval are not (or no longer) available for usage.  
To ensure this functionality, the approvals have to be maintained in the TypeApprovalRegister.  
The approval status needs to be stored in the TypeApprovalRegister for automating the embedding process in case the application has to be re-instantiated after some failure.  


### ExecutionAndTraceLog
ExecutionAndTraceLog (EATL) is logging all service activities.  

**What is the purpose of ExecutionAndTraceLog?**  
The EATL logs information about all service requests.  
It provides services to e.g. retrieve the following information:  
- a list of all service records  
- a list of all service records beloning to the same flow  
- a list of unsuccessful service requests  

**How does EATL help to troubleshoot a failed/successful end to end flow?**  
With the provided services the complete communication flow between applications can be made availably for analysis.  
Each service request record includes detailed information about the executed requests, such as originator, application name and release, operation name, response code and the timestamp.  
It also includes the x-correlator and trace-indicator, which help to group requests associated with each other.  
E.g. by first requesting the list of unsuccessful requests, problematic requests can be identified.  
By then retrieving all service request records belonging to the same flow as the problem request further analysis is possible.  


### OamLog
OamLog (OL) is logging all administrative activities.  

**What is the purpose of OamLog?**  
The OamLog application is in charge of logging all OaM requests.  
OaM requests are not for using an application according to its purpose, but for configuring the application itself.  
Such configuration often relates to its traffic relationships with other applications (e.g. IP addresses).  
In some cases, the methods and processes inside an application allow parametization via OaM requests (e.g. rate for re-freshing internal data).  
Each OaM request record captures information about the application, the method (e.g. PUT), the request information like ressource, body, response code or timestamp, as well as the user, who issued the request.  
It provides services to e.g. obtain  
- a list of recorded OaM requests  
- a list of OaM request records beloning to the same application  


### AdministratorAdministration
AdministratorAdministration (AA) is authenticating OaM requests.  

**What is the purpose of AdministratorAdministration?**  
All OaM requests need to be authenticated.  
The AA offers a service to check this authentication.  
Upon valid authentication, the OaM request is approved.  
All applications are also offering a service for inquiring about OaM request approvals, for which the executed operation is the approval service of the AA.  

**What type of requests will be authenthicated using AA?**  
All OaM requests, as these are offering administration functionality.  
Non-OaM requests get authenticated by a different concept (operation-key).  


### ApplicationLayerTopology
ApplicationLayerTopology (ALT) represents interfaces and forwardings.  

**What is the purpose of ApplicationLayerTopology?**  
The ALT stores interface and forwarding information not only for itself, but also for all the other applications which are part of the ApplicationLayer.  
It contains the entire topology information about the ApplicationLayer and it allows to approval individual communication relationships between applications.  

**How does ALT help to enable communication across microservices in the ApplicationLayer?**
By providing a central place where interface and forwarding information is stored, other applications from the ApplicationLayer always know where to lookup interface and forwarding information about other applications, they need to communicate with.  
The ALT e.g. provides the following information:  
- a list of names of operations a given application offers  
- a list of applications and names of operations consumed by a given application  
- a list of applications and names of operations that are addressed in case of incoming requests  
- a list of applications and names of operations that are connected to a given application by links (applications can also subscribe for notifications about updates of those links)  

**What is the difference between the CONFIGfile of this application and other applications in the ApplicationLayer?**  
Other applications are limited to storing configuration information about themselves, while the CONFIGfile of the ApplicationLayerTopology stores the configuration information of all registered applications.  
There is also a slight difference in the applied information model.  
In case of usual applications, the ControlConstruct is the top level element of the internal information structure.  
Inside the ApplicationLayerTopology, there is the NetworkControlDomain above its own and all other ControlConstructs belonging to the ApplicationLayer.  

**Why do all Microservices in the ApplicationLayer updated their ControlConstruct information to the ALT?**  
By sending their ControlConstruct information to the ALT, the ALT is able to store the interface and forwarding information and make it available for other applications like the OperationKeyManagement.  


### OperationKeyManagement
OperationKeyManagement (OKM) keeps OperationKeys in synch.  

**What is the purpose of OperationKeyManagement (OKM)?**  
One application consuming services provided by another application must be approved by an operator in the ApplicationLayerTopology.  
The approval system gets envorced by the serving application requesting for a correct OperationKey before answering the request.  
The OperationKeyManagement is configuring the individual applications according to the approved relationships with updated OperationKeys.  

**How are OperationKeys frequently updated using the OKM application?**   
/v1/regard-updated-link offered by the OKM initiates the OperationKey update.


### Relations between basic services and TinyApplicationController apps
Some of the basic services offer configuring the client side with one of the applications in the TinyApplicationController.  

| Category | Basic Service | Related Application |
| --- | --- | --- |
| own oam / basic | /v1/embed-yourself |  | 
| own oam / basic | /v1/end-subscription |  | 
| own oam / basic | /v1/inquire-oam-request-approvals | AdministratorAdministration informs about where to send requests for approving OaM requests | 
| own oam / basic | /v1/list-ltps-and-fcs |  | 
| own oam / basic | /v1/redirect-oam-request-information | OamLog informs about where to send logging of OAM requests | 
| own oam / basic | /v1/redirect-service-request-information | ExecutionAndTraceLog  informs about where to send logging of usual service requests |  
| own oam / basic | /v1/redirect-topology-change-information | ApplicationLayerTopology informs about where to send information about changes of the topology | 
| own oam / basic | /v1/register-yourself | Operators can inform about where to register | 
| own oam / basic | /v1/update-client | Broadcast information send by the RegistryOffice is informing about address changes of all kinds of applications | 
| own oam / basic | /v1/update-operation-client |  | 
| own oam / basic | /v1/update-operation-key |  | 
| service / basic | /v1/inform-about-application |  | 
| service / basic | /v1/inform-about-application-in-generic-representation |  | 
| service / basic | /v1/inform-about-release-history |  | 
| service / basic | /v1/inform-about-release-history-in-generic-representation |  | 

[<- Back to Specifying](../SpecifyingApplications/SpecifyingApplications.md) - - - [Up to Main](../Main.md) - - - [Ahead to ApplicationPattern ->](../ElementsApplicationPattern/ElementsApplicationPattern.md)
