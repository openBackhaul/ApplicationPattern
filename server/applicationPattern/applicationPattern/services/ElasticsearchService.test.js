const { elasticsearchService, operationalStateEnum, isTcpClientElasticsearch, createResultArray } = require("./ElasticsearchService");
const { Client, errors } = require("@elastic/elasticsearch");
const Mock = require("@elastic/elasticsearch-mock");
const ControlConstruct = require("../onfModel/models/ControlConstruct");
const LogicalTerminationPoint = require("../onfModel/models/LogicalTerminationPoint");
const LayerProtocol = require("../onfModel/models/LayerProtocol");
const TcpClientInterface = require("../onfModel/models/layerProtocols/TcpClientInterface");

jest.mock("../onfModel/models/ControlConstruct");
jest.mock("../onfModel/models/LogicalTerminationPoint");
jest.mock("../onfModel/models/LayerProtocol");
jest.mock("../onfModel/models/layerProtocols/TcpClientInterface");

const mock = new Mock();
const client = new Client({
  node: "http://localhost:9200",
  Connection: mock.getConnection()
});

const esC = {
  "uuid": "alt-2-0-1-es-c-es-1-0-0-000",
  "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
  "client-ltp": [],
  "server-ltp": [
    "alt-2-0-1-http-c-es-1-0-0-000"
  ],
  "layer-protocol": [
    {
      "local-id": "0",
      "layer-protocol-name": "elasticsearch-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_ELASTICSEARCH_LAYER",
      "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac": {
        "elasticsearch-client-interface-configuration": {
          "auth": {
            "api-key": "API key not yet defined."
          },
          "index-alias": "alt-2-0-1"
        },
        "elasticsearch-client-interface-status": {
          "operational-state": "elasticsearch-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
          "life-cycle-state": "elasticsearch-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
        }
      }
    }
  ]
};

beforeAll(() => {
  global.databasePath = "./database/load.json";
  ControlConstruct.getLogicalTerminationPointListAsync.mockReturnValue([esC]);
  ControlConstruct.getLogicalTerminationPointAsync.mockReturnValue(esC);
  jest.spyOn(elasticsearchService, "getClient").mockReturnValue(client);
});

describe("getClient", () => {
  beforeAll(() => {
    elasticsearchService.getClient.mockRestore();
    LogicalTerminationPoint.getServerLtpListAsync.mockReturnValue(["http-uuid"]).mockReturnValue(["tcp-uuid"]);
    TcpClientInterface.getRemoteAddressAsync.mockReturnValue({ "ip-address": { "ipv-4-address": "127.0.0.1" } });
    TcpClientInterface.getRemotePortAsync.mockReturnValue("9002");
    TcpClientInterface.getRemoteProtocolAsync.mockReturnValue("HTTP");
  });

  test("success", async () => {
    expect(await elasticsearchService.getClient(false)).toBeInstanceOf(Client);
    expect(elasticsearchService._clients.size).toBe(1);
    const client = elasticsearchService._clients.get("alt-2-0-1-es-c-es-1-0-0-000");
    expect(client).toBeInstanceOf(Client);
    expect(client).toHaveProperty("connectionPool.auth.apiKey", "API key not yet defined.");
    expect(client).toHaveProperty("connectionPool.connections.0.url.href", "http://127.0.0.1:9002/");
  });

  afterAll(() => {
    jest.spyOn(elasticsearchService, "getClient").mockReturnValue(client);
  });
});

describe("getElasticsearchClientOperationalStateAsync", () => {
  test("AVAILABLE status 200", async () => {
    mock.add({
      method: "HEAD",
      path: "*"
    }, () => {
      return ""
    })
    const result = await elasticsearchService.getElasticsearchClientOperationalStateAsync();
    expect(result).toEqual(operationalStateEnum.AVAILABLE);
  });

  test("UNAVAILABLE when ping fails", async () => {
    mock.add({
      method: "HEAD",
      path: "*"
    }, () => {
      return new errors.ConnectionError({
        body: { message: "Failed connection" }
      })
    })

    const result = await elasticsearchService.getElasticsearchClientOperationalStateAsync();
    expect(result).toEqual(operationalStateEnum.UNAVAILABLE);
  });

  test("UNAVAILABLE status 500", async () => {
    mock.add({
      method: "HEAD",
      path: "*"
    }, () => {
      return new errors.ResponseError({
        body: { errors: {}, status: 500 },
        statusCode: 500
      })
    })

    const result = await elasticsearchService.getElasticsearchClientOperationalStateAsync();
    expect(result).toEqual(operationalStateEnum.UNAVAILABLE);
  });
});

