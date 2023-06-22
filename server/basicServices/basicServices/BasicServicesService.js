'use strict';

const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInputWithMapping');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointWithMappingServices');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
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
const BadRequestHttpException = require('onf-core-model-ap/applicationPattern/rest/server/HttpException');
/**
 * Embed yourself into the MBH SDN application layer
 *
 * body V1_embedyourself_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.embedYourself = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["registry-office-application"];
      let releaseNumber = body["registry-office-application-release-number"];
      let applicationProtocol = body["registry-office-protocol"];
      let applicationAddress = body["registry-office-address"];
      let applicationPort = body["registry-office-port"];
      let deregisterOperation = body["deregistration-operation"];
      let relayOperationUpdateOperation = body["relay-operation-update-operation"];
      let relayServerReplacementOperation = body["relay-server-replacement-operation"];


      let oldReleaseProtocol = body["old-release-protocol"];
      let oldReleaseAddress = body["old-release-address"];
      let oldReleasePort = body["old-release-port"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The registry-office-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/

      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("deregistration-operation", deregisterOperation);
      operationNamesByAttributes.set("relay-server-replacement-operation", relayServerReplacementOperation);
      operationNamesByAttributes.set("relay-operation-update-operation", relayOperationUpdateOperation);

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(applicationProtocol, applicationAddress, applicationPort);
      tcpObjectList.push(tcpObject);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminationPointConfigurationInput
      );

      let isOldApplicationTcpClientUpdated = false;
      let oldApplicationTcpClientUuid;
      let oldApplicationForwardingTag = "PromptForEmbeddingCausesRequestForBequeathingData";
      let oldApplicationApplicationNameAndHttpClientLtpUuid = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName(oldApplicationForwardingTag);
      let httpUuidOfOldApplication = oldApplicationApplicationNameAndHttpClientLtpUuid.httpClientLtpUuid;

      if (httpUuidOfOldApplication != undefined) {
        let tcpClientUuidList = await LogicalTerminationPoint.getServerLtpListAsync(httpUuidOfOldApplication);
        if (tcpClientUuidList != undefined) {
          oldApplicationTcpClientUuid = tcpClientUuidList[0];
          let tcpClientProtocolOfOldApplication = await tcpClientInterface.getRemoteProtocolAsync(oldApplicationTcpClientUuid);
          if (oldReleaseProtocol != tcpClientProtocolOfOldApplication) {
            isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemoteProtocolAsync(oldApplicationTcpClientUuid, oldReleaseProtocol);
          }
          let tcpClientAddressOfOldApplication = await tcpClientInterface.getRemoteAddressAsync(oldApplicationTcpClientUuid);
          if (oldReleaseAddress != tcpClientAddressOfOldApplication) {
            isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemoteAddressAsync(oldApplicationTcpClientUuid, oldReleaseAddress);
          }
          let tcpClientPortOfOldApplication = await tcpClientInterface.getRemotePortAsync(oldApplicationTcpClientUuid);
          if (oldReleasePort != tcpClientPortOfOldApplication) {
            isOldApplicationTcpClientUpdated = await tcpClientInterface.setRemotePortAsync(oldApplicationTcpClientUuid, oldReleasePort);
          }
        }
      }
      if (isOldApplicationTcpClientUpdated) {
        let configurationStatus = new ConfigurationStatus(oldApplicationTcpClientUuid, '', isOldApplicationTcpClientUpdated);
        let tcpClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.tcpClientConfigurationStatusList;
        tcpClientConfigurationStatusList.push(configurationStatus);
      }

      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

      if (operationClientConfigurationStatusList) {
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
        logicalTerminationPointconfigurationStatus,
        forwardingConstructConfigurationStatus,
        oldApplicationApplicationNameAndHttpClientLtpUuid.applicationName
      );
      ForwardingAutomationService.automateForwardingConstructAsync(
        operationServerName,
        forwardingAutomationInputList,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Stops sending notifications of a specific subscription
 *
 * body V1_endsubscription_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.endSubscription = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let subscriberApplication = body["subscriber-application"];
      let subscriberReleaseNumber = body["subscriber-release-number"];
      let subscriptionOperation = body["subscription"];

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/

      let logicalTerminationPointconfigurationStatus;


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

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

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.endSubscription(
        logicalTerminationPointconfigurationStatus,
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Returns administrative information
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_4
 **/
