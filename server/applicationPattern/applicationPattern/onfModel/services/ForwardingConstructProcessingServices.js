/**
 * @file This class provides a stub for onf core-model.  
 * This class consolidates the technology specific extensions.
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       23.05.2024
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG* 
 **/

'use strict';

const ForwardingDomain = require('../models/ForwardingDomain');
const eventDispatcher = require('../../rest/client/eventDispatcher');
const FcPort = require('../models/FcPort');
// eslint-disable-next-line no-unused-vars
const ForwardingProcessingInput = require('./models/forwardingConstruct/ForwardingProcessingInput');

/**
 * @description This function process a forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {ForwardingProcessingInput} forwardingInputList list of attributes required for processing the RESTCALL
 * @param {String} user user who initiates this request
 * @param {String} xCorrelator flow id of this request
 * @param {String} traceIndicator trace indicator of the request
 * @param {String} customerJourney customer journey of the request
 * @returns {Promise<String>} response
 **/
exports.processForwardingConstructAsync = async function (forwardingProcessingInput, user,
    xCorrelator, traceIndicator, customerJourney) {
    let response;
    let forwardingName = forwardingProcessingInput.forwardingName;
    let attributeList = forwardingProcessingInput.attributeList;
    let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
        forwardingName);
    let fcPortList = forwardingConstruct["fc-port"];
    for (let fcPort of fcPortList) {
        let fcPortDirection = fcPort["port-direction"];
        if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
            let fcPortLogicalTerminationPoint = fcPort["logical-termination-point"];
            response = await eventDispatcher.dispatchEvent(
                fcPortLogicalTerminationPoint,
                attributeList,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney,
                undefined,
                undefined,
                true
            );
        }
    }
    return response;
}