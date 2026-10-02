# Stakeholder Validation Plan: School Bus Rapid Replanning

**Project:** School Bus Rapid Replanning & Responsible AI System  
**Version:** 1.0.0  
**Status:** Validation Protocol & Plan (Pre-Trial Specification)  

---

> [!IMPORTANT]
> ### MANDATORY STATUS DECLARATION
> **No real stakeholder validation has been conducted yet.**  
> The current system has undergone rigorous automated testing (10 test suites, 212+ unit assertions) and mathematical task-walkthrough simulations. However, **no real dispatchers, operations managers, or transport coordinators have operated or evaluated this prototype in live district operations.**  
> This document specifies the formal, reproducible protocol for conducting real human stakeholder evaluations prior to district deployment. No fake results, fabricated quotes, or synthetic satisfaction percentages are contained in this plan.

---

## 1. Purpose of Validation

The purpose of this stakeholder validation plan is to evaluate the School Bus Rapid Replanning decision-support system with actual district transportation personnel in a controlled testing environment. Specifically, the validation seeks to:

1. **Verify Operational Usability:** Ensure transportation dispatchers can intuitively navigate disruption alerts, inspect AI recommendations, customize constraints, and execute dispatch actions under morning peak time pressure.
2. **Evaluate Explainability & Transparency:** Determine whether the 12-dimension explanation schema and explicit candidate rejection reasons provide sufficient clarity for dispatchers to trust and understand AI route selections without blind automation.
3. **Assess Resilience Fallback Comprehension:** Verify that dispatchers correctly understand GPS telemetry degradation warnings (stale GPS penalties, manual landmark updates) and offline store-and-forward queue behaviors.
4. **Quantify Real-World Decision Latency:** Empirically measure human review and decision times to validate whether end-to-end recovery times consistently meet the district SLA target ($\le 480$ seconds / 8 minutes).
5. **Identify Gaps & Failure Modes:** Uncover workflow friction, confusing UI terminology, or missing operational constraints before pilot district deployment.

---

## 2. Target Users & Personas

The validation protocol targets three distinct district transportation roles:

### 2.1 Primary User: School Bus Dispatcher
- **Operational Profile:** Frontline operations staff seated at the computer-aided dispatch console during active morning (06:00–08:30) and afternoon (14:00–16:30) transit windows.
- **Key Responsibilities:** Radio communication with bus drivers, triage of incoming parent cancellations, urgent pickup coordination, and emergency response during vehicle stalls or accidents.
- **Validation Focus:** Time to review AI proposals, ease of accepting/modifying/rejecting plans, manual coordinate overrides, and understanding telematics warnings.

### 2.2 Secondary User: Transportation Operations Manager
- **Operational Profile:** Supervisory district official responsible for fleet budget, route efficiency, SLA compliance, driver union compliance, and student transit safety.
- **Key Responsibilities:** Reviewing daily incident logs, analyzing system recovery times, auditing overrides, and ensuring district policies are enforced.
- **Validation Focus:** Audit trail completeness, decision reconstruction clarity, SLA dashboard analytics, and regulatory compliance verification.

### 2.3 Tertiary User: Special Education Transport Coordinator (If Applicable)
- **Operational Profile:** District liaison responsible for students with Individualized Education Programs (IEPs), specialized mobility equipment, and ADA compliance.
- **Key Responsibilities:** Verifying that vehicles assigned to wheelchair-dependent students strictly meet physical lift and securement requirements.
- **Validation Focus:** ADA wheelchair lift constraint enforcement, specialized student dwell time calculations, and medical safety safeguards.

---

## 3. Test Scenarios

Evaluators will guide stakeholders through three standardized operational disruption scenarios:

### Scenario A: Student Cancellation Workflow
- **Context:** A parent submits an emergency illness notification for student Maya Lin on Route 101.
- **Initial Operational State:** Vehicle BUS-01 is en-route; 42/54 seats occupied; stop scheduled at Japantown Plaza.
- **System Proposed State:** AI identifies that Maya Lin is the sole passenger at Japantown Plaza, proposes bypassing the stop, frees 1 seat, and saves ~3.5 minutes of dwell/travel time. Live operational manifests remain uncommitted.
- **Key Validation Objective:** Verify that the dispatcher notices the `cancellationPending` review badge, inspects projected savings, and understands that the bus load is NOT decremented until explicit approval.

