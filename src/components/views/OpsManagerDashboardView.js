// Operations Manager Dashboard View
// Focus: "How well is the transport system performing?"
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';
import { runReplanningEdgeCaseTests } from '../../utils/replanningEdgeCaseTests.js';
import { TARGET_RECOVERY_TIME_MINS } from '../../utils/evaluation.js';

const TARGET_E2E_MS = TARGET_RECOVERY_TIME_MINS * 60 * 1000; // 480,000 ms = 8 min

export function renderOpsManagerDashboardView() {
  const state = store.getState();
  const { metrics, disruptions, buses, drivers, routes } = state;

  // ── Derived disruption stats from live state ──────────────────────────────
  const totalDisruptions = disruptions.length;
  const resolved   = disruptions.filter(d => d.status === 'accepted').length;
  const unresolved = disruptions.filter(d => d.status === 'unresolved').length;
  const rejected   = disruptions.filter(d => d.status === 'rejected').length;
  const noFeasible = disruptions.filter(d => d.noFeasibleSolution === true).length;
  const manualIntervention = disruptions.filter(d =>
    d.status === 'rejected' || d.noFeasibleSolution === true
  ).length;

  const recoveredWithTime = disruptions.filter(d =>
    d.status === 'accepted' && typeof d.endToEndRecoveryTimeMs === 'number'
  );
  const avgE2EMs = recoveredWithTime.length > 0
    ? recoveredWithTime.reduce((s, d) => s + d.endToEndRecoveryTimeMs, 0) / recoveredWithTime.length
    : null;
  const avgE2ESec = avgE2EMs !== null ? (avgE2EMs / 1000).toFixed(1) : null;
  const metTarget  = recoveredWithTime.filter(d => d.endToEndRecoveryTimeMs <= TARGET_E2E_MS).length;
  const recoverySuccessRate = recoveredWithTime.length > 0
    ? ((metTarget / recoveredWithTime.length) * 100).toFixed(0)
    : 'N/A';
  const manualRate = totalDisruptions > 0
    ? ((manualIntervention / totalDisruptions) * 100).toFixed(0) : '0';

  // ── Fleet utilisation ─────────────────────────────────────────────────────
  const activeCount   = buses.filter(b => b.status === 'in_transit' || b.status === 'delayed').length;
  const standbyCount  = buses.filter(b => b.status === 'in_depot').length;
  const breakdownCount = buses.filter(b => b.status === 'breakdown').length;
  const maintenanceCount = buses.filter(b => b.status === 'maintenance').length;
  const capacityViolations = buses.filter(b => (b.currentLoad || 0) > b.capacity).length;

  // ── Driver availability ───────────────────────────────────────────────────
  const driversActive  = drivers.filter(d => d.status === 'active').length;
  const driversStandby = drivers.filter(d => d.status === 'standby').length;
  const driversSick    = drivers.filter(d => d.status === 'sick').length;
  const driversOnBreak = drivers.filter(d => d.status === 'on_break').length;

  // ── Evaluation test suite results (engine-only, not E2E) ──────────────────
  const suite = runReplanningEdgeCaseTests();
  const suitePassed = suite.passedCount;
  const suiteTotal  = suite.totalTests;
  const avgEngineMs = (suite.testResults.reduce((s, t) => s + t.engineTimeMs, 0) / suite.testResults.length).toFixed(2);
  // Per-scenario baselines and E2E for comparison table
  const scenarioRows = suite.testResults.filter(t =>
    ['TEST-01','TEST-02','TEST-03','TEST-04','TEST-09'].includes(t.id)
  );

  // ── Safety constraint check ───────────────────────────────────────────────
  const safetyOk = capacityViolations === 0;

  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `

    <!-- Section header -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
      <div style="width:36px;height:36px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;">
        ${Icons.activity(20, '#0F2747')}
      </div>
      <div>
        <h2 style="font-size:1.15rem;font-weight:800;color:#0F2747;margin:0;">Operations Manager Overview</h2>
        <p style="font-size:0.75rem;color:#64748B;margin:0;">System performance, recovery evaluation &amp; fleet health &mdash; <em>simulated MVP data</em></p>
      </div>
    </div>

    <!-- KPI Row 1: Recovery Performance -->
    <div class="kpi-grid" style="margin-bottom:18px;">

      <!-- E2E Recovery Avg -->
      <div class="kpi-card" style="border-top:3px solid ${avgE2EMs !== null && avgE2EMs <= TARGET_E2E_MS ? '#10B981' : '#F59E0B'};">
        <div class="kpi-header">
          <span class="kpi-label">Avg E2E Recovery Time</span>
          <div class="kpi-icon-wrap" style="background:#ECFDF5;color:#10B981;">${Icons.clock(20,'#10B981')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size:1.5rem;">
            ${avgE2ESec !== null ? avgE2ESec + 's' : '—'}
          </span>
        </div>
        <div class="kpi-subtext">Target: &le; ${TARGET_RECOVERY_TIME_MINS} min (${TARGET_E2E_MS/1000}s)
          ${avgE2EMs !== null
            ? `&nbsp;<span style="color:${avgE2EMs <= TARGET_E2E_MS ? '#10B981':'#D97706'};font-weight:700;">${avgE2EMs <= TARGET_E2E_MS ? '✓ On Target' : '⚠ Over Target'}</span>`
            : '<span style="color:#94A3B8;">No accepted plans yet</span>'}
        </div>
      </div>

      <!-- Recovery success rate -->
      <div class="kpi-card" style="border-top:3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Recovery Success Rate</span>
          <div class="kpi-icon-wrap" style="background:#EFF6FF;color:#2563EB;">${Icons.check(20,'#2563EB')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${recoverySuccessRate}${recoverySuccessRate !== 'N/A' ? '%' : ''}</span>
        </div>
        <div class="kpi-subtext">${metTarget} of ${recoveredWithTime.length} recovered within 8-min target</div>
      </div>

      <!-- Manual intervention rate -->
      <div class="kpi-card" style="border-top:3px solid ${parseInt(manualRate) > 30 ? '#EF4444':'#F59E0B'};">
        <div class="kpi-header">
          <span class="kpi-label">Manual Intervention Rate</span>
          <div class="kpi-icon-wrap" style="background:#FEF9C3;color:#B45309;">${Icons.users(20,'#B45309')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${parseInt(manualRate) > 30 ? '#DC2626':'#D97706'};">${manualRate}%</span>
        </div>
        <div class="kpi-subtext">${manualIntervention} manual / ${totalDisruptions} total disruptions</div>
      </div>

      <!-- Infeasible / No-solution cases -->
      <div class="kpi-card" style="border-top:3px solid ${noFeasible > 0 ? '#EF4444':'#10B981'};">
        <div class="kpi-header">
          <span class="kpi-label">Infeasible Cases</span>
          <div class="kpi-icon-wrap" style="background:${noFeasible>0 ? '#FEF2F2':'#ECFDF5'};color:${noFeasible>0 ? '#EF4444':'#10B981'};">${Icons.alertTriangle(20,'currentColor')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${noFeasible > 0 ? '#DC2626':'#059669'};">${noFeasible}</span>
        </div>
        <div class="kpi-subtext">${noFeasible > 0 ? 'No-feasible-solution flagged — manual dispatch required' : 'All disruptions had a feasible AI candidate'}</div>
      </div>

      <!-- Constraint violations -->
      <div class="kpi-card" style="border-top:3px solid ${safetyOk ? '#10B981':'#EF4444'};">
        <div class="kpi-header">
          <span class="kpi-label">Safety / Capacity Violations</span>
          <div class="kpi-icon-wrap" style="background:${safetyOk ? '#ECFDF5':'#FEF2F2'};color:${safetyOk ? '#10B981':'#EF4444'};">${Icons.shield(20,'currentColor')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${safetyOk ? '#059669':'#DC2626'};">${capacityViolations}</span>
        </div>
        <div class="kpi-subtext">${safetyOk ? 'Zero over-capacity buses' : `${capacityViolations} bus(es) over passenger capacity limit`}</div>
      </div>

    </div>

    <!-- KPI Row 2: Fleet & Drivers -->
    <div class="kpi-grid" style="margin-bottom:24px;">

      <div class="kpi-card" style="border-top:3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Fleet — Active / Total</span>
          <div class="kpi-icon-wrap" style="background:#EFF6FF;color:#2563EB;">${Icons.bus(20,'#2563EB')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${activeCount}</span>
          <span style="font-size:0.85rem;color:#64748B;font-weight:600;">/ ${buses.length}</span>
        </div>
        <div class="kpi-subtext">${standbyCount} standby &bull; ${breakdownCount} breakdown &bull; ${maintenanceCount} maintenance</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #6366F1;">
        <div class="kpi-header">
          <span class="kpi-label">Drivers — Active</span>
          <div class="kpi-icon-wrap" style="background:#EEF2FF;color:#6366F1;">${Icons.users(20,'#6366F1')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${driversActive}</span>
          <span style="font-size:0.85rem;color:#64748B;font-weight:600;">/ ${drivers.length}</span>
        </div>
        <div class="kpi-subtext">${driversStandby} standby &bull; ${driversSick} sick &bull; ${driversOnBreak} on break</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #10B981;">
        <div class="kpi-header">
          <span class="kpi-label">Disruptions Resolved Today</span>
          <div class="kpi-icon-wrap" style="background:#ECFDF5;color:#10B981;">${Icons.check(20,'#10B981')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:#059669;">${metrics.resolvedDisruptionsToday}</span>
        </div>
        <div class="kpi-subtext">${unresolved} still unresolved &bull; ${rejected} rejected/overridden</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #0F2747;">
        <div class="kpi-header">
          <span class="kpi-label">Engine Evaluation</span>
          <div class="kpi-icon-wrap" style="background:#F1F5F9;color:#0F2747;">${Icons.cpu(20,'#0F2747')}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size:1.1rem;color:#10B981;">${suitePassed}/${suiteTotal}</span>
          <span style="font-size:0.78rem;font-weight:700;color:#10B981;">PASS</span>
        </div>
        <div class="kpi-subtext">Avg engine time: ${avgEngineMs}ms &bull; Deterministic constraint engine</div>
      </div>

    </div>

    <!-- Main 2-col split -->
    <div class="dashboard-main-split">

      <!-- LEFT: Disruption summary + before/after + eval table -->
      <div style="display:flex;flex-direction:column;gap:16px;min-width:0;flex:1.4;">

        <!-- Disruption breakdown card -->
        <div class="panel-card" style="padding:20px 22px;">
          <div class="panel-header" style="margin-bottom:14px;">
            <div class="panel-title-area">
              <h2>Disruption Summary</h2>
              <p>Breakdown of all disruptions by type and resolution status — derived from session data</p>
            </div>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Type</th><th>Severity</th><th>Status</th><th>E2E Recovery</th><th>Manual?</th>
                </tr>
              </thead>
              <tbody>
                ${disruptions.map(d => {
                  const e2e = typeof d.endToEndRecoveryTimeMs === 'number'
                    ? (d.endToEndRecoveryTimeMs / 1000).toFixed(1) + 's'
                    : d.status === 'unresolved' ? '<em style="color:#94A3B8;">Pending</em>' : '—';
                  const isManual = d.noFeasibleSolution || d.status === 'rejected';
                  const statusColor = d.status === 'accepted' ? '#10B981' : d.status === 'rejected' ? '#EF4444' : '#D97706';
                  return `
                    <tr>
                      <td><span style="font-family:var(--font-mono);font-size:0.75rem;">${d.id}</span></td>
                      <td>${d.type?.replace('_',' ') || '—'}</td>
                      <td><span class="severity-pill ${d.severity || 'info'}">${d.severity || 'info'}</span></td>
                      <td><span style="font-weight:700;color:${statusColor};font-size:0.8rem;">${d.status?.toUpperCase()}</span></td>
                      <td>${e2e}</td>
                      <td>${isManual ? '<span style="color:#DC2626;font-weight:700;">Yes</span>' : '<span style="color:#10B981;">No</span>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Before/After evaluation table (from test suite) -->
        <div class="panel-card" style="padding:20px 22px;">
          <div class="panel-header" style="margin-bottom:14px;">
            <div class="panel-title-area">
              <h2>Recovery Time — Baseline vs Prototype</h2>
              <p>Engine benchmark across 5 key scenarios &mdash; <em>simulated baseline, not real dispatcher data</em></p>
            </div>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Simulated Baseline</th>
                  <th>Target</th>
                  <th>E2E (Prototype)</th>
                  <th>Engine Time</th>
                  <th>Improvement</th>
                  <th>Pass/Fail</th>
                </tr>
              </thead>
              <tbody>
                ${scenarioRows.map(t => {
                  const baselineSec = (t.baselineTimeMs / 1000).toFixed(0);
                  const targetSec   = (t.targetTimeMs  / 1000).toFixed(0);
                  const e2eSec      = (t.e2eRecoveryTimeMs / 1000).toFixed(1);
                  const improvement = (((t.baselineTimeMs - t.e2eRecoveryTimeMs) / t.baselineTimeMs) * 100).toFixed(1);
                  const withinTarget = t.e2eRecoveryTimeMs <= t.targetTimeMs;
                  return `
                    <tr>
                      <td style="font-size:0.8rem;font-weight:600;">${t.scenario}</td>
                      <td><span style="font-family:var(--font-mono);">${baselineSec}s</span></td>
                      <td><span style="font-family:var(--font-mono);">&le;${targetSec}s</span></td>
                      <td><span style="font-family:var(--font-mono);font-weight:700;color:${withinTarget ? '#059669':'#D97706'};">${e2eSec}s</span></td>
                      <td><span style="font-family:var(--font-mono);font-size:0.73rem;color:#64748B;">${t.engineTimeMs.toFixed(2)}ms</span></td>
                      <td><span style="font-weight:700;color:#2563EB;">${improvement}%</span></td>
                      <td>${t.passed
                        ? '<span style="color:#10B981;font-weight:700;">✓ PASS</span>'
                        : '<span style="color:#EF4444;font-weight:700;">✗ FAIL</span>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div style="font-size:0.71rem;color:#94A3B8;margin-top:8px;font-style:italic;">
            * Baseline = simulated manual dispatcher process (calling drivers, checking capacity, mental routing). E2E includes simulated review time. Not real dispatcher data.
          </div>
        </div>

      </div>

      <!-- RIGHT: Fleet health + Drivers + Audit log -->
      <div style="display:flex;flex-direction:column;gap:16px;min-width:0;flex:1;">

        <!-- Fleet utilisation -->
        <div class="panel-card" style="padding:20px 22px;">
          <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Fleet &amp; Vehicle Utilisation</div>
          ${buses.map(b => {
            const loadPct = b.capacity > 0 ? Math.round(((b.currentLoad||0)/b.capacity)*100) : 0;
            const barColor = b.status === 'breakdown' ? '#EF4444'
              : b.status === 'maintenance' ? '#F59E0B'
              : b.status === 'in_depot' ? '#9CA3AF'
              : loadPct > 90 ? '#F59E0B' : '#2563EB';
            const statusBadge = b.status === 'in_transit' ? '<span style="color:#10B981;font-size:0.7rem;font-weight:700;">IN TRANSIT</span>'
              : b.status === 'in_depot' ? '<span style="color:#9CA3AF;font-size:0.7rem;font-weight:700;">DEPOT</span>'
              : b.status === 'breakdown' ? '<span style="color:#EF4444;font-size:0.7rem;font-weight:700;">BREAKDOWN</span>'
              : b.status === 'maintenance' ? '<span style="color:#F59E0B;font-size:0.7rem;font-weight:700;">MAINTENANCE</span>'
              : `<span style="color:#D97706;font-size:0.7rem;font-weight:700;">${b.status.toUpperCase()}</span>`;
            return `
              <div style="margin-bottom:10px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                  <span style="font-weight:700;font-size:0.8rem;color:#0F2747;">${b.id}</span>
                  <span style="display:flex;gap:8px;align-items:center;font-size:0.74rem;color:#64748B;">
                    ${statusBadge}
                    <span>${b.currentLoad||0}/${b.capacity}</span>
                    <span style="color:${(b.currentLoad||0) > b.capacity ? '#DC2626':'#64748B'};">
                      ${(b.currentLoad||0) > b.capacity ? '⚠ OVER' : loadPct+'%'}
                    </span>
                  </span>
                </div>
                <div style="height:5px;background:#E2E8F0;border-radius:9999px;overflow:hidden;">
                  <div style="height:100%;width:${Math.min(loadPct,100)}%;background:${barColor};transition:width 0.3s;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Driver availability -->
        <div class="panel-card" style="padding:20px 22px;">
          <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Driver Availability &amp; Commitments</div>
          ${drivers.map(d => {
            const statusColor = d.status === 'active' ? '#10B981'
              : d.status === 'standby' ? '#2563EB'
              : d.status === 'sick' ? '#EF4444'
              : '#F59E0B';
            const commitFlag = d.commitments && d.commitments.length > 0
              ? `<span style="font-size:0.68rem;color:#D97706;font-weight:700;margin-left:6px;">⚠ Has commitment</span>` : '';
            return `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F1F5F9;">
                <div style="font-size:0.82rem;font-weight:600;color:#0F2747;">${d.name}</div>
                <div style="display:flex;align-items:center;gap:4px;">
                  <span style="font-size:0.72rem;font-weight:700;color:${statusColor};text-transform:uppercase;">${d.status}</span>
                  ${commitFlag}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Audit Log -->
        <div class="panel-card" style="padding:20px 22px;">
          <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Recent Audit Log</div>
          <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow-y:auto;">
            ${metrics.recentAuditLogs.map(log => {
              const statusColor = log.status === 'EXECUTED' ? '#10B981'
                : log.status === 'MANUAL_OVERRIDE' ? '#EF4444'
                : log.status === 'PENDING_DISPATCHER_REVIEW' || log.status === 'PENDING_APPROVAL' ? '#D97706'
                : '#64748B';
              return `
                <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 12px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                    <span style="font-size:0.68rem;color:#94A3B8;font-family:var(--font-mono);">${log.time}</span>
                    <span style="font-size:0.65rem;font-weight:700;color:${statusColor};text-transform:uppercase;">${log.status}</span>
                  </div>
                  <div style="font-size:0.76rem;color:#374151;">${log.event}</div>
                  <div style="font-size:0.68rem;color:#94A3B8;margin-top:2px;">${log.user}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    </div>

    <!-- Risk / Validation summary banner -->
    <div class="panel-card" style="padding:16px 22px;margin-top:16px;background:linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 100%);border-left:4px solid #2563EB;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${Icons.shield(18,'#2563EB')}
        </div>
        <div>
          <div style="font-weight:800;color:#0F2747;font-size:0.87rem;margin-bottom:4px;">Responsible AI &amp; Validation Summary</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px 24px;font-size:0.78rem;color:#374151;line-height:1.5;">
            <span>✓ Human-in-the-loop: all AI plans require dispatcher approval before execution</span>
            <span>✓ Constraint engine rejects capacity violations, driver conflicts and ADA non-compliance</span>
            <span>✓ No-feasible-solution cases surface manual intervention alerts rather than fabricated plans</span>
            <span>✓ Offline mode queues changes locally; syncs on reconnection (resilience tested)</span>
            <span>✓ Engine evaluation: ${suitePassed}/${suiteTotal} scenarios pass constraint invariants</span>
            <span style="color:#94A3B8;font-style:italic;">⚠ MVP uses representative/simulated data — not real district telemetry</span>
          </div>
        </div>
      </div>
    </div>

  `;

  // Navigate to replanning tab when clicking disruption row
  setTimeout(() => {
    container.querySelectorAll('.data-table tbody tr').forEach((row, i) => {
      const disruptionId = disruptions[i]?.id;
      if (disruptionId) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          store.setSelectedDisruption(disruptionId);
          store.setActiveTab('replanning');
        });
      }
    });
  }, 50);

  return container;
}
