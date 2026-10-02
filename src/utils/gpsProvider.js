/**
 * GPS Integration Layer for School Bus Rapid Replanning MVP
 *
 * Provides:
 * - Common GPS telemetry enums and freshness classification
 * - Strict coordinate and timestamp validation
 * - BaseGPSProvider interface/abstraction
 * - MockGPSProvider for development, simulation, and automated testing
 * - BackendGPSProvider for ingesting updates through the REST API
 *
 * IMPORTANT:
 * - This layer operates on simulated and API-ingested telemetry for MVP demonstration.
 * - No real physical vehicle GPS devices are attached.
 * - Live telematics integration is NOT claimed unless an actual external provider is configured.
 * - Supports 5 distinct states: LIVE, LAST_KNOWN, STALE, NO_SIGNAL, MANUAL.
 * - Preserves manual overrides and conservative safe fallbacks.
 */

export const GPS_STATUS = Object.freeze({
  LIVE: 'LIVE',
  LAST_KNOWN: 'LAST_KNOWN',
  STALE: 'STALE',
  NO_SIGNAL: 'NO_SIGNAL',
  MANUAL: 'MANUAL'
});

export const GPS_FRESHNESS_THRESHOLDS = Object.freeze({
  LIVE_MAX_AGE_SECONDS: 60,       // <= 60s is considered fresh LIVE telemetry
  LAST_KNOWN_MAX_AGE_SECONDS: 120, // 61s - 120s is degraded LAST_KNOWN position
  STALE_MAX_AGE_SECONDS: 600       // 121s - 600s is STALE (>2m old, low trust)
  // > 600s or missing signal is classified as NO_SIGNAL
});

export const GPS_SOURCES = Object.freeze({
  MOCK_TELEMATICS: 'mock_telematics',
  REST_API: 'rest_api',
  MANUAL_DISPATCHER: 'manual_dispatcher',
  MOBILE_MDT: 'mobile_mdt',
  LAST_KNOWN_CACHE: 'last_known',
  NO_SIGNAL: 'no_signal',
  HARDWARE_GPS: 'hardware_gps' // Only when external provider is physically configured
});

export const GPS_TRUST_LEVELS = Object.freeze({
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  NONE: 'NONE',
  MANUAL_VERIFIED: 'MANUAL_VERIFIED'
});

/**
 * Validates incoming GPS telemetry payload according to strict operational criteria.
 *
 * Requirements:
 * - busId: non-empty string
 * - latitude: number, -90 <= lat <= 90
 * - longitude: number, -180 <= lon <= 180
 * - timestamp: valid ISO 8601 string or numeric timestamp (ms), not in the future (> 5 min drift)
 * - source: non-empty string
 *
 * @param {object} payload
 * @param {object} [options]
 * @returns {{ isValid: boolean, errors: string[], normalized: object|null }}
 */
