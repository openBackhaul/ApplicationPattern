/**
 * This class provides a stub to instantiate and generate a JSON object for a FileProfile. 
 * This class is a sub class for profile. 
 **/

'use strict';

const fileSystem = require('fs');
const profileCollection = require('../../../onfModel/models/ProfileCollection');
const profile = require('../../../onfModel/models/Profile');
const onfPaths = require('../../../onfModel/constants/OnfPaths');
const onfAttributes = require('../../../onfModel/constants/OnfAttributes');
const fileOperation = require('../../../databaseDriver/JSONDriver');

/** 
 * @extends profile
 */
class FileProfile extends profile {
    /**
     * FileProfilePac class holds the following properties,
     * 1.fileProfileCapability - class that holds the fileIdentifier, fileProfileConfiguration.
     * 2.fileProfileConfiguration - class that holds the fileName, operation.
     */
    static FileProfilePac = class FileProfilePac {
        static profileName = profile.profileNameEnum.FILE_PROFILE;
        fileProfileCapability;
        fileProfileConfiguration;

        static FileProfileCapability = class FileProfileCapability {
            fileIdentifier;
            fileDescription;

            /**
             * constructor 
             * @param {string} fileIdentifier Identifier for the file.
             * @param {string} fileDescription Description for the file.
             * This constructor will instantiate the fileProfileCapability class
             */
            constructor(fileIdentifier, fileDescription) {
                this.fileIdentifier = fileIdentifier;
                this.fileDescription = fileDescription;
            }
        };

        static FileProfileConfiguration = class FileProfileConfiguration {
            fileName;
            operation;

            static operationEnum = {
                READ_ONLY: "file-profile-1-0:OPERATION_TYPE_READ_ONLY",
                READ_WRITE: "file-profile-1-0:OPERATION_TYPE_READ_WRITE",
                OFF: "file-profile-1-0:OPERATION_TYPE_OFF",
                NOT_YET_DEFINED: "file-profile-1-0:OPERATION_TYPE_NOT_YET_DEFINED"
            }

            /**
             * constructor 
             * @param {string} fileName name of the file.
             * @param {string} operation operation.
             * This constructor will instantiate the fileProfileConfiguration class
             */
            constructor(fileName, operation) {
                this.fileName = fileName;
                this.operation = operation;
            }
        };

        /**
         * constructor 
         * @param {string} fileIdentifier Identifier for the file.
         * @param {string} fileDescription Description for the file.
         * @param {string} fileName Name of the file.
         * @param {string} operation operation.
         * This constructor will instantiate the FileProfilePac class
         */
        constructor(fileIdentifier, fileDescription, fileName, operation) {
            this.fileProfileCapability = new FileProfilePac.
                FileProfileCapability(
                    fileIdentifier, fileDescription);
            this.FileProfileConfiguration = new FileProfilePac.
                FileProfileConfiguration(
                    fileName, operation);
        }
    }

    /**
     * constructor 
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {string} fileIdentifier Identifier for the file.
     * @param {string} fileDescription Description for the file.
     * @param {string} fileName name of the file.
     * @param {string} operation operation.
     * This constructor will instantiate the FileProfile class
     */
    constructor(uuid, fileIdentifier, fileDescription, fileName, operation) {
        super(
            uuid,
            FileProfile.FileProfilePac.profileName
        );
        this[onfAttributes.FILE_PROFILE.PAC] = new FileProfile.FileProfilePac(
            fileIdentifier,
            fileDescription,
            fileName,
            operation
        );
    }

    /**
     * @description This function returns the file identifier for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {fileIdentifier}
     **/
    static async getFileIdentifier(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let fileIdentifier;
                let profileList = await profileCollection.getProfileListForProfileNameAsync(FileProfile.FileProfilePac.profileName);
                for (let profile of profileList) {
                    let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                    if (uuidOfProfile === profileUuid) {
                        let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                        let fileProfileCapability = fileProfilePac[onfAttributes.FILE_PROFILE.CAPABILITY];
                        fileIdentifier = fileProfileCapability[onfAttributes.FILE_PROFILE.FILE_IDENTIFIER];
                    }
                }
                resolve(fileIdentifier);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the file description for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {fileDescription}
     **/
    static async getFileDescription(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let fileDescription;
                let profileList = await profileCollection.getProfileListForProfileNameAsync(FileProfile.FileProfilePac.profileName);
                for (let profile of profileList) {
                    let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                    if (uuidOfProfile === profileUuid) {
                        let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                        let fileProfileCapability = fileProfilePac[onfAttributes.FILE_PROFILE.CAPABILITY];
                        fileDescription = fileProfileCapability[onfAttributes.FILE_PROFILE.FILE_DESCRIPTION];
                    }
                }
                resolve(fileDescription);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Fetch application data complete file path
     */
    static async getApplicationDataFileContent() {
        return new Promise(async function (resolve, reject) {
            try {
                let applicationDataFile
                let profiles = await profileCollection.getProfileListForProfileNameAsync(profile.profileNameEnum.FILE_PROFILE);
                let profileUuid = profiles.flatMap(profile => profile[onfAttributes.GLOBAL_CLASS.UUID]);
                for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
                    let uuid = profileUuid[profileUuidIndex];
                    let value = await FileProfile.getFileName(uuid)
                    let completeFilePath = "./application-data/" + value;
                    if (fileSystem.existsSync(completeFilePath)) {
                        applicationDataFile = completeFilePath;
                    }
                }
                if (applicationDataFile !== undefined) {
                    resolve(applicationDataFile);
                }
                else {
                    throw new Error( "file is not exist" )
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the file name for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {fileName}
     **/
    static async getFileName(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let fileName;
                let profileList = await profileCollection.getProfileListForProfileNameAsync(FileProfile.FileProfilePac.profileName);
                for (let profile of profileList) {
                    let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                    if (uuidOfProfile === profileUuid) {
                        let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                        let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                        fileName = fileProfileConfiguration[onfAttributes.FILE_PROFILE.FILE_NAME];
                    }
                }
                resolve(fileName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {operation}
     **/
    static async getOperation(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let operation;
                let profileList = await profileCollection.getProfileListForProfileNameAsync(FileProfile.FileProfilePac.profileName);
                for (let profile of profileList) {
                    let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                    if (uuidOfProfile === profileUuid) {
                        let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                        let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                        operation = fileProfileConfiguration[onfAttributes.FILE_PROFILE.OPERATION];
                    }
                }
                resolve(operation);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the file name for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {String} fileNameToBeUpdated : Value of file name that needs to be updated.
     * @returns {promise} boolean {true|false}
     **/
    static async setFileName(profileUuid, fileNameToBeUpdated) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let fileName = onfPaths.FILE_PROFILE_FILE_NAME
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        fileName,
                        fileNameToBeUpdated,
                        false);
                    resolve(isUpdated);
                } catch (error) {
                    reject(error);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the operation for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {String} operation : the value of operation
     * @returns {promise} boolean {true|false}
     **/
    static async setOperation(profileUuid, operation) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let operationPath = onfPaths.FILE_PROFILE_OPERATION
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        operationPath,
                        operation,
                        false);
                    resolve(isUpdated);
                } catch (error) {
                    reject(error);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = FileProfile;
