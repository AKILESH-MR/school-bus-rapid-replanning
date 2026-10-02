// Routes View — Enhanced with table, per-route map, and stop progress
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Track route map instances
const routeMapInstances = {};

function initRouteMap(containerId, route, buses) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Clean up previous instance
  if (routeMapInstances[containerId]) {
    try { routeMapInstances[containerId].remove(); } catch (e) {}
    delete routeMapInstances[containerId];
  }

  const bus = buses.find(b => b.id === route.assignedBus);
  const center = route.stops[Math.floor(route.stops.length / 2)]?.coords || [37.7720, -122.4350];

  const map = L.map(containerId, {
    center,
    zoom: 14,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false
  });

  routeMapInstances[containerId] = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  // Color scheme per spec:
  // Blue = active/upcoming, Green = completed, Amber = affected, Red = disruption, Gray = unavailable
  const stopCoords = route.stops.map(s => s.coords);
  const isDisrupted = route.status === 'disrupted';
  const isDelayed = route.status === 'delayed';

  // Draw route polyline with correct color
  if (stopCoords.length > 1) {
    const lineColor = isDisrupted ? '#EF4444' : isDelayed ? '#F59E0B' : '#2563EB';
    L.polyline(stopCoords, {
      color: lineColor,
      weight: 4,
      opacity: 0.85,
      dashArray: isDisrupted ? '8, 8' : null
    }).addTo(map);
  }

  // Draw Stop Markers with color coding
  route.stops.forEach((stop, idx) => {
    let color, label, textColor = '#fff';

    if (stop.status === 'completed') {
      color = '#10B981'; label = '✓';
    } else if (stop.status === 'next' || stop.status === 'delayed') {
      color = '#2563EB'; label = `${idx + 1}`;
    } else if (stop.status === 'stuck' || stop.status === 'stranded') {
      color = '#EF4444'; label = '⚠';
    } else if (stop.status === 'destination') {
      color = '#0F2747'; label = '🏫'; textColor = '#F59E0B';
    } else if (stop.status === 'pending') {
      color = isDisrupted ? '#F59E0B' : '#94A3B8'; label = `${idx + 1}`;
    } else {
      color = '#94A3B8'; label = `${idx + 1}`;
    }

    const stopIcon = L.divIcon({
      className: '',
      html: `<div style="
        width: 26px; height: 26px; border-radius: 50%;
        background: ${color}; color: ${textColor};
        display: flex; align-items: center; justify-content: center;
        font-size: 0.65rem; font-weight: 800;
        border: 2.5px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">${label}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const marker = L.marker(stop.coords, { icon: stopIcon });
    marker.bindTooltip(`
      <div style="font-family: sans-serif; font-size: 0.78rem;">
        <b>Stop ${idx + 1}:</b> ${stop.name}<br>
        <span style="color: #64748B;">⏱ ${stop.time}${stop.studentsCount ? ` • 👥 ${stop.studentsCount}` : ''}</span>
      </div>
    `, { sticky: true, direction: 'top' });
    marker.addTo(map);
  });

  // Draw Bus marker if active on this route
  if (bus && (bus.status === 'in_transit' || bus.status === 'delayed' || bus.status === 'breakdown')) {
    const busColor = bus.status === 'breakdown' ? '#EF4444' : bus.status === 'delayed' ? '#F59E0B' : '#2563EB';
    const busIcon = L.divIcon({
      className: '',
      html: `<div style="
        background: ${busColor}; color: #fff;
        border: 2.5px solid #fff;
        border-radius: 8px; padding: 3px 7px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.68rem; font-weight: 800;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        white-space: nowrap;
        ${bus.status === 'breakdown' ? 'animation: pulseDanger 1.5s infinite;' : ''}
      ">${bus.id} ${bus.status === 'breakdown' ? '⚠️' : ''}</div>`,
      iconSize: [60, 24],
      iconAnchor: [30, 12]
    });
    L.marker(bus.coords, { icon: busIcon })
      .bindTooltip(`<b>${bus.id}</b> — ${bus.currentLoad}/${bus.capacity} pax • ${bus.speedKmh} km/h`)
      .addTo(map);
  }

  setTimeout(() => map.invalidateSize(), 100);
}

