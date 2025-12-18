# writeToDatabaseAsync  


### Overview  

Writes or updates values in the JSON ONF-format database (config.json) at the specified OAM path.


### Description  

This function updates or appends data in the ONF **core-model** JSON configuration
file (`config.json`) at the location specified by the given **OAM-style path**.

It reads the JSON database (config.json), resolves the `oamPath`, and updates the
target attribute accordingly.

- If `isAList` is set to `true`, the value is **appended** to the target list  
- Otherwise, the existing attribute value is **replaced**

All write operations are synchronized using a **lock mechanism** to prevent
concurrent file access issues.

The function returns `true` if the update succeeds; otherwise, it returns `false`.


**Module:**  
applicationPattern/databaseDriver/JSONDriver.js

**Input:**  
Function inputs are:


###  Inputs


| Parameter | Type | Description |
|----------|-------|-------------|
| `oamPath` | string | JSON path where the value will be written |
| `valueToBeUpdated` | JSON / string | New value to insert or update |
| `isAList` | boolean | Whether the target is list-type and should append |



**Output:**  


| Type | Description |
|------|-------------|
| `boolean` | true if update succeeds, else false |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagram/WriteToDatabaseAsync.png" alt="p1WriteFromConfigFile diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
