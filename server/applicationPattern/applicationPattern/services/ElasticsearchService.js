// @ts-check
'use strict'

const LogicalTerminationPoint = require('../onfModel/models/LogicalTerminationPoint');
const LayerProtocol = require('../onfModel/models/LayerProtocol');
const { Client } = require('@elastic/elasticsearch');
const ControlConstruct = require('../onfModel/models/ControlConstruct');
const TcpClientInterface = require('../onfModel/models/layerProtocols/TcpClientInterface');
const onfAttributes = require('../onfModel/constants/OnfAttributes');

const operationalStateEnum = {
  AVAILABLE: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_AVAILABLE",
  UNAVAILABLE: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_UNAVAILABLE",
  NOT_YET_DEFINED: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED"
};

/**
 * @description This class represents Elasticsearch service running on server.
 *
 * Version of Elasticsearch used is 7.
 *
 * Exported is one instance of this class.
 */
class ElasticsearchService {

  /**
   * @private
   */
  _clients

  constructor() {
    this._clients = new Map();
  }

  /**
   * @description This method MUST be called in order to use Elasticsearch client directly.
   * There is always one instance of ES client runnning within this class. This class maintains
   * an ES client for each ES instance configured (uuid). If any information from following
   * list changes, it's the responsibility of the caller to set 'forceCreate' parameter to true.
   * - IP address
   * - protocol
   * - port
   * - API key
   *
   * Each error coming from Elasticsearch is logged to console. Users of this client MUST handle
   * ElasticsearchClientError accordingly.
   *
   * Client is configured with 2s request timeout. If a request is expected to take longer, this
   * parameter can be overriden in the specific request.
   *
   * @param {boolean} forceCreate should be set to true in caller methods where any attribute of
   * ES configuration has changed, eg. IP address, API Key to force recreating the client.
   * @param {String} [uuid] optional, Elasticsearch client uuid, denotes client uuid (MUST be used if there
   * are more ES clients configured)
   *
   * @returns {Promise<object>} Elasticsearch client version 7
   */
  async getClient(forceCreate, uuid) {
    let esUuid = await getElasticsearchClientUuidAsync(uuid);
    let client = this._clients.get(esUuid);
    if (client) {
      if (forceCreate) {
        client.close()
      } else {
        return client;
      }
    }
    client = new Client(await configureClientAsync(esUuid));
    // eslint-disable-next-line no-unused-vars
    client.on('response', (err, result) => {
      if (err) {
        console.error(`Elasticsearch error occurred: ${err}`);
      }
    });
    this._clients.set(esUuid, client);
    return client;
  }

  /**
   * @description Issues ping to Elasticsearch instance. Returns operational state UNAVAILABLE
   * if a connection error occurs.
   * MUST be used to implement getElasticsearchClientOperationalState REST API method
   * @param {String} [uuid] optional, UUID of Elasticsearch client
   * @returns {Promise<String>} AVAILABLE if the ping returns with http status code 200, UNAVAILABLE if not
   */
  async getElasticsearchClientOperationalStateAsync(uuid) {
    let client = await this.getClient(false, uuid);
    try {
      let ping = await client.ping();
      return (ping.statusCode === 200) ?
        operationalStateEnum.AVAILABLE : operationalStateEnum.UNAVAILABLE;
    } catch (error) {
      console.log(error);
      return operationalStateEnum.UNAVAILABLE;
    }
  }

  /**
   * @description Creates/updates service records policy object in Elasticsearch instance
   * MUST be used to implement putElasticsearchClientServiceRecordsPolicy REST API method
   * @param {String} uuid optional, UUID of Elasticsearch client
   * @param {object} body service records policy
   * @returns {Promise<object>} result of the putLifecycle operation
   */
  async putElasticsearchClientServiceRecordsPolicyAsync(uuid, body) {
    let client = await this.getClient(false, uuid);
    let policyBody = body["elasticsearch-client-interface-1-0:service-records-policy"];
    let name = policyBody["service-records-policy-name"];
    let description = policyBody["description"];
    let project = policyBody["project"];
    let updatedPhases = replaceAllObjKeys(policyBody["phases"], (key) => key.replaceAll("-", "_"));
    let result = await client.ilm.putLifecycle({
      "policy": name,
      "body": {
        "policy": {
          "_meta": {
            "description": description,
            "project": project
          },
          "phases": updatedPhases
        }
      }
    });
    return result;
  }

