## Basic Services

The basic services are generic across all the Microservices in the application layer. This consists of APIs using which a Microservice can be integrated into the application layer environment.

Totally we have 15 basic services. Please look into the below brief information . (The first 4 services can be accessed without an authorization code)
1.	**/v1/inform-about-application** – This service provides the name, version number and purpose of the application along with the application owner information.
2.	**/v1/inform-about-application-in-generic-representation** – This service provides the same information as the /v1/inform-about-application in a generic representation. 

3.	**/v1/inform-about-release-history** – This service provides details about the list of releases along with the date and the change set information.

4.	**/v1/inform-about-release-history-in-generic-representation** – This service provides the same information as the /v1/inform-about-release-history in a generic representation.

5.	**/v1/register-yourself** – Initiates registering at the currently active Registry office application. This service Shall also automatically execute without receiving any request every time the application starts

6.	**/v1/embed-yourself** – provides a set of procedure using which a new application can embed into the MBH SDN application layer. Practically the current active RegistryOffice(RO) will consume this service once it is approved by the TypeApprovalRegistry

7.	**/v1/list-ltps-and-fcs** – Allows retrieving the entire LogicalTerminationPoint and the ForwardingConstruct list.

8.	**/v1/redirect-service-request-information** – offers configuring the client side for sending service request information. This service will be consumed by the EaTL Microservice to redirect the basic and individual service log to this application.

9.	**/v1/redirect-oam-request-information** – offers configuring the client side for sending OAM request information. This service will be consumed by the OamLog Microservice to redirect OAM request log to this application.

10.	**/v1/inquire-oam-request-approvals** – Receives information about where to ask for approval of OAM requests. This service will be consumed by the AdministratorAdministration(AA) Microservice to ask for validating the OAM request’s authentication code.

11.	**/v1/redirect-topology-change-information** – Offers configuring client side for sending information about topology changes. This service will be consumed by the ApplicationLayerTopology(ALT) Microservice to send information about the LTPs and FCs.

12.	**/v1/end-subscription** – provides functionality to stop a notification subscription

13.	**/v1/update-client** – Allows updating connection data of a serving application. This service will be called by the registry office to broadcast a server replacement from one version to another

14.	**/v1/update-operation-client** – Allows updating operation clients to redirect to backward compatible services.

15.	**/v1/update-operation-key** - Allows updating operation key at a OperationServer or OperationClient

