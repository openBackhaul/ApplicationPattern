/**
 * The file consists of the ONF core-model attributes.
 *  
 **/

/******************************************
 ********global nd local class*************
 *****************************************/

const GLOBAL_CLASS = {
    UUID: "uuid"
};

const LOCAL_CLASS = {
    LOCAL_ID: "local-id"
};

const NAME = {
    VALUE_NAME: "value-name",
    VALUE: "value"
};

/******************************************
 ********control-construct****************
 *****************************************/

const CONTROL_CONSTRUCT = {
    PROFILE_COLLECTION: "profile-collection",
    LOGICAL_TERMINATION_POINT: "logical-termination-point",
    FORWARDING_DOMAIN: "forwarding-domain"
};

/******************************************
 ********Profile-collection****************
 *****************************************/

const PROFILE_COLLECTION = {
    PROFILE: "profile"
};

const PROFILE = {
    PROFILE_NAME: "profile-name"
};

const APPLICATION_PROFILE = {
    PAC: "application-profile-1-0:application-profile-pac",
    CAPABILITY: "application-profile-capability",
    CONFIGURATION: "application-profile-configuration",
    APPLICATION_NAME: "application-name",
    RELEASE_NUMBER: "release-number",
    APPROVAL_STATUS: "approval-status"
};

const ADMIN_PROFILE = {
    PAC: "admin-profile-1-0:admin-profile-pac",
    CAPABILITY: "admin-profile-capability",
    CONFIGURATION: "admin-profile-configuration",
    ADMINISTRATOR_NAME: "administrator-name",
    USER_NAME: "user-name",
    AUTHORIZATION: "Authorization",
    ALLOWED_METHODS: "allowed-methods"
};

const ACTION_PROFILE = {
    PAC: "action-profile-1-0:action-profile-pac",
    CAPABILITY: "action-profile-capability",
    CONFIGURATION: "action-profile-configuration",
    OPERATION_NAME: "operation-name",
    LABEL: "label",
    INPUT_VALUE_LIST: "input-value-list",
    DISPLAY_IN_NEW_BROWSER_WINDOW: "display-in-new-browser-window",
    CONSEQUENT_OPERATION_REFERENCE: "consequent-operation-reference"
};

const FILE_PROFILE = {
    PAC: "file-profile-1-0:file-profile-pac",
    CAPABILITY: "file-profile-capability",
    CONFIGURATION: "file-profile-configuration",
    FILE_IDENTIFIER: "file-identifier",
    FILE_DESCRIPTION: "file-description",
    FILE_PATH: "file-path",
    USER_NAME: "user-name",
    PASSWORD: "password",
    OPERATION: "operation"
};

const INTEGER_PROFILE = {
    PAC: "integer-profile-1-0:integer-profile-pac",
    CAPABILITY: "integer-profile-capability",
    CONFIGURATION: "integer-profile-configuration",
    INTEGER_NAME: "integer-name",
    UNIT: "unit",
    MINIMUM: "minimum",
    MAXIMUM: "maximum",
    INTEGER_VALUE: "integer-value"
};

const SERVICE_RECORD_PROFILE = {
    PAC: "service-record-profile-1-0:service-record-profile-pac",
    CAPABILITY: "service-record-profile-capability",
    XCORRELATOR: "x-correlator",
    TRACE_INDICATOR: "trace-indicator",
    USER: "user",
    ORIGINATOR: "originator",
    APPLICATION_NAME: "application-name",
    OPERATION_NAME: "operation-name",
    RESPONSE_CODE: "response-code",
    TIMESTAMP: "timestamp",
    STRINGIFIED_BODY: "stringified-body",
    STRINGIFIED_RESPONSE: "stringified-response"
};

const OAM_RECORD_PROFILE = {
    PAC: "oam-record-profile-1-0:oam-record-profile-pac",
    CAPABILITY: "oam-record-profile-capability",
    CONFIGURATION: "application-profile-configuration",
    METHOD_TYPE: "oam-record-profile-1-0:METHOD_TYPE_",
    APPLICATION_NAME: "application-name",
    RELEASE_NUMBER: "release-number",
    METHOD: "method",
    RESOURCE: "resource",
    STRINGIFIED_BODY: "stringified-body",
    RESPONSE_CODE: "response-code",
    USER_NAME: "user-name",
    TIMESTAMP: "timestamp"
};

const RESPONSE_PROFILE = {
    PAC: "response-profile-1-0:response-profile-pac",
    CAPABILITY: "response-profile-capability",
    CONFIGURATION: "response-profile-configuration",
    OPERATION_NAME: "operation-name",
    FIELD_NAME: "field-name",
    FIELD_NAME_REFERENCE: "field-name-reference",
    DESCRIPTION: "description",
    DATATYPE: "datatype",
    VALUE: "value",
    VALUE_REFERENCE: "value-reference",
    STATIC_VALUE: "static-value",
    STATIC_FIELD_NAME: "static-field-name"
}

