// @ts-check
/**
 * The FcPort class models the access to the Forwarding-construct function.
 * It provides functionality to ,
 *      - read the currently configured attribute values of the /core-model-1-4:control-construct
 *         /forwarding-domain/forwarding-construct/fc-port
 *      - configure the logical-termination-point of the fc-port
 **/

'use strict';

const forwardingDomain = require('./ForwardingDomain');
const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');
const fileOperation = require('../../databaseDriver/JSONDriver');

class FcPort {

    localId;
    portDirection;
    logicalTerminationPoint;

    static portDirectionEnum = {
        MANAGEMENT: "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
        INPUT: "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
        OUTPUT: "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT"
    }
    /**
     * constructor 
     * @param {String} localId local identifier of the fc-port.
     * @param {String} portDirection port-direction of the fc-port.It can be INPUT,OUTPUT or MANAGEMENT.
     * @param {String} logicalTerminationPoint uuid of the operation-client/server-interface logical-termination-point.
     */
    constructor(localId, portDirection, logicalTerminationPoint) {
        this.localId = localId;
        this.portDirection = portDirection;
        this.logicalTerminationPoint = logicalTerminationPoint;
    }

     /**
     * @description This function returns local-id of a fc-port, if provided logical-termination-point-uuid
     * is available in the forwarding-construct.
     * @param {Object} forwardingConstruct
     * @param {String} ltpUuid logical-termination-point-uuid
     * @returns {String|undefined} undefined | localId
     **/
     static getLocalId(forwardingConstruct, ltpUuid) {
        let fcPortList = forwardingConstruct[
            onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        for (let i = 0; i < fcPortList.length; i++) {
            let fcPort = fcPortList[i];
            let _fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
            if (_fclogicalTerminationPoint == ltpUuid) {
                return fcPort[onfAttributes.LOCAL_CLASS.LOCAL_ID];
            }
        }
        return undefined;
    }

    /**
     * @description This function updates the logical-termination-point attribute of the fc-port.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of the fc-port
     * @param {String} fcPortLogicalTerminationPoint : new logical-termination-point that needs to be updated
     * @returns {Promise<Boolean>}
     **/
    static async setLogicalTerminationPointAsync(forwardingConstructUuid, fcPortLocalId, fcPortLogicalTerminationPoint) {
        let forwardingDomainUuid = await forwardingDomain.getForwardingDomainUuidAsync(
            forwardingConstructUuid
        );
        let fcPortLogicalTerminationPointPath = onfPaths.FC_PORT_LOGICAL_TERMINATION_POINT.
        replace(
            "{fdUuid}",
            forwardingDomainUuid).
        replace(
            "{fcUuid}",
            forwardingConstructUuid).
        replace(
            "{fcPortLocalId}",
            fcPortLocalId
        );
        return await fileOperation.writeToDatabaseAsync(
            fcPortLogicalTerminationPointPath,
            fcPortLogicalTerminationPoint,
            false);
    }

    /**
     * @description Checks if given operation has given port-direction.
     * @param {Object} forwardingConstruct
     * @param {String} operationUuid
     * @param {String} portDirection
     * @returns {Boolean} true if the operations port-direction matched the argument portDirection
     **/
    static isOperationOfFcPortType(forwardingConstruct, operationUuid, portDirection) {
        let fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        for (let fcPort of fcPortList) {
            let fcPortDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
            let fcLogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
            if (fcLogicalTerminationPoint === operationUuid
                && fcPortDirection === portDirection) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description This function returns the next available OUTPUT localId for the fc-port list in a forwarding-construct instance.
     * @param {Object} forwardingConstruct
     * @returns {String} localId
     **/
    static generateNextLocalId(forwardingConstruct) {
        let nextlocalId = 200;
        let fcPortList = forwardingConstruct[
            onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        let fcPortLocalIdList = fcPortList.flatMap( fcPort => fcPort[
            onfAttributes.LOCAL_CLASS.LOCAL_ID]);
        if (fcPortLocalIdList.length > 0) {
            fcPortLocalIdList.sort();
            let lastUuid = fcPortLocalIdList[
                fcPortLocalIdList.length - 1];
            if (lastUuid >= nextlocalId) {
                nextlocalId = parseInt(lastUuid) + 1;
            }
        }
        return nextlocalId.toString();
    }
}

module.exports = FcPort;
