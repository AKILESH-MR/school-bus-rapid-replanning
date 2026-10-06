# School Bus Rapid Replanning

A real-time dashboard and AI-assisted replanning system designed for school district transportation dispatchers. 

## Overview
This system provides visibility into the district's bus fleet, student routing, and driver assignments. In the event of disruptions (student cancellations, urgent additions, or vehicle breakdowns), the embedded rapid replanning engine quickly evaluates deterministic constraints (capacity, driver availability, existing commitments, ADA lift requirements) and recommends feasible solutions to dispatchers.

> [!IMPORTANT]
> ### Implementation Reality Notice (Current MVP Scope)
> The current project is a **browser SPA backed by a local Node.js REST API**. The frontend uses `src/api/client.js` to load domain data and persist disruption/replan decisions when the local backend is available, while retaining the existing local/mock fallback for degraded or offline operation. PostgreSQL is supported by the backend with automatic SQLite fallback.
> Remote cloud deployment, external message brokers, and physical vehicle GPS hardware are still future production work.

---

## Architectural Implementation Reality Matrix

To maintain strict technical transparency, the table below documents the exact implementation status across the 10 core architectural dimensions:

| # | Architectural Dimension | Current Status | Classification | Technical Description |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Cloud / Backend Server** | **Local Server Implemented** | **IMPLEMENTED NOW (LOCAL)** | Built with Node.js `node:http` and SQLite (`server/server.js`), providing local backend persistence and REST API capabilities. Remote cloud deployment is future production work. |
| **2** | **Central REST API** | **Implemented (Local API)** | **IMPLEMENTED NOW** | Local HTTP endpoints implemented: `POST /api/gps/update`, `GET /api/gps`, `GET /api/gps/:id`, `GET /api/buses`, `GET /api/routes`, `POST /api/disruptions`, `POST /api/replans`, and `POST /api/sync`. |
| **3** | **Message Broker (Kafka / RabbitMQ / MQTT)** | **Not Implemented** | **FUTURE PRODUCTION WORK** | No distributed streaming platform or AMQP broker is utilized. Operational event queuing is handled locally in-memory and via browser `localStorage`. |
| **4** | **Browser LocalStorage Persistence** | **Implemented** | **IMPLEMENTED NOW** | Client-side persistent storage is actively implemented via `localStorage` for offline action queuing (`school_bus_pending_sync`) and deduplication keys (`school_bus_synced_actions`, capped at 1,000 keys). |
| **5** | **Central-Server Sync** | **Implemented** | **IMPLEMENTED NOW** | Synchronization supported via client-side simulation in `store.js` and server-side replay via `POST /api/sync`, managing FIFO queue processing, failure handling, retry counting, and idempotency deduplication. |
| **6** | **GPS Telematics Provider Layer** | **Implemented (Simulated/API)** | **IMPLEMENTED NOW (SIMULATED)** | GPS Provider abstraction (`BaseGPSProvider`, `MockGPSProvider`, `BackendGPSProvider`) with payload validation, automatic freshness calculation, 5 telematics states (`LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`), manual override preservation, and `POST /api/gps/update`. **No real physical vehicle GPS devices are attached; telemetry is simulated for MVP.** Real vehicle hardware OBD-II streaming is future work. |
| **7** | **Map & Road Routing** | **Leaflet + Planar Math** | **IMPLEMENTED NOW** | Interactive map visualization is rendered with Leaflet and OpenStreetMap tiles. Distances are calculated using calibrated planar coordinates scaled by regional factors and an urban circuity multiplier ($1.30$). Vector road-graph routing (OSRM/Mapbox) is future work. |
| **8** | **Live Traffic Data** | **Not Implemented** | **FUTURE PRODUCTION WORK** | Transit travel times are calculated based on planar distance, standard operating speeds ($20\text{ mph}$), and student boarding dwell times. Real-time dynamic traffic sensor APIs are future work. |
| **9** | **Production Authentication** | **Simulated Switcher** | **SIMULATED FOR MVP** | A client-side role selection switcher (Dispatcher, Admin, Driver, Parent, Observer) is implemented for UI demonstration. Enterprise SSO, OAuth 2.0 / OIDC, JWTs, and secure server-enforced RBAC are future work. |
| **10** | **Database Persistence** | **PostgreSQL + SQLite Fallback** | **IMPLEMENTED NOW (LOCAL MVP)** | Backend database factory uses PostgreSQL when configured and reachable, with graceful SQLite fallback. Client runtime state remains reactive/in-memory with browser `localStorage` for offline queue/idempotency. Production cloud deployment is future work. |

---

## Frontend ↔ Backend Integration

The main frontend state store now uses the existing REST client (`src/api/client.js`) for backend-aware initialization and persistence:

- `store.fetchInitialData()` attempts to load buses, routes, disruptions, drivers, students, schools, and audit data from the local API. If the API is unavailable, the existing `mockData.js` state remains as the fallback.
- New disruptions are persisted through `POST /api/disruptions` and can trigger backend replan generation through `POST /api/replans`.
- Accept / Modify / Reject decisions are forwarded to the corresponding replan endpoints while the UI keeps the existing human-in-the-loop state transition.
- Offline actions continue to use the browser store-and-forward queue and `POST /api/sync` when connectivity returns.
- GPS updates are handled through the existing GPS provider layer and reflected in the reactive AppStore.

## GPS Integration Layer

The MVP includes a realistic, production-ready GPS integration architecture (`src/utils/gpsProvider.js` and `server/server.js`):

1. **Provider Abstraction:**
   - `BaseGPSProvider`: Abstract interface for telemetry validation and lifecycle events.
   - `MockGPSProvider`: Generates synthetic telemetry for automated tests and offline simulation.
   - `BackendGPSProvider`: Ingests GPS telemetry updates via the REST API (`POST /api/gps/update`).
2. **REST API Endpoint (`POST /api/gps/update`):**
   - Ingests `{ busId, latitude, longitude, timestamp, source, [speedKmh, heading, locationName, clearManual] }`.
   - Validates coordinates (latitude between -90 and 90, longitude between -180 and 180) and timestamps (ISO-8601 or epoch ms, max 5 min future drift).
3. **Automatic Freshness & Classification:**
   - **`LIVE`** ($\le 60\text{s}$ old): High trust, zero uncertainty penalty.
   - **`LAST_KNOWN`** ($61\text{s} - 120\text{s}$ old): Medium trust, +1.50 distance penalty + 25% uncertainty expansion.
   - **`STALE`** ($121\text{s} - 600\text{s}$ old): Low trust, +4.00 distance penalty + 60% uncertainty expansion, requires dispatcher verification.
   - **`NO_SIGNAL`** ($> 600\text{s}$ or signal lost): None trust, +8.00 distance penalty, conservative distance fallback without inventing coordinates.
   - **`MANUAL`**: Dispatcher manual location checkpoint override (+0.50 checkpoint buffer, strictly preserves manual fix against automated GPS influx until explicitly released).
4. **Implementation Transparency Notice:**
   - **No Real Physical Bus GPS Devices:** Telematics is ingested via the REST API or generated by the mock provider. The system explicitly discloses simulation mode and does NOT claim physical telematics hardware integration unless an external vendor (e.g. Samsara, Geotab) is configured with live credentials.

---

## Features
- **Live Dispatch Dashboard:** Fleet status tracking, active polyline routes, and disruption review alerts.
- **Rapid Replanning Engine:** Greedy Insertion Heuristic evaluating candidate buses for minimal detour delay and generating 12-dimension explanation cards.
- **Deterministic Invariant Enforcement:** Strict binary checks prevent capacity violations, driver conflicts, and ADA lift mismatches. Zero constraint violations permitted.
- **Offline Store-and-Forward:** Degraded network modes, persistent local queuing, retry mechanism, and persistent idempotency deduplication.
- **GPS Fallback Hierarchy:** 5-state degradation model with heuristic uncertainty scoring discounts and manual checkpoint coordinates.
- **Evaluation Benchmark:** Built-in quantitative benchmark comparing engine runtime ($\sim 2.06\text{ms}$) and E2E recovery ($\sim 43.9\text{s}$) against a simulated manual phone-tree baseline.

---

