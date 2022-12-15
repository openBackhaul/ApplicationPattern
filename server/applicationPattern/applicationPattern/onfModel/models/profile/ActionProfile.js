/**
 * This class provides a stub to instantiate and generate a JSON object for a ActionProfile. 
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
class ActionProfile extends profile {
    /**
     * actionProfilePac class holds the following properties,
     * 1.actionProfileCapability - class that holds the operationName, label, inputValueList, displayInNewBrowserWindow.
     * 2.actionProfileConfiguration - class that holds the consequentOperationReference.
     */
    static ActionProfilePac = class ActionProfilePac {
        static profileName = profile.profileNameEnum.ACTION_PROFILE;
        actionProfileCapability;
        actionProfileConfiguration;

        static ActionProfileCapability = class ActionProfileCapability {
            operationName;
            label;
            inputValueList;
            displayInNewBrowserWindow;

            /**
             * constructor 
             * @param {string} operationName name of the operation.
             * @param {string} label label.
             * @param {string} inputValueList input value list.
             * @param {boolean} displayInNewBrowserWindow display in new browser window.
             * This constructor will instantiate the actionProfileCapability class
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
             * constructor 
             * @param {string} consequentOperationReference reference for the consequent action.
             * This constructor will instantiate the actionProfileConfiguration class
             */
            constructor(consequentOperationReference) {
                this.consequentOperationReference = consequentOperationReference;
            }
        };

        /**
         * constructor 
         * @param {string} operationName name of the operation.
         * @param {string} label label.
         * @param {string} inputValueList input value list.
         * @param {string} displayInNewBrowserWindow display in new browser window.
         * @param {string} consequentOperationReference reference for the consequent operation.
         * This constructor will instantiate the ActionProfilePac class
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
     * @param {string} uuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @param {string} operationName name of the operation.
     * @param {string} label label.
     * @param {string} inputValueList input value list.
     * @param {string} displayInNewBrowserWindow display in new browser window.
     * @param {string} consequentOperationReference reference for consequent operation.
     * This constructor will instantiate the ActionProfile class
     */
    constructor(uuid, operationName, label, inputValueList, displayInNewBrowserWindow, consequentOperationReference) {
        super(
            uuid,
            ActionProfile.ActionProfilePac.profileName
        );
        this[onfAttributes.ACTION_PROFILE.PAC] = new ActionProfile.ActionProfilePac(
            operationName,
            label,
            inputValueList,
            displayInNewBrowserWindow,
            consequentOperationReference
        );
    }

    /**
     * @description This function returns the consequent action reference for the provided action profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @returns {promise} string {consequentOperationReference}
     **/
    static async getConsequentOperationReference(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let consequentOperationReference;
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ActionProfile.ActionProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let actionProfilePac = profile[onfAttributes.ACTION_PROFILE.PAC];
                            let actionProfileConfiguration = actionProfilePac[onfAttributes.ACTION_PROFILE.CONFIGURATION];
                            consequentOperationReference = actionProfileConfiguration[onfAttributes.ACTION_PROFILE.CONSEQUENT_OPERATION_REFERENCE];
                        }
                    }
                }
                resolve(consequentOperationReference);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the action profile capability for the given profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @returns {promise} object {actionProfile}
     **/
    static async getActionProfile(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let actionProfile = {};
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ActionProfile.ActionProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let actionProfilePac = profile[onfAttributes.ACTION_PROFILE.PAC];
                            let actionProfileCapability = actionProfilePac[onfAttributes.ACTION_PROFILE.CAPABILITY];
                            actionProfile.label = actionProfileCapability[onfAttributes.ACTION_PROFILE.LABEL];
                            actionProfile.inputValueList = actionProfileCapability[onfAttributes.ACTION_PROFILE.INPUT_VALUE_LIST];
                            actionProfile.displayInNewBrowserWindow = actionProfileCapability[onfAttributes.ACTION_PROFILE.DISPLAY_IN_NEW_BROWSER_WINDOW];
                        }
                    }
                }
                resolve(actionProfile);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description This function returns the operation name for the given profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @returns {promise} string {operationName}
     **/
    static async getOperationName(profileUuid) {
        return new Promise(async function (resolve, reject) {
            try {
                let operationName;
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileName = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileName == ActionProfile.ActionProfilePac.profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        if (uuidOfProfile === profileUuid) {
                            let actionProfilePac = profile[onfAttributes.ACTION_PROFILE.PAC];
                            let actionProfileCapability = actionProfilePac[onfAttributes.ACTION_PROFILE.CAPABILITY];
                            operationName = actionProfileCapability[onfAttributes.ACTION_PROFILE.OPERATION_NAME];
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
     * @description This function will set the consequent action reference for the provided action profile uuid.
     * @param {String} profileUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-action-p-\d+$'
     * @param {String} consequentOperationReference : consequent operation reference
     * @returns {promise} boolean {true|false}
     **/
    static async setConsequentOperationReference(profileUuid, consequentOperationReference) {
        return new Promise(async function (resolve, reject) {
            try {
                let isUpdated = false;
                try {
                    let consequentOperationReferencePath = onfPaths.ACTION_PROFILE_CONSEQUENT_OPERATION_REFERENCE
                        .replace(
                            "{profileUuid}", profileUuid);
                    isUpdated = await fileOperation.writeToDatabaseAsync(
                        consequentOperationReferencePath,
                        consequentOperationReference,
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
     * @description This function returns the list of action profile uuids.
     * @returns {promise} list {actionProfileUuidsList}
     **/
    static async getActionProfileUuidsList() {
        return new Promise(async function (resolve, reject) {
            try {
                let actionProfileUuidsList = [];
                let profileName = ActionProfile.ActionProfilePac.profileName
                let profileList = await profileCollection.getProfileListAsync();
                for (let i = 0; i < profileList.length; i++) {
                    let profile = profileList[i];
                    let profileNameFromList = profile[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileNameFromList == profileName) {
                        let uuidOfProfile = profile[onfAttributes.GLOBAL_CLASS.UUID];
                        actionProfileUuidsList.push(uuidOfProfile);
                    }
                }
                resolve(actionProfileUuidsList);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = ActionProfile;