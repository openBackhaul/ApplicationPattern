package com.start.kafkastreams;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class StreamStartRequest {

    @NotBlank
    private String inputTopic;

    @NotEmpty
    private List<OutputConfig> outputs;

    // Getters & setters ----------------------------------------------------

    public String getInputTopic() {
        return inputTopic;
    }

    public void setInputTopic(String inputTopic) {
        this.inputTopic = inputTopic;
    }

    public List<OutputConfig> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<OutputConfig> outputs) {
        this.outputs = outputs;
    }

    // ----------------------------------------------------------------------

    public static class OutputConfig {
        @NotBlank
        private String outputTopic;
        @NotBlank
        private String filter;

        public String getOutputTopic() {
            return outputTopic;
        }

        public void setOutputTopic(String outputTopic) {
            this.outputTopic = outputTopic;
        }

        public String getFilter() {
            return filter;
        }

        public void setFilter(String filter) {
            this.filter = filter;
        }
    }
}