## Documentation Index
- [Final Requirements Traceability Matrix](FINAL_REQUIREMENTS_TRACEABILITY.md): Definitive final audit mapping requirements, implementations, tests, status, and limitations.
- [Requirements Traceability Matrix](REQUIREMENTS_TRACEABILITY.md): Complete mapping of requirements, implementations, tests, evidence, and known limitations.
- [User Guide](USER_GUIDE.md): Operational guide for dispatchers covering disruption workflows, fallback mechanisms, and HITL controls.
- [Architecture & Fallback Documentation](ARCHITECTURE_DIAGRAM.md): System pipeline, sequence diagrams, and future production reference architecture.
- [Data Schema](DATA_SCHEMA.md): Formal data model for entities, GPS telematics states, queued actions, and audit trail.
- [Evaluation Report](EVALUATION_REPORT.md): Quantitative benchmark comparing the engine against simulated manual baseline across 9 scenarios.
- [Stakeholder Validation Plan](STAKEHOLDER_VALIDATION_PLAN.md): Formal protocol and pre-trial procedures for real stakeholder testing (Note: No real stakeholder validation has been conducted yet).
- [Developer Walkthrough Verification Report](VALIDATION_REPORT.md): Internal procedural walkthrough verification and blank evaluation scorecard template.
- [Risk Register](RISK_REGISTER.md): Operational, algorithmic, and human-in-the-loop risks and mitigations.
- [Stakeholder Assumptions](STAKEHOLDER_ASSUMPTIONS.md): Explicit assumptions, operational boundaries, and documented limitations.
- [Testing Strategy & Technical Documentation](#testing-strategy--technical-documentation): Comprehensive documentation of all 13 unit, integration, and scenario test suites, coverage details, and invariant verifications.
- [Error Handling & Failure Boundaries](#error-handling--failure-boundaries): Detailed technical documentation of error detection, offline queueing, GPS fallbacks, database failover, and frontend error boundary status.
- [API Documentation](#api-documentation): Technical documentation of all 14 implemented REST API endpoints, request/response schemas, status codes, idempotency, and GPS telematics.
- [Database Schema Documentation](#database-schema-documentation): Detailed technical documentation of the 12 PostgreSQL/SQLite database tables, schema relationships, idempotency keys, and automatic failover architecture.

---

## Setup & Development

**Prerequisites:** Node.js (v18+)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build production bundle
npm run build

# Run the full test & evaluation suite
npm test

# Run any individual test suite
node tests/greedyReplanningEngine.test.js
node tests/storeAndForwardGps.test.js
node tests/replanningEdgeCases.test.js
node tests/evaluation.test.js
node tests/routeProgressAndDriverLocation.test.js
node tests/modifyPlanWorkflow.test.js
node tests/explanationAndAudit.test.js
node tests/insertionPositionConsistency.test.js
node tests/cancellationApprovalWorkflow.test.js
node tests/gpsFreshnessScoring.test.js
node tests/gpsIntegrationLayer.test.js
node tests/backendApi.test.js
node tests/postgresDatabase.test.js
```

---

## Testing Strategy & Technical Documentation

### 1. Test Harness Architecture & Execution Command

The project implements a **native Node.js test runner architecture** (ES Modules, `node:assert`, and custom assertion harnesses) without external heavyweight test framework dependencies (such as Jest or Mocha). Tests execute directly against the domain logic, reactive store, geospatial algorithms, REST API server, and database repositories.

#### Primary Test Command
```bash
npm test
```

#### Actual Test Execution Chain (`package.json`)
As configured in `package.json`, running `npm test` sequentially executes all 13 hardened test suites across the entire stack:
```bash
node tests/greedyReplanningEngine.test.js && \
node tests/storeAndForwardGps.test.js && \
node tests/replanningEdgeCases.test.js && \
node tests/evaluation.test.js && \
node tests/routeProgressAndDriverLocation.test.js && \
node tests/modifyPlanWorkflow.test.js && \
node tests/explanationAndAudit.test.js && \
node tests/insertionPositionConsistency.test.js && \
node tests/cancellationApprovalWorkflow.test.js && \
node tests/gpsFreshnessScoring.test.js && \
node tests/gpsIntegrationLayer.test.js && \
node tests/backendApi.test.js && \
node tests/postgresDatabase.test.js && \
node tests/frontendErrorRetry.test.js && \
node tests/dispatcherE2EWorkflow.test.js
```

#### Test Isolation & Environment Safety
- **State Store Isolation:** Each test suite initializes clean instances of `AppStore` or isolated mock stores (`createFreshStore()`).
- **Browser API Polyfills:** Node-compatible mocks for `window` and `localStorage` isolate storage keys and prevent test pollution across executions.
- **Database Sandboxing:**
  - Backend API tests utilize an ephemeral in-memory SQLite database (`:memory:`).
  - PostgreSQL repository tests utilize a deterministic in-memory SQL query executor (`MockPgExecutor`) and test connection failover on unreachable ports (`54399`).
- **Network Port Isolation:** Integration tests dynamically bind local HTTP servers to ephemeral OS-assigned ports (port `0`) or dedicated test ports (`3099`), preventing port collision.

---

### 2. Test Suite Summary Matrix

| # | Test File | Primary Category | Scope / Layer | Assertions | Invariants & Hard Boundaries Enforced |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **1** | [`tests/greedyReplanningEngine.test.js`](tests/greedyReplanningEngine.test.js) | Greedy Replanning | Heuristic Engine (Unit) | 7 / 7 Passed | Capacity bounds, driver availability, ADA lift requirement, manual escalation fallback. |
| **2** | [`tests/storeAndForwardGps.test.js`](tests/storeAndForwardGps.test.js) | Store-and-Forward & GPS | State & Telematics (Unit) | 17 / 17 Passed | Idempotency deduplication, FIFO ordering, zero action loss, 5 telematics states, VHF override. |
| **3** | [`tests/replanningEdgeCases.test.js`](tests/replanningEdgeCases.test.js) | Edge & Failure Cases | Full Lifecycle (Scenario) | 9 / 9 Passed | Multi-disruption concurrency, resource collision avoidance, 8-minute SLA target adherence. |
| **4** | [`tests/evaluation.test.js`](tests/evaluation.test.js) | Evaluation & Baseline | Benchmark & SLA (Unit) | 100% Passed | Metric separation (engine ms vs E2E sec), 10-field schema, deterministic metric reproducibility. |
| **5** | [`tests/routeProgressAndDriverLocation.test.js`](tests/routeProgressAndDriverLocation.test.js) | Route Progress & Driver Location | Geospatial Routing (Unit) | 7 / 7 Passed | Completed stop immutability, remaining route insertion, driver proximity (<15 mi), stale location flag. |
| **6** | [`tests/modifyPlanWorkflow.test.js`](tests/modifyPlanWorkflow.test.js) | Modify Plan Workflow | HITL Customizer (Unit) | 7 / 7 Passed | Delay filtering, preferred bus priority, before/after comparison generation, non-auto-approval. |
| **7** | [`tests/explanationAndAudit.test.js`](tests/explanationAndAudit.test.js) | Explanation & Audit | Explainability & Audit (Unit) | 18 / 18 Passed | 6 hard constraint checks audited, 6 audit lifecycle events, explanation-state consistency. |
| **8** | [`tests/insertionPositionConsistency.test.js`](tests/insertionPositionConsistency.test.js) | Insertion Position Consistency | Route Integrity (Unit) | 22 / 22 Passed | Exact greedy index application, `routeVersionKey` fingerprinting, completed stops preservation. |
| **9** | [`tests/cancellationApprovalWorkflow.test.js`](tests/cancellationApprovalWorkflow.test.js) | Cancellation Approval / HITL | State Machine (Unit) | 65 / 65 Passed | Zero pre-approval mutations, 8-field audit record schema, rejection state rollback. |
| **10** | [`tests/gpsFreshnessScoring.test.js`](tests/gpsFreshnessScoring.test.js) | GPS Freshness Scoring | Heuristic Scorer (Unit) | 9 / 9 Passed | Monotonic uncertainty penalty ordering, live vs stale ranking inversion, hard constraint priority. |
| **11** | [`tests/gpsIntegrationLayer.test.js`](tests/gpsIntegrationLayer.test.js) | GPS Integration Layer | Provider & REST (Integration) | 24 / 24 Passed | Coordinate/timestamp validation, signal loss recovery, manual override preservation, MVP disclosure. |
| **12** | [`tests/backendApi.test.js`](tests/backendApi.test.js) | Backend REST API | Local Server (Integration) | 39 / 39 Passed | HTTP status codes (200, 201, 400, 404), sync deduplication idempotency, replan lifecycle. |
| **13** | [`tests/postgresDatabase.test.js`](tests/postgresDatabase.test.js) | PostgreSQL Database | Database & Storage (Unit/Int) | 62 / 62 Passed | 11-table schema migration, seed data counts, repository CRUD, automatic SQLite fallback. |
| **14** | [`tests/frontendErrorRetry.test.js`](tests/frontendErrorRetry.test.js) | Frontend Error & Retry State | UI Resilience (Unit) | 18 / 18 Passed | Per-operation loading & error states, duplicate retry suppression, offline sync error lifecycle. |
| **15** | [`tests/dispatcherE2EWorkflow.test.js`](tests/dispatcherE2EWorkflow.test.js) | Dispatcher End-to-End Workflow | Full Workflow E2E (Unit/Int) | 9 / 9 Passed | Scenarios A–I: Cancel, Add, Breakdown, Stale rec, Failed sync retry, Idempotency, Manual escalation. |

---

### 3. Granular Test Suite Specifications

#### 3.1. Greedy Replanning Engine
- **Test File:** [`tests/greedyReplanningEngine.test.js`](tests/greedyReplanningEngine.test.js)
- **Purpose:** Verifies the isolated mathematical and constraint-validation logic of the Greedy Insertion Replanning Heuristic (`src/utils/replanningEngine.js`).
- **Main Functionality Tested:** Core replanning engine execution across disruption types (`student_cancel`, `urgent_add`, `breakdown`), deterministic invariant validation, candidate generation, candidate scoring, and manual escalation triggers.
- **Important Scenarios Covered:**
  - *Student Cancellation:* Verifies that student absence reduces vehicle load and produces negative additional delay (dwell time savings).
  - *Urgent Student Addition:* Verifies candidate evaluation, selection of closest feasible bus (`BUS-01`), and greedy stop insertion strictly after completed stops (insertion position $\ge 1$).
  - *Vehicle Breakdown Replanning:* Verifies immediate rejection of the disabled vehicle and successful selection of a depot standby bus (`BUS-05`) with adequate capacity ($\ge 36$).
  - *Capacity Violation Prevention:* Validates that `constraintValidator.validateCapacity()` rejects over-capacity assignments for fully loaded buses (e.g., 48/48 load).
  - *Driver Sickness / Unavailability:* Validates that sick drivers (`DRV-102`) are rejected by `constraintValidator.validateDriverAvailability()`.
  - *ADA Accessibility Enforcement:* Validates that student wheelchair lift requirements reject vehicles lacking lift amenities.
  - *No Feasible Solution Fallback:* Validates that when all fleet vehicles are disabled or at capacity, the engine flags `noFeasibleSolution: true`, `escalateToManual: true`, sets `selectedBus: null`, and returns all rejected candidates with reasons.
- **Expected Behavior:** Strict invariant preservation with 0 allowed violations, deterministic candidate scoring, explicit candidate rejection rationales, and graceful escalation to manual dispatch.

---

#### 3.2. Store-and-Forward & GPS Telematics Resilience
- **Test File:** [`tests/storeAndForwardGps.test.js`](tests/storeAndForwardGps.test.js)
- **Purpose:** Verifies network disconnection resilience, local store-and-forward queueing, idempotency deduplication across reloads and retries, and the 5-state GPS telematics degradation model.
- **Main Functionality Tested:** `AppStore` dispatch and offline queue pipeline (`src/state/store.js`), `localStorage` persistence, retry counters, FIFO queue processing, network recovery auto-sync, and manual telematics overrides.
- **Important Scenarios Covered:**
  - *Online Normal Execution:* Verifies immediate execution, zero queue pollution, and append-only audit logging.
  - *Network Interruption Disconnect:* Verifies that operations dispatched offline are stored in `pendingOfflineChanges` with status `PENDING` and zero data loss.
  - *Queued Action Schema Integrity:* Verifies presence of all 9 required attributes: `actionId`, `timestamp`, `userId`, `role`, `actionType`, `payload`, `status`, `retryCount`, `lastAttempt`, and `error`.
  - *FIFO Queue Order:* Verifies that multiple pending offline actions preserve insertion order.
  - *Idempotency Hardening (5 Sub-Scenarios):*
    - **5A (Same-Session):** Duplicate action submissions in online, offline, and cross-mode states are suppressed without duplicate logs or queue entries.
    - **5B (Reload Persistence):** Idempotency keys survive simulated browser restarts/reloads via `localStorage`, rejecting duplicate re-submissions.
    - **5C (Retry Duplicate Prevention):** Retrying a failed action updates the existing queue item instead of creating duplicate records.
    - **5D (Network Recovery Duplicate Prevention):** Network reconnection auto-sync flushes the queue once without duplicate processing or duplicate audit records.
    - **5E (Legitimate Distinct Actions):** Distinct operational actions execute without false deduplication suppression.
  - *Sync Failure & Retry:* Verifies that sync failures mark actions as `FAILED`, increment `retryCount`, log errors, and support individual or batch retry upon network recovery.
  - *No False Sync:* Proves that failed sync attempts never report false success or log `[SYNCED]` events.
  - *5-State Telematics Hierarchy:* Validates thresholds, trust levels, and age calculation across `LIVE` ($< 60\text{s}$, HIGH trust), `LAST_KNOWN` ($61\text{s} - 120\text{s}$, MEDIUM trust), `STALE` ($> 120\text{s}$, LOW trust, verification required), `NO_SIGNAL` ($> 600\text{s}$, NONE trust, explicit warning), and `MANUAL` (VHF checkpoint coordinates, `manual_dispatcher` source).
  - *Manual Override Workflow:* Verifies dispatcher VHF radio coordinate updates override signal loss and log `MANUAL_GPS_OVERRIDE` audit records.
- **Expected Behavior:** Absolute zero action loss during network outages, bulletproof idempotency deduplication, and automated GPS freshness tracking.

---

#### 3.3. Replanning Edge & Failure Scenarios
- **Test File:** [`tests/replanningEdgeCases.test.js`](tests/replanningEdgeCases.test.js) (Runner for `src/utils/replanningEdgeCaseTests.js`)
- **Purpose:** End-to-end operational validation of 9 complex real-world edge and failure scenarios through the full `AppStore` lifecycle.
- **Main Functionality Tested:** Replanning computation, dispatcher review, operational state transitions, and SLA compliance against simulated phone-tree baselines.
- **Important Scenarios Covered:**
  - *TEST-01 (Student Cancellation):* Absent marking, route unassignment, bus load decrement, dwell time calculation.
  - *TEST-02 (Urgent Addition with ADA Need):* School compatibility, wheelchair lift check, seat availability, human approval gate before route insertion.
  - *TEST-03 (Vehicle Breakdown):* In-transit vehicle stall, standby bus dispatch ($\ge 36$ seats), student transfer upon approval.
  - *TEST-04 (Driver Sickness & Schedule Conflict):* Rejection of sick driver and driver with conflicting charter commitment; approval of available reserve driver.
  - *TEST-05 (Capacity Constraint Enforcement):* Rejection of full bus ($54/54$ capacity) with explicit capacity reason; zero over-capacity boarding.
  - *TEST-06 (GPS Signal Loss & Manual Checkpoint):* Detection of signal loss, disallowance of fabricated live coordinates, manual VHF radio checkpoint override.
  - *TEST-07 (Network Offline Queue & Sync):* Complete offline operational workflow with local queueing and automated sync upon reconnection.
  - *TEST-08 (Multiple Simultaneous Disruptions):* Concurrent breakdown, urgent student addition, and cancellation processed simultaneously with zero resource collision or double-booking.
  - *TEST-09 (Constraint Exhaustion / No Feasible Solution):* All candidate vehicles full or disabled; system logs candidate rejection reasons and escalates to manual intervention without fabricating invalid plans.
- **Expected Behavior:** 100% scenario handling success rate, 0 constraint violations across all scenarios, and end-to-end recovery times well under the 8-minute SLA target.

---

#### 3.4. Evaluation Benchmark & Baseline Comparison
- **Test File:** [`tests/evaluation.test.js`](tests/evaluation.test.js) (Runner for `src/utils/evaluation.js`)
- **Purpose:** Quantitative evaluation and benchmark runner comparing the automated rapid replanning engine against a simulated manual baseline across the 9 standardized operational scenarios.
- **Main Functionality Tested:** Algorithmic runtime benchmarking, end-to-end workflow timing, SLA adherence verification, and statistical aggregation.
- **Important Scenarios Covered:**
  - *Schema Completeness:* Asserts all 9 scenarios contain all 10 required schema attributes: `scenarioId`, `disruptionType`, `baselineTimeSeconds`, `engineTimeMs`, `dispatcherReviewSeconds`, `e2eRecoverySeconds`, `targetSeconds`, `targetMet`, `planStatus`, and `constraintViolations`.
  - *Strict Metric Separation:* Asserts engine computation time is measured in milliseconds ($< 100\text{ms}$, avg $2.06\text{ms}$) while end-to-end recovery time is measured in seconds (avg $43.89\text{s}$).
  - *E2E Recovery Formula Adherence:* Verifies $\text{e2eRecoverySeconds} = (\text{engineTimeMs} / 1000) + \text{dispatcherReviewSeconds}$.
  - *Statistical Distribution Verification:*
    - Engine Computation Time: Avg $2.06\text{ms}$ (Median $1.84\text{ms}$, Min $0.65\text{ms}$, Max $5.13\text{ms}$).
    - Dispatcher Review Time: $15.0\text{s} - 180.0\text{s}$.
    - E2E Recovery Time: Avg $43.89\text{s}$ (Median $25.01\text{s}$, Min $15.0\text{s}$, Max $180.0\text{s}$).
    - Simulated Manual Baseline: Avg $741.7\text{s}$ (Median $495.0\text{s}$, Min $495.0\text{s}$, Max $1635.0\text{s}$).
  - *Target SLA Adherence:* 100% of scenarios meet the $\le 480\text{s}$ (8-minute) target.
  - *Invariant Integrity:* Zero constraint violations ($0$) recorded across all benchmark scenarios.
  - *Deterministic Reproducibility:* Repeated deterministic runs yield strictly identical benchmark figures.
- **Expected Behavior:** Statistically rigorous performance verification demonstrating a 94.1% reduction in recovery time vs the simulated manual baseline.

---

#### 3.5. Route Progress & Driver Location Telematics
- **Test File:** [`tests/routeProgressAndDriverLocation.test.js`](tests/routeProgressAndDriverLocation.test.js)
- **Purpose:** Validates route execution progress tracking, protection of completed stops, and driver telematics constraints during route insertion.
- **Main Functionality Tested:** `computeRouteProgress()`, `constraintValidator.validateDriverAvailability()`, `constraintValidator.validateDriverLocation()`, and `routeInsertion.evaluateUrgentStudentInsertion()`.
- **Important Scenarios Covered:**
  - *Completed Stops Identification:* Accurately identifies completed route stops; verifies completed stops never overlap with remaining stops.
  - *Current & Next Stop Tracking:* Accurately identifies active 'next' stop and calculates route progress percentage (e.g., 3/6 stops = 50%).
  - *Remaining Route Insertion Only:* Proves that urgent insertions occur strictly at index $\ge \text{completedStops.length}$, leaving completed stops unmodified.
  - *Driver Unavailability:* Rejects sick and unavailable drivers.
  - *Driver Distance Threshold:* Calculates planar distance; rejects driver located 45 miles away in San Jose for a San Francisco route ($> 15.0\text{ mi}$ limit); accepts standby driver located 0.1 miles away.
  - *Driver Telematics Stale Check:* Driver with stale telematics ($> 2\text{ min}$) flags warning and sets `requiresDispatcherConfirmation = true`.
- **Expected Behavior:** Route insertion search space is dynamically constrained to active/remaining stops; completed stops are immutable; distant/unavailable drivers are rejected.

---

#### 3.6. Dispatcher "Modify" Workflow & Constraint Customizer
- **Test File:** [`tests/modifyPlanWorkflow.test.js`](tests/modifyPlanWorkflow.test.js)
- **Purpose:** Verifies that dispatchers can modify algorithmic constraints (delays, preferred vehicles, passenger bounds) and recalculate recommendations without relinquishing decision-making authority.
- **Main Functionality Tested:** `recalculateWithCustomConstraints()`, `computeBeforeAfterComparison()`, `store.recalculateModifiedConstraints()`, `store.acceptModifiedPlan()`, and `store.rejectModifiedPlan()`.
- **Important Scenarios Covered:**
  - *Modify Maximum Allowed Delay:* Dispatcher tightens delay limit (e.g. to 1.0 min); candidates exceeding the threshold are filtered out with explicit rejection reasons.
  - *Modify Preferred Bus:* Dispatcher designates a preferred vehicle (`BUS-02`); that vehicle receives priority and ranks #1 among feasible candidates.
  - *Recalculate Without Auto-Approval:* Generates updated candidate ranking and before/after comparison snapshot while strictly keeping disruption status unapproved.
  - *Before/After Comparison Schema:* Asserts presence of before/after properties: bus, route, capacity, delay, and additional distance.
  - *Accept Modified Plan:* Applies dispatcher-modified plan, updates vehicle load, and closes the customizer dialog.
  - *Reject Modified Plan:* Discards customized plan without modifying live assignments.
  - *Audit Logging:* Verifies creation of `MODIFY_PLAN` audit record with original recommendation, modified constraints, selected plan, user role, and timestamp.
- **Expected Behavior:** Seamless human-in-the-loop parameter customization with explicit before/after delta transparency and zero premature plan execution.

---

#### 3.7. Responsible AI Explanation, Uncertainty Layer & Audit Trail
- **Test File:** [`tests/explanationAndAudit.test.js`](tests/explanationAndAudit.test.js)
- **Purpose:** Validates the Responsible AI explanation generation, telematics uncertainty warnings, and complete audit logging across all disruption lifecycle events.
- **Main Functionality Tested:** `buildExplanationAndUncertainty()`, 12-dimension explanation card generation, telematics provenance tracking, and consistency between displayed and applied recommendations.
- **Important Scenarios Covered:**
  - *Why Selected:* Positive selection criteria explicitly articulated (available seats, driver available, route compatibility, additional delay).
  - *Why Rejected:* Explicit constraint failure reasons attached for every rejected candidate (capacity, maintenance, driver commitment).
  - *Constraints Checked Audit:* Validates that all 6 operational hard constraints are checked and verified.
  - *Data Provenance Used:* Audits data sources (GPS coordinates, driver roster, student manifest).
  - *Telematics Uncertainty Warning:* Stale telematics ($> 2\text{ min}$) triggers a prominent warning and requires dispatcher verification; fresh telematics produces zero warning.
  - *Dispatcher Override Levers:* Quantifies operational impacts and enumerates override controls without fabricating unmathematical confidence percentages.
  - *Complete Lifecycle Audit Logging:* Verifies persistence of all 6 required lifecycle events:
    1. `RECOMMENDATION_GENERATED`
    2. `RECOMMENDATION_ACCEPTED`
    3. `RECOMMENDATION_MODIFIED`
    4. `RECOMMENDATION_REJECTED`
    5. `MANUAL_OVERRIDE`
    6. `FALLBACK_TRIGGERED`
  - *Explanation-State Consistency Checks:*
    - Displayed recommended bus strictly equals applied bus.
    - Displayed insertion position strictly equals applied route stop position.
    - Stored candidate rejection reasons strictly match failed validation checks.
    - Audit records contain complete decision reconstruction data.
- **Expected Behavior:** 100% explainability transparency, zero opaque decisions, and verifiable consistency between AI recommendations and applied database states.

---

#### 3.8. Insertion Position Consistency & Route Fingerprinting
- **Test File:** [`tests/insertionPositionConsistency.test.js`](tests/insertionPositionConsistency.test.js)
- **Purpose:** Verifies that the greedy algorithm's chosen `insertionPosition` is maintained end-to-end from generation to acceptance, protected against concurrent route modifications via fingerprinting.
- **Main Functionality Tested:** `routeInsertion.evaluateUrgentStudentInsertion()`, `computeRouteVersionKey()`, and `store.acceptAIPlan()`.
- **Important Scenarios Covered:**
  - *Greedy Position Bounds:* Greedy insertion position is strictly $\ge \text{completed stops}$ count and $\le \text{total stops}$ (append permitted).
  - *Inserted Stop Placement:* Stop at `newStops[bestPosition]` strictly matches the evaluated student pickup stop.
  - *Completed Stop Invariance:* Completed stops are never shifted or modified during route insertion.
  - *Stale Route Fingerprinting (`routeVersionKey`):* Detects if the bus advanced or another dispatcher modified the route during review:
    - Route progressing a stop changes `routeVersionKey`.
    - Appending a stop changes `routeVersionKey`.
    - Identical route produces a stable fingerprint.
  - *Accepted Route Verification:* Generated route has exactly one additional stop, valid `insertionPosition`, non-negative delay, and matches final route metrics.
  - *Audit Trail Verification:* `RECOMMENDATION_ACCEPTED` audit log records the applied insertion position and selected bus ID.
- **Expected Behavior:** Deterministic stop placement with zero retroactive stop mutation and detection of stale route state.

---

#### 3.9. Cancellation Approval Workflow & Human-in-the-Loop (HITL) Gate
- **Test File:** [`tests/cancellationApprovalWorkflow.test.js`](tests/cancellationApprovalWorkflow.test.js)
- **Purpose:** Rigorously verifies Human-in-the-Loop operational boundaries, proving that no disruption type mutates live operational state prior to explicit dispatcher authorization.
- **Main Functionality Tested:** Student cancellations, urgent additions, and breakdown approval lifecycles in `AppStore`, state snapshots (`originalState`, `proposedState`, `finalState`), review badges, and audit schemas.
- **Important Scenarios Covered:**
  - *Cancellation Pre-Approval Boundary:* Submitting a cancellation creates an unresolved disruption and sets `cancellationPending: true` on the student, but student bus/route assignments, bus current load, and route stops remain 100% untouched.
  - *Cancellation Post-Approval Execution:* Dispatcher approval transitions disruption to `accepted`, sets student status to `absent_cancelled` (`busId: UNASSIGNED`), decrements bus load by 1, and records recovery time.
  - *Cancellation Rejection:* Dispatcher rejection restores original student status, preserves bus load, clears the pending badge, and records the rejection reason in the audit log.
  - *Modified Workflow Approval:* Customizing constraints during cancellation review maintains unresolved status until explicit acceptance.
  - *Breakdown Approval Consistency:* Vehicle breakdown approval sets disabled bus to `breakdown`, dispatches replacement bus as `in_transit`, and logs `VEHICLE_BREAKDOWN_APPROVED`.
  - *Urgent Addition Approval Consistency:* Urgent addition approval assigns student, increments vehicle load, inserts route stop, and logs `URGENT_ADD_APPROVED`.
  - *Boundary Guard Across Disruptions:* Proves student counts, route stops, and vehicle loads are strictly invariant prior to approval.
  - *Audit Record Schema Completeness:* Verifies every approval audit entry contains all 8 required attributes: `disruptionId`, `actionType`, `originalState`, `proposedState`, `finalState`, `userRole`, `timestamp`, and `recommendationId`.
- **Expected Behavior:** Absolute enforcement of the human-in-the-loop gate; zero premature operational side-effects.

---

#### 3.10. GPS Freshness & Distance-Based Candidate Scoring
- **Test File:** [`tests/gpsFreshnessScoring.test.js`](tests/gpsFreshnessScoring.test.js)
- **Purpose:** Verifies that GPS telemetry freshness deterministically influences candidate scoring through uncertainty penalties without violating operational hard constraints.
- **Main Functionality Tested:** `candidateScorer.calculateScore()`, confidence multipliers, distance adjustments, and candidate ranking under uncertain telematics.
- **Important Scenarios Covered:**
  - *LIVE GPS Scoring:* High trust, multiplier $1.0$, distance adjustment $0.0$, zero penalty.
  - *LAST_KNOWN GPS Scoring:* Medium trust, multiplier $0.75$ (25% uncertainty expansion), positive distance adjustment, verification required.
  - *STALE GPS Scoring:* Low trust, multiplier $0.40$ (60% uncertainty expansion), higher distance adjustment, verification required.
  - *NO_SIGNAL Scoring:* None trust, multiplier $0.10$, maximum distance penalty without inventing fake coordinates.
  - *MANUAL GPS Scoring:* Verified trust, multiplier $0.85$, modest checkpoint buffer (+0.50), strictly better than stale telematics.
  - *Monotonic Penalty Ordering:* Asserts $\text{LIVE } (0.0) < \text{MANUAL} < \text{LAST\_KNOWN} < \text{STALE} < \text{NO\_SIGNAL}$.
  - *Telemetry Warning Emission:* Replan results on stale buses flag data quality warnings and dispatcher verification requirements.
  - *Ranking Inversion:* A bus with LIVE GPS that is slightly farther away outranks a closer bus with STALE GPS due to the uncertainty penalty.
  - *Hard Constraint Precedence:* A full bus ($54/54$) with LIVE GPS is rejected by hard capacity validation; a feasible bus with STALE GPS is chosen.
- **Expected Behavior:** Algorithmic penalties favor verifiable live data over stale fixes, while hard invariants strictly supersede all heuristic scoring adjustments.

---

#### 3.11. GPS Integration Layer & Telematics REST API
- **Test File:** [`tests/gpsIntegrationLayer.test.js`](tests/gpsIntegrationLayer.test.js)
- **Purpose:** Integration test suite for the GPS telematics provider layer, coordinate validation, signal recovery, manual override protection, and the backend GPS REST API.
- **Main Functionality Tested:** `BaseGPSProvider`, `MockGPSProvider`, `BackendGPSProvider`, HTTP endpoints (`POST /api/gps/update`, `GET /api/gps`, `GET /api/gps/:busId`), and `AppStore` telematics ingestion.
- **Important Scenarios Covered:**
  - *Provider Abstraction:* Base class interface enforcement; simulation disclosure flags (`isSimulated: true`); external vendor configuration (`Samsara Fleet Cloud`).
  - *Coordinate & Timestamp Validation:*
    - Rejects missing or whitespace-only `busId`.
    - Rejects out-of-bounds latitude ($<-90$ or $>90$) and longitude ($<-180$ or $>180$), non-numeric values, and NaNs.
    - Rejects future timestamps ($>5\text{ min}$ clock drift) and ancient dates.
    - Rejects missing `source` attribute.
    - Accepts and normalizes valid payloads.
  - *Telemetry Freshness Classification:* Accurately classifies payloads into LIVE, LAST_KNOWN, STALE, NO_SIGNAL, and MANUAL states.
  - *Signal Loss Recovery:* Vehicle in `NO_SIGNAL` recovers immediately to `LIVE` upon receiving a fresh update.
  - *Manual Override Protection:* Manual VHF radio coordinates fix is preserved against automated GPS streams; released only when `clearManual: true` is passed.
  - *Backend GPS Endpoints:*
    - `POST /api/gps/update` with valid payload returns HTTP 200 and updates DB.
    - `POST /api/gps/update` with invalid coordinates returns HTTP 400 with validation details.
    - `POST /api/gps/update` for non-existent bus returns HTTP 404.
    - `POST /api/gps/update` with stale timestamp returns HTTP 200 with `STALE` classification.
    - `GET /api/gps` returns telematics list and simulation disclosure.
    - `GET /api/gps/:busId` returns individual vehicle telematics state.
- **Expected Behavior:** Robust payload validation, reliable telematics degradation and recovery, and transparent disclosure of simulation mode.

---

#### 3.12. Local Backend REST API & Synchronization Idempotency
- **Test File:** [`tests/backendApi.test.js`](tests/backendApi.test.js)
- **Purpose:** Verifies the local Node.js REST API server endpoints, status codes, payload validations, replan workflow endpoints, and offline action synchronization idempotency.
- **Main Functionality Tested:** HTTP routing in `server/server.js`, `LocalDatabase` (in-memory SQLite), JSON parsing, error formatting, and replay deduplication.
- **Important Scenarios Covered:**
  - *Health Check:* `GET /api/health` returns HTTP 200 with status `ok` and database metadata.
  - *Fleet & Route Retrieval:* `GET /api/buses`, `GET /api/routes`, and `GET /api/disruptions` return valid domain arrays with expected schema structures.
  - *Disruption Creation:* `POST /api/disruptions` validates required fields (HTTP 400 on error) and creates valid disruptions with generated `DIS-` IDs (HTTP 201).
  - *Replan Generation:* `POST /api/replans` validates context (HTTP 400 on empty payload) and returns plan ID, recommended bus ID, and insertion position (HTTP 200).
  - *Replan Customization:* `POST /api/replans/:id/modify` applies custom constraints, returning recalculated recommendations and before/after comparisons; returns HTTP 404 on invalid plan IDs.
  - *Replan Rejection:* `POST /api/replans/:id/reject` requires a rejection reason (HTTP 400 if omitted) and records the confirmed reason (HTTP 200).
  - *Replan Approval:* `POST /api/replans/:id/approve` commits the plan and returns the final state.
  - *Sync & Idempotency Testing (`POST /api/sync`):*
    - Initial sync of an action returns HTTP 200 with `syncedCount: 1, duplicateCount: 0, status: SYNCED`.
    - Resending the exact same `actionId` returns HTTP 200 with `syncedCount: 0, duplicateCount: 1, status: ALREADY_SYNCED`, proving zero duplicate execution.
  - *Audit Log API:* `GET /api/audit` returns the immutable history of replan approval and rejection events.
  - *404 Route Handler:* Requests to undefined routes return HTTP 404 with structured JSON error messages.
- **Expected Behavior:** Standard RESTful HTTP interface with robust status codes, complete operational error handling, and verified idempotency deduplication.

---

#### 3.13. PostgreSQL Database Layer & Automatic SQLite Fallback
- **Test File:** [`tests/postgresDatabase.test.js`](tests/postgresDatabase.test.js)
- **Purpose:** Validates the PostgreSQL database layer, SQL schema migrations, repository contracts for all 11 domain models, seed data fidelity, and automatic fallback to SQLite when PostgreSQL is unavailable.
- **Main Functionality Tested:** `PgMigrator`, `seedDatabase`, repository classes (`BusRepository`, `DriverRepository`, `RouteRepository`, `StudentRepository`, `DisruptionRepository`, `ReplanRepository`, `ApprovalRepository`, `GpsRepository`, `OfflineActionRepository`, `AuditLogRepository`), `PgConnectionManager`, and `databaseFactory`.
- **Important Scenarios Covered:**
  - *Schema Migrations:* Verifies that `001_initial_schema.sql` defines all 11 required tables: `buses`, `drivers`, `routes`, `route_stops`, `disruptions`, `replans`, `replan_candidates`, `approvals`, `gps_updates`, `offline_actions`, and `audit_logs`.
  - *Migrator Idempotency:* `PgMigrator` records executed versions in `schema_migrations`; repeated runs skip already-applied migrations.
  - *Seed Data Fidelity:* `seedDatabase` seeds exact entity counts matching `src/data/mockData.js` (8 buses, 7 drivers, 4 routes, 8 students, 4 disruptions, 21 normalized route stops).
  - *Repository CRUD Contracts:* Validates get-by-id, upsert, query, and child-entity relations for all domain repositories.
  - *Idempotency Tracking:* `OfflineActionRepository.isActionSynced()` accurately tracks synced actions to prevent duplicate offline replay.
  - *Connection Failure & Automatic SQLite Fallback:*
    - `PgConnectionManager` catches connection failures when PostgreSQL is unreachable (e.g. port 54399).
    - `createDatabase` automatically catches PostgreSQL connection refusal, logs a diagnostic warning, and returns an operational SQLite fallback database (`isFallback: true`, `backend: 'sqlite-fallback'`).
    - Fallback database implements the identical unified domain interface (`getBuses()`, `getDrivers()`, `saveApproval()`, `recordGpsUpdate()`, `isActionSynced()`) without throwing unhandled exceptions.
  - *PgDatabase Facade:* Exposes unified access methods (`getBuses()`, `getRoutes()`, `getDisruptions()`).
- **Expected Behavior:** Enterprise-grade database resilience ensuring uninterrupted district transportation operations whether running on PostgreSQL or local SQLite fallback.

---

### 4. Reviewer Verification Guide

To independently verify the test suite for project review:

```bash
# 1. Navigate to final_project directory
cd final_project

# 2. Execute all tests in sequence (Expected: 15/15 suites pass, 0 failures)
npm test

# 3. Execute any specific suite individually
node tests/cancellationApprovalWorkflow.test.js
node tests/gpsIntegrationLayer.test.js
node tests/postgresDatabase.test.js
node tests/dispatcherE2EWorkflow.test.js
```

All 15 test suites execute in **under 10 seconds total** on standard hardware, with zero network or external database prerequisites required.

---

## Error Handling & Failure Boundaries

### 1. Error Handling Architecture

The system implements a defense-in-depth error handling strategy structured across six operational layers. Rather than relying on a single monolithic error wrapper, failures are intercepted as close to their source as possible, ensuring that partial outages (such as network loss, telematics degradation, or PostgreSQL disconnection) degrade functionality gracefully without crashing the application.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. Frontend & Client UI                         │
│  (Vanilla JS, Promise.allSettled, Try/Catch localStorage, Toast Alerts) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    2. Offline Store-and-Forward                        │
│ (localStorage FIFO Queue, Idempotency Deduplication, Status Tracking)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   3. GPS Telematics & Uncertainty                      │
│ (Input Validation, 5-State Degradation, Distance Scoring Penalties)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     4. Central REST API Server                         │
│ (Body Size Cap, JSON Syntax Catch, HTTP 400/404/500 Structured Errors) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   5. Database & Failover Factory                       │
│ (Connection Probing, PostgreSQL Catch, Automatic SQLite Fallback)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│               6. Deterministic Replanning Invariants                   │
│   (Binary Hard Constraints, No-Feasible Escalation, Fingerprinting)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Frontend / API Error Handling

The frontend client communicates with the backend via `src/api/client.js` and manages reactive state in `src/state/store.js`.

- **Transport Error Normalization (`src/api/client.js`):**
  Every REST fetch call checks the HTTP response status (`if (!res.ok)`). Non-2xx responses immediately throw standard `Error` objects containing descriptive error messages (e.g. `'Failed to fetch buses'`, `'Failed to create disruption'`).
- **Resilient Data Bootstrap (`store.fetchInitialData()`):**
  When initializing state, the store queries all 7 domain endpoints concurrently using `Promise.allSettled()`. This guarantees that a transient failure in one endpoint (such as an empty audit trail or offline school directory) does not cause the entire initialization to reject.
  - If the entire local backend is unreachable (e.g. connection refused), the outer `try/catch` block intercepts the network error:
    ```javascript
    try {
      // Promise.allSettled fetches...
    } catch (error) {
      console.warn('Backend unavailable; continuing with local mock fallback.', error?.message || error);
      return { source: 'local-fallback', error };
    }
    ```
    The application seamlessly loads the validated default fleet from `src/data/mockData.js`, preserving complete interactive functionality for dispatchers.
- **Non-Blocking Background Persistence (`persistOnlineDisruption`, `persistPlanDecision`):**
  Operational decisions made in the UI update local reactive state immediately. The subsequent backend persistence requests run asynchronously with chained `.catch()` handlers:
  ```javascript
  request.catch(error => {
    console.warn(`Backend ${action.toLowerCase()} persistence failed; local state remains active.`, error?.message || error);
  });
  ```
  If backend persistence fails, the dispatcher's active workflow is **never interrupted or frozen**, and the local state remains consistent.
- **Defensive Storage Parsing:**
  All browser `localStorage` reads (`getItem`) and writes (`setItem`) are wrapped in defensive `try/catch` blocks (`src/state/store.js` lines 90–150). If storage is restricted by private browsing mode, disabled cookies, or quota exhaustion, errors are caught and logged as warnings rather than crashing the runtime.

---

### 3. Offline Failure Handling & Store-and-Forward

The client store contains an offline persistence and recovery system designed to handle network interruptions without operational data loss.

- **Offline Detection & State Transition:**
  Network connectivity is managed via `store.setNetworkStatus('offline' | 'degraded' | 'online')`. In offline mode, dispatchers receive user-facing toast alerts indicating local fallback operation.
- **Local Action Queueing (`queueOfflineChange`):**
  Actions submitted while offline are converted to structured offline change records and appended to `localStorage` under `school_bus_pending_sync`. Every queued item contains all 9 required audit fields:
  ```javascript
  {
    actionId: "SYNC-1710000000000-123",
    timestamp: "2026-10-02T17:00:00.000Z",
    userId: "dispatcher-1",
    role: "dispatcher",
    "userId/role": "dispatcher-1/dispatcher",
    actionType: "CANCEL_STUDENT",
    payload: { studentId: "STU-1001", reason: "Sick" },
    status: "PENDING",
    retryCount: 0,
    lastAttempt: "2026-10-02T17:00:00.000Z",
    error: null
  }
  ```
- **Sync Failure Handling & Action Retention:**
  When synchronization is attempted while offline or if the backend returns an error:
  - The action's status is updated to `FAILED`.
  - The exact failure reason is recorded in the `error` attribute (e.g. `'Network offline'`).
  - The `retryCount` counter is incremented.
  - **Zero Action Loss:** The action is strictly retained in the local queue and is never discarded.
- **Retry Mechanism:**
  Failed actions can be retried individually via `store.retryAction(actionId)` or in batch via `store.retryFailedActions()`. Both methods reset the action status to `PENDING` and trigger synchronization if the network has recovered.
- **Idempotency & Duplicate Prevention (`syncedActionIds`):**
  To prevent duplicate execution upon network reconnection or accidental re-submissions:
  - The client maintains a persistent set of up to 1,000 processed action IDs in `localStorage` (`school_bus_synced_actions`).
  - When an action is dispatched via `dispatchAction()`, `isActionSynced(actionId)` checks if it was already processed. If so, it returns `{ isDuplicate: true, suppressed: true, status: 'ALREADY_SYNCED' }` without executing side effects or writing duplicate audit entries.
  - On the backend, `POST /api/sync` performs identical deduplication against the `offline_actions` repository, returning `status: 'ALREADY_SYNCED'` and `duplicate: true`.
- **Successful Synchronization:**
  Upon network restoration (`setNetworkStatus('online')`), pending actions are replayed in strict FIFO order to `POST /api/sync`. Once acknowledged:
  - The action status transitions to `EXECUTED`.
  - The `actionId` is recorded in `syncedActionIds`.
  - The item is removed from `pendingOfflineChanges`.
  - A `SYNCHRONIZED` event is appended to the audit trail.

---

### 4. GPS Telematics Failure Handling

The GPS integration layer (`src/utils/gpsProvider.js`) validates incoming telemetry and enforces a 5-state trust degradation hierarchy to prevent erroneous vehicle positioning.

- **Strict Input Validation (`validateGpsPayload`):**
  Incoming telemetry updates are rejected with explicit error descriptions if:
  - `busId` is missing, null, or whitespace-only.
  - Coordinates are missing, non-numeric, `NaN`, or out of valid bounds (latitude outside $[-90, 90]$ or longitude outside $[-180, 180]$).
  - Timestamps are unparseable or represent clock drift $>5\text{ minutes}$ into the future.
  - Timestamps are obsolete ($>1\text{ year}$ old).
  - Telematics source identifier is missing.
- **5-State Telematics Degradation Hierarchy:**
  - **`LIVE` ($\le 60\text{s}$ old):** High trust, multiplier $1.0$, $0.0$ distance penalty, clean data quality.
  - **`LAST_KNOWN` ($61\text{s} - 120\text{s}$ old):** Medium trust, multiplier $0.75$, $+1.50$ distance penalty, flags reduced distance trust.
  - **`STALE` ($121\text{s} - 600\text{s}$ old):** Low trust, multiplier $0.40$, $+4.00$ distance penalty, emits prominent data quality warning, enforces dispatcher verification.
  - **`NO_SIGNAL` ($> 600\text{s}$ or signal lost):** None trust, multiplier $0.10$, $+8.00$ distance penalty, uses last-known coordinates without inventing fake telemetry, requires dispatcher verification.
  - **`MANUAL` (VHF Checkpoint Override):** Verified trust, multiplier $0.85$, modest checkpoint buffer (+0.50).
- **Manual Override Preservation:**
  When a dispatcher establishes a manual radio checkpoint override, the vehicle's position is locked (`bus.isManualLocation = true`). Automated background GPS telemetry updates are intercepted, flagged as `preservedManualOverride: true`, and ignored. The manual lock is released only when an update explicitly specifies `{ clearManual: true }`.
- **GPS Loss Recovery:**
  A bus operating in `NO_SIGNAL` recovers immediately to `LIVE` upon receiving a valid telemetry fix. The provider updates coordinates, resets age calculation, and logs the recovery event.

---

### 5. Backend REST API Error Handling

The local Node.js server (`server/server.js`) provides structured HTTP error handling:

- **Payload Protection:**
  `parseBody()` enforces a 2MB request body limit. Requests exceeding 2MB are rejected with HTTP 400 (`Payload too large`). Malformed JSON payloads trigger a catch block and return HTTP 400 (`Invalid JSON format: ...`).
- **Validation Errors (HTTP 400):**
  Missing mandatory attributes return structured error envelopes via `sendError(res, 400, message, details)`. For example, creating a disruption without `type` or `title`, requesting replanning without context, or rejecting a replan without a mandatory reason returns HTTP 400.
- **Not Found Errors (HTTP 404):**
  Requests for non-existent vehicle IDs, disruption IDs, or replan IDs return HTTP 404 with specific identifier diagnostics.
- **Unknown Endpoint Catch-All (HTTP 404):**
  Any HTTP request matching no defined route falls through to the catch-all handler, returning HTTP 404: `Endpoint {METHOD} {PATH} not found`.
- **Global Unhandled Exception Handler (HTTP 500):**
  The entire request routing pipeline is wrapped in a top-level `try/catch` block. Unhandled server-side exceptions log diagnostics to stderr and return structured HTTP 500 JSON responses:
  ```json
  {
    "error": "Internal Server Error",
    "statusCode": 500,
    "details": "Specific exception message",
    "timestamp": "2026-10-02T17:00:00.000Z"
  }
  ```

---

### 6. Database Failure Handling & Automatic Fallback

The persistence tier (`server/databaseFactory.js`) provides automated failover from PostgreSQL to SQLite:

- **Connection Probing (`PgConnectionManager.testConnection`):**
  When PostgreSQL is requested or configured, the manager issues a lightweight connection probe with a 500ms timeout.
- **Automatic Fallback to SQLite:**
  If PostgreSQL is unreachable (e.g. `ECONNREFUSED` on port 54399, network partition, or incorrect credentials), `createDatabase()` catches the error, logs a diagnostic warning:
  ```
  [Database Warning] Failed to connect to PostgreSQL (connect ECONNREFUSED 127.0.0.1:54399). Gracefully falling back to local SQLite database.
  ```
  and returns an active `LocalDatabase` backed by SQLite.
- **Transparency & Metadata:**
  The factory records the failover in `getDatabaseMetadata()`, setting `backend: 'sqlite-fallback'`, `isFallback: true`, and storing the diagnostic `fallbackReason`.
- **Domain Interface Parity:**
  Both `PgDatabase` and `LocalDatabase` implement the identical domain repository methods (`getBuses()`, `getRoutes()`, `getDisruptions()`, `saveApproval()`, `recordGpsUpdate()`, `isActionSynced()`), ensuring zero application downtime or crashes when running in fallback mode.

---

### 7. Replanning Failure & Manual Escalation

The Greedy Insertion Heuristic (`src/utils/replanningEngine.js`) enforces strict boundary conditions to prevent fabricating invalid solutions:

- **Hard Constraint Gating:**
  Candidate buses are evaluated against non-negotiable binary rules:
  1. *Operational Status:* Rejects buses in `breakdown`, `maintenance`, or `offline` status.
  2. *Capacity:* Rejects candidates where `currentLoad + requiredSeats > capacity`.
  3. *Driver Availability:* Rejects sick, off-duty, or drivers with existing charter commitments.
  4. *ADA Accessibility:* Rejects buses lacking wheelchair lifts when required by the student.
  5. *Route Compatibility:* Rejects buses serving mismatched destination schools.
- **Constraint Exhaustion Fallback:**
  If all candidates in the fleet fail one or more hard constraints, the engine:
  - Refuses to recommend an infeasible vehicle (`selectedBus: null`).
  - Sets `newRoute: null`.
  - Flags `noFeasibleSolution: true` and `escalateToManual: true`.
  - Attaches the complete list of rejected candidates along with their exact constraint failure reasons.
  - Requires dispatcher manual intervention (`requiresDispatcherConfirmation: true`).
  - **Never fabricates an invalid bus assignment, phantom route, or false confidence score.**
- **Stale Route Fingerprinting (`routeVersionKey`):**
  Route fingerprinting computes a hash of route ID, stop count, completed stops, and initial stop name. If the bus completes a stop while the dispatcher is reviewing a recommendation, the route version key changes, preventing the application of a stale insertion.

---

### 8. Frontend Error Boundary Status

> [!IMPORTANT]
> ### Implementation Reality Notice
> **A dedicated React-style frontend Error Boundary is not currently implemented in this application.**
> 
> The frontend is built as a pure **Vanilla JavaScript (HTML5, CSS3, ES Modules)** single-page application and does not utilize React, Vue, or an equivalent UI framework. Consequently, declarative component lifecycle error boundaries (`componentDidCatch`, `getDerivedStateFromError`, or `<ErrorBoundary>` wrapper tags) do not exist in the codebase.

#### What IS Implemented in the Frontend
1. **Network Degradation Protection:** `Promise.allSettled()` and `.catch()` fallback in `store.fetchInitialData()` ensures the dashboard loads even if the backend is down.
2. **Background Persistence Safety:** Fire-and-forget background sync operations catch API rejections, preserving responsive in-memory UI state.
3. **Storage Boundary Safety:** Defensive `try/catch` wrappers around all `localStorage` access prevent browser storage quota/privacy exceptions from interrupting UI execution.
4. **DOM Teardown Safety:** Leaflet map container removal in `mapHelper.js` and `RoutesView.js` uses `try/catch` guards to prevent errors when re-rendering dynamic tabs.
5. **Operational Warning Modals & Toasts:** User-facing notifications inform dispatchers when operating in offline fallback, when GPS telematics is stale, or when manual intervention is required.

#### Recommended Future Production Enhancement
For future production enterprise hardening, the following global error boundaries are recommended:
- **Global Error & Rejection Listeners:** Register top-level listeners (`window.addEventListener('error')` and `window.addEventListener('unhandledrejection')`) to catch unexpected runtime exceptions.
- **Global UI Fallback Screen:** Implement a full-screen emergency fallback modal that displays user-friendly recovery instructions, captures component error diagnostics, and offers an "Emergency Safe Reload" button without clearing the local offline queue.

---

### 9. Failure Handling Flowchart

```
                 User / Operational Action
                            │
                            ▼
                  Frontend / API Request
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
       [ Success ]                     [ Failure ]
            │                               │
            ▼                               ▼
   Update Reactive Store              Detect Error
            │                               │
            ▼                               ▼
    Re-render Views               Network Offline?
                                    │              │
                           (Yes) ───┘              └─── (No)
                             │                            │
                             ▼                            ▼
                    Queue Locally in               Evaluate Type:
                      localStorage                 ├── HTTP 400: Show Validation Toast
                    (status: PENDING)              ├── HTTP 404: Show Missing Entity
                             │                     └── HTTP 500 / Network Error:
                             ▼                          Log Warning & Retain State
                    Display Warning Alert                 │
                             │                            ▼
                    Network Recovered?             Escalate to Dispatcher
                             │                     for Manual Intervention
                             ▼
                    Auto-Flush Queue via
                      POST /api/sync
```

---

### 10. Operational Failure & Recovery Matrix

| Failure Type | Detection Mechanism | Current Handling | Recovery / Escalation Path |
| :--- | :--- | :--- | :--- |
| **Backend API Unreachable** | `fetch` rejection / `Promise.allSettled` failure | Logs warning; continues using in-memory state and mock data fallback | Background retry on user action; offline action queueing |
| **Network Disconnection** | `store.setNetworkStatus('offline')` / fetch error | Actions saved locally in `localStorage` with `PENDING` status | Automatic FIFO queue flush upon `setNetworkStatus('online')` via `POST /api/sync` |
| **Action Sync Failure** | Backend `POST /api/sync` failure or offline rejection | Action marked `FAILED`, error recorded, retry count incremented | Dispatcher manual retry via `retryAction(id)` or `retryFailedActions()` |
| **Duplicate Sync Replay** | `syncedActionIds` lookup (`localStorage`) & backend `action_id` query | Action execution suppressed; returns status `ALREADY_SYNCED` | Zero duplicate state mutation; safe idempotency acknowledgment |
| **Invalid GPS Coordinates** | `validateGpsPayload()` bounds checks (lat $\pm 90$, lon $\pm 180$) | Payload rejected with HTTP 400 and detailed validation error array | Client/device must correct telemetry format; bus retains last valid fix |
| **GPS Clock Drift / Future Time** | Timestamp comparison against `Date.now() + 5min` drift limit | Rejected with HTTP 400 | Device NTP synchronization required; vehicle retains last valid fix |
| **GPS Signal Loss (> 600s)** | Telematics age $> 600\text{s}$ or signal loss flag | Status set to `NO_SIGNAL`; distance penalty applied; warning displayed | Restores to `LIVE` upon fresh telemetry; dispatcher manual VHF override |
| **Stale GPS Telematics (> 120s)** | Telematics age $> 120\text{s}$ | Status set to `STALE`; distance penalty applied; dispatcher verification enforced | Refreshes to `LIVE` upon next GPS fix; requires dispatcher confirmation |
| **PostgreSQL Unreachable** | `PgConnectionManager.testConnection()` failure (ECONNREFUSED) | `createDatabase` logs warning and activates `sqlite-fallback` | Automatic seamless SQLite operation; zero system interruption |
| **Replanning Infeasible** | All candidates fail hard constraints (capacity/status/driver) | Returns `noFeasibleSolution: true`, `selectedBus: null`, lists candidate rejection reasons | Escalates to dispatcher with `escalateToManual: true`; zero false plans generated |
| **Stale Route During Review** | `routeVersionKey` fingerprint mismatch on acceptance | Replan acceptance blocked or recalculated | Dispatcher alerted that route changed; recalculation required |

---

## API Documentation

The School Bus Rapid Replanning backend is implemented as a lightweight, native REST API server in [`server/server.js`](server/server.js) using Node.js built-in `node:http`. It exposes 14 operational endpoints supporting fleet telematics, disruption handling, automated heuristic replanning, Human-In-The-Loop (HITL) approval lifecycles, audit trail inspection, and store-and-forward offline synchronization.

---

### 1. API Base URL & Configuration

- **Development Base URL (Frontend Client):** `http://localhost:3001/api` (defined as `API_BASE_URL` in [`src/api/client.js`](src/api/client.js)).
- **Configurable Server Port:** The server defaults to port `3001`, but can be configured dynamically via the environment variable:
  ```bash
  PORT=3001 node server/server.js
  ```
- **CORS Support:** The server automatically responds to pre-flight `OPTIONS` requests with HTTP 204 and injects CORS headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`, `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`) on all responses.
- **Payload Safety:** All incoming request bodies are capped at **2MB** in [`server/server.js`](server/server.js). Excessively large payloads are rejected with HTTP 400.
- **Production Infrastructure Note:** The API server runs locally. No external cloud endpoints, reverse proxies, or distributed gateway infrastructure are assumed or fabricated.

---

### 2. Health & Diagnostic API

#### `GET /api/health`
- **Purpose:** Verifies backend liveness, process uptime, active database engine, and failover status.
- **Request Requirements:** None (no query parameters or request body).
- **Response Behavior:** Returns HTTP 200 with service name, node uptime, database backend in use, and fallback metadata.
- **Status Codes:**
  - `200 OK`: Server healthy and responsive.
- **Example Response (PostgreSQL Active):**
  ```json
  {
    "status": "ok",
    "service": "school-bus-replanning-local-api",
    "uptime": 142.35,
    "database": "postgresql",
    "isFallback": false,
    "fallbackReason": null,
    "serverTime": "2026-10-02T17:28:40.123Z"
  }
  ```
- **Example Response (SQLite Fallback Engaged):**
  ```json
  {
    "status": "ok",
    "service": "school-bus-replanning-local-api",
    "uptime": 23.11,
    "database": "sqlite-fallback",
    "isFallback": true,
    "fallbackReason": "PostgreSQL connection failed: connect ECONNREFUSED 127.0.0.1:5432",
    "serverTime": "2026-10-02T17:29:12.456Z"
  }
  ```

---

### 3. Fleet, Route, Student, Driver & School APIs

All collection endpoints return JSON arrays representing current operational entities loaded from the active database backend (PostgreSQL or SQLite fallback).

#### `GET /api/buses`
- **Purpose:** Retrieves all active school buses in the district fleet.
- **Response Body:** Array of bus objects containing `id`, `name`, `capacity`, `currentLoad`, `status` (`in_transit`, `delayed`, `breakdown`, `standby`, `maintenance`), `coords` (`[latitude, longitude]`), `hasWheelchairLift`, `driverId`, `routeId`, `gpsStatus`, `source`, and `lastKnownLocation`.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

#### `GET /api/routes`
- **Purpose:** Retrieves all defined bus routes and their ordered stop sequences.
- **Response Body:** Array of route objects containing `id`, `name`, `color`, `schoolId`, `stops` (ordered array with `id`, `name`, `coords`, `time`, `studentsCount`, `status`), `polyline` (`[[lat, lng], ...]`), `totalStudents`, and `delayMinutes`.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

#### `GET /api/drivers`
- **Purpose:** Retrieves all certified bus drivers and their duty status.
- **Response Body:** Array of driver objects containing `id`, `name`, `status` (`available`, `on_route`, `sick`, `rest_period`, `charter_duty`), `assignedBusId`, `phone`, and `shiftHoursRemaining`.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

#### `GET /api/students`
- **Purpose:** Retrieves all enrolled students requiring district transportation.
- **Response Body:** Array of student objects containing `id`, `name`, `schoolId`, `busId`, `routeId`, `stopName`, `pickupCoords`, `specialNeeds` (`None`, `Wheelchair`, `Aide`), and `status` (`waiting`, `picked_up`, `absent_cancelled`).
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

#### `GET /api/schools`
- **Purpose:** Retrieves destination school campuses and geographic coordinates.
- **Response Body:** Array of school objects (e.g. `SCH-01` Lincoln High, `SCH-02` Washington Middle).
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

#### `GET /api/disruptions`
- **Purpose:** Retrieves all declared operational disruptions.
- **Response Body:** Array of disruption objects containing `id`, `type`, `title`, `status` (`unresolved`, `accepted`, `rejected`), `severity`, `busId`, `routeId`, `studentId`, `location`, `aiRecommendation`, `originalState`, and `proposedState`.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

---

### 4. Disruption Ingestion API

#### `POST /api/disruptions`
- **Purpose:** Declares a new operational disruption (e.g., student cancellation, urgent student addition, vehicle breakdown) and appends a `DISRUPTION_REPORTED` event to the audit log.
- **Request Body Fields:**
  - `type` *(string, mandatory)*: Disruption classification (`urgent_add`, `student_cancel`, `breakdown`, `driver_absence`, `route_delay`).
  - `title` *(string, mandatory)*: Concise summary title for dispatcher display.
  - `id` *(string, optional)*: Explicit disruption identifier; if omitted, automatically formatted as `DIS-2026-00X`.
  - `severity` *(string, optional)*: Severity level (`low`, `warning`, `critical`). Default: `'warning'`.
  - `status` *(string, optional)*: Initial resolution status. Default: `'unresolved'`.
  - `busId` *(string, optional)*: Identifier of the affected vehicle.
  - `routeId` *(string, optional)*: Identifier of the affected route.
  - `studentId` *(string, optional)*: Identifier of the affected student.
  - `location` *(string, optional)*: Textual description of the disruption incident or pickup stop.
  - `coords` *(array `[lat, lng]`, optional)*: Geographic coordinates of the disruption.
  - `userRole` *(string, optional)*: Submitting user role for audit logging. Default: `'Dispatcher'`.
- **Response Status & Body:**
  - `201 Created`: Returns the full created disruption record with persisted ID and timestamp.
- **Validation Errors:**
  - `400 Bad Request`: When `type` or `title` is missing, or payload is invalid JSON.
- **Example Request:**
  ```json
  {
    "type": "urgent_add",
    "title": "Urgent Student Addition - Maya Lin",
    "studentName": "Maya Lin",
    "location": "Park Presidio Blvd & Geary",
    "coords": [37.7812, -122.4715],
    "severity": "warning",
    "destinationSchoolId": "SCH-01"
  }
  ```
- **Example Response (HTTP 201):**
  ```json
  {
    "id": "DIS-2026-005",
    "reportedAt": "07:35 AM",
    "type": "urgent_add",
    "title": "Urgent Student Addition - Maya Lin",
    "status": "unresolved",
    "severity": "warning",
    "busId": null,
    "routeId": null,
    "studentId": null,
    "location": "Park Presidio Blvd & Geary",
    "impact": "",
    "aiRecommendation": null,
    "originalState": null,
    "proposedState": null
  }
  ```

---

### 5. Replanning & HITL Decision APIs

#### `POST /api/replans`
- **Purpose:** Evaluates fleet state against hard constraints (capacity, driver availability, ADA requirements) using the Greedy Insertion Heuristic and generates an AI replanning recommendation.
- **Request Body Fields:**
  - `disruptionId` *(string, optional)*: ID of an existing disruption in the database.
  - `type` *(string, optional)*: Disruption type (`urgent_add`, `student_cancel`, `breakdown`). If omitted, inferred from the disruption record.
  - `studentStop` *(object, optional)*: Stop specification `{ name, coords: [lat, lng], specialNeeds }`.
  - `destinationSchoolId` *(string, optional)*: Destination school identifier. Default: `'SCH-01'`.
  - `requiredSeats` *(integer, optional)*: Number of seats required. Default: `1`.
  - `busId` *(string, optional)*: Target bus ID (for breakdowns or route adjustments).
  - `routeId` *(string, optional)*: Target route ID.
- **Response Status & Body:**
  - `200 OK`: Returns `{ success: true, planId, replan }`.
  - `400 Bad Request`: If neither `disruptionId` nor `type` is supplied, or payload is malformed.
- **Response Structure Highlights:**
  - `replan.recommendedBusId`: Selected bus ID.
  - `replan.recommendedRouteId`: Affected route ID.
  - `replan.insertionPosition`: Computed insertion index (guaranteed after completed stops).
  - `replan.additionalDelay`: Predicted detour delay in minutes.
  - `replan.additionalDistance`: Predicted detour distance in miles.
  - `replan.explanation`: Formatted explanation card string.
  - `replan.rejectedCandidates`: Array of candidates rejected by hard constraints with explicit failure reasons.
- **Example Request:**
  ```json
  {
    "disruptionId": "DIS-2026-005",
    "type": "urgent_add",
    "studentStop": {
      "name": "Park Presidio & Geary",
      "coords": [37.7812, -122.4715],
      "specialNeeds": "None"
    },
    "destinationSchoolId": "SCH-01",
    "requiredSeats": 1
  }
  ```

---

#### `POST /api/replans/:id/approve`
- **Purpose:** Executes Human-In-The-Loop (HITL) approval of a recommendation. Mutates operational entities in the database (updates bus load, inserts route stop, updates student status), transitions plan status to `'approved'`, and writes an append-only `RECOMMENDATION_ACCEPTED` audit log entry.
- **URL Parameter:** `:id` — Replan ID or associated Disruption ID.
- **Request Body Fields:**
  - `userId` *(string, optional)*: Dispatcher identifier. Default: `'dispatcher-1'`.
  - `userRole` *(string, optional)*: Role of the approver. Default: `'Dispatcher'`.
  - `actionType` *(string, optional)*: Audit action type classification.
- **Response Status & Body:**
  - `200 OK`: Returns `{ success: true, message, disruptionId, finalState }`.
  - `404 Not Found`: If replan ID does not resolve to any plan or disruption.
- **State Mutation Guarantees:**
  - For `student_cancel`: Decrements `bus.currentLoad`, reduces `route.delayMinutes`, marks student `absent_cancelled`.
  - For `urgent_add`: Increments `bus.currentLoad`, splices new stop into `route.stops` at `insertionPosition`, assigns student.
  - For `breakdown`: Reassigns students to standby bus, marks disabled bus as `'breakdown'`.

---

#### `POST /api/replans/:id/modify`
- **Purpose:** Supports Human-In-The-Loop constraint customization. Recalculates recommendation using dispatcher-overridden constraints (e.g., specifying a `preferredBusId`, `maxAllowedDelay`, `requiresWheelchair`, or `minRequiredSeats`) and generates a side-by-side before/after comparison. Does **not** auto-approve the modified plan.
- **URL Parameter:** `:id` — Replan ID or associated Disruption ID.
- **Request Body Fields:**
  - `constraints` *(object, mandatory)*:
    - `preferredBusId` *(string, optional)*: Prioritized candidate vehicle.
    - `maxAllowedDelay` *(number, optional)*: Custom maximum allowed delay threshold.
    - `minRequiredSeats` *(integer, optional)*: Minimum reserve seat threshold.
    - `driverPreference` *(string, optional)*: `'ANY'`, `'REGULAR_ONLY'`, `'SUBSTITUTE_OK'`.
    - `requiresWheelchair` *(boolean, optional)*: Enforces ADA lift requirement.
  - `userId` *(string, optional)*: Dispatcher identifier. Default: `'dispatcher-1'`.
  - `userRole` *(string, optional)*: Role of the dispatcher. Default: `'Dispatcher'`.
- **Response Status & Body:**
  - `200 OK`: Returns `{ success: true, recalculatedRecommendation, selectedCandidate, beforeAfterComparison }`.
  - `400 Bad Request`: If request body is malformed.
  - `404 Not Found`: If target replan/disruption ID is invalid.

---

#### `POST /api/replans/:id/reject`
- **Purpose:** Records human dispatcher rejection of an automated recommendation. Strictly preserves original operational routes and bus loads without mutating route stops, transitions status to `'rejected'`, and writes a mandatory justification to the audit trail.
- **URL Parameter:** `:id` — Replan ID or associated Disruption ID.
- **Request Body Fields:**
  - `reason` *(string, mandatory)*: Explicit human justification for rejecting the plan (e.g., `"Overcrowding concern on selected corridor"`).
  - `userId` *(string, optional)*: Dispatcher ID. Default: `'dispatcher-1'`.
  - `userRole` *(string, optional)*: Role of the rejector. Default: `'Dispatcher'`.
- **Response Status & Body:**
  - `200 OK`: Returns `{ success: true, message: "Plan rejected; original operational routes preserved", disruptionId, reason }`.
  - `400 Bad Request`: If `reason` is missing or whitespace-only (mandatory rejection reason invariant).
  - `404 Not Found`: If replan ID does not resolve.

---

### 6. Offline Synchronization & Idempotency API

#### `POST /api/sync`
- **Purpose:** Batch synchronization endpoint for store-and-forward replay when a client reconnects following network interruption. Applies queued operational actions with strict idempotency deduplication.
- **Request Body Fields:**
  - Accepts either a raw JSON array of actions or an object `{ actions: [...] }`.
  - Each action object must contain:
    - `actionId` *(string, mandatory)*: Unique client-generated action identifier (e.g., `ACT-1727878400000-XYZ`).
    - `actionType` *(string, mandatory)*: E.g., `MANUAL_BUS_LOCATION`, `CREATE_DISRUPTION`, `PLAN_APPROVED`, `PLAN_REJECTED`.
    - `payload` *(object, mandatory)*: Action-specific operational data.
    - `userId` / `role` *(string, optional)*: Submitting user details.
    - `timestamp` *(string, optional)*: Client ISO timestamp when action was queued.
- **Idempotency & Duplicate Prevention Behavior:**
  - For every action, the server queries `db.isActionSynced(actionId)`.
  - **If already synchronized:** The server suppresses execution of side effects, increments `duplicateCount`, and returns status `'ALREADY_SYNCED'` (`duplicate: true`).
  - **If new:** The server applies operational side effects, persists the action in the database (`synced_actions`), increments `syncedCount`, appends an `OFFLINE_ACTION_SYNCED` audit entry, and returns status `'SYNCED'` (`duplicate: false`).
- **Response Status & Body:**
  - `200 OK`: Returns batch summary `{ success: true, processedCount, syncedCount, duplicateCount, results: [...] }`.
  - `400 Bad Request`: If request body is malformed JSON.
- **Example Response:**
  ```json
  {
    "success": true,
    "processedCount": 2,
    "syncedCount": 1,
    "duplicateCount": 1,
    "results": [
      {
        "actionId": "ACT-1727878400000-001",
        "status": "SYNCED",
        "duplicate": false,
        "timestamp": "2026-10-02T17:35:00.120Z"
      },
      {
        "actionId": "ACT-1727878300000-002",
        "status": "ALREADY_SYNCED",
        "duplicate": true,
        "message": "Action was already synchronized previously. No duplicate side effects applied."
      }
    ]
  }
  ```

---

### 7. Audit Trail API

#### `GET /api/audit`
- **Purpose:** Retrieves the append-only operational audit trail from the database.
- **Request Requirements:** None.
- **Response Body:** Array of audit records ordered chronologically, containing:
  - `id`: Numeric auto-increment or UUID.
  - `action`: Audit action code (`DISRUPTION_REPORTED`, `RECOMMENDATION_GENERATED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_REJECTED`, `RECOMMENDATION_MODIFIED`, `OFFLINE_ACTION_SYNCED`, `GPS_TELEMETRY_RECOVERED`, `GPS_TELEMETRY_DEGRADED`).
  - `actionType`: Granular event classification.
  - `userRole`: Originating role (`Dispatcher`, `System Engine`, `Telemetry Ingestion Service`).
  - `disruptionId`: Associated disruption ID (if applicable).
  - `recommendationId`: Associated plan ID (if applicable).
  - `timestamp`: UTC ISO timestamp.
  - `eventMessage`: Human-readable audit narrative.
  - `originalState`: State snapshot before mutation.
  - `finalState`: State snapshot after mutation.
  - `details`: Serialized JSON payload containing constraint audits or telematics details.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

---

### 8. GPS Telematics APIs

> **Notice:** The GPS endpoints operate via software ingestion and simulation. No physical OBD-II / CAN-bus telematics hardware is attached to the MVP.

#### `POST /api/gps/update`
- **Purpose:** Ingests live telemetry pings for fleet vehicles, executes boundary validation, computes signal freshness, and updates vehicle coordinates in the database.
- **Request Body Fields:**
  - `busId` *(string, mandatory)*: Vehicle identifier.
  - `latitude` *(number, mandatory)*: Latitude coordinate between `-90.0` and `90.0`.
  - `longitude` *(number, mandatory)*: Longitude coordinate between `-180.0` and `180.0`.
  - `timestamp` *(string | number, mandatory)*: ISO-8601 string or epoch milliseconds. Rejected if future drift $> 5\text{ minutes}$.
  - `source` *(string, optional)*: Telematics source (`'rest_api'`, `'mock_telematics'`, `'manual_dispatcher'`). Default: `'rest_api'`.
  - `speedKmh` *(number, optional)*: Speed in km/h.
  - `heading` *(number, optional)*: Direction heading in degrees ($0 - 360^\circ$).
  - `locationName` *(string, optional)*: Textual landmark description.
  - `clearManual` *(boolean, optional)*: If `true`, clears existing manual VHF checkpoint lock.
- **Manual Override Preservation:**
  - If a bus is currently under dispatcher `MANUAL` override and an automated GPS ping arrives with `clearManual: false`, the automated fix is stored safely in `bus.backgroundTelematics` without overriding the dispatcher's pinned coordinates. The response returns `{ preservedManualOverride: true, gpsStatus: 'MANUAL' }`.
- **Response Status Codes:**
  - `200 OK`: Update accepted; returns normalized coordinates, `ageSeconds`, `gpsStatus` (`LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`), and `trustLevel` (`HIGH`, `MEDIUM`, `LOW`, `NONE`, `MANUAL_VERIFIED`).
  - `400 Bad Request`: If coordinates are out of bounds, timestamp is invalid, or `busId` is empty.
  - `404 Not Found`: If `busId` does not exist in the database.

---

#### `GET /api/gps`
- **Purpose:** Retrieves the current GPS telematics summary across the entire fleet.
- **Response Body:** Returns `{ provider, count, telemetry: [...] }` where `provider` contains simulation disclosures (`name: 'BackendGPSProvider'`, `isSimulated: true`, `isExternalConfigured: false`, `disclaimer: '...'`), and `telemetry` contains an array of vehicle coordinate states with age and trust levels.
- **Status Codes:** `200 OK`, `500 Internal Server Error`.

---

#### `GET /api/gps/:id`
- **Purpose:** Retrieves real-time telematics status for a specific vehicle, or provider status if `:id === 'provider'`.
- **URL Parameter:** `:id` — Bus ID (e.g. `BUS-01`) or literal string `provider`.
- **Response Body (Bus Telematics):** Returns vehicle object with `busId`, `coords`, `gpsStatus`, `ageSeconds`, `trustLevel`, `source`, `warning`, `isManual`, and `provider` metadata.
- **Response Body (Provider):** If `:id === 'provider'`, returns `{ name, type, isSimulated, isExternalConfigured, disclaimer }`.
- **Status Codes:**
  - `200 OK`: Bus or provider status returned.
  - `404 Not Found`: If bus ID is unknown.

---

### 9. Error Response Format

All backend errors in [`server/server.js`](server/server.js) are formatted uniformly using the `sendError()` handler, ensuring predictable JSON contracts for frontend clients:

```json
{
  "error": "Human-readable error description",
  "statusCode": 400,
  "details": [
    "Field 'latitude' must be between -90 and 90"
  ],
  "timestamp": "2026-10-02T17:30:00.000Z"
}
```

#### Implemented HTTP Status Codes
| Status Code | Meaning | When Returned in Current Code |
| :---: | :--- | :--- |
| **`200 OK`** | Request Succeeded | Successful entity query, replan generation, approval, rejection, modification, sync, or GPS update. |
| **`201 Created`** | Resource Created | Successful disruption creation via `POST /api/disruptions`. |
| **`204 No Content`** | Pre-flight OK | Handled for browser CORS `OPTIONS` pre-flight requests. |
| **`400 Bad Request`** | Client Validation Error | Malformed JSON body, payload $> 2\text{MB}$, missing required fields (`title`, `type`, `reason`), or out-of-range coordinates. |
| **`404 Not Found`** | Resource Not Found | Unknown URL route, missing bus ID, missing replan ID, or missing disruption ID. |
| **`500 Server Error`** | Uncaught Exception | Database driver failure or unhandled internal runtime error (caught by global server `try/catch`). |

---

### 10. Complete API Endpoint Summary Table

The table below summarizes all 14 REST endpoints implemented in [`server/server.js`](server/server.js):

| HTTP Method | Exact Endpoint Path | Purpose / Description | Success Status | Common Failure Statuses | Frontend Client Method |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **`GET`** | `/api/health` | Service liveness, uptime, database backend & fallback status | `200 OK` | `500 Server Error` | Diagnostic probe |
| **`GET`** | `/api/buses` | Fetch all fleet school buses and current status | `200 OK` | `500 Server Error` | [`fetchBuses()`](src/api/client.js) |
| **`GET`** | `/api/routes` | Fetch all bus routes, stop sequences, and polylines | `200 OK` | `500 Server Error` | [`fetchRoutes()`](src/api/client.js) |
| **`GET`** | `/api/drivers` | Fetch all drivers and duty statuses | `200 OK` | `500 Server Error` | [`fetchDrivers()`](src/api/client.js) |
| **`GET`** | `/api/students` | Fetch student enrollment and transportation assignments | `200 OK` | `500 Server Error` | [`fetchStudents()`](src/api/client.js) |
| **`GET`** | `/api/schools` | Fetch school campus locations | `200 OK` | `500 Server Error` | [`fetchSchools()`](src/api/client.js) |
| **`GET`** | `/api/disruptions` | Fetch active and historic disruption records | `200 OK` | `500 Server Error` | [`fetchDisruptions()`](src/api/client.js) |
| **`POST`** | `/api/disruptions` | Declare a new operational disruption | `201 Created` | `400 Bad Request` | [`createDisruption()`](src/api/client.js) |
| **`POST`** | `/api/replans` | Run heuristic replanning engine for candidate evaluation | `200 OK` | `400 Bad Request` | [`generateReplan()`](src/api/client.js) |
| **`POST`** | `/api/replans/:id/approve` | Approve plan and commit state changes to fleet/routes | `200 OK` | `400 Bad Request`, `404 Not Found` | [`approveReplan()`](src/api/client.js) |
| **`POST`** | `/api/replans/:id/modify` | Custom constraint recalculation with side-by-side comparison | `200 OK` | `400 Bad Request`, `404 Not Found` | [`modifyReplan()`](src/api/client.js) |
| **`POST`** | `/api/replans/:id/reject` | Reject recommendation with mandatory reason; keep original routes | `200 OK` | `400 Bad Request`, `404 Not Found` | [`rejectReplan()`](src/api/client.js) |
| **`POST`** | `/api/sync` | Store-and-forward batch replay with idempotency check | `200 OK` | `400 Bad Request` | [`syncOfflineActions()`](src/api/client.js) |
| **`GET`** | `/api/audit` | Retrieve complete chronological audit trail | `200 OK` | `500 Server Error` | [`fetchAuditLogs()`](src/api/client.js) |
| **`POST`** | `/api/gps/update` | Ingest vehicle GPS fix, validate coords/time, manage manual lock | `200 OK` | `400 Bad Request`, `404 Not Found` | Telematics provider layer |
| **`GET`** | `/api/gps` | Fleet-wide GPS telematics summary and simulation metadata | `200 OK` | `500 Server Error` | Telematics provider layer |
| **`GET`** | `/api/gps/:id` | Real-time telematics status for a bus or provider status | `200 OK` | `404 Not Found` | Telematics provider layer |

---

## Database Schema Documentation

The School Bus Rapid Replanning backend persistence layer provides dual-database architecture support: a complete relational **PostgreSQL** database schema ([`server/pg/migrations/001_initial_schema.sql`](server/pg/migrations/001_initial_schema.sql)) with automatic, seamless failover to an embedded **SQLite** database ([`server/db.js`](server/db.js)) whenever PostgreSQL is unconfigured or unreachable.

---

### 1. Database Architecture & Storage Separation

The application architecture strictly partitions persistence responsibilities across three operational layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Browser Client Layer (Vue/React-free Vanilla JS SPA)                │
│    - Reactive in-memory state: AppStore (`src/state/store.js`)        │
│    - Offline Store-and-Forward Queue: `school_bus_pending_sync` (LS)  │
│    - Client Idempotency Set: `school_bus_synced_actions` (LS, max 1000)│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP REST (`src/api/client.js`)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. Backend API & Selection Layer (`server/databaseFactory.js`)         │
│    - Probes PostgreSQL on boot via `PgConnectionManager.testConnection`│
│    - If connected: Selects `PgDatabase` repository facade              │
│    - If unreachable: Selects `LocalDatabase` (SQLite / DatabaseSync)   │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │ Connected                        │ Unreachable / ECONNREFUSED
                   ▼                                  ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│ 3A. PostgreSQL Relational Database   │  │ 3B. SQLite Fallback Database │
│     - 12 Relational Tables           │  │     - File: school_bus.db    │
│     - Foreign keys & Cascades        │  │     - Node:sqlite sync engine│
│     - JSONB entity snapshots         │  │     - In-memory or file mode │
│     - Auto-updating trigger triggers │  │     - Identical repository   │
│     - Configured via PG* env vars    │  │       method signatures      │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

- **Persistent Backend Database:** Houses district assets, routes, student rosters, driver shifts, disruption events, candidate replans, approvals, time-series telematics fixes, and audit trails.
- **Client Offline Storage:** Browser `localStorage` holds transient offline actions while the device is disconnected. It does **not** replace the backend database.
- **Production Scope Notice:** This database architecture is implemented for local execution and MVP demonstration. No multi-region cloud deployment, distributed replication, high-availability clustering, or automated cloud backups are claimed.

---

### 2. Implemented Database Tables

The PostgreSQL migration ([`server/pg/migrations/001_initial_schema.sql`](server/pg/migrations/001_initial_schema.sql)) and SQLite database ([`server/db.js`](server/db.js)) define **12 relational tables** (11 domain tables plus 1 migration tracking table):

#### 2.1 `schema_migrations`
- **Purpose:** Tracks applied database schema migration versions to guarantee migration idempotency.
- **Primary Key:** `version` (`TEXT`).
- **Columns:** `version` (`TEXT`), `description` (`TEXT NOT NULL`), `applied_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`).
- **Indexes & Constraints:** Primary key index on `version`.

#### 2.2 `buses`
- **Purpose:** Physical transport fleet vehicles, seating capacities, telemetry coordinates, and status.
- **Primary Key:** `id` (`TEXT`, e.g. `"BUS-01"`).
- **Foreign Keys:**
  - `driver_id` (`TEXT`): References assigned driver in `drivers(id)`.
  - `route_id` (`TEXT`): References active route in `routes(id)`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`)
  - `plate` (`TEXT`), `model` (`TEXT`), `type` (`TEXT` e.g. `'Diesel'`, `'Electric'`)
  - `capacity` (`INTEGER NOT NULL DEFAULT 54`), `current_load` (`INTEGER NOT NULL DEFAULT 0`)
  - `status` (`TEXT NOT NULL DEFAULT 'in_depot'`): `'in_transit'`, `'delayed'`, `'breakdown'`, `'in_depot'`, `'maintenance'`.
  - `coords` (`NUMERIC(9,6)[] DEFAULT '{37.77,-122.42}'`)
  - `gps_status` (`TEXT NOT NULL DEFAULT 'live'`): `'live'`, `'last_known'`, `'stale'`, `'no_signal'`, `'manual'`.
  - `gps_source` (`TEXT DEFAULT 'mock_telematics'`), `age_seconds` (`INTEGER DEFAULT 0`)
  - `last_gps_sync_ms` (`BIGINT`), `last_gps_sync` (`TEXT`), `last_known_location` (`TEXT`)
  - `is_manual_location` (`BOOLEAN NOT NULL DEFAULT FALSE`)
  - `amenities` (`TEXT[]` e.g. `ARRAY['Wheelchair Lift']`)
  - `raw_json` (`JSONB NOT NULL DEFAULT '{}'`), `created_at` (`TIMESTAMPTZ`), `updated_at` (`TIMESTAMPTZ`).
- **Indexes:** `idx_buses_status`, `idx_buses_driver`, `idx_buses_route`, `idx_buses_gps`.

#### 2.3 `drivers`
- **Purpose:** Certified bus drivers, availability statuses, assigned vehicles, and shift hours.
- **Primary Key:** `id` (`TEXT`, e.g. `"DRV-101"`).
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `name` (`TEXT NOT NULL`), `phone` (`TEXT`), `license` (`TEXT`)
  - `rating` (`NUMERIC(3,1) DEFAULT 4.5`), `experience_yrs` (`INTEGER DEFAULT 0`)
  - `status` (`TEXT NOT NULL DEFAULT 'active'`): `'active'`, `'on_break'`, `'sick'`, `'standby'`.
  - `availability_status` (`TEXT NOT NULL DEFAULT 'active'`)
  - `current_assignment` (`TEXT`), `current_location` (`NUMERIC(9,6)[]`)
  - `location_source` (`TEXT DEFAULT 'last_known'`), `is_location_stale` (`BOOLEAN NOT NULL DEFAULT FALSE`)
  - `shift_start` (`TEXT`), `shift_end` (`TEXT`), `photo` (`TEXT`), `raw_json` (`JSONB`), `created_at`, `updated_at`.
- **Indexes:** `idx_drivers_status`.

#### 2.4 `routes`
- **Purpose:** Scheduled bus routes connecting passenger stops to destination school campuses.
- **Primary Key:** `id` (`TEXT`, e.g. `"RT-101"`).
- **Foreign Keys:**
  - `assigned_bus` (`TEXT`): `REFERENCES buses(id) ON DELETE SET NULL`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `name` (`TEXT NOT NULL`), `school_id` (`TEXT NOT NULL`), `school_name` (`TEXT`)
  - `assigned_bus` (`TEXT REFERENCES buses(id)`), `assigned_driver` (`TEXT`)
  - `status` (`TEXT NOT NULL DEFAULT 'on_time'`): `'on_time'`, `'delayed'`, `'disrupted'`, `'completed'`.
  - `total_stops` (`INTEGER DEFAULT 0`), `completed_stops` (`INTEGER DEFAULT 0`), `total_students` (`INTEGER DEFAULT 0`)
  - `scheduled_start_time` (`TEXT`), `scheduled_arrival_time` (`TEXT`), `current_eta` (`TEXT`)
  - `delay_minutes` (`NUMERIC(5,1) DEFAULT 0`), `color` (`TEXT DEFAULT '#3b82f6'`)
  - `raw_json` (`JSONB NOT NULL DEFAULT '{}'`), `created_at`, `updated_at`.
- **Indexes:** `idx_routes_bus`, `idx_routes_school`, `idx_routes_status`.

#### 2.5 `route_stops`
- **Purpose:** Normalized ordered waypoints belonging to routes with geographic coordinates and student boarding counts.
- **Primary Key:** Composite `PRIMARY KEY (route_id, id)`.
- **Foreign Keys:**
  - `route_id` (`TEXT NOT NULL`): `REFERENCES routes(id) ON DELETE CASCADE`.
- **Key Columns & Types:**
  - `id` (`TEXT NOT NULL`), `route_id` (`TEXT NOT NULL`), `sequence_order` (`INTEGER NOT NULL`)
  - `name` (`TEXT NOT NULL`), `lat` (`NUMERIC(9,6)`), `lon` (`NUMERIC(9,6)`)
  - `scheduled_time` (`TEXT`), `students_count` (`INTEGER DEFAULT 0`)
  - `status` (`TEXT DEFAULT 'pending'`): `'pending'`, `'next'`, `'completed'`, `'delayed'`, `'stuck'`, `'stranded'`, `'destination'`.
- **Indexes:** `idx_route_stops_route`, `idx_route_stops_status`.

#### 2.6 `students`
- **Purpose:** Student passenger rosters, transportation needs, school enrollment, and stop coordinates.
- **Primary Key:** `id` (`TEXT`, e.g. `"STU-1001"`).
- **Foreign Keys:** Logical foreign keys referencing `buses(id)`, `routes(id)`, and schools.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `name` (`TEXT NOT NULL`), `grade` (`TEXT`), `school_id` (`TEXT`), `school_name` (`TEXT`)
  - `bus_id` (`TEXT`), `route_id` (`TEXT`), `stop_name` (`TEXT`)
  - `pickup_lat` (`NUMERIC(9,6)`), `pickup_lon` (`NUMERIC(9,6)`)
  - `guardian_name` (`TEXT`), `guardian_phone` (`TEXT`)
  - `status` (`TEXT NOT NULL DEFAULT 'waiting'`): `'waiting'`, `'boarded'`, `'absent_cancelled'`, `'urgent_added'`, `'stranded'`.
  - `special_needs` (`TEXT DEFAULT 'None'` e.g. `'Wheelchair'`), `photo` (`TEXT`), `raw_json` (`JSONB`), `created_at`, `updated_at`.
- **Indexes:** `idx_students_bus`, `idx_students_route`, `idx_students_status`.

#### 2.7 `disruptions`
- **Purpose:** Declared operational incidents (cancellations, additions, breakdowns, hazards) and lifecycle state snapshots.
- **Primary Key:** `id` (`TEXT`, e.g. `"DIS-2026-001"`).
- **Foreign Keys:** Logical references to `bus_id`, `route_id`, and `student_id`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `reported_at` (`TEXT`)
  - `type` (`TEXT NOT NULL`): `'breakdown'`, `'driver_unavailability'`, `'student_cancel'`, `'urgent_add'`, `'traffic_hazard'`.
  - `title` (`TEXT NOT NULL`), `status` (`TEXT NOT NULL DEFAULT 'unresolved'`): `'unresolved'`, `'replanned'`, `'accepted'`, `'rejected'`, `'completed'`.
  - `severity` (`TEXT NOT NULL DEFAULT 'warning'`): `'critical'`, `'warning'`, `'info'`.
  - `bus_id` (`TEXT`), `route_id` (`TEXT`), `student_id` (`TEXT`), `location` (`TEXT`), `impact` (`TEXT`)
  - `ai_recommendation` (`JSONB`), `original_state` (`JSONB`), `proposed_state` (`JSONB`), `final_state` (`JSONB`)
  - `raw_json` (`JSONB NOT NULL DEFAULT '{}'`), `created_at`, `updated_at`.
- **Indexes:** `idx_disruptions_status`, `idx_disruptions_bus`, `idx_disruptions_route`, `idx_disruptions_severity`, `idx_disruptions_created`.

#### 2.8 `replans`
- **Purpose:** AI replan recommendations generated by the Greedy Insertion Heuristic.
- **Primary Key:** `id` (`TEXT`, e.g. `"REPLAN-1727878400-001"`).
- **Foreign Keys:**
  - `disruption_id` (`TEXT`): `REFERENCES disruptions(id) ON DELETE CASCADE`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `disruption_id` (`TEXT REFERENCES disruptions(id)`)
  - `status` (`TEXT NOT NULL DEFAULT 'pending_review'`): `'pending_review'`, `'approved'`, `'rejected'`, `'expired'`.
  - `strategy` (`TEXT DEFAULT 'Greedy Insertion'`)
  - `recommended_bus_id` (`TEXT`), `recommended_route_id` (`TEXT`)
  - `score` (`NUMERIC(8,4) DEFAULT 0`), `details` (`JSONB NOT NULL DEFAULT '{}'`), `created_at`, `updated_at`.
- **Indexes:** `idx_replans_disruption`, `idx_replans_status`, `idx_replans_created`.

#### 2.9 `replan_candidates`
- **Purpose:** Full audit log of all candidate vehicles evaluated for a replan, recording ranks, composite scores, and constraint rejection reasons.
- **Primary Key:** `id` (`TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT`).
- **Foreign Keys:**
  - `replan_id` (`TEXT NOT NULL`): `REFERENCES replans(id) ON DELETE CASCADE`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `replan_id` (`TEXT NOT NULL REFERENCES replans(id)`), `bus_id` (`TEXT NOT NULL`), `route_id` (`TEXT`)
  - `rank` (`INTEGER NOT NULL`), `score` (`NUMERIC(8,4) DEFAULT 0`), `is_recommended` (`BOOLEAN NOT NULL DEFAULT FALSE`)
  - `rejection_reason` (`TEXT` e.g. `'Capacity exceeded: 54/54'` or `'Driver hours violation'`)
  - `score_breakdown` (`JSONB`), `gps_status` (`TEXT`), `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`).
- **Indexes:** `idx_candidates_replan`, `idx_candidates_bus`.

#### 2.10 `approvals`
- **Purpose:** Dispatcher Human-In-The-Loop review decisions (`APPROVED`, `REJECTED`, `MODIFIED`), constraint overrides, and applied state mutations.
- **Primary Key:** `id` (`TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT`).
- **Foreign Keys:**
  - `replan_id` (`TEXT NOT NULL`): `REFERENCES replans(id) ON DELETE CASCADE`.
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `replan_id` (`TEXT NOT NULL REFERENCES replans(id)`), `disruption_id` (`TEXT`)
  - `action` (`TEXT NOT NULL`): `'APPROVED'`, `'REJECTED'`, `'MODIFIED'`.
  - `dispatcher_id` (`TEXT`), `dispatcher_role` (`TEXT DEFAULT 'dispatcher'`)
  - `reason` (`TEXT`), `modifications` (`JSONB`), `applied_changes` (`JSONB`), `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`).
- **Indexes:** `idx_approvals_replan`, `idx_approvals_disruption`, `idx_approvals_action`.

#### 2.11 `gps_updates`
- **Purpose:** Time-series ingestion table recording every incoming telematics fix, coordinate validation outcome, and manual VHF checkpoint override.
- **Primary Key:** `id` (`BIGSERIAL PRIMARY KEY` in PostgreSQL; `INTEGER PRIMARY KEY AUTOINCREMENT` in SQLite).
- **Key Columns & Types:**
  - `id` (`BIGSERIAL PRIMARY KEY`), `bus_id` (`TEXT NOT NULL`)
  - `latitude` (`NUMERIC(9,6) NOT NULL`), `longitude` (`NUMERIC(9,6) NOT NULL`)
  - `speed_kmh` (`NUMERIC(5,1)`), `heading` (`INTEGER`)
  - `source` (`TEXT NOT NULL`): `'rest_api'`, `'mock_telematics'`, `'manual_dispatcher'`, `'hardware_gps'`, `'no_signal'`.
  - `gps_status` (`TEXT NOT NULL`): `'LIVE'`, `'LAST_KNOWN'`, `'STALE'`, `'NO_SIGNAL'`, `'MANUAL'`.
  - `trust_level` (`TEXT`): `'HIGH'`, `'MEDIUM'`, `'LOW'`, `'NONE'`, `'MANUAL_VERIFIED'`.
  - `age_seconds` (`INTEGER`), `is_manual` (`BOOLEAN NOT NULL DEFAULT FALSE`), `location_name` (`TEXT`)
  - `is_simulated` (`BOOLEAN NOT NULL DEFAULT TRUE`), `payload_json` (`JSONB`), `received_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`).
