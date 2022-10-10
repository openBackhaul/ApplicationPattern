# Testing Applications
## Infrastructure
### SDN Laboratory
Software Defined Networking (SDN) is an architecture that uses open protocols to provide centralized, programmatic control and network device monitoring. In SDN laboratory, we have some general concepts like Controllers, Mediators, Network Elements and SDN Applications.

**Concepts**
* [SDN Introduction](../Introduction/Introduction.md)
* [General Concepts](./Infrastructure/SdnLaboratory/Overview/OverviewandGeneralConcepts.md)

### Fake Addresses
**Concepts**
* [Fake IP Addresses](./Infrastructure/SdnLaboratory/FakeAddresses/IpAddresses.md)
* [Fake Index Aliases](./Infrastructure/SdnLaboratory/FakeAddresses/IndexAliases.md)

**Step-by-Step Guidelines**
* [Update Configuration](./Infrastructure/SdnLaboratory/IpAddresses/updateconfiguration.md)


## Tools
To achieve automated testing and delivery process, requires a SDN pipeline dockerize environment setup using below mentioned tools,which gives us how NodeJS applications deploy as a docker container through Jenkins and running automated test suites for every commit of GitHub develop branch.
### Jenkins
Jenkins is an open source continuous integration/continuous delivery and deployment (CI/CD) automation software tool written in Java programming language. It helps to automate the software activities like building, testing, deploying and used to implement CI/CD workflows, called pipelines which makes easier to developers to deliver the Software modules. It is the leading tool for CI.

**Concepts**
* [Jenkins Workflow](./Infrastructure/Tools/Jenkins/Jenkinsworkflow.md)
* [Email Notifications](./Infrastructure/Tools/Jenkins/EmailNotificationConfiguration.md)

**Step-by-Step Guidelines**
* [Jenkins Installation](./Infrastructure/Tools/Jenkins/JenkinsInstallation.md)
* [Environment SetUp](./Infrastructure/Tools/Jenkins/EnvironmentSetup.md)
* [Install required plugins](./Infrastructure/Tools/Jenkins/PluginInstallation.md)
* [Manage Users and Access levels](./Infrastructure/Tools/Jenkins/ManageUsers.md)
* [Configure master-slave configuration](./Infrastructure/Tools/Jenkins/MasterSlaveConfiguration.md)
* [Jenkins Jobs for SDN project](./Infrastructure/Tools/Jenkins/JenkinsJobsAndSDNDeployment.md)

**Documents**
* [Installation of Jenkins](https://www.jenkins.io/doc/book/installing/)
* [Download New Plugins](https://updates.jenkins-ci.org/download/plugins/)
* [Role based strategy](https://plugins.jenkins.io/role-strategy/)

### Git, GitHub
It is a free and open source distributed version control system and easy to learn. It is used more efficiently to manage Git repositories on centralized server. 
Git makes it easy to use by users:
- Keep track of code history
- Collaborate on code as a team
- See who made which changes
- Deploy code to staging or production

**Concepts**
* [Introduction to Git and GitHub](../PreparingSpecifying/Introduction2Git/Introduction2Git.md)
* [Workflow for contributing](../PreparingSpecifying/WorkflowForContributing/WorkflowForContributing.md)
* [Frequently used Git Adhoc Commands](./Infrastructure/Tools/Git/GitCommands.md)

**Step-by-Step Guidelines**
* [Creating an own GitHub account](../PreparingSpecifying/OwnGitHubAccount/OwnGitHubAccount.md)
* [Installing Git](../PreparingSpecifying/InstallingGit/InstallingGit.md)

 **Documents**
* [More about Git commands](https://docs.github.com/en/get-started/using-git/about-git ) 

### Docker
Docker is an open source platform that enables developers to build, deploy, run, update and manage containers of applications. It is used to call as configuration management tool that is used to automate the deployment of software in lightweight containers which can run on any OS environment. These containers help applications to work efficiently in different environments. docker Containerization is very friendly in building and deploying applications.

**Concepts**
* [Advantages of Docker](./Infrastructure/Tools/Docker/DockerIntroduction.md#advantages-of-docker)
* [Docker objects](./Infrastructure/Tools/Docker/DockerIntroduction.md#docker-objects)
* [Docker adhoc commands](./Infrastructure/Tools/Docker/DockerUsefulCommands.md)
* [Docker Volumes](./Infrastructure/Tools/Docker/DockerVolumes.md)

**Step-by-Step Guidelines**
* [Docker Installation](./Infrastructure/Tools/Docker/Installation.md)
* [Docker Usage in Microwave SDN Laboratory](./Infrastructure/Tools/Docker/UtilizationInSDN.md)
* [Example Application RegistryOffice](./Infrastructure/Tools/Docker/UtilizationInSDN.md#dockerized-sdn-application-with-registryoffice-example)
* [How to debug container using Adhoc commands](./Infrastructure/Tools/Docker/DebuggingContainer.md)

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
### HAScripts
HighAvailability is an ability to monitor/operate the services continuously with minimal of zero failures. current architecture  have multiple instances of Applications running and if one of them crashes, we still have the other instances working and available. HA will make sure that all instances are up and running, If required will resume the crashed instances also.

**Step-by-Step Guidelines**
* [Process of HA Script and Usage](./Infrastructure/Tools/Scripts/Scripts.md)

## SDN Application Pattern Deployment
 Currently, the application pattern is building an application layer on SDN controller using the microservice architecture where the complex applications are spilt into small pieces and make them run independently.
**Concepts**
* [WorkFlow](./Infrastructure/SDNApplicationPatternDeployment/WorkFlow.md)

**Step-by-Step Guidelines**
* [Application Deployment in Test Bed](./Infrastructure/SDNApplicationPatternDeployment/AppDeploymentInTestBed.md)
* [Application Deployment in Production](./Infrastructure/SDNApplicationPatternDeployment/AppDeploymentInProd.md)

## Acceptance Testing
Acceptance testing is a quality assurance (QA) process and this technique performed to determine whether software system has met user/business requirement specifications. It evaluates quality of software. Acceptance Testing run in testbed environment and if everything is ok from acceptance testing then approve the build to production environment to deploy.

**Step-by-Step Guidelines**
* [Automated Pipeline Flow](./AcceptanceTesting/Overview/pipelineconfiguration.md) 

## Integration Testing
Integration Testing is finalized testing of software product. Normally software products are divided into different modules and here SDN applications are also developed as individual services. This testing verifies that  software modules are integrated logically and tested as a group. The purpose of this level of testing is to expose defects in the interaction level and checks the proper service/data communications happen among modules/Applications.

**Step-by-Step Guidelines**
* [Automated Pipeline Flow](./IntegrationTesting/Overview/pipelineconfiguration.md)

[<- Back to Specifying](../SpecifyingApplications/SpecifyingApplications.md) - - - [Up to Main](../Main.md) - - - [Ahead to TinyApplicationController ->](../TinyApplicationController/TinyApplicationController.md)
