const LtpServices = require("./LogicalTerminationPointServices");
const ControlConstruct = require('../models/ControlConstruct');
const LogicalTerminationPoint = require('../models/LogicalTerminationPoint');
const ConfigurationStatus = require('./models/ConfigurationStatus');
const LogicalTerminationPointConfigurationStatus = require('./models/logicalTerminationPoint/ConfigurationStatus');
const LogicalTerminationPointConfigurationInput = require('./models/logicalTerminationPoint/ConfigurationInput');
const ForwardingDomain = require('../models/ForwardingDomain');
const ForwardingConstruct = require('../models/ForwardingConstruct');
const TcpClientInterface = require('../models/layerProtocols/TcpClientInterface');
const OperationClientInterface = require("../models/layerProtocols/OperationClientInterface");
const HttpClientInterface = require("../models/layerProtocols/HttpClientInterface");

jest.mock('../models/ControlConstruct');
jest.mock('../models/LogicalTerminationPoint');
jest.mock('../models/ForwardingDomain');
jest.mock('../models/ForwardingConstruct');

const fc = {
  "uuid": "ol-2-0-1-op-fc-bm-010",
  "name": [],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ol-2-0-1-op-s-bm-009"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "ol-2-0-1-op-s-bm-004"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ol-2-0-1-op-c-im-cc-1-0-0-004"
    },
    {
      "local-id": "201",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "nl-2-0-1-op-c-bm-alt-1-0-0-006"
    }
  ]
};

const http = {
  "uuid": "ol-2-0-1-http-c-nan-2-0-5-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "aa-2-0-1-op-c-im-eatl-1-0-0-004",
    "aa-2-0-1-op-c-bs-eatl-1-0-0-000"
  ],
  "server-ltp": [
    "aa-2-0-1-tcp-c-eatl-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
      "http-client-interface-1-0:http-client-interface-pac": {
        "http-client-interface-configuration": {
          "application-name": "ExecutionAndTraceLog",
          "release-number": "1.0.0"
        }
      }
    }
  ]
};

const tcp = {
  "uuid": "aa-2-0-1-tcp-c-alt-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "aa-2-0-1-http-c-alt-1-0-0-000"
  ],
  "server-ltp": [],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-client-interface-1-0:tcp-client-interface-pac": {
        "tcp-client-interface-configuration": {
          "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
          "remote-address": {
            "ip-address": {
              "ipv-4-address": "1.1.3.6"
            }
          },
          "remote-port": 3006
        }
      }
    }
  ]
};

const oc = {
  "uuid": "aa-2-0-1-op-c-im-eatl-1-0-0-004",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [],
  "server-ltp": [
    "aa-2-0-1-http-c-eatl-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-client-interface-1-0:operation-client-interface-pac": {
        "operation-client-interface-configuration": {
          "operation-name": "/v1/inquire-oam-request-approvals",
          "operation-key": "Operation key not yet provided."
        },
        "operation-client-interface-status": {
          "operational-state": "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
          "life-cycle-state": "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
        }
      }
    }
  ]
};

const individualServicesOperationsMapping =
{
  "/v1/inquire-oam-request-approvals": {
    "regard-updated-link": {
      "api-segment": "is",
      "sequence": "002"
    }
  }
};

beforeEach(() => {
  jest.spyOn(ControlConstruct, 'getUuidAsync').mockReturnValue('ol-2-0-1');
  jest.spyOn(ControlConstruct, 'addLogicalTerminationPointAsync').mockReturnValue(true);
});

