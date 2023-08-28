// @ts-check
/**
 * This class provides a stub to instantiate and generate a JSON object for a IntegerProfile. 
 * This class is a sub class for profile. 
 **/

'use strict';

const ProfileCollection = require('../../../onfModel/models/ProfileCollection');
const Profile = require('../../../onfModel/models/Profile');
const onfAttributes = require('../../../onfModel/constants/OnfAttributes');

class IntegerProfile extends Profile {

    static profileName = Profile.profileNameEnum.INTEGER_PROFILE;
    integerProfilePac;

    static IntegerProfilePac = class IntegerProfilePac {
        integerProfileCapability;
        integerProfileConfiguration;

        static IntegerProfileCapability = class IntegerProfileCapability {
            integerName;
            unit;
            minimum;
            maximum;

            /**
             * constructor 
             * @param {String} integerName
             * @param {String} unit
             * @param {String} minimum
             * @param {String} maximum
             */
            constructor(integerName, unit, minimum, maximum) {
                this.integerName = integerName;
                this.unit = unit;
                this.minimum = minimum;
                this.maximum = maximum;
            }
        };

        static IntegerProfileConfiguration = class IntegerProfileConfiguration {
            integerValue;

            /**
             * constructor 
             * @param {String} integerValue
             */
            constructor(integerValue) {
                this.integerValue = integerValue;
            }
        };

        /**
         * constructor 
         * @param {String} integerName
         * @param {String} unit
         * @param {String} minimum
         * @param {String} maximum
         * @param {String} integerValue
         */
        constructor(integerName, unit, minimum, maximum, integerValue) {
            this.integerProfileCapability = new IntegerProfilePac.
                IntegerProfileCapability(
                    integerName, unit, minimum, maximum);
            this.integerProfileConfiguration = new IntegerProfilePac.
                IntegerProfileConfiguration(
                    integerValue,
                );
        }
    }

    /**
     * constructor 
     * @param {String} uuid
     * @param {String} integerName
     * @param {String} unit
     * @param {String} minimum
     * @param {String} maximum
     * @param {String} integerValue
     */
    constructor(uuid, integerName, unit, minimum, maximum, integerValue) {
        super(uuid, IntegerProfile.profileName);
        this.integerProfilePac = new IntegerProfile.IntegerProfilePac(
            integerName, unit, minimum, maximum, integerValue
        );
    }

    /**
     * @description This function returns the integer profile capability for the given profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-integer-p-\d+$'
     * @returns {Promise<IntegerProfile|undefined>} object {actionProfile}
     **/
    static async getIntegerProfile(profileUuid) {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(IntegerProfile.profileName);
        if (profileList === undefined) {
            return undefined;
        }
        let found = profileList.find(profile => profile[onfAttributes.GLOBAL_CLASS.UUID] === profileUuid);
        if (found !== undefined) {
            let integerProfilePac = found[onfAttributes.INTEGER_PROFILE.PAC];
            let integerProfileCapability = integerProfilePac[onfAttributes.INTEGER_PROFILE.CAPABILITY];
            let integerName = integerProfileCapability[onfAttributes.INTEGER_PROFILE.INTEGER_NAME];
            let unit = integerProfileCapability[onfAttributes.INTEGER_PROFILE.UNIT];
            let minimum = integerProfileCapability[onfAttributes.INTEGER_PROFILE.MINIMUM];
            let maximum = integerProfileCapability[onfAttributes.INTEGER_PROFILE.MAXIMUM];
            let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CONFIGURATION];
            let integerValue = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.INTEGER_VALUE];
            return new IntegerProfile(profileUuid,
                integerName,
                unit,
                minimum,
                maximum,
                integerValue
            );
        }
    }


    /**
     * @deprecated should be removed
     * @description This function returns the maxmimum value for the integer profile.
     * @param {String} integerProfileUuid : the value should be a valid string in the pattern '^([a-z]{2,6})-([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,2})-integer-p-([0-9]{3})$'
     * @returns {promise} string {approvalStatus}
     **/
    static async getIntegerValueAsync(integerProfileUuid) {
        return new Promise(async function (resolve, reject) {
            let integerValue;
            try {
                let profileList = await ProfileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profileInstance = profileList[i];
                    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    let profileUuid = profileInstance[onfAttributes.GLOBAL_CLASS.UUID];
                    if (profileName == Profile.profileNameEnum.INTEGER_PROFILE && profileUuid == integerProfileUuid) {
                        let integerProfilePac = profileInstance[onfAttributes.INTEGER_PROFILE.PAC];
                        let integerProfileConfiguration = integerProfilePac[onfAttributes.INTEGER_PROFILE.CONFIGURATION];
                        integerValue = integerProfileConfiguration[onfAttributes.INTEGER_PROFILE.INTEGER_VALUE];
                    }
                }
                resolve(integerValue);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = IntegerProfile;
