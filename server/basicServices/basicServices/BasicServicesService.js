//@ts-check
'use strict';

const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const TcpObject = require('onf-core-model-ap/applicationPattern/onfModel/services/models/TcpObject');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServicesV2');
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
const HttpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
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
  let registryOfficeApplicationName = body["registry-office-application"];
  let registryOfficeReleaseNumber = body["registry-office-application-release-number"];
  let registryOfficeProtocol = body["registry-office-protocol"];
  let registryOfficeAddress = body["registry-office-address"];
  let registryOfficePort = body["registry-office-port"];
  let deregisterOperation = body["deregistration-operation"];
  let relayOperationUpdateOperation = body["relay-operation-update-operation"];
  let relayServerReplacementOperation = body["relay-server-replacement-operation"];

  /****************************************************************************************
   * Prepare logicalTerminationPointConfigurationInput object to
   * configure logical-termination-point
   ****************************************************************************************/

  let ltpConfigurationList = [];
  // update the registryOffice configuration
  let relayServerReplacementForwarding = "PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement";
  let relayOperationUpdate = "PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation";
  let deregisterApplication = "PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease";

  let registryOfficeClientUuidStack = await ServiceUtils.resolveClientUuidStackFromForwardingAsync(relayServerReplacementForwarding);
  let relayOperationUpdateOperationClientUuid = await ServiceUtils.resolveOperationClientUuidFromForwardingAsync(relayOperationUpdate);
  let deregisterApplicationOperationClientUuid = await ServiceUtils.resolveOperationClientUuidFromForwardingAsync(deregisterApplication);

  let existingRegistryOfficeApplicationName = await httpClientInterface.getApplicationNameAsync(registryOfficeClientUuidStack.httpClientUuid);
  let existingRegistryOfficeReleaseNumber = await httpClientInterface.getReleaseNumberAsync(registryOfficeClientUuidStack.httpClientUuid);
  let existingRegistryOfficeAddress = await tcpClientInterface.getRemoteAddressAsync(registryOfficeClientUuidStack.tcpClientUuid);
  let existingRegistryOfficePort = await tcpClientInterface.getRemotePortAsync(registryOfficeClientUuidStack.tcpClientUuid);
  let existingRegistryOfficeProtocol = await tcpClientInterface.getRemoteProtocolAsync(registryOfficeClientUuidStack.tcpClientUuid);
  let exsitingRegistryOfficeRelayServerReplacementOperation = await operationClientInterface.getOperationNameAsync(registryOfficeClientUuidStack.operationClientUuid);
  let exsitingRegistryOfficeRelayOperationUpdateOperation = await operationClientInterface.getOperationNameAsync(relayOperationUpdateOperationClientUuid);
  let exsitingRegistryOfficeDeregisterApplicationOperation = await operationClientInterface.getOperationNameAsync(deregisterApplicationOperationClientUuid);

  let isRoApplicationNameUpdated = false;
  let isRoReleaseNumberUpdated = false;
  let isRoAddressUpdated = false;
  let isRoPortUpdated = false;
  let isRoProtocolUpdated = false;
  let isRoRelayServerReplacementOperationUpdated = false;
  let isRoRelayOperationUpdateOperationUpdated = false;
  let isRoDeregisterApplicationOperationUpdated = false;

  if (registryOfficeApplicationName != existingRegistryOfficeApplicationName) {
    isRoApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(
      registryOfficeClientUuidStack.httpClientUuid,
      registryOfficeApplicationName);
  }
  if (registryOfficeReleaseNumber != existingRegistryOfficeReleaseNumber) {
    isRoReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(
      registryOfficeClientUuidStack.httpClientUuid,
      registryOfficeReleaseNumber);
  }
  if (JSON.stringify(registryOfficeAddress) != JSON.stringify(existingRegistryOfficeAddress)) {
    isRoAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
      registryOfficeClientUuidStack.tcpClientUuid,
      registryOfficeAddress);
  }
  if (registryOfficePort != existingRegistryOfficePort) {
    isRoPortUpdated = await tcpClientInterface.setRemotePortAsync(
      registryOfficeClientUuidStack.tcpClientUuid,
      registryOfficePort);
  }
  if (registryOfficeProtocol != existingRegistryOfficeProtocol) {
    isRoProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(
      registryOfficeClientUuidStack.tcpClientUuid,
      registryOfficeProtocol);
  }
  if (relayServerReplacementOperation != exsitingRegistryOfficeRelayServerReplacementOperation) {
    isRoRelayServerReplacementOperationUpdated = await operationClientInterface.setOperationNameAsync(
      registryOfficeClientUuidStack.operationClientUuid,
      relayServerReplacementOperation);
  }

  if (relayOperationUpdateOperation != exsitingRegistryOfficeRelayOperationUpdateOperation) {
    isRoRelayOperationUpdateOperationUpdated = await operationClientInterface.setOperationNameAsync(
      relayOperationUpdateOperationClientUuid,
      relayOperationUpdateOperation);
  }

  if (deregisterOperation != exsitingRegistryOfficeDeregisterApplicationOperation) {
    isRoDeregisterApplicationOperationUpdated = await operationClientInterface.setOperationNameAsync(
      deregisterApplicationOperationClientUuid,
      deregisterOperation);
  }

  if (isRoApplicationNameUpdated || isRoReleaseNumberUpdated) {
    ltpConfigurationList.push(registryOfficeClientUuidStack.httpClientUuid);
  }
  if (isRoAddressUpdated || isRoPortUpdated || isRoProtocolUpdated) {
    ltpConfigurationList.push(registryOfficeClientUuidStack.tcpClientUuid);
  }
  if (isRoRelayServerReplacementOperationUpdated) {
    ltpConfigurationList.push(registryOfficeClientUuidStack.operationClientUuid);
  }
  if (isRoRelayOperationUpdateOperationUpdated) {
    ltpConfigurationList.push(relayOperationUpdateOperationClientUuid);
  }
  if (isRoDeregisterApplicationOperationUpdated) {
    ltpConfigurationList.push(deregisterApplicationOperationClientUuid);
  }

  /***********************************************************************
   * oldRelease information to be updated if provided in the requestBody
   ***********************************************************************/

  let oldApplicationNameInConfiguration;
  let beaqueathYourDataAndDieForwardingName = "PromptForEmbeddingCausesRequestForBequeathingData";
  let isOldReleaseExist = await isForwardingNameExist(beaqueathYourDataAndDieForwardingName);

  if (isOldReleaseExist) {
    let preceedingApplicationClientUuidStack = await ServiceUtils.resolveClientUuidStackFromForwardingAsync(beaqueathYourDataAndDieForwardingName);

    oldApplicationNameInConfiguration = await HttpClientInterface.getApplicationNameAsync(preceedingApplicationClientUuidStack.httpClientUuid)
    let existingpreceedingApplicationAddress = await tcpClientInterface.getRemoteAddressAsync(preceedingApplicationClientUuidStack.tcpClientUuid);
    let existingpreceedingApplicationPort = await tcpClientInterface.getRemotePortAsync(preceedingApplicationClientUuidStack.tcpClientUuid);
    let existingpreceedingApplicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(preceedingApplicationClientUuidStack.tcpClientUuid);

    let isORAddressUpdated = false;
    let isORPortUpdated = false;
    let isORProtocolUpdated = false;

    let oldReleaseAddress = body["old-release-address"];
    let oldReleaseProtocol = body["old-release-protocol"];
    let oldReleasePort = body["old-release-port"];
    if (JSON.stringify(oldReleaseAddress) != JSON.stringify(existingpreceedingApplicationAddress)) {
      isORAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
        preceedingApplicationClientUuidStack.tcpClientUuid,
        oldReleaseAddress);
    }
    if (oldReleasePort != existingpreceedingApplicationPort) {
      isORPortUpdated = await tcpClientInterface.setRemotePortAsync(
        preceedingApplicationClientUuidStack.tcpClientUuid,
        oldReleasePort);
    }
    if (oldReleaseProtocol != existingpreceedingApplicationProtocol) {
      isORProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(
        preceedingApplicationClientUuidStack.tcpClientUuid,
        oldReleaseProtocol);
    }

    if (isORAddressUpdated || isORPortUpdated || isORProtocolUpdated) {
      ltpConfigurationList.push(preceedingApplicationClientUuidStack.tcpClientUuid);
    }

  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   * Since the following forwarding-constructs are invariant , no configuration required in the forwarding-construct
   * PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement,
   * PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation
   * PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease
   ****************************************************************************************/



  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.embedYourself(
    ltpConfigurationList, oldApplicationNameInConfiguration
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
  let subscribingApplicationName = body["application-name"];
  let subscribingApplicationReleaseNumber = body["release-number"];
  let subscribingApplicationProtocol = body["protocol"];
  let subscribingApplicationIPAddress = body["address"];
  let subscribingApplicationPort = body["port"];

  let basicAuthApprovalOperation = body["operation-name"];
  let inquireBasicAuthFCName = "BasicAuthRequestCausesInquiryForAuthentication";

  let subscribingServiceAndCallbackUrlMap = new Map();
  subscribingServiceAndCallbackUrlMap.set(inquireBasicAuthFCName, basicAuthApprovalOperation);

  await processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
    subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
    operationServerName, user, xCorrelator, traceIndicator, customerJourney);
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
  let subscribingApplicationName = body["oam-approval-application"];
  let subscribingApplicationReleaseNumber = body["oam-approval-application-release-number"];
  let subscribingApplicationProtocol = body["oam-approval-protocol"];
  let subscribingApplicationIPAddress = body["oam-approval-address"];
  let subscribingApplicationPort = body["oam-approval-port"];

  let oamApprovalOperation = body["oam-approval-operation"];
  let inquireBasicAuthFCName = "BasicAuthRequestCausesInquiryForAuthentication";
  let subscribingServiceAndCallbackUrlMap = new Map();
  subscribingServiceAndCallbackUrlMap.set(inquireBasicAuthFCName, oamApprovalOperation);

  await processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
    subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
    operationServerName, user, xCorrelator, traceIndicator, customerJourney);
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
exports.redirectOamRequestInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let subscribingApplicationName = body["oam-log-application"];
  let subscribingApplicationReleaseNumber = body["oam-log-application-release-number"];
  let subscribingApplicationProtocol = body["oam-log-protocol"];
  let subscribingApplicationIPAddress = body["oam-log-address"];
  let subscribingApplicationPort = body["oam-log-port"];

  let oamLogOperation = body["oam-log-operation"];
  let oamRequestLoggingFCName = "OamRequestCausesLoggingRequest";
  let subscribingServiceAndCallbackUrlMap = new Map();
  subscribingServiceAndCallbackUrlMap.set(oamRequestLoggingFCName, oamLogOperation);

  await processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
    subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
    operationServerName, user, xCorrelator, traceIndicator, customerJourney);
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
exports.redirectServiceRequestInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let subscribingApplicationName = body["service-log-application"];
  let subscribingApplicationReleaseNumber = body["service-log-application-release-number"];
  let subscribingApplicationProtocol = body["service-log-protocol"];
  let subscribingApplicationIPAddress = body["service-log-address"];
  let subscribingApplicationPort = body["service-log-port"];

  let serviceLogOperation = body["service-log-operation"];
  let ServiceRequestCausesLoggingRequestFCName = "ServiceRequestCausesLoggingRequest";
  let subscribingServiceAndCallbackUrlMap = new Map();
  subscribingServiceAndCallbackUrlMap.set(ServiceRequestCausesLoggingRequestFCName, serviceLogOperation);

  await processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
    subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
    operationServerName, user, xCorrelator, traceIndicator, customerJourney);
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
exports.redirectTopologyChangeInformation = async function (body, user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let subscribingApplicationName = body["topology-application"];
  let subscribingApplicationReleaseNumber = body["topology-application-release-number"];
  let subscribingApplicationIPAddress = body["topology-application-address"];
  let subscribingApplicationPort = body["topology-application-port"];
  let subscribingApplicationProtocol = body["topology-application-protocol"];

  let ltpUpdateTopologyOperation = body["topology-operation-ltp-update"];
  let updateLtpFCName = "ServiceRequestCausesLtpUpdateRequest";

  let ltpDeletionTopologyOperation = body["topology-operation-ltp-deletion"];
  let deleteLtpFCName = "ServiceRequestCausesLtpDeletionRequest";

  let fcUpdateTopologyOperation = body["topology-operation-fc-update"];
  let updateForwardingFCName = "ServiceRequestCausesFcUpdateRequest";

  let fcPortUpdateTopologyOperation = body["topology-operation-fc-port-update"];
  let updateFCPortFCName = "ServiceRequestCausesFcPortUpdateRequest";

  let fcPortDeletionTopologyOperation = body["topology-operation-fc-port-deletion"];
  let deleteFCPortFCName = "ServiceRequestCausesFcPortDeletionRequest";

  let subscribingServiceAndCallbackUrlMap = new Map();
  subscribingServiceAndCallbackUrlMap.set(updateLtpFCName, ltpUpdateTopologyOperation);
  subscribingServiceAndCallbackUrlMap.set(deleteLtpFCName, ltpDeletionTopologyOperation);
  subscribingServiceAndCallbackUrlMap.set(updateForwardingFCName, fcUpdateTopologyOperation);
  subscribingServiceAndCallbackUrlMap.set(updateFCPortFCName, fcPortUpdateTopologyOperation);
  subscribingServiceAndCallbackUrlMap.set(deleteFCPortFCName, fcPortDeletionTopologyOperation);

  await processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
    subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
    operationServerName, user, xCorrelator, traceIndicator, customerJourney);
  
  let response = await  prepareResponseForRedirectTopologyChangeInformation();
  return response;
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
  let ltpConfigurationList = [];
  let forwardingConstructConfigurationStatus;
  let preceedingApplicationName;
  let preceedingApplicationRelease;

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

    preceedingApplicationName = body["preceding-application-name"];
    preceedingApplicationRelease = body["preceding-release-number"];

    /****************************************************************************************
     * Prepare logicalTerminationPointConfigurationInput object to
     * configure logical-termination-point
     ****************************************************************************************/
    // update the registryOffice configuration
    let registrationForwardingName = "PromptForRegisteringCausesRegistrationRequest";
    let registryOfficeClientUuidStack = await ServiceUtils.resolveClientUuidStackFromForwardingAsync(registrationForwardingName);

    let existingRegistryOfficeApplicationName = await httpClientInterface.getApplicationNameAsync(registryOfficeClientUuidStack.httpClientUuid);
    let existingRegistryOfficeReleaseNumber = await httpClientInterface.getReleaseNumberAsync(registryOfficeClientUuidStack.httpClientUuid);
    let existingRegistryOfficeAddress = await tcpClientInterface.getRemoteAddressAsync(registryOfficeClientUuidStack.tcpClientUuid);
    let existingRegistryOfficePort = await tcpClientInterface.getRemotePortAsync(registryOfficeClientUuidStack.tcpClientUuid);
    let existingRegistryOfficeProtocol = await tcpClientInterface.getRemoteProtocolAsync(registryOfficeClientUuidStack.tcpClientUuid);
    let exsitingRegistryOfficeRegisterOperation = await operationClientInterface.getOperationNameAsync(registryOfficeClientUuidStack.operationClientUuid);

    let isRoApplicationNameUpdated = false;
    let isRoReleaseNumberUpdated = false;
    let isRoAddressUpdated = false;
    let isRoPortUpdated = false;
    let isRoProtocolUpdated = false;
    let isRoRegisterOperationUpdated = false;

    if (registryOfficeApplicationName != existingRegistryOfficeApplicationName) {
      isRoApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(
        registryOfficeClientUuidStack.httpClientUuid,
        registryOfficeApplicationName);
    }
    if (registryOfficeReleaseNumber != existingRegistryOfficeReleaseNumber) {
      isRoReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(
        registryOfficeClientUuidStack.httpClientUuid,
        registryOfficeReleaseNumber);
    }
    if (JSON.stringify(registryOfficeAddress) != JSON.stringify(existingRegistryOfficeAddress)) {
      isRoAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
        registryOfficeClientUuidStack.tcpClientUuid,
        registryOfficeAddress);
    }
    if (registryOfficePort != existingRegistryOfficePort) {
      isRoPortUpdated = await tcpClientInterface.setRemotePortAsync(
        registryOfficeClientUuidStack.tcpClientUuid,
        registryOfficePort);
    }
    if (registryOfficeProtocol != existingRegistryOfficeProtocol) {
      isRoProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(
        registryOfficeClientUuidStack.tcpClientUuid,
        registryOfficeProtocol);
    }
    if (registryOfficeRegisterOperation != exsitingRegistryOfficeRegisterOperation) {
      isRoRegisterOperationUpdated = await operationClientInterface.setOperationNameAsync(
        registryOfficeClientUuidStack.operationClientUuid,
        registryOfficeRegisterOperation);
    }

    if (isRoApplicationNameUpdated || isRoReleaseNumberUpdated) {
      ltpConfigurationList.push(registryOfficeClientUuidStack.httpClientUuid);
    }
    if (isRoAddressUpdated || isRoPortUpdated || isRoProtocolUpdated) {
      ltpConfigurationList.push(registryOfficeClientUuidStack.tcpClientUuid);
    }
    if (isRoRegisterOperationUpdated) {
      ltpConfigurationList.push(registryOfficeClientUuidStack.operationClientUuid);
    }

    // update tcp-server configuration if required
    let tcpServerWithHttpUpdated = await updateTcpServerDetails("HTTP", httpAddress, httpPort);
    if (tcpServerWithHttpUpdated.istcpServerUpdated) {
      ltpConfigurationList.push(tcpServerWithHttpUpdated.tcpServerUuid);
    }

    // update old release configuration
    let beaqueathYourDataAndDieForwardingName = "PromptForEmbeddingCausesRequestForBequeathingData";
    let preceedingApplicationClientUuidStack = await ServiceUtils.resolveClientUuidStackFromForwardingAsync(beaqueathYourDataAndDieForwardingName);

    if (preceedingApplicationClientUuidStack.httpClientUuid) {
      let isPreceedingApplicationNameUpdated = false;
      let isPreceedingReleaseNumberUpdated = false;
      if (preceedingApplicationName != undefined) {
        let existingPreceedingApplicationName = await httpClientInterface.getApplicationNameAsync(
          preceedingApplicationClientUuidStack.httpClientUuid);
        if (existingPreceedingApplicationName != preceedingApplicationName) {
          isPreceedingApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(
            preceedingApplicationClientUuidStack.httpClientUuid,
            preceedingApplicationName);
        }
      }
      if (preceedingApplicationRelease != undefined) {
        let existingPreceedingApplicationReleaseNumber = await httpClientInterface.getReleaseNumberAsync(
          preceedingApplicationClientUuidStack.httpClientUuid);
        if (existingPreceedingApplicationReleaseNumber != preceedingApplicationRelease) {
          isPreceedingReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(
            preceedingApplicationClientUuidStack.httpClientUuid,
            preceedingApplicationRelease);
        }
      }
      if (isPreceedingApplicationNameUpdated || isPreceedingReleaseNumberUpdated) {
        ltpConfigurationList.push(preceedingApplicationClientUuidStack.httpClientUuid)
      }
    }


    /****************************************************************************************
     * Prepare attributes to configure forwarding-construct
     * Since PromptForRegisteringCausesRegistrationRequest is invariant process snippet , 
     * no fc-port updation is required
     ****************************************************************************************/


  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.registerYourself(
    ltpConfigurationList,
    forwardingConstructConfigurationStatus,
    preceedingApplicationName,
    preceedingApplicationRelease
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
  let ltpConfigurationList = [];

  let httpClientUuidOfFutureApplication = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    futureApplicationName,
    futureReleaseNumber,
    newReleaseFwName);
  let httpClientUuidOfCurrentApplication = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    currentApplicationName,
    currentReleaseNumber,
    newReleaseFwName);

  if (httpClientUuidOfFutureApplication) {
    let tcpClientUuidOfFutureApplication = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuidOfFutureApplication);
    let existingIpAddressOfFutureApplication = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuidOfFutureApplication);
    let existingProtocolOfFutureApplication = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuidOfFutureApplication);
    let existingPortOfFutureApplication = await tcpClientInterface.getRemotePortAsync(tcpClientUuidOfFutureApplication);

    let isIpAddressOfFutureApplicationUpdated = false;
    let isProtocolOfFutureApplicationUpdated = false;
    let isPortOfFutureApplicationUpdated = false;

    if (JSON.stringify(futureAddress) != JSON.stringify(existingIpAddressOfFutureApplication)) {
      isIpAddressOfFutureApplicationUpdated = await tcpClientInterface.setRemoteAddressAsync(
        tcpClientUuidOfFutureApplication,
        futureAddress);
    }
    if (futureProtocol != existingProtocolOfFutureApplication) {
      isProtocolOfFutureApplicationUpdated = await tcpClientInterface.setRemoteProtocolAsync(
        tcpClientUuidOfFutureApplication,
        futureProtocol);
    }
    if (futurePort != existingPortOfFutureApplication) {
      isPortOfFutureApplicationUpdated = await tcpClientInterface.setRemotePortAsync(
        tcpClientUuidOfFutureApplication,
        futurePort);
    }

    if (isIpAddressOfFutureApplicationUpdated || isProtocolOfFutureApplicationUpdated || isPortOfFutureApplicationUpdated) {
      ltpConfigurationList.push(tcpClientUuidOfFutureApplication);
    }

    if (httpClientUuidOfCurrentApplication) {
      let updateUuidList = await transferOperationClientFromOldToNewRelease(httpClientUuidOfCurrentApplication, httpClientUuidOfFutureApplication)
      ltpConfigurationList = ltpConfigurationList.concat(updateUuidList);
    }
  } else if (httpClientUuidOfCurrentApplication) {
    let tcpClientUuidOfCurrentApplication = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuidOfCurrentApplication);
    let existingIpAddressOfCurrentApplication = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuidOfCurrentApplication);
    let existingProtocolOfCurrentApplication = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuidOfCurrentApplication);
    let existingPortOfCurrentApplication = await tcpClientInterface.getRemotePortAsync(tcpClientUuidOfCurrentApplication);

    let isIpAddressOfCurrentApplicationUpdated = false;
    let isProtocolOfCurrentApplicationUpdated = false;
    let isPortOfCurrentApplicationUpdated = false;

    if (JSON.stringify(futureAddress) != JSON.stringify(existingIpAddressOfCurrentApplication)) {
      isIpAddressOfCurrentApplicationUpdated = await tcpClientInterface.setRemoteAddressAsync(
        tcpClientUuidOfCurrentApplication,
        futureAddress);
    }
    if (futureProtocol != existingProtocolOfCurrentApplication) {
      isProtocolOfCurrentApplicationUpdated = await tcpClientInterface.setRemoteProtocolAsync(
        tcpClientUuidOfCurrentApplication,
        futureProtocol);
    }
    if (futurePort != existingPortOfCurrentApplication) {
      isPortOfCurrentApplicationUpdated = await tcpClientInterface.setRemotePortAsync(
        tcpClientUuidOfCurrentApplication,
        futurePort);
    }

    let isApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(
      httpClientUuidOfCurrentApplication,
      futureApplicationName);

    let isReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(
      httpClientUuidOfCurrentApplication,
      futureReleaseNumber);

    if (isIpAddressOfCurrentApplicationUpdated || isProtocolOfCurrentApplicationUpdated || isPortOfCurrentApplicationUpdated) {
      ltpConfigurationList.push(tcpClientUuidOfCurrentApplication);
    }

    if (isApplicationNameUpdated || isReleaseNumberUpdated) {
      ltpConfigurationList.push(httpClientUuidOfCurrentApplication);
    }
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.updateLtpToALT(
    ltpConfigurationList
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

  let ltpConfigurationList = [];

  let newReleaseHttpClientLtpUuid = await httpClientInterface.getHttpClientUuidFromForwarding(newReleaseForwardingName);
  if (newReleaseHttpClientLtpUuid != undefined) {
    let newReleaseTcpClientUuidList = await LogicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid);
    let newReleaseTcpClientUuid = newReleaseTcpClientUuidList[0];

    let existingNewReleaseApplicationName = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientLtpUuid);
    let existingNewReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid);
    let existingNewReleaseAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
    let existingNewReleasePort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
    let existingNewReleaseProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid);

    let isNewReleaseApplicationNameIsUpdated = false;
    let isNewReleaseNumberIsUpdated = false;
    let isNewReleaseAddressUpdated = false;
    let isNewReleasePortUpdated = false;
    let isNewReleaseProtocolUpdated = false;

    if (futureApplicationName != existingNewReleaseApplicationName) {
      isNewReleaseApplicationNameIsUpdated = await httpClientInterface.setApplicationNameAsync(
        newReleaseHttpClientLtpUuid,
        futureApplicationName);
    }
    if (futureReleaseNumber != existingNewReleaseNumber) {
      isNewReleaseNumberIsUpdated = await httpClientInterface.setReleaseNumberAsync(
        newReleaseHttpClientLtpUuid,
        futureReleaseNumber);
    }
    if (JSON.stringify(futureAddress) != JSON.stringify(existingNewReleaseAddress)) {
      isNewReleaseAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
        newReleaseTcpClientUuid,
        futureAddress);
    }
    if (futurePort != existingNewReleasePort) {
      isNewReleasePortUpdated = await tcpClientInterface.setRemotePortAsync(
        newReleaseTcpClientUuid,
        futurePort);
    }
    if (futureProtocol != existingNewReleaseProtocol) {
      isNewReleaseProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(
        newReleaseTcpClientUuid,
        futureProtocol);
    }

    if (isNewReleaseApplicationNameIsUpdated || isNewReleaseNumberIsUpdated) {
      ltpConfigurationList.push(newReleaseHttpClientLtpUuid);
    }
    if (isNewReleaseAddressUpdated || isNewReleasePortUpdated || isNewReleaseProtocolUpdated) {
      ltpConfigurationList.push(newReleaseTcpClientUuid);
    }

    if (ltpConfigurationList.length != 0) {

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.updateLtpToALT(
        ltpConfigurationList
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

  bequeathYourDataAndDieOperation = await operationServerInterface.getInputOperationServerNameFromForwarding(newReleaseForwardingName);

  if (newReleaseHttpClientLtpUuid) {
    let dataTransferOperationClientUuidList = await LogicalTerminationPoint.getClientLtpListAsync(newReleaseHttpClientLtpUuid);
    for (let i = 0; i < dataTransferOperationClientUuidList.length; i++) {
      let operationClientUuid = dataTransferOperationClientUuidList[i];
      let operationClientName = await OperationClientInterface.getOperationNameAsync(operationClientUuid);
      dataTransferOperationsList.push(operationClientName);
    }
  }

  /****************************************************************************************
   * Prepare attributes for the response body
   ****************************************************************************************/
  let handOverAndDatatransferInformation = {
    "bequeathYourDataAndDieOperation": bequeathYourDataAndDieOperation,
    "dataTransferOperationsList": dataTransferOperationsList
  };

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

  let ltpConfigurationList = [];
  let httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(applicationName, releaseNumber, newReleaseFwName);
  if (httpClientUuid) {
    let operationClientUuid = await operationClientInterface.getOperationClientUuidAsync(httpClientUuid, oldOperationName);
    if (operationClientUuid) {
      if (oldOperationName != newOperationName) {
        let isOperationClientUpdated = await operationClientInterface.setOperationNameAsync(operationClientUuid, newOperationName);
        if (isOperationClientUpdated) {
          ltpConfigurationList.push(operationClientUuid);
        }
      }
    }
  }

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.updateLtpToALT(
    ltpConfigurationList
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
  } else {
    throw new createHttpError.BadRequest("OperationClientUuid/OperationServerUuid is not present");
  }
}



/***********************************************************************************************
 * FUNCTIONS
 ***********************************************************************************************/

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

/**
 * Prepares response for the redirect topology change information
 * @returns controlConstructResponse
 */
async function prepareResponseForRedirectTopologyChangeInformation() {
  let controlConstructResponse;
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

  controlConstructResponse = {
    "core-model-1-4:control-construct": {
      "uuid": controluuid,
      "logical-termination-point": logicalterminationpoint,
      "forwarding-domain": forwrdingContructResponse
    }
  };

  return controlConstructResponse;
}

/**
 * To transfer the operation-client instances from current-release to future-release
 * @param {String} httpClientUuidOfOldApplication 
 * @param {String} httpClientUuidOfNewApplication 
 * @returns {Promise<String[]>} updatedLtpUuids
 */
async function transferOperationClientFromOldToNewRelease(httpClientUuidOfOldApplication, httpClientUuidOfNewApplication) {
  let updatedLtpUuids = [];
  let clientLtpsOfOldApplication = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuidOfOldApplication);
  if (clientLtpsOfOldApplication != undefined && clientLtpsOfOldApplication.length > 0) {
    let existingClientLtpsOfNewRelease = await LogicalTerminationPoint.getClientLtpListAsync(httpClientUuidOfNewApplication);
    for (let i = 0; i < clientLtpsOfOldApplication.length; i++) {
      let operationClientLtpOfOldApplication = clientLtpsOfOldApplication[i];
      let isOperationClientUpdated = await LogicalTerminationPoint.setServerLtpListAsync(
        operationClientLtpOfOldApplication,
        [httpClientUuidOfNewApplication]
      );
      if (isOperationClientUpdated) {
        updatedLtpUuids.push(operationClientLtpOfOldApplication);
      }
      existingClientLtpsOfNewRelease.push(operationClientLtpOfOldApplication);
    }

    let isHttpClientOfNewReleaseUpdated = await LogicalTerminationPoint.setClientLtpListAsync(
      httpClientUuidOfNewApplication,
      existingClientLtpsOfNewRelease
    );

    let isHttpClientOfOldReleaseUpdated = await LogicalTerminationPoint.setClientLtpListAsync(
      httpClientUuidOfOldApplication,
      []
    );

    if (isHttpClientOfNewReleaseUpdated) {
      updatedLtpUuids.push(httpClientUuidOfNewApplication);
    }

    if (isHttpClientOfOldReleaseUpdated) {
      updatedLtpUuids.push(httpClientUuidOfNewApplication);
    }
  }
  return updatedLtpUuids;
}

