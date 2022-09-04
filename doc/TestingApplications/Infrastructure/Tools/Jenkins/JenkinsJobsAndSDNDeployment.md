### List of Jenkins Jobs 
There are many types of jobs existed in Jenkins  tool, But in our current setup we used below types of jobs.
* Freestyle project jobs
* Pipeline jobs(Declarative Pipelines)
Selection of Job type is like
    *   Goto Jenkins home Dashboard
    *   Click on NewItem
    *   Add user defined job name in field of Enter Item Name
    *   Select the required Job Type
    *   Click On OK 
    *   Moved to Job configuration
    *   Configure the job based on requirement/Add a pipe line script
    *   Apply and Save
![Example select job type](./Images/SelectJobType.PNG)
![Example job](./Images/Configurefreestylejob.PNG)

Below are the list of Jobs in current SDN project

- PollSCM trigger jobs for auto builds whenever new commit merged in remote repositories
- Automated Mediator upgrade and readonly data testing free style jobs
- Automated scheduled/cron sanity testing free style jobs
- Automated Controller upgrade and testing free style jobs
- Dockerize pipeline Jobs for Application Deployments
- Acceptance testing jobs for GitHub applications 
- Integrations testing jobs for GitHub applications

[<-Back to Email Notification Configuration](./EmailNotificationConfiguration.md) - - - [Back to main TestingApplications](../../../TestingApplications.md)
