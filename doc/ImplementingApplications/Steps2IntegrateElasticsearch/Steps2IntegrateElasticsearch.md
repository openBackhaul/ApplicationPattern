## Integrate Elasticsearch

The file ElasticsearchService.js contains class ElasticsearchService, operationalStateEnum and some helper exported methods. You can find detailed explanation on where and how to use it below in section `How to use ElasticsearchService`.

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

### service/ElasticsearchClientService.js

All the service methods are implemented using the same standard as any other application/service methods, except for following:

```
exports.putElasticsearchClientApiKey = async function(url, body, uuid) {
  let oldValue = await getApiKeyAsync(uuid);
  if (oldValue !== body['elasticsearch-client-interface-1-0:api-key']) {
    await fileOperation.writeToDatabaseAsync(url, body, false);
    // recreate the client with new connection data
    await elasticsearchService.getClient(true, uuid);
    await ElasticsearchPreparation.prepareElasticsearch();
  }
}
```
The method `putElasticsearchClientApiKey` might change connection configuration of ES. Therefore we need to:
-  determine, if the API key was indeed changed, by comparing with previous version of the stored API key and if it was changed:
    1. write the new API key to config file
    2. recreate the client with new connection data, by calling `getClient(true, uuid)` - `forceCreate` parameter is set to true
    3. call `prepareElasticsearch` to ensure, that the index aliases and ES itself are accessible with this new API key

```
exports.putElasticsearchClientIndexAlias = async function(url, body, uuid) {
  let oldValue = await getIndexAliasAsync(uuid);
  let oldPolicy = await elasticsearchService.getElasticsearchClientServiceRecordsPolicyAsync(uuid);
  if (oldValue !== body['elasticsearch-client-interface-1-0:index-alias']) {
    await fileOperation.writeToDatabaseAsync(url, body, false);
    await ElasticsearchPreparation.prepareElasticsearch();
  }
  // we need to reassign policy associated with the old alias to the new
  if (oldPolicy) {
    await elasticsearchService.assignPolicyToIndexTemplate(oldPolicy["service-records-policy-name"], uuid);
  }
}
```
Similarly, method `putElasticsearchClientIndexAlias` should:
- determine, if the index alias has changed, by comparing with previous version of the stored API key and if it was changed:
    1. write the new index alias to config file
    2. call `prepareElasticsearch` to ensure, that the index aliases are accessible
    3. if policy was assigned to the previous index, reassign it to this one
```
exports.putElasticsearchClientServiceRecordsPolicy = function(uuid, body) {
  return new Promise(async function(resolve, reject) {
    try {
      await elasticsearchService.putElasticsearchClientServiceRecordsPolicyAsync(uuid, body);
      let policy = body["elasticsearch-client-interface-1-0:service-records-policy"];
      await elasticsearchService.assignPolicyToIndexTemplate(policy["service-records-policy-name"], uuid);
      resolve();
    } catch (error) {
      reject();
    }
  });
}
```
Method `putElasticsearchClientServiceRecordsPolicy` should:
1. call `elasticsearchService.putElasticsearchClientServiceRecordsPolicyAsync()`, this will insert the service record policy to ES
2. call `elasticsearchService.assignPolicyToIndexTemplate()`, this will ensure that the service policy is used with the configured index


The methods `getElasticsearchClientOperationalState`, `getElasticsearchClientServiceRecordsPolicyAsync` should call methods with the same name in ElasticsearchService.

### service/TcpClientService.js

All the service methods are implemented using the same standard as any other application/service methods, except for following, where ES handling needs to be added:

Example:
```
exports.putTcpClientRemoteAddress = function (body, uuid) {
  return new Promise(async function (resolve, reject) {
    try {
      let oldValue = await tcpClientInterface.getRemoteAddressAsync(uuid);
      let newValue = body["tcp-client-interface-1-0:remote-address"];
      if (oldValue !== newValue) {
        let isUpdated = await tcpClientInterface.setRemoteAddressAsync(uuid, newValue);
        if(isUpdated){
          let forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
            uuid
          );
          ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
            forwardingAutomationInputList
          );
          if (isTcpClientElasticsearch(uuid)) {
            // recreate the client with new connection data
            await elasticsearchService.getClient(true);
            await prepareElasticsearch();
          }
        }
      }
      resolve();
    } catch (error) {
      reject();
    }
  });
}
```

The methods `putTcpClientRemoteAddress`, `putTcpClientRemotePort` and `putTcpClientRemoteProtocol` can all change connection parameters for Elasticsearch, if changed TCP client is tied to an ES client. To determine this, call helper method `isTcpClientElasticsearch` from ApplicationPattern/ElasticsearchService. Next step is to call `getClient()` with `forceCreate` parameter set to true and `prepareElasticsearch()`.