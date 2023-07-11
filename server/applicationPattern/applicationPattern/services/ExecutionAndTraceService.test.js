const ExecutionAndTraceService = require("./ExecutionAndTraceService");
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

let httpRequestHeader = {
  "content-type": "application/json",
  "customer-journey": "unknown",
  "operation-key": "Not yet defined.",
  "originator": "RegistryOffice",
  "trace-indicator": 1,
  "user": "dana"
};

beforeEach(() => {
  jest.spyOn(OperationClientInterface, 'getOperationKeyAsync').mockReturnValue("Not yet defined.");
  jest.spyOn(HttpServerInterface, 'getApplicationNameAsync').mockReturnValue("RegistryOffice");
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockReturnValue(fc);
})

test("recordServiceRequest -- response true, detailedLogging false", async () => {
  jest.spyOn(OperationClientInterface, 'getDetailedLoggingIsOnAsync').mockReturnValue(false);
  jest.spyOn(HttpServerInterface, 'getReleaseNumberAsync').mockReturnValue("2.0.1");
  response.status = "200";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);

  let res = await ExecutionAndTraceService.recordServiceRequest(
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  let httpRequestBody = {
    "x-correlator": "foo",
    "trace-indicator": "bar",
    "user": "dana",
    "originator": "RegistryOffice",
    "application-name": "RegistryOffice",
    "release-number": "2.0.1",
    "operation-name": "operation",
    "response-code": "200"
  };
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    httpRequestBody
  );
  expect(res).toBeTruthy();
});

test("recordServiceRequest -- response true, detailedLogging true", async () => {
  jest.spyOn(OperationClientInterface, 'getDetailedLoggingIsOnAsync').mockReturnValue(true);
  jest.spyOn(HttpServerInterface, 'getReleaseNumberAsync').mockReturnValue("2.0.1");
  response.status = "200";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);

  let res = await ExecutionAndTraceService.recordServiceRequest(
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  let httpRequestBody = {
    "x-correlator": "foo",
    "trace-indicator": "bar",
    "user": "dana",
    "originator": "RegistryOffice",
    "application-name": "RegistryOffice",
    "release-number": "2.0.1",
    "operation-name": "operation",
    "response-code": "200",
    "stringified-body": "\"\"",
    "stringified-response": "\"\""
  };
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    expect.objectContaining(httpRequestBody)
  );
  expect(res).toBeTruthy();
});

test("recordServiceRequestFromClient -- response true, detailedLogging false", async () => {
  jest.spyOn(OperationClientInterface, 'getDetailedLoggingIsOnAsync').mockReturnValue(false);
  response.status = "200";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);

  let res = await ExecutionAndTraceService.recordServiceRequestFromClient(
    "serverAppName", "1.0.5",
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  let httpRequestBody = {
    "x-correlator": "foo",
    "trace-indicator": "bar",
    "user": "dana",
    "originator": "RegistryOffice",
    "application-name": "serverAppName",
    "release-number": "1.0.5",
    "operation-name": "operation",
    "response-code": "200"
  };
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    httpRequestBody
  );
  expect(res).toBeTruthy();
});

test("recordServiceRequestFromClient -- response true, detailedLogging true", async () => {
  jest.spyOn(OperationClientInterface, 'getDetailedLoggingIsOnAsync').mockReturnValue(true);
  response.status = "200";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);

  let res = await ExecutionAndTraceService.recordServiceRequestFromClient(
    "serverAppName", "1.0.5",
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  let httpRequestBody = {
    "x-correlator": "foo",
    "trace-indicator": "bar",
    "user": "dana",
    "originator": "RegistryOffice",
    "application-name": "serverAppName",
    "release-number": "1.0.5",
    "operation-name": "operation",
    "response-code": "200",
    "stringified-body": "\"\"",
    "stringified-response": "\"\""
  };
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    expect.objectContaining(httpRequestBody)
  );
  expect(res).toBeTruthy();
});

test("recordServiceRequest -- status 500", async () => {
  jest.spyOn(HttpServerInterface, 'getReleaseNumberAsync').mockReturnValue("2.0.1");
  response.status = "500";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);
  let res = await ExecutionAndTraceService.recordServiceRequest(
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  expect(res).toBeFalsy();
});

test("recordServiceRequestFromClient -- status 500", async () => {
  response.status = "500";
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);
  let res = await ExecutionAndTraceService.recordServiceRequestFromClient(
    "serverAppName", "1.0.5",
    "foo", "bar", "dana", "RegistryOffice", "operation", "200", "", ""
  );
  expect(res).toBeFalsy();
});

afterEach(() => {
  jest.resetAllMocks();
});

