/**
 * This module provides functionalities to
 *      - manipulate the /core-model-1-4:control-construct/logical-termination-point
 *      - create tcp, http, operation client instance groups for new applications
 *      - update or configure parameters of the tcp, http, operation client instance groups for an existing applications
 *      - delete the tcp, http, operation client instance groups of an unwanted applications
 **/
// @ts-check
'use strict';

const ControlConstruct = require('../models/ControlConstruct');
const LogicalTerminationPoint = require('../models/LogicalTerminationPoint');
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const OperationClientInterface = require('../models/layerProtocols/OperationClientInterface');
const LogicalTerminationPointConfigurationStatus = require('./models/logicalTerminationPoint/ConfigurationStatus');
const ConfigurationStatus = require('./models/ConfigurationStatus');
const TcpClientInterface = require('../models/layerProtocols/TcpClientInterface');
const ForwardingConstruct = require('../models/ForwardingConstruct');
const ForwardingDomain = require('../models/ForwardingDomain');
const FcPort = require('../models/FcPort');
const onfAttributes = require('../constants/OnfAttributes');
// eslint-disable-next-line no-unused-vars
const LogicalTerminationPointConfigurationInput = require('./models/logicalTerminationPoint/ConfigurationInput');
// eslint-disable-next-line no-unused-vars
const TcpObject = require('./models/TcpObject');

/**
 * @description This function creates or finds the http, operation and tcp client if required.
 * @param {LogicalTerminationPointConfigurationInput} logicalTerminationPointConfigurationInput
 * @param {Boolean} isApplicationRO true if the application to be changed is RegistryOffice
 * @return {Promise<LogicalTerminationPointConfigurationStatus>}
 **/
exports.createOrUpdateApplicationLtpsAsync = async function (logicalTerminationPointConfigurationInput, isApplicationRO) {
  let logicalTerminationPointConfigurationStatus;
  const httpClientUuid = logicalTerminationPointConfigurationInput.httpClientUuid;
  if (!httpClientUuid) {
    logicalTerminationPointConfigurationStatus = await createLtpInstanceGroupAsync(
      logicalTerminationPointConfigurationInput, isApplicationRO
    );
  } else {
    logicalTerminationPointConfigurationStatus = await updateLtpInstanceGroupAsync(
      logicalTerminationPointConfigurationInput, isApplicationRO
    );
  }
  return logicalTerminationPointConfigurationStatus;
}

/**

 * @description This function creates or finds the http, operation and tcp client if required.

 * @param {LogicalTerminationPointConfigurationInput} logicalTerminationPointConfigurationInput

 * @return {Promise<LogicalTerminationPointConfigurationStatus>}

 **/

exports.FindAndUpdateApplicationLtpsAsync = async function (logicalTerminationPointConfigurationInput,isApplicationRO) {
  let logicalTerminationPointConfigurationStatus;
  let httpClientConfigurationStatus;
  let tcpClientConfigurationStatusList = [];
  let operationClientConfigurationStatusList = [];
 
  const httpClientUuid = logicalTerminationPointConfigurationInput.httpClientUuid;
  if (httpClientUuid) {
    logicalTerminationPointConfigurationStatus = await updateLtpInstanceGroupAsync(
      logicalTerminationPointConfigurationInput,isApplicationRO
    );
  } else {
    logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
      operationClientConfigurationStatusList,
      httpClientConfigurationStatus,
      tcpClientConfigurationStatusList
    );
  }
  return logicalTerminationPointConfigurationStatus;
}
/**
 * @description This function deletes the tcp,http,operation client for the provided http client uuid.
 * @param {String|undefined} httpClientUuid http client uuid of the client application
 * @returns {Promise<LogicalTerminationPointConfigurationStatus>} status of deletions
 **/
