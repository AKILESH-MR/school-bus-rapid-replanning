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
```

---

## Technology Stack
- **Frontend Core:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Build Tool:** Vite
- **Mapping & Geospatial:** Leaflet.js with OpenStreetMap tiles
- **Icons:** Lucide Icons
- **State Management:** Reactive in-memory AppStore (`src/state/store.js`) with browser `localStorage` persistence
- **Replanning Engine:** Deterministic Greedy Insertion Heuristic (`src/utils/replanningEngine.js`)
- **Testing & Benchmarks:** Native Node.js test runners (`tests/`)
