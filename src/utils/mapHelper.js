// Leaflet Map Helper — Enhanced with full color coding, stops, disruption markers
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { store } from '../state/store.js';

let mapInstance = null;
let markersLayerGroup = null;
let routesLayerGroup = null;
let stopsLayerGroup = null;

// Color scheme per spec:
// Blue (#2563EB) = active buses & upcoming stops
// Green (#10B981) = completed stops
// Amber (#F59E0B) = affected / delayed
// Red (#EF4444) = disruption / breakdown
// Gray (#9CA3AF) = unavailable / depot

export function initLiveMap(containerId = 'live-map-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Clean up previous instance
  if (mapInstance) {
    try { mapInstance.remove(); } catch (e) {}
    mapInstance = null;
    markersLayerGroup = null;
    routesLayerGroup = null;
    stopsLayerGroup = null;
  }

  mapInstance = L.map(containerId, {
    center: [37.7720, -122.4350],
    zoom: 13,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(mapInstance);

  routesLayerGroup = L.layerGroup().addTo(mapInstance);
  stopsLayerGroup = L.layerGroup().addTo(mapInstance);
  markersLayerGroup = L.layerGroup().addTo(mapInstance);

  renderMapLayers();

  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 200);

  return mapInstance;
}

export function renderMapLayers(filter = 'all') {
  if (!mapInstance) return;

  markersLayerGroup?.clearLayers();
  routesLayerGroup?.clearLayers();
  stopsLayerGroup?.clearLayers();

  const state = store.getState();
  const { buses, routes, schools, depot, disruptions } = state;

  // ===========================
  // 1. Draw Route Polylines
  //    Color per status:
  //    on_time → Blue, delayed → Amber, disrupted → Red (dashed)
  // ===========================
  routes.forEach(route => {
    if (filter === 'transit' && route.status !== 'on_time') return;
    if (filter === 'disrupted' && route.status !== 'disrupted' && route.status !== 'delayed') return;

    const stopCoords = route.stops.map(s => s.coords);
    if (stopCoords.length < 2) return;

    const isDisrupted = route.status === 'disrupted';
    const isDelayed = route.status === 'delayed';
    const routeColor = isDisrupted ? '#EF4444' : isDelayed ? '#F59E0B' : '#2563EB';

    // Draw completed segment in green
    const completedStops = route.stops.filter(s => s.status === 'completed');
    if (completedStops.length > 1) {
      L.polyline(completedStops.map(s => s.coords), {
        color: '#10B981',
        weight: 5,
        opacity: 0.85
      }).addTo(routesLayerGroup);
    }

    // Draw remaining segment
    const remainingStops = route.stops.filter(s => s.status !== 'completed');
    if (remainingStops.length > 1) {
      L.polyline(remainingStops.map(s => s.coords), {
        color: routeColor,
        weight: isDisrupted ? 5 : 4,
        opacity: isDisrupted ? 0.9 : 0.7,
        dashArray: isDisrupted ? '8, 8' : null
      }).addTo(routesLayerGroup);
    } else if (completedStops.length === 0) {
      // All pending - full route
      L.polyline(stopCoords, {
        color: routeColor,
        weight: 4,
        opacity: 0.7
      }).addTo(routesLayerGroup);
    }

    // Bind tooltip on the full route line
    const tooltipLine = L.polyline(stopCoords, { opacity: 0, weight: 12 });
    tooltipLine.bindTooltip(`<b>${route.name}</b><br>ETA: ${route.currentEta} · ${route.status.toUpperCase()}`, { sticky: true });
    routesLayerGroup.addLayer(tooltipLine);

    // ===========================
    // 2. Draw Stops on each route
    // ===========================
    if (filter === 'standby') return; // Don't show stops for depot filter

    route.stops.forEach((stop, idx) => {
      let stopColor, stopRadius = 8, fillOpacity = 0.9;

      if (stop.status === 'completed') {
        stopColor = '#10B981'; // Green
      } else if (stop.status === 'next') {
        stopColor = '#2563EB'; stopRadius = 10; // Blue - current
      } else if (stop.status === 'delayed') {
        stopColor = '#F59E0B'; // Amber
      } else if (stop.status === 'stuck' || stop.status === 'stranded') {
        stopColor = '#EF4444'; stopRadius = 11; // Red - disruption
      } else if (stop.status === 'destination') {
        stopColor = '#0F2747'; stopRadius = 6;
      } else {
        stopColor = '#94A3B8'; // Gray - pending
      }

      if (stop.status !== 'destination') {
        const stopMarker = L.circleMarker(stop.coords, {
          radius: stopRadius,
          fillColor: stopColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity
        });
        stopMarker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 0.78rem; min-width: 160px;">
            <b style="color: #0F2747;">Stop ${idx + 1}: ${stop.name}</b><br>
            <span style="color: #64748B;">⏱ ${stop.time}${stop.studentsCount ? ` · 👥 ${stop.studentsCount} pax` : ''}</span>
          </div>
        `, { sticky: true, direction: 'top' });
        stopsLayerGroup.addLayer(stopMarker);
      }
    });
  });

  // ===========================
  // 3. Disruption Markers (Red ⚠ icons)
  // ===========================
  const unresolvedDisruptions = disruptions.filter(d => d.status === 'unresolved' && d.busId);
  unresolvedDisruptions.forEach(dis => {
    const bus = buses.find(b => b.id === dis.busId);
    if (!bus) return;

    const disruptionIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          background: #EF4444; color: #fff;
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
          border: 2.5px solid #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 0.85rem;">⚠</span>
        </div>
        <div style="
          position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
          background: #EF4444; color: #fff;
          font-size: 0.6rem; font-weight: 800;
          padding: 2px 5px; border-radius: 4px;
          white-space: nowrap; font-family: sans-serif;
        ">${dis.type.replace('_', ' ').toUpperCase()}</div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42]
    });

    const marker = L.marker(bus.coords, { icon: disruptionIcon, zIndexOffset: 200 });
    marker.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); min-width: 200px; padding: 4px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span style="background: #FEE2E2; color: #DC2626; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">⚠ ${dis.severity.toUpperCase()} DISRUPTION</span>
        </div>
        <div style="font-weight: 700; color: #0F2747; font-size: 0.95rem; margin-bottom: 6px;">${dis.title}</div>
        <div style="font-size: 0.78rem; color: #475569; margin-bottom: 10px;">${dis.impact}</div>
        <button onclick="window.__triggerReplanning('${bus.id}')" style="
          width: 100%; background: #2563EB; color: #fff;
          border: none; padding: 7px 10px; border-radius: 6px;
          font-size: 0.75rem; font-weight: 700; cursor: pointer;
        ">⚡ Open AI Replanning Engine</button>
      </div>
    `, { maxWidth: 240 });

    markersLayerGroup.addLayer(marker);
  });

  // ===========================
  // 4. Draw Schools
  // ===========================
  schools.forEach(sch => {
    const schoolIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          background: #0F2747; color: #fff;
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 4px 10px rgba(15,39,71,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
        ">🏫</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(sch.coords, { icon: schoolIcon, zIndexOffset: 100 });
    marker.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); padding: 4px;">
        <h4 style="color: #0F2747; margin-bottom: 4px; font-size: 0.95rem;">${sch.name}</h4>
        <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">${sch.address}</p>
        <div style="font-size: 0.75rem; font-weight: 700; color: #2563EB;">🔔 Bell Time: ${sch.bellTime}</div>
        <div style="font-size: 0.75rem; color: #64748B;">${sch.totalStudents} enrolled students</div>
      </div>
    `);
    markersLayerGroup.addLayer(marker);
  });

  // ===========================
  // 5. Draw Depot
  // ===========================
  if (depot?.coords && (filter === 'all' || filter === 'standby')) {
    const depotIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          background: #0F2747; color: #F59E0B;
          border: 2.5px solid #F59E0B;
          border-radius: 8px; width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 1rem;
        ">🏭</div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker(depot.coords, { icon: depotIcon });
    marker.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); padding: 4px;">
        <h4 style="color: #0F2747; margin-bottom: 4px; font-size: 0.95rem;">${depot.name}</h4>
        <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">${depot.address}</p>
        <div style="font-size: 0.75rem; font-weight: 700; color: #10B981;">🟢 ${depot.standbyBusesCount} reserve buses standby</div>
      </div>
    `);
    markersLayerGroup.addLayer(marker);
  }

  // ===========================
  // 6. Draw Bus Markers
  // ===========================
  const filteredBuses = buses.filter(bus => {
    if (filter === 'transit') return bus.status === 'in_transit' || bus.status === 'delayed';
    if (filter === 'disrupted') return bus.status === 'breakdown' || bus.status === 'delayed';
    if (filter === 'standby') return bus.status === 'in_depot';
    return true;
  });

  filteredBuses.forEach(bus => {
    const driver = state.drivers.find(d => d.id === bus.driverId);
    const driverName = driver ? driver.name : 'Unassigned';
    const isBreakdown = bus.status === 'breakdown';
    const isDelayed = bus.status === 'delayed';
    const isDepot = bus.status === 'in_depot';
    const isMaintenance = bus.status === 'maintenance';
    const isNoSignal = bus.gpsStatus === 'no_signal' || isBreakdown || isMaintenance;
    const isManual = bus.gpsStatus === 'manual' || bus.isManualLocation;

    // Color per spec
    let busColor = '#2563EB';      // Blue = active
    if (isBreakdown) busColor = '#EF4444';    // Red = disruption
    else if (isDelayed) busColor = '#F59E0B'; // Amber = affected
    else if (isManual) busColor = '#4F46E5';  // Indigo = manual checkpoint
    else if (isDepot) busColor = '#9CA3AF';   // Gray = unavailable/idle
    else if (isMaintenance) busColor = '#6B7280'; // Gray = offline

    const busMarkerHtml = `
      <div style="
        background: ${busColor}; color: #fff;
        border: 2.5px solid #fff;
        border-radius: 8px;
        padding: 4px 8px 4px 6px;
        display: flex; align-items: center; gap: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem; font-weight: 800;
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
        white-space: nowrap;
        ${isBreakdown ? 'animation: pulseDanger 1.5s infinite;' : ''}
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M8 6v6M15 6v6M2 12h19.6"/>
          <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
        </svg>
        ${bus.id}
        ${isNoSignal ? ' 📡✕' : isManual ? ' 📍' : ''}
      </div>
    `;

    const busIcon = L.divIcon({
      className: '',
      html: busMarkerHtml,
      iconSize: [isNoSignal || isManual ? 82 : 70, 28],
      iconAnchor: [(isNoSignal || isManual ? 82 : 70) / 2, 14]
    });

    const marker = L.marker(bus.coords, { icon: busIcon, zIndexOffset: isBreakdown ? 300 : 50 });

    marker.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); min-width: 250px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <strong style="font-size: 1rem; color: #0F2747;">${bus.id}</strong>
          <div style="display: flex; gap: 4px;">
            <span style="font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;
              background: ${isNoSignal ? '#FEF2F2' : isManual ? '#EEF2FF' : '#ECFDF5'};
              color: ${isNoSignal ? '#DC2626' : isManual ? '#4338CA' : '#059669'};">
              ${isNoSignal ? '📡 NO SIGNAL' : isManual ? '📍 MANUAL FIX' : '🛰️ LIVE FIX'}
            </span>
            <span style="font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;
              background: ${isBreakdown ? '#FEE2E2' : isDelayed ? '#FEF3C7' : '#EFF6FF'};
              color: ${isBreakdown ? '#DC2626' : isDelayed ? '#92400E' : '#2563EB'};">
              ${bus.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Telemetry Notice: Live vs Last Known -->
        <div style="background: ${isNoSignal ? '#FEF2F2' : isManual ? '#F5F3FF' : '#F8FAFC'}; border: 1px solid ${isNoSignal ? '#FECACA' : isManual ? '#DDD6FE' : '#E2E8F0'}; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 0.72rem;">
          <div style="font-weight: 700; color: ${isNoSignal ? '#DC2626' : isManual ? '#4338CA' : '#0F2747'};">
            ${isNoSignal ? '⚠️ Last Known Location (GPS Lost):' : isManual ? '📍 Dispatcher Manual Checkpoint:' : '🛰️ Current Fleet Position:'}
          </div>
          <div style="color: #334155; font-weight: 600; margin-top: 1px;">${bus.lastKnownLocation || 'Route Waypoint'}</div>
          <div style="color: #64748B; font-size: 0.68rem; margin-top: 2px;">Sync: ${bus.lastGpsSync || 'N/A'}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 0.78rem; color: #475569; margin-bottom: 10px;">
          <div><b>Model:</b> ${bus.model.split(' ').slice(0,2).join(' ')}</div>
          <div><b>Driver:</b> ${driverName}</div>
          <div><b>Speed:</b> ${bus.speedKmh} km/h</div>
          <div><b>Load:</b> ${bus.currentLoad}/${bus.capacity}</div>
        </div>

        ${bus.breakdownNote ? `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; padding: 6px 8px; font-size: 0.75rem; color: #DC2626; font-weight: 600; margin-bottom: 8px;">
            ⚠ ${bus.breakdownNote}
          </div>
        ` : ''}

        <div style="display: flex; flex-direction: column; gap: 5px;">
          <button onclick="window.__manualLocationOverride('${bus.id}')" style="
            width: 100%; background: #EFF6FF; color: #2563EB;
            border: 1px solid #BFDBFE; padding: 6px 8px; border-radius: 6px;
            font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;
          ">
            📍 Manual Location Update
          </button>

          <div style="display: flex; gap: 5px;">
            ${isBreakdown ? `
              <button onclick="window.__triggerReplanning('${bus.id}')" style="
                flex-grow: 1; background: #EF4444; color: #fff; border: none;
                padding: 6px 8px; border-radius: 6px; font-size: 0.75rem;
                font-weight: 700; cursor: pointer;
              ">⚡ AI Emergency Replan</button>
            ` : `
              <button onclick="window.__viewBusDetails('${bus.id}')" style="
                flex-grow: 1; background: #F1F5F9; color: #0F2747;
                border: 1px solid #E2E8F0; padding: 6px 8px;
                border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer;
              ">Full Telemetry</button>
              <button onclick="window.__viewBusOnFleet('${bus.id}')" style="
                background: #EFF6FF; color: #2563EB;
                border: 1px solid #BFDBFE; padding: 6px 8px;
                border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;
              ">Fleet →</button>
            `}
          </div>
        </div>
      </div>
    `, { maxWidth: 280 });

    markersLayerGroup.addLayer(marker);
  });
}

// Global window bridges for popup interactions
if (typeof window !== 'undefined') {
  window.__triggerReplanning = (busId) => {
    const state = store.getState();
    const disruption = state.disruptions.find(d => d.busId === busId);
    if (disruption) store.setSelectedDisruption(disruption.id);
    store.setActiveTab('replanning');
  };

  window.__viewBusDetails = (busId) => {
    store.openModal('bus_detail', { busId });
  };

  window.__viewBusOnFleet = () => {
    store.setActiveTab('buses');
  };

  window.__manualLocationOverride = (busId) => {
    store.openModal('manual_location', { busId });
  };
}
