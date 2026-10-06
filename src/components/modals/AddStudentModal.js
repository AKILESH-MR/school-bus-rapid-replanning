// Add Student Modal Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderAddStudentModal() {
  const state = store.getState();
  const { schools } = state;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${Icons.users(18, '#2563EB')}
          </div>
          <h3 class="modal-title">Urgent Student Transport Onboarding</h3>
        </div>
        <button class="modal-close-btn" id="close-add-student-modal-btn">
          ${Icons.x(18, 'currentColor')}
        </button>
      </div>

      <form id="add-student-form">
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Student Full Name</label>
              <input type="text" class="form-input" id="student-name-input" placeholder="e.g. Jordan Miller" required />
            </div>

            <div class="form-group">
              <label class="form-label">Grade Level</label>
              <select class="form-select" id="student-grade-select" required>
                <option value="Elementary (3rd Grade)">Elementary (3rd Grade)</option>
                <option value="Middle School (7th Grade)" selected>Middle School (7th Grade)</option>
                <option value="High School (10th Grade)">High School (10th Grade)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Destination School</label>
              <select class="form-select" id="student-school-select" required>
                ${schools.map(s => `<option value="${s.id}" data-name="${s.name}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Requested Stop / Pickup Point</label>
              <input type="text" class="form-input" id="student-stop-input" placeholder="e.g. 18th & Castro St" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Guardian Name</label>
              <input type="text" class="form-input" id="guardian-name-input" placeholder="e.g. Rachel Miller" required />
            </div>

            <div class="form-group">
              <label class="form-label">Guardian Emergency Phone</label>
              <input type="tel" class="form-input" id="guardian-phone-input" placeholder="(555) 000-0000" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Special Accommodations / Needs</label>
            <select class="form-select" id="student-special-needs-select">
              <option value="None" selected>None (Standard Passenger)</option>
              <option value="Wheelchair Accessibility (ADA Ramp Req.)">Wheelchair Accessibility (ADA Ramp Req.)</option>
              <option value="Nut Allergy Alert">Medical: Severe Nut Allergy</option>
              <option value="Visual / Hearing Accommodation">Visual / Hearing Accommodation</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="action-btn secondary" id="cancel-add-student-btn">Cancel</button>
          <button type="submit" class="action-btn primary" style="padding: 10px 20px;">
            ${Icons.check(16, '#fff')} Register & Auto-Assign Route
          </button>
        </div>
      </form>
    </div>
  `;

  // Attach event handlers
  const close = () => store.closeModal();
  backdrop.querySelector('#close-add-student-modal-btn').addEventListener('click', close);
  backdrop.querySelector('#cancel-add-student-btn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const form = backdrop.querySelector('#add-student-form');
  const submitBtn = backdrop.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = backdrop.querySelector('#student-name-input').value.trim();
    if (!name) {
      store.showToast('Please enter the student\'s full name.', 'danger');
      return;
    }

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `${Icons.check(16, '#fff')} Registering & Assigning...`;
    }

    try {
      const grade = backdrop.querySelector('#student-grade-select').value;
      const schoolSelect = backdrop.querySelector('#student-school-select');
      const schoolId = schoolSelect.value;
      const schoolName = schoolSelect.options[schoolSelect.selectedIndex].getAttribute('data-name');
      const stopName = backdrop.querySelector('#student-stop-input').value;
      const guardianName = backdrop.querySelector('#guardian-name-input').value;
      const guardianPhone = backdrop.querySelector('#guardian-phone-input').value;
      const specialNeeds = backdrop.querySelector('#student-special-needs-select').value;

      store.addStudent({
        name,
        grade,
        schoolId,
        schoolName,
        stopName,
        guardianName,
        guardianPhone,
        specialNeeds,
        busId: "UNASSIGNED",
        routeId: "UNASSIGNED"
      });
    } catch (err) {
      console.warn('Student addition error:', err);
      store.showToast('Failed to register student. Please retry.', 'danger');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${Icons.check(16, '#fff')} Register & Auto-Assign Route`;
      }
      isSubmitting = false;
    }
  });

  return backdrop;
}
