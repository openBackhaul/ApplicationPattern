/**
 * This class provides a stub to instantiate and generate a JSON object for a httpClientInterface layer protocol.
 * This class is a sub class for LayerProtocol. 
 * It provides functionality ,
 * - to read the currently configured attribute values of the http-client-interface. 
 * - create new http-client-instance
 * - to set the release number of a http-client-interface
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const layerProtocol = require('../LayerProtocol');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/** 
 * @extends layerProtocol
 */
class HttpClientInterface extends layerProtocol {
    /**
     * HttpClientInterfacePac class holds the following properties,.
     * 1. layerProtocolName - The value of this parameter will be http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER always.
     * 2. HttpClientInterfaceConfiguration - which is a class that holds the name of the client application and release number.
     */
    static HttpClientInterfacePac = class HttpClientInterfacePac {
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.HTTP_CLIENT;
        httpClientInterfaceConfiguration;

        static HttpClientInterfaceConfiguration = class HttpClientInterfaceConfiguration {
            releaseNumber;
            /**
             * constructor 
             * @param {string} releaseNumber release number of the client application.
             * This constructor will instantiate the httpClientInterfaceConfiguration class
             */
            constructor(applicationName, releaseNumber) {
                this.applicationName = applicationName;
                this.releaseNumber = releaseNumber;
            }
        };

        /**
         * constructor 
         * @param {string} applicationName name of the client application.
         * @param {string} releaseNumber release number of the client application.
         * This constructor will instantiate the HttpClientInterfacePac class
         */
        constructor(applicationName, releaseNumber) {
            this.httpClientInterfaceConfiguration = new HttpClientInterfacePac.
            HttpClientInterfaceConfiguration(applicationName, releaseNumber);
        }
    }

    /**
     * constructor 
     * @param {string} applicationName name of the client application.
     * @param {string} releaseNumber release number of the client application.
     * This constructor will instantiate the HttpClientInterface class
     */
    constructor(applicationName, releaseNumber) {
        super("0",
            HttpClientInterface.HttpClientInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC] = new HttpClientInterface.
        HttpClientInterfacePac(
            applicationName,
            releaseNumber);
    }