- **Indexes:** `idx_gps_updates_bus`, `idx_gps_updates_received`, `idx_gps_updates_status`, plus partial index `idx_gps_updates_recent` on records received within the last 24 hours.

#### 2.12 `offline_actions`
- **Purpose:** Server-side persistence table for store-and-forward action replay, tracking client UUID idempotency keys to eliminate duplicate side effects.
- **Primary Key:** `action_id` (`TEXT PRIMARY KEY`, client-generated UUID).
- **Key Columns & Types:**
  - `action_id` (`TEXT PRIMARY KEY`), `action_type` (`TEXT NOT NULL`), `user_id` (`TEXT`), `role` (`TEXT DEFAULT 'dispatcher'`)
  - `status` (`TEXT NOT NULL DEFAULT 'pending'`): `'pending'`, `'synced'`, `'failed'`.
  - `payload` (`JSONB`), `result` (`JSONB`), `error` (`TEXT`), `retry_count` (`INTEGER NOT NULL DEFAULT 0`)
  - `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`), `synced_at` (`TIMESTAMPTZ`), `last_attempt_at` (`TIMESTAMPTZ`).
- **Indexes:** `uidx_offline_action_id` (`UNIQUE`), `idx_offline_status`, `idx_offline_created`.

#### 2.13 `audit_logs`
- **Purpose:** Immutable append-only audit trail capturing all operational events and state transitions for regulatory compliance and dispute reconstruction.
- **Primary Key:** `id` (`TEXT PRIMARY KEY`).
- **Key Columns & Types:**
  - `id` (`TEXT PRIMARY KEY`), `action` (`TEXT NOT NULL`), `action_type` (`TEXT`), `user_role` (`TEXT DEFAULT 'Dispatcher'`)
  - `disruption_id` (`TEXT`), `recommendation_id` (`TEXT`), `timestamp` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)
  - `original_state` (`JSONB`), `proposed_state` (`JSONB`), `final_state` (`JSONB`)
  - `event_message` (`TEXT`), `details` (`JSONB`), `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`).
