'use strict';
/*********************************************************************************************************************************************
 * This module updates the TcpClient and TcpServer address and port details based on the information provided in the input/fakeToOriginalIPMapping.json 
 * This script needs to be executed
 *      - before generating a docker image for any application
 *      - with proper information in the input/fakeToOriginalIPMapping.json as per the test and prod environment
 ***********************************************************************************************************************************************/
const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const { layerProtocolNameEnum } = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const fileSystem = require('fs');
const yargs = require("yargs")
/****************************************************************************************
* Setting Local Variables and initiating the process
****************************************************************************************/
var config = require('./input/config.json');
const ControlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
var fakeToOriginalIPMapping = require(config['fake-to-original-iP-mapping-file-path']);

process.env.MODIFY_FILE = yargs.argv.modify

try {
    if (process.env.MODIFY_FILE == "load") {
        global.databasePath = config['target-oam-config-file-path'];
    } else if (process.env.MODIFY_FILE == "config") {
        global.databasePath = config['testsuite-config-file-path'];
    } else {
        throw "--modify argument missing"
    }
    modifyFakeIpAddressToOriginal(databasePath);
} catch (error) {
    console.log(error)
}

/***********************************************************************************************************************************************
 * Initiates process to update the Fake IP address to original IP address
 * 
 * For testsuit config : it extract core-model-1-4:control-construct from 
 * "testsuite config" and modify it and merge it back to "testsuit config"
 * 
 * Step 1 : Modifies the tcpClients of all applications
 * Step 2 : Modifies the tcpClient of the OldRelease
 * Step 3 : Modifies the tcpClient of the NewRelease
 * Step 4 : Modifies the tcpServer of the application 
 ***********************************************************************************************************************************************/
async function modifyFakeIpAddressToOriginal(filePath) {
    try{
        let testsuitConfigSplit
        let testsuitConfigSplitParse
        let coreModelJsonObjectParse
        if (process.env.MODIFY_FILE == "config"){
            testsuitConfigSplit = await splitControlConstructFromTestsuitConfig(filePath)
            testsuitConfigSplitParse = JSON.parse(testsuitConfigSplit)
            writeToFile(filePath, testsuitConfigSplitParse.core_model_control_construct)
        }
    
        await modifyClients();
        //await modifyOldRelease();
        await modifyNewRelease();
        await modifyServer();
    
        if (process.env.MODIFY_FILE == "config"){
            await readFile(filePath).then((coreModelJsonObject) => {
                coreModelJsonObjectParse = JSON.parse(coreModelJsonObject)
                testsuitConfigSplitParse.testsuite_config_without_control_construct[0].application["core-model-1-4:control-construct"] = coreModelJsonObjectParse["core-model-1-4:control-construct"]
                writeToFile(filePath, testsuitConfigSplitParse.testsuite_config_without_control_construct)
            }).catch((error) => {
                throw "unable to read and mofidy testsuite config file " + error
            })
        }
    }catch(error){
        console.log(error)
    }
}

/***********************************************************************************************************************************************
 * Updates all the TcpClient with the information provided in the input/fakeToOriginalIPMapping.json
 *
 * Step 1 : Read each input from the fakeToOriginalIPMapping.json
 * Step 2 : Findout the httpClient for the application-name and release
 * Step 3 : Findout the corresponding mapped tcpClient 
 * Step 4 : Update the original-address and original-tcp-port 
 ***********************************************************************************************************************************************/
async function modifyClients() {
    let applicationList = fakeToOriginalIPMapping['fake-to-original-iP-mapping'];
    for (let index = 0; index < applicationList.length; index++) {
        let application = applicationList[index];
        let applicationName = application['component'];
        let releaseNumber = application['release'];
        let originalTcpIpAddress = application['original-address'];
        let originalTcpPort = application['original-tcp-port'];
        let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, releaseNumber);
        if (httpClientUuid != undefined) {
            const tcpClientuuidList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
            if (tcpClientuuidList != undefined) {
                // need to update after including the NGINX concept
                let tcpClientuuid = tcpClientuuidList[0];
                let isTcpIPAddressUpdated = false;
                let isTcpPortUpdated = false;
                try {
                    isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(tcpClientuuid, originalTcpIpAddress);
                    isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(tcpClientuuid, originalTcpPort);
                } catch (error) {
                    console.log(error);
                }
                console.log(applicationName + "," + releaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated)
            }
        } else {
            console.log(applicationName + "," + releaseNumber + " does not exits")
        }
    }
}

/***********************************************************************************************************************************************
 * Updates the TcpServer with the information provided in the input/fakeToOriginalIPMapping.json
 *
 * Step 1 : Findout the tcpServer instance
 * Step 2 : Update the original-address and original-tcp-port
 ***********************************************************************************************************************************************/
