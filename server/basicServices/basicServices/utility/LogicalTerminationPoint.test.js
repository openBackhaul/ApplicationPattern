const ServiceUtils = require("./LogicalTerminationPoint");
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const HttpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

const fc = {
  "uuid": "ol-2-0-1-op-fc-bm-107",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
    },
    {
      "value-name": "ForwardingName",
      "value": "PromptingEtc"
    }
  ],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ol-2-0-1-op-s-bm-001"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "ol-2-0-1-op-s-bm-007"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ol-2-0-1-op-c-bm-ro-2-0-1-003"
    }
  ]
};

test("resolveApplicationNameFromForwardingAsync", async () => {
  ForwardingDomain.getForwardingConstructForTheForwardingNameAsync.mockReturnValue(fc);
  LogicalTerminationPoint.getServerLtpListAsync.mockReturnValue(["ol-2-0-1-http-c-ro-2-0-1-000"]);
  HttpClientInterface.getApplicationNameAsync.mockReturnValue("RegistryOffice");

  expect(await ServiceUtils.resolveApplicationNameFromForwardingAsync("PromptingEtc")).toBe("RegistryOffice");
  expect(ForwardingDomain.getForwardingConstructForTheForwardingNameAsync).toBeCalledWith("PromptingEtc");
  expect(LogicalTerminationPoint.getServerLtpListAsync).toBeCalledWith("ol-2-0-1-op-c-bm-ro-2-0-1-003");
  expect(HttpClientInterface.getApplicationNameAsync).toBeCalledWith("ol-2-0-1-http-c-ro-2-0-1-000");
});