export function validateGpsPayload(payload, options = {}) {
  const errors = [];
  const maxFutureDriftMs = options.maxFutureDriftMs || 5 * 60 * 1000; // 5 minutes max clock drift

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['GPS payload must be a non-null object'], normalized: null };
  }

  // 1. Validate busId
  const busId = payload.busId !== undefined && payload.busId !== null ? String(payload.busId).trim() : '';
  if (!busId) {
    errors.push('busId is required and must be a non-empty string');
  }

  // 2. Validate latitude
  const rawLat = payload.latitude !== undefined ? payload.latitude : (Array.isArray(payload.coords) ? payload.coords[0] : undefined);
  const latNum = Number(rawLat);
  if (rawLat === undefined || rawLat === null || rawLat === '' || isNaN(latNum)) {
    errors.push('latitude is required and must be a valid number');
  } else if (!Number.isFinite(latNum)) {
    errors.push('latitude must be a finite number');
  } else if (latNum < -90 || latNum > 90) {
    errors.push(`latitude must be between -90 and 90 degrees (received ${latNum})`);
  }

  // 3. Validate longitude
  const rawLon = payload.longitude !== undefined ? payload.longitude : (Array.isArray(payload.coords) ? payload.coords[1] : undefined);
  const lonNum = Number(rawLon);
  if (rawLon === undefined || rawLon === null || rawLon === '' || isNaN(lonNum)) {
    errors.push('longitude is required and must be a valid number');
  } else if (!Number.isFinite(lonNum)) {
    errors.push('longitude must be a finite number');
  } else if (lonNum < -180 || lonNum > 180) {
    errors.push(`longitude must be between -180 and 180 degrees (received ${lonNum})`);
  }

  // 4. Validate timestamp
  const rawTimestamp = payload.timestamp;
  let timestampMs = NaN;
  let isoTimestamp = '';

  if (rawTimestamp === undefined || rawTimestamp === null || rawTimestamp === '') {
    errors.push('timestamp is required');
  } else {
    if (typeof rawTimestamp === 'number') {
      // Could be epoch seconds or epoch milliseconds
      timestampMs = rawTimestamp < 1e11 ? rawTimestamp * 1000 : rawTimestamp;
    } else if (typeof rawTimestamp === 'string') {
      const parsedDate = new Date(rawTimestamp);
      timestampMs = parsedDate.getTime();
    }

    if (isNaN(timestampMs)) {
      errors.push('timestamp must be a valid ISO 8601 string or numeric timestamp');
    } else {
      const now = Date.now();
      if (timestampMs > now + maxFutureDriftMs) {
        errors.push(`timestamp cannot be in the future (exceeds clock drift limit of 5 minutes: ${new Date(timestampMs).toISOString()})`);
      } else if (timestampMs < now - 365 * 24 * 60 * 60 * 1000) {
        // Obsolete date (> 1 year old)
        errors.push(`timestamp is too ancient (> 1 year old: ${new Date(timestampMs).toISOString()})`);
      } else {
        isoTimestamp = new Date(timestampMs).toISOString();
      }
    }
  }

  // 5. Validate source
  const source = payload.source !== undefined && payload.source !== null ? String(payload.source).trim() : '';
  if (!source) {
    errors.push('source is required and must be a non-empty string (e.g., rest_api, mock_telematics, manual_dispatcher)');
  }

  if (errors.length > 0) {
    return { isValid: false, errors, normalized: null };
  }

  return {
    isValid: true,
    errors: [],
    normalized: {
      busId,
      latitude: parseFloat(latNum.toFixed(6)),
      longitude: parseFloat(lonNum.toFixed(6)),
      coords: [parseFloat(latNum.toFixed(6)), parseFloat(lonNum.toFixed(6))],
      timestamp: isoTimestamp,
      timestampMs,
      source: source.toLowerCase(),
      speedKmh: typeof payload.speedKmh === 'number' && !isNaN(payload.speedKmh) ? Math.max(0, payload.speedKmh) : undefined,
      heading: typeof payload.heading === 'number' && !isNaN(payload.heading) ? payload.heading : undefined,
      locationName: payload.locationName ? String(payload.locationName).trim() : undefined
    }
  };
}

/**
 * Automatically calculates GPS freshness and classifies telemetry state into:
 * LIVE / LAST_KNOWN / STALE / NO_SIGNAL / MANUAL.
 *
 * Rules:
 * - If isManualOverride === true -> classified as MANUAL (dispatcher verified fix)
 * - If signal is lost / missing or ageSeconds > 600s -> NO_SIGNAL
 * - If ageSeconds > 120s -> STALE
 * - If ageSeconds > 60s -> LAST_KNOWN
 * - If ageSeconds <= 60s -> LIVE
 *
 * @param {number|string|Date} timestamp
 * @param {object} [options]
 * @param {boolean} [options.isManualOverride=false]
 * @param {boolean} [options.isSignalLost=false]
 * @param {number} [options.referenceTimeMs]
 * @returns {{
 *   status: 'LIVE'|'LAST_KNOWN'|'STALE'|'NO_SIGNAL'|'MANUAL',
 *   statusUpper: string,
 *   trustLevel: 'HIGH'|'MEDIUM'|'LOW'|'NONE'|'MANUAL_VERIFIED',
 *   ageSeconds: number,
 *   isLive: boolean,
 *   isLastKnown: boolean,
 *   isStale: boolean,
 *   isNoSignal: boolean,
 *   isManual: boolean,
 *   reducedTrustInDistance: boolean,
 *   requiresVerification: boolean,
 *   warning: string|null
 * }}
 */
