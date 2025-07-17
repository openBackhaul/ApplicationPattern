# Kafka Streams

### Purpose

[Apache Kafka Streams](https://kafka.apache.org/documentation/streams/) is a client-side library for real-time data processing, designed to handle tasks like filtering, categorizing, and aggregating data directly from Kafka topics.

### Design 

#### General design
Notifications are continously published by producer applications to Kafka input topics.  
From there, they are read by Kafka Streams, which categorizes the notifications. (Filtering and aggregation are not yet implemented, by may be added in the future if they prove to be useful.)  
The categorized notifications are written to specific output topics on the Kafka message bus.  

#### Notification types and topics

**Notification types**:
- *controller notifications*: out of scope, as they will be handled by [ControllerDomainManager](https://github.com/openBackhaul/ControllerDomainManager) in the future (currently they are still handled by NotificationProxy)
- *device notifications*: handled by NotificationProxy, include notifications about device changes and alarms
- *proprietary notifications*:
  - these notifications do not follow the agreed upon notification format, they e.g. are created when a user performs a configuration change using another management interface like e.g. WebLCT or CLI.
  - they are not handled by NotificationProxy and currently are not sent to a Kafka input topic

**Topics**:
Input:  
- `all_notifications`: the NotificationProxy publishes the device notifications (including alarms) to this topic, after it has transformed them into the required ONF TR-532 format.

Output:  
- `device_change_notifications`:
  - contains all notifications about device changes from `all_notifications` topic, excluding notifications about alarms
- `device_alarm_notifications`:
  - contains all notifications about alarm changes from `all_notifications` topic
  - alarm notifications are provided in a separate topic as they may also be relevant to other (external) tools, like e.g. Netcool
- `other_notifications`:
  - in case notifications from `all_notifications` cannot be mapped to either of the other output categories, they are written to this topic

#### Processing

The following diagram provides an overview about the processing of notifications by KafkaStreams.  
![KafkaStreamsOverview](./images/kafkaStreamsSetup.png)  

NotificationProxy (Producer):
- The NotificationProxy continuously receives device notifications (including alarms) and controller notifications.  
- After having transformed the device notifications into ONF TR-532 format, it publishes them to the Kafka Message Bus to topic `all notifications`.
- Controller notifications are not being sent to Kafka.

Kafka Streams (Producer and Consumer):
- a Kafka Streams processor subscribes to `all_notifications` topic and analyzes the content of each notification.
- based on predefined classification rules (which e.g. can be keywords, message structures or metadata), it assigns each notification to a category
  - processing rules would also allow for filtering and aggregating notifications, this may be added at a later stage as well
- After categorization of the notifications, Kafka Streams routes them to the three output topics
  - `device_change_notifications`: containing all notifications about device changes in ONF TR-532 format, excluding alarms
  - `device_alarm_notifications`: containing all notifications in ONF TR-532 format about device alarm changes
  - `other_notifications`: notifications from `all_notifications`, which cannot be mapped to the other two topics, will be published to this topic

Consumers:
- For the start MWDI will be the only consumer for both `device_change_notifications` and `device_alarm_notifications`
- additional applications could also subscribe to those topics
  - e.g. a possible SDN alarm application could subscribe to `device_alarm_notifications`
  - or an SDN-external tool like Netcool

In the future additional producers, consumers and topics can be added as required, along with possible extensions to the Kafka Streams processing rules.  

### Categorization, filtering and aggregation rules




### ParameterDesign
