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
   * @returns {Promise<Array>} ForwardingDomain List
   **/
  static async getForwardingDomainListAsync() {
    return await fileOperation.readFromDatabaseAsync(onfPaths.FORWARDING_DOMAIN);
  }

  /**
   * @description This function returns the logical-termination-point list entries from the core-model-1-4:control-construct that 
   * matches the layerProtocolName. If layerProtocolName is undefined, it returns all LTPs.
   * @param {String} layerProtocolName The value can be either undefined or any one of the LayerProtocol.layerProtocolNameEnum
   * @returns {Promise<Array>} LogicalTerminationPoint instance List
   **/
  static async getLogicalTerminationPointListAsync(layerProtocolName) {
    let logicalTerminationPointList = await fileOperation.readFromDatabaseAsync(
      onfPaths.LOGICAL_TERMINATION_POINT);
    if (!layerProtocolName) {
      return logicalTerminationPointList;
    }
    let filteredLogicalTerminationPointList = [];
    if (layerProtocolName) {
      for (let logicalTerminationPoint of logicalTerminationPointList) {
        let layerProtocolList = logicalTerminationPoint[onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL];
        let layerProtocol = layerProtocolList[0];
        let _layerProtocolName = layerProtocol[onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
        if (_layerProtocolName === layerProtocolName) {
          filteredLogicalTerminationPointList.push(logicalTerminationPoint);
        }
      }
      return filteredLogicalTerminationPointList;
    }
  }

  /**
   * @description This function returns the logical-termination-point instance from the core-model-1-4:control-construct/
   * logical-termination-point that matches the logicalTerminationPointUuid
   * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(http|tcp|op)-(s|c)-\d{4}$'
   * @returns {Promise<Object|undefined>} LogicalTerminationPoint
   **/
  static async getLogicalTerminationPointAsync(logicalTerminationPointUuid) {
    let logicalTerminationPointList = await fileOperation.readFromDatabaseAsync(
      onfPaths.LOGICAL_TERMINATION_POINT
    );
    if (!logicalTerminationPointList) {
      return undefined;
    }
    return logicalTerminationPointList.find(ltp => ltp[onfAttributes.GLOBAL_CLASS.UUID] === logicalTerminationPointUuid);
  }


  /**
   * @description This function returns the profile-collection from core-model-1-4:control-construct
   * @returns {Promise} profile-collection
   **/
  static async getProfileCollectionAsync() {
    return await fileOperation.readFromDatabaseAsync(onfPaths.PROFILE_COLLECTION);
  }

  /**
   * @description This function returns the current value of the attribute core-model-1-4:control-construct/uuid
   * @returns {Promise<String|undefined>} UUID
   **/
  static async getUuidAsync() {
    return await fileOperation.readFromDatabaseAsync(onfPaths.CONTROL_CONSTRUCT_UUID);
  }

  /**
   * @description This function adds a logical-termination-point instance to the core-model-1-4:control-construct/logical-termination-point
   * @param {Object} logicalTerminationPoint an instance of the LogicalTerminationPoint
   * @returns {Promise<Boolean>}
   **/
  static async addLogicalTerminationPointAsync(logicalTerminationPoint) {
    logicalTerminationPoint = onfFormatter.modifyJsonObjectKeysToKebabCase(logicalTerminationPoint);
    return await fileOperation.writeToDatabaseAsync(
      onfPaths.LOGICAL_TERMINATION_POINT,
      logicalTerminationPoint,
      true);
  }

  /**
   * @description This function deletes a logical-termination-point instance that matches the uuid argument from the 
   * core-model-1-4:control-construct/logical-termination-point
   * @param {String} logicalTerminationPointUuid : the value should be a valid string in the pattern '-\d+-\d+-\d+-(http|tcp|op)-(s|c)-\d{4}$'
   * @returns {Promise<Boolean>}
   **/
  static async deleteLogicalTerminationPointAsync(logicalTerminationPointUuid) {
    let logicalTerminationPointPath = onfPaths.LOGICAL_TERMINATION_POINT + "=" + logicalTerminationPointUuid;
    return await fileOperation.deletefromDatabaseAsync(logicalTerminationPointPath);
  }
}

module.exports = ControlConstruct;