exports.deleteApplicationLtpsAsync = async function (httpClientUuid) {
  let httpClientConfigurationStatus;
  let tcpClientConfigurationStatusList = [];
  let operationClientConfigurationStatusList = [];

  if (httpClientUuid === undefined) {
    return new LogicalTerminationPointConfigurationStatus(
      operationClientConfigurationStatusList,
      httpClientConfigurationStatus,
      tcpClientConfigurationStatusList
    );
  }

  // remove tcp clients
  const serverLtpList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
  for (const tcpClientUuid of serverLtpList) {
    const isDeleted = await ControlConstruct.deleteLogicalTerminationPointAsync(tcpClientUuid);
    const tcpClientConfigurationStatus = new ConfigurationStatus(
      tcpClientUuid,
      '',
      isDeleted);
    tcpClientConfigurationStatusList.push(tcpClientConfigurationStatus);
  }
  // remove operations
  const clientLtpList = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
  for (const operationClientUuid of clientLtpList) {
    const isDeleted = await deleteOperationClientLtpAsync(operationClientUuid);
    const operationClientConfigurationStatus = new ConfigurationStatus(
      operationClientUuid,
      '',
      isDeleted);
    operationClientConfigurationStatusList.push(operationClientConfigurationStatus);
  }
  // remove http client
  const isDeleted = await ControlConstruct.deleteLogicalTerminationPointAsync(httpClientUuid);
  httpClientConfigurationStatus = new ConfigurationStatus(
    httpClientUuid,
    '',
    isDeleted);
  return new LogicalTerminationPointConfigurationStatus(
    operationClientConfigurationStatusList,
    httpClientConfigurationStatus,
    tcpClientConfigurationStatusList
  );
}

/**
 * @param {String} operationClientUuid 
 * @returns {Promise<Boolean>}
 */
async function deleteOperationClientLtpAsync(operationClientUuid) {
  const fcList = await ForwardingDomain.getForwardingConstructListForTheFcPortAsync(operationClientUuid, FcPort.portDirectionEnum.OUTPUT);
  for (const fc of fcList) {
    const fcPorts = fc[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT]
    const filteredFcPorts = fcPorts.filter(fc =>
      fc[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT] === operationClientUuid
    );
    for (const port of filteredFcPorts) {
      await ForwardingConstruct.deleteFcPortAsync(fc[onfAttributes.GLOBAL_CLASS.UUID], port[onfAttributes.LOCAL_CLASS.LOCAL_ID]);
    }
  }
  return await ControlConstruct.deleteLogicalTerminationPointAsync(operationClientUuid);
}

/**
 * @description This function creates logical termination points for the provided values.
 * @param {LogicalTerminationPointConfigurationInput} logicalTerminationPointConfigurationInput
 * @param {Boolean} isApplicationRO true if the application to be changed is RegistryOffice
 * @return {Promise<LogicalTerminationPointConfigurationStatus>}
 **/
async function createLtpInstanceGroupAsync(logicalTerminationPointConfigurationInput, isApplicationRO) {
  let tcpClientConfigurationStatusList = [];
  let operationClientConfigurationStatusList = [];

  const applicationName = logicalTerminationPointConfigurationInput.applicationName;
  const releaseNumber = logicalTerminationPointConfigurationInput.releaseNumber;
  const tcpList = logicalTerminationPointConfigurationInput.tcpList;
  const operationServerName = logicalTerminationPointConfigurationInput.operationServerName;
  const operationNamesByAttributes = logicalTerminationPointConfigurationInput.operationNamesByAttributes;
  const operationsMapping = logicalTerminationPointConfigurationInput.operationsMapping;

  const httpClientConfigurationStatus = await createHttpClientLtpAsync(
    applicationName,
    releaseNumber
  );
  if (httpClientConfigurationStatus.updated) {
    if (isApplicationRO) {
      tcpClientConfigurationStatusList = await createOrUpdateTcpClientLtpsAsync(
        httpClientConfigurationStatus.uuid,
        tcpList
      );
    } else if (tcpList.length > 0) {
      const tcpClientConfigurationStatus = await createOrUpdateTcpClientLtpAsync(
        httpClientConfigurationStatus.uuid,
        tcpList[0]
      );
      tcpClientConfigurationStatusList.push(tcpClientConfigurationStatus);
    }
    operationClientConfigurationStatusList = await createOrUpdateOperationClientLtpAsync(
      httpClientConfigurationStatus.uuid,
      operationServerName,
      operationNamesByAttributes,
      operationsMapping
    );
  }
  return new LogicalTerminationPointConfigurationStatus(
    operationClientConfigurationStatusList,
    httpClientConfigurationStatus,
    tcpClientConfigurationStatusList
  );
}