exports.informAboutApplication = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing response body
       ****************************************************************************************/
      let applicationInformation = {};
      let httpServerCapability = await httpServerInterface.getHttpServerCapabilityAsync();
      Object.entries(httpServerCapability).map(entry => {
        let key = entry[0];
        let value = entry[1];
        if (key != onfAttributes.HTTP_SERVER.RELEASE_LIST) {
          applicationInformation[key] = value;
        }
      });

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = applicationInformation;
    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      reject();
    }
  });
}


/**
 * Returns administrative information for generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_5
 **/
exports.informAboutApplicationInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
    } catch (error) {
      console.log(error);
    }

    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });

}


/**
 * Returns release history
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns List
 **/
exports.informAboutReleaseHistory = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing response body
       ****************************************************************************************/
      let releaseList = await httpServerInterface.getReleaseListAsync();

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = releaseList;
    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      reject();
    }
  });

}


/**
 * Returns release history for generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_7
 **/
exports.informAboutReleaseHistoryInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
    } catch (error) {
      console.log(error);
    }

    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Receives information about where to ask for approval of OaM requests
 *
 * body V1_inquireoamrequestapprovals_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.inquireOamRequestApprovals = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["oam-approval-application"];
      let releaseNumber = body["oam-approval-application-release-number"];
      let applicationProtocol = body["oam-approval-protocol"];
      let applicationAddress = body["oam-approval-address"];
      let applicationPort = body["oam-approval-port"];
      let oamApprovalOperation = body["oam-approval-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('OamRequestCausesInquiryForAuthentication');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The oam-approval-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/
      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("oam-approval-operation", oamApprovalOperation);

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(applicationProtocol, applicationAddress, applicationPort);
      tcpObjectList.push(tcpObject);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminationPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

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
        logicalTerminationPointconfigurationStatus,
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Allows retrieving all interface and internal connection data
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_3
 **/
exports.listLtpsAndFcs = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing response body
       ****************************************************************************************/
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
          }
          else if (layerProtocolName == LayerProtocol.layerProtocolNameEnum.ES_CLIENT) {
            let elsticSearchClientInterface = layerProtocolInstance[onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
            if ( elsticSearchClientInterface !== undefined) {
              let elasticSearchConfiguration  = elsticSearchClientInterface[onfAttributes.ES_CLIENT.CONFIGURATION]
              if (elasticSearchConfiguration  !== undefined) {
                delete elasticSearchConfiguration ["auth"]
              }
        }
        
        }
        }
      }

      let controlConstructResponse = {
        "core-model-1-4:control-construct": controlConstruct
      };

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = controlConstructResponse;
    } catch (error) {
      reject(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });

}