  /**
   * @description Rewrites index-template to include service policy
   * with given name.
   *
   * This method will be also called when index-alias changes in the
   * config file, to 'reassign' service policy from old index-alias
   * to new one.
   *
   * @param {String} policyName Service policy that should be assigned to
   * configured index-alias.
   * @param {String} [uuid] UUID of ES client in Config file
   * @returns {Promise<void>}
   */
  async assignPolicyToIndexTemplate(policyName, uuid) {
    let indexAlias = await getIndexAliasAsync(uuid);
    let template = await this.getExistingIndexTemplate(uuid);
    if (!template) {
      return;
    }
    let client = await this.getClient(false, uuid);
    template['body']['template']['settings']['index']['lifecycle'] = {
      'name': policyName,
      'rollover_alias': indexAlias
    };
    await client.indices.putIndexTemplate(template);
    // call rollover to immediatelly create new index with applied policy
    await client.indices.rollover({
      alias: indexAlias
    });
  }

  /**
   * @description Returns index-template associated with configured
   * index-alias. First request returns all configured index-templates,
   * where it searches for index-alias among index-patterns.
   *
   * @param {String} [uuid] UUID of ES client in Config file
   * @returns {Promise<Object>} existing template or undefined if there is
   * no such template
   */
  async getExistingIndexTemplate(uuid) {
    let indexAlias = await getIndexAliasAsync(uuid);
    let client = await this.getClient(false, uuid);
    let response = await client.indices.getIndexTemplate({
      filter_path: '*.name,**.index_patterns'
    });
    let found = response.body.index_templates.find(item => {
      return item['index_template']['index_patterns'].includes(`${indexAlias}-*`)
    });
    if (found) {
      let name = found['name'];
      let existingTemplate = await client.indices.getIndexTemplate({
        name: name
      });
      let body = existingTemplate.body.index_templates[0].index_template;
      return { name, body };
    }
    return undefined;
  }

  /**
   * @description Fetches service records policy associated with configured index alias.
   * MUST be used to implement getElasticsearchClientServiceRecordsPolicy REST API method
   * @param {String} [uuid] optional, UUID of Elasticsearch client
   * @returns {Promise<object>} service records policy if the policy exists
   */
  async getElasticsearchClientServiceRecordsPolicyAsync(uuid) {
    let client = await this.getClient(false, uuid);
    let indexAlias = await getIndexAliasAsync(uuid);
    let policy = await client.indices.getSettings({
      "index": indexAlias,
      "name": "index.lifecycle.name"
    });
    if (Object.keys(policy.body).length === 0) {
      return {
        "service-records-policy-name": "",
        "phases": {}
      }
    }
    let indexName = Object.keys(policy.body)[0];
    let policyName = policy.body[indexName].settings.index.lifecycle.name;
    if (policyName === '') {
      return {
        "service-records-policy-name": "",
        "phases": {}
      }
    }
    let result = await client.ilm.getLifecycle({
      "policy": policyName
    });
    let updatedPhases = replaceAllObjKeys(result.body[policyName].policy.phases, (key) => key.replaceAll("_", "-"));
    let policyDetail = {
      "service-records-policy-name": policyName,
      "phases": updatedPhases
    }
    return policyDetail;
  }

  /**
   * @description Updates controlConstruct object with information about service policy
   * configured for each Elasticsearch client.
   * @param {Object} controlConstruct
   * @returns {Promise<Object>} controlConstruct object enriched with service-policy-record object
   */
  async updateControlConstructWithServicePolicy(controlConstruct) {
    let ltps = await ControlConstruct.getLogicalTerminationPointListAsync(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);
    let uuids = ltps.flatMap(ltp => ltp[onfAttributes.GLOBAL_CLASS.UUID]);
    for (let uuid of uuids) {
      let serviceRecordPolicy = await this.getElasticsearchClientServiceRecordsPolicyAsync(uuid);
      let found = controlConstruct['logical-termination-point'].find(u => u['uuid'] === uuid);
      found['layer-protocol'][0][onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC][onfAttributes.ES_CLIENT.CONFIGURATION]['service-records-policy'] = serviceRecordPolicy;
    }
    return controlConstruct;
  }

  /**
   * @description Creates index-alias with first index serving
   * as write_index (if such alias does not exist yet). Such
   * index will always end with '-000001' to allow for automated
   * rollover.
   * @param {String} [uuid] optional, UUID of Elasticsearch client
   * @returns {Promise<void>}
   */
  async createAlias(uuid) {
    let indexAlias = await getIndexAliasAsync(uuid);
    let client = await this.getClient(false, uuid);
    let alias = await client.indices.existsAlias({
      name: indexAlias
    });
    if (!alias.body) {
      await client.indices.create({
          index: `${indexAlias}-000001`,
          body: {
            aliases: {
              [indexAlias]: {
                is_write_index: true
              }
            }
          }
      });
    }
  }

