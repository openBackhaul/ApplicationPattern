### Jenkins Workflow
Here's how Jenkins elements are put together and interact.
- Developers commit the changes into repository 
- The Jenkins CI server checks the repository at regular intervals and pulls new changes from repository
- Jenkins server trigger automatically to create a build with the changes made and run the testing related test suites. 
- If build fails, Jenkins will send a notification to developers with errors and job details so that they can work on failures.
- If build is successful, trigger next step as testing the automated tests, once everything is fine, the build/changes are ready to deploy.
- If the code is error-free and automated test suites passed, the deployment team will be notified with the build details for deploying into the production server.
      
The main advantage of Jenkins is having 1000+ plugin's to ease our work. If we use different tools/features based on requirement, then need to install plugins. For example Git, Maven 2 project, HTML publisher, docker, JMeter etc. 
     
The whole process is eliminated the manual intervention and designed to ensure the fast flow of reliable code from the development team to the production environment, enabling Continuous Delivery (CD) and Continuous Deployment.


[Back to main TestingApplications](../../../TestingApplications.md) - - - [a head to Jenkins Installation ->](./JenkinsInstallation.md)