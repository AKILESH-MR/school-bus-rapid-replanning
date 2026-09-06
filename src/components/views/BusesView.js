// Buses Fleet Management View Component — Enhanced Operational Monitoring
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

// Map bus status to normalized operational status label & color
function busOperationalStatus(bus) {
  if (bus.status === 'breakdown') return { label: 'Unavailable', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  if (bus.status === 'maintenance') return { label: 'Offline', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' };
  if (bus.status === 'delayed') return { label: 'Delayed', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
  if (bus.status === 'in_transit') return { label: 'Active', color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' };
  if (bus.status === 'in_depot') return { label: 'Idle', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
  return { label: 'Offline', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' };
}

function gpsStatus(bus) {
  if (bus.gpsStatus === 'manual' || bus.isManualLocation) {
    return { label: 'Manual Checkpoint', icon: '📍', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', isLive: false };
  }
  if (bus.gpsStatus === 'no_signal' || bus.status === 'breakdown' || bus.status === 'maintenance') {
    return { label: 'No Signal', icon: '📡', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', isLive: false };
  }
  return { label: 'Live Fix', icon: '🛰️', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', isLive: true };
}

function renderBusDetailSlideout(bus, state) {
  const driver = state.drivers.find(d => d.id === bus.driverId);
  const route = state.routes.find(r => r.id === bus.routeId);
  const opStatus = busOperationalStatus(bus);
  const gps = gpsStatus(bus);
  const loadPct = Math.round((bus.currentLoad / bus.capacity) * 100);
  const availableSeats = bus.capacity - bus.currentLoad;

  return `
    <div id="bus-detail-slideout" style="
      position: fixed; top: 0; right: 0; width: 420px; height: 100vh;
      background: #fff; box-shadow: -8px 0 40px rgba(15,39,71,0.15);
      z-index: 200; display: flex; flex-direction: column;
      border-left: 1px solid #E2E8F0; animation: slideInRight 0.3s ease;
    ">
      <!-- Header -->
      <div style="padding: 20px 24px; background: var(--color-navy); color: #fff; display: flex; align-items: flex-start; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800;">${bus.id}</span>
            <span style="background: ${opStatus.bg}; color: ${opStatus.color}; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px; border: 1px solid ${opStatus.border};">
              ${opStatus.label}
            </span>
          </div>
          <div style="font-size: 0.82rem; color: #94A3B8;">${bus.model}</div>
          <div style="font-size: 0.72rem; color: #64748B; margin-top: 2px;">${bus.plate} • ${bus.type}</div>
        </div>
        <button id="close-slideout-btn" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Telemetry Grid -->
      <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; flex-grow: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Speed</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #0F2747; font-family: var(--font-mono);">${bus.speedKmh} <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;">km/h</span></div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Health</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${bus.healthScore > 90 ? '#059669' : bus.healthScore > 70 ? '#D97706' : '#EF4444'}; font-family: var(--font-mono);">${bus.healthScore}<span style="font-size: 0.8rem; font-weight: 600;">%</span></div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">${bus.type.includes('Electric') ? 'Battery' : 'Fuel'}</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${bus.fuelLevel < 20 ? '#EF4444' : bus.fuelLevel < 40 ? '#D97706' : '#0F2747'}; font-family: var(--font-mono);">${bus.fuelLevel}<span style="font-size: 0.8rem; font-weight: 600;">%</span></div>
          </div>
          <div style="background: ${gps.bg}; border: 1px solid ${gps.border}; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">GPS Signal</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: ${gps.color};">${gps.icon} ${gps.label}</div>
            <div style="font-size: 0.68rem; color: #64748B; margin-top: 2px;">${gps.isLive ? 'Live Stream' : 'Not Live (Last Known)'}</div>
          </div>
        </div>

        <!-- GPS Fallback & Location Details -->
        <div style="background: ${gps.isLive ? '#F8FAFC' : '#FEF2F2'}; border: 1px solid ${gps.isLive ? '#E2E8F0' : '#FECACA'}; border-radius: 10px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.7rem; font-weight: 700; color: ${gps.isLive ? '#64748B' : '#DC2626'}; text-transform: uppercase;">
              ${gps.isLive ? 'Simulated Fleet GPS' : '⚠️ Signal Lost — Last Known Location'}
            </div>
            <span style="font-size: 0.68rem; font-weight: 700; color: ${gps.color}; background: ${gps.bg}; padding: 2px 6px; border-radius: 4px;">
              ${gps.label}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem; color: #0F2747; margin-bottom: 4px;">
            ${bus.lastKnownLocation || 'Route Coordinates'}
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.78rem; color: #64748B; margin-bottom: 4px;">
            Coordinates: [${bus.coords[0].toFixed(5)}, ${bus.coords[1].toFixed(5)}]
          </div>
          <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 12px;">
            ⏱ Fleet Sync: ${bus.lastGpsSync || 'N/A'}
          </div>

          <button onclick="window.__manualLocationOverride('${bus.id}')" style="
            width: 100%; padding: 8px 12px; background: #fff; color: #2563EB;
            border: 1.5px solid #BFDBFE; border-radius: 8px; font-size: 0.82rem;
            font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          ">
            📍 Dispatcher Manual Location Update
          </button>
        </div>

        <!-- Capacity Bar -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #0F2747;">Passenger Load</span>
            <span style="font-size: 0.8rem; font-weight: 700; color: #64748B;">${bus.currentLoad} / ${bus.capacity} seated</span>
          </div>
          <div style="height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
            <div style="height: 100%; width: ${loadPct}%; background: ${loadPct > 90 ? '#EF4444' : loadPct > 75 ? '#F59E0B' : '#2563EB'}; border-radius: 9999px; transition: width 0.5s ease;"></div>
          </div>
          <div style="display: flex; gap: 16px;">
            <span style="font-size: 0.75rem; color: #10B981; font-weight: 700;">✓ ${availableSeats} available seats</span>
            <span style="font-size: 0.75rem; color: #64748B;">${loadPct}% capacity used</span>
          </div>
        </div>

        <!-- Driver -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Assigned Driver</div>
          ${driver ? `
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${driver.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #E2E8F0;" />
              <div>
                <div style="font-weight: 700; color: #0F2747;">${driver.name}</div>
                <div style="font-size: 0.75rem; color: #64748B;">${driver.phone}</div>
                <div style="font-size: 0.72rem; color: #F59E0B; margin-top: 2px;">★ ${driver.rating} • ${driver.experienceYrs} yrs experience</div>
              </div>
            </div>
          ` : '<span style="color: #94A3B8; font-style: italic;">No driver assigned — Depot Standby</span>'}
        </div>

        <!-- Route -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Current Route</div>
          ${route ? `
            <div style="font-weight: 700; color: #0F2747; margin-bottom: 4px;">${route.name}</div>
            <div style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">→ ${route.schoolName}</div>
            <div style="display: flex; gap: 12px; font-size: 0.75rem;">
              <span style="color: #10B981; font-weight: 700;">ETA: ${route.currentEta}</span>
              <span style="color: #64748B;">${route.completedStops}/${route.totalStops} stops done</span>
            </div>
          ` : '<span style="color: #94A3B8; font-style: italic;">No active route</span>'}
        </div>

        <!-- Features -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Vehicle Features</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${bus.amenities.map(a => `<span style="background: #EFF6FF; color: #2563EB; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px; border: 1px solid #BFDBFE;">✓ ${a}</span>`).join('')}
          </div>
        </div>

        ${bus.status === 'breakdown' ? `
          <button onclick="window.__triggerReplanning('${bus.id}')" style="width: 100%; padding: 12px; background: #EF4444; color: #fff; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ⚡ Open AI Emergency Replanning
          </button>
        ` : bus.status === 'in_transit' || bus.status === 'delayed' ? `
          <button onclick="window.__declareBreakdown('${bus.id}')" style="width: 100%; padding: 12px; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ⚠️ Report Vehicle Breakdown / Stall
          </button>
        ` : ''}
      </div>
    </div>
    <div id="slideout-backdrop" style="position: fixed; inset: 0; background: rgba(15,39,71,0.3); z-index: 199;"></div>
  `;
}

// Attach global helpers
window.__triggerReplanning = (busId) => {
  const existing = document.getElementById('bus-detail-slideout');
  const existingBd = document.getElementById('slideout-backdrop');
  if (existing) existing.remove();
  if (existingBd) existingBd.remove();
  store.handleVehicleBreakdown(busId);
};

window.__declareBreakdown = (busId) => {
  const existing = document.getElementById('bus-detail-slideout');
  const existingBd = document.getElementById('slideout-backdrop');
  if (existing) existing.remove();
  if (existingBd) existingBd.remove();
  store.handleVehicleBreakdown(busId, {
    title: `Vehicle Breakdown: Bus ${busId} Engine Stall`,
    location: 'Active Route Waypoint',
    impact: 'Engine temperature critical alert. Vehicle stopped safely.'
  });
};

window.__manualLocationOverride = (busId) => {
  const existing = document.getElementById('bus-detail-slideout');
  const existingBd = document.getElementById('slideout-backdrop');
  if (existing) existing.remove();
  if (existingBd) existingBd.remove();
  store.openModal('manual_location', { busId });
};

export function renderBusesView() {
  const state = store.getState();
  const { buses, drivers, routes } = state;

  const container = document.createElement('div');
  container.className = 'content-body';

  // Summary KPIs
  const activeCount = buses.filter(b => b.status === 'in_transit').length;
  const delayedCount = buses.filter(b => b.status === 'delayed').length;
  const idleCount = buses.filter(b => b.status === 'in_depot').length;
  const unavailableCount = buses.filter(b => b.status === 'breakdown' || b.status === 'maintenance').length;

  const statusOptions = ['all', 'active', 'idle', 'delayed', 'unavailable', 'offline'];

  container.innerHTML = `
    <!-- KPI Summary Strip -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #10B981; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="active" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Active</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">${activeCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">In transit now</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #F59E0B; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="delayed" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Delayed</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #D97706;">${delayedCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Behind schedule</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #2563EB; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="idle" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Idle</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #2563EB;">${idleCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Depot standby</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #EF4444; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="unavailable" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Unavailable</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #EF4444;">${unavailableCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Breakdown / repair</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #6B7280; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="all" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Fleet Total</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #0F2747;">${buses.length}</div>
        <div style="font-size: 0.72rem; color: #64748B;">All vehicles</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Live Fleet Monitor</h2>
          <p>Click any row to view full telemetry details. Includes GPS lock status, passenger load, and driver assignment.</p>
        </div>

        <div class="search-filter-bar">
          <div class="search-input-wrap">
            <span class="search-input-icon">${Icons.search(16, 'currentColor')}</span>
            <input type="text" id="bus-search-input" placeholder="Search Bus ID, driver, route..." />
          </div>

          <select id="bus-status-filter" class="form-select" style="width: auto; padding: 8px 12px;">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="delayed">Delayed</option>
            <option value="unavailable">Unavailable</option>
            <option value="offline">Offline</option>
          </select>

          <button class="action-btn primary" id="add-bus-btn" style="padding: 8px 14px;">
            ${Icons.plus(16, '#fff')} Register Vehicle
          </button>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Capacity</th>
              <th>Current Load</th>
              <th>Available Seats</th>
              <th>Location (Coords)</th>
              <th>GPS Status</th>
              <th>Operational Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="buses-table-body">
            ${buses.map(bus => {
              const driver = drivers.find(d => d.id === bus.driverId);
              const route = routes.find(r => r.id === bus.routeId);
              const opStatus = busOperationalStatus(bus);
              const gps = gpsStatus(bus);
              const availableSeats = bus.capacity - bus.currentLoad;
              const loadPct = Math.round((bus.currentLoad / bus.capacity) * 100);

              // Filter key for row
              let filterKey = opStatus.label.toLowerCase();
              if (filterKey === 'unavailable') filterKey = 'unavailable';
              if (filterKey === 'offline') filterKey = 'offline';

              return `
                <tr class="bus-row" data-bus-id="${bus.id}" data-filter-status="${filterKey}" style="cursor: pointer;" title="Click to view full details">
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 8px; height: 8px; border-radius: 50%; background: ${opStatus.color}; flex-shrink: 0;"></div>
                      <div>
                        <div class="bus-pill">${bus.id}</div>
                        <div style="font-size: 0.68rem; color: #94A3B8; margin-top: 2px;">${bus.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    ${driver ? `
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${driver.photo}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid #E2E8F0;" />
                        <div>
                          <div style="font-weight: 600; font-size: 0.85rem; color: #0F2747;">${driver.name}</div>
                          <div style="font-size: 0.68rem; color: #94A3B8;">${driver.shiftStart} – ${driver.shiftEnd}</div>
                        </div>
                      </div>
                    ` : `<span style="color: #94A3B8; font-style: italic; font-size: 0.82rem;">Unassigned</span>`}
                  </td>
                  <td>
                    ${route ? `
                      <div style="font-weight: 600; color: #2563EB; font-size: 0.85rem;">${route.id}</div>
                      <div style="font-size: 0.7rem; color: #64748B;">${route.schoolName}</div>
                    ` : `<span style="color: #94A3B8; font-size: 0.82rem; font-style: italic;">No Route</span>`}
                  </td>
                  <td style="text-align: center; font-weight: 700; font-family: var(--font-mono);">${bus.capacity}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; max-width: 70px; height: 6px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                        <div style="height: 100%; width: ${loadPct}%; background: ${loadPct > 90 ? '#EF4444' : loadPct > 75 ? '#F59E0B' : '#2563EB'}; border-radius: 9999px;"></div>
                      </div>
                      <span style="font-weight: 700; font-family: var(--font-mono); font-size: 0.85rem;">${bus.currentLoad}</span>
                    </div>
                  </td>
                  <td>
                    <span style="font-weight: 700; font-family: var(--font-mono); color: ${availableSeats === 0 ? '#EF4444' : availableSeats < 5 ? '#F59E0B' : '#059669'}; font-size: 0.92rem;">${availableSeats}</span>
                    <span style="font-size: 0.7rem; color: #94A3B8; margin-left: 2px;">seats</span>
                  </td>
                  <td>
                    <div style="font-weight: 600; font-size: 0.8rem; color: #0F2747; line-height: 1.3;">
                      ${bus.lastKnownLocation ? bus.lastKnownLocation.split('(')[0] : 'En Route'}
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #94A3B8; margin-top: 2px;">
                      ${bus.coords[0].toFixed(4)}, ${bus.coords[1].toFixed(4)}
                    </div>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background: ${gps.bg}; color: ${gps.color}; border: 1px solid ${gps.border};">
                      ${gps.icon} ${gps.label}
                    </span>
                    ${!gps.isLive ? `<div style="font-size: 0.65rem; color: #EF4444; font-weight: 600; margin-top: 2px;">(Not Live)</div>` : ''}
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${opStatus.bg}; color: ${opStatus.color}; border: 1px solid ${opStatus.border};">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      ${opStatus.label}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button class="action-btn ${bus.status === 'breakdown' ? 'danger' : 'secondary'} open-bus-detail-btn" data-bus-id="${bus.id}" style="padding: 4px 10px; font-size: 0.75rem; white-space: nowrap;">
                        ${bus.status === 'breakdown' ? '⚡ Replan' : 'Details'}
                      </button>
                      <button class="action-btn secondary manual-gps-btn" data-bus-id="${bus.id}" style="padding: 4px 8px; font-size: 0.75rem; white-space: nowrap; color: #2563EB;" title="Manual Location Checkpoint Override">
                        📍 Fix
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <style>
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .bus-row:hover td { background: #F0F7FF !important; }
      .kpi-filter-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15,39,71,0.08); transition: all 0.2s ease; }
      .kpi-filter-card.selected { outline: 2px solid #2563EB; }
    </style>
  `;

  function openDetailPanel(busId) {
    const bus = state.buses.find(b => b.id === busId);
    if (!bus) return;

    // Remove existing panel if any
    const existing = document.getElementById('bus-detail-slideout');
    const existingBd = document.getElementById('slideout-backdrop');
    if (existing) existing.remove();
    if (existingBd) existingBd.remove();

    const panelHtml = renderBusDetailSlideout(bus, state);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = panelHtml;
    document.body.appendChild(wrapper.children[0]);
    document.body.appendChild(wrapper.children[0]);

    const closePanel = () => {
      const panel = document.getElementById('bus-detail-slideout');
      const bd = document.getElementById('slideout-backdrop');
      if (panel) panel.remove();
      if (bd) bd.remove();
    };

    document.getElementById('close-slideout-btn')?.addEventListener('click', closePanel);
    document.getElementById('slideout-backdrop')?.addEventListener('click', closePanel);
  }

  function applyFilters() {
    const searchQuery = container.querySelector('#bus-search-input')?.value?.toLowerCase() || '';
    const statusFilter = container.querySelector('#bus-status-filter')?.value || 'all';
    const rows = container.querySelectorAll('.bus-row');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowStatus = row.getAttribute('data-filter-status');
      const matchesSearch = text.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || rowStatus === statusFilter;
      row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
  }

  // Attach event handlers
  setTimeout(() => {
    const searchInput = container.querySelector('#bus-search-input');
    searchInput?.addEventListener('input', applyFilters);

    const statusFilter = container.querySelector('#bus-status-filter');
    statusFilter?.addEventListener('change', applyFilters);

    // KPI filter cards
    container.querySelectorAll('.kpi-filter-card').forEach(card => {
      card.addEventListener('click', () => {
        const filterVal = card.getAttribute('data-status-filter');
        const select = container.querySelector('#bus-status-filter');
        if (select) select.value = filterVal;
        applyFilters();
        container.querySelectorAll('.kpi-filter-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Open detail panel on row click or button click
    container.querySelectorAll('.bus-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        openDetailPanel(row.getAttribute('data-bus-id'));
      });
    });

    container.querySelectorAll('.open-bus-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const busId = btn.getAttribute('data-bus-id');
        const bus = state.buses.find(b => b.id === busId);
        if (bus?.status === 'breakdown') {
          const disruption = state.disruptions.find(d => d.busId === busId);
          if (disruption) store.setSelectedDisruption(disruption.id);
          store.setActiveTab('replanning');
        } else {
          openDetailPanel(busId);
        }
      });
    });

    container.querySelectorAll('.manual-gps-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const busId = btn.getAttribute('data-bus-id');
        store.openModal('manual_location', { busId });
      });
    });

    container.querySelector('#add-bus-btn')?.addEventListener('click', () => {
      store.showToast('Vehicle Registration Wizard: Connected to District DMV Database', 'info');
    });
  }, 50);

  return container;
}
