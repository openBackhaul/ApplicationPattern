/**
 * This class provides a stub to instantiate and generate a JSON object for a ServiceRecordProfile. 
 * This class is a sub class for profile. 
 **/

 'use strict';

 const controlConstruct = require('../../../onfModel/models/ControlConstruct');
 const profileCollection = require('../../../onfModel/models/ProfileCollection');
 const profile = require('../../../onfModel/models/Profile');
 const onfPaths = require('../../../onfModel/constants/OnfPaths');
 const onfAttributes = require('../../../onfModel/constants/OnfAttributes');
 const fileOperation = require('../../../databaseDriver/JSONDriver');
 const IntegerProfile = require('../../../onfModel/models/profile/IntegerProfile');
 
 /** 
  * @extends profile
  */
 class ServiceRecordProfile extends profile {
     /**
      * serviceRecordProfilePac class holds the following properties,
      * 1.serviceRecordProfileCapability - class that holds the serviceRecordistratorName.
      */
     static ServiceRecordProfilePac = class ServiceRecordProfilePac {
         static profileName = profile.profileNameEnum.SERVICE_RECORD_PROFILE;
         serviceRecordProfileCapability;
 
         static ServiceRecordProfileCapability = class ServiceRecordProfileCapability {
             serviceRecord;
             /**
              * constructor 
              * @param {JsonObject} serviceRecord the entire record with all the required attributes.
              * This constructor will instantiate the serviceRecordProfileCapability class
              */
             constructor(serviceRecord) {
                 this.serviceRecord = serviceRecord;
             }
         };
 
         /**
          * constructor 
          * @param {JsonObject} serviceRecord the entire record with all the required attributes.
          * This constructor will instantiate the ServiceRecordProfilePac class
          */
         constructor(serviceRecord) {
             this.serviceRecordProfileCapability = serviceRecord;
         }
     }
 
     /**
      * constructor 
      * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-serviceRecord-p-\d+$'
      * @param {JsonObject} serviceRecord the entire record with all the required attributes.
      * This constructor will instantiate the ServiceRecordProfile class
      */
     constructor(uuid, serviceRecord) {
         super(
             uuid,
             ServiceRecordProfile.ServiceRecordProfilePac.profileName
         );
         this[onfAttributes.SERVICE_RECORD_PROFILE.PAC] = new ServiceRecordProfile.ServiceRecordProfilePac(
             serviceRecord
         );
     }
 
     /**
      * @description This function creates a new serviceRecord profile.
      * @param {JsonObject} serviceRecord name of the serviceRecord.
      * @returns {promise} object {ServiceRecordProfile}
      **/
     static async createProfileAsync(serviceRecord) {
         return new Promise(async function (resolve, reject) {
             try {
                 let profileUuid = await ServiceRecordProfile.generateNextUuidAsync();
                 let serviceRecordProfile = new ServiceRecordProfile(
                     profileUuid,
                     serviceRecord
                 );
                 resolve(serviceRecordProfile);
             } catch (error) {
                 reject(error);
             }
         });
     }
 
     /**
      * @description This function returns the next available uuid for the ServiceRecordProfile.
      * @returns {promise} string {uuid}
      **/
     static async generateNextUuidAsync() {
         return new Promise(async function (resolve, reject) {
             try {
                 let profileUuid;
                 let initialProfileSuffix = "-service-record-p-0000";
                 let uuidList = await profile.getUuidListAsync(
                     profile.profileNameEnum.SERVICE_RECORD_PROFILE);
                 let isMaximumThresholdReached = await ServiceRecordProfile.isMaximumThresholdReached(uuidList);
                 if (isMaximumThresholdReached) {
                     profileUuid = uuidList[0];
                     await profileCollection.deleteProfileAsync(profileUuid);
                 } else {
                     if (uuidList != undefined && uuidList.length > 0) {
                         uuidList.sort();
                         let lastUuid = uuidList[uuidList.length - 1];
                         let uuidPrefix = lastUuid.substring(
                             0,
                             lastUuid.lastIndexOf("-") + 1);
                         let uuidNumber = lastUuid.substring(
                             lastUuid.lastIndexOf("-") + 1,
                             lastUuid.length);
                         profileUuid = uuidPrefix + (
                             parseInt(uuidNumber) + 1).toString().padStart(6, 0);
                     } else {
                         let coreModelUuid = await controlConstruct.getUuidAsync();
                         profileUuid = coreModelUuid + initialProfileSuffix;
                     }
                 }
                 resolve(profileUuid);
             } catch (error) {
                 reject(error);
             }
         });
     }
 
     /**
      * @description This function returns true if maxmimum profile entry threshold is reached.
      * @param uuidList list of Service profiles
      * @returns {promise} boolean {true|false}
      **/
     static async isMaximumThresholdReached(uuidList) {
         return new Promise(async function (resolve, reject) {
             let isMaximumThresholdReached = false;
             try {
                 let maximum = await IntegerProfile.getMaximumEntriesAsync();
                 let profileCount = uuidList.length;
                 if (profileCount >= maximum) {
                     isMaximumThresholdReached = true;
                 }
                 resolve(isMaximumThresholdReached);
             } catch (error) {
                 reject(error);
             }
         });
     }
 }
 
 module.exports = ServiceRecordProfile;