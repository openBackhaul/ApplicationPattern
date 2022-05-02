/**
 * This class provides a stub to instantiate and generate a JSON object for an operationServerInterface layer protocol. 
 * This class is a sub class for LayerProtocol. 
 * It provides functionality ,
 * - to read the currently configured attribute values of the operation-server-interface. 
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const layerProtocol = require('../LayerProtocol');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');
const LayerProtocol = require('../LayerProtocol');
/** 
 * @extends layerProtocol
 */
class OperationServerInterface extends layerProtocol {

    static OperationServerInterfacePac = class OperationServerInterfacePac {
        operationServerInterfaceCapability;
        operationServerInterfaceConfiguration;
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.OPERATION_SERVER;

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
                DEPRICATED: "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_DEPRICATED",
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
     * @returns {promise} string {operationName | undefined}
     **/
    static getOperationNameAsync(operationServerUuid) {
        return new Promise(async function (resolve, reject) {
            let operationName;
            try {
                let logicalTerminationPoint = await controlConstruct.
                getLogicalTerminationPointAsync(operationServerUuid);
                let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
                let operationServerCapability = operationServerPac[onfAttributes.OPERATION_SERVER.CAPABILITY];
                operationName = operationServerCapability[onfAttributes.OPERATION_SERVER.OPERATION_NAME];
                resolve(operationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation name for the given operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-server-\d+$'
     * @returns {promise} string {operationName | undefined}
     **/
     static getNextVersionOfOperationNameIfExists(operationServerName) {
        return new Promise(async function (resolve, reject) {
            let nextVersionOfOperationName;
            try {
                let operationServerNameList = await OperationServerInterface.getAllOperationServerNameAsync(); 
                let splitOperationServerName =  operationServerName.split("/");
                let versionOfTheOperationServerName = parseInt(splitOperationServerName[1].replace('v',''));
                let operationServerNameWithoutVersion = splitOperationServerName[2];
                for(let i=0;i<operationServerNameList.length;i++){
                    let _operationServerName = operationServerNameList[i];
                    let _splitOperationServerName = _operationServerName.split("/");
                    let _versionOfTheOperationServerName = parseInt(_splitOperationServerName[1].replace('v',''));
                    let _operationServerNameWithoutVersion = _splitOperationServerName[2];
                    if(_operationServerNameWithoutVersion == operationServerNameWithoutVersion){
                        if(_versionOfTheOperationServerName > versionOfTheOperationServerName){
                            nextVersionOfOperationName = _operationServerName;
                        }
                    }
                }              
                resolve(nextVersionOfOperationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation name for the given operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-server-\d+$'
     * @returns {promise} string {operationName | undefined}
     **/
    static getAllOperationServerNameAsync() {
        return new Promise(async function (resolve, reject) {
            let operationNameList = [];
            try {
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

                resolve(operationNameList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation key of the operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @returns {promise} string {operationKey | undefined}
     **/
    static getOperationKeyAsync(operationServerUuid) {
        return new Promise(async function (resolve, reject) {
            let operationKey;
            try {
                let logicalTerminationPoint = await controlConstruct.
                getLogicalTerminationPointAsync(operationServerUuid);
                let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
                let operationServerConfiguration = operationServerPac[onfAttributes.OPERATION_SERVER.CONFIGURATION];
                operationKey = operationServerConfiguration[onfAttributes.OPERATION_SERVER.OPERATION_KEY];
                resolve(operationKey);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the operation key of the operation server.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @param {String} operationKey : operation key that needs to be updated.
     * @returns {promise} boolean {true | false}
     **/
    static setOperationKeyAsync(operationServerUuid, operationKey) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let operationKeyPath = onfPaths.OPERATION_SERVER_OPERATION_KEY.replace(
                    "{uuid}", operationServerUuid);
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
     * @description This function returns the life-cycle-state for the given operation server uuid.
     * @param {String} operationServerUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-operation-server-\d+$'
     * @returns {promise} boolean {lifeCycleState | undefined}
     **/
    static getLifeCycleState(operationServerUuid) {
        return new Promise(async function (resolve, reject) {
            let lifeCycleState;
            try {
                let logicalTerminationPoint = await controlConstruct.
                getLogicalTerminationPointAsync(operationServerUuid);
                let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
                let operationServerConfiguration = operationServerPac[onfAttributes.OPERATION_SERVER.CONFIGURATION];
                lifeCycleState = operationServerConfiguration[onfAttributes.OPERATION_SERVER.LIFE_CYCLE_STATE];
                resolve(lifeCycleState);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation server uuid for the given operation name.
     * @param {String} operationName : operation name of the operation server.
     * @returns {promise} string {uuid}
     **/
    static getOperationServerUuidAsync(operationName) {
        return new Promise(async function (resolve, reject) {
            let operationServerUuid;
            try {
                let logicalTerminationPointList = await controlConstruct.
                getLogicalTerminationPointListAsync(layerProtocol.layerProtocolNameEnum.OPERATION_SERVER);
                if (logicalTerminationPointList != undefined) {
                    for (let i = 0; i < logicalTerminationPointList.length; i++) {
                        let logicalTerminationPoint = logicalTerminationPointList[i];
                        let layerProtocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                        let operationServerPac = layerProtocol[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
                        let operationServerCapability = operationServerPac[onfAttributes.OPERATION_SERVER.CAPABILITY];
                        let _operationName = operationServerCapability[onfAttributes.OPERATION_SERVER.OPERATION_NAME];
                        if (_operationName != undefined && _operationName == operationName) {
                            operationServerUuid = logicalTerminationPoint[onfAttributes.GLOBAL_CLASS.UUID];
                        }
                    }
                }
                resolve(operationServerUuid);
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = OperationServerInterface;