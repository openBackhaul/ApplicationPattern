const LogicalTerminationPoint = require('./LogicalTerminationPoint');
const fileOperation = require('../../databaseDriver/JSONDriver');
const ControlConstruct = require('./ControlConstruct');

jest.mock('./ControlConstruct');
jest.mock('../../databaseDriver/JSONDriver');

const ltp = {
  "uuid": "alt-2-0-1-http-c-es-1-0-0-000",
  "client-ltp": [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ],
  "server-ltp": [
    "alt-2-0-1-tcp-c-es-1-0-0-000"
  ],
  "layer-protocol": [
  ]
}

const emptyLtp = {
  "uuid": "alt-2-0-1-http-c-es-1-0-0-000",
  "client-ltp": [],
  "server-ltp": [],
  "layer-protocol": [
  ]
}

beforeEach(() => {
  jest.spyOn(fileOperation, 'writeToDatabaseAsync').mockImplementation(() => true);
  jest.spyOn(fileOperation, 'deletefromDatabaseAsync').mockImplementation(() => true);
})

test("getServerLtpListAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(ltp);
  const serverList = await LogicalTerminationPoint.getServerLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000");
  const expectedServerList = [
    "alt-2-0-1-tcp-c-es-1-0-0-000"
  ];
  expect(serverList).toStrictEqual(expectedServerList);
});

test("getServerLtpListAsync -- empty", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(emptyLtp);
  const serverList = await LogicalTerminationPoint.getServerLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000");
  expect(serverList).toStrictEqual([]);
});

test("setServerLtpListAsync -- when empty", async () => {
  const inputServerList = [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ];
  jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue([]);
  const res = await LogicalTerminationPoint.setServerLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000", inputServerList);
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(1,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/server-ltp",
    "alt-2-0-1-es-c-es-1-0-0-000", true
  );
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(2,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/server-ltp",
    "alt-2-0-1-es-c-es-1-0-0-001", true
  );
  expect(res).toBeTruthy();
});

test("setServerLtpListAsync -- add to existing", async () => {
  const inputServerList = [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ];
  jest.spyOn(LogicalTerminationPoint, 'getServerLtpListAsync').mockReturnValue(["alt-2-0-1-tcp-c-es-1-0-0-000"]);
  const res = await LogicalTerminationPoint.setServerLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000", inputServerList);
  expect(fileOperation.deletefromDatabaseAsync).toHaveBeenCalledWith(
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/server-ltp");
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(1,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/server-ltp",
    "alt-2-0-1-es-c-es-1-0-0-000", true
  );
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(2,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/server-ltp",
    "alt-2-0-1-es-c-es-1-0-0-001", true
  );
  expect(res).toBeTruthy();
});

test("getClientLtpListAsync", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(ltp);
  const clientList = await LogicalTerminationPoint.getClientLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000");
  const expectedClientList = [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ];
  expect(clientList).toStrictEqual(expectedClientList);
});

test("getClientLtpListAsync -- empty", async () => {
  jest.spyOn(ControlConstruct, 'getLogicalTerminationPointAsync').mockReturnValue(emptyLtp);
  const clientList = await LogicalTerminationPoint.getClientLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000");
  expect(clientList).toStrictEqual([]);
});

test("setClientLtpListAsync -- when empty", async () => {
  const inputClientList = [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ];
  jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue([]);
  const res = await LogicalTerminationPoint.setClientLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000", inputClientList);
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(1,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/client-ltp",
    "alt-2-0-1-es-c-es-1-0-0-000", true
  );
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(2,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/client-ltp",
    "alt-2-0-1-es-c-es-1-0-0-001", true
  );
  expect(res).toBeTruthy();
});

test("setClientLtpListAsync -- add to existing", async () => {
  const inputClientList = [
    "alt-2-0-1-es-c-es-1-0-0-000",
    "alt-2-0-1-es-c-es-1-0-0-001"
  ];
  jest.spyOn(LogicalTerminationPoint, 'getClientLtpListAsync').mockReturnValue(["alt-2-0-1-tcp-c-es-1-0-0-000"]);
  const res = await LogicalTerminationPoint.setClientLtpListAsync("alt-2-0-1-http-c-es-1-0-0-000", inputClientList);
  expect(fileOperation.deletefromDatabaseAsync).toHaveBeenCalledWith(
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/client-ltp");
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(1,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/client-ltp",
    "alt-2-0-1-es-c-es-1-0-0-000", true
  );
  expect(fileOperation.writeToDatabaseAsync).toHaveBeenNthCalledWith(2,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-c-es-1-0-0-000/client-ltp",
    "alt-2-0-1-es-c-es-1-0-0-001", true
  );
  expect(res).toBeTruthy();
});

afterEach(() => {
  jest.resetAllMocks();
});
