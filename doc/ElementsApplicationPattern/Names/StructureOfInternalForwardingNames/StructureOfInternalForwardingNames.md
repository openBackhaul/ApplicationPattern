# Structure of Internal Forwarding Names  

The _ForwardingName_, which is identifying a _Forwarding_ in the _ForwardingList_, will be re-used for identifying the resulting _ForwardingConstruct_ in the _CONFIGfile_ and for identifying the resulting callback in the OpenApiSpecification.  

It is very much recommended to invest sufficient time and energy into definition of very descriptive names.  
Ideally, even uninformed readers could understand the logic, which is implemented by some _Forwarding_, from its naming.  

_ForwardingNames_ shall follow the UpperCamelCase spelling, means they shall start with a capital letter and every new word shall be indicated by a capital letter, too.  

In principle, there are no limitations to the length of the _ForwardingNames_.  
Because they shall actually explain the _Forwarding_, they are accepted to be a little longer, - maybe like a short sentence.  
Of course, transporting the same information with less words, would be preferred.  


### ProcessSnippets  

_InvariantProcessSnippets_ are describing process flows, their _ForwardingName_ shall have the following structure:  
_[description of the input]_**causes**_[description of the output]_  

Description of the input:  
If the _OperationName_, which is referenced as the _Input_, indicates an order to do something (e.g. _/v1/register-yourself_, _/v1/embed-yourself_), it might make sense to start the description of the input with 'PromptFor' and to complete it with the ordered activity (e.g. PromptForRegistering, PromptForEmbedding).  
If the nature of the _Input_ is more like a notification, which is indicating an event, it might make sense to just state the kind of event (e.g. TypeApproval, OamRequest).  

Description of the output:  
The description of the output should indicate the nature of the consequent action:  
- 'Request', might indicate asking for provissioning of a service (e.g. RequestForBroadcastingInfoAboutServerReplacement, LoggingRequest)  
- 'Inquiry', might indicate asking for information (e.g. InquiryForAuthentication)  

In general, it is assumed that the addressed application is providing the service or information to the requesting application. If this would not be the case, this should be expressed in the description of the output. Source and destination should be indicated (e.g. RObeingRequestedToNotifyWithdrawnApprovalsToNewRelease).  
If the _Output_ might involve multiple consequent requests of the same or even different kinds, it might make sense to express their consolidated result in the description of the output (e.g. TransferOfListOfApplications, RetrievingLiveNetworkInput)  

Examples:  
- PromptForEmbeddingCausesRequestForBequeathingData  
- TypeApprovalCausesRequestForEmbedding  
- PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease  
- PromptForBequeathingDataCausesTransferOfListOfApplications  
- PromptForCapacityCalculationCausesRetrievingLiveNetworkInput  


### Subscriptions  

In case of _Subscriptions_, it should suffice stating the type of notification.  
If the notification is meant to address all applications of the application layer, this should be expressed by naming it broadcast.  

Examples:  
- ApprovalNotification  
- DeregistrationNotification  
- LinkChangeNotification  
- ServerReplacementBroadcast  
- OperationUpdateBroadcast  
