/**
 * @file This class provides a stub for onf core-model.  
 * This class consolidates the technology specific extensions.
 **/

 'use strict';

 const ForwardingConstructConfigurationStatus = require('./models/forwardingConstruct/ConfigurationStatus');
 const ConfigurationStatus = require('./models/ConfigurationStatus');
 const ForwardingDomain = require('../models/ForwardingDomain');
 const ForwardingConstruct = require('../models/ForwardingConstruct');
 const logicalTerminationPoint = require('../models/LogicalTerminationPoint');
 const httpClientInterface = require('../models/layerProtocols/HttpClientInterface');
 const FcPort = require('../models/FcPort');
 const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
 
 /**
  * @description This function configures the forwarding construct based on the provided new operation client information.
  * @param {String} operationServerName : name of the operation server
  * @param {list} forwardingConfigurationInputList : list of the instance forwardingConstruct/ConfigurationInput
  * @return {Promise} object forwardingConstructConfigurationStatus  
  **/
exports.configureForwardingConstructAsync = function (operationServerName, forwardingConstructConfigurationList) {
     return new Promise(async function (resolve, reject) {
         let forwardingConstructConfigurationStatus;
         try {
             let forwardingConstructConfigurationStatusList = [];
             let fcPortConfigurationStatusList = [];
 
             let operationServerUuid = await OperationServerInterface.getOperationServerUuidAsync(operationServerName);
 
             for (let i = 0; i < forwardingConstructConfigurationList.length; i++) {
                 let forwardingConstructConfiguration = forwardingConstructConfigurationList[i];
                 let forwardingName = forwardingConstructConfiguration.forwardingName;
                 let operationClientUuid = forwardingConstructConfiguration.operationClientUuid;
                 let configurationStatus = await configureForwardingConstructOrFCPortAsync(
                     forwardingName,
                     operationClientUuid,
                     operationServerUuid
                 );
                 if (configurationStatus.localId.length > 1) {
                     fcPortConfigurationStatusList.push(configurationStatus);
                 } else {
                     forwardingConstructConfigurationStatusList.push(configurationStatus);
                 }
             }
             forwardingConstructConfigurationStatus = new ForwardingConstructConfigurationStatus(
                 forwardingConstructConfigurationStatusList,
                 fcPortConfigurationStatusList);
             resolve(forwardingConstructConfigurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function configures the forwarding construct based on the provided new operation client information.
  * @param {String} operationServerName : name of the operation server
  * @param {list} forwardingConfigurationInputList : list of the instance forwardingConstruct/ConfigurationInput
  * @return {Promise} object forwardingConstructConfigurationStatus  
  **/
 exports.unConfigureForwardingConstructAsync = function (operationServerName, forwardingConstructConfigurationList, isBarred=false) {
     return new Promise(async function (resolve, reject) {
         let forwardingConstructConfigurationStatus;
         try {
             let forwardingConstructConfigurationStatusList = [];
             let fcPortConfigurationStatusList = [];
 
             let operationServerUuid = await OperationServerInterface.getOperationServerUuidAsync(operationServerName);
 
             for (let i = 0; i < forwardingConstructConfigurationList.length; i++) {
                 let forwardingConstructConfiguration = forwardingConstructConfigurationList[i];
                 let operationClientUuid = forwardingConstructConfiguration.operationClientUuid;
                 let forwardingName = forwardingConstructConfiguration.forwardingName;
                 let configurationStatusList = await configureOrDeleteFCPortAsync(
                     forwardingName,
                     operationClientUuid,
                     operationServerUuid,
                     isBarred
                 );
                 if (configurationStatusList) {
                     for (let j = 0; j < configurationStatusList.length; j++) {
                         let configurationStatus = configurationStatusList[j];
                         if (configurationStatus) {
                             if (configurationStatus.localId.length > 1) {
                                 fcPortConfigurationStatusList.push(configurationStatus);
                             } else {
                                 fcPortConfigurationStatusList.push(configurationStatus);
                             }
                         }
                     }
                 }
             }
             forwardingConstructConfigurationStatus = new ForwardingConstructConfigurationStatus(
                 forwardingConstructConfigurationStatusList,
                 fcPortConfigurationStatusList);
             resolve(forwardingConstructConfigurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function configureForwardingConstructOrFCPortAsync(forwardingName, operationClientUuid, operationServerUuid) {
     return new Promise(async function (resolve, reject) {
         let configurationStatus;
         try {
             let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
                 forwardingName);
             let _isOperationServerIsManangementFcPort = FcPort.isOperationOfFcPortType(
                 forwardingConstruct,
                 operationServerUuid,
                 FcPort.portDirectionEnum.MANAGEMENT
             );
             if (_isOperationServerIsManangementFcPort) {
                 let _isForwardingConstructIsInvariant = isForwardingConstructIsInvariant(
                     forwardingConstruct);
                 if (_isForwardingConstructIsInvariant) {
                     configurationStatus = await updateInvariantFcPortAsync(
                         forwardingConstruct,
                         operationClientUuid
                     );
                 } else {
                     configurationStatus = await updateFcPortAsync(
                         forwardingConstruct,
                         operationClientUuid
                     );
                     if(configurationStatus.updated == false) {
                         configurationStatus = await addFcPortAsync(
                             forwardingConstruct,
                             operationClientUuid
                         );
                     }
                 }
             }
             resolve(configurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function configureOrDeleteFCPortAsync(forwardingName, operationClientUuid, operationServerUuid, isBarred) {
     return new Promise(async function (resolve, reject) {
         let configurationStatusList = [];
         try {
             let forwardingConstructList = await ForwardingDomain.getForwardingConstructListForTheFcPortAsync(
                 operationServerUuid,
                 FcPort.portDirectionEnum.MANAGEMENT);
             if(isBarred){
                let forwardingConstructListForBarredApplication = await ForwardingDomain.getForwardingConstructListForTheFcPortAsync(
                    operationClientUuid,
                    FcPort.portDirectionEnum.OUTPUT 
                )
                forwardingConstructList.push.apply(forwardingConstructList,forwardingConstructListForBarredApplication);
             }  
             for (let i = 0; i < forwardingConstructList.length; i++) {
                 let configurationStatus;
                 let forwardingConstruct = forwardingConstructList[i];
                 if (!forwardingName || isForwardingConstructNameMatches(forwardingConstruct, forwardingName)) {
                     let _isOperationClientIsOutputFcPort = FcPort.isOperationOfFcPortType(
                         forwardingConstruct,
                         operationClientUuid,
                         FcPort.portDirectionEnum.OUTPUT
                     );
                     if (_isOperationClientIsOutputFcPort) {
                         let _isForwardingConstructIsInvariant = isForwardingConstructIsInvariant(
                             forwardingConstruct);
                         if (_isForwardingConstructIsInvariant) {
                             configurationStatus = await updateInvariantFcPortAsync(
                                 forwardingConstruct,
                                 "-1"
                             );
                         } else {
                             configurationStatus = await deleteFcPortAsync(
                                 forwardingConstruct,
                                 operationClientUuid
                             );
                         }
                         configurationStatusList.push(configurationStatus);
                     }
                 }
             }
             resolve(configurationStatusList);
         } catch (error) {
             reject(error);
         }
     });
 }
 

 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function isForwardingConstructIsInvariant(forwardingConstruct) {
     let isForwardingConstructIsInvariant = false;
     let nameList = forwardingConstruct["name"];
     for (let i = 0; i < nameList.length; i++) {
         let valueName = getValueFromKey(nameList, "ForwardingKind");
         if (valueName == ForwardingConstruct.forwardingConstructKindEnum.INVARIANT_PROCESS_SNIPPET) {
             isForwardingConstructIsInvariant = true;
         }
     }
     return isForwardingConstructIsInvariant;
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function isForwardingConstructNameMatches(forwardingConstruct, forwardingConstructName) {
     let isForwardingConstructNameMatches = false;
     let nameList = forwardingConstruct["name"];
     for (let i = 0; i < nameList.length; i++) {
         let valueName = getValueFromKey(nameList, "ForwardingName");
         if (valueName == forwardingConstructName) {
             isForwardingConstructNameMatches = true;
         }
     }
     return isForwardingConstructNameMatches;
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function addFcPortAsync(forwardingConstruct, operationClientUuid) {
     return new Promise(async function (resolve, reject) {
         let configurationStatus;
         try {
             let updated = false;
             let forwardingConstructUuid = forwardingConstruct["uuid"];
             let isFcPortExists = ForwardingConstruct.isFcPortExists(
                 forwardingConstruct,
                 operationClientUuid
             );
             if (!isFcPortExists) {
                 let nextFcPortLocalId = FcPort.generateNextLocalId(forwardingConstruct);
                 let fcPort = new FcPort(
                     nextFcPortLocalId,
                     FcPort.portDirectionEnum.OUTPUT,
                     operationClientUuid
                 );
                 updated = await ForwardingConstruct.addFcPortAsync(
                     forwardingConstructUuid,
                     fcPort
                 );
             }
             configurationStatus = new ConfigurationStatus(
                 forwardingConstructUuid,
                 '',
                 updated
             );
             resolve(configurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function deleteFcPortAsync(forwardingConstruct, operationClientUuid) {
     return new Promise(async function (resolve, reject) {
         let configurationStatus;
         try {
             let updated = false;
             let forwardingConstructUuid = forwardingConstruct["uuid"];
             let isFcPortExists = ForwardingConstruct.isFcPortExists(
                 forwardingConstruct,
                 operationClientUuid
             );
             if (isFcPortExists) {
                 let fcPortLocalId = FcPort.getLocalId(forwardingConstruct, operationClientUuid);
                 updated = await ForwardingConstruct.deleteFcPortAsync(
                     forwardingConstructUuid,
                     fcPortLocalId
                 );
                 configurationStatus = new ConfigurationStatus(
                     forwardingConstructUuid,
                     fcPortLocalId,
                     updated
                 );
             }
             
             resolve(configurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function updateInvariantFcPortAsync(forwardingConstruct, operationClientUuid) {
     return new Promise(async function (resolve, reject) {
         let configurationStatus;
         try {
             let fcPortLocalId = '';
             let updated = false;
             let forwardingConstructUuid = forwardingConstruct["uuid"];
             let isFcPortExists = ForwardingConstruct.isFcPortExists(
                 forwardingConstruct,
                 operationClientUuid
             );
             if (!isFcPortExists) {
                 fcPortLocalId = getOutputFcPortListInTheForwardingConstruct(
                     forwardingConstruct)[0]["local-id"];
                 updated = await FcPort.setLogicalTerminationPointAsync(
                     forwardingConstructUuid,
                     fcPortLocalId,
                     operationClientUuid
                 );
             }
             configurationStatus = new ConfigurationStatus(forwardingConstructUuid, fcPortLocalId, updated);
             resolve(configurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * @description This function updates the forwarding construct of the output port direction
  *              if forwarding kind is SUBSCRIPTION or PROCESS_SNIPPET.
  * @param {String}   operationClientUuid operation client uuid 
  * @param {String}   forwardingConstruct name of the forwarding construct to be updated
  **/
  function updateFcPortAsync(forwardingConstruct, operationClientUuid) {
     return new Promise(async function (resolve, reject) {
         let configurationStatus;
         try {
             let fcPortLocalId = "";
             let updated = false;
             let forwardingConstructUuid = forwardingConstruct["uuid"];
             let applicationName = await getApplicationNameAsync(operationClientUuid);
             let releaseNumber = await getReleaseNumberAsync(operationClientUuid);
             let isFcPortExists = ForwardingConstruct.isFcPortExists(
                 forwardingConstruct,
                 operationClientUuid
             );
             if (!isFcPortExists) {
                 let fcPortLocalIdList = getOutputFcPortListInTheForwardingConstruct(
                     forwardingConstruct);
                 for(let i=0 ; i<fcPortLocalIdList.length ; i++) {
                     let operationClientUuidOfOutputFcPort = fcPortLocalIdList[i]["logical-termination-point"];
                     let applicationNameOfOutputFcPort = await getApplicationNameAsync(operationClientUuidOfOutputFcPort); 
                     let releaseNumberOfOutputFcPort = await getReleaseNumberAsync(operationClientUuidOfOutputFcPort);  
                     if(applicationName === applicationNameOfOutputFcPort && releaseNumber === releaseNumberOfOutputFcPort) {
                         fcPortLocalId = fcPortLocalIdList[i]["local-id"];
                     }
                 } 
                 if (fcPortLocalId != "") {
                     updated = await FcPort.setLogicalTerminationPointAsync(
                         forwardingConstructUuid,
                         fcPortLocalId,
                         operationClientUuid
                     );
                 }   
             }
             configurationStatus = new ConfigurationStatus(forwardingConstructUuid, fcPortLocalId, updated);
             resolve(configurationStatus);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 function getOutputFcPortListInTheForwardingConstruct(forwardingConstruct) {
     let outputFcPortList = [];
     let fcPortList = forwardingConstruct["fc-port"];
     for (let i = 0; i < fcPortList.length; i++) {
         let fcPort = fcPortList[i];
         let fcPortDirection = fcPort["port-direction"];
         if (fcPortDirection == "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT") {
             outputFcPortList.push(fcPort);
         }
     }
     return outputFcPortList;
 }
 
 /**
  * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
  * @param {String} operationServerUuid operation server uuid of the request url
  * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
  * @param {String} user user who initiates this request
  * @param {string} originator originator of the request
  * @param {string} xCorrelator flow id of this request
  * @param {string} traceIndicator trace indicator of the request
  * @param {string} customerJourney customer journey of the request
  **/
 function getValueFromKey(nameList, key) {
     for (let i = 0; i < nameList.length; i++) {
         let valueName = nameList[i]["value-name"];
         if (valueName == key) {
             return nameList[i]["value"];
         }
     }
     return undefined;
 }
 
 /**
  * @description This function gets the application name of given operation client uuid
  * @param {String} operationClientUuid operation client uuid 
  **/
 function getApplicationNameAsync(operationClientUuid) {
     return new Promise(async function (resolve, reject) {
      try {   
         let httpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid);
         let httpClientUuid = httpClientUuidList[0];
         let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
         resolve(applicationName);
      } catch(error) {
         reject(error);
      }    
     });
 }

 /**
  * @description This function gets the application name of given operation client uuid
  * @param {String} operationClientUuid operation client uuid 
  **/
 function getReleaseNumberAsync(operationClientUuid) {
    return new Promise(async function (resolve, reject) {
     try {   
        let httpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid);
        let httpClientUuid = httpClientUuidList[0];
        let releaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
        resolve(releaseNumber);
     } catch(error) {
        reject(error);
     }    
    });
}
