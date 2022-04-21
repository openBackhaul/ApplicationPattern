## How to model an OAM service

To model an OAM service , 
1.	Understand the requirement completely
2.	Contribute the corresponding operation in **controllers/**
    - Approve the **authentication** code by validating it with the **AA application**.
    - Pass the request.url as an additional argument and call the respective operation in the **services/**
    - **Record** the OAM request to the **OL application**

3.	Contribute the operation in the **services/**
    - Import the **‘onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver’** from the application pattern module
    - For GET request , directly read the resource by using the request.url by calling the **‘readFromDatabaseAsync’** function in the JSONDriver
    - For PUT request , use the method **‘writeToDatabaseAsync’** along with the url and the requestBody to update the intended value.

[<- Back to How to model an Individual service](HowToModelAnIndividualService.md) 