/******************************************
 ********logical-termination-point*********
 *****************************************/

const LOGICAL_TERMINATION_POINT = {
    LAYER_PROTOCOL: "layer-protocol",
    LTP_DIRECTION: "ltp-direction",
    CLIENT_LTP: "client-ltp",
    SERVER_LTP: "server-ltp"
};

const LAYER_PROTOCOL = {
    LAYER_PROTOCOL_NAME: "layer-protocol-name",
    OPERATION_SERVER_INTERFACE_PAC: "operation-server-interface-1-0:operation-server-interface-pac",
    HTTP_SERVER_INTERFACE_PAC: "http-server-interface-1-0:http-server-interface-pac",
    TCP_SERVER_INTERFACE_PAC: "tcp-server-interface-1-0:tcp-server-interface-pac",
    OPERATION_CLIENT_INTERFACE_PAC: "operation-client-interface-1-0:operation-client-interface-pac",
    HTTP_CLIENT_INTERFACE_PAC: "http-client-interface-1-0:http-client-interface-pac",
    TCP_CLIENT_INTERFACE_PAC: "tcp-client-interface-1-0:tcp-client-interface-pac",
    ES_CLIENT_INTERFACE_PAC: "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac"
};

const HTTP_SERVER = {
    CAPABILITY: "http-server-interface-capability",
    CONFIGURATION: "http-server-interface-configuration",
    APPLICATION_NAME: "application-name",
    RELEASE_NUMBER: "release-number",
    RELEASE_DATE: "release-date",
    RELEASE_LIST: "release-list",
    DATA_UPDATE_PERIOD: "data-update-period",
    CHANGES: "changes"
};

const HTTP_CLIENT = {
    CAPABILITY: "http-client-interface-capability",
    CONFIGURATION: "http-client-interface-configuration",
    APPLICATION_NAME: "application-name",
    RELEASE_NUMBER: "release-number"
};

const OPERATION_SERVER = {
    CAPABILITY: "operation-server-interface-capability",
    CONFIGURATION: "operation-server-interface-configuration",
    OPERATION_NAME: "operation-name",
    LIFE_CYCLE_STATE: "life-cycle-state",
    OPERATION_KEY: "operation-key"
};

const OPERATION_CLIENT = {
    CAPABILITY: "operation-client-interface-capability",
    CONFIGURATION: "operation-client-interface-configuration",
    OPERATION_NAME: "operation-name",
    LIFE_CYCLE_STATE: "life-cycle-state",
    OPERATION_KEY: "operation-key",
    OPERATIONAL_STATE: "operational-state"
};

const TCP_SERVER = {
    CAPABILITY: "tcp-server-interface-capability",
    CONFIGURATION: "tcp-server-interface-configuration",
    IPV_4_ADDRESS: "ipv-4-address",
    IP_ADDRESS: "ip-address",
    DOMAIN_NAME: "domain-name",
    LOCAL_PORT: "local-port"
};

const TCP_CLIENT = {
    CAPABILITY: "tcp-client-interface-capability",
    CONFIGURATION: "tcp-client-interface-configuration",
    REMOTE_ADDRESS: "remote-address",
    IP_ADDRESS: "ip-address",
    IPV_4_ADDRESS: "ipv-4-address",
    DOMAIN_NAME: "domain-name",
    REMOTE_PORT: "remote-port",
    REMOTE_PROTOCOL: "remote-protocol"
}

const ES_CLIENT = {
    CONFIGURATION: "elasticsearch-client-interface-configuration",
    AUTH: "auth",
    API_KEY: "api-key",
    INDEX_ALIAS: "index-alias"
}

/******************************************
 ********forwarding-domain**************
 *****************************************/

const FORWARDING_DOMAIN = {
    FORWARDING_CONSTRUCT: "forwarding-construct"
};

const FORWARDING_CONSTRUCT = {
    NAME: "name",
    FC_PORT: "fc-port"
};

const FC_PORT = {
    PORT_DIRECTION: "port-direction",
    LOGICAL_TERMINATION_POINT: "logical-termination-point"
};

module.exports = {
    GLOBAL_CLASS,
    LOCAL_CLASS,
    NAME,
    CONTROL_CONSTRUCT,
    PROFILE_COLLECTION,
    PROFILE,
    APPLICATION_PROFILE,
    ADMIN_PROFILE,
    ACTION_PROFILE,
    FILE_PROFILE,
    INTEGER_PROFILE,
    SERVICE_RECORD_PROFILE,
    OAM_RECORD_PROFILE,
    RESPONSE_PROFILE,
    LOGICAL_TERMINATION_POINT,
    LAYER_PROTOCOL,
    HTTP_SERVER,
    HTTP_CLIENT,
    ES_CLIENT,
    OPERATION_SERVER,
    OPERATION_CLIENT,
    TCP_SERVER,
    TCP_CLIENT,
    FORWARDING_DOMAIN,
    FORWARDING_CONSTRUCT,
    FC_PORT
}