const StringProfile = require('./StringProfile');
const ProfileCollection = require('../ProfileCollection');

jest.mock('../ProfileCollection');

const stringProfile = {
    "uuid" : "okm-2-0-1-string-p-000",
    "profile-name" : "string-profile-1-0:PROFILE_NAME_TYPE_STRING_PROFILE",
    "string-profile-1-0:string-profile-pac" : {
      "string-profile-capability" : {
        "string-name" : "operationMode",
        "enumeration" : [
          "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE",
          "string-profile-1-0:STRING_VALUE_TYPE_PROTECTION",
          "string-profile-1-0:STRING_VALUE_TYPE_OFF"
        ]
      },
      "string-profile-configuration" : {
        "string-value" : "string-profile-1-0:STRING_VALUE_TYPE_OFF"
      }
    }
  };

beforeEach(() => {
  jest.spyOn(ProfileCollection, 'getProfileListForProfileNameAsync').mockImplementation(() => [stringProfile]);
});

test("getStringProfile", async () => {
  const expected = new StringProfile("okm-2-0-1-string-p-000", 
    "operationMode",
    [
      "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE",
      "string-profile-1-0:STRING_VALUE_TYPE_PROTECTION",
      "string-profile-1-0:STRING_VALUE_TYPE_OFF"
    ],
    undefined,
    "string-profile-1-0:STRING_VALUE_TYPE_OFF"
  );
  expect(await StringProfile.getStringProfile("okm-2-0-1-string-p-000")).toStrictEqual(expected);
});

afterEach(() => {
  jest.resetAllMocks();
})
