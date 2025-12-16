# GetApplicationDataFileContent  


### Overview  

Returns the full path of the application data file if it exists in the file system.


### Description  

`core-model-1-4:control-construct/profile-collection` holds all ONF profile instances.

To retrieve the **path of the application data file** associated with a
**FileProfile**, the `getApplicationDataFileContent()` function is used.

This function iterates over all **FileProfile UUIDs**, reads the configured
**file-name** for each profile, and checks whether the file exists under the
configured `applicationDataPath`.

If a matching file is found, the corresponding application data file path is
returned.

**Module:**  
applicationPattern/onfModel/models/profile/FileProfile.js


### **Inputs**
None

### **Output**
| Type | Description |
|------|-------------|
| String | Absolute path of the application data file |



### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getApplicationDataFileContent.png" alt="getApplicationDataFileContent diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
