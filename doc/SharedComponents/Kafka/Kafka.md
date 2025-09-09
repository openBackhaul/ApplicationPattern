# Kafka

## Purpose

The goal of integrating Kafka into the system is to decouple the flow of messages between components and enable a scalable and robust message processing pipeline. Kafka acts as a central broker that receives all incoming messages and distributes them to appropriate consumers.

The Kafka message bus has been introduced to improve the handling of notifications provided to MicroWaveDeviceInventory (MWDI) by NotificationProxy (NP). Instead of sending device notifications directly to MWDI, all device notifications are first sent to Kafka. This approach allows asynchronous processing, failure isolation, and better maintainability.  
Also, when needed, additional topics can be created to serve future purposes. Messages (not necessarily notifications) thereby could be both produced or consumed by other SDN applications, as well as SDN-external applications. An example for that is provisioning of MW interface performance data to (external) consumers through Kafka.  

## General Design 

As a distributed message broker, [Apache Kafka](https://kafka.apache.org/documentation/) enables high-throughput, fault-tolerant communication between producers and consumers. 
- [*topics*]: It organizes messages into *topics*. Producers send messages to these topics and consumers can subscribe to the topics they are interested in to retrieve the information they need.  
- [*partitions*]: Each topic is split into *partitions* which allow Kafka to scale horizontally and process data in parallel. Messages within a partition are stored in the order they arrive, providing a consistent sequence through offset tracking. Messages distribution across partitions can be customized - note that the distribution is a technical one, not a content-based on (i.e. partitions are not subtopics). Thus, e.g. multiple consumer instances of an application can access the same topic in parallel to speed up processing.  
- [*consumer groups*]: To manage how consumers read these messages, Kafka uses *consumer groups*. A consumer group is a set of consumers working together to read from a topic; each partition is assigned to only one consumer within the group, ensuring that messages are processed once per group. Multiple consumer groups can access the same topic independently, enabling different applications or services to consume the same data without interfering with each other.  
- Kafka ensures durability and scalability by storing messages on disk and replicating them across multiple servers.  
- The pull-based model allows consumers to read messages at their own pace, making it ideal for real-time analytics, event sourcing, and decoupled microservices communication.

![KafkaCluster](./images/kafkaCluster.png)

## Configuration

Configurations must be applied at various components. This includes configuration of Kafka itself, as well as configurations at producer and consumer applications.  

### Kafka configuration

When configuring Kafka, the following parameters must be set.  

**Project-specific parameters:**  
| Parameter              | Example Value              | Why it matters                                                       |
| ---------------------- | -------------------------- | -------------------------------------------------------------------- |
| `advertised.listeners` | PLAINTEXT://localhost:9092 | Must match the hostname/IP MWDI and NP will use to connect to Kafka  |
| `log.dir`              | /var/lib/kafka-logs        | Must point to a writable, persistent directory on your VM            |
| `num.partitions`       | 3                          | Set >1 if you want parallel consumption (e.g., vendor-based scaling) |

**General parameters:**  
| Parameter              | Example Value              | Comment                                                              |
| ---------------------- | -------------------------- | -------------------------------------------------------------------- |
| `broker.id`            | 0                          | Set to `0` for single broker                                         |
| `listeners`            | PLAINTEXT://0.0.0.0:9092   | Kafka listens on this address/port for incoming connections          |
| `advertised.listeners` | PLAINTEXT://localhost:9092 | Kafka tells clients (like MWDI and NP) to connect using this address |

---

### Kafka producer configuration

For the producer parameters for the following categories need to be considered:  
- operation
- configuration
- capability
- TCP client

**Operational parameters**:  
| Parameter    | Description                                                                             |
| ------------ | --------------------------------------------------------------------------------------- |
| `topic-name` | Name of the Kafka topic to which notifications are published (e.g.,`all_notifications`) |

**Configuration Parameters:**  
| Parameter   | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `username`  | Kafka authentication username — must be passed via config (SASL/SCRAM) |
| `password`  | Kafka authentication password — must be passed via config (SASL/SCRAM) |
| `broker`    | Kafka bootstrap server (e.g., `localhost:9023`)                        |
| `oauth-key` | OAuth token used for authenticating with Kafka (if applicable)         |

***Security Note:***  
Kafka authentication can use **SASL/SCRAM** for secure credential-based access.  
In this case, additional parameters must be included:

```yaml
security_protocol: SASL_PLAINTEXT
sasl_mechanism: SCRAM-SHA-256
sasl_username: 
sasl_password: 
```

**Capability Parameters:**  
| Parameter   | Description                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `client-id` | Unique identifier for the producer application (e.g., `notification-proxy-producer`) — must be configurable |

**TCP Client Parameters:**  
| Parameter    | Description                                        |
| ------------ | -------------------------------------------------- |
| `ip-address` | IP address of the Kafka broker (e.g., `localhost`) |
| `port`       | Kafka port (e.g., `9092`)                          |

---

### Kafka consumer configuration

For the consumer parameters for the same categories as for producers need to be considered:  
- operation
- configuration
- capability
- TCP client

**Operational Parameters:**  
| Parameter    | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| `topic-name` | Name of the Kafka topic from which to consume notifications (e.g.,`device_change_notifications`) |

**Configuration Parameters:**  
| Parameter   | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `username`  | Kafka authentication username — must be passed via config (SASL/SCRAM)       |
| `password`  | Kafka authentication password — must be passed via config (SASL/SCRAM)       |
| `group-id`  | Kafka consumer group ID (e.g., `mwdi-consumer-group`) — must be configurable |
| `broker_id` | Kafka bootstrap server (e.g., `localhost:9023`)                              |
| `oauth-key` | OAuth token used for authenticating with Kafka (if applicable)               |

***Security Note:***  
Kafka authentication can use **SASL/SCRAM** for secure credential-based access.  
In this case, additional parameters must be included:

```yaml
security_protocol: SASL_PLAINTEXT
sasl_mechanism: SCRAM-SHA-256
sasl_username: 
sasl_password: 
```

**Capability Parameters:**  
| Parameter   | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| `client-id` | Unique identifier for the consumer application (e.g., `mwdi-consumer`) — must be configurable |

**TCP Client Parameters:**  
| Parameter    | Description                                        |
| ------------ | -------------------------------------------------- |
| `ip-address` | IP address of the Kafka broker (e.g., `localhost`) |
| `port`       | Kafka port (e.g., `9092`)                          |


## Usage of Kafka for MWDI Notification Receipt

Kafka serves as the central notification hub. All incoming notifications forwarded by NotificationProxy (after having been transformed into ONF TR-532 format), are first published to a single input topic (`all_notifications`). These notifications include device change notifications (attribute-value-change, device-object-creation, device-object-deletion), as well as device alarm notifications. Controller notifications are not sent to Kafka.  

Via [Kafka Streams](./KafkaStreams.md) the notifications from the input topic are categorized and placed in one of the following topics: `device_change_notifications`, `device_alarm_notifications` or `other_notifications` (for those which cannot be categorized properly).  

MWDI has subscriptions to both `device_change_notifications` and `device_alarm_notifications` topic and reads the notifications from them in its own pace.

## Kafka deployment

**Preprod**:  
Kafka has been installed on *preprod* enviroment and been deployed as a Kafka jar file.  

The following topics have been created:
- *alarm_event_notifications*
- *device_change_notifications*
- *attribute_value_change_notifications*
- *other_notifications*

Connection details:
- Kafka broker: `<preprod-ip x.x.x.14>`:9092
- Kafka jar stream: `<preprod-ip x.x.x.14>`:8083
- Kafka UI: `<loadbalancer-domain-name>`:4059/ui/kafka-cluster/topic
