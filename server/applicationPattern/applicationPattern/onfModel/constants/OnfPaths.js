/**
 * The file consists of the ONF paths to identify resources in the model.
 * For list attributes the keys mentioned within flower brackets {} should be replaced with appropriate values
 * 
 **/

/******************************************
 ********control-construct****************
 *****************************************/

const CONTROL_CONSTRUCT = "/core-model-1-4:control-construct"
const CONTROL_CONSTRUCT_UUID = CONTROL_CONSTRUCT + "/uuid";

/******************************************
 ********Profile-collection****************
 *****************************************/

const PROFILE_COLLECTION = CONTROL_CONSTRUCT + "/profile-collection";
const PROFILE = PROFILE_COLLECTION + "/profile";

const APPLICATION_PROFILE_PAC = PROFILE + "={profileUuid}/application-profile-1-0:application-profile-pac";
const APPLICATION_PROFILE_CONFIGURATION = APPLICATION_PROFILE_PAC + "/application-profile-configuration";
const APPLICATION_PROFILE_APPROVAL_STATUS = APPLICATION_PROFILE_CONFIGURATION + "/approval-status";

const RESPONSE_PROFILE_PAC = PROFILE + "={profileUuid}/response-profile-1-0:response-profile-pac";
const RESPONSE_PROFILE_CONFIGURATION = RESPONSE_PROFILE_PAC + "/response-profile-configuration";
const RESPONSE_PROFILE_VALUE_REFERENCE = RESPONSE_PROFILE_CONFIGURATION + "/value/value-reference";

const ACTION_PROFILE_PAC = PROFILE + "={profileUuid}/action-profile-1-0:action-profile-pac";
const ACTION_PROFILE_CONFIGURATION = ACTION_PROFILE_PAC + "/action-profile-configuration";
const ACTION_PROFILE_CONSEQUENT_OPERATION_REFERENCE = ACTION_PROFILE_CONFIGURATION + "/consequent-operation-reference";

const FILE_PROFILE_PAC = PROFILE + "={profileUuid}/file-profile-1-0:file-profile-pac";
const FILE_PROFILE_CONFIGURATION = FILE_PROFILE_PAC + "/file-profile-configuration";
const FILE_PROFILE_FILE_PATH = FILE_PROFILE_CONFIGURATION + "/file-path";
const FILE_PROFILE_USER_NAME = FILE_PROFILE_CONFIGURATION + "/user-name";
const FILE_PROFILE_PASSWORD = FILE_PROFILE_CONFIGURATION + "/password";
const FILE_PROFILE_OPERATION = FILE_PROFILE_CONFIGURATION + "/operation";


/******************************************
 ********logical-termination-point*********
 *****************************************/

const LOGICAL_TERMINATION_POINT = CONTROL_CONSTRUCT + "/logical-termination-point";
const LOGICAL_TERMINATION_POINT_UUID = LOGICAL_TERMINATION_POINT + "={uuid}/uuid";
const LAYER_PROTOCOL = LOGICAL_TERMINATION_POINT + "={uuid}/layer-protocol=0";
const CLIENT_LTP = LOGICAL_TERMINATION_POINT + "={uuid}/client-ltp";
const SERVER_LTP = LOGICAL_TERMINATION_POINT + "={uuid}/server-ltp";

const HTTP_CLIENT_INTERFACE_PAC = LAYER_PROTOCOL + "/http-client-interface-1-0:http-client-interface-pac";
const HTTP_CLIENT_INTERFACE_CONFIGURATION = HTTP_CLIENT_INTERFACE_PAC + "/http-client-interface-configuration";
const HTTP_CLIENT_RELEASE_NUMBER = HTTP_CLIENT_INTERFACE_CONFIGURATION + "/release-number";
const HTTP_CLIENT_APPLICATION_NAME = HTTP_CLIENT_INTERFACE_CONFIGURATION + "/application-name";

const OPERATION_SERVER_INTERFACE_PAC = LAYER_PROTOCOL + "/operation-server-interface-1-0:operation-server-interface-pac";
const OPERATION_SERVER_INTERFACE_CONFIGURATION = OPERATION_SERVER_INTERFACE_PAC + "/operation-server-interface-configuration";
const OPERATION_SERVER_OPERATION_KEY = OPERATION_SERVER_INTERFACE_CONFIGURATION + "/operation-key";

const OPERATION_CLIENT_INTERFACE_PAC = LAYER_PROTOCOL + "/operation-client-interface-1-0:operation-client-interface-pac";
const OPERATION_CLIENT_INTERFACE_CONFIGURATION = OPERATION_CLIENT_INTERFACE_PAC + "/operation-client-interface-configuration";
const OPERATION_CLIENT_OPERATION_NAME = OPERATION_CLIENT_INTERFACE_CONFIGURATION + "/operation-name";
const OPERATION_CLIENT_OPERATION_KEY = OPERATION_CLIENT_INTERFACE_CONFIGURATION + "/operation-key";

