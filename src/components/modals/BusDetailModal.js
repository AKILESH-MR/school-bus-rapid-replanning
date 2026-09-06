// Bus Detail Modal Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderBusDetailModal() {
  const state = store.getState();
  const busId = state.modalPayload?.busId;
  const bus = state.buses.find(b => b.id === busId) || state.buses[0];
  const driver = state.drivers.find(d => d.id === bus.driverId);
  const route = state.routes.find(r => r.id === bus.routeId);

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${Icons.bus(18, '#2563EB')}
          </div>
          <div>
            <h3 class="modal-title">${bus.id} - ${bus.model}</h3>
            <span style="font-size: 0.75rem; color: #64748B;">License Plate: ${bus.plate}</span>
          </div>
        </div>
        <button class="modal-close-btn" id="close-bus-detail-btn">
          ${Icons.x(18, 'currentColor')}
        </button>
      </div>

      <div class="modal-body">
        <!-- Telemetry Summary -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; background: #F8FAFC; padding: 16px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Battery / Fuel</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #0F2747;">${bus.fuelLevel}%</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Speed</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #0F2747;">${bus.speedKmh} km/h</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Health Score</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: ${bus.healthScore > 90 ? '#10B981' : '#EF4444'};">${bus.healthScore}%</div>
          </div>
        </div>

        <!-- Driver & Route Info -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #E2E8F0; border-radius: 10px;">
            <div>
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Assigned Driver</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #0F2747;">${driver ? driver.name : 'Unassigned'}</div>
              ${driver ? `<div style="font-size: 0.75rem; color: #2563EB;">${driver.phone} • Rating: ${driver.rating} ★</div>` : ''}
            </div>
            ${driver ? `<img src="${driver.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />` : ''}
          </div>

          <div style="padding: 12px; border: 1px solid #E2E8F0; border-radius: 10px;">
            <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Assigned Route & Destination</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0F2747;">${route ? route.name : 'Depot Standby'}</div>
            ${route ? `<div style="font-size: 0.78rem; color: #64748B;">School: <b>${route.schoolName}</b> • ETA: <b>${route.currentEta}</b></div>` : ''}
          </div>
        </div>

        <!-- Amenities & Safety Equipment -->
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Vehicle Features & Certifications</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${bus.amenities.map(a => `
              <span style="background: #EFF6FF; color: #2563EB; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #BFDBFE;">
                ✓ ${a}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="action-btn secondary" id="close-bus-detail-btn2">Close</button>
      </div>
    </div>
  `;

  const close = () => store.closeModal();
  backdrop.querySelector('#close-bus-detail-btn').addEventListener('click', close);
  backdrop.querySelector('#close-bus-detail-btn2').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  return backdrop;
}
