const ForwardingConstructAutomationServices = require('./ForwardingConstructAutomationServices');
const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
const ForwardingDomain = require('../models/ForwardingDomain');
const event = require('../../rest/client/eventDispatcher');

const fc = {
  "uuid": "ro-2-0-1-op-fc-bm-001",
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
      "logical-termination-point": "ro-2-0-1-op-s-bm-001"
    },
    {
      "local-id": "200",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-bm-or-1-0-0-000"
    }
  ]
};

const forwardingAutomationInputList = [
  {
    forwardingName: 'PromptForEmbeddingCausesRequestForBequeathingData',
    attributeList: {
      'new-application-name': 'RegistryOffice',
      'new-application-release': '2.0.1',
      'new-application-protocol': 'HTTP',
      'new-application-address': { 'ipv-4-address': '1.1.3.8' },
      'new-application-port': 3008
    },
    context: undefined
  },
  {
    forwardingName: 'ServiceRequestCausesLtpUpdateRequest',
    attributeList: {
      uuid: 'ro-2-0-1-tcp-c-or-1-0-0-000',
      'ltp-direction': 'core-model-1-4:TERMINATION_DIRECTION_SINK',
      'client-ltp': [
        'ro-2-0-1-http-c-or-1-0-0-000'
      ],
      'server-ltp': [],
      'layer-protocol': [
        {
          'local-id': '0',
          'layer-protocol-name': 'tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER',
          'tcp-client-interface-1-0:tcp-client-interface-pac': {
            'tcp-client-interface-configuration': {
              'remote-protocol': 'tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP',
              'remote-address': {
                'ip-address': {
                  'ipv-4-address': '1.1.3.1'
                }
              },
              'remote-port': 3001
            }
          }
        }
      ]
    },
    context: undefined
  }
];

const forwardingAutomationInputListforSubscription = [
  {
    forwardingName: 'OperationUpdateBroadcast',
    attributeList: {
      'application-name': 'RegistryOffice',
      'release-number': '2.0.1',
      'old-operation-name': '/v1/register-application',
      'new-operation-name': '/v2/register-application'
    },
    context: undefined
  }
];

const fcForSubscription = {
  "uuid": "ro-2-0-1-op-fc-is-010",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_SUBSCRIPTION"
    },
    {
      "value-name": "ForwardingName",
      "value": "OperationUpdateBroadcast"
    }
  ],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ro-2-0-1-op-s-is-003"
    },
    {
      "local-id": "001",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ro-2-0-1-op-s-is-002"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "ro-2-0-1-op-s-is-011"
    }
  ]
};

describe("configureForwardingConstructAsync", () => {
  test("automateForwardingConstructAsync - failed to get OperationServerUuidAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });
    
    const res =  ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1.3.1', 'Unknown value');
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("automateForwardingConstructAsync - failed to get ForwardingConstructForTheForwardingNameAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };
    
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });    
    const res =  ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1.3.1', 'Unknown value');
    return res.then()
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("automateForwardingConstructAsync - if ForwardingConstructForTheForwardingNameAsync returns undefined", async () => {
    const operationServerName = '/v1/embed-yourself';
    
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => undefined);    
    const res = ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1.3.1', 'Unknown value');

    return res.then()
    .catch((err)=> {
      expect(err).toBeInstanceOf(Error);
    })
  });

  test("automateForwardingConstructAsync - failed to automate ForwardingConstructAsync", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };
    
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(event, 'dispatchEvent').mockImplementation(() => true);
     
    const res =  ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1.3.1', 'Unknown value');
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("automateForwardingConstructAsync - failed to automate ForwardingConstructAsync when FC Port is subscription", async () => {
    const operationServerName = '/v1/embed-yourself';
    const mockError = { message: 'Something bad happened' };
    
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fcForSubscription);
    jest.spyOn(event, 'dispatchEvent').mockImplementation(() => true);
     
    const res =  ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputListforSubscription, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1.3.1', 'Unknown value');
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

})

describe("automateForwardingConstructWithoutInputAsync", () => {
  test("automateForwardingConstructWithoutInputAsync - failed to get ForwardingConstructForTheForwardingNameAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const res = ForwardingConstructAutomationServices.automateForwardingConstructWithoutInputAsync(
        forwardingAutomationInputList, 'User Name', '550e8400-e29b-11d4-a716-446655440000',
        '1.3.1', 'Unknown value');

    return res.then()
      .catch((err)=> {
        expect(err).toEqual(mockError);
    })
  });

  test("automateForwardingConstructWithoutInputAsync - if ForwardingConstructForTheForwardingNameAsync returns undefined", async () => {

    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => undefined);

    const res = ForwardingConstructAutomationServices.automateForwardingConstructWithoutInputAsync(
        forwardingAutomationInputList, 'User Name', '550e8400-e29b-11d4-a716-446655440000',
        '1.3.1', 'Unknown value');

    return res.then()
      .catch((err)=> {
        expect(err).toBeInstanceOf(Error);
    })
  });

  test("automateForwardingConstructWithoutInputAsync - failed to automate ForwardingConstructWithoutInputAsync", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(event, 'dispatchEvent').mockImplementation(() => true);

    const res = ForwardingConstructAutomationServices.automateForwardingConstructWithoutInputAsync(
        forwardingAutomationInputList, 'User Name', '550e8400-e29b-11d4-a716-446655440000',
        '1.3.1', 'Unknown value');
    return res.then(() => {
      return Promise.reject(mockError);
    })
    .catch((err)=> {
      expect(err).toEqual(mockError);
    })
  });

  test("automateForwardingConstructWithoutInputAsync - failed to automate ForwardingConstructWithoutInputAsync when FC Port is subscription", async () => {
    const mockError = { message: 'Something bad happened' };

    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fcForSubscription);
    jest.spyOn(event, 'dispatchEvent').mockImplementation(() => true);

    const res = ForwardingConstructAutomationServices.automateForwardingConstructWithoutInputAsync(
        forwardingAutomationInputListforSubscription, 'User Name', '550e8400-e29b-11d4-a716-446655440000',
        '1.3.1', 'Unknown value');
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
