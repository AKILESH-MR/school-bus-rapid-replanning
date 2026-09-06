// Disruptions Incident Management View Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderDisruptionsView() {
  const state = store.getState();
  const { disruptions } = state;

  const container = document.createElement('div');
  container.className = 'content-body';

  const unresolved = disruptions.filter(d => d.status === 'unresolved');
  const accepted = disruptions.filter(d => d.status === 'accepted' || d.status === 'completed');

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">Disruption Command Center</h2>
        <p style="font-size: 0.85rem; color: #64748B;">
          Real-time incident triage: vehicle breakdowns, driver unavailability, cancellations & urgent additions
        </p>
      </div>

      <button class="action-btn danger" id="create-disruption-btn" style="padding: 10px 18px;">
        ${Icons.alertTriangle(18, '#fff')} Declare New Disruption
      </button>
    </div>

    <!-- Quick Status Badges Filter -->
    <div style="display: flex; gap: 10px; margin-bottom: 20px;" id="disruption-filter-tabs">
      <button class="map-filter-chip active" data-filter="all">All Incidents (${disruptions.length})</button>
      <button class="map-filter-chip" data-filter="unresolved">Unresolved (${unresolved.length})</button>
      <button class="map-filter-chip" data-filter="breakdown">Breakdowns</button>
      <button class="map-filter-chip" data-filter="driver">Driver Absent</button>
      <button class="map-filter-chip" data-filter="student">Student Changes</button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 20px;" id="disruptions-cards-container">
      ${disruptions.map(d => {
        const isUnresolved = d.status === 'unresolved';
        const isAccepted = d.status === 'accepted';
        const isCritical = d.severity === 'critical';

        return `
          <div class="panel-card" style="padding: 24px; border-left: 5px solid ${isCritical ? '#EF4444' : d.severity === 'warning' ? '#F59E0B' : '#2563EB'};" data-type="${d.type}" data-status="${d.status}">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="severity-pill ${d.severity}">${d.severity}</span>
                  <span style="font-size: 0.72rem; color: #64748B; font-weight: 700;">${d.id}</span>
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F2747; margin-top: 6px;">
                  ${d.title}
                </h3>
              </div>
              <span class="status-badge ${d.status}">${d.status.toUpperCase()}</span>
            </div>

            <div style="font-size: 0.8rem; color: #64748B; display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
              <div>⏱ <b>Reported:</b> ${d.reportedAt}</div>
              <div>📍 <b>Location:</b> ${d.location}</div>
              ${d.busId ? `<div>🚌 <b>Vehicle Affected:</b> ${d.busId} (${d.routeId || 'N/A'})</div>` : ''}
              <div style="color: #0F2747; background: #F8FAFC; padding: 8px 12px; border-radius: 8px; border: 1px solid #E2E8F0; margin-top: 4px;">
                <b>Impact:</b> ${d.impact}
              </div>
            </div>

            ${d.aiRecommendationAvailable ? `
              <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 0.75rem; font-weight: 800; color: #1D4ED8; display: flex; align-items: center; gap: 6px;">
                    ${Icons.cpu(14, '#2563EB')} Responsible AI Plan: ${d.aiRecommendation.planId}
                  </span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: #10B981;">
                    ADA & Constraint Verified
                  </span>
                </div>
                <div style="font-size: 0.78rem; color: #1E3A8A; line-height: 1.4;">
                  <b>${d.aiRecommendation.strategy}:</b> ${d.aiRecommendation.explanation.slice(0, 110)}...
                </div>
              </div>
            ` : ''}

            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
              <button class="action-btn primary launch-replanning-btn" data-disruption-id="${d.id}" style="padding: 8px 16px; font-size: 0.82rem;">
                ${isUnresolved ? `${Icons.zap(16, '#fff')} Open AI Replanning Engine` : 'View Executed Plan'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach event handlers
  setTimeout(() => {
    const createBtn = container.querySelector('#create-disruption-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        store.openModal('create_disruption');
      });
    }

    const launchButtons = container.querySelectorAll('.launch-replanning-btn');
    launchButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-disruption-id');
        if (id) store.setSelectedDisruption(id);
        store.setActiveTab('replanning');
      });
    });

    const filterChips = container.querySelectorAll('#disruption-filter-tabs .map-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-filter');
        const cards = container.querySelectorAll('#disruptions-cards-container .panel-card');
        
        cards.forEach(card => {
          const type = card.getAttribute('data-type');
          const status = card.getAttribute('data-status');

          if (filter === 'all') {
            card.style.display = '';
          } else if (filter === 'unresolved') {
            card.style.display = status === 'unresolved' ? '' : 'none';
          } else if (filter === 'breakdown') {
            card.style.display = type === 'breakdown' ? '' : 'none';
          } else if (filter === 'driver') {
            card.style.display = type === 'driver_unavailability' ? '' : 'none';
          } else if (filter === 'student') {
            card.style.display = (type === 'student_cancel' || type === 'urgent_add') ? '' : 'none';
          }
        });
      });
    });
  }, 50);

  return container;
}
