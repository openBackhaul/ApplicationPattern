### Configure master-slave configuration for deploying application 

![image](./Images/jenkins_master_slave.png)

**The Jenkins master** simple machine where Jenkins is running and acts to scheduling the jobs, assign slaves, and send builds to slaves to execute the jobs. It will also monitor the slave state (offline or online) and get back the build result responses from slaves and the display build results on the console output. 

**Jenkins slaves** takes the instructions/commands from master and execute the jobs.

To configure the slave nodes, 
* Open Jenkins Dashboard
* Select "Manage Jenkins"
* Click on Manage Nodes and Clouds
* Select New node.

Enter the nodename and select create.
 ![image](./Images/Addslave.PNG)

 Once click on create, it prompts below screen, In that we have to enter the details like nodename, Remote root directory etc.
 ![image](./Images/Enterconfigurationslave.PNG)
 
Based on our requirement add the data and save the configuration as below.
![image](./Images/saveslave.PNG)

Once configured the server with node details and home directory updated for all required nodes then the complete set up is ready in current SDN controller application testing.

[<-Back to PluginInstallation](./PluginInstallation.md) - - - [Back to main TestingApplications](../../../TestingApplications.md)--- [Ahead to JenkinsJobs](./JenkinsJobsAndSDNDeployment.md)