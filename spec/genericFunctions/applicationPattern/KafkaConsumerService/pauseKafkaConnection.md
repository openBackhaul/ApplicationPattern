# PauseKafkaConnection  


### Overview  

Pauses consumption of messages from all subscribed Kafka topics.

### Description  

Temporarily stops message processing without closing the Kafka connection.
Ensures no new messages are consumed until resumed.

**Module:**  
applicationPattern/applicationPattern/services/KafkaConsumerService.js

### **Inputs**
| Name | Type | Description |
|------|------|-------------|
| none | - |-|


### **Output**
| Type | Description |
|------|-------------|
| void | No return value |


### Interface  

NA 


### Diagram  

<p align="center">
  <img src="./diagrams/pauseKafkaConnection.png" alt="pauseKafkaConnection diagram" width="400" />
</p>


### NPM Module  

[onf-core-model-ap](https://www.npmjs.com/package/onf-core-model-ap)  
