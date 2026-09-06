# School Bus Rapid Replanning

A real-time dashboard and AI-assisted replanning system designed for school district transportation dispatchers. 

## Overview
This system provides visibility into the district's bus fleet, student routing, and driver assignments. In the event of disruptions (student cancellations, urgent additions, or vehicle breakdowns), the embedded rapid replanning engine quickly evaluates deterministic constraints (capacity, driver availability, existing commitments) and recommends feasible solutions to dispatchers.

## Features
- **Live Dispatch Dashboard:** Real-time metrics on fleet status, active routes, and active disruptions.
- **Rapid Replanning Engine:** Evaluates candidate buses for disruption recovery and provides transparent reasons for selection and rejection.
- **Invariant Enforcement:** Strict rules prevent capacity violations and driver conflicts.
- **Offline & Fallback Handling:** Degraded modes for GPS signal loss and network outages.
- **Evaluation Suite:** Built-in benchmarking to compare manual dispatch time against the rapid replanning engine.

## Documentation
- [User Guide](USER_GUIDE.md): Instructions for using the dashboard.
- [Evaluation Report](EVALUATION_REPORT.md): Simulation results comparing the AI engine against a manual baseline.
- [Risk Register](RISK_REGISTER.md): Addressed operational and technical risks.

## Setup & Development

**Prerequisites:** Node.js (v18+)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build the project
npm run build

# Run the test & evaluation suite
npm test
```

## Architecture
- React & Vite
- Leaflet Maps
- Centralized Data Store (`src/state/store.js`)
- Test runner in Node (`tests/`)
