const LtpWithMappingServices = require("./LogicalTerminationPointWithMappingServices");
const HttpClientInterface = require('../models/layerProtocols/HttpClientInterface');
const ControlConstruct = require('../models/ControlConstruct');
const LogicalTerminationPoint = require('../models/LogicalTerminationPoint');
const ConfigurationStatus = require('./models/ConfigurationStatus');
const LogicalTerminationPointConfigurationStatus = require('./models/logicalTerminationPoint/ConfigurationStatus');
const ForwardingDomain = require('../models/ForwardingDomain');
const ForwardingConstruct = require('../models/ForwardingConstruct');

jest.mock('../models/layerProtocols/HttpClientInterface');
jest.mock('../models/ControlConstruct');
jest.mock('../models/LogicalTerminationPoint');
jest.mock('../models/ForwardingDomain');
jest.mock('../models/ForwardingConstruct');

const fc = {
  "uuid" : "ol-2-0-1-op-fc-bm-010",
  "name" : [],
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
      "logical-termination-point" : "ol-2-0-1-op-c-im-cc-1-0-0-004"
    },
    {
      "local-id" : "201",
      "port-direction" : "core-model-1-4:PORT_DIRECTION_TYPE_OUTPUT",
      "logical-termination-point" : "nl-2-0-1-op-c-bm-alt-1-0-0-006"
    }
  ]
};

beforeEach(() => {

});

test("deleteApplicationInformationAsync", async () => {
  jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["ol-2-0-1-tcp-c-cc-1-0-0-000"]);
  jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue(
    ["ol-2-0-1-op-c-im-cc-1-0-0-004", "ol-2-0-1-op-c-im-cc-1-0-0-005"]
  );
  jest.spyOn(ControlConstruct, 'deleteLogicalTerminationPointAsync').mockReturnValue(true);
  jest.spyOn(HttpClientInterface, 'getHttpClientUuidExcludingOldReleaseAndNewRelease').mockReturnValue("ol-2-0-1-http-c-cc-1-0-0-000");
  jest.spyOn(ForwardingDomain, 'getForwardingConstructListForTheFcPortAsync').mockReturnValue([fc]);
  let result = await LtpWithMappingServices.deleteApplicationInformationAsync(
    "foo", "bar", "baz"
  );

  let expectedOperationClientConfigurationStatusList = [
    new ConfigurationStatus("ol-2-0-1-op-c-im-cc-1-0-0-004", '', true),
    new ConfigurationStatus("ol-2-0-1-op-c-im-cc-1-0-0-005", '', true)
  ];
  let expectedHttpClientConfigurationStatus = new ConfigurationStatus("ol-2-0-1-http-c-cc-1-0-0-000", '', true)
  let expectedTcpClientConfigurationStatusList = [
    new ConfigurationStatus("ol-2-0-1-tcp-c-cc-1-0-0-000", '', true),
  ];

  expect(ForwardingConstruct.deleteFcPortAsync).toHaveBeenCalledWith("ol-2-0-1-op-fc-bm-010", "200");

  expect(result).toStrictEqual(new LogicalTerminationPointConfigurationStatus(
    expectedOperationClientConfigurationStatusList,
    expectedHttpClientConfigurationStatus,
    expectedTcpClientConfigurationStatusList
  ));
});

afterEach(() => {
  jest.resetAllMocks();
});