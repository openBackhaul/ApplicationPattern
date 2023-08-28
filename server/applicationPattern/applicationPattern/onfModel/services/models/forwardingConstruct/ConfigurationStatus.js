/**
 * @file This class provides a stub for the ForwardingConstructConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol tcp-client,http-client and operation-client.
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       23.09.2021
 * @version     1.0
 **/
// @ts-check
'use strict';
class ForwardingConstructConfigurationStatus {

    forwardingConstructConfigurationStatusList;
    fcPortConfigurationStatusList;

    /**
     * @param {Array} forwardingConstructConfigurationStatusList
     * @param {Array} fcPortConfigurationStatusList
     */
    constructor(forwardingConstructConfigurationStatusList, fcPortConfigurationStatusList) {
        this.forwardingConstructConfigurationStatusList = forwardingConstructConfigurationStatusList;
        this.fcPortConfigurationStatusList = fcPortConfigurationStatusList;
    }
}

module.exports = ForwardingConstructConfigurationStatus;
