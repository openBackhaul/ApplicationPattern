# getApplicationNameAsync  


### Overview  

Fetches the application name configured under the given HTTP client UUID.


### Description  

This function retrieves the application name configured for a specific HTTP client interface.

It locates the HTTP client Logical Termination Point (LTP) using the provided httpClientUuid, then accesses the
http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/application-name
attribute.

If the HTTP client interface or the application name attribute is not present, the function returns undefined.

**Module:**  
applicationPattern/onfModel/models/layerProtocols/HttpClientInterface.js

**Input:**  
Function inputs are:
| Parameter | Type | Description |
|----------|-------|-------------|
| `httpClientUuid` | string | UUID of the HTTP client interface|


**Output:**  
| Type | Description |
|------|-------------|
| `string` | Application name if found, otherwise undefined |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getApplicationNameAsync.png" alt="getApplicationNameAsync diagram" width="400" />
</p> 


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
