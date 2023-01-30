## Jenkins Installation
### Prerequisites
Before installing the Jenkins, it is recommend to install Java software. Based on type of OS, choose the installation commands.

#### Steps to install Java 
* Start by updating the package index

       "apt-get update" for ubuntu
       "dnf update" for redhat
* Install Java

      "apt install default-jre" for ubuntu
      "apt install default-jdk" for ubuntu
     
      "dnf install java-11-openjdk-devel" install JDK 11 for redhat

* Check the version to verify whether installed or not.
      
      java –version

### Jenkins Installation steps

* Install the jenkins using below command.

      "apt-get install jenkins" for ubuntu
      "yum install Jenkins" for redhat
* To enable the Jenkins service to start at boot with the below command

      systemctl enable jenkins
    
* Start the Jenkins service with the below command
  
        systemctl start jenkins
        
* Check status using below command
  
        systemctl status jenkins
        
Once Installation is done and started the jenkins service, the status command output provides that the service is active and configured to start at boot: 

**Output**

    jenkins.service - LSB: Start Jenkins at boot time 
    Loaded: loaded (/etc/init.d/jenkins; generated) 
    Active: active (exited) since Fri 2020-06-05 21:21:46 UTC; 45s ago 
     Docs: man:systemd-sysv-generator(8) 
     Tasks: 0 (limit: 1137) 
     CGroup: /system.slice/jenkins.service

[Back to EmailNotificationConfiguration](./EmailNotificationConfiguration.md) - - - [Back to main TestingApplications](../../../TestingApplications.md) - - - [a head to Environment Setup ->](./EnvironmentSetup.md)