### Scenario B: Urgent Student Addition Workflow
- **Context:** An urgent last-minute pickup request is received for student Noah Davies destined for Lincoln Middle School. Noah requires an ADA wheelchair lift.
- **Initial Operational State:** Multiple vehicles are active across the sector; some vehicles are full, others lack wheelchair lifts, and some drivers have schedule conflicts.
- **System Proposed State:** AI filters the fleet against hard constraints, rejects non-lift buses (e.g., BUS-01) and over-capacity buses, evaluates greedy insertion positions along remaining stops, and recommends BUS-02 with minimal detour delay.
- **Key Validation Objective:** Verify that the dispatcher notices the ADA wheelchair verification flag, understands why full or non-lift buses were rejected, and can inspect the exact stop insertion index.

### Scenario C: Vehicle Breakdown & Fleet Swap Workflow
- **Context:** Vehicle BUS-04 suffers a mechanical breakdown at Cole & Haight St with 36 stranded students aboard.
- **Initial Operational State:** Morning run in progress; destination schools expect arrival within 25 minutes.
- **System Proposed State:** BUS-04 status transitions to `breakdown`. AI identifies uncompleted stops, queries available depot standby buses and active drivers, verifies capacity ($\ge 36$ seats), and proposes dispatching standby BUS-05 from Central Depot.
- **Key Validation Objective:** Verify that the dispatcher can execute an emergency fleet swap, verify driver assignment, and understand fallback escalation procedures if fleet capacity were exhausted.

---

## 4. Tasks the Stakeholder Should Perform

During the test session, participants will be asked to complete the following specific, hands-on tasks without facilitator prompting:

| Task # | Task Description | Target Scenario | Participant Goal |
| :-: | :--- | :---: | :--- |
| **T-1** | **Identify Disruption:** Open the dashboard and locate the pending disruption alert. | All Scenarios | Locate and explain the disruption type, affected bus, and affected route within 15 seconds. |
| **T-2** | **Inspect AI Recommendation:** Open the detailed replanning view and read the proposal. | Scenarios A, B, C | Articulate which bus is selected, the calculated delay impact, and why alternative buses were rejected. |
| **T-3** | **Verify Constraints & Telematics:** Inspect the data quality and constraints checklist. | Scenario B | Confirm that the vehicle has an ADA wheelchair lift and check whether GPS data is LIVE or STALE. |
| **T-4** | **Execute Decision (Accept / Modify / Reject):** Take operational action on the recommendation. | Scenarios A, B, C | Approve the plan, customize parameters via the Constraint Customizer, or reject with documented reason. |
| **T-5** | **Respond to Stale GPS Warning:** Triage a scenario where vehicle telemetry is $> 120\text{s}$ old. | GPS Degraded | Identify the warning banner, recognize reduced distance confidence, and complete dispatcher verification. |
| **T-6** | **Enter Manual GPS Coordinates:** Input a vehicle position received over two-way radio. | Telemetry Loss | Use the Manual GPS Checkpoint modal to update vehicle coordinates and verify the `MANUAL` badge. |
| **T-7** | **Triage Network Disconnection:** Perform an operational action while in offline mode. | Offline Mode | Observe that the action is preserved in the local queue (`PENDING`), verify badge count, and initiate sync on reconnect. |
| **T-8** | **Inspect Audit Trail:** Verify that the approved operational action was recorded permanently. | Post-Action | Locate the audit event in the log, confirming before/after snapshots and dispatcher user ID. |

---

## 5. What Should Be Measured

Facilitators will record quantitative timing data via stopwatch and qualitative assessment scores:

