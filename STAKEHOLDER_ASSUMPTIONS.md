# Stakeholder Assumptions for Rapid Replanning System

This document outlines the core assumptions made by the rapid replanning system, categorized by stakeholder roles and specific operational domains. These assumptions directly reflect the current implemented logic and constraints of the system.

## Stakeholder Roles

### Dispatcher
- **Assumption:** The Dispatcher is the ultimate decision-maker for all rapid replanning events.
- **Assumption:** The Dispatcher must manually review and explicitly approve any AI-recommended plan (vehicle swap, urgent student addition, route modification) before it becomes an active assignment. The system will never automatically dispatch a vehicle or assign a driver.
- **Assumption:** The Dispatcher is responsible for manually updating GPS locations when telemetry fails and providing manual intervention when no feasible automated solution is found.

### Operations Manager
- **Assumption:** The Operations Manager uses the system primarily for oversight, evaluating the baseline vs. prototype recovery times, and reviewing historical disruption logs.
- **Assumption:** The Operations Manager relies on factual, deterministic data (capacity, proximity, SLA delays) presented by the system rather than opaque AI confidence percentages.

### Bus Driver
- **Assumption:** Drivers are expected to adhere to their assigned shift times, breaks, and operational statuses (active, sick, standby).
- **Assumption:** If a driver is marked "standby," they are assumed to be located at the Central Depot unless otherwise specified by an active route assignment.

### School Transport Coordinator
- **Assumption:** School Transport Coordinators rely on the system to ensure that special needs requirements (e.g., ADA Wheelchair Lifts) are strictly met before a student is placed on a bus.
- **Assumption:** Coordinators expect that estimated time of arrival (ETA) changes due to route detours will be dynamically calculated and displayed.

## Operational Domains

### Dispatcher Approval
- **Assumption:** The system assumes a human-in-the-loop workflow. All replanning recommendations are placed in a "Pending Approval" state. No state changes to active manifests occur until the Dispatcher clicks "Approve."

### Vehicle Capacity
- **Assumption:** Vehicle capacity is a hard physical constraint. A vehicle is considered unfeasible if `available seats <= 0`. The system will never recommend assigning passengers to an over-capacity vehicle.

### Driver Availability
- **Assumption:** Drivers must be in an "active" or "standby" status to be assigned. Drivers marked as "sick" or "on_break" are strictly rejected by the engine.

### Driver Commitments
- **Assumption:** A driver cannot be double-booked. If a driver is already actively assigned to an ongoing route, they have a commitment conflict and will be rejected for new emergency dispatch unless they are swapped entirely.

### Route Information
- **Assumption:** Route modifications (e.g., urgent additions or cancellations) dynamically impact dwell times and estimated delays. 
- **Assumption:** Route compatibility is enforced; a bus must be serving the destination school (or be unassigned/standby) to be considered feasible for an urgent student addition.

### Location Information
- **Assumption:** Vehicle coordinates are used to calculate proximity to a disruption. If a bus is "in_depot" or standby, its location defaults to the Central Depot coordinates. 
- **Assumption:** The system does not pretend simulated or last-known data is real-time. If a GPS signal is lost, it is explicitly flagged as "No Signal" and uses the last known position until manually updated.

### Network Availability
- **Assumption:** The system can operate in a degraded or offline state. 
- **Assumption:** In the event of a network failure, the dispatcher can continue working locally using the last synchronized data. Operational changes made offline are queued locally and synchronized automatically once network connectivity is restored.

### Manual Intervention
- **Assumption:** If all candidate vehicles fail feasibility checks (due to capacity, driver conflicts, or compatibility), the system explicitly halts automation and outputs: "No Feasible Solution — Manual Intervention Required."

### Safety Constraints
- **Assumption:** Safety and ADA compliance are non-negotiable. If a student requires a wheelchair lift, any vehicle lacking the `wheelchair` amenity flag is strictly rejected.
