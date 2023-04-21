## Elasticsearch (ES)

**Disclaimer**: This guide is not meant to be a manual for ES itself,
it only covers areas implemented in ApplicationPattern and guides how to use
the class ElasticsearchService in your application. For more information about
Elasticsearch, go to [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/index.html).

**Note**: The version of Elasticsearch used in ApplicationPattern is 7.17 and so all the documentation from official website should be
looked at with this version in mind.

### What is ES and why should my application use it?

ES is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured, and unstructured. Your application should consider using it, if:
- it will store large amounts of data
- it will store data often

### Brief introduction to ES buzzwords

- `document`: basic building block in ES
- `data`: contents of document. Elasticsearch stores complex data structures that have been serialized as JSON documents.
- `id`: unique document identifier
- `_source`: where the user data is stored
- `index`: group of documents. One index groups data that are structured in the same way.
- `alias`: multiple indices can be grouped under an index alias
- `service policy`: is a set of rules, that determine when should be an index rolled over, deleted or do any other action specified in the policy. Index alias can be assigned a service policy. 
- `index template`: link between index alias and a service policy. This template gives its properties to each index within the assigned index alias, including, but not limited to service policy, mapping and other settings. 
- `client`: ES Javascript client to execute requests towards ES 

See [documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/api-reference.html).

### ElasticsearchService implementation in ApplicationPattern

#### Configuration

Application configuration should contain at least three LTPs:

* [ES client](#es-client)
* [HTTP client](#http-client)
* [TCP client](#tcp-client)

##### **ES client**
Elasticsearch client LTP contains API key and index alias. If your application needs to use more aliases, you need to have more client LTPs. API key should be configured on ES directly.
```
{
  "uuid": "xx-1-0-0-es-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
  ],
  "server-ltp": [
    "xx-1-0-0-http-c-es-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "elasticsearch-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_ELASTICSEARCH_LAYER",
      "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac": {
        "elasticsearch-client-interface-configuration": {
          "auth": {
            "api-key": "API key not yet defined."
          },
          "index-alias": " >>> Application specific IndexAlias <<< "
        },
        "elasticsearch-client-interface-status": {
          "operational-state": "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
          "life-cycle-state": "elasticsearch-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
        }
      }
    }
  ]
}
```

#### **HTTP client**
```
{
  "uuid": "xx-1-0-0-http-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "xx-1-0-0-es-c-es-1-0-0-000"
  ],
  "server-ltp": [
    "xx-1-0-0-tcp-c-es-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
      "http-client-interface-1-0:http-client-interface-pac": {
        "http-client-interface-configuration": {
          "application-name": "ElasticSearch",
          "release-number": "1.0.0"
        }
      }
    }
  ]
}
```

#### **TCP client**
TCP client is where IP address and port of running ES should be configured. If more ES clients are present in config file, they need to be all added here under client-ltp array.
```
{
  "uuid": "xx-1-0-0-tcp-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "xx-1-0-0-http-c-es-1-0-0-000"
  ],
  "server-ltp": [
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-client-interface-1-0:tcp-client-interface-pac": {
        "tcp-client-interface-configuration": {
          "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
          "remote-address": {
            "ip-address": {
              "ipv-4-address": "1.1.3.15"
            }
          },
          "remote-port": 3015
        }
      }
    }
  ]
}
```