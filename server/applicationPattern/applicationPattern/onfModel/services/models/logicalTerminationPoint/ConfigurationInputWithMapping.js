/**
 * This class provides a stub for the logical-termination-point configuration input.
 * It provides the structure of the input that needs to be fed to the createOrUpdateApplicationInformation
 * and findOrCreateApplicationInformation function
 * which will further configure the tcp,http,operation clients of the logical-termination-point
**/

'use strict';

class ConfigurationInputWithMapping {

    applicationName;
    releaseNumber;
    remoteIPv4Address;
    remotePort;
    operationServerName;
    operationNamesByAttributes;
    operationsMapping;

    /**
     * @constructor creates a ConfigurationInputWithMapping object for the provided values.
     * @param {String} applicationName : name of the client application
     * @param {String} releaseNumber : release of the client application
     * @param {String} remoteIPv4Address : remote ipv4 address of the client application
     * @param {String} remotePort : remote port of the client application
     * @param {String} operationServerName : caller operation
     * @param {Map} operationNamesByAttributes : map of the client operation attribute (key) with client operation name (value)
     * @param {Object} operationsMapping : map of hardcoded context values for operations
     * @return {Promise} object {ConfigurationInputWithMapping}
     **/
    constructor(
        applicationName,
        releaseNumber,
        remoteIPv4Address,
        remotePort,
        operationServerName,
        operationNamesByAttributes,
        operationsMapping
    ) {
        this.applicationName = applicationName;
        this.releaseNumber = releaseNumber;
        this.remoteIPv4Address = remoteIPv4Address;
        this.remotePort = remotePort;
        this.operationServerName = operationServerName;
        this.operationNamesByAttributes = operationNamesByAttributes;
        this.operationsMapping = operationsMapping;
    }

    validateInput() {

    }
}

module.exports = ConfigurationInputWithMapping;