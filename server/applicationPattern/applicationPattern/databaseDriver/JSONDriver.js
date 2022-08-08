/**
 * <p>This class provides functionality to read and update the flat file JSON database load file in onf format.
 * The interaction with the file system will be performed with the use of 'fs module' which enables interacting with the file system
 * in a way modeled on standard Portable Operating System Interface for UNIX(POSIX) functions. Also by using the 'path' module that provides utilities for 
 * working with files and directory paths.</p>  
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       05.08.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG
 * @module FileOperation
 **/

const fileSystem = require('fs');
const primaryKey = require('./PrimaryKey');
global.databasePath;

/**
 * This function reads the requested oam path from the core-model<br>
 * @param {object} oamPath json path that leads to the destined attribute
 * @returns {promise} return the requested value
 */
exports.readFromDatabaseAsync = function (oamPath) {
    return new Promise(async function (resolve, reject) {
        try {
            if (fileSystem.existsSync(databasePath)) {
                await fileSystem.readFile(databasePath, 'utf-8', (error, coreModelJsonObject) => {
                    if (coreModelJsonObject.length > 0) {
                        resolve(getAttributeValueFromDataBase(JSON.parse(coreModelJsonObject), oamPath));
                    }
                });
            }else{
                console.log("path not exists "+databasePath);
            }
        } catch (error) {
            console.log(error);
            reject();
        }
    });
}

/**
 * This function writes the requested data to the path in the core-model<br>
 * @param {object} oamPath json path that leads to the destined attribute
 * @param {JSONObject|String} valueToBeUpdated value that needs to be updated
 * @param {boolean} isAList a boolean flag that represents whether the value to be updated is a list
 * @returns {promise} return true if the value is updated, otherwise returns false
 */
