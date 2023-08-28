const ProfileCollection = require('./ProfileCollection');
const fileOperation = require('../../databaseDriver/JSONDriver');
const Profile = require('./Profile');
const ResponseProfile = require('./profile/ResponseProfile');

jest.mock('../../databaseDriver/JSONDriver');

let input = [];

const actionProfile = {
  "uuid": "alt-2-0-1-action-p-002",
  "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
  "action-profile-1-0:action-profile-pac": {
    "action-profile-capability": {
      "operation-name": "/v1/inform-about-application-in-generic-representation",
      "label": "API Documentation",
      "input-value-list": [],
      "display-in-new-browser-window": true
    },
    "action-profile-configuration": {
      "consequent-operation-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-op-s-bs-005/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name"
    }
  }
};

const responseProfile = {
  "uuid": "alt-2-0-1-response-p-000",
  "profile-name": "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
  "response-profile-1-0:response-profile-pac": {
    "response-profile-capability": {
      "operation-name": "/v1/start-application-in-generic-representation",
      "field-name": {
        "static-field-name": "applicationName"
      },
      "description": "Own application name",
      "datatype": "string"
    },
    "response-profile-configuration": {
      "value": {
        "value-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/application-name"
      }
    }
  }
};

const stringProfile = {
  "uuid": "okm-2-0-1-string-p-000",
  "profile-name": "string-profile-1-0:PROFILE_NAME_TYPE_STRING_PROFILE",
  "string-profile-1-0:string-profile-pac": {
    "string-profile-capability": {
      "string-name": "operationMode",
      "enumeration": [
        "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE",
        "string-profile-1-0:STRING_VALUE_TYPE_PROTECTION",
        "string-profile-1-0:STRING_VALUE_TYPE_OFF"
      ]
    },
    "string-profile-configuration": {
      "string-value": "string-profile-1-0:STRING_VALUE_TYPE_OFF"
    }
  }
};

beforeEach(() => {
  input = [actionProfile, stringProfile, responseProfile];
  jest.spyOn(fileOperation, 'readFromDatabaseAsync').mockReturnValue(input);
});

test("getProfileAsync", async () => {
  expect(await ProfileCollection.getProfileAsync("okm-2-0-1-string-p-000"))
    .toStrictEqual(stringProfile);

  expect(await ProfileCollection.getProfileAsync("okm-2-0-1-string-p-001"))
    .toBeUndefined();
});

test("getProfileListForProfileNameAsync", async () => {
  expect(await ProfileCollection.getProfileListForProfileNameAsync(Profile.profileNameEnum.ACTION_PROFILE))
    .toStrictEqual([actionProfile]);

  expect(await ProfileCollection.getProfileListForProfileNameAsync(Profile.profileNameEnum.FILE_PROFILE))
    .toStrictEqual([]);
});

test("isProfileExistsAsync", async () => {
  expect(await ProfileCollection.isProfileExistsAsync("okm-2-0-1-string-p-000"))
    .toBeTruthy();
  expect(await ProfileCollection.isProfileExistsAsync("okm-2-0-1-string-p-001"))
    .toBeFalsy();
});

test("addProfileAsync", async () => {
  const expected1 = new ResponseProfile("alt-2-0-1-response-p-000",
    "/v1/start-application-in-generic-representation",
    {
      "static-field-name": "applicationName"
    },
    "Own application name",
    "string",
    {
      "value-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/application-name"
    }
  );
  await ProfileCollection.addProfileAsync(expected1);
  expect(fileOperation.writeToDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/profile-collection/profile", responseProfile, true
  );
});

test("deleteProfileAsync", async () => {
  await ProfileCollection.deleteProfileAsync("okm-2-0-1-string-p-001");
  expect(fileOperation.deletefromDatabaseAsync).not.toHaveBeenCalled();

  await ProfileCollection.deleteProfileAsync("okm-2-0-1-string-p-000");
  expect(fileOperation.deletefromDatabaseAsync).toBeCalledWith(
    "/core-model-1-4:control-construct/profile-collection/profile=okm-2-0-1-string-p-000");
});

afterEach(() => {
  jest.resetAllMocks();
})
