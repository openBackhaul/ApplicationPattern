/**
 * This class provides a stub to instantiate and generate a JSON object for a ApplicationProfile. This class is a sub class for profile. 
 * This Application profile ,
 *      - is utilized by TypeApprovalApplication to store the application's approval status. 
 *      - provides functionality to read the currently configured attribute values of the application-profile
 **/

'use strict';

const controlConstruct = require('../ControlConstruct');
const profileCollection = require('../ProfileCollection');
const profile = require('../Profile');
const onfPaths = require('../../constants/OnfPaths');
const onfAttributes = require('../../constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/** 
 * @extends profile
 */
class ApplicationProfile extends profile {
    /**
     * applicationProfilePac class holds the following properties,
     * 1. applicationProfileCapability - class that holds the application name and release number.
     * 2. applicationProfileConfiguration - class that holds the application approval status.
     */
    static ApplicationProfilePac = class ApplicationProfilePac {
        static profileName = profile.profileNameEnum.APPLICATION_PROFILE;
        applicationProfileCapability;
        applicationProfileConfiguration;

        static ApplicationProfileCapability = class ApplicationProfileCapability {
            applicationName;
            releaseNumber;
            /**
             * constructor 
             * @param {string} applicationName name of the client application.
             * @param {string} releaseNumber release number of the client application.
             * This constructor will instantiate the applicationProfileCapability class
             */
            constructor(applicationName, releaseNumber) {
                this.applicationName = applicationName;
                this.releaseNumber = releaseNumber;
            }
        };

        static ApplicationProfileConfiguration = class ApplicationProfileConfiguration {
            approvalStatus;
            static approvalStatusEnum = {
                REGISTERED: "application-profile-1-0:APPROVAL_STATUS_TYPE_REGISTERED",
                APPROVED: "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED",
                BARRED: "application-profile-1-0:APPROVAL_STATUS_TYPE_BARRED",
                NOT_YET_DEFINED: "application-profile-1-0:APPROVAL_STATUS_TYPE_NOT_YET_DEFINED"
            }
            /**
             * constructor 
             * @param {string} approvalStatus approval status of the application.
             * This constructor will instantiate the applicationProfileConfiguration class
             */
            constructor(approvalStatus) {
                this.approvalStatus = approvalStatus;
            }
        };

        /**
         * constructor 
         * @param {string} applicationName name of the client application.
         * @param {string} releaseNumber release number of the client application.
         * @param {string} approvalStatus approval status of the client application.
         * This constructor will instantiate the ApplicationProfilePac class
         */
        constructor(applicationName, releaseNumber, approvalStatus) {
            this.applicationProfileCapability = new ApplicationProfilePac.
            ApplicationProfileCapability(
                applicationName,
                releaseNumber);
            this.applicationProfileConfiguration = new ApplicationProfilePac.
            ApplicationProfileConfiguration(
                approvalStatus);
        }
    }

    /**
     * constructor 
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @param {string} applicationName : name of the client application.
     * @param {string} releaseNumber : release number of the client application.
     * @param {string} approvalStatus : approval status of the client application.
     * This constructor will instantiate the ApplicationProfile class
     */
    constructor(uuid, applicationName, releaseNumber, approvalStatus) {
        super(
            uuid,
            ApplicationProfile.ApplicationProfilePac.profileName
        );
        this[onfAttributes.APPLICATION_PROFILE.PAC] = new ApplicationProfile.ApplicationProfilePac(
            applicationName,
            releaseNumber,
            approvalStatus
        );
    }

    /**
     * @description This function returns the approval status for the provided application profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @returns {promise} string {approvalStatus}
     **/
    static async getApprovalStatusAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let approvalStatus;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ApplicationProfile.ApplicationProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let applicationProfilePac = profile[
                                onfAttributes.APPLICATION_PROFILE.PAC];
                            let applicationProfileConfiguration = applicationProfilePac[
                                onfAttributes.APPLICATION_PROFILE.CONFIGURATION];
                            approvalStatus = applicationProfileConfiguration[
                                onfAttributes.APPLICATION_PROFILE.APPROVAL_STATUS];
                        }
                    }
                }
                resolve(approvalStatus);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the application name for the provided application profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @returns {promise} string {applicationName}
     **/
    static async getApplicationNameAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let applicationName;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ApplicationProfile.ApplicationProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let applicationProfilePac = profile[
                                onfAttributes.APPLICATION_PROFILE.PAC];
                            let applicationProfileCapability = applicationProfilePac[
                                onfAttributes.APPLICATION_PROFILE.CAPABILITY];
                            applicationName = applicationProfileCapability[
                                onfAttributes.APPLICATION_PROFILE.APPLICATION_NAME];
                        }
                    }
                }
                resolve(applicationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the application release number for the provided application profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-application-p-\d+$'
     * @returns {promise} string {applicationReleaseNumber}
     **/
    static async getApplicationReleaseNumberAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let applicationReleaseNumber;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ApplicationProfile.ApplicationProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let applicationProfilePac = profile[
                                onfAttributes.APPLICATION_PROFILE.PAC];
                            let applicationProfileCapability = applicationProfilePac[
                                onfAttributes.APPLICATION_PROFILE.CAPABILITY];
                            applicationReleaseNumber = applicationProfileCapability[
                                onfAttributes.APPLICATION_PROFILE.RELEASE_NUMBER];
                        }
                    }
                }
                resolve(applicationReleaseNumber);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the approval status for the provided application and release number.
     * @param {String} applicationName name of the application .
     * @param {String} releaseNumber release number of the application .
     * @returns {promise} string {approvalStatus}
     **/
    static async getApprovalStatusOfTheApplicationAndReleaseNumberAsync(applicationName, releaseNumber) {
        return new Promise(async function (resolve, reject) {
            let approvalStatus;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ApplicationProfile.ApplicationProfilePac.profileName) {
                        let applicationProfilePac = profile[
                            onfAttributes.APPLICATION_PROFILE.PAC];
                        let applicationProfileCapability = applicationProfilePac[
                            onfAttributes.APPLICATION_PROFILE.CAPABILITY];
                        let _applicationName = applicationProfileCapability[
                            onfAttributes.APPLICATION_PROFILE.APPLICATION_NAME];
                        let _releaseNumber = applicationProfileCapability[
                            onfAttributes.APPLICATION_PROFILE.RELEASE_NUMBER];
                        if (applicationName == _applicationName &&
                            releaseNumber == _releaseNumber) {
                            let applicationProfileConfiguration = applicationProfilePac[
                                onfAttributes.APPLICATION_PROFILE.CONFIGURATION];
                            approvalStatus = applicationProfileConfiguration[
                                onfAttributes.APPLICATION_PROFILE.APPROVAL_STATUS];
                        }
                    }
                }
                resolve(approvalStatus);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the profileUuid for the provided application and release number.
     * @param {String} applicationName : name of the application .
     * @param {String} releaseNumber : release number of the application .
     * @returns {promise} string {profileUuid}
     **/
    static async getProfileUuidAsync(applicationName, releaseNumber) {
        return new Promise(async function (resolve, reject) {
            let profileUuid;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ApplicationProfile.ApplicationProfilePac.profileName) {
                        let applicationProfilePac = profile[
                            onfAttributes.APPLICATION_PROFILE.PAC];
                        let applicationProfileCapability = applicationProfilePac[
                            onfAttributes.APPLICATION_PROFILE.CAPABILITY];
                        let _applicationName = applicationProfileCapability[
                            onfAttributes.APPLICATION_PROFILE.APPLICATION_NAME];
                        let _releaseNumber = applicationProfileCapability[
                            onfAttributes.APPLICATION_PROFILE.RELEASE_NUMBER];
                        if (applicationName == _applicationName &&
                            releaseNumber == _releaseNumber) {
                            profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        }
                    }
                }
                resolve(profileUuid);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns true if a profile exists for the provided application and release number.
     * @param {String} applicationName name of the application .
     * @param {String} releaseNumber release number of the application .
     * @returns {promise} boolean {true|false}
     **/
    static async isProfileExistsAsync(applicationName, releaseNumber) {
        return new Promise(async function (resolve, reject) {
            let isProfileExists = false;
            try {
                let profileUuid = await ApplicationProfile.getProfileUuidAsync(applicationName, releaseNumber);
                if (profileUuid != undefined) {
                    isProfileExists = true;
                }
                resolve(isProfileExists);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the approval-status for the provided application-name and release-number
     * @param {String} applicationName name of the application .
     * @param {String} releaseNumber release number of the application .
     * @param {String} approvalStatus approval status of the application .
     * @returns {promise} boolean {true|false}
     **/
    static async setApprovalStatusAsync(applicationName, releaseNumber, approvalStatus) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let profileUuid = await ApplicationProfile.getProfileUuidAsync(applicationName, releaseNumber);
                let approvalStatusPath = onfPaths.APPLICATION_PROFILE_APPROVAL_STATUS.replace(
                    "{profileUuid}", profileUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    approvalStatusPath,
                    approvalStatus,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function creates a new application profile.
     * @param {String} applicationName name of the application .
     * @param {String} releaseNumber release number of the application .
     * @param {String} approvalStatus approval status of the application .
     * @returns {promise} object {ApplicationProfile}
     **/
    static async createProfileAsync(applicationName, releaseNumber, approvalStatus) {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid = await ApplicationProfile.generateNextUuidAsync();
                let applicationProfile = new ApplicationProfile(
                    profileUuid,
                    applicationName,
                    releaseNumber,
                    approvalStatus);
                resolve(applicationProfile);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the next available uuid for the ApplicationProfile.
     * @returns {promise} string {uuid}
     **/
    static async generateNextUuidAsync() {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid;
                let initialProfileSuffix = "-application-p-0000";
                let uuidList = await profile.getUuidListAsync(
                    profile.profileNameEnum.APPLICATION_PROFILE);
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

module.exports = ApplicationProfile;