var fs = require('fs');
const readYamlFile = require('read-yaml-file');

let applicationUuid = "xx-1-0-0";
let profileInstancesFileName = "input/profileInstances.yaml";
let servicesFileName = "input/services.yaml";
let forwardingsFileName = "input/forwardings.yaml";

readYamlFile(profileInstancesFileName).then(ProfileData => {
    let profileList = generateProfileList(ProfileData);
    readYamlFile(servicesFileName).then(serviceData => {
        let logicalTerminationPointList = generateLogicalTerminationPointList(serviceData);
        readYamlFile(forwardingsFileName).then(forwardingData => {
            let forwardingConstructList = generateForwardingDomain(forwardingData);

            let controlConstruct = {
                "core-model-1-4:control-construct": {
                    "uuid": applicationUuid,
                    "profile-collection": {
                        profile: profileList
                    },
                    "logical-termination-point": logicalTerminationPointList,
                    "forwarding-domain": [
                        {
                            "uuid": applicationUuid + "-op-fd-000",
                            "forwarding-construct": forwardingConstructList
                        }
                    ]
                }
            }

            fs.writeFile("output/" + applicationUuid + "_config_autogen.json", JSON.stringify(controlConstruct, null, 4), function (err) {
                if (err) throw err;
                console.log('complete');
            });
        });
    })
})

function generateProfileList(ProfileData) {
    let translatedProfileInstanceList = [];
    let profileInstances = ProfileData['profile-instances'];

    profileInstances.forEach(profileInstance => {
        let profileName = profileInstance['profile-name'];
        if (profileName == "StringProfile") {
            let stringProfileInstance = {
                "uuid": profileInstance['uuid'],
                "profile-name": "string-profile-1-0:PROFILE_NAME_TYPE_STRING_PROFILE",
                "string-profile-1-0:string-profile-pac": {
                    "string-profile-capability": {
                        "string-name": profileInstance['capability']['string-name'],
                        "enumeration": profileInstance['capability']['enumeration'],
                        "pattern": profileInstance['capability']['pattern'],
                    },
                    "string-profile-configuration": {
                        "string-value": profileInstance['configuration']['string-value']
                    }
                }
            }
            console.log(profileInstance['capability']['string-name']);
            translatedProfileInstanceList.push(stringProfileInstance);
        } else if (profileName == "IntegerProfile") {
            let integerProfileInstance = {
                "uuid": profileInstance['uuid'],
                "profile-name": "integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE",
                "integer-profile-1-0:integer-profile-pac": {
                    "integer-profile-capability": {
                        "integer-name": profileInstance['capability']['integer-name'],
                        "purpose": profileInstance['capability']['purpose'],
                        "unit": profileInstance['capability']['unit'],
                        "minimum": profileInstance['capability']['minimum'],
                        "maximum": profileInstance['capability']['maximum'],
                    },
                    "integer-profile-configuration": {
                        "integer-value": profileInstance['configuration']['integer-value']
                    }
                }
            }
            console.log(profileInstance['capability']['integer-name']);
            translatedProfileInstanceList.push(integerProfileInstance);
        } else if (profileName == "ActionProfile") {
            let actionProfileInstance = {
                "uuid": profileInstance['uuid'],
                "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
                "action-profile-1-0:action-profile-pac": {
                    "action-profile-capability": {
                        "operation-name": profileInstance['capability']['operation-name'],
                        "label": profileInstance['capability']['label'],
                        "input-value-list": profileInstance['capability']['input-value-list'],
                        "display-in-new-browser-window": profileInstance['capability']['display-in-new-browser-window'],
                    },
                    "action-profile-configuration": {
                        "consequent-operation-reference": profileInstance['configuration']['consequent-operation-reference']
                    }
                }
            }
            translatedProfileInstanceList.push(actionProfileInstance);
        } else if (profileName == "GenericResponseProfile") {
            let responseProfileInstance;
            if (profileInstance['capability']['static-field-name']) {
                responseProfileInstance = {
                    "uuid": profileInstance['uuid'],
                    "profile-name": "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
                    "response-profile-1-0:response-profile-pac": {
                        "response-profile-capability": {
                            "operation-name": profileInstance['capability']['operation-name'],
                            "field-name": {
                                "static-field-name": profileInstance['capability']['static-field-name']
                            },
                            "description": profileInstance['capability']['description'],
                            "datatype": profileInstance['capability']['datatype'],
                        },
                        "response-profile-configuration": {
                            "value": {
                                "value-reference": profileInstance['configuration']['value-reference']
                            }
                        }
                    }
                }
            } else {
                responseProfileInstance = {
                    "uuid": profileInstance['uuid'],
                    "profile-name": "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
                    "response-profile-1-0:response-profile-pac": {
                        "response-profile-capability": {
                            "operation-name": profileInstance['capability']['operation-name'],
                            "field-name": {
                                "field-name-reference": profileInstance['capability']['field-name-reference']
                            },
                            "description": profileInstance['capability']['description'],
                            "datatype": profileInstance['capability']['datatype'],
                        },
                        "response-profile-configuration": {
                            "value": {
                                "value-reference": profileInstance['configuration']['value-reference']
                            }
                        }
                    }
                }
            }
            translatedProfileInstanceList.push(responseProfileInstance);
        }
    });

    return translatedProfileInstanceList;
}

