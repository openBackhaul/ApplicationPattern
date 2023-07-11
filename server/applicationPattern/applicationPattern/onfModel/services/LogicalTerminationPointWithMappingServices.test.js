const LogicalTerminationPointWithMappingServices = require('./LogicalTerminationPointWithMappingServices');
const TcpClientInterface = require('../models/layerProtocols/TcpClientInterface');
const ControlConstruct = require('../models/ControlConstruct');
const OperationClientInterface = require('../models/layerProtocols/OperationClientInterface');
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const LogicalTerminationPointConfigurationStatus = require('./models/logicalTerminationPoint/ConfigurationStatus');
const fileOperation = require('../../databaseDriver/JSONDriver');

const ltps = [
  {
    "uuid": "ro-2-0-1-http-c-tar-1-0-0-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
      "ro-2-0-1-op-c-im-tar-1-0-0-000",
      "ro-2-0-1-op-c-im-tar-1-0-0-001",
      "ro-2-0-1-op-c-im-tar-1-0-0-002",
      "ro-2-0-1-op-c-im-tar-1-0-0-005",
      "ro-2-0-1-op-c-im-tar-1-0-0-003",
      "ro-2-0-1-op-c-im-tar-1-0-0-004"
    ],
    "server-ltp": [
      "ro-2-0-1-tcp-c-tar-1-0-0-000",
    ],
    "layer-protocol": [
      {
        "local-id": "0",
        "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac": {
          "http-client-interface-configuration": {
            "application-name": "TypeApprovalRegister",
            "release-number": "2.0.1"
          }
        }
      }
    ]
  }
];

const ltp = ltps[0];

const tcp = {
  "uuid": "ro-2-0-1-tcp-c-tar-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "ro-2-0-1-http-c-tar-1-0-0-000"
  ],
  "server-ltp": [
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-client-interface-1-0:tcp-client-interface-pac": {
        "tcp-client-interface-configuration": {
          "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
          "remote-address": {
            "ip-address": {
              "ipv-4-address": "1.1.3.2"
            }
          },
          "remote-port": 3002
        }
      }
    }
  ]
}

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
  jest.spyOn(fileOperation, 'deletefromDatabaseAsync').mockImplementation(() => true);
  
})

test("createOrUpdateApplicationInformationWithMultipleTcpClientAsync", async () => {
  const logicalTerminationPointConfigurationInput = {
    applicationName: 'TypeApprovalRegister',
    releaseNumber: '2.0.1',
    tcpList: [
      {
        "protocol": "HTTPS",
        "address": {
          "ip-address": {
            "ipv-4-address": "1.2.3.9"
          }
        },
        "port": 3209
      },
      {
        "protocol": "HTTP",
        "address": {
          "ip-address": {
            "ipv-4-address": "1.1.3.9"
          }
        },
        "port": 3009
      }
    ],
    operationServerName: '/v1/register-application',
    operationNamesByAttributes: [
      [
      'embedding-operation' , '/v1/embed-yourself'
      ],
      [
        'client-update-operation' , '/v1/update-client'
      ],
      [
        'operation-client-update-operation' , '/v1/update-operation-client'
      ]
    ],
    "operationsMapping": {
      "/v1/register-application": {
        "embedding-operation": {
          "api-segment": "im",
          "sequence": "000"
        },
        "client-update-operation": {
          "api-segment": "im",
          "sequence": "001"
        },
        "operation-client-update-operation": {
          "api-segment": "im",
          "sequence": "002"
        }
      },
      "/v1/inquire-application-type-approvals": {
        "approval-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-deregistrations": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      },
      "/v1/notify-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-withdrawn-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      }
    }
  };  
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp);  
  jest.spyOn(TcpClientInterface, 'setRemoteAddressAsync').mockImplementation(() => true);
  jest.spyOn(TcpClientInterface, 'setRemotePortAsync').mockImplementation(() => true);
  jest.spyOn(TcpClientInterface, 'setRemoteProtocolAsync').mockImplementation(() => true);
  jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
  jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/embed-yourself');
  jest.spyOn(OperationClientInterface, 'setOperationNameAsync').mockImplementation(() => true);
  jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockImplementation(() => 'ro-2-0-1-http-c-tar-1-0-0-000');
  
  const res = await LogicalTerminationPointWithMappingServices.createOrUpdateApplicationInformationWithMultipleTcpClientAsync(
    logicalTerminationPointConfigurationInput);
  expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
});

