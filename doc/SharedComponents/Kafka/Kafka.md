# Kafka

### Purpose

The goal of integrating Kafka into the system is to decouple the flow of notifications between components and enable a scalable and robust message processing pipeline. Kafka acts as a central broker that receives all incoming notifications and distributes them to appropriate consumers.

Instead of sending notifications directly to MWDI, all notifications are first sent to Kafka. This approach allows asynchronous processing, failure isolation, and better maintainability. MWDI is only responsible for consuming filtered, relevant notifications.

### Design 

Kafka serves as the central notification hub. All incoming notifications, regardless of type, are first published to a single input topic (e.g., `all_notifications`). A Kafka Streams application is then responsible for filtering and routing these notifications to the appropriate output topics:

- `proper_notifications`: Contains well-formed, standards-compliant notifications (e.g., AVCN, OCN, ODN).
- `proprietary_notifications`: Contains incomplete, vendor-specific, or non-standard notifications.

MWDI is configured to only consume from `proper_notifications`, ensuring that it processes only the notifications that conform to expected formats and types.

#### Flow

1. **NotificationProxy** sends all notifications to the Kafka topic `all_notifications`.
2. A **Kafka Streams filtering application**:
   - Parses each message.
   - Applies logic to determine if the notification is proper or proprietary.
   - Routes the message to either:
     - `proper_notifications`, or
     - `proprietary_notifications`.
3. **MWDI** subscribes only to `proper_notifications` and executes update logic based on the notification type.
![alt text](image.png)


### ParameterDesign

### Kafka Config -  Project-Specific Parameters

| Parameter              | Example Value                          | Why it matters                                                              |
|------------------------|----------------------------------------|------------------------------------------------------------------------------|
| `advertised.listeners` | 'localhost:9092'                        | Must match the hostname/IP MWDI and NP will use to connect to Kafka         |
| `log.dirs`             | /var/lib/kafka-logs                    | Must point to a writable, persistent directory on your VM                   |
| `num.partitions`       | 3                                      | Set >1 if you want parallel consumption (e.g., vendor-based scaling)         |
| `log.retention.hours`  | 48                                     | Set based on how long MWDI needs access to notifications (e.g., 24–48h)     |

---

### Kafka Config -  General Parameters

| Parameter            | Example Value                   | Comment                                      |
|----------------------|----------------------------------|----------------------------------------------|
| `broker.id`          | 0                                | Set to `0` for single broker                 |
| `listeners`          | PLAINTEXT://0.0.0.0:9092         | Default listener for external access         |
| `zookeeper.connect`  | localhost:2181                   | Use `localhost:2181` if using local Zookeeper |


### NotificationProxy – Kafka Producer Configuration

The NotificationProxy acts as a Kafka **producer**, sending all received notifications to the `all_notifications` topic. Below are the key configuration parameters required to set up the producer.

| Parameter             | Example Value                          | Description                                                                 |
|-----------------------|----------------------------------------|-----------------------------------------------------------------------------|
| `bootstrap.servers`   |  'localhost:9092'                      | Address of the Kafka broker the producer will connect to                    |                              |
| `topic`               | `all_notifications`                    | The Kafka topic to which notifications will be published                    |

kafka:
  bootstrap_servers: localhost:9092
  topic: all_notifications
  acks: all
  retries: 3
  key_serializer: string
  value_serializer: string

###  MWDI – Kafka Consumer Configuration

The MWDI application acts as a Kafka **consumer**, subscribing to the `proper_notifications` topic. It processes only well-formed, standards-compliant notifications (e.g., AVCN, OCN, ODN).

Below are the key configuration parameters required to set up the consumer.

| Parameter               | Example Value                          | Description                                                                 |
|-------------------------|----------------------------------------|-----------------------------------------------------------------------------|
| `bootstrap.servers`     |  'localhost:9092'                      | Address of the Kafka broker the consumer will connect to                   
| `topic`                 | `proper_notifications`                 | The Kafka topic from which MWDI will consume notifications              

kafka:
  bootstrap_servers: localhost:9092
  topic: proper_notifications
  group_id: mwdi-consumer-group
  auto_offset_reset: earliest
  enable_auto_commit: true
  key_deserializer: string
  value_deserializer: string