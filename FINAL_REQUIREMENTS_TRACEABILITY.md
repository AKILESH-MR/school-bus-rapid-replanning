# Final Requirements Traceability Matrix

**Project:** School Bus Rapid Replanning & Responsible AI System  
**Version:** 1.0.0 (Final Validation)  
**Date of Validation:** September 2026  
**Auditor:** Antigravity Pair Programming Agent  

---

> [!IMPORTANT]
> ### Implementation Reality & Integrity Declaration
> - **Client-Side MVP:** The system is implemented and validated as a **client-side Single Page Application (SPA)** executing in the browser runtime (supported by Node.js for test and benchmark execution).
> - **No Remote Infrastructure:** No live remote cloud backend, central REST server, message broker (Kafka/RabbitMQ), cellular OBD-II vehicle tracking hardware, or production database is connected.
> - **Pre-Trial Status:** **No real stakeholder validation has been conducted yet.** Manual baselines are simulated task walkthrough models, not empirical human telemetry. Real stakeholder trials are specified in [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md).

---

## 1. Formal Replanning Algorithm

### Requirement 1.1: Greedy Insertion Heuristic
→ **Implementation:** Greedy stop insertion algorithm evaluating minimal incremental detour distance and arrival delay along remaining route waypoints.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L340-L435)  
→ **Test coverage:** [tests/greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L110-L140), [tests/insertionPositionConsistency.test.js](file:///d:/project/raale%20project1/tests/insertionPositionConsistency.test.js#L12-L60)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Detour distance is calculated using planar geometry scaled by regional coordinate factors (~69 mi/deg lat, ~55 mi/deg lon) and an urban circuity multiplier ($1.30$) rather than real-time turn-by-turn road network graph routing APIs.

### Requirement 1.2: Candidate Generation
→ **Implementation:** Evaluates all active and depot standby fleet vehicles, extracting current load, capacity, assigned route, driver status, and telematics coordinates.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L588-L620)  
→ **Test coverage:** [tests/greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L65-L105)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Candidate evaluation pool is bounded by in-memory mock fleet fixtures (8–12 buses); enterprise multi-tier depot partitioning is future work.

### Requirement 1.3: Hard Constraint Enforcement
→ **Implementation:** Strict binary validation of 6 invariants: vehicle operational status, seating capacity ($currentLoad + required \le capacity$), driver availability, driver active commitments, destination school compatibility, and ADA wheelchair lift requirements.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L115-L338)  
→ **Test coverage:** [tests/greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L145-L198), [tests/explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L60-L85)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Complex district-specific labor agreements (e.g. mandatory 15-minute rest breaks every 2 hours) depend on manual dispatcher review.

### Requirement 1.4: Candidate Scoring
→ **Implementation:** Multi-criteria weighted cost function: $w_{\text{dist}} \cdot \Delta\text{dist} + w_{\text{delay}} \cdot \Delta\text{delay} + w_{\text{load}} \cdot \text{LoadRatio} + w_{\text{disrupt}} \cdot \text{Disruption} + 0.2 \cdot d_{\text{driver}} + \text{GPS uncertainty penalty}$.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L485-L585)  
→ **Test coverage:** [tests/greedyReplanningEngine.test.js](file:///d:/project/raale%20project1/tests/greedyReplanningEngine.test.js#L115-L135), [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L1-L260)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Cost function minimizes operational delay and disruption; it does not compute a mathematical fairness index (e.g., Gini or Jain's fairness index).

### Requirement 1.5: Candidate Ranking
→ **Implementation:** Feasible candidates are sorted in ascending order by composite cost score, with GPS uncertainty penalties dynamically altering rank without overriding hard constraints.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1095-L1100)  
→ **Test coverage:** [tests/modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L40-L70), [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L180-L225)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Ranking is deterministic; tied scores default to fleet array index order.

