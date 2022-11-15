'use strict';

const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LogicalTerminatinPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServices');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
const layerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const prepareForwardingConfiguration = require('./services/PrepareForwardingConfiguration');
const prepareForwardingAutomation = require('./services/PrepareForwardingAutomation');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');

const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const consequentAction = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ResponseValue');

const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');

const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

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
      let applicationAddress = body["registry-office-address"];
      let applicationPort = body["registry-office-port"];
      let deregisterOperation = body["deregistration-operation"];
      let relayOperationUpdateOperation = body["relay-operation-update-operation"];
      let relayServerReplacementOperation = body["relay-server-replacement-operation"];

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        deregisterOperation,
        relayServerReplacementOperation,
        relayOperationUpdateOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
      );


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
       * Prepare logicalTerminatinPointConfigurationInput object to 
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
          if (key === onfAttributes.HTTP_SERVER.RELEASE_NUMBER) {
            applicationInformation['application-release-number'] = value;
          } else {
            applicationInformation[key] = value;
          }
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
exports.informAboutApplicationInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = [];
      let protocol = "http";

      let localAddress = await tcpServerInterface.getLocalAddress();
      let localPort = await tcpServerInterface.getLocalPort();
      let baseUrl = protocol + "://" + localAddress + ":" + localPort

      let controlConstructUuid = await fileOperation.readFromDatabaseAsync(onfPaths.CONTROL_CONSTRUCT_UUID);

      let releaseHistoryOperationServerUuid = controlConstructUuid + "-op-s-2004";
      let releaseHistoryOperationName = await operationServerInterface.getOperationNameAsync(
        releaseHistoryOperationServerUuid);

      let LabelForReleaseHistory = "Release History";
      let requestForReleaseHistory = baseUrl + releaseHistoryOperationName;
      let consequentActionForReleaseHistory = new consequentAction(
        LabelForReleaseHistory,
        requestForReleaseHistory,
        false
      );
      consequentActionList.push(consequentActionForReleaseHistory);

      let LabelForAPIDocumentation = "API Documentation";
      let requestForAPIDocumentation = baseUrl + "/docs";
      let consequentActionForAPIDocumentation = new consequentAction(
        LabelForAPIDocumentation,
        requestForAPIDocumentation,
        true
      );
      consequentActionList.push(consequentActionForAPIDocumentation);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = [];

      let httpServerCapability = await httpServerInterface.getHttpServerCapabilityAsync();

      Object.entries(httpServerCapability).map(entry => {
        let key = onfAttributeFormatter.modifyKebabCaseToLowerCamelCase(entry[0]);
        let value = entry[1];
        if (key != "releaseList") {
          let reponseValue = new responseValue(
            key,
            value,
            typeof value
          );
          responseValueList.push(reponseValue);
        }
      });

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
      reject();
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
exports.informAboutReleaseHistoryInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = [];

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = [];
      let releaseList = await httpServerInterface.getReleaseListAsync();

      for (let i = 0; i < releaseList.length; i++) {

        let release = releaseList[i];

        let releaseNumber = release[onfAttributes.HTTP_SERVER.RELEASE_NUMBER];
        let releaseDate = release[onfAttributes.HTTP_SERVER.RELEASE_DATE];
        let changes = release[onfAttributes.HTTP_SERVER.CHANGES];
        let releaseDateAndChanges = releaseDate + " - " + changes;

        let reponseValue = new responseValue(
          releaseNumber,
          releaseDateAndChanges,
          typeof releaseDateAndChanges
        );

        responseValueList.push(reponseValue);
      }

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
      let applicationAddress = body["oam-approval-address"];
      let applicationPort = body["oam-approval-port"];
      let oamApprovalOperation = body["oam-approval-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('OamRequestCausesInquiryForAuthentication');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The oam-approval-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        oamApprovalOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
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
      let logicalterminationpoint = controlConstruct[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]
     
      for (let i = 0; i < logicalterminationpoint.length; i++) {
        let layerprotocol = logicalterminationpoint[i][onfAttributes.LOGICAL_TERMINATION_POINT.LAYER_PROTOCOL]
        for (let j = 0; j < layerprotocol.length; j++) {
          let operationclientinterfacepac = layerprotocol[j][onfAttributes.LAYER_PROTOCOL.OPERATION_CLIENT_INTERFACE_PAC]
          if (operationclientinterfacepac !== undefined) {
            let detailedloggingison = operationclientinterfacepac[onfAttributes.OPERATION_CLIENT.CONFIGURATION]
            if (detailedloggingison !== undefined) {
              delete detailedloggingison['detailed-logging-is-on'];
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
      let applicationAddress = body["oam-log-address"];
      let applicationPort = body["oam-log-port"];
      let oamLogOperation = body["oam-log-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('OamRequestCausesLoggingRequest');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The oam-log-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        oamLogOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
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
      let applicationAddress = body["service-log-address"];
      let applicationPort = body["service-log-port"];
      let serviceLogOperation = body["service-log-operation"];

      const appNameAndUuidFromForwarding = await resolveApplicationNameAndHttpClientLtpUuidFromForwardingName('ServiceRequestCausesLoggingRequest');
      if (appNameAndUuidFromForwarding?.applicationName !== applicationName) {
        reject(new Error(`The service-log-application ${applicationName} was not found.`));
        return;
      }

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        serviceLogOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
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
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["topology-application"];
      let releaseNumber = body["topology-application-release-number"];
      let applicationAddress = body["topology-application-address"];
      let applicationPort = body["topology-application-port"];
      let applicationUpdateTopologyOperation = body["topology-operation-application-update"];
      let ltpUpdateTopologyOperation = body["topology-operation-ltp-update"];
      let ltpDeletionTopologyOperation = body["topology-operation-ltp-deletion"];
      let fcUpdateTopologyOperation = body["topology-operation-fc-update"];
      let fcPortUpdateTopologyOperation = body["topology-operation-fc-port-update"];
      let fcPortDeletionTopologyOperation = body["topology-operation-fc-port-deletion"];


      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        applicationUpdateTopologyOperation,
        ltpUpdateTopologyOperation,
        ltpDeletionTopologyOperation,
        fcUpdateTopologyOperation,
        fcPortUpdateTopologyOperation,
        fcPortDeletionTopologyOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
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
          applicationUpdateTopologyOperation,
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

      resolve();
    } catch (error) {
      reject(error);
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

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["registry-office-application"];
      let releaseNumber = body["registry-office-application-release-number"];
      let applicationAddress = body["registry-office-address"];
      let applicationPort = body["registry-office-port"];
      let registerOperation = body["registration-operation"];

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        registerOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

      if (operationClientConfigurationStatusList) {
        forwardingConfigurationInputList = await prepareForwardingConfiguration.registerYourself(
          operationClientConfigurationStatusList,
          registerOperation
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
      let forwardingAutomationInputList = await prepareForwardingAutomation.registerYourself(
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
      let applicationName = body["application-name"];
      let oldApplicationReleaseNumber = body["old-application-release-number"];
      let newApplicationReleaseNumber = body["new-application-release-number"];
      let newApplicationAddress = body["new-application-address"];
      let newApplicationPort = body["new-application-port"];

      /****************************************************************************************
       * perform bussiness logic
       ****************************************************************************************/
      let logicalTerminationPointConfigurationStatus;
      let isOldApplicationExists = false;

      let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, oldApplicationReleaseNumber);
      if (httpClientUuid) {
        isOldApplicationExists = true;
      }

      if (isOldApplicationExists) {
        /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

        let operationList = [];
        let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
          applicationName,
          newApplicationReleaseNumber,
          newApplicationAddress,
          newApplicationPort,
          operationList
        );
        logicalTerminationPointConfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationInformationAsync(
          logicalTerminatinPointConfigurationInput
        );
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.updateClient(
        logicalTerminationPointConfigurationStatus, undefined,
        applicationName
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
      let applicationReleaseNumber = body["application-release-number"];
      let oldOperationName = body["old-operation-name"];
      let newOperationName = body["new-operation-name"];

      /****************************************************************************************
       * perform bussiness logic
       ****************************************************************************************/
      let isUpdated;
      let operationClientUuid
      let httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(applicationName, applicationReleaseNumber);
      if (httpClientUuid) {
        operationClientUuid = await operationClientInterface.getOperationClientUuidAsync(httpClientUuid, oldOperationName);
        if (operationClientUuid) {
          if (oldOperationName != newOperationName) {
            isUpdated = await operationClientInterface.setOperationNameAsync(operationClientUuid, newOperationName);
          }
        }
      }

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
      let oldOperationKey = body["old-operation-key"];
      let newOperationKey = body["new-operation-key"];

      /****************************************************************************************
       * perform bussiness logic
       ****************************************************************************************/
      let isUpdated;
      if (operationServerInterface.isOperationServer(operationUuid)) {
        if (oldOperationKey == await operationServerInterface.getOperationKeyAsync(operationUuid)) {
          isUpdated = await operationServerInterface.setOperationKeyAsync(operationUuid, newOperationKey);
        }
      } else if (operationClientInterface.isOperationClient(operationUuid)) {
        if (oldOperationKey == await operationClientInterface.getOperationKeyAsync(operationUuid)) {
          isUpdated = await operationClientInterface.setOperationKeyAsync(operationUuid, newOperationKey);
        }
      }
      let configurationStatus = new ConfigurationStatus(operationUuid, undefined, isUpdated);

      let logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
        [configurationStatus]
      );
      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.updateOperationKey(
        logicalTerminationPointConfigurationStatus,
        undefined
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
  return applicationName === undefined ? { applicationName: null, httpClientLtpUuid } : { applicationName, httpClientLtpUuid };
}