# Requirements Traceability Matrix (RTM)

**Project:** School Bus Rapid Replanning & Responsible AI System  
**Version:** 1.0.0 (Production Verified)  
**Date of Validation:** September 2026  
**Status:** All Requirements Verified & Traceable  

---

## 1. System Overview & Architectural Implementation Reality Matrix

The School Bus Rapid Replanning System provides a deterministic, transparent, and human-in-the-loop decision-support platform for school district dispatchers facing transit disruptions. 

> [!IMPORTANT]
> ### Architectural Reality Notice (Current MVP Scope)
> The current system is implemented as a **fully functional client-side Single Page Application (SPA)** running within the browser runtime (supported by Node.js for local automated testing and benchmarking).
> It does **NOT** connect to a live cloud backend, remote REST API, external message broker, live GPS tracking service, or production database.

### 10-Point Architectural Implementation Reality Matrix:

| # | Architectural Dimension | Current Codebase Status | Architectural Classification | Detailed Implementation Description |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Cloud / Backend Server** | **Not Implemented** | **FUTURE PRODUCTION WORK** | The current MVP runs entirely client-side in the browser. No external application server (Node.js/Express, Python/FastAPI, or Java) is deployed. |
| **2** | **Central REST API** | **Not Implemented** | **FUTURE PRODUCTION WORK** | No live HTTP endpoints (`POST /api/v1/dispatch/*`) exist. All operations and plan recalculations are internal JavaScript function calls in `store.js` and `replanningEngine.js`. |
| **3** | **Message Broker (Kafka / RabbitMQ / MQTT)** | **Not Implemented** | **FUTURE PRODUCTION WORK** | No distributed event streaming (Kafka), enterprise message broker (RabbitMQ), or cellular IoT broker (MQTT) is connected. Queuing is managed locally in browser storage. |
| **4** | **Browser LocalStorage Persistence** | **Implemented & Verified** | **IMPLEMENTED NOW** | Durable client-side persistence is implemented via `localStorage`: `school_bus_pending_sync` (9-attribute action queue) and `school_bus_synced_actions` (idempotency key cache, capped at 1,000 keys). |
| **5** | **Central-Server Sync** | **Simulated Locally** | **SIMULATED FOR MVP** | Synchronization is an event-driven client-side simulation in `store.js` (`syncPendingOfflineChanges`). It processes FIFO queues, increments retry counts, records timestamps, and updates action states without live network I/O. |
| **6** | **GPS Telematics Provider** | **Simulated & Manual** | **SIMULATED FOR MVP** | 5-state GPS telematics degradation (`LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`), age counters, uncertainty penalties, and manual checkpoint coordinate input are implemented now. Live cellular OBD-II vehicle streaming is future work. |
| **7** | **Map & Road Routing** | **Leaflet + Planar Math** | **IMPLEMENTED NOW** | Geospatial map rendering uses Leaflet with OpenStreetMap tiles. Route distances are estimated via planar coordinate geometry scaled by California latitude/longitude constants and an urban circuity multiplier ($1.30$). Vector road-graph routing (OSRM/Mapbox) is future work. |
| **8** | **Live Traffic Data** | **Not Implemented** | **FUTURE PRODUCTION WORK** | Travel times are calculated using distance and constant bus speed ($20\text{ mph}$) plus boarding dwell times ($2.0\text{m}$ standard, $3.5\text{m}$ wheelchair). Real-time traffic congestion sensor feeds are future work. |
| **9** | **Production Authentication** | **Simulated Switcher** | **SIMULATED FOR MVP** | A client-side role selection switcher (Dispatcher, Admin, Driver, Parent, Observer) is implemented for UI testing. Production identity management (OAuth 2.0 / OIDC, JWTs, TLS, and server-enforced RBAC) is future work. |
| **10** | **Production Database** | **In-Memory + LocalStorage** | **SIMULATED FOR MVP** | Baseline fleet data is loaded from in-memory JavaScript fixtures (`src/data/mockData.js`). Dynamic changes reside in in-memory state and `localStorage`. Enterprise relational storage (PostgreSQL / TimescaleDB) is future work. |

---

## 2. Reviewer Requirement 1: Formal Replanning Algorithm

