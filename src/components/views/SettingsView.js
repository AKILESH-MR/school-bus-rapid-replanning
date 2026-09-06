// Settings View Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderSettingsView() {
  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div class="panel-card" style="max-width: 860px; margin: 0 auto;">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>System & Responsible AI Configurations</h2>
          <p>Control dispatch optimization weights, fairness constraints, and notification gateways</p>
        </div>
        <button class="action-btn primary" id="save-settings-btn">
          ${Icons.check(16, '#fff')} Save Preferences
        </button>
      </div>

      <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Responsible AI Guardrails -->
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #0F2747; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${Icons.shield(18, '#2563EB')} Responsible AI Optimization Parameters
          </h3>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 16px;">
            Strict ethical constraints enforced during automated rapid route replanning.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Maximum Student In-Transit Time Limit</label>
              <select class="form-select">
                <option value="45" selected>45 Minutes (District Standard)</option>
                <option value="35">35 Minutes (Strict Elementary Target)</option>
                <option value="60">60 Minutes (Maximum Rural Radius)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Maximum Acceptable Bell Delay Variance</label>
              <select class="form-select">
                <option value="10" selected>+10 Minutes (Grace Period)</option>
                <option value="5">+5 Minutes (Strict)</option>
                <option value="15">+15 Minutes (Severe Incident Only)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Fairness & Equity Weight Factor</label>
              <select class="form-select">
                <option value="0.95" selected>High (95% - Balance delays across all stops)</option>
                <option value="0.80">Medium (80% - Prioritize total fuel reduction)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">AI Auto-Recommendation Confidence Threshold</label>
              <select class="form-select">
                <option value="90" selected>90% Confidence Score Required</option>
                <option value="95">95% Confidence Score Required</option>
              </select>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #0F2747; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${Icons.phone(18, '#2563EB')} Parent & Driver Real-Time Telematics Broadcast
          </h3>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 16px;">
            Automated alerts dispatched when an AI Replanning plan is accepted by the Dispatcher.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Instant SMS Broadcast to Parents upon route modification or replacement bus dispatch</span>
            </label>

            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Push turn-by-turn recalculated GPS coordinates directly to Driver in-cab MDT tablets</span>
            </label>

            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Notify School Principal & Attendance Office of delayed arrival rosters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const saveBtn = container.querySelector('#save-settings-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        store.showToast('Responsible AI Parameters & Notification Rules Updated Successfully.', 'success');
      });
    }
  }, 50);

  return container;
}
