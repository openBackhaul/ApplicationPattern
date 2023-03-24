**ElasticsearchService.js**

This is a description of file ElasticsearchService.js. For more information about the Elasticsearch concept, consult [here](../../ConceptOfElasticsearch/ConceptOfElasticsearch.md).

* ElasticsearchService
    * [new ElasticsearchService()](#new_ElasticsearchService_new)
    * [.getClient(forceCreate, [uuid])](#ElasticsearchService+getClient) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getElasticsearchClientOperationalStateAsync([uuid])](#ElasticsearchService+getElasticsearchClientOperationalStateAsync) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.putElasticsearchClientServiceRecordsPolicyAsync(uuid, body)](#ElasticsearchService+putElasticsearchClientServiceRecordsPolicyAsync) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.assignPolicyToIndexTemplate(policyName, [uuid])](#ElasticsearchService+assignPolicyToIndexTemplate) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getExistingIndexTemplate([uuid])](#ElasticsearchService+getExistingIndexTemplate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getElasticsearchClientServiceRecordsPolicyAsync([uuid])](#ElasticsearchService+getElasticsearchClientServiceRecordsPolicyAsync) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.updateControlConstructWithServicePolicy(controlConstruct)](#ElasticsearchService+updateControlConstructWithServicePolicy) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.createAlias([uuid])](#ElasticsearchService+createAlias) ⇒ <code>Promise.&lt;void&gt;</code>
* [getApiKeyAsync([uuid])](#getapikeyasyncuuid-⇒-promisestring) ⇒ <code>Promise.&lt;String&gt;</code>
* [getIndexAliasAsync([uuid])](#getindexaliasasyncuuid-⇒-promisestring) ⇒ <code>Promise.&lt;String&gt;</code>
* [isTcpClientElasticsearch(tcpClientUuid)](#istcpclientelasticsearchtcpclientuuid-⇒-promiseboolean) ⇒ <code>Promise.&lt;Boolean&gt;</code>
* [createResultArray(result)](#createresultarrayresult-⇒-array) ⇒ <code>Array</code>

## new ElasticsearchService()
This class represents Elasticsearch service running on server.

Version of Elasticsearch used is 7.

Exported is one instance of this class.

## elasticsearchService.getClient(forceCreate, [uuid]) ⇒ <code>Promise.&lt;object&gt;</code>
This method MUST be called in order to use Elasticsearch client directly.
There is always one instance of ES client runnning within this class. This class maintains
an ES client for each ES instance configured (uuid). If any information from following
list changes, it's the responsibility of the caller to set 'forceCreate' parameter to true.
- IP address
- protocol
- port
- API key

Each error coming from Elasticsearch is logged to console. Users of this client MUST handle
ElasticsearchClientError accordingly.

Client is configured with 2s request timeout. If a request is expected to take longer, this
parameter can be overriden in the specific request.

**Returns**: <code>Promise.&lt;object&gt;</code> - Elasticsearch client version 7

| Param | Type | Description |
| --- | --- | --- |
| forceCreate | <code>boolean</code> | should be set to true in caller methods where any attribute of ES configuration has changed, eg. IP address, API Key to force recreating the client. |
| [uuid] | <code>String</code> | optional, Elasticsearch client uuid, denotes client uuid (MUST be used if there are more ES clients configured) |

## elasticsearchService.getElasticsearchClientOperationalStateAsync([uuid]) ⇒ <code>Promise.&lt;String&gt;</code>
Issues ping to Elasticsearch instance. Returns operational state UNAVAILABLE
if a connection error occurs.
MUST be used to implement getElasticsearchClientOperationalState REST API method

**Returns**: <code>Promise.&lt;String&gt;</code> - AVAILABLE if the ping returns with http status code 200, UNAVAILABLE if not

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | optional, UUID of Elasticsearch client |

## elasticsearchService.putElasticsearchClientServiceRecordsPolicyAsync(uuid, body) ⇒ <code>Promise.&lt;object&gt;</code>
Creates/updates service records policy object in Elasticsearch instance
MUST be used to implement putElasticsearchClientServiceRecordsPolicy REST API method

**Returns**: <code>Promise.&lt;object&gt;</code> - result of the putLifecycle operation

| Param | Type | Description |
| --- | --- | --- |
| uuid | <code>String</code> | optional, UUID of Elasticsearch client |
| body | <code>object</code> | service records policy |

## elasticsearchService.assignPolicyToIndexTemplate(policyName, [uuid]) ⇒ <code>Promise.&lt;void&gt;</code>
Rewrites index-template to include service policy
with given name.

This method will be also called when index-alias changes in the
config file, to 'reassign' service policy from old index-alias
to new one.

| Param | Type | Description |
| --- | --- | --- |
| policyName | <code>String</code> | Service policy that should be assigned to configured index-alias. |
| [uuid] | <code>String</code> | UUID of ES client in Config file |

## elasticsearchService.getExistingIndexTemplate([uuid]) ⇒ <code>Promise.&lt;Object&gt;</code>
Returns index-template associated with configured
index-alias. First request returns all configured index-templates,
where it searches for index-alias among index-patterns.

**Returns**: <code>Promise.&lt;Object&gt;</code> - existing template or undefined if there is no such template

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | UUID of ES client in Config file |

## elasticsearchService.getElasticsearchClientServiceRecordsPolicyAsync([uuid]) ⇒ <code>Promise.&lt;object&gt;</code>
Fetches service records policy associated with configured index alias.
MUST be used to implement getElasticsearchClientServiceRecordsPolicy REST API method

**Returns**: <code>Promise.&lt;object&gt;</code> - service records policy if the policy exists

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | optional, UUID of Elasticsearch client |

## elasticsearchService.updateControlConstructWithServicePolicy(controlConstruct) ⇒ <code>Promise.&lt;Object&gt;</code>
Updates controlConstruct object with information about service policy
configured for each Elasticsearch client.

**Returns**: <code>Promise.&lt;Object&gt;</code> - controlConstruct object enriched with service-policy-record object

| Param | Type |
| --- | --- |
| controlConstruct | <code>Object</code> | 

## elasticsearchService.createAlias([uuid]) ⇒ <code>Promise.&lt;void&gt;</code>
Creates index-alias with first index serving
as write_index (if such alias does not exist yet). Such
index will always end with '-000001' to allow for automated
rollover.

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | optional, UUID of Elasticsearch client |

## getApiKeyAsync([uuid]) ⇒ <code>Promise.&lt;String&gt;</code>
Performs uuid check.

**Returns**: <code>Promise.&lt;String&gt;</code> - configured API key for Elasticsearch

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | optional, UUID of Elasticsearch client |

## getIndexAliasAsync([uuid]) ⇒ <code>Promise.&lt;String&gt;</code>
Returns index alias from config file. If uuid is present, performs check if
its an ES client uuid, if it's not present, assumes only one ES client is configured.

**Returns**: <code>Promise.&lt;String&gt;</code> - index alias from config file

| Param | Type | Description |
| --- | --- | --- |
| [uuid] | <code>String</code> | optional, UUID of Elasticsearch client |

## createResultArray(result) ⇒ <code>Array</code>
Helper method, creates Javascript array from Elasticsearch response.

**Returns**: <code>Array</code> - resulting array

| Param | Type | Description |
| --- | --- | --- |
| result | <code>object</code> | Elasticsearch response |

## isTcpClientElasticsearch(tcpClientUuid) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks whether given TCP client UUID belongs to an Elasticsearch client.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if the TCP client is configured for an Elasticsearch client

| Param | Type | Description |
| --- | --- | --- |
| tcpClientUuid | <code>String</code> | TCP client UUID |