export function classifyGpsFreshness(timestamp, options = {}) {
  const refTime = options.referenceTimeMs || Date.now();
  let timestampMs = NaN;

  if (typeof timestamp === 'number') {
    timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  } else if (timestamp instanceof Date) {
    timestampMs = timestamp.getTime();
  } else if (typeof timestamp === 'string') {
    timestampMs = new Date(timestamp).getTime();
  }

  // Calculate age in seconds
  const ageSeconds = isNaN(timestampMs) ? 999999 : Math.max(0, Math.floor((refTime - timestampMs) / 1000));

  // 1. Check MANUAL override first (Human dispatcher authority)
  if (options.isManualOverride === true) {
    return {
      status: GPS_STATUS.MANUAL,
      statusUpper: GPS_STATUS.MANUAL,
      trustLevel: GPS_TRUST_LEVELS.MANUAL_VERIFIED,
      ageSeconds,
      isLive: false,
      isLastKnown: false,
      isStale: false,
      isNoSignal: false,
      isManual: true,
      reducedTrustInDistance: false, // Checkpoint verified by dispatcher
      requiresVerification: false,
      warning: null
    };
  }

  // 2. Check explicit signal loss or severe timeout (> 10 mins without ping)
  if (options.isSignalLost === true || ageSeconds > GPS_FRESHNESS_THRESHOLDS.STALE_MAX_AGE_SECONDS || isNaN(timestampMs)) {
    return {
      status: GPS_STATUS.NO_SIGNAL,
      statusUpper: GPS_STATUS.NO_SIGNAL,
      trustLevel: GPS_TRUST_LEVELS.NONE,
      ageSeconds: isNaN(timestampMs) ? 600 : ageSeconds,
      isLive: false,
      isLastKnown: false,
      isStale: false,
      isNoSignal: true,
      isManual: false,
      reducedTrustInDistance: true,
      requiresVerification: true,
      warning: 'GPS telematics signal lost. Using last-known location only. Manual dispatcher checkpoint override available.'
    };
  }

  // 3. Stale GPS (> 120s / 2m old)
  if (ageSeconds > GPS_FRESHNESS_THRESHOLDS.LAST_KNOWN_MAX_AGE_SECONDS) {
    return {
      status: GPS_STATUS.STALE,
      statusUpper: GPS_STATUS.STALE,
      trustLevel: GPS_TRUST_LEVELS.LOW,
      ageSeconds,
      isLive: false,
      isLastKnown: false,
      isStale: true,
      isNoSignal: false,
      isManual: false,
      reducedTrustInDistance: true,
      requiresVerification: true,
      warning: `GPS data is stale (>2m old, current age: ${ageSeconds}s). Distance-based ranking confidence reduced. Dispatcher verification required.`
    };
  }

  // 4. Last Known GPS (> 60s and <= 120s old)
  if (ageSeconds > GPS_FRESHNESS_THRESHOLDS.LIVE_MAX_AGE_SECONDS) {
    return {
      status: GPS_STATUS.LAST_KNOWN,
      statusUpper: GPS_STATUS.LAST_KNOWN,
      trustLevel: GPS_TRUST_LEVELS.MEDIUM,
      ageSeconds,
      isLive: false,
      isLastKnown: true,
      isStale: false,
      isNoSignal: false,
      isManual: false,
      reducedTrustInDistance: true,
      requiresVerification: true,
      warning: `Operating on last-known coordinates (${ageSeconds}s old). Never displayed as live GPS.`
    };
  }

  // 5. Fresh LIVE GPS (<= 60s old)
  return {
    status: GPS_STATUS.LIVE,
    statusUpper: GPS_STATUS.LIVE,
    trustLevel: GPS_TRUST_LEVELS.HIGH,
    ageSeconds,
    isLive: true,
    isLastKnown: false,
    isStale: false,
    isNoSignal: false,
    isManual: false,
    reducedTrustInDistance: false,
    requiresVerification: false,
    warning: null
  };
}

/**
 * Base Abstract Interface for GPS Telematics Providers.
 * Both MockGPSProvider and BackendGPSProvider extend this contract.
 */
