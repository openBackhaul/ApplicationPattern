/**
 * This class provides a stub for the logical-termination-point configuration input.
 * It provides the structure of the input that needs to be fed to the createOrUpdateApplicationLtpsAsync
 * function which will further configure the tcp,http,operation clients of the logical-termination-point
**/
// @ts-check
'use strict';

// eslint-disable-next-line no-unused-vars
const TcpObject = require("../TcpObject");

class ConfigurationInput {

    httpClientUuid;
    applicationName;
    releaseNumber;
    tcpList;
    operationServerName;
    operationNamesByAttributes;
    operationsMapping;

    /**
     * @constructor creates a ConfigurationInputWithMapping object for the provided values.
     * @param {String} httpClientUuid : http client UUID of the client application
     * @param {String} applicationName : name of the client application
     * @param {String} releaseNumber : release of the client application
     * @param {Array<TcpObject>} tcpList : remote ipv4 address of the client application
     * @param {String} operationServerName : caller operation
     * @param {Map} operationNamesByAttributes : map of the client operation attribute (key) with client operation name (value)
     * @param {Object} operationsMapping : map of hardcoded context values for operations
     **/
    constructor(
        httpClientUuid,
        applicationName,
        releaseNumber,
        tcpList,
        operationServerName,
        operationNamesByAttributes,
        operationsMapping
    ) {
        this.httpClientUuid = httpClientUuid;
        this.applicationName = applicationName;
        this.releaseNumber = releaseNumber;
        this.tcpList = tcpList;
        this.operationServerName = operationServerName;
        this.operationNamesByAttributes = operationNamesByAttributes;
        this.operationsMapping = operationsMapping;
    }
}

module.exports = ConfigurationInput;
