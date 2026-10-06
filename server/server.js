// Local Backend REST API Server for School Bus Replanning MVP
// Built with Node.js built-in 'node:http' and PostgreSQL / SQLite Database Layer
import http from 'node:http';
import { URL } from 'node:url';
import { LocalDatabase } from './db.js';
import { createDatabase, getDatabaseMetadata } from './databaseFactory.js';
import {
  replanningEngine,
  recalculateWithCustomConstraints,
  computeBeforeAfterComparison,
  computeRouteProgress
} from '../src/utils/replanningEngine.js';
import { DRIVERS } from '../src/data/mockData.js';
import {
  BackendGPSProvider,
  validateGpsPayload,
  classifyGpsFreshness,
  GPS_STATUS,
  GPS_SOURCES
} from '../src/utils/gpsProvider.js';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// UNIFORM ERROR RESPONSE HANDLER:
// Formats all API errors into a standardized, predictable contract:
// { error: string, statusCode: number, details: array|null, timestamp: ISO string }
// Ensures frontend clients receive structured machine-readable error context.
function sendError(res, statusCode, message, details = null) {
  sendJson(res, statusCode, {
    error: message,
    statusCode,
    details,
    timestamp: new Date().toISOString()
  });
}

// DEFENSIVE BODY PARSING & PAYLOAD BOUNDARY:
// 1. Memory exhaustion protection: Caps request streams at 2MB to defend against unbounded memory spikes.
// 2. Format validation: Catches malformed JSON syntax and returns a descriptive error rather than crashing.
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Protect against oversized payload (> 2MB)
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', err => reject(err));
  });
}

