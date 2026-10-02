# User Guide: Rapid Replanning Dashboard

Welcome to the School Bus Rapid Replanning System. This guide provides dispatchers with instructions on managing disruptions and utilizing the AI replanning engine.

## 1. System Overview

The system provides real-time tracking of the district's fleet and rapid replanning capabilities for emergency disruptions. The AI engine evaluates deterministic constraints (capacity, driver availability, route compatibility, ADA wheelchair lifts) and recommends feasible solutions. 

**Important:** The system is an *assistant*. All recommendations require human review and approval.

> [!IMPORTANT]
> ### Dispatcher & Reviewer Operational Notice (Current MVP Scope)
> The current system is a **client-side Single Page Application (SPA)** executing locally within the browser runtime.
> - **In-Memory & LocalStorage:** All vehicle positions, routes, student manifests, and disruption records are managed in local browser memory and persistent `localStorage`.
> - **No Remote Backend:** Operational actions, approvals, and replanning computations execute locally on your workstation without transmitting data to a live remote cloud server or external REST API.
> - **Simulated Fallbacks & Telematics:** Store-and-forward synchronization and GPS degradation states (`LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`) are managed by internal client simulations designed to test and prove resilience under adverse operational conditions.
- **Pre-Trial Status:** **No real stakeholder validation has been conducted yet.** This guide is prepared for participants engaging in the validation procedures specified in [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md).

---

### Architectural Implementation Reality Summary (MVP vs. Future Production)
- **IMPLEMENTED NOW:** In-memory reactive state (`store.js`), Greedy Insertion Heuristic (`replanningEngine.js`), Leaflet map visualization with planar circuity calculations, `localStorage` offline action queue (`school_bus_pending_sync`), `localStorage` idempotency deduplication (`school_bus_synced_actions`), 5-state GPS telemetry handling, and full audit logging.
- **SIMULATED FOR MVP:** Central-server sync simulation (`syncPendingOfflineChanges`), GPS signal degradation/timeout modeling, 7-stage manual dispatch baseline, and client-side role selection switcher.
- **FUTURE PRODUCTION WORK:** Live remote cloud backend server, production REST API (`POST /api/v1/dispatch/*`), distributed message broker (Kafka/RabbitMQ/MQTT), live cellular OBD-II vehicle telematics, turn-by-turn road graph routing, live traffic congestion feeds, enterprise SSO/OAuth2 authentication, and relational database storage (PostgreSQL/TimescaleDB).

---

## 2. Handling Disruptions

### Student Cancellations (Human-in-the-Loop Workflow)
1. **Operational Event Received:** When a student absence or cancellation request is ingested, the system captures an `originalState` snapshot (student assignment, bus load, route stops).
2. **AI Recommendation & Proposed State Generated:** The engine calculates a `proposedState` (projected dwell time savings, seat freed, stop bypass) without prematurely mutating the live operational route, bus capacity, or student record.
3. **Dispatcher Review:** The disruption is listed as `unresolved` with a review badge (`cancellationPending`). The dispatcher inspects dwell savings, seat release, and route impact.
4. **Dispatcher Decision (Accept / Modify / Reject):**
   - **Accept:** Approves the plan; the system applies the proposed state (student marked `absent_cancelled`, bus load decremented, dwell time saved) and creates an audit record.
   - **Reject:** Preserves the original operational state (student remains on bus/route, capacity unchanged) and logs the rejection reason.
   - **Modify:** Opens the Constraint Customizer to adjust parameters (e.g., retain stop dwell for other students) before applying.
5. **Full Audit Traceability:** Every approved change logs all 8 required schema attributes (`disruptionId`, `actionType`, `originalState`, `proposedState`, `finalState`, `userRole`, `timestamp`, `recommendationId`).

### Urgent Student Additions
1. Open the **Disruptions Panel** and select **Add Urgent Student**.
2. Input the student details (pickup address, destination school, special needs/wheelchair requirements).
3. The AI engine evaluates all vehicles against remaining route stops, driver location, and hard constraints.
4. Review the **7-Dimension Explanation & Uncertainty Layer**:
   - **Why Selected:** Positive criteria (available seats, driver readiness, route compatibility, ADA lift, lowest marginal delay).
   - **Why Rejected:** Explicit failure reasons for non-selected vehicles (insufficient capacity, driver already assigned, vehicle unavailable).
   - **Constraints Checked & Data Used:** 6 operational constraints and telematics sources.
   - **Data Quality:** GPS telematics freshness (LIVE vs STALE) and dispatcher verification alerts.
   - **Expected Impact:** Additional distance (km) and delay (min).
   - **Dispatcher Overrides:** Clear list of dispatcher modification options.
