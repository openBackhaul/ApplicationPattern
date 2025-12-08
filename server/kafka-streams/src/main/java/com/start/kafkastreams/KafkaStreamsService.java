package com.start.kafkastreams;

import com.start.kafkastreams.JsonNodeSerde;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.Branched;
import org.apache.kafka.streams.kstream.BranchedKStream;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

@Service
public class KafkaStreamsService {

    private final KafkaStreamsConfiguration baseConfig;
    private final JsonNodeSerde jsonSerde;

    private KafkaStreams streams; // active instance

    public KafkaStreamsService(KafkaStreamsConfiguration baseConfig, JsonNodeSerde jsonSerde) {
        this.baseConfig = baseConfig;
        this.jsonSerde = jsonSerde;
    }

    /**
     * Build and start a topology using the user-supplied request body.
     * Uses Kafka Streams 3.6+ "split / BranchedKStream" API.
     */
    public synchronized void start(StreamStartRequest req) {
        stop(); // shut down any running topology

        StreamsBuilder builder = new StreamsBuilder();

        // ── Source stream – JSON records from the input topic ─────────────
        KStream<String, JsonNode> source = builder.stream(req.getInputTopic(),
                Consumed.with(Serdes.String(), jsonSerde));

        // ── Build dynamic branches with the new API ───────────────────────
        BranchedKStream<String, JsonNode> branched = source.split();

        // Add a branch for every {outputTopic, filter} pair
        req.getOutputs().forEach(outCfg -> {
            String field = outCfg.getFilter();
            String outputTopic = outCfg.getOutputTopic();

            branched.branch(
                    (k, v) -> v != null && v.has(field), // predicate
                    Branched.withConsumer(ks -> ks.peek((k, v) -> System.out.printf(
                            "→ %s: %s%n", outputTopic, v)) // optional log
                            .to(outputTopic, Produced.with(Serdes.String(), jsonSerde))));
        });

        // Default / fallback branch (unmatched records)
        branched.defaultBranch(
                Branched.withConsumer(ks -> ks.peek((k, v) -> System.out.println("→ other-notifications-topic: " + v))
                        .to("other-notifications-topic", Produced.with(Serdes.String(), jsonSerde))));

        // ── Build & start KafkaStreams instance ───────────────────────────
        Properties props = new Properties();
        props.putAll(baseConfig.asProperties());
        props.put(StreamsConfig.APPLICATION_ID_CONFIG,
                "dynamic-app-" + UUID.randomUUID());

        streams = new KafkaStreams(builder.build(), props);
        streams.start();
    }

    /** Gracefully stop the running topology (if any) */
    public synchronized void stop() {
        if (streams != null) {
            streams.close(Duration.ofSeconds(5));
            streams.cleanUp(); // safe because every run gets a new application.id
            streams = null;
        }
    }

    /** Check if the topology is currently running */
    public synchronized boolean isRunning() {
        return streams != null &&
                streams.state() == KafkaStreams.State.RUNNING;
    }
}
