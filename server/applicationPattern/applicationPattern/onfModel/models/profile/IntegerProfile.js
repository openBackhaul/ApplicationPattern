/**
 * This class provides a stub to instantiate and generate a JSON object for a IntegerProfile. 
 * This class is a sub class for profile. 
 **/

 'use strict';

 const controlConstruct = require('../../../onfModel/models/ControlConstruct');
 const profileCollection = require('../../../onfModel/models/ProfileCollection');
 const profile = require('../../../onfModel/models/Profile');
 const onfPaths = require('../../../onfModel/constants/OnfPaths');
 const onfAttributes = require('../../../onfModel/constants/OnfAttributes');
 const fileOperation = require('../../../databaseDriver/JSONDriver');
 
 /** 
  * @extends profile
  */
 class IntegerProfile extends profile {          
 
     /**
      * @description This function returns the maxmimum value for the integer profile.
      * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
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
         
 }
 
 module.exports = IntegerProfile;