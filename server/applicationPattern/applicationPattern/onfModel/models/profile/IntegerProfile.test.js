const IntegerProfile = require('./IntegerProfile');
const ProfileCollection = require('../ProfileCollection');

jest.mock('../ProfileCollection');

const integerProfile = {
    "uuid": "ro-2-0-1-integer-p-000",
    "profile-name": "integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE",
    "integer-profile-1-0:integer-profile-pac": {
      "integer-profile-capability": {
        "integer-name": "waitTimeToApprove",
        "unit": "second",
        "minimum": 600,
        "maximum": 1209600
      },
      "integer-profile-configuration": {
        "integer-value": 259200
      }
    }
  } ;

beforeEach(() => {
  jest.spyOn(ProfileCollection, 'getProfileListForProfileNameAsync').mockImplementation(() => [integerProfile]);
});

test("getIntegerProfile", async () => {
  const expected = new IntegerProfile("ro-2-0-1-integer-p-000", 
    "waitTimeToApprove",
    "second",
    600,
    1209600,
    259200
  );
  expect(await IntegerProfile.getIntegerProfile("ro-2-0-1-integer-p-000")).toStrictEqual(expected);
});

afterEach(() => {
  jest.resetAllMocks();
})
