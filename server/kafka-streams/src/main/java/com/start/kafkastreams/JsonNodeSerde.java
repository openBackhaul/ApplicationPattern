package com.start.kafkastreams;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serializer;

public class JsonNodeSerde extends Serdes.WrapperSerde<JsonNode> {
    public JsonNodeSerde() {
        super(new JsonSerializer(), new JsonDeserializer());
    }

    public static class JsonSerializer implements Serializer<JsonNode> {
        private final ObjectMapper mapper = new ObjectMapper();

        @Override
        public byte[] serialize(String topic, JsonNode data) {
            try {
                return mapper.writeValueAsBytes(data);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static class JsonDeserializer implements Deserializer<JsonNode> {
        private final ObjectMapper mapper = new ObjectMapper();

        @Override
        public JsonNode deserialize(String topic, byte[] data) {
            try {
                return mapper.readTree(data);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
