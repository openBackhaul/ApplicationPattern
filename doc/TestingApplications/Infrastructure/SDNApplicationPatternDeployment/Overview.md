## SDN deployments for ApplicationPattern

**Concepts**

- Overview
- Application Deployment in Test Bed
    - Create pipeline jobs with required configuration
    - Pipeline Stages
    - CI/CD Pipeline Flow
    - Automated pipeline scripts
    - Verify the applications are up and running
    - Run the Automation testsuites
      - Acceptance Testing
    - Email Notification
- Application Deployment in Production
  - Create pipeline jobs with required configuration
  - Pipeline Stages
  - CI/CD Pipeline Flow
  - Automated pipeline scripts
  - Verify the applications are up and running
  - Run the Automation testsuites
    - Integration Testing
  - Email Notification

## SDN deployments for ApplicationPattern
### Overview:
Currently, the application pattern is building an application layer on SDN controller using the microservice architecture where the complex applications are spilt into small pieces and make them run independently. 

![Overview](Images/sdn%20application%20deployment.PNG)

To test the application pattern we are using the CI/CD methodology which includes continuous integration and continuous delivery/continuous deployment. CI means the name itself explains us, developer makes the changes continuosly and do continous build, tests until requirement fullfilled, CI will make this process easier and it automatically integrates the changes into current repository and test the applications. CD is like continuous delivery/continuous deployment an automated delivery process which includes testing and delivery the SW. Once everything is fine in automation testing, continous deployments perfomed in production environments.

To Achieve the automated testing and delivery process we required SDN pipeline dockerized environment setup using mentioned tools and further concepts gives us how NodeJS applications deploy as a container through Jenkins and running automated test suites for every commit in GitHub develop branch.

We have two environments and Here found different processes to deploy the applications in test bed and production.

   1. Application Deployment in Test Bed
   2. Application Deployment in Production:

In current setup, we are using two servers one for jenkins and another used for application deployments.

**[GitHub](../Tools/Git/Git.md)** :  used as Source code management versioning tool

**[Jenkins](../Tools/Jenkins/Jenkins.md)** :  used as CI tool 

**[Docker](../Tools/Docker/Docker.md)** :  used for deploying an application which involves application clone, build images and deploy as a container.

**[DockerVolume](../Tools/Docker/Docker.md)** : used to achieve applications Data Persistence storage 

**[Newman and htmlextra reporter](../Tools/Newman/Newman.md)**:  used for running the automated testing process for every applications

**[Highavailability](../Tools/Scripts/Scripts.md)** : used to moniter applications status

Note: All [required tools](https://github.com/openBackhaul/ApplicationPattern/tree/develop/doc/TestingApplications/Infrastructure/Tools) should installed and available Java, docker, Jenkins setup, Nodejs, NPM, Newman, Newman reporter htmlextra package and GIT. Then only a successful pipeline deployment and testing is done in both testbed and production environment.

### Application Deployment in Test Bed

#### Automated Pipeline Steps
- Create pipeline jobs with required configuration
- Pipeline Stages 
- CI/CD Pipeline Flow
- Declarative pipeline script
- Verify the applications are up and running
- Run the Automation testsuites
 
#### Create pipeline jobs with all necessary configurations
- Goto DashBoard and select and create new item with pipeline job
- Once job created and Configure the job with all details that required like PollSCM time interval to perform monitering the pipeline 
- Then develop and add the pipeline script to current pipeline job
- Apply and save the configurations

#### Pipeline Stages
        
- Source stage 
- Docker build stage 
- Publish Docker image 
- Deploy application as a container.(TestLab) 
- Save docker image in local server.
- Testing stage(Acceptance tests in TestLab and Integration tests in Production) 
- Approve build for production if everything ok in testing stage 

#### CI/CD Pipeline Flow
   
![cicdflow](Images/cicdflow.jpg)

#### Automated pipeline scripts

In testbed, should follow all stages like clone, build, deploy and test the applications.   Once everything is fine, we will save the docker imageas tar file format in WebApp server.

Pipeline Configuration : 
        
    pipeline {
      stage ('source stage') - clone the repository in this stage
      stage ('setup and image build') - clean the old container and build new image
      stage('Run Docker container') - expose the port and run the container from image
      stage('save Docker image') - save the docker images
    }
    
#### Verify the applications are up and running
Once pipeline script executed and the applications(ex: RO,TAR,EATL etc) deployed using the dockrized containers. Go to the browser and check with the Ip address with port XXXx port mentioned in docker file.
Verify the application swagger is up and running.

    http://<serverIp>:<port>/docs/
    ex: http://125.4.5.11:1234/docs/

![RO](Images/Ro.png) 

#### Run the Automation testsuites 
Automation testsuites running once after the application deployment.
 - [Acceptance Testing](../../../AcceptanceTesting/Overview/Overview.md)

### Application Deployment in Production: 
Once everything fine in test bed and acceptance test also passed then will promote the build to production. 
      
Here, we are not having connection directly between testbed and production, so **manually copy the images into production** server. Once copied, run the pipeline job in jenkins using docker containization tool and deploy the applications.

#### Pipeline configuration:
Here how we configure Pipeline job in testbed environment, in the same way we have to configure and install all necessary tools in Jenkins server of production.

#### Automated Pipeline Steps
- Create pipeline jobs with required configuration
- Pipeline Stages 
- CI/CD Pipeline Flow
- Declarative pipeline script
- Verify the applications are up and running
- Run the Automation testsuites
 
##### Create pipeline jobs with required configuration
- Goto DashBoard and select and create new item with pipeline job
- Once job created and Configure the job with all details that required like PollSCM time interval to perform monitering the pipeline 
- Then develop and add the pipeline script to current pipeline job
- Apply and save the configurations

##### Pipeline Stages 
- Take the copy of image into production server.
- Load the released docker image
- Run Docker container using image
- Testing stage(Integration tests in Production) 

##### Automated pipeline scripts
**Manual : Copy tar file into server**

##### Pipeline Configuration  
Basic scripting is provided and based on requirements we can use groovy scripts to write the pipeline scripts. Basic format provided here and required scripts and steps added as per requirement.

    pipeline {
      stage ('load the docker image'){
      load the image using docker load command
      } 
      stage ('Run Docker container using image') {
      create container from image using docker run command
      }
      stage ('notification') {
         send email with all details
         }
    }
    
#### Verify the applications are up and running
   
Once pipeline script executed and Applications(ex: RO,TAR,EATL etc) deployed using the dockrized containers and Go to the browser and check with the Ip address with port XXXx port mentioned in docker file. Verify the application swagger is up and running.
    
    http://<serverIp>:<port>/docs/
    ex: http://10.0.2.4:1234/docs/

![RO](Images/ro.png) 

Example structure of Applications deployed on docker engine:

![Allapplications in siglepage](Images/AllApplicationsexample.PNG)

#### Run the Automation testsuites 
Automation testsuites running imediately after the application deployment.Integration Testing run in production/preprod environment 

 - [Integration Testing](../../../IntegrationTesting/Overview/Overview.md)

 
#### Email Notification

Once test suite execution is completed, then notification is sent to users. The notification contains execution reports and pipeline URL's.
 
### Summary: 
 With the dockrized jenkins solution , continous integration and continuos delivery/deploy happening in current SDN environment.

[<- Back to Tools](../SdnLaboratory/Overview/Overview.md) - - - [Back to Testing Applications](../../../TestingApplications.md) - - [Ahead to SDN Testing ->](../../AcceptanceTesting/Overview/Overview.md)