- **Indexes:** `idx_audit_logs_timestamp`, `idx_audit_logs_disruption`, `idx_audit_logs_action_type`.

---

### 3. Relational Schema & Entity Relationships

The schema models district operations with strict relational integrity:

```
    ┌──────────────┐                 ┌──────────────┐
    │   drivers    │                 │    buses     │◀──────────────┐
    └──────┬───────┘                 └──────┬───────┘               │
           │                                │                       │
           │ (assigned_driver)              │ (assigned_bus)        │
           ▼                                ▼                       │
    ┌───────────────────────────────────────────────┐               │
    │                    routes                     │               │
    └──────────────────────┬────────────────────────┘               │
                           │ 1:N (ON DELETE CASCADE)                │
                           ▼                                        │
    ┌───────────────────────────────────────────────┐               │
    │                  route_stops                  │               │
    └───────────────────────────────────────────────┘               │
                                                                    │
    ┌──────────────┐                                                │
    │   students   │──(bus_id / route_id)───────────────────────────┤
    └──────────────┘                                                │
                                                                    │
    ┌──────────────┐                                                │
    │ disruptions  │──(bus_id / route_id)───────────────────────────┤
    └──────┬───────┘                                                │
           │ 1:N (ON DELETE CASCADE)                                │
           ▼                                                        │
    ┌──────────────┐       1:N (CASCADE)      ┌──────────────────┐  │
    │   replans    │─────────────────────────▶│ replan_candidates│──┘
    └──────┬───────┘                          └──────────────────┘
           │ 1:N (ON DELETE CASCADE)
           ▼
    ┌──────────────┐
    │  approvals   │
    └──────────────┘

    ┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
    │ gps_updates  │      │ offline_actions │      │  audit_logs  │
    │ (time-series)│      │  (idempotency)  │      │ (append-only)│
    └──────────────┘      └─────────────────┘      └──────────────┘
```

