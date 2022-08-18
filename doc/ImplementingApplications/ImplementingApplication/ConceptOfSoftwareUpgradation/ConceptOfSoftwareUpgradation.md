# Software Upgrade

 * Application's softwares are upgraded using the Individual service "/bequeath-your-data-and-die"
 * Ultimate goal of this service is to perform software version or instance upgrade without(or with minimum) downtime.
 * This service will be initiated by a new application to the old(or same) version of the same application.
 * The functionality within this service performs a set of procedure to transfer the data from old application to new application using callbacks.
 * Every new version will be backward compatible with its immediate previous version for a smooth integration with multiple MS. So, software version upgrades should be sequential in order to have a backward compatible version.
 * unlike others , this service is not a straightforward one. It has to perform a number of callbacks to transfer the data from old to new version.
 * In a high-level , the software upgrade will be in the following sequence , 
  ![SoftwareUpgrade](Images/softwareUpgrade.png)

 * In detail , the software upgrade looks like below , 
  ![SoftwareUpgrade](Images/SoftwareUpgradeDetailedVIew.png)
 

[<- Back to Code Collaboration](CodeCollaboration.md)  - - - [Up to Integrating load file](IntegratingLoadFile.md) 

