const controlConstruct = require('./ControlConstruct');
const LayerProtocol = require('./LayerProtocol');

jest.mock('./ControlConstruct');

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
    }
  ]
};

describe("getLayerProtocolName", () => {
  test("valid uuid", async () => {
    controlConstruct.getLogicalTerminationPointAsync.mockResolvedValue(ltp);
    expect(await LayerProtocol.getLayerProtocolName("eatl-2-0-1-op-s-bm-000")).toBe(
      "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER"
    );
  });

  test("invalid uuid", async () => {
    controlConstruct.getLogicalTerminationPointAsync.mockResolvedValue(undefined);
    expect(await LayerProtocol.getLayerProtocolName("eatl-2-0-1-op-s-bm-001")).toBeUndefined();
  });
});

