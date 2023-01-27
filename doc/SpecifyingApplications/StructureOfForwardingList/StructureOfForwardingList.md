# Structure of the ForwardingList


### Arrangement of Blocks

The template of the ForwardingList already contains a lot of blocks that are describing _Forwardings_.  
These blocks are arranged more or less according to the sequence of application.  

It starts with initiating the registration at the RegistryOffice.  

Receiving a prompt for embedding into the application layer results in starting the handover process on the old release of the application. (By the way: Don't delete this _Forwarding_. Even the first release of an application requires it. The first release needs calling its own _/v1/bequeath-your-data-and-die_ service for self-configuration. The _oldRelease_ in the _ServiceList_ and the CONFIGfile needs to point to the first release in this case.)  

Meanwhile, the ExecutionAndTraceLog, OamLog and AdministratorAdministration might have sent their subscriptions.  

After configuring these operation support features, the individual embedding process has to be described. Several "TODO:" comments are supporting arranging these _Forwardings_. Details can be found below.  

The later part of the embedding process is following. It is identical on all applications.  

Beneath the _Forwardings_ forming the embedding process, the communication with the _ApplicationLayerTopology_ gets defined.  

The _Forwardings_, which are individual to your application, have to be added at the end of the _ForwardingList_. It is recommended to arrange also those _Forwardings_ according to the sequence of application.  


### Details on the TODOs

_TODO: All service requests to be complemented_  
The complete list of individual services that you added to the _ServiceList_ has be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: Potentially add Forwardings for configuring INDIVIDUAL subscriptions on NewRelease_
This section is for preparing for a later update process to a new release of your application.  
If your application would offer subscriptions to other applications, subscriptions that might already exist at the time of the future upgrade shall be configured by the old release on the new release of your application.  
The following example shows the old release of the _RegistryOffice_ addressing the _/v1/notify-approvals_ at the new release of the _RegistryOffice_.  
While subscribing for ApprovalNotifications at the new release, the old release of the _RegistryOffice_ is faking being an application that subscribed for these notifications at the old release in past.  
There are no _Managements_, because the _Forwarding_ gets already defined during design time of the application.  
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
If your application would store own data into a DATAfile or the CONFIGfile (e.g. _ProfileInstances_), these data should be transferred during upgrade process.  
Most likely your application will learn its application data from other applications calling its _OperationServers_.  
The same _OperationServers_ must be implemented by the succeeding release of the application (n-1 backward compatibility).  
Due to this design rule, it can be presumed that the same services are available for transferring data during the upgrade process.  
So the old release calling the same _OperationServers_ at the new release is the way the data gets transferred.  
There are no _Managements_, because the _Forwarding_ gets already defined during design time of the application.  
The following example shows the old release of the _RegistryOffice_ addressing the _/v1/register-application_ at the new release of the _RegistryOffice_ for transferring the list of applications that registered in past.  
(Be aware that in this particular case, the entire registration and embedding process is initicated on the individual applications.)  
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
This section is for preparing for a later update process to a new release of your application.  
If the old release of your application would have subscribed for notifications at some 3rd applications, it would now send another subscription to these applications.  
This time, the subscriptions would not contain contacts of the old release, but those of the new release.  
The following example shows the old release of the _TypeApprovalRegister_ addressing the _/v1/inquire-application-type-approvals_ at the _RegistryOffice_ for prompting it to request for type approval information at the new release of the _TypeApprovalRegister_.  
```
  - forwarding-name: PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR
    uuid: tar-2-0-1-op-fc-im-112
    forwarding-type: InvariantProcessSnippet
    management-requests:
      operation-client-update:
      fc-port-update:
      fc-port-deletion:
      operation-client-deletion:
    initiating-requests:
      - server-name: /v1/bequeath-your-data-and-die
        uuid: tar-2-0-1-op-s-im-000
    consequent-requests:
      - client-name: RegistryOffice://v1/inquire-application-type-approvals
        uuid: tar-2-0-1-op-c-im-ro-2-0-1-000
```

_TODO: Potentially add Forwardings for ending INDIVIDUAL subscriptions to OldRelease_
This is the last section for preparing for a later update process to a new release of your application.  
If the old release of your application would have subscribed for notifications at some 3rd applications, it would now unsubscribe at these applications.  
The following example shows the old release of the _TypeApprovalRegister_ addressing the _/v1/end-subscription_ at the _RegistryOffice_.  
Because the _TypeApprovalRegister_ subscribed for several kinds of notifications at the _RegistryOffice_ the _/v1/end-subscription_ would have to be sent for several times with different content. This doesn't need to be documented in the _ForwardingList_.  
```
  - forwarding-name: PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease
    uuid: tar-2-0-1-op-fc-im-114
    forwarding-type: InvariantProcessSnippet
    management-requests:
      operation-client-update:
      fc-port-update:
      fc-port-deletion:
      operation-client-deletion:
    initiating-requests:
      - server-name: /v1/bequeath-your-data-and-die
        uuid: tar-2-0-1-op-s-im-000
    consequent-requests:
      - client-name: RegistryOffice://v1/end-subscription
        uuid: tar-2-0-1-op-c-im-ro-2-0-1-003
```

_TODO: All INDIVIDUAL service requests, which are updating an LTP, to be complemented_
This section is for configuring the communication to the _ApplicationLayerTopology_.  
If receiving a request at some of your individual _OperationServers_ might lead to creation or changing an LTP, the _ApplicationLayerTopology_ needs to be informed about this change.  
The list of individual services that might have such impact needs to be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: All INDIVIDUAL service requests, which are deleting an LTP, to be complemented_
This section is for configuring the communication to the _ApplicationLayerTopology_.  
If receiving a request at some of your individual _OperationServers_ might lead to deletion of an LTP, the _ApplicationLayerTopology_ needs to be informed about this change.  
The list of individual services that might have such impact needs to be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: All INDIVIDUAL service requests, which are updating an FC, to be complemented_
This section is for configuring the communication to the _ApplicationLayerTopology_.  
If receiving a request at some of your individual _OperationServers_ might lead to a change of a _Forwarding_ (like e.g. adding a new _Output_) inside your application, the _ApplicationLayerTopology_ needs to be informed about this change.  
The list of individual services that might have such impact needs to be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: All INDIVIDUAL service requests, which are updating an FC-Port, to be complemented_
This section is for configuring the communication to the _ApplicationLayerTopology_.  
If receiving a request at some of your individual _OperationServers_ might lead to a change of an _Output_ of an existing _Forwarding_ (e.g. redirecting the reaction of an InvariantProcessSnippet) inside your application, the _ApplicationLayerTopology_ needs to be informed about this change.  
The list of individual services that might have such impact needs to be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: All INDIVIDUAL service requests, which are deleting an FC-Port, to be complemented_
This is the last section for configuring the communication to the _ApplicationLayerTopology_.  
If receiving a request at some of your individual _OperationServers_ might lead to removing an _Output_ from an existing _Forwarding_ (e.g. unsubscribing) inside your application, the _ApplicationLayerTopology_ needs to be informed about this change.  
The list of individual services that might have such impact needs to be copied and inserted into here.  
Use CTRL+h for replacing 'operation-name:' by 'server-name:'.  
Adapt the indents.  

_TODO: Potential INDIVIDUAL Forwardings to be added_
All the forwardings, which are individual to your application, have to be added here.  
