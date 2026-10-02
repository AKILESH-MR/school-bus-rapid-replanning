# Core Data Schema Documentation

This document outlines the core domain entities and the relational PostgreSQL persistence layer used within the School Bus Rapid Replanning backend system.

> [!IMPORTANT]
> ### Architectural Reality Notice & Scope
> - **MVP Relational Database Layer:** The backend now includes a complete **PostgreSQL database schema and migration layer** (`server/pg/migrations/001_initial_schema.sql`), with seed data matching the MVP demo fixtures (`server/pg/seed.js`), and isolated behind repository/service abstractions (`server/pg/repositories/*` and `server/pg/db.js`).
> - **Offline & Connection Resilience:** If PostgreSQL is unreachable or connection fails, the system **gracefully falls back** to the local SQLite database (`data/school_bus.db` / `server/db.js`) without crashing or dropping operations.
> - **Client-Side Store & LocalStorage Fallback:** The web client also maintains its offline-first store (`src/state/store.js`) and store-and-forward queue in browser `localStorage` (`school_bus_pending_sync`).
> - **Demonstration Deployment Scope:** This PostgreSQL implementation is an **MVP demonstration database layer**. **No production cloud deployment is claimed.**

---

## 1. PostgreSQL Relational Database Tables

The PostgreSQL schema consists of 11 core tables plus the migration tracker, matching district transport specifications.

### 1.1 `buses`
Represents physical transport fleet assets.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Vehicle identifier (e.g. `"BUS-01"`). |
| `plate` | `TEXT` | | License plate (e.g. `"CA-SCH-8120"`). |
| `model` | `TEXT` | | Vehicle model / make. |
| `type` | `TEXT` | | Fuel / powertrain type (Diesel, Electric, Propane). |
| `capacity` | `INTEGER` | `NOT NULL DEFAULT 54` | Maximum passenger seating capacity. |
| `current_load` | `INTEGER` | `NOT NULL DEFAULT 0` | Current number of assigned/boarded students. |
| `driver_id` | `TEXT` | | Foreign key / reference to assigned driver. |
| `route_id` | `TEXT` | | Current assigned route reference. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'in_depot'` | `in_transit`, `delayed`, `breakdown`, `in_depot`, `maintenance`. |
| `fuel_level` | `INTEGER` | `DEFAULT 100` | Percentage battery or fuel remaining (0-100). |
| `speed_kmh` | `NUMERIC(5,1)`| `DEFAULT 0` | Current ground speed. |
| `heading` | `INTEGER` | `DEFAULT 0` | Compass heading (0-359 degrees). |
| `coords` | `NUMERIC(9,6)[]`| `DEFAULT '{37.77,-122.42}'` | Current `[latitude, longitude]`. |
| `gps_status` | `TEXT` | `NOT NULL DEFAULT 'live'` | `live`, `last_known`, `stale`, `no_signal`, `manual`. |
| `gps_source` | `TEXT` | `DEFAULT 'mock_telematics'` | Origin identifier of telematics fix. |
| `age_seconds` | `INTEGER` | `DEFAULT 0` | Seconds elapsed since coordinate acquisition. |
| `last_gps_sync_ms` | `BIGINT` | | Epoch timestamp in milliseconds. |
| `last_gps_sync` | `TEXT` | | Human-readable time of last fix. |
| `last_known_location`| `TEXT` | | Checkpoint or landmark descriptor. |
| `is_manual_location` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Flag for manual dispatcher checkpoint override. |
| `health_score` | `INTEGER` | `DEFAULT 100` | Preventative maintenance health rating. |
| `amenities` | `TEXT[]` | | Array of vehicle features (e.g. `Wheelchair Lift`). |
| `raw_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Complete domain entity snapshot for high-speed serialization. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Automatically maintained via PostgreSQL trigger. |

**Indexes:** `idx_buses_status`, `idx_buses_driver`, `idx_buses_route`, `idx_buses_gps`.

---

