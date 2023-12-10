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
const LayerProtocol = require('../LayerProtocol');
const tcpClientInterface = require('./TcpClientInterface');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/**  
 * @extends LayerProtocol
 */
class OperationClientInterface extends LayerProtocol {

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

        static layerProtocolName = LayerProtocol.layerProtocolNameEnum.OPERATION_CLIENT;
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
     * @returns {Promise<String>} operationName | undefined
     **/
    static async getOperationNameAsync(operationClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(operationClientUuid);
        if (logicalTerminationPoint !== undefined) {
            let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
            let operationClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
            let operationClientConfiguration = operationClientPac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
            return operationClientConfiguration[onfAttributes.OPERATION_CLIENT.OPERATION_NAME];
        }
        return undefined;
    }
    
    /**
     * @description This function returns the detailedLoggingIsOn attribute of the operation client.
     * @param {String} operationClientUuid : uuid of the operation client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {Promise<boolean>} detailedLoggingIsOn | undefined
     **/
    static async getDetailedLoggingIsOnAsync(operationClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
            operationClientUuid);
        if (logicalTerminationPoint !== undefined) {
            let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
            let operationClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
            let operationClientConfiguration = operationClientPac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
            return operationClientConfiguration["detailed-logging-is-on"];
        }
        return undefined;
    }

    /**
     * @description This function returns the operation key of the operation client.
     * @param {String} operationClientUuid : uuid of the operation client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {Promise<String>} operationKey | undefined
     **/
    static async getOperationKeyAsync(operationClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
            operationClientUuid);
        if (logicalTerminationPoint != undefined) {
            let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
            let operationClientPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
            let operationClientConfiguration = operationClientPac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
            return operationClientConfiguration[onfAttributes.OPERATION_CLIENT.OPERATION_KEY];
        }
        return undefined;
    }

    /**
     * @description This function returns the operation client uuid information for the given http-client uuid and operation name.
     * @param {String} httpClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationName : name of the operation.
     * @returns {Promise<String>} undefined | uuid
     **/
    static async getOperationClientUuidAsync(httpClientUuid, operationName) {
        let clientLtpList = await logicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
        for (let i = 0; i < clientLtpList.length; i++) {
            let clientLtp = clientLtpList[i];
            let _operationName = await OperationClientInterface.getOperationNameAsync(clientLtp);
            if (operationName == _operationName) {
                return clientLtpList[i];
            }
        }
        return undefined;
    }

    /**
     * @description This function returns the tcp protocol, ip address and port where the application that has the
     * operation-client is running.
     * @param {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @returns {Promise<String>} {undefined | protocol+tcpAddress+port}.
     **/
    static async getTcpClientConnectionInfoAsync(operationClientUuid) {
        let httpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid);
        let httpClientUuid = httpClientUuidList[0];
        let tcpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
        let tcpClientUuid = tcpClientUuidList[0];
        let tcpClientRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
        let remoteAddress = getConfiguredRemoteAddress(tcpClientRemoteAddress);
        let remotePort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
        let remoteProtocol = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuid);
        return remoteProtocol.toLowerCase() + "://" + remoteAddress + ":" + remotePort;
    }

    /**
     * @description This function modifies the operation key of an operation client.
     * @param {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationKey : key that needs to be updated.
     * @returns {Promise<boolean>} true|false
     **/
    static async setOperationKeyAsync(operationClientUuid, operationKey) {
        let operationKeyPath = onfPaths.OPERATION_CLIENT_OPERATION_KEY.replace(
            "{uuid}", operationClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            operationKeyPath,
            operationKey,
            false);
    }

    /**
     * @description This function modifies the operation name for the provided operation client uuid.
     * @param {String} {String} operationClientUuid : uuid of the http client ,the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationName : name that needs to be updated.
     * @returns {Promise<boolean>} true|false
     **/
    static async setOperationNameAsync(operationClientUuid, operationName) {
        let operationNamePath = onfPaths.OPERATION_CLIENT_OPERATION_NAME.replace(
            "{uuid}", operationClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            operationNamePath,
            operationName,
            false);
    }

    /**
     * @description This function generates operation client uuid for the given http client uuid, api segment and sequence.
     * @param {String} httpClientUuid : uuid of the http client logical termination point,the value should be a valid string
     * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
     * @param {String} apiSegment : API segment part of client UUID
     * @param {String} sequence : Sequence part of client UUID
     * @returns {Promise<String>} uuid
     **/
    static async generateOperationClientUuidAsync(httpClientUuid, apiSegment, sequence) {
        let appUuid = await controlConstruct.getUuidAsync();
        let applicationNameUuidFormat = httpClientUuid.split("-")[6];
        let releaseNumberUuidFormat = httpClientUuid.split("-")[7] + "-" + httpClientUuid.split("-")[8] + "-" + httpClientUuid.split("-")[9];
        return appUuid + "-op-c-" + apiSegment + "-" +
            applicationNameUuidFormat + "-" + releaseNumberUuidFormat + "-" + sequence;
    }

    /**
     * @description This function creates a new operation-client-interface .
     * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationClientUuid : uuid of the operation-client, the value should be a valid string 
     * in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} operationName : name of the operation.
     * @returns {Object} logicalTerminationPoint
     **/
    static createOperationClientInterface(httpClientUuid, operationClientUuid, operationName) {
        let operationClientInterface = new OperationClientInterface(operationName);
        return new logicalTerminationPoint(
            operationClientUuid,
            logicalTerminationPoint.ltpDirectionEnum.SINK,
            [],
            [httpClientUuid],
            [operationClientInterface]
        );
    }

    /**
     * @deprecated use isOperationClientAsync
     * @description Determines if given UUID belongs to a client operation.
     * @param {String} operationUuid UUID to be checked
     * @returns {boolean} true if UUID belongs to a client operation
     */
    static isOperationClient(operationUuid) {
        let splitted = operationUuid.split("-");
        return "c" === splitted[5];
    }

    /**
     * @description Determines if given UUID belongs to a client operation.
     * @param {String} operationUuid UUID to be checked
     * @returns {Promise<Boolean>} true if UUID belongs to a client operation
     */
    static async isOperationClientAsync(operationUuid) {
        const ltp = await controlConstruct.getLogicalTerminationPointAsync(operationUuid);
        if (ltp === undefined) {
            return false;
        }
        const layerProtocol = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        const layerProtocolName = layerProtocol[onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
        return LayerProtocol.layerProtocolNameEnum.OPERATION_CLIENT === layerProtocolName;
    }
}

/**
 * @description This function returns the remote address configured .
 * @param {String} remoteAddress : remote address of the tcp client .
 * @returns {String} remoteAddress
 **/
function getConfiguredRemoteAddress(remoteAddress) {
    let domainName = onfAttributes.TCP_CLIENT.DOMAIN_NAME;
    if (domainName in remoteAddress) {
        remoteAddress = remoteAddress["domain-name"];
    } else {
        remoteAddress = remoteAddress[
            onfAttributes.TCP_CLIENT.IP_ADDRESS][
            onfAttributes.TCP_CLIENT.IPV_4_ADDRESS
        ];
    }
    return remoteAddress;
}

module.exports = OperationClientInterface;
