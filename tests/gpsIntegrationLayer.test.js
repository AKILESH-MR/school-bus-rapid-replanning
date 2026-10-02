/**
 * Comprehensive Test Suite for GPS Integration Layer
 *
 * Verifies:
 * 1. Provider Abstraction (BaseGPSProvider, MockGPSProvider, BackendGPSProvider)
 * 2. Payload Validation (coordinates range, finite numbers, ISO/epoch timestamps, drift, source, busId)
 * 3. Freshness Calculation & 5 Telematics States (LIVE, LAST_KNOWN, STALE, NO_SIGNAL, MANUAL)
 * 4. Fresh GPS handling (< 60s)
 * 5. Old GPS handling (LAST_KNOWN: 61-120s, STALE: > 120s)
 * 6. Missing GPS handling (NO_SIGNAL, timeout > 600s, missing coords)
 * 7. Invalid coordinates & timestamps rejection
 * 8. Recovery after GPS loss (NO_SIGNAL -> LIVE restoration + audit trail)
 * 9. Manual override preservation against automated GPS updates
 * 10. Backend REST API (POST /api/gps/update, GET /api/gps, GET /api/gps/:busId)
 * 11. Replanning score integration with GPS uncertainty penalties
 * 12. Simulation disclosure (no false claims of real physical hardware)
 */

import assert from 'assert';
import http from 'node:http';
import {
  BaseGPSProvider,
  MockGPSProvider,
  BackendGPSProvider,
  validateGpsPayload,
  classifyGpsFreshness,
  GPS_STATUS,
  GPS_SOURCES,
  GPS_TRUST_LEVELS
} from '../src/utils/gpsProvider.js';
import { createServer } from '../server/server.js';
import { AppStore } from '../src/state/store.js';
import { candidateScorer, replanningEngine } from '../src/utils/replanningEngine.js';

