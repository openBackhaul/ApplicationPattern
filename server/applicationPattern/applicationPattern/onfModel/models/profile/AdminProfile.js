/**
 * This class provides a stub to instantiate and generate a JSON object for a AdminProfile. This class is a sub class for profile. 
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
class AdminProfile extends profile {
    /**
     * adminProfilePac class holds the following properties,
     * 1.adminProfileCapability - class that holds the administratorName.
     * 2.adminProfileConfiguration - class that holds the admin information.
     */
    static AdminProfilePac = class AdminProfilePac {
        static profileName = profile.profileNameEnum.ADMIN_PROFILE;
        adminProfileCapability;
        adminProfileConfiguration;

        static AdminProfileCapability = class AdminProfileCapability {
            administratorName;
            /**
             * constructor 
             * @param {string} administratorName name of the admin.
             * This constructor will instantiate the adminProfileCapability class
             */
            constructor(administratorName) {
                this.administratorName = administratorName;
            }
        };

        static AdminProfileConfiguration = class AdminProfileConfiguration {
            userName;
            authorization;
            allowedMethods;

            static allowedMethodsEnum = {
                GET: "admin-profile-1-0:ALLOWED_METHODS_TYPE_GET",
                ALL: "admin-profile-1-0:ALLOWED_METHODS_TYPE_ALL"
            }
            /**
             * constructor 
             * @param {string} userName name of the user.
             * @param {string} authorization authorization code of the user.
             * @param {string} allowedMethods allowed methods as per the allowedMethodsEnum.
             * This constructor will instantiate the adminProfileConfiguration class
             */
            constructor(userName, authorization, allowedMethods) {
                this.userName = userName;
                this.authorization = authorization;
                this.allowedMethods = allowedMethods;
            }
        };

        /**
         * constructor 
         * @param {string} administratorName name of the admin.
         * @param {string} userName name of the user.
         * @param {string} authorization authorization code of the user.
         * @param {string} allowedMethods allowed methods as per the allowedMethodsEnum.
         * This constructor will instantiate the AdminProfilePac class
         */
        constructor(administratorName, userName, authorization, allowedMethods) {
            this.adminProfileCapability = new AdminProfilePac.
            AdminProfileCapability(
                administratorName);
            this.adminProfileConfiguration = new AdminProfilePac.
            AdminProfileConfiguration(
                userName,
                authorization,
                allowedMethods
            );
        }
    }

    /**
     * constructor 
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-admin-p-\d+$'
     * @param {string} administratorName name of the admin.
     * @param {string} userName name of the user.
     * @param {string} authorization authorization code of the user.
     * @param {string} allowedMethods allowed methods as per the allowedMethodsEnum.
     * This constructor will instantiate the AdminProfile class
     */
    constructor(uuid, administratorName, userName, authorization, allowedMethods) {
        super(
            uuid,
            AdminProfile.AdminProfilePac.profileName
        );
        this[onfAttributes.ADMIN_PROFILE.PAC] = new AdminProfile.AdminProfilePac(
            administratorName,
            userName,
            authorization,
            allowedMethods
        );
    }

    /**
     * @description This function returns the approval status for the provided application profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @returns {promise} string {approvalStatus}
     **/
    static async isAuthorizedAsync(authorization, allowedMethods) {
        return new Promise(async function (resolve, reject) {
            let isAuthorized = false;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == AdminProfile.AdminProfilePac.profileName) {
                        let adminProfilePac = profile[onfAttributes.ADMIN_PROFILE.PAC];
                        let adminProfileConfiguration = adminProfilePac[onfAttributes.ADMIN_PROFILE.CONFIGURATION];
                        let _authorization = adminProfileConfiguration[onfAttributes.ADMIN_PROFILE.AUTHORIZATION];
                        let _allowedMethods = adminProfileConfiguration[onfAttributes.ADMIN_PROFILE.ALLOWED_METHODS];
                        if (_authorization == authorization && (_allowedMethods == allowedMethods || 
                            _allowedMethods == AdminProfile.AdminProfilePac.AdminProfileConfiguration.allowedMethodsEnum.ALL)) {
                            isAuthorized = true;
                        }
                    }
                }
                resolve(isAuthorized);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the approval status for the provided application profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @returns {promise} string {approvalStatus}
     **/
    static async isAuthorizationExistAsync(authorization) {
        return new Promise(async function (resolve, reject) {
            let isAuthorizationExist = false;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == AdminProfile.AdminProfilePac.profileName) {
                        let adminProfilePac = profile[onfAttributes.ADMIN_PROFILE.PAC];
                        let adminProfileConfiguration = adminProfilePac[onfAttributes.ADMIN_PROFILE.CONFIGURATION];
                        let _authorization = adminProfileConfiguration[onfAttributes.ADMIN_PROFILE.AUTHORIZATION];
                        let _allowedMethods = adminProfileConfiguration[onfAttributes.ADMIN_PROFILE.ALLOWED_METHODS];
                        if (_authorization == authorization) {
                            isAuthorizationExist = true;
                        }
                    }
                }
                resolve(isAuthorizationExist);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function creates a new admin profile.
     * @param {string} administratorName name of the admin.
     * @param {string} userName name of the user.
     * @param {string} authorization authorization code of the user.
     * @param {string} allowedMethods allowed methods as per the allowedMethodsEnum.
     * @returns {promise} object {AdminProfile}
     **/
    static async createProfileAsync(administratorName, userName, authorization, allowedMethods) {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid = await AdminProfile.generateNextUuidAsync();
                let adminProfile = new AdminProfile(
                    profileUuid,
                    administratorName,
                    userName,
                    authorization,
                    allowedMethods
                );
                resolve(adminProfile);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the next available uuid for the AdminProfile.
     * @returns {promise} string {uuid}
     **/
    static async generateNextUuidAsync() {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid;
                let initialProfileSuffix = "-admin-p-0000";
                let uuidList = await profile.getUuidListAsync(
                    profile.profileNameEnum.ADMIN_PROFILE);
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
                        parseInt(uuidNumber) + 1).toString().padStart(4, 0);
                } else {
                    let coreModelUuid = await controlConstruct.getUuidAsync();
                    profileUuid = coreModelUuid + initialProfileSuffix;
                }
                resolve(profileUuid);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = AdminProfile;