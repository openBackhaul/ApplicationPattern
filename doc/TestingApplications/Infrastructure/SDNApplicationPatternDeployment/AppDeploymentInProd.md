
## Application Deployment in Production 
Once the acceptance testing is passed in testbed, the respective build/image will be promoted to production environment. There is no direct connectivity between testbed and production environments. so **the images shall be manually transferred into the production app server**. 

Below is the procedure to run the pipeline job for deployment and testing further application in jenkins.

## Automated Pipeline Steps
Configure and install the necessary tools in production test server same as test server in test environment.
- Pipeline job creation
- Build declarative pipeline script
- Verification of applications status
- Run Automation testsuites
- Email Notification
 
### Pipeline job creation with required configuration
[Please refer the previous section for creating the jenkins job and choose pipeline](../Tools/Jenkins/JenkinsJobsAndSDNDeployment.md#list-of-jenkins-jobs)

### Build declarative pipeline script 
* Manually transfer the tar file from testbed into production server
* Load the docker image using docker command
* Run Docker container using loaded image
* Configure the email notification
* Execute automated integration testsuites and collects the html test reports

The following provided format and required steps shall be added as per requirement.

    pipeline {
      agent {
        label 'Appserver'
       }
     stages {
    stage ('load the docker image'){
    load the image using docker load command
    } 
    stage ('Run Docker container using image') {
    create container from image using docker run command
    }
    stage ('notification') {
    send email with all details to recipients
    }
      }
    }

**Note** : above provided sample script code is just an example, based on the requirement user can develop his own groovy script/shell script.

### Verification of application status
Once Applications (ex: RO,TAR,EATL etc) are deployed, go to the browser and check the Ip address with port XXXX (exposed in docker file) is accessible or not. if yes, the application swagger is up and running without any issues.
    
Below is the format of application swagger

    http://<serverIp>:<port>/docs/

Example: RegistryOffice application which deployed already in environment.

    http://125.4.5.11:1234/docs/

![Example RO](Images/Ro.png) 

### Run Automation testsuites 
Integration Testing job is configured to run only on production servers and these testsuites are executed immediately after application deployment. 

 - [**Integration testing procedure**](../../IntegrationTesting/Overview/pipelineconfiguration.md)

### Email Notification
Once test suite execution is completed/deployment is done, the notification with execution reports and job URL's will be sent to configured developers and cicd team members.


[<- Back to SDNApplicationDeploymentInTestBed](./AppDeploymentInTestBed.md) - - - [Back to main Testing Applications ->](../../TestingApplications.md)