### 5.1 Quantitative Timing Metrics (Seconds):
1. **Time to Understand Disruption ($T_{\text{understand}}$):** Elapsed seconds from alert presentation until participant verbally states the disruption nature and affected students/routes.
2. **Time to Review Recommendation ($T_{\text{review}}$):** Elapsed seconds spent reading the selected bus, route impact, rejection reasons, and telematics status.
3. **Time to Execute Decision ($T_{\text{decision}}$):** Elapsed seconds required to click Accept, modify constraints, or submit a rejection rationale.
4. **Total End-to-End Recovery Time ($T_{\text{e2e}}$):** Total operational recovery duration:
   $$T_{\text{e2e}} = T_{\text{understand}} + T_{\text{review}} + T_{\text{decision}} + T_{\text{engine}}$$
   *(Target SLA: $T_{\text{e2e}} \le 480\text{ seconds}$ / 8.0 minutes).*

### 5.2 Qualitative Assessment Dimensions (1–5 Likert Scale):
5. **Explanation & Transparency Usefulness:** Does the 12-dimension explanation card clearly justify the selection and rejection of vehicles?
6. **GPS Uncertainty Understanding:** Does the participant recognize when GPS is stale or degraded, and do they understand why distance confidence is discounted?
7. **Offline Store-and-Forward Comprehension:** Does the participant feel confident that actions taken during network loss are safe and will not be lost or double-executed?
8. **Manual Fallback Usability:** Is the manual coordinate/landmark input process fast, clear, and usable under radio-dispatch conditions?
9. **Constraint Customizer Flexibility:** Is the ability to adjust maximum delay, preferred bus, and capacity limits clear and responsive?

---

## 6. Feedback Questions for Stakeholders

Following completion of the test scenarios, facilitators will administer a structured post-test interview:

### Usability & Decision-Support Questions:
1. *"Did the system clearly explain WHY a specific bus was recommended over alternatives?"* (Scale 1–5 + Comments)
2. *"Did you at any point feel the system was making changes without your explicit knowledge or permission?"* (Yes / No + Explanation)
3. *"How easy or difficult was it to adjust constraints (such as maximum delay or preferred bus) when you disagreed with the initial recommendation?"* (Scale 1–5 + Comments)

### Trust & Telematics Questions:
4. *"When the GPS was marked as STALE, did the warning message and explanation help you understand that distance calculations were less certain?"* (Scale 1–5 + Comments)
5. *"Would you trust the offline queue to preserve your actions during an internet drop, or would you worry about losing data or creating duplicate stops?"* (Comments)
6. *"How does the speed of this automated workflow compare to your current manual telephone and radio dispatch routine?"* (Comments)

### Operations & Safety Questions (Operations Managers & Coordinators):
7. *"Did the audit log provide sufficient detail to reconstruct the exact data state present when an override or plan was approved?"* (Scale 1–5 + Comments)
8. *"Were special needs and ADA wheelchair lift requirements enforced strictly enough to satisfy district safety compliance?"* (Scale 1–5 + Comments)
9. *"What critical district rules or union constraints are missing from the current candidate evaluation engine?"* (Open Feedback)

---

## 7. Acceptance Criteria for Production Readiness

Before the rapid replanning system can be recommended for live district field pilots, stakeholder validation must achieve the following objective criteria:

| Metric / Dimension | Target Acceptance Threshold | Rationale |
| :--- | :---: | :--- |
| **SLA Compliance Rate** | $\ge 95\%$ of trials $\le 480\text{ seconds}$ | Guarantees emergency disruptions are resolved within the 8-minute morning bell-time window. |
| **Task Completion Rate** | $100\%$ on standard scenarios | Dispatchers must be able to resolve standard cancellations, additions, and breakdowns without facilitator aid. |
| **Constraint Violation Count** | **Strictly 0 violations** | Zero tolerance for assigning over-capacity buses, non-lift buses to wheelchair students, or off-duty drivers. |
| **Explanation Clarity Rating** | Mean $\ge 4.0 / 5.0$ | Dispatchers must clearly understand algorithmic rationales to prevent automation complacency or distrust. |
| **GPS Uncertainty Comprehension** | $\ge 90\%$ correct identification | Dispatchers must correctly identify when GPS is degraded and articulate why extra verification is required. |
| **Duplicate Prevention Verification** | $100\%$ duplicate suppression | Multi-clicks or reconnect retries must never create duplicate stops or corrupt manifests. |
| **HITL Governance Adherence** | $100\%$ explicit approval | Zero instances of automated self-commit without human confirmation. |

