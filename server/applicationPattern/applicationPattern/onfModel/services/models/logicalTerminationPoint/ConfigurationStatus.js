/**
 * This class provides a stub for the LogicalTerminationPointConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol tcp-client,http-client 
 * and operation-client.
 **/
// @ts-check
'use strict';

class ConfigurationStatus {

    operationClientConfigurationStatusList;
    httpClientConfigurationStatus;
    tcpClientConfigurationStatusList;

    /**
    * @constructor creates a ConfigurationInput  object for the provided values. 
    * @param {Array} operationClientConfigurationStatusList
    * @param {Object} httpClientConfigurationStatus : release of the client application
    * @param {Array} tcpClientConfigurationStatusList : name of the client application
    **/
    constructor(operationClientConfigurationStatusList, httpClientConfigurationStatus,
        tcpClientConfigurationStatusList) {
        this.operationClientConfigurationStatusList = operationClientConfigurationStatusList;
        this.httpClientConfigurationStatus = httpClientConfigurationStatus;
        this.tcpClientConfigurationStatusList = tcpClientConfigurationStatusList;
    }
}

module.exports = ConfigurationStatus;
