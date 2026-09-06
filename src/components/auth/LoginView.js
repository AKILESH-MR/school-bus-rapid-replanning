// Login / Welcome View Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'auth-container';

  container.innerHTML = `
    <div class="auth-bg-grid"></div>
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo-badge">
          ${Icons.bus(32, '#FFFFFF')}
        </div>
        <h1 class="auth-title">School Transport Control Center</h1>
        <p class="auth-subtitle">Rapid Replanning & Responsible AI System</p>
        <div class="auth-badge-tag">
          ${Icons.shield(14, '#2563EB')}
          District Transport Security Protocol v4.2
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        <p style="font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; text-align: center;">
          Select Operational Role
        </p>

        <!-- Dispatcher Quick Profile Button -->
        <button id="login-dispatcher-btn" class="action-btn primary" style="
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        ">
          Dispatcher
        </button>

        <!-- Operations Manager Quick Profile Button -->
        <button id="login-ops-btn" class="action-btn secondary" style="
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          background: #0F2747;
          color: white;
          border-color: #0F2747;
        ">
          Operations Manager
        </button>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: #94A3B8;">
        <span style="display: flex; align-items: center; gap: 5px;">
          <span style="width: 6px; height: 6px; background: #10B981; border-radius: 50%;"></span> AI Dispatch Server: Online
        </span>
        <span>Version 2026.4.1</span>
      </div>
    </div>
  `;

  // Event handlers
  const dispatcherBtn = container.querySelector('#login-dispatcher-btn');
  dispatcherBtn.addEventListener('click', () => {
    store.login({
      name: "Dispatcher",
      roleDefault: "dispatcher",
      title: "Lead Dispatcher",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    });
    store.selectRole('dispatcher');
  });

  const opsBtn = container.querySelector('#login-ops-btn');
  opsBtn.addEventListener('click', () => {
    store.login({
      name: "Operations Manager",
      roleDefault: "operations_manager",
      title: "Operations Director",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80"
    });
    store.selectRole('operations_manager');
  });

  return container;
}
