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
     * @returns {promise} string {undefined | remoteAddress}
     **/
    static getRemoteAddressAsync(tcpClientUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    tcpClientUuid);
                let layerProtocol = logicalTerminationPoint[
                    onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
                    0
                ];
                let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
                let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
                let remoteAddress = tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_ADDRESS];
                resolve(remoteAddress);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the tcp port where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {promise} string {undefined | remotePort}
     **/
    static getRemotePortAsync(tcpClientUuid) {
        return new Promise(async function (resolve, reject) {
            let remotePort;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    tcpClientUuid);
                let layerProtocol = logicalTerminationPoint[
                    onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
                    0
                ];
                let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
                let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
                remotePort = tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_PORT];
                resolve(remotePort);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the tcp port where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {promise} string {undefined | remotePort}
     **/
    static getRemoteProtocolAsync(tcpClientUuid) {
        return new Promise(async function (resolve, reject) {
            let remoteProtocol;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    tcpClientUuid);
                let layerProtocol = logicalTerminationPoint[
                    onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][
                    0
                ];
                let tcpClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC];
                let tcpClientConfiguration = tcpClientPac[onfAttributes.TCP_CLIENT.CONFIGURATION];
                remoteProtocol = tcpClientConfiguration[onfAttributes.TCP_CLIENT.REMOTE_PROTOCOL];
                resolve(remoteProtocol);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function generates the tcp-client uuid for the given http-client uuid.
     * @param {String} httpClientUuid uuid of the http-client-interface logical-termination-point.
     * @param {String} remoteProtocol : remoteProtocol where the application is running.
     * @returns string {tcpClientUuid}
     **/
    static generateNextUuid(httpClientUuid, remoteProtocol) {
        let tcpClientUuid;
        try {
            tcpClientUuid = httpClientUuid.replace("http", "tcp");
            if (remoteProtocol.toUpperCase() == "HTTPS") {
                tcpClientUuid = tcpClientUuid.replace("000", "001");
            }
            return tcpClientUuid;
        } catch (error) {
            return error;
        }
    }

    /**
     * @description This function creates a new tcp-client-interface instance.
     * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance.
     * @param {String} ipv4Address : ipaddress where the application is hosted.
     * @param {String} port : port where the application is running.
     * @param {String} remoteProtocol : remoteProtocol where the application is running.
     * @returns {promise} object {TcpClientInterface}
     **/
    static createTcpClientInterfaceAsync(httpClientUuid, tcpClientUuid, ipv4Address, port, remoteProtocol) {
        return new Promise(async function (resolve, reject) {
            let tcpClientLogicalTerminationPoint;
            try {
                let tcpClientInterface = new TcpClientInterface(
                    ipv4Address,
                    port,
                    remoteProtocol);
                tcpClientLogicalTerminationPoint = new logicalTerminationPoint(
                    tcpClientUuid,
                    logicalTerminationPoint.ltpDirectionEnum.SINK,
                    [httpClientUuid],
                    [],
                    [tcpClientInterface]
                );
                resolve(tcpClientLogicalTerminationPoint);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the tcp-client remote-address for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remoteAddress : remoteAddress that needs to be modified.
     * @returns {promise} boolean {true|false}
     **/
    static setRemoteAddressAsync(tcpClientUuid, remoteAddress) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let addressToBeDeleted = await fileOperation.readFromDatabaseAsync(
                    onfPaths.TCP_CLIENT_ADDRESS.replace(
                        "{uuid}", tcpClientUuid)
                );
                let addressPaths = await getPaths(tcpClientUuid, remoteAddress, addressToBeDeleted);
                let remoteAddressPath = addressPaths[0];
                let pathToBeDeleted = addressPaths[1];
                if (pathToBeDeleted != undefined) {
                    await fileOperation.deletefromDatabaseAsync(
                        pathToBeDeleted,
                        addressToBeDeleted,
                        false
                    );
                }
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    remoteAddressPath,
                    remoteAddress,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the tcp-client remote-port for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remotePort : remotePort that needs to be modified.
     * @returns {promise} boolean {true|false}
     **/
    static setRemotePortAsync(tcpClientUuid, remotePort) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let remotePortPath = onfPaths.TCP_CLIENT_REMOTE_PORT.replace(
                    "{uuid}", tcpClientUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    remotePortPath,
                    remotePort,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the tcp-client remote-port for the provided tcp client uuid.
     * @param {String} tcpClientUuid : tcp-client uuid to create the new tcp-client instance, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} remotePort : remotePort that needs to be modified.
     * @returns {promise} boolean {true|false}
     **/
    static setRemoteProtocolAsync(tcpClientUuid, remoteProtocol) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let remoteProtocolPath = onfPaths.TCP_CLIENT_REMOTE_PROTOCOL.replace(
                    "{uuid}", tcpClientUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    remoteProtocolPath,
                    remoteProtocol,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }


}


/**
 * @description This function returns the remote address configured .
 * @param {String} tcpClientUuid : tcp-client uuid of the tcp-client instance
 * @param {String} addressToBeDeleted : tcp-client address to be deleted.
 * @param {String} remoteAddress : remote address of the tcp client .
 * @returns {promise} list {paths}
 **/
function getPaths(tcpClientUuid, remoteAddress, addressToBeDeleted) {
    return new Promise(async function (resolve, reject) {
        let paths = [];
        let remoteAddressPath;
        let pathOfAddressToBeDeleted;
        let domainName = onfAttributes.TCP_CLIENT.DOMAIN_NAME;
        try {
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
            paths.push(remoteAddressPath, pathOfAddressToBeDeleted)
            resolve(paths);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = TcpClientInterface;