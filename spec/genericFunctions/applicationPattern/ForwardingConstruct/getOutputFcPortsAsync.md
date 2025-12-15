# GetOutputFcPortsAsync  


### Overview  

Retrieves all OUTPUT fc-ports from a forwarding-construct.


### Description  

This function reads the forwarding-construct under:
core-model-1-4:control-construct/forwarding-domain/forwarding-construct

Forwarding-constructs may contain multiple fc-ports with different port directions as mentioned  below 

  MANAGEMENT: "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
  INPUT: "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
  OUTPUT: "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT"

This function filters the fc-port list and returns only those ports whose:

port-direction = OUTPUT

These OUTPUT ports typically represent outgoing connections to other operations, applications, or interfaces.

If no OUTPUT fc-ports exist, an empty array is returned.


**Module:**  
applicationPattern/onfModel/models/ForwardingConstruct.js

### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| forwardingConstructUuid | String | UUID of the forwarding-construct |

### **Output**
| Type | Description |
|------|-------------|
|Array<Object> | List of fc-port objects with `portDirection = OUTPUT` |






### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getFcPortListAsync.png" alt="getFcPortListAsync diagram" width="400" />
</p>

### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  

