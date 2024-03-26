//@ts-check
'use strict';

const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const TcpObject = require('onf-core-model-ap/applicationPattern/onfModel/services/models/TcpObject');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServices');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

const ServiceUtils = require('./utility/LogicalTerminationPoint');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const prepareForwardingConfiguration = require('./services/PrepareForwardingConfiguration');
const prepareForwardingAutomation = require('./services/PrepareForwardingAutomation');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');

const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');

const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');

const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const controlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');

const basicServicesOperationsMapping = require('./BasicServicesOperationsMapping');
const genericRepresentation = require('./GenericRepresentation');
const createHttpError = require('http-errors');
const HttpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const OperationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');

const integerProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/IntegerProfile'); 
/**
 * Removes application from configuration and application data
 *
 * body V1_disposeremaindersofderegisteredapplication_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.disposeRemaindersOfDeregisteredApplication = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFWName) {
  let applicationName = body["application-name"];
  let applicationReleaseNumber = body["release-number"];

  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    applicationName,
    applicationReleaseNumber,
    newReleaseFWName
  );
  let ltpConfigurationStatus = await LogicalTerminationPointService.deleteApplicationLtpsAsync(
    httpClientUuid
  );

  /****************************************************************************************
   * Prepare attributes to remove fc-ports from forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.disposeRemaindersOfDeregisteredApplication(
      operationClientConfigurationStatusList
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      unConfigureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.disposeRemaindersOfDeregisteredApplication(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Embed yourself into the MBH SDN application layer
 *
 * body V1_embedyourself_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.embedYourself = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let applicationName = body["registry-office-application"];
  let releaseNumber = body["registry-office-application-release-number"];
  let applicationProtocol = body["registry-office-protocol"];
  let applicationAddress = body["registry-office-address"];
  let applicationPort = body["registry-office-port"];
  let deregisterOperation = body["deregistration-operation"];
  let relayOperationUpdateOperation = body["relay-operation-update-operation"];
  let relayServerReplacementOperation = body["relay-server-replacement-operation"];
    
  const registryOfficeApplicationName = await ServiceUtils.resolveRegistryOfficeApplicationNameFromForwardingAsync();
  if (registryOfficeApplicationName !== applicationName) {
    throw new createHttpError.BadRequest(`The registry-office-application ${applicationName} was not found.`);
  }

  /****************************************************************************************
   * Prepare logicalTerminationPointConfigurationInput object to
   * configure logical-termination-point
   ****************************************************************************************/

  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("deregistration-operation", deregisterOperation);
  operationNamesByAttributes.set("relay-server-replacement-operation", relayServerReplacementOperation);
  operationNamesByAttributes.set("relay-operation-update-operation", relayOperationUpdateOperation);

  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(
    applicationName,
    releaseNumber
  );
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName);
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput, isApplicationRo
    );
  }

  /***********************************************************************
   * oldRelease information to be updated if provided in the requestBody
   ***********************************************************************/
  let isOldApplicationTcpClientUpdated = false;
  let oldApplicationTcpClientUuid;
  let oldApplicationForwardingTag = "PromptForEmbeddingCausesRequestForBequeathingData";
  let isOldReleaseExist = await isForwardingNameExist(oldApplicationForwardingTag);
  let oldApplicationNameInConfiguration;
  
  if (isOldReleaseExist) {
    let httpUuidOfOldApplication = await httpClientInterface.getHttpClientUuidFromForwarding(oldApplicationForwardingTag);
    oldApplicationNameInConfiguration = await ServiceUtils.resolveApplicationNameFromForwardingAsync(oldApplicationForwardingTag);
    
    if (httpUuidOfOldApplication != undefined) {
      let tcpClientUuidList = await LogicalTerminationPoint.getServerLtpListAsync(httpUuidOfOldApplication);

      if (tcpClientUuidList != undefined) {
        oldApplicationTcpClientUuid = tcpClientUuidList[0];
        let tcpClientProtocolOfOldApplication = await tcpClientInterface.getRemoteProtocolAsync(oldApplicationTcpClientUuid);
        if ("old-release-protocol" in body)
        {
          let oldReleaseProtocol = body["old-release-protocol"];
          if(oldReleaseProtocol != tcpClientProtocolOfOldApplication) {
          isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemoteProtocolAsync(oldApplicationTcpClientUuid, oldReleaseProtocol);
        }
        }
        if ("old-release-address" in body)
        {
          let oldReleaseAddress = body["old-release-address"];
          let tcpClientAddressOfOldApplication = await tcpClientInterface.getRemoteAddressAsync(oldApplicationTcpClientUuid);
          if (oldReleaseAddress != tcpClientAddressOfOldApplication) {
          isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemoteAddressAsync(oldApplicationTcpClientUuid, oldReleaseAddress);
        }
        }
        if ("old-release-port" in body)
        {
          let oldReleasePort = body["old-release-port"];
          let tcpClientPortOfOldApplication = await tcpClientInterface.getRemotePortAsync(oldApplicationTcpClientUuid);
          if (oldReleasePort != tcpClientPortOfOldApplication) {
            isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemotePortAsync(oldApplicationTcpClientUuid, oldReleasePort);
          }
        }
      }
    }
    if (isOldApplicationTcpClientUpdated) {
      let configurationStatus = new ConfigurationStatus(oldApplicationTcpClientUuid, '', isOldApplicationTcpClientUpdated);
      if (ltpConfigurationStatus) {
        let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
        tcpClientConfigurationStatusList.push(configurationStatus);
      }
    }
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList && isOldReleaseExist) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.embedYourself(
      operationClientConfigurationStatusList,
      deregisterOperation,
      relayServerReplacementOperation,
      relayOperationUpdateOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.embedYourself(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus,
    oldApplicationNameInConfiguration
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Stops sending notifications of a specific subscription
 *
 * body V1_endsubscription_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.endSubscription = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let subscriberApplication = body["subscriber-application"];
  let subscriberReleaseNumber = body["subscriber-release-number"];
  let subscriptionOperation = body["subscription"];
  let forwardingConfigurationInputList = await prepareForwardingConfiguration.endSubscription(
    subscriberApplication,
    subscriberReleaseNumber,
    subscriptionOperation
  );
  let forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
    unConfigureForwardingConstructAsync(
      operationServerName,
      forwardingConfigurationInputList
    );
  let forwardingAutomationInputList = prepareForwardingAutomation.endSubscription(
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Returns administrative information
 *
 * returns inline_response_200_4
 **/
exports.informAboutApplication = async function () {
  let applicationInformation = {};
  let httpServerCapability = await httpServerInterface.getHttpServerCapabilityAsync();
  Object.entries(httpServerCapability).map(entry => {
    let key = entry[0];
    let value = entry[1];
    if (key != onfAttributes.HTTP_SERVER.RELEASE_LIST) {
      applicationInformation[key] = value;
    }
  });
  return applicationInformation;
}

/**
 * Returns administrative information for generic representation
 *
 * returns inline_response_200_5
 **/
exports.informAboutApplicationInGenericRepresentation = async function (operationServerName) {
  let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);
  let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);
  return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
    consequentActionList,
    responseValueList
  });
}


