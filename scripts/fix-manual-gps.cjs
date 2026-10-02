const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const replacement = `  // GPS Failure & Manual Location Update
  updateBusLocationManually(busId, coords, locationName = '', reason = 'Dispatcher Manual Checkpoint') {
    const bus = this.state.buses.find(b => b.id === busId);
    if (!bus) return;

    const prevCoords = [...bus.coords];
    const prevLocation = bus.lastKnownLocation || 'Previous GPS Coordinates';
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update location and mark explicitly as manual checkpoint (never pretend it is a live fix)
    bus.coords = [parseFloat(coords[0]), parseFloat(coords[1])];
    bus.gpsStatus = 'manual';
    bus.isManualLocation = true;
    bus.lastKnownLocation = locationName || \`Checkpoint at [\${bus.coords[0].toFixed(4)}, \${bus.coords[1].toFixed(4)}]\`;
    bus.lastGpsSync = \`\${nowTimeStr} (Dispatcher Manual Fix: \${reason})\`;

    // If bus is stalled, keep breakdown status, but update location
    const changeDescription = \`Manual location update for \${bus.id} to \${bus.lastKnownLocation}\`;

    // If offline/degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('MANUAL_BUS_LOCATION', changeDescription, {
        busId,
        coords: bus.coords,
        locationName: bus.lastKnownLocation,
        reason
      });
    }

    // Add to audit trail
    this.state.metrics.recentAuditLogs.unshift({
      id: \`LOG-GPS-\${Date.now()}\`,
      time: nowTimeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: \`Manual Location Fix: \${bus.id} updated to "\${bus.lastKnownLocation}". Reason: \${reason}.\`,
      status: 'MANUAL_GPS_OVERRIDE'
    });

    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push({
      action: 'MANUAL_OVERRIDE',
      details: { busId }
    });

    this.showToast(\`Location for \${bus.id} updated manually to "\${bus.lastKnownLocation}". Marked as Manual Fix.\`, 'success');
    this.closeModal();
    this.notify();
  }`;

code = code.replace(
  /  \/\/ GPS Failure & Manual Location Update[\s\S]*?this\.notify\(\);\n  \}/,
  replacement
);

fs.writeFileSync('src/state/store.js', code);
console.log('Fixed updateBusLocationManually for tests!');
