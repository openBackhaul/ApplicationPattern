/**
 * This class provides a stub to instantiate and generate a JSON object for an operationClientIInterface layer protocol. 
 * This class is a sub class for LayerProtocol. 
 * This class provides functionality
 *      - to read the currently configured attribute values of the operation-client-interface. 
 *      - create new operation-client-instance
 *      - to set the operation-name and operation-key of a operation-client-interface
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const layerProtocol = require('../LayerProtocol');
const tcpClientInterface = require('./TcpClientInterface');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');
const httpClientInterface = require('../../models/layerProtocols/HttpClientInterface');

/**  
 * @extends layerProtocol
 */
class OperationClientInterface extends layerProtocol {

    static OperationClientInterfacePac = class OperationClientInterfacePac {
        operationClientInterfaceConfiguration;
        operationClientInterfaceStatus;

        /**
         * constructor 
         * @param {string} operationName name of the operation.
         */
        constructor(operationName) {
            this.operationClientInterfaceConfiguration = new OperationClientInterfacePac.
            OperationClientInterfaceConfiguration(
                operationName,
                OperationClientInterfacePac.defaultOperationKey);
            this.operationClientInterfaceStatus = new OperationClientInterfacePac.
            OperationClientInterfaceStatus(
                OperationClientInterfacePac.defaultOperationalState,
                OperationClientInterfacePac.defaultLifeCycleState);
        }

        static OperationClientInterfaceConfiguration = class OperationClientInterfaceConfiguration {

            operationName;
            operationKey;

            /**
             * constructor 
             * @param {string} operationName name of the operation.
             * @param {string} operationKey ket of the operation.
             */
            constructor(operationName, operationKey) {
                this.operationName = operationName;
                this.operationKey = operationKey;
            }
        };

        static OperationClientInterfaceStatus = class OperationClientInterfaceStatus {
            operationalState;
            lifeCycleState;

            static operationalStateEnum = {
                AVAILABLE: "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_AVAILABLE",
                UNAVAILABLE: "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_UNAVAILABLE",
                NOT_YET_DEFINED: "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED"
            };
            static lifeCycleStateEnum = {
                EXPERIMENTAL: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
                OPERATIONAL: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_OPERATIONAL",
                DEPRECATED: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_DEPRECATED",
                OBSOLETE: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_OBSOLETE",
                UNKNOWN: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_UNKNOWN",
                NOT_YET_DEFINED: "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
            };

            /**
             * constructor 
             * @param {string} operationalState operation state of the operation client.
             * @param {string} lifeCycleState life cycle state of the operation client.
             */
            constructor(operationalState, lifeCycleState) {
                this.operationalState = operationalState;
                this.lifeCycleState = lifeCycleState;
            }
        };

        static layerProtocolName = layerProtocol.layerProtocolNameEnum.OPERATION_CLIENT;
        static defaultOperationKey = "Operation key not yet provided.";
        static defaultOperationalState = OperationClientInterfacePac.OperationClientInterfaceStatus.operationalStateEnum.NOT_YET_DEFINED;
        static defaultLifeCycleState = OperationClientInterfacePac.OperationClientInterfaceStatus.lifeCycleStateEnum.NOT_YET_DEFINED;

    }

    /**
     * constructor 
     * @param {string} operationName operation name of the client that needs to be called back.
     */
    constructor(operationName) {
        super(
            "0",
            OperationClientInterface.OperationClientInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC] = new OperationClientInterface.
        OperationClientInterfacePac(operationName);
    }

