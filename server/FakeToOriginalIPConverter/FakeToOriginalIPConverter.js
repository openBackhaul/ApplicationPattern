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
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

/****************************************************************************************
* Setting Local Variables and initiating the process
****************************************************************************************/
var config = require('./input/config.json');
var fakeToOriginalIPMapping = require(config['fake-to-original-iP-mapping-file-path']);

global.databasePath = config['target-oam-config-file-path'];
modifyFakeIpAddressToOriginal();

/***********************************************************************************************************************************************
 * Initiates process to update the Fake IP address to original IP address
 *
 * Step 1 : Modifies the tcpClients of all applications
 * Step 2 : Modifies the tcpClient of the OldRelease
 * Step 3 : Modifies the tcpClient of the NewRelease
 * Step 4 : Modifies the tcpServer of the application 
 ***********************************************************************************************************************************************/
async function modifyFakeIpAddressToOriginal() {
    await modifyClients();
    await modifyOldRelease();
    await modifyNewRelease();
    await modifyServer();
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
        if(application['instance-type'] == 'client'){
            let isTcpIPAddressUpdated = false;
            let isTcpPortUpdated = false;
            let isTcpProtocolUpdated = false;
            let isHttpReleaseNumberUpdated = false;
            let isNewReleaseExist = false;
            let applicationName = application['component'];
            let oldReleaseNumber = application['old-release'];
            let originalTcpIpAddress = application['original-address'];
            let originalTcpPort = application['original-tcp-port'];
            let originalTcpProtocol = application['protocol'];
            let newReleaseNumber = application['new-release'];
            let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, newReleaseNumber);
            if (httpClientUuid == undefined) {
                httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, oldReleaseNumber);
                if (httpClientUuid == undefined) {
                    console.log(applicationName + "," + oldReleaseNumber + " does not exits")
                }
            }else{
                isNewReleaseExist = true
            }
            
            const tcpClientuuidList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
            if (tcpClientuuidList != undefined) {
                // need to update after including the NGINX concept
                let tcpClientuuid = tcpClientuuidList[0];
                try {
                    isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(tcpClientuuid, originalTcpIpAddress);
                    isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(tcpClientuuid, originalTcpPort);
                    isTcpProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(tcpClientuuid, originalTcpProtocol);
                    if(isNewReleaseExist == false){
                        isHttpReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(httpClientUuid, newReleaseNumber);
                    }
                } catch (error) {
                    console.log(error);
                }
                console.log(applicationName + "," + oldReleaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated + " tcp-client protocol update : " + isTcpProtocolUpdated + " http-client release number update : " + isHttpReleaseNumberUpdated)
            }else{
                console.log("tcp client uuid list not found")
            }
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
            if(application['instance-type'] == 'server'){
                let applicationName = application['component'];
                let oldReleaseNumber = application['old-release'];
                let originalTcpIpAddress = application['original-address'];
                let originalTcpPort = application['original-tcp-port'];
                if (applicationName == originalApplicationName && originalReleaseNumber == oldReleaseNumber) {
                    try {
                        isTcpIPAddressUpdated = await modifyServerLocalAddress(originalTcpIpAddress);
                        isTcpPortUpdated = await modifyServerLocalPort(originalTcpPort);
                    } catch (error) {
                        console.log(error);
                    }
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
    let isTcpProtocolUpdated = false;
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
                    if(application['instance-type'] == 'client'){
                        let applicationName = application['component'];
                        let releaseNumber = application['old-release'];
                        let originalTcpIpAddress = application['original-address'];
                        let originalTcpPort = application['original-tcp-port'];
                        let originalTcpProtocol = application['protocol'];
                        if (applicationName == originalApplicationName && oldReleaseNumber == releaseNumber) {
                            try {
                                isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(oldReleaseTcpClientuuid, originalTcpIpAddress);
                                isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(oldReleaseTcpClientuuid, originalTcpPort);
                                isTcpProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(oldReleaseTcpClientuuid, originalTcpProtocol);
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("OldRelease" + "," + oldReleaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated + " tcp-client protocol update : " + isTcpProtocolUpdated);
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
    let isTcpProtocolUpdated = false;
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
                    if(application['instance-type'] == 'client'){
                        let applicationName = application['component'];
                        let oldReleaseNumber = application['old-release'];
                        let originalTcpIpAddress = application['original-address'];
                        let originalTcpPort = application['original-tcp-port'];
                        let originalTcpProtocol = application['protocol'];
                        if (applicationName == originalApplicationName && newReleaseNumber == oldReleaseNumber) {
                            try {
                                isTcpIPAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(newReleaseTcpClientuuid, originalTcpIpAddress);
                                isTcpPortUpdated = await tcpClientInterface.setRemotePortAsync(newReleaseTcpClientuuid, originalTcpPort);
                                isTcpProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(newReleaseTcpClientuuid, originalTcpProtocol);
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("NewRelease" + "," + newReleaseNumber + " tcp-client Ip address update : " + isTcpIPAddressUpdated + " tcp-client port update : " + isTcpPortUpdated + " tcp-client protocol update : " + isTcpProtocolUpdated);
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
        let tcpServerUuidList = await LogicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocolNameEnum.TCP_SERVER);
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
        let tcpServerUuidList = await LogicalTerminationPoint.getUuidListForTheProtocolAsync(layerProtocolNameEnum.TCP_SERVER);
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