/**
 * @description This function configures the existing logical termination pointd to the latest values.
 * Also in case if the tcp,operation client are not available they will be created.
 * @param {LogicalTerminationPointConfigurationInput} ltpConfigurationInput
 * @param {Boolean} isApplicationRO true if the application to be changed is RegistryOffice
 * @return {Promise<LogicalTerminationPointConfigurationStatus>}
 **/
async function updateLtpInstanceGroupAsync(ltpConfigurationInput, isApplicationRO) {
  const httpClientUuid = ltpConfigurationInput.httpClientUuid;
  const releaseNumber = ltpConfigurationInput.releaseNumber;
  const tcpList = ltpConfigurationInput.tcpList;
  const operationServerName = ltpConfigurationInput.operationServerName;
  const operationNamesByAttributes = ltpConfigurationInput.operationNamesByAttributes;
  const operationsMapping = ltpConfigurationInput.operationsMapping;
  let operationClientListChanged = false;
  let tcpClientConfigurationStatusList = [];
  if (isApplicationRO) {
    tcpClientConfigurationStatusList = await createOrUpdateTcpClientLtpsAsync(
      httpClientUuid,
      tcpList
    );
  } else if (tcpList.length > 0)  {
    const tcpClientConfigurationStatus = await createOrUpdateTcpClientLtpAsync(
      httpClientUuid,
      tcpList[0]
    );
    tcpClientConfigurationStatusList.push(tcpClientConfigurationStatus);
  }
  const clientListBefore = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
  const operationClientConfigurationStatusList = await createOrUpdateOperationClientLtpAsync(
    httpClientUuid,
    operationServerName,
    operationNamesByAttributes,
    operationsMapping
  );
  const clientListAfter = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuid);

  if (clientListBefore.length != clientListAfter.length) {
    operationClientListChanged = true;
  }
  const httpClientConfigurationStatus = await updateHttpClientLtpAsync(
    httpClientUuid,
    releaseNumber,
    operationClientListChanged
  )
  return new LogicalTerminationPointConfigurationStatus(
    operationClientConfigurationStatusList,
    httpClientConfigurationStatus,
    tcpClientConfigurationStatusList
  );
}

/**
 * @description This function creates a http client interface.
 * @param {String} applicationName name of the client application
 * @param {String} releaseNumber release of the client application
 * @return {Promise<ConfigurationStatus>}
 **/
async function createHttpClientLtpAsync(applicationName, releaseNumber) {
  const httpClientUuid = await HttpClientInterface.generateHttpClientUuidAsync(
    applicationName, releaseNumber
  );
  const httpClientLogicalTerminationPoint = HttpClientInterface.createHttpClientInterface(
    httpClientUuid, [], [], applicationName, releaseNumber
  );
  const isCreated = await ControlConstruct.addLogicalTerminationPointAsync(httpClientLogicalTerminationPoint);
  return new ConfigurationStatus(httpClientUuid, '', isCreated);
}

/**
 * @description This function updates the http client ltp.
 * @param {String} httpClientUuid uuid of the http-client
 * @param {String} releaseNumber release of the client application
 * @param {Boolean} isOperationClientChanged if there was a change with any of this http-client operation-client
 * @return {Promise<ConfigurationStatus>}
 **/
async function updateHttpClientLtpAsync(httpClientUuid, releaseNumber, isOperationClientChanged) {
  let isUpdated = false;
  if (isOperationClientChanged) {
    isUpdated = true;
  }
  const existingReleaseNumber = await HttpClientInterface.getReleaseNumberAsync(httpClientUuid);
  if (existingReleaseNumber !== releaseNumber) {
    isUpdated = await HttpClientInterface.setReleaseNumberAsync(
      httpClientUuid, releaseNumber
    );
  }
  return new ConfigurationStatus(httpClientUuid, '', isUpdated);
}