### Requirement 1.6: Exact Selected Insertion Position Applied
→ **Implementation:** The precise integer insertion index (`bestPosition`) determined by greedy search is stored on the plan and strictly preserved when `acceptAIPlan` mutates `route.stops`.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L140-L175), [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L110-L130)  
→ **Test coverage:** [tests/insertionPositionConsistency.test.js](file:///d:/project/raale%20project1/tests/insertionPositionConsistency.test.js#L12-L140)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Route progress validation verifies against `routeVersionKey`; real-time dynamic re-sequencing during driver movement is bounded by manual refresh intervals.

---

## 2. Human-in-the-Loop Workflow

### Requirement 2.1: Role-Based Workflow Support (Dispatcher / Operations Manager)
→ **Implementation:** Client-side role selection switcher allowing view toggling between Dispatcher (tactical triage) and Operations Manager / Coordinator (strategic audit & compliance).  
→ **Source file(s):** [src/components/auth/RoleSelectionView.js](file:///d:/project/raale%20project1/src/components/auth/RoleSelectionView.js), [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L70-L90)  
→ **Test coverage:** [tests/cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L50-L70)  
→ **Status:** Partially Implemented  
→ **Remaining limitation:** Client-side demonstration switcher; enterprise authentication (OAuth 2.0 / OIDC, JWTs, server-enforced RBAC) is FUTURE PRODUCTION WORK.

### Requirement 2.2: Explicit "Accept" Action
→ **Implementation:** Dispatcher click approves plan, commits proposed state, increments/decrements passenger loads, updates route stops, and records audit event.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L515-L560)  
→ **Test coverage:** [tests/modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L75-L95), [tests/cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L30-L50)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Acceptance is a final state commitment; rollbacks require initiating a new replanning event.

### Requirement 2.3: Explicit "Modify" Action (Constraint Customizer)
→ **Implementation:** Interactive Constraint Customizer allows adjusting maximum allowed delay, minimum available seats, preferred vehicle, and driver assignment with Before/After preview.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L565-L615), [src/components/modals/CustomizerModal.js](file:///d:/project/raale%20project1/src/components/modals/CustomizerModal.js)  
→ **Test coverage:** [tests/modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L20-L74)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Customizations apply to the active disruption incident; global policy default adjustments require editing Settings.

### Requirement 2.4: Explicit "Reject" Action
→ **Implementation:** Dispatcher click rejects recommendation, captures mandatory justification reason, clears review badges, and preserves original operational state.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L620-L650)  
→ **Test coverage:** [tests/modifyPlanWorkflow.test.js](file:///d:/project/raale%20project1/tests/modifyPlanWorkflow.test.js#L100-L120), [tests/cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L55-L75)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Rejection leaves the operational issue unresolved; dispatcher must initiate manual triage or external charter coordination.

### Requirement 2.5: Approval Before Final Plan Mutation
→ **Implementation:** Recommendations are staged in an `unresolved` state; bus loads, stop sequences, and student statuses are never altered prior to explicit dispatcher approval.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L270-L310), [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L40-L55)  
→ **Test coverage:** [tests/cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L20-L30), [tests/cancellationApprovalWorkflow.test.js](file:///d:/project/raale%20project1/tests/cancellationApprovalWorkflow.test.js#L210-L240)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Unattended consoles leave pending disruptions in an unapproved state indefinitely.

---

## 3. Offline / Store-and-Forward

### Requirement 3.1: Persistent Local Queue
→ **Implementation:** Offline actions are intercepted and persisted in browser `localStorage` (`school_bus_pending_sync`) under a strict 9-attribute schema.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L151-L171), [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L280-L305)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L20-L95)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Queue storage capacity is bounded by browser `localStorage` quota (~5MB per origin).

### Requirement 3.2: Network Interruption Handling
→ **Implementation:** System detects network loss (`window.offline` or simulator toggle); actions automatically divert to the persistent local queue without dropping data.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L305-L385)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L20-L50)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Captive portal detection or flaky socket ping drops are not measured.

### Requirement 3.3: Network Recovery & Synchronization
→ **Implementation:** Network reconnection (`window.online` event or manual trigger) executes FIFO queue processing via `syncPendingOfflineChanges`, transitioning items to `SYNCED`.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L100-L107), [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L400-L460)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L173-L225)  
→ **Status:** Partially Implemented (Simulated for MVP)  
→ **Remaining limitation:** Synchronization is a client-side simulation updating local state; live transmission to an external cloud server (`POST /api/v1/dispatch/sync-batch`) is FUTURE PRODUCTION WORK.

