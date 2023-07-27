### WorkFlow in Production and Test environment
The two servers are required to deploy and test the applications.
   *  Appserver is used for deploying the applications
   *  Test server is used for testing the applications

Below is the overview for the complete procedure for deploying and testing the applications.

![Overview](./Images/sdn%20application%20deployment.PNG)

* Deploying and Testing application pattern using CI/CD methodology which includes continuous integration and continuous deployment. 
* Developer develops code and automates testsuites and push the changes into external git in respective repository.
* Jenkins integrates the changes from current repository and test the applications.
* Build, save and deploy the images as containers using docker framework and dockerfile on appserver.
* Once deployment is done, automation acceptance testing performed on testserver environment.
* Once build is approved, then the build will be promoted to GCP/production environment by manually transfer the tar file. 
* Deployment performed on appserver and integration testing executed on test server of production/GCP.
* All the results are notified to the user/cicd engineer in production environment through email notifications.


[<- Back to Testing Applications](../../TestingApplications.md) - - - [Ahead to SDNApplicationDeploymentInTestbed](./AppDeploymentInTestBed.md)