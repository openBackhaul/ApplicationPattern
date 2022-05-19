/**
 * The ForwardingConstruct class(FC) represents enabled constrained potential for forwarding between two or more FcPorts at a particular 
 * specific layerProtocol.
 * It provides functionality to ,
 *      - read the currently configured attribute values of the /core-model-1-4:control-construct/forwarding-domain/forwarding-construct
 *      - configure the fc-port list
 **/

'use strict';
const forwardingDomain = require('./ForwardingDomain');
const fileOperation = require('../../databaseDriver/JSONDriver');
const onfFormatter = require('../utility/OnfAttributeFormatter');
const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');

class ForwardingConstruct {

    static name = class name {
        valueName;
        value;
        static forwardingConstructKindEnum = {
            INVARIANT_PROCESS_SNIPPET: "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET",
            SUBSCRIPTION: "core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION",
            PROCESS_SNIPPET: "core-model-1-4:FORWARDING_KIND_TYPE_PROCESS_SNIPPET"
        }
        /**
         * constructor 
         * @param {string} valueName input for the "value-name" entry.
         * @param {string} value input for the "value" entry.
         */
        constructor(valueName, value) {
            this.valueName = valueName;
            this.value = value;
        }
    }

    /**
     * @description This function returns the forwarding-construct/name/value-name=ForwardingName of the forwarding-construct 
     * that matches the forwardingConstructUuid.
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} string {ForwardingName}
     **/
    static async getForwardingNameAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let forwardingName;
                let forwardingConstruct = await forwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
                let nameList = forwardingConstruct[
                    onfAttributes.FORWARDING_CONSTRUCT.NAME];
                for (let jk = 0; k < nameList.length; j++) {
                    let valueName = nameList[onfAttributes.NAME.VALUE_NAME]
                    let value = nameList[onfAttributes.NAME.VALUE]
                    if (valueName == "ForwardingName") {
                        forwardingName = value;
                    }
                }
                resolve(forwardingName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the forwarding-construct/name/value-name=ForwardingKind of the forwarding-construct that 
     * matches the forwardingConstructUuid.
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} string {ForwardingKind}
     **/
    static async getForwardingKindAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let forwardingKind;
                let forwardingConstruct = await forwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
                let nameList = forwardingConstruct[
                    onfAttributes.FORWARDING_CONSTRUCT.NAME];
                for (let jk = 0; k < nameList.length; j++) {
                    let valueName = nameList[onfAttributes.NAME.VALUE_NAME]
                    let value = nameList[onfAttributes.NAME.VALUE]
                    if (valueName == "ForwardingKind") {
                        forwardingName = value;
                    }
                }
                resolve(forwardingKind);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function gets the fc-port instance that matches the localId argument from its corresponding 
     * core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of an existing fc-port
     * @returns {promise} boolean {true|false}
     **/
    static async getFcPortAsync(forwardingConstructUuid, fcPortLocalId) {
        return new Promise(async function (resolve, reject) {
            let fcPort;
            try {
                let fcPortList = await ForwardingConstruct.getFcPortListAsync(forwardingConstructUuid);
                for (let i = 0; i < fcPortList.length; i++) {
                    let _fcPort = fcPortList[i];
                    let _fcPortLocalId = _fcPort[onfAttributes.LOCAL_CLASS.LOCAL_ID];
                    if(_fcPortLocalId == fcPortLocalId){
                        fcPort = _fcPort;
                    }
                }
                resolve(fcPort);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * @description This function returns the forwarding-construct/fc-port list of the forwarding-construct that matches the 
     * forwardingConstructUuid.
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} list {FcPort}
     **/
    static async getFcPortListAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            let fcPortList;
            try {
                let forwardingConstructInstance = await forwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
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
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcLogicalTerminationPoint : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-(s|c)-\d{4}$'
     * @returns {promise} boolean {true | false} 
     **/
    static async isFcPortExistsAsync(forwardingConstructUuid, fcLogicalTerminationPoint) {
        return new Promise(async function (resolve, reject) {
            let isExists = false;
            try {
                let forwardingConstruct = await forwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
                let fcPortList = forwardingConstruct[
                    onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                for (let i = 0; i < fcPortList.length; i++) {
                    let fcPort = fcPortList[i];
                    let _fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                    if (_fclogicalTerminationPoint == fcLogicalTerminationPoint) {
                        isExists = true;
                    }
                }
                resolve(isExists);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns true if a fc-port is available in the forwarding-construct for the given input argument 
     * fcLogicalTerminationPoint and forwardingConstructUuid.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcLogicalTerminationPoint : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-(s|c)-\d{4}$'
     * @returns {promise} string {undefined | localId} 
     **/
    static async getFcPortLocalIdAsync(forwardingConstructUuid, fcLogicalTerminationPoint) {
        return new Promise(async function (resolve, reject) {
            let fcPortLocalId = false;
            try {
                let forwardingConstruct = await forwardingDomain.getForwardingConstructAsync(forwardingConstructUuid);
                let fcPortList = forwardingConstruct[
                    onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                for (let i = 0; i < fcPortList.length; i++) {
                    let fcPort = fcPortList[i];
                    let _fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                    if (_fclogicalTerminationPoint == fcLogicalTerminationPoint) {
                        fcPortLocalId = fcPort[onfAttributes.LOCAL_CLASS.LOCAL_ID];
                    }
                }
                resolve(fcPortLocalId);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function adds a fc-port instance to the core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPort : FcPort instance
     * @returns {promise} boolean {true | false} 
     **/
    static async addFcPortAsync(forwardingConstructUuid, fcPort) {
        return new Promise(async function (resolve, reject) {
            let isCreated = false;
            try {
                let forwardingDomainUuid = await forwardingDomain.getForwardingDomainUuidAsync(forwardingConstructUuid);
                let fcPortPath = onfPaths.FC_PORT.replace(
                    "{fdUuid}", forwardingDomainUuid).replace(
                    "{fcUuid}", forwardingConstructUuid);
                onfFormatter.modifyJsonObjectKeysToKebabCase(fcPort);
                isCreated = await fileOperation.writeToDatabaseAsync(
                    fcPortPath,
                    fcPort,
                    true);
                resolve(isCreated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function deletes the fc-port instance that matches the localId argument from its corresponding 
     * core-model-1-4:control-construct/forwarding-domain/forwarding-construct
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @param {String} fcPortLocalId : local-id of an existing fc-port
     * @returns {promise} boolean {true|false}
     **/
    static async deleteFcPortAsync(forwardingConstructUuid, fcPortLocalId) {
        return new Promise(async function (resolve, reject) {
            let isDeleted = false;
            try {
                let forwardingDomainUuid = await forwardingDomain.getForwardingDomainUuidAsync(forwardingConstructUuid);
                let fcPortPath = onfPaths.FC_PORT.replace(
                    "{fdUuid}", forwardingDomainUuid).replace(
                    "{fcUuid}", forwardingConstructUuid) + "=" + fcPortLocalId;
                isDeleted = await fileOperation.deletefromDatabaseAsync(
                    fcPortPath,
                    fcPortLocalId,
                    true);
                resolve(isDeleted);
            } catch (error) {
                reject(false);
            }
        });
    }

}

module.exports = ForwardingConstruct;