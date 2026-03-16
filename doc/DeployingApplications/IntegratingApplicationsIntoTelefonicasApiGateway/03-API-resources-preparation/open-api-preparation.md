# Preparing the OpenAPI Specification (`spec.json`)

## Overview

The MW-SDN Domain follows an **API-first approach**, meaning that an original OpenAPI specification
exists for each service before any implementation or publication takes place. However, the original
spec is not suitable for direct import into Telefónica's WSO2 API Manager and requires a number of
preparation steps before it can be placed into the `specification/` folder of the
[API Resource Package](./api-preparation.md).

This document describes all required preparation steps to transform the original OpenAPI spec into
the `spec.json` file that will be imported to the API Gateway via the REST ImportAPI service and
serve as the source for the Gateway's Swagger UI.

---

## Table of Contents

1. [Starting Point](#1-starting-point)
2. [Preparation Steps](#2-preparation-steps)
   - [Step 1 — Extend the `info` Section](#step-1--extend-the-info-section)
   - [Step 2 — Reduce the Spec: Remove Private Paths](#step-2--reduce-the-spec-remove-private-paths)
   - [Step 3 — Remove Version Prefixes from Service Paths](#step-3--remove-version-prefixes-from-service-paths)
   - [Step 4 — Configure OAuth2 Security](#step-4--configure-oauth2-security)
   - [Step 5 — Convert from YAML to JSON](#step-5--convert-from-yaml-to-json)
3. [Summary Checklist](#3-summary-checklist)

---

## 1. Starting Point

The original OpenAPI specification for each MW-SDN application lives in the `/spec` folder of
the application's own repository. This is the base file from which all preparation steps below
must be applied.

---

## 2. Preparation Steps

### Step 1 — Extend the `info` Section

The `info` section of the original spec must contain the following mandatory fields. If any of
them are missing, they must be added before proceeding.

```yaml
openapi: 3.0.0
info:
  title: ApplicationName
  description: Short description of the application
  contact:
    name: Max Mustermann
    email: max.mustermann@telefonica.com
  version: 1.0.0
```

Ensure that `title`, `description`, `contact.name`, `contact.email`, and `version` are all
present and correctly filled in. The `contact` block in particular is often absent in original
specs and must be added.

---

### Step 2 — Reduce the Spec: Remove Private Paths

The original spec typically contains paths that are intended for internal use only and must
**not** be exposed to external consumers through the API Gateway. The following paths must be
removed:

**2.1 — OAM Layer paths (Individual and Basic Part)**
Remove all paths belonging to the OAM Layer, identifiable by the tag or section comment
`OAM Layer - Individual Part` and `OAM Layer - Basic Part`. These paths are used for internal
application management (e.g. altering configuration files) and are not relevant to consumers
of the business application.

**2.2 — Service Layer Basic Part paths**
Remove all paths belonging to the `Service Layer - Basic Part`. These paths are used for
internal management within the MW-SDN Domain and are not intended for external consumption.

**2.3 — The `/v1/bequeath-your-data-and-die` path**
Remove the service path `/v1/bequeath-your-data-and-die` from the Individual Service Layer
(`Service Layer - Individual Part`). This path must always be excluded from the published spec.

**2.4 — Any remaining internal Individual Service Layer paths**
Review the remaining paths of the Individual Service Layer and remove any path that is called
internally by the application itself but is not intended for consumption by external clients of
the business application, as well any other indivudual service whose exposure to the clients of the bussiness application is not whished.

---

### Step 3 — Remove Version Prefixes from Service Paths

Per Telefónica's API Gateway guidelines, **service paths must not contain a version prefix**.
The version is not removed from the API altogether — instead, it moves from the individual
service paths into the base URL of the endpoint (configured in `conf.json`).

**Before (original spec):**
```
Base URL:     https://11.22.33.44:5555
Service path: /v1/provide-connected-devices
Full URL:     https://11.22.33.44:5555/v1/provide-connected-devices
```

**After (API Gateway Representantion of the Endpoint):**
```
Endpoint Base URL:     https://11.22.33.44:5555/v1
Service path:          /provide-connected-devices
Full Endpoint URL:     https://11.22.33.44:5555/v1/provide-connected-devices
```

Remove the `/v1/` (or `/v2/`, etc.) prefix from all service paths in the spec. The version
prefix is then specified as part of the backend `url` field in `conf.json`.

> **If your application contains paths with multiple versions** (i.e. both `/v1/` and `/v2/`
> paths coexist in the same spec), these must be published as **separate API instances** — one
> per version. Including paths of different versions in a single published API is not possible.
> See the [Versioning Management](../doc1-workflow/05-managing-versions.md) guide for details.

---

### Step 4 — Configure OAuth2 Security

OAuth2 security must be configured in the spec, either globally (applying to all endpoints) or
individually per endpoint. Both approaches are valid; choose the one that fits your API's
access control requirements.

**4.1 — Add the OAuth2 security scheme**

Add the following block to the `components/securitySchemes` section of the spec. List all
scopes defined for your API under `scopes`. For scope naming conventions and the full list of
available scopes, refer to the [Scopes Reference](../doc2-conventions/05-scopes.md).

```yaml
components:
  securitySchemes:
    oAuth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://test.com
          scopes:
            u-1792:read: ""
```

**4.2 — Apply security globally or per endpoint**

*Option A — Apply globally (recommended when all endpoints share the same security requirement):*

Add the `security` field at the top level of the spec:

```yaml
security:
  - oAuth:
      - u-1792:read
```

*Option B — Apply individually per endpoint (use when different endpoints require different scopes):*

Add a `security` field to each path operation:

```yaml
paths:
  /provide-connected-devices:
    get:
      description: Retrieves list of connected devices
      security:
        - oAuth:
            - u-1792:read
      responses:
        '200':
          description: List of connected devices
```

> 📄 For detailed guidance on scope definitions and assignment, see:
> [Scopes Reference](../doc2-conventions/05-scopes.md)

---

### Step 5 — Convert from YAML to JSON

Once all the above steps have been completed, the spec must be converted from `.yaml` to `.json`
format, as required by the ImportAPI service.

This can be done using any reliable YAML-to-JSON conversion tool. One straightforward option
for quick conversions is [https://onlineyamltools.com/convert-yaml-to-json](https://onlineyamltools.com/convert-yaml-to-json).

Rename the resulting `.json` file to `spec.json`. It is now ready to be placed into the
`specification/` folder of the API Resource Package ZIP archive.

---

## 3. Summary Checklist

Use the following checklist to verify that all preparation steps have been completed before
assembling the ZIP archive.

| # | Step | Done |
|---|------|------|
| 1 | `info` section contains `title`, `description`, `contact.name`, `contact.email`, and `version` | ☐ |
| 2.1 | All OAM Layer paths (Individual and Basic Part) have been removed | ☐ |
| 2.2 | All Service Layer Basic Part paths have been removed | ☐ |
| 2.3 | The `/v1/bequeath-your-data-and-die` path has been removed | ☐ |
| 2.4 | Any remaining internal Individual Service Layer paths have been reviewed and removed if applicable | ☐ |
| 3 | Version prefixes have been removed from all service paths | ☐ |
| 4.1 | OAuth2 security scheme has been added to `components/securitySchemes` | ☐ |
| 4.2 | Security has been applied globally or per endpoint as appropriate | ☐ |
| 5 | Spec has been converted from `.yaml` to `.json` and renamed to `spec.json` | ☐ |
---

*For questions or contributions to this document, contact the MW-SDN Domain working group.*