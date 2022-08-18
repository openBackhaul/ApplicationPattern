# Individual services

 * All the individual request are specific the current application's use-case.
 * To understand the requirement , the Open API Specification and load file shared for this application needs to be understood.
 * All the Individual request needs to send the following three parameters in the response header , 
   * x-correlator : s'UUID for the service execution flow that allows to correlate requests and responses. Its value must be identical at the response compared with its corresponding request'
   * exec-time : reporting the total elapsed time for the execution, including all the additional processing needed to retrieve the data from the backend service. Expressed in milliseconds'
   * life-cycle-state : Life cycle state of the consumed service
   * backend-time : reporting the elapsed time for data retrieval from the backend (service invocation, database access…). Expressed in milliseconds
 * Using the JSONDriver in the DatabaseDriver module of the ApplicationPattern the manipulation of the CONFIGFile this shall be done with minimum effort. 
 * All the Individual requests shall be approved by AdministratorAdministration application. Please refer [Authorization](../ConceptOfAuthenticationAuthorization/ConceptOfAuthenticationAuthorization.md) for further details.
 * All the individual requests shall be logged to the OAMLog application. Please refer [logging](../ConceptOfLogDirection/ConceptOfLogDirection.md) section for further details.



[<- Back to Code Collaboration](CodeCollaboration.md)  - - - [Up to Integrating load file](IntegratingLoadFile.md) 

