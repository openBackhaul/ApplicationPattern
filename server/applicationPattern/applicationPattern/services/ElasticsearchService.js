//@ts-check
'use strict'

const logicalTerminationPoint = require('../onfModel/models/LogicalTerminationPoint');
const layerProtocol = require('../onfModel/models/LayerProtocol');
const { Client } = require('@elastic/elasticsearch');
const controlConstruct = require('../onfModel/models/ControlConstruct');
const TcpClientInterface = require('../onfModel/models/layerProtocols/TcpClientInterface');
const onfAttributes = require('../onfModel/constants/OnfAttributes');

/**
 * @description This class represents Elasticsearch service running on server.
 * Exported is one instance of this class.
 */
class ElasticsearchService {

    _client;
    _apiKey;

    /**
     * @description This method MUST be called in order to use Elasticsearch client directly.
     * There is always one instance of ES client runnning within this class. The client is configured
     * with API key, URL and port found in config file. Before returning existing client, this
     * method also checks if the API key has not changed. If it had changed, closes the existing
     * client, creates a new one and returns it.
     *
     * @returns Elasticsearch client
     */
    async getClient() {
      let newApiKey = await this.getApiKeyAsync();
      if (!newApiKey && !this._apiKey && newApiKey !== this._apiKey) {
        this._client.close();
        this._apiKey = undefined;
      }
      if (this._apiKey === undefined) {
        this._apiKey = newApiKey;
        this._client = new Client(await this._configureClient());
        this._client.on('response', (err, result) => {
          if (err) {
            console.error(err)
          }
        });
      }
      return this._client;
    }

    /**
     * @returns configuration options for Elasticsearch client
     */
    async _configureClient() {
      let node = await this.getNodeAsync();
        return {
            node: node,
            auth: {
                apiKey: this._apiKey
            },
            tls: {
              // required if elasticsearch has a self-signed certificate
              rejectUnauthorized: false
            }
        }
    }

    /**
     * @description Reads URL, port and remote protocol from TCP LTP of Elasticsearch client
     * @returns {Promise<String>} connection string in form: "<remote-protocol>://<address>:port"
     */
    async getNodeAsync() {
      return new Promise(async function (resolve, reject) {
        let node = undefined;
        try {
          let uuid = await logicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocol.layerProtocolNameEnum.ES_CLIENT);
          let serverLtp = await logicalTerminationPoint.getServerLtpListAsync(uuid[0]);
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

    static async getEsClientConfig() {
      return new Promise(async function (resolve, reject) {
        let clientConfig;
        try {
          let uuid = await logicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocol.layerProtocolNameEnum.ES_CLIENT);
          let ltp = await controlConstruct.getLogicalTerminationPointAsync(uuid[0]);
          let lp = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
          let esClientPac = lp[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
          clientConfig = esClientPac[onfAttributes.ES_CLIENT.CONFIGURATION];
          resolve(clientConfig);
        } catch (error) {
          reject(error);
        }
      });
    }

    async getApiKeyAsync() {
      return new Promise(async function (resolve, reject) {
          let apiKey;
          try {
            let esClientConfiguration = await ElasticsearchService.getEsClientConfig();
            let esClientAuth = esClientConfiguration[onfAttributes.ES_CLIENT.AUTH];
            apiKey = esClientAuth[onfAttributes.ES_CLIENT.API_KEY];
            resolve(apiKey);
          } catch (error) {
            reject(error);
          }
      });
    }

    async getIndexAliasAsync() {
      return new Promise(async function (resolve, reject) {
        let indexAlias;
        try {
          let esClientConfiguration = await ElasticsearchService.getEsClientConfig();
          indexAlias = esClientConfiguration[onfAttributes.ES_CLIENT.INDEX_ALIAS];
          resolve(indexAlias);
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * @description Creates/updates service records policy object in Elasticsearch instance
     * @param {Object} body service records policy
     * @returns result of the putLifecycle operation
     */
    async putServiceRecordsPolicy(body) {
      let client = await this.getClient();
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
     * @returns {Promise<Object>} service records policy
     */
    async getServiceRecordsPolicy() {
      let indexAlias = await this.getIndexAliasAsync();
      let client = await this.getClient();
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
}

module.exports = new ElasticsearchService()
