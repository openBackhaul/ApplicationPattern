/**
 * This class provides methods to get consequent action list and response profile list. 
 **/
'use strict';


const consequentAction = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ResponseValue');
const ActionProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ActionProfile');
const responseProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/responseProfile');
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const profileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');

/**
 * @description This function returns the consequent action list for the provided operation name.
 * @param {String} operationName : operation Name
 * @returns {promise} list {consequentActionList}
 **/
exports.getConsequentActionList = function (operationName) {
    return new Promise(async function (resolve, reject) {
        try {
            let consequentActionList = [];
            let consequentActionProfile = {};
            let actionProfileUuidList = await ActionProfile.getActionProfileUuidsList();
            for (let i = 0; i < actionProfileUuidList.length; i++) {
                let uuid = actionProfileUuidList[i];
                let actionProfileOperationName = await ActionProfile.getOperationName(uuid);
                if (operationName === actionProfileOperationName) {
                    let actionProfile = await ActionProfile.getActionProfile(uuid);
                    let consequentOperationReference = await ActionProfile.getConsequentOperationReference(uuid);
                    let operationName = await fileOperation.readFromDatabaseAsync(consequentOperationReference);
                    let request = await formulateRequest(operationName);
                    consequentActionProfile = new consequentAction(
                        actionProfile.label,
                        request,
                        actionProfile.displayInNewBrowserWindow,
                        actionProfile.inputlist
                    );
                    consequentActionList.push(consequentActionProfile);
                }
            }
            resolve(consequentActionList);
        } catch (error) {
            console.log(error);
        }

    });
}

/**
 * @description This function returns the formulated request for the provided operation name.
 * @param {String} operationName : operation Name
 * @returns {promise} String {request}
 * TODO : enhance the method to formulate the request after decision is made.
 **/
function formulateRequest(operationName) {
    return new Promise(async function (resolve, reject) {
        try {
            let request = operationName;
            resolve(request);
        } catch (error) {
            reject(error);
        }
    });

}

/**
 * @description This function returns the response value list for the provided operation name.
 * @param {String} operationName : operation Name
 * @returns {promise} list {responseValueList}
 **/
exports.getResponseValueList = function (operationName) {
    return new Promise(async function (resolve, reject) {
        try {
            let responseValueList = [];
            let responseInstanceFieldName;
            let responseInstanceValue;
            let responseInstancedataTypeOfValue;

            let profilesList = await profileCollection.getProfileListAsync();
            if (profilesList != undefined && profilesList.length != 0) {
                for (let i = 0; i < profilesList.length; i++) {
                    let profileInstance = profilesList[i];
                    let uuid = profileInstance["uuid"];
                    let profileInstanceName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                    if (profileInstanceName === profile.profileNameEnum.RESPONSE_PROFILE) {
                        let profileOperationName = await responseProfile.getOperationNameAsync(uuid);
                        if (operationName === profileOperationName) {
                            let ResponseProfilePac = profileInstance[onfAttributes.RESPONSE_PROFILE.PAC];
                            let ResponseProfileCapability = ResponseProfilePac[onfAttributes.RESPONSE_PROFILE.CAPABILITY];
                            let ResponseProfileConfiguration = ResponseProfilePac[onfAttributes.RESPONSE_PROFILE.CONFIGURATION];
                            let fieldName = ResponseProfileCapability[onfAttributes.RESPONSE_PROFILE.FIELD_NAME];
                            let value = ResponseProfileConfiguration[onfAttributes.RESPONSE_PROFILE.VALUE];
                            let fieldNameReference = fieldName[onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE];
                            let valueReference = value[onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE];                            
                            if (fieldNameReference !== undefined) {
                                responseInstanceFieldName = await fileOperation.readFromDatabaseAsync(fieldNameReference);
                            } else {
                                responseInstanceFieldName = fieldName[onfAttributes.RESPONSE_PROFILE.STATIC_FIELD_NAME];
                            }
                            if (valueReference) {
                                responseInstanceValue = await fileOperation.readFromDatabaseAsync(valueReference);
                            } else {
                                responseInstanceValue = value[onfAttributes.RESPONSE_PROFILE.STATIC_VALUE];
                            }
                            responseInstancedataTypeOfValue = typeof responseInstanceValue;
                            let response = new responseValue(
                                responseInstanceFieldName,
                                responseInstanceValue,
                                responseInstancedataTypeOfValue
                            );
                            responseValueList.push(response);
                        }

                    }

                }
                resolve(responseValueList)
            }
        } catch (error) {
            console.log(error);
        }

    });
}