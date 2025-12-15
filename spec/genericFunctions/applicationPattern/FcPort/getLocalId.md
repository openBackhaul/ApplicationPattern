# getLocalId  


### Overview  

Returns the `localId` of the fc-port in a forwarding-construct that matches the given LTP UUID.


### Description  

/core-model-1-4:control-construct/forwarding-domain/forwarding-construct/fc-port  holds fcportlist

This function Returns the local-id of a fc-port if the provided logical-termination-point UUID exists in the forwarding-construct.

the localId of the fc-port whose logical-termination-point matches the given LTP UUID or  undefined.

**Module:**  
applicationPattern/onfModel/models/FcPort.js


### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| forwardingConstruct | Object | Forwarding-construct object containing fc-port entries |
| ltpUuid | String | Logical-termination-point UUID to match |

### **Output**
| Type | Description |
|------|-------------|
| String  | Local ID of the matching fc-port |
| undefined |    If no matching fc-port is found    |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getLocalId.png" alt="getLocalId diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
