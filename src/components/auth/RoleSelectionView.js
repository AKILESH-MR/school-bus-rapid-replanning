// Role Selection View Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderRoleSelectionView() {
  const state = store.getState();
  const userName = state.currentUser ? state.currentUser.name : 'Operator';

  const container = document.createElement('div');
  container.className = 'role-selection-container';

  container.innerHTML = `
    <div class="auth-bg-grid"></div>
    <div class="role-select-box">
      <div class="role-select-title-group">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
          ${Icons.shield(16, '#60A5FA')}
          <span style="font-size: 0.8rem; font-weight: 700; color: #93C5FD; text-transform: uppercase;">Authenticated: ${userName}</span>
        </div>
        <h1>Select Your Operational Role</h1>
        <p>Choose your workspace mode to access dedicated command tools and intelligence feeds.</p>
      </div>

      <div class="role-cards-grid">
        <!-- Dispatcher Role Card -->
        <div class="role-card" id="select-dispatcher-card">
          <div class="role-card-badge" style="background: #EFF6FF; color: #2563EB;">Operational Command</div>
          <div class="role-card-icon" style="background: #EFF6FF; color: #2563EB;">
            ${Icons.bus(28, '#2563EB')}
          </div>
          <h2 class="role-card-title">Dispatcher</h2>
          <p class="role-card-desc">
            Direct operational frontline control to monitor real-time bus fleets, log instant disruptions, trigger AI replanning, and execute routing decisions.
          </p>
          <ul class="role-features-list">
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Monitor live buses, telemetry & active routes
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Declare vehicle breakdowns & student changes
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Run Responsible AI Rapid Replanning engine
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Review, Accept, Modify, or Reject route solutions
            </li>
          </ul>
          <button class="action-btn primary" style="justify-content: center; width: 100%; padding: 14px;">
            Enter as Dispatcher ${Icons.arrowRight(16, '#fff')}
          </button>
        </div>

        <!-- Operations Manager Role Card -->
        <div class="role-card" id="select-ops-card">
          <div class="role-card-badge" style="background: #F1F5F9; color: #0F2747;">Supervisory Oversight</div>
          <div class="role-card-icon" style="background: #F1F5F9; color: #0F2747;">
            ${Icons.activity(28, '#0F2747')}
          </div>
          <h2 class="role-card-title">Operations Manager</h2>
          <p class="role-card-desc">
            High-level supervisory oversight to inspect fleet recovery times, system reliability SLAs, safety audits, and generate executive compliance reports.
          </p>
          <ul class="role-features-list">
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Global district operations & disruption trends
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Track average incident recovery time (SLA)
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Deterministic safety & ADA constraint validation
            </li>
            <li class="role-feature-item">
              ${Icons.check(16, '#10B981')} Performance metrics, carbon savings & audit logs
            </li>
          </ul>
          <button class="action-btn secondary" style="justify-content: center; width: 100%; padding: 14px; background: #0F2747; color: #FFFFFF; border-color: #0F2747;">
            Enter as Operations Manager ${Icons.arrowRight(16, '#fff')}
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  container.querySelector('#select-dispatcher-card').addEventListener('click', () => {
    store.selectRole('dispatcher');
  });

  container.querySelector('#select-ops-card').addEventListener('click', () => {
    store.selectRole('operations_manager');
  });

  return container;
}