console.log('========================================================================');
console.log('  GPS INTEGRATION LAYER: COMPREHENSIVE TEST SUITE');
console.log('========================================================================\n');

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      }).catch(err => {
        console.error(`❌ [FAIL] ${name}: ${err.message}`);
        throw err;
      });
    } else {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    }
  } catch (err) {
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

// Helper for HTTP requests
function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => { body += chunk.toString(); });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAllTests() {
  // ==========================================================================
  // 1. PROVIDER ABSTRACTION & INTERFACE
  // ==========================================================================
  runTest('1A. BaseGPSProvider throws on unimplemented ingestUpdate', () => {
    const base = new BaseGPSProvider('Generic');
    assert.throws(() => {
      base.ingestUpdate({});
    }, /must be implemented by subclass/);
    assert.strictEqual(base.isSimulated, true);
    assert.strictEqual(base.isExternalConfigured, false);
  });

  runTest('1B. MockGPSProvider is marked simulated with no physical hardware claim', () => {
    const mock = new MockGPSProvider();
    assert.strictEqual(mock.type, 'mock');
    assert.strictEqual(mock.isSimulated, true);
    assert.strictEqual(mock.isExternalConfigured, false);
    const status = mock.getStatus();
    assert.ok(status.disclaimer.includes('No physical vehicle GPS devices'));
  });

  runTest('1C. BackendGPSProvider explicitly declares MVP simulation unless external provider configured', () => {
    const backend = new BackendGPSProvider();
    assert.strictEqual(backend.type, 'backend_rest');
    assert.strictEqual(backend.isSimulated, true);
    assert.strictEqual(backend.isExternalConfigured, false);
    assert.ok(backend.getStatus().disclaimer.includes('No physical vehicle GPS devices'));

    // Configure external provider
    backend.configureExternalProvider('Samsara Fleet Cloud', { apiKey: 'test-key' });
    assert.strictEqual(backend.isSimulated, false);
    assert.strictEqual(backend.isExternalConfigured, true);
    assert.strictEqual(backend.externalProviderName, 'Samsara Fleet Cloud');
    assert.ok(backend.getStatus().disclaimer.includes('Samsara Fleet Cloud'));

    // Reset back to simulated
    backend.resetToSimulatedMode();
    assert.strictEqual(backend.isSimulated, true);
    assert.strictEqual(backend.isExternalConfigured, false);
  });

  // ==========================================================================
  // 2. COORDINATE & TIMESTAMP VALIDATION
  // ==========================================================================
  runTest('2A. Validation: rejects missing or empty busId', () => {
    const r1 = validateGpsPayload({ latitude: 37.77, longitude: -122.42, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r1.isValid, false);
    assert.ok(r1.errors.some(e => e.includes('busId is required')));

    const r2 = validateGpsPayload({ busId: '   ', latitude: 37.77, longitude: -122.42, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r2.isValid, false);
  });

  runTest('2B. Validation: rejects invalid coordinates (out of range, NaN, non-numeric)', () => {
    // Latitude out of range
    const r1 = validateGpsPayload({ busId: 'BUS-01', latitude: 95.5, longitude: -122.42, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r1.isValid, false);
    assert.ok(r1.errors.some(e => e.includes('latitude must be between -90 and 90')));

    const r2 = validateGpsPayload({ busId: 'BUS-01', latitude: -91.0, longitude: -122.42, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r2.isValid, false);

    // Longitude out of range
    const r3 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: 185.0, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r3.isValid, false);
    assert.ok(r3.errors.some(e => e.includes('longitude must be between -180 and 180')));

    const r4 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: -181.0, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r4.isValid, false);

    // NaN / missing
    const r5 = validateGpsPayload({ busId: 'BUS-01', latitude: 'invalid_lat', longitude: -122.42, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r5.isValid, false);
    assert.ok(r5.errors.some(e => e.includes('latitude is required and must be a valid number')));

    const r6 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: null, timestamp: new Date().toISOString(), source: 'rest_api' });
    assert.strictEqual(r6.isValid, false);
  });

  runTest('2C. Validation: rejects invalid or future timestamps (> 5m clock drift)', () => {
    // Unparseable timestamp
    const r1 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: -122.42, timestamp: 'invalid-date', source: 'rest_api' });
    assert.strictEqual(r1.isValid, false);
    assert.ok(r1.errors.some(e => e.includes('timestamp must be a valid ISO 8601 string')));

    // Future timestamp (+10 minutes in the future)
    const futureTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const r2 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: -122.42, timestamp: futureTime, source: 'rest_api' });
    assert.strictEqual(r2.isValid, false);
    assert.ok(r2.errors.some(e => e.includes('timestamp cannot be in the future')));

    // Ancient timestamp (> 1 year ago)
    const ancientTime = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
    const r3 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: -122.42, timestamp: ancientTime, source: 'rest_api' });
    assert.strictEqual(r3.isValid, false);
    assert.ok(r3.errors.some(e => e.includes('timestamp is too ancient')));
  });

  runTest('2D. Validation: rejects missing source field', () => {
    const r1 = validateGpsPayload({ busId: 'BUS-01', latitude: 37.77, longitude: -122.42, timestamp: new Date().toISOString() });
    assert.strictEqual(r1.isValid, false);
    assert.ok(r1.errors.some(e => e.includes('source is required')));
  });

  runTest('2E. Validation: accepts valid payload and normalizes coordinates and timestamps', () => {
    const nowIso = new Date().toISOString();
    const r = validateGpsPayload({
      busId: 'BUS-01',
      latitude: '37.774930',
      longitude: '-122.419420',
      timestamp: nowIso,
      source: 'REST_API',
      speedKmh: 35.5,
      locationName: 'Oakridge Stop'
    });

    assert.strictEqual(r.isValid, true);
    assert.strictEqual(r.errors.length, 0);
    assert.strictEqual(r.normalized.busId, 'BUS-01');
    assert.strictEqual(r.normalized.latitude, 37.77493);
    assert.strictEqual(r.normalized.longitude, -122.41942);
    assert.strictEqual(r.normalized.coords[0], 37.77493);
    assert.strictEqual(r.normalized.coords[1], -122.41942);
    assert.strictEqual(r.normalized.source, 'rest_api');
    assert.strictEqual(r.normalized.speedKmh, 35.5);
    assert.strictEqual(r.normalized.locationName, 'Oakridge Stop');
  });

  // ==========================================================================
  // 3. FRESHNESS & CLASSIFICATION (LIVE, LAST_KNOWN, STALE, NO_SIGNAL, MANUAL)
  // ==========================================================================
  runTest('3A. Fresh GPS (<= 60s): classified as LIVE with HIGH trust and zero penalty', () => {
    const now = Date.now();
    const c1 = classifyGpsFreshness(now - 15000, { referenceTimeMs: now }); // 15s old

    assert.strictEqual(c1.status, 'LIVE');
    assert.strictEqual(c1.isLive, true);
    assert.strictEqual(c1.isLastKnown, false);
    assert.strictEqual(c1.isStale, false);
    assert.strictEqual(c1.isNoSignal, false);
    assert.strictEqual(c1.isManual, false);
    assert.strictEqual(c1.trustLevel, 'HIGH');
    assert.strictEqual(c1.reducedTrustInDistance, false);
    assert.strictEqual(c1.requiresVerification, false);
    assert.strictEqual(c1.warning, null);
    assert.strictEqual(c1.ageSeconds, 15);
  });

  runTest('3B. Old GPS (61s - 120s): classified as LAST_KNOWN with MEDIUM trust', () => {
    const now = Date.now();
    const c2 = classifyGpsFreshness(now - 85000, { referenceTimeMs: now }); // 85s old

    assert.strictEqual(c2.status, 'LAST_KNOWN');
    assert.strictEqual(c2.isLive, false);
    assert.strictEqual(c2.isLastKnown, true);
    assert.strictEqual(c2.isStale, false);
    assert.strictEqual(c2.isNoSignal, false);
    assert.strictEqual(c2.trustLevel, 'MEDIUM');
    assert.strictEqual(c2.reducedTrustInDistance, true);
    assert.strictEqual(c2.requiresVerification, true);
    assert.strictEqual(c2.ageSeconds, 85);
    assert.ok(c2.warning.includes('last-known coordinates'));
  });

  runTest('3C. Old GPS (> 120s): classified as STALE with LOW trust and verification required', () => {
    const now = Date.now();
    const c3 = classifyGpsFreshness(now - 240000, { referenceTimeMs: now }); // 240s (4m) old

    assert.strictEqual(c3.status, 'STALE');
    assert.strictEqual(c3.isLive, false);
    assert.strictEqual(c3.isLastKnown, false);
    assert.strictEqual(c3.isStale, true);
    assert.strictEqual(c3.isNoSignal, false);
    assert.strictEqual(c3.trustLevel, 'LOW');
    assert.strictEqual(c3.reducedTrustInDistance, true);
    assert.strictEqual(c3.requiresVerification, true);
    assert.strictEqual(c3.ageSeconds, 240);
    assert.ok(c3.warning.includes('>2m old'));
  });

  runTest('3D. Missing GPS (> 600s or signal loss flag): classified as NO_SIGNAL with NONE trust', () => {
    const now = Date.now();
    const c4 = classifyGpsFreshness(now - 750000, { referenceTimeMs: now }); // 750s (12.5m) old

    assert.strictEqual(c4.status, 'NO_SIGNAL');
    assert.strictEqual(c4.isLive, false);
    assert.strictEqual(c4.isNoSignal, true);
    assert.strictEqual(c4.trustLevel, 'NONE');
    assert.strictEqual(c4.reducedTrustInDistance, true);
    assert.strictEqual(c4.requiresVerification, true);
    assert.ok(c4.warning.includes('signal lost'));

    // Explicit signal loss flag
    const c4b = classifyGpsFreshness(now - 10000, { isSignalLost: true, referenceTimeMs: now });
    assert.strictEqual(c4b.status, 'NO_SIGNAL');
    assert.strictEqual(c4b.trustLevel, 'NONE');
  });

  runTest('3E. Manual Location Override: classified as MANUAL with MANUAL_VERIFIED trust', () => {
    const now = Date.now();
    const c5 = classifyGpsFreshness(now - 45000, { isManualOverride: true, referenceTimeMs: now });

    assert.strictEqual(c5.status, 'MANUAL');
    assert.strictEqual(c5.isManual, true);
    assert.strictEqual(c5.isLive, false);
    assert.strictEqual(c5.trustLevel, 'MANUAL_VERIFIED');
    assert.strictEqual(c5.reducedTrustInDistance, false);
    assert.strictEqual(c5.requiresVerification, false);
  });

  // ==========================================================================
  // 4. RECOVERY AFTER GPS LOSS
  // ==========================================================================
  runTest('4. Recovery after GPS loss: NO_SIGNAL bus recovers to LIVE upon fresh GPS update', () => {
    const provider = new BackendGPSProvider();

    // Step 1: Bus loses signal
    provider.ingestUpdate({
      busId: 'BUS-RECOVER-01',
      latitude: 37.7680,
      longitude: -122.4550,
      timestamp: new Date(Date.now() - 400000).toISOString(),
      source: 'no_signal'
    });

    const lostState = provider.getBusLocation('BUS-RECOVER-01');
    assert.strictEqual(lostState.status, 'NO_SIGNAL');
    assert.strictEqual(lostState.trustLevel, 'NONE');
    assert.strictEqual(lostState.isNoSignal, true);

    // Step 2: Fresh GPS signal restores (10s old)
    const freshUpdate = provider.ingestUpdate({
      busId: 'BUS-RECOVER-01',
      latitude: 37.7700,
      longitude: -122.4500,
      timestamp: new Date(Date.now() - 10000).toISOString(),
      source: 'rest_api'
    });

    assert.strictEqual(freshUpdate.success, true);
    assert.strictEqual(freshUpdate.classification.status, 'LIVE');
    assert.strictEqual(freshUpdate.classification.trustLevel, 'HIGH');
    assert.strictEqual(freshUpdate.classification.isLive, true);
    assert.strictEqual(freshUpdate.classification.isNoSignal, false);

    const recoveredBus = provider.getBusLocation('BUS-RECOVER-01');
    assert.strictEqual(recoveredBus.status, 'LIVE');
    assert.strictEqual(recoveredBus.latitude, 37.7700);
    assert.strictEqual(recoveredBus.longitude, -122.4500);
  });

  // ==========================================================================
  // 5. MANUAL OVERRIDE PRESERVATION
  // ==========================================================================
  runTest('5A. Manual override: preserved against background automated GPS influx', () => {
    const provider = new BackendGPSProvider();

    // Step 1: Dispatcher sets manual override
    provider.applyManualOverride('BUS-MANUAL-01', [37.7725, -122.4310], 'Civic Center Checkpoint (VHF Confirmed)');
    const manualState = provider.getBusLocation('BUS-MANUAL-01');
    assert.strictEqual(manualState.status, 'MANUAL');
    assert.strictEqual(manualState.isManual, true);
    assert.strictEqual(manualState.coords[0], 37.7725);
    assert.strictEqual(manualState.coords[1], -122.4310);

    // Step 2: Automated background GPS update arrives
    const autoUpdate = provider.ingestUpdate({
      busId: 'BUS-MANUAL-01',
      latitude: 37.7800, // Different coordinates
      longitude: -122.4200,
      timestamp: new Date().toISOString(),
      source: 'mock_telematics'
    });

    // Must preserve manual override!
    assert.strictEqual(autoUpdate.preservedManualOverride, true);
    assert.ok(autoUpdate.message.includes('manual position preserved'));

    const stateAfterAuto = provider.getBusLocation('BUS-MANUAL-01');
    assert.strictEqual(stateAfterAuto.status, 'MANUAL');
    assert.strictEqual(stateAfterAuto.coords[0], 37.7725); // Unchanged!
    assert.strictEqual(stateAfterAuto.coords[1], -122.4310);

    // Step 3: Explicit clearManual releases override to live telematics
    const clearUpdate = provider.ingestUpdate({
      busId: 'BUS-MANUAL-01',
      latitude: 37.7805,
      longitude: -122.4205,
      timestamp: new Date().toISOString(),
      source: 'rest_api'
    }, { clearManual: true });

    assert.strictEqual(clearUpdate.preservedManualOverride, false);
    assert.strictEqual(clearUpdate.classification.status, 'LIVE');
    const stateAfterClear = provider.getBusLocation('BUS-MANUAL-01');
    assert.strictEqual(stateAfterClear.status, 'LIVE');
    assert.strictEqual(stateAfterClear.coords[0], 37.7805);
  });

  // ==========================================================================
  // 6. CLIENT STORE TELEMATICS INTEGRATION
  // ==========================================================================
  runTest('6. AppStore: ingestGpsUpdate updates bus state, freshness and notifies subscribers', () => {
    const store = new AppStore();
    const busId = 'BUS-01';

    let notificationFired = false;
    store.subscribe(() => { notificationFired = true; });

    const res = store.ingestGpsUpdate({
      busId,
      latitude: 37.7735,
      longitude: -122.4255,
      timestamp: new Date(Date.now() - 12000).toISOString(),
      source: 'rest_api',
      locationName: 'Hayes Valley Station'
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.classification.status, 'LIVE');
    assert.strictEqual(notificationFired, true);

    const busState = store.getBusGpsState(busId);
    assert.strictEqual(busState.statusUpper, 'LIVE');
    assert.strictEqual(busState.latitude, 37.7735);
    assert.strictEqual(busState.longitude, -122.4255);
    assert.strictEqual(busState.source, 'rest_api');
  });

  // ==========================================================================
  // 7. REST API ENDPOINT: POST /api/gps/update & GET /api/gps
  // ==========================================================================
  const app = createServer({ dbPath: ':memory:' });
  const serverPort = 3099;
  await app.listen(serverPort);

  try {
    await runTest('7A. REST API: POST /api/gps/update with valid payload returns 200 and updates DB', async () => {
      const nowIso = new Date().toISOString();
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        busId: 'BUS-01',
        latitude: 37.7755,
        longitude: -122.4265,
        timestamp: nowIso,
        source: 'rest_api',
        speedKmh: 32,
        locationName: 'Civic Center West'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.busId, 'BUS-01');
      assert.strictEqual(res.body.coords[0], 37.7755);
      assert.strictEqual(res.body.coords[1], -122.4265);
      assert.strictEqual(res.body.gpsStatus, 'LIVE');
      assert.strictEqual(res.body.trustLevel, 'HIGH');
      assert.strictEqual(res.body.source, 'rest_api');
      assert.strictEqual(res.body.isSimulated, true);
      assert.strictEqual(res.body.isExternalConfigured, false);
      assert.ok(res.body.disclaimer.includes('No physical bus GPS devices attached'));

      // Verify bus in database
      const dbBus = app.db.getBusById('BUS-01');
      assert.strictEqual(dbBus.coords[0], 37.7755);
      assert.strictEqual(dbBus.coords[1], -122.4265);
      assert.strictEqual(dbBus.gpsStatus, 'live');
    });

    await runTest('7B. REST API: POST /api/gps/update with invalid coordinates returns 400', async () => {
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        busId: 'BUS-01',
        latitude: 125.0, // Invalid lat > 90
        longitude: -122.4265,
        timestamp: new Date().toISOString(),
        source: 'rest_api'
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, 'Invalid GPS update payload');
      assert.ok(res.body.details.some(d => d.includes('latitude must be between -90 and 90')));
    });

    await runTest('7C. REST API: POST /api/gps/update with missing bus returns 404', async () => {
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        busId: 'BUS-DOES-NOT-EXIST-999',
        latitude: 37.77,
        longitude: -122.42,
        timestamp: new Date().toISOString(),
        source: 'rest_api'
      });

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error.includes('not found'));
    });

    await runTest('7D. REST API: POST /api/gps/update with stale timestamp (>120s) returns STALE classification', async () => {
      const staleTime = new Date(Date.now() - 200000).toISOString(); // 200s old
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        busId: 'BUS-02',
        latitude: 37.7650,
        longitude: -122.4380,
        timestamp: staleTime,
        source: 'rest_api'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.gpsStatus, 'STALE');
      assert.strictEqual(res.body.trustLevel, 'LOW');
      assert.strictEqual(res.body.isStale, true);
      assert.strictEqual(res.body.requiresVerification, true);
      assert.ok(res.body.ageSeconds >= 199);
    });

    await runTest('7E. REST API: POST /api/gps/update preserves manual override on bus', async () => {
      // Set bus to manual in DB
      const bus = app.db.getBusById('BUS-03');
      bus.gpsStatus = 'manual';
      bus.isManualLocation = true;
      bus.coords = [37.7711, -122.4311];
      app.db.saveBus(bus);

      // Automated GPS update arrives
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        busId: 'BUS-03',
        latitude: 37.7850,
        longitude: -122.4150,
        timestamp: new Date().toISOString(),
        source: 'mock_telematics'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.preservedManualOverride, true);
      assert.strictEqual(res.body.gpsStatus, 'MANUAL');
      assert.strictEqual(res.body.coords[0], 37.7711); // Manual coords preserved!

      const dbBus = app.db.getBusById('BUS-03');
      assert.strictEqual(dbBus.gpsStatus, 'manual');
      assert.strictEqual(dbBus.coords[0], 37.7711);
    });

    await runTest('7F. REST API: GET /api/gps returns telemetry list and provider disclosure', async () => {
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps',
        method: 'GET'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.provider.name, 'BackendGPSProvider');
      assert.strictEqual(res.body.provider.isSimulated, true);
      assert.strictEqual(res.body.provider.isExternalConfigured, false);
      assert.ok(Array.isArray(res.body.telemetry));
      assert.ok(res.body.telemetry.length > 0);

      const bus1 = res.body.telemetry.find(t => t.busId === 'BUS-01');
      assert.ok(bus1);
      assert.strictEqual(bus1.gpsStatus, 'LIVE');
      assert.strictEqual(bus1.source, 'rest_api');
    });

    await runTest('7G. REST API: GET /api/gps/:busId returns individual telematics status', async () => {
      const res = await httpRequest({
        hostname: 'localhost',
        port: serverPort,
        path: '/api/gps/BUS-01',
        method: 'GET'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.busId, 'BUS-01');
      assert.strictEqual(res.body.gpsStatus, 'LIVE');
      assert.strictEqual(res.body.trustLevel, 'HIGH');
    });

  } finally {
    await app.close();
  }

  // ==========================================================================
  // 8. FEEDING GPS STATE INTO REPLANNING SCORE & RECOVERY BEHAVIOR
  // ==========================================================================
  runTest('8. Replanning engine incorporates GPS freshness penalty into candidate scoring', () => {
    const liveScore = candidateScorer.calculateScore({
      additionalDistance: 2.0,
      additionalDelay: 3.0,
      currentLoad: 20,
      capacity: 54,
      requiredSeats: 1,
      existingPassengers: 20,
      driverDistanceMi: 0.5,
      gpsStatus: 'LIVE',
      gpsAgeSeconds: 15
    });

    const staleScore = candidateScorer.calculateScore({
      additionalDistance: 2.0,
      additionalDelay: 3.0,
      currentLoad: 20,
      capacity: 54,
      requiredSeats: 1,
      existingPassengers: 20,
      driverDistanceMi: 0.5,
      gpsStatus: 'STALE',
      gpsAgeSeconds: 250
    });

    assert.strictEqual(liveScore.breakdown.gpsStatus, 'LIVE');
    assert.strictEqual(liveScore.breakdown.gpsDistanceAdjustment, 0.0);
    assert.strictEqual(liveScore.breakdown.requiresDispatcherVerification, false);

    assert.strictEqual(staleScore.breakdown.gpsStatus, 'STALE');
    assert.ok(staleScore.breakdown.gpsDistanceAdjustment >= 4.0, 'STALE penalty must be >= 4.0');
    assert.strictEqual(staleScore.breakdown.requiresDispatcherVerification, true);
    assert.ok(staleScore.totalScore > liveScore.totalScore, 'STALE candidate receives worse score than LIVE');
  });

  console.log('\n------------------------------------------------------------------------');
  console.log(`GPS Integration Layer Tests Summary: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%).`);
  console.log('========================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