function generateLogicalTerminationPointList(serviceData) {
    let translatedLTPList = [];
    let servers = serviceData["servers"];

    //operation servers
    let httpServer = servers["http-server"];
    //tcp servers
    let tcpServer = servers["tcp-server"];
    //operation servers
    let operationServers = servers["operation-servers"];
    let consolidatedOperationServersList = [];
    consolidatedOperationServersList = consolidatedOperationServersList.concat(operationServers['own-oam']['basic']);
    consolidatedOperationServersList = consolidatedOperationServersList.concat(operationServers['own-oam']['individual']);
    consolidatedOperationServersList = consolidatedOperationServersList.concat(operationServers['service']['basic']);
    consolidatedOperationServersList = consolidatedOperationServersList.concat(operationServers['service']['individual']);

    consolidatedOperationServersList.forEach(operationServer => {
        translatedLTPList.push(generateOperationServers(operationServer, httpServer));
    });

    translatedLTPList.push(generateHttpServer(consolidatedOperationServersList, httpServer, tcpServer));
    translatedLTPList.push(generateTcpServer(httpServer, tcpServer));

    let clientList = serviceData["clients"];
    translatedLTPList = translatedLTPList.concat(generateClients(clientList));

    return translatedLTPList;
}

function generateForwardingDomain(forwardingData) {
    let translatedForwardingList = [];
    let forwardingList = forwardingData["forwardings"];
    forwardingList.forEach(forwarding => {
        translatedForwardingList.push(generateForwardingConstruct(forwarding))
    })

    return translatedForwardingList;
}
const forwardingKindTypes = {
    InvariantProcessSnippet: "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET",
    ProcessSnippet: "core-model-1-4:FORWARDING_KIND_TYPE_PROCESS_SNIPPET",
    Subscription: "core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION"
}
/***********************************************************************************************
 * client generation
 *********************************************************************************************/
