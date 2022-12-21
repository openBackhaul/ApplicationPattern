/**
 * This class provides a stub to instantiate and generate a JSON object for a ResponseProfile. This class is a sub class for profile. 
 * This response profile ,
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
class ResponseProfile extends profile {
    /**
     * ResponseProfilePac class holds the following properties,
     * 1. ResponseProfileCapability - class that holds the operationName, fieldNameReference, description, datatype.
     * 2. ResponseProfileConfiguration - class that holds the valueReference.
     */
    static ResponseProfilePac = class ResponseProfilePac {
        static profileName = profile.profileNameEnum.RESPONSE_PROFILE;
        ResponseProfileCapability;
        ResponseProfileConfiguration;

        static ResponseProfileCapability = class ResponseProfileCapability {
            operationName;
            fieldNameReference;
            description;
            datatype;
            /**
             * constructor 
             * @param {string} operationName name of the Operation
             * @param {string} fieldName name of the field.
             * @param {string} description description.
             * @param {string} datatype datatype.
             * This constructor will instantiate the ResponseProfileCapability class
             */
            constructor(operationName, fieldNameReference, description, datatype) {
                this.operationName = operationName;
                this.fieldName = {
                    fieldNameReference: fieldNameReference
                }
                this.description = description;
                this.datatype = datatype;
            }
        };

        static ResponseProfileConfiguration = class ResponseProfileConfiguration {
            valueReference;
            /**
             * constructor 
             * @param {string} valueReference value to be referred.
             * This constructor will instantiate the ResponseProfileConfiguration class
             */
            constructor(valueReference) {
                this.value = {
                    valueReference: valueReference
                };
            }
        };

        /**
         * constructor 
         * @param {string} operationName name of the Operation
         * @param {string} fieldName name of the field.
         * @param {string} description description.
         * @param {string} datatype datatype.
         * @param {string} valueReference value to be referred.
         * This constructor will instantiate the ResponseProfilePac class
         */
        constructor(operationName, fieldNameReference, description, datatype, valueReference) {
            this.ResponseProfileCapability = new ResponseProfilePac.
            ResponseProfileCapability(
                operationName,
                fieldNameReference,
                description,
                datatype);
            this.ResponseProfileConfiguration = new ResponseProfilePac.
            ResponseProfileConfiguration(
                valueReference);
        }
    }

    /**
     * constructor 
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @param {string} operationName name of the Operation
     * @param {string} fieldName name of the field.
     * @param {string} description description.
     * @param {string} datatype datatype.
     * @param {string} valueReference value to be referred.
     * This constructor will instantiate the ResponseProfile class
     */
    constructor(uuid, operationName, fieldNameReference, description, datatype, valueReference) {
        super(
            uuid,
            ResponseProfile.ResponseProfilePac.profileName
        );
        this[onfAttributes.RESPONSE_PROFILE.PAC] = new ResponseProfile.ResponseProfilePac(
            operationName,
            fieldNameReference,
            description,
            datatype,
            valueReference
        );
    }

    /**
     * @description This function returns the operationName for the provided responseProfile profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {promise} string {operationName}
     **/
    static async getOperationNameAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let operationName;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let ResponseProfilePac = profile[
                                onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileCapability = ResponseProfilePac[
                                onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                            operationName = ResponseProfileCapability[
                                onfAttributes.RESPONSE_PROFILE.OPERATION_NAME];
                        }
                    }
                }
                resolve(operationName);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the FieldNameReference for the provided responseProfile profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {promise} string {FieldNameReference}
     **/
    static async getFieldNameReferenceAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let fieldNameReference;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let ResponseProfilePac = profile[
                                onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileCapability = ResponseProfilePac[
                                onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                            let fieldName = ResponseProfileCapability[
                                onfAttributes.RESPONSE_PROFILE.FIELD_NAME];
                            fieldNameReference = fieldName[onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE];
                        }
                    }
                }
                resolve(fieldNameReference);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the description for the provided responseProfile profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {promise} string {description}
     **/
    static async getDescription(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let description;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let ResponseProfilePac = profile[
                                onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileCapability = ResponseProfilePac[
                                onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                            description = ResponseProfileCapability[
                                onfAttributes.RESPONSE_PROFILE.DESCRIPTION];
                        }
                    }
                }
                resolve(description);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the datatype for the provided responseProfile profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {promise} string {datatype}
     **/
    static async getDataType(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let datatype;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let ResponseProfilePac = profile[
                                onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileCapability = ResponseProfilePac[
                                onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                            datatype = ResponseProfileCapability[
                                onfAttributes.RESPONSE_PROFILE.DATATYPE];
                        }
                    }
                }
                resolve(datatype);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the valueReference for the provided responseProfile profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {promise} string {valueReference}
     **/
    static async getValueReferenceAsync(profileUuid) {
        return new Promise(async function (resolve, reject) {
            let valueReference;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let _profileUuid = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (_profileUuid == profileUuid) {
                            let ResponseProfilePac = profile[
                                onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileConfiguration = ResponseProfilePac[
                                onfAttributes.RESPONSE_PROFILE.CONFIGURATION];
                            let fieldName = ResponseProfileConfiguration[
                                onfAttributes.RESPONSE_PROFILE.VALUE];
                            valueReference = fieldName[onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE];
                        }
                    }
                }
                resolve(valueReference);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function sets the value reference for the provided profileUuid
     * @param {String} profileUuid uuid of the profile.
     * @param {String} valueReference value reference.
     * @returns {promise} boolean {true|false}
     **/
    static async setValueReferenceAsync(profileUuid, valueReference) {
        return new Promise(async function (resolve, reject) {
            let isUpdated = false;
            try {
                let valueReferencePath = onfPaths.RESPONSE_PROFILE_VALUE_REFERENCE.replace(
                    "{profileUuid}", profileUuid);
                isUpdated = await fileOperation.writeToDatabaseAsync(
                    valueReferencePath,
                    valueReference,
                    false);
                resolve(isUpdated);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description This function returns the profileUuid for the provided fieldReference.
     * @param {String} fieldReference : the value should be a valid onfPath
     * @returns {promise} string {profileUuid}
     **/
    static async findProfileUuidForFieldNameReferenceAsync(fieldNameReference) {
        return new Promise(async function (resolve, reject) {
            let profileUuid;
            try {
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ResponseProfile.ResponseProfilePac.profileName) {
                        let ResponseProfilePac = profile[
                            onfAttributes.RESPONSE_PROFILE.PAC];
                        let ResponseProfileCapability = ResponseProfilePac[
                            onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                        let fieldName = ResponseProfileCapability[
                            onfAttributes.RESPONSE_PROFILE.FIELD_NAME];
                        let _fieldNameReference = fieldName[onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE];
                        if (_fieldNameReference == fieldNameReference) {
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
     * @description This function creates a new application profile.
     * @param {string} operationName name of the Operation
     * @param {string} fieldName name of the field.
     * @param {string} description description.
     * @param {string} datatype datatype.
     * @param {string} valueReference value to be reffered.
     * @returns {promise} object {ResponseProfile}
     **/
    static async createProfileAsync(operationName, fieldNameReference, description, datatype, valueReference) {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid = await ResponseProfile.generateNextUuidAsync();
                let ResponseProfileInstance = new ResponseProfile(
                    profileUuid,
                    operationName,
                    fieldNameReference,
                    description,
                    datatype,
                    valueReference);
                resolve(ResponseProfileInstance);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the next available uuid for the ResponseProfile.
     * @returns {promise} string {uuid}
     **/
    static async generateNextUuidAsync() {
        return new Promise(async function (resolve, reject) {
            try {
                let profileUuid;
                let initialProfileSuffix = "-response-p-000";
                let uuidList = await profile.getUuidListAsync(
                    profile.profileNameEnum.RESPONSE_PROFILE);
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
                        parseInt(uuidNumber) + 1).toString().padStart(3, 0);
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

module.exports = ResponseProfile;