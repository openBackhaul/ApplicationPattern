/**
 * This class provides a stub for the logical-termination-point configuration input.
 * The provides the structure of the input that needs to be fed to the createOrUpdateApplicationInformation 
 * and findOrCreateApplicationInformation function 
 * which will further configure the tcp,http,operation clients of the logical-temrination-point
 **/

'use strict';

class ConfigurationInput {

    applicationName;
    releaseNumber;
    remoteIPv4Address;
    remotePort;
    operationServerName;
    operationList;
    operationsMapping;

    /**
     * @constructor creates a ConfigurationInput  object for the provided values. 
     * @param {String} applicationName : name of the client application
     * @param {String} releaseNumber : release of the client application
     * @param {String} remoteIPv4Address : name of the client application
     * @param {String} remotePort : release of the client application
     * @param {String} operationServerName : caller operation
     * @param {Map} operationList : map of the client operation attributes (key) with client operation names (value)
     * @param {Object} operationsMapping : map of hardcoded context values for operations
     * @return {Promise} object {ConfigurationInput}
     **/
    constructor(
        applicationName,
        releaseNumber,
        remoteIPv4Address,
        remotePort,
        operationServerName,
        operationList,
        operationsMapping
    ) {
        this.applicationName = applicationName;
        this.releaseNumber = releaseNumber;
        this.remoteIPv4Address = remoteIPv4Address;
        this.remotePort = remotePort;
        this.operationServerName = operationServerName;
        this.operationList = operationList;
        this.operationsMapping = operationsMapping;
    }

    validateInput() {

    }
}

module.exports = ConfigurationInput;