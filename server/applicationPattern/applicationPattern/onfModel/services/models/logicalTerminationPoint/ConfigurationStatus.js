/**
 * This class provides a stub for the LogicalTerminationPointConfigurationStatus.  
 * This class consolidates the logical termination point configuration status for the protocol tcp-client,http-client 
 * and operation-client.
 **/

 'use strict';

 class ConfigurationStatus {
 
     operationClientConfigurationStatusList;
     httpClientConfigurationStatus;
     tcpClientConfigurationStatus;
     
     /**
     * @constructor creates a ConfigurationInput  object for the provided values. 
     * @param {list} operationClientConfigurationStatusList : is a list of 
     * @param {String} httpClientConfigurationStatus : release of the client application
     * @param {String} tcpClientConfigurationStatus : name of the client application
     * @return {Promise} object {ConfigurationInput}
     **/
     constructor(operationClientConfigurationStatusList, httpClientConfigurationStatus,
        tcpClientConfigurationStatus) {
         this.operationClientConfigurationStatusList = operationClientConfigurationStatusList;
         this.httpClientConfigurationStatus = httpClientConfigurationStatus;
         this.tcpClientConfigurationStatus = tcpClientConfigurationStatus;
     }

     validateInput() {

    }
 }
 
 module.exports = ConfigurationStatus;