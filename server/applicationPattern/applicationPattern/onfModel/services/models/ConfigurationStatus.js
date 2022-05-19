/**
 * This class provides a stub for the ConfigurationStatus.  
 * This class provides details about the uuid and its recent configuration status.
 **/

'use strict';

class ConfigurationStatus {
    uuid;
    localId;
    updated;

    /**
     * constructor 
     * @param {string} uuid : unique identity of the configured entity.
     * @param {string} localId : local-id of the configured entity.
     * @param {string} updated : true if the value is configured
     */
    constructor(uuid, localId, updated) {
        this.uuid = uuid;
        this.localId = localId;
        this.updated = updated;
    }
    getUuid() {
        return this.uuid;
    }
    getLocalId() {
        return this.localId;
    }
    isUpdated() {
        return updated;
    }
};

module.exports = ConfigurationStatus;