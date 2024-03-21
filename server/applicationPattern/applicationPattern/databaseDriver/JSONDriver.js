// @ts-check
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
const AsyncLock = require('async-lock');
const createHttpError = require('http-errors');



global.databasePath;

const lock = new AsyncLock();

/**
 * This function reads the requested oam path from the core-model<br>
 * @param {String} oamPath json path that leads to the destined attribute
 * @returns {Promise<any>} return the requested value
 */
exports.readFromDatabaseAsync = async function (oamPath) {
    return await lock.acquire(global.databasePath, async () => {
        let coreModelJsonObject = await fileSystem.promises.readFile(global.databasePath, 'utf-8');
        let individualFieldOfTheOAMPathList = oamPath.split('/');
        return getAttributeValueFromDataBase(JSON.parse(coreModelJsonObject), individualFieldOfTheOAMPathList);
    });
}

/**
 * This function writes the requested data to the path in the core-model<br>
 * @param {String} oamPath json path that leads to the destined attribute
 * @param {JSON|String} valueToBeUpdated value that needs to be updated
 * @param {Boolean} isAList a boolean flag that represents whether the value to be updated is a list
 * @returns {Promise<Boolean>} return true if the value is updated, otherwise returns false
 */
exports.writeToDatabaseAsync = async function (oamPath, valueToBeUpdated, isAList) {
    if (isAList !== true && typeof valueToBeUpdated !== "string") {
        for (let keyAttributeOfTheList in valueToBeUpdated) {
            valueToBeUpdated = valueToBeUpdated[keyAttributeOfTheList];
        }
    }
    return await lock.acquire(global.databasePath, async () => {
        let coreModelJsonObject = await fileSystem.promises.readFile(global.databasePath, 'utf-8');
        let individualFieldOfTheOAMPathList = oamPath.split('/');
        let result = putAttributeValueToDataBase(JSON.parse(coreModelJsonObject), individualFieldOfTheOAMPathList, valueToBeUpdated, isAList);
        return result;
    });
}

/**
 * This function deletes the requested data in the oam path from the core-model<br>
 * @deprecated remove unused params valueToBeDeleted and isAList
 * @param {String} oamPath json path that leads to the destined attribute
 * @returns {Promise<Boolean>} return true if the value is deleted, otherwise returns false
 */
exports.deletefromDatabaseAsync = async function (oamPath) {
    return await lock.acquire(global.databasePath, async () => {
        let coreModelJsonObject = await fileSystem.promises.readFile(global.databasePath, 'utf-8');
        let individualFieldOfTheOAMPathList = oamPath.split('/');
        let result = deleteAttributeValueFromDataBase(JSON.parse(coreModelJsonObject), individualFieldOfTheOAMPathList);
        return result;
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
 * @param {JSON} coreModelJsonObject Json data to use for searching the value.
 * @param {Array<String>} individualFieldOfTheOAMPathList the path used to find the value.
 * @returns {any|undefined}
 **/
function getAttributeValueFromDataBase(coreModelJsonObject, individualFieldOfTheOAMPathList) {
    try {
        for (let individualField of individualFieldOfTheOAMPathList) {
            if (individualField !== "") {
                if (individualField.includes("=")) {
                    coreModelJsonObject = findMatchingInstanceFromList(individualField, coreModelJsonObject);
                    if(Array.isArray(coreModelJsonObject)){
                        throw new Error(' UUID is not found')
                    }
                } else {
                    coreModelJsonObject = coreModelJsonObject[individualField];
                }
            }
        }
        return coreModelJsonObject;
    } catch (error) {
        console.log(error);
        throw new createHttpError.NotFound(" UUID is does not exit")
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
 * @param {JSON} coreModelJsonObject Json data for searching the value.
 * @param {Array<String>} individualFieldOfTheOAMPathList  path to find the value.
 * @param {JSON|String} newValue new value to be changed or added
 * @param {Boolean} isAList whether the newValue to be updated is an entry to a List or it is updating a scalar value
 * @returns {Boolean} if the updation is successful , returns true , otherwise returns false.
 **/
function putAttributeValueToDataBase(coreModelJsonObject, individualFieldOfTheOAMPathList, newValue, isAList) {
    try {
        let coreModelJsonObjectTemp;
        let i;

        coreModelJsonObjectTemp = coreModelJsonObject;
        for (i = 0; i < individualFieldOfTheOAMPathList.length; i++) {
            if (individualFieldOfTheOAMPathList[i] != "") {
                if (individualFieldOfTheOAMPathList[i].includes("=")) {
                    coreModelJsonObjectTemp = findMatchingInstanceFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                } else {
                    if (i === individualFieldOfTheOAMPathList.length - 1) {
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
 * @param {JSON} coreModelJsonObject Json data for searching the value.
 * @param {Array<String>} individualFieldOfTheOAMPathList  path to find the value.
 * @returns {Boolean} if the deletion is successful , returns true , otherwise returns false.
 **/
function deleteAttributeValueFromDataBase(coreModelJsonObject, individualFieldOfTheOAMPathList) {
    try {
        let coreModelJsonObjectTemp = coreModelJsonObject;
        let i;
        for (i = 0; i < individualFieldOfTheOAMPathList.length; i++) {
            if (individualFieldOfTheOAMPathList[i] !== "") {
                if (individualFieldOfTheOAMPathList[i].includes("=")) {
                    if (i === individualFieldOfTheOAMPathList.length - 1) {
                        coreModelJsonObjectTemp = findMatchingInstanceAndDeleteFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                        writeToFile(coreModelJsonObject);
                    } else {
                        coreModelJsonObjectTemp = findMatchingInstanceFromList(individualFieldOfTheOAMPathList[i], coreModelJsonObjectTemp);
                    }
                } else {
                    if (i === individualFieldOfTheOAMPathList.length - 1) {
                        if (Array.isArray(coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]])) {
                            coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]] = [];
                        } else {
                            coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]] = undefined;
                        }
                        writeToFile(coreModelJsonObject);
                    } else {
                        coreModelJsonObjectTemp = coreModelJsonObjectTemp[individualFieldOfTheOAMPathList[i]];
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
 * Write to the filesystem.<br>
 * @param {JSON} coreModelJsonObject json object that needs to be updated
 * @returns {Boolean} return true if the value is updated, otherwise returns false
 **/
function writeToFile(coreModelJsonObject) {
    try {
        fileSystem.writeFileSync(global.databasePath, JSON.stringify(coreModelJsonObject));
        return true;
    } catch (error) {
        console.log('write failed:', error)
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
        keyAttributeOfTheList = primaryKey.keyAttributeOfList[nameOfTheList];
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
    keyAttributeOfTheList = primaryKey.keyAttributeOfList[nameOfTheList];
    coreModelJsonObject = coreModelJsonObject[nameOfTheList];
    coreModelJsonObject.forEach((element, index) => {
        if (element[keyAttributeOfTheList] == valueOfTheKeyAttributeOfTheList) {
            coreModelJsonObject = coreModelJsonObject.splice(index, 1);
        }
    });
    return coreModelJsonObject;
}