/**
 * Provides name and number of the preceding release
 * If there is no OldRelease for this application , then a hardcoded applicationName "OldRelease" will be sent to smooth the ApprovingApplicationCausesPreparingTheEmbedding.RequestForOldRelease
 * @oldReleaseForwardingName {String|undefined} forwardingName to identify a oldRelease , if there is no oldRelease then "undefined" shall be sent as a value.
 * returns inline_response_200_3
 **/
exports.informAboutPrecedingRelease = async function (oldReleaseForwardingName) {
  try {
    let precedingApplicationInformation = {};

    let oldApplicationNameAndReleaseNumber = await ServiceUtils.resolveApplicationNameAndReleaseNumberFromForwardingAsync(
      oldReleaseForwardingName);

    if (oldApplicationNameAndReleaseNumber) {
      precedingApplicationInformation.applicationName = oldApplicationNameAndReleaseNumber.applicationName;
      precedingApplicationInformation.releaseNumber = oldApplicationNameAndReleaseNumber.releaseNumber;
    } else {
      precedingApplicationInformation.applicationName = "OldRelease";
      precedingApplicationInformation.releaseNumber = await HttpServerInterface.getReleaseNumberAsync();
    }
    return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(precedingApplicationInformation);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Returns release history
 *
 * returns List
 **/
exports.informAboutReleaseHistory = async function () {
  return await httpServerInterface.getReleaseListAsync();
}

/**
 * Returns release history for generic representation
 *
 * returns inline_response_200_7
 **/
exports.informAboutReleaseHistoryInGenericRepresentation = async function (operationServerName) {
  let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);
  let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);
  return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
    consequentActionList,
    responseValueList
  });
}


/**
 * Receives information about where to ask for approval of BasicAuth requests
 *
 * body V1_inquirebasicauthapprovals_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * operationServerName String Holds information about the url
 * newReleaseFwName String Holds information about the new release forwarding name if exist
 * no response value expected for this operation
 **/
