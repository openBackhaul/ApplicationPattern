### JSONDriver.js

* This module provides functionality to perform CURD operation on the JSON database CONFIGfile which is in the ONF CoreModel format.
* The interaction with the file system will be performed with the use of 'fs module', which enables interacting with the file system in a way modeled on standard Portable Operating System Interface for UNIX(POSIX) functions.
* Also, by using the 'path' module that provides utilities for working with files and directory paths. This module uses its own mechanism to traverse the ONF model JSON file based on the provided JSONPath.

## Functions:
1. **readFromDatabase** : This function reads the requested JSONPath from the core-model.
2. **writeToDatabase** : This function updates an existing instance or creates a new instance in the LOADfile which is in ONF CoreModel based on the JSONPath and input parameters.
3. **deleteFromDatabase** : This function deletes the requested data in the JSONPath from the core-model.