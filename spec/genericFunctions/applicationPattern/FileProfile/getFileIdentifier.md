# getFileIdentifier  


### Overview  

Retrieves the file identifier associated with a FileProfile.


### Description  
core-model-1-4:control-construct/profile-collection holds all the profiles. To retrieve attributes of a file profile such as file identifier for a particular FileProfile UUID this function will be used,


This function reads the FileProfile identified by the given UUID and returns its configured file-identifier value.

**Module:**  
applicationPattern/onfModel/models/profile/FileProfile.js

### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| profileUuid | String | UUID of the FileProfile |

### **Output**
| Type | Description |
|------|-------------|
| String| File identifier configured in the FileProfile |



### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/getFileIdentifier.png" alt="getFileIdentifier diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