1. **`buses` $\leftrightarrow$ `drivers`:** 1:1 or 1:N logical assignment. `buses.driver_id` references `drivers.id`; `drivers.current_assignment` tracks assigned route.
2. **`routes` $\leftrightarrow$ `buses`:** `routes.assigned_bus` references `buses.id` with `ON DELETE SET NULL`. If a vehicle is decommissioned, route definitions persist without corruption.
3. **`routes` $\leftrightarrow$ `route_stops`:** 1:N strictly ordered parent-child relationship. `route_stops.route_id` references `routes.id` with `ON DELETE CASCADE`. Stops are uniquely identified by composite key `(route_id, id)`.
4. **`disruptions` $\leftrightarrow$ `replans`:** 1:N relationship. When a disruption triggers replanning, candidate plans link via `replans.disruption_id` referencing `disruptions.id` with `ON DELETE CASCADE`.
5. **`replans` $\leftrightarrow$ `replan_candidates`:** 1:N relationship. Every candidate vehicle evaluated during replanning is recorded with `replan_id REFERENCES replans(id) ON DELETE CASCADE`.
6. **`replans` $\leftrightarrow$ `approvals`:** 1:N relationship. Dispatcher decisions link to the evaluated plan with `replan_id REFERENCES replans(id) ON DELETE CASCADE`.
7. **`buses` $\leftrightarrow$ `gps_updates`:** 1:N time-series stream. Every location update stores `bus_id`, coordinates, speed, heading, and status.