### Requirement 3.4: Manual and Auto-Retry Mechanism
→ **Implementation:** Event-driven reconnection auto-retry and dispatcher manual batch/individual retry (`retryAction`, `retryFailedActions`) resetting `FAILED` items to `PENDING`.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L465-L510)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L275-L315)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Retries are event-driven and dispatcher-initiated; automated timer-based exponential backoff intervals are FUTURE PRODUCTION WORK.

### Requirement 3.5: Failed Action Retention & Zero Data Loss
→ **Implementation:** Failed sync attempts set `status: 'FAILED'`, increment `retryCount`, record `lastAttempt`, preserve diagnostic errors, and keep items in `localStorage`.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L430-L458)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L230-L270)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Failed actions remain in client storage until resolved or cleared manually by the dispatcher.

### Requirement 3.6: Duplicate Action Prevention (Idempotency)
→ **Implementation:** Multi-boundary deduplication using `actionId` matching against `pendingOfflineChanges` and persistent `localStorage: school_bus_synced_actions` across reloads.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L173-L225), [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L252-L269)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L330-L510)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Local idempotency cache is capped at 1,000 action IDs via FIFO eviction to conserve storage.

---

## 4. GPS Fallback

### Requirement 4.1: Five Telemetry States Supported
→ **Implementation:** Native support for `LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, and `MANUAL` telematics states with monotonic penalty ordering.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L205-L245), [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L506-L545)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L145-L180), [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L1-L180)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Telemetry feeds are simulated models and fixtures; live cellular OBD-II vehicle streaming is FUTURE PRODUCTION WORK.

### Requirement 4.2: GPS Freshness Affects Candidate Scoring
→ **Implementation:** Heuristic scoring penalizes distance confidence based on telemetry age ($+25\%$ for LAST_KNOWN, $+60\%$ for STALE, $+100\%$ for NO_SIGNAL).  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L547-L557)  
→ **Test coverage:** [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L180-L260)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Penalties are static heuristic weights rather than dynamic Bayesian Kalman filter covariances.

### Requirement 4.3: Verification Warnings & Badges
→ **Implementation:** Age $> 120\text{s}$ triggers high-visibility warning banner, orange `(Not Live)` badge, and flags `requiresDispatcherVerification: true`.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L992-L1000)  
→ **Test coverage:** [tests/explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L110-L125), [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L145-L175)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Warning thresholds (60s last-known, 120s stale) are configured district constants.

### Requirement 4.4: Manual Location Input
→ **Implementation:** Dispatchers can manually input coordinates/landmarks received over VHF radio; sets `source: 'manual_dispatcher'`, resets age to 0, and scores with checkpoint trust.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L230-L260)  
→ **Test coverage:** [tests/storeAndForwardGps.test.js](file:///d:/project/raale%20project1/tests/storeAndForwardGps.test.js#L185-L210), [tests/gpsFreshnessScoring.test.js](file:///d:/project/raale%20project1/tests/gpsFreshnessScoring.test.js#L110-L140)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Manual input precision depends on driver radio report accuracy.

---

## 5. Responsible AI

### Requirement 5.1: 12-Dimension Explanation Schema
→ **Implementation:** Displays Selected Bus, Insertion Position, Score, Extra Distance, Extra Delay, Capacity Impact, Driver Availability, Route Compatibility, ADA Result, GPS Freshness, Why Selected, and Rejected Candidates.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1065-L1088)  
→ **Test coverage:** [tests/explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L15-L55)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Explanation text is template-generated English; multi-lingual localization is not configured.

### Requirement 5.2: Comprehensive Lifecycle Audit Trail
→ **Implementation:** Records all 6 lifecycle events (`RECOMMENDATION_GENERATED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_MODIFIED`, `RECOMMENDATION_REJECTED`, `MANUAL_OVERRIDE`, `FALLBACK_TRIGGERED`) with complete before/after state snapshots.  
→ **Source file(s):** [src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L695-L740), [DATA_SCHEMA.md](file:///d:/project/raale%20project1/DATA_SCHEMA.md#L96-L114)  
→ **Test coverage:** [tests/explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L120-L175)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Audit events are stored in-memory and `localStorage`; long-term archival to an enterprise SQL database is FUTURE PRODUCTION WORK.

### Requirement 5.3: Constraint & Telematics Uncertainty Visibility
→ **Implementation:** Clear visibility into the 6 verified hard constraints and GPS telematics status without synthetic percentage confidence metrics.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L920-L935), [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1012-L1030)  
→ **Test coverage:** [tests/explanationAndAudit.test.js](file:///d:/project/raale%20project1/tests/explanationAndAudit.test.js#L40-L125)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Invariant verification is strictly binary; soft tolerance buffers are not supported.

---

## 6. Benchmark & Evaluation

### Requirement 6.1: Simulated Manual Baseline Workflow
→ **Implementation:** Formal 7-stage phone-tree triage model (`identifyDisruption`, `checkVehicles`, `checkCapacity`, `checkDriver`, `rebuildRoute`, `verifyConstraints`, `dispatcherConfirmation`), average 741.7s; clearly labeled as simulated.  
→ **Source file(s):** [src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L72-L115)  
→ **Test coverage:** [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L20-L45)  
→ **Status:** Partially Implemented (Simulated for MVP)  
→ **Remaining limitation:** Manual baseline is a task-walkthrough simulation model; empirical human stopwatch timing from live district dispatchers is not available.

### Requirement 6.2: Separation of Engine vs. Dispatcher Review Time
→ **Implementation:** Engine runtime is measured separately in milliseconds ($\sim 2.06\text{ms}$ avg); dispatcher review time is modeled per scenario ($15\text{s} - 180\text{s}$).  
→ **Source file(s):** [src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L118-L141)  
→ **Test coverage:** [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L135-L142)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Dispatcher review intervals are modeled parameters rather than live eye-tracking or click-stream telemetry.

### Requirement 6.3: End-to-End Recovery Time ($\le 480$ Seconds SLA Target)
→ **Implementation:** Total E2E recovery duration ($T_{\text{engine}} + T_{\text{review}}$) evaluated across 9 operational scenarios; achieves 100% compliance ($\le 480\text{s}$, average 43.89s).  
→ **Source file(s):** [src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L220-L224)  
→ **Test coverage:** [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L130-L135), [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L148-L152)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Assumes immediate dispatcher availability at alert trigger time.

### Requirement 6.4: Evaluation Rates & Constraint Violation Tracking
→ **Implementation:** Measures Automated Feasible Plan Rate (88.9%), Correct Manual Escalation Rate (100%), Scenario Handling Success Rate (100%), and zero constraint violations (0 across all scenarios).  
→ **Source file(s):** [src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L298-L315)  
→ **Test coverage:** [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L154-L161)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Evaluated across the 9 standardized operational benchmark fixtures.

---

## 7. Failure Cases & Edge Scenarios

### Requirement 7.1: At Least 3 Operational Edge / Failure Scenarios
→ **Implementation:** Five distinct edge cases implemented and verified:
  1. *Mechanical Vehicle Breakdown:* BUS-04 stalls with 36 passengers; triggers emergency depot standby swap (TEST-03).
  2. *Impossible Constraint Saturation:* All buses full/maintenance; triggers zero-candidate escalation (TEST-09).
  3. *Multiple Simultaneous Disruptions:* Concurrent breakdown, addition, and cancellation handled without state corruption (TEST-08).
  4. *Telemetry Signal Loss:* NO_SIGNAL coordinates fall back to last-known radio checkpoint (TEST-06).
  5. *Network Disconnection:* Store-and-forward queueing with failed sync simulation (TEST-07).  
→ **Source file(s):** [src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L176-L190), [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1101-L1125)  
→ **Test coverage:** [tests/replanningEdgeCases.test.js](file:///d:/project/raale%20project1/tests/replanningEdgeCases.test.js#L1-L40), [tests/evaluation.test.js](file:///d:/project/raale%20project1/tests/evaluation.test.js#L1-L165)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Edge cases are evaluated in local simulation; multi-agency mutual aid coordination is manual.

### Requirement 7.2: Manual Fallback Escalation
→ **Implementation:** When zero candidates are feasible, system triggers `escalateToManual: true`, displays rejection audit, and halts automated dispatch.  
→ **Source file(s):** [src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1101-L1125)  
→ **Test coverage:** [tests/replanningEdgeCases.test.js](file:///d:/project/raale%20project1/tests/replanningEdgeCases.test.js#L20-L40)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Manual resolution requires telephone/radio dispatch procedures outside the software.

---

## 8. Documentation Accuracy

### Requirement 8.1: No Unsupported Exponential Backoff Claim
→ **Implementation:** Documentation accurately identifies retries as event-driven (network reconnection) and dispatcher-initiated, with zero claims of automated background exponential backoff timers.  
→ **Source file(s):** [USER_GUIDE.md](file:///d:/project/raale%20project1/USER_GUIDE.md#L145), [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md#L303)  
→ **Test coverage:** Documentation audit & grep search (0 false claims)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Production exponential backoff retry client is FUTURE PRODUCTION WORK.

### Requirement 8.2: No Fake Real-World Validation Claim
→ **Implementation:** Prominently declares across all documentation: *"No real stakeholder validation has been conducted yet."* Fabricated quotes and satisfaction scores removed from `VALIDATION_REPORT.md`; reproducible protocol created in `STAKEHOLDER_VALIDATION_PLAN.md`.  
→ **Source file(s):** [STAKEHOLDER_VALIDATION_PLAN.md](file:///d:/project/raale%20project1/STAKEHOLDER_VALIDATION_PLAN.md), [VALIDATION_REPORT.md](file:///d:/project/raale%20project1/VALIDATION_REPORT.md), [EVALUATION_REPORT.md](file:///d:/project/raale%20project1/EVALUATION_REPORT.md)  
→ **Test coverage:** Documentation audit & grep search (0 false claims)  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Live stakeholder testing with active professional dispatchers remains an open prerequisite before district deployment.

### Requirement 8.3: No Fake Cloud / Backend Claim
→ **Implementation:** All documentation explicitly clarifies that the MVP runs client-side in the browser, with no live `/api/v1/dispatch` endpoints or remote server connections. Section 5 of `ARCHITECTURE_DIAGRAM.md` is explicitly marked as Future Reference Architecture.  
→ **Source file(s):** [README.md](file:///d:/project/raale%20project1/README.md), [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md)  
→ **Test coverage:** Documentation audit  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Multi-user concurrent dispatching requires an enterprise cloud backend (FUTURE PRODUCTION WORK).

### Requirement 8.4: No Fake Live GPS / Routing Claim
→ **Implementation:** All documentation clearly states that GPS feeds and signal degradation are simulated models, and route distances are computed via planar coordinate geometry and urban circuity scaling rather than live vehicle hardware or traffic APIs.  
→ **Source file(s):** [README.md](file:///d:/project/raale%20project1/README.md), [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md), [EVALUATION_REPORT.md](file:///d:/project/raale%20project1/EVALUATION_REPORT.md)  
→ **Test coverage:** Documentation audit  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Live cellular OBD-II vehicle tracking and turn-by-turn road network routing (OSRM/Mapbox) are FUTURE PRODUCTION WORK.

### Requirement 8.5: Clear Identification of Simulated Components
→ **Implementation:** The 10-point Architectural Implementation Reality Matrix is published across `README.md`, `ARCHITECTURE_DIAGRAM.md`, `REQUIREMENTS_TRACEABILITY.md`, and `EVALUATION_REPORT.md`, explicitly separating IMPLEMENTED NOW, SIMULATED FOR MVP, and FUTURE PRODUCTION WORK.  
→ **Source file(s):** [README.md](file:///d:/project/raale%20project1/README.md), [ARCHITECTURE_DIAGRAM.md](file:///d:/project/raale%20project1/ARCHITECTURE_DIAGRAM.md), [REQUIREMENTS_TRACEABILITY.md](file:///d:/project/raale%20project1/REQUIREMENTS_TRACEABILITY.md)  
→ **Test coverage:** Documentation audit  
→ **Status:** Fully Implemented  
→ **Remaining limitation:** Production implementation of deferred cloud components will occur in post-MVP phases.

---

## Final Validation Summary

### A. Requirements Fully Implemented
1. **Greedy Insertion Heuristic:** Stop insertion algorithm evaluating incremental detour distance and arrival delay along route stops ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L340-L435)).
2. **Candidate Generation:** Fleet vehicle iteration assessing current passenger load, total capacity, route assignment, driver duty status, and GPS coordinates ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L588-L620)).
3. **Hard Constraint Enforcement:** Strict binary validation of 6 invariants: vehicle operational status, seating capacity, driver availability, active driver commitments, school compatibility, and ADA lift requirement ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L115-L338)).
4. **Candidate Scoring:** Multi-criteria weighted cost function combining detour distance, delay, passenger load ratio, disruption penalty, driver proximity, and GPS uncertainty penalty ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L485-L585)).
5. **Candidate Ranking:** Deterministic ascending sort by composite cost score, where GPS uncertainty penalties alter candidate rank without overriding hard constraints ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1095-L1100)).
6. **Exact Selected Insertion Position Applied:** The precise greedy insertion position (`bestPosition`) is stored on the plan and inserted into `route.stops` upon acceptance ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L140-L175)).
7. **Dispatcher Accept Action:** Approves recommendation, commits proposed state changes, updates vehicle load and route stops, records audit event ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L515-L560)).
8. **Dispatcher Modify Action (Constraint Customizer):** Interactive modal allowing adjustment of maximum delay, minimum seats, preferred vehicle, and driver with real-time Before/After preview ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L565-L615), [src/components/modals/CustomizerModal.js](file:///d:/project/raale%20project1/src/components/modals/CustomizerModal.js)).
9. **Dispatcher Reject Action:** Rejects recommendation with mandatory justification reason, clears review badges, and preserves baseline operational state ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L620-L650)).
10. **Approval Before Final Plan Mutation:** Recommendations staged in `unresolved` state; bus loads, route stops, and student statuses never alter prior to dispatcher approval ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L270-L310)).
11. **Persistent Local Queue:** Store-and-forward queue persisted in `localStorage` under `school_bus_pending_sync` with 9-attribute schema ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L151-L171)).
12. **Network Interruption Handling:** Actions divert to local queue during offline state without dropping operations ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L305-L385)).
13. **Manual and Auto-Retry Mechanism:** Event-driven reconnection auto-retry and dispatcher manual batch/individual retry resetting failed items to pending ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L465-L510)).
14. **Failed Action Retention:** Failed sync transitions item to `status: 'FAILED'`, increments `retryCount`, records `lastAttempt`, preserves diagnostic error, and prevents data loss ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L430-L458)).
15. **Duplicate Action Prevention (Idempotency):** Action deduplication using `actionId` matching against pending queue and persisted `localStorage: school_bus_synced_actions` across page reloads and browser restarts ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L173-L225)).
16. **Five Telemetry States Supported:** Full handling of `LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, and `MANUAL` telematics states with monotonic penalty ordering ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L506-L545)).
17. **GPS Freshness Scoring Influence:** Telemetry age applies documented scoring penalties ($+25\%$ LAST_KNOWN, $+60\%$ STALE, $+100\%$ NO_SIGNAL) that alter ranking without compromising hard constraints ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L547-L557)).
18. **Verification Warnings & Badges:** Telemetry age $> 120\text{s}$ triggers high-visibility warning banner, orange badge, and sets `requiresDispatcherVerification: true` ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L992-L1000)).
19. **Manual Location Input:** Dispatcher manual GPS coordinate/landmark entry via VHF radio, tagging provenance `source: 'manual_dispatcher'` and resetting staleness ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L230-L260)).
20. **12-Dimension Explanation Schema:** Structured explanation card detailing selected bus, position, score, distance, delay, capacity, driver, route compatibility, ADA, GPS freshness, selection reason, and rejected candidates ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1065-L1088)).
21. **Comprehensive Lifecycle Audit Trail:** Complete audit logging across all 6 lifecycle events with before/after state snapshots ([src/state/store.js](file:///d:/project/raale%20project1/src/state/store.js#L695-L740)).
22. **Constraint & Uncertainty Visibility:** Transparent presentation of verified invariants and raw telemetry status without synthetic percentages ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L920-L935)).
23. **Separation of Engine vs. Dispatcher Review Time:** Algorithm runtime measured in milliseconds ($\sim 2.06\text{ms}$); dispatcher review modeled in seconds ([src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L118-L141)).
24. **End-to-End Recovery Target Evaluation:** Total recovery time measured against $\le 480\text{s}$ SLA; achieves 100% compliance across all 9 benchmark scenarios ([src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L220-L224)).
25. **Evaluation Rates & Zero Constraint Violations:** 88.9% automated feasible plan rate, 100% correct manual escalation, 0 constraint violations ([src/utils/evaluation.js](file:///d:/project/raale%20project1/src/utils/evaluation.js#L298-L315)).
26. **Multiple Operational Failure Cases:** Five distinct edge cases tested and handled (breakdown swap, capacity saturation escalation, concurrent disruptions, signal loss, offline sync failure) ([tests/replanningEdgeCases.test.js](file:///d:/project/raale%20project1/tests/replanningEdgeCases.test.js)).
27. **Manual Fallback Escalation:** Halts automated dispatch and flags `escalateToManual: true` when zero feasible candidates exist ([src/utils/replanningEngine.js](file:///d:/project/raale%20project1/src/utils/replanningEngine.js#L1101-L1125)).
28. **Documentation Accuracy:** Zero unsupported exponential backoff claims; zero fake real-world validation claims; zero fake cloud/backend claims; zero fake live GPS/traffic claims; all simulated components clearly identified.

---

### B. Requirements Partially Implemented (Simulated for MVP)
1. **Central-Server Synchronization:** Sync logic simulates central-server commits in `src/state/store.js` updating client state and `localStorage`. Real remote cloud HTTP REST endpoint (`POST /api/v1/dispatch/sync-batch`) is not implemented.
2. **Role Selection (Dispatcher vs. Operations Manager):** Implemented as a client-side view switcher (`src/components/auth/RoleSelectionView.js`); enterprise SSO/OAuth 2.0/RBAC server tokens are not implemented.
3. **Simulated Manual Baseline Workflow:** Modeled as a 7-stage phone-tree task walkthrough ($741.7\text{s}$ average) in `src/utils/evaluation.js`; empirical human stopwatch timing from live district dispatchers has not been conducted.
4. **GPS Telematics Feeds:** Coordinates and degradation states (`LIVE`, `STALE`, `NO_SIGNAL`) are modeled fixtures; live cellular OBD-II vehicle streaming hardware is not connected.
5. **Map Routing & Circuity:** Distances calculated via planar coordinate geometry and urban circuity factor ($1.30$) with Leaflet visualization; live turn-by-turn road network graph routing (OSRM/Mapbox API) is not connected.

---

### C. Requirements Not Implemented (Future Production Work)
1. **Real Cloud / Backend Server:** No Node.js/Express, Python/FastAPI, or cloud server runtime currently deployed.
2. **Central REST API:** No production `/api/v1/dispatch/*` endpoints currently exist.
3. **Distributed Message Broker:** No Apache Kafka, RabbitMQ, or MQTT message bus currently connected.
4. **Live Dynamic Traffic Feeds:** No real-time sensor integration (HERE, TomTom, or Google Maps Directions API).
5. **Production Relational Database:** No PostgreSQL, TimescaleDB, or PostGIS database connected.
6. **Automated Background Exponential Backoff Timer Daemon:** No background timer daemon executing increasing interval retry loops without user or network triggers.
7. **Real Stakeholder Validation Trials:** No real-world field trials with active school district dispatchers or transport coordinators have been conducted yet.

---

### D. Tests Passed / Failed
- **Execution Command:** `npm test`
- **Result:** **10/10 Test Suites Passed (100% Pass Rate)**
- **Total Assertions:** **212+ unit and integration test assertions passed**
- **Failures:** **0**
- **Test Suite Breakdown:**
  1. `tests/greedyReplanningEngine.test.js`: ✅ 10/10 Passed (Greedy search, hard constraints, ADA, scoring)
  2. `tests/storeAndForwardGps.test.js`: ✅ 12/12 Passed (Queue persistence, network recovery, retries, idempotency)
  3. `tests/replanningEdgeCases.test.js`: ✅ 7/7 Passed (Breakdown, capacity saturation, escalation)
  4. `tests/evaluation.test.js`: ✅ 12/12 Passed (9 benchmark scenarios, timing separation, 480s SLA)
  5. `tests/routeProgressAndDriverLocation.test.js`: ✅ 15/15 Passed (Waypoint progress, route versioning)
  6. `tests/modifyPlanWorkflow.test.js`: ✅ 7/7 Passed (Constraint customizer, before/after, accept/reject)
  7. `tests/explanationAndAudit.test.js`: ✅ 18/18 Passed (12 explanation dimensions, 6 audit event types)
  8. `tests/insertionPositionConsistency.test.js`: ✅ 22/22 Passed (Stop insertion index preservation)
  9. `tests/cancellationApprovalWorkflow.test.js`: ✅ 65/65 Passed (HITL staging, approval before mutation)
  10. `tests/gpsFreshnessScoring.test.js`: ✅ 9/9 Passed (5 telematics states, scoring penalties, ranking effects)

---

### E. Build Result
- **Execution Command:** `npm run build`
- **Build Tool:** Vite v6.4.3
- **Exit Code:** `0` (Success)
- **Build Duration:** 1.74 seconds
- **Generated Bundle Artifacts:**
  - `dist/index.html`: 1.40 kB (gzip: 0.76 kB)
  - `dist/assets/index-BJz5evgU.css`: 40.84 kB (gzip: 11.54 kB)
  - `dist/assets/index-BIQSGLIS.js`: 525.32 kB (gzip: 126.46 kB)
- **Compilation/Syntax Errors:** 0
- **Build Notes:** Non-fatal Rollup notice regarding single JS bundle > 500 kB (standard Vite suggestion for chunk code-splitting).

---

### F. Remaining Limitations
1. **Client-Side Storage Quota:** Store-and-forward queue and audit logs rely on browser `localStorage` (~5MB limit per origin).
2. **Single-User Scope:** Local MVP state does not synchronize across multiple concurrent dispatcher workstations.
3. **Simplified Spatial Routing:** Detour calculation uses planar Euclidean geometry scaled by $1.30$ circuity multiplier rather than turn-by-turn road network graph topology.
4. **Deterministic Heuristic Optimization:** Greedy insertion evaluates single-stop insertions sequentially; global multi-vehicle simultaneous combinatorial routing (VRP/MILP) is future research.
5. **Pre-Trial Status:** Stakeholder validation protocol is formalized in [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md), but empirical field trials with district personnel are pending.

---

### G. Final Submission Checklist
- [x] Greedy Insertion replanning algorithm implemented and strictly verified
- [x] Candidate evaluation, scoring, ranking, and exact insertion position verified
- [x] 6 hard constraints strictly validated before candidate feasibility
- [x] Human-in-the-loop workflow: Accept, Modify (Customizer), and Reject verified
- [x] Uncommitted recommendations staged; zero state mutation prior to dispatcher approval
- [x] Offline store-and-forward queue persisted in localStorage with 9-attribute schema
- [x] Reconnection sync, manual/auto retry, failed action retention verified
- [x] Duplicate action prevention verified across page reload and browser restart
- [x] 5-state GPS model (`LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`) verified
- [x] GPS freshness penalties proven to alter candidate scoring and ranking
- [x] Stale telemetry (>120s) emits verification warnings and review badges
- [x] Manual GPS override with VHF radio provenance implemented and audit logged
- [x] Responsible AI 12-dimension explanation schema and rejection reasons verified
- [x] 6-event lifecycle audit trail with before/after state snapshots verified
- [x] Benchmark evaluates 9 scenarios, separating engine runtime (ms) and review time (s)
- [x] Target recovery SLA ($\le 480$s) met across 100% of scenarios (avg 43.89s)
- [x] 0 hard constraint violations across all benchmark evaluations
- [x] At least 3 edge/failure scenarios verified (breakdown, capacity exhaustion, signal loss, etc.)
- [x] Zero unsupported claims (no fake exponential backoff, cloud backend, live GPS, or fake user validation)
- [x] 10/10 test suites pass cleanly (`npm test`)
- [x] Production build succeeds cleanly (`npm run build`)

