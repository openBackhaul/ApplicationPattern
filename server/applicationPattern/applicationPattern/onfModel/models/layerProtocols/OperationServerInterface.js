/**
 * This class provides a stub to instantiate and generate a JSON object for an operationServerInterface layer protocol. 
 * This class is a sub class for LayerProtocol. 
 * It provides functionality ,
 * - to read the currently configured attribute values of the operation-server-interface. 
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const LayerProtocol = require('../LayerProtocol');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');
/** 
 * @extends LayerProtocol
 */
class OperationServerInterface extends LayerProtocol {

    static OperationServerInterfacePac = class OperationServerInterfacePac {
        operationServerInterfaceCapability;
        operationServerInterfaceConfiguration;
        static layerProtocolName = LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER;

        static OperationServerInterfaceCapability = class OperationServerInterfaceCapability {
            operationName;

            /**
             * constructor 
             * @param {string} operationName name of the operation..
             */
            constructor(operationName) {
                this.operationName = operationName;
            }
        };
        static OperationServerInterfaceConfiguration = class OperationServerInterfaceConfiguration {
            lifeCycleState;
            operationKey;
            static lifeCycleStateEnum = {
                EXPERIMENTAL: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
                OPERATIONAL: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_OPERATIONAL",
                DEPRECATED: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_DEPRECATED",
                OBSOLETE: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_OBSOLETE",
                UNKNOWN: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_UNKNOWN",
                NOT_YET_DEFINED: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
            };

            /**
             * constructor 
             * @param {string} operationState operation state of the operation server.
             * @param {string} lifeCycleState life cycle state of the operation server.
             */
            constructor(lifeCycleState, operationKey) {
                this.lifeCycleState = lifeCycleState;
                this.operationKey = operationKey;
            }
        };

        /**
         * constructor 
         * @param {String} operationName name of the operation.
         */
        constructor(operationName) {
            this.operationServerInterfaceCapability = new OperationServerInterfacePac.
                OperationServerInterfaceCapability(operationName);
            this.operationServerInterfaceConfiguration = new OperationServerInterfacePac.
                OperationServerInterfaceConfiguration();
        }
    }

    /**
     * constructor 
     * @param {String} operationName name of the operation.
     */
    constructor(operationName) {
        super(0,
            OperationServerInterface.OperationServerInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC] = new
            OperationServerInterface.OperationServerInterfacePac(operationName);
    }

    /**
     * @description This function returns the operation name for the given operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-server-\d+$'
     * @returns {Promise<String>} operationName | undefined
     **/
    static async getOperationNameAsync(operationServerUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(operationServerUuid);
        let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
        let operationServerCapability = operationServerPac[onfAttributes.OPERATION_SERVER.CAPABILITY];
        return operationServerCapability[onfAttributes.OPERATION_SERVER.OPERATION_NAME];
    }

    /**
     * @description This function returns the next version operation name for the given operation server name.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-server-\d+$'
     * @returns {Promise<String>} operationName | undefined
     **/
    static async getNextVersionOfOperationNameIfExists(operationServerName) {
        let nextVersionOfOperationName;
        let operationServerNameList = await OperationServerInterface.getAllOperationServerNameAsync();
        let splitOperationServerName = operationServerName.split("/");
        let versionOfTheOperationServerName = parseInt(splitOperationServerName[1].replace('v', ''));
        let operationServerNameWithoutVersion = splitOperationServerName[2];
        for (let i = 0; i < operationServerNameList.length; i++) {
            let _operationServerName = operationServerNameList[i];
            let _splitOperationServerName = _operationServerName.split("/");
            let _versionOfTheOperationServerName = parseInt(_splitOperationServerName[1].replace('v', ''));
            let _operationServerNameWithoutVersion = _splitOperationServerName[2];
            if (_operationServerNameWithoutVersion == operationServerNameWithoutVersion) {
                if (_versionOfTheOperationServerName > versionOfTheOperationServerName) {
                    return _operationServerName;
                }
            }
        }
        return nextVersionOfOperationName;
    }