export class BaseGPSProvider {
  constructor(name = 'BaseGPSProvider', options = {}) {
    this.name = name;
    this.type = options.type || 'generic';
    this.isSimulated = options.isSimulated !== undefined ? options.isSimulated : true;
    this.isExternalConfigured = options.isExternalConfigured || false;
    this.externalProviderName = options.externalProviderName || null;
    this.description = options.description || 'Base GPS Telematics Provider Interface';
    this.subscribers = new Set();
    this.locations = new Map(); // busId -> TelematicsRecord
  }

  /**
   * Validate telemetry update payload.
   */
  validate(payload) {
    return validateGpsPayload(payload);
  }

  /**
   * Ingest and process a GPS update. Must be implemented by subclasses.
   */
  ingestUpdate(payload) {
    throw new Error('ingestUpdate must be implemented by subclass');
  }

  /**
   * Retrieve current telematics state for a specific bus.
   */
  getBusLocation(busId) {
    const record = this.locations.get(busId);
    if (!record) return null;
    // Re-evaluate freshness upon query
    const freshness = classifyGpsFreshness(record.timestampMs, {
      isManualOverride: record.isManualOverride,
      isSignalLost: record.isSignalLost
    });
    return {
      ...record,
      ...freshness
    };
  }

  /**
   * Retrieve all current bus telematics states.
   */
  getAllBusLocations() {
    const result = {};
    for (const [busId] of this.locations.entries()) {
      result[busId] = this.getBusLocation(busId);
    }
    return result;
  }

  /**
   * Subscribe to real-time location updates.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all registered subscribers of an updated bus state.
   */
  notifySubscribers(busLocation) {
    for (const cb of this.subscribers) {
      try {
        cb(busLocation);
      } catch (err) {
        console.error(`[GPSProvider ${this.name}] Listener error:`, err);
      }
    }
  }

  /**
   * Status and metadata disclosure.
   * Explicitly details simulation status to prevent false claims of physical devices.
   */
  getStatus() {
    return {
      name: this.name,
      type: this.type,
      isSimulated: this.isSimulated,
      isExternalConfigured: this.isExternalConfigured,
      externalProviderName: this.externalProviderName,
      description: this.description,
      trackedBusesCount: this.locations.size,
      disclaimer: this.isExternalConfigured
        ? `Configured with external telematics provider: ${this.externalProviderName}`
        : 'Simulated telematics for MVP demonstration. No physical vehicle GPS devices are attached.'
    };
  }
}

/**
 * MockGPSProvider: Generates and manages synthetic GPS telemetry for
 * development, automated integration testing, and local demos.
 */
export class MockGPSProvider extends BaseGPSProvider {
  constructor(options = {}) {
    super('MockGPSProvider', {
      type: 'mock',
      isSimulated: true,
      isExternalConfigured: false,
      description: 'Mock GPS Provider: Generates synthetic telematics for development and automated testing. No physical vehicle GPS hardware attached.'
    });

    this.timer = null;
    this.jitterAmount = options.jitterAmount || 0.0003; // ~30 meters jitter
  }

  /**
   * Ingests or manually sets a simulated GPS update.
   */
  ingestUpdate(payload, options = {}) {
    const validation = this.validate(payload);
    if (!validation.isValid) {
      throw new Error(`Invalid GPS Payload: ${validation.errors.join(', ')}`);
    }

    const { normalized } = validation;
    const isManualOverride = options.isManualOverride === true || normalized.source === GPS_SOURCES.MANUAL_DISPATCHER;
    const isSignalLost = options.isSignalLost === true || normalized.source === GPS_SOURCES.NO_SIGNAL;

    const freshness = classifyGpsFreshness(normalized.timestampMs, {
      isManualOverride,
      isSignalLost,
      referenceTimeMs: options.referenceTimeMs
    });

    const record = {
      busId: normalized.busId,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      coords: normalized.coords,
      timestamp: normalized.timestamp,
      timestampMs: normalized.timestampMs,
      source: normalized.source,
      speedKmh: normalized.speedKmh !== undefined ? normalized.speedKmh : 25.0,
      heading: normalized.heading !== undefined ? normalized.heading : 90,
      locationName: normalized.locationName || `Simulated Waypoint [${normalized.latitude.toFixed(4)}, ${normalized.longitude.toFixed(4)}]`,
      isManualOverride,
      isSignalLost,
      provider: this.name,
      ...freshness
    };

    this.locations.set(normalized.busId, record);
    this.notifySubscribers(record);
    return record;
  }

