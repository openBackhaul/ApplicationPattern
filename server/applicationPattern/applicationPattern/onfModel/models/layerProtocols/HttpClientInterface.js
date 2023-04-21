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
     * @returns {Promise<String>} undefined|applicationName
     **/
    static async getApplicationNameAsync(httpClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(httpClientUuid);
        let layerProtocol = logicalTerminationPoint[
            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpClientPac = layerProtocol[
            onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC];
        let httpClientConfiguration = httpClientPac[onfAttributes.HTTP_CLIENT.CONFIGURATION];
        return httpClientConfiguration[onfAttributes.HTTP_CLIENT.APPLICATION_NAME];
    }

    /**
     * @description This function returns the release number for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @returns {Promise<String>} undefined|releaseNumber
     **/
    static async getReleaseNumberAsync(httpClientUuid) {
        let logicalTerminationPoint = await controlConstruct.getLogicalTerminationPointAsync(httpClientUuid);
        let layerProtocol = logicalTerminationPoint[
            onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpClientPac = layerProtocol[
            onfAttributes.LAYER_PROTOCOL.HTTP_CLIENT_INTERFACE_PAC];
        let httpClientConfiguration = httpClientPac[onfAttributes.HTTP_CLIENT.CONFIGURATION];
        return httpClientConfiguration[onfAttributes.HTTP_CLIENT.RELEASE_NUMBER];
    }


    /**
     * @description This function returns the uuid of the http-client-interface for the application-name and release-number.If release number
     * is not provided , then only the application name will be checked
     * @param {String} applicationName : name of the application.
     * @param {String} releaseNumber : release number of the application.
     * @returns {Promise<String>} undefined|httpClientUuid
     **/
    static async getHttpClientUuidAsync(applicationName, releaseNumber) {
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
                            return logicalTerminationPoint[onfAttributes.GLOBAL_CLASS.UUID];
                        }
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * @description This function returns the uuid of the http-client-interface for the application-name and release-number.If release number
     * is not provided , then only the application name will be checked
     * @param {String} applicationName : name of the application.
     * @param {String} releaseNumber : release number of the application.
     * @returns {Promise<boolean>} true|false
     **/
    static async isApplicationExists(applicationName, releaseNumber) {
        let httpClientUuid = await HttpClientInterface.getHttpClientUuidAsync(applicationName, releaseNumber);
        return httpClientUuid != undefined;
    }

    /**
     * @description This function sets the release number for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} newReleaseNumber new release number of the http-client-interface .
     * @returns {Promise<boolean>} true|false
     */
    static async setReleaseNumberAsync(httpClientUuid, newReleaseNumber) {
        let releaseNumberPath = onfPaths.HTTP_CLIENT_RELEASE_NUMBER.replace(
            "{uuid}", httpClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            releaseNumberPath,
            newReleaseNumber,
            false);
    }

    /**
     * @description This function sets the application name for the http client uuid.
     * @param {String} httpClientUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-http-client-\d+$'
     * @param {String} newApplicationName new release number of the http-client-interface .
     * @returns {Promise<boolean>} true|false
     **/
    static async setApplicationNameAsync(httpClientUuid, newApplicationName) {
        let applicationNamePath = onfPaths.HTTP_CLIENT_APPLICATION_NAME.replace(
            "{uuid}", httpClientUuid);
        return await fileOperation.writeToDatabaseAsync(
            applicationNamePath,
            newApplicationName,
            false);
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
     * @returns {Object} undefined|logicalTerminationPoint.
     **/
    static createHttpClientInterface(httpClientUuid, operationClientUuidList, tcpClientUuidList, applicationName, releaseNumber) {
        let httpClientLogicalTerminationPoint;
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
    }

    /**
     * @description This function returns the uuid for the http-client-interface.
     * @param {String} applicationName: caller application name
     * @param {String} releaseNumber: caller release number
     * @returns {Promise<String>} nextHttpClientUuid
     **/
    static async generateHttpClientUuidAsync(applicationName, releaseNumber) {
        let appUuid = await controlConstruct.getUuidAsync();
        let releaseNumberUuidFormat = releaseNumber.replace(/\./g, "-");
        let applicationNameUuidFormat = applicationName.replace(/[a-z]/g, "").toLowerCase();
        return appUuid + "-http-c-" +
            applicationNameUuidFormat + "-" + releaseNumberUuidFormat + "-000";
    }
}

module.exports = HttpClientInterface;