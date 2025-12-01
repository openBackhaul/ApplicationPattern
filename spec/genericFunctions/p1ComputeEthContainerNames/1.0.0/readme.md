# p1ComputeEthernetContainerNames

The function p1ComputeEthernetContainerNames looks up EthContainer names (interfaceName) in LtpStructureAndAugment information.  

*Input:*  
Function inputs are:
- either a reference to the data structure storing Ltps and LtpAugment information in ONF format (_raw-control-construct)
- or the Ltp and LtpAugment information directly (the format is the same as for the reference option)
- the uuid for which the lookup shall be executed (it is not verified here, that the LTP is actually an EthContainer, this check has to be carried out on caller side)
- optional input and function parameters (currently unused)  

*Output:*  
The function reads the list of LTPs from the input until it finds the input uuid.  
It retrieves the interface name from the LtpAugment (original-ltp-name) belonging to this LTP and returns the following data:
- interface-name (this is the Ethernet Port name)  

### Diagram  

<p align="center">
  <img src="./p1ComputeEthernetContainerNames.png" alt="p1ComputeEthernetContainerNames diagram" width="400" />
</p>


### Interface  

Please find a detailed description of the [interface](./interface.yaml).  


### NPM Module  

[mw-sdn-p1ComputeEthernetContainerNames](https://www.npmjs.com/package/mw-sdn-p1ComputeEthernetContainerNames)  

