const ForwardingConstructConfigurationServices = require('./ForwardingConstructConfigurationServices');
const ForwardingConstructConfigurationStatus = require('./models/forwardingConstruct/ConfigurationStatus');
const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
const ForwardingDomain = require('../models/ForwardingDomain');
const ConfigurationStatus = require('./models/ConfigurationStatus');
const ForwardingConstruct = require('../models/ForwardingConstruct');
const LogicalTerminationPoint = require('../models/LogicalTerminationPoint');
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const fcPort = require('../models/FcPort');

const fc = {
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
};

const fcForSubscription = {
  "uuid": "ro-2-0-1-op-fc-is-007",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION"
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
      "logical-termination-point": "ro-2-0-1-op-s-is-008"
    },
    {
      "local-id": "001",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ro-2-0-1-op-s-bm-004"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "ro-2-0-1-op-s-is-003"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-eatl-1-0-0-003"
    },
    {
      "local-id": "201",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-ol-1-0-0-003"
    },
    {
      "local-id": "202",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-aa-1-0-0-003"
    },
    {
      "local-id": "203",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-alt-1-0-0-003"
    },
    {
      "local-id": "204",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-okm-1-0-0-003"
    }
  ]
};

const fcListArray = [{
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
}];
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
const forwardingUnConfigurationInputList = [
  {
    forwardingName: 'PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease',
    operationClientUuid: 'ro-2-0-1-op-c-bm-ro-2-0-1-002'
  },
  {
    forwardingName: 'PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement',
    operationClientUuid: 'ro-2-0-1-op-c-bm-ro-2-0-1-001'
  },
  {
    forwardingName: '',
    operationClientUuid: 'ro-2-0-1-op-c-im-eatl-1-0-0-003'
  }
];

describe("configureForwardingConstructAsync", () => {
  test("configureForwardingConstructAsync - Add Port Async", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-is-008');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fcForSubscription);
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync')
      .mockReturnValueOnce(["ro-2-0-1-http-s-000"])
      .mockReturnValue(["ro-2-0-1-op-c-im-ol-1-0-0-003"]);
    jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync')
      .mockReturnValueOnce('2.0.1')
      .mockReturnValue('2.0.2');
    jest.spyOn(HttpClientInterface, 'getApplicationNameAsync').mockReturnValue('RegistryOffice')
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);
    jest.spyOn(ForwardingConstruct, 'addFcPortAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    const forwardingConstructConfigurationStatusList = [new ConfigurationStatus("ro-2-0-1-op-fc-is-007", '', true)];
    const fcPortConfigurationStatusList = [
      new ConfigurationStatus("ro-2-0-1-op-fc-is-007", '204', true),
      new ConfigurationStatus("ro-2-0-1-op-fc-is-007", '204', true)
    ];
    expect(res).toStrictEqual(new ForwardingConstructConfigurationStatus(
      forwardingConstructConfigurationStatusList,
      fcPortConfigurationStatusList
      ));
    
  });

  test("configureForwardingConstructAsync - successful", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    const forwardingConstructConfigurationStatusList = [new ConfigurationStatus("ro-2-0-1-op-fc-bm-106", '', false)];
    const fcPortConfigurationStatusList = [
      new ConfigurationStatus("ro-2-0-1-op-fc-bm-106", '200', true),
      new ConfigurationStatus("ro-2-0-1-op-fc-bm-106", '200', true)
    ];
    expect(res).toStrictEqual(new ForwardingConstructConfigurationStatus(forwardingConstructConfigurationStatusList, fcPortConfigurationStatusList));
    
  });

})

describe("unConfigureForwardingConstructAsync", () => {
  test("unConfigureForwardingConstructAsync - successful", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => fcListArray);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    const forwardingConstructConfigurationStatusList = [];
    const fcPortConfigurationStatusList = [
      new ConfigurationStatus("ro-2-0-1-op-fc-bm-106", '200', true)
    ];
    expect(res).toStrictEqual(new ForwardingConstructConfigurationStatus(
      forwardingConstructConfigurationStatusList,
      fcPortConfigurationStatusList
      ));
  });

  test("unConfigureForwardingConstructAsync - delete port successful", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => [fcForSubscription]);
    jest.spyOn(ForwardingConstruct, 'deleteFcPortAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingUnConfigurationInputList);
    
    const forwardingConstructConfigurationStatusList = [];
    const fcPortConfigurationStatusList = [
      new ConfigurationStatus("ro-2-0-1-op-fc-is-007", '200', true)
    ];
    expect(res).toStrictEqual(new ForwardingConstructConfigurationStatus(
      forwardingConstructConfigurationStatusList,
      fcPortConfigurationStatusList
      ));
  });
  
})

afterEach(() => {
  jest.resetAllMocks();
});
