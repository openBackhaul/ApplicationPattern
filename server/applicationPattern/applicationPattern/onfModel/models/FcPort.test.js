const FcPort = require('./FcPort')
const fileOperation = require('../../databaseDriver/JSONDriver');
const ForwardingDomain = require('./ForwardingDomain');

jest.mock('../../databaseDriver/JSONDriver');
jest.mock('./ForwardingDomain');

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

const fc =  {
  "fc-port" : [
    {
      "local-id" : "000",
      "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point" : "alt-2-0-1-op-s-bm-001"
    },
    {
      "local-id" : "200",
      "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point" : "alt-2-0-1-op-c-bm-ro-2-0-1-003"
    },
    {
      "local-id" : "201",
      "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point" : "alt-2-0-1-op-c-bm-ro-2-0-1-004"
    }
  ]
};

const issue814 = {
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "alt-2-0-1-op-s-is-022",
    },
    {
      "local-id": "001",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "alt-2-0-1-op-s-bm-004",
    },
    {
      "local-id": "101",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "alt-2-0-1-op-s-is-018",
    },
    {
      "local-id": "102",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "alt-2-0-1-op-s-is-019",
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "alt-2-0-1-op-c-is-okm-1-0-0-002",
    },
  ],
};

const fcZero =  {
  "fc-port" : [
    {
      "local-id" : "000",
      "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point" : "alt-2-0-1-op-s-bm-001"
    }
  ]
};

test("generateNextLocalId", () => {
  expect(FcPort.generateNextLocalId(fc)).toBe("202");
  expect(FcPort.generateNextLocalId(fcZero)).toBe("200");
  expect(FcPort.generateNextLocalId(issue814)).toBe("201");
});

test("getLocalId", () => {
  expect(FcPort.getLocalId(fc, "alt-2-0-1-op-s-bm-001")).toBe("000");
  expect(FcPort.getLocalId(fc, "alt-2-0-1-op-c-bm-ro-2-0-1-003")).toBe("200");
  expect(FcPort.getLocalId(fc, "alt-2-0-1-op-s-bm-020")).toBeUndefined();
});

test("setLogicalTerminationPointAsync", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingDomainUuidAsync').mockImplementation(() => "fw-domain-uuid");
  const res = await FcPort.setLogicalTerminationPointAsync("alt-2-0-1-op-fc-bm-107", "201", "alt-2-0-1-op-c-bm-ro-2-0-1-005");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/forwarding-domain=fw-domain-uuid/forwarding-construct=alt-2-0-1-op-fc-bm-107/fc-port=201/logical-termination-point",
    "alt-2-0-1-op-c-bm-ro-2-0-1-005", false
  );
  expect(res).toBeTruthy();
});

test("isOperationOfFcPortType", async () => {
    const fc = {
        "fc-port" : [
            {
              "local-id" : "000",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
              "logical-termination-point" : "ol-2-0-1-op-s-bm-009"
            },
            {
              "local-id" : "100",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
              "logical-termination-point" : "ol-2-0-1-op-s-bm-004"
            },
            {
              "local-id" : "200",
              "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
              "logical-termination-point" : "ol-2-0-1-op-c-bm-alt-1-0-0-005"
            }
        ]
    }
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-009", FcPort.portDirectionEnum.MANAGEMENT)
    ).toBeTruthy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-009", FcPort.portDirectionEnum.INPUT)
    ).toBeFalsy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-s-bm-004", FcPort.portDirectionEnum.INPUT)
    ).toBeTruthy();
    expect(FcPort.isOperationOfFcPortType(
        fc, "ol-2-0-1-op-c-bm-alt-1-0-0-005", FcPort.portDirectionEnum.OUTPUT)
    ).toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