### 1.1 Greedy Insertion Heuristic
- **Requirement:** A formal Greedy Insertion Heuristic must exist to evaluate potential stops along existing routes and insert disruptions at the point of minimal incremental detour and delay.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L340-L435)
- **Test(s):** [greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L110-L140), [insertionPositionConsistency.test.js](file:///d:/project/raale%20project1/tests/insertionPositionConsistency.test.js#L12-L60)
- **Evidence:** `routeInsertion.evaluateUrgentStudentInsertion()` evaluates candidate stop insertions strictly across remaining route positions. It computes incremental distance (`minAddedDistance`) and detour travel time (`additionalDelay`) across each uncompleted stop position, returning `bestPosition`, `newStops`, and route progress.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Detour distance is calculated using planar geometry scaled by regional coordinate factors (~69 mi/deg lat, ~55 mi/deg lon) and urban circuity multiplier rather than real-time turn-by-turn road network graph routing APIs (FUTURE PRODUCTION WORK).

---

### 1.2 Hard Constraints Enforcement
- **Requirement:** Strict binary enforcement of non-negotiable operational constraints: vehicle operational status, capacity ($currentLoad + required \le capacity$), driver shift/availability, driver commitment conflicts, route destination compatibility, and ADA wheelchair lift requirements.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L115-L338)
- **Test(s):** [greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L145-L198), [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L60-L85)
- **Evidence:** `constraintValidator.validateAllConstraints()` executes 6 deterministic boolean checks. If any constraint fails, the vehicle is rejected immediately with explicit human-readable reasons (e.g., "Insufficient capacity", "Lacks ADA Wheelchair Lift") and excluded from the feasible set.
- **Status:** IMPLEMENTED NOW (100% test pass; 0 constraint violations across all scenarios)
- **Known limitation:** Labor union agreements (e.g., mandatory rest breaks every 2 hours) rely on dispatcher review rather than automated break scheduling rules.

---

### 1.3 Candidate Positions Evaluation
- **Requirement:** Candidate positions along the route must be systematically evaluated, ensuring completed stops are locked and insertions only occur at or after current route progress.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L385-L420)
- **Test(s):** [insertionPositionConsistency.test.js](file:///d:/project/raale%20project1/tests/insertionPositionConsistency.test.js#L12-L95), [routeProgressAndDriverLocation.test.js](file:///d:/project/raale%20project1/tests/routeProgressAndDriverLocation.test.js#L1-L35)
- **Evidence:** `routeInsertion.evaluateUrgentStudentInsertion()` determines `startIndex` strictly based on `completedStops.length`. The loop iterating candidate insertion indices `k` ranges from `startIndex` to `stops.length`, guaranteeing no insertion can overwrite or precede an already completed or passed stop.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Real-world traffic congestion is estimated via constant average operating speed (20 mph) rather than live road speed sensors (FUTURE PRODUCTION WORK).

---

### 1.4 Candidates Scoring and Ranking
- **Requirement:** Feasible candidates must be scored using an objective multi-criteria cost function combining added distance, added delay, passenger load impact, route disruption, driver distance, and GPS telematics uncertainty.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L485-L585)
- **Test(s):** [greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L115-L135), [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L1-L260)
- **Evidence:** `candidateScorer.calculateScore()` computes composite cost: $w_{\text{dist}} \cdot \Delta\text{dist} + w_{\text{delay}} \cdot \Delta\text{delay} + w_{\text{load}} \cdot \text{LoadRatio} + w_{\text{disrupt}} \cdot \text{Disruption} + 0.2 \cdot d_{\text{driver}} + \text{GPS uncertainty adjustment}$. GPS degradation adds monotonic uncertainty penalties. Feasible candidates are sorted in ascending cost order.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Cost function minimizes operational delay and disruption; it does not calculate an egalitarian fairness index (such as Gini or Jain's fairness index).

---

### 1.5 Best Feasible Candidate Selection
- **Requirement:** The system must select the candidate with the lowest feasible score for recommendation to the dispatcher, and apply the exact selected insertion position upon approval.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1095-L1155), [store.js](file:///d:/project/raale%20project1/src/state/store.js#L140-L175)
- **Test(s):** [greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L110-L140), [insertionPositionConsistency.test.js](file:///d:/project/raale%20project1/tests/insertionPositionConsistency.test.js#L100-L140)
- **Evidence:** `replanningEngine.replan()` sorts `feasibleCandidates` by score ascending and assigns `best = feasibleCandidates[0]`. The exact `insertionPosition` from the best candidate is stored on the plan and strictly preserved when `acceptAIPlan` applies the modification to `route.stops`.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Selection is deterministic; tied scores are broken by fleet array index order.

---

### 1.6 Manual Escalation when Infeasible
- **Requirement:** When no feasible candidate satisfies all hard constraints, the system must NOT force an infeasible plan or assign an invalid bus. It must trigger manual escalation to the human dispatcher with full rejection audit details.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1101-L1125)
- **Test(s):** [replanningEdgeCases.test.js](file:///d:/project/raale%20project1/tests/replanningEdgeCases.test.js#L20-L40), [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L156)
- **Evidence:** When `feasibleCandidates.length === 0`, `replan()` returns `selectedBus: null`, `noFeasibleSolution: true`, `escalateToManual: true`, `requiresDispatcherConfirmation: true`, and includes an audit breakdown of why each candidate vehicle failed. In benchmark evaluation, 100% of infeasible scenarios (1/1) were correctly escalated.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Manual escalation requires dispatcher intervention over phone/radio to coordinate external mutual aid or charter buses.

---

## 3. Reviewer Requirement 2: Offline / Store-and-Forward

### 2.1 Actions Preserved During Network Failure
- **Requirement:** When network connectivity is unavailable, dispatcher actions must be intercepted and safely preserved locally rather than lost or throwing unhandled errors.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L305-L385)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L20-L50)
- **Evidence:** When `networkStatus === 'offline'`, `dispatchAction()` routes operations to `queueAction()`, adding the action to `pendingOfflineChanges` with `status: 'PENDING'`. Audit logs record `FALLBACK_TRIGGERED` (`OFFLINE_STORE_AND_FORWARD`).
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Offline storage capacity is bounded by browser `localStorage` quotas (~5MB). Distributed enterprise message brokers (Kafka/RabbitMQ) are FUTURE PRODUCTION WORK.

