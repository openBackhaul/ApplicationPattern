const ForwardingConstructConfigurationServices = require('./ForwardingConstructConfigurationServices');
const ForwardingConstructConfigurationStatus = require('./models/forwardingConstruct/ConfigurationStatus');
const ControlConstruct = require('../models/ControlConstruct');
const ForwardingDomain = require('../models/ForwardingDomain');
const fcPort = require('../models/FcPort');

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

describe("configureForwardingConstructAsync", () => {
  test("configureForwardingConstructAsync - successful", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    expect(res).toBeInstanceOf(ForwardingConstructConfigurationStatus);
    
  });

  test("configureForwardingConstructAsync - failed to get LogicalTerminationPointListAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
    
  });

  test("configureForwardingConstructAsync - LogicalTerminationPointListAsync returns undefined", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => undefined);

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toBe(undefined);
    })
    
  });

  test("configureForwardingConstructAsync - failed to get ForwardingConstructForTheForwardingNameAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    
    const mockError = { message: 'Something bad happened' };
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
    
  });

  test("configureForwardingConstructAsync - ForwardingConstructForTheForwardingNameAsync returns undefined", async () => {
    const operationServerName = '/v1/embed-yourself';
    
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => undefined);

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toBeInstanceOf(Error);
    })
    
  });

  test("configureForwardingConstructAsync - failed to set LogicalTerminationPointAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    
    const mockError = { message: 'Something bad happened' };
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
    
  });

  test("configureForwardingConstructAsync - failed to configure ForwardingConstructAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    
    const mockError = { message: 'Something bad happened' };
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = ForwardingConstructConfigurationServices.configureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
    
  });
})

describe("unConfigureForwardingConstructAsync", () => {
  test("unConfigureForwardingConstructAsync - successful", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = await ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    expect(res).toBeInstanceOf(ForwardingConstructConfigurationStatus);
  });

  test("unConfigureForwardingConstructAsync - failed to get LogicalTerminationPointListAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("unConfigureForwardingConstructAsync - if LogicalTerminationPointListAsync returns undefined", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => undefined);

    const res = ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    return res.then()
    .catch((err)=> {
      expect(err).toBe(undefined);
    })
  });

  test("unConfigureForwardingConstructAsync - failed to get ForwardingConstructForTheForwardingNameAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("unConfigureForwardingConstructAsync - if ForwardingConstructForTheForwardingNameAsync returns undefined", async () => {
    const operationServerName = '/v1/embed-yourself';

    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => undefined);

    const res = ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    return res.then()
    .catch((err)=> {
      expect(err).toBeInstanceOf(Error);
    })
  });

  test("unConfigureForwardingConstructAsync - failed to UnConfigureForwardingConstructAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };
    
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => ltps);
    jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockImplementation(() => fc);
    jest.spyOn(fcPort, 'setLogicalTerminationPointAsync').mockImplementation(() => true);

    const res = ForwardingConstructConfigurationServices.unConfigureForwardingConstructAsync(
      operationServerName, forwardingConfigurationInputList);
    
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
      
  });
  
})

afterEach(() => {
  jest.resetAllMocks();
});
