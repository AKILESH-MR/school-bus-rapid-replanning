// Dashboard View Component (Dispatcher & Ops Manager Control Room)
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';
import { initLiveMap, renderMapLayers } from '../../utils/mapHelper.js';

export function renderDashboardView() {
  const state = store.getState();
  const isDispatcher = state.currentRole === 'dispatcher';
  const { metrics, disruptions, buses } = state;

  const container = document.createElement('div');
  container.className = 'content-body';

  const activeBusesCount = buses.filter(b => b.status === 'in_transit' || b.status === 'delayed').length;
  const standbyCount = buses.filter(b => b.status === 'in_depot').length;
  const unresolvedDisruptions = disruptions.filter(d => d.status === 'unresolved');

  container.innerHTML = `
    <!-- Top KPI Grid -->
    <div class="kpi-grid">
      <!-- Active Buses Card -->
      <div class="kpi-card" style="border-top: 3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Active Fleet</span>
          <div class="kpi-icon-wrap" style="background: #EFF6FF; color: #2563EB;">
            ${Icons.bus(20, '#2563EB')}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${activeBusesCount}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">/ ${buses.length} Buses</span>
        </div>
        <div class="kpi-subtext" style="display: flex; align-items: center; gap: 4px; color: #10B981; font-weight: 600;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
          ${metrics.activeRoutesCount} Active Routes Run
        </div>
      </div>

      <!-- Active Disruptions Card -->
      <div class="kpi-card" style="border-top: 3px solid ${unresolvedDisruptions.length > 0 ? '#EF4444' : '#10B981'};">
        <div class="kpi-header">
          <span class="kpi-label">Active Disruptions</span>
          <div class="kpi-icon-wrap" style="background: ${unresolvedDisruptions.length > 0 ? '#FEF2F2' : '#ECFDF5'}; color: ${unresolvedDisruptions.length > 0 ? '#EF4444' : '#10B981'};">
            ${Icons.alertTriangle(20, 'currentColor')}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: ${unresolvedDisruptions.length > 0 ? '#EF4444' : '#0F2747'};">
            ${unresolvedDisruptions.length}
          </span>
          <span style="font-size: 0.78rem; font-weight: 700; color: #DC2626;">
            ${unresolvedDisruptions.length > 0 ? 'ATTENTION REQ.' : 'ALL CLEAR'}
          </span>
        </div>
        <div class="kpi-subtext">
          1 Breakdown, 1 Sick Driver, 1 Add
        </div>
      </div>

      <!-- Total Students in Transit -->
      <div class="kpi-card" style="border-top: 3px solid #6366F1;">
        <div class="kpi-header">
          <span class="kpi-label">Students in Transit</span>
          <div class="kpi-icon-wrap" style="background: #EEF2FF; color: #6366F1;">
            ${Icons.users(20, '#6366F1')}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${metrics.totalStudentsToday}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">On Board</span>
        </div>
        <div class="kpi-subtext" style="color: #4F46E5; font-weight: 600;">
          Student roster loaded from mock data
        </div>
      </div>

      <!-- Available Standby Fleet -->
      <div class="kpi-card" style="border-top: 3px solid #10B981;">
        <div class="kpi-header">
          <span class="kpi-label">Standby Capacity</span>
          <div class="kpi-icon-wrap" style="background: #ECFDF5; color: #10B981;">
            ${Icons.shield(20, '#10B981')}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: #059669;">${standbyCount}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">Depot Reserves</span>
        </div>
        <div class="kpi-subtext" style="color: #059669; font-weight: 600;">
          2 Reserve Drivers on Duty
        </div>
      </div>

      <!-- Responsible AI Engine Status -->
      <div class="kpi-card" style="border-top: 3px solid #0F2747;">
        <div class="kpi-header">
          <span class="kpi-label">Responsible AI Status</span>
          <div class="kpi-icon-wrap" style="background: #F1F5F9; color: #0F2747;">
            ${Icons.cpu(20, '#0F2747')}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size: 1.45rem; color: #10B981;">ACTIVE</span>
        </div>
        <div class="kpi-subtext" style="font-size: 0.72rem; color: #64748B;">
          Deterministic constraint engine • Human-in-the-loop
        </div>
      </div>
    </div>

    <!-- Main Split: Live Map + Incident Command Feed -->
    <div class="dashboard-main-split">
      <!-- Large Live Map Card -->
      <div class="map-container-card">
        <div class="map-card-header">
          <div class="map-card-title">
            ${Icons.mapPin(18, '#2563EB')}
            <span>Current Fleet &amp; Route Status</span>
          </div>
          <div style="font-size: 0.7rem; color: #94A3B8; font-style: italic; margin-top: 2px; padding-left: 2px;">Representative data — simulated for MVP demonstration</div>
          <div class="map-filters" id="map-filter-group">
            <button class="map-filter-chip active" data-filter="all">All Vehicles</button>
            <button class="map-filter-chip" data-filter="transit">In Transit</button>
            <button class="map-filter-chip" data-filter="disrupted">Disruptions</button>
            <button class="map-filter-chip" data-filter="standby">Depot Standby</button>
          </div>
        </div>
        
        <div id="live-map-canvas"></div>

        <!-- Updated Legend Overlay per color spec -->
        <div class="map-legend-overlay">
          <div style="font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Map Legend</div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #2563EB;"></div> Blue — Active / Upcoming
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #10B981;"></div> Green — Completed Stops
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #F59E0B;"></div> Amber — Affected / Delayed
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #EF4444;"></div> Red — Disruption / Breakdown
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #9CA3AF;"></div> Gray — Unavailable / Depot
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #0F2747;"></div> Navy — Schools
          </div>
        </div>
      </div>

      <!-- Active Disruptions Feed Panel -->
      <div class="feed-panel-card">
        <div class="feed-header">
          <h3>
            ${Icons.alertTriangle(18, '#EF4444')}
            Active Operational Incidents
          </h3>
          <span class="severity-pill critical">${unresolvedDisruptions.length} PENDING</span>
        </div>

        <div class="feed-list" id="dashboard-disruptions-feed">
          ${disruptions.map(disruption => {
            const isUnresolved = disruption.status === 'unresolved';
            const severityClass = disruption.severity;
            return `
              <div class="incident-card ${severityClass}" data-disruption-id="${disruption.id}">
                <div class="incident-top">
                  <span class="incident-title">${disruption.title}</span>
                  <span class="severity-pill ${severityClass}">${disruption.severity}</span>
                </div>
                
                <div class="incident-meta">
                  <span>⏱ ${disruption.reportedAt}</span>
                  <span>📍 ${disruption.location}</span>
                  ${disruption.busId ? `<span>🚌 <b>${disruption.busId}</b></span>` : ''}
                </div>

                <div class="incident-impact">
                  ${disruption.impact}
                </div>

                ${disruption.aiRecommendationAvailable ? `
                  <div class="ai-rec-banner">
                    <div class="ai-rec-text">
                      ${Icons.cpu(14, '#4338CA')}
                      <span>AI Plan: ${disruption.aiRecommendation.strategy}</span>
                    </div>
                    <button class="ai-rec-action review-plan-btn" data-id="${disruption.id}">
                      ${isUnresolved ? 'Review & Replan' : 'View Plan'}
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Quick Status Table: Routes Summary -->
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Active Morning Routes — Current Status</h2>
          <p>Stop completion progress, delay variance, and assigned vehicle assignments (simulated data)</p>
        </div>
        <button class="action-btn secondary" id="view-all-routes-btn">
          ${Icons.route(16, 'currentColor')} View Full Routes Roster
        </button>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Route ID & Name</th>
              <th>Destination School</th>
              <th>Assigned Bus</th>
              <th>Driver</th>
              <th>Progress</th>
              <th>Scheduled Arrival</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.routes.map(r => {
              const bus = buses.find(b => b.id === r.assignedBus);
              const isDisrupted = r.status === 'disrupted';
              const isDelayed = r.status === 'delayed';
              const completedCount = Array.isArray(r.completedStops) ? r.completedStops.length : (r.completedStops || 0);
              const progressPct = r.routeProgressPercentage != null ? r.routeProgressPercentage : Math.round((completedCount / r.totalStops) * 100);

              return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0F2747;">${r.name}</div>
                    <div style="font-size: 0.72rem; color: #64748B;">ID: ${r.id}</div>
                  </td>
                  <td><b>${r.schoolName}</b></td>
                  <td><span class="bus-pill">${r.assignedBus || 'N/A'}</span></td>
                  <td>${r.assignedDriver}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; height: 6px; background: #E2E8F0; border-radius: 9999px; width: 80px; overflow: hidden;">
                        <div style="height: 100%; width: ${progressPct}%; background: ${isDisrupted ? '#EF4444' : '#2563EB'};"></div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 700;">${completedCount}/${r.totalStops}</span>
                    </div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-weight: 600;">${r.scheduledArrivalTime}</span>
                    ${isDelayed ? `<span style="color: #D97706; font-size: 0.72rem; font-weight: 700; margin-left: 4px;">(+${r.delayMinutes}m)</span>` : ''}
                  </td>
                  <td>
                    <span class="status-badge ${r.status}">
                      ${r.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    ${isDisrupted ? `
                      <button class="action-btn primary review-plan-btn" data-id="DIS-2026-001" style="padding: 4px 10px; font-size: 0.75rem;">
                        ⚡ Replan
                      </button>
                    ` : `
                      <button class="action-btn secondary route-inspect-btn" data-route-id="${r.id}" style="padding: 4px 10px; font-size: 0.75rem;">
                        Inspect
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event handlers after DOM attachment
  setTimeout(() => {
    initLiveMap('live-map-canvas');

    // Map filter buttons
    const filterButtons = container.querySelectorAll('#map-filter-group .map-filter-chip');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderMapLayers(filter);
      });
    });

    // Review Plan buttons
    const reviewButtons = container.querySelectorAll('.review-plan-btn');
    reviewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) {
          store.setSelectedDisruption(id);
        }
        store.setActiveTab('replanning');
      });
    });

    // View All Routes button
    const viewAllRoutes = container.querySelector('#view-all-routes-btn');
    if (viewAllRoutes) {
      viewAllRoutes.addEventListener('click', () => {
        store.setActiveTab('routes');
      });
    }

    // Inspect route button
    const inspectButtons = container.querySelectorAll('.route-inspect-btn');
    inspectButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        store.setActiveTab('routes');
      });
    });
  }, 50);

  return container;
}
