// PostgreSQL Database Service Facade
import { PgConnectionManager, getPgConnection } from './connection.js';
import { runMigrations } from './migrator.js';
import { seedDatabase } from './seed.js';
import { BusRepository } from './repositories/busRepository.js';
import { DriverRepository } from './repositories/driverRepository.js';
import { RouteRepository } from './repositories/routeRepository.js';
import { StudentRepository } from './repositories/studentRepository.js';
import { DisruptionRepository } from './repositories/disruptionRepository.js';
import { ReplanRepository } from './repositories/replanRepository.js';
import { ApprovalRepository } from './repositories/approvalRepository.js';
import { GpsRepository } from './repositories/gpsRepository.js';
import { OfflineActionRepository } from './repositories/offlineActionRepository.js';
import { AuditLogRepository } from './repositories/auditLogRepository.js';

export class PgDatabase {
  constructor(connectionManagerOrOptions = {}) {
    if (connectionManagerOrOptions instanceof PgConnectionManager || (connectionManagerOrOptions && typeof connectionManagerOrOptions.query === 'function')) {
      this.connection = connectionManagerOrOptions;
    } else {
      this.connection = new PgConnectionManager(connectionManagerOrOptions);
    }

    this.type = 'postgres';
    this.buses = new BusRepository(this.connection);
    this.drivers = new DriverRepository(this.connection);
    this.routes = new RouteRepository(this.connection);
    this.students = new StudentRepository(this.connection);
    this.disruptions = new DisruptionRepository(this.connection);
    this.replans = new ReplanRepository(this.connection);
    this.approvals = new ApprovalRepository(this.connection);
    this.gpsUpdates = new GpsRepository(this.connection);
    this.offlineActions = new OfflineActionRepository(this.connection);
    this.auditLogs = new AuditLogRepository(this.connection);
  }

  async init(options = { runMigrations: true, seedData: true }) {
    if (options.runMigrations !== false) {
      await runMigrations(this.connection);
    }
    if (options.seedData !== false) {
      await seedDatabase(this.connection);
    }
  }

  // --- Buses ---
  async getBuses() {
    return this.buses.getAll();
  }

  async getBusById(id) {
    return this.buses.getById(id);
  }

  async saveBus(bus) {
    return this.buses.upsert(bus);
  }

  // --- Drivers ---
  async getDrivers() {
    return this.drivers.getAll();
  }

  async getDriverById(id) {
    return this.drivers.getById(id);
  }

  async saveDriver(driver) {
    return this.drivers.upsert(driver);
  }

  // --- Routes ---
  async getRoutes() {
    return this.routes.getAll();
  }

  async getRouteById(id) {
    return this.routes.getById(id);
  }

  async saveRoute(route) {
    return this.routes.upsert(route);
  }

  // --- Students ---
  async getStudents() {
    return this.students.getAll();
  }

  async getStudentById(id) {
    return this.students.getById(id);
  }

  async saveStudent(student) {
    return this.students.upsert(student);
  }

  // --- Disruptions ---
  async getDisruptions() {
    return this.disruptions.getAll();
  }

  async getDisruptionById(id) {
    return this.disruptions.getById(id);
  }

  async saveDisruption(disruption) {
    return this.disruptions.upsert(disruption);
  }

  // --- Replans ---
  async getReplans() {
    return this.replans.getAll();
  }

  async getReplanById(id) {
    return this.replans.getById(id);
  }

  async saveReplan(replan) {
    return this.replans.upsert(replan);
  }

  // --- Approvals ---
  async saveApproval(approval) {
    return this.approvals.recordApproval(approval);
  }

  async getApprovals() {
    return this.approvals.getAll();
  }

  async getApprovalsByReplanId(replanId) {
    return this.approvals.getByReplanId(replanId);
  }

  // --- GPS Updates ---
  async recordGpsUpdate(update) {
    return this.gpsUpdates.recordUpdate(update);
  }

  async getGpsUpdatesForBus(busId, limit = 20) {
    return this.gpsUpdates.getRecentForBus(busId, limit);
  }

  // --- Offline Actions (Idempotency) ---
  async isActionSynced(actionId) {
    return this.offlineActions.isActionSynced(actionId);
  }

  async recordSyncedAction(action, result = {}) {
    return this.offlineActions.recordSyncedAction(action, result);
  }

  // --- Audit Logs (Append-Only) ---
  async getAuditLogs() {
    return this.auditLogs.getAll();
  }

  async saveAuditLog(log) {
    return this.auditLogs.record(log);
  }

  async close() {
    return this.connection.close();
  }
}
