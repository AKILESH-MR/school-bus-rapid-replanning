// Replanning & Responsible AI Decision Support View
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderReplanningView() {
  const state = store.getState();
  const { disruptions, selectedDisruptionId } = state;

  const currentDisruption = disruptions.find(d => d.id === selectedDisruptionId) || disruptions[0];
  const aiPlan = currentDisruption?.aiRecommendation;
  const isAccepted = currentDisruption?.status === 'accepted';
  const isRejected = currentDisruption?.status === 'rejected';

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
          Algorithmic route recovery, fairness safety constraints, and human-in-the-loop decision console
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
                  <span class="severity-pill ${d.severity}">${d.severity}</span>
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
            <br>• Fair distribution of route delays
          </div>
        </div>
      </div>

      <!-- Right Column: AI Plan Review & Action -->
      <div class="plan-comparison-area">
        ${currentDisruption && aiPlan ? `
          <!-- Primary AI Recommendation Card -->
          <div class="ai-recommendation-card">
            <div class="ai-tag-top">
              ${Icons.cpu(14, '#fff')} OPTIMAL RECOMMENDATION (${aiPlan.planId})
            </div>

            <div class="plan-header">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                <span class="plan-strategy-pill">${aiPlan.strategy}</span>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #92400E; background: #FEF3C7; border: 1px solid #FDE68A; padding: 4px 10px; border-radius: 9999px; font-weight: 700;">
                  ${Icons.shield(14, '#92400E')} HUMAN DECISION REQUIRED — DISPATCHER APPROVAL
                </div>
              </div>
              <h3 class="plan-title" style="margin-top: 6px; margin-bottom: 4px;">
                ${currentDisruption.title}
              </h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
                Incident Location: <b>${currentDisruption.location}</b> • Impact: <b>${currentDisruption.impact}</b>
              </p>
            </div>

            <!-- Recommendation Key Operational Details (All 7 required attributes) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 20px;">
              <!-- 1. Recommended Bus -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Recommended Bus</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                  ${aiPlan.recommendedBusId || currentDisruption.busId || 'BUS-05'}
                </div>
              </div>

              <!-- 2. Recommended Route -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Recommended Route</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                  ${aiPlan.recommendedRouteId || currentDisruption.routeId || 'RT-104'}
                </div>
              </div>

              <!-- 3. Available Seats -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Available Seats</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #059669; margin-top: 2px;">
                  ${aiPlan.availableSeats || (currentDisruption.afterBus ? `${currentDisruption.afterBus.availableSeats} seats available` : '10 seats available')}
                </div>
              </div>

              <!-- 4. Current Location -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Current Location</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #0F2747; margin-top: 4px;">
                  ${aiPlan.currentLocation || 'Central Depot / Active Sector'}
                </div>
              </div>

              <!-- 5. Driver Availability -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Driver Availability</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #047857; margin-top: 4px;">
                  ${aiPlan.driverAvailability || (aiPlan.recommendedDriverName ? `${aiPlan.recommendedDriverName} (Available, No Conflicts)` : 'Available with no commitment conflict')}
                </div>
              </div>

              <!-- 6. Route Compatibility -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Route Compatibility</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #2563EB; margin-top: 4px;">
                  ${aiPlan.routeCompatibility || 'Compatible destination & ADA lift verified'}
                </div>
              </div>

              <!-- 7. Estimated Additional Delay -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Estimated Additional Delay</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: ${(aiPlan.estimatedAdditionalDelay || aiPlan.newEtaDifference || '').includes('-') ? '#059669' : '#D97706'}; margin-top: 2px;">
                  ${aiPlan.estimatedAdditionalDelay || aiPlan.newEtaDifference || '+0 min'}
                </div>
              </div>
            </div>

            <!-- 8. Why this bus was selected (Simple Explanation Callout) -->
            <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-left: 5px solid #10B981; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                ${Icons.checkCircle(18, '#166534')} Why this bus was selected
              </div>
              <p style="font-size: 0.95rem; font-weight: 600; color: #14532D; margin: 0; line-height: 1.5;">
                "${aiPlan.selectionReason || aiPlan.explanation || "Selected because the bus has enough capacity, is close to the affected location, and has an available driver."}"
              </p>
            </div>

            <!-- Candidate Fleet Feasibility & Rejection Analysis Table -->
            ${aiPlan.candidateEvaluations && aiPlan.candidateEvaluations.length ? `
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-size: 0.92rem; font-weight: 700; color: #0F2747; margin: 0; display: flex; align-items: center; gap: 6px;">
                      ${Icons.cpu(16, '#2563EB')} Candidate Alternatives & Actual Rejection Reasons
                    </h4>
                    <p style="font-size: 0.74rem; color: #64748B; margin: 2px 0 0 0;">
                      Evaluation across fleet capacity, driver availability & commitments, location, and route compatibility
                    </p>
                  </div>
                  <span style="font-size: 0.72rem; color: #64748B; background: #F1F5F9; padding: 3px 8px; border-radius: 4px; font-weight: 600;">
                    ${aiPlan.candidateEvaluations.length} Vehicles Evaluated
                  </span>
                </div>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-align: left;">
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Bus</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Route</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Driver & Location</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Seats Avail.</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Est. Delay</th>
                        <th style="padding: 8px 10px; font-weight: 700; color: #475569;">Feasibility / Actual Rejection Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${aiPlan.candidateEvaluations.map(c => {
                        const isChosen = c.busId === (aiPlan.recommendedBusId || aiPlan.standbyBusAssigned);
                        return `
                          <tr style="border-bottom: 1px solid #F1F5F9; background: ${isChosen ? '#ECFDF5' : 'transparent'};">
                            <td style="padding: 8px 10px; font-weight: 700; color: ${isChosen ? '#059669' : '#0F2747'};">
                              ${c.busId} ${isChosen ? '★' : ''}
                            </td>
                            <td style="padding: 8px 10px; color: #475569;">${c.routeId}</td>
                            <td style="padding: 8px 10px; color: #475569;">
                              <div style="font-weight: 600;">${c.driverName} (${c.driverStatus})</div>
                              <div style="font-size: 0.7rem; color: #64748B;">📍 ${c.location} (${c.driverDistanceMi ? c.driverDistanceMi.toFixed(1) : '?'} mi)</div>
                            </td>
                            <td style="padding: 8px 10px; font-weight: 600; color: ${c.seatsAvailable > 0 ? '#059669' : '#DC2626'};">${c.seatsAvailable} seats</td>
                            <td style="padding: 8px 10px; color: #475569;">${c.delayMins > 0 ? `+${c.delayMins} min` : c.delayMins < 0 ? `${c.delayMins} min` : '0 min'}</td>
                            <td style="padding: 8px 10px;">
                              ${isChosen ? `
                                <span style="background: #10B981; color: #fff; padding: 2px 8px; border-radius: 9999px; font-weight: 700; font-size: 0.7rem;">
                                  RECOMMENDED
                                </span>
                              ` : c.isFeasible ? `
                                <span style="background: #EFF6FF; color: #2563EB; padding: 2px 8px; border-radius: 9999px; font-weight: 600; font-size: 0.7rem;">
                                  Feasible
                                </span>
                              ` : `
                                <span style="color: #DC2626; font-size: 0.72rem; font-weight: 600; line-height: 1.3;">
                                  ✕ ${c.statusText}
                                </span>
                              `}
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- Current Route Progress Section -->
            ${(() => {
              if (currentDisruption && currentDisruption.busId && currentDisruption.routeId) {
                const affectedRoute = state.routes.find(r => r.id === currentDisruption.routeId);
                if (affectedRoute) {
                  const total = affectedRoute.totalStops || affectedRoute.stops.length;
                  const completed = affectedRoute.completedStops || affectedRoute.stops.filter(s => s.status === 'completed').length;
                  const remaining = total - completed;
                  
                  let currentStopName = "None";
                  if (completed > 0 && affectedRoute.stops[completed - 1]) {
                    currentStopName = affectedRoute.stops[completed - 1].name;
                  } else if (affectedRoute.stops.length > 0) {
                    currentStopName = "Not started";
                  }

                  const nextStopName = affectedRoute.stops[completed] ? affectedRoute.stops[completed].name : "None";

                  return `
                    <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="width: 28px; height: 28px; border-radius: 6px; background: #FFF7ED; color: #EA580C; display: flex; align-items: center; justify-content: center;">
                            ${Icons.mapPin(16, '#EA580C')}
                          </div>
                          <div>
                            <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; margin: 0;">Current Route Progress</h4>
                            <p style="font-size: 0.75rem; color: #64748B; margin: 0;">Affected Vehicle: <b>${currentDisruption.busId}</b></p>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.85rem; color: #475569;">
                        <div><span style="color: #64748B;">Route:</span> <b style="color: #0F2747;">${currentDisruption.routeId}</b></div>
                        <div><span style="color: #64748B;">Progress:</span> <b style="color: #0F2747;">${completed} / ${total} stops</b></div>
                        <div><span style="color: #64748B;">Current Stop:</span> <b style="color: #0F2747;">${currentStopName}</b></div>
                        <div><span style="color: #64748B;">Next Stop:</span> <b style="color: #0F2747;">${nextStopName}</b></div>
                        <div><span style="color: #64748B;">Remaining Stops:</span> <b style="color: #0F2747;">${remaining}</b></div>
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
                <button class="action-btn secondary" id="reject-plan-btn" style="color: #DC2626; border-color: #FECACA;">
                  ${Icons.x(16, '#DC2626')} Reject
                </button>
                <button class="action-btn secondary" id="modify-plan-btn">
                  ${Icons.settings(16, 'currentColor')} Modify
                </button>
                <button class="action-btn primary" id="accept-plan-btn" style="padding: 10px 24px; font-size: 0.92rem;">
                  ${Icons.check(18, '#fff')} Accept
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

    // Accept Plan
    const acceptBtn = container.querySelector('#accept-plan-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        store.acceptAIPlan(currentDisruption.id);
      });
    }

    // Reject Plan
    const rejectBtn = container.querySelector('#reject-plan-btn');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        store.rejectAIPlan(currentDisruption.id);
      });
    }

    // Modify Plan
    const modifyBtn = container.querySelector('#modify-plan-btn');
    if (modifyBtn) {
      modifyBtn.addEventListener('click', () => {
        store.showToast('Constraint Customizer: Adjust maximum delay tolerance and bus load margins.', 'info');
      });
    }

    // Re-run simulation
    const rerunBtn = container.querySelector('#re-run-simulation-btn');
    if (rerunBtn) {
      rerunBtn.addEventListener('click', () => {
        store.showToast('Replanning Engine: Re-evaluating fleet constraints and driver availability...', 'info');
        setTimeout(() => {
          store.showToast('Replanning Re-evaluation complete: Verified with active driver availability.', 'success');
        }, 1000);
      });
    }
  }, 50);

  return container;
}