    /**
     * @description This function returns the application name for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @returns {promise} string {undefined|applicationName}
     **/
    static getApplicationNameAsync(httpClientUuid) {
        return new Promise(async function (resolve, reject) {
            let applicationName;
            try {
                let logicalTerminationPoint = await controlConstruct.
                getLogicalTerminationPointAsync(httpClientUuid);
                let layerProtocol = logicalTerminationPoint[
                    onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpClientPac = layerProtocol[
                    onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC];
                let httpClientConfiguration = httpClientPac[onfAttributes.HTTP_CLIENT.CONFIGURATION];
                applicationName = httpClientConfiguration[onfAttributes.HTTP_CLIENT.APPLICATION_NAME];
                resolve(applicationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the release number for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @returns {promise} string {undefined|releaseNumber}
     **/
    static getReleaseNumberAsync(httpClientUuid) {
        return new Promise(async function (resolve, reject) {
            let releaseNumber;
            try {
                let logicalTerminationPoint = await controlConstruct.
                getLogicalTerminationPointAsync(httpClientUuid);
                let layerProtocol = logicalTerminationPoint[
                    onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpClientPac = layerProtocol[
                    onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC];
                let httpClientConfiguration = httpClientPac[onfAttributes.HTTP_CLIENT.CONFIGURATION];
                releaseNumber = httpClientConfiguration[onfAttributes.HTTP_CLIENT.RELEASE_NUMBER];
                resolve(releaseNumber);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the uuid of the http-client-interface for the application-name and release-number.If release number
     * is not provided , then only the application name will be checked
     * @param {String} applicationName : name of the application.
     * @param {String} releaseNumber : release number of the application.
     * @returns {promise} string {undefined|httpClientUuid}
     **/
    static getHttpClientUuidAsync(applicationName, releaseNumber) {
        return new Promise(async function (resolve, reject) {
            let httpClientUuid;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.HTTP_CLIENT);
                if (logicalTerminationPointList != undefined) {
                    for (let i = 0; i < logicalTerminationPointList.length; i++) {
                        let logicalTerminationPoint = logicalTerminationPointList[i];
                        let layerProtocol = logicalTerminationPoint[
                            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                        let httpClientPac = layerProtocol[
                            onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC];
                        if (httpClientPac != undefined) {
                            let httpClientConfiguration = httpClientPac[onfAttributes.HTTP_CLIENT.CONFIGURATION];
                            let _applicationName = httpClientConfiguration[onfAttributes.HTTP_CLIENT.APPLICATION_NAME];
                            let _releaseNumber = httpClientConfiguration[onfAttributes.HTTP_CLIENT.RELEASE_NUMBER];
                            if (_applicationName != undefined && _applicationName == applicationName) {
                                if (_releaseNumber != undefined &&
                                    (releaseNumber == undefined || _releaseNumber == releaseNumber)) {
                                    httpClientUuid = logicalTerminationPoint[onfAttributes.GLOBAL_CLASS.UUID];
                                }
                            }
                        }
                    }
                }
                resolve(httpClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the uuid of the http-client-interface for the application-name and release-number.If release number
     * is not provided , then only the application name will be checked
     * @param {String} applicationName : name of the application.
     * @param {String} releaseNumber : release number of the application.
     * @returns {promise} boolean {true|false}
     **/
    static isApplicationExists(applicationName, releaseNumber) {
        return new Promise(async function (resolve, reject) {
            let isApplicationExists = false;
            try {
                let httpClientUuid = await HttpClientInterface.getHttpClientUuidAsync(applicationName, releaseNumber);
                if (httpClientUuid != undefined) {
                    isApplicationExists = true;
                }
                resolve(isApplicationExists);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the release number for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} newReleaseNumber new release number of the http-client-interface .
     * @returns {promise} boolean {true|false}
     **/
    static setReleaseNumberAsync(httpClientUuid, newReleaseNumber) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let releaseNumberPath = onfPaths.HTTP_CLIENT_RELEASE_NUMBER.replace(
                    "{uuid}", httpClientUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    releaseNumberPath,
                    newReleaseNumber,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function creates and returns a new HttpClientInterface.
     * @param {String} httpClientUuid : http client unique identifier for the new application.
     * It should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} operationClientUuidList : uuids of the operation clients associated services with this application.
     * It should be a valid list of string in the pattern '-\d+-\d+-\d+-op-client-\d+$'
     * @param {String} tcpClientUuid : tcp client uuid that provides information about the ip address and port number of the application.
     * It should be a valid string in the pattern '-\d+-\d+-\d+-tcp-client-\d+$'
     * @param {String} applicationName : name of the application.
     * @param {String} releaseNumber : release number of the application.
     * @returns {promise} object {undefined|HttpClientInterface}.
     **/
    static createHttpClientInterface(httpClientUuid, operationClientUuidList, tcpClientUuidList, applicationName, releaseNumber) {
        let httpClientLogicalTerminationPoint;
        try {
            let httpClientInterface = new HttpClientInterface(
                applicationName,
                releaseNumber);
            httpClientLogicalTerminationPoint = new logicalTerminationPoint(
                httpClientUuid,
                logicalTerminationPoint.ltpDirectionEnum.SINK,
                operationClientUuidList,
                tcpClientUuidList,
                [httpClientInterface]
            );
            return httpClientLogicalTerminationPoint;
        } catch (error) {
            return error;
        }
    }

    /**
     * @deprecated Works only with old UUIDs, use generateHttpClientUuidAsync
     * @description This function returns the next available uuid for the http-client-interface.
     * @returns {promise} string {nextHttpClientUuid}
     **/
    static generateNextUuidAsync() {
        return new Promise(async function (resolve, reject) {
            let nextHttpClientUuid;
            try {
                let logicalTerminationPointUuidList = await logicalTerminationPoint.
                getUuidListForTheProtocolAsync(layerProtocol.layerProtocolNameEnum.HTTP_CLIENT);
                if (logicalTerminationPointUuidList != undefined) {
                    logicalTerminationPointUuidList.sort();
                    let lastUuid = logicalTerminationPointUuidList[
                        logicalTerminationPointUuidList.length - 1];
                    let uuidPrefix = lastUuid.substring(
                        0,
                        lastUuid.lastIndexOf("-") + 1);
                    let uuidNumber = lastUuid.substring(
                        lastUuid.lastIndexOf("-") + 1,
                        lastUuid.length);
                    nextHttpClientUuid = uuidPrefix +
                        (parseInt(uuidNumber) + 10);
                }
                resolve(nextHttpClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function updates API segment for the http-client-interface
     * and every place in database that is touched by this renaming.
     * @param {String} httpClientUuid : http client unique identifier for the new application.
     * It should be a valid string in the pattern '-\d+-\d+-\d+-http-c-\d+$'
     * @param {String} apiSegment: new API segment to be replaced in given httpClientUuid
     * @returns {promise} {httpClientUuid}
     **/
     static updateApiSegment(httpClientUuid, apiSegment) {
        return new Promise(async function (resolve, reject) {
            try {
                let httpClientUuidSeparated = httpClientUuid.split("-");
                httpClientUuidSeparated[6] = apiSegment;
                let updatedHttpClientUuid = httpClientUuidSeparated.join("-");
                // find all operation clients associated with this http client UUID
                // and change their server ltp list to point to new http client UUID
                let operationClients = await logicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
                for (let operation of operationClients) {
                    await logicalTerminationPoint.setServerLtpListAsync(operation, [updatedHttpClientUuid]);
                }
                // find tcp client associated with this http client UUID
                // and change its client ltp list to point to new http client UUID
                let tcpClient = await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
                await logicalTerminationPoint.setClientLtpListAsync(tcpClient[0], [updatedHttpClientUuid]);
                // change tcp client UUID as well
                let updatedTcpClientUuid = updatedHttpClientUuid.replace("http", "tcp");
                let tcpClientUuidPath = onfPaths.LOGICAL_TERMINATION_POINT_UUID.replace(
                    "{uuid}", tcpClient[0]);
                await fileOperation.writeToDatabaseAsync(
                    tcpClientUuidPath,
                    updatedTcpClientUuid,
                    false);
                // change tcp reference for this http client UUID
                await logicalTerminationPoint.setServerLtpListAsync(httpClientUuid, [updatedTcpClientUuid]);
                // change http client UUID
                let httpClientUuidPath = onfPaths.LOGICAL_TERMINATION_POINT_UUID.replace(
                    "{uuid}", httpClientUuid);
                await fileOperation.writeToDatabaseAsync(
                    httpClientUuidPath,
                    updatedHttpClientUuid,
                    false);
                resolve(updatedHttpClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the uuid for the http-client-interface.
     * @param {String} applicationName: caller application name
     * @param {String} releaseNumber: caller release number
     * @param {String} apiSegment: API segment that should be part of UUID
     * @returns {promise} string {nextHttpClientUuid}
     **/
    static generateHttpClientUuidAsync(applicationName, releaseNumber, apiSegment) {
        return new Promise(async function (resolve, reject) {
            try {
                let appUuid = await controlConstruct.getUuidAsync();
                let releaseNumberUuidFormat = releaseNumber.replace(/\./g, "-");
                let applicationNameUuidFormat = applicationName.replace(/[a-z]/g, "").toLowerCase();
                let httpClientUuid = appUuid + "-http-c-" + apiSegment + "-" +
                    applicationNameUuidFormat + "-" + releaseNumberUuidFormat + "-000";
                resolve(httpClientUuid);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = HttpClientInterface;