5. Take action:
   - Click **Accept & Dispatch** to approve the plan.
   - Click **Modify Constraints** to customize parameters.
   - Click **Reject** to decline the recommendation.

### Exact Greedy Insertion Guarantee & Live Route Versioning
- **Exact Position Application:** The precise insertion index (`greedyInsertionPosition`) selected by the Greedy Heuristic is preserved in the recommendation and applied directly to `route.stops` upon dispatcher approval, rather than using a generic "last stop - 1" fallback.
- **Live Route Versioning & Safety:** When a plan is accepted, the system checks whether the route progressed while under dispatcher review (`routeVersionKey`).
  - If the route is unchanged, the student stop is inserted at the exact calculated greedy index.
  - If intermediate stops were completed during review, the engine detects the state change and automatically re-verifies the insertion against remaining uncompleted stops only.
- **Audit Trail Traceability:** Every acceptance records the exact `appliedInsertionPosition`, `appliedRouteVersionKey`, and whether a stale re-evaluation occurred in the audit trail.

### Dispatcher "Modify" Workflow & Constraint Customizer
1. Click **Modify** on any active AI recommendation.
2. The **Constraint Customizer** panel will open, allowing you to change:
   - **Maximum Allowed Delay:** Adjust the tolerance threshold (e.g. limit to <= 8 minutes).
   - **Minimum Required Available Seats:** Reserve extra capacity for anticipated demand.
   - **Preferred Vehicle:** Designate a specific vehicle for priority assignment.
   - **Driver Preference / Assignment:** Filter for Standby Reserve drivers vs Active en-route drivers.
   - **ADA Accessibility Requirement:** Require ADA wheelchair lift.
   - **Route Preference:** Limit modifications to a specific route.
3. Click **Recalculate Candidates**.
4. The system presents an updated candidate ranking and an explicit **Before vs After Comparison**:
   - **BEFORE:** Bus ID, Route ID, Passenger Capacity, Delay.
   - **AFTER:** Bus ID, Route ID, Passenger Capacity, Delay, Additional Distance.
5. Review the new ranking and select your preferred candidate.
6. Click **Apply Modified Plan** to finalize. The plan is **never** applied automatically without dispatcher approval.

### Vehicle Breakdowns
1. From the map or vehicle list, select a bus and mark it as **Unavailable** (or trigger a Breakdown event).
2. The system automatically identifies all affected students and uncompleted route stops.
3. The engine scans for available replacement buses with sufficient capacity, matching destination, and driver proximity.
4. Review the proposed replacement bus and the candidate comparison.
5. Click **Approve Fleet Swap & Dispatch** to re-route the fleet.

---

## 3. Resilient Fallback Architecture & Outage Recovery Flow

The system is engineered to maintain operational continuity under degraded, offline, and telemetry-loss conditions without compromising data integrity or falsifying status.

---

### A. Network Store-and-Forward Fallback Flow

The implemented network fallback lifecycle operates along the following deterministic pipeline (client-side MVP):

```text
Online action (processed locally in store.js)
      ↓
[Network Failure (simulated or browser offline)]
      ↓
Local Queue (browser localStorage: school_bus_pending_sync)
      ↓
Pending State (status: 'PENDING')
      ↓
[Network Recovery (simulated or window online)]
      ↓
Sync Attempt (client simulation: store.syncPendingOfflineChanges)
      ↓
  ┌───────────────────┴───────────────────┐
  ↓                                       ↓
Success (status: 'SYNCED')        Sync Failure (status: 'FAILED')
                                          ↓
                                  Retry (manual / recovery auto)
                                          ↓
                                  Success (status: 'SYNCED')
```

#### Detailed Network Safeguards & Behaviors:

1. **Online Action Processing:**
   - When network connectivity is active (`online`), dispatcher operational actions (e.g., plan approval, route modification, student cancellation approval, manual vehicle override) are processed immediately against the local application state in `store.js`.
   - Actions are executed with synchronous audit logging (`actionId`, `userId`, `role`, `timestamp`) and registered in the `syncedActionIds` persistent set in `localStorage` for deduplication.

2. **Network Interruption & Local Queue Diversion:**
   - If network connectivity is interrupted during an action (e.g., offline mode, connectivity loss), the application does not drop the action or throw unhandled exceptions.
   - The action is intercepted and persisted immediately to the client-side Store-and-Forward queue in `localStorage` under `school_bus_pending_sync`.