exports.inquireBasicAuthRequestApprovals = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["application-name"];
  let releaseNumber = body["release-number"];
  let applicationProtocol = body["protocol"];
  let applicationAddress = body["address"];
  let applicationPort = body["port"];
  let basicAuthApprovalOperation = body["operation-name"];
  
  
  let httpClientUuid = await httpClientInterface.getHttpClientUuidFromForwarding("BasicAuthRequestCausesInquiryForAuthentication");
  
  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("basic-auth-approval-operation", basicAuthApprovalOperation);

  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      applicationName,
      undefined,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationLtpsAsync(
      ltpConfigurationInput, false
    );
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList;
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.inquireBasicAuthRequestApprovals(
      operationClientConfigurationStatusList,
      basicAuthApprovalOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
    configureForwardingConstructAsync(
      operationServerName,
      forwardingConfigurationInputList
    );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.inquireBasicAuthRequestApprovals(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Receives information about where to ask for approval of OaM requests
 *
 * body V1_inquireoamrequestapprovals_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.inquireOamRequestApprovals = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["oam-approval-application"];
  let releaseNumber = body["oam-approval-application-release-number"];
  let applicationProtocol = body["oam-approval-protocol"];
  let applicationAddress = body["oam-approval-address"];
  let applicationPort = body["oam-approval-port"];
  let oamApprovalOperation = body["oam-approval-operation"];

  const oamApplicationName = await ServiceUtils.resolveApplicationNameFromForwardingAsync("OamRequestCausesInquiryForAuthentication");
  if (oamApplicationName !== applicationName) {
    throw new createHttpError.BadRequest(`The oam-approval-application ${applicationName} was not found.`);
  }
  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("oam-approval-operation", oamApprovalOperation);
  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    applicationName,
    releaseNumber,
    newReleaseFwName
  );
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      applicationName,
      undefined,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput, isApplicationRo
    );
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList;
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.inquireOamRequestApprovals(
      operationClientConfigurationStatusList,
      oamApprovalOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.inquireOamRequestApprovals(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Allows retrieving all interface and internal connection data
 *
 * returns inline_response_200_3
 **/
exports.listLtpsAndFcs = async function () {
  let controlConstructUrl = onfPaths.CONTROL_CONSTRUCT;
  let controlConstruct = await fileOperation.readFromDatabaseAsync(controlConstructUrl);
  delete controlConstruct['profile-collection'];
  let logicalterminationpoint = controlConstruct[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]

  for (let i = 0; i < logicalterminationpoint.length; i++) {
    let layerprotocol = logicalterminationpoint[i][onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL]
    for (let j = 0; j < layerprotocol.length; j++) {
      let layerProtocolInstance = layerprotocol[j];
      let layerProtocolName = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.LAYER_PROTOCOL_NAME];
      if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.OPERATION_CLIENT) {
        let operationclientinterfacepac = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC];
        if (operationclientinterfacepac !== undefined) {
          let operationClientConfiguration = operationclientinterfacepac[onfAttributes.OPERATION_CLIENT.CONFIGURATION];
          if (operationClientConfiguration !== undefined) {
            delete operationClientConfiguration['detailed-logging-is-on'];
            delete operationClientConfiguration['operation-key'];
          }
        }
      } else if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER) {
        let operationServerinterfacepac = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC];
        if (operationServerinterfacepac !== undefined) {
          let operationServerConfiguration = operationServerinterfacepac[onfAttributes.OPERATION_SERVER.CONFIGURATION];
          if (operationServerConfiguration !== undefined) {
            delete operationServerConfiguration['operation-key'];
          }
        }
      } else if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.HTTP_SERVER) {
        let httpServerinterfacepac = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        if (httpServerinterfacepac !== undefined) {
          let httpServerCapability = httpServerinterfacepac[onfAttributes.HTTP_SERVER.CAPABILITY];
          if (httpServerCapability !== undefined) {
            delete httpServerCapability['application-purpose'];
            delete httpServerCapability['owner-name'];
            delete httpServerCapability['owner-email-address'];
            delete httpServerCapability['release-list'];
          }
        }
      } else if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.ES_CLIENT) {
        let elsticSearchClientInterface = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
        if (elsticSearchClientInterface !== undefined) {
          let elasticSearchConfiguration = elsticSearchClientInterface[onfAttributes.ES_CLIENT.CONFIGURATION]
          if (elasticSearchConfiguration !== undefined) {
            delete elasticSearchConfiguration["auth"]
          }
        }
      }
    }
  }
  return {
    "core-model-1-4:control-construct": controlConstruct
  };
}

