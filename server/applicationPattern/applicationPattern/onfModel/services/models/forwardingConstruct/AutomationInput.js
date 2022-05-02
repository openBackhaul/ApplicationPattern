/**
 * This class provides a stub for the ForwardingConstructConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol 
 * tcp-client,http-client and operation-client.
 * 
 **/

 'use strict';

 class AutomationInput {
 
    forwardingName;
     attributeList;
     context;
 
     /**
      * constructor 
      * @param {string} forwardingConstructName : name of the forwarding construct.
      * @param {string} attributeList : list of attributes in key value pairs.
      * @param {string} context : it should be a string with the information of application name + release number
      */
     constructor(forwardingName, attributeList, context) {
         this.forwardingName = forwardingName;
         this.attributeList = attributeList;
         this.context = context;
     }
 
     getForwardingName() {
         return this.forwardingName;
     }
 
     getAttributeList() {
         return this.attributeList;
     }
 
     getContext() {
         return this.context;
     }
 }
 
 module.exports = AutomationInput;