const HttpClientInterface = require("./HttpClientInterface");
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');
const ForwardingDomain = require("../ForwardingDomain");
const LogicalTerminationPoint = require("../LogicalTerminationPoint");

jest.mock('../LogicalTerminationPoint');
jest.mock('../../../databaseDriver/JSONDriver');
jest.mock('../ControlConstruct');

const httpC = {
  "uuid": "alt-2-0-1-http-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "alt-2-0-1-es-c-es-1-0-0-000"
  ],
  "server-ltp": [
    "alt-2-0-1-tcp-c-es-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
      "http-client-interface-1-0:http-client-interface-pac": {
        "http-client-interface-configuration": {
          "application-name": "ElasticSearch",
          "release-number": "1.0.1"
        }
      }
    }
  ]
};

const or = {
  "uuid": "tar-2-0-1-http-c-or-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "tar-2-0-1-op-c-bm-or-1-0-0-000"
  ],
  "server-ltp": [
    "tar-2-0-1-tcp-c-or-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
      "http-client-interface-1-0:http-client-interface-pac": {
        "http-client-interface-configuration": {
          "application-name": "ElasticSearch",
          "release-number": "1.0.0"
        }
      }
    }
  ]
};

const nr = {
  "uuid": "tar-2-0-1-http-c-nr-2-0-1-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "tar-2-0-1-op-c-im-nr-2-0-1-000",
    "tar-2-0-1-op-c-is-nr-2-0-1-000"
  ],
  "server-ltp": [
    "tar-2-0-1-tcp-c-nr-2-0-1-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
      "http-client-interface-1-0:http-client-interface-pac": {
        "http-client-interface-configuration": {
          "application-name": "ElasticSearch",
          "release-number": "1.0.2"
        }
      }
    }
  ]
};

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

const httpClientInterfaceConfigurationPath = "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/";

beforeEach(() => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => httpC);
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getApplicationNameAsync", async () => {
  expect(await HttpClientInterface.getApplicationNameAsync("alt-2-0-1-http-c-es-1-0-0-000")).toBe("ElasticSearch");
});

test("getHttpClientUuidFromForwarding", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
  jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockImplementation(() => ["alt-2-0-1-http-c-es-1-0-0-000"]);
  expect(await HttpClientInterface.getHttpClientUuidFromForwarding("foobar"))
    .toBe("alt-2-0-1-http-c-es-1-0-0-000");
});

test("getReleaseNumberAsync", async () => {
  expect(await HttpClientInterface.getReleaseNumberAsync("alt-2-0-1-http-c-es-1-0-0-000")).toBe("1.0.1");
});

test("getHttpClientUuidAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [httpC]);
  expect(await HttpClientInterface.getHttpClientUuidAsync("ElasticSearch", "1.0.1")).toBe("alt-2-0-1-http-c-es-1-0-0-000");
});

test("isApplicationExists", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [httpC]);
  expect(await HttpClientInterface.isApplicationExists("ElasticSearch", "1.0.1")).toBeTruthy();
  expect(await HttpClientInterface.isApplicationExists("ElasticSearch", "1.0.2")).toBeFalsy();
});

describe("getHttpClientUuidExcludingOldReleaseAndNewRelease", () => {

  beforeEach(() => {
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockReturnValue([or, nr, httpC]);
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync')
      .mockReturnValueOnce(["tar-2-0-1-http-c-or-1-0-0-000"])
      .mockReturnValueOnce(["tar-2-0-1-http-c-nr-2-0-1-000"]);
  });

  test("valid http client uuid", async () => {
    expect(await HttpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease("ElasticSearch", "1.0.1", "foo")).toBe("alt-2-0-1-http-c-es-1-0-0-000");
  });

  test("OR http client uuid", async () => {
    expect(await HttpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease("ElasticSearch", "1.0.0", "foo")).toBeUndefined();
  });

  test("NR http client uuid", async () => {
    expect(await HttpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease("ElasticSearch", "1.0.2", "foo")).toBeUndefined();
  });

  test("no release number", async () => {
    expect(await HttpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease("ElasticSearch", undefined, "foo")).toBe("alt-2-0-1-http-c-es-1-0-0-000");
  });

  test("only release number matches", async () => {
    expect(await HttpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease("ApplicationLayerTopology", "1.0.1", "foo")).toBeUndefined();
  });
});

test("setReleaseNumberAsync", async () => {
  const res = await HttpClientInterface.setReleaseNumberAsync("alt-2-0-1-http-c-es-1-0-0-000", "1.0.2");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    httpClientInterfaceConfigurationPath + "release-number", "1.0.2", false
  );
  expect(res).toBeTruthy();
});

test("setApplicationNameAsync", async () => {
  const res = await HttpClientInterface.setApplicationNameAsync("alt-2-0-1-http-c-es-1-0-0-000", "ElasticSearchTest");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    httpClientInterfaceConfigurationPath + "application-name", "ElasticSearchTest", false
  );
  expect(res).toBeTruthy();
});

test("createHttpClientInterface", async () => {
  expect(await HttpClientInterface.createHttpClientInterface("alt-2-0-1-http-c-es-1-0-0-000", [], [], "ElasticSearchTest", "1.5.6"))
    .toBeInstanceOf(logicalTerminationPoint);
});

test("generateHttpClientUuidAsync", async () => {
  expect(await HttpClientInterface.generateHttpClientUuidAsync("ElasticSearchTest", "1.5.6")).toBe("undefined-http-c-est-1-5-6-000");
});

test("generateHttpClientUuidAsync", async () => {
  expect(await HttpClientInterface.generateHttpClientUuidAsync("ELsTiCSeArcHTest", "1.5.6")).toBe("undefined-http-c-eltcsa-1-5-6-000");
});

afterEach(() => {
  jest.resetAllMocks();
});
