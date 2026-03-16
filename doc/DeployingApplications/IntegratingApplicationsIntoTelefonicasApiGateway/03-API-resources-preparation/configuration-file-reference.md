# `conf.json` Reference

## Overview

The `conf.json` file is placed in the `configuration/` folder of the API Resource Package.
It defines the runtime behaviour and metadata of the API on the WSO2 API Gateway — including
endpoint configuration, security policies, throttling, scope assignments, and visibility settings.

This document describes a **simplified, representative configuration** applicable to most HTTP APIs published by the MW-SDN Domain that use **Basic Authentication at the endpoint**.

For more advanced or non-standard configurations, please refer to the official  
[Telefónica API-Gateway Publisher Documentation – conf.json](https://confluence.telefonica.de/spaces/AG/pages/985220617/NEW+-+API+Gateway+Publisher+Guide#NEWAPIGatewayPublisherGuide-APIConfiguration).

---

## Table of Contents

1. [Sample Configuration File](#1-sample-configuration-file)
2. [Field Reference](#2-field-reference)

---

## 1. Sample Configuration File

The following is a simplified example of a `conf.json` for a standard HTTP API. It covers the
most common use case: a single backend base URL with Basic authentication, OAuth2 scopes, and
unlimited throttling.

```json
{
    "name": "testFacadeLayerAPI",
    "description": "testFacade",
    "context": "/testFacade",
    "version": "v1",
    "provider": "U-345-testing_Pub",
    "type": "HTTP",
    "policies": [
        "Unlimited"
    ],
    "visibility": "RESTRICTED",
    "visibleRoles": [
        "TefInternal"
    ],
    "gatewayEnvironments": [
        "Production and Sandbox"
    ],
    "businessInformation": {
        "technicalOwner": "APIGW",
        "technicalOwnerEmail": "email@telefonica.com"
    },
    "additionalProperties": [
        {
            "name": "scopes",
            "value": "u-345:apigwDataDelete:d,u-345:apigwDataCreate:c,u-345:apigwDataUpdate:u,u-345:apigwDataQuery:r,u-345:r,u-345:d,u-345:w,u-345:trusted",
            "display": false
        }
    ],
    "endpointConfig": {
        "production_endpoints": {
            "url": "https://endpoint:port/cl001/v1/"
        },
        "endpoint_security": {
            "production": {
                "type": "BASIC",
                "username": "<username>",
                "password": "<password>"
            }
        }
    },
    "endpointImplementationType": "ENDPOINT"
}
```



---

## 2. Field Reference

The table below describes the fields accepted in `conf.json`.

 ### API Configuration Summary


| Field | Description | Example Value |
|-------|------------|---------------|
| name | Unique name for the API. | "ProductCatalogManagement" |
| description | Brief description of the API. | "Product Catalog TMF API Test 2" |
| context | API context + version used to expose the API to subscribers. | "/taro/tmf-api/productCatalogManagement" |
| version | API version. | "v2.0" |
| provider | Provider username (provided via email). | "U-299-TARO-Pub" |
| type | Always HTTP for REST APIs. | "HTTP" |
| policies | Throttling policy (default: "Unlimited"). | ["Unlimited"] |
| visibility | Determines API visibility in the developer portal. Use RESTRICTED to limit access to specific roles. | "RESTRICTED" |
| visibleRoles | Roles allowed to view/access the API (required if visibility=RESTRICTED). | ["TefInternal"] |
| gatewayEnvironments | Environments where the API is deployed (leave as default). | ["Production and Sandbox"] |
| businessInformation | Contact details for technical ownership. Do not use APIGW team email. | { "technicalOwner": "TARO", "technicalOwnerEmail": "group-email@example.com" } |
| additionalProperties | Optional metadata visible in the developer portal  | [{ "name": "group", "value": "coms", "display": false },{ "name": "DEPLOYMENT_ENV", "value": "AWS", "display": false } ...] |
| endpointConfig | Backend URL configuration. | See Endpoint Configuration Table below. |



### Endpoint Configuration Details



| Field | Description | Example Value | Notes |
|-------|------------|---------------|-------|
| endpoint_type | Type of endpoint  | "http" |  |
| production_endpoints | Primary backend URL(s). For http/failover, use a single object. | { "url": "http://mocky.io/v2/" } |  |
| endpoint_security | Authentication between API Gateway and backend (optional). Supports BASIC or OAUTH. |  |  |