### 1.2 `drivers`
Represents certified fleet operators.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Driver identifier (e.g. `"DRV-101"`). |
| `name` | `TEXT` | `NOT NULL` | Full legal name. |
| `phone` | `TEXT` | | Contact telephone number. |
| `license` | `TEXT` | | CDL credential reference. |
| `rating` | `NUMERIC(3,1)`| `DEFAULT 4.5` | Safety and performance rating. |
| `experience_yrs` | `INTEGER` | `DEFAULT 0` | Years in district service. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'active'` | Operational status (`active`, `on_break`, `sick`, `standby`). |
| `availability_status`| `TEXT` | `NOT NULL DEFAULT 'active'` | Shift availability state. |
| `current_assignment` | `TEXT` | | Active route assignment (`RT-101`). |
| `current_location` | `NUMERIC(9,6)[]`| | Driver coordinates `[lat, lon]`. |
| `location_source` | `TEXT` | `DEFAULT 'last_known'` | Location source (`mobile_gps`, `depot_checkin`). |
| `is_location_stale` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Flag for stale driver location. |
| `shift_start` | `TEXT` | | Scheduled shift start (e.g. `"06:30 AM"`). |
| `shift_end` | `TEXT` | | Scheduled shift end (e.g. `"03:30 PM"`). |
| `photo` | `TEXT` | | Profile avatar URL. |
| `raw_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Complete entity payload. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Update timestamp. |

**Indexes:** `idx_drivers_status`.

---

### 1.3 `routes`
Represents scheduled bus routes connecting stops to destination schools.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Route identifier (e.g. `"RT-101"`). |
| `name` | `TEXT` | `NOT NULL` | Descriptive name (e.g. `"Marina to Oakridge High"`). |
| `school_id` | `TEXT` | `NOT NULL` | Destination school reference (e.g. `"SCH-01"`). |
| `school_name` | `TEXT` | | School display name. |
| `assigned_bus` | `TEXT` | `REFERENCES buses(id) ON DELETE SET NULL` | Assigned bus. |
| `assigned_driver` | `TEXT` | | Assigned driver name or ID. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'on_time'` | Route health (`on_time`, `delayed`, `disrupted`, `completed`). |
| `total_stops` | `INTEGER` | `DEFAULT 0` | Total scheduled stop count. |
| `completed_stops` | `INTEGER` | `DEFAULT 0` | Number of stops serviced so far. |
| `total_students` | `INTEGER` | `DEFAULT 0` | Total expected student manifest. |
| `scheduled_start_time`| `TEXT` | | Planned departure time (e.g. `"07:00 AM"`). |
| `scheduled_arrival_time`| `TEXT` | | Planned school arrival time (e.g. `"08:15 AM"`). |
| `current_eta` | `TEXT` | | Dynamic estimated time of arrival. |
| `delay_minutes` | `NUMERIC(5,1)`| `DEFAULT 0` | Cumulative schedule delay in minutes. |
| `color` | `TEXT` | `DEFAULT '#3b82f6'` | Route path display color hex code. |
| `raw_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Full route object including stops. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Last modification timestamp. |

**Indexes:** `idx_routes_bus`, `idx_routes_school`, `idx_routes_status`.

---

### 1.4 `route_stops`
Normalized waypoint stops associated with routes in strict sequence order.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `NOT NULL` | Waypoint identifier (e.g. `"ST-101-1"`). |
| `route_id` | `TEXT` | `NOT NULL REFERENCES routes(id) ON DELETE CASCADE` | Associated route foreign key. |
| `sequence_order` | `INTEGER` | `NOT NULL` | Numerical waypoint stop order (1, 2, 3...). |
| `name` | `TEXT` | `NOT NULL` | Waypoint name (e.g. `"Chestnut & Fillmore"`). |
| `lat` | `NUMERIC(9,6)`| | Stop latitude. |
| `lon` | `NUMERIC(9,6)`| | Stop longitude. |
| `scheduled_time` | `TEXT` | | Scheduled arrival timestamp. |
| `students_count` | `INTEGER` | `DEFAULT 0` | Number of students boarding at stop. |
| `status` | `TEXT` | `DEFAULT 'pending'` | `pending`, `next`, `completed`, `delayed`, `stuck`, `stranded`. |

