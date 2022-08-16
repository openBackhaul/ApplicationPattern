### Configure Pipeline job for running Acceptance test cases
Once Application deployed and automatically acceptance testing performed.
- source stage
- Setup to run postman collection file
- Run Acceptance test cases
- Results available
- Email Notification

![Acceptance Testing](../Images/AcceptanceTestingflow.PNG)

#### Source stage : 
Take clone from the github of current testcases
     
#### Setup to run postman collection file : 
- Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json with "typeOfTesting": "Acceptance"
- Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json file with proper "userName" and "authorizationCode" to access the applications from jenkins
- Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json "serverUrl" with current URL of application which is up and running
-  Finally, make sure that the application swagger loadfile should be updated with proper application pattern URL's

#### Run the test suites using newman
        
        ex: newman run RegistryOffice_0.0.1_tsi.date.time+testcases.1.postman_collection -d RegistryOffice_0.0.1_tsi.date.time+data.no.json -r htmlextra,cli --reporter-htmlextra-logs

#### Results available

As part of pipeline configuration once setup and run the test suites, we can also configure the workspace. Means after executing the suites, the results are available in a server path of **/var/lib/jenkins/workspace/RO_Testcases/newman**
    
    http://serverip:port/view/Applications/job/Registry_Office/2/

#### Email Notification

Once test suite execution is completed, then notification is sent to users. The notification contains execution reports and pipeline URL's.

[<- Back to ConceptsAndOverview](./ConceptsAndOverview.md) - - - [Back to main Testing Applications ->](../../TestingApplications.md) - - - [A head to Integration Testing](../../IntegrationTesting/Overview/ConceptsAndOverview.md)