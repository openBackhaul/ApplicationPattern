const ForwardingConstructAutomationServices = require('./ForwardingConstructAutomationServices');
const OperationServerInterface = require('../models/layerProtocols/OperationServerInterface');
const ForwardingDomain = require('../models/ForwardingDomain');
const Event = require('../../rest/client/eventDispatcher');
const LogicalTerminationPoint = require('../models/LogicalTerminationPoint');
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');


jest.mock('../../rest/client/eventDispatcher');

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

const fcForProcessSnippet = {
  "uuid": "ro-2-0-1-op-fc-is-000",
  "name": [
    {
      "value-name": "ForwardingKind",
      "value": "core-model-1-4:FORWARDING_KIND_TYPE_PROCESS_SNIPPET"
    },
    {
      "value-name": "ForwardingName",
      "value": "TypeApprovalCausesRequestForEmbedding"
    }
  ],
  "fc-port": [
    {
      "local-id": "000",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ro-2-0-1-op-s-is-001"
    },
    {
      "local-id": "001",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
      "logical-termination-point": "ro-2-0-1-op-s-is-002"
    },
    {
      "local-id": "100",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_INPUT",
      "logical-termination-point": "ro-2-0-1-op-s-is-003"
    },
    {
      "local-id": "201",
      "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point": "ro-2-0-1-op-c-im-tar-1-0-0-000"
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
    context: 'TypeApprovalRegister2.0.1'
  }
  
];

describe("automateForwardingConstructAsync", () => {
  test("automateForwardingConstructAsync - success when FC is Process Snippet", async () => {
    const operationServerName = '/v1/embed-yourself';
    const httpRequestBody = {
      "client-ltp": [
        "ro-2-0-1-http-c-or-1-0-0-000"
      ],
      "layer-protocol": [
        {
          "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
          "local-id": "0",
          "tcp-client-interface-1-0:tcp-client-interface-pac": {
            "tcp-client-interface-configuration": {
              "remote-address": {
                "ip-address": {
                  "ipv-4-address": "1.1.3.1"
                }
              },
              "remote-port": 3001,
              "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP"
            }
          }
        }
      ],
      "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "server-ltp": [],
      "uuid": "ro-2-0-1-tcp-c-or-1-0-0-000"
    };
    const xCorrelator = "550e8400-e29b-11d4-a716-446655440000";
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-is-003');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fcForProcessSnippet);
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ro-2-0-1-http-c-tar-1-0-0-000"]);
    jest.spyOn(HttpClientInterface, 'getApplicationNameAsync').mockReturnValue('TypeApprovalRegister');
    jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockReturnValue('2.0.1');
    jest.spyOn(Event, 'dispatchEvent').mockReturnValue(true);
     
    await ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1', 'Unknown value');
    
    expect(Event.dispatchEvent).toHaveBeenCalledTimes(1);  
    expect(Event.dispatchEvent).toHaveBeenCalledWith(
        "ro-2-0-1-op-c-im-tar-1-0-0-000",
        expect.objectContaining(httpRequestBody),
        "User Name",
        xCorrelator,
        "1.1",
        "Unknown value"
      );
  });

  test("automateForwardingConstructAsync - success when FC is Process Subscription", async () => {
    const operationServerName = '/v1/embed-yourself';
    const httpRequestBody = {
      "client-ltp": [
        "ro-2-0-1-http-c-or-1-0-0-000"
      ],
      "layer-protocol": [
        {
          "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
          "local-id": "0",
          "tcp-client-interface-1-0:tcp-client-interface-pac": {
            "tcp-client-interface-configuration": {
              "remote-address": {
                "ip-address": {
                  "ipv-4-address": "1.1.3.1"
                }
              },
              "remote-port": 3001,
              "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP"
            }
          }
        }
      ],
      "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "server-ltp": [],
      "uuid": "ro-2-0-1-tcp-c-or-1-0-0-000"
    };
    const xCorrelator = "550e8400-e29b-11d4-a716-446655440000";
    
    jest.spyOn(OperationServerInterface, 'getOperationServerUuidAsync').mockImplementation(() => 'ro-2-0-1-op-s-bm-001');
    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fc);
    jest.spyOn(Event, 'dispatchEvent').mockImplementation(() => true);
     
    await ForwardingConstructAutomationServices.automateForwardingConstructAsync(
      operationServerName, forwardingAutomationInputList, 'User Name', 
      '550e8400-e29b-11d4-a716-446655440000', '1', 'Unknown value');
    expect(Event.dispatchEvent).toHaveBeenCalledTimes(2);  
    expect(Event.dispatchEvent).toHaveBeenCalledWith(
        "ro-2-0-1-op-c-bm-or-1-0-0-000",
        expect.objectContaining(httpRequestBody),
        "User Name",
        xCorrelator,
        "1.2",
        "Unknown value"
      );
  });

})

describe("automateForwardingConstructWithoutInputAsync", () => {
  test("automateForwardingConstructWithoutInputAsync - successful when FC is Process Snippet", async () => {
    const httpRequestBody = {
      "client-ltp": [
        "ro-2-0-1-http-c-or-1-0-0-000"
      ],
      "layer-protocol": [
        {
          "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
          "local-id": "0",
          "tcp-client-interface-1-0:tcp-client-interface-pac": {
            "tcp-client-interface-configuration": {
              "remote-address": {
                "ip-address": {
                  "ipv-4-address": "1.1.3.1"
                }
              },
              "remote-port": 3001,
              "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP"
            }
          }
        }
      ],
      "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "server-ltp": [],
      "uuid": "ro-2-0-1-tcp-c-or-1-0-0-000"
    };
    const xCorrelator = "550e8400-e29b-11d4-a716-446655440000";

    jest.spyOn(ForwardingDomain, 'getForwardingConstructForTheForwardingNameAsync').mockImplementation(() => fcForProcessSnippet);
    jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ro-2-0-1-http-c-tar-1-0-0-000"])
    jest.spyOn(HttpClientInterface, 'getApplicationNameAsync').mockReturnValue('TypeApprovalRegister')
    jest.spyOn(HttpClientInterface, 'getReleaseNumberAsync').mockReturnValue('2.0.1');
    jest.spyOn(Event, 'dispatchEvent').mockImplementation(() => true);

    await ForwardingConstructAutomationServices.automateForwardingConstructWithoutInputAsync(
        forwardingAutomationInputList, 'User Name', '550e8400-e29b-11d4-a716-446655440000',
        '1', 'Unknown value');
        
    expect(Event.dispatchEvent).toHaveBeenCalledTimes(1);  
    expect(Event.dispatchEvent).toHaveBeenCalledWith(
        "ro-2-0-1-op-c-im-tar-1-0-0-000",
        expect.objectContaining(httpRequestBody),
        "User Name",
        xCorrelator,
        "1.1",
        "Unknown value"
      );
  });

})

afterEach(() => {
  jest.resetAllMocks();
});