/**
 * Offers configuring the client side for sending OaM request information
 *
 * body V1_redirectoamrequestinformation_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectOamRequestInformation = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["oam-log-application"];
      let releaseNumber = body["oam-log-application-release-number"];
      let applicationProtocol = body["oam-log-protocol"];
      let applicationAddress = body["oam-log-address"];
      let applicationPort = body["oam-log-port"];
      let oamLogOperation = body["oam-log-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('OamRequestCausesLoggingRequest');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The oam-log-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/
      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("oam-log-operation", oamLogOperation);

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(applicationProtocol, applicationAddress, applicationPort);
      tcpObjectList.push(tcpObject);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminationPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

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
        logicalTerminationPointconfigurationStatus,
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });

}


/**
 * Offers configuring the client side for sending service request information
 *
 * body V1_redirectservicerequestinformation_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectServiceRequestInformation = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["service-log-application"];
      let releaseNumber = body["service-log-application-release-number"];
      let applicationProtocol = body["service-log-protocol"];
      let applicationAddress = body["service-log-address"];
      let applicationPort = body["service-log-port"];
      let serviceLogOperation = body["service-log-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('ServiceRequestCausesLoggingRequest');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The service-log-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/
      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("service-log-operation", serviceLogOperation);

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(applicationProtocol, applicationAddress, applicationPort);
      tcpObjectList.push(tcpObject);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminationPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

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
        logicalTerminationPointconfigurationStatus,
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Offers configuring client side for sending information about topology changes
 *
 * body V1_redirecttopologychangeinformation_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectTopologyChangeInformation = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let response = {};
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
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

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('OamRequestCausesLtpUpdateRequest');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The topology-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminationPointConfigurationInput object to
       * configure logical-termination-point
       ****************************************************************************************/
      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("topology-operation-ltp-update", ltpUpdateTopologyOperation);
      operationNamesByAttributes.set("topology-operation-ltp-deletion", ltpDeletionTopologyOperation);
      operationNamesByAttributes.set("topology-operation-fc-update", fcUpdateTopologyOperation);
      operationNamesByAttributes.set("topology-operation-fc-port-update", fcPortUpdateTopologyOperation);
      operationNamesByAttributes.set("topology-operation-fc-port-deletion", fcPortDeletionTopologyOperation);

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(applicationProtocol, applicationAddress, applicationPort);
      tcpObjectList.push(tcpObject);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminationPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

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
        logicalTerminationPointconfigurationStatus,
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
            }
          } else if (layerProtocalName == 'operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER') {
            serverclientinterfacepac = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.OPERATION_SERVER_INTERFACE_PAC]
            let serverconfiguration = serverclientinterfacepac[onfAttributes.OPERATION_SERVER.CONFIGURATION]
            if (serverconfiguration !== undefined) {
              delete serverconfiguration['operation-key'];
            }
          }
          else if (layerProtocalName == LayerProtocol.layerProtocolNameEnum.ES_CLIENT) {
            let elsticSearchClientInterface = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.ES_CLIENT_INTERFACE_PAC];
            if ( elsticSearchClientInterface!== undefined) {
              let elasticSearchConfiguration  = elsticSearchClientInterface[onfAttributes.ES_CLIENT.CONFIGURATION]
              if (elasticSearchConfiguration  !== undefined) {
                delete elasticSearchConfiguration ["auth"]
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
      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = controlConstructResponse;
    } catch (error) {
      reject(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
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
exports.registerYourself = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {
      let logicalTerminationPointconfigurationStatus;
      let forwardingConstructConfigurationStatus;
      let oldApplicationName;
      let oldReleaseNumber;
      if (body["registry-office-application"] != undefined) {
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

        let httpsAddress = body["https-address"];
        let httpsPort = body["https-port"];

        oldApplicationName = body["preceding-application-name"];
        oldReleaseNumber = body["preceding-release-number"];

        /****************************************************************************************
         * Prepare logicalTerminationPointConfigurationInput object to
         * configure logical-termination-point
         ****************************************************************************************/
        // update the registryOffice configuration
        const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('PromptForRegisteringCausesRegistrationRequest');
        if (appNameAndUuidFromForwarding?.applicationName !== registryOfficeApplicationName) {
          reject(new Error(`The registry-office-application ${registryOfficeApplicationName} was not found.`));
          return;
        }
        let operationNamesByAttributes = new Map();
        operationNamesByAttributes.set("registration-operation", registryOfficeRegisterOperation);

        let tcpObjectList = [];
        let tcpObject = formulateTcpObject(registryOfficeProtocol, registryOfficeAddress, registryOfficePort);
        tcpObjectList.push(tcpObject);

        let logicalTerminatinPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
          registryOfficeApplicationName,
          registryOfficeReleaseNumber,
          tcpObjectList,
          operationServerName,
          operationNamesByAttributes,
          basicServicesOperationsMapping.basicServicesOperationsMapping
        );

        logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
          logicalTerminatinPointConfigurationInput
        );

        // update tcp-server configuration if required
        let tcpServerWithHttpUpdated = await updateTcpServerDetails("HTTP", httpAddress, httpPort);
        if (tcpServerWithHttpUpdated.istcpServerUpdated) {
          let configurationStatus = new ConfigurationStatus(tcpServerWithHttpUpdated.tcpServerUuid, '', tcpServerWithHttpUpdated.istcpServerUpdated);
          let tcpClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.tcpClientConfigurationStatusList;
          tcpClientConfigurationStatusList.push(configurationStatus);
        }

        let tcpServerWithHttpsUpdated = await updateTcpServerDetails("HTTPS", httpsAddress, httpsPort);
        if (tcpServerWithHttpsUpdated.istcpServerUpdated) {
          let configurationStatus = new ConfigurationStatus(tcpServerWithHttpUpdated.tcpServerUuid, '', tcpServerWithHttpUpdated.istcpServerUpdated);
          let tcpClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.tcpClientConfigurationStatusList;
          tcpClientConfigurationStatusList.push(configurationStatus);
        }

        // update old release configuration
        let isOldApplicationIsUpdated = false;
        let httpUuidOfOldApplication;

        if (oldApplicationName != undefined || oldReleaseNumber != undefined) {
          let oldApplicationForwardingTag = "PromptForEmbeddingCausesRequestForBequeathingData";
          let oldApplicationApplicationNameAndHttpClientLtpUuid = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName(oldApplicationForwardingTag);
          httpUuidOfOldApplication = oldApplicationApplicationNameAndHttpClientLtpUuid.httpClientLtpUuid;

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
              let tcpClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.tcpClientConfigurationStatusList;
              tcpClientConfigurationStatusList.push(configurationStatus);
            }
          }
        }


        /****************************************************************************************
         * Prepare attributes to configure forwarding-construct
         ****************************************************************************************/

        let forwardingConfigurationInputList = [];
        let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

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
      } else {
        customerJourney = traceIndicator;
        traceIndicator = xCorrelator;
        xCorrelator = originator;
        user = body;
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.registerYourself(
        logicalTerminationPointconfigurationStatus,
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Starts application in generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns genericRepresentation
 **/
exports.startApplicationInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = await genericRepresentation.getConsequentActionList(operationServerName);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = await genericRepresentation.getResponseValueList(operationServerName);

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
    } catch (error) {
      console.log(error);
    }

    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Allows updating connection data of a serving application
 *
 * body V1_updateclient_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.updateClient = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * get request body
       ****************************************************************************************/
      let applicationName
      let releaseNumber
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

      let tcpObjectList = [];
      let tcpObject = formulateTcpObject(futureProtocol, futureAddress, futurePort);
      tcpObjectList.push(tcpObject);

      let httpClientUuidOfnewApplication = await httpClientInterface.getHttpClientUuidAsync(futureApplicationName, futureReleaseNumber);
      let httpClientUuidOfcurrentApplication = await httpClientInterface.getHttpClientUuidAsync(currentApplicationName, currentReleaseNumber);

      let logicalTerminationPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
        futureApplicationName,
        futureReleaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        basicServicesOperationsMapping.basicServicesOperationsMapping
      );

      let logicalTerminationPointConfigurationStatus
      
        if (!httpClientUuidOfnewApplication) {
          applicationName = await httpClientInterface.setApplicationNameAsync(httpClientUuidOfcurrentApplication, futureApplicationName)
          releaseNumber = await httpClientInterface.setReleaseNumberAsync(httpClientUuidOfcurrentApplication, futureReleaseNumber);
        }
        logicalTerminationPointConfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
          logicalTerminationPointConfigurationInput
        );
      

      /*******************************************************************************************************
       * bussiness logic to transfer the operation-client instances from current-release to future-release
       *******************************************************************************************************/

      let httpClientUuidOfOldApplication = await httpClientInterface.getHttpClientUuidAsync(currentApplicationName, currentReleaseNumber);
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
        logicalTerminationPointConfigurationStatus, undefined,
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

      resolve();

    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      reject();
    }
  });
}


