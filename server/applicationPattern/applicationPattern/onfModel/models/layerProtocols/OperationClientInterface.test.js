const OperationClientInterface = require("./OperationClientInterface");
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');
const TcpClientInterface = require("./TcpClientInterface");

jest.mock('../LogicalTerminationPoint');
jest.mock('../../../databaseDriver/JSONDriver');
jest.mock('../ControlConstruct');

const opC = {
  "uuid": "alt-2-0-1-op-c-im-tar-1-0-0-004",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [],
  "server-ltp": [
    "alt-2-0-1-http-c-tar-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-client-interface-1-0:operation-client-interface-pac": {
        "operation-client-interface-configuration": {
          "operation-name": "/v1/redirect-topology-change-information",
          "operation-key": "Operation key not yet provided.",
          "detailed-logging-is-on": false
        },
        "operation-client-interface-status": {
          "operational-state": "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
          "life-cycle-state": "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
        }
      }
    }
  ]
};


const operationClientInterfaceConfigurationPath = "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-op-c-im-tar-1-0-0-004/layer-protocol=0/operation-client-interface-1-0:operation-client-interface-pac/operation-client-interface-configuration/";

beforeEach(() => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => opC);
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getOperationNameAsync", async () => {
  expect(await OperationClientInterface.getOperationNameAsync("alt-2-0-1-op-c-im-tar-1-0-0-004")).toBe("/v1/redirect-topology-change-information");
});

test("getDetailedLoggingIsOnAsync", async () => {
  expect(await OperationClientInterface.getDetailedLoggingIsOnAsync("alt-2-0-1-op-c-im-tar-1-0-0-004")).toBeFalsy();
});

test("getOperationKeyAsync", async () => {
  expect(await OperationClientInterface.getOperationKeyAsync("alt-2-0-1-op-c-im-tar-1-0-0-004")).toBe("Operation key not yet provided.");
});

test("setOperationKeyAsync", async () => {
  const res = await OperationClientInterface.setOperationKeyAsync("alt-2-0-1-op-c-im-tar-1-0-0-004", "foo-bar");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    operationClientInterfaceConfigurationPath + "operation-key", "foo-bar", false
  );
  expect(res).toBeTruthy();
});

test("getOperationClientUuidAsync", async () => {
  jest.spyOn(logicalTerminationPoint, 'getClientLtpListAsync').mockImplementation(
    () => ["alt-2-0-1-op-c-im-tar-1-0-0-004"]
  );
  expect(await OperationClientInterface.getOperationClientUuidAsync("alt-2-0-1-http-c-tar-1-0-0-000", "/v1/redirect-topology-change-information"))
    .toBe("alt-2-0-1-op-c-im-tar-1-0-0-004");
});

test("getTcpClientConnectionInfoAsync", async () => {
  const remoteAddress = {
      "ip-address": {
        "ipv-4-address": "1.1.3.15"
      }
  };
  jest.spyOn(logicalTerminationPoint, 'getServerLtpListAsync')
    .mockReturnValueOnce(["alt-2-0-1-http-c-tar-1-0-0-004"])
    .mockReturnValueOnce(["alt-2-0-1-tcp-c-tar-1-0-0-004"]);
  jest.spyOn(TcpClientInterface, 'getRemoteAddressAsync').mockReturnValue(remoteAddress);
  jest.spyOn(TcpClientInterface, 'getRemoteAddressAsync').mockReturnValue(remoteAddress);
  jest.spyOn(TcpClientInterface, 'getRemotePortAsync').mockReturnValue("3015");
  jest.spyOn(TcpClientInterface, 'getRemoteProtocolAsync').mockReturnValue("HTTPS");
  expect(await OperationClientInterface.getTcpClientConnectionInfoAsync("alt-2-0-1-op-c-im-tar-1-0-0-004"))
    .toBe("https://1.1.3.15:3015");
});

test("setOperationNameAsync", async () => {
  const res = await OperationClientInterface.setOperationNameAsync("alt-2-0-1-op-c-im-tar-1-0-0-004", "/v1/foo-bar");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    operationClientInterfaceConfigurationPath + "operation-name", "/v1/foo-bar", false
  );
  expect(res).toBeTruthy();
});

test("generateOperationClientUuidAsync", async () => {
  jest.spyOn(ControlConstruct, 'getUuidAsync').mockImplementation(() => "alt-2-0-2");
  expect(await OperationClientInterface.generateOperationClientUuidAsync("alt-2-0-1-http-c-tar-1-0-0-000", "im", "008"))
    .toBe("alt-2-0-2-op-c-im-tar-1-0-0-008");
});

test("createOperationClientInterface", async () => {
  expect(await OperationClientInterface.createOperationClientInterface("alt-2-0-1-http-c-es-1-0-0-000", "alt-2-0-1-op-c-im-tar-1-0-0-004", "/v1/foo-bar"))
    .toBeInstanceOf(logicalTerminationPoint);
});

test("isOperationClientAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(opC);
  expect(await OperationClientInterface.isOperationClientAsync("alt-2-0-1-op-c-im-tar-1-0-0-004"))
    .toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
