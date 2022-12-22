//@ts-check
'use strict'

const logicalTerminationPoint = require('../onfModel/models/LogicalTerminationPoint');
const layerProtocol = require('../onfModel/models/LayerProtocol');
const { Client } = require('@elastic/elasticsearch');
const controlConstruct = require('../onfModel/models/ControlConstruct');
const TcpClientInterface = require('../onfModel/models/layerProtocols/TcpClientInterface');
const onfAttributes = require('../onfModel/constants/OnfAttributes');

const operationalStateEnum = {
  AVAILABLE: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_AVAILABLE",
  UNAVAILABLE: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_UNAVAILABLE",
  NOT_YET_DEFINED: "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED"
};

module.exports = { operationalStateEnum }

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
   * There is always one instance of ES client runnning within this class. The client is configured
   * with API key, URL and port found in config file. Before returning existing client, this
   * method also checks if the API key has not changed. If it had changed, closes the existing
   * client, creates a new one and returns it.
   *
   * Each error coming from Elasticsearch is logged to console. Users of this client MUST handle
   * ElasticsearchClientError accordingly.
   *
   * @param {String} uuid optional, UUID of Elasticsearch client. If uuid parameter is missing, it
   * assumes, there is exactly one Elasticsearch client configured in the config file.
   *
   * @returns {Promise<object>} Elasticsearch client version 7
   */
  async getClient(uuid) {
    let esUuid = await getElasticsearchClientUuidAsync(uuid);
    let newApiKey = await getApiKeyAsync(esUuid);
    let client = this._clients.get(uuid);
    if (client) {
      let storedApiKey = client.apiKey;
      if (newApiKey !== storedApiKey) {
        client.client.close();
        storedApiKey = undefined;
      } else {
        return client.client;
      }
    }
    let storedApiKey = newApiKey;
    client = new Client(await configureClientAsync(uuid, storedApiKey));
    client.on('response', (err, result) => {
      if (err) {
        console.error(`Elasticsearch error occurred: ${err}`);
      }
    });
    this._clients.set(uuid, { client: client, apiKey: storedApiKey });
    return client;
  }

  /**
   * @description Issues ping to Elasticsearch instance. Returns operational state UNAVAILABLE
   * if a connection error occurs.
   * MUST be used to implement getElasticsearchClientOperationalState REST API method
   * @param {String} uuid optional, UUID of Elasticsearch client
   * @returns {Promise<String>} AVAILABLE if the ping returns with http status code 200, UNAVAILABLE if not
   */
  async getElasticsearchClientOperationalStateAsync(uuid) {
    let client = await this.getClient(uuid);
    try {
      let ping = await client.ping();
      return (ping.statusCode === 200) ?
        operationalStateEnum.AVAILABLE : operationalStateEnum.UNAVAILABLE;
    } catch (error) {
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
    let client = await this.getClient(uuid);
    let policyBody = body["elasticsearch-client-interface-1-0:service-records-policy"];
    let name = policyBody["service-records-policy-name"];
    let description = policyBody["description"];
    let project = policyBody["project"];
    let updatedPhases = replaceAllObjKeys(policyBody["phases"], (key) => key.replaceAll("-","_"));
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
   * @description Fetches service records policy associated with configured index alias.
   * MUST be used to implement getElasticsearchClientServiceRecordsPolicy REST API method
   * @param {String} uuid optional, UUID of Elasticsearch client
   * @returns {Promise<object>} service records policy if the policy exists
   */
  async getElasticsearchClientServiceRecordsPolicyAsync(uuid) {
    let client = await this.getClient(uuid);
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
    let result = await client.ilm.getLifecycle({
      "policy": policyName
    });
    let updatedPhases = replaceAllObjKeys(result.body[policyName].policy.phases, (key) => key.replaceAll("_","-"));
    let policyDetail = {
      "service-records-policy-name": policyName,
      "phases": updatedPhases
    }
    return policyDetail;
  }
}

/**
 * Does not perform uuid check.
 * @param {String} uuid UUID of Elasticsearch client
 * @param {String} apiKey configured API key
 * @returns {Promise<object>} configuration options for Elasticsearch client
 */
async function configureClientAsync(uuid, apiKey) {
  let node = await getNodeAsync(uuid);
  return {
    node: node,
    auth: {
      apiKey: apiKey
    },
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
 * @param {String} uuid optional, UUID of Elasticsearch client
 * @returns {Promise<String>} UUID of Elasticsearch client
 */
async function getElasticsearchClientUuidAsync(uuid) {
  let uuids = await logicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocol.layerProtocolNameEnum.ES_CLIENT);
  if (uuid !== undefined) {
    if(uuids.includes(uuid)) {
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
  let serverLtp = await logicalTerminationPoint.getServerLtpListAsync(uuid);
  let httpClient = await controlConstruct.getLogicalTerminationPointAsync(serverLtp[0]);
  let tcpClient = await logicalTerminationPoint.getServerLtpListAsync(httpClient.uuid);
  let address = await TcpClientInterface.getRemoteAddressAsync(tcpClient[0]);
  let port = await TcpClientInterface.getRemotePortAsync(tcpClient[0]);
  let remoteProtocol = await TcpClientInterface.getRemoteProtocolAsync(tcpClient[0]);
  return remoteProtocol + "://" + address[onfAttributes.TCP_CLIENT.IP_ADDRESS][onfAttributes.TCP_CLIENT.IPV_4_ADDRESS] + ":" + port;
}

/**
 * Performs uuid check.
 * @param {String} uuid optional, UUID of Elasticsearch client
 * @returns {Promise<object>} Elasticsearch client configuration object
 */
async function getEsClientConfigAsync(uuid) {
  let esUuid = await getElasticsearchClientUuidAsync(uuid);
  let ltp = await controlConstruct.getLogicalTerminationPointAsync(esUuid);
  let lp = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
  let esClientPac = lp[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
  return esClientPac[onfAttributes.ES_CLIENT.CONFIGURATION];
}

/**
 * Performs uuid check.
 * @param {String} uuid optional, UUID of Elasticsearch client
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
};

/**
 * Returns index alias from config file. If uuid is present, performs check if
 * its an ES client uuid, if it's not present, assumes only one ES client is configured.
 * @param {String} uuid optional, UUID of Elasticsearch client
 * @returns {Promise<String>} index alias from config file
 */
async function getIndexAliasAsync(uuid) {
  let esClientConfiguration = await getEsClientConfigAsync(uuid);
  return esClientConfiguration[onfAttributes.ES_CLIENT.INDEX_ALIAS];
}

/**
 * Helper method, creates Javascript array from Elasticsearch response.
 * @param {object} result Elasticsearch response
 * @returns {Array} resulting array
 */
module.exports.createResultArray = function createResultArray(result) {
  const resultArray = [];
  result.body.hits.hits.forEach((item) => {
    resultArray.push(item._source);
  });
  return resultArray;
}

module.exports.getIndexAliasAsync = getIndexAliasAsync
module.exports = new ElasticsearchService()
