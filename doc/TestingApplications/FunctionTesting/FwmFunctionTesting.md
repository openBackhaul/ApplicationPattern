# High Level Design for FirmWareManager Function Testing

## 1. Purpose

This design describes how to test FirmWareManager JavaScript functions without real devices, Elasticsearch or production datastores.

The tests execute the **real function under test** and replace its dependencies with controlled test helpers. They verify:

- Inputs and outputs defined by the function interface.
- Calls to dependent functions and services.
- Changes to datastore content.
- Error handling and historical error entries.
- Time-dependent behavior.


## 2. Design targets

- **Spec-driven:** scenarios are derived from `interface.yaml`, `variables.yaml` and the function’s sequence diagram.
- **Deterministic:** no real network, device, datastore or uncontrolled clock is required.
- **Isolated:** every scenario starts with fresh test data.
- **Automated:** scenarios and fixtures are executed by a shared JavaScript test runner.
- **Observable:** tests can inspect function calls and datastore changes, not only return values.

## 3. High-level architecture

```text
                    Test scenario and fixtures
                               |
                               v
                       Jest test runner
                               |
                               v
                    Real function under test
                               |
          +--------------------+--------------------+
          |                    |                    |
          v                    v                    v
  In-memory datastore     Mock dependencies     Fixed clock
       adapters           and target functions
          |                    |                    |
          +--------------------+--------------------+
                               |
                               v
                    Assertions and test report
```

The **real function** makes business decisions. The helpers provide data, simulate dependencies and record what happened.

For example, the `p1Pulser` test must not make the helper decide whether a pulser is due. That decision belongs to `p1Pulser`.

## 4. Test helpers

### 4.1 In-memory datastore adapters

An in-memory datastore adapter is a temporary JavaScript object that implements the datastore operations used by the function under test.

| Adapter | Representative contents | Example test observation |
|---|---|---|
| **DomainController** | Function parameters, pulser configuration, validation sequences, historical errors | `p1Pulser` updated `next-time` |
| **OperationalDS** | Observed device information | A measurement function wrote device data |
| **RunningDS** | Accepted desired configuration | A successful operation changed the desired state |
| **CandidateDS** | Proposed desired-state changes | A function prepared a change before validation |

These may be separate adapters or views of one in-memory DomainController, depending on the real implementation.

Each adapter should support:

1. **Seed:** initialize from a scenario fixture.
2. **Read and write:** provide the same operations that production code expects.
3. **Snapshot:** return the current data for comparison with the expected fixture.
4. **Call recording:** expose relevant reads and writes when a scenario needs to verify them.
5. **Isolation:** create a fresh instance for each scenario.

The adapter must not implement approval, validation, scheduling or other business rules. It stores what the real function writes.

### 4.2 Dependency mocks

Mocks replace consumed functions or services. A scenario configures each mock to return a specified result or fail.

The runner records:

- Which dependency was called.
- The arguments and number of calls.
- Call order, when specified.
- Whether a dependency that should be skipped was called.

For dynamically configured calls, such as a `p1Pulser` target, the test supplies a registry that maps the configured function name to its mock.

### 4.3 Fixed clock

A clock helper returns a scenario-defined time. This makes scheduling, timestamps and expiration tests repeatable.

The implementation must allow the clock to be replaced, either through dependency injection or another agreed test seam.

### 4.4 Lock recording

For functions that lock datastores, a test lock adapter records acquisition and release. Tests can check that locks are released after success or failure.

This does **not** prove that real concurrent locking works. Real datastore locking requires separate integration tests.

### 4.5 Loop control

Some functions, notably `p1Pulser`, describe an endless loop. The implementation needs an agreed testable boundary, such as a **single-cycle operation** or a controllable stop mechanism. The test should never wait for an uncontrolled infinite loop.

## 5. Connecting the real function to helpers

The implementation must allow the test to replace its dependencies. The preferred option is **dependency injection**:

```text
Production:
  Real function → real datastore and real dependencies

Test:
  Real function → in-memory datastore and mocks
```

Alternatively, Jest can replace imported dependency modules. In either case, the production and test adapters must expose compatible operations.

**Prerequisite:** developers and test engineers agree the adapter interfaces, error conventions and loop-control mechanism before implementing the test runner. The helper must model the relevant datastore behavior, including copy and write semantics.

## 6. Proposed test package structure

```text
testing/
├── package.json
├── jest.function.config.js
├── tools/
│   ├── functionTestRunner.js
│   ├── generateFunctionTests.js
│   └── helpers/
│       ├── inMemoryDomainController.js
│       ├── inMemoryDatastores.js
│       ├── mockFunctionRegistry.js
│       ├── fixedClock.js
│       └── recordingLocks.js
└── p1Pulser/
    └── 1.0.0/
        ├── scenarios.yaml
        ├── fixture/
        │   └── dueActivePulserCallsTarget/
        │       ├── domainController.json
        │       └── expectedDomainController.json
        └── tests/
            └── p1Pulser.test.js
```

This is a **proposed structure**, not an existing implementation. Other functions receive their own scenario and fixture folders while reusing the helpers.

## 7. Example scenario: `p1Pulser`

### Scenario

An active pulser is due. It must update its next execution time and call its configured target.

### Given

- Fixed time: `2025-03-08T10:00:00+01:00`
- An in-memory DomainController contains:

```json
{
  "pulser": [
    {
      "target-function": "p1MeasureDomain",
      "is-activated": true,
      "period-length": 487,
      "next-time": "2025-03-08T09:59:00+01:00",
      "ending-time": "2040-12-31T23:59:59+01:00"
    }
  ],
  "historical-error-list": []
}
```

- The registry contains a successful mock for `p1MeasureDomain`.

### When

The real `p1Pulser` runs for one controlled cycle.

### Then

- `next-time` is set to the fixed time plus 487 seconds: `2025-03-08T10:08:07+01:00`.
- The target mock is called once.
- No historical error is added.
- The sequence of updating `next-time` and calling the target follows the [pulser flow](https://github.com/openBackhaul/FirmWareManager/blob/rchy_servicetesting/spec/Functions/Administrative/p1Pulser/1.0.0/p1Pulser.plantuml).

This checks one cycle; it does not claim that the real endless pulser naturally returns successfully.

## 8. Scenario execution

For each scenario, the shared runner:

1. Loads the initial datastore fixture.
2. Creates fresh in-memory adapters.
3. Installs the fixed clock and dependency mocks.
4. Calls the real function.
5. Compares its output or error with the specification, where defined.
6. Compares datastore snapshots with expected fixtures.
7. Checks dependency calls and lock events.

For a validation-failure scenario, the runner can capture RunningDS before the call and verify that it remains unchanged **when the relevant function flow requires that**. Other datastores must be checked according to that function’s own flow.

## 9. Testing scope

| Level | Components used | Purpose |
|---|---|---|
| **Function test** | One real function; in-memory datastores and mocked dependencies | Verify its decisions, calls and state changes. |
| **Function-chain test** | Several real functions; external systems simulated | Verify handoffs and wiring between functions. |
| **Datastore integration test** | Real datastore adapter and datastore | Verify persistence, locking and adapter behavior. |
| **Device integration test** | Real or representative device environment | Verify firmware download and activation when contracts and implementations exist. |


