const ForwardingConstructAutomationServices = require('./ForwardingConstructConfigurationServices');
const ForwardingConstructConfigurationStatus = require('./models/forwardingConstruct/ConfigurationStatus');
const ControlConstruct = require('../models/ControlConstruct');
const ForwardingDomain = require('../models/ForwardingDomain');
const fcPort = require('../models/FcPort');
const fileOperation = require('../../databaseDriver/JSONDriver');

const ltps = [
  {
    "uuid": "ro-2-0-1-op-s-bm-001",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
    "client-ltp": [
    ],
    "server-ltp": [
      "ro-2-0-1-http-s-000"
    ],
    "layer-protocol": [
      {
        "local-id": "0",
        "layer-protocol-name": "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac": {
          "operation-server-interface-capability": {
            "operation-name": "/v1/embed-yourself"
          },
          "operation-server-interface-configuration": {
            "life-cycle-state": "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key": "Operation key not yet provided."
          }
        }
      }
    ]
  }
];

const ltp = ltps[0];

const fcArray = [
  {
    uuid: 'ro-2-0-1-op-fc-bm-106',
    name: [
      {
        'value-name': 'ForwardingKind',
        value: 'core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET'
      },
      {
        'value-name': 'ForwardingName',
        value: 'PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease'
      }
    ],
    'fc-port': [
      {
        'local-id': '000',
        'port-direction': 'core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT',
        'logical-termination-point': 'ro-2-0-1-op-s-bm-001'
      },
      {
        'local-id': '100',
        'port-direction': 'core-model-1-4:PORT_DIRECTION_TYPE_INPUT',
        'logical-termination-point': 'ro-2-0-1-op-s-im-000'
      },
      {
        'local-id': '200',
        'port-direction': 'core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT',
        'logical-termination-point': 'ro-2-0-1-op-c-bm-ro-2-0-1-002'
      }
    ]
  }
];

const fc = fcArray[0];

const forwardingConfigurationInputList = [
  {
    forwardingName: 'PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease',
    operationClientUuid: 'ro-2-0-1-op-c-bm-ro-2-0-1-002'
  },
  {
    forwardingName: 'PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement',
    operationClientUuid: 'ro-2-0-1-op-c-bm-ro-2-0-1-001'
  },
  {
    forwardingName: 'PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation',
    operationClientUuid: 'ro-2-0-1-op-c-bm-ro-2-0-1-003'
  }
];

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
  jest.spyOn(fileOperation, 'deletefromDatabaseAsync').mockImplementation(() => true);
  ltps[0] = ltp;
})

test("configureForwardingConstructAsync", async () => {
  const operationServerName = '/v1/embed-yourself';
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
  jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
  jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

  const res = await ForwardingConstructAutomationServices.configureForwardingConstructAsync(
    operationServerName, forwardingConfigurationInputList);
  expect(res).toBeInstanceOf(ForwardingConstructConfigurationStatus);
});

test("unConfigureForwardingConstructAsync", async () => {
  const operationServerName = '/v1/embed-yourself';
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
  jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => fc);
  jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

  const res = await ForwardingConstructAutomationServices.unConfigureForwardingConstructAsync(
    operationServerName, forwardingConfigurationInputList);
  expect(res).toBeInstanceOf(ForwardingConstructConfigurationStatus);
});

afterEach(() => {
  jest.resetAllMocks();
});
