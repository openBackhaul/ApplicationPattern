# getProtocolFromProtocolEnum  


### Overview  

Converts an ONF protocol enum into a readable protocol representation.


### Description  

ONF models store protocol values as enums.
This helper function maps the enum value to a simplified protocol key along with its original enum value.

**Module:**  
applicationPattern/onfModel/models/layerProtocols/TcpClientInterface.js

### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| protocol | String | ONF enum protocol value as mentioned below |

HTTP: "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
HTTPS: "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTPS",
NOT_YET_DEFINED: "tcp-client-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"

### **Output**
| Type | Description |
|------|-------------|
| Array | `[ protocolKey , protocolEnumValue ]` |


### Interface  

NA 


### Diagram  

<YTD> 


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
