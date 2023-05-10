**OAMLogServices.js**

This class provides functionality to log the OaM request to the OAMLog application in the SDN Microservice architecture.
A REST call will be initiated from this application to the OAMLog application to record the transaction happened in the OAM layer.

|![apd_image6](https://user-images.githubusercontent.com/57349523/153877940-54471ad3-d2a3-454f-84ed-6bfd866c7f60.png)|
|---|

*Functions*:
|**Method and description**|**Input parameters**|**Return type**|
|---|---|---|
|**recordOamRequest**: <br>This function formulates the request body with the <br>required attributes that needs to be sent to record the OaM request in the OamLog application.|{string} **oamPath** oam path that is accessed during the request. <br>{string} **requestBody** incase if it is a put request, then the request body of the request. <br>{string} **responseCode** response code of the REST call execution. <br>{string} **authorizationCode** authorization code used to access the oam layer. This will then be decoded to find out the username. <br>{string} **method** HTTP method of the OAM layer call. It can be PUT, GET.|{promise} true if the request was successful.|

![colorline_blue](https://user-images.githubusercontent.com/57349523/154715704-2e1a7c51-17c2-47af-a46a-85bd613f4a53.jpg)
