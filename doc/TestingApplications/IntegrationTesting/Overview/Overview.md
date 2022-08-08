### Integration Testing
### Concepts
- Overview
- Configure Pipeline job for running Integration test cases
    - source stage
    - Setup to run postman collection file
    - Run the test suites using newman
    - Results available
    - Email Notification
    
#### Overview: 
Integration Testing is a finalized testing of software product. Normally software products are devided into different modules and here SDN applications are also developed as individual services. This testing verifies that  software modules are integrated logically and tested as a group. The purpose of this level of testing is to expose defects in the interaction level and checks the proper service/data communications happen among modules. 

#### Configure Pipeline job for running Integration test cases
    
- source stage
- Setup to run postman collection file
- Run the test suites using newman
- Results available
- Email Notification

![IntegrationFlow](./../Images/IntegrationFlow.PNG)

#### Source stage : 
Take clone from the github of current testcases

#### Setup to run postman collection file : 
- Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json with "typeOfTesting": "Integration"
- Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json file with proper "userName" and "authorizationCode" to access the applications from jenkins
-  Update the file RegistryOffice_0.0.1_tsi.date.time+data.no.json "serverUrl" with current URL of application which is up and running
- Finally, makesure that the application swagger loadfile should be updated with proper application pattern URL's

#### Run the test suites using newman

        ex: newman run RegistryOffice_0.0.1_tsi.date.time+testcases.1.postman_collection -d RegistryOffice_0.0.1_tsi.date.time+data.no.json -r htmlextra,cli --reporter-htmlextra-logs

#### Results available:
As part of pipeline configuration once setup and run the test suites, we can also configure the workspace. Means after executing the suites, the results are available in a server path of **/var/lib/jenkins/workspace/RO_Testcases/newman**

    http://10.0.3.4:1234/view/Applications/job/Registry_Office/2/

#### Email Notification

Once test suite execution is completed, then notification is sent to users. The notification contains execution reports and pipeline URL's.


[<- Back to AcceptanceTesting](../../AcceptanceTesting/Overview/Overview.md) - - - [Back to Testing Applications](../../../TestingApplications.md)