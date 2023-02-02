### WorkFlow in Production and Test Bed
We required two server to deploy and test the applications.
   *  Appserver is for deploying the applications
   *  Test server is for testing the applications

Below is the overview for the complete procedure for deploying and testing the applications.

![Overview](./Images/sdn%20application%20deployment.PNG)

* Deploying and Testing application pattern using CI/CD methodology which includes continuous integration and continuous delivery/continuous deployment. 
* Developers develop code and automated testsuites and push the changes into git respective repository.
* Jenkins is used as CI tool and it automatically integrates the changes from current repository and test the applications. 
* CD is like continuous deployment an automated delivery process which includes testing and delivery/deploy the SW using the docker, jenkins, newman tools.

* Using docker framework and dockerfile, build the image and deploy as containers on appserver.

* Once deployment is done, automation acceptance testing performed on testserver environment.

* Once acceptance testing performed and approved, deployment on appserver and integration testing performed on test server of GCP/production environment.


[<- Back to Testing Applications](../../TestingApplications.md) - - - [Ahead to SDNApplicationDeploymentInTestbed](./AppDeploymentInTestBed.md)