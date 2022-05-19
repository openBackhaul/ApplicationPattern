/**
 * The LogicalTerminationPoint (LTP) class encapsulates the termination and adaptation functions of one or more technology specific layers 
 * represented by instances of LayerProtocol. 
 * This class provides 
 *      - stub to instantiate and generate a JSON object for a LogicalTerminationPoint. 
 *      - functionality to read the currently configured attribute values of the /core-model-1-4:control-construct/logical-termination-point
 **/
'use strict';

const controlConstruct = require('./ControlConstruct');
const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');
const fileOperation = require('../../databaseDriver/JSONDriver');

class LogicalTerminationPoint {

    uuid;
    ltpDirection;
    clientLtp;
    serverLtp;
    layerProtocol;

    static ltpDirectionEnum = {
        SINK: "core-model-1-4:TERMINATION_DIRECTION_SINK",
        SOURCE: "core-model-1-4:TERMINATION_DIRECTION_SOURCE"
    }

    /**
     * @constructor 
     * @param {String} uuid : unified resource identifier for the logical-termination-point.
     * @param {String} ltpDirection : direction of the LTP , it can be any one of the LogicalTerminationPoint.ltpDirectionEnum.
     * @param {String} clientLtp : client LTPs ((operation-client/server) associated with http-client/server, ((http-client/server) associated with tcp-client/server)).
     * @param {String} serverLtp : server LTPs ((tcp-client/server) associated with http-client/server, ((http-client/server) associated with operation-client/server)).
     * @param {String} layerProtocol : an instance of the LayerProtocol class.
     **/
    constructor(uuid, ltpDirection, clientLtp, serverLtp, layerProtocol) {
        this.uuid = uuid;
        this.ltpDirection = ltpDirection;
        this.clientLtp = clientLtp;
        this.serverLtp = serverLtp;
        this.layerProtocol = layerProtocol;
    }

    /**
     * @description This function returns the server-ltp list for the given logical-termination-point uuid
     * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern 
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @returns {promise} list { [] | uuid }
     **/
    static getServerLtpListAsync(logicalTerminationPointUuid) {
        return new Promise(async function (resolve, reject) {
            let serverLtpList = [];
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    logicalTerminationPointUuid);
                if (logicalTerminationPoint != undefined) {
                    serverLtpList = logicalTerminationPoint[
                        onfAttributes.LOGICAL_TERMINATION_POINT.SERVER_LTP];
                }
                resolve(serverLtpList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the client-ltp list for the given logical-termination-point uuid
     * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern 
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @returns {promise} list { [] | uuid }
     **/
    static getClientLtpListAsync(logicalTerminationPointUuid) {
        return new Promise(async function (resolve, reject) {
            let clientLtpList;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(
                    logicalTerminationPointUuid);
                if (logicalTerminationPoint != undefined) {
                    clientLtpList = logicalTerminationPoint[
                        onfAttributes.LOGICAL_TERMINATION_POINT.CLIENT_LTP];
                }
                resolve(clientLtpList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the client-ltp list for the given logical-termination-point uuid.
     * @param {String} logicalTerminationPointUuid of the logical-termination-point in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @param {list} clientUuidList : list of client uuids that needs to be updated.
     * @returns {promise} boolean { true | false }
     **/
    static setClientLtpListAsync(logicalTerminationPointUuid, clientUuidList) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            let _clientUuidList = await LogicalTerminationPoint.getClientLtpListAsync(
                logicalTerminationPointUuid);
            try {
                for (let i = 0; i < clientUuidList.length; i++) {
                    let isClientUuidExist = false;
                    let clientUuid = clientUuidList[i];
                    if (_clientUuidList != undefined && _clientUuidList.indexOf(clientUuid) > -1) {
                        isClientUuidExist = true;
                    }
                    if (!isClientUuidExist) {
                        let clientLtpPath = onfPaths.CLIENT_LTP.replace(
                            "{uuid}", logicalTerminationPointUuid);
                        isUpdated = await fileOperation.writeToDatabaseAsync(
                            clientLtpPath,
                            clientUuid,
                            true);
                    }
                }
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function modifies the server-ltp list for the given logical-termination-point uuid.
     * @param {String} logicalTerminationPointUuid : uuid of the logical-termination-point in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @param {list} serverUuidList : list of server uuids that needs to be updated.  
     * @returns {promise} boolean { true | false }
     **/
    static setServerLtpListAsync(logicalTerminationPointUuid, serverUuidList) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            let _serverUuidList = await LogicalTerminationPoint.getServerLtpListAsync(
                logicalTerminationPointUuid);
            try {
                for (let i = 0; i < serverUuidList.length; i++) {
                    let isServerUuidExist = false;
                    let serverUuid = serverUuidList[i];
                    if (_serverUuidList != undefined && _serverUuidList.indexOf(serverUuid) > -1) {
                        isServerUuidExist = true;
                    }
                    if (!isServerUuidExist) {
                        let serverLtpPath = onfPaths.SERVER_LTP.replace(
                            "{uuid}", logicalTerminationPointUuid);
                        isUpdated = await fileOperation.writeToDatabaseAsync(
                            serverLtpPath,
                            serverUuid,
                            true);
                    }
                }
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the list of logical-termination-point uuid for the provided layer-protocol-name.
     * @param {String} layerProtocolName : one of the LayerProtocol.layerProtocolNameEnum
     * @returns {promise} list {[] | uuid}
     **/
    static async getUuidListForTheProtocolAsync(layerProtocolName) {
        return new Promise(async function (resolve, reject) {
            let filteredLogicalTerminationPointUuidList = [];
            try {
                let logicalTerminationPointList = await fileOperation.readFromDatabaseAsync(
                    onfPaths.LOGICAL_TERMINATION_POINT);
                if (logicalTerminationPointList != undefined) {
                    for (let i = 0; i < logicalTerminationPointList.length; i++) {
                        let logicalTerminationPoint = logicalTerminationPointList[i];
                        let layerProtocol = logicalTerminationPoint[
                            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL];
                        if (layerProtocol != undefined) {
                            let _layerProtocolName = layerProtocol[
                                0][onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
                            if (_layerProtocolName != undefined &&
                                _layerProtocolName == layerProtocolName) {
                                let logicalTerminationPointUuid = logicalTerminationPoint[
                                    onfAttributes.GLOBAL_CLASS.UUID]
                                filteredLogicalTerminationPointUuidList.push(
                                    logicalTerminationPointUuid);
                            }
                        }
                    }
                }
                resolve(filteredLogicalTerminationPointUuidList);
            } catch (error) {
                resolve(error);
            }
        });
    }
}
module.exports = LogicalTerminationPoint;