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

**[GitHub](../Tools/Git/GitOverview.md)** :  used as Source code management versioning tool

**[Jenkins](../Tools/Jenkins/Introduction.md)** :  used as CI tool 

**[Docker](../Tools/Docker/ConceptsAndOverview.md)** :  used for deploying an application which involves application clone, build images and deploy as a container.

**[DockerVolume](../Tools/Docker/DockerVolumes.md)** : used to achieve applications Data Persistence storage 

**[Newman and htmlextra reporter](../Tools/Newman/Newman.md)**:  used for running the automated testing process for every applications

**[Highavailability](../Tools/Scripts/Scripts.md)** : used to monitor applications status

Note: All [required tools](https://github.com/openBackhaul/ApplicationPattern/tree/develop/doc/TestingApplications/Infrastructure/Tools) should installed and available Java, docker, Jenkins setup, Nodejs, NPM, Newman, Newman reporter htmlextra package and GIT. Then only a successful pipeline deployment and testing is done in both testbed and production environment.

[<- Back to SDN Deployment](./Concepts.md) - - - [Back to main Testing Applications](../../../TestingApplications.md) - - - [Ahead to -> SDNApplicationDeploymentInTestBed ->](../SDNApplicationPatternDeployment/AppDeploymentInTestBed.md)