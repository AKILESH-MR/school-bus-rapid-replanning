# Core Data Schema Documentation

This document outlines the core domain entities used within the rapid replanning system. All entities are documented based on their exact representation in the current source code (`src/data/mockData.js`).

## Student
Represents a passenger registered in the transport system.
- `id` (String): Unique identifier. Example: `"STU-1001"`
- `name` (String): Full name. Example: `"Lucas Vance"`
- `grade` (String): Student's grade. Example: `"10th Grade"`
- `schoolId` (String): Destination school reference. Example: `"SCH-01"`
- `schoolName` (String): Destination school name. Example: `"Oakridge High"`
- `busId` (String): Currently assigned bus. Example: `"BUS-01"`
- `routeId` (String): Currently assigned route. Example: `"RT-101"`
- `stopName` (String): Designated pickup/dropoff stop. Example: `"Chestnut & Fillmore"`
- `status` (String): Current status. Example: `"boarded"` (others: `waiting`, `absent_cancelled`, `urgent_added`, `stranded`)
- `specialNeeds` (String): Specific requirements. Example: `"Wheelchair Accessibility Required"`

## Vehicle (Bus)
Represents a physical transport asset in the fleet.
- `id` (String): Unique identifier. Example: `"BUS-01"`
- `plate` (String): License plate. Example: `"CA-SCH-8120"`
- `capacity` (Number): Maximum passenger capacity. Example: `54`
- `currentLoad` (Number): Current number of assigned/boarded students. Example: `42`
- `driverId` (String / Null): Currently assigned driver. Example: `"DRV-101"`
- `routeId` (String / Null): Currently assigned route. Example: `"RT-101"`
- `status` (String): Operational status. Example: `"in_transit"` (others: `breakdown`, `in_depot`, `maintenance`)
- `coords` (Array of Numbers): Current [latitude, longitude]. Example: `[37.7710, -122.4280]`
- `gpsStatus` (String): Telemetry state. Example: `"live"` or `"no_signal"`
- `amenities` (Array of Strings): Vehicle features. Example: `["Wheelchair Lift", "GPS Telematics"]`

## Driver
Represents a fleet operator.
- `id` (String): Unique identifier. Example: `"DRV-101"`
- `name` (String): Full name. Example: `"Sarah Jenkins"`
- `status` (String): Current operational state. Example: `"active"` (others: `sick`, `standby`)
- `shiftStart` (String): Shift start time. Example: `"06:30 AM"`
- `shiftEnd` (String): Shift end time. Example: `"03:30 PM"`

## Route
Represents a scheduled manifest of stops connecting students to schools.
- `id` (String): Unique identifier. Example: `"RT-101"`
- `schoolId` (String): Target destination school. Example: `"SCH-01"`
- `assignedBus` (String): Vehicle servicing the route. Example: `"BUS-01"`
- `assignedDriver` (String): Driver servicing the route. Example: `"Sarah Jenkins"`
- `status` (String): Route health. Example: `"on_time"` (others: `delayed`, `disrupted`)
- `delayMinutes` (Number): Current deviation from schedule. Example: `0`
- `stops` (Array of Stop Objects): Ordered array of stops.

## Stop (Embedded in Route)
Represents a physical waypoint on a route.
- `id` (String): Unique identifier. Example: `"ST-101-1"`
- `name` (String): Location name. Example: `"Marina Green & Scott St"`
- `coords` (Array of Numbers): Location [lat, lon]. Example: `[37.8040, -122.4410]`
- `time` (String): Scheduled arrival time. Example: `"07:15 AM"`
- `studentsCount` (Number): Expected passengers. Example: `8`
- `status` (String): Waypoint progress. Example: `"completed"` (others: `next`, `pending`, `stranded`, `stuck`)

## Disruption
Represents a system event requiring rapid replanning.
- `id` (String): Unique identifier. Example: `"DIS-2026-001"`
- `type` (String): Disruption category. Example: `"breakdown"` (others: `urgent_add`, `student_cancel`, `driver_unavailability`)
- `busId` (String / Null): Primary affected bus. Example: `"BUS-04"`
- `routeId` (String / Null): Primary affected route. Example: `"RT-104"`
- `status` (String): Resolution state. Example: `"unresolved"` (others: `replanned`, `accepted`)
- `aiRecommendation` (Object): The structured replanning proposal, containing tradeoffs, ETA differences, and evaluated candidates.

## Assignment (Relational Concept)
*Note: Assignment is not a standalone object, but a relational link established via Foreign Keys.*
- `busId` / `routeId` (on Student)
- `driverId` / `routeId` (on Bus)
- `assignedBus` / `assignedDriver` (on Route)

## Location (Concept)
*Note: Location is explicitly handled via coordinate pairs across entities, rather than a standalone database table.*
- `coords` (Array [lat, lon]): Used on `Bus` and `Stop` to calculate Haversine proximity/distances dynamically during replanning evaluation.

## Commitment (Concept)
*Note: Commitments are validated dynamically at runtime rather than existing as a standalone object.*
- A driver's commitment is derived by checking if they are assigned to an active `Route` or `Bus` and ensuring their `status` is not `sick` or `on_break`.
