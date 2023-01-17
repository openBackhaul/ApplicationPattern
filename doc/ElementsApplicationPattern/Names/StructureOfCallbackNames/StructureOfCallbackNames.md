# Structure of Names of Callbacks

The _ForwardingName_, which is identifying a _Forwarding_ in the _ForwardingList_, will be re-used for identifying the resulting _ForwardingConstruct_ in the _CONFIGfile_ and for identifying the resulting callback in the OpenApiSpecification.  

It is very much recommended to invest sufficient time and energy into definition of very descriptive names.  
Ideally, even uninformed readers get enabled to understand the target of some callback or the relationship described by some _ForwardingConstruct_ exclusively from its naming.  

_ForwardingNames_ shall follow the UpperCamelCase spelling, means they shall start with a capital letter and every new word shall be indicated by a capital letter, too.  

In principle, there is no limitation to the length of the _ForwardingNames_. Because they shall explain the _Forwarding_, they are accepted to be a little longer, - maybe like a short sentence. Of course, transporting the same information with less words, would be preferred.  


### ProcessSnippets

_InvariantProcessSnippets_ are describing process flows, their _ForwardingName_ shall have the following structure:  
_[description of the input]_**causes**_[description of the output]_  

Description of the input:  
If the _OperationName_ of the _Input_ indicates an order to do something (e.g. _/v1/register-yourself_, _/v1/embed-yourself_), it might make sense to start the description of the input with 'PromptFor' and to complete it with the ordered activity (e.g. PromptForRegistering, PromptForEmbedding).  
If the nature of the _Input_ is more like a notification, which is indicating an event, it might make sense to just state the event (e.g. TypeApproval, OamRequest)  

Description of the output:  
The description of the output should indicate the nature of the consequent request:
- 'Request', might indicate a request for providing a service (e.g. RequestForBroadcastingInfoAboutServerReplacement, LoggingRequest)  
- 'Inquiry', might indicate a request for information (e.g. InquiryForAuthentication)  

In general, it is assumed that the addressed application is providing the service or information to the requesting application. If this would not be the case, this should be expressed in the description of the output. Source and destination should be indicated (e.g. RObeingRequestedToNotifyWithdrawnApprovalsToNewRelease).  
If the _Output_ might involve multiple consequent requests of the same or even different kinds, it might make sense to express their result in the description of the output (e.g. TransferOfListOfApplications, CalculateCapacity)  

Examples:
- PromptForEmbeddingCausesRequestForBequeathingData
- TypeApprovalCausesRequestForEmbedding
- PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease
- PromptForBequeathingDataCausesTransferOfListOfApplications


### Subscriptions

In case of _Subscriptions_, it should suffice stating the type of notification.  
If the notification is meant to address all applications of the application layer, this should be expressed by naming it broadcast.  

Examples:
- ApprovalNotification
- DeregistrationNotification
- LinkChangeNotification
- ServerReplacementBroadcast
- OperationUpdateBroadcast