export function renderRoutesView() {
  const state = store.getState();
  const { routes, buses, students } = state;

  const container = document.createElement('div');
  container.className = 'content-body';

  // Summary row
  const onTimeCount = routes.filter(r => r.status === 'on_time').length;
  const delayedCount = routes.filter(r => r.status === 'delayed').length;
  const disruptedCount = routes.filter(r => r.status === 'disrupted').length;

  container.innerHTML = `
    <!-- Header & Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">Live Route Operations</h2>
        <p style="font-size: 0.85rem; color: #64748B;">Per-route map views, stop progression, ETA monitoring, and passenger counts</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <div style="display: flex; gap: 8px;">
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #ECFDF5; color: #059669; border: 1px solid #6EE7B7;">● On-Time: ${onTimeCount}</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;">● Delayed: ${delayedCount}</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">● Disrupted: ${disruptedCount}</span>
        </div>
        <button class="action-btn secondary" id="optimize-all-routes-btn">
          ${Icons.refreshCw(16, 'currentColor')} Recalculate Traffic
        </button>
      </div>
    </div>

    <!-- Routes Summary Table -->
    <div class="panel-card" style="margin-bottom: 24px;">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Route Summary</h2>
          <p>Click a route row to jump to its detailed timeline and live map below</p>
        </div>
        <div class="search-input-wrap">
          <span class="search-input-icon">${Icons.search(16, 'currentColor')}</span>
          <input type="text" id="route-search-input" placeholder="Search route, bus, school..." />
        </div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Bus</th>
              <th>Driver</th>
              <th>Students</th>
              <th>Current Stop</th>
              <th>Remaining Stops</th>
              <th>Sched. ETA</th>
              <th>Live ETA</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody id="routes-table-body">
            ${routes.map(route => {
              const bus = buses.find(b => b.id === route.assignedBus);
              const currentStop = route.stops.find(s => s.status === 'next' || s.status === 'delayed' || s.status === 'stuck');
              const remainingStops = route.stops.filter(s => s.status === 'pending' || s.status === 'next' || s.status === 'delayed' || s.status === 'stranded' || s.status === 'stuck').length;
              const totalStudents = route.stops.reduce((sum, s) => sum + (s.studentsCount || 0), 0);
              const isDisrupted = route.status === 'disrupted';
              const isDelayed = route.status === 'delayed';
              const statusColor = isDisrupted ? '#EF4444' : isDelayed ? '#D97706' : '#059669';

              return `
                <tr class="route-table-row" data-route-id="${route.id}" style="cursor: pointer;">
                  <td>
                    <div style="font-weight: 700; color: #0F2747; font-family: var(--font-mono);">${route.id}</div>
                    <div style="font-size: 0.7rem; color: #64748B;">${route.name.split('-').slice(1).join('-').trim()}</div>
                  </td>
                  <td>
                    <span class="bus-pill">${route.assignedBus || 'N/A'}</span>
                    ${isDisrupted ? `<div style="font-size: 0.68rem; color: #EF4444; font-weight: 700; margin-top: 3px;">⚠️ BROKEN DOWN</div>` : ''}
                  </td>
                  <td>
                    <span style="font-weight: 600; font-size: 0.85rem;">${route.assignedDriver}</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="font-weight: 800; font-family: var(--font-mono);">${totalStudents}</span>
                    <div style="font-size: 0.68rem; color: #64748B;">passengers</div>
                  </td>
                  <td>
                    ${currentStop ? `
                      <div style="font-size: 0.82rem; font-weight: 600; color: #2563EB; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentStop.name}</div>
                      <div style="font-size: 0.68rem; color: #64748B;">⏱ ${currentStop.time}</div>
                    ` : `<span style="color: #94A3B8; font-style: italic; font-size: 0.8rem;">Completed / At School</span>`}
                  </td>
                  <td style="text-align: center;">
                    <span style="font-weight: 800; font-family: var(--font-mono); font-size: 1rem; color: ${remainingStops > 0 ? '#0F2747' : '#10B981'};">${remainingStops}</span>
                    <div style="font-size: 0.68rem; color: #64748B;">of ${route.totalStops}</div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: #64748B;">${route.scheduledArrivalTime}</span>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 800; color: ${statusColor};">
                      ${route.currentEta}
                    </span>
                    ${route.delayMinutes > 0 ? `<div style="font-size: 0.68rem; color: #D97706; font-weight: 700;">+${route.delayMinutes} min</div>` : ''}
                  </td>
                  <td>
                    <span class="status-badge ${route.status}">${route.status.toUpperCase()}</span>
                  </td>
                  <td>
                    <button class="action-btn ${isDisrupted ? 'danger' : 'secondary'} jump-to-route-btn" data-route-id="${route.id}" style="padding: 4px 10px; font-size: 0.75rem;">
                      ${isDisrupted ? '⚡ Replan' : '↓ Details'}
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Per-Route Detail Expanded Cards -->
    <div style="display: flex; flex-direction: column; gap: 28px;" id="route-details-container">
      ${routes.map(route => {
        const bus = buses.find(b => b.id === route.assignedBus);
        const isDisrupted = route.status === 'disrupted';
        const isDelayed = route.status === 'delayed';
        const completedCount = Array.isArray(route.completedStops) ? route.completedStops.length : (route.completedStops || 0);
        const progressPct = route.routeProgressPercentage != null ? route.routeProgressPercentage : Math.round((completedCount / route.totalStops) * 100);
        const totalStudents = route.stops.reduce((sum, s) => sum + (s.studentsCount || 0), 0);
        const mapId = `route-map-${route.id}`;

        const borderColor = isDisrupted ? '#EF4444' : isDelayed ? '#F59E0B' : '#2563EB';

        return `
          <div class="panel-card route-detail-card" id="route-card-${route.id}" style="border-left: 5px solid ${borderColor}; scroll-margin-top: 80px;">
            <!-- Route Card Header -->
            <div class="panel-header" style="background: #FAFBFD; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #64748B; background: #F1F5F9; padding: 2px 8px; border-radius: 6px;">${route.id}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: #0F2747;">${route.name}</h3>
                  <span class="status-badge ${route.status}">${route.status.toUpperCase()}</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 6px; display: flex; gap: 16px; flex-wrap: wrap;">
                  <span>🏫 <b>${route.schoolName}</b></span>
                  <span>🚌 <b>${route.assignedBus || 'None'}</b></span>
                  <span>👤 <b>${route.assignedDriver}</b></span>
                  <span>👥 <b>${totalStudents} students</b></span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 16px; flex-shrink: 0;">
                <div style="text-align: center;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Live ETA</div>
                  <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: ${isDisrupted ? '#EF4444' : isDelayed ? '#D97706' : '#059669'};">
                    ${route.currentEta}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Progress</div>
                  <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: #0F2747;">${progressPct}%</div>
                </div>
                ${isDisrupted ? `
                  <button class="action-btn danger replan-route-btn" data-disruption-id="DIS-2026-001" style="white-space: nowrap;">
                    ${Icons.zap(16, '#fff')} AI Emergency Replan
                  </button>
                ` : `
                  <button class="action-btn secondary focus-map-btn" data-map-id="${mapId}" style="white-space: nowrap;">
                    ${Icons.mapPin(16, 'currentColor')} Recenter Map
                  </button>
                `}
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="padding: 14px 24px; border-bottom: 1px solid #F1F5F9; background: #FAFBFD;">
              <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 700; color: #64748B; margin-bottom: 6px;">
                <span>Departure: ${route.scheduledStartTime}</span>
                <span>${completedCount} / ${route.totalStops} stops completed</span>
                <span>Bell: ${route.scheduledArrivalTime}</span>
              </div>
              <div style="height: 8px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                <div style="height: 100%; width: ${progressPct}%; background: ${isDisrupted ? '#EF4444' : isDelayed ? '#F59E0B' : 'linear-gradient(90deg, #2563EB, #10B981)'}; border-radius: 9999px; transition: width 0.6s ease;"></div>
              </div>
            </div>

            <!-- Body: Two columns — Stop Timeline + Live Map -->
            <div style="display: grid; grid-template-columns: 1fr 380px; gap: 0;">
              <!-- Stop Timeline -->
              <div style="padding: 20px 24px; border-right: 1px solid #F1F5F9;">
                <h4 style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">Stop Progression Timeline</h4>

                <!-- Map legend -->
                <div style="display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;">
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #10B981;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981;"></span> Completed
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #2563EB;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #2563EB;"></span> Current
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #F59E0B;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B;"></span> Upcoming / Affected
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #EF4444;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444;"></span> Disrupted
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #94A3B8;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #94A3B8;"></span> Pending
                  </span>
                </div>

                <!-- Stop Cards - horizontal scroll friendly grid -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${route.stops.map((stop, idx) => {
                    let dotColor = '#94A3B8', bg = '#F8FAFC', border = '#E2E8F0', statusLabel = 'Pending', labelColor = '#94A3B8';
                    let isCurrentStop = false;

                    if (stop.status === 'completed') {
                      dotColor = '#10B981'; bg = '#ECFDF5'; border = '#A7F3D0'; statusLabel = '✓ Completed'; labelColor = '#059669';
                    } else if (stop.status === 'next') {
                      dotColor = '#2563EB'; bg = '#EFF6FF'; border = '#BFDBFE'; statusLabel = '→ Next Stop'; labelColor = '#2563EB'; isCurrentStop = true;
                    } else if (stop.status === 'delayed') {
                      dotColor = '#F59E0B'; bg = '#FFFBEB'; border = '#FDE68A'; statusLabel = '⏳ Delayed'; labelColor = '#D97706'; isCurrentStop = true;
                    } else if (stop.status === 'stuck') {
                      dotColor = '#EF4444'; bg = '#FEF2F2'; border = '#FECACA'; statusLabel = '⚠ Breakdown Here'; labelColor = '#DC2626'; isCurrentStop = true;
                    } else if (stop.status === 'stranded') {
                      dotColor = '#EF4444'; bg = '#FFF0F0'; border = '#FECACA'; statusLabel = '🚨 Students Stranded'; labelColor = '#DC2626';
                    } else if (stop.status === 'destination') {
                      dotColor = '#0F2747'; bg = '#F0F4FF'; border = '#C7D2FE'; statusLabel = '🏫 Destination'; labelColor = '#0F2747';
                    }

                    return `
                      <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <!-- Timeline connector -->
                        <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0; padding-top: 6px;">
                          <div style="width: 16px; height: 16px; border-radius: 50%; background: ${dotColor}; border: 2.5px solid #fff; box-shadow: 0 0 0 2px ${dotColor}; flex-shrink: 0; ${isCurrentStop ? 'box-shadow: 0 0 0 3px ' + dotColor + '40;' : ''}"></div>
                          ${idx < route.stops.length - 1 ? `<div style="width: 2px; flex-grow: 1; min-height: 18px; background: ${dotColor}40; margin-top: 2px;"></div>` : ''}
                        </div>

                        <!-- Stop content -->
                        <div style="
                          flex-grow: 1;
                          background: ${bg};
                          border: 1.5px solid ${border};
                          border-radius: 10px;
                          padding: 10px 14px;
                          margin-bottom: ${idx < route.stops.length - 1 ? '2px' : '0'};
                          ${isCurrentStop ? 'box-shadow: 0 2px 8px rgba(37,99,235,0.12);' : ''}
                        ">
                          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <span style="font-size: 0.65rem; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Stop ${idx + 1}</span>
                              <span style="font-size: 0.7rem; font-weight: 700; color: ${labelColor};">${statusLabel}</span>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748B; font-weight: 600;">${stop.time}</span>
                          </div>
                          <div style="font-weight: 700; font-size: 0.88rem; color: #0F2747; line-height: 1.3;">${stop.name}</div>
                          ${stop.studentsCount > 0 ? `
                            <div style="margin-top: 4px; font-size: 0.72rem; color: #64748B; display: flex; align-items: center; gap: 4px;">
                              👥 <span style="font-weight: 600;">${stop.studentsCount} students</span>
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Live Mini-Map for this Route -->
              <div style="padding: 20px 20px; display: flex; flex-direction: column; gap: 12px;">
                <h4 style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">Live Route Map</h4>
                <div id="${mapId}" style="height: 360px; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; background: #E5E7EB;"></div>
                ${bus ? `
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px;">
                    <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Assigned Bus Telemetry</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.78rem;">
                      <div><span style="color: #94A3B8;">Speed:</span> <b>${bus.speedKmh} km/h</b></div>
                      <div><span style="color: #94A3B8;">${bus.type.includes('Electric') ? 'Battery' : 'Fuel'}:</span> <b>${bus.fuelLevel}%</b></div>
                      <div><span style="color: #94A3B8;">Load:</span> <b>${bus.currentLoad}/${bus.capacity}</b></div>
                      <div><span style="color: #94A3B8;">Health:</span> <b style="color: ${bus.healthScore > 85 ? '#059669' : '#EF4444'};">${bus.healthScore}%</b></div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach event handlers
  setTimeout(() => {
    // Search filter for table
    const searchInput = container.querySelector('#route-search-input');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      container.querySelectorAll('#routes-table-body tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // Jump to route card when table row is clicked
    container.querySelectorAll('.route-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const id = row.getAttribute('data-route-id');
        document.getElementById(`route-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    container.querySelectorAll('.jump-to-route-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-route-id');
        const disruptionId = btn.getAttribute('data-disruption-id');
        if (disruptionId) {
          store.setSelectedDisruption(disruptionId);
          store.setActiveTab('replanning');
          return;
        }
        document.getElementById(`route-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Replan buttons
    container.querySelectorAll('.replan-route-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-disruption-id');
        if (id) store.setSelectedDisruption(id);
        store.setActiveTab('replanning');
      });
    });

    // Recalculate button
    container.querySelector('#optimize-all-routes-btn')?.addEventListener('click', () => {
      store.showToast('Responsible AI Traffic Model: Recalculated live corridors. No new bottlenecks detected.', 'success');
    });

    // Init mini-maps for each route (with staggered delay to avoid layout race)
    routes.forEach((route, idx) => {
      setTimeout(() => {
        initRouteMap(`route-map-${route.id}`, route, buses);
      }, 100 + idx * 150);
    });
  }, 80);

  return container;
}