---

### 2.2 Queue Survives Reload / LocalStorage Persistence
- **Requirement:** Pending queued actions must survive page refreshes, tab closures, and browser restarts via durable local persistence.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L151-L171)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L60-L95), [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L380-L420)
- **Evidence:** Every modification to `state.pendingOfflineChanges` invokes `savePendingOfflineChanges()`, serializing to `localStorage` key `school_bus_pending_sync`. On store instantiation, `loadPendingOfflineChanges()` parses and restores all queued actions.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Clearing browser local storage or using Incognito mode without persistence wipes the local pending queue.

---

### 2.3 Multiple Pending Actions Concurrent Queuing
- **Requirement:** The system must support accumulating multiple pending actions concurrently in FIFO order.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L250-L312)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L100-L135)
- **Evidence:** Multiple distinct actions (e.g., student cancellations, route adjustments, manual overrides) are appended sequentially to `pendingOfflineChanges`. Tests verify that multiple actions coexist, each retaining their unique `actionId`, timestamps, and payloads.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Actions are executed in FIFO sequence; dependency resolution between conflicting actions on the same vehicle is not automatically resolved offline.

---

### 2.4 Event-Driven Synchronization After Network Recovery
- **Requirement:** Network restoration must trigger background synchronization of queued actions in FIFO order, updating action status to `SYNCED`.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L100-L107), [store.js](file:///d:/project/raale%20project1/src/state/store.js#L400-L460)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L173-L225)
- **Evidence:** Calling `setNetworkStatus('online')` (or receiving window `'online'` event) automatically invokes `syncPendingOfflineChanges()`. Items transition through `SYNCING` to `SYNCED`, are recorded in `syncedActionIds`, and safely purged from the pending queue.
- **Status:** SIMULATED FOR MVP (100% test pass)
- **Known limitation:** Synchronization is a client-side simulation in `store.js` updating local in-memory state; connection to a central REST API (`POST /api/v1/dispatch/sync-batch`) is FUTURE PRODUCTION WORK.

---

### 2.5 Sync Failure Handling & State Representation
- **Requirement:** If synchronization fails during an attempt, actions must NOT be lost, must NOT be falsely reported as synced, and must transition to `FAILED` with retry tracking and error details.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L430-L458)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L230-L270)
- **Evidence:** In `syncPendingOfflineChanges({ simulateFailure: true })` or when offline, actions transition to `status: 'FAILED'`, increment `retryCount`, update `lastAttempt`, record `error: 'Network connection unavailable / Cloud sync timeout'`, and remain safely stored in `pendingOfflineChanges`.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Error classifications are diagnostic client strings rather than HTTP status response codes.

---

### 2.6 Retry Mechanism
- **Requirement:** Failed actions must support manual dispatcher retry (individual or batch) and automatic retry upon network reconnection.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L465-L510)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L275-L315)
- **Evidence:** `retryAction(actionId)` and `retryFailedActions()` reset failed actions from `status: 'FAILED'` to `'PENDING'` and re-trigger `syncPendingOfflineChanges()`. Successful retry achieves `status: 'SYNCED'` and cleans up the queue.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Retries are event-driven and dispatcher-initiated; automatic timer-based exponential backoff intervals are FUTURE PRODUCTION WORK.

---

### 2.7 Duplicate Action Prevention & Idempotency
- **Requirement:** Idempotency key (`actionId`) must prevent duplicate execution across same-session re-submissions, page reloads, browser restarts, sync retries, and network recovery.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L173-L225), [store.js](file:///d:/project/raale%20project1/src/state/store.js#L252-L269), [store.js](file:///d:/project/raale%20project1/src/state/store.js#L324-L342)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L330-L510)
- **Evidence:** Store maintains `syncedActionIds` backed by `localStorage` (`school_bus_synced_actions`, capped at 1,000 keys). `dispatchAction()` and `queueAction()` check both `pendingOfflineChanges` and `isActionSynced(actionId)`. Re-submitting an identical `actionId` suppresses duplicate dispatch (`status: 'ALREADY_SYNCED'`). All 5 test suites pass with 100% assertions.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** The local idempotency key set is capped at 1,000 entries in `localStorage` using FIFO eviction to prevent storage bloat.

---

### 2.8 Pending Queue Count Visibility
- **Requirement:** The count of pending unsynchronized actions must be visible and accessible in the system interface and state store.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L396-L398), [Navbar.js](file:///d:/project/raale%20project1/src/components/layout/Navbar.js#L85-L105)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L115-L135)
- **Evidence:** `store.getPendingQueueCount()` returns `state.pendingOfflineChanges.length`. The navigation header displays the offline badge and pending queue counter badge dynamically.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Badge count reflects client-local pending changes; cross-device pending counts require centralized backend aggregation (FUTURE PRODUCTION WORK).

---

### 2.9 No False "Synced" State Under Degraded Conditions
- **Requirement:** The system must never falsely report actions as synchronized when the network is unavailable or synchronization has not succeeded.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L412-L436)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L235-L260)
- **Evidence:** `syncPendingOfflineChanges()` checks `this.state.networkStatus === 'offline'`. Under offline conditions or failure, actions remain in the queue with `status: 'FAILED'`; `syncedCount` remains 0, and no false "SYNCHRONIZED" audit entries are emitted.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Network status is monitored via browser `navigator.onLine` and manual developer toggle; captive portal detection is FUTURE PRODUCTION WORK.

