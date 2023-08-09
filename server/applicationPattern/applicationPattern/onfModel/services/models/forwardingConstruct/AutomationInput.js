/**
 * This class provides a stub for the ForwardingConstructConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol 
 * tcp-client,http-client and operation-client.
 * 
 **/
// @ts-check
'use strict';

class AutomationInput {

    forwardingName;
    attributeList;
    context;

    /**
     * constructor 
     * @param {String} forwardingName : name of the forwarding construct.
     * @param {Object} attributeList : list of attributes in key value pairs.
     * @param {String} context : it should be a string with the information of application name + release number
     */
    constructor(forwardingName, attributeList, context) {
        this.forwardingName = forwardingName;
        this.attributeList = attributeList;
        this.context = context;
    }
}

module.exports = AutomationInput;
