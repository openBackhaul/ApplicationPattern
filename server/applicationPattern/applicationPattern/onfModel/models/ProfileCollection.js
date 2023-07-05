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
// eslint-disable-next-line no-unused-vars
const Profile = require('./Profile');

class ProfileCollection {

    /**
     * @deprecated use getProfileListForProfileNameAsync
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
     * @description retrieves profiles with the given profileName
     * @param {String} profileName Profile.profileNameEnum
     * @returns {Promise<Array>} profile list or empty array
     */
    static async getProfileListForProfileNameAsync(profileName) {
        let profileList = await fileOperation.readFromDatabaseAsync(onfPaths.PROFILE);
        if (profileList !== undefined) {
            return profileList.filter(profile =>
                (profile[onfAttributes.PROFILE.PROFILE_NAME] === profileName)
            );
        }
        return [];
    }

    /**
     * @description This function returns a profile instance from /core-model-1-4:control-construct/profile-collection/profile list 
     * that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|integer|
     * ONF-record|service-record)-p-\d+$'
     * @returns {Promise<Object>} object {profile | undefined}.
     **/
    static async getProfileAsync(profileUuid) {
        let profileList = await fileOperation.readFromDatabaseAsync(onfPaths.PROFILE);
        if (profileList !== undefined) {
            return profileList.find(profile => profile[onfAttributes.GLOBAL_CLASS.UUID] === profileUuid);
        }
        return undefined;
    }

    /**
     * @description This function returns true if a profile instance exists in /core-model-1-4:control-construct/profile-collection/profile 
     * list that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|integer|ONF-record|
     * service-record)-p-\d+$'
     * @returns {Promise<Boolean>} booelan {true | false}
     **/
    static async isProfileExistsAsync(profileUuid) {
        return await ProfileCollection.getProfileAsync(profileUuid) !== undefined;
    }

    /**
     * @description This function adds a profile instance to /core-model-1-4:control-construct/profile-collection/profile list.
     * @param {Profile} : profile instance
     * @returns {Promise<Boolean>} booelan {true | false}
     **/
    static async addProfileAsync(profileInstance) {
        profileInstance = onfFormatter.modifyJsonObjectKeysToKebabCase(profileInstance);
        return await fileOperation.writeToDatabaseAsync(
            onfPaths.PROFILE,
            profileInstance,
            true);
    }

    /**
     * @description This function deletes a profile from /core-model-1-4:control-construct/profile-collection/profile list 
     * that matches the profileUuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(application|
     * integer|ONF-record|service-record)-p-\d+$'
     * @returns {Promise<Boolean>} booelan {true | false}
     **/
    static async deleteProfileAsync(profileUuid) {
        let isProfileExistsAsync = await ProfileCollection.isProfileExistsAsync(profileUuid);
        if (isProfileExistsAsync) {
            let profilePath = onfPaths.PROFILE + "=" + profileUuid;
            return await fileOperation.deletefromDatabaseAsync(profilePath);
        }
        return false;
    }
}

module.exports = ProfileCollection;
