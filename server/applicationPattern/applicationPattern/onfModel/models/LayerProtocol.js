/**
 * The projection of an LTP into each technology specific layer is represented by a LayerProtocol (LP) instance. * 
 * This class provides 
 *      - stub to instantiate and generate a JSON object for a LayerProtocol. 
 *      - functionality to read the currently configured attribute values of the /core-model-1-4:control-construct
 * /logical-termination-point/layer-protocol
 **/

'use strict';

const controlConstruct = require('./ControlConstruct');
const onfAttributes = require('../constants/OnfAttributes');

class LayerProtocol {

    localId;
    layerProtocolName;

    static layerProtocolNameEnum = {
        OPERATION_CLIENT: "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        HTTP_CLIENT: "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        TCP_CLIENT: "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        OPERATION_SERVER: "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        HTTP_SERVER: "http-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        TCP_SERVER: "tcp-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER"
    }

    /**
     * @constructor 
     * @param {String} localId local identifier for the layerProtocol.
     * @param {String} layerProtocolName name of the layer protocol(it can be tcp-server,tcp-client,http-server,
     * http-client,operation-server,operation-client).
     **/
    constructor(localId, layerProtocolName) {
        this.localId = localId;
        this.layerProtocolName = layerProtocolName;
    }

    /**
     * @description This function returns the layer-protocol-name for the given logical-termination-point uuid
     * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern 
     * '-\d+-\d+-\d+-(op|http|tcp)-(client|server)-\d+$'
     * @returns {promise} string {undefined | layerProtocolName}
     **/
    static getLayerProtocolName(logicalTerminationPointUuid) {
        return new Promise(async function (resolve, reject) {
            let layerProtocolName;
            try {
                let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(logicalTerminationPointUuid);
                if (logicalTerminationPoint != undefined) {
                    let layerProtocol = logicalTerminationPoint[
                        onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                    layerProtocolName = layerProtocol[
                        onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
                }
                resolve(layerProtocolName);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = LayerProtocol;