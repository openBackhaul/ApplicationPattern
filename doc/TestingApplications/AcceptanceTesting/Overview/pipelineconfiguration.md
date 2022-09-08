### Acceptance Testing
**Configure Pipeline job for running Acceptance test cases**
Once Application deployed and automatically acceptance testing performed. For this, a pipeline script written and contains below stages.
- Source stage
- Setup to run postman collection file
- Run Acceptance test cases
- Results available
- Email Notification

![Acceptance Testing](../Images/AcceptanceTestingflow.PNG)

#### Source stage : 
clone the current testsuite repository from the github
     
#### Setup to run postman collection file : 
- Update the file <inputfile.date.time+data.no.json> with "typeOfTesting": "Acceptance"
- Update <inputfile.date.time+data.no.json> file with proper "userName" and "authorizationCode" to access the applications from Jenkins
- Update <inputfile.date.time+data.no.json> file with "serverUrl" with current URL of application where it is up and running
-  Finally, makesure that the application loadfile properly updated with latest data (Ip address and Ports of applications in database).

#### Run the test suites using newman
To run the suite, we are using below command.

 newman run <postmancollectionjsonfile> -d <inputfile.date.time+data.no.json> -r htmlextra,cli --reporter-htmlextra-logs

        Example command used for RO suite: newman run RegistryOffice_0.0.1_tsi.date.time+testcases.1.postman_collection -d RegistryOffice_0.0.1_tsi.date.time+data.no.json -r htmlextra,cli --reporter-htmlextra-logs

#### Results available

As part of pipeline configuration setup and running the test suites and also configure respective suite workspace. Means after executing the suites, the results are available in this workspace which is a server path **/var/lib/jenkins/workspace/< suitename>/newman**

    Example path for RO suite and collected results :
    **/var/lib/jenkins/workspace/RO_Testcases/newman**
    http://10.0.3.4:1234/view/Applications/job/Registry_Office/2/

#### Email Notification

Once test suite execution is completed, The notification with execution reports and job URL's sent to developers and CICD team.

[<- Back to main Testing Applications ->](../../TestingApplications.md)