  /**
   * Simulate immediate signal loss for a bus.
   */
  simulateSignalLoss(busId, lastKnownCoords = null, locationName = 'Signal Lost Location') {
    const existing = this.locations.get(busId);
    const coords = lastKnownCoords || (existing ? existing.coords : [37.77, -122.42]);

    const record = {
      busId,
      latitude: coords[0],
      longitude: coords[1],
      coords,
      timestamp: new Date().toISOString(),
      timestampMs: Date.now() - 360000, // 6 minutes ago
      source: GPS_SOURCES.NO_SIGNAL,
      speedKmh: 0,
      locationName,
      isManualOverride: false,
      isSignalLost: true,
      provider: this.name,
      ...classifyGpsFreshness(Date.now() - 360000, { isSignalLost: true })
    };

    this.locations.set(busId, record);
    this.notifySubscribers(record);
    return record;
  }

  /**
   * Simulate stale signal (>120s old).
   */
  simulateStaleSignal(busId, ageSeconds = 180, coords = null) {
    const existing = this.locations.get(busId);
    const pos = coords || (existing ? existing.coords : [37.772, -122.425]);
    const timestampMs = Date.now() - (ageSeconds * 1000);

    return this.ingestUpdate({
      busId,
      latitude: pos[0],
      longitude: pos[1],
      timestamp: new Date(timestampMs).toISOString(),
      source: GPS_SOURCES.MOCK_TELEMATICS
    });
  }

  /**
   * Simulate recovery after GPS loss.
   */
  simulateRecovery(busId, freshCoords = [37.7750, -122.4200]) {
    return this.ingestUpdate({
      busId,
      latitude: freshCoords[0],
      longitude: freshCoords[1],
      timestamp: new Date().toISOString(),
      source: GPS_SOURCES.MOCK_TELEMATICS,
      locationName: 'Recovered Live Telematics Fix'
    }, { isSignalLost: false, isManualOverride: false });
  }

  /**
   * Simulate manual dispatcher location override.
   */
  simulateManualOverride(busId, coords, checkpointName = 'Dispatcher VHF Radio Checkpoint') {
    return this.ingestUpdate({
      busId,
      latitude: coords[0],
      longitude: coords[1],
      timestamp: new Date().toISOString(),
      source: GPS_SOURCES.MANUAL_DISPATCHER,
      locationName: checkpointName
    }, { isManualOverride: true, isSignalLost: false });
  }
}

/**
 * BackendGPSProvider: Production & MVP API-ready provider that receives
 * and validates live GPS updates submitted to the local backend REST API endpoint:
 *   POST /api/gps/update
 *
 * Designed to connect to external telematics providers (e.g. Samsara, Geotab, Zonar)
 * when configured, but explicitly declares simulated MVP status by default.
 */
export class BackendGPSProvider extends BaseGPSProvider {
  constructor(options = {}) {
    super('BackendGPSProvider', {
      type: 'backend_rest',
      isSimulated: options.isExternalConfigured ? false : true,
      isExternalConfigured: options.isExternalConfigured || false,
      externalProviderName: options.externalProviderName || null,
      description: options.isExternalConfigured
        ? `Backend Telematics Provider integrated with ${options.externalProviderName}`
        : 'Backend REST API GPS Provider: Ingests GPS telemetry updates via POST /api/gps/update. No physical vehicle GPS devices attached.'
    });

    this.preserveManualOverrides = options.preserveManualOverrides !== false;
  }

  /**
   * Configure an actual external telematics provider.
   * Only changes simulation status if valid external provider name and credentials are supplied.
   */
  configureExternalProvider(providerName, config = {}) {
    if (!providerName || typeof providerName !== 'string') {
      throw new Error('External provider name is required');
    }
    this.externalProviderName = providerName;
    this.isExternalConfigured = true;
    this.isSimulated = false;
    this.description = `Active Telematics Integration with ${providerName}`;
    return this.getStatus();
  }

  /**
   * Reset external provider configuration back to MVP simulated mode.
   */
  resetToSimulatedMode() {
    this.externalProviderName = null;
    this.isExternalConfigured = false;
    this.isSimulated = true;
    this.description = 'Backend REST API GPS Provider: Ingests GPS telemetry updates via POST /api/gps/update. No physical vehicle GPS devices attached.';
    return this.getStatus();
  }

