// Header Component with GPS & Network Resilience Controls
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderHeader() {
  const state = store.getState();
  const isDispatcher = state.currentRole === 'dispatcher';
  const activeTabName = state.activeTab.charAt(0).toUpperCase() + state.activeTab.slice(1);
  const netStatus = state.networkStatus || 'online';
  const pendingCount = state.pendingOfflineChanges ? state.pendingOfflineChanges.length : 0;

  const header = document.createElement('header');
  header.className = 'top-header';

  // Live time formatting
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // Network badge colors and labels
  const netConfig = {
    online: { label: 'Online', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: '🟢' },
    degraded: { label: 'Degraded', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '🟡' },
    offline: { label: 'Offline', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', icon: '🔴' }
  }[netStatus] || { label: 'Online', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: '🟢' };

  header.innerHTML = `
    <div class="header-left">
      <div class="page-title-group">
        <h1>
          ${activeTabName}
          <span class="live-status-pill">
            <span class="live-dot"></span>
            ${isDispatcher ? 'DISPATCH RADAR' : 'OPS MONITOR'}
          </span>
        </h1>
      </div>
    </div>

    <div class="header-right" style="display: flex; align-items: center; gap: 14px;">
      
      <!-- Network Failure & Resilience Widget -->
      <div class="network-status-control" style="
        display: flex; align-items: center; gap: 8px;
        background: ${netConfig.bg}; border: 1px solid ${netConfig.border};
        padding: 5px 10px; border-radius: 9999px;
      ">
        <span style="font-size: 0.72rem; font-weight: 800; color: ${netConfig.color}; display: flex; align-items: center; gap: 5px;">
          ${netConfig.icon} System:
        </span>
        <select id="header-network-select" style="
          background: transparent; border: none; font-size: 0.75rem;
          font-weight: 700; color: ${netConfig.color}; cursor: pointer;
          outline: none; padding-right: 4px;
        " title="Simulate Network State (Online, Degraded, Offline)">
          <option value="online" ${netStatus === 'online' ? 'selected' : ''}>Online</option>
          <option value="degraded" ${netStatus === 'degraded' ? 'selected' : ''}>Degraded</option>
          <option value="offline" ${netStatus === 'offline' ? 'selected' : ''}>Offline</option>
        </select>
      </div>

      <!-- GPS Layer Status Widget -->
      <div class="gps-status-control" style="
        display: flex; align-items: center; gap: 6px;
        background: #F0F9FF; border: 1px solid #BAE6FD;
        padding: 5px 10px; border-radius: 9999px;
      " title="GPS Integration Layer: Simulated Telematics (MVP demonstration environment — no real physical bus tracking devices connected)">
        <span style="font-size: 0.72rem; font-weight: 800; color: #0284C7; display: flex; align-items: center; gap: 4px;">
          🛰️ GPS:
        </span>
        <span style="font-size: 0.72rem; font-weight: 700; color: #0369A1; background: #E0F2FE; padding: 1px 7px; border-radius: 9999px;">
          Simulated Layer
        </span>
      </div>

      <!-- Live Clock -->
      <div class="header-time-widget">
        <span class="header-time-val" id="live-header-clock">${timeString}</span>
        <span class="header-date-val">${dateString}</span>
      </div>

      <!-- Header Action Buttons -->
      <div class="header-actions">
        ${isDispatcher ? `
          <button id="header-manual-loc-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;" title="Manually update bus location when GPS is unavailable">
            ${Icons.mapPin(15, 'currentColor')}
            Manual GPS Fix
          </button>
          <button id="header-report-disruption-btn" class="action-btn danger" style="padding: 7px 12px; font-size: 0.8rem;">
            ${Icons.alertTriangle(15, '#fff')}
            Report Disruption
          </button>
          <button id="header-add-student-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${Icons.plus(15, 'currentColor')}
            Urgent Student Add
          </button>
        ` : `
          <button id="header-manual-loc-btn-ops" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${Icons.mapPin(15, 'currentColor')}
            Manual GPS Fix
          </button>
          <button id="header-export-audit-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${Icons.fileText(15, 'currentColor')}
            Export Fleet Audit
          </button>
          <button id="header-report-disruption-btn-ops" class="action-btn danger" style="padding: 7px 12px; font-size: 0.8rem;">
            ${Icons.alertTriangle(15, '#fff')}
            Declare Incident
          </button>
        `}
      </div>
    </div>

    <!-- Visible Network Status & Store-and-Forward Banner -->
    ${netStatus === 'offline' ? `
      <div style="grid-column: 1 / -1; width: 100%; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 16px; margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #991B1B;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-weight: 800; background: #EF4444; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem;">OFFLINE</span>
          <span>Offline mode active. Actions will be stored locally and synchronized when connectivity returns.</span>
          <span style="background: #FEE2E2; border: 1px solid #FCA5A5; font-weight: 700; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem;">Pending Sync: ${pendingCount}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="banner-view-pending-btn" class="action-btn secondary" style="padding: 4px 10px; font-size: 0.75rem;">View Pending Actions</button>
          <button id="banner-retry-sync-btn" class="action-btn warning" style="padding: 4px 10px; font-size: 0.75rem;">Retry Sync</button>
        </div>
      </div>
    ` : (pendingCount > 0 ? `
      <div style="grid-column: 1 / -1; width: 100%; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 16px; margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #92400E;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-weight: 800; background: #F59E0B; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem;">RESTORED</span>
          <span>Network restored. <b>${pendingCount}</b> pending action(s) ready for synchronization.</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="banner-sync-now-btn" class="action-btn primary" style="padding: 4px 12px; font-size: 0.75rem;">Sync Now</button>
          <button id="banner-view-pending-btn" class="action-btn secondary" style="padding: 4px 10px; font-size: 0.75rem;">View Pending Actions</button>
        </div>
      </div>
    ` : '')}
  `;

  // Attach event listeners
  const netSelect = header.querySelector('#header-network-select');
  if (netSelect) {
    netSelect.addEventListener('change', (e) => {
      store.setNetworkStatus(e.target.value);
    });
  }

  const bannerSyncBtn = header.querySelector('#banner-sync-now-btn');
  if (bannerSyncBtn) {
    bannerSyncBtn.addEventListener('click', () => {
      store.syncPendingOfflineChanges();
    });
  }

  const bannerViewPendingBtn = header.querySelector('#banner-view-pending-btn');
  if (bannerViewPendingBtn) {
    bannerViewPendingBtn.addEventListener('click', () => {
      store.openModal('pending_actions');
    });
  }

  const bannerRetrySyncBtn = header.querySelector('#banner-retry-sync-btn');
  if (bannerRetrySyncBtn) {
    bannerRetrySyncBtn.addEventListener('click', () => {
      store.retryFailedActions();
    });
  }

  const manualLocBtn = header.querySelector('#header-manual-loc-btn') || header.querySelector('#header-manual-loc-btn-ops');
  if (manualLocBtn) {
    manualLocBtn.addEventListener('click', () => {
      store.openModal('manual_location');
    });
  }

  const reportBtn = header.querySelector('#header-report-disruption-btn') || header.querySelector('#header-report-disruption-btn-ops');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      store.openModal('create_disruption');
    });
  }

  const addStudentBtn = header.querySelector('#header-add-student-btn');
  if (addStudentBtn) {
    addStudentBtn.addEventListener('click', () => {
      store.openModal('add_student');
    });
  }

  const exportBtn = header.querySelector('#header-export-audit-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      store.showToast('Generating Department of Education Compliance Audit Report (PDF)...', 'success');
    });
  }

  return header;
}

