const TcpClientInterface = require("./TcpClientInterface");
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');
const logicalTerminationPoint = require('../LogicalTerminationPoint');

jest.mock('../ControlConstruct');
jest.mock('../../../databaseDriver/JSONDriver');

const tcpC = {
  "uuid": "aa-2-0-1-tcp-c-or-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [
    "aa-2-0-1-http-c-or-1-0-0-000"
  ],
  "server-ltp": [],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-client-interface-1-0:tcp-client-interface-pac": {
        "tcp-client-interface-configuration": {
          "remote-protocol": "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP",
          "remote-address": {},
          "remote-port": 3005
        }
      }
    }
  ]
};

const ipAddress = {
  "ip-address": {
    "ipv-4-address": "1.1.3.13"
  }
};

const domainName = {
  "domain-name": "some-domain.com"
};

const tcpClientInterfaceConfigurationPath = "/core-model-1-4:control-construct/logical-termination-point=aa-2-0-1-tcp-c-or-1-0-0-000/layer-protocol=0/tcp-client-interface-1-0:tcp-client-interface-pac/tcp-client-interface-configuration/";

beforeEach(() => {
  tcpC['layer-protocol'][0]['tcp-client-interface-1-0:tcp-client-interface-pac']['tcp-client-interface-configuration']["remote-address"] = ipAddress;
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcpC);
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getRemoteProtocol", async () => {
  expect(await TcpClientInterface.getRemoteProtocolAsync("aa-2-0-1-tcp-c-or-1-0-0-000")).toBe("HTTP");
});

test("getRemotePort", async () => {
  expect(await TcpClientInterface.getRemotePortAsync("aa-2-0-1-tcp-c-or-1-0-0-000")).toBe(3005);
});

test("getRemoteAddress - with IP address", async () => {
  expect(await TcpClientInterface.getRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000")).toStrictEqual({
    "ip-address": {
      "ipv-4-address": "1.1.3.13"
    }
  });
});

test("getRemoteAddress - with domain name", async () => {
  tcpC['layer-protocol'][0]['tcp-client-interface-1-0:tcp-client-interface-pac']['tcp-client-interface-configuration']["remote-address"] = domainName;
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockImplementation(() => tcpC);
  expect(await TcpClientInterface.getRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000")).toStrictEqual({
    "domain-name": "some-domain.com"
  });
});

test("setRemotePort", async () => {
  const res = await TcpClientInterface.setRemotePortAsync("aa-2-0-1-tcp-c-or-1-0-0-000", "9002");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpClientInterfaceConfigurationPath + "remote-port", "9002", false
  );
  expect(res).toBeTruthy();
});

test("setRemoteAddress - with IP address", async () => {
  const ret = {
    "ip-address": {
      "ipv-4-address": "127.0.0.1"
    }
  };
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
  const res = await TcpClientInterface.setRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000", {
    "ip-address": {
      "ipv-4-address": "127.0.0.2"
    }
  });
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpClientInterfaceConfigurationPath + "remote-address/ip-address",
    {
      "ip-address": {
        "ipv-4-address": "127.0.0.2"
      }
    },
    false);
  expect(res).toBeTruthy();
});

test("setRemoteAddress - with domain name", async () => {
  const ret = {
    "remote-address": {
      "domain-name": "some-domain.com"
    }
  };
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
  const res = await TcpClientInterface.setRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000", {
    "domain-name": "some-new-domain.com"
  });
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpClientInterfaceConfigurationPath + "remote-address/domain-name", {
    "domain-name": "some-new-domain.com"
  }, false);
  expect(res).toBeTruthy();
});

test("setRemoteAddress - switch to domain name", async () => {
  const ret = {
    "remote-address": {
      "ip-address": {
        "ipv-4-address": "127.0.0.1"
      }
    }
  };
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
  const res = await TcpClientInterface.setRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000", {
    "domain-name": "some-new-domain.com"
  });
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpClientInterfaceConfigurationPath + "remote-address/domain-name",
    {
      "domain-name": "some-new-domain.com"
    }, false);
  expect(res).toBeTruthy();
});

test("setRemoteAddress - switch to IP address", async () => {
  const ret = {
    "remote-address": {
      "domain-name": "some-new-domain.com"
    }
  };
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
  const res = await TcpClientInterface.setRemoteAddressAsync("aa-2-0-1-tcp-c-or-1-0-0-000", {
    "ip-address": {
      "ipv-4-address": "127.0.0.1"
    }
  });
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpClientInterfaceConfigurationPath + "remote-address/ip-address",
    {
      "ip-address": {
        "ipv-4-address": "127.0.0.1"
      }
    }, false);
  expect(res).toBeTruthy();
});

test("getProtocolFromProtocolEnum", () => {
  expect(TcpClientInterface.getProtocolFromProtocolEnum("tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP"))
    .toStrictEqual(["HTTP", "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTP"]);
  expect(TcpClientInterface.getProtocolFromProtocolEnum("tcp-client-interface-1-0:PROTOCOL_TYPE_HTTPS"))
    .toStrictEqual(["HTTPS", "tcp-client-interface-1-0:PROTOCOL_TYPE_HTTPS"]);
  expect(TcpClientInterface.getProtocolFromProtocolEnum("tcp-client-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"))
    .toStrictEqual(["NOT_YET_DEFINED", "tcp-client-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"]);
});

test("createTcpClientInterface", async () => {
  expect(await TcpClientInterface.createTcpClientInterface("aa-2-0-1-tcp-c-or-1-0-0-000", "1.2.3.4", "9002", "HTTP"))
    .toBeInstanceOf(logicalTerminationPoint);
});

afterEach(() => {
  jest.resetAllMocks();
});