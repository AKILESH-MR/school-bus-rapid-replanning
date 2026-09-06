# User Guide: Rapid Replanning Dashboard

Welcome to the School Bus Rapid Replanning System. This guide provides dispatchers with instructions on managing disruptions and utilizing the AI replanning engine.

## 1. System Overview

The system provides real-time tracking of the district's fleet and rapid replanning capabilities for emergency disruptions. The AI engine evaluates constraints (capacity, driver availability, route compatibility) and recommends feasible solutions. 

**Important:** The system is an *assistant*. All recommendations require human review and approval.

## 2. Handling Disruptions

### Student Cancellations
1. Open the **Disruptions Panel**.
2. Select **Record Cancellation**.
3. The system will identify the affected route and remove the student.
4. Review the Before/After impact analysis.
5. Click **Approve & Broadcast** to finalize.

### Urgent Student Additions
1. Open the **Disruptions Panel** and select **Add Urgent Student**.
2. Input the student details.
3. The AI engine will evaluate the fleet and recommend the best feasible bus based on capacity and proximity.
4. Review the recommendation reason and any rejected alternatives.
5. Click **Accept** to apply, or **Reject** to manually assign.

### Vehicle Breakdowns
1. From the map or vehicle list, select a bus and mark it as **Unavailable**.
2. The system automatically identifies all affected students.
3. The engine scans for available replacement buses with sufficient capacity and driver availability.
4. Review the proposed replacement bus.
5. Click **Accept Replacement** to re-route the fleet.

## 3. Dealing with System Outages

- **No GPS Signal:** If a bus loses GPS, it will display a "No Signal" badge and show its last known location. You can manually advance its progress using checkpoints.
- **Network Offline:** If internet connectivity drops, the system displays an "Offline" warning. You can continue working; actions are queued locally and will synchronize automatically when the connection is restored.

## 4. Reports & Testing
Navigate to the **Reports View** to generate summaries or run the built-in **Deterministic Replanning Edge & Failure Test Suite** to verify system integrity at any time.
