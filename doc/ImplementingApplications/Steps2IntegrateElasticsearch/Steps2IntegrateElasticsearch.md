## Integrate Elasticsearch (ES)

Disclaimer: This guide is not meant to be a manual for ES itself,
it only covers areas implemented in ApplicationPattern and guides how to use
the class ElasticsearchService in your application. For more information about
Elasticsearch, go to [official documentation](https://www.elastic.co/).

### What is ES and why should my application use it?

ES is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured, and unstructured. Your application should consider using it, if:
- it will store large amounts of data
- it will store data often

### Brief introduction to ES buzzwords

Basic building block in ES is `document`. By this word, ES understands one item of `data`. 
Documents have own `_id` and `_source`, where the actual data is stored. Documents are grouped
into `indices`. One index groups data that are structured in the same way. Multiple indices
can be grouped under an index `alias`. Index alias can be assigned a `service policy`. 
Service policy is a set of rules, that determine when should be an index rolled over, deleted
or do any other action specified in the policy. Index alias is tied to a service policy by an
`index template`. This template gives it's properties to each index within the assigned index
alias, including, but not limited to service policy, mapping and other settings. In order to execute requests towards ES, an ES
Javascript `client` is used. See [documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/api-reference.html).

### ElasticsearchService implementation in ApplicationPattern

The version of Elasticsearch used in ApplicationPattern is 7.17 and so all the documentation from official website should be
looked at with this version in mind.

#### Configuration

Application configuration should contain at least three LTPs.

**ES client** itself with API key and index alias. If your application needs to use more aliases, you need to have more client LTPs. API key should be configured on ES directly.
```
{
    "uuid": "alt-2-0-1-es-c-es-1-0-0-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
    ],
    "server-ltp": [
        "alt-2-0-1-http-c-es-1-0-0-000"
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
            "index-alias": "alt-2-0-1"
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

**HTTP client**
```
{
    "uuid": "alt-2-0-1-http-c-es-1-0-0-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
        "alt-2-0-1-es-c-es-1-0-0-000"
    ],
    "server-ltp": [
        "alt-2-0-1-tcp-c-es-1-0-0-000"
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

**TCP client**, where IP address and port of running ES should be configured. If more ES clients are present in config file, they need to be all added here under client-ltp array.
```
{
    "uuid": "alt-2-0-1-tcp-c-es-1-0-0-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
        "alt-2-0-1-http-c-es-1-0-0-000"
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

The file ElasticsearchService.js contains class ElasticsearchService, operationalStateEnum and some helper exported methods.

- `operationalStateEnum` : should be used when handling operational-state field in operation-client-interface-status
- `createResultArray` : helper method to reduce the boilerplate attributes ES adds to it's response
- `isTcpClientElasticsearch` : given a TCP UUID, returns true if
this TCP client id wired to an ES client, false if not
- `getIndexAliasAsync` : returns index alias of configured ES client
- `getApiKeyAsync` : returns api key of configured ES client

### ElasticsearchService class

Exported is one instance of this class. This is to ensure, that applications will maintain their ES client in all their requests
and not create new one all the time.

This class maintains a map of created clients. Each client is identified by UUID of the configured ES client LTP. An application
can have more clients. Each needs to have it's own LTP in the application configuration, along with API key and index alias.
Most of the methods have UUID as optional parameter. This should be used, when an application has more ES clients configured, so that the server-side implementation knows which ES client to use. If UUID is not specified, the implementation will look for the one ES client in configuration and use it.

### How to use ElasticsearchService

Initial method should be always `getClient`. This method contains two parameters, `forceCreate` and `uuid`. UUID is
used as described above. `forceCreate` parameters should be used to recreate the client instead of using already created one. This should be set to true, when any of the configuration parameter changes (API key, IP address, port, protocol). Each application has REST API methods to handle these changes (controller folder).

After obtaining the client, you can execute requests to ES. As a mandatory parameter, you need to find index alias.
This can be done using `getIndexAliasAsync` method.

Example:
```
let client = await elasticsearchService.getClient(false, ELASTICSEARCH_CLIENT_CC_UUID);
let indexAlias = await getIndexAliasAsync(ELASTICSEARCH_CLIENT_CC_UUID);
let res = await client.search({
    index: indexAlias,
    filter_path: "hits.hits._source",
    body: {
        "query": {
            "term": {
                "uuid": controlConstructUuid
            }
        }
    }
});
if (Object.keys(res.body).length === 0) {
    throw new Error(`Could not find existing control-construct with UUID ${controlConstructUuid}`);
}
let controlConstruct = createResultArray(res);
```

### Elasticsearch Preparation

In addition to methods within ElasticsearchService, each application intending to use ES, should create
a class called `ElasticsearchPreparation`. This class should ensure, that the connection to ES is live and
ES is properly configured. 

As a first step, it should ensure that ES connection parameters are correct and the APP can connect to ES.
For this, ElasticsearchService contains a method called `getElasticsearchClientOperationalStateAsync`.
This method issues a ping to URL configured in config file.

If the ping was successful, it should check whether configured index aliases exist in ES and if they have
proper settings. The settings depend on the application.

Currently, 3 applications use ES: *ExecutionAndTraceLog*, *OamLog* and *ApplicationLayerTopology*.
