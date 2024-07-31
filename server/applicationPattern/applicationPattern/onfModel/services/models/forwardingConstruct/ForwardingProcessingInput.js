/**
 * This class provides a stub for the ForwardingConstructConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol 
 * tcp-client,http-client and operation-client.
 * 
 **/
// @ts-check
'use strict';

class ForwardingProcessingInput {

    forwardingName;
    attributeList;

    /**
     * constructor 
     * @param {String} forwardingName : name of the forwarding construct.
     * @param {Object} attributeList : list of attributes in key value pairs.
     */
    constructor(forwardingName, attributeList) {
        this.forwardingName = forwardingName;
        this.attributeList = attributeList;
    }
}

module.exports = ForwardingProcessingInput;
