
global.operationKeyNotificationChannel = [];
global.notificationChannelSubscriber = [];
global.isNotificationChannelON = false;


/** 
     * @param {HRTime} timeStampIdentifier an identifier the process that turns ON the notification channel
     * @return {boolean} result whether the notificationChannel is turned ON or not 
     */
exports.turnONNotificationChannel = function(timeStampIdentifier) {
    try {
        if (!global.notificationChannelSubscriber.includes(timeStampIdentifier)) {
            global.notificationChannelSubscriber.push(timeStampIdentifier);
        }
        global.isNotificationChannelON = true;
        console.log("******* Notification channel for Operation key is turned ON ***************");
        return global.isNotificationChannelON;
    } catch (error) {
        return false;
    }
}

/** 
 * @param {HRTime} timeStampAsIdentifier an identifier the process that turns OFF the notification channel
 * @return {boolean} result whether the notificationChannel is turned OFF or not 
 */
exports.turnOFFNotificationChannel = function(timeStampAsIdentifier) {
    try {
        if (global.notificationChannelSubscriber.includes(timeStampAsIdentifier)) {
            global.notificationChannelSubscriber.forEach((element, index) => {
                if (element == timeStampAsIdentifier) {
                    global.notificationChannelSubscriber = global.notificationChannelSubscriber.splice(index, 1);
                }
            });
        }
        if (global.notificationChannelSubscriber.length > 0) {
            global.isNotificationChannelON = false;
            console.log("******* Notification channel for Operation key is turned OFF ***************");
        }
        return !global.isNotificationChannelON;
    } catch (error) {
        return false;
    }
}    

/**
     * function to add notifications to the global operationKeyNotificationChannel
     * @param {String} operationUuid of the operationKey updated instance
     */
exports.addOperationKeyUpdateToNotificationChannel = async function(operationUuid) {
    try {
        if (global.isNotificationChannelON) {
            let operationKeyNotification = {
                "eventTime": new Date(),
                "operationUuid": operationUuid
            };
            console.log("Notification pushed :" + operationKeyNotification.eventTime + "," + operationKeyNotification.operationUuid);
            global.operationKeyNotificationChannel.push(operationKeyNotification);
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * This function waits for a desired time until an operation-key updation is received for a client or server
 * @param {String} operationUuid for which the an operation-key update is monitored 
 * @param {Date} timestampOfCurrentRequest shall be used to monitor whether operation-key is updated after this event's occurance 
 * @param {Integer} waitTime will be the maximum time to wait for an operation-key update in Seconds
 * @returns {promise} boolean that represents an operation-key update
 */
exports.waitUntilOperationKeyIsUpdated = async function(operationUuid, timestampOfCurrentRequest, waitTime) {
    let startTime = process.hrtime();
    console.log("Waiting to receive operation key update for the operationUuid " + operationUuid);
    return await new Promise(resolve => {
        const interval = setInterval(() => {
            let operationKeyUpdated = isOperationKeyUpdated(operationUuid, timestampOfCurrentRequest);
            let waitTimeExceeded = isWaitTimeExceeded(startTime, waitTime);
            if (operationKeyUpdated == true) {
                console.log("Operation key update received for the operationUuid " + operationUuid);
                resolve(true);
                clearInterval(interval);
            } else if (waitTimeExceeded == true) {
                console.log("Waiting time exceeded for receiving operation key for the operationUuid " + operationUuid);
                resolve(false);
                clearInterval(interval);
            }
        }, 100);
    });
}


/**
 * 
 * @param {HRTime} startTime of the process
 * @param {Integer} waitingTime of the process in Seconds
 * @returns 
 */
function isWaitTimeExceeded(startTime, waitingTime) {
    let NanoSecondPerSecond = 1e9;
    let executionTime = process.hrtime(startTime);
    let executionTimeInseconds = (executionTime[0] * NanoSecondPerSecond + executionTime[1]) / NanoSecondPerSecond
    if (executionTimeInseconds >= waitingTime) {
        return true
    } else {
        return false;
    }
}

/**
 * 
 * @param {String} operationUuid uuid of the operation client or server interface
 * @param {HRTime} eventTime of the process
 * @returns 
 */
function isOperationKeyUpdated(operationUuid, eventTime) {
    let result = false;
    console.log(operationUuid + "," + eventTime);
    let oKNotificationChannel = global.operationKeyNotificationChannel;
    oKNotificationChannel.filter((notification) => {
        console.log("*****************************************");
        console.log(notification.operationUuid);
        console.log(operationUuid);
        if (notification.operationUuid == operationUuid && notification.eventTime > eventTime) {
            result = true;
        }
    });
    return result;
}