describe("createOrUpdateApplicationLtpsAsync", () => {
  test("createLtpInstanceGroupAsync - new HTTP Client", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue([]);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    const input = new LogicalTerminationPointConfigurationInput(
      undefined,
      "NewApplicationName",
      "2.0.5",
      [],
      "",
      new Map(),
      {}
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(operationClientConfigStatusList).toStrictEqual([]);
    expect(tcpClientConfigurationStatus).toStrictEqual([]);
  });

  test("createLtpInstanceGroupAsync - new TCP Client", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ol-2-0-1-tcp-c-cc-1-0-0-000"]);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(tcp);
    jest.spyOn(LogicalTerminationPoint, 'setServerLtpListAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemoteAddressAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemotePortAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemoteProtocolAsync').mockReturnValue(true);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    const expectedTcpClientConfigStatusList = [new ConfigurationStatus("ol-2-0-1-tcp-c-cc-1-0-0-000", "", true)];
    const input = new LogicalTerminationPointConfigurationInput(
      undefined,
      "NewApplicationName",
      "2.0.5",
      [{ address: "127.0.0.1", port: "55", protocol: "HTTPS" }],
      "",
      new Map(),
      {}
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(tcpClientConfigurationStatus).toStrictEqual(expectedTcpClientConfigStatusList);
    expect(operationClientConfigStatusList).toStrictEqual([]);
  });

  test("createLtpInstanceGroupAsync - modify TCP Client", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ol-2-0-1-tcp-c-cc-1-0-0-000"]);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(tcp);
    jest.spyOn(LogicalTerminationPoint, 'setServerLtpListAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemoteAddressAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemotePortAsync').mockReturnValue(true);
    jest.spyOn(TcpClientInterface, 'setRemoteProtocolAsync').mockReturnValue(true);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    const expectedTcpClientConfigStatusList = [new ConfigurationStatus("ol-2-0-1-tcp-c-cc-1-0-0-000", "", true)];
    const input = new LogicalTerminationPointConfigurationInput(
      undefined,
      "NewApplicationName",
      "2.0.5",
      [{ address: "127.0.0.1", port: "55", protocol: "HTTP" }],
      "",
      new Map(),
      {}
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(tcpClientConfigurationStatus).toStrictEqual(expectedTcpClientConfigStatusList);
    expect(operationClientConfigStatusList).toStrictEqual([]);
  });

  test("createLtpInstanceGroupAsync - create operation client", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue([]);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(undefined);
    jest.spyOn(ControlConstruct, 'addLogicalTerminationPointAsync').mockReturnValue(true);
    jest.spyOn(LogicalTerminationPoint, 'setClientLtpListAsync').mockReturnValue(true);
    jest.spyOn(OperationClientInterface, 'setOperationNameAsync').mockReturnValue(true);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    let expectedOperationClientConfigStatus = [new ConfigurationStatus("ol-2-0-1-op-c-is-nan-2-0-5-002", "", true)];
    let operationNamesByAttributes = new Map();
    operationNamesByAttributes.set("regard-updated-link", "/v1/inquire-oam-request-approvals");
    const input = new LogicalTerminationPointConfigurationInput(
      undefined,
      "NewApplicationName",
      "2.0.5",
      [],
      "/v1/inquire-oam-request-approvals",
      operationNamesByAttributes,
      individualServicesOperationsMapping
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(operationClientConfigStatusList).toStrictEqual(expectedOperationClientConfigStatus);
    expect(tcpClientConfigurationStatus).toStrictEqual([]);
  });

  test("createLtpInstanceGroupAsync - modify operation client", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue(["aa-2-0-1-op-c-im-eatl-1-0-0-004"]);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(oc);
    jest.spyOn(ControlConstruct, 'addLogicalTerminationPointAsync').mockReturnValue(true);
    jest.spyOn(LogicalTerminationPoint, 'setClientLtpListAsync').mockReturnValue(true);
    jest.spyOn(OperationClientInterface, 'setOperationNameAsync').mockReturnValue(true);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    let expectedOperationClientConfigStatus = [new ConfigurationStatus("ol-2-0-1-op-c-is-nan-2-0-5-002", "", true)];
    let operationNamesByAttributes = new Map();
    operationNamesByAttributes.set("regard-updated-link", "/v1/inquire-oam-request-approvals-foo");
    const input = new LogicalTerminationPointConfigurationInput(
      undefined,
      "NewApplicationName",
      "2.0.5",
      [],
      "/v1/inquire-oam-request-approvals",
      operationNamesByAttributes,
      individualServicesOperationsMapping
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(operationClientConfigStatusList).toStrictEqual(expectedOperationClientConfigStatus);
    expect(tcpClientConfigurationStatus).toStrictEqual([]);
  });

  test("updateLtpInstanceGroupAsync - update HTTP Client", async () => {
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(http);
    jest.spyOn(HttpClientInterface, 'setReleaseNumberAsync').mockReturnValue(true);
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue([]);
    jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue([]);
    let expectedHttpClientConfigStatus = new ConfigurationStatus("ol-2-0-1-http-c-nan-2-0-5-000", "", true);
    const input = new LogicalTerminationPointConfigurationInput(
      "ol-2-0-1-http-c-nan-2-0-5-000",
      "NewApplicationName",
      "2.0.7",
      [],
      "",
      new Map(),
      {}
    );

    const res = await LtpServices.createOrUpdateApplicationLtpsAsync(input);
    const operationClientConfigStatusList = res.operationClientConfigurationStatusList;
    const httpClientConfigurationStatus = res.httpClientConfigurationStatus;
    const tcpClientConfigurationStatus = res.tcpClientConfigurationStatusList;
    expect(httpClientConfigurationStatus).toStrictEqual(expectedHttpClientConfigStatus);
    expect(operationClientConfigStatusList).toStrictEqual([]);
    expect(tcpClientConfigurationStatus).toStrictEqual([]);
  });
});

  test("deleteApplicationLtpsAsync", async () => {
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ol-2-0-1-tcp-c-cc-1-0-0-000"]);
    jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue(
      ["ol-2-0-1-op-c-im-cc-1-0-0-004", "ol-2-0-1-op-c-im-cc-1-0-0-005"]
    );
    jest.spyOn(ControlConstruct, 'deleteLogicalTerminationPointAsync').mockReturnValue(true);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockReturnValue([fc]);
    let result = await LtpServices.deleteApplicationLtpsAsync(
      "ol-2-0-1-http-c-cc-1-0-0-000"
    );

    let expectedOperationClientConfigurationStatusList = [
      new ConfigurationStatus("ol-2-0-1-op-c-im-cc-1-0-0-004", '', true),
      new ConfigurationStatus("ol-2-0-1-op-c-im-cc-1-0-0-005", '', true)
    ];
    let expectedHttpClientConfigurationStatus = new ConfigurationStatus("ol-2-0-1-http-c-cc-1-0-0-000", '', true)
    let expectedTcpClientConfigurationStatusList = [
      new ConfigurationStatus("ol-2-0-1-tcp-c-cc-1-0-0-000", '', true),
    ];

    expect(ForwardingConstruct.deleteFcPortAsync).toHaveBeenCalledWith("ol-2-0-1-op-fc-bm-010", "200");

    expect(result).toStrictEqual(new LogicalTerminationPointConfigurationStatus(
      expectedOperationClientConfigurationStatusList,
      expectedHttpClientConfigurationStatus,
      expectedTcpClientConfigurationStatusList
    ));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
