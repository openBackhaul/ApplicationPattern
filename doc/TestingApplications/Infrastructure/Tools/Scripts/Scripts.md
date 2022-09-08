## Scripts
### **High Availability Script[HA]**
### Prerequisite 
To start the HA script. required "lsof", docker tools to be installed and  update latest docker images are available in the local registry.

Below steps are used to install **lsof** for ubuntu

        "apt update" - Update the repo with latest softwares
        "apt install lsof" - On Ubuntu
        "lsof -v" - Check the version 


        "dnf info lsof" for RHEL
        "dnf install lsof" for RHEL
        "lsof -v" for RHEL to check version

### Usage: 
Using below command start the script in background which will monitor all applications whether they are running or not and related log file also created and logged the messages. this HAscript if any running containers/applications exited/crashed then automatically restarted the container.

      ./HAscript.sh &
    WebApp@WebApp:~/HAscripts$ ls
    HAscript.sh  TACHans.log


[<-Back to main Testing Applications](../../../TestingApplications.md) 