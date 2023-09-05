const TcpServerInterface = require("./TcpServerInterface");
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');

jest.mock('../ControlConstruct');
jest.mock('../../../databaseDriver/JSONDriver');

const tcpS = {
  "uuid": "alt-2-0-1-tcp-s-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
  "client-ltp": [
    "alt-2-0-1-http-s-000"
  ],
  "server-ltp": [],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "tcp-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
      "tcp-server-interface-1-0:tcp-server-interface-pac": {
        "tcp-server-interface-configuration": {
          "description": "Without TLS layer",
          "local-protocol": "tcp-server-interface-1-0:PROTOCOL_TYPE_HTTP",
          "local-address": {},
          "local-port": 3013
        }
      }
    }
  ]
};

const ipAddress = {
  "ipv-4-address": "1.1.3.13"
};

const domainName = {
  "domain-name": "some-domain.com"
};

const tcpServerInterfaceConfigurationPath = "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-tcp-s-000/layer-protocol=0/tcp-server-interface-1-0:tcp-server-interface-pac/tcp-server-interface-configuration/";

beforeEach(() => {
  tcpS['layer-protocol'][0]['tcp-server-interface-1-0:tcp-server-interface-pac']['tcp-server-interface-configuration']["local-address"] = ipAddress;
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [tcpS]);
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getUuidOfTheProtocol", async () => {
  expect(await TcpServerInterface.getUuidOfTheProtocol("HTTP")).toBe("alt-2-0-1-tcp-s-000");
  expect(await TcpServerInterface.getUuidOfTheProtocol("HTTPS")).toBeUndefined();
});

test("getLocalAddressOfTheProtocol - with IP address", async () => {
  expect(await TcpServerInterface.getLocalAddressOfTheProtocol("HTTP")).toStrictEqual({
    "ipv-4-address": "1.1.3.13"
  });
  expect(await TcpServerInterface.getLocalAddressOfTheProtocol("HTTPS")).toBeUndefined();
});

test("getLocalAddressOfTheProtocol - with domain name", async () => {
  tcpS['layer-protocol'][0]['tcp-server-interface-1-0:tcp-server-interface-pac']['tcp-server-interface-configuration']["local-address"] = domainName;
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [tcpS]);
  expect(await TcpServerInterface.getLocalAddressOfTheProtocol("HTTP")).toStrictEqual({
    "domain-name": "some-domain.com"
  });
});

test("getLocalProtocol", async () => {
  expect(await TcpServerInterface.getLocalProtocol()).toBe("HTTP");
});

test("getLocalAddress", async () => {
  expect(await TcpServerInterface.getLocalAddress()).toStrictEqual({
    "ipv-4-address": "1.1.3.13"
  })
}
);

test("getLocalPort", async () => {
  expect(await TcpServerInterface.getLocalPort()).toBe(3013);
});

test("getLocalPortOfTheProtocol", async () => {
  expect(await TcpServerInterface.getLocalPortOfTheProtocol("HTTP")).toBe(3013);
  expect(await TcpServerInterface.getLocalPortOfTheProtocol("HTTPS")).toBeUndefined();
});

test("setLocalPort", async () => {
  const res = await TcpServerInterface.setLocalPortAsync("alt-2-0-1-tcp-s-000", "9002");
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    tcpServerInterfaceConfigurationPath + "local-port", "9002", false
  );
  expect(res).toBeTruthy();
});

describe("setLocalAddress", () => {
  test("with IP address", async () => {
    const ret = {
      "ipv-4-address": "127.0.0.1"
    };
    jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
    const res = await TcpServerInterface.setLocalAddressAsync("alt-2-0-1-tcp-s-000", {
      "ipv-4-address": "127.0.0.2"
    });
    expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/ipv-4-address");
    expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/ipv-4-address",
      { "ipv-4-address": "127.0.0.2" },
      false);
    expect(res).toBeTruthy();
  });

  test("with domain name", async () => {
    const ret = {
      "domain-name": "some-domain.com"
    };
    jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
    const res = await TcpServerInterface.setLocalAddressAsync("alt-2-0-1-tcp-s-000", {
      "domain-name": "some-new-domain.com"
    }
    );
    expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/domain-name");
    expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/domain-name",
      {
        "domain-name": "some-new-domain.com"
      }, false);
    expect(res).toBeTruthy();
  });

  test("switch to domain name", async () => {
    const ret = {
      "ipv-4-address": "127.0.0.1"
    };
    jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
    const res = await TcpServerInterface.setLocalAddressAsync("alt-2-0-1-tcp-s-000", {
      "domain-name": "some-new-domain.com"
    }
    );
    expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/ipv-4-address");
    expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/domain-name", {
      "domain-name": "some-new-domain.com"
    }, false);
    expect(res).toBeTruthy();
  });

  test("switch to IP address", async () => {
    const ret = {
      "domain-name": "some-new-domain.com"
    };
    jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockImplementation(() => ret);
    const res = await TcpServerInterface.setLocalAddressAsync("alt-2-0-1-tcp-s-000", {
      "ipv-4-address": "127.0.0.1"
    });
    expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/domain-name");
    expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
      tcpServerInterfaceConfigurationPath + "local-address/ipv-4-address",
      {
        "ipv-4-address": "127.0.0.1"
      }, false);
    expect(res).toBeTruthy();
  });
});

test("getProtocolFromProtocolEnum", () => {
  expect(TcpServerInterface.getProtocolFromProtocolEnum("tcp-server-interface-1-0:PROTOCOL_TYPE_HTTP"))
    .toStrictEqual(["HTTP", "tcp-server-interface-1-0:PROTOCOL_TYPE_HTTP"]);
  expect(TcpServerInterface.getProtocolFromProtocolEnum("tcp-server-interface-1-0:PROTOCOL_TYPE_HTTPS"))
    .toStrictEqual(["HTTPS", "tcp-server-interface-1-0:PROTOCOL_TYPE_HTTPS"]);
  expect(TcpServerInterface.getProtocolFromProtocolEnum("tcp-server-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"))
    .toStrictEqual(["NOT_YET_DEFINED", "tcp-server-interface-1-0:PROTOCOL_TYPE_NOT_YET_DEFINED"]);
});

afterEach(() => {
  jest.resetAllMocks();
});
