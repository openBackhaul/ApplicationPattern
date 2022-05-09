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
     * @returns {promise} object {httpServerCapability}.
     **/
    static getHttpServerCapabilityAsync() {
        return new Promise(async function (resolve, reject) {
            let httpServerCapability = undefined;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
                httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
                resolve(httpServerCapability);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the name of the current application.
     * @returns {promise} string {undefined|applicationName}.
     **/
    static getApplicationNameAsync() {
        return new Promise(async function (resolve, reject) {
            let applicationName = undefined;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
                let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];
                applicationName = httpServerCapability[onfAttributes.HTTP_SERVER.APPLICATION_NAME];
                resolve(applicationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the release number of the current application.
     * @returns {promise} string {undefined|releaseNumber}.
     **/
    static getReleaseNumberAsync() {
        return new Promise(async function (resolve, reject) {
            let releaseNumber = undefined;
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
                let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];                
                releaseNumber = httpServerCapability[onfAttributes.HTTP_SERVER.RELEASE_NUMBER];
                resolve(releaseNumber);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the list of releases for the application.
     * @returns {promise} list {[]|releaseList}.
     **/
    static getReleaseListAsync() {
        return new Promise(async function (resolve, reject) {
            let releaseList = [];
            try {
                let logicalTerminationPointList = await controlConstruct.getLogicalTerminationPointListAsync(
                    layerProtocol.layerProtocolNameEnum.HTTP_SERVER);
                let logicalTerminationPoint = logicalTerminationPointList[0];
                let layerPortocol = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL][0];
                let httpServerPac = layerPortocol[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
                let httpServerCapability = httpServerPac[onfAttributes.HTTP_SERVER.CAPABILITY];      
                releaseList = httpServerCapability[onfAttributes.HTTP_SERVER.RELEASE_LIST];
                resolve(releaseList);
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = HttpServerInterface;