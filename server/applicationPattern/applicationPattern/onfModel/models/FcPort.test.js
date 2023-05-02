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

afterEach(() => {
  jest.resetAllMocks();
});
