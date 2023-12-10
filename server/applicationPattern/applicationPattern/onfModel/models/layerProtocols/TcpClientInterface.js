/**
 * This class provides a stub to instantiate and generate a JSON object for an TcpClientIInterface layer protocol. 
 * This class is a sub class for LayerProtocol. 
 * This class provides functionality
 *      - to read the currently configured attribute values of the tcp-client-interface. 
 *      - create new tcp-client-instance
 *      - to set the remote-address and remote-port of a tcp-client-interface
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const layerProtocol = require('../LayerProtocol');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/** 
 * @extends layerProtocol
 */
class TcpClientInterface extends layerProtocol {

    static TcpClientInterfacePac = class TcpClientInterfacePac {
        tcpClientInterfaceConfiguration;
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.TCP_CLIENT;
        static TcpClientInterfaceConfiguration = class TcpClientInterfaceConfiguration {
            remoteAddress;
            remotePort;
            remoteProtocol;

            static remoteProtocolEnum = {
                HTTP: "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
                HTTPS: "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTPS",
                NOT_YET_DEFINED: "tcp-client-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"
            };

            /**
             * constructor 
             * @param {string} remoteAddress tcp ipaddress where the application is hosted .
             * @param {string} remotePort tcp port where the application is running .
             * @param {string} remoteProtocol remoteProtocol where the application is running .
             */
            constructor(remoteAddress, remotePort, remoteProtocol) {
                this.remoteAddress = remoteAddress;
                this.remotePort = remotePort;
                this.remoteProtocol = remoteProtocol;
            }
        };

        /**
         * constructor 
         * @param {string} remoteAddress tcp ipaddress where the application is hosted .
         * @param {string} remotePort tcp port where the application is running .
         * @param {string} remoteProtocol remoteProtocol where the application is running .
         */
        constructor(remoteAddress, remotePort, remoteProtocol) {
            this.tcpClientInterfaceConfiguration = new TcpClientInterfacePac.TcpClientInterfaceConfiguration(
                remoteAddress,
                remotePort,
                remoteProtocol);
        }
    };

    /**
     * constructor 
     * @param {string} remoteAddress tcp ipaddress where the application is hosted .
     * @param {string} remotePort tcp port where the application is running .
     * @param {string} remoteProtocol remoteProtocol where the application is running .
     */
    constructor(remoteAddress, remotePort, remoteProtocol) {
        super("0",
            TcpClientInterface.TcpClientInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC] = new TcpClientInterface
            .TcpClientInterfacePac(
                remoteAddress,
                remotePort,
                remoteProtocol);
    }