    /**
     * @description This function returns the operation name of the operation client.
     * @param {String} operationClientUuid : uuid of the operation client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {promise} string {operationName | undefined}
     **/
    static getOperationNameAsync(operationClientUuid) {
        return new Promise(async function (resolve, reject) {
            let operationName = undefined;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    operationClientUuid);
                if (logicalTerminationPoint !== undefined) {
                    let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                    let operationClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
                    let operationClientConfiguration = operationClientPac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
                    operationName = operationClientConfiguration[onfAttributes.OPERATION_CLIENT.OPERATION_NAME];
                }
                resolve(operationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation key of the operation client.
     * @param {String} operationClientUuid : uuid of the operation client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {promise} string {operationKey | undefined}
     **/
    static getOperationKeyAsync(operationClientUuid) {
        return new Promise(async function (resolve, reject) {
            let operationKey = undefined;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    operationClientUuid);
                if (logicalTerminationPoint != undefined) {
                    let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                    let operationClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
                    let operationClientConfiguration = operationClientPac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
                    operationKey = operationClientConfiguration[onfAttributes.OPERATION_CLIENT.OPERATION_KEY];
                }
                resolve(operationKey);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation client uuid information for the given http-client uuid and operation name.
     * @param {String} httpClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationName : name of the operation.
     * @returns {promise} string {undefined | uuid}
     **/
    static getOperationClientUuidAsync(httpClientUuid, operationName) {
        return new Promise(async function (resolve, reject) {
            let operationClientUuid;
            try {
                let clientLtpList = await logicalTerminationPoint.
                getClientLtpListAsync(httpClientUuid);
                for (let i = 0; i < clientLtpList.length; i++) {
                    let clientLtp = clientLtpList[i];
                    let _operationName = await OperationClientInterface.
                    getOperationNameAsync(clientLtp);
                    if (operationName == _operationName) {
                        operationClientUuid = clientLtpList[i];
                    }
                }
                resolve(operationClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the tcp ip address and port where the application that has the 
     * operation-client is running.
     * @param {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {promise} string {undefined | tcpAddress+port}.
     **/
    static getTcpIpAddressAndPortAsyncAsync(operationClientUuid) {
        return new Promise(async function (resolve, reject) {
            let tcpIpAddressAndPort;
            try {
                let httpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid);
                let httpClientUuid = httpClientUuidList[0];
                let tcpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
                let tcpClientUuid = tcpClientUuidList[0];
                let tcpClientRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
                let remoteAddress = await getConfiguredRemoteAddress(tcpClientRemoteAddress);
                let remotePort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
                tcpIpAddressAndPort = remoteAddress + ":" + remotePort;
                resolve(tcpIpAddressAndPort);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the operation key of an operation client.
     * @param {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationKey : key that needs to be updated.
     * @returns {promise} boolean {true|false}
     **/
    static setOperationKeyAsync(operationClientUuid, operationKey) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let operationKeyPath = onfPaths.OPERATION_CLIENT_OPERATION_KEY.replace(
                    "{uuid}", operationClientUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    operationKeyPath,
                    operationKey,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the operation name for the provided operation client uuid.
     * @param {String} {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationName : name that needs to be updated.
     * @returns {promise} boolean {true|false}
     **/
    static setOperationNameAsync(operationClientUuid, operationName) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let operationNamePath = onfPaths.OPERATION_CLIENT_OPERATION_NAME.replace(
                    "{uuid}", operationClientUuid);
                let isUpdated = await fileOperation.writeToDatabaseAsync(
                    operationNamePath,
                    operationName,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @deprecated Works only with old UUIDs, use generateOperationClientUuidAsync
     * @description This function generates the next operation client uuid for the given http client uuid and operation name.
     * @param {String} httpClientUuid : uuid of the http client logical termination point,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationName : name that needs to be updated.
     * @returns {promise} string {uuid}
     **/
    static generateNextUuidAsync(httpClientUuid, operationName) {
        return new Promise(async function (resolve, reject) {
            let operationClientUuid = undefined;
            try {
                let clientLtpList = await logicalTerminationPoint.getClientLtpListAsync(
                    httpClientUuid);

                if (clientLtpList == undefined || clientLtpList.length == 0) {
                    operationClientUuid = httpClientUuid.replace("http", "op");
                    resolve(operationClientUuid);
                }

                for (let i = 0; i < clientLtpList.length; i++) {
                    let clientLtp = clientLtpList[i];
                    let _operationName = await OperationClientInterface.getOperationNameAsync(
                        clientLtp);
                    if (_operationName == operationName) {
                        operationClientUuid = clientLtp;
                    }
                }

                if (operationClientUuid == undefined) {
                    clientLtpList.sort();
                    let lastUuid = clientLtpList[clientLtpList.length - 1];
                    let uuidPrefix = lastUuid.substring(0,
                        lastUuid.lastIndexOf("-") + 1);
                    let uuidNumber = lastUuid.substring(
                        lastUuid.lastIndexOf("-") + 1,
                        lastUuid.length);
                    operationClientUuid = uuidPrefix +
                        (parseInt(uuidNumber) +
                            1);
                }

                resolve(operationClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function generates operation client uuid for the given http client uuid, api segment and sequence.
     * @param {String} httpClientUuid : uuid of the http client logical termination point,the value should be a valid string
     * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
     * @param {String} apiSegment : API segment part of client UUID
     * @param {String} sequence : Sequence part of client UUID
     * @returns {promise} string {uuid}
     **/
    static generateOperationClientUuidAsync(httpClientUuid, apiSegment, sequence) {
        return new Promise(async function (resolve, reject) {
            let operationClientUuid = undefined;
            try {
                let appUuid = await controlConstruct.getUuidAsync();
                let releaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
                let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
                let releaseNumberUuidFormat = releaseNumber.replace(/\./g, "-");

                let applicationNameUuidFormat = applicationName.replace(/[a-z]/g, "").toLowerCase();
                operationClientUuid = appUuid + "-op-c-" + apiSegment + "-" +
                applicationNameUuidFormat + "-" + releaseNumberUuidFormat + "-" + sequence;
                resolve(operationClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function creates a new operation-client-interface .
     * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationClientUuid : uuid of the operation-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationName : name of the operation.
     * @returns {promise} object {operationClientInterface}
     **/
    static createOperationClientInterface(httpClientUuid, operationClientUuid, operationName) {
        return new Promise(async function (resolve, reject) {
            let operationClientLogicalTerminationPoint;
            try {
                let operationClientInterface = new OperationClientInterface(operationName);
                operationClientLogicalTerminationPoint = new logicalTerminationPoint(
                    operationClientUuid,
                    logicalTerminationPoint.ltpDirectionEnum.SINK,
                    [],
                    [httpClientUuid],
                    [operationClientInterface]
                );
                resolve(operationClientLogicalTerminationPoint);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Determines if given UUID belongs to a client operation.
     * @param {String} operationUuid UUID to be checked
     * @returns {boolean} true if UUID belongs to a client operation
     */
    static isOperationClient(operationUuid) {
        let splitted = operationUuid.split("-");
        return "c" === splitted[5];
    }
}

/**
 * @description This function returns the remote address configured .
 * @param {String} remoteAddress : remote address of the tcp client .
 * @returns {promise} string {remoteAddress}
 **/
function getConfiguredRemoteAddress(remoteAddress) {
    return new Promise(async function (resolve, reject) {
        try {
            let domainName = onfAttributes.TCP_CLIENT.DOMAIN_NAME;
            if (domainName in remoteAddress) {
                remoteAddress = remoteAddress["domain-name"];
            } else {
                remoteAddress = remoteAddress[
                    onfAttributes.TCP_CLIENT.IP_ADDRESS][
                    onfAttributes.TCP_CLIENT.IPV_4_ADDRESS
                ];
            }
            resolve(remoteAddress);
        } catch (error) {
            reject(error);
        }
    });

}

module.exports = OperationClientInterface;