function generateForwardingConstruct(forwardingYamlInstance) {
    let fcUuid = forwardingYamlInstance["uuid"];
    let forwardingKind = forwardingKindTypes[forwardingYamlInstance["forwarding-type"]]
    let forwardingName = forwardingYamlInstance["forwarding-name"];
    let fcPortList = [];
    let managementFcPortYamlInstances = [];
    managementFcPortYamlInstances = (forwardingYamlInstance["management-requests"]["operation-client-update"] &&
        forwardingYamlInstance["management-requests"]["operation-client-update"].length > 0) ?
        managementFcPortYamlInstances.concat(forwardingYamlInstance["management-requests"]["operation-client-update"]) : managementFcPortYamlInstances;
    managementFcPortYamlInstances = (forwardingYamlInstance["management-requests"]["fc-port-update"] &&
        forwardingYamlInstance["management-requests"]["fc-port-update"].length > 0) ?
        managementFcPortYamlInstances.concat(forwardingYamlInstance["management-requests"]["fc-port-update"]) : managementFcPortYamlInstances;
    managementFcPortYamlInstances = (forwardingYamlInstance["management-requests"]["fc-port-deletion"] &&
        forwardingYamlInstance["management-requests"]["fc-port-deletion"].length > 0) ?
        managementFcPortYamlInstances.concat(forwardingYamlInstance["management-requests"]["fc-port-deletion"]) : managementFcPortYamlInstances;
    managementFcPortYamlInstances = (forwardingYamlInstance["management-requests"]["operation-client-deletion"] &&
        forwardingYamlInstance["management-requests"]["operation-client-deletion"].length > 0) ?
        managementFcPortYamlInstances.concat(forwardingYamlInstance["management-requests"]["operation-client-deletion"]) : managementFcPortYamlInstances;

    let uniqueManagementFcPortYamlInstances = [];
    managementFcPortYamlInstances.forEach(managementFcPortYamlInstance => {
        let isValueAlreadyExists = false;
        uniqueManagementFcPortYamlInstances.forEach(uniqueManagementFcPortYamlInstance => {
            if (JSON.stringify(managementFcPortYamlInstance) == JSON.stringify(uniqueManagementFcPortYamlInstance)) {
                isValueAlreadyExists = true;
            }
        })
        if (!isValueAlreadyExists) {
            uniqueManagementFcPortYamlInstances.push(managementFcPortYamlInstance);
        }
    });
    let inputFcPortYamlInstances = (forwardingYamlInstance["initiating-requests"] &&
        forwardingYamlInstance["initiating-requests"].length > 0) ?
        forwardingYamlInstance["initiating-requests"] : [];

    let outputFcPortYamlInstances = (forwardingYamlInstance["consequent-requests"] &&
        forwardingYamlInstance["consequent-requests"].length > 0) ?
        forwardingYamlInstance["consequent-requests"] : [];

    let managementFcPortIndexPrefix = "00"
    uniqueManagementFcPortYamlInstances.forEach((uniqueManagementFcPortYamlInstance, index) => {
        let localId = managementFcPortIndexPrefix + index;
        let fcPortLtpUuid = uniqueManagementFcPortYamlInstance["uuid"];
        let fcPortType = "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT";
        let fcPort = {
            "local-id": localId,
            "port-direction": fcPortType,
            "logical-termination-point": fcPortLtpUuid
        }
        fcPortList.push(fcPort);
    });

    let inputFcPortIndexStarting = 100
    inputFcPortYamlInstances.forEach((inputFcPortYamlInstance, index) => {
        let localId = inputFcPortIndexStarting + index;
        let fcPortLtpUuid = inputFcPortYamlInstance["uuid"];
        let fcPortType = "core-model-1-4:PORT_DIRECTION_TYPE_INPUT";
        let fcPort = {
            "local-id": localId.toString(),
            "port-direction": fcPortType,
            "logical-termination-point": fcPortLtpUuid
        }
        fcPortList.push(fcPort);
    })

    let outputFcPortIndexStarting = 200
    outputFcPortYamlInstances.forEach((outputFcPortYamlInstance, index) => {
        let localId = outputFcPortIndexStarting + index;
        let fcPortLtpUuid = outputFcPortYamlInstance["uuid"];
        if (fcPortLtpUuid) {
            let fcPortType = "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT";
            let fcPort = {
                "local-id": localId.toString(),
                "port-direction": fcPortType,
                "logical-termination-point": fcPortLtpUuid
            }
            fcPortList.push(fcPort);
        }
    })

    let forwardingConstruct = {
        "uuid": fcUuid,
        "name": [{
            "value-name": "ForwardingKind",
            "value": forwardingKind
        },
        {
            "value-name": "ForwardingName",
            "value": forwardingName
        }
        ],
        "fc-port": fcPortList
    }

    return forwardingConstruct;
}


