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

describe("createOrUpdateApplicationInformationWithMultipleTcpClientAsync", () => {
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
  test("createOrUpdateApplicationInformationWithMultipleTcpClientAsync - successful", async () => {
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
  })

  test("createOrUpdateApplicationInformationWithMultipleTcpClientAsync - fail to get LogicalTerminationPointListAsync", async () => {
    const mockError = { message: 'Somethings bad happened' };
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
        
    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationInformationWithMultipleTcpClientAsync(
      logicalTerminationPointConfigurationInput);
    
    return res.then()
    .catch((err)=> {
      expect(err).toBe(undefined);
    })
  })

  test("createOrUpdateApplicationInformationWithMultipleTcpClientAsync - fail to get LogicalTerminationPointAsync", async () => {
    const mockError = { message: 'Somethings bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationInformationWithMultipleTcpClientAsync(
      logicalTerminationPointConfigurationInput);
    
    return res.then()
    .catch((err)=> {
      expect(err).toBe(undefined);
    })
  })

  test("createOrUpdateApplicationInformationWithMultipleTcpClientAsync - fail to create or update ApplicationInformationWithMultipleTcpClientAsync", async () => {
    const mockError = { message: 'Somethings bad happened' };

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
    
    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationInformationWithMultipleTcpClientAsync(
      logicalTerminationPointConfigurationInput);
    
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })
});

describe("createOrUpdateApplicationAndReleaseInformationAsync", () => {
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
  test("createOrUpdateApplicationAndReleaseInformationAsync - create or update successfully", async () => {
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps1);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp1);
    jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
    jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');

    const res = await LogicalTerminationPointWithMappingServices.createOrUpdateApplicationAndReleaseInformationAsync(
    logicalTerminationPointConfigurationInput1);
    expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
  })

  test("createOrUpdateApplicationAndReleaseInformationAsync - fail to get LogicalTerminationPointListAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationAndReleaseInformationAsync(
    logicalTerminationPointConfigurationInput1);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("createOrUpdateApplicationAndReleaseInformationAsync - if LogicalTerminationPointListAsync returns undefined", async () => {
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => undefined);
    
    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationAndReleaseInformationAsync(
    logicalTerminationPointConfigurationInput1);
    
    return res.then()
    .catch((err)=> {
      expect(err).toBe(undefined);
    })
  })

  test("createOrUpdateApplicationAndReleaseInformationAsync - fail to create or update ApplicationAndReleaseInformationAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps1);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp1);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp1);
    jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
    jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');

    const res = LogicalTerminationPointWithMappingServices.createOrUpdateApplicationAndReleaseInformationAsync(
    logicalTerminationPointConfigurationInput1);
    
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })
});

describe("findAndUpdateApplicationInformationAsync", () => {
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
  test("findAndUpdateApplicationInformationAsync - find and update successfully", async () => {
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp);
    jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
    jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');
    jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockImplementation(() => 'ro-2-0-1-http-c-tar-1-0-0-000');

    const res = await LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);
    expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
  })

  test("findAndUpdateApplicationInformationAsync - fail to get LogicalTerminationPointListAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res = LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("findAndUpdateApplicationInformationAsync - if LogicalTerminationPointListAsync returns undefined", async () => {
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => undefined);
    
    const res = LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);
    
    return res.then()
    .catch((err)=> {
      expect(err).toBeInstanceOf(Error);
    })
  })

  test("findAndUpdateApplicationInformationAsync - fail to get LogicalTerminationPointAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => {
      return Promise.reject(mockError)
    });
    
    const res = LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);

    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("findAndUpdateApplicationInformationAsync - failt to get UuidAsync ", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp);
    jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res = LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("findAndUpdateApplicationInformationAsync - fail to findAndUpdateApplicationInformationAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcp);
    jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => 'ro-2-0-1');
    jest.spyOn(OperationClientInterface, 'getOperationNameAsync').mockImplementation(() => '/v1/regard-application');
    jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockImplementation(() => 'ro-2-0-1-http-c-tar-1-0-0-000');

    const res = LogicalTerminationPointWithMappingServices.findAndUpdateApplicationInformationAsync(
      logicalTerminationPointConfigurationInput2);
    
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })
});

describe("deleteApplicationInformationAsync", () => {
  test("deleteApplicationInformationAsync - delete successfully", async () => {
    const applicationName = "TypeApprovalRegister";
    const releaseNumber = "2.0.1";

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
    
    const res = await LogicalTerminationPointWithMappingServices.deleteApplicationInformationAsync(
      applicationName, releaseNumber);
    expect(res).toBeInstanceOf(LogicalTerminationPointConfigurationStatus);
  })

  test("deleteApplicationInformationAsync - fail to get LogicalTerminationPointListAsync", async () => {
    const applicationName = "TypeApprovalRegister";
    const releaseNumber = "2.0.1";
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res = LogicalTerminationPointWithMappingServices.deleteApplicationInformationAsync(
      applicationName, releaseNumber);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("deleteApplicationInformationAsync - fail to get LogicalTerminationPointAsync", async () => {
    const applicationName = "TypeApprovalRegister";
    const releaseNumber = "2.0.1";
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => {
      return Promise.reject(mockError)
    });
    
    const res = LogicalTerminationPointWithMappingServices.deleteApplicationInformationAsync(
      applicationName, releaseNumber);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

  test("deleteApplicationInformationAsync - fail to delete ApplicationInformationAsync", async () => {
    const applicationName = "TypeApprovalRegister";
    const releaseNumber = "2.0.1";
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => ltp);
    
    const res = LogicalTerminationPointWithMappingServices.deleteApplicationInformationAsync(
      applicationName, releaseNumber);
    
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  })

});

afterEach(() => {
  jest.resetAllMocks();
});
