const HttpServerInterface = require("./HttpServerInterface");
const ControlConstruct = require('../ControlConstruct');
const fileOperation = require('../../../databaseDriver/JSONDriver');

jest.mock('../../../databaseDriver/JSONDriver');
jest.mock('../ControlConstruct');

const httpS = {
    "uuid": "alt-2-0-1-http-s-000",
    "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
    "client-ltp": [
        "alt-2-0-1-op-s-bm-000",
        "alt-2-0-1-op-s-bm-001"
    ],
    "server-ltp": [
        "alt-2-0-1-tcp-s-000"
    ],
    "layer-protocol": [
        {
            "local-id": "0",
            "layer-protocol-name": "http-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
            "http-server-interface-1-0:http-server-interface-pac": {
                "http-server-interface-capability": {}
            }
        }
    ]
};

const httpServerCapability = {
    "application-name": "ApplicationLayerTopology",
    "release-number": "2.0.1",
    "application-purpose": "Represents interface information and internal connections and allows documenting external connections.",
    "data-update-period": "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
    "owner-name": "Thorsten Heinze",
    "owner-email-address": "Thorsten.Heinze@telefonica.com",
    "release-list": []
}

const releaseList = [
    {
        "local-id": "0",
        "release-number": "1.0.0",
        "release-date": "05.01.2022",
        "changes": "Initial version."
    },
    {
        "local-id": "1",
        "release-number": "2.0.1",
        "release-date": "05.01.2023",
        "changes": "Update on ApplicationPattern 2.0.1."
    }
]

beforeEach(() => {
    httpServerCapability["release-list"] = releaseList;
    httpS["layer-protocol"][0]["http-server-interface-1-0:http-server-interface-pac"]["http-server-interface-capability"] = httpServerCapability;
    jest.spyOn(ControlConstruct, 'getLogicalTerminationPointListAsync').mockImplementation(() => [httpS]);
    jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
})

test("getHttpServerCapabilityAsync", async () => {
    expect(await HttpServerInterface.getHttpServerCapabilityAsync()).toBe(httpServerCapability);
});

test("getApplicationNameAsync", async () => {
    expect(await HttpServerInterface.getApplicationNameAsync()).toBe("ApplicationLayerTopology");
});

test("getReleaseNumberAsync", async () => {
    expect(await HttpServerInterface.getReleaseNumberAsync()).toBe("2.0.1");
});

test("getReleaseListAsync", async () => {
    expect(await HttpServerInterface.getReleaseListAsync()).toBe(releaseList);
});

afterEach(() => {
    jest.resetAllMocks();
});