3. **Pending Actions & Queue State:**
   - Every saved action enters the queue with `status: 'PENDING'`.
   - **Mandatory 9-Attribute Queued Action Schema:**
     - `actionId`: Globally unique identifier (e.g., `ACT-1727618293-A4F9`) guaranteeing idempotency.
     - `timestamp`: ISO-8601 creation timestamp.
     - `userId`: Identifier of the operating user (e.g., `DISPATCHER-01`).
     - `role`: Dispatcher authority level (`Dispatcher`, `Admin`).
     - `actionType`: Formal action name (e.g., `REPLAN_ACCEPT`, `REPLAN_MODIFY`, `CANCELLATION_APPROVE`, `MANUAL_OVERRIDE`).
     - `payload`: Immutable payload snapshot (selected bus, route stops, candidate data, version keys).
     - `status`: Lifecycle state (`PENDING`, `SYNCING`, `SYNCED`, `FAILED`).
     - `retryCount`: Integer counter tracking sync attempts (begins at `0`).
     - `lastAttempt`: ISO timestamp of the most recent sync attempt (or `null`).
     - `error`: Diagnostic error description if transmission failed (or `null`).
   - Multiple pending actions can accumulate concurrently; the queue preserves strict FIFO ordering and maintains visibility in both the top notification banner and the **Pending Queue Modal**.

4. **Duplicate Prevention (Idempotency):**
   - The queue and local sync handlers validate every incoming request against existing `actionId` keys (checking both `pendingOfflineChanges` and `syncedActionIds` in `localStorage`).
   - Re-submitting an identical action while an operation is pending or already processed suppresses the duplicate with a diagnostic warning and zero queue duplication. This prevents duplicate stop insertions, double-booking vehicles, or corrupting route version keys across page reloads and browser restarts.

5. **Network Recovery & Sync Attempt:**
   - When the network status switches from `offline` to `online` (via window online event or manual simulator toggle), the system detects unsynchronized actions and triggers local background synchronization automatically.
   - Dispatchers can also trigger an immediate synchronization attempt at any time by clicking **⚡ Sync All Now** in the top navigation banner or within the Queue Management Modal.
   - *Operational Realism Note:* In the current MVP, synchronization flushes actions to the local application store with simulated transmission delays; connection to a central REST API (`POST /api/v1/dispatch/sync-batch`) is future production work.

6. **Sync Failure Handling:**
   - If a sync attempt fails (due to offline status, connection loss, or simulated transmission failure):
     - The action is **NEVER lost** and **NEVER discarded**.
     - The action is **NEVER falsely reported as synced**; UI components maintain strictly accurate counts.
     - The item's state transitions to `status: 'FAILED'`.
     - `retryCount` is incremented by 1, `lastAttempt` is updated with the current timestamp, and the diagnostic error description is stored in `error` (`Network connection unavailable / Cloud sync timeout`).

7. **Retry Behavior:**
   - Failed actions remain safely stored in the persistent queue until explicitly or automatically retried.
   - Dispatchers can click **Retry Failed Actions** in the top banner or select individual actions in the Queue Modal.
   - Retrying resets `FAILED` items back to `PENDING` and re-initiates transmission in FIFO sequence.
   - *Strategy Note:* The system utilizes event-driven retries (automatic upon network reconnection or manual dispatcher batch/individual trigger) rather than automated timer-based exponential backoff intervals.
   - Upon successful synchronization, items transition to `status: 'SYNCED'` and are safely purged from the pending queue.

---

### B. GPS Telematics Degradation & Fallback Flow

Vehicle telemetry follows a strict degradation and recovery hierarchy. Under no circumstances is stale, estimated, or last-known data ever disguised or presented as live GPS:

```text
LIVE GPS (Fresh fix: age <= 60s)
      ↓
[Signal drop / telemetry pause: age 60s - 120s]
      ↓
LAST_KNOWN GPS (Retains last verified fix, age visible, reduced trust)
      ↓
[Telemetry elapsed: age > 120s]
      ↓
STALE GPS (Warning banner, low trust, distance penalties, dispatcher verification)
      ↓
[Signal completely lost / dead zone]
      ↓
NO_SIGNAL (Dead zone indicator, last-known location only, zero trust)
      ↓
[Dispatcher VHF radio / landmark report]
      ↓
MANUAL Fallback (Source identified as MANUAL / manual_dispatcher, verified trust)
```