async function modifyServer() {
    let applicationList = fakeToOriginalIPMapping['fake-to-original-iP-mapping'];
    let originalApplicationName = await httpServerInterface.getApplicationNameAsync();
    let originalReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
    let isTcpIPAddressUpdated = false;
    let isTcpPortUpdated = false;
    if (originalApplicationName != undefined && originalReleaseNumber != undefined) {
        for (let index = 0; index < applicationList.length; index++) {
            let application = applicationList[index];
            let applicationName = application['component'];
            let releaseNumber = application['release'];
            let originalTcpIpAddress = application['original-address']['ip-address'];
            let originalTcpPort = application['original-tcp-port'];
            if (applicationName == originalApplicationName && originalReleaseNumber == releaseNumber) {
                try {
                    isTcpIPAddressUpdated = await modifyServerLocalAddress(originalTcpIpAddress);
                    isTcpPortUpdated = await modifyServerLocalPort(originalTcpPort);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    console.log(originalApplicationName + "," + originalReleaseNumber + " tcp-server Ip address update : " + isTcpIPAddressUpdated + " tcp-server port update : " + isTcpPortUpdated);
}

/***********************************************************************************************************************************************
 * Updates the TcpClient of the oldRelease with the information provided in the input/fakeToOriginalIPMapping.json
 *
 * Step 1 : Findout the version of the oldRelease
 * Step 2 : Findout the name of the current application
 * Step 3 : Findout the instance in the input/fakeToOriginalIPMapping.json that matches the "current application name" + "version of the oldRelease"
 * Step 4 : Update the original-address and original-tcp-port
 ***********************************************************************************************************************************************/
async function modifyOldRelease() {
    let applicationList = fakeToOriginalIPMapping['fake-to-original-iP-mapping'];
    let originalApplicationName = await httpServerInterface.getApplicationNameAsync();
    let oldReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("OldRelease");
    let isTcpIPAddressUpdated = false;
    let isTcpPortUpdated = false;
    let oldReleaseNumber = "";
    if (oldReleaseHttpClientUuid != undefined) {
        const oldReleaseTcpClientuuidList = await LogicalTerminationPoint.getServerLtpListAsync(oldReleaseHttpClientUuid);
        if (oldReleaseTcpClientuuidList != undefined) {
            // need to update after including the NGINX concept
            let oldReleaseTcpClientuuid = oldReleaseTcpClientuuidList[0];
            oldReleaseNumber = await httpClientInterface.getReleaseNumberAsync(oldReleaseHttpClientUuid);
            if (originalApplicationName != undefined && oldReleaseNumber != undefined) {
                for (let index = 0; index < applicationList.length; index++) {
                    let application = applicationList[index];
                    let applicationName = application['component'];
                    let releaseNumber = application['release'];
                    let originalTcpIpAddress = application['original-address'];
                    let originalTcpPort = application['original-tcp-port'];
                    if (applicationName == originalApplicationName && oldReleaseNumber == releaseNumber) {
                        try {
                            isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(oldReleaseTcpClientuuid, originalTcpIpAddress);
                            isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(oldReleaseTcpClientuuid, originalTcpPort);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        }
    }
    console.log("OldRelease" + "," + oldReleaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated);
}

/***********************************************************************************************************************************************
 * Updates the TcpClient of the newRelease with the information provided in the input/fakeToOriginalIPMapping.json
 *
 * Step 1 : Findout the version of the newRelease
 * Step 2 : Findout the name of the current application
 * Step 3 : Findout the instance in the input/fakeToOriginalIPMapping.json that matches the "current application name" + "version of the newRelease"
 * Step 4 : Update the original-address and original-tcp-port
 ***********************************************************************************************************************************************/
async function modifyNewRelease() {
    let applicationList = fakeToOriginalIPMapping['fake-to-original-iP-mapping'];
    let originalApplicationName = await httpServerInterface.getApplicationNameAsync();
    let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
    let isTcpIPAddressUpdated = false;
    let isTcpPortUpdated = false;
    let newReleaseNumber = "";
    if (newReleaseHttpClientUuid != undefined) {
        const newReleaseTcpClientuuidList = await LogicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid);
        if (newReleaseTcpClientuuidList != undefined) {
            // need to update after including the NGINX concept
            let newReleaseTcpClientuuid = newReleaseTcpClientuuidList[0];
            newReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
            if (originalApplicationName != undefined && newReleaseNumber != undefined) {
                for (let index = 0; index < applicationList.length; index++) {
                    let application = applicationList[index];
                    let applicationName = application['component'];
                    let releaseNumber = application['release'];
                    let originalTcpIpAddress = application['original-address'];
                    let originalTcpPort = application['original-tcp-port'];
                    if (applicationName == originalApplicationName && newReleaseNumber == releaseNumber) {
                        try {
                            isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(newReleaseTcpClientuuid, originalTcpIpAddress);
                            isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(newReleaseTcpClientuuid, originalTcpPort);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        }
    }
    console.log("NewRelease" + "," + newReleaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated);
}


/***********************************************************************************************************************************************
 * Modifies the tcpServer's localAddress with the provided input
 *
 * @param {String} localAddress : local address of the TcpServer
 * @returns {promise} boolean { true | false }
 ***********************************************************************************************************************************************/
async function modifyServerLocalAddress(localAddress) {
    return new Promise(async function (resolve, reject) {
        const TCP_SERVER_INTERFACE_PAC = onfPaths.LAYER_PROTOCOL + "/tcp-server-interface-1-0:tcp-server-interface-pac";
        const TCP_SERVER_INTERFACE_CONFIGURATION = TCP_SERVER_INTERFACE_PAC + "/tcp-server-interface-configuration";
        const TCP_SERVER_LOCAL_ADDRESS = TCP_SERVER_INTERFACE_CONFIGURATION + "/local-address/ipv-4-address";
        let isUpdated = false;
        let tcpServerList = await ControlConstruct.getLogicalTerminationPointListAsync(layerProtocolNameEnum.TCP_SERVER);
        let tcpServerUuidList = tcpServerList.flatMap(ltp => ltp[onfAttributes.GLOBAL_CLASS.UUID]);
        try {
            for (let index = 0; index < tcpServerUuidList.length; index++) {
                let tcpServerUuid = tcpServerUuidList[index];
                if (tcpServerUuid != undefined) {
                    let localAddressPath = TCP_SERVER_LOCAL_ADDRESS.replace(
                        "{uuid}", tcpServerUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        localAddressPath,
                        localAddress,
                        false);
                }
            }

        } catch (error) {
            console.log(error);
        }
        resolve(isUpdated);
    });
}

/***********************************************************************************************************************************************
 * Modifies the tcpServer's localPort with the provided input
 *
 * @param {String} localPort : local port of the TcpServer
 * @returns {promise} boolean { true | false }
 ***********************************************************************************************************************************************/
async function modifyServerLocalPort(localPort) {
    return new Promise(async function (resolve, reject) {
        const TCP_SERVER_INTERFACE_PAC = onfPaths.LAYER_PROTOCOL + "/tcp-server-interface-1-0:tcp-server-interface-pac";
        const TCP_SERVER_INTERFACE_CONFIGURATION = TCP_SERVER_INTERFACE_PAC + "/tcp-server-interface-configuration";
        const TCP_SERVER_LOCAL_PORT = TCP_SERVER_INTERFACE_CONFIGURATION + "/local-port";
        let isUpdated = false;
        let tcpServerList = await ControlConstruct.getLogicalTerminationPointListAsync(layerProtocolNameEnum.TCP_SERVER);
        let tcpServerUuidList = tcpServerList.flatMap(ltp => ltp[onfAttributes.GLOBAL_CLASS.UUID]);
        try {
            for (let index = 0; index < tcpServerUuidList.length; index++) {
                let tcpServerUuid = tcpServerUuidList[index];
                if (tcpServerUuid != undefined) {
                    let localPortPath = TCP_SERVER_LOCAL_PORT.replace(
                        "{uuid}", tcpServerUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        localPortPath,
                        localPort,
                        false);
                }
            }

        } catch (error) {
            console.log(error);
        }
        resolve(isUpdated);
    });
}

/** 
 * Write to the filesystem.<br>
 * @param {JSONObject} coreModelJsonObject json object that needs to be updated
 * @returns {boolean} return true if the value is updated, otherwise returns false
 **/
function writeToFile(filePath, coreModelJsonObject) {
    try {
        fileSystem.writeFileSync(filePath, JSON.stringify(coreModelJsonObject), (error) => {
            if (error) {
                console.log('write failed:')
                throw "write failed:";
            } else {
                console.log('write successful:');
                resolve();
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}

function readFile(filePath) {
    return new Promise(async function (resolve, reject) {
        try {
            await fileSystem.readFile(filePath, 'utf-8', (error, coreModelJsonObject) => {
                if (error) {
                    console.log("read file failed");
                    throw "read file failed:";
                }
                resolve(coreModelJsonObject)
            });
        } catch (error) {
            reject(error)
        }
    })
}

/**
* function to split testsuit config into two component
* 1. core-model-1-4:control-construct json
* 2. json without core-model-1-4:control-construct
**/
async function splitControlConstructFromTestsuitConfig(filePath) {
    return new Promise(async function (resolve, reject) {
        try {
            await readFile(filePath).then((coreModelJsonObject) => {
                const coreModelJsonObjectParse = JSON.parse(coreModelJsonObject)
                const controlConstruct = coreModelJsonObjectParse[0].application['core-model-1-4:control-construct']
                delete coreModelJsonObjectParse[0].application['core-model-1-4:control-construct']
                const testsuite_config_without_control_construct = coreModelJsonObjectParse
                const core_model_control_construct = {
                    'core-model-1-4:control-construct': controlConstruct
                }
                const testConfigSplit = JSON.stringify({
                    "testsuite_config_without_control_construct": testsuite_config_without_control_construct,
                    "core_model_control_construct": core_model_control_construct
                })
                resolve(testConfigSplit)
            }).catch((error) => {
                reject(error)
            })
        } catch (error) {
            reject(error)
        }
    })
}
