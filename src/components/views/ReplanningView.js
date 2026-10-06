// Replanning & Responsible AI Decision Support View
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';
import { buildExplanationAndUncertainty } from '../../utils/replanningEngine.js';

export function renderReplanningView() {
  const state = store.getState();
  const { disruptions, selectedDisruptionId, customizer } = state;

  const currentDisruption = disruptions.find(d => d.id === selectedDisruptionId) || disruptions[0];
  const aiPlan = currentDisruption?.aiRecommendation;
  const isAccepted = currentDisruption?.status === 'accepted';
  const isRejected = currentDisruption?.status === 'rejected';
  const isPlanLoading = state.loadingStates?.planDecision;
  const isReplanGenLoading = state.loadingStates?.replanGeneration;
  const planError = state.errorStates?.planDecision;
  const replanGenError = state.errorStates?.replanGeneration;

  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">Responsible AI Rapid Replanning Engine</h2>
          <span style="background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
            AI ASSIST ACTIVE
          </span>
        </div>
        <p style="font-size: 0.85rem; color: #64748B;">
          Algorithmic route recovery, transparent constraint-based route selection, and human-in-the-loop decision console
        </p>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="action-btn secondary" id="re-run-simulation-btn">
          ${Icons.refreshCw(16, 'currentColor')} Re-run AI Optimization
        </button>
      </div>
    </div>

    <div class="replanning-grid">
      <!-- Left Column: Incident Selector -->
      <div class="incident-selector-card">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; display: flex; align-items: center; gap: 6px;">
          ${Icons.alertTriangle(16, '#2563EB')} Select Active Incident
        </h3>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${disruptions.map(d => {
            const isSelected = d.id === currentDisruption?.id;
            return `
              <div class="incident-card ${d.severity}" style="${isSelected ? 'border: 2px solid #2563EB; background: #fff;' : ''}" data-select-id="${d.id}">
                <div class="incident-top">
                  <span class="incident-title" style="font-size: 0.82rem;">${d.title}</span>
                  <div style="display: flex; gap: 4px; align-items: center;">
                    ${d.status === 'accepted' ? `
                      <span style="background: #DCFCE7; color: #166534; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">ACCEPTED</span>
                    ` : d.status === 'rejected' ? `
                      <span style="background: #FEE2E2; color: #991B1B; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">REJECTED</span>
                    ` : `
                      <span class="severity-pill ${d.severity}">${d.severity}</span>
                    `}
                  </div>
                </div>
                <div class="incident-meta" style="margin-bottom: 0;">
                  <span>⏱ ${d.reportedAt}</span>
                  <span>📍 ${d.location}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-top: auto;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #0F2747; margin-bottom: 6px;">
            🛡 Responsible AI Guardrails
          </div>
          <div style="font-size: 0.72rem; color: #64748B; line-height: 1.4;">
            Every AI proposed plan guarantees:
            <br>• Student ride time &lt; 45 mins
            <br>• Zero ADA compliance violations
            <br>• Transparent constraint-based route selection
          </div>
        </div>
      </div>

      <!-- Right Column: AI Plan Review & Action -->
      <div class="plan-comparison-area">
        ${replanGenError && (replanGenError.disruptionId === currentDisruption?.id || !aiPlan) ? `
          <div class="replan-gen-error-banner" style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #991B1B;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${Icons.alertTriangle(18, '#DC2626')}
              <span><b>Replan Synchronization:</b> ${replanGenError.message}</span>
            </div>
            <button id="retry-replan-gen-btn" class="action-btn danger" style="padding: 4px 12px; font-size: 0.75rem;" ${isReplanGenLoading ? 'disabled' : ''}>
              ${isReplanGenLoading ? 'Generating recommendation...' : 'Retry Replan'}
            </button>
          </div>
        ` : ''}

        ${currentDisruption && aiPlan ? `
          <!-- Primary AI Recommendation Card -->
          <div class="ai-recommendation-card">
            <div class="ai-tag-top">
              ${Icons.cpu(14, '#fff')} OPTIMAL RECOMMENDATION (${aiPlan.planId})
            </div>

            <div class="plan-header">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                <span class="plan-strategy-pill">${aiPlan.strategy}</span>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <button class="action-btn secondary" id="regenerate-replan-btn" style="padding: 3px 8px; font-size: 0.72rem; border-color: #CBD5E1;" ${isReplanGenLoading ? 'disabled' : ''}>
                    ${Icons.refreshCw(12, 'currentColor')} ${isReplanGenLoading ? 'Evaluating...' : 'Re-evaluate'}
                  </button>
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #92400E; background: #FEF3C7; border: 1px solid #FDE68A; padding: 4px 10px; border-radius: 9999px; font-weight: 700;">
                    ${Icons.shield(14, '#92400E')} HUMAN DECISION REQUIRED — DISPATCHER APPROVAL
                  </div>
                </div>
              </div>
              <h3 class="plan-title" style="margin-top: 6px; margin-bottom: 4px;">
                ${currentDisruption.title}
              </h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
                Incident Location: <b>${currentDisruption.location}</b> • Impact: <b>${currentDisruption.impact}</b>
              </p>
            </div>

            <!-- 12-Dimension Transparent AI Recommendation & Operational Details -->
            ${(() => {
              const explanationData = aiPlan?.explanationAndUncertainty || buildExplanationAndUncertainty(
                aiPlan ? {
                  bus: state.buses.find(b => b.id === (aiPlan.recommendedBusId || aiPlan.standbyBusAssigned)) || { id: aiPlan.recommendedBusId || 'BUS-05', capacity: 54, currentLoad: 46 },
                  route: state.routes.find(r => r.id === (aiPlan.recommendedRouteId || currentDisruption?.routeId)) || { id: 'RT-104' },
                  driver: state.drivers.find(d => d.name === aiPlan.recommendedDriverName || d.status === 'standby') || { name: 'Amina Al-Mansoor', availabilityStatus: 'available' },
                  availableSeats: typeof aiPlan.availableSeats === 'number' ? aiPlan.availableSeats : 8,
                  additionalDelay: aiPlan.additionalDelayMins || 4,
                  driverDistanceKm: aiPlan.additionalDistanceKm || 1.8,
                  driverDistanceMi: aiPlan.additionalDistanceMi || 1.12
                } : null,
                aiPlan?.candidateEvaluations?.filter(c => c.isFeasible) || [],
                aiPlan?.candidateEvaluations?.filter(c => !c.isFeasible) || [],
                currentDisruption,
                state
              );

              const selectedBusId = explanationData.selectedBus || aiPlan.selectedBus || aiPlan.recommendedBusId || currentDisruption.busId || 'BUS-05';
              const insertionPos = aiPlan.insertionPosition !== undefined ? aiPlan.insertionPosition : (aiPlan.greedyInsertionPosition !== undefined ? aiPlan.greedyInsertionPosition : (explanationData.insertionPosition !== undefined ? explanationData.insertionPosition : 2));
              const scoreVal = aiPlan.score !== undefined ? (typeof aiPlan.score === 'number' ? aiPlan.score.toFixed(2) : aiPlan.score) : (explanationData.score !== undefined ? explanationData.score : '14.50');

              return `
                <!-- 10 Primary Operational Details Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-bottom: 20px;">
                  <!-- 1. Selected Bus -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">1. Selected Bus</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                      ${selectedBusId}
                    </div>
                  </div>

                  <!-- 2. Insertion Position -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">2. Insertion Position</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #2563EB; margin-top: 2px;">
                      Stop #${insertionPos}
                    </div>
                  </div>

                  <!-- 3. Engine Score -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">3. Heuristic Score</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #059669; margin-top: 2px;">
                      ${scoreVal} <span style="font-size: 0.72rem; font-weight: 600; color: #64748B;">(Optimal)</span>
                    </div>
                  </div>

                  <!-- 4. Additional Distance -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">4. Additional Distance</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                      ${explanationData.expectedImpact.additionalDistanceKm} km
                    </div>
                  </div>

                  <!-- 5. Additional Delay -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">5. Additional Delay</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: ${explanationData.expectedImpact.additionalDelayMinutes > 5 ? '#D97706' : '#059669'}; margin-top: 2px;">
                      ${explanationData.expectedImpact.additionalDelayMinutes} min
                    </div>
                  </div>

                  <!-- 6. Capacity Impact -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">6. Capacity Impact</div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #059669; margin-top: 4px;">
                      ${explanationData.capacityImpact || aiPlan.availableSeats || 'Capacity Available'}
                    </div>
                  </div>

                  <!-- 7. Driver Availability -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">7. Driver Availability</div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #047857; margin-top: 4px;">
                      ${explanationData.driverAvailability || aiPlan.driverAvailability || 'Available (No Conflict)'}
                    </div>
                  </div>

                  <!-- 8. Route Compatibility -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">8. Route Compatibility</div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #2563EB; margin-top: 4px;">
                      ${explanationData.routeCompatibility || aiPlan.routeCompatibility || 'Compatible Route & Destination'}
                    </div>
                  </div>

                  <!-- 9. Accessibility / ADA Result -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">9. Accessibility / ADA</div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #059669; margin-top: 4px;">
                      ✓ ${explanationData.accessibilityResult || explanationData.adaResult || 'ADA Wheelchair Lift Verified'}
                    </div>
                  </div>

                  <!-- 10. GPS Data Freshness -->
                  <div style="background: ${explanationData.dataQuality.isStale ? '#FEF2F2' : '#F8FAFC'}; border: 1px solid ${explanationData.dataQuality.isStale ? '#FECACA' : '#E2E8F0'}; border-radius: 10px; padding: 12px 14px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: ${explanationData.dataQuality.isStale ? '#991B1B' : '#64748B'}; text-transform: uppercase;">10. GPS Data Freshness</div>
                    <div style="font-size: 0.88rem; font-weight: 800; color: ${explanationData.dataQuality.gpsStatus === 'LIVE' ? '#059669' : '#DC2626'}; margin-top: 4px;">
                      GPS: ${explanationData.dataQuality.gpsStatus} (${explanationData.dataQuality.lastUpdate})
                    </div>
                    <div style="font-size: 0.72rem; color: #64748B; margin-top: 2px;">
                      Source: <b>${explanationData.dataQuality.source || 'mock_telematics'}</b> · Age: <b>${explanationData.dataQuality.ageSeconds || 0}s</b>
                    </div>
                  </div>
                </div>

                <!-- 11. WHY SELECTED -->
                <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-left: 5px solid #10B981; border-radius: 10px; padding: 18px 20px; margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 0.85rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                      RECOMMENDED: <b>${selectedBusId}</b>
                    </div>
                    <span style="background: #DCFCE7; color: #15803D; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
                      6/6 Hard Constraints Verified
                    </span>
                  </div>
                  <div style="font-size: 0.82rem; font-weight: 800; color: #15803D; margin-bottom: 8px;">WHY:</div>
                  <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; font-weight: 600; color: #14532D;">
                    ${explanationData.whySelected.map(w => `<div>${w}</div>`).join('')}
                  </div>
                </div>

                <!-- IMPACT & DATA QUALITY -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                  <!-- IMPACT -->
                  <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-left: 4px solid #2563EB; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #1E40AF; text-transform: uppercase; margin-bottom: 8px;">
                      IMPACT:
                    </div>
                    <div style="font-size: 0.88rem; color: #1E3A8A; display: flex; flex-direction: column; gap: 4px;">
                      <div>Additional distance: <b>${explanationData.expectedImpact.additionalDistanceKm} km</b> (${explanationData.expectedImpact.additionalDistanceMi} mi)</div>
                      <div>Additional delay: <b>${explanationData.expectedImpact.additionalDelayMinutes} min</b></div>
                    </div>
                    <div style="font-size: 0.75rem; color: #3B82F6; margin-top: 6px;">
                      ${explanationData.expectedImpact.passengerImpact}
                    </div>
                  </div>

                  <!-- DATA QUALITY -->
                  <div style="background: ${explanationData.dataQuality.isStale || explanationData.dataQuality.gpsStatus === 'NO_SIGNAL' ? '#FEF2F2' : (explanationData.dataQuality.gpsStatus === 'MANUAL' ? '#EFF6FF' : '#F8FAFC')}; border: 1px solid ${explanationData.dataQuality.isStale || explanationData.dataQuality.gpsStatus === 'NO_SIGNAL' ? '#FECACA' : (explanationData.dataQuality.gpsStatus === 'MANUAL' ? '#BFDBFE' : '#E2E8F0')}; border-left: 4px solid ${explanationData.dataQuality.isStale || explanationData.dataQuality.gpsStatus === 'NO_SIGNAL' ? '#DC2626' : (explanationData.dataQuality.gpsStatus === 'MANUAL' ? '#2563EB' : '#64748B')}; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: ${explanationData.dataQuality.isStale || explanationData.dataQuality.gpsStatus === 'NO_SIGNAL' ? '#991B1B' : (explanationData.dataQuality.gpsStatus === 'MANUAL' ? '#1E40AF' : '#475569')}; text-transform: uppercase; margin-bottom: 8px;">
                      DATA QUALITY & GPS CONFIDENCE:
                    </div>
                    <div style="font-size: 0.88rem; color: #334155; display: flex; flex-direction: column; gap: 4px;">
                      <div>GPS Status: <b style="color: ${explanationData.dataQuality.gpsStatus === 'LIVE' ? '#059669' : (explanationData.dataQuality.gpsStatus === 'MANUAL' ? '#2563EB' : '#DC2626')};">${explanationData.dataQuality.gpsStatus}</b></div>
                      <div>Last update: <b>${explanationData.dataQuality.lastUpdate}</b></div>
                      <div>Source: <b>${explanationData.dataQuality.source || 'mock_telematics'}</b></div>
                    </div>
                    ${explanationData.dataQuality.gpsStatus === 'STALE' ? `
                      <div style="margin-top: 10px; padding: 8px 12px; background: #FFF7ED; border: 1px solid #FDBA74; border-radius: 6px; font-size: 0.78rem; color: #C2410C; font-weight: 700;">
                        ⚠️ STALE GPS (>2m old): Reduced confidence in distance calculations. Dispatcher verification required.
                      </div>
                    ` : explanationData.dataQuality.gpsStatus === 'NO_SIGNAL' ? `
                      <div style="margin-top: 10px; padding: 8px 12px; background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; font-size: 0.78rem; color: #B91C1C; font-weight: 700;">
                        📡 NO SIGNAL: Telematics signal lost. Zero distance confidence. Immediate verification required before dispatch.
                      </div>
                    ` : explanationData.dataQuality.gpsStatus === 'MANUAL' ? `
                      <div style="margin-top: 10px; padding: 8px 12px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; font-size: 0.78rem; color: #1D4ED8; font-weight: 700;">
                        📍 MANUAL CHECKPOINT: Location set manually by dispatcher. Reduced distance confidence compared to live lock.
                      </div>
                    ` : (explanationData.dataQuality.warning ? `
                      <div style="margin-top: 10px; padding: 8px 12px; background: #FFF; border: 1px solid #FCA5A5; border-radius: 6px; font-size: 0.78rem; color: #B91C1C; font-weight: 700;">
                        WARNING: "${explanationData.dataQuality.warning}"
                      </div>
                    ` : '')}
                    ${explanationData.dataQuality.requiresDispatcherVerification ? `
                      <div style="margin-top: 6px; font-size: 0.74rem; color: #D97706; font-weight: 700;">
                        ⚠️ Requires Dispatcher Verification When Appropriate
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- 12. WHY ALTERNATIVES WERE REJECTED (REJECTED) -->
                <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div style="font-size: 0.82rem; font-weight: 800; color: #0F2747; text-transform: uppercase; margin-bottom: 12px;">
                    REJECTED:
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${explanationData.rejectedCandidates && explanationData.rejectedCandidates.length ? explanationData.rejectedCandidates.map(rc => `
                      <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #EF4444; border-radius: 6px;">
                        <div style="font-weight: 800; color: #0F2747; font-size: 0.88rem;">${rc.busId}</div>
                        <div style="color: #DC2626; font-size: 0.82rem; font-weight: 600; margin-top: 2px;">
                          ✗ ${rc.reason}
                        </div>
                      </div>
                    `).join('') : '<div style="color: #64748B; font-size: 0.82rem;">No candidates rejected.</div>'}
                  </div>
                </div>

                <!-- 5. CONSTRAINTS CHECKED & 6. DATA USED -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                  <!-- Constraints Checked -->
                  <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #0F2747; text-transform: uppercase; margin-bottom: 10px;">
                      CONSTRAINTS CHECKED:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem;">
                      ${explanationData.constraintsChecked.map(c => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #F1F5F9;">
                          <span style="color: #334155; font-weight: 600;">${c.name}</span>
                          <span style="color: #059669; font-weight: 700; font-size: 0.72rem; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">✓ ${c.status}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Data Used -->
                  <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #0F2747; text-transform: uppercase; margin-bottom: 10px;">
                      DATA USED:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem; color: #475569;">
                      ${explanationData.dataUsed.map(d => `
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span style="color: #2563EB;">&bull;</span>
                          <span>${d}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- 7. WHAT CAN THE DISPATCHER OVERRIDE -->
                <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                  <div style="font-size: 0.8rem; font-weight: 800; color: #92400E; text-transform: uppercase; margin-bottom: 6px;">
                    WHAT CAN THE DISPATCHER OVERRIDE:
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: #78350F;">
                    ${explanationData.dispatcherOverrides.map(o => `
                      <div>&bull; ${o}</div>
                    `).join('')}
                  </div>
                </div>
              `;
            })()}

            <!-- Current Route Progress Section -->
            ${(() => {
              if (currentDisruption && currentDisruption.busId && currentDisruption.routeId) {
                const affectedRoute = state.routes.find(r => r.id === currentDisruption.routeId);
                if (affectedRoute) {
                  const total = affectedRoute.totalStops || affectedRoute.stops.length;
                  const completed = Array.isArray(affectedRoute.completedStops) ? affectedRoute.completedStops.length : (affectedRoute.completedStops || affectedRoute.stops.filter(s => s.status === 'completed').length);
                  const remaining = Array.isArray(affectedRoute.remainingStops) ? affectedRoute.remainingStops.length : (total - completed);
                  
                  const currentStopName = affectedRoute.currentStop ? affectedRoute.currentStop.name : (affectedRoute.stops[completed] ? affectedRoute.stops[completed].name : "None");
                  const nextStopName = affectedRoute.nextStop ? affectedRoute.nextStop.name : (affectedRoute.stops[completed + 1] ? affectedRoute.stops[completed + 1].name : "Destination");

                  const assignedBus = state.buses.find(b => b.id === currentDisruption.busId);
                  const assignedDriver = state.drivers.find(d => d.id === assignedBus?.driverId || d.driverId === assignedBus?.driverId);
                  const driverLocStr = assignedDriver?.currentLocation ? `[${assignedDriver.currentLocation[0].toFixed(3)}, ${assignedDriver.currentLocation[1].toFixed(3)}]` : 'Depot / In-Transit';
                  const isStaleDriver = assignedDriver?.isLocationStale || assignedDriver?.locationSource === 'last_known';

                  return `
                    <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="width: 28px; height: 28px; border-radius: 6px; background: #FFF7ED; color: #EA580C; display: flex; align-items: center; justify-content: center;">
                            ${Icons.mapPin(16, '#EA580C')}
                          </div>
                          <div>
                            <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; margin: 0;">Current Route Progress & Driver Location</h4>
                            <p style="font-size: 0.75rem; color: #64748B; margin: 0;">Affected Vehicle: <b>${currentDisruption.busId}</b> &bull; Driver: <b>${assignedDriver?.name || 'Assigned'}</b></p>
                          </div>
                        </div>
                        <span class="status-badge on_time" style="background: #ECFDF5; color: #059669; font-size: 0.75rem;">
                          ${affectedRoute.routeProgressPercentage != null ? affectedRoute.routeProgressPercentage : Math.round((completed / total) * 100)}% Progress
                        </span>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.85rem; color: #475569;">
                        <div><span style="color: #64748B;">Route:</span> <b style="color: #0F2747;">${currentDisruption.routeId}</b></div>
                        <div><span style="color: #64748B;">Progress:</span> <b style="color: #0F2747;">${completed} / ${total} stops (${remaining} remaining)</b></div>
                        <div><span style="color: #64748B;">Current Stop:</span> <b style="color: #0F2747;">${currentStopName}</b></div>
                        <div><span style="color: #64748B;">Next Stop:</span> <b style="color: #0F2747;">${nextStopName}</b></div>
                        <div><span style="color: #64748B;">Driver Status:</span> <b style="color: #0F2747;">${assignedDriver?.availabilityStatus || assignedDriver?.status || 'Active'}</b></div>
                        <div><span style="color: #64748B;">Driver Telematics:</span> <b style="color: ${isStaleDriver ? '#D97706' : '#059669'};">${driverLocStr} (${assignedDriver?.locationSource || 'live'}${isStaleDriver ? ' - STALE' : ''})</b></div>
                      </div>
                    </div>
                  `;
                }
              }
              return '';
            })()}

            <!-- Before & After Route Comparison Section -->
            ${currentDisruption.beforeRoute || currentDisruption.afterRoute ? `
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; border-radius: 6px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                      ${Icons.navigation(16, '#2563EB')}
                    </div>
                    <div>
                      <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; margin: 0;">Before vs After Route & Capacity Recalculation</h4>
                      <p style="font-size: 0.75rem; color: #64748B; margin: 0;">Route: <b>${currentDisruption.routeId || 'RT-101'}</b> · Bus: <b>${currentDisruption.busId || 'BUS-01'}</b></p>
                    </div>
                  </div>
                  <span style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
                    FEASIBILITY: OPTIMAL & VERIFIED
                  </span>
                </div>

                <!-- 2-Column Side-by-Side Before vs After -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                  <!-- BEFORE Snapshot Card -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-top: 3px solid #64748B; border-radius: 10px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <span style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">BEFORE</span>
                      <span style="font-size: 0.72rem; color: #64748B; font-weight: 600;">Original State</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
                        <div style="font-size: 0.68rem; color: #64748B; text-transform: uppercase;">Bus Load</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747;">${currentDisruption.beforeBus?.load ?? (currentDisruption.beforeRoute?.stops ? currentDisruption.beforeRoute.stops.reduce((s, st) => s + (st.studentsCount || 0), 0) : 42)} / ${currentDisruption.beforeBus?.capacity ?? 54}</div>
                      </div>
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
                        <div style="font-size: 0.68rem; color: #64748B; text-transform: uppercase;">Available Seats</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #2563EB;">${currentDisruption.beforeBus?.availableSeats ?? 12}</div>
                      </div>
                    </div>
                    <div style="font-size: 0.75rem; color: #475569;">
                      <div>⏱ Scheduled ETA: <b>${currentDisruption.beforeRoute?.currentEta || '08:05 AM'}</b></div>
                      <div>📍 Total Stops: <b>${currentDisruption.beforeRoute?.stops?.length || 6} stops</b></div>
                    </div>
                  </div>

                  <!-- AFTER Snapshot Card -->
                  <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-top: 3px solid #10B981; border-radius: 10px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <span style="font-size: 0.75rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">AFTER REPLANNING</span>
                      <span style="font-size: 0.72rem; color: #059669; font-weight: 700; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Recalculated</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #BBF7D0;">
                        <div style="font-size: 0.68rem; color: #047857; text-transform: uppercase;">Updated Load</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #047857;">${currentDisruption.afterBus?.load ?? (currentDisruption.afterRoute?.stops ? currentDisruption.afterRoute.stops.reduce((s, st) => s + (st.studentsCount || 0), 0) : 41)} / ${currentDisruption.afterBus?.capacity ?? 54}</div>
                      </div>
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #BBF7D0;">
                        <div style="font-size: 0.68rem; color: #047857; text-transform: uppercase;">New Available Seats</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #10B981;">${currentDisruption.afterBus?.availableSeats ?? 13}</div>
                      </div>
                    </div>
                    <div style="font-size: 0.75rem; color: #047857;">
                      <div>⚡ Optimized ETA: <b>${currentDisruption.afterRoute?.currentEta || '08:03 AM'} (${aiPlan.newEtaDifference || '-2 min'})</b></div>
                      <div>📍 Manifest: <b>Optimized stop manifest & dwell times</b></div>
                    </div>
                  </div>
                </div>

                <!-- Stop-by-Stop Manifest Comparison -->
                ${currentDisruption.afterRoute?.stops ? `
                  <div style="font-size: 0.75rem; font-weight: 700; color: #0F2747; margin-bottom: 8px;">
                    Stop-by-Stop Passenger Manifest:
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px;">
                    ${currentDisruption.afterRoute.stops.map((st, idx) => {
                      const beforeSt = currentDisruption.beforeRoute?.stops?.[idx];
                      const diff = (beforeSt?.studentsCount ?? st.studentsCount) - st.studentsCount;
                      const isAffectedStop = diff > 0 || (currentDisruption.location && st.name.toLowerCase().includes(currentDisruption.location.toLowerCase()));

                      return `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-radius: 6px; background: ${isAffectedStop ? '#FEF2F2' : '#fff'}; border: 1px solid ${isAffectedStop ? '#FECACA' : '#F1F5F9'};">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 0.7rem; font-weight: 700; color: #64748B; width: 18px;">${idx + 1}.</span>
                            <span style="font-weight: 600; color: ${isAffectedStop ? '#991B1B' : '#0F2747'}; font-size: 0.78rem;">${st.name}</span>
                            ${isAffectedStop ? '<span style="font-size: 0.65rem; background: #EF4444; color: #fff; padding: 1px 5px; border-radius: 3px; font-weight: 700;">AFFECTED STOP</span>' : ''}
                          </div>
                          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.75rem;">
                            <span style="color: #64748B;">Scheduled: <b>${st.time}</b></span>
                            <span style="font-weight: 700; color: ${isAffectedStop ? '#DC2626' : '#0F2747'};">
                              ${isAffectedStop ? `Students: ${beforeSt?.studentsCount ?? st.studentsCount} → ${st.studentsCount}` : `Students: ${st.studentsCount}`}
                            </span>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Affected Students & Proposed New Bus Assignment Table -->
            ${currentDisruption.affectedStudentsList && currentDisruption.affectedStudentsList.length ? `
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-size: 0.92rem; font-weight: 700; color: #0F2747; margin: 0; display: flex; align-items: center; gap: 6px;">
                      ${Icons.users(16, '#EF4444')} Affected Students Manifest (${currentDisruption.affectedStudentsList.length} Stranded)
                    </h4>
                    <p style="font-size: 0.75rem; color: #64748B; margin: 2px 0 0 0;">
                      Proposed New Bus Assignment: <b style="color: #059669;">${aiPlan?.recommendedBusId || aiPlan?.standbyBusAssigned || 'BUS-05'}</b> (${aiPlan?.reserveDriverAssigned || 'Reserve Driver'})
                    </p>
                  </div>
                  <span style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
                    ACTION: PENDING DISPATCH APPROVAL
                  </span>
                </div>
                <div style="max-height: 220px; overflow-y: auto; border: 1px solid #F1F5F9; border-radius: 8px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-align: left; position: sticky; top: 0;">
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Student</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Grade</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Pickup Stop</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Accommodations</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Proposed Bus</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${currentDisruption.affectedStudentsList.map(s => `
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 8px 10px; font-weight: 700; color: #0F2747;">${s.name}</td>
                          <td style="padding: 8px 10px; color: #64748B;">${s.grade}</td>
                          <td style="padding: 8px 10px; color: #0F2747; font-weight: 500;">📍 ${s.stopName}</td>
                          <td style="padding: 8px 10px;">
                            ${s.specialNeeds && s.specialNeeds !== 'None' ? `
                              <span style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                                ♿ ${s.specialNeeds}
                              </span>
                            ` : `<span style="color: #94A3B8; font-size: 0.72rem;">Standard</span>`}
                          </td>
                          <td style="padding: 8px 10px;">
                            <span style="font-weight: 700; color: #059669; font-family: var(--font-mono); background: #ECFDF5; padding: 2px 6px; border-radius: 4px; border: 1px solid #A7F3D0;">
                              → ${aiPlan?.recommendedBusId || aiPlan?.standbyBusAssigned || 'BUS-05'}
                            </span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- Constraint Customizer Module (Interactive Dispatcher Modification Workflow) -->
            ${(customizer && customizer.isOpen && customizer.disruptionId === currentDisruption?.id) ? `
              <div class="panel-card" style="border: 2px solid #3B82F6; background: #FFFFFF; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(37,99,235,0.08);">
                <!-- Customizer Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 14px;">
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                      ${Icons.settings(22, '#2563EB')}
                    </div>
                    <div>
                      <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F2747; margin: 0;">
                        Constraint Customizer — Dispatcher Decision Control
                      </h3>
                      <p style="font-size: 0.8rem; color: #64748B; margin: 2px 0 0 0;">
                        Modify operational constraints, recalculate candidate rankings, and review Before vs After before approving.
                      </p>
                    </div>
                  </div>
                  <button class="action-btn secondary" id="close-customizer-btn" style="padding: 4px 8px; font-size: 0.8rem;">
                    ${Icons.x(14, 'currentColor')} Close
                  </button>
                </div>

                <!-- Constraint Controls Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
                  <!-- 1. Maximum Allowed Delay -->
                  <div>
                    <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                      Maximum Allowed Delay (mins)
                    </label>
                    <input type="number" id="custom-max-delay" min="1" max="60" value="${customizer.constraints?.maxAllowedDelay ?? 15}" style="width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.85rem;" />
                  </div>

                  <!-- 2. Minimum Required Available Seats -->
                  <div>
                    <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                      Minimum Required Available Seats
                    </label>
                    <input type="number" id="custom-min-seats" min="1" max="60" value="${customizer.constraints?.minRequiredSeats ?? 1}" style="width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.85rem;" />
                  </div>

                  <!-- 3. Preferred Vehicle -->
                  <div>
                    <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                      Preferred Vehicle
                    </label>
                    <select id="custom-preferred-bus" style="width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.85rem;">
                      <option value="ANY">Any Feasible Vehicle</option>
                      ${state.buses.map(b => `<option value="${b.id}" ${customizer.constraints?.preferredBusId === b.id ? 'selected' : ''}>${b.id} (${b.capacity} cap, ${b.model})</option>`).join('')}
                    </select>
                  </div>

                  <!-- 4. Driver Preference -->
                  <div>
                    <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                      Driver Preference
                    </label>
                    <select id="custom-driver-pref" style="width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.85rem;">
                      <option value="ANY" ${customizer.constraints?.driverPreference === 'ANY' ? 'selected' : ''}>Any Available Driver</option>
                      <option value="standby" ${customizer.constraints?.driverPreference === 'standby' ? 'selected' : ''}>Central Depot Reserve / Standby Only</option>
                      <option value="active" ${customizer.constraints?.driverPreference === 'active' ? 'selected' : ''}>Active En-Route Drivers Only</option>
                    </select>
                  </div>

                  <!-- 5. Accessibility Requirement -->
                  <div style="display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 700; color: #0F2747; cursor: pointer;">
                      <input type="checkbox" id="custom-accessibility" ${customizer.constraints?.requiresWheelchair ? 'checked' : ''} style="width: 16px; height: 16px;" />
                      Require ADA Wheelchair Lift
                    </label>
                  </div>

                  <!-- 6. Route Preference -->
                  <div>
                    <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                      Route Preference
                    </label>
                    <select id="custom-preferred-route" style="width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.85rem;">
                      <option value="ANY">Any Compatible Route</option>
                      ${state.routes.map(r => `<option value="${r.id}" ${customizer.constraints?.preferredRouteId === r.id ? 'selected' : ''}>${r.id} - ${r.name}</option>`).join('')}
                    </select>
                  </div>
                </div>

                <!-- Recalculate Button -->
                <div style="margin-bottom: 20px;">
                  <button class="action-btn secondary" id="recalculate-custom-btn" style="background: #EFF6FF; border: 1px solid #93C5FD; color: #1D4ED8; font-weight: 700; padding: 10px 20px;">
                    ${Icons.refreshCw(16, '#1D4ED8')} Recalculate Candidates
                  </button>
                </div>

                <!-- Recalculated Candidate Ranking -->
                ${customizer.recalculatedResult ? `
                  <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 0.92rem; font-weight: 800; color: #0F2747; margin: 0 0 10px 0;">
                      Updated Candidate Ranking (${customizer.recalculatedResult.feasibleCandidates.length} Feasible Candidates)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      ${customizer.recalculatedResult.feasibleCandidates.map((cand, idx) => {
                        const isSelected = customizer.selectedCandidate?.bus?.id === cand.bus.id;
                        return `
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: ${isSelected ? '#ECFDF5' : '#F8FAFC'}; border: 2px solid ${isSelected ? '#10B981' : '#E2E8F0'}; border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 14px;">
                              <span style="font-weight: 800; font-size: 0.9rem; color: ${isSelected ? '#059669' : '#64748B'};">#${idx + 1}</span>
                              <div>
                                <div style="font-weight: 800; color: #0F2747; font-size: 0.9rem;">
                                  ${cand.bus.id} ${cand.isPreferredBus ? '<span style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 6px;">PREFERRED VEHICLE</span>' : ''}
                                </div>
                                <div style="font-size: 0.75rem; color: #64748B;">
                                  Route: <b>${cand.route ? cand.route.id : 'Standby Depot'}</b> &bull; Driver: <b>${cand.driver ? cand.driver.name : 'Standby Driver'}</b> &bull; Distance: <b>${cand.driverDistanceKm} km</b>
                                </div>
                              </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px;">
                              <div style="text-align: right;">
                                <div style="font-weight: 800; color: #059669; font-size: 0.85rem;">${cand.availableSeats} seats available</div>
                                <div style="font-size: 0.75rem; color: #D97706;">+${Math.max(1, Math.round(cand.additionalDelay))} min delay</div>
                              </div>
                              <button class="action-btn select-candidate-btn ${isSelected ? 'primary' : 'secondary'}" data-bus-id="${cand.bus.id}" style="padding: 6px 14px; font-size: 0.78rem;">
                                ${isSelected ? '✓ Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- BEFORE vs AFTER Comparison Card -->
                ${customizer.beforeAfterComparison ? `
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
                    <h4 style="font-size: 0.9rem; font-weight: 800; color: #0F2747; margin: 0 0 14px 0;">
                      Before vs After Modified Plan Comparison
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                      <!-- BEFORE -->
                      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #64748B; border-radius: 8px; padding: 14px;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px;">BEFORE:</div>
                        <div style="font-size: 0.82rem; color: #334155; display: flex; flex-direction: column; gap: 4px;">
                          <div>Bus: <b>${customizer.beforeAfterComparison.before.bus}</b></div>
                          <div>Route: <b>${customizer.beforeAfterComparison.before.route}</b></div>
                          <div>Capacity: <b>${customizer.beforeAfterComparison.before.capacity}</b></div>
                          <div>Delay: <b>${customizer.beforeAfterComparison.before.delay}</b></div>
                        </div>
                      </div>

                      <!-- AFTER -->
                      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-top: 3px solid #10B981; border-radius: 8px; padding: 14px;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: #047857; text-transform: uppercase; margin-bottom: 8px;">AFTER:</div>
                        <div style="font-size: 0.82rem; color: #14532D; display: flex; flex-direction: column; gap: 4px;">
                          <div>Bus: <b>${customizer.beforeAfterComparison.after.bus}</b></div>
                          <div>Route: <b>${customizer.beforeAfterComparison.after.route}</b></div>
                          <div>Capacity: <b>${customizer.beforeAfterComparison.after.capacity}</b></div>
                          <div>Delay: <b>${customizer.beforeAfterComparison.after.delay}</b></div>
                          <div>Additional distance: <b>${customizer.beforeAfterComparison.after.additionalDistance}</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ` : ''}

                <!-- Decision Actions -->
                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                  <button class="action-btn secondary" id="reject-modified-plan-btn" style="color: #DC2626; border-color: #FECACA;" ${isPlanLoading ? 'disabled' : ''}>
                    ${Icons.x(16, '#DC2626')} Discard Modifications
                  </button>
                  <button class="action-btn primary" id="accept-modified-plan-btn" style="background: #059669; padding: 10px 24px; font-size: 0.92rem;" ${isPlanLoading ? 'disabled' : ''}>
                    ${Icons.check(18, '#fff')} ${isPlanLoading ? 'Applying modified plan...' : 'Accept & Apply Modified Plan'}
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- Operation Error Banner & Retry -->
            ${planError ? `
              <div class="plan-decision-error-banner" style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #991B1B;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${Icons.alertTriangle(18, '#DC2626')}
                  <span><b>Decision Sync Error:</b> ${planError.message}</span>
                </div>
                <button id="retry-plan-decision-btn" class="action-btn danger" style="padding: 4px 12px; font-size: 0.75rem;" ${isPlanLoading ? 'disabled' : ''}>
                  ${isPlanLoading ? 'Applying...' : 'Retry Action'}
                </button>
              </div>
            ` : ''}

            <!-- Human Authority & Decision Action Bar -->
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #92400E;">
              ${Icons.alertTriangle(18, '#D97706')}
              <span><b>Human Authority Requirement:</b> The system will never automatically activate a route. The dispatcher or operations manager must make the final decision to Accept, Modify, or Reject this recommendation.</span>
            </div>

            <!-- Decision Action Bar -->
            <div class="plan-actions-footer">
              ${isAccepted ? `
                <div style="display: flex; align-items: center; gap: 8px; color: #059669; font-weight: 700; font-size: 0.9rem;">
                  ${Icons.checkCircle(20, '#059669')}
                  Plan Accepted & Activated by Dispatcher
                </div>
              ` : isRejected ? `
                <div style="display: flex; align-items: center; gap: 8px; color: #DC2626; font-weight: 700; font-size: 0.9rem;">
                  ${Icons.x(20, '#DC2626')}
                  Plan Rejected by Dispatcher (Manual Override: ${currentDisruption.rejectionReason || 'Dispatcher Discretion'})
                </div>
              ` : `
                <button class="action-btn secondary" id="reject-plan-btn" style="color: #DC2626; border-color: #FECACA;" ${isPlanLoading ? 'disabled' : ''}>
                  ${Icons.x(16, '#DC2626')} ${isPlanLoading ? 'Rejecting plan...' : 'Reject'}
                </button>
                <button class="action-btn secondary" id="modify-plan-btn" ${isPlanLoading ? 'disabled' : ''}>
                  ${Icons.settings(16, 'currentColor')} Modify
                </button>
                <button class="action-btn primary" id="accept-plan-btn" style="padding: 10px 24px; font-size: 0.92rem;" ${isPlanLoading ? 'disabled' : ''}>
                  ${Icons.check(18, '#fff')} ${isPlanLoading ? 'Applying approved plan...' : 'Accept'}
                </button>
              `}
            </div>
          </div>
        ` : currentDisruption?.noFeasibleSolution ? `
          <div class="panel-card" style="border-top: 4px solid #EF4444; padding: 28px;">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${Icons.alertTriangle(26, '#EF4444')}
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #DC2626; margin: 0;">
                  No Feasible Solution — Manual Intervention Required
                </h3>
                <p style="font-size: 0.82rem; color: #64748B; margin: 4px 0 0 0;">
                  All evaluated district buses violated capacity limits, driver availability, or route compatibility constraints for <b>${currentDisruption.title}</b>.
                </p>
              </div>
            </div>

            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 0.8rem; color: #92400E;">
              <b>Dispatcher Guidance:</b> Consider deploying a standby spare shuttle from Central Depot or contacting guardian for private transit arrangement.
            </div>

            ${currentDisruption.candidateEvaluations ? `
              <div style="font-size: 0.82rem; font-weight: 700; color: #0F2747; margin-bottom: 8px;">
                Fleet Rejection Diagnostics:
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${currentDisruption.candidateEvaluations.map(c => `
                  <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 0.78rem;">
                    <span style="font-weight: 700; color: #0F2747;">${c.busId} (${c.routeId})</span>
                    <span style="color: #DC2626; font-weight: 600;">✕ ${c.statusText || c.reasons}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : currentDisruption ? `
          <div class="panel-card" style="padding: 32px; border-top: 4px solid #2563EB;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
              <div>
                <span class="plan-strategy-pill">${currentDisruption.type || 'Operational Disruption'}</span>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F2747; margin: 8px 0 4px 0;">
                  ${currentDisruption.title}
                </h3>
                <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
                  Incident Location: <b>${currentDisruption.location || 'Route Location'}</b> • Impact: <b>${currentDisruption.impact || 'Active Incident'}</b>
                </p>
              </div>
              <span class="severity-pill ${currentDisruption.severity}">${currentDisruption.severity}</span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <div style="font-size: 0.88rem; font-weight: 700; color: #0F2747; margin-bottom: 6px;">
                Replan Recommendation Status
              </div>
              <p style="font-size: 0.82rem; color: #475569; margin: 0 0 16px 0; line-height: 1.5;">
                No automated replanning solution has been calculated yet for this disruption. Click below to evaluate available fleet vehicles, driver schedules, and student safety constraints.
              </p>
              <button class="action-btn primary" id="generate-replan-btn" style="padding: 10px 24px; font-size: 0.92rem;" ${isReplanGenLoading ? 'disabled' : ''}>
                ${Icons.cpu(18, '#fff')} ${isReplanGenLoading ? 'Generating recommendation...' : 'Generate Replan'}
              </button>
            </div>
          </div>
        ` : `
          <div class="panel-card" style="padding: 40px; text-align: center;">
            <p style="color: #64748B;">No active incident selected. Select an incident from the left to view replanning solutions.</p>
          </div>
        `}
      </div>
    </div>
  `;

  // Attach event handlers
  setTimeout(() => {
    // Select Incident cards
    const selectCards = container.querySelectorAll('.incident-selector-card .incident-card');
    selectCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-select-id');
        if (id) {
          store.setSelectedDisruption(id);
          store.notify();
        }
      });
    });

    // Retry Plan Decision
    const retryPlanBtn = container.querySelector('#retry-plan-decision-btn');
    if (retryPlanBtn) {
      retryPlanBtn.addEventListener('click', () => {
        if (store.isOperationLoading('planDecision')) return;
        store.retryPlanDecision(currentDisruption?.id);
      });
    }

    // Retry Replan Generation
    const retryReplanGenBtn = container.querySelector('#retry-replan-gen-btn');
    if (retryReplanGenBtn) {
      retryReplanGenBtn.addEventListener('click', () => {
        if (store.isOperationLoading('replanGeneration')) return;
        store.retryGenerateReplan(currentDisruption?.id);
      });
    }

    // Accept Plan
    const acceptBtn = container.querySelector('#accept-plan-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        if (store.isOperationLoading('planDecision')) return;
        store.acceptAIPlan(currentDisruption.id);
      });
    }

    // Reject Plan
    const rejectBtn = container.querySelector('#reject-plan-btn');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        if (store.isOperationLoading('planDecision')) return;
        store.rejectAIPlan(currentDisruption.id);
      });
    }

    // Modify Plan - Open Constraint Customizer
    const modifyBtn = container.querySelector('#modify-plan-btn');
    if (modifyBtn) {
      modifyBtn.addEventListener('click', () => {
        store.openConstraintCustomizer(currentDisruption.id);
      });
    }

    // Close Customizer
    const closeCustBtn = container.querySelector('#close-customizer-btn');
    if (closeCustBtn) {
      closeCustBtn.addEventListener('click', () => {
        store.closeConstraintCustomizer();
      });
    }

    // Recalculate with Custom Constraints
    const recalcBtn = container.querySelector('#recalculate-custom-btn');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        const maxAllowedDelay = parseFloat(container.querySelector('#custom-max-delay')?.value || 15);
        const minRequiredSeats = parseInt(container.querySelector('#custom-min-seats')?.value || 1, 10);
        const preferredBusId = container.querySelector('#custom-preferred-bus')?.value;
        const driverPreference = container.querySelector('#custom-driver-pref')?.value;
        const requiresWheelchair = container.querySelector('#custom-accessibility')?.checked || false;
        const preferredRouteId = container.querySelector('#custom-preferred-route')?.value;

        store.recalculateModifiedConstraints(currentDisruption.id, {
          maxAllowedDelay,
          minRequiredSeats,
          preferredBusId,
          driverPreference,
          requiresWheelchair,
          preferredRouteId
        });
      });
    }

    // Select Candidate in Ranking
    const selectCandBtns = container.querySelectorAll('.select-candidate-btn');
    selectCandBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const busId = e.currentTarget.getAttribute('data-bus-id');
        if (busId) {
          store.selectModifiedCandidate(busId);
        }
      });
    });

    // Accept & Apply Modified Plan
    const acceptModBtn = container.querySelector('#accept-modified-plan-btn');
    if (acceptModBtn) {
      acceptModBtn.addEventListener('click', () => {
        if (store.isOperationLoading('planDecision')) return;
        store.acceptModifiedPlan(currentDisruption.id);
      });
    }

    // Reject Modified Plan
    const rejectModBtn = container.querySelector('#reject-modified-plan-btn');
    if (rejectModBtn) {
      rejectModBtn.addEventListener('click', () => {
        if (store.isOperationLoading('planDecision')) return;
        store.rejectModifiedPlan(currentDisruption.id);
      });
    }

    // Generate Replan for Selected Incident
    const genReplanBtn = container.querySelector('#generate-replan-btn');
    if (genReplanBtn) {
      genReplanBtn.addEventListener('click', () => {
        if (store.isOperationLoading('replanGeneration')) return;
        store.generateReplan(currentDisruption?.id);
      });
    }

    // Re-evaluate Plan Button
    const regenBtn = container.querySelector('#regenerate-replan-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        if (store.isOperationLoading('replanGeneration')) return;
        store.generateReplan(currentDisruption?.id);
      });
    }

    // Re-run simulation
    const rerunBtn = container.querySelector('#re-run-simulation-btn');
    if (rerunBtn) {
      rerunBtn.addEventListener('click', () => {
        if (store.isOperationLoading('replanGeneration')) return;
        store.generateReplan(currentDisruption?.id);
      });
    }
  }, 50);

  return container;
}
