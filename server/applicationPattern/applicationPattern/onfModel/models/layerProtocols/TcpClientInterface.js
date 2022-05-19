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
            static RemoteAddress = class RemoteAddress {
                ipAddress;
                static IpAddress = class IpAddress {
                    ipv4Address;

                    /**
                     * constructor 
                     * @param {string} ipv4Address tcp ipaddress where the application is hosted .
                     */
                    constructor(ipv4Address) {
                        this.ipv4Address = ipv4Address;
                    }
                }

                /**
                 * constructor 
                 * @param {string} ipAddress tcp ipaddress where the application is hosted .
                 */
                constructor(ipAddress) {
                    this.ipAddress = new RemoteAddress.IpAddress(ipAddress);
                }
            };

            /**
             * constructor 
             * @param {string} remoteAddress tcp ipaddress where the application is hosted .
             * @param {string} remotePort tcp port where the application is running .
             */
            constructor(remoteAddress, remotePort) {
                this.remoteAddress = new TcpClientInterfaceConfiguration.RemoteAddress(
                    remoteAddress);
                this.remotePort = remotePort;
            }
        };

        /**
         * constructor 
         * @param {string} remoteAddress tcp ipaddress where the application is hosted .
         * @param {string} remotePort tcp port where the application is running .
         */
        constructor(remoteAddress, remotePort) {
            this.tcpClientInterfaceConfiguration = new TcpClientInterfacePac.TcpClientInterfaceConfiguration(
                remoteAddress,
                remotePort);
        }
    };

    /**
     * constructor 
     * @param {string} remoteAddress tcp ipaddress where the application is hosted .
     * @param {string} remotePort tcp port where the application is running .
     */
    constructor(remoteAddress, remotePort) {
        super(0,
            TcpClientInterface.TcpClientInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.TCP_CLIENT_INTERFACE_PAC] = new TcpClientInterface
            .TcpClientInterfacePac(
                remoteAddress,
                remotePort);
    }

    /**
     * @description This function returns the tcp ip address where the application is running .
     * @param {String} tcpClientUuid : uuid of the tcp client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @returns {promise} string {undefined | remoteAddress}
     **/
    static getRemoteAddressAsync(tcpClientUuid) {
        return new Promise(async function (resolve, reject) {
            let remoteIpV4Address;
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
                remoteIpV4Address = remoteAddress[
                    onfAttributes.TCP_CLIENT.IP_ADDRESS][
                    onfAttributes.TCP_CLIENT.IPV_4_ADDRESS
                ];
                resolve(remoteIpV4Address);
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
     * @description This function generates the tcp-client uuid for the given http-client uuid.
     * @param {String} httpClientUuid uuid of the http-client-interface logical-termination-point.
     * @returns string {tcpClientUuid}
     **/
    static generateNextUuid(httpClientUuid) {
        let tcpClientUuid;
        try {
            tcpClientUuid = httpClientUuid.replace("http", "tcp");
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
     * @returns {promise} object {TcpClientInterface}
     **/
    static createTcpClientInterfaceAsync(httpClientUuid, tcpClientUuid, ipv4Address, port) {
        return new Promise(async function (resolve, reject) {
            let tcpClientLogicalTerminationPoint;
            try {
                let tcpClientInterface = new TcpClientInterface(
                    ipv4Address,
                    port);
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
                let remoteAddressPath = onfPaths.TCP_CLIENT_REMOTE_ADDRESS.replace(
                    "{uuid}", tcpClientUuid);
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
}
module.exports = TcpClientInterface;