    /**
     * @description This function returns all operation server names
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-server-\d+$'
     * @returns {Promise<String>} operationName | undefined
     **/
    static async getAllOperationServerNameAsync() {
        let operationNameList = [];
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER);
        for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let logicalTerminationPoint = logicalTerminationPointList[i];
            let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
            let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
            let operationServerCapability = operationServerPac[onfAttributes.OPERATION_SERVER.CAPABILITY];
            let operationName = operationServerCapability[onfAttributes.OPERATION_SERVER.OPERATION_NAME];
            operationNameList.push(operationName);
        }
        return operationNameList;
    }

    /**
     * @description This function returns the operation key of the operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @returns {Promise<String>} operationKey | undefined
     **/
    static async getOperationKeyAsync(operationServerUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(operationServerUuid);
        if (logicalTerminationPoint != undefined) {
            let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
            let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
            let operationServerConfiguration = operationServerPac[onfAttributes.OPERATION_SERVER.CONFIGURATION];
            return operationServerConfiguration[onfAttributes.OPERATION_SERVER.OPERATION_KEY];
        }
        return undefined;
    }

    /**
     * @description This function modifies the operation key of the operation server.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @param {String} operationKey : operation key that needs to be updated.
     * @returns {Promise<boolean>} true | false
     **/
    static async setOperationKeyAsync(operationServerUuid, operationKey) {
        let operationKeyPath = onfPaths.OPERATION_SERVER_OPERATION_KEY.replace(
            "{uuid}", operationServerUuid);
        return await fileOperation.writeToDatabaseAsync(
            operationKeyPath,
            operationKey,
            false);
    }

    /**
     * @description This function returns the life-cycle-state for the given operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @returns {Promise<String>} lifeCycleState | undefined
     **/
    static async getLifeCycleState(operationServerUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(operationServerUuid);
        let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
        let operationServerConfiguration = operationServerPac[onfAttributes.OPERATION_SERVER.CONFIGURATION];
        let lifeCycleState = operationServerConfiguration[onfAttributes.OPERATION_SERVER.LIFE_CYCLE_STATE];
        let lifeCycleStateEnum = OperationServerInterface.OperationServerInterfacePac.OperationServerInterfaceConfiguration.lifeCycleStateEnum;
        for (let lifeCycleStateKey in lifeCycleStateEnum) {
            if (lifeCycleStateEnum[lifeCycleStateKey] == lifeCycleState) {
                return lifeCycleStateKey;
            }
        }
    }

    /**
     * @description This function returns the operation server uuid for the given operation name.
     * @param {String} operationName : operation name of the operation server.
     * @returns {Promise<String>} uuid
     **/
    static async getOperationServerUuidAsync(operationName) {
        let logicalTerminationPointList = await controlConstruct.
            getLogicalTerminationPointListAsync(LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER);
        if (logicalTerminationPointList != undefined) {
            for (let i = 0; i < logicalTerminationPointList.length; i++) {
                let logicalTerminationPoint = logicalTerminationPointList[i];
                let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
                let operationServerCapability = operationServerPac[onfAttributes.OPERATION_SERVER.CAPABILITY];
                let _operationName = operationServerCapability[onfAttributes.OPERATION_SERVER.OPERATION_NAME];
                if (_operationName != undefined && _operationName == operationName) {
                    return logicalTerminationPoint[onfAttributes.GLOBAL_CLASS.UUID];
                }
            }
        }
    }

    /**
     * @description Determines if given UUID belongs to a server operation.
     * @param {String} operationUuid UUID to be checked
     * @returns {Promise<Boolean>} true if UUID belongs to a server operation
     */
    static async isOperationServerAsync(operationUuid) {
        const ltp = await controlConstruct.getLogicalTerminationPointAsync(operationUuid);
        if (ltp === undefined) {
            return false;
        }
        const layerProtocol = ltp[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        const layerProtocolName = layerProtocol[onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
        return LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER === layerProtocolName;
    }

    /**
     * @deprecated use isOperationServerAsync
     * @description Determines if given UUID belongs to a server operation.
     * @param {String} operationUuid UUID to be checked
     * @returns {boolean} true if UUID belongs to a server operation
     */
    static isOperationServer(operationUuid) {
        let splitted = operationUuid.split("-");
        return "s" === splitted[5];
    }
}
module.exports = OperationServerInterface;
