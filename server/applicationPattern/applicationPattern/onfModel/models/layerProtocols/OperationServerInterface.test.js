const OperationServerInterface = require("./OperationServerInterface");
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');

jest.mock('../../../databaseDriver/JSONDriver');
jest.mock('../ControlConstruct');

const opS = {
  "uuid": "alt-2-0-1-op-s-is-022",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
  "client-ltp": [],
  "server-ltp": [
    "alt-2-0-1-http-s-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-server-interface-1-0:operation-server-interface-pac": {
        "operation-server-interface-capability": {
          "operation-name": "/v1/notify-link-updates"
        },
        "operation-server-interface-configuration": {
          "life-cycle-state": "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
          "operation-key": "Operation key not yet provided."
        }
      }
    }
  ]
};

const opSNewVersion = {
  "uuid" : "alt-2-0-1-op-s-is-022",
  "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
  "client-ltp" : [ ],
  "server-ltp" : [
    "alt-2-0-1-http-s-000"
  ],
  "layer-protocol" : [
    {
      "local-id" : "0",
      "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-server-interface-1-0:operation-server-interface-pac" : {
        "operation-server-interface-capability" : {
          "operation-name" : "/v2/notify-link-updates"
        },
        "operation-server-interface-configuration" : {
          "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
          "operation-key" : "Operation key not yet provided."
        }
      }
    }
  ]
}

const operationServerInterfaceConfigurationPath = "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-op-s-is-022/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-configuration/";

beforeEach(() => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => opS);
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getOperationNameAsync", async () => {
  expect(await OperationServerInterface.getOperationNameAsync("alt-2-0-1-op-s-is-022")).toBe("/v1/notify-link-updates");
});

test("getNextVersionOfOperationNameIfExists", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [opS, opSNewVersion]);
  expect(await OperationServerInterface.getNextVersionOfOperationNameIfExists("/v2/notify-link-updates")).toBeUndefined();
});

test("getAllOperationServerNameAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [opS, opSNewVersion]);
  expect(await OperationServerInterface.getAllOperationServerNameAsync()).toStrictEqual(["/v1/notify-link-updates", "/v2/notify-link-updates"]);
});

test("getOperationKeyAsync", async () => {
  expect(await OperationServerInterface.getOperationKeyAsync("alt-2-0-1-op-s-is-022")).toBe("Operation key not yet provided.");
});

test("setOperationKeyAsync", async () => {
  const res = await OperationServerInterface.setOperationKeyAsync("alt-2-0-1-op-s-is-022", "foo-bar");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    operationServerInterfaceConfigurationPath + "operation-key", "foo-bar", false
  );
  expect(res).toBeTruthy();
});

test("getLifeCycleState", async () => {
  expect(await OperationServerInterface.getLifeCycleState("alt-2-0-1-op-s-is-022")).toBe("EXPERIMENTAL");
});

test("getOperationServerUuidAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [opS, opSNewVersion]);
  expect(await OperationServerInterface.getOperationServerUuidAsync("/v1/notify-link-updates")).toBe("alt-2-0-1-op-s-is-022");
});

test("isOperationServerAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(opS);
  expect(await OperationServerInterface.isOperationServerAsync("alt-2-0-1-op-s-is-022"))
    .toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
