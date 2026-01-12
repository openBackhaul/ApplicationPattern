# SubscribeMessages  


### Overview  

Subscribes to Kafka topics and listens for incoming messages.

### Description  

Registers topic subscriptions and listens continuously for incoming messages.
Each received message is parsed and forwarded to the provided routing function.

**Module:**  
applicationPattern/applicationPattern/services/KafkaConsumerService.js

### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| topics | String [] |List of Kafka topics to subscribe to|
| routingFunction | Function (message: any, topic: string) | Function invoked for each received message|


### **Output**
| Type | Description |
|------|-------------|
| void | No return value |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/subscribeMessages.png" alt="subscribeMessages diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
