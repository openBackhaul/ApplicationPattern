const ForwardingConstruct = require('./ForwardingConstruct')
const fileOperation = require('../../databaseDriver/JSONDriver');
const ForwardingDomain = require('./ForwardingDomain');

jest.mock('../../databaseDriver/JSONDriver');
jest.mock('./ForwardingDomain');

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
  jest.spyOn(fileOperation, 'deletefromDatabaseAsync').mockImplementation(() => true);
})

const fc = {
  "uuid": "alt-2-0-1-op-fc-bm-107",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
    },
    {
      "value-name": "ForwardingName",
      "value": "PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation"
    }
  ],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "alt-2-0-1-op-s-bm-001"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "alt-2-0-1-op-s-bm-007"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "alt-2-0-1-op-c-bm-ro-2-0-1-003"
    }
  ]
};

const fcPort = {
  "local-id": "001",
  "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
  "logical-termination-point": "alt-2-0-1-op-s-bm-001"
};

test("getFcPortAsync", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingConstructAsync').mockImplementation(() => fc);
  expect(await ForwardingConstruct.getFcPortAsync("alt-2-0-1-op-fc-bm-107", "100")).toStrictEqual({
    "local-id": "100",
    "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
    "logical-termination-point": "alt-2-0-1-op-s-bm-007"
  });
});

test("getOutputFcPortsAsync", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingConstructAsync').mockImplementation(() => fc);
  expect(await ForwardingConstruct.getOutputFcPortsAsync("alt-2-0-1-op-fc-bm-107")).toStrictEqual([{
    "local-id": "200",
    "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
    "logical-termination-point": "alt-2-0-1-op-c-bm-ro-2-0-1-003"
  }]);
});

test("isFcPortExists", () => {
  expect(ForwardingConstruct.isFcPortExists(fc, "alt-2-0-1-op-c-bm-ro-2-0-1-003")).toBeTruthy();
  expect(ForwardingConstruct.isFcPortExists(fc, "alt-2-0-1-op-c-bm-ro-2-0-1-010")).toBeFalsy();
  expect(ForwardingConstruct.isFcPortExists(fc, undefined)).toBeFalsy();
});

test("addFcPortAsync", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingDomainUuidAsync').mockImplementation(() => "fw-domain-uuid");
  const res = await ForwardingConstruct.addFcPortAsync("alt-2-0-1-op-fc-bm-107", fcPort);
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/forwarding-domain=fw-domain-uuid/forwarding-construct=alt-2-0-1-op-fc-bm-107/fc-port",
    fcPort, true
  );
  expect(res).toBeTruthy();
});

test("deleteFcPortAsync", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingDomainUuidAsync').mockImplementation(() => "fw-domain-uuid");
  const res = await ForwardingConstruct.deleteFcPortAsync("alt-2-0-1-op-fc-bm-107", "201");
  expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/forwarding-domain=fw-domain-uuid/forwarding-construct=alt-2-0-1-op-fc-bm-107/fc-port=201");
  expect(res).toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
