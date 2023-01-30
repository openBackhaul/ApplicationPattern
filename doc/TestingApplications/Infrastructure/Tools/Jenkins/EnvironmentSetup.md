## Environment SetUp
Once Jenkins is up and running, adjust the firewall rules so that user can reach it from web browser to complete the initial setup. After enabling the firewall port, reload the firewall setup.

### Enabled firewall support for XXXX(default 8080) port

Now Jenkins is up and running on XXXX port.

    firewall-cmd --list-all
    firewall-cmd --permanent --add-port=XXXX/tcp 
    firewall-cmd --reload


The installation and firewall setup is done, now Jenkins is running on following URL.
    
    http:<server-Ip>:<port>

**Unlock Jenkins** :

Open above mentioned URL which displays the location of the initial password on unlock screen and read the password key from /var/lib/jenkins/secrets/initialAdminPassword file. You can access Jenkins by providing the password.

**Image**

![UnlockImage](./Images/UnlockPage.png)

Once we unlock, the next screen presents the option of installing suggested plugins or selecting specific plugins then go ahead with suggested plugins option which install the default plugin's as below.

![SuggestedPlugins](./Images/suggestedplaugins.png)

It takes sometime to install and setup the Jenkins environment with suggested plugin's. 
Next step is to create an admin user by providing the username, password, confirm the password, fullname and Email id. 

Make sure you remember the username and password, as they are the credentials for accessing the Jenkins WebUI. 

![adminusercreation](./Images/adminuser.png)

Specify if you wish to change the port for Jenkins or else continue with the default port. 

![configuration](./Images/instanceconfiguration.png)
 
Jenkins setup is complete and it can be accessed with the URL. Then click on the **start Using Jenkins** to open Jenkins home Dashboard. 

![jenkinsready](Images/jenkinsready.png)

[<-Back to JenkinsInstallation](./JenkinsInstallation.md) - - - [Back to main TestingApplications](../../../TestingApplications.md) - - - [a head to PluginInstallation ->](./PluginInstallation.md)