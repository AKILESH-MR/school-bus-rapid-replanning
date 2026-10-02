// Realistic Mock Data for School Bus Rapid Replanning & Responsible AI System

export const SCHOOLS = [
  {
    id: "SCH-01",
    name: "Oakridge High School",
    type: "High School",
    address: "850 Oakridge Blvd",
    coords: [37.7749, -122.4194],
    bellTime: "08:15 AM",
    totalStudents: 320
  },
  {
    id: "SCH-02",
    name: "Lincoln Middle School",
    type: "Middle School",
    address: "410 Lincoln Way",
    coords: [37.7610, -122.4470],
    bellTime: "08:30 AM",
    totalStudents: 245
  },
  {
    id: "SCH-03",
    name: "West Valley Elementary",
    type: "Elementary",
    address: "1220 West Valley Rd",
    coords: [37.7830, -122.4080],
    bellTime: "08:45 AM",
    totalStudents: 180
  }
];

export const DEPOT = {
  id: "DEPOT-CENTRAL",
  name: "District Central Bus Depot & Maintenance",
  address: "2000 Transit Way",
  coords: [37.7550, -122.4050],
  standbyBusesCount: 4,
  onDutyMechanics: 3
};

export const DRIVERS = [
  {
    id: "DRV-101",
    driverId: "DRV-101",
    name: "Sarah Jenkins",
    phone: "(555) 234-8901",
    license: "CDL-Class-B-Exp2028",
    rating: 4.9,
    experienceYrs: 8,
    status: "active", // active, on_break, sick, standby
    availabilityStatus: "active",
    currentAssignment: "RT-101",
    currentLocation: [37.7710, -122.4280], // Alamo Square vicinity
    locationSource: "mobile_gps", // mobile_gps, depot_checkin, manual, telematics, last_known
    lastUpdated: "2026-09-29T08:04:12Z",
    isLocationStale: false,
    shiftStart: "06:30 AM",
    shiftEnd: "03:30 PM",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-102",
    driverId: "DRV-102",
    name: "Michael Torres",
    phone: "(555) 345-9012",
    license: "CDL-Class-B-Exp2027",
    rating: 4.7,
    experienceYrs: 5,
    status: "sick", // Disruption: Absent
    availabilityStatus: "sick",
    currentAssignment: null,
    currentLocation: [37.7600, -122.4400],
    locationSource: "last_known",
    lastUpdated: "2026-09-28T18:00:00Z",
    isLocationStale: true,
    shiftStart: "06:45 AM",
    shiftEnd: "03:45 PM",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-103",
    driverId: "DRV-103",
    name: "David Chen",
    phone: "(555) 456-0123",
    license: "CDL-Class-B-Exp2029",
    rating: 5.0,
    experienceYrs: 12,
    status: "active",
    availabilityStatus: "active",
    currentAssignment: "RT-102",
    currentLocation: [37.7650, -122.4380],
    locationSource: "mobile_gps",
    lastUpdated: "2026-09-29T08:04:10Z",
    isLocationStale: false,
    shiftStart: "06:30 AM",
    shiftEnd: "03:30 PM",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-104",
    driverId: "DRV-104",
    name: "Elena Rostova",
    phone: "(555) 567-1234",
    license: "CDL-Class-B-Exp2026",
    rating: 4.8,
    experienceYrs: 6,
    status: "active",
    availabilityStatus: "active",
    currentAssignment: "RT-103",
    currentLocation: [37.7800, -122.4150],
    locationSource: "mobile_gps",
    lastUpdated: "2026-09-29T08:03:55Z",
    isLocationStale: false,
    shiftStart: "07:00 AM",
    shiftEnd: "04:00 PM",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-105",
    driverId: "DRV-105",
    name: "James Wilson",
    phone: "(555) 678-2345",
    license: "CDL-Class-B-Exp2028",
    rating: 4.9,
    experienceYrs: 9,
    status: "active",
    availabilityStatus: "active",
    currentAssignment: "RT-104",
    currentLocation: [37.7680, -122.4550], // Stalled bus location
    locationSource: "mobile_gps",
    lastUpdated: "2026-09-29T07:44:00Z",
    isLocationStale: false,
    shiftStart: "06:15 AM",
    shiftEnd: "03:15 PM",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-106",
    driverId: "DRV-106",
    name: "Amina Al-Mansoor",
    phone: "(555) 789-3456",
    license: "CDL-Class-B-Exp2029",
    rating: 4.9,
    experienceYrs: 7,
    status: "standby", // Available reserve driver at depot
    availabilityStatus: "standby",
    currentAssignment: null,
    currentLocation: [37.7550, -122.4050], // Depot staging
    locationSource: "depot_checkin",
    lastUpdated: "2026-09-29T08:00:00Z",
    isLocationStale: false,
    shiftStart: "07:00 AM",
    shiftEnd: "03:30 PM",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "DRV-107",
    driverId: "DRV-107",
    name: "Robert MacIntyre",
    phone: "(555) 890-4567",
    license: "CDL-Class-B-Exp2027",
    rating: 4.6,
    experienceYrs: 4,
    status: "standby",
    availabilityStatus: "standby",
    currentAssignment: null,
    currentLocation: [37.7550, -122.4050], // Depot staging
    locationSource: "depot_checkin",
    lastUpdated: "2026-09-29T08:00:00Z",
    isLocationStale: false,
    shiftStart: "07:00 AM",
    shiftEnd: "03:30 PM",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

export const BUSES = [
  {
    id: "BUS-01",
    plate: "CA-SCH-8120",
    model: "Blue Bird All American HD",
    type: "Electric Zero-Emission",
    capacity: 54,
    currentLoad: 42,
    driverId: "DRV-101",
    routeId: "RT-101",
    status: "in_transit", // in_transit, delayed, breakdown, in_depot, maintenance
    fuelLevel: 88, // % Battery
    speedKmh: 34,
    coords: [37.7710, -122.4280],
    heading: 45,
    gpsStatus: "live", // live, no_signal, lost, manual
    lastGpsSync: "08:04:12 AM (Live Telematics Lock)",
    lastKnownLocation: "Alamo Square (Fulton & Steiner)",
    isManualLocation: false,
    lastInspection: "2026-09-01",
    healthScore: 98,
    amenities: ["Wheelchair Lift", "GPS Telematics", "AI Camera", "Air Conditioning"]
  },
  {
    id: "BUS-02",
    plate: "CA-SCH-8121",
    model: "Thomas Built Saf-T-Liner C2",
    type: "Clean Diesel",
    capacity: 48,
    currentLoad: 38,
    driverId: "DRV-103",
    routeId: "RT-102",
    status: "in_transit",
    fuelLevel: 74,
    speedKmh: 28,
    coords: [37.7650, -122.4380],
    heading: 120,
    gpsStatus: "live",
    lastGpsSync: "08:04:10 AM (Live Telematics Lock)",
    lastKnownLocation: "West Portal Station",
    isManualLocation: false,
    lastInspection: "2026-08-28",
    healthScore: 94,
    amenities: ["Wheelchair Lift", "GPS Telematics", "AI Camera", "First Aid Kit"]
  },
  {
    id: "BUS-03",
    plate: "CA-SCH-8122",
    model: "Lion Electric LionC",
    type: "Electric Zero-Emission",
    capacity: 60,
    currentLoad: 49,
    driverId: "DRV-104",
    routeId: "RT-103",
    status: "delayed", // Traffic delay +12 mins
    delayMinutes: 12,
    delayReason: "Construction bottleneck on Market St",
    fuelLevel: 62,
    speedKmh: 14,
    coords: [37.7800, -122.4150],
    heading: 90,
    gpsStatus: "live",
    lastGpsSync: "08:03:55 AM (Live Telematics Lock)",
    lastKnownLocation: "Civic Center (Grove & Larkin)",
    isManualLocation: false,
    lastInspection: "2026-09-02",
    healthScore: 92,
    amenities: ["Wheelchair Lift", "GPS Telematics", "AI Camera", "Seatbelts"]
  },
  {
    id: "BUS-04",
    plate: "CA-SCH-8123",
    model: "Blue Bird Vision",
    type: "Clean Diesel",
    capacity: 54,
    currentLoad: 36,
    driverId: "DRV-105",
    routeId: "RT-104",
    status: "breakdown", // Active Breakdown Disruption!
    fuelLevel: 45,
    speedKmh: 0,
    coords: [37.7680, -122.4550],
    heading: 0,
    gpsStatus: "no_signal", // GPS Lost upon vehicle stall
    lastGpsSync: "07:44:00 AM (Signal Lost upon Electrical Fault)",
    lastKnownLocation: "Cole & Haight St (Breakdown Site)",
    isManualLocation: false,
    lastInspection: "2026-08-15",
    healthScore: 42,
    breakdownNote: "Coolant temperature spike & engine shutdown alert at Stop 3 (Cole & Haight). GPS telematics offline.",
    amenities: ["GPS Telematics", "AI Camera"]
  },
  {
    id: "BUS-05",
    plate: "CA-SCH-8124",
    model: "Thomas Built Saf-T-Liner EFX",
    type: "Clean Diesel",
    capacity: 54,
    currentLoad: 0,
    driverId: "DRV-106",
    routeId: null,
    status: "in_depot", // Standby ready for rapid replanning
    fuelLevel: 100,
    speedKmh: 0,
    coords: [37.7550, -122.4050],
    heading: 0,
    gpsStatus: "live",
    lastGpsSync: "08:04:00 AM (Depot WiFi Telematics)",
    lastKnownLocation: "Central Depot (Standby Bay 1)",
    isManualLocation: false,
    lastInspection: "2026-09-04",
    healthScore: 100,
    amenities: ["Wheelchair Lift", "GPS Telematics", "AI Camera"]
  },
  {
    id: "BUS-06",
    plate: "CA-SCH-8125",
    model: "Lion Electric LionC",
    type: "Electric Zero-Emission",
    capacity: 60,
    currentLoad: 0,
    driverId: "DRV-107",
    routeId: null,
    status: "in_depot", // Standby ready
    fuelLevel: 95,
    speedKmh: 0,
    coords: [37.7555, -122.4060],
    heading: 0,
    gpsStatus: "live",
    lastGpsSync: "08:04:00 AM (Depot WiFi Telematics)",
    lastKnownLocation: "Central Depot (Standby Bay 2)",
    isManualLocation: false,
    lastInspection: "2026-09-03",
    healthScore: 99,
    amenities: ["Wheelchair Lift", "GPS Telematics", "AI Camera"]
  },
  {
    id: "BUS-07",
    plate: "CA-SCH-8126",
    model: "IC Bus CE Series",
    type: "Propane Autogas",
    capacity: 48,
    currentLoad: 0,
    driverId: null,
    routeId: null,
    status: "in_depot",
    fuelLevel: 90,
    speedKmh: 0,
    coords: [37.7545, -122.4045],
    heading: 0,
    gpsStatus: "no_signal",
    lastGpsSync: "07:15:00 AM (Transponder Powered Down)",
    lastKnownLocation: "Central Depot (Standby Bay 3)",
    isManualLocation: false,
    lastInspection: "2026-09-01",
    healthScore: 96,
    amenities: ["GPS Telematics"]
  },
  {
    id: "BUS-08",
    plate: "CA-SCH-8127",
    model: "Micro Bird G5",
    type: "Special Needs Shuttle",
    capacity: 24,
    currentLoad: 0,
    driverId: null,
    routeId: null,
    status: "maintenance",
    fuelLevel: 50,
    speedKmh: 0,
    coords: [37.7540, -122.4040],
    heading: 0,
    gpsStatus: "no_signal",
    lastGpsSync: "Yesterday 04:30 PM (Maintenance Mode)",
    lastKnownLocation: "Central Depot Bay 4 (Service Bay)",
    isManualLocation: false,
    lastInspection: "2026-08-10",
    healthScore: 65,
    amenities: ["Dual Hydraulic Wheelchair Lift", "Medical Oxygen Storage"]
  }
];

export const ROUTES = [
  {
    id: "RT-101",
    name: "Route 101 - Oakridge Northern Run",
    schoolId: "SCH-01",
    schoolName: "Oakridge High School",
    assignedBus: "BUS-01",
    assignedDriver: "Sarah Jenkins",
    status: "on_time",
    totalStops: 6,
    completedStops: 3,
    scheduledStartTime: "07:15 AM",
    scheduledArrivalTime: "08:05 AM",
    currentEta: "08:04 AM",
    delayMinutes: 0,
    color: "#2563EB",
    stops: [
      { id: "ST-101-1", name: "Marina Green & Scott St", coords: [37.8040, -122.4410], time: "07:15 AM", studentsCount: 8, status: "completed" },
      { id: "ST-101-2", name: "Chestnut & Fillmore", coords: [37.8000, -122.4340], time: "07:25 AM", studentsCount: 12, status: "completed" },
      { id: "ST-101-3", name: "Pacific Heights (Broadway & Webster)", coords: [37.7930, -122.4310], time: "07:38 AM", studentsCount: 14, status: "completed" },
      { id: "ST-101-4", name: "Japantown Plaza (Post & Buchanan)", coords: [37.7860, -122.4300], time: "07:48 AM", studentsCount: 8, status: "next" },
      { id: "ST-101-5", name: "Alamo Square (Fulton & Steiner)", coords: [37.7770, -122.4320], time: "07:56 AM", studentsCount: 6, status: "pending" },
      { id: "ST-101-6", name: "Oakridge High School Dropoff", coords: [37.7749, -122.4194], time: "08:05 AM", studentsCount: 0, status: "destination" }
    ]
  },
  {
    id: "RT-102",
    name: "Route 102 - Lincoln Sunset Run",
    schoolId: "SCH-02",
    schoolName: "Lincoln Middle School",
    assignedBus: "BUS-02",
    assignedDriver: "David Chen",
    status: "on_time",
    totalStops: 5,
    completedStops: 2,
    scheduledStartTime: "07:30 AM",
    scheduledArrivalTime: "08:20 AM",
    currentEta: "08:21 AM",
    delayMinutes: 1,
    color: "#059669",
    stops: [
      { id: "ST-102-1", name: "Sunset Blvd & Pacheco", coords: [37.7500, -122.4950], time: "07:30 AM", studentsCount: 9, status: "completed" },
      { id: "ST-102-2", name: "Taraval & 28th Ave", coords: [37.7420, -122.4850], time: "07:42 AM", studentsCount: 11, status: "completed" },
      { id: "ST-102-3", name: "West Portal Station", coords: [37.7400, -122.4660], time: "07:54 AM", studentsCount: 10, status: "next" },
      { id: "ST-102-4", name: "Forest Hill Concourse", coords: [37.7480, -122.4580], time: "08:06 AM", studentsCount: 8, status: "pending" },
      { id: "ST-102-5", name: "Lincoln Middle School", coords: [37.7610, -122.4470], time: "08:20 AM", studentsCount: 0, status: "destination" }
    ]
  },
  {
    id: "RT-103",
    name: "Route 103 - West Valley Downtown Loop",
    schoolId: "SCH-03",
    schoolName: "West Valley Elementary",
    assignedBus: "BUS-03",
    assignedDriver: "Elena Rostova",
    status: "delayed",
    totalStops: 5,
    completedStops: 2,
    scheduledStartTime: "07:40 AM",
    scheduledArrivalTime: "08:35 AM",
    currentEta: "08:47 AM",
    delayMinutes: 12,
    color: "#D97706",
    stops: [
      { id: "ST-103-1", name: "SOMA Central (4th & Howard)", coords: [37.7820, -122.4020], time: "07:40 AM", studentsCount: 14, status: "completed" },
      { id: "ST-103-2", name: "Market & 7th Transit Plaza", coords: [37.7790, -122.4120], time: "07:52 AM", studentsCount: 12, status: "completed" },
      { id: "ST-103-3", name: "Civic Center (Grove & Larkin)", coords: [37.7780, -122.4170], time: "08:08 AM", studentsCount: 10, status: "delayed" },
      { id: "ST-103-4", name: "Hayes Valley Park (Octavia)", coords: [37.7760, -122.4240], time: "08:22 AM", studentsCount: 13, status: "pending" },
      { id: "ST-103-5", name: "West Valley Elementary Dropoff", coords: [37.7830, -122.4080], time: "08:35 AM", studentsCount: 0, status: "destination" }
    ]
  },
  {
    id: "RT-104",
    name: "Route 104 - Oakridge Mission & Haight Run",
    schoolId: "SCH-01",
    schoolName: "Oakridge High School",
    assignedBus: "BUS-04",
    assignedDriver: "James Wilson",
    status: "disrupted", // Engine breakdown!
    totalStops: 5,
    completedStops: 2,
    scheduledStartTime: "07:20 AM",
    scheduledArrivalTime: "08:10 AM",
    currentEta: "BROKEN DOWN",
    delayMinutes: 35,
    color: "#DC2626",
    stops: [
      { id: "ST-104-1", name: "Mission & 24th St BART", coords: [37.7520, -122.4180], time: "07:20 AM", studentsCount: 12, status: "completed" },
      { id: "ST-104-2", name: "Dolores Park (18th & Church)", coords: [37.7600, -122.4280], time: "07:32 AM", studentsCount: 14, status: "completed" },
      { id: "ST-104-3", name: "Cole & Haight St (BREAKDOWN SITE)", coords: [37.7680, -122.4550], time: "07:45 AM", studentsCount: 10, status: "stuck" },
      { id: "ST-104-4", name: "Corona Heights (Roosevelt Way)", coords: [37.7640, -122.4410], time: "07:58 AM", studentsCount: 7, status: "stranded" },
      { id: "ST-104-5", name: "Oakridge High School Dropoff", coords: [37.7749, -122.4194], time: "08:10 AM", studentsCount: 0, status: "destination" }
    ]
  }
];

export const STUDENTS = [
  {
    id: "STU-1001",
    name: "Lucas Vance",
    grade: "10th Grade",
    schoolId: "SCH-01",
    schoolName: "Oakridge High",
    busId: "BUS-01",
    routeId: "RT-101",
    stopName: "Chestnut & Fillmore",
    guardianName: "Marcus Vance",
    guardianPhone: "(555) 301-4455",
    status: "boarded", // boarded, waiting, absent_cancelled, urgent_added, stranded
    specialNeeds: "None",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1002",
    name: "Maya Lin",
    grade: "11th Grade",
    schoolId: "SCH-01",
    schoolName: "Oakridge High",
    busId: "BUS-01",
    routeId: "RT-101",
    stopName: "Japantown Plaza",
    guardianName: "Grace Lin",
    guardianPhone: "(555) 412-9900",
    status: "absent_cancelled", // Disruption: Last-minute cancellation!
    specialNeeds: "None",
    cancelReason: "Parent notified fever via app at 07:12 AM",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1003",
    name: "Noah Davies",
    grade: "7th Grade",
    schoolId: "SCH-02",
    schoolName: "Lincoln Middle",
    busId: "UNASSIGNED",
    routeId: "UNASSIGNED",
    stopName: "Forest Hill Concourse",
    guardianName: "Claire Davies",
    guardianPhone: "(555) 774-8833",
    status: "urgent_added", // Disruption: Urgent student addition!
    specialNeeds: "Wheelchair Accessibility Required",
    urgentAddNote: "Parent emergency, transferred from private transport at 07:18 AM",
    photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1004",
    name: "Sophia Martinez",
    grade: "10th Grade",
    schoolId: "SCH-01",
    schoolName: "Oakridge High",
    busId: "BUS-04",
    routeId: "RT-104",
    stopName: "Cole & Haight St",
    guardianName: "Carlos Martinez",
    guardianPhone: "(555) 902-1234",
    status: "stranded", // Stranded on broken down bus
    specialNeeds: "Asthma Inhaler in bag",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1005",
    name: "Liam O'Connor",
    grade: "12th Grade",
    schoolId: "SCH-01",
    schoolName: "Oakridge High",
    busId: "BUS-04",
    routeId: "RT-104",
    stopName: "Cole & Haight St",
    guardianName: "Brenda O'Connor",
    guardianPhone: "(555) 654-7890",
    status: "stranded",
    specialNeeds: "None",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1006",
    name: "Aiden Kim",
    grade: "3rd Grade",
    schoolId: "SCH-03",
    schoolName: "West Valley Elem",
    busId: "BUS-03",
    routeId: "RT-103",
    stopName: "Hayes Valley Park",
    guardianName: "Hannah Kim",
    guardianPhone: "(555) 321-6549",
    status: "waiting",
    specialNeeds: "Nut Allergy",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1007",
    name: "Emma Watson-Brown",
    grade: "8th Grade",
    schoolId: "SCH-02",
    schoolName: "Lincoln Middle",
    busId: "BUS-02",
    routeId: "RT-102",
    stopName: "Taraval & 28th Ave",
    guardianName: "Paul Brown",
    guardianPhone: "(555) 888-2341",
    status: "boarded",
    specialNeeds: "None",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-1008",
    name: "Elijah Washington",
    grade: "9th Grade",
    schoolId: "SCH-01",
    schoolName: "Oakridge High",
    busId: "BUS-04",
    routeId: "RT-104",
    stopName: "Corona Heights",
    guardianName: "Tasha Washington",
    guardianPhone: "(555) 441-2299",
    status: "waiting", // Waiting at next stop for delayed/broken bus
    specialNeeds: "None",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
  }
];

export const DISRUPTIONS = [
  {
    id: "DIS-2026-001",
    type: "breakdown", // breakdown, driver_unavailability, student_cancel, urgent_add, traffic_hazard
    title: "Critical Engine Overheat & Breakdown",
    busId: "BUS-04",
    routeId: "RT-104",
    severity: "critical", // critical (red), warning (amber), info (blue)
    reportedAt: "07:44 AM",
    location: "Cole & Haight St",
    impact: "36 students stranded on vehicle, 7 students waiting at Corona Heights",
    status: "unresolved", // unresolved, replanned, accepted, rejected, completed
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: "REC-AI-901",
      strategy: "Instant Depot Reserve Dispatch & Reroute",
      recommendedBusId: "BUS-05",
      recommendedRouteId: "RT-104",
      availableSeats: "54 seats available (0 current load)",
      currentLocation: "Central Depot (Standby Bay 1)",
      driverAvailability: "Amina Al-Mansoor (Available - Standby, No commitment conflicts)",
      routeCompatibility: "Compatible (Serves Oakridge High School, ADA Lift Verified, 54 capacity >= 43 required)",
      estimatedAdditionalDelay: "+6 min (Arrives before 08:16 AM)",
      selectionReason: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      standbyBusAssigned: "BUS-05",
      reserveDriverAssigned: "DRV-106 (Amina Al-Mansoor)",
      estRecoveryTimeMins: 7.5,
      newEtaDifference: "+6 min",
      explanation: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      candidateEvaluations: [
        {
          busId: "BUS-05",
          model: "Thomas Built Saf-T-Liner EFX",
          routeId: "Depot Standby",
          driverName: "Amina Al-Mansoor",
          location: "Central Depot",
          seatsAvailable: 54,
          delayMins: 6,
          isFeasible: true,
          statusText: "Feasible Candidate (Recommended)"
        },
        {
          busId: "BUS-06",
          model: "Lion Electric LionC",
          routeId: "Depot Standby",
          driverName: "Robert MacIntyre",
          location: "Central Depot",
          seatsAvailable: 60,
          delayMins: 7,
          isFeasible: true,
          statusText: "Feasible Standby Candidate"
        },
        {
          busId: "BUS-01",
          model: "Blue Bird All American HD",
          routeId: "RT-101",
          driverName: "Sarah Jenkins",
          location: "Japantown Plaza",
          seatsAvailable: 12,
          delayMins: 14,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-101); Insufficient capacity (12 seats < 43 needed)"
        },
        {
          busId: "BUS-02",
          model: "Thomas Built Saf-T-Liner C2",
          routeId: "RT-102",
          driverName: "David Chen",
          location: "West Portal",
          seatsAvailable: 10,
          delayMins: 16,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-102); Insufficient capacity (10 seats < 43 needed)"
        },
        {
          busId: "BUS-03",
          model: "Lion Electric LionC",
          routeId: "RT-103",
          driverName: "Elena Rostova",
          location: "Market St",
          seatsAvailable: 11,
          delayMins: 18,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-103); Vehicle delayed in traffic"
        },
        {
          busId: "BUS-04",
          model: "Blue Bird Vision",
          routeId: "RT-104",
          driverName: "James Wilson",
          location: "Cole & Haight St",
          seatsAvailable: 0,
          delayMins: 0,
          isFeasible: false,
          statusText: "Vehicle unavailable (breakdown); Driver unavailable (managing scene)"
        },
        {
          busId: "BUS-07",
          model: "IC Bus CE Series",
          routeId: "Depot Standby",
          driverName: "Unassigned",
          location: "Central Depot",
          seatsAvailable: 48,
          delayMins: 0,
          isFeasible: false,
          statusText: "Driver unavailable"
        },
        {
          busId: "BUS-08",
          model: "Micro Bird G5",
          routeId: "Maintenance Bay",
          driverName: "Unassigned",
          location: "Central Depot Bay 4",
          seatsAvailable: 24,
          delayMins: 0,
          isFeasible: false,
          statusText: "Vehicle unavailable (maintenance); Driver unavailable"
        }
      ],
      tradeoffs: [
        "Dispatches reserve standby BUS-05 from Central Depot (54 capacity >= 43 required)",
        "Transfers all 36 on-board and 7 waiting passengers with zero missed stops",
        "Arrival time 08:16 AM within district SLA grace window"
      ]
    }
  },
  {
    id: "DIS-2026-002",
    type: "driver_unavailability",
    title: "Driver Sickness Absence (Michael Torres)",
    busId: "BUS-02",
    routeId: "RT-102",
    severity: "warning",
    reportedAt: "06:40 AM",
    location: "Pre-Shift Check In",
    impact: "Route 102 (Lincoln Sunset Run) required replacement driver assignment",
    status: "replanned",
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: "REC-AI-902",
      strategy: "Assign Qualified Standby Driver",
      recommendedBusId: "BUS-02",
      recommendedRouteId: "RT-102",
      availableSeats: "10 seats available (38/48 load)",
      currentLocation: "West Portal Station",
      driverAvailability: "David Chen (Available - Standby roster, No commitment conflicts)",
      routeCompatibility: "Compatible (Assigned to Route 102 - Lincoln Sunset Run)",
      estimatedAdditionalDelay: "+1 min (On schedule)",
      selectionReason: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      standbyBusAssigned: null,
      reserveDriverAssigned: "DRV-103 (David Chen)",
      estRecoveryTimeMins: 3.2,
      newEtaDifference: "+1 min",
      explanation: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      candidateEvaluations: [
        {
          busId: "BUS-02",
          model: "Thomas Built Saf-T-Liner C2",
          routeId: "RT-102",
          driverName: "David Chen",
          location: "West Portal Station",
          seatsAvailable: 10,
          delayMins: 1,
          isFeasible: true,
          statusText: "Feasible Candidate (Recommended)"
        },
        {
          busId: "BUS-01",
          model: "Blue Bird All American HD",
          routeId: "RT-101",
          driverName: "Sarah Jenkins",
          location: "Japantown",
          seatsAvailable: 12,
          delayMins: 12,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-101)"
        },
        {
          busId: "BUS-03",
          model: "Lion Electric LionC",
          routeId: "RT-103",
          driverName: "Elena Rostova",
          location: "Market St",
          seatsAvailable: 11,
          delayMins: 15,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-103)"
        },
        {
          busId: "BUS-04",
          model: "Blue Bird Vision",
          routeId: "RT-104",
          driverName: "James Wilson",
          location: "Cole & Haight",
          seatsAvailable: 18,
          delayMins: 0,
          isFeasible: false,
          statusText: "Driver unavailable (Medical / Sickness absence)"
        }
      ],
      tradeoffs: [
        "Assigned standby driver David Chen with zero commitment conflict",
        "Route 102 departs on schedule with +1 min estimated arrival variance"
      ]
    }
  },
  {
    id: "DIS-2026-003",
    type: "urgent_add",
    title: "Urgent Student Addition: Noah Davies (Wheelchair Accessible Req.)",
    busId: null,
    routeId: null,
    severity: "warning",
    reportedAt: "07:18 AM",
    location: "Forest Hill Concourse",
    impact: "1 student requires urgent pickup with ADA compliant lift for Lincoln Middle School",
    status: "unresolved",
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: "REC-AI-903",
      strategy: "Dynamic Insertion into Route 102",
      recommendedBusId: "BUS-02",
      recommendedRouteId: "RT-102",
      availableSeats: "10 seats available (38/48 load)",
      currentLocation: "West Portal Station (0.8 miles from pickup)",
      driverAvailability: "David Chen (Available - Active, No commitment conflicts)",
      routeCompatibility: "Compatible (Serves Lincoln Middle School, ADA Lift Verified)",
      estimatedAdditionalDelay: "+2 min (Arrives before 08:22 AM)",
      selectionReason: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      suggestedRouteId: "RT-102",
      suggestedBusId: "BUS-02",
      estRecoveryTimeMins: 4.0,
      newEtaDifference: "+2 min",
      explanation: "Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",
      candidateEvaluations: [
        {
          busId: "BUS-02",
          model: "Thomas Built Saf-T-Liner C2",
          routeId: "RT-102",
          driverName: "David Chen",
          location: "West Portal Station",
          seatsAvailable: 10,
          delayMins: 2,
          isFeasible: true,
          statusText: "Feasible Candidate (Recommended)"
        },
        {
          busId: "BUS-01",
          model: "Blue Bird All American HD",
          routeId: "RT-101",
          driverName: "Sarah Jenkins",
          location: "Japantown",
          seatsAvailable: 12,
          delayMins: 18,
          isFeasible: false,
          statusText: "Route RT-101 serves Oakridge High, incompatible with destination (Lincoln Middle)"
        },
        {
          busId: "BUS-03",
          model: "Lion Electric LionC",
          routeId: "RT-103",
          driverName: "Elena Rostova",
          location: "Market St",
          seatsAvailable: 11,
          delayMins: 22,
          isFeasible: false,
          statusText: "Route RT-103 serves West Valley Elementary, incompatible with destination (Lincoln Middle)"
        },
        {
          busId: "BUS-04",
          model: "Blue Bird Vision",
          routeId: "RT-104",
          driverName: "James Wilson",
          location: "Cole & Haight",
          seatsAvailable: 0,
          delayMins: 0,
          isFeasible: false,
          statusText: "Vehicle unavailable (breakdown); Driver unavailable"
        },
        {
          busId: "BUS-07",
          model: "IC Bus CE Series",
          routeId: "Depot Standby",
          driverName: "Unassigned",
          location: "Central Depot",
          seatsAvailable: 48,
          delayMins: 0,
          isFeasible: false,
          statusText: "Driver unavailable; Bus has no active route assigned"
        }
      ],
      tradeoffs: [
        "Inserts Forest Hill Concourse stop into Route 102",
        "Estimated arrival +2 min variance (well before school bell)",
        "Preserves 9 seats for remaining scheduled pickups"
      ]
    }
  },
  {
    id: "DIS-2026-004",
    type: "student_cancel",
    title: "Last-Minute Cancellation: Maya Lin",
    busId: "BUS-01",
    routeId: "RT-101",
    severity: "info",
    reportedAt: "07:12 AM",
    location: "Japantown Plaza",
    impact: "Parent reported sickness; 1 stop skipped to save 3.5 minutes travel time",
    status: "accepted",
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: "REC-AI-904",
      strategy: "Route Optimization & Stop Bypass",
      recommendedBusId: "BUS-01",
      recommendedRouteId: "RT-101",
      availableSeats: "13 seats available (41/54 load, +1 seat freed)",
      currentLocation: "Pacific Heights (Broadway & Webster)",
      driverAvailability: "Sarah Jenkins (Available - Active, No commitment conflicts)",
      routeCompatibility: "Compatible (Assigned to Route 101 - Oakridge Northern Run)",
      estimatedAdditionalDelay: "-3.5 min (Ahead of schedule)",
      selectionReason: "Selected because the bus is already assigned to the route, has increased available capacity (13 seats), and saves 3.5 minutes by bypassing the stop.",
      estRecoveryTimeMins: 1.0,
      newEtaDifference: "-3.5 min (Faster)",
      explanation: "Selected because the bus is already assigned to the route, has increased available capacity (13 seats), and saves 3.5 minutes by bypassing the stop.",
      candidateEvaluations: [
        {
          busId: "BUS-01",
          model: "Blue Bird All American HD",
          routeId: "RT-101",
          driverName: "Sarah Jenkins",
          location: "Pacific Heights",
          seatsAvailable: 13,
          delayMins: -3.5,
          isFeasible: true,
          statusText: "Optimal Assigned Bus (Stop Bypassed)"
        },
        {
          busId: "BUS-02",
          model: "Thomas Built Saf-T-Liner C2",
          routeId: "RT-102",
          driverName: "David Chen",
          location: "West Portal",
          seatsAvailable: 10,
          delayMins: 0,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-102)"
        },
        {
          busId: "BUS-03",
          model: "Lion Electric LionC",
          routeId: "RT-103",
          driverName: "Elena Rostova",
          location: "Market St",
          seatsAvailable: 11,
          delayMins: 0,
          isFeasible: false,
          statusText: "Driver already assigned to another route (RT-103)"
        }
      ],
      tradeoffs: [
        "Freed 1 seat on BUS-01 (13 available seats)",
        "Saved 3.5 minutes dwell time along Route 101"
      ]
    }
  }
];