describe("getExistingIndexTemplate", () => {
  test("success", async () => {
    const indexTemplate = {
      name: "alt-index-template",
      body: {
        index_patterns: ["alt-2-0-1-*"]
      }
    };
    // first call
    mock.add({
      method: "GET",
      path: "/_index_template",
      queryString: {
        filter_path: "*.name,**.index_patterns"
      }
    }, () => {
      return {
        index_templates: [{
          name: "alt-index-template",
          index_template: {
            index_patterns: ["alt-2-0-1-*"]
          }
        }]
      };
    });

    // second call
    mock.add({
      method: "GET",
      path: "/_index_template/alt-index-template"
    }, () => {
      return {
        index_templates: [{
          name: "alt-index-template",
          index_template: {
            index_patterns: ["alt-2-0-1-*"]
          }
        }]
      };
    });
    expect(await elasticsearchService.getExistingIndexTemplate("alt-2-0-1-es-c-es-1-0-0-000")).toStrictEqual(indexTemplate);
  });

  test("index pattern not found", async () => {
    // first call
    mock.add({
      method: "GET",
      path: "/_index_template",
      queryString: {
        filter_path: "*.name,**.index_patterns"
      }
    }, () => {
      return {
        index_templates: [{
          name: "alt-index-template",
          index_template: {
            index_patterns: ["foo-*"]
          }
        }]
      };
    });
    expect(await elasticsearchService.getExistingIndexTemplate("alt-2-0-1-es-c-es-1-0-0-000")).toBeUndefined();
  });
});

test("putElasticsearchClientServiceRecordsPolicyAsync", async () => {
  const uuid = "alt-2-0-1-es-c-es-1-0-0-000";
  const policyBody = {
    "elasticsearch-client-interface-1-0:service-records-policy": {
      "service-records-policy-name": "test-policy",
      "description": "Test policy description",
      "project": "Test project",
      "phases": {
        "warm": {
          "min-age": "10d",
          "actions": {
            "forcemerge": {
              "max-num-segments": 1
            }
          }
        }
      }
    }
  };
  mock.add({
    method: "PUT",
    path: "/_ilm/policy/test-policy",
    body: {
      policy: {
        _meta: {
          description: "Test policy description",
          project: "Test project"
        },
        phases: {
          warm: {
            min_age: "10d",
            actions: {
              forcemerge: {
                max_num_segments: 1
              }
            }
          }
        }
      }
    }
  }, () => {
    return {
      acknowledged: true
    }
  });

  const result = await elasticsearchService.putElasticsearchClientServiceRecordsPolicyAsync(uuid, policyBody);
  expect(result.body.acknowledged).toBeTruthy();
});

// a little hack due to https://github.com/elastic/elasticsearch-js-mock/issues/9 still being open
describe("assignPolicyToIndexTemplate", () => {
  test("success", async () => {
    let putCalled = false;
    let rolloverCalled = false;
    mock.add({
      method: "PUT",
      path: "/_index_template/alt-index-template",
      body: {
        index_patterns: ["alt-2-0-1"],
        template: {
          settings: {
            index: {
              lifecycle: {
                name: "test-policy",
                rollover_alias: "alt-2-0-1"
              }
            }
          }
        }
      }
    }, () => {
      putCalled = true;
      return "";
    });

    mock.add({
      method: "POST",
      path: "/alt-2-0-1/_rollover"
    }, () => {
      rolloverCalled = true;
      return "";
    });
    jest.spyOn(elasticsearchService, "getExistingIndexTemplate").mockReturnValue({
      name: "alt-index-template",
      body: {
        index_patterns: ["alt-2-0-1"],
        template: {
          settings: { index: { lifecycle: { name: {} } } }
        }
      }
    });
    await elasticsearchService.assignPolicyToIndexTemplate("test-policy", "alt-2-0-1-es-c-es-1-0-0-000");
    expect(putCalled).toBeTruthy();
    expect(rolloverCalled).toBeTruthy();
  });

  afterEach(() => {
    elasticsearchService.getExistingIndexTemplate.mockRestore();
  });
});

