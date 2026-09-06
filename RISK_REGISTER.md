# Risk Register: School Bus Rapid Replanning

| Risk ID | Risk Category | Description | Likelihood | Impact | Mitigation Strategy | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Technical | AI Replanning engine produces an infeasible route (e.g. capacity violation, driver conflict). | Low | High | Enforce strict deterministic constraints before any AI recommendation is presented. Engine acts as a recommender, not an autonomous decider. | **Mitigated** |
| **RSK-02** | Operational | Dispatchers blindly accept AI recommendations without verifying context. | Medium | High | Display explicit reasons for recommendation selection. Require manual confirmation step (`Accept / Reject / Modify`) for all replanning actions. | **Mitigated** |
| **RSK-03** | Infrastructure | Loss of GPS signal leading to incorrect bus proximity calculations. | Medium | Medium | Implemented manual checkpoint overrides and explicit UI warnings ("No Signal"). System relies on last-known location. | **Mitigated** |
| **RSK-04** | Infrastructure | Network outage prevents syncing data with cloud. | High | Medium | Implement local storage queue for pending actions. Display "Offline/Degraded" system status to user. Sync resumes when connection is restored. | **Mitigated** |
| **RSK-05** | Technical | Constraint exhaustion: No feasible bus exists for a disruption. | Medium | Low | System correctly identifies state and alerts dispatcher with "No Feasible Solution — Manual Intervention Required" instead of forcing a bad decision. | **Mitigated** |
