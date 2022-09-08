# Concept of CONFIGfile

### Individualization
- Find template here 
- Individualize Application Information
- Delete unnecessary profiles
### Servers, Clients and Profiles
- Add the planned services as operation-servers
- Define Profiles for storing data, if required
- Create HTTP and TCP clients for the applications to be addressed
- Asure proper fake TCP/IP addresses 
* The CONFIGfile contains all data that is necessary to establish the connections, which are required for properly operating the application. TCP/IP addresses, operation names and application release number might depend on the environment (e.g. SDN test laboratory or live network) in which the application gets instantiated in. As a consequence the CONFIGfile has to be adapted to the environment before instantiation. Fake IP addresses get replaced by environmental specific addresses during the creation of docker image. Please, find the correct [Fake TCP/IP addresses](../../TestingApplications/Infrastructure/SdnLaboratory/IpAddresses/IpAddresses.md) for supporting the automated adaption.  
- Add the planned to be consumed services as operation-clients in top
### Forwarding
- Add the planned forwardings
- Double check UUID references
### Review
- Check consistency of LOADfile with both Excel lists (don’t forget to check UUIDs)
- Ask colleague for review of the LOADfile