exports.writeToDatabaseAsync = function (oamPath, valueToBeUpdated, isAList) {
    if (isAList !== true) {
        if (typeof valueToBeUpdated !== "string") {
            for (keyAttributeOfTheList in valueToBeUpdated) {
                valueToBeUpdated = valueToBeUpdated[keyAttributeOfTheList];
            }
        }
    }
    return new Promise(async function (resolve, reject) {
        try {
            if (fileSystem.existsSync(databasePath)) {
                await fileSystem.readFile(databasePath, 'utf-8', (error, coreModelJsonObject) => {
                    if (coreModelJsonObject.length > 0) {
                        resolve(putAttributeValueToDataBase(JSON.parse(coreModelJsonObject), oamPath, valueToBeUpdated, isAList));
                    }
                });
            }
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

/**
 * This function deletes the requested data in the oam path from the core-model<br>
 * @param {object} oamPath json path that leads to the destined attribute
 * @param {JSONObject|String} valueToBeDeleted value that needs to be deleted
 * @param {boolean} isAList a boolean flag that represents whether the value to be deleted is a list
 * @returns {promise} return true if the value is deleted, otherwise returns false
 */
exports.deletefromDatabaseAsync = function (oamPath, valueToBeDeleted, isAList) {
    if (isAList !== true) {
        if (typeof valueToBeUpdated !== "string") {
            for (keyAttributeOfTheList in valueToBeDeleted) {
                valueToBeDeleted = valueToBeDeleted[keyAttributeOfTheList];
            }
        }
    }
    return new Promise(async function (resolve, reject) {
        try {
            if (fileSystem.existsSync(databasePath)) {
                await fileSystem.readFile(databasePath, 'utf-8', (error, coreModelJsonObject) => {
                    if (coreModelJsonObject.length > 0) {
                        resolve(deleteAttributeValueFromDataBase(JSON.parse(coreModelJsonObject), oamPath, valueToBeDeleted, isAList));
                    }
                });
            }
        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

/**
 * Reads the value of the oam path that exists in the core-model in json format.<br>
 * <b><u>Procedure : </u></b><br>
 * <b>step 1 : </b>split the oam Path string with the delimiter "/" and get individual element of the oam path<br>
 * <b>step 2 : </b>Then, for each individual element in the path , the following steps will happen , <br>
 * <b>step 3 : </b>If the element contains "=" , then this element will be considered as a list.<br>
 *          The following sequence will happen<br>
 *          3.1: By using the findKeyAttributeForList function , the corresponding key attribute for the list will be figured out<br>
 *          3.2: Then, by iterating each entry of the list , the correct match will be identified based on comparing the key attribute to the value present in the path attribute<br>
 * <b>step 4 : </b>If the element doesn't contain "=" , then it will be considered as scalar and its value will be access by the reference within square bracket.<br>
 * <b>step 5 : </b>Once reaching the final element of the oam path , the value of this attribute will be returned.  <br> 
 * @param {JSONObject} coreModelJsonObject Json data to use for searching the value.
 * @param {String} oamPath the path used to find the value.
 * @returns {valueOfTheOAMPath|undefined}
 **/
function getAttributeValueFromDataBase(coreModelJsonObject, oamPath) {
    try {
        let individualFieldOfTheOAMPathList;
        individualFieldOfTheOAMPathList = oamPath.split('/');
        if (isNotAnEmptyList(individualFieldOfTheOAMPathList)) {
            let i;
            for (i = 0; i < individualFieldOfTheOAMPathList.length; i++) {
                if (isDataValid(individualFieldOfTheOAMPathList[i])) {
                    if (isFieldIsAList(individualFieldOfTheOAMPathList[i])) {
                        coreModelJsonObject = findMatchingInstanceFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObject);
                    } else {
                        coreModelJsonObject = coreModelJsonObject[individualFieldOfTheOAMPathList[i]];
                    }
                }
            }
        }
        return coreModelJsonObject;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

/**
 * Write the new value to the oam path exists in a core-model.<br> 
 * <b><u>Procedure : </u></b><br>
 * <b>step 1 : </b>split the oam Path string with the delimiter "/" and get individual element of the oam path<br> 
 * <b>step 2 : </b>Then, for each individual element in the path , the following steps will happen , <br> 
 * <b>step 3 : </b>If the element contains "=" , then this element will be considered as a list.<br> 
 *          The following sequence will happen<br> 
 *          3.1: By using the findKeyAttributeForList function , the corresponding key attribute for the list will be figured out<br> 
 *          3.2: Then, by iterating each entry of the list , the correct match will be identified based on comparing the key attribute to the value present in the path attribute<br> 
 * <b>step 4 : </b>If the element doesn't contain "=" , then it will be considered as scalar and its value will be access by the reference within square bracket.<br> 
 * <b>step 5 : </b>Once reaching the final element of the path , new value will overwrite the old value. <br> 
 * <b>step 6 : </b>Finally the entire JSON data will be written to the load file.<br> 
 * 
 * @param {JSONObject} coreModelJsonObject Json data for searching the value.
 * @param {String} oamPath  path to find the value.
 * @param {JSONObject} newValue new value to be changed or added
 * @param {boolean} isAList whether the newValue to be updated is an entry to a List or it is updating a scalar value
 * @returns {true|false} if the updation is successful , returns true , otherwise returns false.
 **/
function putAttributeValueToDataBase(coreModelJsonObject, oamPath, newValue, isAList) {
    try {
        let individualFieldOfTheOAMPathList;
        let coreModelJsonObjectTemp;
        let i;

        individualFieldOfTheOAMPathList = oamPath.split('/');
        coreModelJsonObjectTemp = coreModelJsonObject;
        if (isNotAnEmptyList(individualFieldOfTheOAMPathList)) {
            for (i = 0; i < individualFieldOfTheOAMPathList.length; i++) {
                if (isDataValid(individualFieldOfTheOAMPathList[i])) {
                    if (isFieldIsAList(individualFieldOfTheOAMPathList[i])) {
                        coreModelJsonObjectTemp = findMatchingInstanceFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                    } else {
                        if (isLastIndexOfTheList(individualFieldOfTheOAMPathList, i)) {
                            if (isAList === true) {
                                coreModelJsonObjectTemp = coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]];
                                coreModelJsonObjectTemp.push(newValue);
                            } else {
                                coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]] = newValue;
                            }
                            writeToFile(coreModelJsonObject);
                        } else {
                            coreModelJsonObjectTemp = coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]];
                        }
                    }
                }
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Deletes the existing value in the specified oam path in the core-model.<br>
 * <b><u>Procedure : </u></b><br>
 * <b>step 1 : </b>split the oam Path string with the delimiter "/" and get individual element of the oam path <br>
 * <b>step 2 : </b>Then, for each individual element in the path , the following steps will happen , <br>
 * <b>step 3 : </b>If the element contains "=" , then this element will be considered as a list.<br>
 *          The following sequence will happen<br>
 *          3.1: By using the findKeyAttributeForList function , the corresponding key attribute for the list will be figured out<br>
 *          3.2: Then, by iterating each entry of the list , the correct match will be identified based on comparing the key attribute to the value present in the path attribute<br>
 * <b>step 4 : </b>If the element doesn't contain "=" , then it will be considered as scalar and its value will be access by the reference within square bracket.<br>
 * <b>step 5 : </b>Once reaching the final element of the path , the value will be removed from the jsonObject <br>
 * <b>step 6 : </b>Finally the entire JSON data will be written to the load file.<br>
 * 
 * @param {JSONObject} coreModelJsonObject Json data for searching the value.
 * @param {String} oamPath  path to find the value.
 * @param {JSONObject} valueToBeDeleted value needs to be deleted
 * @param {boolean} isAList whether the newValue to be updated is an entry to a List or it is updating a scalar value
 * @returns {true|false} if the deletion is successful , returns true , otherwise returns false.
 **/
function deleteAttributeValueFromDataBase(coreModelJsonObject, oamPath, valueToBeDeleted, isAList) {
    try {
        let individualFieldOfTheOAMPathList;
        let coreModelJsonObjectTemp = coreModelJsonObject;
        let i;

        individualFieldOfTheOAMPathList = oamPath.split('/');
        if (individualFieldOfTheOAMPathList.length > 0) {
            for (i = 0; i < individualFieldOfTheOAMPathList.length; i++) {
                if (isDataValid(individualFieldOfTheOAMPathList[i])) {
                    if (isFieldIsAList(individualFieldOfTheOAMPathList[i])) {
                        if (isLastIndexOfTheList(individualFieldOfTheOAMPathList, i)) {
                            coreModelJsonObjectTemp = findMatchingInstanceAndDeleteFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                            writeToFile(coreModelJsonObject);
                        } else {
                            coreModelJsonObjectTemp = findMatchingInstanceFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                        }
                    } else {
                        if (isLastIndexOfTheList(individualFieldOfTheOAMPathList, i)) {
                            coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]] = undefined;
                            writeToFile(coreModelJsonObject);
                        } else {
                            coreModelJsonObjectTemp = coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]];
                        }
                    }
                }
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/** 
 * Returns the key attribute of the list<br>
 * @param {String} nameOfTheList Name of the JSON array.
 * @returns {keyAttributeOfTheList} returns the key attribute of the list
 **/
function findKeyAttributeForList(nameOfTheList) {
    try {
        let keyAttributeOfTheList;
        keyAttributeOfTheList = primaryKey.keyAttributeOfList[nameOfTheList];
        return keyAttributeOfTheList;
    } catch (error) {
        return undefined;
    }
}

/** 
 * Write to the filesystem.<br>
 * @param {JSONObject} coreModelJsonObject json object that needs to be updated
 * @returns {boolean} return true if the value is updated, otherwise returns false
 **/
function writeToFile(coreModelJsonObject) {
    try {
        fileSystem.writeFileSync(databasePath, JSON.stringify(coreModelJsonObject), (error) => {
            if (error) {
                console.log('write failed:')
                throw "write failed:";
            } else {
                console.log('write successful:');
                resolve();
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}

function findMatchingInstanceFromList(individualFieldOfTheOAMPath, coreModelJsonObject) {
    let nameOfTheList;
    let valueOfTheKeyAttributeOfTheList;
    let keyAttributeOfTheList;
    try {
        nameOfTheList = individualFieldOfTheOAMPath.split("=")[0];
        valueOfTheKeyAttributeOfTheList = individualFieldOfTheOAMPath.split("=")[1];
        keyAttributeOfTheList = findKeyAttributeForList(nameOfTheList);
        coreModelJsonObject = coreModelJsonObject[nameOfTheList];
        coreModelJsonObject.forEach(element => {
            if (element[keyAttributeOfTheList] == valueOfTheKeyAttributeOfTheList) {
                coreModelJsonObject = element;
            }
        });
    } catch (error) {
        console.log(error);
        console.log(individualFieldOfTheOAMPath);
    }
    return coreModelJsonObject;
}

function findMatchingInstanceAndDeleteFromList(individualFieldOfTheOAMPath, coreModelJsonObject) {
    let nameOfTheList;
    let valueOfTheKeyAttributeOfTheList;
    let keyAttributeOfTheList;

    nameOfTheList = individualFieldOfTheOAMPath.split("=")[0];
    valueOfTheKeyAttributeOfTheList = individualFieldOfTheOAMPath.split("=")[1];
    keyAttributeOfTheList = findKeyAttributeForList(nameOfTheList);
    coreModelJsonObject = coreModelJsonObject[nameOfTheList];
    coreModelJsonObject.forEach((element, index) => {
        if (element[keyAttributeOfTheList] == valueOfTheKeyAttributeOfTheList) {
            coreModelJsonObject = coreModelJsonObject.splice(index, 1);
        }
    });
    return coreModelJsonObject;
}

function isDataValid(value) {
    if (value) {
        if (value !== undefined && value != "") {
            return true;
        }
    }
    return false;
}

function isFieldIsAList(field) {
    if (field.includes("=")) {
        return true;
    } else {
        return false;
    }
}

function isNotAnEmptyList(individualFieldOfTheOAMPathList) {
    if (individualFieldOfTheOAMPathList !== undefined && individualFieldOfTheOAMPathList.length > 0) {
        return true;
    } else {
        return false;
    }
}

function isLastIndexOfTheList(individualFieldOfTheOAMPathList, i) {
    if (individualFieldOfTheOAMPathList !== undefined && i === individualFieldOfTheOAMPathList.length - 1) {
        return true;
    } else {
        return false;
    }
}