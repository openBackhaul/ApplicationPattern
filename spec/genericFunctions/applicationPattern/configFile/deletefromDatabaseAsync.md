# deletefromDatabaseAsync  


### Overview  

Deletes a value or list entry from the  JSON configuration file (config.json).


### Description  

### Description

This function reads the provided `oamPath` and navigates through the `config.json` file to locate the target data.

Depending on the path, it performs one of the following actions:

1. Removes a specific attribute from an object  
2. Deletes a matching entry from a list using its primary key  
3. Saves the updated configuration back to the JSON file after deletion  

If the given path is invalid or the target data does not exist, an appropriate **HTTP error** is thrown.

**Module:**  
applicationPattern/databaseDriver/JSONDriver.js

**Input:**  
Function inputs are:

 ###  Inputs

| Parameter | Type | Description |
|----------|-------|-------------|
| `oamPath` | string | JSON path identifying the attribute to delete |



**Output:**  

| Type | Description |
|------|-------------|
| `boolean` | true if deletion succeeds |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagram/DeletefromDatabaseAsync.png" alt="DeletefromDatabaseAsync diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