---

## 4. Reviewer Requirement 3: GPS Fallback

### 3.1 Five Telemetry States Supported
- **Requirement:** The system must support 5 explicit GPS telemetry states: `LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, and `MANUAL`.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L205-L245), [DATA_SCHEMA.md](file:///d:/project/raale%20project1/DATA_SCHEMA.md#L81-L94)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L145-L180), [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L1-L180)
- **Evidence:** Store and scoring engine normalize and process each of the 5 states, applying corresponding confidence multipliers and uncertainty penalties. Monotonic penalty ordering is verified: $\text{LIVE} (0.0) < \text{MANUAL} (0.50) < \text{LAST\_KNOWN} (1.50) < \text{STALE} (4.00) < \text{NO\_SIGNAL} (8.00)$.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Telemetry state transitions are simulated via elapsed time thresholds and test harness toggles rather than live OBD-II vehicle telematics streams (SIMULATED FOR MVP; hardware integration is FUTURE PRODUCTION WORK).

---

### 3.2 5-Field GPS Telemetry Data Schema
- **Requirement:** Vehicle GPS data must strictly contain `latitude`, `longitude`, `source`, `lastUpdated`, and `ageSeconds`.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L205-L245), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1012-L1030)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L160-L175)
- **Evidence:** Every vehicle record and recommendation dataQuality object populates: `latitude` (numeric), `longitude` (numeric), `source` (string), `lastUpdated` (ISO string), and `ageSeconds` (integer).
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Altitude, bearing/heading, and HDOP (Horizontal Dilution of Precision) values are not captured in the 5-field MVP schema.

---

### 3.3 Stale GPS Is Never Displayed As Live
- **Requirement:** Telemetry data that is stale, cached, or last-known must never be labeled or rendered as LIVE.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L980-L984), [BusesView.js](file:///d:/project/raale%20project1/src/components/views/BusesView.js#L140-L160)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L165-L180), [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L95-L115)
- **Evidence:** `replanningEngine` checks raw status and age. If age $> 60\text{s}$ or status is `LAST_KNOWN`/`STALE`, `gpsStatus` is overridden from `LIVE` to `LAST_KNOWN` or `STALE`. UI components render distinct amber (Last Known) and orange (Stale Fix with `(Not Live)`) badges.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Relies on local client clock consistency with coordinate generation timestamps.

---

### 3.4 Stale GPS Produces Warning Banner
- **Requirement:** Telemetry with age $> 120\text{s}$ must trigger an explicit warning banner indicating that distance-based calculations may be less reliable.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L992-L1000), [ReplanningView.js](file:///d:/project/raale%20project1/src/components/views/ReplanningView.js#L190-L220)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L110-L125), [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L145-L175)
- **Evidence:** When `isGpsStale === true` or age $> 120\text{s}$, the engine outputs `warning: "GPS data is X minutes old. Distance-based ranking may be less reliable."` and displays a high-visibility amber warning box in the UI.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Warning triggers on elapsed time; dead reckoning vehicle position interpolation is FUTURE PRODUCTION WORK.

---

### 3.5 Stale / Uncertain GPS Affects Distance-Based Decision Confidence
- **Requirement:** Stale or degraded GPS must reduce distance-based confidence in candidate scoring without overriding hard constraints.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L506-L557)
- **Test(s):** [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L180-L260)
- **Evidence:** `candidateScorer` applies a distance expansion penalty ($+60\%$ for STALE, $+25\%$ for LAST_KNOWN) plus flat uncertainty penalty ($+4.00$ for STALE, $+1.50$ for LAST_KNOWN). Unit tests verify that a vehicle with LIVE GPS ranks above an otherwise identical vehicle with STALE GPS, while hard constraints (capacity, ADA) remain absolute.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Uncertainty multipliers are calibrated heuristic policy weights rather than dynamic Bayesian Kalman filter covariances.

---

### 3.6 Important Stale-GPS Decisions Require Dispatcher Verification
- **Requirement:** Replanning recommendations that rely on stale GPS coordinates must be flagged with a requirement for dispatcher verification prior to approval.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1025-L1029)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L100-L115), [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L150-L175)
- **Evidence:** When `gpsStatus !== 'LIVE'`, the engine sets `requiresDispatcherVerification: true` and `requiresDispatcherConfirmation: true`. The dispatcher must inspect the warning and confirm coordinates before plan execution.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Verification is recorded in the local audit event; external verbal radio confirmations are logged via manual notes.

---

### 3.7 Manual Location Coordinate Entry Supported
- **Requirement:** The system must allow dispatchers to manually update vehicle coordinates (e.g. from VHF two-way radio reports or checkpoint landmarks).
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L230-L260)
- **Test(s):** [storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L185-L210), [gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L110-L140)
- **Evidence:** `updateBusLocationManual(busId, coords, landmark)` updates coordinates, sets `source: 'manual_dispatcher'`, `sourceUpper: 'MANUAL'`, resets `ageSeconds: 0`, and logs a `MANUAL_OVERRIDE` audit event. The scoring engine evaluates MANUAL GPS with checkpoint confidence ($0.85$ multiplier, $+0.50$ uncertainty penalty).
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Coordinates entered manually depend on driver radio accuracy and dispatcher input precision.

---

## 5. Reviewer Requirement 4: Benchmark & Evaluation

### 4.1 Simulated Manual Baseline Workflow Definition
- **Requirement:** A simulated manual baseline workflow must be clearly defined and structured across distinct operational dispatch triage stages, without claiming real human measurements.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L72-L115)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L20-L45)
- **Evidence:** `simulateManualBaseline()` defines a 7-stage phone-tree triage model: Identify disruption (45s), Check vehicles (15s/cand), Check capacity (25s/cand), Check driver (35s/cand), Rebuild route (45s/cand), Verify constraints (30s), Dispatcher confirmation (60s feasible / 120s escalated). Explicitly tagged with `isSimulated: true` and `label: "Simulated Manual Baseline"`.
- **Status:** SIMULATED FOR MVP (100% test pass)
- **Known limitation:** Modeled as sequential task steps; real dispatchers may perform partial parallelization or rely on institutional memory. Empirical human dispatcher stopwatch timing is FUTURE PRODUCTION WORK.

---

### 4.2 Engine Computation Time Measured Separately (Sub-second)
- **Requirement:** Algorithmic computation time of the replanning engine must be measured separately from human review time, in milliseconds.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L143-L175)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L135-L142)
- **Evidence:** Engine execution is timed via `performance.now()`. Benchmark across 9 operational scenarios yields: Average: **2.06 ms**, Median: **1.84 ms**, Max: **5.13 ms** (all sub-second, $< 1000\text{ms}$).
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Measured on modern V8 JavaScript execution environment; low-power mobile dispatcher tablets may exhibit slight variance (typically $< 10\text{ms}$).

---

### 4.3 Dispatcher Review Time Represented
- **Requirement:** Human dispatcher review and decision-making time must be modeled and represented in the end-to-end recovery metrics.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L177-L188)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L40-L55)
- **Evidence:** Each standardized scenario assigns a realistic inspection window: 15s (Student Cancellation), 25s (Urgent Student Addition), 35s (Vehicle Breakdown), up to 180s (Complex Multi-Route Infeasible Escalation).
- **Status:** SIMULATED FOR MVP (100% test pass)
- **Known limitation:** Review time intervals are simulated task model estimates rather than empirical eye-tracking or click-stream telemetry.

---

### 4.4 End-to-End Recovery Time Measured ($\le 480$ seconds SLA)
- **Requirement:** Total end-to-end recovery time ($T_{\text{engine}} + T_{\text{review}}$) must be measured against the district SLA target of 480 seconds (8 minutes).
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L220-L224)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L130-L135), [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L148-L152)
- **Evidence:** In benchmark evaluation across 9 operational scenarios: Average E2E Recovery: **43.89 seconds**, Range: **15.00s – 180.00s**. **9 / 9 scenarios (100.0%) strictly meet the $\le 480$s SLA target**.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Assumes an attentive dispatcher seated at the console during active morning triage.

---

### 4.5 Statistical Metrics Available (Average, Median, Maximum, Minimum)
- **Requirement:** Statistical summary distributions (Average, Median, Maximum, Minimum) must be calculated and accessible for baseline time, engine computation time, and E2E recovery time.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L54-L69), [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L279-L296)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L140-L148)
- **Evidence:** `runEvaluation()` computes and outputs:
  - Simulated Manual Baseline: Avg: **741.7s**, Median: **495.0s**, Min: **495.0s**, Max: **1635.0s**.
  - Engine Computation Time: Avg: **2.06 ms**, Median: **1.84 ms**, Min: **0.65 ms**, Max: **5.13 ms**.
  - E2E Recovery Time: Avg: **43.89s**, Median: **25.01s**, Min: **15.00s**, Max: **180.00s**.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Sample distribution is based on the 9 standardized operational benchmark fixtures.

---

### 4.6 Automated Feasible Plan Rate Available
- **Requirement:** The evaluation suite must measure the proportion of disruptions where the engine successfully generates a feasible plan satisfying all constraints.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L299)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L155)
- **Evidence:** Benchmark evaluation achieves **88.9% (8/9 scenarios)**. 8 operational disruptions generated feasible plans; 1 scenario (TEST-09: No Feasible Solution by design) correctly generated zero feasible candidates.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** In extreme district-wide disruptions (e.g., severe snowstorms or depot lockouts), the feasible plan rate will naturally drop as fleet constraints saturate.

---

### 4.7 Correct Manual Escalation Rate Available
- **Requirement:** The evaluation suite must measure whether 100% of impossible/infeasible disruptions are correctly escalated to human dispatchers without assigning invalid routes.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L300-L302)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L156)
- **Evidence:** Achieved **100.0% (1/1 infeasible scenarios correctly escalated)**. In TEST-09, `escalateToManual: true` was triggered with complete candidate rejection rationales and zero automated assignments.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Escalation requires manual phone/radio triage procedures outside the automated software system.

---

### 4.8 Constraint Violations Measured (Zero Violations Target)
- **Requirement:** The evaluation suite must explicitly measure and verify zero tolerance for hard constraint violations across all scenarios.
- **Implementation file(s):** [evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L226-L234)
- **Test(s):** [evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L158-L161)
- **Evidence:** Across all 9 operational scenarios, `totalConstraintViolations === 0`. Invariants checked: capacity violations, unavailable bus assignment, unavailable driver assignment, driver commitment collisions.
- **Status:** IMPLEMENTED NOW (100% test pass; 0 violations)
- **Known limitation:** Constraint validation depends on the accuracy of vehicle status and driver assignment metadata in the local store.

---

## 6. Reviewer Requirement 5: Human-in-the-Loop & Governance

### 5.1 No Silent State Mutation (Zero Unsafe Auto-Application)
- **Requirement:** AI replanning recommendations must remain in an `unresolved` state; no bus loads, stop lists, or student statuses may be altered prior to explicit dispatcher approval.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L270-L310), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L40-L55)
- **Test(s):** [cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L20-L30), [cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L210-L240)
- **Evidence:** Upon disruption generation, `disruption.status` is set to `'unresolved'`, and `proposedState` is isolated. Live vehicle loads, routes, and student assignments remain completely unmodified until an explicit dispatcher action is executed.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** If a dispatcher leaves the console unattended, pending disruptions remain in `unresolved` review state indefinitely.

---

### 5.2 Dispatcher Can Accept Plan
- **Requirement:** Dispatchers must have an explicit "Accept" action that applies the recommendation, mutates operational state, updates vehicle capacity, and writes an audit event.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L515-L560)
- **Test(s):** [modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L75-L95), [cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L30-L50)
- **Evidence:** `store.acceptAIPlan(disruptionId)` transitions status to `'accepted'`, mutates `route.stops` at the exact greedy insertion index, updates `bus.currentLoad`, sets student status, and records a `RECOMMENDATION_ACCEPTED` audit log event.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Acceptance is a final operational commitment; reverting an accepted plan requires initiating a new replanning disruption.

---

### 5.3 Dispatcher Can Modify Plan (Constraint Customizer)
- **Requirement:** Dispatchers must be able to adjust parameters (max delay, preferred bus, driver preference, wheelchair requirement) and recalculate candidates without auto-committing.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L565-L615), [CustomizerModal.js](file:///d:/project/raale%20project1/src/components/modals/CustomizerModal.js#L30-L150)
- **Test(s):** [modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L20-L74)
- **Evidence:** `modifyDisruptionConstraints()` accepts custom thresholds, invokes `candidateGenerator.generateCandidates()` with custom parameters, and provides a Before vs After comparison. Live operational assignments remain completely untouched during modification review.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Parameter customization applies to the active disruption; persistent global rule defaults must be updated in Settings.

---

### 5.4 Dispatcher Can Reject Plan
- **Requirement:** Dispatchers must have an explicit "Reject" action that discards the recommendation, preserves the original operational state, and records the rejection justification.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L620-L650)
- **Test(s):** [modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L100-L120), [cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L55-L75)
- **Evidence:** `store.rejectDisruption(disruptionId, reason)` sets `status: 'rejected'`, records `rejectionReason`, clears review badges, preserves original student/bus/route state with zero modifications, and logs a `RECOMMENDATION_REJECTED` audit event.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Rejection preserves original state; the dispatcher must follow up manually if the underlying operational issue persists.

---

### 5.5 Comprehensive Lifecycle Audit Trail Persisted
- **Requirement:** All 6 required lifecycle events (`RECOMMENDATION_GENERATED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_MODIFIED`, `RECOMMENDATION_REJECTED`, `MANUAL_OVERRIDE`, `FALLBACK_TRIGGERED`) must be captured with complete state snapshots for auditability.
- **Implementation file(s):** [store.js](file:///d:/project/raale%20project1/src/state/store.js#L695-L740), [DATA_SCHEMA.md](file:///d:/project/raale%20project1/DATA_SCHEMA.md)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L120-L175)
- **Evidence:** Audit events persist: `disruptionId`, `actionType`, `originalState`, `proposedState`, `finalState`, `userRole`, `timestamp`, and `recommendationId`. Tests verify all 6 required lifecycle action types are recorded in sequence with zero missing schema properties.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Audit logs reside in application state (`store.state.auditLog`) and `localStorage`; long-term archival to an enterprise SQL database is FUTURE PRODUCTION WORK.

---

## 7. Reviewer Requirement 6: Transparency & Explanation

### 6.1 Selected Bus Explanation & Insertion Position
- **Requirement:** Recommendations must display the selected bus ID, exact insertion index, and positive selection rationales.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L950-L975), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1065-L1078)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L15-L35)
- **Evidence:** `buildExplanationAndUncertainty()` populates `selectedBus`, `insertionPosition`, and `whySelected` array (e.g., "Available capacity: X seats", "ADA Wheelchair Lift verified", "Lowest additional delay: Y min").
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Explanation text is template-generated English; multi-lingual localization is not configured.

---

### 6.2 Score & Cost Breakdown
- **Requirement:** Recommendation must display numeric cost score and itemized metric impacts (additional distance in km, additional delay in minutes).
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1031-L1039), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1048-L1050)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L25-L35)
- **Evidence:** Output contains `score` (e.g. `14.50`), `additionalDistance` (in km and miles), `additionalDelay` (in minutes), and `expectedImpact` detailing passenger dwell and detour delay.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Detour delay is estimated via distance and constant speed rather than dynamic traffic flow simulations.

---

### 6.3 Operational Constraints Checked
- **Requirement:** Recommendations must list all operational constraints verified during evaluation.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L920-L935)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L40-L55)
- **Evidence:** Explanations populate `constraintsChecked` with 6 explicit verification strings: Vehicle Operational Status, Seating Capacity, Driver Availability & Shifts, Driver Active Route Commitments, ADA Wheelchair Accessibility, and Route Destination Compatibility.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Binary constraint pass/fail; soft tolerance buffers are not supported.

---

### 6.4 GPS Data Freshness & Telematics Provenance
- **Requirement:** Recommendations must display the exact GPS status, source, and elapsed age in seconds/minutes.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1012-L1030)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L75-L100)
- **Evidence:** Output populates `dataQuality.gpsStatus`, `dataQuality.lastUpdate`, `dataQuality.ageSeconds`, `dataQuality.source`, and `dataQuality.trustLevel`. Stale data is never represented as live.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Telemetry latency represents device-to-client elapsed time; carrier network transit jitter is not separately measured.

---

### 6.5 Rejected Candidate Reasons
- **Requirement:** For every non-selected candidate vehicle, the system must provide an explicit, human-readable reason why it was rejected.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L938-L945), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1054-L1058)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L35-L55)
- **Evidence:** `rejectedCandidates` records each bus ID and failed constraint reason (e.g. `BUS-02: Insufficient capacity`, `BUS-03: Driver unavailable`, `BUS-04: Lacks ADA Wheelchair Lift`). Formatted text adheres strictly to reviewer format.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Only constraints that failed first or all failed hard constraints are displayed per candidate.

---

### 6.6 Data-Quality Warnings & Telematics Uncertainty
- **Requirement:** When telematics data is stale or degraded, high-visibility warnings must alert dispatchers without inventing synthetic percentage confidence metrics.
- **Implementation file(s):** [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L992-L1000), [replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1060-L1063)
- **Test(s):** [explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L105-L125)
- **Evidence:** Formatted explanation renders `WARNING: "GPS data is X minutes old. Distance-based ranking may be less reliable."` when telematics age $> 120\text{s}$. Prohibits synthetic percentage confidence metrics, replacing them with deterministic constraint satisfaction checklists.
- **Status:** IMPLEMENTED NOW (100% test pass)
- **Known limitation:** Warning thresholds (60s last-known, 120s stale) are configured district constants.

---

## 8. Reviewer Requirement 7: Documentation Accuracy & Realism

### 7.1 No Unsupported Exponential Backoff Claim
- **Requirement:** Documentation must NOT claim automated exponential backoff unless actually implemented; it must accurately describe event-driven and manual retries.
- **Implementation file(s):** [USER_GUIDE.md](file:///d:/project/raale%20project1/USER_GUIDE.md#L145), [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md#L303)
- **Test(s):** Documentation review & grep search (0 occurrences of false exponential backoff claim)
- **Evidence:** Both `USER_GUIDE.md` and `ARCHITECTURE_DIAGRAM.md` explicitly state: "The system utilizes event-driven retries (automatic upon network reconnection or manual dispatcher batch/individual trigger) rather than automated timer-based exponential backoff intervals."
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Enterprise timer-based jittered backoff remains FUTURE PRODUCTION WORK.

---

### 7.2 No Unsupported Fairness / Delay Distribution Claim
- **Requirement:** UI and documentation must NOT claim mathematical fairness, fair route distribution, or equitable delay optimization when the engine does not compute a fairness metric.
- **Implementation file(s):** [ReplanningView.js](file:///d:/project/raale%20project1/src/components/views/ReplanningView.js#L28), [SettingsView.js](file:///d:/project/raale%20project1/src/components/views/SettingsView.js#L51-L55), [RoleSelectionView.js](file:///d:/project/raale%20project1/src/components/auth/RoleSelectionView.js#L72)
- **Test(s):** Full codebase grep search (0 occurrences of unsupported fairness/equity claims)
- **Evidence:** All unsupported fairness phrases were replaced with accurate terminology: "Transparent constraint-based route selection", "Deterministic constraints", and "Route Disruption Weight Factor" (minimizing passenger disruption).
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** System minimizes composite cost; multi-agent equity balancing across routes is outside the MVP scope.

---

### 7.3 No False Claim of Live Cloud Backend Server
- **Requirement:** Documentation must NOT present the MVP as communicating with a live remote cloud backend or central REST `/api/dispatch` server.
- **Implementation file(s):** [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md#L8-L15), [README.md](file:///d:/project/raale%20project1/README.md#L15-L30)
- **Test(s):** Documentation review & architecture audit
- **Evidence:** Architecture documentation explicitly clarifies: "No External Server / Cloud Backend: The current MVP does not connect to a live remote cloud backend or central REST dispatch server... Local offline queuing and recovery use browser localStorage and client simulation."
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Client-side architecture; multi-user concurrent dispatching requires an enterprise cloud backend (FUTURE PRODUCTION WORK).

---

### 7.4 Simulated / Local MVP Limitations Clearly Stated
- **Requirement:** All technical, operational, and simulation limitations must be clearly declared across documentation artifacts.
- **Implementation file(s):** [REQUIREMENTS_TRACEABILITY.md](file:///d:/project/raale%20project1/REQUIREMENTS_TRACEABILITY.md#L10-L40), [STAKEHOLDER_ASSUMPTIONS.md](file:///d:/project/raale%20project1/STAKEHOLDER_ASSUMPTIONS.md), [RISK_REGISTER.md](file:///d:/project/raale%20project1/RISK_REGISTER.md)
- **Test(s):** Documentation audit
- **Evidence:** Explicit disclaimer callouts document: (1) Simulated manual baseline & task model timings, (2) Local storage fallback simulation, (3) Planar distance estimation, (4) Infeasible scenario escalation policy, and (5) Event-driven retry behavior.
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Field pilot deployment with real dispatchers is required to gather empirical human telemetry.

---

### 7.5 USER_GUIDE.md Accurate & Aligned
- **Requirement:** `USER_GUIDE.md` must accurately reflect the implemented workflows, fallbacks, 9-attribute action schema, 5-state GPS hierarchy, and HITL controls.
- **Implementation file(s):** [USER_GUIDE.md](file:///d:/project/raale%20project1/USER_GUIDE.md#L1-L226)
- **Test(s):** Test suite alignment & documentation audit
- **Evidence:** `USER_GUIDE.md` details the exact implemented workflows: Disruption Triage (Student Cancellation, Urgent Addition, Breakdown), Exact Greedy Insertion, Constraint Customizer, 9-attribute action queue, 5-state GPS degradation hierarchy, and Manual Location Entry.
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Guide reflects MVP v1.0 interface and interactions.

---

### 7.6 Architecture Documentation Matches Actual Implementation
- **Requirement:** System architecture documentation must accurately reflect the client-side store, reactive UI, deterministic replanning engine, and store-and-forward persistence.
- **Implementation file(s):** [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md#L1-L405), [DATA_SCHEMA.md](file:///d:/project/raale%20project1/DATA_SCHEMA.md#L1-L220)
- **Test(s):** Architecture audit
- **Evidence:** `ARCHITECTURE_DIAGRAM.md` contains accurate sequence diagrams for Store-and-Forward and GPS Telematics State Machine, clearly separating implemented client MVP components from future production enterprise services.
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Diagrams illustrate both current local MVP architecture and future target microservice topologies.

---

### 7.7 Stakeholder Validation Plan & Pre-Trial Status
- **Requirement:** A formal, reproducible stakeholder validation protocol must exist to guide future evaluation with active district dispatchers, operations managers, and transport coordinators, clearly stating that no real stakeholder validation has been conducted yet.
- **Implementation file(s):** [STAKEHOLDER_VALIDATION_PLAN.md](file:///d:/project/raale%20project1/STAKEHOLDER_VALIDATION_PLAN.md), [VALIDATION_REPORT.md](file:///d:/project/raale%20project1/VALIDATION_REPORT.md)
- **Test(s):** Documentation review & protocol verification
- **Evidence:** `STAKEHOLDER_VALIDATION_PLAN.md` establishes a 9-part validation protocol (purpose, target users, 3 test scenarios, 8 stakeholder tasks, quantitative timing & qualitative metrics, interview questions, acceptance criteria, blank scorecard template, and simulated vs real differences). Prominently declares: "No real stakeholder validation has been conducted yet."
- **Status:** IMPLEMENTED NOW (100% accurate)
- **Known limitation:** Real human testing with active professional district dispatchers has not yet occurred and remains an open operational prerequisite before production deployment.
