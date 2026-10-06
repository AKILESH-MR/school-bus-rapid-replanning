// Create Disruption Modal Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderCreateDisruptionModal() {
  const state = store.getState();
  const { buses, routes, students } = state;
  const activeStudents = students.filter(s => s.status !== 'absent_cancelled');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #FEE2E2; color: #EF4444; display: flex; align-items: center; justify-content: center;">
            ${Icons.alertTriangle(18, '#EF4444')}
          </div>
          <h3 class="modal-title">Declare Transport Disruption</h3>
        </div>
        <button class="modal-close-btn" id="close-disruption-modal-btn">
          ${Icons.x(18, 'currentColor')}
        </button>
      </div>

      <form id="create-disruption-form">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Disruption Category</label>
            <select class="form-select" id="disruption-type-select" required>
              <option value="student_cancel">Last-Minute Student Absence / Cancellation</option>
              <option value="breakdown">Vehicle Breakdown / Engine Stall</option>
              <option value="driver_unavailability">Driver Unavailability / Sickness</option>
              <option value="urgent_add">Urgent Student Addition (Same-Day Transit)</option>
              <option value="traffic_hazard">Severe Road Closure / Traffic Bottleneck</option>
            </select>
          </div>

          <div class="form-group" id="student-select-group">
            <label class="form-label">Select Absent / Cancelled Student</label>
            <select class="form-select" id="disruption-student-select">
              <option value="">-- Choose Student from Manifest --</option>
              ${activeStudents.map(s => `
                <option value="${s.id}">${s.name} (${s.id}) · Route: ${s.routeId} · Bus: ${s.busId} · Stop: ${s.stopName}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Incident Title / Summary</label>
            <input type="text" class="form-input" id="disruption-title-input" placeholder="e.g. Student Absence: Marcus Vance (RT-101)" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Affected Vehicle</label>
              <select class="form-select" id="disruption-bus-select">
                <option value="">None / Auto-determine</option>
                ${buses.map(b => `<option value="${b.id}">${b.id} (${b.plate})</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Affected Route</label>
              <select class="form-select" id="disruption-route-select">
                <option value="">None / Auto-determine</option>
                ${routes.map(r => `<option value="${r.id}">${r.name.split('-')[0]}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Incident Location / Stop</label>
              <input type="text" class="form-input" id="disruption-location-input" placeholder="e.g. Stop 3 / 24th & Mission" required />
            </div>

            <div class="form-group">
              <label class="form-label">Severity Level</label>
              <select class="form-select" id="disruption-severity-select" required>
                <option value="info" selected>Informational (Student Cancellation / Schedule Variance)</option>
                <option value="warning">Warning (Moderate Delay)</option>
                <option value="critical">Critical (Immediate Route Disruption)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Impact Details & Special Notes</label>
            <textarea class="form-textarea" id="disruption-impact-input" rows="3" placeholder="Student reported sick or absent. Route dwell time reduced..." required>Student absent for today. Route stop manifest updated and bus seat freed.</textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="action-btn secondary" id="cancel-disruption-btn">Cancel</button>
          <button type="submit" class="action-btn danger" style="padding: 10px 20px;">
            ${Icons.zap(16, '#fff')} Trigger AI Replanning Ingestion
          </button>
        </div>
      </form>
    </div>
  `;

  // Attach event handlers
  const close = () => store.closeModal();
  backdrop.querySelector('#close-disruption-modal-btn').addEventListener('click', close);
  backdrop.querySelector('#cancel-disruption-btn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const typeSelect = backdrop.querySelector('#disruption-type-select');
  const studentGroup = backdrop.querySelector('#student-select-group');
  const studentSelect = backdrop.querySelector('#disruption-student-select');
  const titleInput = backdrop.querySelector('#disruption-title-input');
  const busSelect = backdrop.querySelector('#disruption-bus-select');
  const routeSelect = backdrop.querySelector('#disruption-route-select');
  const locationInput = backdrop.querySelector('#disruption-location-input');

  const updateTypeView = () => {
    if (typeSelect.value === 'student_cancel') {
      studentGroup.style.display = 'block';
    } else {
      studentGroup.style.display = 'none';
    }
  };
  typeSelect.addEventListener('change', updateTypeView);
  updateTypeView();

  studentSelect.addEventListener('change', () => {
    const studentId = studentSelect.value;
    const student = activeStudents.find(s => s.id === studentId);
    if (student) {
      titleInput.value = `Student Cancellation: ${student.name} (${student.id})`;
      if (student.busId && student.busId !== 'UNASSIGNED') busSelect.value = student.busId;
      if (student.routeId && student.routeId !== 'UNASSIGNED') routeSelect.value = student.routeId;
      if (student.stopName) locationInput.value = student.stopName;
    }
  });

  const form = backdrop.querySelector('#create-disruption-form');
  const submitBtn = backdrop.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmitting || store.isOperationLoading('createDisruption')) return;

    const type = typeSelect.value;
    const selectedStudentId = studentSelect.value;

    if (type === 'student_cancel' && !selectedStudentId) {
      store.showToast('Please select a student from the manifest.', 'danger');
      return;
    }

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `${Icons.zap(16, '#fff')} Declaring Disruption...`;
    }

    try {
      if (type === 'student_cancel' && selectedStudentId) {
        store.closeModal();
        store.cancelStudent(selectedStudentId);
        return;
      }

      const title = titleInput.value;
      const busId = busSelect.value || null;
      const routeId = routeSelect.value || null;
      const location = locationInput.value;
      const severity = backdrop.querySelector('#disruption-severity-select').value;
      const impact = backdrop.querySelector('#disruption-impact-input').value;

      store.createDisruption({
        type,
        title,
        busId,
        routeId,
        location,
        severity,
        impact
      });
    } catch (err) {
      console.warn('Disruption declaration error:', err);
      store.showToast('Unable to declare disruption. Please check form inputs and retry.', 'danger');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${Icons.zap(16, '#fff')} Trigger AI Replanning Ingestion`;
      }
      isSubmitting = false;
    }
  });

  return backdrop;
}