    /**
     * @description This function returns the tcp ip address where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {Promise<String>} undefined | remoteAddress
     **/
    static async getRemoteAddressAsync(tcpClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
            tcpClientUuid);
        let layerProtocol = logicalTerminationPoint[
            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
            0
        ];
        let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
        let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
        let remoteAddress = tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_ADDRESS];
        return remoteAddress;
    }

    /**
     * @description This function returns the tcp port where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {Promise<String>} undefined | remotePort
     **/
    static async getRemotePortAsync(tcpClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
            tcpClientUuid);
        let layerProtocol = logicalTerminationPoint[
            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
            0
        ];
        let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
        let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
        return tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_PORT];
    }

    /**
     * @description This function returns the tcp port where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {Promise<String>} undefined | remotePort
     **/
    static async getRemoteProtocolAsync(tcpClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
            tcpClientUuid);
        let layerProtocol = logicalTerminationPoint[
            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
            0
        ];
        let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
        let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
        let remoteProtocol = tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_PROTOCOL];
        return (TcpClientInterface.getProtocolFromProtocolEnum(remoteProtocol))[0];
    }

    /**
     * @description This function returns the protocol from onf-core-model format present in protocolEnum.
     * @param {String} protocol : protocol in onf-core-model format.
     * @returns {Array} remoteProtocol
     **/
    static getProtocolFromProtocolEnum(protocol) {
        let remoteProtocol = [];
        let remoteProtocolEnum = TcpClientInterface.TcpClientInterfacePac.TcpClientInterfaceConfiguration.remoteProtocolEnum;
        for (let remoteProtocolKey in remoteProtocolEnum) {
            if (remoteProtocolEnum[remoteProtocolKey] == protocol || remoteProtocolKey == protocol) {
                remoteProtocol = [remoteProtocolKey, remoteProtocolEnum[remoteProtocolKey]];
            }
        }
        return remoteProtocol;
    }


    /**
     * @description This function generates the tcp-client uuid for the given http-client uuid.
     * @param {String} httpClientUuid uuid of the http-client-interface logical-termination-point.
     * @param {String} remoteProtocol : remoteProtocol where the application is running.
     * @returns {String} tcpClientUuid
     **/
    static generateNextUuid(httpClientUuid, remoteProtocol) {
        let tcpClientUuid = httpClientUuid.replace("http", "tcp");
        if (remoteProtocol.toUpperCase() == "HTTPS") {
            tcpClientUuid = tcpClientUuid.replace("000", "001");
        }
        return tcpClientUuid;
    }

    /**
     * @description This function creates a new tcp-client-interface instance.
     * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance.
     * @param {String} ipv4Address : ipaddress where the application is hosted.
     * @param {String} port : port where the application is running.
     * @param {String} remoteProtocol : remoteProtocol where the application is running.
     * @returns {Object} logicalTerminationPoint
     **/
    static createTcpClientInterface(httpClientUuid, tcpClientUuid, ipv4Address, port, remoteProtocol) {
        remoteProtocol = (TcpClientInterface.getProtocolFromProtocolEnum(remoteProtocol))[1];
        let tcpClientInterface = new TcpClientInterface(
            ipv4Address,
            port,
            remoteProtocol);
        return new logicalTerminationPoint(
            tcpClientUuid,
            logicalTerminationPoint.ltpDirectionEnum.SINK,
            [httpClientUuid],
            [],
            [tcpClientInterface]
        );
    }

    /**
     * @description This function modifies the tcp-client remote-address for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remoteAddress : remoteAddress that needs to be modified.
     * @returns {Promise<boolean>} true|false
     **/
    static async setRemoteAddressAsync(tcpClientUuid, remoteAddress) {
        let addressToBeDeleted = await fileOperation.readFromDatabaseAsync(
            onfPaths.TCP_CLIENT_ADDRESS.replace(
                "{uuid}", tcpClientUuid)
        );
        let addressPaths = await getPaths(tcpClientUuid, remoteAddress, addressToBeDeleted);
        let remoteAddressPath = addressPaths[0];
        let pathToBeDeleted = addressPaths[1];
        if (pathToBeDeleted != undefined) {
            await fileOperation.deletefromDatabaseAsync(pathToBeDeleted);
        }
        return await fileOperation.writeToDatabaseAsync(
            remoteAddressPath,
            remoteAddress,
            false);
    }

    /**
     * @description This function modifies the tcp-client remote-port for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remotePort : remotePort that needs to be modified.
     * @returns {Promise<boolean>} true|false
     **/
    static async setRemotePortAsync(tcpClientUuid, remotePort) {
        let remotePortPath = onfPaths.TCP_CLIENT_REMOTE_PORT.replace(
            "{uuid}", tcpClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            remotePortPath,
            remotePort,
            false);
    }

    /**
     * @description This function modifies the tcp-client remote-protocol for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remoteProtocol : remoteProtocol that needs to be modified.
     * @returns {Promise<boolean>} true|false
     **/
    static async setRemoteProtocolAsync(tcpClientUuid, remoteProtocol) {
        remoteProtocol = (TcpClientInterface.getProtocolFromProtocolEnum(remoteProtocol))[1];
        let remoteProtocolPath = onfPaths.TCP_CLIENT_REMOTE_PROTOCOL.replace(
            "{uuid}", tcpClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            remoteProtocolPath,
            remoteProtocol,
            false);
    }
}

/**
 * @description This function returns the remote address configured .
 * @param {String} tcpClientUuid : tcp-client uuid of the tcp-client instance
 * @param {String} addressToBeDeleted : tcp-client address to be deleted.
 * @param {String} remoteAddress : remote address of the tcp client .
 * @returns {Array} paths
 **/
function getPaths(tcpClientUuid, remoteAddress, addressToBeDeleted) {
    let paths = [];
    let remoteAddressPath;
    let pathOfAddressToBeDeleted;
    let domainName = onfAttributes.TCP_CLIENT.DOMAIN_NAME;
    if (domainName in remoteAddress) {
        remoteAddressPath = onfPaths.TCP_CLIENT_DOMAIN_NAME.replace(
            "{uuid}", tcpClientUuid);
        if (!(domainName in addressToBeDeleted))
            pathOfAddressToBeDeleted = onfPaths.TCP_CLIENT_IP_ADDRESS.replace(
                "{uuid}", tcpClientUuid);
    } else {
        remoteAddressPath = onfPaths.TCP_CLIENT_IP_ADDRESS.replace(
            "{uuid}", tcpClientUuid);
        if (domainName in addressToBeDeleted)
            pathOfAddressToBeDeleted = onfPaths.TCP_CLIENT_DOMAIN_NAME.replace(
                "{uuid}", tcpClientUuid);
    }
    paths.push(remoteAddressPath, pathOfAddressToBeDeleted);
    return paths;
}

module.exports = TcpClientInterface;
