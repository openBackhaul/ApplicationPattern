### Jenkins Workflow
Here's how Jenkins elements are put together and interact.
- Developers commit the changes into repository
- The Jenkins server checks the repository at regular intervals and pulls new changes from repository
- It triggers automatically to create a build with the changes made and run related testing jobs. 
- If build fails, it will send a notification to developers with errors and job details so that they can work on failures.
- If build is successful, it will trigger next testing jobs (automated test suites).
- If the code is error-free and automated test suites passed, the deployment team/developer will be notified with the build details for deploying into the production server.
      
The main advantage of Jenkins is having 1000+ plugin's to ease our work. As per requirement,  different tools/features contains respective plugin's in Jenkins which needs to be installed manually and use further i.e Git plugin, rolebase plugin's, HTML publisher, docker, JMeter etc. 
     
The whole process eliminates the manual intervention and designed to ensure the fast flow of reliable code from the development team to the production environment, enabling Continuous Delivery (CD) and Continuous Deployment.


[Back to main TestingApplications](../../../TestingApplications.md) - - - [a head to EmailNotificationConfiguration ->](./EmailNotificationConfiguration.md)