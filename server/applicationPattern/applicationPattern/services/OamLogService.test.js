const OamLogService = require("./OamLogService");
const OperationClientInterface = require('../onfModel/models/layerProtocols/OperationClientInterface');
const HttpServerInterface = require('../onfModel/models/layerProtocols/HttpServerInterface');
const RequestBuilder = require('../rest/client/RequestBuilder');
const ForwardingDomain = require('../onfModel/models/ForwardingDomain');

jest.mock('../onfModel/models/ForwardingDomain');
jest.mock('../onfModel/models/layerProtocols/OperationClientInterface');
jest.mock('../onfModel/models/layerProtocols/HttpServerInterface');
jest.mock('../rest/client/RequestBuilder');

let fc = {
  "fc-port": [
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ol-2-0-1-op-c-bm-alt-1-0-0-005"
    }
  ]
};

let response = {
  status: ""
};

beforeEach(() => {
  jest.spyOn(OperationClientInterface, 'getOperationKeyAsync').mockReturnValue("Not yet defined.");
  jest.spyOn(HttpServerInterface, 'getApplicationNameAsync').mockReturnValue("RegistryOffice");
  jest.spyOn(HttpServerInterface, 'getReleaseNumberAsync').mockReturnValue("2.0.1");
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
})

test("recordOamRequest -- response true", async () => {
  response.status = "200";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);

  let res = await OamLogService.recordOamRequest(
    "{ testbody: foo }", {}, "200", "Base ZGFuYTp0ZXN0=", "PUT"
  );
  let httpRequestHeader = {
    "content-type": "application/json",
    "customer-journey": "unknown",
    "operation-key": "Not yet defined.",
    "originator": "RegistryOffice",
    "trace-indicator": 1,
    "user": "dana"
  };
  let httpRequestBody = {
    "application-name": "RegistryOffice",
    "method": "PUT",
    "release-number": "2.0.1",
    "resource": "{ testbody: foo }",
    "response-code": "200",
    "stringified-body": "{}",
    "user-name": "dana",
  };
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    expect.objectContaining(httpRequestBody)
  );
  expect(res).toBeTruthy();
});

test("recordOamRequest -- status 500", async () => {
  response.status = "500";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);
  let res = await OamLogService.recordOamRequest(
    "{ testbody: foo }", {}, "200", "Base ZGFuYTp0ZXN0=", "PUT"
  );
  expect(res).toBeFalsy();
});

test("recordOamRequest -- undefined fc", async () => {
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => undefined);
  let res = await OamLogService.recordOamRequest(
    "{ testbody: foo }", {}, "200", "Base ZGFuYTp0ZXN0=", "PUT"
  );
  expect(res).toBeFalsy();
});

test("recordOamRequest -- authorization error", async () => {
  let res = await OamLogService.recordOamRequest(
    "{ testbody: foo }", {}, "200", "ZGFuYTp0ZXN0=", "PUT"
  );
  expect(res).toBeFalsy();
});

afterEach(() => {
  jest.resetAllMocks();
});

