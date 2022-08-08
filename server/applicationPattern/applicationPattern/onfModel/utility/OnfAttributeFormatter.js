/**
 * @file This class provides functionalities that converts the attributes to onf format. 
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       23.09.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG* 
 **/

'use strict';

/**
 * @description This function modifies the json object keys from lower camelCase to kebabCase<br>
 * @param {Object} jsonObject json object for which the keys needs to be modified to kebabCase.<br>
 * <b><u>Procedure :</u></b><br>
 * <b>step 1 :</b> This function iterate through the entire json object and use the function camelCaseToKebabCase to convert the case<br>
 * <b>step 2 :</b> If the json entry is an array , then recursively this function will be called to modify the keys of the object inside the array<br>
 * <b>step 3 :</b> If the json entry is not an array , the directly the keys will be modified<br>
 **/
exports.modifyJsonObjectKeysToKebabCase = function modifyJsonObjectKeysToKebabCase(jsonObject) {
  Object.keys(jsonObject).forEach(key => {
    jsonObject[camelCaseToKebabCase(key)] = jsonObject[key];
    if (/[A-Z]/.test(key)) {
      delete jsonObject[key];
    }
    if (Array.isArray(jsonObject[camelCaseToKebabCase(key)])) {
      for (var i = 0; i < jsonObject[camelCaseToKebabCase(key)].length; i++) {
        let arrayInstance = jsonObject[camelCaseToKebabCase(key)][i];
        if (typeof arrayInstance === "object") {
          modifyJsonObjectKeysToKebabCase(arrayInstance);
        }
      }
    } else if (typeof jsonObject[camelCaseToKebabCase(key)] === "object") {
      modifyJsonObjectKeysToKebabCase(jsonObject[camelCaseToKebabCase(key)]);
    }
  });
  return jsonObject;
}

/**
 * @description This function modifies the kebabcase strings to lower camelCase<br>
 * @param {string} wordInKebabCase word that is in kebabCase.<br>
 * @return {string} wordInLowerCamelCase
 **/
exports.modifyKebabCaseToLowerCamelCase = function modifyKebabCaseToLowerCamelCase(wordInKebabCase) {
  let splittedStringList = wordInKebabCase.split('-');
  let wordInLowerCamelCase = splittedStringList[0];
  for (let i = 1; i < splittedStringList.length; i++) {
    wordInLowerCamelCase = wordInLowerCamelCase + splittedStringList[i].charAt(0).toUpperCase() + splittedStringList[i].slice(1);
  }
  return wordInLowerCamelCase;
}

/**
 * @description This function modifies the camelCase string to kebabCase<br>
 * @param {String} camelCaseString string for which the keys needs to be modified to kebabCase.<br>
 * <b><u>Procedure :</u></b><br>
 * <b>step 1 :</b> Identifies capital letter and prefix it with a hypen<br>
 * <b>step 2 :</b> Identifies numbers and prefix it with a hypen<br>
 * <b>step 3 :</b> Convert the whole string to lower case<br>
 **/

function camelCaseToKebabCase(camelCaseString) {
  if (camelCaseString.includes(":")) {
    return camelCaseString
  }
  return camelCaseString
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([^0-9])/g, '$1-$2')
    .replace(/([^0-9])([0-9])/g, '$1-$2')
    .replace(/-+/g, '-')
    .toLowerCase();
}