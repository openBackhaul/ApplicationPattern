const ControlConstruct = require('./ControlConstruct')
const fileOperation = require('../../databaseDriver/JSONDriver');
const LayerProtocol = require('./LayerProtocol');

jest.mock('../../databaseDriver/JSONDriver');

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
  jest.spyOn(fileOperation, 'deletefromDatabaseAsync').mockImplementation(() => true);
  ltps[0] = ltp;
})

const ltp = {
  "uuid": "eatl-2-0-1-op-s-bm-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
  "client-ltp": [
  ],
  "server-ltp": [
    "eatl-2-0-1-http-s-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-server-interface-1-0:operation-server-interface-pac": {
        "operation-server-interface-capability": {
          "operation-name": "/v1/register-yourself"
        },
        "operation-server-interface-configuration": {
          "life-cycle-state": "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
          "operation-key": "Operation key not yet provided."
        }
      }
    }
  ]
};

const ltps = [
  {
    "uuid": "eatl-2-0-1-op-c-im-nr-2-0-1-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp": [
    ],
    "server-ltp": [
      "eatl-2-0-1-http-c-nr-2-0-1-000"
    ],
    "layer-protocol": [
      {
        "local-id": "0",
        "layer-protocol-name": "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac": {
          "operation-client-interface-configuration": {
            "operation-name": "/v1/regard-application",
            "operation-key": "Operation key not yet provided."
          },
          "operation-client-interface-status": {
            "operational-state": "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state": "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      }
    ]
  }
];

test("getLogicalTerminationPointListAsync", async () => {
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ltps);
  expect(await ControlConstruct.getLogicalTerminationPointListAsync(LayerProtocol.layerProtocolNameEnum.OPERATION_SERVER))
    .toStrictEqual([ltp]);
    expect(await ControlConstruct.getLogicalTerminationPointListAsync(undefined))
    .toStrictEqual(ltps);
});

test("getLogicalTerminationPointAsync", async () => {
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ltps);
  expect(await ControlConstruct.getLogicalTerminationPointAsync("eatl-2-0-1-op-s-bm-000"))
    .toStrictEqual(ltp);
  expect(await ControlConstruct.getLogicalTerminationPointAsync(undefined))
    .toBeUndefined();
});


test("addLogicalTerminationPointAsync", async () => {
  const res = await ControlConstruct.addLogicalTerminationPointAsync(ltp);
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/logical-termination-point", ltp, true
  );
  expect(res).toBeTruthy();
});

test("deleteLogicalTerminationPointAsync", async () => {
  const res = await ControlConstruct.deleteLogicalTerminationPointAsync("eatl-2-0-1-op-s-bm-000");
  expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/logical-termination-point=eatl-2-0-1-op-s-bm-000");
  expect(res).toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
