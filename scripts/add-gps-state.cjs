const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const missingGpsMethod = `
  getBusGpsState(busId) {
    const bus = this.state.buses.find(b => b.id === busId);
    if (!bus) return null;

    let ageSeconds = 0;
    if (bus._lastGpsSyncTimeMs) {
      ageSeconds = Math.floor((Date.now() - bus._lastGpsSyncTimeMs) / 1000);
    } else if (bus.lastGpsSync) {
      // rough mock
      ageSeconds = bus.gpsStatus === 'live' ? 10 : 300;
    }

    let statusUpper = bus.gpsStatus ? bus.gpsStatus.toUpperCase() : 'LIVE';
    if (statusUpper === 'LIVE' && ageSeconds > 60) statusUpper = 'LAST_KNOWN';

    const state = {
      statusUpper,
      isLive: statusUpper === 'LIVE',
      isLastKnown: statusUpper === 'LAST_KNOWN',
      isStale: statusUpper === 'STALE',
      isNoSignal: statusUpper === 'NO_SIGNAL',
      isManual: statusUpper === 'MANUAL',
      ageSeconds,
      latitude: bus.coords ? bus.coords[0] : 0,
      longitude: bus.coords ? bus.coords[1] : 0,
      lastUpdated: new Date().toISOString()
    };

    if (state.isLive) {
      state.source = 'live_gps';
      state.warning = null;
      state.trustLevel = 'HIGH';
    } else if (state.isLastKnown) {
      state.source = 'last_known';
      state.reducedTrustInDistance = true;
      state.trustLevel = 'MEDIUM';
    } else if (state.isStale) {
      state.trustLevel = 'LOW';
      state.reducedTrustInDistance = true;
      state.requiresVerification = true;
      state.warning = 'stale';
    } else if (state.isNoSignal) {
      state.trustLevel = 'NONE';
      state.warning = 'NO SIGNAL';
      state.requiresVerification = true;
    } else if (state.isManual) {
      state.source = 'manual_dispatcher';
      state.ageSeconds = 0;
    }

    return state;
  }
`;

code = code.replace(/  getPendingActions/g, missingGpsMethod + '\\n  getPendingActions');

fs.writeFileSync('src/state/store.js', code);
console.log('Added getBusGpsState!');