**Primary Key:** `(route_id, id)`.
**Indexes:** `idx_route_stops_route`, `idx_route_stops_status`.

---

### 1.5 `students`
Represents registered student passengers and transit assignments.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Student identifier (e.g. `"STU-1001"`). |
| `name` | `TEXT` | `NOT NULL` | Full student name. |
| `grade` | `TEXT` | | Academic grade. |
| `school_id` | `TEXT` | | Destination school. |
| `school_name` | `TEXT` | | Destination school display name. |
| `bus_id` | `TEXT` | | Assigned bus identifier. |
| `route_id` | `TEXT` | | Assigned route identifier. |
| `stop_name` | `TEXT` | | Designated pickup stop name. |
| `pickup_lat` | `NUMERIC(9,6)`| | Stop pickup latitude. |
| `pickup_lon` | `NUMERIC(9,6)`| | Stop pickup longitude. |
| `guardian_name` | `TEXT` | | Guardian contact name. |
| `guardian_phone` | `TEXT` | | Guardian emergency phone. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'waiting'` | `waiting`, `boarded`, `absent_cancelled`, `urgent_added`, `stranded`. |
| `special_needs` | `TEXT` | `DEFAULT 'None'` | Accommodations (e.g. `"Wheelchair Accessibility Required"`). |
| `photo` | `TEXT` | | Student photo avatar URL. |
| `raw_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Complete student profile. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Last update timestamp. |

**Indexes:** `idx_students_bus`, `idx_students_route`, `idx_students_status`.

---

### 1.6 `disruptions`
Represents operational incidents requiring human-in-the-loop rapid replanning.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Disruption ID (e.g. `"DIS-2026-001"`). |
| `reported_at` | `TEXT` | | Reporting time (e.g. `"07:30 AM"`). |
| `type` | `TEXT` | `NOT NULL` | `breakdown`, `urgent_add`, `student_cancel`, `driver_unavailability`, `traffic_hazard`. |
| `title` | `TEXT` | `NOT NULL` | Summary headline. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'unresolved'` | `unresolved`, `replanned`, `accepted`, `rejected`, `completed`. |
| `severity` | `TEXT` | `NOT NULL DEFAULT 'warning'` | `critical`, `warning`, `info`. |
| `bus_id` | `TEXT` | | Affected vehicle identifier. |
| `route_id` | `TEXT` | | Affected route identifier. |
| `student_id` | `TEXT` | | Primary affected student if applicable. |
| `location` | `TEXT` | | Location descriptor. |
| `impact` | `TEXT` | | Impact summary. |
| `ai_recommendation`| `JSONB` | | Embedded structured AI replanning recommendation. |
| `original_state` | `JSONB` | | Baseline snapshot before resolution. |
| `proposed_state` | `JSONB` | | Staged proposed mutation state. |
| `final_state` | `JSONB` | | Committed state applied upon human approval. |
| `raw_json` | `JSONB` | `NOT NULL DEFAULT '{}'` | Complete disruption payload. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Last updated. |

**Indexes:** `idx_disruptions_status`, `idx_disruptions_bus`, `idx_disruptions_route`, `idx_disruptions_severity`, `idx_disruptions_created`.

---

### 1.7 `replans`
Stores AI-generated candidate replan recommendations generated by the Greedy Insertion engine.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Plan ID (e.g. `"REPLAN-1727618293-101"`). |
| `disruption_id` | `TEXT` | `REFERENCES disruptions(id) ON DELETE CASCADE` | Associated disruption event. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'pending_review'` | `pending_review`, `approved`, `rejected`, `expired`. |
| `strategy` | `TEXT` | `DEFAULT 'Greedy Insertion'` | Selected heuristic strategy. |
| `recommended_bus_id`| `TEXT` | | Vehicle designated as best candidate. |
| `recommended_route_id`| `TEXT` | | Target route for student insertion or vehicle substitute. |
| `score` | `NUMERIC(8,4)`| `DEFAULT 0` | Multi-criteria heuristic evaluation score. |
| `details` | `JSONB` | `NOT NULL DEFAULT '{}'` | Full replanning result object. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Plan calculation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Update timestamp. |

