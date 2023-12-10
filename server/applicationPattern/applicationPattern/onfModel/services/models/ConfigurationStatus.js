/**
 * This class provides a stub for the ConfigurationStatus.  
 * This class provides details about the uuid and its recent configuration status.
 **/
// @ts-check
'use strict';

class ConfigurationStatus {
    uuid;
    localId;
    updated;

    /**
     * constructor 
     * @param {String} uuid : unique identity of the configured entity.
     * @param {String} localId : local-id of the configured entity.
     * @param {Boolean} updated : true if the value is configured
     */
    constructor(uuid, localId, updated) {
        this.uuid = uuid;
        this.localId = localId;
        this.updated = updated;
    }
}

module.exports = ConfigurationStatus;