export const OPERATIONS_METRICS = {
  activeBusesCount: 4,
  totalFleetCount: 8,
  standbyBusesCount: 3,
  activeRoutesCount: 4,
  delayedRoutesCount: 1,
  disruptedRoutesCount: 1,
  totalStudentsToday: 124,
  boardedStudentsToday: 96,
  cancelledStudentsToday: 4,
  activeDisruptionsCount: 2,
  resolvedDisruptionsToday: 6,
  onTimeArrivalRate: 97.4,
  carbonSavingsKg: 42.8,
  systemStatus: "OPTIMAL",
  recentAuditLogs: [
    { id: "LOG-501", time: "07:46:12 AM", user: "AI Replanning Engine", event: "Generated Recovery Plan REC-AI-901 for BUS-04 Breakdown", status: "PENDING_DISPATCHER_REVIEW" },
    { id: "LOG-502", time: "07:22:05 AM", user: "Sarah Jenkins (Dispatcher)", event: "Accepted Stop Bypass REC-AI-904 for Maya Lin Cancellation", status: "EXECUTED" },
    { id: "LOG-503", time: "06:45:10 AM", user: "Marcus Vance (Ops Mgr)", event: "Approved Reserve Driver Reassignment DRV-103 for Route 102", status: "EXECUTED" },
    { id: "LOG-504", time: "06:30:00 AM", user: "System", event: "Morning Fleet Telemetry & Safety Check Initialized (8 Vehicles)", status: "COMPLETED" }
  ]
};
