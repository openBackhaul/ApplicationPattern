/**
 * This class provides a stub to instantiate and generate a JSON object for a httpServerInterface layer protocol.
 * This class is a sub class for LayerProtocol. 
 * It provides functionality ,
 * - to read the currently configured attribute values of the http-server-interface. 
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const layerProtocol = require('../LayerProtocol');
const onfAttributes = require('../../constants/OnfAttributes');

/** 
 * @extends layerProtocol
 */
class HttpServerInterface extends layerProtocol {

    static HttpServerInterfacePac = class HttpServerInterfacePac {
        static layerProtocolName = layerProtocol.layerProtocolNameEnum.HTTP_SERVER;
        httpServerInterfaceCapability;
        static HttpServerInterfaceCapability = class HttpServerInterfaceCapability {
            applicationName;
            releaseNumber;
            applicationPurpose;
            dataUpdatePeriod;
            ownerName;
            ownerEmailAddress;
            releaseList;
            static dataUpdatePeriodEnum = {
                "real-time": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
                "1h-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_1H_PERIOD",
                "24h-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_24H_PERIOD",
                "manual": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_MANUAL",
            };
            Release = class Release {
                releaseNumber;
                releaseDate;
                changes;

                /**
                 * constructor 
                 * @param {string} releaseNumber release number of the application.
                 * @param {string} releaseDate release date of the application.
                 * @param {string} changes changes provided in the application.
                 */
                constructor(releaseNumber, releaseDate, changes) {
                    this.releaseNumber = releaseNumber;
                    this.releaseDate = releaseDate;
                    this.changes = changes;
                }
            };

            /**
             * constructor 
             * @param {string} applicationName name of the current application.
             * @param {string} releaseNumber release number of the current application.
             * @param {string} applicationPurpose purpose of the current application.
             * @param {string} dataUpdatePeriod data update period can be 24hr, 1hr, manual or realtime.
             * @param {string} ownerName name of the application owner.
             * @param {string} ownerEmailAddress email address of the application owner.
             * @param {string} releaseList release list of the application along with its history.
             */
            constructor(applicationName, releaseNumber, applicationPurpose, dataUpdatePeriod, ownerName, ownerEmailAddress, releaseList) {
                this.applicationName = applicationName;
                this.releaseNumber = releaseNumber;
                this.applicationPurpose = applicationPurpose;
                this.dataUpdatePeriod = dataUpdatePeriod;
                this.ownerName = ownerName;
                this.ownerEmailAddress = ownerEmailAddress;
                this.releaseList = releaseList;
            }
        };

        /**
         * constructor 
         * @param {string} applicationName name of the current application.
         * @param {string} releaseNumber release number of the current application.
         * @param {string} applicationPurpose purpose of the current application.
         * @param {string} dataUpdatePeriod data update period can be 24hr, 1hr, manual or realtime.
         * @param {string} ownerName name of the application owner.
         * @param {string} ownerEmailAddress email address of the application owner.
         * @param {string} releaseList release list of the application along with its history.
         */
        constructor(applicationName, releaseNumber, applicationPurpose, dataUpdatePeriod, ownerName, ownerEmailAddress, releaseList) {
            this.httpServerInterfaceCapability = new HttpServerInterfacePac.HttpServerInterfaceCapability(
                applicationName,
                releaseNumber,
                applicationPurpose,
                dataUpdatePeriod,
                ownerName,
                ownerEmailAddress,
                releaseList);
        }
    }

    /**
     * constructor 
     * @param {string} applicationName name of the current application.
     * @param {string} releaseNumber release number of the current application.
     * @param {string} applicationPurpose purpose of the current application.
     * @param {string} dataUpdatePeriod data update period can be 24hr, 1hr, manual or realtime.
     * @param {string} ownerName name of the application owner.
     * @param {string} ownerEmailAddress email address of the application owner.
     * @param {string} releaseList release list of the application along with its history.
     */
    constructor(applicationName, releaseNumber, applicationPurpose, dataUpdatePeriod, ownerName, ownerEmailAddress, releaseList) {
        super(0,
            HttpServerInterface.HttpServerInterfacePac.layerProtocolName);
        this[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC] = new HttpServerInterface.HttpServerInterfacePac(
            applicationName,
            releaseNumber,
            applicationPurpose,
            dataUpdatePeriod,
            ownerName,
            ownerEmailAddress,
            releaseList);
    }

    /**
     * @description This function returns the http server capability class.
     * @returns {Promise<Object>} httpServerCapability
     **/
    static async getHttpServerCapabilityAsync() {
        let httpServerCapability = undefined;
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
        let dataUpdatePeriodEnum = HttpServerInterface.HttpServerInterfacePac.HttpServerInterfaceCapability.dataUpdatePeriodEnum;
        for (let dataUpdatePeriodkey in dataUpdatePeriodEnum) {
            if (dataUpdatePeriodEnum[dataUpdatePeriodkey] == httpServerCapability[onfAttributes.HTTP_SERVER.DATA_UPDATE_PERIOD]) {
                httpServerCapability[onfAttributes.HTTP_SERVER.DATA_UPDATE_PERIOD] = dataUpdatePeriodkey;
            }
        }
        return httpServerCapability;
    }

    /**
     * @description This function returns the name of the current application.
     * @returns {promise} string {undefined|applicationName}.
     **/
    static async getApplicationNameAsync() {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
        return httpServerCapability[onfAttributes.HTTP_SERVER.APPLICATION_NAME];
    }

    /**
     * @description This function returns the release number of the current application.
     * @returns {Promise<String>} undefined|releaseNumber
     **/
    static async getReleaseNumberAsync() {
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
        return httpServerCapability[onfAttributes.HTTP_SERVER.RELEASE_NUMBER];
    }

    /**
     * @description This function returns the list of releases for the application.
     * @returns {Promise<Array>} []|releaseList
     **/
    static async getReleaseListAsync() {
        let releaseList = [];
        let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
            layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
        let logicalTerminationPoint = logicalTerminationPointList[0];
        let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
        let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
        releaseList = httpServerCapability[onfAttributes.HTTP_SERVER.RELEASE_LIST];
        releaseList.forEach(function (releaseListItem) {
            delete releaseListItem['local-id']
        });
        return releaseList;
    }
}

module.exports = HttpServerInterface;