**Indexes:** `idx_replans_disruption`, `idx_replans_status`, `idx_replans_created`.

---

### 1.8 `replan_candidates`
Stores individual candidate buses evaluated during a replanning run with heuristic scores and constraint check results.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY DEFAULT gen_random_uuid()::TEXT` | Candidate evaluation ID. |
| `replan_id` | `TEXT` | `NOT NULL REFERENCES replans(id) ON DELETE CASCADE` | Replan plan foreign key. |
| `bus_id` | `TEXT` | `NOT NULL` | Evaluated bus ID. |
| `route_id` | `TEXT` | | Evaluated route ID. |
| `rank` | `INTEGER` | `NOT NULL` | Rank order (1 = top recommendation). |
| `score` | `NUMERIC(8,4)`| `DEFAULT 0` | Composite score incorporating GPS freshness penalty. |
| `is_recommended` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Flag for highest-ranking recommended vehicle. |
| `rejection_reason` | `TEXT` | | Explicit reason if rejected (e.g. `"Capacity exceeded"`). |
| `score_breakdown` | `JSONB` | | Detailed breakdown of delay, distance, load, and GPS trust. |
| `gps_status` | `TEXT` | | GPS state at evaluation time (`LIVE`, `STALE`, etc.). |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Evaluation timestamp. |

**Indexes:** `idx_candidates_replan`, `idx_candidates_bus`.

---

### 1.9 `approvals`
Audit-protected log of human dispatcher review, approval, modification, or rejection decisions.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY DEFAULT gen_random_uuid()::TEXT` | Approval record ID. |
| `replan_id` | `TEXT` | `NOT NULL REFERENCES replans(id) ON DELETE CASCADE` | Replan reference. |
| `disruption_id` | `TEXT` | | Disruption reference. |
| `action` | `TEXT` | `NOT NULL` | Dispatcher decision: `APPROVED`, `REJECTED`, `MODIFIED`. |
| `dispatcher_id` | `TEXT` | | ID of reviewing dispatcher. |
| `dispatcher_role` | `TEXT` | `DEFAULT 'dispatcher'` | Role authority (`Dispatcher`, `Admin`). |
| `reason` | `TEXT` | | Mandatory explanation when rejecting or modifying. |
| `modifications` | `JSONB` | | Overridden constraints if modified by dispatcher. |
| `applied_changes` | `JSONB` | | Snapshot of entity mutations committed to database. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Decision timestamp. |

**Indexes:** `idx_approvals_replan`, `idx_approvals_disruption`, `idx_approvals_action`.

---

