# Jenkins

**Concepts**
This chapter gives us more understanding about the jenkins used as CI tool in SDN Application Pattern.
* Overview
* Why jenkins as CI tool
* Workflow
* Install Jenkins and Setup
    - Prerequisites
    - Jenkins-installation-steps
    - Enabled firewall support for XXXX(default 8080) port
    - Install all required plugins
        - Installing it through our Jenkins dashboard
        - Download and install manually
    - Configure master-slave configuration
* List of Jenkins Jobs for this SDN project
* SDN deployments for ApplicationPattern
    - Application Deployment in Test Bed
        - Create pipeline jobs with required configuration
        - Pipeline Stages
        - CI/CD Pipeline Flow
        - Automated pipeline scripts
        - Verify the applications are up and running
        - Run the Automation testsuites
          Acceptance Testing
            - source stage
            - Setup to run postman collection file
            - Run Acceptance test cases
        - Email Notification
    - Application Deployment in Production
        - Create pipeline jobs with required configuration
        - Pipeline Stages
        - CI/CD Pipeline Flow
        - Automated pipeline scripts
        - Verify the applications are up and running
        - Run the Automation testsuites
          Integration Testing
            - source stage
            - Setup to run postman collection file
            - Run Acceptance test cases
        - Email Notification


#### Overview 
Jenkins is an open source continuous integration/continuous delivery and deployment (CI/CD) automation software DevOps tool written in the Java programming language. It is used to implement CI/CD workflows, called pipelines.
#### Why jenkins as CI tool
Jenkins is a software that allows continuous integration. Jenkins will be installed on a server where the central build will take place. It will be used to build, test and deploy the software projects continuosly which makes easier to developers to deliver the Software modules.
#### workflow: 
Here's how Jenkins elements are put together and interact.

- Developers commit the changes into repository 
- The Jenkins CI server checks the repository at regular intervals and pulls new changes from repository
- Jenkins server trigger automatically to create a build with the changes made and run it through testing. 
- If build fails, Jenkins will send a notification to developers with errors and job details sothat they can work on failures.
- If build is successful, trigger next step as testing the automated tests, once everything is fine, the build/changes are ready to deploy.
- If the code is error-free and automated test suites passed, the deployment team will be notified with the build details for deploying into the production server.
      
The main advantage of jenkins is having 1000+ plugin's to ease our work. If we use different tools/features based on requirement, then need to install plugins. For example Git, Maven 2 project, HTML publisher, docker, Jmeter etc. 
     
The whole process is eleminated the manual intervention and designed to ensure the fast flow of reliable code from the development team to the production environment, enabling Continuous Delivery (CD) and Continuous Deployment.

#### Install Jenkins:
##### Prerequisites:
Before installing the jenkins, it is recommend to check whether the java installed or not. Based on OS, choose the installation commands.

###### Install Java:
     apt install default-jre for ubuntu
     apt install default-jdk for ubuntu
     
     dnf update for rhel
     dnf install java-1.8.0-openjdk-devel #install JDK 8
     dnf install java-11-openjdk-devel #install JDK 11

    Check the version to verify whether installed or not.
     java –version
     javac –version