/***********************************************************************************************
 * client generation
 *********************************************************************************************/
function generateClients(clientList) {
    let translatedLTPClientList = [];
    clientList.forEach(client => {
        let httpClient = client["http-client"];
        let tcpClient = client["tcp-client"];

        let consolidatedOperationClientList = [];
        if (client["operation-clients"]) {
            let operationClient = client["operation-clients"];
            consolidatedOperationClientList = (operationClient['own-oam']['basic'] && operationClient['own-oam']['basic'].length != 0) ?
                consolidatedOperationClientList.concat(operationClient['own-oam']['basic']) : consolidatedOperationClientList;
            consolidatedOperationClientList = (operationClient['own-oam']['individual'] && operationClient['own-oam']['individual'].length != 0) ?
                consolidatedOperationClientList.concat(operationClient['own-oam']['individual']) : consolidatedOperationClientList;

            consolidatedOperationClientList = (operationClient['service']['basic'] && operationClient['service']['basic'].length != 0) ?
                consolidatedOperationClientList.concat(operationClient['service']['basic']) : consolidatedOperationClientList;
            consolidatedOperationClientList = (operationClient['service']['individual'] && operationClient['service']['individual'].length != 0) ?
                consolidatedOperationClientList.concat(operationClient['service']['individual']) : consolidatedOperationClientList;
            if (consolidatedOperationClientList.length > 0) {
                consolidatedOperationClientList.forEach(operationClient => {
                    translatedLTPClientList.push(generateOperationClient(operationClient, httpClient));
                });

                translatedLTPClientList.push(generateHttpClient(consolidatedOperationClientList, httpClient, tcpClient));
                translatedLTPClientList.push(generateTcpClient(httpClient, tcpClient));
            }
        } else if (client["elasticsearch-client"]) {
            let elasticsearchClient = client["elasticsearch-client"];
            consolidatedOperationClientList = (elasticsearchClient && elasticsearchClient.length != 0) ?
                consolidatedOperationClientList.concat(elasticsearchClient) : consolidatedOperationClientList;
            if (consolidatedOperationClientList.length > 0) {
            consolidatedOperationClientList.forEach(esClient => {
                translatedLTPClientList.push(generateElasticsearchClient(esClient, httpClient));
            });

            translatedLTPClientList.push(generateHttpClient(consolidatedOperationClientList, httpClient, tcpClient));
            translatedLTPClientList.push(generateTcpClient(httpClient, tcpClient));
        }
        }


    });

    return translatedLTPClientList;
}

function generateOperationClient(operationClientYamlInstance, httpClientYamlInstance) {
    let operationClientName = operationClientYamlInstance["operation-name"];
    let operationClientUuid = operationClientYamlInstance["uuid"];
    let operationKey = operationClientYamlInstance["operation-key"] ? operationClientYamlInstance["operation-key"] :
        "Operation key not yet provided.";
    let detailedLoggingIsOn = (operationClientYamlInstance["detailed-logging-is-on"] != null) ? operationClientYamlInstance["detailed-logging-is-on"] : undefined;
    let lifeCycleState = (operationClientYamlInstance["life-cycle-state"] != null) ? "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_" + operationClientYamlInstance["life-cycle-state"].toUpperCase : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL";
    let httpUuid = httpClientYamlInstance["uuid"];

    let operationClient = {
        "uuid": operationClientUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
        "client-ltp": [],
        "server-ltp": [
            httpUuid
        ],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
            "operation-client-interface-1-0:operation-client-interface-pac": {
                "operation-client-interface-configuration": {
                    "operation-name": operationClientName,
                    "operation-key": operationKey,
                    "detailed-logging-is-on": detailedLoggingIsOn
                },
                "operation-client-interface-status": {
                    "operational-state": "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
                    "life-cycle-state": lifeCycleState
                }
            }
        }]
    }
    return operationClient;
}

