//@ts-check
'use strict'

const logicalTerminationPoint = require('../onfModel/models/LogicalTerminationPoint');
const layerProtocol = require('../onfModel/models/LayerProtocol');
const { Client } = require('@elastic/elasticsearch');
const controlConstruct = require('../onfModel/models/ControlConstruct');
const TcpClientInterface = require('../onfModel/models/layerProtocols/TcpClientInterface');
const onfAttributes = require('../onfModel/constants/OnfAttributes');

class ElasticsearchService {

    client;
    apiKey;

    async getClient() {
      let newApiKey = await this.getApiKeyAsync();
      if (!newApiKey && !this.apiKey && newApiKey !== this.apiKey) {
        this.client.close();
        this.apiKey = undefined;
      }
      if (this.apiKey === undefined) {
        this.apiKey = newApiKey;
        this.client = new Client(await this.configureClient());
        this.client.on('response', (err, result) => {
          if (err) {
            console.error(err)
          }
        });
      }
      return this.client;
    }

    async configureClient() {
      let node = await this.getNodeAsync();
        return {
            node: node,
            auth: {
                apiKey: this.apiKey
            },
            tls: {
              // required if elasticsearch has a self-signed certificate
              rejectUnauthorized: false
            }
        }
    }

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

    createResultArray(result) {
      const resultArray = [];
      result.body.hits.hits.forEach((item) => {
        resultArray.push(item._source);
      });
      return resultArray;
    }
}

module.exports = new ElasticsearchService()
