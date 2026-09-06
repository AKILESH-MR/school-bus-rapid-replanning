// Manual Location Update Modal for Dispatchers
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderManualLocationModal() {
  const state = store.getState();
  const targetBusId = state.modalPayload?.busId || (state.buses[0] ? state.buses[0].id : '');
  const selectedBus = state.buses.find(b => b.id === targetBusId) || state.buses[0];

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  // Common landmarks and presets for quick selection
  const presets = [
    { label: '-- Select Common Checkpoint --', coords: null, name: '' },
    { label: 'Central Bus Depot (2000 Transit Way)', coords: [37.7550, -122.4050], name: 'Central Depot & Maintenance Bay' },
    { label: 'Oakridge High School Dropoff (850 Oakridge Blvd)', coords: [37.7749, -122.4194], name: 'Oakridge High School Gate' },
    { label: 'Lincoln Middle School (410 Lincoln Way)', coords: [37.7610, -122.4470], name: 'Lincoln Middle School Gate' },
    { label: 'West Valley Elementary (1220 West Valley Rd)', coords: [37.7830, -122.4080], name: 'West Valley Elementary Gate' },
    { label: 'Stop: Cole & Haight St', coords: [37.7680, -122.4550], name: 'Cole & Haight St Checkpoint' },
    { label: 'Stop: Corona Heights (Roosevelt Way)', coords: [37.7640, -122.4410], name: 'Corona Heights (Roosevelt Way)' },
    { label: 'Stop: West Portal Station', coords: [37.7400, -122.4660], name: 'West Portal Transit Hub' },
    { label: 'Stop: Japantown Plaza (Post & Buchanan)', coords: [37.7860, -122.4300], name: 'Japantown Plaza' },
    { label: 'Stop: Civic Center (Grove & Larkin)', coords: [37.7780, -122.4170], name: 'Civic Center Transit Plaza' }
  ];

  const isNoSignal = selectedBus?.gpsStatus === 'no_signal';

  backdrop.innerHTML = `
    <div class="modal-window" style="max-width: 540px;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${Icons.mapPin(20, '#2563EB')}
          </div>
          <div>
            <h3 class="modal-title">Manual Location Update</h3>
            <span style="font-size: 0.75rem; color: #64748B;">GPS Telematics Fallback & Dispatcher Checkpoint</span>
          </div>
        </div>
        <button class="modal-close-btn" id="close-manual-location-btn">
          ${Icons.x(18, 'currentColor')}
        </button>
      </div>

      <form id="manual-location-form">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- GPS Warning Alert if GPS is offline -->
          <div style="padding: 12px 14px; background: ${isNoSignal ? '#FEF2F2' : '#EFF6FF'}; border: 1px solid ${isNoSignal ? '#FECACA' : '#BFDBFE'}; border-radius: 10px; display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 1.1rem; line-height: 1;">${isNoSignal ? '📡' : '🛰️'}</span>
            <div style="font-size: 0.78rem; color: ${isNoSignal ? '#991B1B' : '#1E40AF'}; line-height: 1.4;">
              <b>${isNoSignal ? 'GPS Signal Unavailable / No Signal' : 'Dispatcher Location Override'}</b><br>
              ${isNoSignal ? 'This vehicle is currently not transmitting live telematics. Manually verify radio checkpoint coordinates. The system will display this as a verified Manual Checkpoint (never pretending to be live).' : 'Updating the location manually will mark the telemetry as a Dispatcher Manual Checkpoint.'}
            </div>
          </div>

          <!-- Select Bus -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Select Vehicle</label>
            <select id="manual-bus-select" class="form-select" required>
              ${state.buses.map(b => `
                <option value="${b.id}" ${b.id === selectedBus?.id ? 'selected' : ''}>
                  ${b.id} (${b.plate}) — ${b.gpsStatus === 'no_signal' ? '📡 No Signal' : b.gpsStatus === 'manual' ? '📍 Manual Checkpoint' : '🛰️ Live Fix'} [${b.status}]
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Current Recorded Position -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-size: 0.78rem;">
            <div style="color: #64748B; font-weight: 600; margin-bottom: 2px;">Last Recorded Position:</div>
            <div style="font-weight: 700; color: #0F2747;" id="current-recorded-loc">${selectedBus?.lastKnownLocation || 'Unknown'}</div>
            <div style="font-size: 0.72rem; color: #94A3B8; font-family: var(--font-mono); margin-top: 2px;" id="current-recorded-coords">
              Coords: [${selectedBus?.coords[0].toFixed(5)}, ${selectedBus?.coords[1].toFixed(5)}] • ${selectedBus?.lastGpsSync || 'N/A'}
            </div>
          </div>

          <!-- Quick Checkpoint Preset -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Quick Checkpoint Preset</label>
            <select id="checkpoint-preset-select" class="form-select">
              ${presets.map((p, idx) => `
                <option value="${idx}">${p.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Checkpoint Landmark Name -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Location / Landmark Name *</label>
            <input type="text" id="manual-location-name" class="form-input" placeholder="e.g. Cole & Haight St (Radio Verified)" value="${selectedBus?.lastKnownLocation || ''}" required />
          </div>

          <!-- Coordinates Inputs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Latitude *</label>
              <input type="number" step="0.0001" id="manual-lat" class="form-input" value="${selectedBus?.coords[0] || 37.77}" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Longitude *</label>
              <input type="number" step="0.0001" id="manual-lng" class="form-input" value="${selectedBus?.coords[1] || -122.42}" required />
            </div>
          </div>

          <!-- Reason / Radio Dispatch Note -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Verification Source / Dispatch Note</label>
            <input type="text" id="manual-reason" class="form-input" placeholder="e.g. Driver VHF radio check-in, visual confirmation, or tow arrival" value="Driver radio checkpoint check-in" />
          </div>

        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="action-btn secondary" id="cancel-manual-location-btn">Cancel</button>
          <button type="submit" class="action-btn primary" id="save-manual-location-btn">
            ${Icons.mapPin(16, '#fff')}
            Confirm Manual Location
          </button>
        </div>
      </form>
    </div>
  `;

  const form = backdrop.querySelector('#manual-location-form');
  const busSelect = backdrop.querySelector('#manual-bus-select');
  const presetSelect = backdrop.querySelector('#checkpoint-preset-select');
  const latInput = backdrop.querySelector('#manual-lat');
  const lngInput = backdrop.querySelector('#manual-lng');
  const locNameInput = backdrop.querySelector('#manual-location-name');

  // Handle bus select change
  busSelect.addEventListener('change', () => {
    const bId = busSelect.value;
    const b = state.buses.find(item => item.id === bId);
    if (b) {
      latInput.value = b.coords[0];
      lngInput.value = b.coords[1];
      locNameInput.value = b.lastKnownLocation || '';
      const recLoc = backdrop.querySelector('#current-recorded-loc');
      const recCoords = backdrop.querySelector('#current-recorded-coords');
      if (recLoc) recLoc.textContent = b.lastKnownLocation || 'Unknown';
      if (recCoords) recCoords.textContent = `Coords: [${b.coords[0].toFixed(5)}, ${b.coords[1].toFixed(5)}] • ${b.lastGpsSync || 'N/A'}`;
    }
  });

  // Handle preset change
  presetSelect.addEventListener('change', () => {
    const idx = parseInt(presetSelect.value, 10);
    const preset = presets[idx];
    if (preset && preset.coords) {
      latInput.value = preset.coords[0];
      lngInput.value = preset.coords[1];
      locNameInput.value = preset.name;
    }
  });

  // Handle form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const busId = busSelect.value;
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);
    const locName = locNameInput.value.trim();
    const reason = backdrop.querySelector('#manual-reason')?.value.trim() || 'Dispatcher Manual Checkpoint';

    if (isNaN(lat) || isNaN(lng)) {
      store.showToast('Please enter valid numerical latitude and longitude coordinates.', 'danger');
      return;
    }

    store.updateBusLocationManually(busId, [lat, lng], locName, reason);
  });

  const close = () => store.closeModal();
  backdrop.querySelector('#close-manual-location-btn').addEventListener('click', close);
  backdrop.querySelector('#cancel-manual-location-btn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  return backdrop;
}
