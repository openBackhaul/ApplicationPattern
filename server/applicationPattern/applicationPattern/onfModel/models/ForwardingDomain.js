/**
 * The ForwardingDomain (FD) class models the component that represents a forwarding capability that provides the opportunity 
 * to enable forwarding between different microservices. 
 * It provides functionality to ,
 *    - read the currently configured attribute values of the /core-model-1-4:control-construct/forwarding-domain
 *    - configure the forwarding-construct list
 **/

'use strict';
const controlConstruct = require('./ControlConstruct');
const onfAttributes = require('../constants/OnfAttributes');

class ForwardingDomain {

    /**
     * @description This function returns a list that consists of the all the ForwardingConstruct instances 
     * in the /core-model-1-4:control-construct/forwarding-domain list
     * @returns {promise} list {[] | ForwardingConstructList}
     **/
    static async getForwardingConstructListAsync() {
        return new Promise(async function (resolve, reject) {
            let forwardingConstructList = [];
            try {
                let ForwardingDomainList = await controlConstruct.getForwardingDomainListAsync();
                for (let i = 0; i < ForwardingDomainList.length; i++) {
                    let forwardingDomain = ForwardingDomainList[i];
                    let _forwardingConstructList = forwardingDomain[
                        onfAttributes.FORWARDING_DOMAIN.FORWARDING_CONSTRUCT];
                    for (let j = 0; j < _forwardingConstructList.length; j++) {
                        let forwardingConstruct = _forwardingConstructList[j];
                        forwardingConstructList.push(forwardingConstruct);
                    }
                }
                resolve(forwardingConstructList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns a ForwardingConstruct instance lists that consists of the fc-port/LogicalTerminationPoint 
     * and fcPortDirection.
     * @param fcPortLogicalTerminationPoint : uuid of a logical-termination-point instance. It should be a valid string in the 
     * pattern '-\d+-\d+-\d+-op-(s|c)-\d{4}$'.
     * @param fcPortDirection : the vaue can be any one of the ForwardingConstruct.FcPort.portDirectionEnum
     * @returns {promise} list {undefined | filtered ForwardingConstructList}
     **/
    static async getForwardingConstructListForTheFcPortAsync(fcPortLogicalTerminationPoint, fcPortDirection) {
        return new Promise(async function (resolve, reject) {
            let filteredForwardingConstructList = [];
            try {
                let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
                for (let i = 0; i < forwardingConstructList.length; i++) {
                    let forwardingConstruct = forwardingConstructList[i];
                    let fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
                    for (let j = 0; j < fcPortList.length; j++) {
                        let fcPort = fcPortList[j];
                        let portDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
                        if (fcPortDirection == portDirection) {
                            let _fcPortLogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                            if (_fcPortLogicalTerminationPoint == fcPortLogicalTerminationPoint) {
                                filteredForwardingConstructList.push(forwardingConstruct);
                            }
                        }
                    }
                }
                resolve(filteredForwardingConstructList);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns a ForwardingConstruct instances from the /core-model-1-4:control-construct/forwarding-domain 
     * list that matches the argument forwardingConstructUuid.
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} object {undefined | ForwardingConstruct instance}
     **/
    static async getForwardingConstructAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let forwardingConstruct;
                let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
                for (let i = 0; i < forwardingConstructList.length; i++) {
                    let _forwardingConstruct = forwardingConstructList[i];
                    let _forwardingConstructUuid = _forwardingConstruct[onfAttributes.GLOBAL_CLASS.UUID];
                    if (_forwardingConstructUuid == forwardingConstructUuid) {
                        forwardingConstruct = _forwardingConstruct;
                    }
                }
                resolve(forwardingConstruct);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns a ForwardingConstruct instances from the /core-model-1-4:control-construct/forwarding-domain 
     * list that matches the argument forwardingName
     * @param {string} forwardingName : name/value-name/ForwardingName of the forwarding-construct
     * @returns {promise} object {undefined | ForwardingConstruct instance}
     **/
    static async getForwardingConstructForTheForwardingNameAsync(forwardingName) {
        return new Promise(async function (resolve, reject) {
            try {
                let forwardingConstruct;
                let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
                for (let i = 0; i < forwardingConstructList.length; i++) {
                    let _forwardingConstruct = forwardingConstructList[i];
                    let nameList = _forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.NAME];
                    for (let k = 0; k < nameList.length; k++) {
                        let valueName = nameList[k][onfAttributes.NAME.VALUE_NAME];
                        let value = nameList[k][onfAttributes.NAME.VALUE];
                        if (valueName == "ForwardingName" && value == forwardingName) {
                            forwardingConstruct = _forwardingConstruct;
                        }
                    }
                }
                resolve(forwardingConstruct);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the uuid of the /core-model-1-4:control-construct/forwarding-domain that 
     * matches the forwardingConstructUuid
     * @param {string} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {promise} string {undefined | uuid of forwarding-domain}
     **/
    static async getForwardingDomainUuidAsync(forwardingConstructUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let forwardingDomainUuid;
                let ForwardingDomainList = await controlConstruct.getForwardingDomainListAsync();
                for (let i = 0; i < ForwardingDomainList.length; i++) {
                    let forwardingDomain = ForwardingDomainList[i];
                    let forwardingConstructList = forwardingDomain[onfAttributes.FORWARDING_DOMAIN.FORWARDING_CONSTRUCT];
                    for (let j = 0; j < forwardingConstructList.length; j++) {
                        let forwardingConstruct = forwardingConstructList[j];
                        let _forwardingConstructUuid = forwardingConstruct[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_forwardingConstructUuid == forwardingConstructUuid) {
                            forwardingDomainUuid = forwardingDomain[onfAttributes.GLOBAL_CLASS.UUID];
                        }
                    }
                }
                resolve(forwardingDomainUuid);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = ForwardingDomain;