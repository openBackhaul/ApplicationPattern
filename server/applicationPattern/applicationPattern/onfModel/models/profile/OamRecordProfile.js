/**
 * @file This class provides a stub to instantiate and generate a JSONObject for a OamRecordProfile
 * This class is a sub class for profile
 **/

 'use strict';

 const profile = require('../../../onfModel/models/Profile');
 const controlConstruct = require('../../../onfModel/models/ControlConstruct');
 const profileCollection = require('../../../onfModel/models/ProfileCollection');
 const integerProfile = require('../../../onfModel/models/profile/IntegerProfile');
 const onfAttributes = require('../../../onfModel/constants/OnfAttributes');
 
 /** 
  * @extends profile
  */
 class OamRecordProfile extends profile {
     /**
      * OamRecordProfilePac class holds below mentioned property:
      * profile Name - name of the profile 
      * OamRecordProfileCapability - class that holds the oamRecord
      */
     static OamRecordProfilePac = class OamRecordProfilePac {
         static profileName = profile.profileNameEnum.OAM_RECORD_PROFILE;
         oamRecordProfileCapability;
 
 
         static OamRecordProfileCapability = class OamRecordProfileCapability {
             oamRecord;
 
             static methodEnum = {
                 CONNECT: "oam-record-profile-1-0:METHOD_TYPE_CONNECT",
                 DELETE: "oam-record-profile-1-0:METHOD_TYPE_DELETE",
                 GET: "oam-record-profile-1-0:METHOD_TYPE_GET",
                 HEAD: "oam-record-profile-1-0:METHOD_TYPE_HEAD",
                 OPTIONS: "oam-record-profile-1-0:METHOD_TYPE_OPTIONS",
                 PATCH: "oam-record-profile-1-0:METHOD_TYPE_PATCH",
                 POST: "oam-record-profile-1-0:METHOD_TYPE_POST",
                 PUT: "oam-record-profile-1-0:METHOD_TYPE_PUT",
                 TRACE: "oam-record-profile-1-0:METHOD_TYPE_TRACE"
             };
 
             /**
              * constructor 
              * @param {string} oamRecord : oam record.   
              * This constructor will instantiate the OamRecordProfileCapability class
              */
             constructor(oamRecord) {
                 this.oamRecord = oamRecord;
             }
         };
 
         /**
          * constructor 
          * @param {string} oamRecord : oam record.   
          * This constructor will instantiate the OamRecordProfilePac class
          */
         constructor(oamRecord) {
             this.oamRecordProfileCapability = oamRecord;
         }
     }
 
     /**
      * constructor 
      * @param {string} oamRecord : oam record.   
      * This constructor will instantiate the OamRecordProfile class
      */
     constructor(uuid, oamRecord) {
         super(uuid, OamRecordProfile.OamRecordProfilePac.profileName);
         this[onfAttributes.OAM_RECORD_PROFILE.PAC] = new OamRecordProfile.OamRecordProfilePac(oamRecord);
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
                 let maximum = await integerProfile.getMaximumEntriesAsync();
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
 
     /**
      * @description This function returns the next available uuid for the Oam Record Profile.
      * @returns {promise} returns the next free uuid instance that can be used for the Oam Record Profile creation.
      **/
     static async generateNextUuidAsync() {
         return new Promise(async function (resolve, reject) {
             try {
                 let nextUuid;
                 let initialProfileSuffix = "oam-record-p-000000";
 
                 let uuidList = await profile.getUuidListAsync(profile.profileNameEnum.OAM_RECORD_PROFILE);
                 let isMaximumThresholdReached = await OamRecordProfile.isMaximumThresholdReached(uuidList);
 
                 if (uuidList != undefined && isMaximumThresholdReached) {
                     nextUuid = uuidList[0];
                     await profileCollection.deleteProfileAsync(nextUuid);
                 } else if (uuidList != undefined && uuidList.length > 0) {
                     uuidList.sort();
                     let lastUuid = uuidList[uuidList.length - 1];
                     let uuidPrefix = lastUuid.substring(0, lastUuid.lastIndexOf("-") + 1);
                     let uuidNumber = lastUuid.substring(lastUuid.lastIndexOf("-") + 1, lastUuid.length);
                     nextUuid = uuidPrefix + (parseInt(uuidNumber) + 1).toString().padStart(6, 0);
                 } else {
                     let coreModelUuid = await controlConstruct.getUuidAsync();
                     nextUuid = coreModelUuid + initialProfileSuffix;
                 }
                 resolve(nextUuid);
             } catch (error) {
                 reject(error);
             }
         });
     }
 
 
     /**
      * @description This function returns list of Recorded Oam Requests.
      * @returns {promise} returns the list of records.
      **/
     static async getlistOfRecordedOamRequestsAsync() {
         return new Promise(async function (resolve, reject) {
             let oamRecordList = [];
             try {
                 let profilesList = await profileCollection.getProfileListAsync();
                 if (profilesList != undefined && profilesList.length != 0) {
                     for (let i = 0; i < profilesList.length; i++) {
                         let profileInstance = profilesList[i];
                         let profileInstanceName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
 
                         if (profileInstanceName === profile.profileNameEnum.OAM_RECORD_PROFILE) {
                             let oamRecordProfilePac = profileInstance[onfAttributes.OAM_RECORD_PROFILE.PAC];
                             let oamRecordProfileCapability = oamRecordProfilePac[onfAttributes.OAM_RECORD_PROFILE.CAPABILITY];
                             let oamRecordMethod = oamRecordProfileCapability[onfAttributes.OAM_RECORD_PROFILE.METHOD];
 
                             let methodEnum = OamRecordProfile.OamRecordProfilePac.OamRecordProfileCapability.methodEnum;
                             for (let methodKey in methodEnum) {
                                 if (methodEnum[methodKey] == oamRecordMethod) {
                                     oamRecordProfileCapability.method = methodKey;
                                 }
                             }
                             oamRecordList.push(oamRecordProfileCapability);
                         }
                     }
                     resolve(oamRecordList);
                 }
             } catch (error) {
                 reject(error);
             }
         });
     }
 
     /**
      * @description This function returns list of Recorded Oam Requests for same application.
      * @returns {promise} returns the list of records.
      **/
     static async getRecordsListForApplicationAsync(applicationName) {
         return new Promise(async function (resolve, reject) {
             let recordsListOfSameApplication = [];
             try {
 
                 let profilesList = await profileCollection.getProfileListAsync();
                 if (profilesList != undefined && profilesList.length != 0) {
                     for (let i = 0; i < profilesList.length; i++) {
                         let profileInstance = profilesList[i];
                         let profileInstanceName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
 
                         if (profileInstanceName === profile.profileNameEnum.OAM_RECORD_PROFILE) {
                             let oamRecordProfilePac = profileInstance[onfAttributes.OAM_RECORD_PROFILE.PAC];
                             let oamRecordProfileCapability = oamRecordProfilePac[onfAttributes.OAM_RECORD_PROFILE.CAPABILITY];
                             let oamRecordApplicationName = oamRecordProfileCapability[onfAttributes.OAM_RECORD_PROFILE.APPLICATION_NAME];
                             if (oamRecordApplicationName == applicationName) {
                                 let oamRecordMethod = oamRecordProfileCapability[onfAttributes.OAM_RECORD_PROFILE.METHOD];
                                 let methodEnum = OamRecordProfile.OamRecordProfilePac.OamRecordProfileCapability.methodEnum;
                                 for (let methodKey in methodEnum) {
                                     if (methodEnum[methodKey] == oamRecordMethod) {
                                         oamRecordProfileCapability.method = methodKey;
                                     }
                                 }
                                 recordsListOfSameApplication.push(oamRecordProfileCapability);
                             }
                         }
                     }
                     resolve(recordsListOfSameApplication);
                 }
             } catch (error) {
                 reject(undefined);
             }
         });
     }
 
     /**
      * @description This function creates a new profile
      * @param {json object} profileAttributes json object for the profile creation
      * @returns {promise} returns uuid of the created profile
      **/
     static async createProfileAsync(oamRecord) {
         return new Promise(async function (resolve, reject) {
             try {
                 let uuid = await OamRecordProfile.generateNextUuidAsync();
                 oamRecord.method = OamRecordProfile.OamRecordProfilePac.OamRecordProfileCapability.methodEnum[oamRecord.method];
 
                 let oamRecordProfile = new OamRecordProfile(
                     uuid,
                     oamRecord
                 );
                 resolve(oamRecordProfile);
             } catch (error) {
                 reject(undefined);
             }
         });
     }
 }
 
 module.exports = OamRecordProfile;