/**
 * This class provides methods to get consequent action list and response profile list. 
 **/
'use strict';


const consequentAction = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ResponseValue');
const ActionProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ActionProfile');
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const profileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const TcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const ResponseProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ResponseProfile');

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
                let actionProfile = await ActionProfile.getActionProfile(uuid);
                let actionProfilePac = actionProfile.actionProfilePac;
                let actionProfileCapability = actionProfilePac.actionProfileCapability;
                let actionProfileOperationName = actionProfileCapability.operationName;
                let actionProfileConfiguration = actionProfilePac.actionProfileConfiguration;
                if (operationName === actionProfileOperationName) {
                    let consequentOperationReference = actionProfileConfiguration.consequentOperationReference;
                    let consequentOperationName = await fileOperation.readFromDatabaseAsync(consequentOperationReference);
                    let request = await formulateRequest(consequentOperationName);
                    consequentActionProfile = new consequentAction(
                        actionProfileCapability.label,
                        request,
                        actionProfileCapability.displayInNewBrowserWindow,
                        actionProfileCapability.inputValueList
                    );
                    consequentActionList.push(consequentActionProfile);
                }
            }
            resolve(consequentActionList);
        } catch (error) {
            reject(error)
        }

    });
}

/**
 * @description This function returns the formulated request for the provided operation name.
 * @param {String} operationName : operation Name
 * @returns {promise} String {request}
 **/
function formulateRequest(operationName) {
    return new Promise(async function (resolve, reject) {
        try {
            let protocol = "HTTP";
            let tcpServerUuid = await TcpServerInterface.getUuidOfTheProtocol(protocol);
            let tcpServerConfiguration = await fileOperation.readFromDatabaseAsync(
                onfPaths.TCP_SERVER_INTERFACE_CONFIGURATION.replace(
                    "{uuid}", tcpServerUuid)
            );
            let address = await getConfiguredAddress(tcpServerConfiguration["local-address"]);
            let port = tcpServerConfiguration["local-port"];
            let ipaddressAndPort = address + ":" + port;
            if (operationName.indexOf("/") != 0) {
                operationName = "/" + operationName
            }
            let request = (protocol.toLowerCase()) + "://" + ipaddressAndPort + operationName;
            resolve(request);
        } catch (error) {
            reject(error);
        }
    });

}

/**
 * @description This function returns the address configured .
 * @param {String} address : address of the tcp server .
 * @returns {promise} string {address}
 **/
function getConfiguredAddress(address) {
    return new Promise(async function (resolve, reject) {
        try {
            let domainName = onfAttributes.TCP_SERVER.DOMAIN_NAME;
            if (domainName in address) {
                address = address["domain-name"];
            } else {
                address = address[
                    onfAttributes.TCP_SERVER.IPV_4_ADDRESS
                ];
            }
            resolve(address);
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

            let profilesList = await profileCollection.getProfileListForProfileNameAsync(profile.profileNameEnum.RESPONSE_PROFILE);
            for (let i = 0; i < profilesList.length; i++) {
                let profileInstance = profilesList[i];
                let uuid = profileInstance["uuid"];
                let responseProfile = await ResponseProfile.getResponseProfile(uuid);
                let responseProfilePac = responseProfile[onfAttributes.RESPONSE_PROFILE.PAC];
                let responseProfileCapability = responseProfilePac.responseProfileCapability;
                if (operationName === responseProfileCapability.operationName) {
                    let responseProfileConfiguration = responseProfilePac.responseProfileConfiguration;
                    let fieldName = responseProfileCapability.fieldName;
                    let value = responseProfileConfiguration.value;
                    let fieldNameReference = fieldName[onfAttributes.RESPONSE_PROFILE.FIELD_NAME_REFERENCE];
                    let valueReference = value[onfAttributes.RESPONSE_PROFILE.VALUE_REFERENCE];
                    if (fieldNameReference !== undefined) {
                        responseInstanceFieldName = await fileOperation.readFromDatabaseAsync(fieldNameReference);
                    } else {
                        responseInstanceFieldName = fieldName[onfAttributes.RESPONSE_PROFILE.STATIC_FIELD_NAME];
                    }
                    if (valueReference !== undefined) {
                        responseInstanceValue = await fileOperation.readFromDatabaseAsync(valueReference);
                    } else {
                        responseInstanceValue = value[onfAttributes.RESPONSE_PROFILE.STATIC_VALUE];
                    }
                    responseInstancedataTypeOfValue = typeof responseInstanceValue;
                    responseInstanceValue = await getDataUpdatePeriodEnum(fieldName, responseInstanceValue)

                    let response = new responseValue(
                        responseInstanceFieldName,
                        responseInstanceValue,
                        responseInstancedataTypeOfValue
                    );
                    responseValueList.push(response);
                }
            }
            resolve(responseValueList)
        } catch (error) {
            reject(error);
        }

    });
}

async function getDataUpdatePeriodEnum(fieldName, responseInstanceValue) {
    return new Promise(async function (resolve, reject) {
        try {
            let fieldNameDataUpdatePeriod = "dataUpdatePeriod"
            let dataUpdatePeriodEnum = {
                "real-time": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
                "1h-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_1H_PERIOD",
                "24h-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_24H_PERIOD",
                "manual": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_MANUAL"
            };
            if (fieldName['static-field-name'] == fieldNameDataUpdatePeriod) {
                for (let dataUpdatePeriodKey in dataUpdatePeriodEnum) {
                    if (dataUpdatePeriodEnum[dataUpdatePeriodKey] == responseInstanceValue) {
                        responseInstanceValue = dataUpdatePeriodKey;
                    }
                }              
            }
            resolve(responseInstanceValue);
        } catch (error) {
            reject(error);
        }
    });
}
