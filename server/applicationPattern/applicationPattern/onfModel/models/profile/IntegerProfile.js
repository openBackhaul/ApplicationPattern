/**
 * This class provides a stub to instantiate and generate a JSON object for a IntegerProfile. 
 * This class is a sub class for profile. 
 **/

 'use strict';

 const profileCollection = require('../../../onfModel/models/ProfileCollection');
 const profile = require('../../../onfModel/models/Profile');
 const onfAttributes = require('../../../onfModel/constants/OnfAttributes');
 
 /** 
  * @extends profile
  */
 class IntegerProfile extends profile {          
 
     /**
      * @deprecated Since version 1.0.2 Will be deleted in version 2.0.0. Use getMaximumAsync instead.
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} profileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
     static async getMaximumEntriesAsync() {
         return new Promise(async function (resolve, reject) {
             let maximum;
             try {
                 let profileList = await profileCollection.getProfileListAsync();
                 for (let i = 0; i < profileList.length; i++) {
                     let profileInstance = profileList[i];
                     let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                     if (profileName == profile.profileNameEnum.INTEGER_PROFILE) {
                         let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                         let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CONFIGURATION];
                         maximum = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.INTEGER_VALUE];                         
                     }
                 }
                 resolve(maximum);
             } catch (error) {
                 reject(error);
             }
         });
     }

     /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
      static async getIntegerValueAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let integerValue;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CONFIGURATION];
                        integerValue = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.INTEGER_VALUE];                         
                    }
                }
                resolve(integerValue);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
     static async getMaximumAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let maximum;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CAPABILITY];
                        maximum = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.MAXIMUM];                         
                    }
                }
                resolve(maximum);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
     static async getMinimumAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let minimum;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CAPABILITY];
                        minimum = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.MINIMUM];                         
                    }
                }
                resolve(minimum);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
     static async getIntegerNameAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let integerName;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CAPABILITY];
                        integerName = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.INTEGER_NAME];                         
                    }
                }
                resolve(integerName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
      * @returns {promise} string {approvalStatus}
      **/
     static async getUnitAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let unit;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CAPABILITY];
                        unit = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.UNIT];                         
                    }
                }
                resolve(unit);
            } catch (error) {
                reject(error);
            }
        });
    }
         
 }
 
 module.exports = IntegerProfile;