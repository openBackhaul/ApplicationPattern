# readFromDatabaseAsync  


### Overview  

Reads a value from the ONF JSON configuration file (config.json) using an OAM-style path.


### Description  

This function reads data from the ONF **core-model** JSON configuration file
(`config.json`) using the provided **OAM-style path**.

It loads the JSON database (Config.json), splits the given `oamPath`, and traverses
the `core-model-1-4:control-construct` structure to locate the requested
attribute or list entry.

- If the value exists, it is returned  
- If the path is invalid or the value cannot be resolved, an appropriate
  **HTTP error** is thrown

**Module:**  
applicationPattern/databaseDriver/JSONDriver.js

**Input:**  
Function inputs are:


| Parameter | Type | Description |
|----------|-------|-------------|
| `oamPath` | string | JSON path pointing to the required attribute |



**Output:**  

| Type | Description |
|------|-------------|
| `Object` | The located value, otherwise throws NOT_FOUND error |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagram/ReadFromConfigFile.png" alt="ReadFromConfigFile diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