Referral links:
* [Installjenkins on ubuntu steps](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-18-04)
* [InstallJenkins on rhel steps](https://www.tecmint.com/install-java-on-rhel-8/)

**Jenkins-installation-steps:** 

It is recommend to update the local repository server using "**apt update**" and  install the jenkins.

    apt install jenkins for ubuntu
    yum install jenkins for redhat
    
  **Start Jenkins:** : Let’s start Jenkins by using systemctl
  
        systemctl start jenkins
        
  **Status Jenkins:** : Check the status using below command
  
        systemctl status jenkins
        
If everything went well, the beginning of the status output shows that the service is active and configured to start at boot: 

**Output**

    jenkins.service - LSB: Start Jenkins at boot time 
    Loaded: loaded (/etc/init.d/jenkins; generated) 
    Active: active (exited) since Fri 2020-06-05 21:21:46 UTC; 45s ago 
     Docs: man:systemd-sysv-generator(8) 
     Tasks: 0 (limit: 1137) 
     CGroup: /system.slice/jenkins.service 

Once Jenkins is up and running, let’s adjust our firewall rules so that we can reach it from a web browser to complete the initial setup. 

**Enabled firewall support for XXXX(default 8080) port:**

Now jenkins is up and running on XXXX port.

    Firewall-cmd - -list-all
    Firewall-cmd - -add-port=XXXX/tcp - -permanent

Once we done the installation and firewall setup, the jenkins is running on  **http:<Server-Ip>:<XXXX>**

**Unlock Jenkins** :

Once opened the URL, which displays the location of the initial password on unlock screen and enter the password key from /var/lib/jenkins/secrets/initialAdminPassword file. You can access Jenkins by providing the password after reading the file. 

**Image**

![UnlockImage](./Images/UnlockPage.png)

The next screen presents the option of installing suggested plugins or selecting specific plugins then go ahead with suggested plugins.

![SuggestedPlugins](./Images/suggestedplaugins.png)

Wait for sometime to install and setup the jenkins environment with suggested plugin's. Create an admin user. Make sure you remember the username and password, as they are the credentials for accessing the Jenkins WebUI. 

![adminusercreation](./Images/adminuser.png)

specify if you wish to change the port for Jenkins or else continue with the default port. 

![configuration](./Images/instanceconfiguration.png)
 
Jenkins setup is complete and it can be accessed with the URL that is configured for it. 
Then click on the **start Using Jenkins** to open the Jenkins Dashboard. 

![jenkinsready](Images/jenkinsready.png)

### Install all required plugins
  In Jenkins by default, we install all required plugins while installing Jenkins. If required any other plugins, we can install manually after configuring Jenkins by the below procedure. 

Example required plugins: 
 GitHub integrated plugin
 Docker plugin 
 JUnit Plugin 
Pipeline Utility Steps and etc.

There are two methods for installing plugins in Jenkins:

* Installing it through our Jenkins dashboard
* Downloading the plugin from Jenkins website and installing it
manually.

#### Plugin manager
The Plugin Manager allows us to manage to enable and disable the plugins and to edit a plugin's details and options. It is also useful for quickly enabling/disabling multiple plugins. 

![](Images/pluginmanager.png)

#### Installing it through our Jenkins dashboard
To install plugins first login into Jenkins under Jenkins Dashboard left side we have manage Jenkins options click on that then select manage plugins and under available section search for required plugin and select it then click on install without restart.

For example now we are trying to integrate the git plugin in jenkins and find the steps below.

In the Home screen of the Jenkins (Jenkins Dashboard), click on the Manage Jenkins option on the left hand side of the screen.

![JenkinsHome](images/jenkins_home.png)

* click on the Manage Plugins option.

![JenkinsPlugins](images/clickmanageplugins.png)

* click on the "Available tab".

![Jenkinsplugins](images/availableplugin.png)

* The "Available" tab gives a list of plugins which are available for downloading. In the Filter tab type, type the "Git Plugin". select the plugin and Click on the "install without restart". 
We can also click on "Download now and install after restart" button in which the git plugin is installed after restart.

![Jenkinsrestsrt](images/install%20without%20restart.jpg)


![InstallPage](images/installingimage.jpg)

* To check Git plugin installed then go to "Installed" tab and check.

![InstallPage](images/Gitplugin.png)

The procedure is same for all other required plugin installation.


#### Downloading the plugin from Jenkins website and installing it manually.

If any plugins we required to upgrade or downgrade first, we download plugins from official plugins site in our local then upload it to Jenkins. Refersite for [Downloadnewplugins](https://updates.jenkins-ci.org/download/plugins/).

**Note**: download plugins with .hpi extension. 

To upload plugins to Jenkins Goto, Manage Jenkins==>manage plugins==> under advance section ==>under deploy plugin click on choose file then upload earlier download plugin.

![deployimage](images/deployplugin.png)

### Configure master-slave configuration for deploying application 

The Jenkins master acts to schedule the jobs, assign slaves, and send builds to slaves to execute the jobs. It will also monitor the slave state (offline or online) and get back the build result responses from slaves and the display build results on the console output. 

Open Jenkins Dashboard==>Click on Manage Jenkins==>Click on Manage Nodes and Clouds==>Newnode. Once configured the server with node details and home directory. 

The complete set up is ready in current SDN controller application testing.

### List of Jenkins Jobs for this SDN project

- PollSCM trigger jobs for auto builds whenever new commit merged in remote repositories
- Mediator upgrade and test suites testing
- Automated sanity test suites
- Controller Jobs
- Dockerized pipeline Jobs for Application Deployments
- Acceptance testing jobs for GitHub applications 
- Integrations testing jobs for GitHub applications 

### SDN deployments for ApplicationPattern

We have two environments and Here found different processes to deploy the applications in test bed and production.

   1. Application Deployment in Test Bed
   2. Application Deployment in Production: 

Note: All [required tools](https://github.com/openBackhaul/ApplicationPattern/tree/develop/doc/TestingApplications/Infrastructure/Tools) should installed and available Java, docker, Jenkins setup, Nodejs, NPM, Newman, Newman reporter htmlextra package and GIT. Then only a successful pipeline deployment and testing is done in both testbed and production environment.

 #### Application Deployment in Test Bed

#### Automated Pipeline Steps
- Create pipeline jobs with required configuration
- Pipeline Stages 
- CI/CD Pipeline Flow
- Declarative pipeline script
- Verify the applications are up and running
- Run the Automation testsuites
 
##### Create pipeline jobs with all necessary configurations
- Goto DashBoard and select and create new item with pipeline job
- Once job created and Configure the job with all details that required like PollSCM time interval to perform monitering the pipeline 
- Then develop and add the pipeline script to current pipeline job
- Apply and save the configurations

##### Pipeline Stages
        
- Source stage 
- Docker build stage 
- Publish Docker image 
- Deploy application as a container.(TestLab) 
- Save docker image in local server.
- Testing stage(Acceptance tests in TestLab and Integration tests in Production) 
- Approve build for production if everything ok in testing stage 

##### CI/CD Pipeline Flow
   
![cicdflow](images/cicdflow.jpg)

##### Application deployment using pipeline scripts

In testbed, should follow all stages like clone, build, deploy and test the applications.   Once everything is fine, we will save the docker imageas tar file format in WebApp server.

Pipeline Configuration : 
        
    pipeline {
      stage ('source stage') - clone the repository in this stage
      stage ('setup and image build') - clean the old container and build new image
      stage('Run Docker container') - expose the port and run the container from image
      stage('save Docker image') - save the docker images
    }
    
 ##### Verify the applications are up and running
Once pipeline script executed and the applications(ex: RO,TAR,EATL etc) deployed using the dockrized containers. Go to the browser and check with the Ip address with port XXXx port mentioned in docker file.
Verify the application swagger is up and running.

    http://<serverIp>:<port>/docs/
    ex: http://125.4.5.11:1234/docs/

![RO](images/Ro.png) 

##### Run the Automation testsuites 
Automation testsuites running once after the application deployment.
 - [Acceptance Testing](../../../AcceptanceTesting/Overview/Overview.md)

#### Application Deployment in Production: 
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
##### CI/CD Pipeline Flow
![pipeline](./Images/cicdflow.jpg)

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

![RO](images/ro.png) 

#### Run the Automation testsuites 
Automation testsuites running imediately after the application deployment.Integration Testing run in production/preprod environment 

 - [Integration Testing](../../../IntegrationTesting/Overview/Overview.md)
 
 ### Summary: 
 With the dockrized jenkins solution , continous integration and continuos delivery/deploy happening in current SDN environment.