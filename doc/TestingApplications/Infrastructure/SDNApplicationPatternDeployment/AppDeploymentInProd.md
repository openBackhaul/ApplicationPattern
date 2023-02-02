
## Application Deployment in Production 
Once everything fine in test bed and acceptance test also passed then will promote the build to production. 
      
Here, we are not having connection directly between testbed and production, so **manually copying images into production app server**. Once copied, run the pipeline job in jenkins and deploy the applications.

### Pipeline configuration:
Here how we configure Pipeline job in testbed environment, in the same way we have to configure and install all necessary tools in test bed server.

### Automated Pipeline Steps
- Pipeline job creation
- Build the declarative pipeline script
- Verify the applications are up and running
- Run the Automation testsuites
 
### Create pipeline jobs with required configuration
[Please refer the previous section for creating the jenkins job and choose pipeline](../Tools/Jenkins/JenkinsJobsAndSDNDeployment.md#list-of-jenkins-jobs)

### Build the declarative pipeline script 
* Manually transfer the tar file from testbed into production server
* Load the docker image using docker command
- Run Docker container using loaded image
- Configure the email notification
- Execute automated integration testsuites and collects html test reports by test server. 

Basic scripting is provided and based on requirements we can use groovy scripts to write the pipeline scripts. Basic format provided here and required scripts and steps added as per requirement.

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

**Note** : above provided sample script code is just an example, based on requirements user can develop his own groovy script/shell script.

#### Verify the applications are up and running
   
Once Applications(ex: RO,TAR,EATL etc) deployed using the dockerize containers, Go to the browser and check the Ip address with port XXXX which exposed in docker file. Verify whether application swagger is up and running.
    
Below is the format for the swagger created for application pattern applications.

    http://<serverIp>:<port>/docs/
Below is the example of RegistryOffice application which deployed on testbed already and attached the picture.

    http://125.4.5.11:1234/docs/

![Example RO](Images/Ro.png) 

#### Run the Automation testsuites 
Automation testsuites running immediately after application deployment. Integration Testing job configured to run in production test server.

 - [**Integration testing procedure**](../../IntegrationTesting/Overview/pipelineconfiguration.md)

 
#### Email Notification
Once test suite execution is completed/deployment is done, the notification with execution reports and job URL's sent to developers and CICD team.


[<- Back to SDNApplicationDeploymentInTestBed](./AppDeploymentInTestBed.md) - - - [Back to main Testing Applications ->](../../TestingApplications.md)