---

### 4. Data Integrity & Constraints

- **Primary Keys:** Every table enforces a non-null, unique primary key (`TEXT` identifiers, composite `(route_id, id)` on route stops, or auto-incrementing serials on GPS updates).
- **Foreign Key Enforcement & Cascades:** Cascading deletes (`ON DELETE CASCADE`) are defined on dependent child records (`route_stops`, `replans`, `replan_candidates`, `approvals`), while structural vehicle assignments use `ON DELETE SET NULL` to prevent orphan errors.
- **NOT NULL Constraints:** Critical operational attributes (`capacity`, `status`, `name`, `type`, `action`, `latitude`, `longitude`) strictly disallow NULL values.
- **Idempotency Key Constraints:** `offline_actions.action_id` is an enforced `PRIMARY KEY` with an explicit `UNIQUE INDEX` (`uidx_offline_action_id`), guaranteeing that repeated API submissions cannot insert duplicate action rows.
- **Append-Only Audit Immutability:** `audit_logs` maintains a single-direction append contract. Neither the API server nor repositories expose `UPDATE` or `DELETE` operations against `audit_logs`.
- **Automated Timestamp Triggers:** PostgreSQL migration defines `trigger_set_updated_at()` executed before update on `buses`, `drivers`, `routes`, `students`, `disruptions`, and `replans` to maintain precise `updated_at` timestamps.

