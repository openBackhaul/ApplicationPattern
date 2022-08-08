/**
 * @file This class provides functionality to create a http request header.
 **/

'use strict';
/** 
 * This class provides functionality to create a http request header.
 */
var RandExp = require('randexp');
class RequestHeader {

    user;
    originator;
    xCorrelator;
    traceIndicator;
    customerJourney;
    operationKey;
    contentType = "application/json";

    /**
     * constructor 
     * @param {String} user User identifier from the system starting the service call. If not available , 
     * originator value will be copied to this attribute.
     * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses.
     * @param {String} traceIndicator Sequence of request numbers along the flow, if it is empty , set it to 1.
     * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies.
     * @param {String} operationKey operation key to access the service in the client application.
     */
     constructor(user, originator, xCorrelator, traceIndicator, customerJourney, operationKey) {
        this.originator = originator;
        this.user = user;
        if (user == undefined || user.length == 0) {
            this.user = originator;
        }
        this.xCorrelator = xCorrelator;
        if (xCorrelator == undefined || xCorrelator.length == 0) {
            this.xCorrelator = RequestHeader.xCorrelatorGenerator();
        }
        this.traceIndicator = traceIndicator;
        if (traceIndicator == undefined || traceIndicator.length == 0) {
            this.traceIndicator = 1;
        }
        this.customerJourney = customerJourney;
        if (customerJourney == undefined || customerJourney.length == 0) {
            this.customerJourney = 1;
        }
        if (operationKey != undefined && operationKey.length > 0) {
            this.operationKey = operationKey;
        }
    }

    static xCorrelatorGenerator() {
        let randomXCorrelatorString;
        try {
            randomXCorrelatorString = new RandExp(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/).gen();
        } catch (error) {
            console.log("error");
            console.log(error);
        }
        return randomXCorrelatorString;
    }

}

module.exports = RequestHeader;