/**
 * The ProfileCollection class models the component that represents profiles-collection in the core-model-1-4:control-construct.
 * It proides functionality to ,
 *      - read the currently configured attribute values of the /core-model-1-4:control-construct/profile-collection
 *      - configure the profile list
 **/

'use strict';

const onfFormatter = require('../utility/OnfAttributeFormatter');
const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');
const fileOperation = require('../../databaseDriver/JSONDriver');

class ProfileCollection {

    /**
     * @description This function returns the profile list from /core-model-1-4:control-construct/profile-collection/profile.
     * @returns {promise} list {profile list}
     **/
    static async getProfileListAsync() {
        return new Promise(async function (resolve, reject) {
            try {
                let profileList = await fileOperation.readFromDatabaseAsync(
                    onfPaths.PROFILE
                );
                resolve(profileList);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns a profile instance from /core-model-1-4:control-construct/profile-collection/profile list 
     * that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|integer|
     * ONF-record|service-record)-p-\d+$'
     * @returns {promise} object {profile | undefined}.
     **/
    static async getProfileAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let profile;
                let profileList = await fileOperation.readFromDatabaseAsync(
                    onfPaths.PROFILE
                    );
                if (profileList != undefined) {
                    for (let i = 0; i < profileList.length; i++) {
                        let _profile = profileList[i];
                        let _profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            profile = _profile;
                        }
                    }
                }
                resolve(profile);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns true if a profile instance exists in /core-model-1-4:control-construct/profile-collection/profile 
     * list that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|integer|ONF-record|
     * service-record)-p-\d+$'
     * @returns {promise} booelan {true | false}
     **/
    static async isProfileExistsAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let isProfileExists = false;
            try {
                let profileList = await fileOperation.readFromDatabaseAsync(
                    onfPaths.PROFILE
                    );
                if (profileList != undefined) {
                    for (let i = 0; i < profileList.length; i++) {
                        let profile = profileList[i];
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            isProfileExists = true;
                        }
                    }
                }
                resolve(isProfileExists);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function adds a profile instance to /core-model-1-4:control-construct/profile-collection/profile list.
     * @param {profileInstance} : profile instance could be any one of ApplicationProfile, IntegerProfile, ONFRecordProfile, 
     * ServiceRecordProfile.
     * @returns {promise} booelan {true | false}
     **/
    static async addProfileAsync(profileInstance) {
        return new Promise(async function (resolve, reject) {
            let isCreated = false;
            try {
                profileInstance = onfFormatter.modifyJsonObjectKeysToKebabCase(profileInstance);
                isCreated = await fileOperation.writeToDatabaseAsync(
                    onfPaths.PROFILE, 
                    profileInstance, 
                    true);
                resolve(isCreated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function deletes a profile from /core-model-1-4:control-construct/profile-collection/profile list 
     * that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|
     * integer|ONF-record|service-record)-p-\d+$'
     * @returns {promise} booelan {true | false}
     **/
    static async deleteProfileAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let isDeleted = false;
            try {
                let isProfileExistsAsync = await ProfileCollection.isProfileExistsAsync(profileUuid);
                if (isProfileExistsAsync) {
                    let profilePath = onfPaths.PROFILE + "=" + profileUuid;
                    isDeleted = await fileOperation.deletefromDatabaseAsync(
                        profilePath, 
                        profileUuid, 
                        true);
                }
                resolve(isDeleted);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = ProfileCollection;