-- ==========================================================================
-- School Bus Rapid Replanning — PostgreSQL Schema Migration
-- Migration: 001_initial_schema
-- Description: Creates all tables for buses, drivers, routes, route_stops,
--              disruptions, replans, replan_candidates, approvals,
--              gps_updates, offline_actions, audit_logs
--
-- NOTE: This is the MVP demonstration schema.
--       No production deployment is claimed.
-- ==========================================================================

-- Enable pgcrypto for gen_random_uuid() if available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --------------------------------------------------------------------------
-- schema_migrations — tracks applied migrations
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_migrations (
  version       TEXT PRIMARY KEY,
  description   TEXT NOT NULL,
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- buses
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buses (
  id                  TEXT PRIMARY KEY,
  plate               TEXT,
  model               TEXT,
  type                TEXT,                          -- Electric, Diesel, Propane, etc.
  capacity            INTEGER NOT NULL DEFAULT 54,
  current_load        INTEGER NOT NULL DEFAULT 0,
  driver_id           TEXT,
  route_id            TEXT,
  status              TEXT NOT NULL DEFAULT 'in_depot',
                                                      -- in_transit|delayed|breakdown|in_depot|maintenance
  fuel_level          INTEGER DEFAULT 100,            -- % battery or fuel
  speed_kmh           NUMERIC(5,1) DEFAULT 0,
  heading             INTEGER DEFAULT 0,              -- degrees 0-359
  coords              NUMERIC(9,6)[] DEFAULT '{37.77,-122.42}',
  gps_status          TEXT NOT NULL DEFAULT 'live',  -- live|last_known|stale|no_signal|manual
  gps_source          TEXT DEFAULT 'mock_telematics',
  age_seconds         INTEGER DEFAULT 0,
  last_gps_sync_ms    BIGINT,
  last_gps_sync       TEXT,
  last_known_location TEXT,
  is_manual_location  BOOLEAN NOT NULL DEFAULT FALSE,
  health_score        INTEGER DEFAULT 100,
  last_inspection     DATE,
  amenities           TEXT[],
  breakdown_note      TEXT,
  raw_json            JSONB NOT NULL DEFAULT '{}',   -- full object for rapid reads
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buses_status   ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_driver   ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_buses_route    ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_buses_gps      ON buses(gps_status);

-- --------------------------------------------------------------------------
-- drivers
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drivers (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  phone                 TEXT,
  license               TEXT,
  rating                NUMERIC(3,1) DEFAULT 4.5,
  experience_yrs        INTEGER DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'active',
                                                        -- active|on_break|sick|standby
  availability_status   TEXT NOT NULL DEFAULT 'active',
  current_assignment    TEXT,
  current_location      NUMERIC(9,6)[],
  location_source       TEXT DEFAULT 'last_known',
  is_location_stale     BOOLEAN NOT NULL DEFAULT FALSE,
  shift_start           TEXT,
  shift_end             TEXT,
  photo                 TEXT,
  raw_json              JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

-- --------------------------------------------------------------------------
-- routes
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  school_id               TEXT NOT NULL,
  school_name             TEXT,
  assigned_bus            TEXT REFERENCES buses(id) ON DELETE SET NULL,
  assigned_driver         TEXT,
  status                  TEXT NOT NULL DEFAULT 'on_time',
                                                          -- on_time|delayed|disrupted|completed
  total_stops             INTEGER DEFAULT 0,
  completed_stops         INTEGER DEFAULT 0,
  total_students          INTEGER DEFAULT 0,
  scheduled_start_time    TEXT,
  scheduled_arrival_time  TEXT,
  current_eta             TEXT,
  delay_minutes           NUMERIC(5,1) DEFAULT 0,
  color                   TEXT DEFAULT '#3b82f6',
  raw_json                JSONB NOT NULL DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_bus    ON routes(assigned_bus);
CREATE INDEX IF NOT EXISTS idx_routes_school ON routes(school_id);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);

-- --------------------------------------------------------------------------
-- route_stops — normalized stop rows (also embedded in routes.raw_json)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS route_stops (
  id              TEXT NOT NULL,
  route_id        TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  sequence_order  INTEGER NOT NULL,
  name            TEXT NOT NULL,
  lat             NUMERIC(9,6),
  lon             NUMERIC(9,6),
  scheduled_time  TEXT,
  students_count  INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'pending',
                                          -- pending|next|completed|delayed|stuck|stranded|destination
  PRIMARY KEY (route_id, id)
);

CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_status ON route_stops(status);

-- --------------------------------------------------------------------------
-- students
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  grade           TEXT,
  school_id       TEXT,
  school_name     TEXT,
  bus_id          TEXT,
  route_id        TEXT,
  stop_name       TEXT,
  pickup_lat      NUMERIC(9,6),
  pickup_lon      NUMERIC(9,6),
  guardian_name   TEXT,
  guardian_phone  TEXT,
  status          TEXT NOT NULL DEFAULT 'waiting',
                                                    -- waiting|boarded|absent_cancelled|urgent_added|stranded
  special_needs   TEXT DEFAULT 'None',
  photo           TEXT,
  raw_json        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_bus    ON students(bus_id);
CREATE INDEX IF NOT EXISTS idx_students_route  ON students(route_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- --------------------------------------------------------------------------
-- disruptions
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disruptions (
  id              TEXT PRIMARY KEY,
  reported_at     TEXT,
  type            TEXT NOT NULL,
                                  -- breakdown|driver_unavailability|student_cancel|urgent_add|traffic_hazard
  title           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'unresolved',
                                                      -- unresolved|replanned|accepted|rejected|completed
  severity        TEXT NOT NULL DEFAULT 'warning',   -- critical|warning|info
  bus_id          TEXT,
  route_id        TEXT,
  student_id      TEXT,
  location        TEXT,
  impact          TEXT,
  ai_recommendation JSONB,
  original_state  JSONB,
  proposed_state  JSONB,
  final_state     JSONB,
  raw_json        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disruptions_status   ON disruptions(status);
CREATE INDEX IF NOT EXISTS idx_disruptions_bus       ON disruptions(bus_id);
CREATE INDEX IF NOT EXISTS idx_disruptions_route     ON disruptions(route_id);
CREATE INDEX IF NOT EXISTS idx_disruptions_severity  ON disruptions(severity);
CREATE INDEX IF NOT EXISTS idx_disruptions_created   ON disruptions(created_at DESC);

-- --------------------------------------------------------------------------
-- replans — AI-generated replanning plans
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS replans (
  id                    TEXT PRIMARY KEY,
  disruption_id         TEXT REFERENCES disruptions(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'pending_review',
                                                              -- pending_review|accepted|rejected|expired
  strategy              TEXT DEFAULT 'Greedy Insertion',
  recommended_bus_id    TEXT,
  recommended_route_id  TEXT,
  score                 NUMERIC(8,4) DEFAULT 0,
  details               JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replans_disruption ON replans(disruption_id);
CREATE INDEX IF NOT EXISTS idx_replans_status     ON replans(status);
CREATE INDEX IF NOT EXISTS idx_replans_created    ON replans(created_at DESC);

-- --------------------------------------------------------------------------
-- replan_candidates — individual candidate buses considered per replan
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS replan_candidates (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  replan_id       TEXT NOT NULL REFERENCES replans(id) ON DELETE CASCADE,
  bus_id          TEXT NOT NULL,
  route_id        TEXT,
  rank            INTEGER NOT NULL,
  score           NUMERIC(8,4) DEFAULT 0,
  is_recommended  BOOLEAN NOT NULL DEFAULT FALSE,
  rejection_reason TEXT,
  score_breakdown JSONB,
  gps_status      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_replan ON replan_candidates(replan_id);
CREATE INDEX IF NOT EXISTS idx_candidates_bus    ON replan_candidates(bus_id);

-- --------------------------------------------------------------------------
-- approvals — dispatcher HITL approval/rejection/modification decisions
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS approvals (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  replan_id         TEXT NOT NULL REFERENCES replans(id) ON DELETE CASCADE,
  disruption_id     TEXT,
  action            TEXT NOT NULL,
                                    -- APPROVED|REJECTED|MODIFIED
  dispatcher_id     TEXT,
  dispatcher_role   TEXT DEFAULT 'dispatcher',
  reason            TEXT,
  modifications     JSONB,          -- constraint overrides if modified
  applied_changes   JSONB,          -- actual state changes made
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_replan     ON approvals(replan_id);
CREATE INDEX IF NOT EXISTS idx_approvals_disruption ON approvals(disruption_id);
CREATE INDEX IF NOT EXISTS idx_approvals_action     ON approvals(action);

-- --------------------------------------------------------------------------
-- gps_updates — incoming GPS telemetry records
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gps_updates (
  id              BIGSERIAL PRIMARY KEY,
  bus_id          TEXT NOT NULL,
  latitude        NUMERIC(9,6) NOT NULL,
  longitude       NUMERIC(9,6) NOT NULL,
  speed_kmh       NUMERIC(5,1),
  heading         INTEGER,
  source          TEXT NOT NULL,
                                  -- rest_api|mock_telematics|manual_dispatcher|mobile_mdt|hardware_gps
  gps_status      TEXT NOT NULL,  -- LIVE|LAST_KNOWN|STALE|NO_SIGNAL|MANUAL
  trust_level     TEXT,
  age_seconds     INTEGER,
  is_manual       BOOLEAN NOT NULL DEFAULT FALSE,
  location_name   TEXT,
  is_simulated    BOOLEAN NOT NULL DEFAULT TRUE,
  payload_json    JSONB,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gps_updates_bus       ON gps_updates(bus_id);
CREATE INDEX IF NOT EXISTS idx_gps_updates_received  ON gps_updates(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_gps_updates_status    ON gps_updates(gps_status);

-- Partial index for recent updates (last 24 hours) — performance optimization
CREATE INDEX IF NOT EXISTS idx_gps_updates_recent ON gps_updates(bus_id, received_at DESC)
  WHERE received_at > NOW() - INTERVAL '24 hours';

-- --------------------------------------------------------------------------
-- offline_actions — store-and-forward queue for idempotent action replay
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offline_actions (
  action_id       TEXT PRIMARY KEY,                  -- client-generated UUID (idempotency key)
  action_type     TEXT NOT NULL,
  user_id         TEXT,
  role            TEXT DEFAULT 'dispatcher',
  status          TEXT NOT NULL DEFAULT 'pending',   -- pending|synced|failed
  payload         JSONB,
  result          JSONB,
  error           TEXT,
  retry_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at       TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uidx_offline_action_id ON offline_actions(action_id);
CREATE INDEX IF NOT EXISTS idx_offline_status  ON offline_actions(status);
CREATE INDEX IF NOT EXISTS idx_offline_created ON offline_actions(created_at);

-- --------------------------------------------------------------------------
-- audit_logs — immutable append-only decision audit trail
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id                TEXT PRIMARY KEY,
  action            TEXT NOT NULL,
  action_type       TEXT,
  user_role         TEXT DEFAULT 'Dispatcher',
  disruption_id     TEXT,
  recommendation_id TEXT,
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  original_state    JSONB,
  proposed_state    JSONB,
  final_state       JSONB,
  event_message     TEXT,
  details           JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp   ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_disruption  ON audit_logs(disruption_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);

-- --------------------------------------------------------------------------
-- updated_at triggers — auto-update timestamps on mutation
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['buses', 'drivers', 'routes', 'students', 'disruptions', 'replans']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- --------------------------------------------------------------------------
-- Record this migration
-- --------------------------------------------------------------------------
INSERT INTO schema_migrations (version, description)
VALUES ('001', 'Initial schema: buses, drivers, routes, route_stops, students, disruptions, replans, replan_candidates, approvals, gps_updates, offline_actions, audit_logs')
ON CONFLICT (version) DO NOTHING;
