/**
 * This class provides a stub for the forwarding construct configuration input.
 * The provides the structure of the input that needs to be fed to the configureForwardingConstructAsync function 
 * which will further configure the forwarding-construct. 
 **/
// @ts-check
'use strict';

class ConfigurationInput {

    forwardingName;
    operationClientUuid;

    /**
     * @constructor creates a ConfigurationInput  object for the provided values. 
     * @param {String} forwardingName : name of the forwarding-construct
     * @param {String} operationClientUuid : operation client uuid of that needs to be configured in the fc-port
     **/
    constructor(forwardingName, operationClientUuid) {
        this.forwardingName = forwardingName;
        this.operationClientUuid = operationClientUuid;
    }
}

module.exports = ConfigurationInput;