function generateElasticsearchClient(elasticsearchClientYamlInstance, httpClientYamlInstance) {
    let esClientUuid = elasticsearchClientYamlInstance["uuid"];
    let indexAlis = elasticsearchClientYamlInstance["index-alias"];
    let apiKey = "API key not yet defined.";
    let httpUuid = httpClientYamlInstance["uuid"];

    let esClient = {
        "uuid": esClientUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
        "client-ltp": [
        ],
        "server-ltp": [
            httpUuid
        ],
        "layer-protocol": [
            {
                "local-id": "0",
                "layer-protocol-name": "elasticsearch-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_ELASTICSEARCH_LAYER",
                "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac": {
                    "elasticsearch-client-interface-configuration": {
                        "auth": {
                            "api-key": apiKey
                        },
                        "index-alias": indexAlis
                    },
                    "elasticsearch-client-interface-status": {
                        "operational-state": "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
                        "life-cycle-state": "elasticsearch-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
                    }
                }
            }
        ]
    }
    return esClient;
}

function generateHttpClient(operationClientYamlInstanceList, httpClientYamlInstance, tcpClientYamlInstance) {
    let operationClientUuidList = [];
    operationClientYamlInstanceList.forEach(operationClientYamlInstance => {
        let operationClientUuid = operationClientYamlInstance['uuid'];
        operationClientUuidList.push(operationClientUuid);
    });

    let httpClientUuid = httpClientYamlInstance["uuid"];
    let applicationName = httpClientYamlInstance["application-name"];
    let releaseNumber = httpClientYamlInstance["release-number"];

    let tcpClientUuid = tcpClientYamlInstance["uuid"];

    let httpClient = {
        "uuid": httpClientUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
        "client-ltp": operationClientUuidList,
        "server-ltp": [
            tcpClientUuid
        ],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
            "http-client-interface-1-0:http-client-interface-pac": {
                "http-client-interface-configuration": {
                    "application-name": applicationName,
                    "release-number": releaseNumber
                }
            }
        }]
    }
    return httpClient;
}

function generateTcpClient(httpClientYamlInstance, tcpClientYamlInstance) {
    let httpClientUuid = httpClientYamlInstance["uuid"];

    let tcpClientUuid = tcpClientYamlInstance["uuid"];
    let protocol = "tcp-client-interface-1-0:PROTOCOL_TYPE_" + tcpClientYamlInstance["remote-protocol"].toUpperCase();

    let ipAddress = tcpClientYamlInstance["ip-address"];
    let port = tcpClientYamlInstance["tcp-port"];

    let tcpClient = {
        "uuid": tcpClientUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
        "client-ltp": [
            httpClientUuid
        ],
        "server-ltp": [],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
            "tcp-client-interface-1-0:tcp-client-interface-pac": {
                "tcp-client-interface-configuration": {
                    "remote-protocol": protocol,
                    "remote-address": {
                        "ip-address": {
                            "ipv-4-address": ipAddress
                        }
                    },
                    "remote-port": port
                }
            }
        }]
    }
    return tcpClient;
}
/***********************************************************************************************
 * Server generation
 *********************************************************************************************/
