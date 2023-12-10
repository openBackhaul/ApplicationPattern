const AuthorizingService = require("./AuthorizingService");
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
  status: "",
  data: { 
    "oam-request-is-approved": true
  }
};

let httpRequestHeader = {
  "content-type": "application/json",
  "customer-journey": "unknown",
  "operation-key": "Not yet defined.",
  "originator": "RegistryOffice",
  "trace-indicator": 1,
  "user": "dana"
};

let httpRequestBody = {
  "Authorization": "Base ZGFuYTp0ZXN0=",
  "application-name": "RegistryOffice",
  "method": "PUT",
  "release-number": "2.0.1"
};

beforeEach(() => {
  jest.spyOn(OperationClientInterface, 'getOperationKeyAsync').mockReturnValue("Not yet defined.");
  jest.spyOn(HttpServerInterface, 'getApplicationNameAsync').mockReturnValue("RegistryOffice");
  jest.spyOn(HttpServerInterface, 'getReleaseNumberAsync').mockReturnValue("2.0.1");
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
});

test("isAuthorized -- response true", async () => {
  response.status = 200;
  jest.spyOn(RequestBuilder, 'BuildAndTriggerRestRequest').mockReturnValue(response);
  let res = await AuthorizingService.isAuthorized("Base ZGFuYTp0ZXN0=", "PUT");
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    expect.objectContaining(httpRequestBody)
  );
  expect(res).toStrictEqual({"isAuthorized": true});
});

test("isAuthorized -- status 408", async () => {
  response.status = 408;
  jest.spyOn(RequestBuilder, "BuildAndTriggerRestRequest").mockReturnValue(response);
  let res = await AuthorizingService.isAuthorized("Base ZGFuYTp0ZXN0=", "PUT");
  expect(res).toStrictEqual({"isAuthorized": false, "status": 408, "message": "Application that authenticates the OAM request is down." + 
  "Therefore, authentication is not verified. Please try again later."});
});

test("isAuthorized -- status 403", async () => {
  response.status = 200;
  response.data["oam-request-is-approved"] = false;
  response.data["reason-of-objection"] = "METHOD_NOT_ALLOWED";
  jest.spyOn(RequestBuilder, "BuildAndTriggerRestRequest").mockReturnValue(response);
  let res = await AuthorizingService.isAuthorized("Base ZGFuYTp0ZXN0=", "PUT");
  expect(res).toStrictEqual({"isAuthorized": false, "status": 403 });
});

test("isAuthorized -- authorization error", async () => {
  let res = await AuthorizingService.isAuthorized("ZGFuYTp0ZXN0=", "PUT");
  httpRequestHeader.user = "RegistryOffice";
  httpRequestBody.Authorization = "ZGFuYTp0ZXN0=";
  expect(RequestBuilder.BuildAndTriggerRestRequest).toHaveBeenCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005",
    "POST",
    expect.objectContaining(httpRequestHeader),
    expect.objectContaining(httpRequestBody)
  );
  expect(res).toStrictEqual({"isAuthorized": false});
});

afterEach(() => {
  jest.resetAllMocks();
});

