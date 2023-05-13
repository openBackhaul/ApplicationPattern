// @ts-check
'use strict';

const ProfileCollection = require('../../../onfModel/models/ProfileCollection');
const Profile = require('../../../onfModel/models/Profile');
const onfAttributes = require('../../../onfModel/constants/OnfAttributes');

class StringProfile extends Profile {
    static profileName = Profile.profileNameEnum.STRING_PROFILE;
    stringProfilePac;

    static StringProfilePac = class StringProfilePac {
        stringProfileCapability;
        stringProfileConfiguration;

        static StringProfileCapability = class StringProfileCapability {
            stringName;
            enumeration;
            pattern;

            /**
             * constructor 
             * @param {String} stringName
             * @param {Array} enumeration
             * @param {String} pattern
             */
            constructor(stringName, enumeration, pattern) {
                this.stringName = stringName;
                this.enumeration = enumeration;
                this.pattern = pattern;
            }
        };

        static StringProfileConfiguration = class StringProfileConfiguration {
            stringValue;

            /**
             * @param {String} stringValue 
             */
            constructor(stringValue) {
                this.stringValue = stringValue;
            }
        };

        /**
         * constructor 
         * @param {String} stringName
         * @param {Array} enumeration
         * @param {String} pattern
         * @param {String} stringValue
         */
        constructor(stringName, enumeration, pattern, stringValue) {
            this.stringProfileCapability = new StringProfilePac.
                StringProfileCapability(
                    stringName, enumeration, pattern);
            this.stringProfileConfiguration = new StringProfilePac.
                StringProfileConfiguration(
                    stringValue,
                );
        }
    }

    /**
     * constructor 
     * @param {String} uuid
     * @param {String} stringName
     * @param {Array} enumeration
     * @param {String} pattern
     * @param {String} stringValue
     */
    constructor(uuid, stringName, enumeration, pattern, stringValue) {
        super(uuid, StringProfile.profileName);
        this.stringProfilePac = new StringProfile.StringProfilePac(
            stringName,
            enumeration,
            pattern,
            stringValue
        );
    }

    /**
     * @description Creates and returns new StringProfile object from JSON configuration,
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-string-p-\d+$'
     * @returns {Promise<StringProfile|undefined>}
     **/
    static async getStringProfile(profileUuid) {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(StringProfile.profileName);
        if (profileList === undefined) {
            return undefined;
        }
        let found = profileList.find(profile => profile[onfAttributes.GLOBAL_CLASS.UUID] === profileUuid);
        if (found !== undefined) {
            let stringProfilePac = found[onfAttributes.STRING_PROFILE.PAC];
            let stringProfileCapability = stringProfilePac[onfAttributes.STRING_PROFILE.CAPABILITY];
            let stringName = stringProfileCapability[onfAttributes.STRING_PROFILE.STRING_NAME];
            let enumeration = stringProfileCapability[onfAttributes.STRING_PROFILE.ENUMERATION];
            let pattern = stringProfileCapability[onfAttributes.STRING_PROFILE.PATTERN];
            let stringProfileConfiguration = stringProfilePac[onfAttributes.STRING_PROFILE.CONFIGURATION];
            let stringValue = stringProfileConfiguration[onfAttributes.STRING_PROFILE.STRING_VALUE];
            return new StringProfile(profileUuid,
                stringName,
                enumeration,
                pattern,
                stringValue
            );
        }
    }

}

module.exports = StringProfile;
