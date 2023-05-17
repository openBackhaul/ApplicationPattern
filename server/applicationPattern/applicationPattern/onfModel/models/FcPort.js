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
     * @param {object} localId local identifier of the fc-port.
     * @param {object} portDirection port-direction of the fc-port.It can be INPUT,OUTPUT or MANAGEMENT.
     * @param {object} logicalTerminationPoint uuid of the operation-client/server-interface logical-termination-point.
     */
    constructor(localId, portDirection, logicalTerminationPoint) {
        this.localId = localId;
        this.portDirection = portDirection;
        this.logicalTerminationPoint = logicalTerminationPoint;
    }

    /**
     * @description This function returns the local-id of the fc-port consists of the input argument 
     * logical-termination-point of a operation(client/server)Uuid.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLogicalTerminationPoint : new logical-termination-point that needs to be updated.
     * @returns {promise} string {localId}
     **/
    static getLocalIdAsync(forwardingConstructUuid, fcPortLogicalTerminationPoint) {
        return new Promise(async function (resolve, reject) {
            let localId;
            try {
                let forwardingConstructInstance = await forwardingDomain.getForwardingConstructAsync(
                    forwardingConstructUuid);
                let fcPortList = forwardingConstructInstance[
                    onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                for (let i = 0; i < fcPortList.length; i++) {
                    let fcPort = fcPortList[i];
                    let _fcPortLogicalTerminationPoint = fcPort[
                        onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                    if (_fcPortLogicalTerminationPoint == fcPortLogicalTerminationPoint) {
                        localId = fcPort[onfAttributes.LOCAL_CLASS.LOCAL_ID];
                    }
                }
                resolve(localId);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function updates the logical-termination-point attribute of the fc-port.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of the fc-port.
     * @param {String} fcPortLogicalTerminationPoint : new logical-termination-point that needs to be updated.
     * @returns {promise} boolean {true|false}
     **/
    static setLogicalTerminationPointAsync(forwardingConstructUuid, fcPortLocalId, fcPortLogicalTerminationPoint) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
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
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    fcPortLogicalTerminationPointPath,
                    fcPortLogicalTerminationPoint,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the next available localId for the fc-port list in a forwarding-construct instance.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} string {localId }
     **/
    static generateNextLocalIdAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            let nextlocalId = "000";
            try {
                let forwardingConstructInstance = await forwardingDomain.getForwardingConstructAsync(
                    forwardingConstructUuid
                );
                let fcPortList = forwardingConstructInstance[
                    onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                let fcPortLocalIdList = [];
                for (let i = 0; i < fcPortList.length; i++) {
                    let fcPort = fcPortList[i];
                    let localId = fcPort[
                        onfAttributes.LOCAL_CLASS.LOCAL_ID];
                    fcPortLocalIdList.push(localId);
                }
                if (fcPortLocalIdList.length > 0) {
                    fcPortLocalIdList.sort();
                    let lastUuid = fcPortLocalIdList[
                        fcPortLocalIdList.length - 1];
                    nextlocalId = parseInt(lastUuid) + 1;
                }
                resolve(nextlocalId.toString());
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = FcPort;