---

### 5. Persistence, Factory Selection & SQLite Fallback Flow

The database instance is dynamically created and managed by [`server/databaseFactory.js`](server/databaseFactory.js):

```
                       createDatabase(options)
                                  │
                  Explicit options.db provided?
                         │             │
                   (Yes) │             │ (No)
                         ▼             ▼
                 Use Direct DB     DB_BACKEND == 'postgres' or usePostgres?
                                       │              │
                                 (Yes) │              │ (No - Default)
                                       ▼              ▼
                           PgConnectionManager   LocalDatabase (SQLite)
                             .testConnection()     (data/school_bus.db)
                                       │
                         ┌─────────────┴─────────────┐
                         │ Connected?                │
                   (Yes) │                           │ (No: ECONNREFUSED)
                         ▼                           ▼
                 PgDatabase (PostgreSQL)     [Database Warning logged]
                 isFallback: false           LocalDatabase (SQLite)
                 backend: 'postgres'         isFallback: true
                                             backend: 'sqlite-fallback'
```

1. **PostgreSQL Mode:** If `DB_BACKEND=postgres` or `usePostgres: true` is configured, [`PgConnectionManager.testConnection()`](server/pg/connection.js) probes PostgreSQL (default: `localhost:5432`). If successful, migrations and seeds are executed if needed, and `PgDatabase` is activated.
2. **Graceful SQLite Fallback:** If PostgreSQL is unreachable (`connect ECONNREFUSED 127.0.0.1:5432`), the factory catches the error, outputs `[Database Warning] Failed to connect to PostgreSQL (...). Gracefully falling back to local SQLite database.`, and returns an initialized `LocalDatabase` instance.
3. **Fallback Detection:** The factory sets metadata `{ backend: 'sqlite-fallback', isFallback: true, fallbackReason: '...' }`, exposed in real time via the `GET /api/health` endpoint.
4. **Data Availability During Fallback:** The SQLite database implements the exact same domain method signatures (`getBuses()`, `getRoutes()`, `saveDisruption()`, `saveReplan()`, `saveApproval()`, `isActionSynced()`, `saveAuditLog()`), guaranteeing zero system downtime or UI crashes.

