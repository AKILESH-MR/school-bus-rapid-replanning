// Students Management View — Enhanced with filters, attendance, priority, and compact layout
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

// Priority mapping
function studentPriority(s) {
  if (s.status === 'stranded') return { label: 'Critical', color: '#EF4444', bg: '#FEF2F2' };
  if (s.status === 'urgent_added') return { label: 'High', color: '#D97706', bg: '#FFFBEB' };
  if (s.specialNeeds && s.specialNeeds !== 'None') return { label: 'High', color: '#D97706', bg: '#FFFBEB' };
  if (s.status === 'absent_cancelled') return { label: 'Low', color: '#94A3B8', bg: '#F8FAFC' };
  return { label: 'Normal', color: '#10B981', bg: '#ECFDF5' };
}

// Attendance label from status
function attendanceLabel(status) {
  const map = {
    boarded: { label: 'Boarded', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    waiting: { label: 'Waiting', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    absent_cancelled: { label: 'Absent', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
    urgent_added: { label: 'Pending Assign', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    stranded: { label: 'Stranded', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
  };
  return map[status] || { label: status, color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' };
}

export function renderStudentsView() {
  const state = store.getState();
  const { students, buses, routes } = state;

  const container = document.createElement('div');
  container.className = 'content-body';

  // Gather unique bus IDs and route IDs for filter dropdowns
  const uniqueBuses = [...new Set(students.map(s => s.busId).filter(b => b && b !== 'UNASSIGNED'))];
  const uniqueRoutes = [...new Set(students.map(s => s.routeId).filter(r => r && r !== 'UNASSIGNED'))];

  // Attendance stats
  const boardedCount = students.filter(s => s.status === 'boarded').length;
  const waitingCount = students.filter(s => s.status === 'waiting').length;
  const absentCount = students.filter(s => s.status === 'absent_cancelled').length;
  const strandedCount = students.filter(s => s.status === 'stranded').length;
  const urgentCount = students.filter(s => s.status === 'urgent_added').length;

  container.innerHTML = `
    <!-- Attendance KPI Strip -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #10B981; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Boarded</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">${boardedCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">On bus now</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #F59E0B; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Waiting</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #D97706;">${waitingCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">At pickup stop</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #EF4444; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Stranded</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #DC2626;">${strandedCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Needs rescue</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #6B7280; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Absent</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #6B7280;">${absentCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Cancelled today</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #7C3AED; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Urgent Add</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #7C3AED;">${urgentCount}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Same-day addition</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header" style="flex-wrap: wrap; gap: 12px;">
        <div class="panel-title-area">
          <h2>Student Passenger Manifest</h2>
          <p>${students.length} registered morning commuters · Real-time boarding, attendance, and priority tracking</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Search -->
          <div class="search-input-wrap">
            <span class="search-input-icon">${Icons.search(16, 'currentColor')}</span>
            <input type="text" id="student-search-input" placeholder="Search name, ID, stop, school..." style="width: 220px;" />
          </div>

          <!-- Attendance Filter -->
          <select id="student-attendance-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by attendance">
            <option value="all">All Attendance</option>
            <option value="boarded">Boarded</option>
            <option value="waiting">Waiting</option>
            <option value="stranded">Stranded</option>
            <option value="absent_cancelled">Absent</option>
            <option value="urgent_added">Urgent Add</option>
          </select>

          <!-- Bus Filter -->
          <select id="student-bus-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by bus">
            <option value="all">All Buses</option>
            ${uniqueBuses.map(b => `<option value="${b}">${b}</option>`).join('')}
          </select>

          <!-- Route Filter -->
          <select id="student-route-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by route">
            <option value="all">All Routes</option>
            ${uniqueRoutes.map(r => `<option value="${r}">${r}</option>`).join('')}
          </select>

          <button class="action-btn primary" id="open-add-student-modal-btn" style="white-space: nowrap;">
            ${Icons.plus(16, '#fff')} Urgent Add
          </button>
        </div>
      </div>

      <!-- Results count bar -->
      <div style="padding: 10px 24px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; font-size: 0.78rem; color: #64748B;">
        Showing <b id="students-visible-count">${students.length}</b> of ${students.length} students
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Pickup Location</th>
              <th>Attendance</th>
              <th>Priority</th>
              <th>Assigned Bus</th>
              <th>Route</th>
              <th>Special Needs</th>
              <th>Guardian</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="students-table-body">
            ${students.map(s => {
              const att = attendanceLabel(s.status);
              const pri = studentPriority(s);
              const isStranded = s.status === 'stranded';
              const isUrgentAdd = s.status === 'urgent_added';

              return `
                <tr data-attendance="${s.status}" data-bus="${s.busId}" data-route="${s.routeId}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="position: relative; flex-shrink: 0;">
                        <img src="${s.photo}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid ${att.border || '#E2E8F0'};" />
                        ${isStranded ? '<span style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #EF4444; border-radius: 50%; border: 2px solid #fff;"></span>' : ''}
                        ${isUrgentAdd ? '<span style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #7C3AED; border-radius: 50%; border: 2px solid #fff;"></span>' : ''}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: #0F2747; font-size: 0.88rem;">${s.name}</div>
                        <div style="font-size: 0.7rem; color: #64748B;">${s.grade} · ${s.schoolName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.78rem; color: #475569; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${s.id}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.85rem; font-weight: 600; color: #0F2747; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${s.stopName}">
                      📍 ${s.stopName}
                    </div>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${att.bg}; color: ${att.color}; border: 1px solid ${att.border};">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      ${att.label}
                    </span>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${pri.bg}; color: ${pri.color};">
                      ${pri.label}
                    </span>
                  </td>
                  <td>
                    ${s.busId !== 'UNASSIGNED' ? `
                      <span class="bus-pill">${s.busId}</span>
                    ` : `
                      <span style="color: #94A3B8; font-style: italic; font-size: 0.78rem;">Unassigned</span>
                    `}
                  </td>
                  <td>
                    ${s.routeId !== 'UNASSIGNED' ? `
                      <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: #2563EB;">${s.routeId}</span>
                    ` : `
                      <span style="color: #94A3B8; font-style: italic; font-size: 0.78rem;">Unassigned</span>
                    `}
                  </td>
                  <td>
                    ${s.specialNeeds && s.specialNeeds !== 'None' ? `
                      <span style="background: #FEF3C7; color: #92400E; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-block; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${s.specialNeeds}">
                        ♿ ${s.specialNeeds}
                      </span>
                    ` : `<span style="color: #94A3B8; font-size: 0.78rem;">Standard</span>`}
                  </td>
                  <td>
                    <div style="font-size: 0.8rem; font-weight: 600; color: #0F2747;">${s.guardianName}</div>
                    <a href="tel:${s.guardianPhone}" style="font-size: 0.72rem; color: #2563EB; text-decoration: none; display: inline-flex; align-items: center; gap: 3px;">
                      ${Icons.phone(11, '#2563EB')} ${s.guardianPhone}
                    </a>
                  </td>
                  <td>
                    ${isStranded ? `
                      <button class="action-btn danger replan-student-btn" data-disruption-id="DIS-2026-001" style="padding: 4px 10px; font-size: 0.75rem; white-space: nowrap;">
                        ⚡ Assist
                      </button>
                    ` : s.status === 'urgent_added' ? `
                      <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="action-btn primary approve-urgent-btn" data-student-id="${s.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Approve Recommended Bus Assignment">
                          ${Icons.check(12, '#fff')} Approve
                        </button>
                        <button class="action-btn secondary review-urgent-btn" data-student-id="${s.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Review in Replanning Console">
                          Review
                        </button>
                      </div>
                    ` : s.status === 'absent_cancelled' ? `
                      <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 600;">Cancelled / Absent</span>
                    ` : `
                      <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="action-btn danger cancel-student-btn" data-student-id="${s.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Cancel Student & Rapid Replan">
                          ${Icons.x(12, '#fff')} Cancel
                        </button>
                        <button class="action-btn secondary notify-guardian-btn" data-student-id="${s.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;">
                          ${Icons.phone(12, 'currentColor')} Notify
                        </button>
                      </div>
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

  // Unified filter function
  function applyFilters() {
    const search = container.querySelector('#student-search-input')?.value?.toLowerCase() || '';
    const attendance = container.querySelector('#student-attendance-filter')?.value || 'all';
    const bus = container.querySelector('#student-bus-filter')?.value || 'all';
    const route = container.querySelector('#student-route-filter')?.value || 'all';

    let visible = 0;
    container.querySelectorAll('#students-table-body tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowAtt = row.getAttribute('data-attendance');
      const rowBus = row.getAttribute('data-bus');
      const rowRoute = row.getAttribute('data-route');

      const matchSearch = text.includes(search);
      const matchAtt = attendance === 'all' || rowAtt === attendance;
      const matchBus = bus === 'all' || rowBus === bus;
      const matchRoute = route === 'all' || rowRoute === route;

      const show = matchSearch && matchAtt && matchBus && matchRoute;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const countEl = container.querySelector('#students-visible-count');
    if (countEl) countEl.textContent = visible;
  }

  // Attach event handlers
  setTimeout(() => {
    container.querySelector('#student-search-input')?.addEventListener('input', applyFilters);
    container.querySelector('#student-attendance-filter')?.addEventListener('change', applyFilters);
    container.querySelector('#student-bus-filter')?.addEventListener('change', applyFilters);
    container.querySelector('#student-route-filter')?.addEventListener('change', applyFilters);

    container.querySelector('#open-add-student-modal-btn')?.addEventListener('click', () => {
      store.openModal('add_student');
    });

    container.querySelectorAll('.approve-urgent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-student-id');
        if (id) {
          store.approveUrgentAddition(id);
        }
      });
    });

    container.querySelectorAll('.review-urgent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-student-id');
        const state = store.getState();
        const d = state.disruptions.find(dis => dis.studentId === id);
        if (d) store.setSelectedDisruption(d.id);
        store.setActiveTab('replanning');
      });
    });

    container.querySelectorAll('.cancel-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-student-id');
        if (id) {
          store.cancelStudent(id);
        }
      });
    });

    container.querySelectorAll('.replan-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-disruption-id');
        if (id) store.setSelectedDisruption(id);
        store.setActiveTab('replanning');
      });
    });

    container.querySelectorAll('.notify-guardian-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        store.showToast('SMS & Parent Portal notification dispatched to guardian.', 'success');
      });
    });
  }, 50);

  return container;
}
