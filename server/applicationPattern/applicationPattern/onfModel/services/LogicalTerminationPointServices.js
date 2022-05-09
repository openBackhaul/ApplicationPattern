/**
 * This module provides functionalities to
 *      - manipulate the /core-model-1-4:control-construct/logical-termination-point
 *      - create tcp, http, operation client instance groups for new applications
 *      - update or configure parameters of the tcp, http, operation client instance groups for an existing applications 
 *      - delete the tcp, http, operation client instance groups of an unwanted applications 
 **/

'use strict';

const controlConstruct = require('../models/ControlConstruct');
const logicalTerminationPoint = require('../models/LogicalTerminationPoint');
const tcpClientInterface = require('../models/layerProtocols/TcpClientInterface');
const httpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const operationClientInterface = require('../models/layerProtocols/OperationClientInterface');
const LogicalTerminationPointConfigurationStatus = require('./models/logicalTerminationPoint/ConfigurationStatus');
const ConfigurationStatus = require('./models/ConfigurationStatus');

/**
 * @description This function find a application in the same or different release and updates the http,
 * operation and tcp client if require.
 * @param {String} logicalTerminationPointConfigurationInput : is an instance of 
 * logicalTerminationPoint/ConfigurationInput class
 * @return {Promise} object {logicalTerminationPoint/ConfigurationStatus}
 **/