function generateOperationServers(operationServerYamlInstance, httpServerYamlInstance) {
    let operationName = operationServerYamlInstance['operation-name'];
    let operationServerUuid = operationServerYamlInstance['uuid'];
    let lifeCycleState = (operationServerYamlInstance["life-cycle-state"] != null) ? "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_" + operationServerYamlInstance["life-cycle-state"].toUpperCase : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED";

    let operationKey = operationServerYamlInstance["operation-key"] ? operationServerYamlInstance["operation-key"] : "Operation key not yet provided.";

    let httpUuid = httpServerYamlInstance["uuid"];

    let operationServer = {
        "uuid": operationServerUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
        "client-ltp": [],
        "server-ltp": [
            httpUuid
        ],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
            "operation-server-interface-1-0:operation-server-interface-pac": {
                "operation-server-interface-capability": {
                    "operation-name": operationName
                },
                "operation-server-interface-configuration": {
                    "life-cycle-state": lifeCycleState,
                    "operation-key": operationKey
                }
            }
        }]
    };
    return operationServer;
}

function generateHttpServer(operationServerYamlInstanceList, httpServerYamlInstance, tcpServerYamlInstance) {
    let operationServerUuidList = [];
    operationServerYamlInstanceList.forEach(operationServerYamlInstance => {
        let operationServerUuid = operationServerYamlInstance['uuid'];
        operationServerUuidList.push(operationServerUuid);
    });

    let httpServerUuid = httpServerYamlInstance["uuid"];
    let applicationName = httpServerYamlInstance["own-application-name"];
    let releaseNumber = httpServerYamlInstance["own-release-number"];
    let applicationPurpose = httpServerYamlInstance["application-purpose"];
    let ownerName = httpServerYamlInstance["owner-name"];
    let ownerEmailAddress = httpServerYamlInstance["owner-email-address"];
    let releaseList = []
    let releaseListYamlInstances = httpServerYamlInstance["release-list"];
    releaseListYamlInstances.forEach((releaseListYamlInstance, index) => {
        let releaseListReleaseNumber = releaseListYamlInstance['release-number'];
        let releaseListdate = releaseListYamlInstance['release-date'];
        let releaseListChanges = releaseListYamlInstance['changes'];
        let release = {
            "local-id": index.toString(),
            "release-number": releaseListReleaseNumber,
            "release-date": releaseListdate,
            "changes": releaseListChanges
        }
        releaseList.push(release);
    })

    let tcpServerUuid = tcpServerYamlInstance[0]["uuid"];

    let httpServer = {
        "uuid": httpServerUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
        "client-ltp": operationServerUuidList,
        "server-ltp": [
            tcpServerUuid
        ],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "http-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
            "http-server-interface-1-0:http-server-interface-pac": {
                "http-server-interface-capability": {
                    "application-name": applicationName,
                    "release-number": releaseNumber,
                    "application-purpose": applicationPurpose,
                    "data-update-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
                    "owner-name": ownerName,
                    "owner-email-address": ownerEmailAddress,
                    "release-list": releaseList
                }
            }
        }]
    }
    return httpServer;
}

function generateTcpServer(httpServerYamlInstance, tcpServerYamlInstanceList) {
    let httpServerUuid = httpServerYamlInstance["uuid"];

    let tcpServerYamlInstance = tcpServerYamlInstanceList[0];
    let tcpServerUuid = tcpServerYamlInstance["uuid"];
    let description = tcpServerYamlInstance["description"];
    let protocol = "tcp-server-interface-1-0:PROTOCOL_TYPE_" + tcpServerYamlInstance["local-protocol"].toUpperCase();

    let ipAddress = tcpServerYamlInstance["own-ip-address"];
    let port = tcpServerYamlInstance["own-tcp-port"];

    let tcpServer = {
        "uuid": tcpServerUuid,
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
        "client-ltp": [
            httpServerUuid
        ],
        "server-ltp": [],
        "layer-protocol": [{
            "local-id": "0",
            "layer-protocol-name": "tcp-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
            "tcp-server-interface-1-0:tcp-server-interface-pac": {
                "tcp-server-interface-configuration": {
                    "description": description,
                    "local-protocol": protocol,
                    "local-address": {
                        "ipv-4-address": ipAddress
                    },
                    "local-port": port
                }
            }
        }]
    }
    return tcpServer;
}
