package com.start.kafkastreams;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.streams.StreamsConfig;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import org.springframework.kafka.support.serializer.JsonSerde;

import java.util.Map;

@Configuration
public class StreamBaseConfig {

    private final KafkaProperties kafkaProps;

    public StreamBaseConfig(KafkaProperties kafkaProps) {
        this.kafkaProps = kafkaProps;
    }

    @Bean(name = "defaultKafkaStreamsConfig")
    public KafkaStreamsConfiguration kafkaStreamsConfiguration(SslBundles sslBundles) {
        // Spring Boot 3.2+ requires this overload
        Map<String, Object> props = kafkaProps.buildStreamsProperties(sslBundles);
        return new KafkaStreamsConfiguration(props);
    }

    @Bean
    public JsonNodeSerde jsonSerde() {
        JsonNodeSerde serde = new JsonNodeSerde();
        // serde.configure(Map.of(StreamsConfig.APPLICATION_ID_CONFIG, "unused"),
        // false);
        return serde;
    }
}
