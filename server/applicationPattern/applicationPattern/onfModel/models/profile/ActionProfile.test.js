const ActionProfile = require('./ActionProfile');
const ProfileCollection = require('../ProfileCollection');

jest.mock('../ProfileCollection');

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

beforeEach(() => {
  jest.spyOn(ProfileCollection, 'getProfileListForProfileNameAsync').mockImplementation(() => [actionProfile]);
});

test("getActionProfile", async () => {
  const expected = new ActionProfile("alt-2-0-1-action-p-002", 
    "/v1/inform-about-application-in-generic-representation",
    "API Documentation",
    [],
    true,
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-op-s-bs-005/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name"
  );
  expect(await ActionProfile.getActionProfile("alt-2-0-1-action-p-002")).toStrictEqual(expected);
});

test("getActionProfileUuidsList", async () => {
  expect(await ActionProfile.getActionProfileUuidsList()).toStrictEqual(["alt-2-0-1-action-p-002"]);
});

afterEach(() => {
  jest.resetAllMocks();
})
