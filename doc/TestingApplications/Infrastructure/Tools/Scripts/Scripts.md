## Scripts

### **High Availability Script[HA]**

HighAvailability is an ability to monitor/operate the services continuously with minimal of zero failures. current architecture  have multiple instances of Applications running and if one of them crashes, we still have the other instances working and available. HA will make sure that all instances are up and running, If required will resume the crashed instances also.

### Prerequisite :
Install "lsof" command , as this program uses it to check application's availability
Install docker , as the monitored applications run as a container in the docker engine
Have all the TinyApplicationController's latest docker image available in the local registry

Usage: Using below command start the script in background which will monitor all applications which are running on 
Script should be initiated in the background './ScriptName &'



[<- Back to Newman](../Newman/Newman.md) - - - [Back to main Testing Applications](../../../TestingApplications.md) - - - [Ahead to SDN Application Pattern Deployment->](../../SDNApplicationPatternDeployment/Concepts.md)