  /**
   * Ingest an update received via POST /api/gps/update.
   *
   * @param {object} payload
   * @param {object} [options]
   * @returns {{
   *   success: boolean,
   *   busId: string,
   *   record: object,
   *   classification: object,
   *   preservedManualOverride: boolean
   * }}
   */
  ingestUpdate(payload, options = {}) {
    const validation = this.validate(payload);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Invalid GPS telemetry payload',
        details: validation.errors
      };
    }

    const { normalized } = validation;
    const existing = this.locations.get(normalized.busId);

    // Check if MANUAL override is currently active on this bus
    const isCurrentlyManual = existing && existing.isManualOverride === true;
    const clearManualRequested = options.clearManual === true || payload.clearManual === true || payload.overrideManual === true;
    const isExplicitManualPayload = normalized.source === GPS_SOURCES.MANUAL_DISPATCHER;

    if (isCurrentlyManual && !clearManualRequested && !isExplicitManualPayload && this.preserveManualOverrides) {
      // Preserve manual override! Store background telematics without overriding manual position
      existing.backgroundTelematics = {
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        timestamp: normalized.timestamp,
        timestampMs: normalized.timestampMs,
        source: normalized.source
      };

      const manualFreshness = classifyGpsFreshness(existing.timestampMs, { isManualOverride: true });

      return {
        success: true,
        busId: normalized.busId,
        preservedManualOverride: true,
        message: 'Bus is under manual dispatcher override. Automatic GPS fix stored in background; manual position preserved.',
        record: existing,
        classification: manualFreshness
      };
    }

    const isManualOverride = isExplicitManualPayload || (!clearManualRequested && isCurrentlyManual);
    const isSignalLost = normalized.source === GPS_SOURCES.NO_SIGNAL;

    const classification = classifyGpsFreshness(normalized.timestampMs, {
      isManualOverride,
      isSignalLost,
      referenceTimeMs: options.referenceTimeMs
    });

    const record = {
      busId: normalized.busId,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      coords: normalized.coords,
      timestamp: normalized.timestamp,
      timestampMs: normalized.timestampMs,
      source: normalized.source,
      speedKmh: normalized.speedKmh !== undefined ? normalized.speedKmh : (existing?.speedKmh || 0),
      heading: normalized.heading !== undefined ? normalized.heading : (existing?.heading || 0),
      locationName: normalized.locationName || (existing?.locationName || `Fix at [${normalized.latitude.toFixed(4)}, ${normalized.longitude.toFixed(4)}]`),
      isManualOverride,
      isSignalLost,
      provider: this.name,
      isSimulated: this.isSimulated,
      lastIngestedAt: new Date().toISOString(),
      ...classification
    };

    this.locations.set(normalized.busId, record);
    this.notifySubscribers(record);

    return {
      success: true,
      busId: normalized.busId,
      preservedManualOverride: false,
      record,
      classification
    };
  }

  /**
   * Apply a manual location override directly.
   */
  applyManualOverride(busId, coords, locationName = 'Dispatcher Manual Fix') {
    return this.ingestUpdate({
      busId,
      latitude: coords[0],
      longitude: coords[1],
      timestamp: new Date().toISOString(),
      source: GPS_SOURCES.MANUAL_DISPATCHER,
      locationName
    }, { clearManual: false });
  }

  /**
   * Release a manual location override to allow incoming automatic GPS to resume.
   */
  releaseManualOverride(busId) {
    const existing = this.locations.get(busId);
    if (!existing) return null;

    existing.isManualOverride = false;
    if (existing.backgroundTelematics) {
      // Immediately restore latest background telematics fix
      const bg = existing.backgroundTelematics;
      return this.ingestUpdate({
        busId,
        latitude: bg.latitude,
        longitude: bg.longitude,
        timestamp: bg.timestamp,
        source: bg.source
      }, { clearManual: true });
    }

    const reclassified = classifyGpsFreshness(existing.timestampMs, { isManualOverride: false });
    Object.assign(existing, reclassified);
    this.notifySubscribers(existing);
    return existing;
  }
}
