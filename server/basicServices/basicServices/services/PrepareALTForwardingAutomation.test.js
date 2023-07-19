const PrepareALTForwardingAutomation = require("./PrepareALTForwardingAutomation");
const ForwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const ControlConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');

jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/ControlConstruct');
jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');

let logicalTerminationPointConfigurationStatus = {
  operationClientConfigurationStatusList: [
    { uuid: "alt-2-0-1-op-c-bm-or-1-0-0-000", localId: "", updated: true },
    { uuid: "alt-2-0-1-op-c-bm-or-1-0-0-055", localId: "", updated: false }
  ],
  httpClientConfigurationStatus: {
    uuid: "alt-2-0-1-http-c-es-1-0-0-000", localId: "", updated: true
  },
  tcpClientConfigurationStatusList: [
    { uuid: "alt-2-0-1-tcp-c-es-1-0-0-055", localId: "", updated: false },
    { uuid: "alt-2-0-1-tcp-c-es-1-0-0-000", localId: "", updated: true }
  ]
};

let forwardingConstructConfigurationStatus = {
  forwardingConstructConfigurationStatusList: [
    { uuid: "alt-2-0-1-op-fc-bm-001", localId: "", updated: true },
    { uuid: "alt-2-0-1-op-fc-bm-055", localId: "", updated: false },
  ],
  fcPortConfigurationStatusList: [
    { uuid: "alt-2-0-1-op-fc-bm-055", localId: "523", updated: false },
    { uuid: "alt-2-0-1-op-fc-bm-001", localId: "102", updated: true },
  ]
};

let httpClientLtp = {
  "uuid": "alt-2-0-1-http-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
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
          "release-number": "1.0.0"
        }
      }
    }
  ]
};

let tcpClientLtp = {
  "uuid": "alt-2-0-1-tcp-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "alt-2-0-1-http-c-es-1-0-0-000"
  ],
  "server-ltp": [],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-client-interface-1-0:tcp-client-interface-pac": {
        "tcp-client-interface-configuration": {
          "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
          "remote-address": {
            "ip-address": {
              "ipv-4-address": "172.28.127.20"
            }
          },
          "remote-port": 9200
        }
      }
    }
  ]
};

let operationLtp = {
  "uuid": "alt-2-0-1-op-c-bm-or-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [],
  "server-ltp": [
    "alt-2-0-1-http-c-or-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
      "operation-client-interface-1-0:operation-client-interface-pac": {
        "operation-client-interface-configuration": {
          "operation-name": "/v1/bequeath-your-data-and-die",
          "operation-key": "Operation key not yet provided."
        },
        "operation-client-interface-status": {
          "operational-state": "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
          "life-cycle-state": "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
        }
      }
    }
  ]
};

let forwardingConstruct = {
  "uuid": "alt-2-0-1-op-fc-bm-001",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
    },
    {
      "value-name": "ForwardingName",
      "value": "PromptForEmbeddingCausesRequestForBequeathingData"
    }
  ],
  "fc-port": [
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "alt-2-0-1-op-s-bm-001"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "alt-2-0-1-op-c-bm-or-1-0-0-000"
    }
  ]
};

let fcPort = {
  "local-id": "102",
  "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
  "logical-termination-point": "alt-2-0-1-op-s-bm-002"
};

beforeEach(() => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(uuid => {
    if (uuid.includes("http-c")) {
      return httpClientLtp;
    } else if (uuid.includes("tcp-c")) {
      return tcpClientLtp;
    } else if (uuid.includes("op-c")) {
      return operationLtp;
    }
  });
  jest.spyOn(ForwardingDomain, 'getForwardingConstructAsync').mockReturnValue(forwardingConstruct);
  jest.spyOn(ForwardingConstruct, 'getFcPortAsync').mockReturnValue(fcPort);
});

