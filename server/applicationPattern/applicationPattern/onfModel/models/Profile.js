/**
 * @file The Profile class models the component that represents a profile. New profile types can extend this class.
 * It proides functionality to ,
 *      - read the currently configured attribute values of the /core-model-1-4:control-construct/profile-collection/profile
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       15.03.2022
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG* 
 **/

'use strict';

const profileCollection = require("./ProfileCollection");
const onfAttributes = require('../constants/OnfAttributes');

class Profile {

  uuid;
  profileName;

  static profileNameEnum = {
    APPLICATION_PROFILE: "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
    ADMIN_PROFILE: "admin-profile-1-0:PROFILE_NAME_TYPE_ADMIN_PROFILE",
    ACTION_PROFILE: "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
    FILE_PROFILE: "file-profile-1-0:PROFILE_NAME_TYPE_FILE_PROFILE",
    INTEGER_PROFILE: "integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE",
    OAM_RECORD_PROFILE: "oam-record-profile-1-0:PROFILE_NAME_TYPE_OAM_RECORD_PROFILE",
    RESPONSE_PROFILE: "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
    SERVICE_RECORD_PROFILE: "service-record-profile-1-0:PROFILE_NAME_TYPE_SERVICE_RECORD_PROFILE"
  }
  /**
   * @constructor 
   * @param {String} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|integer|oam-record|service-record)-p-\d+$'
   * @param {String} profileName : should be any one of the Profile.profileNameEnum
   **/
  constructor(uuid, profileName) {
    this.uuid = uuid;
    this.profileName = profileName;
  }

  /**
   * @description This function returns a uuid List that matches the input profile-name.
   * @param {String} profileNameType : should be any one of the Profile.profileNameEnum
   * @returns {promise} returns profile uuid List.
   **/
  static async getUuidListAsync(profileNameType) {
    return new Promise(async function (resolve, reject) {
      let filteredProfileUuidList = [];
      try {
        let profileList = await profileCollection.getProfileListAsync();
        if (profileList != undefined) {
          for (let i = 0; i < profileList.length; i++) {
            let profileInstanceName = profileList[i][onfAttributes.PROFILE.PROFILE_NAME];
            if (profileInstanceName != undefined) {
              if (profileInstanceName == profileNameType) {
                filteredProfileUuidList.push(profileList[i][onfAttributes.GLOBAL_CLASS.UUID]);
              }
            }
          }
        }
        resolve(filteredProfileUuidList);
      } catch (error) {
        reject(undefined);
      }
    });
  }
}

module.exports = Profile;
