// @ts-check
/**
 * The ForwardingConstruct class(FC) represents enabled constrained potential for forwarding between two or more FcPorts at a particular 
 * specific layerProtocol.
 * It provides functionality to ,
 *      - read the currently configured attribute values of the /core-model-1-4:control-construct/forwarding-domain/forwarding-construct
 *      - configure the fc-port list
 **/

'use strict';
const ForwardingDomain = require('./ForwardingDomain');
const FcPort = require('./FcPort');
const fileOperation = require('../../databaseDriver/JSONDriver');
const onfFormatter = require('../utility/OnfAttributeFormatter');
const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');

class ForwardingConstruct {

    static forwardingConstructKindEnum = {
        INVARIANT_PROCESS_SNIPPET: "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET",
        SUBSCRIPTION: "core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION",
        PROCESS_SNIPPET: "core-model-1-4:FORWARDING_KIND_TYPE_PROCESS_SNIPPET"
    }

    /**
     * @description This function gets the fc-port instance that matches the localId argument from its corresponding 
     * core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of an existing fc-port
     * @returns {Promise<String|undefined>}
     **/
    static async getFcPortAsync(forwardingConstructUuid, fcPortLocalId) {
        let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
        let fcPortList = forwardingConstructInstance[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        return fcPortList.find(fcPort => fcPort[onfAttributes.LOCAL_CLASS.LOCAL_ID] === fcPortLocalId);
    }

    /**
     * Retrieves forwarding-construct given its UUID and returns list of its OUTPUT ports.
     * @param {String} forwardingConstructUuid
     * @returns {Promise<Array<Object>>} list of output fc-ports
     */
    static async getOutputFcPortsAsync(forwardingConstructUuid) {
        let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
        let fcPortList = forwardingConstructInstance[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        return fcPortList.filter(fcp =>
            fcp[onfAttributes.FC_PORT.PORT_DIRECTION] === FcPort.portDirectionEnum.OUTPUT
        );
    }

    /**
     * @deprecated Either use forwardingDomain.getForwardingConstructAsync directly or use getOutputFcPortsAsync.
     * @description This function returns the forwarding-construct/fc-port list of the forwarding-construct that matches the 
     * forwardingConstructUuid.
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} list {FcPort}
     **/
    static async getFcPortListAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            let fcPortList;
            try {
                let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
                fcPortList = forwardingConstructInstance[
                    onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                resolve(fcPortList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns true if a fc-port is available in the forwarding-construct for the given input argument 
     * fcLogicalTerminationPoint and forwardingConstructUuid.
     * @param {Object} forwardingConstruct
     * @param {String} ltpUuid the value should be a valid string in the pattern '-\d+-\d+-\d+-op-(s|c)-\d{4}$'
     * @returns {Boolean}
     **/
    static isFcPortExists(forwardingConstruct, ltpUuid) {
        let fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        for (let fcPort of fcPortList) {
            let _fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
            if (_fclogicalTerminationPoint === ltpUuid) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description This function adds a fc-port instance to the core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPort : FcPort instance
     * @returns {Promise<Boolean>}
     **/
    static async addFcPortAsync(forwardingConstructUuid, fcPort) {
        let forwardingDomainUuid = await ForwardingDomain.getForwardingDomainUuidAsync(forwardingConstructUuid);
        let fcPortPath = onfPaths.FC_PORT.replace(
            "{fdUuid}", forwardingDomainUuid).replace(
                "{fcUuid}", forwardingConstructUuid);
        onfFormatter.modifyJsonObjectKeysToKebabCase(fcPort);
        return await fileOperation.writeToDatabaseAsync(
            fcPortPath,
            fcPort,
            true);
    }

    /**
     * @description This function deletes the fc-port instance that matches the localId argument from its corresponding 
     * core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of an existing fc-port
     * @returns {Promise<Boolean>}
     **/
    static async deleteFcPortAsync(forwardingConstructUuid, fcPortLocalId) {
        let forwardingDomainUuid = await ForwardingDomain.getForwardingDomainUuidAsync(forwardingConstructUuid);
        let fcPortPath = onfPaths.FC_PORT.replace(
            "{fdUuid}", forwardingDomainUuid).replace(
                "{fcUuid}", forwardingConstructUuid) + "=" + fcPortLocalId;
        return await fileOperation.deletefromDatabaseAsync(fcPortPath);
    }
}

module.exports = ForwardingConstruct;