test("getALTForwardingAutomationInputAsync -- response OK", async () => {
  let expected = [
    new ForwardingConstructAutomationInput("ServiceRequestCausesLtpUpdateRequest", httpClientLtp),
    new ForwardingConstructAutomationInput("ServiceRequestCausesLtpUpdateRequest", tcpClientLtp),
    new ForwardingConstructAutomationInput("ServiceRequestCausesLtpUpdateRequest", operationLtp),
    new ForwardingConstructAutomationInput("ServiceRequestCausesFcUpdateRequest", forwardingConstruct),
    new ForwardingConstructAutomationInput("ServiceRequestCausesFcPortUpdateRequest",
      { "fc-uuid": forwardingConstruct["uuid"], "fc-port": fcPort }
    )
  ];
  let res = await PrepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus, forwardingConstructConfigurationStatus);
  expect(res).toStrictEqual(expected);
  expect(res[2].attributeList["layer-protocol"][0]["operation-client-interface-1-0:operation-client-interface-pac"]["operation-client-interface-configuration"]["operation-key"]).toBeUndefined();
});

test("getALTForwardingAutomationInputAsync -- empty inputs", async () => {
  let logicalTerminationPointConfigurationStatusEmpty = {
    operationClientConfigurationStatusList: [],
    httpClientConfigurationStatus: undefined,
    tcpClientConfigurationStatusList: []
  };
  let forwardingConstructConfigurationStatusEmpty = {
    forwardingConstructConfigurationStatusList: [],
    fcPortConfigurationStatusList: []
  };
  let res = await PrepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatusEmpty, forwardingConstructConfigurationStatusEmpty);
  expect(res).toStrictEqual([]);
});

test("getALTUnConfigureForwardingAutomationInputAsync -- response OK", () => {
  let expected = [
    new ForwardingConstructAutomationInput("ServiceRequestCausesLtpDeletionRequest", { uuid: tcpClientLtp["uuid"] }),
  ];
  let res = PrepareALTForwardingAutomation.getALTUnConfigureForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus);
  expect(res).toStrictEqual(expected);
});

test("getALTUnConfigureForwardingAutomationInputAsync -- empty inputs", () => {
  let logicalTerminationPointConfigurationStatusEmpty = {
    operationClientConfigurationStatusList: [],
    httpClientConfigurationStatus: undefined,
    tcpClientConfigurationStatusList: []
  };
  let res = PrepareALTForwardingAutomation.getALTUnConfigureForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatusEmpty);
  expect(res).toStrictEqual([]);
});

test("getFDUnconfigureForwardingAutomationInputList -- response OK", () => {
  let expected = [
    new ForwardingConstructAutomationInput("ServiceRequestCausesFcPortDeletionRequest",
      { "fc-uuid": forwardingConstruct["uuid"], "fc-port-local-id": "102" }
    )
  ];
  let res = PrepareALTForwardingAutomation.getFDUnconfigureForwardingAutomationInputList(
    forwardingConstructConfigurationStatus);
  expect(res).toStrictEqual(expected);
});

test("getFDUnconfigureForwardingAutomationInputList -- empty inputs", () => {
  let forwardingConstructConfigurationStatusEmpty = {
    forwardingConstructConfigurationStatusList: [],
    fcPortConfigurationStatusList: []
  }
  let res = PrepareALTForwardingAutomation.getFDUnconfigureForwardingAutomationInputList(
    forwardingConstructConfigurationStatusEmpty
  );
  expect(res).toEqual([]);
});

test("getALTForwardingAutomationInputForOamRequestAsync -- tcp client", async () => {
  let expected = [
    new ForwardingConstructAutomationInput("OamRequestCausesLtpUpdateRequest", tcpClientLtp)
  ];
  let res = await PrepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
    "alt-2-0-1-tcp-c-es-1-0-0-000");
  expect(res).toStrictEqual(expected);
});

test("getALTForwardingAutomationInputForOamRequestAsync -- http client", async () => {
  let expected = [
    new ForwardingConstructAutomationInput("OamRequestCausesLtpUpdateRequest", httpClientLtp)
  ];
  let res = await PrepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
    "alt-2-0-1-http-c-es-1-0-0-000");
  expect(res).toStrictEqual(expected);
});

test("getALTForwardingAutomationInputForOamRequestAsync -- operation client", async () => {
  let expected = [
    new ForwardingConstructAutomationInput("OamRequestCausesLtpUpdateRequest", operationLtp)
  ];
  let res = await PrepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
    "alt-2-0-1-op-c-bm-or-1-0-0-000");
  expect(res).toStrictEqual(expected);
  expect(res[0].attributeList["layer-protocol"][0]["operation-client-interface-1-0:operation-client-interface-pac"]["operation-client-interface-configuration"]["operation-key"]).toBeUndefined();
});

afterEach(() => {
  jest.resetAllMocks();
});