/**
 * @description This function creates or updates a single tcp client interface.
 * @param {String} httpClientUuid uuid of the http-client
 * @param {TcpObject} tcpObject
 * @return {Promise<ConfigurationStatus>}
 **/
async function createOrUpdateTcpClientLtpAsync(httpClientUuid, tcpObject) {
  const serverLtpList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
  let configurationStatus;
  if (serverLtpList.length === 0) {
    configurationStatus = await createTcpClientLtpAsync(
      httpClientUuid,
      tcpObject
    );
  } else {
    let tcpClientUuid = serverLtpList[0];
    configurationStatus = await updateTcpClientLtpAsync(
      tcpClientUuid,
      tcpObject
    );
  }
  return configurationStatus;
}

/**
 * @description This function creates or updates a tcp client interface. In case of multiple
 * TCP clients, this algorithm is used:
 * 1. check for existing tcp-client-uuids in http-client server-ltps.
 * 2. if there are none, create tcp-client
 * 3. if there are existing tcp-clients, iterate over them and update the correct one
 * based on the protocol (there should be at most 2 clients, one for http and one for https)
 * 4. if no existing tcp-client matches the protocol, create new tcp-client
 * @param {String} httpClientUuid uuid of the http-client
 * @param {Array<TcpObject>} tcpList
 * @return {Promise<Array<ConfigurationStatus>>}
 **/
async function createOrUpdateTcpClientLtpsAsync(httpClientUuid, tcpList) {
  const configurationStatusList = [];
  for (const tcpObject of tcpList) {
    const serverLtpList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
    const remoteProtocol = tcpObject.protocol;
    let configurationStatus;
    if (serverLtpList.length === 0) {
      configurationStatus = await createTcpClientLtpAsync(
        httpClientUuid,
        tcpObject
      );
    } else {
      let tcpClientUuid;
      for (const serverLtpUuid of serverLtpList) {
        const _remoteProtocol = await TcpClientInterface.getRemoteProtocolAsync(
          serverLtpUuid
        );
        if (remoteProtocol === _remoteProtocol) {
          tcpClientUuid = serverLtpUuid;
        }
      }
      if (tcpClientUuid === undefined) {
        configurationStatus = await createTcpClientLtpAsync(
          httpClientUuid,
          tcpObject
        );
      } else {
        configurationStatus = await updateTcpClientLtpAsync(
          tcpClientUuid,
          tcpObject
        );
      }
    }
    configurationStatusList.push(configurationStatus);
  }
  return configurationStatusList;
}

/**
 * @description This function creates a tcp client interface.
 * @param {String} httpClientUuid uuid of the http-client
 * @param {TcpObject} tcpObject
 * @return {Promise<ConfigurationStatus>}
 **/
async function createTcpClientLtpAsync(httpClientUuid, tcpObject) {
  const remoteProtocol = tcpObject.protocol;
  const remotePort = tcpObject.port;
  const remoteIpV4Address = tcpObject.address;
  const tcpClientUuid = TcpClientInterface.generateNextUuid(
    httpClientUuid, remoteProtocol
  );
  const tcpClientLogicalTerminationPoint = await TcpClientInterface.
    createTcpClientInterface(
      httpClientUuid,
      tcpClientUuid,
      remoteIpV4Address,
      remotePort,
      remoteProtocol
    );
    const isCreated = await ControlConstruct.addLogicalTerminationPointAsync(
    tcpClientLogicalTerminationPoint
  );
  if (isCreated) {
    const serverUuidExisingList = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
    serverUuidExisingList.push(tcpClientUuid);
    await LogicalTerminationPoint.setServerLtpListAsync(
      httpClientUuid,
      serverUuidExisingList
    );
  }
  return new ConfigurationStatus(tcpClientUuid, '', isCreated);
}

/**
 * @description This function updates a tcp client interface.
 * @param {String} tcpClientUuid uuid of the tcp-client
 * @param {TcpObject} tcpObject
 * @return {Promise<ConfigurationStatus>}
 **/
