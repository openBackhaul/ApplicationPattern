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
const onfPaths = require('../../constants/OnfPaths');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/** 
 * @extends layerProtocol
 */
class TcpServerInterface extends layerProtocol {
    static TcpServerInterfacePac = class TcpServerInterfacePac {
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.TCP_SERVER;
        tcpServerInterfaceConfiguration;
        static TcpServerInterfaceConfiguration = class TcpServerInterfaceConfiguration {
            static localProtocolEnum = {
                HTTP: "tcp-server-interface-1-0:PROTOCOL_TYPE_HTTP",
                HTTPS: "tcp-server-interface-1-0:PROTOCOL_TYPE_HTTPS",
                NOT_YET_DEFINED: "tcp-server-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"
            };

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
     * @description This function returns the uuid of the tcpserver for the given protocol.
     * @param {String} protocol string representation of protocol enum
     * @returns {Promise<String>} uuid
     **/
    static async getUuidOfTheProtocol(protocol) {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let logicalTerminationPoint = logicalTerminationPointList[i];
            let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
            let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
            let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
            let localProtocol = tcpServerConfiguration["local-protocol"]
            localProtocol = (TcpServerInterface.getProtocolFromProtocolEnum(localProtocol))[0];
            if (localProtocol === protocol) {
                return logicalTerminationPoint["uuid"];
            }
        }
    }

    /**
     * @description This function returns the IpV4 address/domain name of the current application.
     * @param {String} protocol string representation of protocol enum
     * @returns {Promise<String>} localAddress
     **/
    static async getLocalAddressOfTheProtocol(protocol) {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let logicalTerminationPoint = logicalTerminationPointList[i];
            let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
            let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
            let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
            let localProtocol = tcpServerConfiguration["local-protocol"]
            localProtocol = (TcpServerInterface.getProtocolFromProtocolEnum(localProtocol))[0];
            if (localProtocol === protocol) {
                return tcpServerConfiguration["local-address"];
            }
        }
    }

    /**
     * @description This function returns the port where the current application is running.
     * @param {String} protocol string representation of protocol enum
     * @returns {Promise<String>} localPort
     **/
    static async getLocalPortOfTheProtocol(protocol) {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let logicalTerminationPoint = logicalTerminationPointList[i];
            let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
            let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
            let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
            let localProtocol = tcpServerConfiguration["local-protocol"]
            localProtocol = (TcpServerInterface.getProtocolFromProtocolEnum(localProtocol))[0];
            if (localProtocol === protocol) {
                return tcpServerConfiguration["local-port"];
            }
        }
    }

    /**
     * @description This function returns the protocol of the current application.
     * @param {String} protocol string representation of protocol enum
     * @returns {Promise<String>} localProtocol
     **/
    static async getLocalProtocol() {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
        let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
        let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
        let localProtocol = tcpServerConfiguration["local-protocol"]
        return (TcpServerInterface.getProtocolFromProtocolEnum(localProtocol))[0];
    }

    /**
     * @description This function returns the IpV4 address of the current application.
     * @returns {Promise<String>} localAddress
     **/
    static async getLocalAddress() {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
        let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
        let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
        return tcpServerConfiguration["local-address"];
    }

    /**
     * @description This function returns the port where the current application is running.
     * @returns {Promise<String>} localPort
     **/
    static async getLocalPort() {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.TCP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
        let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
        let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
        return tcpServerConfiguration["local-port"];
    }

    /**
     * @description This function modifies the tcp-server local-address.
     * @param {String} tcpServerUuid : tcp-server uuid to set tcp-server instance.
     * @param {String} localAddress : localAddress that needs to be modified.
     * @returns {Promise<Boolean>} true|false
     **/
    static async setLocalAddressAsync(tcpServerUuid, localAddress) {
        let addressToBeDeleted = await fileOperation.readFromDatabaseAsync(
            onfPaths.TCP_SERVER_LOCAL_ADDRESS.replace(
                "{uuid}", tcpServerUuid)
        );
        let pathToBeDeleted;
        if (onfAttributes.TCP_SERVER.DOMAIN_NAME in addressToBeDeleted) {
            pathToBeDeleted = onfPaths.TCP_SERVER_DOMAIN_NAME.replace(
                "{uuid}", tcpServerUuid);
        } else {
            pathToBeDeleted = onfPaths.TCP_SERVER_IP_ADDRESS.replace(
                "{uuid}", tcpServerUuid);
        }
        await fileOperation.deletefromDatabaseAsync(pathToBeDeleted);
        let addressPath = getLocalAddressPath(tcpServerUuid, localAddress);
        return await fileOperation.writeToDatabaseAsync(
            addressPath,
            localAddress,
            false);
    }

    /**
     * @description This function modifies the tcp-server local-port.
     * @param {String} tcpServerUuid : tcp-server uuid to set tcp-server instance.
     * @param {String} localPort : localPort that needs to be modified.
     * @returns {Promise<boolean>} true|false
     **/
    static async setLocalPortAsync(tcpServerUuid, localPort) {
        let localPortPath = onfPaths.TCP_SERVER_LOCAL_PORT.replace("{uuid}", tcpServerUuid);
        return await fileOperation.writeToDatabaseAsync(
            localPortPath,
            localPort,
            false);
    }

    /**
     * @description This function returns the protocol from onf-core-model format present in protocolEnum.
     * @param {String} protocol : protocol in onf-core-model format.
     * @returns {Array} localProtocol
     **/
    static getProtocolFromProtocolEnum(protocol) {
        let localProtocol = [];
        let localProtocolEnum = TcpServerInterface.TcpServerInterfacePac.TcpServerInterfaceConfiguration.localProtocolEnum;
        for (let localProtocolKey in localProtocolEnum) {
            if (localProtocolEnum[localProtocolKey] == protocol || localProtocolKey == protocol) {
                localProtocol = [localProtocolKey, localProtocolEnum[localProtocolKey]];
            }
        }
        return localProtocol;
    }

    /**
     * @description This function returns the address of the current application in format 
     *              required for request body formulation of forwardings.
     * @returns {Promise<String>} localAddress
     **/
    static async getLocalAddressForForwarding() {
        let localAddress = await TcpServerInterface.getLocalAddress();
        if(onfAttributes.TCP_SERVER.IPV_4_ADDRESS in localAddress){
            localAddress = { "ip-address" : localAddress}
        } 
            return localAddress;
    }
}

/**
 * @description This function returns the remote address configured .
 * @param {String} tcpServerUuid
 * @param {String} local Address
 * @returns {String} path
 **/
function getLocalAddressPath(tcpServerUuid, localAddress) {
    let localAddressPath;
    if (onfAttributes.TCP_SERVER.DOMAIN_NAME in localAddress) {
        localAddressPath = onfPaths.TCP_SERVER_DOMAIN_NAME.replace(
            "{uuid}", tcpServerUuid);
    } else {
        localAddressPath = onfPaths.TCP_SERVER_IP_ADDRESS.replace(
            "{uuid}", tcpServerUuid);
    }
    return localAddressPath;
}

module.exports = TcpServerInterface;
