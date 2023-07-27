const ResponseProfile = require('./ResponseProfile');
const ProfileCollection = require('../ProfileCollection');

jest.mock('../ProfileCollection');

const responseProfile1 = {
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

const responseProfile2 = {
  "uuid": "alt-2-0-1-response-p-007",
  "profile-name": "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
  "response-profile-1-0:response-profile-pac": {
    "response-profile-capability": {
      "operation-name": "/v1/inform-about-release-history-in-generic-representation",
      "field-name": {
        "field-name-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
      },
      "description": "Represents the first entry in the list of releases",
      "datatype": "string"
    },
    "response-profile-configuration": {
      "value": {
        "value-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/changes"
      }
    }
  }
};

const responseProfile3 = {
  "uuid": "alt-2-0-1-response-p-008",
  "profile-name": "response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE",
  "response-profile-1-0:response-profile-pac": {
    "response-profile-capability": {
      "operation-name": "/v1/inform-about-release-history-in-generic-representation",
      "field-name": {
        "field-name-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
      },
      "description": "Represents the first entry in the list of releases",
      "datatype": "string"
    },
    "response-profile-configuration": {
      "value": {
        "static-value": "foo"
      }
    }
  }
};

beforeEach(() => {
  jest.spyOn(ProfileCollection, 'getProfileListForProfileNameAsync').mockImplementation(() => [
    responseProfile1,
    responseProfile2,
    responseProfile3
  ]);
});

test("getResponseProfile", async () => {
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
  expect(await ResponseProfile.getResponseProfile("alt-2-0-1-response-p-000")).toStrictEqual(expected1);

  const expected2 = new ResponseProfile("alt-2-0-1-response-p-007",
    "/v1/inform-about-release-history-in-generic-representation",
    {
      "field-name-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
    },
    "Represents the first entry in the list of releases",
    "string",
    {
      "value-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/changes"
    }
  );
  expect(await ResponseProfile.getResponseProfile("alt-2-0-1-response-p-007")).toStrictEqual(expected2);

  const expected3 = new ResponseProfile("alt-2-0-1-response-p-008",
    "/v1/inform-about-release-history-in-generic-representation",
    {
      "field-name-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
    },
    "Represents the first entry in the list of releases",
    "string",
    {
      "static-value": "foo"
    }
  );
  expect(await ResponseProfile.getResponseProfile("alt-2-0-1-response-p-008")).toStrictEqual(expected3);
});

test("findProfileUuidForFieldNameReferenceAsync", async () => {
  expect(await ResponseProfile.findProfileUuidForFieldNameReferenceAsync(
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
  )).toStrictEqual("alt-2-0-1-response-p-007");
});

test("createResponseProfile", async () => {
  const expected = new ResponseProfile("alt-2-0-1-response-p-009",
    "/v1/inform-about-release-history-in-generic-representation",
    {
      "field-name-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number"
    },
    "Represents the first entry in the list of releases",
    "string",
    {
      "value-reference": "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/changes"
    }
  );
  expect(await ResponseProfile.createProfileAsync(
    "/v1/inform-about-release-history-in-generic-representation",
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/release-number",
    "Represents the first entry in the list of releases",
    "string",
    "/core-model-1-4:control-construct/logical-termination-point=alt-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-list=0/changes"
  )).toStrictEqual(expected);
});

afterEach(() => {
  jest.resetAllMocks();
})
