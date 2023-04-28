const ForwardingConstructAutomationServices = require("./ForwardingConstructAutomationServices");
const ForwardingDomain = require('../models/ForwardingDomain');
const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
const eventDispatcher = require('../../rest/client/eventDispatcher');

jest.mock('../models/ForwardingDomain');
jest.mock('../models/layerProtocols/OperationServerInterface');
jest.mock('../../rest/client/eventDispatcher');

beforeEach(() => {

})

const fc = {
  "uuid" : "ol-2-0-1-op-fc-bm-010",
  "name" : [
    {
      "value-name" : "ForwardingKind",
      "value" : "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
    },
    {
      "value-name" : "ForwardingName",
      "value" : "ServiceRequestCausesFcPortDeletionRequest"
    }
  ],
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
};

test("automateForwardingConstructAsync", async () => {
  const forwardingAutomationInputList = [{
    forwardingName: "fwName",
    attributeList: [],
    context: "ol-2-0-1"
  }];
  jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => "ol-2-0-1-op-s-bm-004");
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
  await ForwardingConstructAutomationServices.automateForwardingConstructAsync(
    "/v1/register-yourself", forwardingAutomationInputList, "", "", "1", ""
  );
  expect(eventDispatcher.dispatchEvent).toBeCalledWith(
    "ol-2-0-1-op-c-bm-alt-1-0-0-005", [], "", "", "1.1", ""
  );
});

afterEach(() => {
  jest.resetAllMocks();
});