### 1.10 `gps_updates`
Time-series log of raw telematics updates ingested through `POST /api/gps/update`.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Auto-incrementing telemetry sequence. |
| `bus_id` | `TEXT` | `NOT NULL` | Vehicle identifier. |
| `latitude` | `NUMERIC(9,6)`| `NOT NULL` | WGS84 latitude (-90 to 90). |
| `longitude` | `NUMERIC(9,6)`| `NOT NULL` | WGS84 longitude (-180 to 180). |
| `speed_kmh` | `NUMERIC(5,1)`| | Ground speed in km/h. |
| `heading` | `INTEGER` | | Heading angle (0-359 degrees). |
| `source` | `TEXT` | `NOT NULL` | `hardware_gps`, `mock_telematics`, `manual_dispatcher`, `no_signal`. |
| `gps_status` | `TEXT` | `NOT NULL` | Freshness tier: `LIVE`, `LAST_KNOWN`, `STALE`, `NO_SIGNAL`, `MANUAL`. |
| `trust_level` | `TEXT` | | Confidence tier: `HIGH`, `MEDIUM`, `LOW`, `NONE`, `MANUAL_VERIFIED`. |
| `age_seconds` | `INTEGER` | | Age of telemetry fix in seconds. |
| `is_manual` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Flag for manual radio landmark override. |
| `location_name` | `TEXT` | | Optional landmark checkpoint label. |
| `is_simulated` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Flag declaring simulated MVP origin. |
| `payload_json` | `JSONB` | | Complete unparsed request payload. |
| `received_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Ingestion timestamp. |

**Indexes:** `idx_gps_updates_bus`, `idx_gps_updates_received`, `idx_gps_updates_status`, partial index on last 24h.

---

### 1.11 `offline_actions`
Persistent store-and-forward transaction queue preserving offline operations with strict idempotency deduplication.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `action_id` | `TEXT` | `PRIMARY KEY` | Globally unique UUID idempotency key generated by client. |
| `action_type` | `TEXT` | `NOT NULL` | `REPLAN_ACCEPT`, `REPLAN_MODIFY`, `MANUAL_BUS_LOCATION`, `CREATE_DISRUPTION`. |
| `user_id` | `TEXT` | | Submitting user ID. |
| `role` | `TEXT` | `DEFAULT 'dispatcher'` | Submitting user role. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'pending'` | Transaction state: `pending`, `synced`, `failed`. |
| `payload` | `JSONB` | | Immutable transaction parameters. |
| `result` | `JSONB` | | Execution result or error diagnostic. |
| `error` | `TEXT` | | Failure description if rejected. |
| `retry_count` | `INTEGER` | `NOT NULL DEFAULT 0` | Number of synchronization attempts. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Creation timestamp. |
| `synced_at` | `TIMESTAMPTZ`| | Confirmation timestamp upon database commit. |
| `last_attempt_at` | `TIMESTAMPTZ`| | Timestamp of most recent replay attempt. |

**Indexes:** `uidx_offline_action_id` (Unique), `idx_offline_status`, `idx_offline_created`.

---

### 1.12 `audit_logs`
Immutable append-only audit trail capturing all operational lifecycle events.

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique audit log ID (e.g. `"LOG-1727618293-54"`). |
| `action` | `TEXT` | `NOT NULL` | Event tag (`RECOMMENDATION_ACCEPTED`, `DISRUPTION_REPORTED`, etc.). |
| `action_type` | `TEXT` | | Fine-grained action type code. |
| `user_role` | `TEXT` | `DEFAULT 'Dispatcher'` | User role responsible for action. |
| `disruption_id` | `TEXT` | | Linked disruption event ID. |
| `recommendation_id` | `TEXT` | | Linked recommendation plan ID. |
| `timestamp` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | ISO event timestamp. |
| `original_state` | `JSONB` | | State before action execution. |
| `proposed_state` | `JSONB` | | Proposed change state. |
| `final_state` | `JSONB` | | Committed state resulting from action. |
| `event_message` | `TEXT` | | Human-readable audit narrative. |
| `details` | `JSONB` | | Structured diagnostic payload. |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT NOW()` | Immutable log creation timestamp. |

**Indexes:** `idx_audit_logs_timestamp`, `idx_audit_logs_disruption`, `idx_audit_logs_action_type`.

---

## 2. Invariants & Guarantees

1. **Idempotency Guarantee:**
   `offline_actions.action_id` is an enforced `PRIMARY KEY`. When a batch of store-and-forward actions is transmitted to `/api/sync`, the backend checks `isActionSynced(actionId)` before applying side effects. Duplicates are flagged `ALREADY_SYNCED` and never re-execute vehicle or route mutations.

2. **Immutable Audit Guarantee:**
   `audit_logs` is strictly append-only. No `UPDATE` or `DELETE` SQL statement is ever executed on `audit_logs`.

3. **Graceful Connection Fallback:**
   If PostgreSQL is unavailable at boot or drops connection mid-operation, the backend factory (`server/databaseFactory.js`) catches the error, emits a descriptive warning, and falls back to local SQLite storage with identical schema and domain method support.