  /**
   * Method for scrolling results above 10k records.
   *
   * @description This approach uses 'scroll' API from Elasticsearch. This method should NOT
   * be used when underlying data is changeable. Returns an empty array in response object when
   * from param is bigger than the total number of records.
   *
   * @param {Number} from index from which we want to read documents
   * @param {Number} size how many documents do we want to read
   * @param {Object} query ES query to be used to filter the documents
   * @param {String} [uuid] optional, UUID of ES client
   * @throws Error if from+size do not exceed 10k
   * @returns {Promise<Object>} { response, took } 
   */
  async scroll(from, size, query, uuid) {
    // check if we should be using this method
    if ((from + size) <= 10000) {
      throw new Error("This method should not be used for queries with results below 10k.");
    }
    let indexAlias = await getIndexAliasAsync(uuid);
    let client = await this.getClient(false, uuid);

    // store here unprocessed results
    let responseQueue = [];
    // store here processed results
    let results = [];

    // first request is to get scrollId and total values
    // check 10k records because this method is for records 10k
    // and above
    let response = await client.search({
      filter_path: "took,hits.hits._source,_scroll_id,hits.total",
      index: indexAlias,
      scroll: "1m",
      size: 10000,
      body: {
        query: query
      }
    });
    let total = response.body.hits.total.value;

    // check if we can return the number of results desired by input parameters
    if (from > total) {
      console.log(`Offset specified (${from}) is bigger than total number of records (${total}).`);
      return { "response": [], "took": response.body.took };
    }
    let scrollId = response.body._scroll_id;

    // if the desired size exceeds the total number of result, reduce it to
    // the number of records we are able to return with given offset
    let newSize = size;
    if (size > total) {
      newSize = total - from;
    }

    let took = 0;
    // our response queue needs to be bigger than desired number of results
    while (responseQueue.length < (from + newSize)) {
      took += response.body.took;

      // we do not wish to store the response, if the from parameter is not
      // within the 10k range
      if (from < 10000) {
        responseQueue = responseQueue.concat(response.body.hits.hits);
      } else {
        // reduce the from parameter
        from -= 10000;
      }

      // read next 10k of records
      response = await client.scroll({
        filter_path: "took,hits.hits._source",
        scrollId: scrollId,
        scroll: "1m"
      });
    }

    // clear scrollId
    await client.clearScroll({
      scrollId: scrollId
    });

    // take from unprocessed responses only the ones desired by
    // the input
    let rawResults = responseQueue.slice(from, from + newSize);

    // process them to contain only desired data
    results = rawResults.flatMap(item => item._source);
    return { "response": results, "took": took };
  }
}

/**
 * Does not perform uuid check.
 * @param {String} uuid UUID of Elasticsearch client
 * @returns {Promise<object>} configuration options for Elasticsearch client
 */
async function configureClientAsync(uuid) {
  let node = await getNodeAsync(uuid);
  let apiKey = await getApiKeyAsync(uuid);
  return {
    node: node,
    auth: {
      apiKey: apiKey
    },
    requestTimeout: 2000,
    tls: {
      // required if elasticsearch has a self-signed certificate
      rejectUnauthorized: false
    }
  }
}

/**
 * @description Given uuid, it checks if it matches any Elasticsearch client LTP UUIDs
 * from config file, returns an error, if it doesn't. If uuid parameter is missing, it
 * assumes, there is exactly one Elasticsearch client configured in the config file.
 * @param {String} [uuid] optional, UUID of Elasticsearch client
 * @returns {Promise<String>} UUID of Elasticsearch client
 */
async function getElasticsearchClientUuidAsync(uuid) {
  let ltps = await ControlConstruct.getLogicalTerminationPointListAsync(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);
  let uuids = ltps.flatMap(ltp => ltp[onfAttributes.GLOBAL_CLASS.UUID]);
  if (uuid !== undefined) {
    if (uuids.includes(uuid)) {
      return uuid;
    } else {
      throw new Error(`UUID ${uuid} does not match any Elasticsearch client LTP.`);
    }
  }
  if (uuids.length > 1) {
    throw new Error(`There is more than 1 Elasticsearch client LTP configured. Please specify UUID.`);
  }
  return uuids[0];
}

/**
 * Does not perform uuid check.
 * @param {String} uuid UUID of Elasticsearch client
 * @returns {Promise<String>} connection string in form: "<remote-protocol>://<address>:port"
 */
