# Structure of the ForwardingList

The template of the _ForwardingList_ already contains a lot of _Forwardings_.  
These _Forwardings_ are required for organizing the basic services provided by the _ApplicationPattern_.  
Please, don't alter these entries, except for the following individualization.  
Use CTRL+h for replacing 'xx-1-0-0' by the abbreviation of your application's name and release number 'ro-2-0-1'.  

Apart from this, please focus on zones indicated by comments starting with '##'.  

_TODO: All service requests to be complemented_  
The complete list of individual services that you added to the _ServiceList_ has be copied into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: Potentially add Forwardings for configuring INDIVIDUAL subscriptions on NewRelease_
This section is for preparing for a later update process to a new release of your application.  
If your application would offer subscriptions to other applications, subscriptions that might already exist at the time of the future upgrade shall be configured by the old release on the new release of your application.  
The following example shows the old release of the _RegistryOffice_ addressing the _/v1/notify-approvals_ at the new release of the _RegistryOffice_.  
While subscribing for ApprovalNotifications at the new release, the old release of the _RegistryOffice_ is faking being an application that subscribed for these notifications at the old release in past.  
This is the way existing subscriptions get transferred from the old release to the new release of an application during upgrade process.  
There are no _Managements_, because the _forwarding_ gets already defined during design time of the application.  
```
  - forwarding-name: PromptForBequeathingDataCausesNewApplicationBeingRequestedToDocumentSubscriptionsForApprovalNotifications
    uuid: ro-2-0-1-op-fc-im-112
    forwarding-type: InvariantProcessSnippet
    management-requests:
      operation-client-update:
      fc-port-update:
      fc-port-deletion:
      operation-client-deletion:
    initiating-requests:
      - server-name: /v1/bequeath-your-data-and-die
        uuid: ro-2-0-1-op-s-im-000
    consequent-requests:
      - client-name: NewRelease:://v1/notify-approvals
        uuid: ro-2-0-1-op-c-im-nr-2-0-1-002
```

_TODO: Add Forwardings for transferring data to NewRelease_
This section is for preparing for a later update process to a new release of your application.  
If your applications would store own application data into a DATAfile or the CONFIGfile (e.g. _ProfileInstances_), these data should be transferred during upgrade process.  
Most likely your application will learn its application data from other applications calling its _OperationServers_.  
The same _OperationServers_ must be implemented by the succeeding release of the application.  
Due to this design rule, it can be presumed that the same services are available for transferring data during the upgrade process.  
This is the way application data gets transferred from the old release to the new release of an application.  
There are no _Managements_, because the _forwarding_ gets already defined during design time of the application.  
The following example shows the old release of the _RegistryOffice_ addressing the _/v1/register-application_ at the new release of the _RegistryOffice_ for transferring the list of applications that registered in past.  
While registering at the new release, the old release of the _RegistryOffice_ is faking being an application that registered at the old release in past.  
```
  - forwarding-name: PromptForBequeathingDataCausesTransferOfListOfAlreadyRegisteredApplications
    uuid: ro-2-0-1-op-fc-im-114
    forwarding-type: InvariantProcessSnippet
    management-requests:
      operation-client-update:
      fc-port-update:
      fc-port-deletion:
      operation-client-deletion:
    initiating-requests:
      - server-name: /v1/bequeath-your-data-and-die
        uuid: ro-2-0-1-op-s-im-000
    consequent-requests:
      - client-name: NewRelease:://v1/register-application
        uuid: ro-2-0-1-op-c-im-nr-2-0-1-004
```

_TODO: Potentially add Forwardings for creating INDIVIDUAL subscriptions to NewRelease_

hier geht's weiter





* In principle, two sections of the Forwardings Template have to be filled:
  * The Forwardings, which have to be executed after addressing a service, which is individual to the application that is under definition
  * The Forwardings, which have to be executed by the oldRelease while managing the embedding of a newRelease
* The following steps are individual to the respective embedding process, and necessary Forwardings have to be described in the Forwarding Template (actual location is indicated by some bars at the right of the template):
  * Create subscriptions, which are addressing the newRelease, at existing applications. The oldRelease is addressing the same Management Requests, which it originally used to subscribe, now with the contact information of the newRelease
  * Create subscriptions and configure process snippets inside the newRelease according to the existing configuration of the oldRelease. The oldRelease is addressing the same Management Requests, which have originally been used to configure itself, at the newRelease
  * Copy own data to newRelease by addressing same services at the newRelease that have originally been used to generate the same data inside the oldRelease
  * Redirect process snippets inside existing applications from addressing the oldRelease to addressing the newRelease. The oldRelease is addressing the same Management Requests, which it originally used to become part of the process, but now with the contact information of the newRelease
* Add a new Forwarding box for every Consequent Request, which would differ in parameters or body, to the template
  * Consequent Requests are a subset of the Operation Clients defined in the Service Template
  * Consequent Requests will be found in the blue areas of the Service Template; the Operation Clients marked in grey should already been covered by the Forwardings marked in grey
  * Presumably, most or all Operation Clients from the blue area will require being covered by one or several Forwardings
* Note the Consequent Requests into the Forwarding boxes
* Identify the type of Forwarding
  * Invariant Process Snippets do have invariant number of Consequent Requests
  * Subscriptions allow increasing the number of Consequent Requests
* Assign meaningful names to the Forwardings
  * The names of Process Snippets shall contain “Causes”, e.g. ServiceRequestCausesLoggingRequest
  * The names of Subscriptions shall end on “Notification”, e.g. DeregistrationNotification
* Add Management Requests (double check names to distinguish process snippets and subscriptions)
  * Management Requests are for configuring the Forwarding. Because the Operation Server is invariant, configuration is mostly focused on Operation Clients. Configuration usually concerns where to send the Consequent Request and when to (start) sending.
  * The Forwarding box distinguishes Management Requests by effect on the internal model structure
  * The Management Request stated in “operation client creation” has to contain all necessary information (e.g. operation, IP address and port) about where to send the Consequent Request
  * The Management Request stated in “fc-port creation” is used for starting the forwarding
  * The Management Request stated in “fc-port deletion” is used for stopping the forwarding
  * The Management Request stated in “operation client deletion” is used for stopping the forwarding and deleting the client server relationship inside the data of the application
  * These different types of Management Requests are required, because necessary information inside the requests are sometimes provided by different sources. E.g. the planned receiver of the Consequent Request has to inform about its operation and IP, but the actual sending of the Consequent Request has to be approved by another application
  * Management Requests are a subset of the Operation Servers defined in the Service Template
  * Management Requests, which are required to describe additional Forwardings are expected to be found in the green area or the Service Template
  * Forwardings, which are managed by Operation Servers that are marked in grey, have already been described and are marked in grey color in the Forwarding Template
  * Sometimes, the Initiating Request is identical with the Management request. E.g. in case of the /v1/register-yourself, the prompt to register at the RegistryOffice contains the IP address and port of the RegistryOffice. In such case, just put “same request” to indicate that management and initiation is actually executed by the same request. If two separate requests would be required, the service name is to be stated twice
