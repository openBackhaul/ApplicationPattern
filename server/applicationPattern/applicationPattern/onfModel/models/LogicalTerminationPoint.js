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
     * @param {Array} clientLtp : client LTPs ((operation-client/server) associated with http-client/server, ((http-client/server) associated with tcp-client/server)).
     * @param {Array} serverLtp : server LTPs ((tcp-client/server) associated with http-client/server, ((http-client/server) associated with operation-client/server)).
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
     * @param {String} ltpUuid : the value should be a valid string in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @returns {Promise<Array>}
     **/
    static async getServerLtpListAsync(ltpUuid) {
        let ltp = await controlConstruct.getLogicalTerminationPointAsync(ltpUuid);
        if (ltp != undefined) {
            return ltp[onfAttributes.LOGICAL_TERMINATION_POINT.SERVER_LTP];
        }
        return [];
    }

    /**
     * @description This function returns the client-ltp list for the given logical-termination-point uuid
     * @param {String} ltpUuid : the value should be a valid string in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @returns {Promise<Array>}
     **/
    static async getClientLtpListAsync(ltpUuid) {
        let ltp = await controlConstruct.getLogicalTerminationPointAsync(ltpUuid);
        if (ltp != undefined) {
            return ltp[onfAttributes.LOGICAL_TERMINATION_POINT.CLIENT_LTP];
        }
        return [];
    }

    /**
     * @description This function modifies the client-ltp list for the given logical-termination-point uuid.
     * @param {String} ltpUuid of the logical-termination-point in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @param {Array} clientUuidList : list of client uuids that needs to be updated.
     * @returns {Promise<Boolean>}
     **/
    static async setClientLtpListAsync(ltpUuid, clientUuidList) {
        let isUpdated = false;
        let clientLtpPath = onfPaths.CLIENT_LTP.replace("{uuid}", ltpUuid);
        await fileOperation.deletefromDatabaseAsync(clientLtpPath);
        for (let clientUuid of clientUuidList) {
            isUpdated = await fileOperation.writeToDatabaseAsync(
                clientLtpPath,
                clientUuid,
                true);
        }
        return isUpdated;
    }

    /**
     * @description This function modifies the server-ltp list for the given logical-termination-point uuid.
     * @param {String} ltpUuid : uuid of the logical-termination-point in the pattern
     * '-\d+-\d+-\d+-(http|tcp|op)-(server|client)-\d+$'
     * @param {Array} serverUuidList : list of server uuids that needs to be updated.  
     * @returns {Promise<Boolean>}
     **/
    static async setServerLtpListAsync(ltpUuid, serverUuidList) {
        let isUpdated = false;
        let serverLtpPath = onfPaths.SERVER_LTP.replace("{uuid}", ltpUuid);
        await fileOperation.deletefromDatabaseAsync(serverLtpPath);
        for (let serverUuid of serverUuidList) {
            isUpdated = await fileOperation.writeToDatabaseAsync(
                serverLtpPath,
                serverUuid,
                true);
        }
        return isUpdated;
    }

    /**
     * @deprecated use ControlConstruct.getLogicalTerminationPointListAsync(layerProtocolName)
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
                reject(error);
            }
        });
    }
}
module.exports = LogicalTerminationPoint;
