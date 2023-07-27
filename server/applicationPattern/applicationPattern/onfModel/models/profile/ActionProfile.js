// @ts-check
/**
 * This class provides a stub to instantiate and generate a JSON object for a ActionProfile. 
 * This class is a sub class for profile. 
 **/

'use strict';

const ProfileCollection = require('../../../onfModel/models/ProfileCollection');
const Profile = require('../../../onfModel/models/Profile');
const onfAttributes = require('../../../onfModel/constants/OnfAttributes');

class ActionProfile extends Profile {
    static profileName = Profile.profileNameEnum.ACTION_PROFILE;
    actionProfilePac;

    static ActionProfilePac = class ActionProfilePac {
        actionProfileCapability;
        actionProfileConfiguration;

        static ActionProfileCapability = class ActionProfileCapability {
            operationName;
            label;
            inputValueList;
            displayInNewBrowserWindow;

            /**
             * constructor 
             * @param {String} operationName name of the operation
             * @param {String} label label
             * @param {Array} inputValueList input value list
             * @param {Boolean} displayInNewBrowserWindow display in new browser window
             */
            constructor(operationName, label, inputValueList, displayInNewBrowserWindow) {
                this.operationName = operationName;
                this.label = label;
                this.inputValueList = inputValueList;
                this.displayInNewBrowserWindow = displayInNewBrowserWindow
            }
        };

        static ActionProfileConfiguration = class ActionProfileConfiguration {
            consequentOperationReference;

            /**
             * @param {String} consequentOperationReference reference for the consequent action.
             */
            constructor(consequentOperationReference) {
                this.consequentOperationReference = consequentOperationReference;
            }
        };

        /**
         * constructor 
         * @param {String} operationName name of the operation
         * @param {String} label label
         * @param {Array} inputValueList input value list
         * @param {Boolean} displayInNewBrowserWindow display in new browser window
         * @param {String} consequentOperationReference reference for the consequent operation
         */
        constructor(operationName, label, inputValueList, displayInNewBrowserWindow, consequentOperationReference) {
            this.actionProfileCapability = new ActionProfilePac.
                ActionProfileCapability(
                    operationName, label, inputValueList, displayInNewBrowserWindow);
            this.actionProfileConfiguration = new ActionProfilePac.
                ActionProfileConfiguration(
                    consequentOperationReference,
                );
        }
    }

    /**
     * constructor 
     * @param {String} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @param {String} operationName name of the operation.
     * @param {String} label label.
     * @param {Array} inputValueList input value list.
     * @param {Boolean} displayInNewBrowserWindow display in new browser window.
     * @param {String} consequentOperationReference reference for consequent operation.
     * This constructor will instantiate the ActionProfile class
     */
    constructor(uuid, operationName, label, inputValueList, displayInNewBrowserWindow, consequentOperationReference) {
        super(uuid, ActionProfile.profileName);
        this.actionProfilePac = new ActionProfile.ActionProfilePac(
            operationName,
            label,
            inputValueList,
            displayInNewBrowserWindow,
            consequentOperationReference
        );
    }

    /**
     * @description This function returns the action profile capability for the given profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @returns {Promise<ActionProfile|undefined>} object {actionProfile}
     **/
    static async getActionProfile(profileUuid) {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(ActionProfile.profileName);
        if (profileList === undefined) {
            return undefined;
        }
        let found = profileList.find(profile => profile[onfAttributes.GLOBAL_CLASS.UUID] === profileUuid);
        if (found !== undefined) {
            let actionProfilePac = found[onfAttributes.ACTION_PROFILE.PAC];
            let actionProfileCapability = actionProfilePac[onfAttributes.ACTION_PROFILE.CAPABILITY];
            let operationName = actionProfileCapability[onfAttributes.ACTION_PROFILE.OPERATION_NAME];
            let label = actionProfileCapability[onfAttributes.ACTION_PROFILE.LABEL];
            let inputValueList = actionProfileCapability[onfAttributes.ACTION_PROFILE.INPUT_VALUE_LIST];
            let displayInNewBrowserWindow = actionProfileCapability[onfAttributes.ACTION_PROFILE.DISPLAY_IN_NEW_BROWSER_WINDOW];
            let actionProfileConfiguration = actionProfilePac[onfAttributes.ACTION_PROFILE.CONFIGURATION];
            let consequentOperationReference = actionProfileConfiguration[onfAttributes.ACTION_PROFILE.CONSEQUENT_OPERATION_REFERENCE];
            return new ActionProfile(profileUuid,
                operationName,
                label,
                inputValueList,
                displayInNewBrowserWindow,
                consequentOperationReference
            );
        }
    }

    /**
     * @description This function returns the list of action profile uuids or empty array if no UUIDs were found.
     * @returns {Promise<Array>} list {actionProfileUuidsList}
     **/
    static async getActionProfileUuidsList() {
        let profileList = await ProfileCollection.getProfileListForProfileNameAsync(ActionProfile.profileName);
        if (profileList === undefined) {
            return [];
        }
        return profileList.flatMap(profile => profile[onfAttributes.GLOBAL_CLASS.UUID]);
    }
}

module.exports = ActionProfile;
