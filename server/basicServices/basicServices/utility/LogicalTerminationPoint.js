// @ts-check
'use strict';

const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');

exports.resolveHttpTcpAndOperationClientUuidOfNewRelease = function () {
    return new Promise(async function (resolve, reject) {
        let forwardingName = 'PromptForBequeathingDataCausesTransferOfListOfApplications'
        try {
            let uuidOfHttpandTcpClient = {};
            let forwardConstructName = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName)
            if (forwardConstructName === undefined) {
                return {};
            }
            let forwardConstructUuid = forwardConstructName[onfAttributes.GLOBAL_CLASS.UUID]
            let fcPortOutput = (await ForwardingConstruct.getOutputFcPortsAsync(forwardConstructUuid))[0]
            let operationClientUuid = fcPortOutput[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
            let httpClientUuid = (await LogicalTerminationPoint.getServerLtpListAsync(operationClientUuid))[0];
            let tcpClientUuid = (await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid))[0];
            uuidOfHttpandTcpClient = { httpClientUuid, tcpClientUuid }
            resolve(uuidOfHttpandTcpClient)
        } catch (error) {
            reject(error)
        }
    })
}

/**
* @description This function returns list of registered application information application-name, release-number,
* address, protocol and port.
* @return {Promise} return the list of application information
* <b><u>Procedure :</u></b><br>
* <b>step 1 :</b> Get forwarding-construct based on ForwardingName
* <b>step 2 :</b> Get forwarding-construct UUID
* <b>step 3 :</b> Get fc-port list using forwarding-construct UUID
* <b>step 4 :</b> Fetch http-client-list using logical-termination-point uuid from fc-port
* <b>step 5 :</b> get the application name, release number and server-ltp<br>
* <b>step 6 :</b> get the ipaddress, port and protocol name of each associated tcp-client <br>
**/

exports.getAllApplicationList = async function (forwardingName) {
    let clientApplicationList = [];
    let httpClientUuidList = [];
    let ForwardConstructName = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName)
    let ForwardConstructUuid = ForwardConstructName[onfAttributes.GLOBAL_CLASS.UUID]

    let listofUuid = await ForwardingConstruct.getOutputFcPortsAsync(ForwardConstructUuid)
    for (let i = 0; i < listofUuid.length; i++) {
        let logicalTerminationPointlist = listofUuid[i][onfAttributes.CONTROL_CONSTRUCT.LOGICAL_TERMINATION_POINT]
        let httpClientUuid = await LogicalTerminationPoint.getServerLtpListAsync(logicalTerminationPointlist)
        httpClientUuidList.push(httpClientUuid[0]);
    }
    for (let j = 0; j < httpClientUuidList.length; j++) {
        let httpClientUuid = httpClientUuidList[j];
        let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
        let applicationReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
        let serverLtp = await LogicalTerminationPoint.getServerLtpListAsync(httpClientUuid);
        let tcpClientUuid = serverLtp[0];
        let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
        let applicationPort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
        let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuid);
        let application = {};
        application.applicationName = applicationName,
            application.releaseNumber = applicationReleaseNumber,
            application.protocol = applicationProtocol,
            application.address = applicationAddress,
            application.port = applicationPort,

            clientApplicationList.push(application);
    }
    return clientApplicationList;
}

/**
 * Resolves application name from forwarding name.
 * @param {String} forwardingName
 * @returns {Promise<String|undefined>} application name
 */
exports.resolveApplicationNameFromForwardingAsync = async function (forwardingName) {
    const forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName);
    if (forwardingConstruct === undefined) {
        return undefined;
    }
    const fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
    const roFcPort = fcPortList.find(fcPort =>
        FcPort.portDirectionEnum.OUTPUT === fcPort[onfAttributes.FC_PORT.PORT_DIRECTION]
    );
    const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(roFcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]);
    return await httpClientInterface.getApplicationNameAsync(httpLtpUuidList[0]);
}

/**
 * Resolves registry office application name from forwarding name : "PromptForRegisteringCausesRegistrationRequest".
 * @returns {Promise<String|undefined>} application name
 */
exports.resolveRegistryOfficeApplicationNameFromForwardingAsync = async function () {
    return exports.resolveApplicationNameFromForwardingAsync(
        "PromptForRegisteringCausesRegistrationRequest"
    );
}

exports.getServerApplicationDetail = async function () {
    let isRoApplication = false;
    let tcpserverapplication = await httpServerInterface.getApplicationNameAsync()
    if (tcpserverapplication == "RegistryOffice") {
        isRoApplication = true
    }
    return isRoApplication;
}