describe("getElasticsearchClientServiceRecordsPolicyAsync", () => {
  test("no policy found for index alias", async () => {
    const expected = {
      "service-records-policy-name": "",
      "phases": {}
    };
    mock.add({
      method: "GET",
      path: "/alt-2-0-1/_settings/index.lifecycle.name",
    }, () => {
      return "";
    });
    expect(await elasticsearchService.getElasticsearchClientServiceRecordsPolicyAsync("alt-2-0-1-es-c-es-1-0-0-000")).toEqual(expected);
  });

  test("success", async () => {
    const expected = {
      "service-records-policy-name": "alt-policy",
      "phases": {}
    };
    // first call
    mock.add({
      method: "GET",
      path: "/alt-2-0-1/_settings/index.lifecycle.name",
    }, () => {
      return {
        "alt-2-0-1": {
          "settings": {
            "index": {
              "lifecycle": {
                "name": "alt-policy"
              }
            }
          }
        }
      };
    });

    //second call
    mock.add({
      method: "GET",
      path: "/_ilm/policy/alt-policy",
    }, () => {
      return {
        "alt-policy": {
          "policy": {
            "phases": {}
          }
        }
      };
    });
    expect(await elasticsearchService.getElasticsearchClientServiceRecordsPolicyAsync("alt-2-0-1-es-c-es-1-0-0-000")).toEqual(expected);
  });
});

test("updateControlConstructWithServicePolicy", async () => {
  const policy = {
    "service-records-policy-name": "alt-policy",
    "phases": {}
  };
  const controlConstruct =
  {
    "logical-termination-point": [{
      "uuid": "alt-2-0-1-es-c-es-1-0-0-000",
      "layer-protocol": [
        {
          "local-id": "0",
          "layer-protocol-name": "elasticsearch-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_ELASTICSEARCH_LAYER",
          "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac": {
            "elasticsearch-client-interface-configuration": {
              "index-alias": "alt-2-0-1"
            }
          }
        }
      ]
    }
    ]
  };
  const expectedControlConstruct =
  {
    "logical-termination-point": [{
      "uuid": "alt-2-0-1-es-c-es-1-0-0-000",
      "layer-protocol": [
        {
          "local-id": "0",
          "layer-protocol-name": "elasticsearch-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_ELASTICSEARCH_LAYER",
          "elasticsearch-client-interface-1-0:elasticsearch-client-interface-pac": {
            "elasticsearch-client-interface-configuration": {
              "index-alias": "alt-2-0-1",
              "service-records-policy": {
                "service-records-policy-name": "alt-policy",
                "phases": {}
              }
            }
          }
        }
      ]
    }
    ]
  };
  jest.spyOn(elasticsearchService, "getElasticsearchClientServiceRecordsPolicyAsync").mockReturnValue(policy);
  expect(await elasticsearchService.updateControlConstructWithServicePolicy(controlConstruct)).toStrictEqual(expectedControlConstruct);
});