/**
 * Offers configuring the client side for sending OaM request information
 *
 * body V1_redirectoamrequestinformation_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectOamRequestInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["oam-log-application"];
  let releaseNumber = body["oam-log-application-release-number"];
  let applicationProtocol = body["oam-log-protocol"];
  let applicationAddress = body["oam-log-address"];
  let applicationPort = body["oam-log-port"];
  let oamLogOperation = body["oam-log-operation"];

  const oamApplicationName = await ServiceUtils.resolveApplicationNameFromForwardingAsync("OamRequestCausesLoggingRequest");
  if (oamApplicationName !== applicationName) {
    throw new createHttpError.BadRequest(`The oam-log-application ${applicationName} was not found.`);
  }

  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("oam-log-operation", oamLogOperation);

  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    applicationName,
    releaseNumber,
    newReleaseFwName
  );
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      applicationName,
      undefined,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput, isApplicationRo
    );
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList;
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.redirectOamRequestInformation(
      operationClientConfigurationStatusList,
      oamLogOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.redirectOamRequestInformation(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Offers configuring the client side for sending service request information
 *
 * body V1_redirectservicerequestinformation_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectServiceRequestInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["service-log-application"];
  let releaseNumber = body["service-log-application-release-number"];
  let applicationProtocol = body["service-log-protocol"];
  let applicationAddress = body["service-log-address"];
  let applicationPort = body["service-log-port"];
  let serviceLogOperation = body["service-log-operation"];

  const eatlApplicationName = await ServiceUtils.resolveApplicationNameFromForwardingAsync("ServiceRequestCausesLoggingRequest");
  if (eatlApplicationName !== applicationName) {
    throw new createHttpError.BadRequest(`The service-log-application ${applicationName} was not found.`);
  }

  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("service-log-operation", serviceLogOperation);
  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    applicationName,
    releaseNumber,
    newReleaseFwName
  );
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      applicationName,
      undefined,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput, isApplicationRo
    );
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList;
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.redirectServiceRequestInformation(
      operationClientConfigurationStatusList,
      serviceLogOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.redirectServiceRequestInformation(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Offers configuring client side for sending information about topology changes
 *
 * body V1_redirecttopologychangeinformation_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectTopologyChangeInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["topology-application"];
  let releaseNumber = body["topology-application-release-number"];
  let applicationAddress = body["topology-application-address"];
  let applicationPort = body["topology-application-port"];
  let applicationProtocol = body["topology-application-protocol"];
  let ltpUpdateTopologyOperation = body["topology-operation-ltp-update"];
  let ltpDeletionTopologyOperation = body["topology-operation-ltp-deletion"];
  let fcUpdateTopologyOperation = body["topology-operation-fc-update"];
  let fcPortUpdateTopologyOperation = body["topology-operation-fc-port-update"];
  let fcPortDeletionTopologyOperation = body["topology-operation-fc-port-deletion"];

  const altApplicationName = await ServiceUtils.resolveApplicationNameFromForwardingAsync("OamRequestCausesLtpUpdateRequest");
  if (altApplicationName !== applicationName) {
    throw new createHttpError.BadRequest(`The topology-application ${applicationName} was not found.`);
  }

  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("topology-operation-ltp-update", ltpUpdateTopologyOperation);
  operationNamesByAttributes.set("topology-operation-ltp-deletion", ltpDeletionTopologyOperation);
  operationNamesByAttributes.set("topology-operation-fc-update", fcUpdateTopologyOperation);
  operationNamesByAttributes.set("topology-operation-fc-port-update", fcPortUpdateTopologyOperation);
  operationNamesByAttributes.set("topology-operation-fc-port-deletion", fcPortDeletionTopologyOperation);
  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();
  let tcpObjectList = [new TcpObject(applicationProtocol, applicationAddress, applicationPort)];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    applicationName,
    releaseNumber,
    newReleaseFwName
  );
  if (!httpClientUuid) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      applicationName,
      undefined,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    applicationName,
    releaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput, isApplicationRo
    );
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   ****************************************************************************************/

  let forwardingConfigurationInputList = [];
  let forwardingConstructConfigurationStatus;
  let operationClientConfigurationStatusList;
  if (ltpConfigurationStatus) {
    operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
  }

  if (operationClientConfigurationStatusList) {
    forwardingConfigurationInputList = await prepareForwardingConfiguration.redirectTopologyChangeInformation(
      operationClientConfigurationStatusList,
      ltpUpdateTopologyOperation,
      ltpDeletionTopologyOperation,
      fcUpdateTopologyOperation,
      fcPortUpdateTopologyOperation,
      fcPortDeletionTopologyOperation
    );
    forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.redirectTopologyChangeInformation(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );

  let forwrdingContructResponse = await controlConstruct.getForwardingDomainListAsync()
  let serverclientinterfacepac;
  let controlConstructUrl = onfPaths.CONTROL_CONSTRUCT;
  let controlConstructcompleteResponse = await fileOperation.readFromDatabaseAsync(controlConstructUrl);
  let controluuid = controlConstructcompleteResponse['uuid']
  let logicalterminationpoint = await fileOperation.readFromDatabaseAsync(
    onfPaths.LOGICAL_TERMINATION_POINT
  );
  for (let i = 0; i < logicalterminationpoint.length; i++) {
    let layerprotocol = logicalterminationpoint[i][onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL]
    for (let j = 0; j < layerprotocol.length; j++) {
      let layerProtocalName = layerprotocol[j]['layer-protocol-name']
      if (layerProtocalName == 'operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER') {
        let operationclientinterfacepac = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC]
        let clientconfiguration = operationclientinterfacepac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
        if (clientconfiguration !== undefined) {
          delete clientconfiguration['operation-key'];
          if (clientconfiguration['detailed-logging-is-on'] != undefined) {
            delete clientconfiguration['detailed-logging-is-on'];
          }
        }
      } else if (layerProtocalName == 'operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER') {
        serverclientinterfacepac = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC]
        let serverconfiguration = serverclientinterfacepac[onfAttributes.OPERATION_SERVER.CONFIGURATION]
        if (serverconfiguration !== undefined) {
          delete serverconfiguration['operation-key'];
        }
      } else if (layerProtocalName == LayerProtocol.layerProtocolNameEnum.ES_CLIENT) {
        let elsticSearchClientInterface = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
        if (elsticSearchClientInterface !== undefined) {
          let elasticSearchConfiguration = elsticSearchClientInterface[onfAttributes.ES_CLIENT.CONFIGURATION]
          if (elasticSearchConfiguration !== undefined) {
            delete elasticSearchConfiguration["auth"]
          }
        }
      } else if (layerProtocalName == LayerProtocol.layerProtocolNameEnum.HTTP_SERVER) {
        let httpServerInterface = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.HTTP_SERVER_INTERFACE_PAC];
        if (httpServerInterface !== undefined) {
          let httpServerCapability = httpServerInterface[onfAttributes.HTTP_SERVER.CAPABILITY]
          if (httpServerCapability !== undefined) {
            delete httpServerCapability['application-purpose']
            delete httpServerCapability['owner-name']
            delete httpServerCapability['owner-email-address']
            delete httpServerCapability[onfAttributes.HTTP_SERVER.RELEASE_LIST]
          }
        }
      }

    }
  }

  let controlConstructResponse = {
    "core-model-1-4:control-construct": {
      "uuid": controluuid,
      "logical-termination-point": logicalterminationpoint,
      "forwarding-domain": forwrdingContructResponse
    }
  };
  return controlConstructResponse;
}

