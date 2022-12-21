/**
 * @file This class provides a stub to instantiate and generate a JSON object for a tcpServerInterface layer protocol. 
 * This class is a sub class for LayerProtocol.
 * This class provides functionality
 *      - to read the currently configured attribute values of the tcp-server-interface.
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const layerProtocol = require('../LayerProtocol');
const onfAttributes = require('../../constants/OnfAttributes');

/** 
 * @extends layerProtocol
 */
class TcpServerInterface extends layerProtocol {
    static TcpServerInterfacePac = class TcpServerInterfacePac {
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.TCP_SERVER;
        tcpServerInterfaceConfiguration;
        static TcpServerInterfaceConfiguration = class TcpServerInterfaceConfiguration {
            static LocalAddress = class LocalAddress {
                ipv4Address;

                /**
                 * constructor 
                 * @param {string} ipv4Address tcp ipaddress where the application is hosted .
                 */
                constructor(ipv4Address) {
                    this.ipv4Address = ipv4Address;
                }
            };
            localAddress;
            localPort;

            /**
             * constructor 
             * @param {string} localAddress tcp server ipaddress where the application is hosted .
             * @param {string} localPort tcp server port where the application is running .
             */
            constructor(localAddress, localPort) {
                this.localAddress = new TcpServerInterfaceConfiguration.LocalAddress(localAddress);
                this.localPort = localPort;
            }
        };

        /**
         * constructor 
         * @param {string} localAddress tcp server ipaddress where the application is hosted .
         * @param {string} localPort tcp server port where the application is running .
         */
        constructor(localAddress, localPort) {
            this.tcpServerInterfaceConfiguration = new TcpServerInterfacePac
                .TcpServerInterfaceConfiguration(
                    localAddress,
                    localPort);
        }
    }

    /**
     * constructor 
     * @param {string} localAddress tcp server ipaddress where the application is hosted .
     * @param {string} localPort tcp server port where the application is running .
     */
    constructor(localAddress, localPort) {
        super(0,
            TcpServerInterface.TcpServerInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.TCP_SERVER_INTERFACE_PAC] = new TcpServerInterface
            .TcpServerInterfacePac(
                localAddress,
                localPort);
    }

    /**
     * @description This function returns the IpV4 address of the current application.
     * @returns {promise} string {localAddress}
     **/
    static getLocalAddress() {
        return new Promise(async function (resolve, reject) {
            let localAddress = {};
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.TCP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
                let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
                let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
                localAddress = await getConfiguredLocalAddress(tcpServerConfiguration["local-address"]);
                resolve(localAddress);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the port where the current application is running.
     * @returns {promise} string {localPort}
     **/
    static getLocalPort() {
        return new Promise(async function (resolve, reject) {
            let localPort = undefined;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.TCP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
                let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
                let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
                localPort = tcpServerConfiguration["local-port"];
                resolve(localPort);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the tcp-server local-address.
     * @param {String} tcpServerUuid : tcp-server uuid to set tcp-server instance.
     * @param {String} localAddress : localAddress that needs to be modified.
     * @returns {promise} boolean {true|false}
     **/
    static setLocalAddressAsync(tcpServerUuid, localAddress) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let addressToBeDeleted = await fileOperation.readFromDatabaseAsync(
                    onfPaths.TCP_CLIENT_LOCAL_ADDRESS.replace(
                        "{uuid}", tcpServerUuid)
                );
                let addressPaths = await getPaths(tcpServerUuid, localAddress, addressToBeDeleted);
                let localAddressPath = addressPaths[0];
                let pathToBeDeleted = addressPaths[1];
                if (pathToBeDeleted != undefined) {
                    await fileOperation.deletefromDatabaseAsync(
                        pathToBeDeleted,
                        addressToBeDeleted,
                        false
                    );
                }
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    localAddressPath,
                    localAddress,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

}

/**
 * @description This function returns the local address configured .
 * @param {String} localAddress : local address of the tcp server .
 * @returns {promise} string {undefined | address}
 **/
function getConfiguredLocalAddress(localAddress) {
    return new Promise(async function (resolve, reject) {
        let address = {};
        let domainName = onfAttributes.TCP_SERVER.DOMAIN_NAME
        try {
            if (!(domainName in localAddress)) {
                address[onfAttributes.TCP_SERVER.IP_ADDRESS] = localAddress;
            } else {
                address = localAddress;
            }
            resolve(address);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function returns the remote address configured .
 * @param {String} tcpClientUuid : tcp-client uuid of the tcp-client instance
 * @param {String} addressToBeDeleted : tcp-client address to be deleted.
 * @param {String} remoteAddress : remote address of the tcp client .
 * @returns {promise} list {paths}
 **/
function getPaths(tcpServerUuid, localAddress, addressToBeDeleted) {
    return new Promise(async function (resolve, reject) {
        let paths = [];
        let localAddressPath;
        let pathOfAddressToBeDeleted;
        let domainName = onfAttributes.TCP_SERVER.DOMAIN_NAME;
        try {
            if (domainName in localAddress) {
                localAddressPath = onfPaths.TCP_SERVER_DOMAIN_NAME.replace(
                    "{uuid}", tcpServerUuid);
                if (!(domainName in addressToBeDeleted))
                    pathOfAddressToBeDeleted = onfPaths.TCP_SERVER_IP_ADDRESS.replace(
                        "{uuid}", tcpServerUuid);
            } else {
                localAddressPath = onfPaths.TCP_SERVER_IP_ADDRESS.replace(
                    "{uuid}", tcpServerUuid);
                if (domainName in addressToBeDeleted)
                    pathOfAddressToBeDeleted = onfPaths.TCP_SERVER_DOMAIN_NAME.replace(
                        "{uuid}", tcpServerUuid);
            }
            paths.push(localAddressPath, pathOfAddressToBeDeleted)
            resolve(paths);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = TcpServerInterface;