---

### 6. Offline Queue Storage vs. Backend Tables

| Dimension | Browser Client Offline Queue | Backend `offline_actions` Table |
| :--- | :--- | :--- |
| **Storage Mechanism** | Browser `localStorage` (`school_bus_pending_sync`) | PostgreSQL / SQLite table `offline_actions` |
| **Lifecycle** | Transient FIFO queue; items removed or marked upon sync | Permanent server audit record of all synchronized actions |
| **Idempotency Key** | Generated client UUID (`actionId: 'ACT-...'`) | Primary key constraint on `action_id` (`uidx_offline_action_id`) |
| **Deduplication** | Client maintains runtime `syncedActionIds` Set & local cache | Database queries `isActionSynced(actionId)` before applying side effects |
| **Duplicate Result** | Action skipped locally | Returns HTTP 200 `{ status: 'ALREADY_SYNCED', duplicate: true }` |

---

### 7. Database Migration & Seed Commands

The project defines three operational database CLI scripts in [`package.json`](package.json) backed by [`server/pg/cli.js`](server/pg/cli.js):

#### 1. Run Migrations: `npm run db:migrate`
- **Command:** `node server/pg/cli.js migrate`
- **Action:** Executes [`PgMigrator`](server/pg/migrator.js) against PostgreSQL. Reads all `.sql` files in `server/pg/migrations/`, checks `schema_migrations`, and applies unapplied scripts within a transaction.

#### 2. Seed Initial Demo Data: `npm run db:seed`
- **Command:** `node server/pg/cli.js seed`
- **Action:** Runs [`seedDatabase()`](server/pg/seed.js), populating the database with 8 buses, 7 drivers, 4 routes with 21 stops, 8 students, and 4 disruptions matching `mockData.js`. Supports `--force` flag to truncate and re-seed.

#### 3. Inspect Database Status: `npm run db:status`
- **Command:** `node server/pg/cli.js status`
- **Action:** Tests connectivity to PostgreSQL, queries server time, and outputs the current fleet count in the `buses` table.

---

### 8. Schema Verification & Test Coverage

Database integrity, repository operations, and failover behavior are comprehensively validated by the dedicated test suite:

- **Test File:** [`tests/postgresDatabase.test.js`](tests/postgresDatabase.test.js)
- **Execution:** Runs automatically as Suite 13 in `npm test` or individually via:
  ```bash
  node tests/postgresDatabase.test.js
  ```
- **Verified Capabilities (62 Assertions, 100% Pass Rate):**
  - **Schema & Migration Verification (1a–1f):** Validates existence of migration directory, presence of `001_initial_schema.sql`, definition of all 11 core tables, migrator execution, recording in `schema_migrations`, and migration idempotency.
  - **Seed Data Invariant Verification (2a–2g):** Validates seeding of 8 buses, 7 drivers, 4 routes, 8 students, 4 disruptions, and 21 normalized `route_stops`.
  - **Repository CRUD Operations (3.1–3.10):** Tests `BusRepository`, `DriverRepository`, `RouteRepository`, `StudentRepository`, `DisruptionRepository`, `ReplanRepository`, `ApprovalRepository`, `GpsRepository`, `OfflineActionRepository` (idempotency key deduplication), and `AuditLogRepository` (append-only audit invariants).
  - **Connection Resilience & SQLite Fallback (4a–4k):** Simulates connection refusal (`ECONNREFUSED`), verifies graceful fallback to `LocalDatabase`, asserts `isFallback: true` and `backend: 'sqlite-fallback'`, and confirms complete domain interface availability.
  - **Database Facade Contracts (5a–5c):** Verifies that `PgDatabase` exposes identical method contracts to the rest of the application.

---

### 9. Database Schema Summary Table

The table below summarizes all 12 tables verified in the database schema:

| Table Name | Purpose / Responsibility | Primary Key | Key Relationships & Foreign Keys |
| :--- | :--- | :--- | :--- |
| **`schema_migrations`** | Migration version tracking | `version` (`TEXT`) | None (system table) |
| **`buses`** | Fleet vehicles, loads, and coordinates | `id` (`TEXT`) | `driver_id` $\to$ `drivers.id`, `route_id` $\to$ `routes.id` |
| **`drivers`** | Certified operators & duty statuses | `id` (`TEXT`) | `current_assignment` $\to$ route |
| **`routes`** | Scheduled routes & timing | `id` (`TEXT`) | `assigned_bus` $\to$ `buses.id` (`ON DELETE SET NULL`) |
| **`route_stops`** | Ordered route waypoints | `(route_id, id)` | `route_id` $\to$ `routes.id` (`ON DELETE CASCADE`) |
| **`students`** | Student rosters & accommodations | `id` (`TEXT`) | `bus_id` $\to$ `buses.id`, `route_id` $\to$ `routes.id` |
| **`disruptions`** | Operational incidents & snapshots | `id` (`TEXT`) | `bus_id` $\to$ `buses.id`, `route_id` $\to$ `routes.id` |
| **`replans`** | Heuristic replan recommendations | `id` (`TEXT`) | `disruption_id` $\to$ `disruptions.id` (`CASCADE`) |
| **`replan_candidates`**| Evaluated candidate vehicles & scores | `id` (`TEXT`) | `replan_id` $\to$ `replans.id` (`ON DELETE CASCADE`) |
| **`approvals`** | Dispatcher HITL decisions & audits | `id` (`TEXT`) | `replan_id` $\to$ `replans.id` (`ON DELETE CASCADE`) |
| **`gps_updates`** | Time-series vehicle telemetry fixes | `id` (`BIGSERIAL`) | `bus_id` $\to$ vehicle identifier |
| **`offline_actions`** | Store-and-forward idempotency queue | `action_id` (`TEXT`) | Unique client idempotency key |
| **`audit_logs`** | Append-only decision audit trail | `id` (`TEXT`) | `disruption_id`, `recommendation_id` |

---

### 10. Database Limitations & Operational Boundaries

1. **MVP Demonstration Deployment:** PostgreSQL is implemented with complete schemas and repositories, but production cloud hosting (e.g. AWS RDS, Google Cloud SQL, Azure Database) is not demonstrated.
2. **Dual-Backend Fallback:** The SQLite fallback is an active component of the implemented MVP architecture. If PostgreSQL is offline, SQLite smoothly handles persistence.
3. **No Distributed HA or Replication:** The architecture does not claim active-active multi-master replication, automated read replicas, distributed transaction coordinators, or automated cloud snapshot backups.
4. **Local Single-Node Execution:** In local development, the Node.js server connects to a local PostgreSQL instance or writes to `data/school_bus.db`.
5. **No Direct ORM Layer:** The codebase utilizes clean native SQL queries and parameterized statements via the `pg` driver and `node:sqlite`, avoiding heavy ORMs (such as Prisma or TypeORM) to minimize dependencies.

---

## Technology Stack
- **Frontend Core:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Build Tool:** Vite
- **Mapping & Geospatial:** Leaflet.js with OpenStreetMap tiles
- **Icons:** Lucide Icons
- **State Management:** Reactive in-memory AppStore (`src/state/store.js`) with browser `localStorage` persistence
- **Replanning Engine:** Deterministic Greedy Insertion Heuristic (`src/utils/replanningEngine.js`)
- **Testing & Benchmarks:** Native Node.js test runners (`tests/`)