---

## 8. How Results Should Be Recorded

Results from validation sessions must be logged using the standardized scorecard below. Evaluators must archive all completed scorecards in project audit records:

### Standardized Stakeholder Validation Scorecard (Template)

```text
SESSION METADATA:
Session ID: VAL-SESSION-___________    Date / Time: ________________________
Participant Role: [ ] Dispatcher  [ ] Operations Manager  [ ] Transport Coordinator
Experience in Role: _______ years       Facilitator Name: ___________________
Environment: [ ] Controlled Usability Lab  [ ] Dispatch Workstation Simulation

QUANTITATIVE MEASUREMENTS:
-----------------------------------------------------------------------------------------
Scenario               | T_understand | T_review | T_decision | T_e2e (sec) | SLA Met? (<=480s)
-----------------------------------------------------------------------------------------
1. Student Cancel      | _______ s    | ______ s | ________ s | _______ s   | [ ] Yes  [ ] No
2. Urgent Student Add  | _______ s    | ______ s | ________ s | _______ s   | [ ] Yes  [ ] No
3. Vehicle Breakdown   | _______ s    | ______ s | ________ s | _______ s   | [ ] Yes  [ ] No
4. Stale GPS Triage    | _______ s    | ______ s | ________ s | _______ s   | [ ] Yes  [ ] No
5. Offline Queue Sync  | _______ s    | ______ s | ________ s | _______ s   | [ ] Yes  [ ] No
-----------------------------------------------------------------------------------------

QUALITATIVE RATINGS (1 = Very Poor / Difficult, 5 = Excellent / Very Clear):
1. Explanation & Transparency Usefulness:     [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
2. Rejection Reasons Clarity:                 [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
3. GPS Uncertainty Warning Clarity:           [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
4. Offline Queue Visibility & Confidence:     [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
5. Manual Location Override Usability:        [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
6. Constraint Customizer Flexibility:         [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
7. Overall Decision-Support Trust:            [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

QUALITATIVE OBSERVATIONS & FRICTION LOG:
Task # | Participant Actions & Comments                    | UI Friction / Confusion Observed
-----------------------------------------------------------------------------------------
       |                                                   |
       |                                                   |
       |                                                   |

FACILITATOR SIGN-OFF:
Facilitator Signature: ___________________________   Date: _________________
```

---

## 9. Difference Between Simulated Validation and Real Stakeholder Validation

To maintain rigorous technical and ethical integrity, the critical differences between simulated walkthroughs and live stakeholder trials are contrasted below:

| Dimension | Simulated Walkthrough (What Exists Now) | Real Stakeholder Validation (Future Requirement) |
| :--- | :--- | :--- |
| **Participants** | Software developers, automated test scripts, and synthetic persona walkthroughs. | Active professional district bus dispatchers, operations supervisors, and coordinators. |
| **Operating Environment** | Local development machine, simulated network toggles, and static test data fixtures. | Active district transportation control center with live ambient radio and telephone traffic. |
| **Cognitive Load** | Low; evaluator understands software internals and algorithm scoring weights. | High; dispatcher manages multiple simultaneous interruptions, driver queries, and parent calls. |
| **Timing Telemetry** | Mathematical task models ($741.7\text{s}$ simulated baseline, $15\text{s} - 180\text{s}$ review windows). | Empirical stopwatch timings capturing authentic human cognitive friction, hesitation, and reading speeds. |
| **Subjective Feedback** | Theoretical usability heuristics and architectural design checklists. | Genuine human qualitative feedback, operational critique, and institutional edge case identification. |
| **Current Project Status** | **100% Completed & Verified by Unit Tests.** | **NOT CONDUCTED YET — Mandatory prerequisite for live district rollout.** |