/**
 * Initiates registering at the currently active RegistryOffice
 * Shall also automatically execute without receiving any request every time the application starts
 *
 * body V1_registeryourself_body  (optional)
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.registerYourself = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let ltpConfigurationStatus;
  let forwardingConstructConfigurationStatus;
  let oldApplicationName;
  let oldReleaseNumber;
  if (Object.keys(body).length != 0) {
    /****************************************************************************************
     * Setting up required local variables from the request body
     ****************************************************************************************/

    let registryOfficeApplicationName = body["registry-office-application"];
    let registryOfficeReleaseNumber = body["registry-office-application-release-number"];
    let registryOfficeRegisterOperation = body["registration-operation"];
    let registryOfficeProtocol = body["registry-office-protocol"];
    let registryOfficeAddress = body["registry-office-address"];
    let registryOfficePort = body["registry-office-port"];

    // getting values for optional attributes 
    let httpAddress = body["http-address"];
    let httpPort = body["http-port"];

    oldApplicationName = body["preceding-application-name"];
    oldReleaseNumber = body["preceding-release-number"];

    /****************************************************************************************
     * Prepare logicalTerminationPointConfigurationInput object to
     * configure logical-termination-point
     ****************************************************************************************/
    // update the registryOffice configuration
    const roApplicationName = await ServiceUtils.resolveRegistryOfficeApplicationNameFromForwardingAsync();
    if (roApplicationName !== registryOfficeApplicationName) {
      throw new createHttpError.BadRequest(`The registry-office-application ${registryOfficeApplicationName} was not found.`);
    }
    let operationNamesByAttributes = new Map();
    operationNamesByAttributes.set("registration-operation", registryOfficeRegisterOperation);

    let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

    let tcpObjectList = [new TcpObject(registryOfficeProtocol, registryOfficeAddress, registryOfficePort)];
    let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(
      registryOfficeApplicationName,
      registryOfficeReleaseNumber
    );
    if (!httpClientUuid) {
      httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(
        registryOfficeApplicationName
      );
    }
    let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
      httpClientUuid,
      registryOfficeApplicationName,
      registryOfficeReleaseNumber,
      tcpObjectList,
      operationServerName,
      operationNamesByAttributes,
      basicServicesOperationsMapping.basicServicesOperationsMapping
    );
    if (httpClientUuid) {
      ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
        ltpConfigurationInput, isApplicationRo
      );
    }

    // update tcp-server configuration if required
    let tcpServerWithHttpUpdated = await updateTcpServerDetails("HTTP", httpAddress, httpPort);
    if (tcpServerWithHttpUpdated.istcpServerUpdated) {
      let configurationStatus = new ConfigurationStatus(tcpServerWithHttpUpdated.tcpServerUuid, '', tcpServerWithHttpUpdated.istcpServerUpdated);
      if (ltpConfigurationStatus) {
        let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
        tcpClientConfigurationStatusList.push(configurationStatus);
      }
    }    

    // update old release configuration
    let isOldApplicationIsUpdated = false;
    let httpUuidOfOldApplication;
    //whether oldRelease of the application name exists        
    let oldApplicationForwardingTag = "PromptForEmbeddingCausesRequestForBequeathingData";
    let isOldReleaseExist = await isForwardingNameExist(oldApplicationForwardingTag);
    if ((oldApplicationName != undefined || oldReleaseNumber != undefined) && isOldReleaseExist) {
      httpUuidOfOldApplication = await httpClientInterface.getHttpClientUuidFromForwarding(oldApplicationForwardingTag);

      if (httpUuidOfOldApplication != undefined) {
        if (oldApplicationName != undefined) {
          let configuredOldApplicationName = await httpClientInterface.getApplicationNameAsync(httpUuidOfOldApplication);
          if (configuredOldApplicationName != oldApplicationName) {
            isOldApplicationIsUpdated = await httpClientInterface.setApplicationNameAsync(httpUuidOfOldApplication, oldApplicationName);
          }
        }
        if (oldReleaseNumber != undefined) {
          let configuredOldApplicationReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpUuidOfOldApplication);
          if (configuredOldApplicationReleaseNumber != oldReleaseNumber) {
            isOldApplicationIsUpdated = await httpClientInterface.setReleaseNumberAsync(httpUuidOfOldApplication, oldReleaseNumber);
          }
        }
        if (isOldApplicationIsUpdated) {
          let configurationStatus = new ConfigurationStatus(httpUuidOfOldApplication, '', isOldApplicationIsUpdated);
          if (ltpConfigurationStatus) {
            let tcpClientConfigurationStatusList = ltpConfigurationStatus.tcpClientConfigurationStatusList;
            tcpClientConfigurationStatusList.push(configurationStatus);
          }
        }
      }
    }


    /****************************************************************************************
     * Prepare attributes to configure forwarding-construct
     ****************************************************************************************/

    let forwardingConfigurationInputList = [];
    let operationClientConfigurationStatusList;
    if (ltpConfigurationStatus) {
      operationClientConfigurationStatusList = ltpConfigurationStatus.operationClientConfigurationStatusList;
    }

    if (operationClientConfigurationStatusList) {
      forwardingConfigurationInputList = await prepareForwardingConfiguration.registerYourself(
        operationClientConfigurationStatusList,
        registryOfficeRegisterOperation
      );
      forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
        configureForwardingConstructAsync(
          operationServerName,
          forwardingConfigurationInputList
        );
    }
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.registerYourself(
    ltpConfigurationStatus,
    forwardingConstructConfigurationStatus,
    oldApplicationName,
    oldReleaseNumber
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}