const TCP_CLIENT_INTERFACE_PAC = LAYER_PROTOCOL + "/tcp-client-interface-1-0:tcp-client-interface-pac";
const TCP_CLIENT_INTERFACE_CONFIGURATION = TCP_CLIENT_INTERFACE_PAC + "/tcp-client-interface-configuration";
const TCP_CLIENT_REMOTE_ADDRESS = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-address/ip-address/ipv-4-address";
const TCP_CLIENT_ADDRESS = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-address";
const TCP_CLIENT_IP_ADDRESS = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-address/ip-address";
const TCP_CLIENT_DOMAIN_NAME = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-address/domain-name";
const TCP_CLIENT_REMOTE_PORT = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-port";
const TCP_CLIENT_REMOTE_PROTOCOL = TCP_CLIENT_INTERFACE_CONFIGURATION + "/remote-protocol";

const TCP_SERVER_INTERFACE_PAC = LAYER_PROTOCOL + "/tcp-server-interface-1-0:tcp-server-interface-pac";
const TCP_SERVER_INTERFACE_CONFIGURATION = TCP_SERVER_INTERFACE_PAC + "/tcp-server-interface-configuration";
const TCP_SERVER_IP_ADDRESS = TCP_SERVER_INTERFACE_CONFIGURATION + "/local-address/ipv-4-address";
const TCP_SERVER_DOMAIN_NAME = TCP_SERVER_INTERFACE_CONFIGURATION + "/local-address/domain-name";
const TCP_SERVER_LOCAL_ADDRESS = TCP_SERVER_INTERFACE_CONFIGURATION + "/local-address";

/******************************************
 ********forwarding-domain**************
 *****************************************/

const FORWARDING_DOMAIN = CONTROL_CONSTRUCT + "/forwarding-domain";
const FORWARDING_CONSTRUCT = FORWARDING_DOMAIN + "={fdUuid}/forwarding-construct";
const FC_PORT = FORWARDING_CONSTRUCT + "={fcUuid}/fc-port";
const FC_PORT_LOGICAL_TERMINATION_POINT = FC_PORT + "={fcPortLocalId}/logical-termination-point";

module.exports = {
    CONTROL_CONSTRUCT,
    CONTROL_CONSTRUCT_UUID,
    PROFILE_COLLECTION,
    PROFILE,
    APPLICATION_PROFILE_PAC,
    APPLICATION_PROFILE_CONFIGURATION,
    APPLICATION_PROFILE_APPROVAL_STATUS,
    RESPONSE_PROFILE_VALUE_REFERENCE,
    ACTION_PROFILE_PAC,
    ACTION_PROFILE_CONFIGURATION,
    ACTION_PROFILE_CONSEQUENT_OPERATION_REFERENCE,
    FILE_PROFILE_PAC,
    FILE_PROFILE_CONFIGURATION,
    FILE_PROFILE_FILE_PATH,
    FILE_PROFILE_USER_NAME,
    FILE_PROFILE_PASSWORD,
    FILE_PROFILE_OPERATION,
    LOGICAL_TERMINATION_POINT,
    LOGICAL_TERMINATION_POINT_UUID,
    LAYER_PROTOCOL,
    CLIENT_LTP,
    SERVER_LTP,
    HTTP_CLIENT_INTERFACE_PAC,
    HTTP_CLIENT_INTERFACE_CONFIGURATION,
    HTTP_CLIENT_RELEASE_NUMBER,
    HTTP_CLIENT_APPLICATION_NAME,
    OPERATION_SERVER_INTERFACE_PAC,
    OPERATION_SERVER_INTERFACE_CONFIGURATION,
    OPERATION_SERVER_OPERATION_KEY,
    OPERATION_CLIENT_INTERFACE_PAC,
    OPERATION_CLIENT_INTERFACE_CONFIGURATION,
    OPERATION_CLIENT_OPERATION_NAME,
    OPERATION_CLIENT_OPERATION_KEY,
    TCP_CLIENT_INTERFACE_PAC,
    TCP_CLIENT_INTERFACE_CONFIGURATION,
    TCP_CLIENT_REMOTE_ADDRESS,
    TCP_CLIENT_IP_ADDRESS,
    TCP_CLIENT_ADDRESS,
    TCP_CLIENT_DOMAIN_NAME,
    TCP_CLIENT_REMOTE_PORT,
    TCP_CLIENT_REMOTE_PROTOCOL,
    TCP_SERVER_INTERFACE_PAC,
    TCP_SERVER_INTERFACE_CONFIGURATION,
    TCP_SERVER_IP_ADDRESS,
    TCP_SERVER_DOMAIN_NAME,
    TCP_SERVER_LOCAL_ADDRESS,
    FORWARDING_DOMAIN,
    FORWARDING_CONSTRUCT,
    FC_PORT,
    FC_PORT_LOGICAL_TERMINATION_POINT
}