# API Resources Preparation

## Overview

This document describes how to prepare the necessary resources for publishing an API through the
API Gateway. It covers the structure and contents of the API Resource Package — the ZIP file that
must be submitted to the **ImportAPI service** — as well as guidance on how to prepare each
individual component correctly before publication.

Following this preparation process ensures that APIs published by the MW-SDN Domain are consistent,
complete, and compliant with the platform requirements of the WSO2 API Gateway.

---

## Table of Contents

1. [API Resource Package Structure](#1-api-resource-package-structure)
2. [Mandatory Components](#3-mandatory-components)
   - [2.1 action.json](#31-actionjson)
   - [2.2 specification/spec.json](#32-specificationspecjson)
   - [2.3 configuration/conf.json](#33-configurationconfjson)
3. [Preparing the OpenAPI Specification](#3-preparing-the-openapi-specification)
4. [Preparing the Configuration](#4-preparing-the-configuration)
5. [Validation Checklist](#5-validation-checklist)

---

## 1. API Resource Package Structure

The API Resource Package is a ZIP file submitted to the ImportAPI service. It must follow a
defined folder structure. The following files and folders are **mandatory** and must always be present.
### Folder Structure

```
api-resource-package.zip
│
├── action.json                          # (Mandatory) Import action descriptor
│
├── specification/                       # (Mandatory) OpenAPI specification
│   └── spec.json
│
├── configuration/                       # (Mandatory) API configuration
    └── conf.json

```


## 2 Mandatory Components

### 2.1 `action.json`

The `action.json` file sits at the **root level** of the ZIP archive (not inside any subfolder).
It acts as the descriptor for the import operation, telling the ImportAPI service what action to
perform and providing top-level metadata about the API being imported.

The contents of action.json should be,

```
{
    "actions": ["CREATE","PUBLISH"]
}
```

---

### 2.2 `specification/spec.json`

The `specification/` folder contains the **OpenAPI specification** of the API, provided as a
JSON file named `spec.json`.

This is the core contract of the API. For the MW-SDN Domain, the canonical OpenAPI specifications
are authored following the API-first approach. However, the canonical spec typically requires
modifications before it is ready for import — for example, removing internal-only paths, adapting
server URLs, or aligning security scheme definitions with WSO2 requirements.

> 📄 For detailed guidance on how to prepare the OpenAPI specification for import, see:
> [Preparing the OpenAPI Specification](#5-preparing-the-openapi-specification) and
> [OpenAPI Preparation Details](./05-preparing-the-openapi-spec.md) *(coming soon)*

---

### 2.3 `configuration/conf.json`

The `configuration/` folder contains the **API configuration file** `conf.json`. This file
defines environment-specific
settings, endpoint configurations, security policies, rate limiting, and scope assignments.


> 📄 For detailed guidance on the content and fields of `conf.json`, see:
> [Configuration File Reference](configuration-file-reference.md)



## 3. Validation Checklist

Before assembling the ZIP archive and submitting it to the ImportAPI service, verify the
following:

### Structure
- [ ] `action.json` is present at the root level of the ZIP
- [ ] `specification/spec.json` is present
- [ ] `configuration/conf.json` is present


### OpenAPI Specification (`spec.json`)
- [ ] Spec is valid OpenAPI 3.x (no schema errors)
- [ ] Internal-only paths have been removed
- [ ] Server URLs reflect the correct environment
- [ ] Security schemes are aligned with WSO2 OAuth2 configuration
- [ ] Scope assignments on operations are correct and consistent with [MW-SDN Scopes](../doc2-conventions/05-scopes.md)
- [ ] Naming conventions follow [MW-SDN Naming Conventions](../doc2-conventions/02-naming-conventions.md)

### Configuration (`conf.json`)
- [ ] Configuration targets the correct environment (E2E / Test / Production)
- [ ] Endpoint URLs are correct for the target environment
- [ ] Rate limiting policy is defined
- [ ] Authentication method is correctly configured

### General
- [ ] ZIP file is correctly assembled (no extra nesting, no missing folders)

---

*For questions or contributions to this document, contact the MW-SDN Domain working group.*