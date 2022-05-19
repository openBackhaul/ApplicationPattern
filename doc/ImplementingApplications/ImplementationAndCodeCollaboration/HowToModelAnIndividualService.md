## How to model an Individual service

To model an individual service , 
1.	Understand the requirement completely
2.	Contribute the corresponding operation in **controllers/IndividualServices.js**
    - **Validate** the operation-key with the **operation-key** of the corresponding OperationServer
    - Call the respective operation in the **services/IndividualServicesServices.js**
    - Prepare inputs to **formulate the response header**
    - **Record** the service request to the **EaTL application**
3.	Contribute the operation in the **services/IndividualServicesServices.js**
    - Implement **business logic** for the service
    - **Configure LTP,FCs** if required
    - **Automate** the specified **forwardings** with proper request body


[<- Back to Integrating basic services](IntegratingBasicServices.md) - - - [Up to to model an OAM service](HowToModelAnOAMService.md)