async function getNodeAsync(uuid) {
  let serverLtp = await LogicalTerminationPoint.getServerLtpListAsync(uuid);
  let httpClient = await ControlConstruct.getLogicalTerminationPointAsync(serverLtp[0]);
  let tcpClient = await LogicalTerminationPoint.getServerLtpListAsync(httpClient.uuid);
  let address = await TcpClientInterface.getRemoteAddressAsync(tcpClient[0]);
  let port = await TcpClientInterface.getRemotePortAsync(tcpClient[0]);
  let remoteProtocol = await TcpClientInterface.getRemoteProtocolAsync(tcpClient[0]);
  return remoteProtocol.toLowerCase() + "://"
    + address[onfAttributes.TCP_CLIENT.IP_ADDRESS][onfAttributes.TCP_CLIENT.IPV_4_ADDRESS] + ":" + port;
}

/**
 * Performs uuid check.
 * @param {String} [uuid] optional, UUID of Elasticsearch client
 * @returns {Promise<object>} Elasticsearch client configuration object
 */
async function getEsClientConfigAsync(uuid) {
  let esUuid = await getElasticsearchClientUuidAsync(uuid);
  let ltp = await ControlConstruct.getLogicalTerminationPointAsync(esUuid);
  let lp = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
  let esClientPac = lp[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
  return esClientPac[onfAttributes.ES_CLIENT.CONFIGURATION];
}

/**
 * Performs uuid check.
 * @param {String} [uuid] optional, UUID of Elasticsearch client
 * @returns {Promise<String>} configured API key for Elasticsearch
 */
async function getApiKeyAsync(uuid) {
  let esClientConfiguration = await getEsClientConfigAsync(uuid);
  let esClientAuth = esClientConfiguration[onfAttributes.ES_CLIENT.AUTH];
  return esClientAuth[onfAttributes.ES_CLIENT.API_KEY];
}

/**
 * @description Modifies recursively object keys using parameter function.
 * Used to change hyphens to underscore when reading/writing service policy
 * from/to Elasticsearch
 * @param {object} obj Object where keys should be modified
 * @param {Function} getNewKey function transforming the key
 * @returns {object} transformed object
 */
function replaceAllObjKeys(obj, getNewKey) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      replaceAllObjKeys(obj[i], getNewKey);
    }
  }
  else if (typeof obj === "object") {
    for (const key in obj) {
      const newKey = getNewKey(key);
      obj[newKey] = obj[key];
      if (key !== newKey) {
        delete obj[key];
      }
      replaceAllObjKeys(obj[newKey], getNewKey);
    }
  }
  return obj;
}

/**
 * Returns index alias from config file. If uuid is present, performs check if
 * its an ES client uuid, if it's not present, assumes only one ES client is configured.
 * @param {String} [uuid] optional, UUID of Elasticsearch client
 * @returns {Promise<String>} index alias from config file
 */
async function getIndexAliasAsync(uuid) {
  let esClientConfiguration = await getEsClientConfigAsync(uuid);
  return esClientConfiguration[onfAttributes.ES_CLIENT.INDEX_ALIAS];
}

/**
 * Helper method, creates Javascript array from Elasticsearch response.
 * @param {object} result Elasticsearch response
 * @returns {Array} empty array if there was empty response from Elasticsearch
 */
function createResultArray(result) {
  const resultArray = [];
  if (result.body.hits) {
    result.body.hits.hits.forEach((item) => {
      resultArray.push(item._source);
    });
  }
  return resultArray;
}

/**
 * @description Checks whether given TCP client UUID belongs to an Elasticsearch client.
 * @param {String} tcpClientUuid TCP client UUID
 * @returns {Promise<boolean>} true if the TCP client is configured for an Elasticsearch client
 */
async function isTcpClientElasticsearch(tcpClientUuid) {
  let httpClientUuids = await LogicalTerminationPoint.getClientLtpListAsync(tcpClientUuid);
  let esClientUuids = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuids[0]);
  if (esClientUuids.length === 0) {
    return false;
  }
  let protocol = await LayerProtocol.getLayerProtocolName(esClientUuids[0]);
  return LayerProtocol.layerProtocolNameEnum.ES_CLIENT === protocol;
}

const elasticsearchService = new ElasticsearchService();

module.exports = {
  getApiKeyAsync,
  getIndexAliasAsync,
  isTcpClientElasticsearch,
  createResultArray,
  operationalStateEnum,
  elasticsearchService
}