/**
 * Starts application in generic representation
 *
 * returns genericRepresentation
 **/
exports.startApplicationInGenericRepresentation = async function (operationServerName) {
  let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);
  let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);
  return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
    consequentActionList,
    responseValueList
  });
}

/**
 * Allows updating connection data of a serving application
 *
 * body V1_updateclient_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.updateClient = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let currentApplicationName = body["current-application-name"];
  let currentReleaseNumber = body["current-release-number"];
  let futureApplicationName = body["future-application-name"];
  let futureReleaseNumber = body["future-release-number"];
  let futureProtocol = body["future-protocol"];
  let futureAddress = body["future-address"];
  let futurePort = body["future-port"];

  /****************************************************************************************
   * Prepare logicalTerminationPointConfigurationInput object to
   * configure logical-termination-point
   ****************************************************************************************/
  let operationNamesByAttributes = new Map();

  let tcpObjectList = [new TcpObject(futureProtocol, futureAddress, futurePort)];

  let httpClientUuidOfnewApplication = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(futureApplicationName, futureReleaseNumber, newReleaseFwName);
  let httpClientUuid;
  if (!httpClientUuidOfnewApplication) {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      currentApplicationName,
      currentReleaseNumber,
      newReleaseFwName
    );
  } else {
    httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
      futureApplicationName,
      futureReleaseNumber,
      newReleaseFwName
    );
  }
  let ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
    httpClientUuid,
    futureApplicationName,
    futureReleaseNumber,
    tcpObjectList,
    operationServerName,
    operationNamesByAttributes,
    basicServicesOperationsMapping.basicServicesOperationsMapping
  );
  
  let isApplicationRo = await ServiceUtils.getServerApplicationDetail();

  let ltpConfigurationStatus;
  if (httpClientUuid) {
    ltpConfigurationStatus = await LogicalTerminationPointService.FindAndUpdateApplicationLtpsAsync(
      ltpConfigurationInput,
      isApplicationRo
    );
  }
  if(currentApplicationName != futureApplicationName){
     await httpClientInterface.setApplicationNameAsync(httpClientUuid, futureApplicationName)  
     ltpConfigurationStatus.httpClientConfigurationStatus.updated = true
  }
  /*******************************************************************************************************
   * bussiness logic to transfer the operation-client instances from current-release to future-release
   *******************************************************************************************************/

  let httpClientUuidOfOldApplication = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(currentApplicationName, currentReleaseNumber, newReleaseFwName);
  if (httpClientUuidOfOldApplication) {
    let clientLtpsOfOldApplication = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuidOfOldApplication);
    if (clientLtpsOfOldApplication != undefined && clientLtpsOfOldApplication.length > 0) {
      await LogicalTerminationPoint.setClientLtpListAsync(
        httpClientUuidOfOldApplication,
        []
      );
      if (httpClientUuidOfnewApplication) {
        let existingLtpsOfNewRelease = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuidOfnewApplication);

        for (let i = 0; i < clientLtpsOfOldApplication.length; i++) {
          let operationClientLtpOfOldApplication = clientLtpsOfOldApplication[i];
          existingLtpsOfNewRelease.push(operationClientLtpOfOldApplication);
        }
        await LogicalTerminationPoint.setClientLtpListAsync(
          httpClientUuidOfnewApplication,
          existingLtpsOfNewRelease
        );
      }
    }
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.updateClient(
    ltpConfigurationStatus, undefined,
    futureApplicationName
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
}


