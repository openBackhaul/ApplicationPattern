// @ts-check
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
     * @returns {Promise<Array>} ForwardingConstructList
     **/
    static async getForwardingConstructListAsync() {
        let forwardingConstructList = [];
        let forwardingDomainList = await controlConstruct.getForwardingDomainListAsync();
        for (let forwardingDomain of forwardingDomainList) {
            let fcs = forwardingDomain[onfAttributes.FORWARDING_DOMAIN.FORWARDING_CONSTRUCT];
            forwardingConstructList.push(fcs);
        }
        return forwardingConstructList.flat();
    }

    /**
     * @description This function returns a ForwardingConstruct instance lists that consists of the fc-port/LogicalTerminationPoint 
     * and fcPortDirection.
     * @param {String} ltpUuid uuid of a logical-termination-point instance. It should be a valid string in the
     * pattern '-\d+-\d+-\d+-op-(s|c)-\d{4}$'.
     * @param {Enumerator} fcPortDirection the value can be any one of the ForwardingConstruct.FcPort.portDirectionEnum
     * @returns {Promise<Array>} filtered ForwardingConstructList
     **/
    static async getForwardingConstructListForTheFcPortAsync(ltpUuid, fcPortDirection) {
        let filteredForwardingConstructList = [];
        let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
        for (let forwardingConstruct of forwardingConstructList) {
            let fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
            for (let fcPort of fcPortList) {
                let portDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
                if (fcPortDirection === portDirection) {
                    let _fcPortLogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                    if (_fcPortLogicalTerminationPoint === ltpUuid) {
                        filteredForwardingConstructList.push(forwardingConstruct);
                    }
                }
            }
        }
        return filteredForwardingConstructList;
    }

    /**
     * @description This function returns a ForwardingConstruct instances from the /core-model-1-4:control-construct/forwarding-domain 
     * list that matches the argument forwardingConstructUuid.
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {Promise<Object|undefined>} ForwardingConstruct instance
     **/
    static async getForwardingConstructAsync(forwardingConstructUuid) {
        let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
        return forwardingConstructList.find(fc => fc[onfAttributes.GLOBAL_CLASS.UUID] === forwardingConstructUuid);
    }

    /**
     * @description This function returns a ForwardingConstruct instances from the /core-model-1-4:control-construct/forwarding-domain 
     * list that matches the argument forwardingName
     * @param {String} forwardingName : name/value-name/ForwardingName of the forwarding-construct
     * @returns {Promise<Object|undefined>} ForwardingConstruct instance
     **/
    static async getForwardingConstructForTheForwardingNameAsync(forwardingName) {
        let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
        for (let _forwardingConstruct of forwardingConstructList) {
            let nameList = _forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.NAME];
            for (let name of nameList) {
                let valueName = name[onfAttributes.NAME.VALUE_NAME];
                let value = name[onfAttributes.NAME.VALUE];
                if (valueName === "ForwardingName" && value === forwardingName) {
                    return _forwardingConstruct;
                }
            }
        }
        return undefined;
    }

    /**
     * @description This function returns the uuid of the /core-model-1-4:control-construct/forwarding-domain that 
     * matches the forwardingConstructUuid
     * @param {String} forwardingConstructUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-op-fc-\d{4}$'
     * @returns {Promise<String|undefined>} UUID of forwarding-domain
     **/
    static async getForwardingDomainUuidAsync(forwardingConstructUuid) {
        let forwardingDomainList = await controlConstruct.getForwardingDomainListAsync();
        for (let forwardingDomain of forwardingDomainList) {
            let forwardingConstructList = forwardingDomain[onfAttributes.FORWARDING_DOMAIN.FORWARDING_CONSTRUCT];
            for (let forwardingConstruct of forwardingConstructList) {
                let _forwardingConstructUuid = forwardingConstruct[onfAttributes.GLOBAL_CLASS.UUID];
                if (_forwardingConstructUuid === forwardingConstructUuid) {
                    return forwardingDomain[onfAttributes.GLOBAL_CLASS.UUID];
                }
            }
        }
    }
}

module.exports = ForwardingDomain;
