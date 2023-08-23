// @ts-check
/**
 * This class provides a stub to instantiate and generate a JSON object for a ResponseProfile. This class is a sub class for profile. 
 * This response profile ,
 *      - is utilized by TypeApprovalApplication to store the application's approval status. 
 *      - provides functionality to read the currently configured attribute values of the application-profile
 **/

'use strict';

const ControlConstruct = require('../ControlConstruct');
const ProfileCollection = require('../ProfileCollection');
const Profile = require('../Profile');
const onfAttributes = require('../../constants/OnfAttributes');

class ResponseProfile extends Profile {
    static profileName = Profile.profileNameEnum.RESPONSE_PROFILE;
    responseProfilePac;

    static ResponseProfilePac = class ResponseProfilePac {
        responseProfileCapability;
        responseProfileConfiguration;

        static ResponseProfileCapability = class ResponseProfileCapability {
            operationName;
            fieldName;
            description;
            datatype;

            /**
             * constructor
             * @param {String} operationName name of the Operation
             * @param {Object} fieldName static-field-name or field-name-reference
             * @param {String} description description
             * @param {String} datatype datatype
             */
            constructor(operationName, fieldName, description, datatype) {
                this.operationName = operationName;
                if (onfAttributes.RESPONSE_PROFILE.STATIC_FIELD_NAME in fieldName ||
                    onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE in fieldName) {
                    this.fieldName = fieldName;
                }
                this.description = description;
                this.datatype = datatype;
            }
        };

        static ResponseProfileConfiguration = class ResponseProfileConfiguration {
            value;

            /**
             * constructor
             * @param {Object} value static-value or value-reference
             */
            constructor(value) {
                if (onfAttributes.RESPONSE_PROFILE.STATIC_VALUE in value ||
                    onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE in value) {
                    this.value = value;
                }
            }
        };

        /**
         * constructor 
         * @param {String} operationName name of the Operation
         * @param {Object} fieldName static-field-name or field-name-reference
         * @param {String} description description
         * @param {String} datatype datatype
         * @param {Object} value static-value or value-reference
         */
        constructor(operationName, fieldName, description, datatype, value) {
            this.responseProfileCapability = new ResponseProfilePac.
                ResponseProfileCapability(
                    operationName,
                    fieldName,
                    description,
                    datatype);
            this.responseProfileConfiguration = new ResponseProfilePac.
                ResponseProfileConfiguration(
                    value);
        }
    }

    /**
     * constructor 
     * @param {String} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @param {String} operationName name of the Operation
     * @param {Object} fieldName static-field-name or field-name-reference
     * @param {String} description description
     * @param {String} datatype datatype
     * @param {Object} value static-value or value-reference
     */
    constructor(uuid, operationName, fieldName, description, datatype, value) {
        super(uuid, ResponseProfile.profileName);
        this[onfAttributes.RESPONSE_PROFILE.PAC] = new ResponseProfile.ResponseProfilePac(
            operationName,
            fieldName,
            description,
            datatype,
            value
        );
    }

    /**
     * @description This function returns the response profile capability for the given profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-response-p-\d+$'
     * @returns {Promise<ResponseProfile|undefined>} object {actionProfile}
     **/
    static async getResponseProfile(profileUuid) {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(ResponseProfile.profileName);
        if (profileList === undefined) {
            return undefined;
        }
        let found = profileList.find(profile => profile[onfAttributes.GLOBAL_CLASS.UUID] === profileUuid);
        if (found !== undefined) {
            let responseProfilePacJSON = found[onfAttributes.RESPONSE_PROFILE.PAC];
            let capabilityJSON = responseProfilePacJSON[onfAttributes.RESPONSE_PROFILE.CAPABILITY];
            let operationName = capabilityJSON[onfAttributes.RESPONSE_PROFILE.OPERATION_NAME];
            let fieldName = capabilityJSON[onfAttributes.RESPONSE_PROFILE.FIELD_NAME];
            let description = capabilityJSON[onfAttributes.RESPONSE_PROFILE.DESCRIPTION];
            let datatype = capabilityJSON[onfAttributes.RESPONSE_PROFILE.DATATYPE];

            let configurationJSON = responseProfilePacJSON[onfAttributes.RESPONSE_PROFILE.CONFIGURATION];
            let value = configurationJSON[onfAttributes.RESPONSE_PROFILE.VALUE];
            return new ResponseProfile(profileUuid,
                operationName,
                fieldName,
                description,
                datatype,
                value
            );
        }
    }

    /**
     * @description This function returns the profileUuid for the provided fieldReference.
     * @param {String} fieldNameReference : the value should be a valid onfPath
     * @returns {Promise<String|undefined>} string {profileUuid}
     **/
    static async findProfileUuidForFieldNameReferenceAsync(fieldNameReference) {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(ResponseProfile.profileName);
        for (let profile of profileList) {
            let ResponseProfilePac = profile[onfAttributes.RESPONSE_PROFILE.PAC];
            let ResponseProfileCapability = ResponseProfilePac[onfAttributes.RESPONSE_PROFILE.CAPABILITY];
            let fieldName = ResponseProfileCapability[onfAttributes.RESPONSE_PROFILE.FIELD_NAME];
            let _fieldNameReference = fieldName[onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE];
            if (_fieldNameReference === fieldNameReference) {
                return profile[onfAttributes.GLOBAL_CLASS.UUID];
            }
        }
        return undefined;
    }

    /**
     * @description This function creates a new application profile.
     * @param {String} operationName name of the Operation
     * @param {String} fieldNameReference name of the field.
     * @param {String} description description.
     * @param {String} datatype datatype.
     * @param {String} valueReference value to be reffered.
     * @returns {Promise<ResponseProfile>}
     **/
    static async createProfileAsync(operationName, fieldNameReference, description, datatype, valueReference) {
        let profileUuid = await ResponseProfile.generateNextUuidAsync();
        return new ResponseProfile(profileUuid,
            operationName,
            {
                [onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE]: fieldNameReference
            },
            description,
            datatype,
            {
                [onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE]: valueReference
            }
        );
    }

    /**
     * @description This function returns the next available uuid for the ResponseProfile.
     * @returns {promise} string {uuid}
     **/
    static async generateNextUuidAsync() {
        let profileUuid;
        let initialProfileSuffix = "-response-p-000";
        let profiles = await ProfileCollection.getProfileListForProfileNameAsync(
            Profile.profileNameEnum.RESPONSE_PROFILE);
        let uuidList = profiles.flatMap(profile => profile[onfAttributes.GLOBAL_CLASS.UUID]);
        if (uuidList.length > 0) {
            uuidList.sort();
            let lastUuid = uuidList[uuidList.length - 1];
            let uuidPrefix = lastUuid.substring(
                0,
                lastUuid.lastIndexOf("-") + 1);
            let uuidNumber = lastUuid.substring(
                lastUuid.lastIndexOf("-") + 1,
                lastUuid.length);
            profileUuid = uuidPrefix + (
                parseInt(uuidNumber) + 1).toString().padStart(3, "0");
        } else {
            let coreModelUuid = await ControlConstruct.getUuidAsync();
            profileUuid = coreModelUuid + initialProfileSuffix;
        }
        return profileUuid;
    }
}

module.exports = ResponseProfile;
