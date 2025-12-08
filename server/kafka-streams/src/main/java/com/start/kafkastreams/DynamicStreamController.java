package com.start.kafkastreams;

// import com.start.kafkastreams.StreamStartRequest;
// import com.start.kafkastreams.KafkaStreamsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stream")
public class DynamicStreamController {

    private final KafkaStreamsService streamsService;

    public DynamicStreamController(KafkaStreamsService streamsService) {
        this.streamsService = streamsService;
    }

    /** POST /stream/start (body = StreamStartRequest JSON) */
    @PostMapping("/start")
    public ResponseEntity<String> start(@Valid @RequestBody StreamStartRequest body) {
        streamsService.start(body);
        return ResponseEntity.ok("Kafka Streams started.");
    }

    /** POST /stream/stop */
    @PostMapping("/stop")
    public ResponseEntity<String> stop() {
        streamsService.stop();
        return ResponseEntity.ok("Kafka Streams stopped.");
    }

    /** GET /stream/status */
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok(streamsService.isRunning() ? "RUNNING" : "STOPPED");
    }
}
