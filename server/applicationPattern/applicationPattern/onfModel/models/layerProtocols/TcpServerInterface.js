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
            let localIpV4Address;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.TCP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let _layerProtocol = logicalTerminationPoint["layer-protocol"][0];
                let tcpServerPac = _layerProtocol["tcp-server-interface-1-0:tcp-server-interface-pac"];
                let tcpServerConfiguration = tcpServerPac["tcp-server-interface-configuration"];
                let localAddress = tcpServerConfiguration["local-address"];
                localIpV4Address = localAddress["ipv-4-address"];
                resolve(localIpV4Address);
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
}
module.exports = TcpServerInterface;