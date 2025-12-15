# getClientLtpListAsync  


### Overview  

Retrieves the list of client Logical Termination Points for a given LTP.

### Description  
Client LTPs represent upper-layer dependencies of a logical termination point.

This function reads the client-ltp relationship under the specified LTP and returns all referenced client LTP UUIDs.

If no client relationships exist, an empty array is returned.

**Module:**  
applicationPattern/onfModel/models/LogicalTerminationPoint.js


### **Inputs**


| Name | Type | Description |
|------|------|-------------|
| ltpUuid | String | UUID of the LTP |

### **Output**

| Type | Description |
|------|-------------|
| Array | List of server LTP UUIDs  |
|undefined|Empty array if none found |



### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getClientLtpListAsync.png" alt="getClientLtpListAsync diagram" width="400" />
</p> 

### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
