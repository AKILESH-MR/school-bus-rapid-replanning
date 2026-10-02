# Developer Walkthrough Verification Report & Real Validation Plan

**Project:** School Bus Rapid Replanning & Responsible AI System  
**Version:** 1.0.0 (Internal Verification)  
**Date:** September 2026  
**Status:** Internal Developer Walkthrough Verified; Real Stakeholder Testing Pending  

---

> [!IMPORTANT]
> ### MANDATORY DECLARATION ON STAKEHOLDER VALIDATION
> **No real stakeholder validation has been conducted yet.**  
> - No active school district dispatchers, operations managers, or transport coordinators have operated or evaluated this prototype in live district operations.
> - No real user interviews, satisfaction surveys, or empirical field study data exist for this project.
> - All qualitative walkthrough notes and task completion timings documented below reflect **internal developer verification of procedural workflows** conducted to ensure the user interface and replanning engine function correctly before real stakeholders are engaged.
> - The comprehensive protocol for future human evaluation is formally specified in [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md).

---

## 1. Scope of Internal Developer Verification

Prior to conducting external stakeholder trials, the engineering team executed a structured developer walkthrough protocol across the application's three core disruption workflows. The purpose of this internal walkthrough was strictly technical:

1. Verify that all UI views (`Dashboard`, `ReplanningView`, `BusesView`, `ReportsView`) render without JavaScript console errors.
2. Confirm that human-in-the-loop controls (Accept, Modify, Reject) correctly trigger state mutations in `store.js` without premature automated commits.
3. Validate that 12-dimension explanation cards, candidate rejection reasons, and GPS telematics degradation banners render accurately.
4. Ensure that the prototype is completely prepared for real stakeholder sessions according to [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md).

---

## 2. Procedural Verification of Workflows

The engineering team verified that each workflow can be executed end-to-end within the dashboard application:

### Workflow 1: Student Cancellation Procedure
- **Procedural Steps Verified:**
  1. Trigger cancellation for student Maya Lin on Route 101.
  2. Verify that disruption enters `unresolved` state with `cancellationPending` badge.
  3. Verify that the live route stops and vehicle load are **not** decremented prior to approval.
  4. Click **Accept & Broadcast** and confirm that Maya Lin transitions to `absent_cancelled`, bus load decrements by 1, and an audit event (`CANCELLATION_APPROVE`) is recorded.
- **Internal Technical Result:** Procedural integrity confirmed. In-memory state and audit logs updated correctly.

### Workflow 2: Urgent Student Addition Procedure
- **Procedural Steps Verified:**
  1. Open Add Urgent Student modal and input Noah Davies (requires ADA wheelchair lift, destination Lincoln Middle School).
  2. Verify that non-lift vehicles (e.g. BUS-01) and over-capacity vehicles are filtered out with explicit rejection reasons displayed in the candidate list.
  3. Confirm that the Greedy Insertion Heuristic identifies the optimal insertion index along remaining stops on feasible candidate BUS-02.
  4. Click **Accept Plan** and verify that Noah Davies is assigned to BUS-02, the stop is inserted at the calculated index, and an audit event (`URGENT_ADD_APPROVED`) is recorded.
- **Internal Technical Result:** Constraint enforcement and greedy insertion index preservation confirmed.

### Workflow 3: Vehicle Breakdown & Standby Fleet Swap Procedure
- **Procedural Steps Verified:**
  1. Trigger vehicle breakdown event for BUS-04 at Cole & Haight St with 36 stranded students.
  2. Verify that BUS-04 transitions to `breakdown` status and is excluded from receiving new assignments.
  3. Verify that candidate generator queries available depot standby buses and active standby drivers.
  4. Confirm that standby BUS-05 (54 capacity, ADA lift verified, driver assigned) is recommended.
  5. Click **Approve Fleet Swap & Dispatch** and verify that stranded students are reassigned and audit trail is logged.
- **Internal Technical Result:** Fleet swap and driver assignment locking verified.

---

## 3. Real Stakeholder Validation Scorecard (Blank Pre-Trial Template)

Because **no real stakeholder validation has been conducted yet**, the table below is provided as a blank template for recording future trials with active district personnel:

| Participant ID | Role (Dispatcher / Ops Mgr / Coordinator) | Scenario Tested | $T_{\text{understand}}$ | $T_{\text{review}}$ | $T_{\text{decision}}$ | $T_{\text{e2e}}$ | SLA Met? ($\le 480\text{s}$) | Notes / Usability Friction Observed |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| *Pending Trial* | *Pending Trial* | Student Cancellation | — | — | — | — | [ ] Yes [ ] No | *Awaiting real stakeholder validation session* |
| *Pending Trial* | *Pending Trial* | Urgent Student Add | — | — | — | — | [ ] Yes [ ] No | *Awaiting real stakeholder validation session* |
| *Pending Trial* | *Pending Trial* | Vehicle Breakdown | — | — | — | — | [ ] Yes [ ] No | *Awaiting real stakeholder validation session* |
| *Pending Trial* | *Pending Trial* | Stale GPS Triage | — | — | — | — | [ ] Yes [ ] No | *Awaiting real stakeholder validation session* |
| *Pending Trial* | *Pending Trial* | Offline Queue Sync | — | — | — | — | [ ] Yes [ ] No | *Awaiting real stakeholder validation session* |

---

## 4. Key Limitations & Operational Requirements

1. **Mandatory Human Field Testing Required:**
   - Although automated test suites (10 suites, 212+ unit assertions) pass with 100% success, empirical testing with live dispatchers during active morning commute windows is an essential prerequisite for production deployment.
2. **Simulated Cognitive Load:**
   - Internal developer walkthroughs cannot replicate the high-stress, multi-tasking environment of an active transit dispatch office managing simultaneous radio calls, phone complaints, and driver emergencies.
3. **Institutional Labor & District Policy Validation:**
   - District-specific union rules (e.g., mandatory rest breaks, maximum consecutive driving hours, route bidding rules) must be reviewed by active district labor representatives.

---

## 5. Next Steps for Real Stakeholder Evaluation

1. Convene a working group of 3–5 professional district dispatchers and 1–2 operations supervisors.
2. Execute the protocol detailed in [STAKEHOLDER_VALIDATION_PLAN.md](STAKEHOLDER_VALIDATION_PLAN.md).
3. Record authentic stopwatch times and qualitative feedback on the standardized scorecards.
4. Document all usability friction points and incorporate feedback into the pre-production roadmap.
