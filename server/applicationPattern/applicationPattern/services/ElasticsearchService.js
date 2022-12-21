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

/**
 * @description This class represents Elasticsearch service running on server.
 * Exported is one instance of this class.
 */
class ElasticsearchService {

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
     * @param {String} uuid optional, UUID of Elasticsearch client. If uuid parameter is missing, it
     * assumes, there is exactly one Elasticsearch client configured in the config file.
     *
     * @returns Elasticsearch client
     */
    async getClient(uuid) {
      let esUuid = await ElasticsearchService.getElasticsearchClientUuid(uuid);
      let newApiKey = await this.getApiKeyAsync(esUuid);
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
      client = new Client(await this._configureClient(uuid, storedApiKey));
      client.on('response', (err, result) => {
        if (err) {
          console.error(err)
        }
      });
      this._clients.set(uuid, { "client": client, "apiKey": storedApiKey });
      return client;
    }

    /**
     * @returns configuration options for Elasticsearch client
     */
    async _configureClient(uuid, apiKey) {
      let node = await this.getNodeAsync(uuid);
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
     * @returns UUID of Elasticsearch client
     */
    static async getElasticsearchClientUuid(uuid) {
      return new Promise(async function (resolve, reject) {
        try {
          let uuids = await logicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocol.layerProtocolNameEnum.ES_CLIENT);
          if (uuid !== undefined) {
            return (uuids.includes(uuid)) ? resolve(uuid) : reject(new Error(`UUID ${uuid} does not match any Elasticsearch client LTP.`));
          }
          if (uuids.length > 1) {
            return reject(new Error(`There is more than 1 Elasticsearch client LTP configured. Please specify UUID.`));
          }
          resolve(uuids[0]);
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * @description Reads URL, port and remote protocol from TCP LTP of Elasticsearch client
     * @param {String} uuid UUID of Elasticsearch client
     * @returns {Promise<String>} connection string in form: "<remote-protocol>://<address>:port"
     */
    async getNodeAsync(uuid) {
      return new Promise(async function (resolve, reject) {
        let node = undefined;
        try {
          let serverLtp = await logicalTerminationPoint.getServerLtpListAsync(uuid);
          let httpClient = await controlConstruct.getLogicalTerminationPointAsync(serverLtp[0]);
          let tcpClient = await logicalTerminationPoint.getServerLtpListAsync(httpClient.uuid);
          let address = await TcpClientInterface.getRemoteAddressAsync(tcpClient[0]);
          let port = await TcpClientInterface.getRemotePortAsync(tcpClient[0]);
          let remoteProtocol = await TcpClientInterface.getRemoteProtocolAsync(tcpClient[0]);
          node = remoteProtocol + "://" + address[onfAttributes.TCP_CLIENT.IP_ADDRESS][onfAttributes.TCP_CLIENT.IPV_4_ADDRESS] + ":" + port;
          resolve(node);
        } catch (error) {
          reject(error);
        }
      });
    }

    static async getEsClientConfig(uuid) {
      return new Promise(async function (resolve, reject) {
        let clientConfig;
        try {
          let ltp = await controlConstruct.getLogicalTerminationPointAsync(uuid);
          let lp = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
          let esClientPac = lp[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
          clientConfig = esClientPac[onfAttributes.ES_CLIENT.CONFIGURATION];
          resolve(clientConfig);
        } catch (error) {
          reject(error);
        }
      });
    }

    async getApiKeyAsync(uuid) {
      return new Promise(async function (resolve, reject) {
          let apiKey;
          try {
            let esClientConfiguration = await ElasticsearchService.getEsClientConfig(uuid);
            let esClientAuth = esClientConfiguration[onfAttributes.ES_CLIENT.AUTH];
            apiKey = esClientAuth[onfAttributes.ES_CLIENT.API_KEY];
            resolve(apiKey);
          } catch (error) {
            reject(error);
          }
      });
    }

    async getIndexAliasAsync(uuid) {
      return new Promise(async function (resolve, reject) {
        let indexAlias;
        try {
          let esClientConfiguration = await ElasticsearchService.getEsClientConfig(uuid);
          indexAlias = esClientConfiguration[onfAttributes.ES_CLIENT.INDEX_ALIAS];
          resolve(indexAlias);
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * @description Creates/updates service records policy object in Elasticsearch instance
     * MUST be used to implement putElasticsearchClientServiceRecordsPolicy REST API method
     * @param {String} uuid optional, UUID of Elasticsearch client
     * @param {Object} body service records policy
     * @returns result of the putLifecycle operation
     */
    async putElasticsearchClientServiceRecordsPolicy(uuid, body) {
      let client = await this.getClient(uuid);
      let policyBody = body["elasticsearch-client-interface-1-0:service-records-policy"];
      let name = policyBody["service-records-policy-name"];
      let description = policyBody["description"];
      let project = policyBody["project"];
      let updatedPhases = this.replaceAllObjKeys(policyBody["phases"], (key) => key.replaceAll("-","_"));
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
        console.log(`Index lifecycle policy "${name}" is updated.`);
      return result;
    }

    /**
     * @description Fetches service records policy associated with configured index alias.
     * MUST be used to implement getElasticsearchClientServiceRecordsPolicy REST API method
     * @param {String} uuid optional, UUID of Elasticsearch client
     * @returns {Promise<Object>} service records policy
     */
    async getElasticsearchClientServiceRecordsPolicy(uuid) {
      let client = await this.getClient(uuid);
      let indexAlias = await this.getIndexAliasAsync(uuid);
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
      let updatedPhases = this.replaceAllObjKeys(result.body[policyName].policy.phases, (key) => key.replaceAll("_","-"));
      let policyDetail = {
        "service-records-policy-name": policyName,
        "phases": updatedPhases
      }
      return policyDetail;
    }

    createResultArray(result) {
      const resultArray = [];
      result.body.hits.hits.forEach((item) => {
        resultArray.push(item._source);
      });
      return resultArray;
    }

    /**
     * @description Modifies recursively object keys using parameter function.
     * Used to change hyphens to underscore when reading/writing service policy
     * from/to Elasticsearch
     * @param {Object} obj Object where keys should be modified
     * @param {Function} getNewKey function transforming the key
     * @returns {Object} transformed object
     */
    replaceAllObjKeys(obj, getNewKey) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          this.replaceAllObjKeys(obj[i], getNewKey);
        }
      }
      else if (typeof obj === "object") {
        for (const key in obj) {
          const newKey = getNewKey(key);
          obj[newKey] = obj[key];
          if (key !== newKey) {
            delete obj[key];
          }
          this.replaceAllObjKeys(obj[newKey], getNewKey);
        }
      }
      return obj;
    };

    /**
     * @description Issues ping to Elasticsearch instance
     * MUST be used to implement getElasticsearchClientOperationalState REST API method
     * @param {String} uuid optional, UUID of Elasticsearch client
     * @returns {Promise<String>} AVAILABLE if the ping returns with http status code 200, UNAVAILABLE if not
     */
    async getElasticsearchClientOperationalState(uuid) {
      let client = await this.getClient(uuid);
      let result = await client.ping();
      return (result.statusCode === 200) ?
        operationalStateEnum.AVAILABLE : operationalStateEnum.UNAVAILABLE;
    }
}

module.exports = new ElasticsearchService()