#### Detailed GPS Telematics Rules & Safeguards:

1. **Mandatory 5-Field Telemetry Data Schema:**
   Every vehicle telematic state in the store and recommendation engine persists:
   - `latitude`: Numeric latitude coordinate (e.g., `37.7710`).
   - `longitude`: Numeric longitude coordinate (e.g., `-122.4280`).
   - `source`: Telemetry provider identifier (`cellular_gps`, `last_known`, `stale_gps`, `none`, or `manual_dispatcher`).
   - `lastUpdated`: ISO-8601 timestamp of coordinate acquisition.
   - `ageSeconds`: Integer count of elapsed seconds since `lastUpdated` was recorded.

2. **LIVE GPS State:**
   - Displayed as live **only when data is actually fresh** (`ageSeconds <= 60`).
   - UI badge: 🛰️ `Live Fix` (Green).
   - Trust level: `HIGH` (1.0). Full confidence in automated distance calculations and candidate ETA ranking.

3. **LAST_KNOWN GPS State:**
   - Replaces `LIVE` when telemetry pings cease for 60 to 120 seconds.
   - **Must NEVER be displayed as LIVE.** The UI renders an amber badge: ⏱️ `Last Known`.
   - Age is clearly displayed (e.g., `85s old`), and trust is reduced (`0.7`) to alert dispatchers that the vehicle has moved since the last fix.

4. **STALE GPS State & Warning:**
   - Activated whenever telemetry age exceeds 120 seconds (`ageSeconds > 120`) or when simulated by the test suite.
   - **Must NEVER be displayed as LIVE.** The UI displays: ⚠️ `Stale Fix` (Orange) with an explicit badge: `(Not Live)`.
   - **Stale GPS Warning Banner:** Prominently displayed on vehicle cards, slideout details, and recommendation panels:
     `WARNING: "GPS data is X minutes old. Distance-based ranking may be less reliable."`
   - **Reduced Trust in Distance:** Replanning heuristic discounts distance trust (`trustLevel: 'LOW'`, `confidenceMultiplier: 0.40`), applying uncertainty penalties ($+60\%$ distance expansion $+4.00$ flat penalty) to candidate scoring.

5. **Dispatcher Verification for Stale Telemetry:**
   - Important operational replanning decisions involving a vehicle with stale GPS are flagged with `requiresDispatcherConfirmation: true` and `requiresDispatcherVerification: true`.
   - The dispatcher must inspect the uncertainty warning and explicitly verify the recommendation before approving route changes.

6. **NO_SIGNAL State:**
   - Triggered when a vehicle enters a dead zone, experiences hardware failure, or drops all carrier connections.
   - If no usable live signal exists, the UI clearly shows `NO_SIGNAL` with a red badge: 📡 `No Signal` and `trustLevel: 'NONE'`.
   - Coordinates fall back to the **last-known location only when available**, explicitly marked with `(Not Live)` and warning disclaimers.

7. **MANUAL Location Entry & Fallback:**
   - When GPS is lost, stale, or unavailable, dispatchers can enter a manual position update via:
     - The **Manual GPS Fix** modal accessible from the top navigation bar.
     - The **Update Manual Location** action on any vehicle slideout card.
   - Dispatchers can enter verified street addresses, intersection landmarks (e.g., *Central Depot*, *Cole & Haight St Checkpoint*), or specific latitude/longitude coordinates received over two-way VHF radio.
   - **Clear Source Identification:** The system immediately sets `source: 'manual_dispatcher'`, `sourceUpper: 'MANUAL'`, `isManual: true`, and `isLive: false`.
   - The vehicle's `lastUpdated` is refreshed to the current timestamp (`ageSeconds: 0`), and an audit log event (`MANUAL_OVERRIDE`) records the dispatcher ID, landmark, and operational rationale.

---

## 4. Reports, Benchmarks & Audit Logs
- Navigate to the **Reports View** to:
  - View the **Benchmarking & Evaluation Dashboard** (Simulated Manual Baseline vs Automated Engine Time and End-to-End Recovery Time against the 480-second SLA target).
  - Inspect the **Lifecycle Audit Trail** recording all 6 required events: `RECOMMENDATION_GENERATED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_MODIFIED`, `RECOMMENDATION_REJECTED`, `MANUAL_OVERRIDE`, and `FALLBACK_TRIGGERED`.
  - Run the built-in **Deterministic Replanning Edge & Failure Test Suite** to verify end-to-end system integrity at any time.