describe("createAlias", () => {
  let createCalled;

  beforeEach(() => {
    createCalled = false;
    mock.add({
      method: "PUT",
      path: "/alt-2-0-1-000001"
    }, () => {
      createCalled = true;
      return "";
    });
  });

  test("alias already exists", async () => {
    mock.add({
      method: "HEAD",
      path: "/_alias/alt-2-0-1",
    }, () => {
      return "";
    });
    await elasticsearchService.createAlias("alt-2-0-1-es-c-es-1-0-0-000");
    expect(createCalled).toBeFalsy();
  });

  test("success", async () => {
    mock.add({
      method: "HEAD",
      path: "/_alias/alt-2-0-1",
    }, () => {
      return new errors.ResponseError({
        body: { errors: {}, status: 404 },
        statusCode: 404
      })
    });
    await elasticsearchService.createAlias("alt-2-0-1-es-c-es-1-0-0-000");
    expect(createCalled).toBeTruthy();
  });
});

describe("scroll", () => {
  test("improper usage", async () => {
    expect(async () => {
      await elasticsearchService.scroll(5, 5, "foo")
    }).rejects.toThrow("This method should not be used for queries with results below 10k.");
  });

  test("empty response", async () => {
    mock.add({
      method: "POST",
      path: "/alt-2-0-1/_search",
      queryString: {
        filter_path: "took,hits.hits._source,_scroll_id,hits.total",
        scroll: "1m",
        size: 10000
      },
      body: {
        query: "foo"
      }
    }, () => {
      return {
        hits: {
          total: { value: 50, relation: "eq" },
          hits: []
        },
        took: 1
      }
    });
    expect(await elasticsearchService.scroll(100, 50000, "foo")).toStrictEqual({ "response": [], "took": 1 });
  });

  test("response", async () => {
    mock.add({
      method: "POST",
      path: "/alt-2-0-1/_search",
      queryString: {
        filter_path: "took,hits.hits._source,_scroll_id,hits.total",
        scroll: "1m",
        size: 10000
      },
      body: {
        query: "foo"
      }
    }, () => {
      return {
        hits: {
          total: { value: 30005, relation: "eq" },
          hits: []
        },
        scrollId: "12345",
        took: 1
      }
    });
    mock.add({
      method: "GET",
      path: "/_search/scroll",
      queryString: {
        filter_path: "took,hits.hits._source",
        scrollId: "12345",
        scroll: "1m"
      }
    }, () => {
      return {
        hits: {
          total: { value: 30005, relation: "eq" },
          hits: [
            {
              _source: {
                "foo": "bar1"
              }
            }
          ]
        },
        took: 2
      }
    });
    mock.add({
      method: "DELETE",
      path: "/_search/scroll",
      queryString: {
        scrollId: "12345"
      }
    }, () => {
      return ""
    });
    expect(await elasticsearchService.scroll(30003, 1, "foo")).toStrictEqual({
      "response": [{
        "foo": "bar1"
      }]
      , "took": 13
    });
  });
});

test("createResultArray", () => {
  const input = {
    body: {
      hits: {
        hits: [
          {
            _source: {
              "foo": "bar1"
            }
          },
          {
            _source: {
              "foo": "bar2"
            }
          }
        ]
      }
    }
  };
  expect(createResultArray(input)).toStrictEqual([{ "foo": "bar1" }, { "foo": "bar2" }]);
});

describe("isTcpClientElasticsearch", () => {
  test("false", async () => {
    LogicalTerminationPoint.getClientLtpListAsync
      .mockReturnValue(["alt-2-0-1-http-c-es-1-0-0-000"])
      .mockReturnValue([]);

    expect(await isTcpClientElasticsearch("alt-2-0-1-tcp-c-es-1-0-0-000")).toBeFalsy();
  });

  test("true", async () => {
    LogicalTerminationPoint.getClientLtpListAsync
      .mockReturnValue(["alt-2-0-1-http-c-es-1-0-0-000"])
      .mockReturnValue(["alt-2-0-1-es-c-es-1-0-0-000"]);
    LayerProtocol.getLayerProtocolName.mockReturnValue(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);

    expect(await isTcpClientElasticsearch("alt-2-0-1-tcp-c-es-1-0-0-000")).toBeTruthy();
    expect(LayerProtocol.getLayerProtocolName).toHaveBeenCalledWith("alt-2-0-1-es-c-es-1-0-0-000")
  });
});

afterEach(() => {
  mock.clearAll();
  jest.clearAllMocks();
});
