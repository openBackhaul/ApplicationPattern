const HttpClientInterface = require("./HttpClientInterface");
const logicalTerminationPoint = require('../LogicalTerminationPoint');
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');

jest.mock('../LogicalTerminationPoint');
jest.mock('../../../databaseDriver/JSONDriver');
jest.mock('../ControlConstruct');

const httpC = {
    "uuid" : "alt-2-0-1-http-c-es-1-0-0-000",
    "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
    "client-ltp" : [
      "alt-2-0-1-es-c-es-1-0-0-000"
    ],
    "server-ltp" : [
      "alt-2-0-1-tcp-c-es-1-0-0-000"
    ],
    "layer-protocol" : [
      {
        "local-id" : "0",
        "layer-protocol-name" : "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac" : {
          "http-client-interface-configuration" : {
            "application-name" : "ElasticSearch",
            "release-number" : "1.0.0"
          }
        }
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

test("getReleaseNumberAsync", async () => {
    expect(await HttpClientInterface.getReleaseNumberAsync("alt-2-0-1-http-c-es-1-0-0-000")).toBe("1.0.0");
});

test("getHttpClientUuidAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [httpC]);
  expect(await HttpClientInterface.getHttpClientUuidAsync("ElasticSearch", "1.0.0")).toBe("alt-2-0-1-http-c-es-1-0-0-000");
});

test("isApplicationExists", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [httpC]);
  expect(await HttpClientInterface.isApplicationExists("ElasticSearch", "1.0.0")).toBeTruthy();
  expect(await HttpClientInterface.isApplicationExists("ElasticSearch", "1.0.2")).toBeFalsy();
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

afterEach(() => {
  jest.resetAllMocks();
});