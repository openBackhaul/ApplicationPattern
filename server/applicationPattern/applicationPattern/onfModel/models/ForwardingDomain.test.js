const ForwardingDomain = require('./ForwardingDomain');
const ControlConstruct = require('./ControlConstruct');
const FcPort = require('./FcPort');

jest.mock('./ControlConstruct');

const forwardingConstruct = {
  "uuid": "eatl-2-0-1-op-fc-bm-000",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
    },
    {
      "value-name": "ForwardingName",
      "value": "PromptForRegisteringCausesRegistrationRequest"
    }
  ],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "eatl-2-0-1-op-s-bm-000"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "eatl-2-0-1-op-s-bm-000"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "eatl-2-0-1-op-c-bm-ro-2-0-1-000"
    }
  ]
};

const fcArray = [
  {
    "uuid": "eatl-2-0-1-op-fc-bm-001",
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
        "logical-termination-point": "eatl-2-0-1-op-s-bm-001"
      },
      {
        "local-id": "200",
        "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
        "logical-termination-point": "eatl-2-0-1-op-c-bm-or-1-0-0-000"
      }
    ]
  }
];

const fd = [
  {
    "uuid": "eatl-2-0-1-op-fd-000"
  }
];

beforeEach(() => {
  fcArray[0] = forwardingConstruct;
  fd[0]["forwarding-construct"] = fcArray;
  jest.spyOn(ControlConstruct, 'getForwardingDomainListAsync').mockImplementation(() => fd);
})

test("getForwardingConstructListAsync", async () => {
  expect(await ForwardingDomain.getForwardingConstructListAsync()).toStrictEqual(fcArray);
});

test("getForwardingConstructListForTheFcPortAsync", async () => {
  expect(await ForwardingDomain.getForwardingConstructListForTheFcPortAsync(
    "eatl-2-0-1-op-c-bm-ro-2-0-1-000", FcPort.portDirectionEnum.OUTPUT
  )).toStrictEqual([forwardingConstruct]);
});

test("getForwardingConstructAsync", async () => {
  expect(await ForwardingDomain.getForwardingConstructAsync("eatl-2-0-1-op-fc-bm-000"))
    .toStrictEqual(forwardingConstruct);
  expect(await ForwardingDomain.getForwardingConstructAsync("eatl")).toBeUndefined();
});

test("getForwardingConstructForTheForwardingNameAsync", async () => {
  expect(await ForwardingDomain
    .getForwardingConstructForTheForwardingNameAsync("PromptForRegisteringCausesRegistrationRequest"))
    .toStrictEqual(forwardingConstruct);
  expect(await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync("Prompt")).toBeUndefined();
});

test("getForwardingDomainUuidAsync", async () => {
  expect(await ForwardingDomain
    .getForwardingDomainUuidAsync("eatl-2-0-1-op-fc-bm-000")).toBe("eatl-2-0-1-op-fd-000");
  expect(await ForwardingDomain.getForwardingDomainUuidAsync("invalid-uuid")).toBeUndefined();
});

afterEach(() => {
  jest.resetAllMocks();
});
