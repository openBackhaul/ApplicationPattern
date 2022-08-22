# Testing Applications
## Infrastructure
### SDN Laboratory
Software Defined Networking (SDN) that uses open protocols to provide centralized, programmatic control and network device monitoring. In SDN laboratory, we have some general concepts like Controllers, Mediators, Network Elements and SDN Applications.

**Concepts**
* [SDN Introduction](../Introduction/Introduction.md)
* [General Concepts](./Infrastructure/SdnLaboratory/Overview/OverviewandGeneralConcepts.md)

### [Fake IP Addresses](./Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md)

## Tools
To Achieve automated testing and delivery process, required SDN pipeline dockerize environment setup using below mentioned tools and further concepts gives us how NodeJS applications deploy as a docker container through Jenkins and running automated test suites for every commit in GitHub develop branch.
### Jenkins
Jenkins is an open source continuous integration/continuous delivery and deployment (CI/CD) automation software DevOps tool written in the Java programming language. It is used to implement CI/CD workflows, called pipelines.

#### Why Jenkins as CI tool
Jenkins is a software that allows continuous integration. Jenkins will be installed on a server where the central build will take place. It will be used to build, test and deploy the software projects continuously which makes easier to developers to deliver the Software modules.

**Step-by-Step Guidelines**
* [Jenkins Workflow](./Infrastructure/Tools/Jenkins/Jenkinsworkflow.md)
* [Jenkins Installation](./Infrastructure/Tools/Jenkins/JenkinsInstallation.md)
* [Environment SetUp](./Infrastructure/Tools/Jenkins/EnvironmentSetup.md)
* [Install all required plugins](./Infrastructure/Tools/Jenkins/PluginInstallation.md)
* [Configure master-slave configuration](./Infrastructure/Tools/Jenkins/MasterSlaveConfiguration.md)
* [Email Notification configuration](./EmailNotificationConfiguration.md)
* [Jenkins Jobs for SDN project](./Infrastructure/Tools/Jenkins/JenkinsJobsAndSDNDeployment.md)

**Documents**
* [Installation of Jenkins](https://www.jenkins.io/doc/book/installing/)
* [Downloadnewplugins](https://updates.jenkins-ci.org/download/plugins/)
### Git, Github
It is a free and open source distributed version control system and easy to learn. It is used more efficiently to manage git repositories on centralized server. 
Git makes it easy to use by users:
- Keep track of code history
- Collaborate on code as a team
- See who made which changes
- Deploy code to staging or production

**Step-by-Step Guidelines**
* [More about Git, Git hub Installation and Workflow](../PreparingSpecifying/PreparingSpecifying.md#github-git-and-visual-studio-code)
* [Frequently used Git Adhoc Commands](./Infrastructure/Tools/Git/GitCommands.md)

 **Documents**
* [More About GIT](https://docs.github.com/en/get-started/using-git/about-git )
* [More about GIT commands](https://docs.github.com/en/get-started/using-git/about-git ) 

### Docker
Docker is an open source platform that enables developers to build, deploy, run, update and manage containers of applications. It is used to call as configuration management tool that is used to automate the deployment of software in lightweight containers which can run on any OS environment. These containers help applications to work efficiently in different environments. docker Containerization is very friendly in building and deploying the applications and below are advantages over docker.

**Concepts**
* [Advantages of Docker](./Infrastructure/Tools/Docker/DockerIntroduction.md#advantages-of-docker)
* [Docker objects](./Infrastructure/Tools/Docker/DockerIntroduction.md#docker-objects)

**Step-by-Step Guidelines**
* [Docker Installation](./Infrastructure/Tools/Docker/Installation.md)
* [Docker adhoc commands](./Infrastructure/Tools/Docker/DockerUsefulCommands.md)
* [Docker Volumes](./Infrastructure/Tools/Docker/DockerVolumes.md)
* [Docker Usage in Microwave SDN Laboratory](./Infrastructure/Tools/Docker/UtilizationInSDN.md)
* [Example Application RegistryOffice](./Infrastructure/Tools/Docker/UtilizationInSDN.md#dockerized-sdn-application-with-registryoffice-example)

**Documents**
* [Docker Installation Process for RHEL](https://linuxconfig.org/how-to-install-docker-in-rhel-8)
* [Docker Installation Process for Ubuntu]( https://phoenixnap.com/kb/install-docker-on-ubuntu-20-04)
* [Basics of Docker](https://docs.docker.com/engine/ )
* [Docker Adhoc Commands reference](https://docs.docker.com/engine/reference/commandline/docker/)
* [Docker volumes reference](https://docs.docker.com/storage/volumes/)
### Newman and newman-reporter-htmlextra
Newman is a command-line collection runner for Postman. It allows us to run and test a Postman collection directly from the command-line. It is built with extensibility in mind so that can easily integrate it with continuous integration servers and build systems.

**Step-by-Step Guidelines**
* [Newman Installation](./Infrastructure/Tools/Newman/Newman.md#install-newman-and-newman-reporter-htmlextra)
* [Basic options and Usage](./Infrastructure/Tools/Newman/Newman.md#basic-options-and-usage)

**Documents**
* [NodeJs Installation on Redhat](https://linuxconfig.org/how-to-install-node-js-on-redhat-8-linux)
* [NPM Installation](https://linuxconfig.org/how-to-install-npm-on-redhat-8)
* [NodeJs Installation on ubuntu](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04)
* [Newman Installation](https://www.npmjs.com/package/newman)
* [Newman-reporter-htmlextra Installation](https://www.npmjs.com/package/newman-reporter-htmlextra)
### [HAScripts](./Infrastructure/Tools/Scripts/Scripts.md)

## SDN Application Pattern Deployment
 Currently, the application pattern is building an application layer on SDN controller using the microservice architecture where the complex applications are spilt into small pieces and make them run independently. 

![Overview](./Infrastructure/SDNApplicationPatternDeployment/Images/sdn%20application%20deployment.PNG)

To test the application pattern we are using CI/CD methodology which includes continuous integration and continuous delivery/continuous deployment. CI means the name itself explains us, developer makes the changes continuously and do continuos build, tests until requirement fulfilled, CI will make this process easier and it automatically integrates the changes into current repository and test the applications. CD is like continuous delivery/continuous deployment an automated delivery process which includes testing and delivery the SW. Once everything is fine in automation testing, continuos deployments performed in production environments.

**Step-by-Step Guidelines**
* [Application Deployment in Test Bed](./Infrastructure/SDNApplicationPatternDeployment/AppDeploymentInTestBed.md)
* [Application Deployment in Production](./Infrastructure/SDNApplicationPatternDeployment/AppDeploymentInProd.md)

## Acceptance Testing
Acceptance testing is a quality assurance (QA) process and this technique performed to determine whether software system has met the user/business requirement specifications. It evaluate the quality of software. Acceptance Testing run in testbed environment and if everything is ok from acceptance testing then approve the build to production environment to deploy.

**Step-by-Step Guidelines**
* [Automated Pipeline Flow](./AcceptanceTesting/Overview/pipelineconfiguration.md) 

## Integration Testing
Integration Testing is a finalized testing of software product. Normally software products are divided into different modules and here SDN applications are also developed as individual services. This testing verifies that  software modules are integrated logically and tested as a group. The purpose of this level of testing is to expose defects in the interaction level and checks the proper service/data communications happen among modules/Applications.

**Step-by-Step Guidelines**
* [Automated Pipeline Flow](./IntegrationTesting/Overview/pipelineconfiguration.md)

[<- Back to Specifying](../SpecifyingApplications/SpecifyingApplications.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)