# System Architecture & Workflow Diagram

This document illustrates the actual functional architecture and human-in-the-loop rapid replanning workflow implemented within the application. 

It accurately reflects the in-memory state architecture, the replanning algorithmic flow, the deterministic constraint validations, and the offline fallback capabilities currently present in the codebase.

```mermaid
flowchart TD
    %% Actors
    Dispatcher([Dispatcher / Operations Manager])

    %% UI Layer
    subgraph UI ["Web UI Layer (Vanilla JS Components)"]
        Dashboard[Dashboard / Live Map]
        ReplanningView[AI Replanning View]
        ReportsUI[Evaluation / Reports UI]
    end

    %% State & Data Layer
    subgraph Data ["Application State & Data (store.js)"]
        MockData[(Static Mock Data)]
        AppStore[In-Memory AppStore]
        OfflineQueue[Offline LocalStorage Queue]
    end

    %% Algorithmic Logic
    subgraph Engine ["Rapid Replanning Engine"]
        Trigger[Disruption Triggered]
        Evaluate[Candidate Evaluation Loop]
        
        subgraph Constraints ["Deterministic Constraints"]
            CapCheck{Capacity Check}
            DrvCheck{Driver Availability & Commitments}
            CompCheck{Route Compatibility}
            ProxCheck{Proximity / Distance}
        end
        
        Rank[Scoring & Ranking]
        Rec[Recommendation Generated]
        NoFeasible[No Feasible Solution Fallback]
    end

    %% Workflow & Fallbacks
    subgraph Fallbacks ["Resilience & Fallbacks"]
        NetFail[Network Disconnected]
        GpsFail[GPS Telemetry Lost]
        ManGps[Manual GPS Override]
    end

    %% Connections - Main Workflow
    Dispatcher -->|Monitors| Dashboard
    Dashboard -->|Triggers Breakdown / Urgent Add| Trigger
    Trigger --> Evaluate
    
    Evaluate --> CapCheck
    Evaluate --> DrvCheck
    Evaluate --> CompCheck
    Evaluate --> ProxCheck
    
    CapCheck & DrvCheck & CompCheck & ProxCheck --> Rank
    Rank -->|Candidates Available| Rec
    Rank -->|All Candidates Rejected| NoFeasible
    
    Rec --> ReplanningView
    NoFeasible --> ReplanningView
    
    ReplanningView -->|Review & Accept| Dispatcher
    ReplanningView -->|Review & Modify| Dispatcher
    
    Dispatcher -->|Explicit Approval| AppStore
    
    %% Data Connections
    MockData -->|Initial Load| AppStore
    AppStore --> UI
    AppStore --> Engine
    
    %% Fallback Connections
    NetFail -->|Saves Pending Changes| OfflineQueue
    OfflineQueue -->|Syncs on Reconnect| AppStore
    
    GpsFail -->|Flags 'No Signal'| AppStore
    Dispatcher -->|Inputs Override| ManGps
    ManGps --> AppStore
```

### Architectural Notes
- **State Management:** The application relies on a single, centralized `AppStore` that handles all state transitions, notifying vanilla JS UI components of changes.
- **Human-in-the-Loop:** The AI recommendation engine evaluates permutations deterministically based on hard constraints, but the Dispatcher must explicitly review the tradeoffs and approve the `aiRecommendation` before the active `routeId` or `busId` state is modified.
- **Resilience:** The architecture natively supports network interruption (queuing changes to LocalStorage) and telemetry failure (falling back to manual checkpoint entry by the Dispatcher).
