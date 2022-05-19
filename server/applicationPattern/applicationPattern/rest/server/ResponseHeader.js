/**
 * @file This class provides functionality to create a http response header.
 **/

'use strict';

const operationServerInterface = require('../../onfModel/models/layerProtocols/OperationServerInterface');
/** 
 * This class provides functionality to create a http response header.
 */
var RandExp = require('randexp');
class ResponseHeader {

    contentType = 'application/json';
    xCorrelator;
    execTime;
    backendTime;
    lifeCycleState;

    /**
     * constructor 
     * @param {String} xCorrelator User identifier from the system starting the service call. If not available , originator value will be copied to this attribute.
     * @param {String} execTime Identification for the system consuming the API , name of the current application.
     * @param {String} backendTime UUID for the service execution flow that allows to correlate requests and responses.
     * @param {String} lifeCycleState Sequence of request numbers along the flow, if it is empty , set it to 1.
     * 
     */
    constructor(xCorrelator, startTime, lifeCycleState) {
        this.xCorrelator = xCorrelator;
        if (xCorrelator == undefined || xCorrelator.length == 0) {
            this.xCorrelator = ResponseHeader.xCorrelatorGenerator();
        }
        this.execTime = ResponseHeader.executionTimeInMilliseconds(startTime);
        this.backendTime = this.execTime;
        this.lifeCycleState = lifeCycleState;
    }

    static xCorrelatorGenerator() {
        let randomXCorrelatorString;
        try {
            randomXCorrelatorString = new RandExp(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/).gen();
        } catch (error) {
            console.log(error);
        }
        return randomXCorrelatorString;
    }

    static executionTimeInMilliseconds(start) {
        let executionTimeInMilliseconds;
        try {
            let NanoSecondPerSecond = 1e9
            let NanoSecondToMilliSecond = 1e6
            let executionTime = process.hrtime(start)
            executionTimeInMilliseconds = (executionTime[0] * NanoSecondPerSecond + executionTime[1]) / NanoSecondToMilliSecond
        } catch (error) {
            console.log(error);
        }
        return executionTimeInMilliseconds;
    }

    static createResponseHeader(xCorrelator, startTime, operationName) {
        return new Promise(async function (resolve,reject){
            let responseHeader;
        try {
            let operationServerUuid = await operationServerInterface.getOperationServerUuidAsync(operationName);
            let lifeCycleState = await operationServerInterface.getLifeCycleState(operationServerUuid);
            responseHeader = new ResponseHeader(xCorrelator, startTime, lifeCycleState);
        } catch (error) {
            console.log(error);
        }
        resolve(responseHeader);
        });        
    }
}

module.exports = ResponseHeader;