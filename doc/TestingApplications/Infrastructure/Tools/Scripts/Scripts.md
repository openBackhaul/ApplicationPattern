## Scripts
### **High Availability Script[HA]**
### Prerequisite 
To start HA script. required "lsof" and docker (installation procedure is already available in previous sections) to be installed.

Below steps are used to install **lsof**

* Update the package index

        "sudo apt update"  for Ubuntu
        "dnf info lsof" for RHEL
* Install lsof

        "apt install lsof" for Ubuntu
        "dnf install lsof" for RHEL
* Verify the installation:

        "lsof -v" for both RHEL and Ubuntu

This command should output the version of lsof that has been installed.       

### Usage: 
Using below command, start the script in background which will monitor all applications whether they are running or not and related log file also created and logged the messages. The HAscript if any running containers/applications exited/crashed then automatically restarted the container.

      ./HAscript.sh &

Once started related log file also created and below is the example file.

    WebApp@WebApp:~/HAscripts$ ls
    TACHans.log

Note: Before starting the script, the latest docker images are available and to be updated in the local registry.


[<-Back to main Testing Applications](../../../TestingApplications.md) 