export function createServer(options = {}) {
  let dbInstance = options.db || (options.dbPath ? new LocalDatabase(options.dbPath) : null);
  let dbPromise = null;

  async function getDb() {
    if (dbInstance) return dbInstance;
    if (!dbPromise) {
      dbPromise = createDatabase(options).then(inst => {
        dbInstance = inst;
        return inst;
      });
    }
    return dbPromise;
  }

  const gpsProvider = options.gpsProvider || new BackendGPSProvider();

  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host || 'localhost';
    const parsedUrl = new URL(req.url, `http://${host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    try {
      const db = await getDb();

      // 1. Health Check
      if (pathname === '/api/health' && method === 'GET') {
        const meta = getDatabaseMetadata();
        return sendJson(res, 200, {
          status: 'ok',
          service: 'school-bus-replanning-local-api',
          uptime: process.uptime(),
          database: meta.backend || db.type || 'sqlite-local',
          isFallback: Boolean(meta.isFallback),
          fallbackReason: meta.fallbackReason || null,
          serverTime: meta.serverTime || new Date().toISOString()
        });
      }

      // 2. GET /api/buses
      if (pathname === '/api/buses' && method === 'GET') {
        const buses = await db.getBuses();
        return sendJson(res, 200, buses);
      }

      // 3. GET /api/routes
      if (pathname === '/api/routes' && method === 'GET') {
        const routes = await db.getRoutes();
        return sendJson(res, 200, routes);
      }

      // GET /api/drivers
      if (pathname === '/api/drivers' && method === 'GET') {
        const drivers = db.getDrivers ? await db.getDrivers() : [];
        return sendJson(res, 200, drivers);
      }

      // GET /api/students
      if (pathname === '/api/students' && method === 'GET') {
        const students = db.getStudents ? await db.getStudents() : [];
        return sendJson(res, 200, students);
      }

      // GET /api/schools
      if (pathname === '/api/schools' && method === 'GET') {
        const schools = [{id: 'SCH-01', name: 'Lincoln High', location: [37.78, -122.41]}, {id: 'SCH-02', name: 'Washington Middle', location: [37.76, -122.43]}];
        return sendJson(res, 200, schools);
      }

      // 4. GET /api/disruptions
      if (pathname === '/api/disruptions' && method === 'GET') {
        const disruptions = await db.getDisruptions();
        return sendJson(res, 200, disruptions);
      }

      // 5. POST /api/disruptions
      if (pathname === '/api/disruptions' && method === 'POST') {
        let body;
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        if (!body.type || !body.title) {
          return sendError(res, 400, 'Disruption "type" and "title" are mandatory fields');
        }

        const existingDisruptions = await db.getDisruptions();
        const id = body.id || `DIS-2026-00${existingDisruptions.length + 1}`;
        const newDisruption = {
          id,
          reportedAt: body.reportedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: body.type,
          title: body.title,
          status: body.status || 'unresolved',
          severity: body.severity || 'warning',
          busId: body.busId || null,
          routeId: body.routeId || null,
          studentId: body.studentId || null,
          location: body.location || '',
          impact: body.impact || '',
          aiRecommendation: body.aiRecommendation || null,
          originalState: body.originalState || null,
          proposedState: body.proposedState || null,
          ...body
        };

        await db.saveDisruption(newDisruption);

        await db.saveAuditLog({
          action: 'DISRUPTION_REPORTED',
          actionType: 'CREATE_DISRUPTION',
          userRole: body.userRole || 'Dispatcher',
          disruptionId: id,
          timestamp: new Date().toISOString(),
          eventMessage: `Declared disruption: ${newDisruption.title} (${id})`,
          details: newDisruption
        });

        return sendJson(res, 201, newDisruption);
      }

      // 6. POST /api/replans
      if (pathname === '/api/replans' && method === 'POST') {
        let body;
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        const disruptionId = body.disruptionId;
        let disruption = disruptionId ? await db.getDisruptionById(disruptionId) : null;

        if (!disruption && !body.type) {
          return sendError(res, 400, 'Either a valid disruptionId or replanning disruption type is required');
        }

        const currentBuses = await db.getBuses();
        const currentRoutes = await db.getRoutes();
        const currentDrivers = db.getDrivers ? await db.getDrivers() : DRIVERS;

        const replanState = {
          buses: currentBuses,
          routes: currentRoutes,
          drivers: currentDrivers.length > 0 ? currentDrivers : DRIVERS
        };

        const disruptionContext = {
          type: body.type || (disruption ? disruption.type : 'urgent_add'),
          studentStop: body.studentStop || {
            name: body.stopName || disruption?.location || 'Pickup Stop',
            coords: body.coords || [37.77, -122.42],
            specialNeeds: body.specialNeeds || 'None'
          },
          destinationSchoolId: body.destinationSchoolId || 'SCH-01',
          requiredSeats: body.requiredSeats || 1,
          busId: body.busId || disruption?.busId,
          routeId: body.routeId || disruption?.routeId
        };

        const replanResult = replanningEngine.replan(disruptionContext, replanState);
        const planId = body.planId || `REPLAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const replanRecord = {
          id: planId,
          planId,
          disruptionId: disruptionId || null,
          status: 'pending_review',
          strategy: replanResult.strategy || 'Greedy Insertion & Capacity Allocation',
          recommendedBusId: replanResult.recommendedBusId,
          recommendedRouteId: replanResult.newRoute ? replanResult.newRoute.id : null,
          score: replanResult.score,
          insertionPosition: replanResult.insertionPosition,
          additionalDistance: replanResult.additionalDistance,
          additionalDelay: replanResult.additionalDelay,
          explanation: replanResult.formattedExplanation,
          whySelected: replanResult.whySelected,
          rejectedCandidates: replanResult.rejectedCandidates,
          details: replanResult,
          createdAt: new Date().toISOString()
        };

        await db.saveReplan(replanRecord);

        if (disruption) {
          if (replanResult.noFeasibleSolution) {
            disruption.noFeasibleSolution = true;
            disruption.aiRecommendationAvailable = false;
            disruption.aiRecommendation = null;
            disruption.candidateEvaluations = replanResult.rejectedCandidates;
          } else {
            disruption.aiRecommendation = replanRecord;
            disruption.status = 'unresolved';
            disruption.aiRecommendationAvailable = true;
            disruption.noFeasibleSolution = false;
          }
          await db.saveDisruption(disruption);

          await db.saveAuditLog({
            action: 'RECOMMENDATION_GENERATED',
            actionType: 'REPLAN_GENERATED',
            userRole: 'System Engine',
            disruptionId: disruption.id,
            recommendationId: planId,
            timestamp: new Date().toISOString(),
            eventMessage: `AI replanning recommendation generated for ${disruption.id}. Strategy: ${replanRecord.strategy}.`,
            details: replanRecord
          });
        }

        return sendJson(res, 200, {
          success: true,
          planId,
          replan: replanRecord
        });
      }

      // 7. POST /api/replans/:id/approve
      const approveMatch = pathname.match(/^\/api\/replans\/([^/]+)\/approve$/);
      if (approveMatch && method === 'POST') {
        const id = approveMatch[1];
        let body = {};
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        let replan = await db.getReplanById(id);
        let disruption = await db.getDisruptionById(id);

        if (!replan && disruption && disruption.aiRecommendation) {
          replan = disruption.aiRecommendation;
        }

        if (!replan && !disruption) {
          return sendError(res, 404, `Replan or disruption with ID "${id}" not found`);
        }

        const relatedDisruptionId = replan?.disruptionId || disruption?.id;
        if (!disruption && relatedDisruptionId) {
          disruption = await db.getDisruptionById(relatedDisruptionId);
        }

        const targetBusId = replan?.recommendedBusId || disruption?.busId;
        const targetRouteId = replan?.recommendedRouteId || disruption?.routeId;
        const bus = targetBusId ? await db.getBusById(targetBusId) : null;
        const route = targetRouteId ? await db.getRouteById(targetRouteId) : null;

        const originalState = disruption?.originalState || {
          bus: bus ? { id: bus.id, currentLoad: bus.currentLoad } : null,
          route: route ? { id: route.id, totalStops: route.stops ? route.stops.length : 0 } : null,
          disruptionStatus: disruption ? disruption.status : 'unresolved'
        };

        // Apply state mutation based on disruption / replan type
        if (disruption?.type === 'student_cancel') {
          if (bus) {
            bus.currentLoad = Math.max(0, (bus.currentLoad || 0) - 1);
            await db.saveBus(bus);
          }
          if (route && route.stops) {
            route.delayMinutes = Math.max(0, (route.delayMinutes || 0) - 2.0);
            await db.saveRoute(route);
          }
          if (disruption.studentId) {
            const student = await db.getStudentById(disruption.studentId);
            if (student) {
              student.status = 'absent_cancelled';
              student.busId = 'UNASSIGNED';
              student.routeId = 'UNASSIGNED';
              await db.saveStudent(student);
            }
          }
        } else if (disruption?.type === 'urgent_add' || replan?.insertionPosition !== undefined) {
          if (bus) {
            bus.currentLoad = (bus.currentLoad || 0) + 1;
            await db.saveBus(bus);
          }
          if (route && route.stops) {
            const insertionPos = replan.insertionPosition != null ? replan.insertionPosition : route.stops.length;
            const newStop = {
              id: `ST-${route.id}-NEW-${Date.now()}`,
              name: disruption?.location || 'Urgent Passenger Pickup',
              coords: disruption?.coords || [37.77, -122.42],
              time: '07:45 AM',
              studentsCount: 1,
              status: 'pending'
            };
            const stops = Array.isArray(route.stops) ? route.stops : JSON.parse(route.stops || '[]');
            stops.splice(insertionPos, 0, newStop);
            route.stops = stops;
            route.totalStudents = (route.totalStudents || 0) + 1;
            route.delayMinutes = (route.delayMinutes || 0) + (replan.additionalDelay || 3.5);
            await db.saveRoute(route);
          }
          if (disruption?.studentId) {
            const student = await db.getStudentById(disruption.studentId);
            if (student) {
              student.busId = targetBusId;
              student.routeId = targetRouteId;
              student.status = 'waiting';
              await db.saveStudent(student);
            }
          }
        } else if (disruption?.type === 'breakdown') {
          if (bus) {
            bus.status = 'in_transit';
            await db.saveBus(bus);
          }
          if (disruption.busId && disruption.busId !== targetBusId) {
            const broken = await db.getBusById(disruption.busId);
            if (broken) {
              broken.status = 'breakdown';
              await db.saveBus(broken);
            }
          }
        }

        if (disruption) {
          disruption.status = 'accepted';
          await db.saveDisruption(disruption);
        }

        if (replan) {
          replan.status = 'approved';
          await db.saveReplan(replan);
        }

        const finalState = {
          bus: bus ? { id: bus.id, currentLoad: bus.currentLoad, status: bus.status } : null,
          route: route ? { id: route.id, totalStops: route.stops ? route.stops.length : 0 } : null,
          disruptionStatus: 'accepted'
        };

        if (db.saveApproval) {
          await db.saveApproval({
            replanId: replan?.id || id,
            disruptionId: relatedDisruptionId,
            action: 'APPROVED',
            dispatcherId: body.userId || 'dispatcher-1',
            dispatcherRole: body.userRole || 'Dispatcher',
            appliedChanges: finalState
          });
        }

        await db.saveAuditLog({
          action: 'RECOMMENDATION_ACCEPTED',
          actionType: body.actionType || 'REPLAN_APPROVED',
          userRole: body.userRole || 'Dispatcher',
          disruptionId: relatedDisruptionId,
          recommendationId: replan?.id || id,
          timestamp: new Date().toISOString(),
          originalState,
          finalState,
          eventMessage: `Dispatcher approved replan ${replan?.id || id} for disruption ${relatedDisruptionId || id}.`,
          details: { replan, finalState }
        });

        return sendJson(res, 200, {
          success: true,
          message: 'Plan successfully approved and committed to database',
          disruptionId: relatedDisruptionId,
          finalState
        });
      }

      // 8. POST /api/replans/:id/modify
      const modifyMatch = pathname.match(/^\/api\/replans\/([^/]+)\/modify$/);
      if (modifyMatch && method === 'POST') {
        const id = modifyMatch[1];
        let body = {};
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        let replan = await db.getReplanById(id);
        let disruption = await db.getDisruptionById(id);

        if (!replan && disruption && disruption.aiRecommendation) {
          replan = disruption.aiRecommendation;
        }

        if (!replan && !disruption) {
          return sendError(res, 404, `Replan or disruption with ID "${id}" not found`);
        }

        const constraints = body.constraints || body;
        const currentBuses = await db.getBuses();
        const currentRoutes = await db.getRoutes();
        const currentDrivers = db.getDrivers ? await db.getDrivers() : DRIVERS;

        const stateSnapshot = {
          buses: currentBuses,
          routes: currentRoutes,
          drivers: currentDrivers.length > 0 ? currentDrivers : DRIVERS
        };

        const student = disruption?.studentId ? await db.getStudentById(disruption.studentId) : null;
        const context = {
          type: disruption?.type || 'urgent_add',
          studentId: disruption?.studentId,
          disruptionBusId: disruption?.busId,
          destinationSchoolId: disruption?.destinationSchoolId || 'SCH-01',
          studentStop: disruption?.studentStop || (student ? {
            name: student.stopName,
            coords: student.pickupCoords || [37.77, -122.42],
            specialNeeds: student.specialNeeds
          } : {
            name: disruption?.location || 'Urgent Pickup Stop',
            coords: disruption?.coords || [37.77, -122.42],
            specialNeeds: 'None'
          }),
          stopName: disruption?.location || (student?.stopName) || 'Urgent Stop',
          requiredSeats: disruption?.requiredSeats || 1,
          brokenBus: disruption?.busId ? currentBuses.find(b => b.id === disruption.busId) : null,
          affectedRoute: disruption?.routeId ? currentRoutes.find(r => r.id === disruption.routeId) : null,
          requiresWheelchair: constraints.requiresWheelchair,
          ...constraints
        };

        const recalculatedResult = recalculateWithCustomConstraints(context, stateSnapshot, constraints);
        const selectedCandidate = recalculatedResult.feasibleCandidates && recalculatedResult.feasibleCandidates.length > 0
          ? recalculatedResult.feasibleCandidates[0]
          : null;

        const beforeAfterComparison = computeBeforeAfterComparison({
          originalRecommendation: replan || disruption?.aiRecommendation,
          selectedCandidate,
          disruption,
          state: stateSnapshot
        });

        if (disruption) {
          disruption.aiRecommendation = recalculatedResult;
          disruption.customizerConstraints = constraints;
          await db.saveDisruption(disruption);
        }

        if (db.saveApproval) {
          await db.saveApproval({
            replanId: id,
            disruptionId: disruption?.id || replan?.disruptionId,
            action: 'MODIFIED',
            dispatcherId: body.userId || 'dispatcher-1',
            dispatcherRole: body.userRole || 'Dispatcher',
            modifications: constraints
          });
        }

        await db.saveAuditLog({
          action: 'RECOMMENDATION_MODIFIED',
          actionType: 'REPLAN_CONSTRAINTS_CUSTOMIZED',
          userRole: body.userRole || 'Dispatcher',
          disruptionId: disruption?.id || replan?.disruptionId,
          recommendationId: id,
          timestamp: new Date().toISOString(),
          eventMessage: `Dispatcher customized constraints for ${id}. Preferred bus: ${constraints.preferredBusId || 'ANY'}.`,
          details: { constraints, customResult: recalculatedResult, beforeAfterComparison }
        });

        return sendJson(res, 200, {
          success: true,
          recalculatedRecommendation: recalculatedResult,
          selectedCandidate,
          beforeAfterComparison
        });
      }

      // 9. POST /api/replans/:id/reject
      const rejectMatch = pathname.match(/^\/api\/replans\/([^/]+)\/reject$/);
      if (rejectMatch && method === 'POST') {
        const id = rejectMatch[1];
        let body = {};
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        const reason = body.reason || body.justification;
        if (!reason || !reason.trim()) {
          return sendError(res, 400, 'Rejection reason is mandatory when rejecting a recommendation');
        }

        let replan = await db.getReplanById(id);
        let disruption = await db.getDisruptionById(id);

        if (!replan && disruption && disruption.aiRecommendation) {
          replan = disruption.aiRecommendation;
        }

        if (!replan && !disruption) {
          return sendError(res, 404, `Replan or disruption with ID "${id}" not found`);
        }

        const relatedDisruptionId = replan?.disruptionId || disruption?.id;
        if (!disruption && relatedDisruptionId) {
          disruption = await db.getDisruptionById(relatedDisruptionId);
        }

        if (disruption) {
          disruption.status = 'rejected';
          disruption.rejectionReason = reason.trim();
          await db.saveDisruption(disruption);
        }

        if (replan) {
          replan.status = 'rejected';
          replan.rejectionReason = reason.trim();
          await db.saveReplan(replan);
        }

        if (db.saveApproval) {
          await db.saveApproval({
            replanId: id,
            disruptionId: relatedDisruptionId,
            action: 'REJECTED',
            dispatcherId: body.userId || 'dispatcher-1',
            dispatcherRole: body.userRole || 'Dispatcher',
            reason: reason.trim()
          });
        }

        await db.saveAuditLog({
          action: 'RECOMMENDATION_REJECTED',
          actionType: 'REPLAN_REJECTED',
          userRole: body.userRole || 'Dispatcher',
          disruptionId: relatedDisruptionId,
          recommendationId: id,
          timestamp: new Date().toISOString(),
          eventMessage: `Dispatcher rejected replan ${id}. Reason: "${reason.trim()}". Original routes preserved.`,
          details: { reason: reason.trim() }
        });

        return sendJson(res, 200, {
          success: true,
          message: 'Plan rejected; original operational routes preserved',
          disruptionId: relatedDisruptionId,
          reason: reason.trim()
        });
      }

      // 10. POST /api/sync (Batch Store-and-Forward Replay with Idempotency)
      if (pathname === '/api/sync' && method === 'POST') {
        let body;
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        const actions = Array.isArray(body) ? body : (body.actions || []);
        if (!Array.isArray(actions) || actions.length === 0) {
          return sendJson(res, 200, {
            success: true,
            processedCount: 0,
            syncedCount: 0,
            duplicateCount: 0,
            results: []
          });
        }

        const results = [];
        let syncedCount = 0;
        let duplicateCount = 0;

        for (const action of actions) {
          const actionId = action.actionId || action.id;
          if (!actionId) {
            results.push({ status: 'ERROR', error: 'Missing actionId' });
            continue;
          }

          // Idempotency check: if already processed, do NOT re-execute side effects
          const isAlreadySynced = await db.isActionSynced(actionId);
          if (isAlreadySynced) {
            duplicateCount++;
            results.push({
              actionId,
              status: 'ALREADY_SYNCED',
              duplicate: true,
              message: 'Action was already synchronized previously. No duplicate side effects applied.'
            });
            continue;
          }

          // Apply action side effects
          const actionType = action.actionType || action.type;
          const payload = action.payload || {};
          let resultData = { success: true };

          if (actionType === 'MANUAL_BUS_LOCATION' && payload.busId) {
            const bus = await db.getBusById(payload.busId);
            if (bus) {
              bus.coords = payload.coords || [payload.latitude, payload.longitude];
              bus.gpsStatus = 'manual';
              bus.source = 'manual_dispatcher';
              bus.lastKnownLocation = payload.locationName || bus.lastKnownLocation;
              await db.saveBus(bus);
            }
          } else if (actionType === 'CREATE_DISRUPTION' && payload.disruptionData) {
            const dData = payload.disruptionData;
            await db.saveDisruption({
              id: payload.disruptionId || dData.id || `DIS-${Date.now()}`,
              ...dData
            });
          }

          // Record action in offline_actions / synced_actions table
          await db.recordSyncedAction(action, resultData);
          syncedCount++;

          await db.saveAuditLog({
            action: 'OFFLINE_ACTION_SYNCED',
            actionType,
            userRole: action.role || 'Dispatcher',
            disruptionId: payload.disruptionId || null,
            timestamp: new Date().toISOString(),
            eventMessage: `[SYNCED] Action ${actionId} (${actionType}) synchronized to central database.`,
            details: action
          });

          results.push({
            actionId,
            status: 'SYNCED',
            duplicate: false,
            timestamp: new Date().toISOString()
          });
        }

        return sendJson(res, 200, {
          success: true,
          processedCount: actions.length,
          syncedCount,
          duplicateCount,
          results
        });
      }

      // 11. GET /api/audit
      if (pathname === '/api/audit' && method === 'GET') {
        const logs = await db.getAuditLogs();
        return sendJson(res, 200, logs);
      }

      // 12. POST /api/gps/update (GPS Telemetry Update Ingestion)
      if (pathname === '/api/gps/update' && method === 'POST') {
        let body;
        try {
          body = await parseBody(req);
        } catch (e) {
          return sendError(res, 400, e.message);
        }

        const validation = validateGpsPayload(body);
        if (!validation.isValid) {
          return sendError(res, 400, 'Invalid GPS update payload', validation.errors);
        }

        const { normalized } = validation;
        const bus = await db.getBusById(normalized.busId);
        if (!bus) {
          return sendError(res, 404, `Bus with ID "${normalized.busId}" not found`);
        }

        const isCurrentlyManual = (bus.gpsStatus || '').toLowerCase() === 'manual' || bus.isManualLocation === true;
        const isManualSource = normalized.source === GPS_SOURCES.MANUAL_DISPATCHER;
        const clearManual = body.clearManual === true || body.overrideManual === true;

        // Requirement 8: Preserve MANUAL location override against automated GPS influx
        if (isCurrentlyManual && !clearManual && !isManualSource) {
          bus.backgroundTelematics = {
            coords: normalized.coords,
            latitude: normalized.latitude,
            longitude: normalized.longitude,
            timestamp: normalized.timestamp,
            source: normalized.source
          };
          await db.saveBus(bus);

          if (db.recordGpsUpdate) {
            await db.recordGpsUpdate({
              ...normalized,
              busId: bus.id,
              gpsStatus: 'MANUAL',
              trustLevel: 'MANUAL_VERIFIED',
              isManual: true
            });
          }

          return sendJson(res, 200, {
            success: true,
            busId: bus.id,
            preservedManualOverride: true,
            message: 'Bus is under manual dispatcher override. Automatic GPS fix stored in background; manual position preserved.',
            coords: bus.coords,
            latitude: bus.coords ? bus.coords[0] : bus.latitude,
            longitude: bus.coords ? bus.coords[1] : bus.longitude,
            gpsStatus: 'MANUAL',
            trustLevel: 'MANUAL_VERIFIED',
            source: bus.source || 'manual_dispatcher',
            timestamp: normalized.timestamp,
            provider: gpsProvider.name,
            isSimulated: gpsProvider.isSimulated,
            isExternalConfigured: gpsProvider.isExternalConfigured,
            disclaimer: 'Simulated MVP GPS integration layer. No physical bus GPS devices attached.'
          });
        }

        // Apply update
        if (clearManual) {
          bus.isManualLocation = false;
        }

        const wasLost = (bus.gpsStatus || '').toLowerCase() === 'no_signal' || bus.status === 'breakdown';
        const isSignalLost = normalized.source === GPS_SOURCES.NO_SIGNAL;
        const isManualOverride = isManualSource || (!clearManual && isCurrentlyManual);

        const classification = classifyGpsFreshness(normalized.timestampMs, {
          isManualOverride,
          isSignalLost
        });

        bus.coords = normalized.coords;
        bus.latitude = normalized.latitude;
        bus.longitude = normalized.longitude;
        bus.gpsStatus = classification.status.toLowerCase();
        bus.gpsStatusUpper = classification.status;
        bus.source = normalized.source;
        bus.ageSeconds = classification.ageSeconds;
        bus._lastGpsSyncTimeMs = normalized.timestampMs;
        bus.lastGpsSync = `${new Date(normalized.timestampMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} (${normalized.source})`;
        bus.lastUpdated = new Date().toISOString();
        if (normalized.speedKmh !== undefined) bus.speedKmh = normalized.speedKmh;
        if (normalized.heading !== undefined) bus.heading = normalized.heading;
        if (normalized.locationName) bus.lastKnownLocation = normalized.locationName;
        if (isManualSource) bus.isManualLocation = true;

        await db.saveBus(bus);
        gpsProvider.locations.set(bus.id, { ...bus, ...classification });

        if (db.recordGpsUpdate) {
          await db.recordGpsUpdate({
            ...normalized,
            busId: bus.id,
            gpsStatus: classification.status,
            trustLevel: classification.trustLevel,
            isManual: Boolean(bus.isManualLocation)
          });
        }

        // Recovery detection & audit logging
        if (wasLost && classification.status === 'LIVE') {
          await db.saveAuditLog({
            action: 'GPS_TELEMETRY_RECOVERED',
            actionType: 'GPS_SIGNAL_RESTORED',
            userRole: 'Telemetry Ingestion Service',
            timestamp: new Date().toISOString(),
            eventMessage: `GPS telemetry recovered for ${bus.id}. Fresh live fix locked at [${bus.coords.join(', ')}].`,
            details: { busId: bus.id, coords: bus.coords, source: normalized.source, ageSeconds: classification.ageSeconds }
          });
        } else if (classification.status === 'NO_SIGNAL' || classification.status === 'STALE') {
          await db.saveAuditLog({
            action: 'GPS_TELEMETRY_DEGRADED',
            actionType: 'GPS_SIGNAL_DEGRADED',
            userRole: 'Telemetry Ingestion Service',
            timestamp: new Date().toISOString(),
            eventMessage: `GPS telemetry degraded for ${bus.id}. State: ${classification.status} (Age: ${classification.ageSeconds}s).`,
            details: { busId: bus.id, classification }
          });
        }

        return sendJson(res, 200, {
          success: true,
          busId: bus.id,
          coords: bus.coords,
          latitude: bus.latitude,
          longitude: bus.longitude,
          timestamp: normalized.timestamp,
          ageSeconds: classification.ageSeconds,
          gpsStatus: classification.status,
          trustLevel: classification.trustLevel,
          source: normalized.source,
          isLive: classification.isLive,
          isLastKnown: classification.isLastKnown,
          isStale: classification.isStale,
          isNoSignal: classification.isNoSignal,
          isManual: classification.isManual,
          warning: classification.warning,
          reducedTrustInDistance: classification.reducedTrustInDistance,
          requiresVerification: classification.requiresVerification,
          provider: gpsProvider.name,
          isSimulated: gpsProvider.isSimulated,
          isExternalConfigured: gpsProvider.isExternalConfigured,
          disclaimer: 'Simulated MVP GPS integration layer. No physical bus GPS devices attached.'
        });
      }

      // 13. GET /api/gps (All Buses GPS Status & Provider Info)
      if (pathname === '/api/gps' && method === 'GET') {
        const buses = await db.getBuses();
        const telemetry = buses.map(b => {
          const rawStatus = (b.gpsStatus || 'live').toLowerCase();
          const lastSyncMs = b._lastGpsSyncTimeMs || (Date.now() - (rawStatus === 'live' ? 15000 : 180000));
          const isManual = rawStatus === 'manual' || b.isManualLocation === true;
          const isLost = rawStatus === 'no_signal' || b.status === 'breakdown';
          const freshness = classifyGpsFreshness(lastSyncMs, { isManualOverride: isManual, isSignalLost: isLost });

          return {
            busId: b.id,
            coords: b.coords || [b.latitude || 37.77, b.longitude || -122.42],
            latitude: b.latitude || (b.coords ? b.coords[0] : 37.77),
            longitude: b.longitude || (b.coords ? b.coords[1] : -122.42),
            gpsStatus: freshness.status,
            ageSeconds: freshness.ageSeconds,
            trustLevel: freshness.trustLevel,
            source: b.source || (freshness.isLive ? 'mock_telematics' : 'last_known'),
            lastGpsSync: b.lastGpsSync,
            warning: freshness.warning,
            isManual: freshness.isManual
          };
        });

        return sendJson(res, 200, {
          provider: gpsProvider.getStatus(),
          count: telemetry.length,
          telemetry
        });
      }

      // 14. GET /api/gps/:id
      const gpsBusMatch = pathname.match(/^\/api\/gps\/([^/]+)$/);
      if (gpsBusMatch && method === 'GET') {
        const busId = gpsBusMatch[1];
        if (busId === 'provider') {
          return sendJson(res, 200, gpsProvider.getStatus());
        }

        const bus = await db.getBusById(busId);
        if (!bus) {
          return sendError(res, 404, `Bus with ID "${busId}" not found`);
        }

        const rawStatus = (bus.gpsStatus || 'live').toLowerCase();
        const lastSyncMs = bus._lastGpsSyncTimeMs || (Date.now() - (rawStatus === 'live' ? 15000 : 180000));
        const isManual = rawStatus === 'manual' || bus.isManualLocation === true;
        const isLost = rawStatus === 'no_signal' || bus.status === 'breakdown';
        const freshness = classifyGpsFreshness(lastSyncMs, { isManualOverride: isManual, isSignalLost: isLost });

        return sendJson(res, 200, {
          busId: bus.id,
          coords: bus.coords,
          latitude: bus.latitude || (bus.coords ? bus.coords[0] : 37.77),
          longitude: bus.longitude || (bus.coords ? bus.coords[1] : -122.42),
          gpsStatus: freshness.status,
          ageSeconds: freshness.ageSeconds,
          trustLevel: freshness.trustLevel,
          source: bus.source || (freshness.isLive ? 'mock_telematics' : 'last_known'),
          lastGpsSync: bus.lastGpsSync,
          warning: freshness.warning,
          isManual: freshness.isManual,
          provider: gpsProvider.getStatus()
        });
      }

      // 15. 404 for unknown endpoints
      return sendError(res, 404, `Endpoint ${method} ${pathname} not found`);

    } catch (err) {
      console.error(`[API Server Error] ${method} ${pathname}:`, err);
      return sendError(res, 500, 'Internal Server Error', err.message);
    }
  });

  return {
    server,
    get db() {
      return dbInstance;
    },
    getDb,
    gpsProvider,
    async listen(port = 3001) {
      dbInstance = await getDb();
      return new Promise((resolve, reject) => {
        server.listen(port, () => {
          resolve(server.address());
        });
        server.on('error', reject);
      });
    },
    async close() {
      return new Promise(resolve => {
        server.close(async () => {
          if (dbInstance) {
            await dbInstance.close();
          }
          resolve();
        });
      });
    }
  };
}

// Standalone execution when run directly: `node server/server.js`
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const app = createServer();
  app.listen(PORT).then(addr => {
    const meta = getDatabaseMetadata();
    console.log(`========================================================================`);
    console.log(`  SCHOOL BUS REPLANNING LOCAL BACKEND API SERVER RUNNING`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Database Backend: ${meta.backend}${meta.isFallback ? ' (FALLBACK ACTIVE)' : ''}`);
    console.log(`  Endpoints:`);
    console.log(`    - GET  /api/health`);
    console.log(`    - GET  /api/buses`);
    console.log(`    - GET  /api/routes`);
    console.log(`    - GET  /api/disruptions`);
    console.log(`    - POST /api/disruptions`);
    console.log(`    - POST /api/replans`);
    console.log(`    - POST /api/replans/:id/approve`);
    console.log(`    - POST /api/replans/:id/modify`);
    console.log(`    - POST /api/replans/:id/reject`);
    console.log(`    - POST /api/sync`);
    console.log(`    - GET  /api/audit`);
    console.log(`    - GET  /api/gps`);
    console.log(`    - POST /api/gps/update`);
    console.log(`========================================================================`);
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
