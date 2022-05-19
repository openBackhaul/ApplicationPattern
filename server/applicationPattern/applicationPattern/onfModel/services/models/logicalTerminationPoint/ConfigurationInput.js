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
    operationNameList;

    /**
     * @constructor creates a ConfigurationInput  object for the provided values. 
     * @param {String} applicationName : name of the client application
     * @param {String} releaseNumber : release of the client application
     * @param {String} remoteIPv4Address : name of the client application
     * @param {String} remotePort : release of the client application
     * @param {String} operationNameList : release of the client application
     * @return {Promise} object {ConfigurationInput}
     **/
    constructor(applicationName, releaseNumber, remoteIPv4Address, remotePort, operationNameList) {
        this.applicationName = applicationName;
        this.releaseNumber = releaseNumber;
        this.remoteIPv4Address = remoteIPv4Address;
        this.remotePort = remotePort;
        this.operationNameList = operationNameList;
    }

    validateInput() {

    }
}

module.exports = ConfigurationInput;