async function updateTcpClientLtpAsync(tcpClientUuid, tcpObject) {
  const remoteProtocol = tcpObject.protocol;
  const remotePort = tcpObject.port;
  const remoteIpV4Address = tcpObject.address;
  let isUpdated = false;
  let isIpV4AddressUpdated = false;
  let isPortUpdated = false;
  let isProtocolUpdated = false;
  const _remoteIpV4Address = await TcpClientInterface.getRemoteAddressAsync(
    tcpClientUuid
  );
  const _remotePort = await TcpClientInterface.getRemotePortAsync(
    tcpClientUuid
  );
  const _remoteProtocol = await TcpClientInterface.getRemoteProtocolAsync(
    tcpClientUuid
  );
  if (JSON.stringify(remoteIpV4Address) != JSON.stringify(_remoteIpV4Address)) {
    isIpV4AddressUpdated = await TcpClientInterface.setRemoteAddressAsync(
      tcpClientUuid,
      remoteIpV4Address
    );
  }
  if (remotePort != _remotePort) {
    isPortUpdated = await TcpClientInterface.setRemotePortAsync(
      tcpClientUuid,
      remotePort
    );
  }
  if (remoteProtocol != _remoteProtocol) {
    isProtocolUpdated = await TcpClientInterface.setRemoteProtocolAsync(
      tcpClientUuid,
      remoteProtocol
    );
  }
  if (isIpV4AddressUpdated || isPortUpdated || isProtocolUpdated) {
    isUpdated = true;
  }
  return new ConfigurationStatus(tcpClientUuid, '', isUpdated);
}

/**
 * @description This function creates an operation client ltp.
 * @param {String} httpClientUuid uuid of the http-client
 * @param {String} operationName : name of the operation
 * @param {String} operationClientUuid : uuid of the operation
 * @return {Promise<ConfigurationStatus>}
 **/
async function createOperationClientLtpAsync(httpClientUuid, operationName, operationClientUuid) {
  const operationClientLogicalTerminationPoint = await OperationClientInterface.
    createOperationClientInterface(
      httpClientUuid,
      operationClientUuid,
      operationName
    );
  const isCreated = await ControlConstruct.addLogicalTerminationPointAsync(
    operationClientLogicalTerminationPoint
  );
  const configurationStatus = new ConfigurationStatus(
    operationClientUuid,
    '',
    isCreated
  );
  if (isCreated) {
    const existingLtps = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuid);
    existingLtps.push(operationClientUuid)
    await LogicalTerminationPoint.setClientLtpListAsync(
      httpClientUuid,
      existingLtps
    );
  }
  return configurationStatus;
}

/**
 * @description This function creates or updates an operation client ltp for the provided input operation name list.
 * @param {String} httpClientUuid uuid of the http-client
 * @param {String} operationServerName caller operation
 * @param {Map} operationNamesByAttributes map of the client operation attributes (key) with client operation names (value)
 * @param {Object} operationsMapping map of hardcoded context values for operations
 * @return {Promise<Array<ConfigurationStatus>>}
 **/
async function createOrUpdateOperationClientLtpAsync(httpClientUuid, operationServerName, operationNamesByAttributes, operationsMapping) {
  const configurationStatusList = [];
  for (const operationItem of operationNamesByAttributes) {
    const operationClientNewName = operationItem[1];
    const operationAttribute = operationItem[0];
    const value = operationsMapping[operationServerName][operationAttribute];
    const operationClientUuid = await OperationClientInterface.generateOperationClientUuidAsync(
      httpClientUuid,
      value["api-segment"],
      value["sequence"]
    );
    let configurationStatus = new ConfigurationStatus(
      operationClientUuid,
      '',
      false
    );
    const operationClientOldName = await OperationClientInterface.getOperationNameAsync(operationClientUuid);
    if (operationClientOldName === undefined) {
      configurationStatus = await createOperationClientLtpAsync(
        httpClientUuid,
        operationClientNewName,
        operationClientUuid
      );
    } else if (operationClientOldName !== operationClientNewName) {
      const isUpdated = await OperationClientInterface.setOperationNameAsync(operationClientUuid, operationClientNewName);
      configurationStatus = new ConfigurationStatus(
        operationClientUuid,
        '',
        isUpdated
      );
    }
    configurationStatusList.push(configurationStatus);
  }
  return configurationStatusList;
}