/**
 * Configures Http and TcpClient of the NewRelease
 *
 * body V1_updateclientofsubsequentrelease_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_4
 **/
exports.updateClientOfSubsequentRelease = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseForwardingName) {
  let futureApplicationName = body["application-name"];
  let futureReleaseNumber = body["release-number"];
  let futureProtocol = body["protocol"];
  let futureAddress = body["address"];
  let futurePort = body["port"];

  let bequeathYourDataAndDieOperation;
  let dataTransferOperationsList = [];
  /****************************************************************************************
   * Prepare logicalTerminatinPointConfigurationInput object to 
   * configure logical-termination-point
   ****************************************************************************************/

  let ltpConfigurationStatus = {};
  let newReleaseHttpClientLtpUuid = await httpClientInterface.getHttpClientUuidFromForwarding(newReleaseForwardingName);
  if (newReleaseHttpClientLtpUuid != undefined) {
    let isReleaseUpdated = await httpClientInterface.setReleaseNumberAsync(newReleaseHttpClientLtpUuid, futureReleaseNumber);
    let isApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(newReleaseHttpClientLtpUuid, futureApplicationName);

    if (isReleaseUpdated || isApplicationNameUpdated) {
      let configurationStatus = new ConfigurationStatus(
        newReleaseHttpClientLtpUuid,
        '',
        true);
      ltpConfigurationStatus.httpClientConfigurationStatus = configurationStatus;
    }

    let newReleaseTcpClientUuidList = await LogicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid);
    let newReleaseTcpClientUuid = newReleaseTcpClientUuidList[0];

    let isProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(newReleaseTcpClientUuid, futureProtocol);
    let isAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(newReleaseTcpClientUuid, futureAddress);
    let isPortUpdated = await tcpClientInterface.setRemotePortAsync(newReleaseTcpClientUuid, futurePort);

    if (isProtocolUpdated || isAddressUpdated || isPortUpdated) {
      let configurationStatus = new ConfigurationStatus(
        newReleaseTcpClientUuid,
        '',
        true);
      ltpConfigurationStatus.tcpClientConfigurationStatusList = [configurationStatus];
    }
    let forwardingAutomationInputList;
    if (ltpConfigurationStatus != undefined) {

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      forwardingAutomationInputList = await prepareForwardingAutomation.updateClientOfSubsequentRelease(
        ltpConfigurationStatus
      );
      ForwardingAutomationService.automateForwardingConstructAsync(
        operationServerName,
        forwardingAutomationInputList,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );
    }    
  }

  bequeathYourDataAndDieOperation =  await operationServerInterface.getInputOperationServerNameFromForwarding(newReleaseForwardingName);
  let dataTransferOperationClientUuidList = await LogicalTerminationPoint.getClientLtpListAsync(newReleaseHttpClientLtpUuid);
  for (let i = 0; i < dataTransferOperationClientUuidList.length; i++) {
    let operationClientUuid = dataTransferOperationClientUuidList[i];
    let operationClientName = await OperationClientInterface.getOperationNameAsync(operationClientUuid);
    dataTransferOperationsList.push(operationClientName);
  }

  /****************************************************************************************
     * Prepare attributes for the response body
     ****************************************************************************************/
  var handOverAndDatatransferInformation = {};
  handOverAndDatatransferInformation.bequeathYourDataAndDieOperation = bequeathYourDataAndDieOperation;
  handOverAndDatatransferInformation.dataTransferOperationsList = dataTransferOperationsList;
  return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(handOverAndDatatransferInformation);
} 

