# DPMDP EMP Kafka mTLS Connection

## Purpose

This document describes the deployment details for connecting the Device Performance Management Data Processor (DPMDP) to EMP Kafka.

It covers two related use cases:
- DPMDP connects to EMP Kafka and publishes DPMDP messages.
- A consuming application connects to EMP Kafka and receives DPMDP messages from the assigned topic.

The DPMDP NodeJS client is expected to use the Confluent JavaScript client (`@confluentinc/kafka-javascript`). This client is based on `librdkafka`, so the Kafka connection parameters must use the `librdkafka` property names.

## Scope

This document is about client-side Kafka connectivity and certificate handling.

The EMP Kafka broker is managed by EMP. Broker-side TLS setup, broker certificates, Java keystores, truststores, PKCS#12 files, JKS files, and listener configuration are not part of the DPMDP deployment. The PEM files provided to DPMDP are client-side files and must not be confused with the broker-side Kafka server setup.

## Required EMP Inputs

Before DPMDP can be connected to EMP Kafka, EMP has to provide the following information:

| Input | Description |
| --- | --- |
| Kafka bootstrap server | EMP Kafka broker address and port, for example `<emp-kafka-host>:9092`. |
| Topic name | Topic to which DPMDP shall publish messages. |
| Client identity | Client ID and access rights for DPMDP. |
| Client certificate bundle | `trust.pem`, `cert.pem`, and `key.pem` for the DPMDP deployment identity. |
| ACLs | Producer rights for the DPMDP topic, and consumer rights where required. |
| Message size limit | The communicated EMP limit for this integration is 1 MB per Kafka message; confirm if this is environment-specific. |

## Certificate Files

EMP is expected to provide a client certificate bundle for the DPMDP deployment environment.

| File | Purpose | Handling |
| --- | --- | --- |
| `trust.pem` | CA certificate used by the client to trust the EMP Kafka broker certificate. | This can be common for multiple clients in the same EMP Kafka environment. |
| `cert.pem` | Client certificate used to identify the DPMDP application. | This is normally issued for the specific application, team, or deployment identity. |
| `key.pem` | Private key belonging to the client certificate. | This is sensitive and must stay secret. |

Do not commit these files to Git. Do not bake `key.pem` into a public or shared Docker image. Mount the certificate files into the DPMDP container at runtime, or inject them through the approved secret-management mechanism of the target environment.

Example runtime mount:

```bash
docker run \
  --name dpmdp \
  -v /srv/secrets/dpmdp-emp-kafka:/opt/dpmdp/secrets/emp-kafka:ro \
  <dpmdp-image>
```

The path used in the Kafka client configuration must be the path inside the container, not the host path.

## Connecting DPMDP to EMP Kafka

DPMDP acts as a Kafka producer when it sends DPMDP messages to EMP Kafka.

The producer configuration has to include the EMP broker address, the producer client ID, the EMP topic, and the mTLS certificate paths.

Example producer configuration:

```javascript
const producerConfig = {
  "bootstrap.servers": "<emp-kafka-host>:9092",
  "client.id": "dpmdp-client",
  "security.protocol": "ssl",
  "ssl.ca.location": "/opt/dpmdp/secrets/emp-kafka/trust.pem",
  "ssl.certificate.location": "/opt/dpmdp/secrets/emp-kafka/cert.pem",
  "ssl.key.location": "/opt/dpmdp/secrets/emp-kafka/key.pem",
  "acks": "all",
  "enable.idempotence": true,
  "linger.ms": 50,
  "batch.size": 1048576,
  "batch.num.messages": 500,
  "compression.type": "lz4"
};

const topicName = "<dpmdp-topic-name>";
```

The values above are deployment values and must be replaced with the values provided by EMP. Debugging can be enabled temporarily with `debug: "broker,admin"` when connection setup has to be analyzed, but it should not be left enabled permanently unless the deployment logging policy allows it.

Because the communicated EMP limit is 1 MB, DPMDP must ensure that a single Kafka message payload stays below this limit.

## Connecting to EMP Kafka to Receive DPMDP Messages

A consuming application receives DPMDP messages by connecting to EMP Kafka as a Kafka consumer and subscribing to the EMP topic that carries DPMDP messages.

The consumer needs its own client identity and certificate bundle. In many deployments, `trust.pem` can be shared across clients in the same EMP environment, but `cert.pem` and `key.pem` should normally be issued for the consuming application identity. A consumer should not reuse the DPMDP private key unless EMP explicitly defines that as the intended deployment model.

Example consumer configuration:

```javascript
const consumerConfig = {
  "bootstrap.servers": "<emp-kafka-host>:9092",
  "client.id": "dpmdp-message-consumer",
  "group.id": "dpmdp-message-consumer-group",
  "security.protocol": "ssl",
  "ssl.ca.location": "/opt/consumer/secrets/emp-kafka/trust.pem",
  "ssl.certificate.location": "/opt/consumer/secrets/emp-kafka/cert.pem",
  "ssl.key.location": "/opt/consumer/secrets/emp-kafka/key.pem"
};

const topicName = "<dpmdp-topic-name>";
```

The consumer group ID controls message consumption behavior:
- Consumers with the same `group.id` share the topic partitions and process each message once per group.
- Consumers with different `group.id` values each receive their own copy of the messages from the topic.

In ApplicationPattern configuration, the same deployment values can be represented by fields such as `client-id`, `group-id`, and `topic-name`. When configuring a `librdkafka` based client directly, use the `librdkafka` property names such as `client.id`, `group.id`, and `bootstrap.servers`.

## Local Validation

The EMP-provided PEM bundle is for the client side. It is not sufficient to start a local Kafka broker.

Kafka brokers are Java-based and normally require their own server-side keystore and truststore configuration, typically in PKCS#12 or JKS format. Therefore, when validating locally with images such as `confluentinc/cp-kafka`, a separate broker-side TLS setup is required.

For local validation:
- Create or provide a local broker certificate and broker keystore/truststore.
- Configure the local Kafka broker SSL listener with the broker-side stores.
- Configure the DPMDP NodeJS client with the PEM files and `librdkafka` SSL properties.
- Use local validation only to prove the client-side wiring. EMP broker trust, ACLs, DNS, topics, and certificate authorization still have to be validated against EMP.

## Deployment Checklist

- EMP broker host and port are configured.
- EMP topic name for DPMDP messages is configured.
- `trust.pem`, `cert.pem`, and `key.pem` are mounted into the container at runtime.
- Kafka client configuration uses container-internal certificate paths.
- `security.protocol` is set to `ssl`.
- DPMDP client certificate is authorized by EMP for publishing to the topic.
- Consumer certificate is authorized by EMP for reading from the topic.
- DPMDP messages are kept below the EMP message-size limit.
- Producer delivery reports or logs confirm successful publishing.
- Consumer logs confirm successful subscription and message receipt.

## References

- [Kafka shared component documentation](../../SharedComponents/Kafka/Kafka.md)
- [Kafka Streams shared component documentation](../../SharedComponents/Kafka/KafkaStreams.md)
- [Confluent Kafka JavaScript client](https://github.com/confluentinc/confluent-kafka-javascript)
- [librdkafka configuration properties](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)
- [Confluent mTLS authentication overview](https://docs.confluent.io/platform/current/security/authentication/mutual-tls/overview.html#tls-authentication-overview)

[<- Back to Deploying Applications](../DeployingApplications.md)
