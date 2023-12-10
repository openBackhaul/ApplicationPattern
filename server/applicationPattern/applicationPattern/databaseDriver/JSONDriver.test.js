const jsonDriver = require('./JSONDriver');
const fileSystem = require('fs');

const file = './test.json';
global.databasePath = file;

const initialContent = {
  "uuid": "aa-2-0-1",
  "profile-collection": {
    "profile": [
      {
        "uuid": "aa-2-0-1-action-p-000",
        "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
        "action-profile-1-0:action-profile-pac": {
          "action-profile-capability": {
            "operation-name": "/v1/start-application-in-generic-representation",
            "label": "Inform about Application",
            "input-value-list": [],
            "display-in-new-browser-window": false
          },
          "action-profile-configuration": {
            "consequent-operation-reference": "/core-model-1-4:control-construct/logical-termination-point=aa-2-0-1-op-s-bs-002/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name"
          }
        }
      },
      {
        "uuid": "aa-2-0-1-action-p-001",
        "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
        "action-profile-1-0:action-profile-pac": {
        }
      }
    ]
  }
};

beforeAll(() => {
  // eslint-disable-next-line no-unused-vars
  fileSystem.open(file, 'r+', function (err, data) {
  });
  fileSystem.writeFileSync(file, JSON.stringify(initialContent));
});

test("readFromDatabaseAsync", async () => {
  expect(await jsonDriver.readFromDatabaseAsync("uuid")).toBe("aa-2-0-1");
  expect(await jsonDriver.readFromDatabaseAsync(
    "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-configuration"
  )).toStrictEqual({
    "consequent-operation-reference": "/core-model-1-4:control-construct/logical-termination-point=aa-2-0-1-op-s-bs-002/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name"
  });
  expect(await jsonDriver.readFromDatabaseAsync(
    "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/input-value-list"
  )).toStrictEqual([]);
});

describe("writeToDatabaseAsync", () => {
  test("new object", async () => {
    expect(await jsonDriver.writeToDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/new-value",
      { "new-value": "value" },
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/new-value"
    )).toBe("value");
  });

  test("rewrite object", async () => {
    expect(await jsonDriver.writeToDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/new-value",
      { "new-value": { "another-value": [] } },
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/new-value"
    )).toStrictEqual({ "another-value": [] });
  });

  test("new item in list", async () => {
    expect(await jsonDriver.writeToDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/input-value-list",
      { "item-key": "item-value" },
      true
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/input-value-list",
    )).toStrictEqual([{ "item-key": "item-value" }]);

    expect(await jsonDriver.writeToDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/input-value-list",
      { "item-key-two": "item-value-two" },
      true
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/input-value-list",
    )).toStrictEqual([{ "item-key": "item-value" }, { "item-key-two": "item-value-two" }]);
  });
});

describe("deletefromDatabaseAsync", () => {
  test("delete field", async () => {
    expect(await jsonDriver.deletefromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/display-in-new-browser-window"
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-capability/display-in-new-browser-window",
    )).toBeUndefined();
  });

  test("delete object", async () => {
    expect(await jsonDriver.deletefromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-configuration"
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000/action-profile-1-0:action-profile-pac/action-profile-configuration",
    )).toBeUndefined();
  });

  test("delete item from list", async () => {
    expect(await jsonDriver.deletefromDatabaseAsync(
      "profile-collection/profile=aa-2-0-1-action-p-000",
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile",
    )).toStrictEqual( [{"action-profile-1-0:action-profile-pac": {}, "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE", "uuid": "aa-2-0-1-action-p-001"}]);
  });

  test("delete list", async () => {
    expect(await jsonDriver.deletefromDatabaseAsync(
      "profile-collection/profile"
    )).toBeTruthy();
    expect(await jsonDriver.readFromDatabaseAsync(
      "profile-collection/profile",
    )).toStrictEqual([]);
  });
});

afterAll(() => {
  fileSystem.unlink(file, function (err) {
    if (err) {
      return console.error(err);
    }
  });
  jest.restoreAllMocks();
});