/**
 * Allows updating operation clients to redirect to backward compatible services
 *
 * body V1_updateoperationclient_body 
 * user String User identifier from the system starting the service call
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.updateOperationClient = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName, newReleaseFwName) {
  let applicationName = body["application-name"];
  let releaseNumber = body["release-number"];
  let oldOperationName = body["old-operation-name"];
  let newOperationName = body["new-operation-name"];

  let isUpdated;
  let operationClientUuid
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(applicationName, releaseNumber, newReleaseFwName);
  if (httpClientUuid) {
    operationClientUuid = await operationClientInterface.getOperationClientUuidAsync(httpClientUuid, oldOperationName);
    if (operationClientUuid) {
      if (oldOperationName != newOperationName) {
        isUpdated = await operationClientInterface.setOperationNameAsync(operationClientUuid, newOperationName);
      }
    }
  }

  if (isUpdated) {
    let configurationStatus = new ConfigurationStatus(operationClientUuid, undefined, isUpdated);

    let logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
      [configurationStatus],
      undefined,
      []
    );
    /****************************************************************************************
     * Prepare attributes to automate forwarding-construct
     ****************************************************************************************/
    let forwardingAutomationInputList = await prepareForwardingAutomation.updateOperationClient(
      logicalTerminationPointConfigurationStatus
    );
    ForwardingAutomationService.automateForwardingConstructAsync(
      operationServerName,
      forwardingAutomationInputList,
      user,
      xCorrelator,
      traceIndicator,
      customerJourney
    );
  }
}

/**
 * Allows updating operation key at a server or client
 *
 * body V1_updateoperationkey_body 
 * no response value expected for this operation
 **/
exports.updateOperationKey = async function (body) {
  let operationUuid = body["operation-uuid"];
  let newOperationKey = body["new-operation-key"];
  let isOperationServerUuid = await operationServerInterface.isOperationServerAsync(operationUuid);
  let isOperationClientUuid = await operationClientInterface.isOperationClientAsync(operationUuid);
  if (isOperationServerUuid) {
    operationServerInterface.setOperationKeyAsync(operationUuid, newOperationKey);
  } else if (isOperationClientUuid) {
    operationClientInterface.setOperationKeyAsync(operationUuid, newOperationKey);
  }else {
    throw new createHttpError.BadRequest("OperationClientUuid/OperationServerUuid is not present");
  }
}

async function isForwardingNameExist(forwardingName) {
  const forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName);
  return forwardingConstruct !== undefined;
}

/**
 * @description This function helps to get the APISegment of the operationClient uuid
 * @return {Promise} returns the APISegment
 **/
async function updateTcpServerDetails(protocol, address, port) {
  let updatedDetails = {};
  let istcpServerUpdated = false;
  let tcpServerUuid;
  if (address != undefined || port != undefined) {
    tcpServerUuid = await tcpServerInterface.getUuidOfTheProtocol(protocol);
    if (tcpServerUuid != undefined && Object.keys(tcpServerUuid).length != 0) {
      if (address != undefined) {
        let localAddress = address;
        if (address[onfAttributes.TCP_CLIENT.IP_ADDRESS]) {
          localAddress = address[onfAttributes.TCP_CLIENT.IP_ADDRESS];
        }
        let configuredAddress = await tcpServerInterface.getLocalAddressOfTheProtocol(protocol);
        if (JSON.stringify(configuredAddress) != JSON.stringify(localAddress)) {
          istcpServerUpdated = await tcpServerInterface.setLocalAddressAsync(tcpServerUuid, localAddress);
        }
      }
      if (port != undefined) {
        let configuredPort = await tcpServerInterface.getLocalPortOfTheProtocol(protocol);
        if (configuredPort != port) {
          istcpServerUpdated = await tcpServerInterface.setLocalPortAsync(tcpServerUuid, port);
        }
      }
    }
  }
  updatedDetails.tcpServerUuid = tcpServerUuid;
  updatedDetails.istcpServerUpdated = istcpServerUpdated;
  return updatedDetails;
}