/**
 * Update invariant subscription and initiate callbacks about topology change information
 * @param {String} subscribingApplicationName 
 * @param {String} subscribingApplicationReleaseNumber 
 * @param {String} subscribingApplicationProtocol 
 * @param {String} subscribingApplicationIPAddress 
 * @param {String} subscribingApplicationPort 
 * @param {Map} subscribingServiceAndCallbackUrlMap 
 * @param {String} operationServerName 
 * @param {String} user 
 * @param {String} xCorrelator 
 * @param {String} traceIndicator 
 * @param {String} customerJourney 
 */
async function processInvariantSubscription(subscribingApplicationName, subscribingApplicationReleaseNumber, subscribingApplicationProtocol,
  subscribingApplicationIPAddress, subscribingApplicationPort, subscribingServiceAndCallbackUrlMap,
  operationServerName, user, xCorrelator, traceIndicator, customerJourney) {
  /****************************************************************************************
   * configure logical-termination-point
   ****************************************************************************************/
  let ltpConfigurationList = [];
  let operationClientUuid;

  for (let [key, value] of subscribingServiceAndCallbackUrlMap) {
    let subscribingServiceFcName = key;
    let proposedCallbackOperationName = value;
    operationClientUuid = await ServiceUtils.resolveOperationClientUuidFromForwardingAsync(subscribingServiceFcName);
    let exsitingSubscriberCallbackOperationName = await operationClientInterface.getOperationNameAsync(operationClientUuid);
    if (proposedCallbackOperationName != exsitingSubscriberCallbackOperationName) {
      let isOperationClientUpdated = await operationClientInterface.setOperationNameAsync(
        operationClientUuid,
        proposedCallbackOperationName);
      if (isOperationClientUpdated) {
        ltpConfigurationList.push(operationClientUuid);
      }
    }
  }

  let subscriberClientUuidStack = await ServiceUtils.resolveClientUuidStackForOperationClientAsync(operationClientUuid);

  let existingSubscriberApplicationName = await httpClientInterface.getApplicationNameAsync(subscriberClientUuidStack.httpClientUuid);
  let existingSubscriberReleaseNumber = await httpClientInterface.getReleaseNumberAsync(subscriberClientUuidStack.httpClientUuid);
  let existingSubscriberAddress = await tcpClientInterface.getRemoteAddressAsync(subscriberClientUuidStack.tcpClientUuid);
  let existingSubscriberPort = await tcpClientInterface.getRemotePortAsync(subscriberClientUuidStack.tcpClientUuid);
  let existingSubscriberProtocol = await tcpClientInterface.getRemoteProtocolAsync(subscriberClientUuidStack.tcpClientUuid);

  let isSubscriberApplicationNameUpdated = false;
  let isSubscriberReleaseNumberUpdated = false;
  let isSubscriberAddressUpdated = false;
  let isSubscriberPortUpdated = false;
  let isSubscriberProtocolUpdated = false;

  if (subscribingApplicationName != existingSubscriberApplicationName) {
    isSubscriberApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(
      subscriberClientUuidStack.httpClientUuid,
      subscribingApplicationName);
  }
  if (subscribingApplicationReleaseNumber != existingSubscriberReleaseNumber) {
    isSubscriberReleaseNumberUpdated = await httpClientInterface.setReleaseNumberAsync(
      subscriberClientUuidStack.httpClientUuid,
      subscribingApplicationReleaseNumber);
  }
  if (JSON.stringify(subscribingApplicationIPAddress) != JSON.stringify(existingSubscriberAddress)) {
    isSubscriberAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(
      subscriberClientUuidStack.tcpClientUuid,
      subscribingApplicationIPAddress);
  }
  if (subscribingApplicationPort != existingSubscriberPort) {
    isSubscriberPortUpdated = await tcpClientInterface.setRemotePortAsync(
      subscriberClientUuidStack.tcpClientUuid,
      subscribingApplicationPort);
  }
  if (subscribingApplicationProtocol != existingSubscriberProtocol) {
    isSubscriberProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(
      subscriberClientUuidStack.tcpClientUuid,
      subscribingApplicationProtocol);
  }

  if (isSubscriberApplicationNameUpdated || isSubscriberReleaseNumberUpdated) {
    ltpConfigurationList.push(subscriberClientUuidStack.httpClientUuid);
  }
  if (isSubscriberAddressUpdated || isSubscriberPortUpdated || isSubscriberProtocolUpdated) {
    ltpConfigurationList.push(subscriberClientUuidStack.tcpClientUuid);
  }

  /****************************************************************************************
   * Prepare attributes to configure forwarding-construct
   * no configuration required in forwarding-constructs for invariant forwardings
   ****************************************************************************************/

  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/

  let forwardingAutomationInputList = await prepareForwardingAutomation.updateLtpToALT(
    ltpConfigurationList
  );
  ForwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );
  return true;
}