exports.createOrUpdateApplicationInformationAsync = function (logicalTerminationPointConfigurationInput) {
    return new Promise(async function (resolve, reject) {

        let logicalTerminationPointConfigurationStatus;

        try {

            let applicationName = logicalTerminationPointConfigurationInput.applicationName;
            let releaseNumber = logicalTerminationPointConfigurationInput.releaseNumber;
            let remoteIPv4Address = logicalTerminationPointConfigurationInput.remoteIPv4Address;
            let remotePort = logicalTerminationPointConfigurationInput.remotePort;
            let operationNameList = logicalTerminationPointConfigurationInput.operationNameList;

            let isApplicationExists = await httpClientInterface.isApplicationExists(
                applicationName
            );

            if (!isApplicationExists) {
                logicalTerminationPointConfigurationStatus = await createLogicalTerminationPointInstanceGroupAsync(
                    applicationName,
                    releaseNumber,
                    remoteIPv4Address,
                    remotePort,
                    operationNameList
                );
            } else {
                logicalTerminationPointConfigurationStatus = await updateLogicalTerminationPointInstanceGroupAsync(
                    applicationName,
                    releaseNumber,
                    remoteIPv4Address,
                    remotePort,
                    operationNameList
                );
            }

            resolve(logicalTerminationPointConfigurationStatus)

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function find a application in the same or different release and updates the http,
 * operation and tcp client if require.
 * @param {object} logicalTerminationPointConfigurationInput : is an instance of 
 * logicalTerminationPoint/ConfigurationInput class
 * @return {Promise} object {LogicalTerminationPointConfigurationStatus}
 **/
exports.findOrCreateApplicationInformationAsync = function (logicalTerminationPointConfigurationInput) {
    return new Promise(async function (resolve, reject) {

        let logicalTerminationPointConfigurationStatus;

        try {

            let applicationName = logicalTerminationPointConfigurationInput.applicationName;
            let releaseNumber = logicalTerminationPointConfigurationInput.releaseNumber;
            let remoteIPv4Address = logicalTerminationPointConfigurationInput.remoteIPv4Address;
            let remotePort = logicalTerminationPointConfigurationInput.remotePort;
            let operationNameList = logicalTerminationPointConfigurationInput.operationNameList;

            let isApplicationExists = await httpClientInterface.isApplicationExists(
                applicationName,
                releaseNumber
            );

            if (!isApplicationExists) {
                logicalTerminationPointConfigurationStatus = await createLogicalTerminationPointInstanceGroupAsync(
                    applicationName,
                    releaseNumber,
                    remoteIPv4Address,
                    remotePort,
                    operationNameList
                );
            } else {
                logicalTerminationPointConfigurationStatus = await updateLogicalTerminationPointInstanceGroupAsync(
                    applicationName,
                    releaseNumber,
                    remoteIPv4Address,
                    remotePort,
                    operationNameList
                );
            }

            resolve(logicalTerminationPointConfigurationStatus)

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function deletes the tcp,http,operation client for the provided application and release number.
 * @param {String} applicationName name of the client application<br>
 * @param {String} releaseNumber release of the client application<br>
 * @returns {Promise} OperationClientLists associated to the application
 **/
exports.deleteApplicationInformationAsync = function (applicationName, releaseNumber) {
    return new Promise(async function (resolve, reject) {

        let logicalTerminationPointConfigurationStatus;
        let httpClientConfigurationStatus;
        let tcpClientConfigurationStatus;
        let operationClientConfigurationStatusList = [];
        try {
            let httpClientUuid;
            let tcpClientUuid;

            httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(
                applicationName,
                releaseNumber
            );
            if (httpClientUuid !== undefined) {
                let serverLtpList = await logicalTerminationPoint.getServerLtpListAsync(
                    httpClientUuid);
                if (serverLtpList != undefined && serverLtpList.length > 0) {
                    tcpClientUuid = serverLtpList[0];
                    if (tcpClientUuid) {
                        let isDeleted = await controlConstruct.deleteLogicalTerminationPointAsync(
                            tcpClientUuid);
                        tcpClientConfigurationStatus = new ConfigurationStatus(
                            tcpClientUuid,
                            '',
                            isDeleted);
                    }
                }
                let clientLtpList = await logicalTerminationPoint.getClientLtpListAsync(
                    httpClientUuid);
                if (clientLtpList != undefined && clientLtpList.length > 0) {
                    for (let i = 0; i < clientLtpList.length; i++) {
                        let operationClientuuid = clientLtpList[i];
                        if (operationClientuuid) {
                            let isDeleted = await controlConstruct.deleteLogicalTerminationPointAsync(
                                operationClientuuid);
                            let operationClientConfigurationStatus = new ConfigurationStatus(
                                operationClientuuid,
                                '',
                                isDeleted);
                            operationClientConfigurationStatusList.push(
                                operationClientConfigurationStatus);
                        }
                    }
                }
                let isDeleted = await controlConstruct.deleteLogicalTerminationPointAsync(
                    httpClientUuid);
                httpClientConfigurationStatus = new ConfigurationStatus(
                    httpClientUuid,
                    '',
                    isDeleted);
            }
            logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
                operationClientConfigurationStatusList,
                httpClientConfigurationStatus,
                tcpClientConfigurationStatus
            );
            resolve(logicalTerminationPointConfigurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function creates logical-termination-point for the provided values. 
 * @param {String} applicationName : name of the client application
 * @param {String} releaseNumber : release of the client application
 * @param {String} remoteIPv4Address : name of the client application
 * @param {String} remotePort : release of the client application
 * @param {String} operationNameList : release of the client application
 * @return {Promise} object {LogicalTerminationPointConfigurationStatus}
 **/
function createLogicalTerminationPointInstanceGroupAsync(applicationName, releaseNumber, remoteIPv4Address,
    remotePort, operationNameList) {
    return new Promise(async function (resolve, reject) {

        let logicalTerminationPointConfigurationStatus;
        let httpClientConfigurationStatus;
        let tcpClientConfigurationStatus;
        let operationClientConfigurationStatusList = [];

        try {

            httpClientConfigurationStatus = await createHttpClientInterface(
                applicationName,
                releaseNumber
            );
            if (httpClientConfigurationStatus.updated) {
                tcpClientConfigurationStatus = await createOrUpdateTcpClientInterface(
                    httpClientConfigurationStatus.uuid,
                    remoteIPv4Address,
                    remotePort
                );
                operationClientConfigurationStatusList = await createOrUpdateOperationClientInterface(
                    httpClientConfigurationStatus.uuid,
                    operationNameList
                );
            }
            logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
                operationClientConfigurationStatusList,
                httpClientConfigurationStatus,
                tcpClientConfigurationStatus
            );

            resolve(logicalTerminationPointConfigurationStatus);

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function configures the existing logical-termination-point to the latest values. 
 * Also incase if the tcp,operation client are not available it will be created.
 * @param {String} applicationName : name of the client application
 * @param {String} releaseNumber : release of the client application
 * @param {String} remoteIPv4Address : name of the client application
 * @param {String} remotePort : release of the client application
 * @param {String} operationNameList : release of the client application
 * @return {Promise} object {LogicalTerminationPointConfigurationStatus}
 **/
function updateLogicalTerminationPointInstanceGroupAsync(applicationName, releaseNumber, remoteIPv4Address,
    remotePort, operationNameList) {
    return new Promise(async function (resolve, reject) {

        let logicalTerminationPointConfigurationStatus;
        let httpClientConfigurationStatus;
        let tcpClientConfigurationStatus;
        let operationClientConfigurationStatusList = [];

        try {

            let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(
                applicationName
            );
            httpClientConfigurationStatus = await updateHttpClientInterface(
                httpClientUuid,
                releaseNumber
            );
            tcpClientConfigurationStatus = await createOrUpdateTcpClientInterface(
                httpClientUuid,
                remoteIPv4Address,
                remotePort
            );
            operationClientConfigurationStatusList = await createOrUpdateOperationClientInterface(
                httpClientUuid,
                operationNameList
            );
            logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
                operationClientConfigurationStatusList,
                httpClientConfigurationStatus,
                tcpClientConfigurationStatus
            );

            resolve(logicalTerminationPointConfigurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * @description This function creates a http client interface.
 * @param {String} applicationName name of the client application
 * @param {String} releaseNumber release of the client application
 * @return {Promise} object {configurationStatus}
 **/
function createHttpClientInterface(applicationName, releaseNumber) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        try {
            let serverLtp = [];
            let clientLtp = [];
            let httpClientUuid = await httpClientInterface.generateNextUuidAsync();
            let httpClientLogicalTerminationPoint = httpClientInterface.
            createHttpClientInterface(
                httpClientUuid,
                serverLtp,
                clientLtp,
                applicationName,
                releaseNumber
            );
            let isCreated = await controlConstruct.addLogicalTerminationPointAsync(httpClientLogicalTerminationPoint);
            configurationStatus = new ConfigurationStatus(
                httpClientUuid,
                '',
                isCreated
            );
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function updates the http client uuid.
 * @param {String} httpClientUuid :uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {String} releaseNumber : release of the client application
 * @return {Promise} object {configurationStatus}
 **/
function updateHttpClientInterface(httpClientUuid, releaseNumber) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        try {
            let isUpdated = false;
            let existingReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
            if (existingReleaseNumber != releaseNumber) {
                isUpdated = await httpClientInterface.setReleaseNumberAsync(
                    httpClientUuid,
                    releaseNumber
                );
            }
            configurationStatus = new ConfigurationStatus(
                httpClientUuid,
                '',
                isUpdated);
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function creates or updates a tcp client interface.
 * @param {String} httpClientUuid :uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {String} remoteIpV4Address where the application is installed
 * @param {String} remotePort where the application is running
 * @return {Promise} object {configurationStatus}
 **/
function createOrUpdateTcpClientInterface(httpClientUuid, remoteIpV4Address, remotePort) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        try {
            let serverLtpList = await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
            if (serverLtpList != undefined && serverLtpList.length > 0) {
                let tcpClientUuid = serverLtpList[0];
                configurationStatus = await updateTcpClientInterface(
                    tcpClientUuid,
                    remoteIpV4Address,
                    remotePort
                );
            } else {
                configurationStatus = await createTcpClientInterface(
                    httpClientUuid,
                    remoteIpV4Address,
                    remotePort
                );
            }
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function creates a tcp client interface.
 * @param {String} httpClientUuid :uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {String} remoteIpV4Address where the application is installed
 * @param {String} remotePort where the application is running
 * @return {Promise} object {configurationStatus}
 **/
function createTcpClientInterface(httpClientUuid, remoteIpV4Address, remotePort) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        try {
            let tcpClientUuid = tcpClientInterface.generateNextUuid(
                httpClientUuid
            );
            let tcpClientLogicalTerminationPoint = await tcpClientInterface.
            createTcpClientInterfaceAsync(
                httpClientUuid,
                tcpClientUuid,
                remoteIpV4Address,
                remotePort
            );
            let isCreated = await controlConstruct.addLogicalTerminationPointAsync(
                tcpClientLogicalTerminationPoint
            );
            if (isCreated) {
                await logicalTerminationPoint.setServerLtpListAsync(
                    httpClientUuid,
                    [tcpClientUuid]
                );
            }
            configurationStatus = new ConfigurationStatus(
                tcpClientUuid,
                '',
                isCreated
            );
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function updates a tcp client interface.
 * @param {String} tcpClientUuid :uuid of the tcp-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-tcp-c-\d+$'
 * @param {String} remoteIpV4Address where the application is installed
 * @param {String} remotePort where the application is running
 * @return {Promise} object {configurationStatus}
 **/
function updateTcpClientInterface(tcpClientUuid, remoteIpV4Address, remotePort) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        let isUpdated = false;
        let isIpV4AddressUpdated = false;
        let isPortUpdated = false;
        try {
            let _remoteIpV4Address = await tcpClientInterface.getRemoteAddressAsync(
                tcpClientUuid
            );
            let _remotePort = await tcpClientInterface.getRemotePortAsync(
                tcpClientUuid
            );
            if (remoteIpV4Address != _remoteIpV4Address) {
                isIpV4AddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
                    tcpClientUuid,
                    remoteIpV4Address
                );
            }
            if (remotePort != _remotePort) {
                isPortUpdated = await tcpClientInterface.setRemotePortAsync(
                    tcpClientUuid,
                    remotePort
                );
            }
            if (isIpV4AddressUpdated || isPortUpdated) {
                isUpdated = true;
            }
            configurationStatus = new ConfigurationStatus(
                tcpClientUuid,
                '',
                isUpdated
            );
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function created a operation client interface.
 * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {String} operationName : name of the operation
 * @return {Promise} string {uuid}
 **/
function getPreviousVersionOfTheOperationClientIfExists(httpClientUuid, operationName) {
    return new Promise(async function (resolve, reject) {
        let operationClientUuidOfPreviousVersion;
        try {
            operationName = operationName.split("/")[2];
            let operationClientUuidList = await logicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
            for (let i = 0; i < operationClientUuidList.length; i++) {
                let operationClientUuid = operationClientUuidList[i];
                let existingOperationClientName = await operationClientInterface.getOperationNameAsync(operationClientUuid);
                let existingOperationName = existingOperationClientName.split("/")[2];
                if (existingOperationName == operationName) {
                    operationClientUuidOfPreviousVersion = operationClientUuid;
                }
            }
            resolve(operationClientUuidOfPreviousVersion);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function created a operation client interface.
 * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {String} operationName : name of the operation
 * @return {Promise} object {configurationStatus}
 **/
function createOperationClientInterface(httpClientUuid, operationName) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        let isCreated;
        try {
            let operationClientUuid = await operationClientInterface.generateNextUuidAsync(
                httpClientUuid,
                operationName
            );
            let operationClientLogicalTerminationPoint = await operationClientInterface.
            createOperationClientInterface(
                httpClientUuid,
                operationClientUuid,
                operationName
            );
            isCreated = await controlConstruct.addLogicalTerminationPointAsync(
                operationClientLogicalTerminationPoint
            );
            if (isCreated) {
                await logicalTerminationPoint.setClientLtpListAsync(
                    httpClientUuid,
                    [operationClientUuid]
                );
            }
            configurationStatus = new ConfigurationStatus(
                operationClientUuid,
                '',
                isCreated
            );

            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function updates a operation client interface.
 * @param {String} operationClientUuid : uuid of the operation-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-op-c-\d+$'
 * @param {String} operationName : name of the operation
 * @return {Promise} object {configurationStatus}
 **/
function updateOperationClientInterface(operationClientUuid, operationName) {
    return new Promise(async function (resolve, reject) {
        let configurationStatus;
        let isUpdated;
        try {
            isUpdated = await operationClientInterface.setOperationNameAsync(operationClientUuid, operationName);
            configurationStatus = new ConfigurationStatus(
                operationClientUuid,
                '',
                isUpdated
            );
            resolve(configurationStatus);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description This function creates or updates a operation client interfaces for the provided input operation name list.
 * @param {String} httpClientUuid : uuid of the http-client, the value should be a valid string 
 * in the pattern '-\d+-\d+-\d+-http-c-\d+$'
 * @param {list} operationClientNameList : list of operation names
 * @return {Promise} object {configurationStatusList}
 **/
function createOrUpdateOperationClientInterface(httpClientUuid, operationClientNameList) {
    return new Promise(async function (resolve, reject) {
        let configurationStatusList = [];
        try {
            for (let i = 0; i < operationClientNameList.length; i++) {
                let configurationStatus
                let operationClientName = operationClientNameList[i];
                let operationClientUuid = await operationClientInterface.getOperationClientUuidAsync(
                    httpClientUuid,
                    operationClientName
                );
                if (operationClientUuid == undefined) {
                    let operationClientUuidOfPreviousVersion = await getPreviousVersionOfTheOperationClientIfExists(
                        httpClientUuid,
                        operationClientName
                    );
                    if (operationClientUuidOfPreviousVersion == undefined) {
                        configurationStatus = await createOperationClientInterface(
                            httpClientUuid,
                            operationClientName
                        );
                    } else {
                        configurationStatus = await updateOperationClientInterface(
                            operationClientUuidOfPreviousVersion,
                            operationClientName
                        );
                    }
                } else {
                    configurationStatus = new ConfigurationStatus(
                        operationClientUuid,
                        '',
                        false
                    );
                }
                configurationStatusList.push(configurationStatus);
            }
            resolve(configurationStatusList);
        } catch (error) {
            reject(error);
        }
    });
}