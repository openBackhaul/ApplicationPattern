# High Level Design for Function Testing

This document describes testing Functions defined in spec/Functions/*.  
These functions use JavaScript instead of REST interfaces.  

### Design Targets

Function testing is designed to be:
- **Fast** : runs on every PR/Commit
- **Spec-driven** :  the specification is the single source of truth
- **Deterministic** : all external dependencies are mocked
- **Automated** : tests and mocks are generated from data files

### Coverage of Function Testing

Function Testing automatically checks that each Function implementation ...
- ... provides the function as defined in the spec
- ... returns outputs (structure + meaning) according to the spec (`interface.yaml`)
- ... validates inputs as described in the spec
- ... returns the exact error enum strings defined in the spec
- ... handles dependency failures in a predictable way (using defined error mappings)

### Roles

- **ApplicationOwner**: Provides the spec of the Function in a way that allows a high level of automation of the test case and mock server creation
- **TestEngineer**: Creates an automatically executable package of test cases and mock servers from the specification for each and every Function
- **Implementer**: Applies the package of test cases and mock servers on its individual Function implementation
- **ContinuousTesting/ContinuousIntegration**: Binding the test packages into an automation chain and executing it with every pull request or merge.

###  End-to-End Workflow

- **The ApplicationOwner** : writes the function specification, which defines inputs, outputs, and dependencies.
- **The TestEngineer** : Based on this specification creates the testing scenarios (including valid and invalid inputs, expected success outputs, and error cases) and generates the Jest test modules that automatically mock all dependent functions consumed by the function under test.
- **The Implementer** : Implements the function according to the specification and runs  these Jest modules locally against their function implementation to verify correctness.
- **The ContinuousTesting/ContinuousIntegration** : Ensures that all generated tests are executed automatically for every pull request, providing reproducible and deterministic validation of the function behavior.

![Overview](./diagrams/highLevelDesignTestFlow.png)

### Test Package Structure (What exists per Function version)

For each Function version, the test package consists of:

- **Scenario definition**
  - `testing/FunctionName/version/scenarios.yaml`: file acts as the test configuration, allowing new scenarios to be added without modifying the test code
- **Fixtures**
  - `testing/FunctionName/version/scenarioId/input.json` : the request payload passed to the function under test
  - `testing/FunctionName/version/scenarioId/output.json` : the expected response produced by the function
  - `testing/FunctionName/version/scenarioId/p1ConsumedFunctionName.json` : mocked response for a consumed sub-function, allowing tests to run without calling external services
- **Generated Jest test module(s)**
  - one generated Jest test file per Function version
  - `testing/FunctionName/version/tests/FunctionName.test.js`
- **Runtime environment**
  - Node.js + npm dependencies

### Test File Generator
The test file generator creates the  Jest test file for each Function version

- Path : `testing/tools/generateFunctionTests.js`

The generator works as follows:
  - read `testing/FunctionName/version/scenarios.yaml`
  - generate: `testing/FunctionName/version/tests/FunctionName.test.js`


### Scenario Definition (`scenarios.yaml`)

Scenarios are described in a YAML file:

- Path: `testing/FunctionName/version/scenarios.yaml`

The file contains:
 
- **Module configuration** : module path + export name for
  - the Function under test
  - each dependency step
- **Error mapping** : dependency failure string → Function-level error enum string
  
And for each scenario entry:

- **Scenario ID + description** : (unique, stable)
- **Input fixture reference**  
  JSON fixture located in `testing/FunctionName/version/scenarioId/input.json`
- **Expected outcome**
  - expected success output fixture in  `testing/FunctionName/version/scenarioId/output.json`, or
  - expected error enum string (exactly as defined in the spec)
- **Mocks for dependencies**
  For each dependency step from the spec `processing` section:
  - return payload fixture in `testing/FunctionName/version/scenarioId/p1ConsumedFunctionName.json`, or
  - error string to throw (mapped deterministically)


### Scenario Execution (Runner Logic)

**Requirement**: All processing steps to be mocked must be implemented as importable modules (adapters/helpers/sub-functions) so they can be mocked by Jest

The scenario execution logic is implemented once  and reused by all generated Jest test files :

- Path: `testing/tools/functionTestRunner.js`

For each scenario ID, the runner performs:

- **Load test data**
   - load `testing/FunctionName/version/scenarioId/input.json` 
   - load mock(s) fixtures referenced in `testing/FunctionName/version/scenarioId/p1ConsumedFunctionName.json`

- **Install dependency mocks**
   - all dependencies listed under `processing` are mocked at module level (Jest module mocking)
   - each mocked dependency is configured to:
     - return the referenced fixture JSON, or
     - throw the referenced error string

- **Execute the Function under test**
   - call the real Function implementation with the loaded input fixture

- **Assert**
   - success: deep-compare with `testing/FunctionName/version/scenarioId/output.json`
   - error: exact match with the expected error enum string

### Deterministic Error Handling

Dependencies may fail with their own failure strings.  
To ensure consistent Function behavior, the Function must map dependency failure strings to Function-level error enums.

This mapping is defined explicitly in `scenarios.yaml` so that:

- different implementations behave the same
- error messages remain stable for callers


### Maintenance Rules (When the Spec Changes)

If the spec changes (especially the `processing` section):

- update `scenarios.yaml` to define behavior for the new/changed step
- add/update fixtures for the new/changed step
- regenerate and re-run the Jest test modules




