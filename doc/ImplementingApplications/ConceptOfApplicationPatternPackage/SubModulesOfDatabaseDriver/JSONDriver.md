### JSONDriver.js

* This module provides functionality to perform CURD operation on the JSON database CONFIGfile which is in the ONF CoreModel format.
* The interaction with the file system will be performed with the use of 'fs module', which enables interacting with the file system in a way modeled on standard Portable Operating System Interface for UNIX(POSIX) functions.
* Also, by using the 'path' module that provides utilities for working with files and directory paths. This module uses its own mechanism to traverse the ONF model JSON file based on the provided JSONPath.


Please refer the following flow for the ‘readFromDatabase’ operation:
|![apd_image3](https://user-images.githubusercontent.com/57349523/153877934-3d7dbb55-3e67-4b83-9362-be652dd3b54a.png)|
|---|

Please refer the following flow for the ‘write/deleteFromDatabase’ operation:
|![apd_image4](https://user-images.githubusercontent.com/57349523/153877937-fbf2bde8-a906-4817-842c-34b2b6fe145c.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**readFromDatabase** <br>This function reads the requested JSONPath from the core-model.|{String} **JSONPath** JSON path that leads to the destined attribute.|return the requested value.|
|**writeToDatabase** <br>This function updates an existing instance or creates <br>a new instance in the LOADfile which is in ONF CoreModel based on the JSONPath and input parameters.|{String} **oamPath** JSON path that leads to the destined attribute. <br>{JSONObject\|String} **valueToBeUpdated** value that needs to be updated. <br>{boolean} **isAList** a boolean flag that represents whether the value to be updated is a list instance.|return true if the value is updated, otherwise return false.|
|**deleteFromDatabase** <br>This function deletes the requested data in the JSONPath from the core-model.|{string} **JSONPath** JSON path that leads to the destined attribute. <br>{JSONObject\|String} **valueToBeDeleted** value that needs to be deleted. <br>{boolean} **isAList** a boolean flag that represents whether the value to be deleted is a list.|{Promise} return true if the value is deleted, otherwise return false.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)
