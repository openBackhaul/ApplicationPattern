


'use strict';


const consequentAction = require('../../applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('../../applicationPattern/rest/server/responseBody/ResponseValue');
const onfPaths = require('../onfModel/constants/OnfPaths');
const fileOperation = require('../databaseDriver/JSONDriver');
const onfAttributes = require('../onfModel/constants/OnfAttributes');
const profile = require('../onfModel/models/ProfileCollection')

class GenericRepresentation {
    static async  getActionListForApplication(operationName) {
        return new Promise(async function (resolve, reject) {
            try {

                let displayInnewBrowserWindow;
                let Label;
                let ConsequentOperationReference;
                let consequentActionList = [];
                let profilesList = await profile.getProfileListAsync();
                if (profilesList != undefined && profilesList.length != 0) {
                    for (let i = 0; i < profilesList.length; i++) {
                        let profileInstance = profilesList[i];
                        let profileInstanceName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                        if (profileInstanceName === 'action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE') {
                            let profileOperationname = profileInstance[onfAttributes.ACTION_PROFILE.PAC][onfAttributes.ACTION_PROFILE.CAPABILITY][onfAttributes.ACTION_PROFILE.OPERATION_NAME]
                            if (profileOperationname === operationName) {
                                Label = profileInstance[onfAttributes.ACTION_PROFILE.PAC][onfAttributes.ACTION_PROFILE.CAPABILITY][onfAttributes.ACTION_PROFILE.LABEL]
                                displayInnewBrowserWindow = profileInstance[onfAttributes.ACTION_PROFILE.PAC][onfAttributes.ACTION_PROFILE.CAPABILITY][onfAttributes.ACTION_PROFILE.DISPLAY_IN_NEW_BROWSER_WINDOW]
                                let operationReference = profileInstance[onfAttributes.ACTION_PROFILE.PAC][onfAttributes.ACTION_PROFILE.CONFIGURATION][onfAttributes.ACTION_PROFILE.CONSEQUENT_OPERATION_LIST]
                                ConsequentOperationReference = await fileOperation.readFromDatabaseAsync(operationReference);
                                let inputlist = profileInstance[onfAttributes.ACTION_PROFILE.PAC][onfAttributes.ACTION_PROFILE.CAPABILITY][onfAttributes.ACTION_PROFILE.INPUT_VALUE_LIST]
        
                                let consequentActionForListRegisteredApplication = new consequentAction(
                                    Label,
                                    ConsequentOperationReference,
                                    displayInnewBrowserWindow,
                                    inputlist

                                );
                                consequentActionList.push(consequentActionForListRegisteredApplication);

                            }

                        }
                    }
                    resolve(consequentActionList);
                }

            } catch (error) {
                console.log(error);
            }

        });
    }

    static async  getResponseListForApplication(operationName) {
        return new Promise(async function (resolve, reject) {
            try {
                let responseValueList = [];
                let valueReference;
                let applicationName;
                let datatypevalue;

                let profilesList = await profile.getProfileListAsync();
                if (profilesList != undefined && profilesList.length != 0) {
                    for (let i = 0; i < profilesList.length; i++) {
                        let profileInstance = profilesList[i];
                        let profileInstanceName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
                        if (profileInstanceName === 'response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE') {
                            let profileOperationname = profileInstance[onfAttributes.RESPONSE_PROFILE.PAC][onfAttributes.RESPONSE_PROFILE.CAPABILITY][onfAttributes.RESPONSE_PROFILE.OPERATION_NAME]
                            if (profileOperationname === operationName) {
                                let fieldName = profileInstance[onfAttributes.RESPONSE_PROFILE.PAC][onfAttributes.RESPONSE_PROFILE.CAPABILITY][onfAttributes.RESPONSE_PROFILE.FIELD_NAME]
                                datatypevalue = profileInstance[onfAttributes.RESPONSE_PROFILE.PAC][onfAttributes.RESPONSE_PROFILE.CAPABILITY][onfAttributes.RESPONSE_PROFILE.DATATYPE]
                                if (fieldName[onfAttributes.RESPONSE_PROFILE.FILED_NAME_REFERENCE] !== undefined) {
                                    var valueofapplication = fieldName[onfAttributes.RESPONSE_PROFILE.FILED_NAME_REFERENCE]
                                    applicationName = await fileOperation.readFromDatabaseAsync(valueofapplication);
                                }
                                else if (fieldName[onfAttributes.RESPONSE_PROFILE.STATIC_FIELD_NAME]) {
                                    applicationName = fieldName[onfAttributes.RESPONSE_PROFILE.STATIC_FIELD_NAME]
                                }
                                let valuelist = profileInstance[onfAttributes.RESPONSE_PROFILE.PAC][onfAttributes.RESPONSE_PROFILE.CONFIGURATION][onfAttributes.RESPONSE_PROFILE.VALUE]
                                if (valuelist[onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE]) {
                                    var valueofapplication = valuelist[onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE]
                                    valueReference = await fileOperation.readFromDatabaseAsync(valueofapplication);
                                }

                                let valueofres = new responseValue(
                                    applicationName,
                                    valueReference,
                                    datatypevalue
                                );
                                responseValueList.push(valueofres);
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

}
module.exports = GenericRepresentation;