/**
 * Allows updating operation clients to redirect to backward compatible services
 *
 * body V1_updateoperationclient_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.updateOperationClient = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * get request body
       ****************************************************************************************/
      let applicationName = body["application-name"];
      let releaseNumber = body["release-number"];
      let oldOperationName = body["old-operation-name"];
      let newOperationName = body["new-operation-name"];

      /****************************************************************************************
       * perform bussiness logic
       ****************************************************************************************/
      let isUpdated;
      let operationClientUuid
      let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, releaseNumber);
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
          [configurationStatus]
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
      resolve();

    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      reject();
    }
  });
}


/**
 * Allows updating operation key at a server or client
 *
 * body V1_updateoperationkey_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.updateOperationKey = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * get request body
       ****************************************************************************************/
      let operationUuid = body["operation-uuid"];
      let newOperationKey = body["new-operation-key"];

      /****************************************************************************************
       * perform bussiness logic
       ****************************************************************************************/
      let isUpdated;
      if (operationServerInterface.isOperationServer(operationUuid)) {
        let OldoperationKey = await operationServerInterface.getOperationKeyAsync(operationUuid)
        if (OldoperationKey != undefined) {
          if (newOperationKey != OldoperationKey) {
            isUpdated = await operationServerInterface.setOperationKeyAsync(operationUuid, newOperationKey);
          }
        } else {
          reject(new BadRequestHttpException("OperationServerUuid is not present"))
        }
      } else if (operationClientInterface.isOperationClient(operationUuid)) {
        let OldoperationKey = await operationClientInterface.getOperationKeyAsync(operationUuid)
        if (OldoperationKey != undefined) {
          if (newOperationKey != OldoperationKey) {
            isUpdated = await operationClientInterface.setOperationKeyAsync(operationUuid, newOperationKey);
          }
        } else {
          reject(new BadRequestHttpException("OperationClientUuid is not present"))
        }
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/

      resolve();

    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      reject();
    }
  });
}

