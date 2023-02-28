exports.getDataUpdatePeriodEnum = function (fieldName, responseInstanceValue) {
    return new Promise(async function (resolve, reject) {
        try {
            let fieldNameDataUpdatePeriod = "dataUpdatePeriod"
            let dataUpdatePeriodEnum = {
                "real-time": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
                "1h-period" : "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_1H_PERIOD",
                "24h-period" : "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_24H_PERIOD",
                "manual" : "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_MANUAL"
            };
            if(fieldName['static-field-name'] == fieldNameDataUpdatePeriod){
                for (let dataUpdatePeriodKey in dataUpdatePeriodEnum) {
                    if (dataUpdatePeriodEnum[dataUpdatePeriodKey] == responseInstanceValue) {
                        responseInstanceValue = dataUpdatePeriodKey;
                    }
                }
                
            resolve(responseInstanceValue);
            }
        } catch (error) {
            reject(error);
        }
    });
}