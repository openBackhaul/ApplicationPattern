### SECURITY Module

This package contains modules that provides authorizing service.
|![apd_image15](https://user-images.githubusercontent.com/57349523/153877959-5d4016c0-220f-491a-98d5-cb4ee00ec750.png)|
|---|

#### **AuthorizingService.js**

This module provides functionality to authenticate an OAM layer request by getting an approval from the AdministratorAdministration.

*Function*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**isAuthorized** <br>This function authorizes the user credentials.|{string} **authorizationCode** authorization code received from the header. <br>{string} **method** is the https method name.|{Promise} return the authorization result.|

![colorline_green](https://user-images.githubusercontent.com/57349523/154716332-4c32260d-5566-49a5-9126-14eefe734fc6.jpg)