async function resolveApplicationNameAndHttpClientLtpUuidFromForwardingName(forwardingName) {
  const forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName);
  if (forwardingConstruct === undefined) {
    return null;
  }

  let fcPortOutputDirectionLogicalTerminationPointList = [];
  const fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
  for (const fcPort of fcPortList) {
    const portDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
    if (FcPort.portDirectionEnum.OUTPUT === portDirection) {
      fcPortOutputDirectionLogicalTerminationPointList.push(fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]);
    }
  }

  if (fcPortOutputDirectionLogicalTerminationPointList.length !== 1) {
    return null;
  }

  const opLtpUuid = fcPortOutputDirectionLogicalTerminationPointList[0];
  const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(opLtpUuid);
  const httpClientLtpUuid = httpLtpUuidList[0];
  const applicationName = await httpClientInterface.getApplicationNameAsync(httpClientLtpUuid);
  return applicationName === undefined ? {
    applicationName: null,
    httpClientLtpUuid
  } : {
    applicationName,
    httpClientLtpUuid
  };
}

/**
 * @description This function helps to formulate the tcpClient object in the format { protocol : "" , address : "" , port : ""}
 * @return {Promise} return the formulated tcpClientObject
 **/
function formulateTcpObject(protocol, address, port) {
  let tcpInfoObject;
  try {
    tcpInfoObject = {
      "protocol": protocol,
      "address": address,
      "port": port
    };
  } catch (error) {
    console.log("error in formulating tcp object");
  }
  return tcpInfoObject;
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
