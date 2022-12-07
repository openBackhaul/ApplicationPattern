/**
 * This class provides a stub to instantiate and generate a JSON object for a FileProfile. 
 * This class is a sub class for profile. 
 **/

'use strict';

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
     * 2.fileProfileConfiguration - class that holds the filePath, username, password, operation.
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
            filePath;
            userName;
            password;
            operation;

            static operationEnum = {
                READ_ONLY: "file-profile-1-0:OPERATION_TYPE_READ_ONLY",
                READ_WRITE: "file-profile-1-0:OPERATION_TYPE_READ_WRITE",
                OFF: "file-profile-1-0:OPERATION_TYPE_OFF",
                NOT_YET_DEFINED: "file-profile-1-0:OPERATION_TYPE_NOT_YET_DEFINED"
            }

            /**
             * constructor 
             * @param {string} filePath path for the file.
             * @param {string} userName user name to access the file.
             * @param {string} password password name to access the file.
             * @param {string} operation operation.
             * This constructor will instantiate the fileProfileConfiguration class
             */
            constructor(filePath, userName, password, operation) {
                this.filePath = filePath;
                this.userName = userName;
                this.password = password;
                this.operation = operation;
            }
        };

        /**
         * constructor 
         * @param {string} fileIdentifier Identifier for the file.
         * @param {string} fileDescription Description for the file.
         * @param {string} filePath path for the file.
         * @param {string} userName user name to access the file.
         * @param {string} password password to access the file..
         * @param {string} operation operation.
         * This constructor will instantiate the FileProfilePac class
         */
        constructor(fileIdentifier, fileDescription, filePath, userName, password, operation) {
            this.fileProfileCapability = new FileProfilePac.
            FileProfileCapability(
                fileIdentifier, fileDescription);
            this.FileProfileConfiguration = new FileProfilePac.
            FileProfileConfiguration(
                filePath, userName, password, operation);
        }
    }

    /**
     * constructor 
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {string} fileIdentifier Identifier for the file.
     * @param {string} fileDescription Description for the file.
     * @param {string} filePath path for the file.
     * @param {string} userName user name to access the file.
     * @param {string} password password to access the file..
     * @param {string} operation operation.
     * This constructor will instantiate the FileProfile class
     */
    constructor(uuid, fileIdentifier, fileDescription, filePath, userName, password, operation) {
        super(
            uuid,
            FileProfile.FileProfilePac.profileName
        );
        this[onfAttributes.FILE_PROFILE.PAC] = new FileProfile.FileProfilePac(
            fileIdentifier,
            fileDescription,
            filePath,
            userName,
            password,
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
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileCapability = fileProfilePac[onfAttributes.FILE_PROFILE.CAPABILITY];
                            fileIdentifier = fileProfileCapability[onfAttributes.FILE_PROFILE.FILE_IDENTIFIER];
                        }
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
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileCapability = fileProfilePac[onfAttributes.FILE_PROFILE.CAPABILITY];
                            fileDescription = fileProfileCapability[onfAttributes.FILE_PROFILE.FILE_DESCRIPTION];
                        }
                    }
                }
                resolve(fileDescription);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the file path for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {filePath}
     **/
    static async getFilePath(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let filePath;
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                            filePath = fileProfileConfiguration[onfAttributes.FILE_PROFILE.FILE_PATH];
                        }
                    }
                }
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    }



    /**
     * @description This function returns the user name for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {userName}
     **/
    static async getUserName(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let userName;
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                            userName = fileProfileConfiguration[onfAttributes.FILE_PROFILE.USER_NAME];
                        }
                    }
                }
                resolve(userName);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the password for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @returns {promise} string {password}
     **/
    static async getPassword(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let password;
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                            password = fileProfileConfiguration[onfAttributes.FILE_PROFILE.PASSWORD];
                        }
                    }
                }
                resolve(password);
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
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == FileProfile.FileProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let fileProfilePac = profile[onfAttributes.FILE_PROFILE.PAC];
                            let fileProfileConfiguration = fileProfilePac[onfAttributes.FILE_PROFILE.CONFIGURATION];
                            operation = fileProfileConfiguration[onfAttributes.FILE_PROFILE.OPERATION];
                        }
                    }
                }
                resolve(operation);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the file path for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {String} filePathValueToBeUpdated : Value of file path that needs to be updated.
     * @returns {promise} boolean {true|false}
     **/
    static async setFilePath(profileUuid, filePathValueToBeUpdated) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let filePath = onfPaths.FILE_PROFILE_FILE_PATH
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        filePath,
                        filePathValueToBeUpdated,
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
     * @description This function sets the  user name for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {String} userName : the value of user name
     * @returns {promise} boolean {true|false}
     **/
    static async setUserName(profileUuid, userName) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let userNamePath = onfPaths.FILE_PROFILE_USER_NAME
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        userNamePath,
                        userName,
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
     * @description This function sets the password for the provided file profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-file-p-\d+$'
     * @param {String} password : the value of password
     * @returns {promise} boolean {true|false}
     **/
    static async setPassword(profileUuid, password) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let passwordPath = onfPaths.FILE_PROFILE_PASSWORD
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        passwordPath,
                        password,
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

    /**
     * @description This function returns the list of file profile uuids.
     * @returns {promise} list {fileProfileUuidsList}
     **/
    static async getFileProfileUuidsList() {
        return new Promise(async function (resolve, reject) {
            try {
                let fileProfileUuidsList = [];
                let profileName = FileProfile.FileProfilePac.profileName
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileNameFromList = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileNameFromList == profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        fileProfileUuidsList.push(uuidOfProfile);
                    }
                }
                resolve(fileProfileUuidsList);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = FileProfile;