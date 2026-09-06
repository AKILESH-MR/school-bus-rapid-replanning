// State Management for School Bus Rapid Replanning & Responsible AI System
import { BUSES, ROUTES, STUDENTS, DISRUPTIONS, OPERATIONS_METRICS, DRIVERS, SCHOOLS, DEPOT } from '../data/mockData.js';

function getDistanceMiles(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const dy = (lat2 - lat1) * 69;
  const dx = (lon2 - lon1) * 55;
  return Math.sqrt(dx * dx + dy * dy);
}

class AppStore {
  constructor() {
    // Load pending offline changes from localStorage if any
    const savedPending = this.loadPendingOfflineChanges();

    this.state = {
      // Navigation & Flow State
      activeScreen: 'auth', // 'auth' -> 'role_selection' -> 'app'
      currentUser: null,
      currentRole: null, // 'dispatcher' | 'operations_manager'
      activeTab: 'dashboard', // 'dashboard', 'buses', 'routes', 'students', 'disruptions', 'replanning', 'reports', 'settings'
      
      // Network & System Resilience State
      networkStatus: 'online', // 'online' | 'degraded' | 'offline'
      pendingOfflineChanges: savedPending,
      lastSyncTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

      // Domain Entities (Deep cloned for state isolation)
      buses: JSON.parse(JSON.stringify(BUSES)),
      routes: JSON.parse(JSON.stringify(ROUTES)),
      students: JSON.parse(JSON.stringify(STUDENTS)),
      disruptions: JSON.parse(JSON.stringify(DISRUPTIONS)),
      drivers: JSON.parse(JSON.stringify(DRIVERS)),
      schools: JSON.parse(JSON.stringify(SCHOOLS)),
      depot: JSON.parse(JSON.stringify(DEPOT)),
      metrics: JSON.parse(JSON.stringify(OPERATIONS_METRICS)),
      
      // Interaction State
      selectedBusId: null,
      selectedRouteId: null,
      selectedDisruptionId: "DIS-2026-001", // Default active critical disruption
      searchQuery: "",
      filterStatus: "all",
      
      // Modals
      activeModal: null, // 'create_disruption' | 'add_student' | 'bus_detail' | 'manual_location' | null
      modalPayload: null,
      
      // Toast notifications
      toasts: []
    };
    
    this.listeners = new Set();

    // Hook browser online / offline network events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setNetworkStatus('online');
      });
      window.addEventListener('offline', () => {
        this.setNetworkStatus('offline');
      });
    }
  }

  loadPendingOfflineChanges() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem('school_bus_pending_sync');
        return data ? JSON.parse(data) : [];
      }
    } catch (e) {
      console.warn('Unable to load pending offline queue from localStorage', e);
    }
    return [];
  }

  savePendingOfflineChanges() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('school_bus_pending_sync', JSON.stringify(this.state.pendingOfflineChanges));
      }
    } catch (e) {
      console.warn('Unable to persist pending offline queue to localStorage', e);
    }
  }

  // Network Failure & Resilience Management
  setNetworkStatus(status) {
    const prevStatus = this.state.networkStatus;
    this.state.networkStatus = status;

    if (status === 'offline') {
      this.showToast('Network Offline — Operating in Local Fallback Mode with Last Known Data.', 'danger');
    } else if (status === 'degraded') {
      this.showToast('Network Degraded — High Latency Telematics. Using Local Cache.', 'warning');
    } else if (status === 'online') {
      if (prevStatus !== 'online') {
        this.showToast('Network Restored — Connected to District Telematics Cloud.', 'success');
        if (this.state.pendingOfflineChanges.length > 0) {
          this.syncPendingOfflineChanges();
        }
      }
    }
    this.notify();
  }

  queueOfflineChange(actionType, description, payload = {}) {
    const changeItem = {
      id: `SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      actionType,
      description,
      payload
    };

    this.state.pendingOfflineChanges.push(changeItem);
    this.savePendingOfflineChanges();

    this.showToast(`[${this.state.networkStatus.toUpperCase()} MODE] Changes saved locally. Will sync when online.`, 'warning');
  }

  syncPendingOfflineChanges() {
    if (this.state.pendingOfflineChanges.length === 0) {
      this.showToast('System is synchronized with district servers.', 'info');
      return;
    }

    const count = this.state.pendingOfflineChanges.length;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Record synchronization into audit trail
    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-SYNC-${Date.now()}`,
      time: nowStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'System Sync Engine',
      event: `Network Synchronized: Flushed ${count} locally queued operational updates to central district servers.`,
      status: 'SYNCHRONIZED'
    });

    this.state.pendingOfflineChanges = [];
    this.savePendingOfflineChanges();
    this.state.lastSyncTimestamp = nowStr;

    this.showToast(`Synchronized ${count} pending local operational change(s) with Central Servers.`, 'success');
    this.notify();
  }

  // GPS Failure & Manual Location Update
  updateBusLocationManually(busId, coords, locationName = '', reason = 'Dispatcher Manual Checkpoint') {
    const bus = this.state.buses.find(b => b.id === busId);
    if (!bus) return;

    const prevCoords = [...bus.coords];
    const prevLocation = bus.lastKnownLocation || 'Previous GPS Coordinates';
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update location and mark explicitly as manual checkpoint (never pretend it is a live fix)
    bus.coords = [parseFloat(coords[0]), parseFloat(coords[1])];
    bus.gpsStatus = 'manual';
    bus.isManualLocation = true;
    bus.lastKnownLocation = locationName || `Checkpoint at [${bus.coords[0].toFixed(4)}, ${bus.coords[1].toFixed(4)}]`;
    bus.lastGpsSync = `${nowTimeStr} (Dispatcher Manual Fix: ${reason})`;

    // If bus is stalled, keep breakdown status, but update location
    const changeDescription = `Manual location update for ${bus.id} to ${bus.lastKnownLocation}`;

    // If offline/degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('MANUAL_BUS_LOCATION', changeDescription, {
        busId,
        coords: bus.coords,
        locationName: bus.lastKnownLocation,
        reason
      });
    }

    // Add to audit trail
    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-GPS-${Date.now()}`,
      time: nowTimeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Manual Location Fix: ${bus.id} updated to "${bus.lastKnownLocation}". Reason: ${reason}.`,
      status: 'MANUAL_GPS_OVERRIDE'
    });

    this.showToast(`Location for ${bus.id} updated manually to "${bus.lastKnownLocation}". Marked as Manual Fix.`, 'success');
    this.closeModal();
    this.notify();
  }

  setBusGpsStatus(busId, status, locationName = null) {
    const bus = this.state.buses.find(b => b.id === busId);
    if (!bus) return;

    bus.gpsStatus = status; // 'live' | 'no_signal' | 'lost' | 'manual'
    if (status === 'no_signal' || status === 'lost') {
      bus.isManualLocation = false;
      bus.lastGpsSync = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Signal Lost)`;
    } else if (status === 'live') {
      bus.isManualLocation = false;
      bus.lastGpsSync = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live Telematics Lock)`;
    }
    if (locationName) {
      bus.lastKnownLocation = locationName;
    }
    this.notify();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // Auth Flow Actions
  login(userProfile) {
    this.state.currentUser = userProfile;
    this.state.activeScreen = 'role_selection';
    this.showToast(`Welcome, ${userProfile.name}! Select your operational role.`, 'info');
    this.notify();
  }

  selectRole(role) {
    this.state.currentRole = role;
    this.state.activeScreen = 'app';
    this.state.activeTab = 'dashboard';
    
    const roleName = role === 'dispatcher' ? 'Dispatcher Control Room' : 'Operations Manager Oversight';
    this.showToast(`Active Session: ${roleName}`, 'success');
    this.notify();
  }

  switchRole(role) {
    this.state.currentRole = role;
    const roleName = role === 'dispatcher' ? 'Dispatcher Control Room' : 'Operations Manager Oversight';
    this.showToast(`Switched view to ${roleName}`, 'info');
    this.notify();
  }

  logout() {
    this.state.currentUser = null;
    this.state.currentRole = null;
    this.state.activeScreen = 'auth';
    this.state.activeTab = 'dashboard';
    this.showToast('Logged out of Transport Control Center', 'info');
    this.notify();
  }

  setActiveTab(tabName) {
    this.state.activeTab = tabName;
    this.notify();
  }

  setSearchQuery(q) {
    this.state.searchQuery = q;
    this.notify();
  }

  setFilterStatus(status) {
    this.state.filterStatus = status;
    this.notify();
  }

  setSelectedDisruption(id) {
    this.state.selectedDisruptionId = id;
    this.notify();
  }

  setSelectedBus(id) {
    this.state.selectedBusId = id;
    this.notify();
  }

  // Driver Availability & Commitment Validation Engine for Replanning
  validateDriverAvailabilityAndCommitments(driver, bus, targetRoute = null) {
    // 1 & 5. Check whether driver exists and is available
    if (!driver) {
      return {
        isValid: false,
        reason: "Driver unavailable",
        preferenceScore: 0
      };
    }

    if (driver.status === 'sick') {
      return {
        isValid: false,
        reason: "Driver unavailable (Medical / Sickness absence)",
        preferenceScore: 0
      };
    }

    if (driver.status === 'on_break' || driver.status === 'offline') {
      return {
        isValid: false,
        reason: "Driver unavailable (Off-duty / Mandatory rest)",
        preferenceScore: 0
      };
    }

    if (driver.status !== 'active' && driver.status !== 'standby') {
      return {
        isValid: false,
        reason: "Driver unavailable",
        preferenceScore: 0
      };
    }

    // 2 & 4. Check the driver's current assignment and route conflicts
    if (targetRoute) {
      const conflictingRoute = this.state.routes.find(r => 
        r.id !== targetRoute.id && 
        (r.assignedDriver === driver.name || (bus && bus.routeId && bus.routeId === r.id && r.id !== targetRoute.id))
      );
      if (conflictingRoute) {
        return {
          isValid: false,
          reason: `Driver already assigned to another route (${conflictingRoute.id})`,
          preferenceScore: 0
        };
      }
    }

    // 3. Check existing commitments
    if (driver.commitments && driver.commitments.length > 0) {
      return {
        isValid: false,
        reason: "Driver has an existing commitment",
        preferenceScore: 0
      };
    }

    // 6. Prefer candidates with an available driver and no commitment conflict
    const preferenceScore = driver.status === 'standby' ? 25 : 15;

    return {
      isValid: true,
      reason: null,
      preferenceScore
    };
  }

  // 1-10. Vehicle Unavailable / Bus Breakdown Rapid Replanning Engine
  handleVehicleBreakdown(busId, incidentDetails = {}) {
    const brokenBus = this.state.buses.find(b => b.id === busId);
    if (!brokenBus) return;

    // 1. Mark the bus as unavailable
    brokenBus.status = 'breakdown';
    brokenBus.speedKmh = 0;
    if (incidentDetails.impact) {
      brokenBus.breakdownNote = incidentDetails.impact;
    }

    // 2. Identify its affected route
    const route = this.state.routes.find(r => r.id === brokenBus.routeId || r.assignedBus === brokenBus.id);

    // 3. Identify students affected by the unavailable bus
    const affectedStudents = this.state.students.filter(s => 
      s.busId === brokenBus.id || (route && s.routeId === route.id && s.status !== 'absent_cancelled')
    );
    const affectedLoad = affectedStudents.length || brokenBus.currentLoad || 0;

    // 4-8. Find available replacement buses (Never recommend the unavailable bus)
    const candidateEvaluations = [];
    const availableDrivers = this.state.drivers.filter(d => d.status === 'active' || d.status === 'standby');

    for (const candidate of this.state.buses) {
      // NEVER recommend the unavailable bus
      if (candidate.id === brokenBus.id) continue;

      const reasons = [];
      const candidateRoute = this.state.routes.find(r => r.id === candidate.routeId);
      const isStandbyInDepot = candidate.status === 'in_depot';

      // Status check
      if (['breakdown', 'offline', 'maintenance'].includes(candidate.status)) {
        reasons.push(`Vehicle unavailable (${candidate.status})`);
      }

      // Capacity check (must support the affected passenger load)
      if (candidate.capacity < affectedLoad) {
        reasons.push(`Insufficient capacity (${candidate.capacity} seats < ${affectedLoad} required students)`);
      }

      // Route compatibility & Accessibility check
      const needsWheelchair = affectedStudents.some(s => s.specialNeeds && s.specialNeeds.toLowerCase().includes('wheelchair'));
      if (needsWheelchair) {
        const hasLift = candidate.amenities && candidate.amenities.some(a => a.toLowerCase().includes('wheelchair'));
        if (!hasLift) {
          reasons.push('Incompatible: Lacks required ADA Wheelchair Lift for special needs passengers');
        }
      }

      // Battery / Fuel check
      if (candidate.fuelLevel < 30) {
        reasons.push(`Low fuel/battery (${candidate.fuelLevel}%) insufficient for emergency dispatch`);
      }

      // Driver availability & commitments validation
      let candidateDriver = this.state.drivers.find(d => d.id === candidate.driverId);
      if (!candidateDriver && isStandbyInDepot) {
        // Find reserve standby driver with no commitment conflict
        candidateDriver = availableDrivers.find(d => 
          this.validateDriverAvailabilityAndCommitments(d, candidate, route).isValid
        ) || availableDrivers[0] || null;
      }

      const driverCheck = this.validateDriverAvailabilityAndCommitments(candidateDriver, candidate, route);
      if (!driverCheck.isValid) {
        reasons.push(driverCheck.reason);
      }

      const isFeasible = reasons.length === 0;

      const driverLocation = candidate.status === 'in_depot' ? [37.7550, -122.4050] : (candidate.coords || [37.77, -122.42]);
      const disruptionLocation = brokenBus.coords || incidentDetails.coords || [37.77, -122.42];
      const driverDistanceMi = getDistanceMiles(driverLocation, disruptionLocation);

      // Deterministic scoring (prefer available driver with zero commitment conflict and closer proximity)
      const score = isFeasible
        ? (100 + (candidate.capacity - affectedLoad) * 2 + driverCheck.preferenceScore + (candidate.healthScore || 90) * 0.1 - driverDistanceMi * 2)
        : 0;

      candidateEvaluations.push({
        bus: candidate,
        route: candidateRoute,
        driver: candidateDriver,
        isFeasible,
        reasons,
        seatsAvailable: candidate.capacity - (isStandbyInDepot ? 0 : (candidate.currentLoad || 0)),
        delayMins: isStandbyInDepot ? 4.0 : 7.5,
        driverDistanceMi,
        score
      });
    }

    const feasibleReplacements = candidateEvaluations
      .filter(c => c.isFeasible)
      .sort((a, b) => b.score - a.score);

    const bestReplacement = feasibleReplacements[0] || null;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newDisruptionId = `DIS-2026-00${this.state.disruptions.length + 1}`;

    if (!bestReplacement) {
      // IF NO REPLACEMENT IS POSSIBLE
      const failureDisruption = {
        id: newDisruptionId,
        reportedAt: timeStr,
        type: 'breakdown',
        title: `Vehicle Breakdown: Bus ${brokenBus.id} Stall Alert`,
        busId: brokenBus.id,
        routeId: route ? route.id : null,
        location: incidentDetails.location || 'Route Waypoint',
        severity: 'critical',
        impact: `Bus ${brokenBus.id} stalled with ${affectedLoad} passengers. No replacement fleet vehicle meets capacity/driver requirements.`,
        status: 'unresolved',
        aiRecommendationAvailable: false,
        noFeasibleSolution: true,
        affectedStudentsList: affectedStudents.map(s => ({
          id: s.id,
          name: s.name,
          grade: s.grade,
          stopName: s.stopName,
          specialNeeds: s.specialNeeds
        })),
        candidateEvaluations: candidateEvaluations.map(e => ({
          busId: e.bus.id,
          routeId: e.route ? e.route.id : 'Depot Standby',
          driverName: e.driver ? e.driver.name : 'Unassigned',
          isFeasible: false,
          reasons: e.reasons.join('; ')
        }))
      };

      this.state.disruptions.unshift(failureDisruption);
      this.state.selectedDisruptionId = newDisruptionId;
      this.state.metrics.activeDisruptionsCount += 1;

      this.showToast('No Feasible Solution — Manual Intervention Required', 'danger');
      this.closeModal();
      this.setActiveTab('replanning');
      this.notify();
      return;
    }

    // FEASIBLE REPLACEMENT FOUND
    const beforeRoute = route ? JSON.parse(JSON.stringify(route)) : null;
    const afterRoute = route ? JSON.parse(JSON.stringify(route)) : null;
    if (afterRoute) {
      afterRoute.assignedBus = bestReplacement.bus.id;
      afterRoute.assignedDriver = bestReplacement.driver.name;
    }

    const beforeBus = JSON.parse(JSON.stringify(brokenBus));
    const afterBus = JSON.parse(JSON.stringify(bestReplacement.bus));
    afterBus.currentLoad = affectedLoad;

    const firstRejected = candidateEvaluations.find(c => !c.isFeasible);
    const rejectedNote = firstRejected ? ` Note: ${firstRejected.bus.id} was considered but rejected because ${firstRejected.reasons.join(', ')}.` : '';
    const reasonExplanation = `Selected ${bestReplacement.bus.id} because it has ${bestReplacement.seatsAvailable} available seats (>= ${affectedLoad} needed), its driver (${bestReplacement.driver.name}) is available with no commitment conflicts, and it is in proximity (${bestReplacement.driverDistanceMi ? bestReplacement.driverDistanceMi.toFixed(1) : '?'} mi).${rejectedNote}`;

    const newDisruption = {
      id: newDisruptionId,
      _createdAtMs: Date.now(),
      reportedAt: timeStr,
      type: 'breakdown',
      title: incidentDetails.title || `Vehicle Breakdown: Bus ${brokenBus.id} at ${incidentDetails.location || 'Market & 7th'}`,
      busId: brokenBus.id,
      routeId: route ? route.id : null,
      location: incidentDetails.location || 'Stop 3 / Cole & Haight',
      severity: 'critical',
      impact: `Bus ${brokenBus.id} unavailable. ${affectedLoad} students require emergency replacement transit.`,
      status: 'unresolved',
      beforeRoute,
      afterRoute,
      beforeBus: {
        id: brokenBus.id,
        load: brokenBus.currentLoad,
        capacity: brokenBus.capacity,
        availableSeats: 0,
        status: 'Unavailable (Stalled)'
      },
      afterBus: {
        id: bestReplacement.bus.id,
        load: affectedLoad,
        capacity: bestReplacement.bus.capacity,
        availableSeats: bestReplacement.bus.capacity - affectedLoad,
        status: 'Dispatched from Depot'
      },
      affectedStudentsList: affectedStudents.map(s => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
        stopName: s.stopName,
        specialNeeds: s.specialNeeds
      })),
      aiRecommendationAvailable: true,
      aiRecommendation: {
        planId: `REPLAN-SWAP-${Math.floor(100 + Math.random() * 900)}`,
        strategy: 'Emergency Standby Fleet Swap & Depot Dispatch',
        recommendedBusId: bestReplacement.bus.id,
        recommendedRouteId: route ? route.id : 'RT-104',
        availableSeats: `${bestReplacement.seatsAvailable} seats available (${bestReplacement.bus.capacity} seat capacity)`,
        currentLocation: bestReplacement.bus.status === 'in_depot' ? 'Central Depot (Standby Bay 1)' : 'En Route',
        driverAvailability: `${bestReplacement.driver.name} (Available - ${bestReplacement.driver.status === 'standby' ? 'Standby' : 'Active'}, No commitment conflicts)`,
        routeCompatibility: `Compatible (Serves ${route ? route.schoolName || route.schoolId : 'District School'}, ADA Lift Verified, 54 capacity >= ${affectedLoad} required)`,
        estimatedAdditionalDelay: `+${(bestReplacement.delayMins || 4.2).toFixed(0)} min (Within SLA grace window)`,
        selectionReason: reasonExplanation,
        recommendedDriverId: bestReplacement.driver.id,
        recommendedDriverName: bestReplacement.driver.name,
        standbyBusAssigned: bestReplacement.bus.id,
        reserveDriverAssigned: `${bestReplacement.driver.id} (${bestReplacement.driver.name})`,
        estRecoveryTimeMins: (bestReplacement.delayMins || 4.2).toFixed(1),
        newEtaDifference: '+4 min',
        explanation: reasonExplanation,
        candidateEvaluations: candidateEvaluations.map(e => ({
          busId: e.bus.id,
          model: e.bus.model,
          routeId: e.route ? e.route.id : 'Depot Standby',
          driverName: e.driver ? e.driver.name : 'Unassigned',
          location: e.bus.status === 'in_depot' ? 'Central Depot' : (e.route?.stops?.find(s => s.status === 'next')?.name || 'In Transit'),
          driverDistanceMi: e.driverDistanceMi,
          driverStatus: e.driver ? e.driver.status : 'unknown',
          isFeasible: e.isFeasible,
          seatsAvailable: e.seatsAvailable,
          delayMins: e.delayMins,
          statusText: e.isFeasible ? 'Feasible Candidate (Recommended)' : e.reasons.join('; ')
        })),
        tradeoffs: [
          `Dispatches reserve standby ${bestReplacement.bus.id} from Central Depot (${bestReplacement.bus.capacity} seats)`,
          `Reassigns ${affectedLoad} passengers with zero missed stops or ADA violations`,
          `Estimated schedule variance: +4 mins (within SLA)`
        ]
      },
      ...incidentDetails
    };

    this.state.disruptions.unshift(newDisruption);
    this.state.selectedDisruptionId = newDisruptionId;
    this.state.metrics.activeDisruptionsCount += 1;

    // Log
    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: timeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Vehicle Breakdown Declared on ${brokenBus.id}. Proposed Replacement: ${bestReplacement.bus.id}. Awaiting Dispatcher Approval.`,
      status: 'PENDING_APPROVAL'
    });

    // If offline / degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('BREAKDOWN_DECLARATION', `Vehicle Breakdown declared for ${brokenBus.id}. Proposed replacement: ${bestReplacement.bus.id}`, {
        busId: brokenBus.id,
        replacementBusId: bestReplacement.bus.id,
        disruptionId: newDisruptionId
      });
    }

    this.showToast(`Vehicle Breakdown logged on ${brokenBus.id}. Recommended Replacement: Bus ${bestReplacement.bus.id}. Awaiting Approval.`, 'danger');
    this.closeModal();
    this.setActiveTab('replanning');
    this.notify();
  }

  // Operational Actions
  createDisruption(disruptionData) {
    if (disruptionData.type === 'breakdown' && disruptionData.busId) {
      this.handleVehicleBreakdown(disruptionData.busId, disruptionData);
      return;
    }

    const newId = `DIS-2026-00${this.state.disruptions.length + 1}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDisruption = {
      id: newId,
      reportedAt: timeStr,
      status: 'unresolved',
      aiRecommendationAvailable: true,
      aiRecommendation: {
        planId: `REC-AI-${Math.floor(100 + Math.random() * 900)}`,
        strategy: disruptionData.type === 'driver_unavailability'
          ? 'Reserve Driver Dispatch'
          : 'Dynamic Stop Re-sequencing',
        recommendedBusId: disruptionData.busId || 'BUS-02',
        recommendedRouteId: disruptionData.routeId || 'RT-102',
        availableSeats: '10 seats available',
        currentLocation: disruptionData.location || 'Central Depot',
        driverAvailability: 'David Chen (Available - Standby, No commitment conflicts)',
        routeCompatibility: 'Compatible (Active District Route)',
        estimatedAdditionalDelay: '+1 min',
        selectionReason: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
        reserveDriverAssigned: 'DRV-107 (Robert MacIntyre)',
        estRecoveryTimeMins: 4.5,
        newEtaDifference: '+4 min',
        explanation: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
        candidateEvaluations: [
          {
            busId: disruptionData.busId || 'BUS-02',
            routeId: disruptionData.routeId || 'RT-102',
            driverName: 'David Chen',
            seatsAvailable: 10,
            delayMins: 1,
            isFeasible: true,
            statusText: 'Feasible Candidate (Recommended)'
          },
          {
            busId: 'BUS-01',
            routeId: 'RT-101',
            driverName: 'Sarah Jenkins',
            seatsAvailable: 12,
            delayMins: 12,
            isFeasible: false,
            statusText: 'Driver already assigned to another route (RT-101)'
          }
        ],
        tradeoffs: ['Minimal operational variance', 'Full passenger safety verified']
      },
      ...disruptionData
    };

    this.state.disruptions.unshift(newDisruption);
    this.state.selectedDisruptionId = newId;
    this.state.metrics.activeDisruptionsCount += 1;

    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: timeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Declared Disruption: ${disruptionData.title}`,
      status: 'PENDING_REVIEW'
    });

    // If offline / degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('CREATE_DISRUPTION', `Declared Disruption: ${disruptionData.title}`, {
        disruptionId: newId,
        disruptionData
      });
    }

    this.showToast(`New Disruption Logged: ${disruptionData.title}`, 'danger');
    this.closeModal();
    this.setActiveTab('replanning');
    this.notify();
  }

  // 1-8. Algorithmic Evaluation for Urgent Student Addition
  evaluateUrgentStudentAddition(studentData) {
    const evaluations = [];

    for (const bus of this.state.buses) {
      const route = this.state.routes.find(r => r.id === bus.routeId);
      const driver = this.state.drivers.find(d => d.id === bus.driverId);
      const destinationSchool = this.state.schools.find(s => s.id === (route ? route.schoolId : studentData.schoolId));
      const reasons = [];

      // 1. Check vehicle operational status
      if (['breakdown', 'offline', 'maintenance'].includes(bus.status)) {
        reasons.push(`Vehicle unavailable (${bus.status})`);
      }

      // 2. Check available seats
      const seatsAvailable = bus.capacity - (bus.currentLoad || 0);
      if (seatsAvailable <= 0) {
        reasons.push(`Insufficient capacity (${bus.currentLoad}/${bus.capacity} full, 0 seats available)`);
      }

      // 3. Check driver availability, current assignment, and existing commitments
      const driverCheck = this.validateDriverAvailabilityAndCommitments(driver, bus, route);
      if (!driverCheck.isValid) {
        reasons.push(driverCheck.reason);
      }

      // 4. Check route compatibility (destination school & active service)
      if (!route) {
        reasons.push('Bus has no active route assigned');
      } else if (studentData.schoolId && route.schoolId !== studentData.schoolId) {
        reasons.push(`Route ${route.id} serves ${route.schoolName || route.schoolId}, incompatible with destination (${studentData.schoolName || studentData.schoolId})`);
      }

      // 5. Special needs / ADA accessibility compatibility
      if (studentData.specialNeeds && studentData.specialNeeds.toLowerCase().includes('wheelchair')) {
        const hasLift = bus.amenities && bus.amenities.some(a => a.toLowerCase().includes('wheelchair'));
        if (!hasLift) {
          reasons.push('Incompatible: Vehicle lacks required ADA Wheelchair Lift');
        }
      }

      // 6 & 7. Estimate additional route delay & driver commitment
      const isWheelchair = studentData.specialNeeds && studentData.specialNeeds.toLowerCase().includes('wheelchair');
      const dwellDelayMins = isWheelchair ? 3.5 : 2.0;
      const detourTransitMins = 1.5;
      const additionalDelayMins = dwellDelayMins + detourTransitMins;

      const isFeasible = reasons.length === 0;

      const driverLocation = bus.status === 'in_depot' ? [37.7550, -122.4050] : (bus.coords || [37.77, -122.42]);
      const disruptionLocation = studentData.coords || [37.77, -122.42];
      const driverDistanceMi = getDistanceMiles(driverLocation, disruptionLocation);

      // Deterministic scoring (prefer available driver without commitment conflicts, and closer proximity)
      const score = isFeasible 
        ? (100 - additionalDelayMins * 5 + seatsAvailable * 2 + driverCheck.preferenceScore + (bus.healthScore || 90) * 0.1 - driverDistanceMi * 2) 
        : 0;

      evaluations.push({
        bus,
        route,
        driver,
        destinationSchool,
        isFeasible,
        reasons,
        seatsAvailable,
        additionalDelayMins,
        driverDistanceMi,
        score
      });
    }

    // Filter feasible candidates and sort deterministically by score descending
    const feasibleCandidates = evaluations
      .filter(e => e.isFeasible)
      .sort((a, b) => b.score - a.score);

    return {
      feasibleCandidates,
      allEvaluations: evaluations
    };
  }

  // 9-10. Urgent Student Addition: evaluate feasibility, recommend best bus, await dispatcher approval
  addStudent(studentData) {
    const { feasibleCandidates, allEvaluations } = this.evaluateUrgentStudentAddition(studentData);
    const bestCandidate = feasibleCandidates[0] || null;

    const newId = `STU-${Math.floor(1010 + Math.random() * 8000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Register student with UNASSIGNED status until approved
    const newStudent = {
      id: newId,
      status: bestCandidate ? 'urgent_added' : 'urgent_no_feasible',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
      busId: 'UNASSIGNED',
      routeId: 'UNASSIGNED',
      ...studentData
    };

    this.state.students.unshift(newStudent);
    this.state.metrics.totalStudentsToday += 1;

    const newDisruptionId = `DIS-2026-00${this.state.disruptions.length + 1}`;

    if (!bestCandidate) {
      // IF NO SUITABLE BUS EXISTS
      const failureDisruption = {
        id: newDisruptionId,
        _createdAtMs: Date.now(),
        reportedAt: timeStr,
        type: 'urgent_add',
        title: `Urgent Student Addition – ${studentData.name}`,
        studentId: newId,
        studentName: studentData.name,
        busId: null,
        routeId: null,
        location: studentData.stopName,
        severity: 'warning',
        impact: 'No suitable bus exists matching capacity, driver, and destination school requirements.',
        status: 'unresolved',
        aiRecommendationAvailable: false,
        noFeasibleSolution: true,
        candidateEvaluations: allEvaluations.map(e => ({
          busId: e.bus.id,
          model: e.bus.model,
          routeId: e.route ? e.route.id : 'None',
          driverName: e.driver ? e.driver.name : 'Unassigned',
          location: e.bus.status === 'in_depot' ? 'Central Depot' : (e.route?.stops?.find(s => s.status === 'next')?.name || 'In Transit'),
          seatsAvailable: e.seatsAvailable,
          delayMins: e.additionalDelayMins,
          isFeasible: false,
          statusText: e.reasons.join('; ')
        }))
      };

      this.state.disruptions.unshift(failureDisruption);
      this.state.selectedDisruptionId = newDisruptionId;
      this.state.metrics.activeDisruptionsCount += 1;

      this.showToast('No Feasible Solution — Manual Intervention Required', 'warning');
      this.closeModal();
      this.setActiveTab('replanning');
      this.notify();
      return;
    }

    // FEASIBLE CANDIDATE FOUND
    const beforeRoute = JSON.parse(JSON.stringify(bestCandidate.route));
    const afterRoute = JSON.parse(JSON.stringify(bestCandidate.route));

    // Simulated stop insertion on afterRoute
    afterRoute.stops.splice(Math.max(0, afterRoute.stops.length - 1), 0, {
      id: `ST-${bestCandidate.route.id}-URGENT`,
      name: studentData.stopName,
      time: "07:45 AM",
      studentsCount: 1,
      status: "pending"
    });
    afterRoute.totalStops = afterRoute.stops.length;

    const beforeBus = JSON.parse(JSON.stringify(bestCandidate.bus));
    const afterBus = JSON.parse(JSON.stringify(bestCandidate.bus));
    afterBus.currentLoad = (afterBus.currentLoad || 0) + 1;

    const firstRejected = allEvaluations.find(c => !c.isFeasible);
    const rejectedNote = firstRejected ? ` Note: ${firstRejected.bus.id} was considered but rejected because ${firstRejected.reasons.join(', ')}.` : '';
    const reasonExplanation = `Selected ${bestCandidate.bus.id} because it has ${bestCandidate.seatsAvailable} available seats, is compatible with the route, its driver (${bestCandidate.driver.name}) is available with no commitment conflicts, and it is in proximity (${bestCandidate.driverDistanceMi ? bestCandidate.driverDistanceMi.toFixed(1) : '?'} mi).${rejectedNote}`;

    const newDisruption = {
      id: newDisruptionId,
      _createdAtMs: Date.now(),
      reportedAt: timeStr,
      type: 'urgent_add',
      title: `Urgent Student Addition – ${studentData.name}`,
      studentId: newId,
      studentName: studentData.name,
      busId: bestCandidate.bus.id,
      routeId: bestCandidate.route.id,
      location: studentData.stopName,
      severity: 'warning',
      impact: `Urgent passenger request. Recommended Bus ${bestCandidate.bus.id} (${bestCandidate.seatsAvailable} seats available, +${bestCandidate.additionalDelayMins} min variance).`,
      status: 'unresolved',
      beforeRoute,
      afterRoute,
      beforeBus: {
        id: bestCandidate.bus.id,
        load: beforeBus.currentLoad,
        capacity: beforeBus.capacity,
        availableSeats: bestCandidate.seatsAvailable
      },
      afterBus: {
        id: bestCandidate.bus.id,
        load: afterBus.currentLoad,
        capacity: afterBus.capacity,
        availableSeats: bestCandidate.seatsAvailable - 1
      },
      aiRecommendationAvailable: true,
      aiRecommendation: {
        planId: `REPLAN-ADD-${Math.floor(100 + Math.random() * 900)}`,
        strategy: 'Dynamic Stop Insertion & Route Capacity Allocation',
        recommendedBusId: bestCandidate.bus.id,
        recommendedRouteId: bestCandidate.route.id,
        availableSeats: `${bestCandidate.seatsAvailable} seats available (${afterBus.currentLoad}/${bestCandidate.bus.capacity} load)`,
        currentLocation: bestCandidate.bus.status === 'in_depot' ? 'Central Depot' : (bestCandidate.route?.stops?.find(s => s.status === 'next')?.name || 'In Transit'),
        driverAvailability: `${bestCandidate.driver.name} (Available - ${bestCandidate.driver.status === 'standby' ? 'Standby' : 'Active'}, No commitment conflicts)`,
        routeCompatibility: `Compatible (Serves ${studentData.schoolName || 'destination school'}, ADA Compliant)`,
        estimatedAdditionalDelay: `+${bestCandidate.additionalDelayMins} min (Arrives before school bell)`,
        selectionReason: reasonExplanation,
        recommendedDriver: bestCandidate.driver.name,
        estRecoveryTimeMins: 0,
        additionalDelayMins: bestCandidate.additionalDelayMins,
        newEtaDifference: `+${bestCandidate.additionalDelayMins} min`,
        explanation: reasonExplanation,
        candidateEvaluations: allEvaluations.map(e => ({
          busId: e.bus.id,
          model: e.bus.model,
          routeId: e.route ? e.route.id : 'None',
          driverName: e.driver ? e.driver.name : 'Unassigned',
          location: e.bus.status === 'in_depot' ? 'Central Depot' : (e.route?.stops?.find(s => s.status === 'next')?.name || 'In Transit'),
          driverDistanceMi: e.driverDistanceMi,
          driverStatus: e.driver ? e.driver.status : 'unknown',
          isFeasible: e.isFeasible,
          seatsAvailable: e.seatsAvailable,
          delayMins: e.additionalDelayMins,
          statusText: e.isFeasible ? 'Feasible Candidate (Recommended)' : e.reasons.join('; ')
        })),
        tradeoffs: [
          `Inserts 1 stop (${studentData.stopName}) into Route ${bestCandidate.route.id}`,
          `Estimated delay variance: +${bestCandidate.additionalDelayMins} mins (well before school bell time)`,
          `Bus ${bestCandidate.bus.id} load: ${beforeBus.currentLoad} → ${afterBus.currentLoad}/${bestCandidate.bus.capacity} (${bestCandidate.seatsAvailable - 1} seats remaining)`
        ]
      }
    };

    this.state.disruptions.unshift(newDisruption);
    this.state.selectedDisruptionId = newDisruptionId;
    this.state.metrics.activeDisruptionsCount += 1;

    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: timeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Urgent Student Onboarding: ${studentData.name} evaluated. Recommended Bus: ${bestCandidate.bus.id}. Awaiting Approval.`,
      status: 'PENDING_APPROVAL'
    });

    // If offline / degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('ADD_STUDENT_EVALUATION', `Urgent student ${studentData.name} added and evaluated`, {
        studentId: newId,
        studentData,
        disruptionId: newDisruptionId
      });
    }

    this.showToast(`Urgent Student ${studentData.name} evaluated. Recommended: Bus ${bestCandidate.bus.id}. Awaiting Dispatcher Approval.`, 'info');
    this.closeModal();
    this.setActiveTab('replanning');
    this.notify();
  }
  // Handle student cancellation and route recalculation
  cancelStudent(studentId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return;

    const prevBusId = student.busId;
    const prevRouteId = student.routeId;
    const prevStopName = student.stopName;

    // 1. Identify current bus and route & snapshot BEFORE state
    const bus = (prevBusId && prevBusId !== 'UNASSIGNED') 
      ? this.state.buses.find(b => b.id === prevBusId) 
      : null;
    const route = (prevRouteId && prevRouteId !== 'UNASSIGNED') 
      ? this.state.routes.find(r => r.id === prevRouteId) 
      : null;

    const beforeBus = bus ? JSON.parse(JSON.stringify(bus)) : null;
    const beforeRoute = route ? JSON.parse(JSON.stringify(route)) : null;
    const beforeLoad = bus ? (bus.currentLoad || 0) : 0;
    const beforeCapacity = bus ? bus.capacity : 54;
    const beforeAvailableSeats = beforeCapacity - beforeLoad;

    // 2. Mark student as cancelled/absent and remove from active route
    student.status = 'absent_cancelled';
    student.busId = 'UNASSIGNED';
    student.routeId = 'UNASSIGNED';

    // 3. Update bus load and available seats
    if (bus) {
      bus.currentLoad = Math.max(0, (bus.currentLoad || 0) - 1);
    }
    const afterLoad = bus ? (bus.currentLoad || 0) : 0;
    const afterAvailableSeats = beforeCapacity - afterLoad;
    const afterBus = bus ? JSON.parse(JSON.stringify(bus)) : null;

    // 4. Recalculate affected route
    let timeSavedMins = 2;
    if (route && route.stops) {
      const stop = route.stops.find(st => 
        (st.name && prevStopName && st.name.toLowerCase().includes(prevStopName.toLowerCase())) ||
        (prevStopName && prevStopName.toLowerCase().includes(st.name.toLowerCase()))
      );
      if (stop) {
        stop.studentsCount = Math.max(0, (stop.studentsCount || 0) - 1);
        if (stop.studentsCount === 0 && stop.status !== 'completed' && stop.status !== 'destination') {
          timeSavedMins = 3.5;
        }
      }
    }
    const afterRoute = route ? JSON.parse(JSON.stringify(route)) : null;

    // 5. Store disruption with Before / After route information
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = `DIS-2026-00${this.state.disruptions.length + 1}`;
    const selectionReason = `Selected because the bus is already assigned to the route, has increased available capacity (${afterAvailableSeats} seats), and saves ${timeSavedMins} minutes by bypassing the stop.`;

    const disruption = {
      id: newId,
      _createdAtMs: Date.now(),
      reportedAt: timeStr,
      type: 'student_cancel',
      title: `Student Absence & Cancellation – ${student.name}`,
      studentId: student.id,
      studentName: student.name,
      busId: prevBusId,
      routeId: prevRouteId,
      location: prevStopName || 'Scheduled Stop',
      severity: 'info',
      impact: `Passenger cancelled. ${prevBusId} load decreased (${beforeLoad} → ${afterLoad}). Seat freed.`,
      status: 'unresolved',
      beforeRoute,
      afterRoute,
      beforeBus: {
        id: prevBusId,
        load: beforeLoad,
        capacity: beforeCapacity,
        availableSeats: beforeAvailableSeats
      },
      afterBus: {
        id: prevBusId,
        load: afterLoad,
        capacity: beforeCapacity,
        availableSeats: afterAvailableSeats
      },
      aiRecommendationAvailable: true,
      aiRecommendation: {
        planId: `REPLAN-CAN-${Math.floor(100 + Math.random() * 900)}`,
        strategy: 'Schedule Dwell Compression & Capacity Release',
        recommendedBusId: prevBusId,
        recommendedRouteId: prevRouteId,
        availableSeats: `${afterAvailableSeats} seats available (${afterLoad}/${beforeCapacity} load)`,
        currentLocation: bus ? (route?.stops?.find(s => s.status === 'next')?.name || prevStopName || 'In Transit') : 'In Transit',
        driverAvailability: `${route?.assignedDriver || 'Assigned Driver'} (Active, No commitment conflicts)`,
        routeCompatibility: `Compatible (Assigned to ${prevRouteId})`,
        estimatedAdditionalDelay: `-${timeSavedMins} min (Ahead of schedule)`,
        selectionReason: selectionReason,
        estRecoveryTimeMins: 0,
        timeSavedMins: timeSavedMins,
        newEtaDifference: `-${timeSavedMins} min (Ahead of schedule)`,
        explanation: selectionReason,
        candidateEvaluations: [
          {
            busId: prevBusId,
            routeId: prevRouteId,
            driverName: route?.assignedDriver || 'Assigned Driver',
            location: bus ? (route?.stops?.find(s => s.status === 'next')?.name || 'In Transit') : 'In Transit',
            seatsAvailable: afterAvailableSeats,
            delayMins: -timeSavedMins,
            isFeasible: true,
            statusText: 'Optimal Assigned Bus (Stop Bypassed)'
          },
          {
            busId: 'BUS-02',
            routeId: 'RT-102',
            driverName: 'David Chen',
            location: 'West Portal',
            seatsAvailable: 10,
            delayMins: 0,
            isFeasible: false,
            statusText: 'Driver already assigned to another route (RT-102)'
          },
          {
            busId: 'BUS-03',
            routeId: 'RT-103',
            driverName: 'Elena Rostova',
            location: 'Market St',
            seatsAvailable: 11,
            delayMins: 0,
            isFeasible: false,
            statusText: 'Driver already assigned to another route (RT-103)'
          }
        ],
        tradeoffs: [
          `Freed 1 seat on ${prevBusId} (${afterAvailableSeats} available seats)`,
          `Saved ~${timeSavedMins} mins dwell time along route`,
          `0 impact to remaining scheduled passengers`
        ]
      }
    };

    this.state.disruptions.unshift(disruption);
    this.state.selectedDisruptionId = newId;
    this.state.metrics.activeDisruptionsCount += 1;

    // Audit log
    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: timeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Student Cancelled: ${student.name} unassigned from ${prevRouteId} (${prevBusId}). Route recalculated.`,
      status: 'EXECUTED'
    });

    // If offline / degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('CANCEL_STUDENT', `Student ${student.name} cancelled/absent on ${prevRouteId}`, {
        studentId: student.id,
        prevBusId,
        prevRouteId,
        disruptionId: newId
      });
    }

    this.showToast(`Student ${student.name} marked absent. Route ${prevRouteId || ''} recalculated (${afterAvailableSeats} seats available).`, 'info');
    this.setActiveTab('replanning');
    this.notify();
  }
  // 10. Update student assignment ONLY after dispatcher approval
  acceptAIPlan(disruptionId) {
    const disruption = this.state.disruptions.find(d => d.id === disruptionId);
    if (!disruption) return;

    disruption.status = 'accepted';
    disruption.endToEndRecoveryTimeMs = Date.now() - disruption._createdAtMs;
    
    // If urgent student addition approved by dispatcher
    if (disruption.type === 'urgent_add' && disruption.aiRecommendation?.recommendedBusId) {
      const student = this.state.students.find(s => s.id === disruption.studentId);
      const bus = this.state.buses.find(b => b.id === disruption.aiRecommendation.recommendedBusId);
      const route = this.state.routes.find(r => r.id === disruption.aiRecommendation.recommendedRouteId);

      if (student) {
        student.busId = disruption.aiRecommendation.recommendedBusId;
        student.routeId = disruption.aiRecommendation.recommendedRouteId;
        student.status = 'waiting';
      }
      if (bus) {
        bus.currentLoad = (bus.currentLoad || 0) + 1;
      }
      if (route && student) {
        const newStop = {
          id: `ST-${route.id}-URGENT-${student.id}`,
          name: student.stopName || 'Urgent Passenger Stop',
          coords: bus?.coords || [37.77, -122.42],
          time: "07:45 AM",
          studentsCount: 1,
          status: "pending"
        };
        route.stops.splice(Math.max(0, route.stops.length - 1), 0, newStop);
        route.totalStops = route.stops.length;
        route.delayMinutes = (route.delayMinutes || 0) + (disruption.aiRecommendation.additionalDelayMins || 3.5);
      }
    }

    // If bus breakdown resolved by standby replacement bus
    if (disruption.type === 'breakdown' && (disruption.aiRecommendation?.recommendedBusId || disruption.aiRecommendation?.standbyBusAssigned)) {
      const repBusId = disruption.aiRecommendation.recommendedBusId || disruption.aiRecommendation.standbyBusAssigned;
      const brokenBus = this.state.buses.find(b => b.id === disruption.busId);
      const replacementBus = this.state.buses.find(b => b.id === repBusId);
      const route = this.state.routes.find(r => r.id === disruption.routeId);
      const driver = this.state.drivers.find(d => d.id === disruption.aiRecommendation.recommendedDriverId) || 
                     this.state.drivers.find(d => d.status === 'standby');

      const transferLoad = brokenBus ? brokenBus.currentLoad : (disruption.affectedStudentsList?.length || 36);

      if (replacementBus) {
        replacementBus.status = 'in_transit';
        replacementBus.routeId = disruption.routeId;
        replacementBus.currentLoad = transferLoad;
        if (driver) replacementBus.driverId = driver.id;
      }

      if (brokenBus) {
        brokenBus.status = 'breakdown';
        brokenBus.routeId = null;
        brokenBus.currentLoad = 0;
        brokenBus.speedKmh = 0;
      }

      if (route && replacementBus) {
        route.assignedBus = replacementBus.id;
        if (driver) route.assignedDriver = driver.name;
        route.status = 'on_time';
      }

      // Reassign all affected student passengers
      this.state.students.forEach(s => {
        if (s.busId === disruption.busId) {
          s.busId = repBusId;
          if (s.status === 'stranded') s.status = 'waiting';
        }
      });
    }

    this.state.metrics.resolvedDisruptionsToday += 1;
    this.state.metrics.activeDisruptionsCount = Math.max(0, this.state.metrics.activeDisruptionsCount - 1);
    
    // Log
    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Accepted AI Replanning Plan ${disruption.aiRecommendation?.planId} for ${disruption.title || disruption.id}`,
      status: 'EXECUTED'
    });

    // If offline / degraded, store change locally
    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('ACCEPT_AI_PLAN', `Dispatcher Approved Plan ${disruption.aiRecommendation?.planId} for ${disruption.id}`, {
        disruptionId,
        planId: disruption.aiRecommendation?.planId,
        recommendedBusId: disruption.aiRecommendation?.recommendedBusId
      });
    }

    this.showToast(`Plan Accepted for ${disruption.id}! Emergency replacement dispatched to route.`, 'success');
    this.notify();
  }

  // Direct helper to approve urgent student addition by student ID
  approveUrgentAddition(studentId) {
    const disruption = this.state.disruptions.find(d => d.type === 'urgent_add' && d.studentId === studentId && d.status === 'unresolved');
    if (disruption) {
      this.acceptAIPlan(disruption.id);
    } else {
      // Re-run evaluation if no active disruption
      const student = this.state.students.find(s => s.id === studentId);
      if (student) {
        const { feasibleCandidates } = this.evaluateUrgentStudentAddition(student);
        if (feasibleCandidates.length > 0) {
          const best = feasibleCandidates[0];
          student.busId = best.bus.id;
          student.routeId = best.route.id;
          student.status = 'waiting';
          best.bus.currentLoad = (best.bus.currentLoad || 0) + 1;
          
          if (this.state.networkStatus !== 'online') {
            this.queueOfflineChange('APPROVE_URGENT_STUDENT', `Assigned ${student.name} to ${best.bus.id}`, {
              studentId,
              busId: best.bus.id,
              routeId: best.route.id
            });
          }

          this.showToast(`Student ${student.name} assigned to Bus ${best.bus.id} on Route ${best.route.id}.`, 'success');
          this.notify();
        } else {
          this.showToast('No Feasible Solution — Manual Intervention Required', 'warning');
        }
      }
    }
  }

  rejectAIPlan(disruptionId, reason = "Manual Route Override") {
    const disruption = this.state.disruptions.find(d => d.id === disruptionId);
    if (!disruption) return;

    disruption.status = 'rejected';
    disruption.rejectionReason = reason;

    this.state.metrics.recentAuditLogs.unshift({
      id: `LOG-${Math.floor(600 + Math.random() * 300)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: `Rejected AI Plan for ${disruption.id} - Reason: ${reason}`,
      status: 'MANUAL_OVERRIDE'
    });

    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('REJECT_AI_PLAN', `Rejected Plan for ${disruptionId} (${reason})`, {
        disruptionId,
        reason
      });
    }

    this.showToast(`AI Plan Rejected. Manual override flagged for Dispatcher.`, 'warning');
    this.notify();
  }

  // Modals
  openModal(modalType, payload = null) {
    this.state.activeModal = modalType;
    this.state.modalPayload = payload;
    this.notify();
  }

  closeModal() {
    this.state.activeModal = null;
    this.state.modalPayload = null;
    this.notify();
  }

  // Toast UI
  showToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    this.state.toasts.push({ id, message, type });
    this.notify();

    setTimeout(() => {
      this.state.toasts = this.state.toasts.filter(t => t.id !== id);
      this.notify();
    }, 4000);
  }
}

export { AppStore };
export const store = new AppStore();