test("createOrUpdateApplicationAndReleaseInformationAsync", async () => {
	const logicalTerminationPointConfigurationInput1 = {
    "applicationName": "ExecutionAndTraceLog",
    "releaseNumber": "1.0.0",
    "tcpList": [
      {
        "protocol": "HTTP",
        "address": {
          "ip-address": {
            "ipv-4-address": "1.1.3.3"
          }
        },
        "port": 3003
      }
    ],
    "operationServerName": "/v1/notify-approvals",
    "operationNamesByAttributes": [
      [
      'subscriber-operation' , '/v1/regard-application'
      ],
    ],
    "operationsMapping": {
      "/v1/register-application": {
        "embedding-operation": {
          "api-segment": "im",
          "sequence": "000"
        },
        "client-update-operation": {
          "api-segment": "im",
          "sequence": "001"
        },
        "operation-client-update-operation": {
          "api-segment": "im",
          "sequence": "002"
        }
      },
      "/v1/inquire-application-type-approvals": {
        "approval-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-deregistrations": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      },
      "/v1/notify-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-withdrawn-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      }
    }
  }

  const ltps1 = [
		{
			"uuid": "ro-2-0-1-http-c-eatl-1-0-0-000",
			"ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
			"client-ltp": [
				"ro-2-0-1-op-c-bs-eatl-1-0-0-000",
				"ro-2-0-1-op-c-im-eatl-1-0-0-000",
				"ro-2-0-1-op-c-im-eatl-1-0-0-001",
				"ro-2-0-1-op-c-im-eatl-1-0-0-002",
				"ro-2-0-1-op-c-im-eatl-1-0-0-003",
				"ro-2-0-1-op-c-im-eatl-1-0-0-004"
			],
			"server-ltp": [
				"ro-2-0-1-tcp-c-eatl-1-0-0-000"
			],
			"layer-protocol": [
				{
				"local-id": "0",
				"layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
					"http-client-interface-1-0:http-client-interface-pac": {
						"http-client-interface-configuration": {
								"application-name": "ExecutionAndTraceLog",
								"release-number": "2.0.1"
						}
					}
				}
			]
		}
	]

  const ltp1 = ltps1[0]
  
  const tcp1 = {
    "uuid": "ro-2-0-1-tcp-c-eatl-1-0-0-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
      "ro-2-0-1-http-c-eatl-1-0-0-000"
    ],
    "server-ltp": [
    ],
    "layer-protocol": [
      {
        "local-id": "0",
        "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-client-interface-1-0:tcp-client-interface-pac": {
          "tcp-client-interface-configuration": {
            "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
            "remote-address": {
              "ip-address": {
                "ipv-4-address": "1.1.3.3"
              }
            },
            "remote-port": 3003
          }
        }
      }
    ]
  }

	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps1);
	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp1);
	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp1);
	jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
	jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');

	const res = await LogicalTerminationPointWithMappingServices.createOrUpdateApplicationAndReleaseInformationAsync(
	logicalTerminationPointConfigurationInput1);
	expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
});

test("findAndUpdateApplicationInformationAsync", async () => {
	const logicalTerminationPointConfigurationInput2 = {
    "applicationName": "TypeApprovalRegister",
    "releaseNumber": "2.0.1",
    "tcpList": [
      {
        "protocol": "HTTP",
        "address": {
          "ip-address": {
            "ipv-4-address": "1.1.3.2"
          }
        },
        "port": 3002
      }
    ],
    "operationServerName": "/v1/inquire-application-type-approvals",
    "operationNamesByAttributes": [
      [
      'approval-operation' , '/v1/regard-application'
      ],
    ],
    "operationsMapping": {
      "/v1/register-application": {
        "embedding-operation": {
          "api-segment": "im",
          "sequence": "000"
        },
        "client-update-operation": {
          "api-segment": "im",
          "sequence": "001"
        },
        "operation-client-update-operation": {
          "api-segment": "im",
          "sequence": "002"
        }
      },
      "/v1/inquire-application-type-approvals": {
        "approval-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-deregistrations": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      },
      "/v1/notify-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "003"
        }
      },
      "/v1/notify-withdrawn-approvals": {
        "subscriber-operation": {
          "api-segment": "im",
          "sequence": "004"
        }
      }
    }
  }

	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp);
	jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
	jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');
  jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockImplementation(() => 'ro-2-0-1-http-c-tar-1-0-0-000');

	const res = await LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
    logicalTerminationPointConfigurationInput2);
	expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
});

test("deleteApplicationInformationAsync", async () => {
	const applicationName = "TypeApprovalRegister";
  const releaseNumber = "2.0.1";

	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
	jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
	
	const res = await LogicalTerminationPointWithMappingServices.deleteApplicationInformationAsync(
    applicationName, releaseNumber);
	expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
});

afterEach(() => {
  jest.resetAllMocks();
});
