## Jenkins Installation
### Prerequisites
Before installing the jenkins, it is recommend to check whether Java software installed or not. Based on type of OS, choose the installation commands.

#### Install Java
     "apt-get update"
     "apt install default-jre" for ubuntu
     "apt install default-jdk" for ubuntu
     
     "dnf update" for rhel
     "dnf install java-1.8.0-openjdk-devel"
     #install JDK 8
     "dnf install java-11-openjdk-devel"
     #install JDK 11

    Check the version to verify whether installed or not.
     "java –version"
     "javac –version"

**Documents**
* [Install Java on ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-18-04)
* [Install Java on rhel](https://www.tecmint.com/install-java-on-rhel-8/)

### Jenkins-Installation-steps
It is recommend to update the local repository server using "**apt update**" and  install the jenkins.

    "apt-get install jenkins" for ubuntu
    "yum install Jenkins" for redhat
    
  **Start Jenkins:** : Let’s start Jenkins by using systemctl commands
  
        "systemctl start jenkins"
        
  **Status Jenkins:** : Check status using below command
  
        "systemctl status jenkins"
        
If everything went well, the beginning of the status output shows that the service is active and configured to start at boot: 

**Output**

    jenkins.service - LSB: Start Jenkins at boot time 
    Loaded: loaded (/etc/init.d/jenkins; generated) 
    Active: active (exited) since Fri 2020-06-05 21:21:46 UTC; 45s ago 
     Docs: man:systemd-sysv-generator(8) 
     Tasks: 0 (limit: 1137) 
     CGroup: /system.slice/jenkins.service

[Back to WorkFlow](./Jenkinsworkflow.md) - - - [Back to main TestingApplications](../../../TestingApplications.md) - - - [a head to Environment Setup ->](./EnvironmentSetup.md)