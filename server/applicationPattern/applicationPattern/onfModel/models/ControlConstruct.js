/**
 * This class provides a stub for ONF core-model-1-4:control-construct. 
 * It provides functionality to ,
 *    - read the currently configured attribute values of the core-model-1-4:control-construct
 *    - configure the logical-termination-point and forwarding-domain
 **/

'use strict';

const onfPaths = require('../constants/OnfPaths');
const onfAttributes = require('../constants/OnfAttributes');
const onfFormatter = require('../utility/OnfAttributeFormatter');
const fileOperation = require('../../databaseDriver/JSONDriver');

class ControlConstruct {

  /**
   * @description This function returns the forwarding-domain list entries from the core-model-1-4:control-construct
   * @returns {promise} returns ForwardingDomain List.
   **/
  static async getForwardingDomainListAsync() {
    return new Promise(async function (resolve, reject) {
      try {
        let forwardingDomainList = await fileOperation.readFromDatabaseAsync(onfPaths.FORWARDING_DOMAIN);
        resolve(forwardingDomainList);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description This function returns the logical-termination-point list entries from the core-model-1-4:control-construct that 
   * matches the layerProtocolName
   * @param {String} layerProtocolName : The vaue can be either undefined or any one of the LayerProtocol.layerProtocolNameEnum
   * @returns {promise} returns LogicalTerminationPoint instance List.
   **/
  static async getLogicalTerminationPointListAsync(layerProtocolName) {
    return new Promise(async function (resolve, reject) {
      let filteredLogicalTerminationPointList = [];
      try {
        let logicalTerminationPointList = await fileOperation.readFromDatabaseAsync(
          onfPaths.LOGICAL_TERMINATION_POINT);
        if (layerProtocolName) {
          for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let logicalTerminationPoint = logicalTerminationPointList[i];
            let layerProtocolList = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL];
            let layerProtocol = layerProtocolList[0]
            let _layerProtocolName = layerProtocol[onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
            if (_layerProtocolName == layerProtocolName) {
              filteredLogicalTerminationPointList.push(logicalTerminationPoint);
            }
          }
          resolve(filteredLogicalTerminationPointList);
        } else {
          resolve(logicalTerminationPointList);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description This function returns the logical-termination-point instance from the core-model-1-4:control-construct/
   * logical-termination-point that matches the logicalTerminationPointUuid
   * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(http|tcp|op)-(s|c)-\d{4}$'
   * @returns {promise} returns {undefined | LogicalTerminationPoint}
   **/
  static getLogicalTerminationPointAsync(logicalTerminationPointUuid) {
    return new Promise(async function (resolve, reject) {
      let logicalTerminationPoint;
      try {
        let logicalTerminationPointList = await fileOperation.readFromDatabaseAsync(
          onfPaths.LOGICAL_TERMINATION_POINT
        );
        if (logicalTerminationPointList != undefined) {
          for (let i = 0; i < logicalTerminationPointList.length; i++) {
            let _logicalTerminationPoint = logicalTerminationPointList[i];
            let _logicalTerminationPointUuid = _logicalTerminationPoint[onfAttributes.GLOBAL_CLASS.UUID];
            if (_logicalTerminationPointUuid == logicalTerminationPointUuid) {
              logicalTerminationPoint = _logicalTerminationPoint;
            }
          }
        }
        resolve(logicalTerminationPoint);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * @description This function returns the profile-collection from core-model-1-4:control-construct
   * @returns {promise} returns {undefined | profileCollection}
   **/
  static async getProfileCollectionAsync() {
    return new Promise(async function (resolve, reject) {
      let profileCollection;
      try {
        profileCollection = await fileOperation.readFromDatabaseAsync(
          onfPaths.PROFILE_COLLECTION
        );
        resolve(profileCollection);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description This function returns the current value of the attribute core-model-1-4:control-construct/uuid
   * @returns {promise} returns {undefined | uuid}
   **/
  static async getUuidAsync() {
    return new Promise(async function (resolve, reject) {
      let uuid;
      try {
        uuid = await fileOperation.readFromDatabaseAsync(
          onfPaths.CONTROL_CONSTRUCT_UUID
        );
        resolve(uuid);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description This function adds a logical-termination-point instance to the core-model-1-4:control-construct/logical-termination-point
   * @param {String} logicalTerminationPoint an instance of the LogicalTerminationPoint
   * @returns {promise} returns {true|false}
   **/
  static addLogicalTerminationPointAsync(logicalTerminationPoint) {
    return new Promise(async function (resolve, reject) {
      let isCreated = false;
      try {
        logicalTerminationPoint = onfFormatter.modifyJsonObjectKeysToKebabCase(logicalTerminationPoint);
        isCreated = await fileOperation.writeToDatabaseAsync(
          onfPaths.LOGICAL_TERMINATION_POINT,
          logicalTerminationPoint,
          true);
        resolve(isCreated);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description This function deletes a logical-termination-point instance that matches the uuid argument from the 
   * core-model-1-4:control-construct/logical-termination-point
   * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(http|tcp|op)-(s|c)-\d{4}$'
   * @returns {promise} returns {true|false}
   **/
  static deleteLogicalTerminationPointAsync(logicalTerminationPointUuid) {
    return new Promise(async function (resolve, reject) {
      let isDeleted = false;
      try {
        let logicalTerminationPointPath = onfPaths.LOGICAL_TERMINATION_POINT + "=" + logicalTerminationPointUuid
        isDeleted = await fileOperation.deletefromDatabaseAsync(
          logicalTerminationPointPath, 
          logicalTerminationPointUuid, 
          true);
        resolve(isDeleted);
      } catch (error) {
        reject(false);
      }
    });
  }

}

module.exports = ControlConstruct;