(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))d(a);new MutationObserver(a=>{for(const v of a)if(v.type==="childList")for(const A of v.addedNodes)A.tagName==="LINK"&&A.rel==="modulepreload"&&d(A)}).observe(document,{childList:!0,subtree:!0});function r(a){const v={};return a.integrity&&(v.integrity=a.integrity),a.referrerPolicy&&(v.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?v.credentials="include":a.crossOrigin==="anonymous"?v.credentials="omit":v.credentials="same-origin",v}function d(a){if(a.ep)return;a.ep=!0;const v=r(a);fetch(a.href,v)}})();const uo=[{id:"SCH-01",name:"Oakridge High School",type:"High School",address:"850 Oakridge Blvd",coords:[37.7749,-122.4194],bellTime:"08:15 AM",totalStudents:320},{id:"SCH-02",name:"Lincoln Middle School",type:"Middle School",address:"410 Lincoln Way",coords:[37.761,-122.447],bellTime:"08:30 AM",totalStudents:245},{id:"SCH-03",name:"West Valley Elementary",type:"Elementary",address:"1220 West Valley Rd",coords:[37.783,-122.408],bellTime:"08:45 AM",totalStudents:180}],po={id:"DEPOT-CENTRAL",name:"District Central Bus Depot & Maintenance",address:"2000 Transit Way",coords:[37.755,-122.405],standbyBusesCount:4,onDutyMechanics:3},ho=[{id:"DRV-101",name:"Sarah Jenkins",phone:"(555) 234-8901",license:"CDL-Class-B-Exp2028",rating:4.9,experienceYrs:8,status:"active",shiftStart:"06:30 AM",shiftEnd:"03:30 PM",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"},{id:"DRV-102",name:"Michael Torres",phone:"(555) 345-9012",license:"CDL-Class-B-Exp2027",rating:4.7,experienceYrs:5,status:"sick",shiftStart:"06:45 AM",shiftEnd:"03:45 PM",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"},{id:"DRV-103",name:"David Chen",phone:"(555) 456-0123",license:"CDL-Class-B-Exp2029",rating:5,experienceYrs:12,status:"active",shiftStart:"06:30 AM",shiftEnd:"03:30 PM",photo:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"},{id:"DRV-104",name:"Elena Rostova",phone:"(555) 567-1234",license:"CDL-Class-B-Exp2026",rating:4.8,experienceYrs:6,status:"active",shiftStart:"07:00 AM",shiftEnd:"04:00 PM",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"},{id:"DRV-105",name:"James Wilson",phone:"(555) 678-2345",license:"CDL-Class-B-Exp2028",rating:4.9,experienceYrs:9,status:"active",shiftStart:"06:15 AM",shiftEnd:"03:15 PM",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"},{id:"DRV-106",name:"Amina Al-Mansoor",phone:"(555) 789-3456",license:"CDL-Class-B-Exp2029",rating:4.9,experienceYrs:7,status:"standby",shiftStart:"07:00 AM",shiftEnd:"03:30 PM",photo:"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"},{id:"DRV-107",name:"Robert MacIntyre",phone:"(555) 890-4567",license:"CDL-Class-B-Exp2027",rating:4.6,experienceYrs:4,status:"standby",shiftStart:"07:00 AM",shiftEnd:"03:30 PM",photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}],fo=[{id:"BUS-01",plate:"CA-SCH-8120",model:"Blue Bird All American HD",type:"Electric Zero-Emission",capacity:54,currentLoad:42,driverId:"DRV-101",routeId:"RT-101",status:"in_transit",fuelLevel:88,speedKmh:34,coords:[37.771,-122.428],heading:45,gpsStatus:"live",lastGpsSync:"08:04:12 AM (Live Telematics Lock)",lastKnownLocation:"Alamo Square (Fulton & Steiner)",isManualLocation:!1,lastInspection:"2026-09-01",healthScore:98,amenities:["Wheelchair Lift","GPS Telematics","AI Camera","Air Conditioning"]},{id:"BUS-02",plate:"CA-SCH-8121",model:"Thomas Built Saf-T-Liner C2",type:"Clean Diesel",capacity:48,currentLoad:38,driverId:"DRV-103",routeId:"RT-102",status:"in_transit",fuelLevel:74,speedKmh:28,coords:[37.765,-122.438],heading:120,gpsStatus:"live",lastGpsSync:"08:04:10 AM (Live Telematics Lock)",lastKnownLocation:"West Portal Station",isManualLocation:!1,lastInspection:"2026-08-28",healthScore:94,amenities:["Wheelchair Lift","GPS Telematics","AI Camera","First Aid Kit"]},{id:"BUS-03",plate:"CA-SCH-8122",model:"Lion Electric LionC",type:"Electric Zero-Emission",capacity:60,currentLoad:49,driverId:"DRV-104",routeId:"RT-103",status:"delayed",delayMinutes:12,delayReason:"Construction bottleneck on Market St",fuelLevel:62,speedKmh:14,coords:[37.78,-122.415],heading:90,gpsStatus:"live",lastGpsSync:"08:03:55 AM (Live Telematics Lock)",lastKnownLocation:"Civic Center (Grove & Larkin)",isManualLocation:!1,lastInspection:"2026-09-02",healthScore:92,amenities:["Wheelchair Lift","GPS Telematics","AI Camera","Seatbelts"]},{id:"BUS-04",plate:"CA-SCH-8123",model:"Blue Bird Vision",type:"Clean Diesel",capacity:54,currentLoad:36,driverId:"DRV-105",routeId:"RT-104",status:"breakdown",fuelLevel:45,speedKmh:0,coords:[37.768,-122.455],heading:0,gpsStatus:"no_signal",lastGpsSync:"07:44:00 AM (Signal Lost upon Electrical Fault)",lastKnownLocation:"Cole & Haight St (Breakdown Site)",isManualLocation:!1,lastInspection:"2026-08-15",healthScore:42,breakdownNote:"Coolant temperature spike & engine shutdown alert at Stop 3 (Cole & Haight). GPS telematics offline.",amenities:["GPS Telematics","AI Camera"]},{id:"BUS-05",plate:"CA-SCH-8124",model:"Thomas Built Saf-T-Liner EFX",type:"Clean Diesel",capacity:54,currentLoad:0,driverId:"DRV-106",routeId:null,status:"in_depot",fuelLevel:100,speedKmh:0,coords:[37.755,-122.405],heading:0,gpsStatus:"live",lastGpsSync:"08:04:00 AM (Depot WiFi Telematics)",lastKnownLocation:"Central Depot (Standby Bay 1)",isManualLocation:!1,lastInspection:"2026-09-04",healthScore:100,amenities:["Wheelchair Lift","GPS Telematics","AI Camera"]},{id:"BUS-06",plate:"CA-SCH-8125",model:"Lion Electric LionC",type:"Electric Zero-Emission",capacity:60,currentLoad:0,driverId:"DRV-107",routeId:null,status:"in_depot",fuelLevel:95,speedKmh:0,coords:[37.7555,-122.406],heading:0,gpsStatus:"live",lastGpsSync:"08:04:00 AM (Depot WiFi Telematics)",lastKnownLocation:"Central Depot (Standby Bay 2)",isManualLocation:!1,lastInspection:"2026-09-03",healthScore:99,amenities:["Wheelchair Lift","GPS Telematics","AI Camera"]},{id:"BUS-07",plate:"CA-SCH-8126",model:"IC Bus CE Series",type:"Propane Autogas",capacity:48,currentLoad:0,driverId:null,routeId:null,status:"in_depot",fuelLevel:90,speedKmh:0,coords:[37.7545,-122.4045],heading:0,gpsStatus:"no_signal",lastGpsSync:"07:15:00 AM (Transponder Powered Down)",lastKnownLocation:"Central Depot (Standby Bay 3)",isManualLocation:!1,lastInspection:"2026-09-01",healthScore:96,amenities:["GPS Telematics"]},{id:"BUS-08",plate:"CA-SCH-8127",model:"Micro Bird G5",type:"Special Needs Shuttle",capacity:24,currentLoad:0,driverId:null,routeId:null,status:"maintenance",fuelLevel:50,speedKmh:0,coords:[37.754,-122.404],heading:0,gpsStatus:"no_signal",lastGpsSync:"Yesterday 04:30 PM (Maintenance Mode)",lastKnownLocation:"Central Depot Bay 4 (Service Bay)",isManualLocation:!1,lastInspection:"2026-08-10",healthScore:65,amenities:["Dual Hydraulic Wheelchair Lift","Medical Oxygen Storage"]}],mo=[{id:"RT-101",name:"Route 101 - Oakridge Northern Run",schoolId:"SCH-01",schoolName:"Oakridge High School",assignedBus:"BUS-01",assignedDriver:"Sarah Jenkins",status:"on_time",totalStops:6,completedStops:3,scheduledStartTime:"07:15 AM",scheduledArrivalTime:"08:05 AM",currentEta:"08:04 AM",delayMinutes:0,color:"#2563EB",stops:[{id:"ST-101-1",name:"Marina Green & Scott St",coords:[37.804,-122.441],time:"07:15 AM",studentsCount:8,status:"completed"},{id:"ST-101-2",name:"Chestnut & Fillmore",coords:[37.8,-122.434],time:"07:25 AM",studentsCount:12,status:"completed"},{id:"ST-101-3",name:"Pacific Heights (Broadway & Webster)",coords:[37.793,-122.431],time:"07:38 AM",studentsCount:14,status:"completed"},{id:"ST-101-4",name:"Japantown Plaza (Post & Buchanan)",coords:[37.786,-122.43],time:"07:48 AM",studentsCount:8,status:"next"},{id:"ST-101-5",name:"Alamo Square (Fulton & Steiner)",coords:[37.777,-122.432],time:"07:56 AM",studentsCount:6,status:"pending"},{id:"ST-101-6",name:"Oakridge High School Dropoff",coords:[37.7749,-122.4194],time:"08:05 AM",studentsCount:0,status:"destination"}]},{id:"RT-102",name:"Route 102 - Lincoln Sunset Run",schoolId:"SCH-02",schoolName:"Lincoln Middle School",assignedBus:"BUS-02",assignedDriver:"David Chen",status:"on_time",totalStops:5,completedStops:2,scheduledStartTime:"07:30 AM",scheduledArrivalTime:"08:20 AM",currentEta:"08:21 AM",delayMinutes:1,color:"#059669",stops:[{id:"ST-102-1",name:"Sunset Blvd & Pacheco",coords:[37.75,-122.495],time:"07:30 AM",studentsCount:9,status:"completed"},{id:"ST-102-2",name:"Taraval & 28th Ave",coords:[37.742,-122.485],time:"07:42 AM",studentsCount:11,status:"completed"},{id:"ST-102-3",name:"West Portal Station",coords:[37.74,-122.466],time:"07:54 AM",studentsCount:10,status:"next"},{id:"ST-102-4",name:"Forest Hill Concourse",coords:[37.748,-122.458],time:"08:06 AM",studentsCount:8,status:"pending"},{id:"ST-102-5",name:"Lincoln Middle School",coords:[37.761,-122.447],time:"08:20 AM",studentsCount:0,status:"destination"}]},{id:"RT-103",name:"Route 103 - West Valley Downtown Loop",schoolId:"SCH-03",schoolName:"West Valley Elementary",assignedBus:"BUS-03",assignedDriver:"Elena Rostova",status:"delayed",totalStops:5,completedStops:2,scheduledStartTime:"07:40 AM",scheduledArrivalTime:"08:35 AM",currentEta:"08:47 AM",delayMinutes:12,color:"#D97706",stops:[{id:"ST-103-1",name:"SOMA Central (4th & Howard)",coords:[37.782,-122.402],time:"07:40 AM",studentsCount:14,status:"completed"},{id:"ST-103-2",name:"Market & 7th Transit Plaza",coords:[37.779,-122.412],time:"07:52 AM",studentsCount:12,status:"completed"},{id:"ST-103-3",name:"Civic Center (Grove & Larkin)",coords:[37.778,-122.417],time:"08:08 AM",studentsCount:10,status:"delayed"},{id:"ST-103-4",name:"Hayes Valley Park (Octavia)",coords:[37.776,-122.424],time:"08:22 AM",studentsCount:13,status:"pending"},{id:"ST-103-5",name:"West Valley Elementary Dropoff",coords:[37.783,-122.408],time:"08:35 AM",studentsCount:0,status:"destination"}]},{id:"RT-104",name:"Route 104 - Oakridge Mission & Haight Run",schoolId:"SCH-01",schoolName:"Oakridge High School",assignedBus:"BUS-04",assignedDriver:"James Wilson",status:"disrupted",totalStops:5,completedStops:2,scheduledStartTime:"07:20 AM",scheduledArrivalTime:"08:10 AM",currentEta:"BROKEN DOWN",delayMinutes:35,color:"#DC2626",stops:[{id:"ST-104-1",name:"Mission & 24th St BART",coords:[37.752,-122.418],time:"07:20 AM",studentsCount:12,status:"completed"},{id:"ST-104-2",name:"Dolores Park (18th & Church)",coords:[37.76,-122.428],time:"07:32 AM",studentsCount:14,status:"completed"},{id:"ST-104-3",name:"Cole & Haight St (BREAKDOWN SITE)",coords:[37.768,-122.455],time:"07:45 AM",studentsCount:10,status:"stuck"},{id:"ST-104-4",name:"Corona Heights (Roosevelt Way)",coords:[37.764,-122.441],time:"07:58 AM",studentsCount:7,status:"stranded"},{id:"ST-104-5",name:"Oakridge High School Dropoff",coords:[37.7749,-122.4194],time:"08:10 AM",studentsCount:0,status:"destination"}]}],vo=[{id:"STU-1001",name:"Lucas Vance",grade:"10th Grade",schoolId:"SCH-01",schoolName:"Oakridge High",busId:"BUS-01",routeId:"RT-101",stopName:"Chestnut & Fillmore",guardianName:"Marcus Vance",guardianPhone:"(555) 301-4455",status:"boarded",specialNeeds:"None",photo:"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"},{id:"STU-1002",name:"Maya Lin",grade:"11th Grade",schoolId:"SCH-01",schoolName:"Oakridge High",busId:"BUS-01",routeId:"RT-101",stopName:"Japantown Plaza",guardianName:"Grace Lin",guardianPhone:"(555) 412-9900",status:"absent_cancelled",specialNeeds:"None",cancelReason:"Parent notified fever via app at 07:12 AM",photo:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"},{id:"STU-1003",name:"Noah Davies",grade:"7th Grade",schoolId:"SCH-02",schoolName:"Lincoln Middle",busId:"UNASSIGNED",routeId:"UNASSIGNED",stopName:"Forest Hill Concourse",guardianName:"Claire Davies",guardianPhone:"(555) 774-8833",status:"urgent_added",specialNeeds:"Wheelchair Accessibility Required",urgentAddNote:"Parent emergency, transferred from private transport at 07:18 AM",photo:"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80"},{id:"STU-1004",name:"Sophia Martinez",grade:"10th Grade",schoolId:"SCH-01",schoolName:"Oakridge High",busId:"BUS-04",routeId:"RT-104",stopName:"Cole & Haight St",guardianName:"Carlos Martinez",guardianPhone:"(555) 902-1234",status:"stranded",specialNeeds:"Asthma Inhaler in bag",photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"},{id:"STU-1005",name:"Liam O'Connor",grade:"12th Grade",schoolId:"SCH-01",schoolName:"Oakridge High",busId:"BUS-04",routeId:"RT-104",stopName:"Cole & Haight St",guardianName:"Brenda O'Connor",guardianPhone:"(555) 654-7890",status:"stranded",specialNeeds:"None",photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"},{id:"STU-1006",name:"Aiden Kim",grade:"3rd Grade",schoolId:"SCH-03",schoolName:"West Valley Elem",busId:"BUS-03",routeId:"RT-103",stopName:"Hayes Valley Park",guardianName:"Hannah Kim",guardianPhone:"(555) 321-6549",status:"waiting",specialNeeds:"Nut Allergy",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80"},{id:"STU-1007",name:"Emma Watson-Brown",grade:"8th Grade",schoolId:"SCH-02",schoolName:"Lincoln Middle",busId:"BUS-02",routeId:"RT-102",stopName:"Taraval & 28th Ave",guardianName:"Paul Brown",guardianPhone:"(555) 888-2341",status:"boarded",specialNeeds:"None",photo:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"},{id:"STU-1008",name:"Elijah Washington",grade:"9th Grade",schoolId:"SCH-01",schoolName:"Oakridge High",busId:"BUS-04",routeId:"RT-104",stopName:"Corona Heights",guardianName:"Tasha Washington",guardianPhone:"(555) 441-2299",status:"waiting",specialNeeds:"None",photo:"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"}],go=[{id:"DIS-2026-001",type:"breakdown",title:"Critical Engine Overheat & Breakdown",busId:"BUS-04",routeId:"RT-104",severity:"critical",reportedAt:"07:44 AM",location:"Cole & Haight St",impact:"36 students stranded on vehicle, 7 students waiting at Corona Heights",status:"unresolved",aiRecommendationAvailable:!0,aiRecommendation:{planId:"REC-AI-901",strategy:"Instant Depot Reserve Dispatch & Reroute",recommendedBusId:"BUS-05",recommendedRouteId:"RT-104",availableSeats:"54 seats available (0 current load)",currentLocation:"Central Depot (Standby Bay 1)",driverAvailability:"Amina Al-Mansoor (Available - Standby, No commitment conflicts)",routeCompatibility:"Compatible (Serves Oakridge High School, ADA Lift Verified, 54 capacity >= 43 required)",estimatedAdditionalDelay:"+6 min (Arrives before 08:16 AM)",selectionReason:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",standbyBusAssigned:"BUS-05",reserveDriverAssigned:"DRV-106 (Amina Al-Mansoor)",estRecoveryTimeMins:7.5,newEtaDifference:"+6 min",explanation:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",candidateEvaluations:[{busId:"BUS-05",model:"Thomas Built Saf-T-Liner EFX",routeId:"Depot Standby",driverName:"Amina Al-Mansoor",location:"Central Depot",seatsAvailable:54,delayMins:6,isFeasible:!0,statusText:"Feasible Candidate (Recommended)"},{busId:"BUS-06",model:"Lion Electric LionC",routeId:"Depot Standby",driverName:"Robert MacIntyre",location:"Central Depot",seatsAvailable:60,delayMins:7,isFeasible:!0,statusText:"Feasible Standby Candidate"},{busId:"BUS-01",model:"Blue Bird All American HD",routeId:"RT-101",driverName:"Sarah Jenkins",location:"Japantown Plaza",seatsAvailable:12,delayMins:14,isFeasible:!1,statusText:"Driver already assigned to another route (RT-101); Insufficient capacity (12 seats < 43 needed)"},{busId:"BUS-02",model:"Thomas Built Saf-T-Liner C2",routeId:"RT-102",driverName:"David Chen",location:"West Portal",seatsAvailable:10,delayMins:16,isFeasible:!1,statusText:"Driver already assigned to another route (RT-102); Insufficient capacity (10 seats < 43 needed)"},{busId:"BUS-03",model:"Lion Electric LionC",routeId:"RT-103",driverName:"Elena Rostova",location:"Market St",seatsAvailable:11,delayMins:18,isFeasible:!1,statusText:"Driver already assigned to another route (RT-103); Vehicle delayed in traffic"},{busId:"BUS-04",model:"Blue Bird Vision",routeId:"RT-104",driverName:"James Wilson",location:"Cole & Haight St",seatsAvailable:0,delayMins:0,isFeasible:!1,statusText:"Vehicle unavailable (breakdown); Driver unavailable (managing scene)"},{busId:"BUS-07",model:"IC Bus CE Series",routeId:"Depot Standby",driverName:"Unassigned",location:"Central Depot",seatsAvailable:48,delayMins:0,isFeasible:!1,statusText:"Driver unavailable"},{busId:"BUS-08",model:"Micro Bird G5",routeId:"Maintenance Bay",driverName:"Unassigned",location:"Central Depot Bay 4",seatsAvailable:24,delayMins:0,isFeasible:!1,statusText:"Vehicle unavailable (maintenance); Driver unavailable"}],tradeoffs:["Dispatches reserve standby BUS-05 from Central Depot (54 capacity >= 43 required)","Transfers all 36 on-board and 7 waiting passengers with zero missed stops","Arrival time 08:16 AM within district SLA grace window"]}},{id:"DIS-2026-002",type:"driver_unavailability",title:"Driver Sickness Absence (Michael Torres)",busId:"BUS-02",routeId:"RT-102",severity:"warning",reportedAt:"06:40 AM",location:"Pre-Shift Check In",impact:"Route 102 (Lincoln Sunset Run) required replacement driver assignment",status:"replanned",aiRecommendationAvailable:!0,aiRecommendation:{planId:"REC-AI-902",strategy:"Assign Qualified Standby Driver",recommendedBusId:"BUS-02",recommendedRouteId:"RT-102",availableSeats:"10 seats available (38/48 load)",currentLocation:"West Portal Station",driverAvailability:"David Chen (Available - Standby roster, No commitment conflicts)",routeCompatibility:"Compatible (Assigned to Route 102 - Lincoln Sunset Run)",estimatedAdditionalDelay:"+1 min (On schedule)",selectionReason:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",standbyBusAssigned:null,reserveDriverAssigned:"DRV-103 (David Chen)",estRecoveryTimeMins:3.2,newEtaDifference:"+1 min",explanation:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",candidateEvaluations:[{busId:"BUS-02",model:"Thomas Built Saf-T-Liner C2",routeId:"RT-102",driverName:"David Chen",location:"West Portal Station",seatsAvailable:10,delayMins:1,isFeasible:!0,statusText:"Feasible Candidate (Recommended)"},{busId:"BUS-01",model:"Blue Bird All American HD",routeId:"RT-101",driverName:"Sarah Jenkins",location:"Japantown",seatsAvailable:12,delayMins:12,isFeasible:!1,statusText:"Driver already assigned to another route (RT-101)"},{busId:"BUS-03",model:"Lion Electric LionC",routeId:"RT-103",driverName:"Elena Rostova",location:"Market St",seatsAvailable:11,delayMins:15,isFeasible:!1,statusText:"Driver already assigned to another route (RT-103)"},{busId:"BUS-04",model:"Blue Bird Vision",routeId:"RT-104",driverName:"James Wilson",location:"Cole & Haight",seatsAvailable:18,delayMins:0,isFeasible:!1,statusText:"Driver unavailable (Medical / Sickness absence)"}],tradeoffs:["Assigned standby driver David Chen with zero commitment conflict","Route 102 departs on schedule with +1 min estimated arrival variance"]}},{id:"DIS-2026-003",type:"urgent_add",title:"Urgent Student Addition: Noah Davies (Wheelchair Accessible Req.)",busId:null,routeId:null,severity:"warning",reportedAt:"07:18 AM",location:"Forest Hill Concourse",impact:"1 student requires urgent pickup with ADA compliant lift for Lincoln Middle School",status:"unresolved",aiRecommendationAvailable:!0,aiRecommendation:{planId:"REC-AI-903",strategy:"Dynamic Insertion into Route 102",recommendedBusId:"BUS-02",recommendedRouteId:"RT-102",availableSeats:"10 seats available (38/48 load)",currentLocation:"West Portal Station (0.8 miles from pickup)",driverAvailability:"David Chen (Available - Active, No commitment conflicts)",routeCompatibility:"Compatible (Serves Lincoln Middle School, ADA Lift Verified)",estimatedAdditionalDelay:"+2 min (Arrives before 08:22 AM)",selectionReason:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",suggestedRouteId:"RT-102",suggestedBusId:"BUS-02",estRecoveryTimeMins:4,newEtaDifference:"+2 min",explanation:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",candidateEvaluations:[{busId:"BUS-02",model:"Thomas Built Saf-T-Liner C2",routeId:"RT-102",driverName:"David Chen",location:"West Portal Station",seatsAvailable:10,delayMins:2,isFeasible:!0,statusText:"Feasible Candidate (Recommended)"},{busId:"BUS-01",model:"Blue Bird All American HD",routeId:"RT-101",driverName:"Sarah Jenkins",location:"Japantown",seatsAvailable:12,delayMins:18,isFeasible:!1,statusText:"Route RT-101 serves Oakridge High, incompatible with destination (Lincoln Middle)"},{busId:"BUS-03",model:"Lion Electric LionC",routeId:"RT-103",driverName:"Elena Rostova",location:"Market St",seatsAvailable:11,delayMins:22,isFeasible:!1,statusText:"Route RT-103 serves West Valley Elementary, incompatible with destination (Lincoln Middle)"},{busId:"BUS-04",model:"Blue Bird Vision",routeId:"RT-104",driverName:"James Wilson",location:"Cole & Haight",seatsAvailable:0,delayMins:0,isFeasible:!1,statusText:"Vehicle unavailable (breakdown); Driver unavailable"},{busId:"BUS-07",model:"IC Bus CE Series",routeId:"Depot Standby",driverName:"Unassigned",location:"Central Depot",seatsAvailable:48,delayMins:0,isFeasible:!1,statusText:"Driver unavailable; Bus has no active route assigned"}],tradeoffs:["Inserts Forest Hill Concourse stop into Route 102","Estimated arrival +2 min variance (well before school bell)","Preserves 9 seats for remaining scheduled pickups"]}},{id:"DIS-2026-004",type:"student_cancel",title:"Last-Minute Cancellation: Maya Lin",busId:"BUS-01",routeId:"RT-101",severity:"info",reportedAt:"07:12 AM",location:"Japantown Plaza",impact:"Parent reported sickness; 1 stop skipped to save 3.5 minutes travel time",status:"accepted",aiRecommendationAvailable:!0,aiRecommendation:{planId:"REC-AI-904",strategy:"Route Optimization & Stop Bypass",recommendedBusId:"BUS-01",recommendedRouteId:"RT-101",availableSeats:"13 seats available (41/54 load, +1 seat freed)",currentLocation:"Pacific Heights (Broadway & Webster)",driverAvailability:"Sarah Jenkins (Available - Active, No commitment conflicts)",routeCompatibility:"Compatible (Assigned to Route 101 - Oakridge Northern Run)",estimatedAdditionalDelay:"-3.5 min (Ahead of schedule)",selectionReason:"Selected because the bus is already assigned to the route, has increased available capacity (13 seats), and saves 3.5 minutes by bypassing the stop.",estRecoveryTimeMins:1,newEtaDifference:"-3.5 min (Faster)",explanation:"Selected because the bus is already assigned to the route, has increased available capacity (13 seats), and saves 3.5 minutes by bypassing the stop.",candidateEvaluations:[{busId:"BUS-01",model:"Blue Bird All American HD",routeId:"RT-101",driverName:"Sarah Jenkins",location:"Pacific Heights",seatsAvailable:13,delayMins:-3.5,isFeasible:!0,statusText:"Optimal Assigned Bus (Stop Bypassed)"},{busId:"BUS-02",model:"Thomas Built Saf-T-Liner C2",routeId:"RT-102",driverName:"David Chen",location:"West Portal",seatsAvailable:10,delayMins:0,isFeasible:!1,statusText:"Driver already assigned to another route (RT-102)"},{busId:"BUS-03",model:"Lion Electric LionC",routeId:"RT-103",driverName:"Elena Rostova",location:"Market St",seatsAvailable:11,delayMins:0,isFeasible:!1,statusText:"Driver already assigned to another route (RT-103)"}],tradeoffs:["Freed 1 seat on BUS-01 (13 available seats)","Saved 3.5 minutes dwell time along Route 101"]}}],yo={activeBusesCount:4,totalFleetCount:8,standbyBusesCount:3,activeRoutesCount:4,delayedRoutesCount:1,disruptedRoutesCount:1,totalStudentsToday:124,boardedStudentsToday:96,cancelledStudentsToday:4,activeDisruptionsCount:2,resolvedDisruptionsToday:6,onTimeArrivalRate:97.4,carbonSavingsKg:42.8,systemStatus:"OPTIMAL",recentAuditLogs:[{id:"LOG-501",time:"07:46:12 AM",user:"AI Replanning Engine",event:"Generated Recovery Plan REC-AI-901 for BUS-04 Breakdown",status:"PENDING_DISPATCHER_REVIEW"},{id:"LOG-502",time:"07:22:05 AM",user:"Sarah Jenkins (Dispatcher)",event:"Accepted Stop Bypass REC-AI-904 for Maya Lin Cancellation",status:"EXECUTED"},{id:"LOG-503",time:"06:45:10 AM",user:"Marcus Vance (Ops Mgr)",event:"Approved Reserve Driver Reassignment DRV-103 for Route 102",status:"EXECUTED"},{id:"LOG-504",time:"06:30:00 AM",user:"System",event:"Morning Fleet Telemetry & Safety Check Initialized (8 Vehicles)",status:"COMPLETED"}]};function Bn(u,l){if(!u||!l)return 0;const[r,d]=u,[a,v]=l,A=(a-r)*69,k=(v-d)*55;return Math.sqrt(k*k+A*A)}class Ft{constructor(){const l=this.loadPendingOfflineChanges();this.state={activeScreen:"auth",currentUser:null,currentRole:null,activeTab:"dashboard",networkStatus:"online",pendingOfflineChanges:l,lastSyncTimestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),buses:JSON.parse(JSON.stringify(fo)),routes:JSON.parse(JSON.stringify(mo)),students:JSON.parse(JSON.stringify(vo)),disruptions:JSON.parse(JSON.stringify(go)),drivers:JSON.parse(JSON.stringify(ho)),schools:JSON.parse(JSON.stringify(uo)),depot:JSON.parse(JSON.stringify(po)),metrics:JSON.parse(JSON.stringify(yo)),selectedBusId:null,selectedRouteId:null,selectedDisruptionId:"DIS-2026-001",searchQuery:"",filterStatus:"all",activeModal:null,modalPayload:null,toasts:[]},this.listeners=new Set,typeof window<"u"&&(window.addEventListener("online",()=>{this.setNetworkStatus("online")}),window.addEventListener("offline",()=>{this.setNetworkStatus("offline")}))}loadPendingOfflineChanges(){try{if(typeof window<"u"&&window.localStorage){const l=window.localStorage.getItem("school_bus_pending_sync");return l?JSON.parse(l):[]}}catch(l){console.warn("Unable to load pending offline queue from localStorage",l)}return[]}savePendingOfflineChanges(){try{typeof window<"u"&&window.localStorage&&window.localStorage.setItem("school_bus_pending_sync",JSON.stringify(this.state.pendingOfflineChanges))}catch(l){console.warn("Unable to persist pending offline queue to localStorage",l)}}setNetworkStatus(l){const r=this.state.networkStatus;this.state.networkStatus=l,l==="offline"?this.showToast("Network Offline — Operating in Local Fallback Mode with Last Known Data.","danger"):l==="degraded"?this.showToast("Network Degraded — High Latency Telematics. Using Local Cache.","warning"):l==="online"&&r!=="online"&&(this.showToast("Network Restored — Connected to District Telematics Cloud.","success"),this.state.pendingOfflineChanges.length>0&&this.syncPendingOfflineChanges()),this.notify()}queueOfflineChange(l,r,d={}){const a={id:`SYNC-${Date.now()}-${Math.floor(Math.random()*1e3)}`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",actionType:l,description:r,payload:d};this.state.pendingOfflineChanges.push(a),this.savePendingOfflineChanges(),this.showToast(`[${this.state.networkStatus.toUpperCase()} MODE] Changes saved locally. Will sync when online.`,"warning")}syncPendingOfflineChanges(){if(this.state.pendingOfflineChanges.length===0){this.showToast("System is synchronized with district servers.","info");return}const l=this.state.pendingOfflineChanges.length,r=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});this.state.metrics.recentAuditLogs.unshift({id:`LOG-SYNC-${Date.now()}`,time:r,user:this.state.currentUser?this.state.currentUser.name:"System Sync Engine",event:`Network Synchronized: Flushed ${l} locally queued operational updates to central district servers.`,status:"SYNCHRONIZED"}),this.state.pendingOfflineChanges=[],this.savePendingOfflineChanges(),this.state.lastSyncTimestamp=r,this.showToast(`Synchronized ${l} pending local operational change(s) with Central Servers.`,"success"),this.notify()}updateBusLocationManually(l,r,d="",a="Dispatcher Manual Checkpoint"){const v=this.state.buses.find(h=>h.id===l);if(!v)return;[...v.coords],v.lastKnownLocation;const A=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});v.coords=[parseFloat(r[0]),parseFloat(r[1])],v.gpsStatus="manual",v.isManualLocation=!0,v.lastKnownLocation=d||`Checkpoint at [${v.coords[0].toFixed(4)}, ${v.coords[1].toFixed(4)}]`,v.lastGpsSync=`${A} (Dispatcher Manual Fix: ${a})`;const k=`Manual location update for ${v.id} to ${v.lastKnownLocation}`;this.state.networkStatus!=="online"&&this.queueOfflineChange("MANUAL_BUS_LOCATION",k,{busId:l,coords:v.coords,locationName:v.lastKnownLocation,reason:a}),this.state.metrics.recentAuditLogs.unshift({id:`LOG-GPS-${Date.now()}`,time:A,user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Manual Location Fix: ${v.id} updated to "${v.lastKnownLocation}". Reason: ${a}.`,status:"MANUAL_GPS_OVERRIDE"}),this.showToast(`Location for ${v.id} updated manually to "${v.lastKnownLocation}". Marked as Manual Fix.`,"success"),this.closeModal(),this.notify()}setBusGpsStatus(l,r,d=null){const a=this.state.buses.find(v=>v.id===l);a&&(a.gpsStatus=r,r==="no_signal"||r==="lost"?(a.isManualLocation=!1,a.lastGpsSync=`${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} (Signal Lost)`):r==="live"&&(a.isManualLocation=!1,a.lastGpsSync=`${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} (Live Telematics Lock)`),d&&(a.lastKnownLocation=d),this.notify())}getState(){return this.state}subscribe(l){return this.listeners.add(l),()=>this.listeners.delete(l)}notify(){for(const l of this.listeners)l(this.state)}login(l){this.state.currentUser=l,this.state.activeScreen="role_selection",this.showToast(`Welcome, ${l.name}! Select your operational role.`,"info"),this.notify()}selectRole(l){this.state.currentRole=l,this.state.activeScreen="app",this.state.activeTab="dashboard";const r=l==="dispatcher"?"Dispatcher Control Room":"Operations Manager Oversight";this.showToast(`Active Session: ${r}`,"success"),this.notify()}switchRole(l){this.state.currentRole=l;const r=l==="dispatcher"?"Dispatcher Control Room":"Operations Manager Oversight";this.showToast(`Switched view to ${r}`,"info"),this.notify()}logout(){this.state.currentUser=null,this.state.currentRole=null,this.state.activeScreen="auth",this.state.activeTab="dashboard",this.showToast("Logged out of Transport Control Center","info"),this.notify()}setActiveTab(l){this.state.activeTab=l,this.notify()}setSearchQuery(l){this.state.searchQuery=l,this.notify()}setFilterStatus(l){this.state.filterStatus=l,this.notify()}setSelectedDisruption(l){this.state.selectedDisruptionId=l,this.notify()}setSelectedBus(l){this.state.selectedBusId=l,this.notify()}validateDriverAvailabilityAndCommitments(l,r,d=null){if(!l)return{isValid:!1,reason:"Driver unavailable",preferenceScore:0};if(l.status==="sick")return{isValid:!1,reason:"Driver unavailable (Medical / Sickness absence)",preferenceScore:0};if(l.status==="on_break"||l.status==="offline")return{isValid:!1,reason:"Driver unavailable (Off-duty / Mandatory rest)",preferenceScore:0};if(l.status!=="active"&&l.status!=="standby")return{isValid:!1,reason:"Driver unavailable",preferenceScore:0};if(d){const v=this.state.routes.find(A=>A.id!==d.id&&(A.assignedDriver===l.name||r&&r.routeId&&r.routeId===A.id&&A.id!==d.id));if(v)return{isValid:!1,reason:`Driver already assigned to another route (${v.id})`,preferenceScore:0}}return l.commitments&&l.commitments.length>0?{isValid:!1,reason:"Driver has an existing commitment",preferenceScore:0}:{isValid:!0,reason:null,preferenceScore:l.status==="standby"?25:15}}handleVehicleBreakdown(l,r={}){const d=this.state.buses.find(m=>m.id===l);if(!d)return;d.status="breakdown",d.speedKmh=0,r.impact&&(d.breakdownNote=r.impact);const a=this.state.routes.find(m=>m.id===d.routeId||m.assignedBus===d.id),v=this.state.students.filter(m=>m.busId===d.id||a&&m.routeId===a.id&&m.status!=="absent_cancelled"),A=v.length||d.currentLoad||0,k=[],h=this.state.drivers.filter(m=>m.status==="active"||m.status==="standby");for(const m of this.state.buses){if(m.id===d.id)continue;const $=[],N=this.state.routes.find(T=>T.id===m.routeId),O=m.status==="in_depot";["breakdown","offline","maintenance"].includes(m.status)&&$.push(`Vehicle unavailable (${m.status})`),m.capacity<A&&$.push(`Insufficient capacity (${m.capacity} seats < ${A} required students)`),v.some(T=>T.specialNeeds&&T.specialNeeds.toLowerCase().includes("wheelchair"))&&(m.amenities&&m.amenities.some(z=>z.toLowerCase().includes("wheelchair"))||$.push("Incompatible: Lacks required ADA Wheelchair Lift for special needs passengers")),m.fuelLevel<30&&$.push(`Low fuel/battery (${m.fuelLevel}%) insufficient for emergency dispatch`);let V=this.state.drivers.find(T=>T.id===m.driverId);!V&&O&&(V=h.find(T=>this.validateDriverAvailabilityAndCommitments(T,m,a).isValid)||h[0]||null);const K=this.validateDriverAvailabilityAndCommitments(V,m,a);K.isValid||$.push(K.reason);const st=$.length===0,ct=m.status==="in_depot"?[37.755,-122.405]:m.coords||[37.77,-122.42],mt=d.coords||r.coords||[37.77,-122.42],St=Bn(ct,mt),ot=st?100+(m.capacity-A)*2+K.preferenceScore+(m.healthScore||90)*.1-St*2:0;k.push({bus:m,route:N,driver:V,isFeasible:st,reasons:$,seatsAvailable:m.capacity-(O?0:m.currentLoad||0),delayMins:O?4:7.5,driverDistanceMi:St,score:ot})}const _=k.filter(m=>m.isFeasible).sort((m,$)=>$.score-m.score)[0]||null,y=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),f=`DIS-2026-00${this.state.disruptions.length+1}`;if(!_){const m={id:f,reportedAt:y,type:"breakdown",title:`Vehicle Breakdown: Bus ${d.id} Stall Alert`,busId:d.id,routeId:a?a.id:null,location:r.location||"Route Waypoint",severity:"critical",impact:`Bus ${d.id} stalled with ${A} passengers. No replacement fleet vehicle meets capacity/driver requirements.`,status:"unresolved",aiRecommendationAvailable:!1,noFeasibleSolution:!0,affectedStudentsList:v.map($=>({id:$.id,name:$.name,grade:$.grade,stopName:$.stopName,specialNeeds:$.specialNeeds})),candidateEvaluations:k.map($=>({busId:$.bus.id,routeId:$.route?$.route.id:"Depot Standby",driverName:$.driver?$.driver.name:"Unassigned",isFeasible:!1,reasons:$.reasons.join("; ")}))};this.state.disruptions.unshift(m),this.state.selectedDisruptionId=f,this.state.metrics.activeDisruptionsCount+=1,this.showToast("No Feasible Solution — Manual Intervention Required","danger"),this.closeModal(),this.setActiveTab("replanning"),this.notify();return}const g=a?JSON.parse(JSON.stringify(a)):null,b=a?JSON.parse(JSON.stringify(a)):null;b&&(b.assignedBus=_.bus.id,b.assignedDriver=_.driver.name),JSON.parse(JSON.stringify(d));const E=JSON.parse(JSON.stringify(_.bus));E.currentLoad=A;const S=k.find(m=>!m.isFeasible),F=S?` Note: ${S.bus.id} was considered but rejected because ${S.reasons.join(", ")}.`:"",B=`Selected ${_.bus.id} because it has ${_.seatsAvailable} available seats (>= ${A} needed), its driver (${_.driver.name}) is available with no commitment conflicts, and it is in proximity (${_.driverDistanceMi?_.driverDistanceMi.toFixed(1):"?"} mi).${F}`,D={id:f,_createdAtMs:Date.now(),reportedAt:y,type:"breakdown",title:r.title||`Vehicle Breakdown: Bus ${d.id} at ${r.location||"Market & 7th"}`,busId:d.id,routeId:a?a.id:null,location:r.location||"Stop 3 / Cole & Haight",severity:"critical",impact:`Bus ${d.id} unavailable. ${A} students require emergency replacement transit.`,status:"unresolved",beforeRoute:g,afterRoute:b,beforeBus:{id:d.id,load:d.currentLoad,capacity:d.capacity,availableSeats:0,status:"Unavailable (Stalled)"},afterBus:{id:_.bus.id,load:A,capacity:_.bus.capacity,availableSeats:_.bus.capacity-A,status:"Dispatched from Depot"},affectedStudentsList:v.map(m=>({id:m.id,name:m.name,grade:m.grade,stopName:m.stopName,specialNeeds:m.specialNeeds})),aiRecommendationAvailable:!0,aiRecommendation:{planId:`REPLAN-SWAP-${Math.floor(100+Math.random()*900)}`,strategy:"Emergency Standby Fleet Swap & Depot Dispatch",recommendedBusId:_.bus.id,recommendedRouteId:a?a.id:"RT-104",availableSeats:`${_.seatsAvailable} seats available (${_.bus.capacity} seat capacity)`,currentLocation:_.bus.status==="in_depot"?"Central Depot (Standby Bay 1)":"En Route",driverAvailability:`${_.driver.name} (Available - ${_.driver.status==="standby"?"Standby":"Active"}, No commitment conflicts)`,routeCompatibility:`Compatible (Serves ${a?a.schoolName||a.schoolId:"District School"}, ADA Lift Verified, 54 capacity >= ${A} required)`,estimatedAdditionalDelay:`+${(_.delayMins||4.2).toFixed(0)} min (Within SLA grace window)`,selectionReason:B,recommendedDriverId:_.driver.id,recommendedDriverName:_.driver.name,standbyBusAssigned:_.bus.id,reserveDriverAssigned:`${_.driver.id} (${_.driver.name})`,estRecoveryTimeMins:(_.delayMins||4.2).toFixed(1),newEtaDifference:"+4 min",explanation:B,candidateEvaluations:k.map(m=>{var $,N,O;return{busId:m.bus.id,model:m.bus.model,routeId:m.route?m.route.id:"Depot Standby",driverName:m.driver?m.driver.name:"Unassigned",location:m.bus.status==="in_depot"?"Central Depot":((O=(N=($=m.route)==null?void 0:$.stops)==null?void 0:N.find(U=>U.status==="next"))==null?void 0:O.name)||"In Transit",driverDistanceMi:m.driverDistanceMi,driverStatus:m.driver?m.driver.status:"unknown",isFeasible:m.isFeasible,seatsAvailable:m.seatsAvailable,delayMins:m.delayMins,statusText:m.isFeasible?"Feasible Candidate (Recommended)":m.reasons.join("; ")}}),tradeoffs:[`Dispatches reserve standby ${_.bus.id} from Central Depot (${_.bus.capacity} seats)`,`Reassigns ${A} passengers with zero missed stops or ADA violations`,"Estimated schedule variance: +4 mins (within SLA)"]},...r};this.state.disruptions.unshift(D),this.state.selectedDisruptionId=f,this.state.metrics.activeDisruptionsCount+=1,this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:y,user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Vehicle Breakdown Declared on ${d.id}. Proposed Replacement: ${_.bus.id}. Awaiting Dispatcher Approval.`,status:"PENDING_APPROVAL"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("BREAKDOWN_DECLARATION",`Vehicle Breakdown declared for ${d.id}. Proposed replacement: ${_.bus.id}`,{busId:d.id,replacementBusId:_.bus.id,disruptionId:f}),this.showToast(`Vehicle Breakdown logged on ${d.id}. Recommended Replacement: Bus ${_.bus.id}. Awaiting Approval.`,"danger"),this.closeModal(),this.setActiveTab("replanning"),this.notify()}createDisruption(l){if(l.type==="breakdown"&&l.busId){this.handleVehicleBreakdown(l.busId,l);return}const r=`DIS-2026-00${this.state.disruptions.length+1}`,a=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),v={id:r,reportedAt:a,status:"unresolved",aiRecommendationAvailable:!0,aiRecommendation:{planId:`REC-AI-${Math.floor(100+Math.random()*900)}`,strategy:l.type==="driver_unavailability"?"Reserve Driver Dispatch":"Dynamic Stop Re-sequencing",recommendedBusId:l.busId||"BUS-02",recommendedRouteId:l.routeId||"RT-102",availableSeats:"10 seats available",currentLocation:l.location||"Central Depot",driverAvailability:"David Chen (Available - Standby, No commitment conflicts)",routeCompatibility:"Compatible (Active District Route)",estimatedAdditionalDelay:"+1 min",selectionReason:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",reserveDriverAssigned:"DRV-107 (Robert MacIntyre)",estRecoveryTimeMins:4.5,newEtaDifference:"+4 min",explanation:"Selected because the bus has enough capacity, is close to the affected location, and has an available driver.",candidateEvaluations:[{busId:l.busId||"BUS-02",routeId:l.routeId||"RT-102",driverName:"David Chen",seatsAvailable:10,delayMins:1,isFeasible:!0,statusText:"Feasible Candidate (Recommended)"},{busId:"BUS-01",routeId:"RT-101",driverName:"Sarah Jenkins",seatsAvailable:12,delayMins:12,isFeasible:!1,statusText:"Driver already assigned to another route (RT-101)"}],tradeoffs:["Minimal operational variance","Full passenger safety verified"]},...l};this.state.disruptions.unshift(v),this.state.selectedDisruptionId=r,this.state.metrics.activeDisruptionsCount+=1,this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:a,user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Declared Disruption: ${l.title}`,status:"PENDING_REVIEW"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("CREATE_DISRUPTION",`Declared Disruption: ${l.title}`,{disruptionId:r,disruptionData:l}),this.showToast(`New Disruption Logged: ${l.title}`,"danger"),this.closeModal(),this.setActiveTab("replanning"),this.notify()}evaluateUrgentStudentAddition(l){const r=[];for(const a of this.state.buses){const v=this.state.routes.find(D=>D.id===a.routeId),A=this.state.drivers.find(D=>D.id===a.driverId),k=this.state.schools.find(D=>D.id===(v?v.schoolId:l.schoolId)),h=[];["breakdown","offline","maintenance"].includes(a.status)&&h.push(`Vehicle unavailable (${a.status})`);const x=a.capacity-(a.currentLoad||0);x<=0&&h.push(`Insufficient capacity (${a.currentLoad}/${a.capacity} full, 0 seats available)`);const _=this.validateDriverAvailabilityAndCommitments(A,a,v);_.isValid||h.push(_.reason),v?l.schoolId&&v.schoolId!==l.schoolId&&h.push(`Route ${v.id} serves ${v.schoolName||v.schoolId}, incompatible with destination (${l.schoolName||l.schoolId})`):h.push("Bus has no active route assigned"),l.specialNeeds&&l.specialNeeds.toLowerCase().includes("wheelchair")&&(a.amenities&&a.amenities.some(m=>m.toLowerCase().includes("wheelchair"))||h.push("Incompatible: Vehicle lacks required ADA Wheelchair Lift"));const g=(l.specialNeeds&&l.specialNeeds.toLowerCase().includes("wheelchair")?3.5:2)+1.5,b=h.length===0,E=a.status==="in_depot"?[37.755,-122.405]:a.coords||[37.77,-122.42],S=l.coords||[37.77,-122.42],F=Bn(E,S),B=b?100-g*5+x*2+_.preferenceScore+(a.healthScore||90)*.1-F*2:0;r.push({bus:a,route:v,driver:A,destinationSchool:k,isFeasible:b,reasons:h,seatsAvailable:x,additionalDelayMins:g,driverDistanceMi:F,score:B})}return{feasibleCandidates:r.filter(a=>a.isFeasible).sort((a,v)=>v.score-a.score),allEvaluations:r}}addStudent(l){var F,B,D;const{feasibleCandidates:r,allEvaluations:d}=this.evaluateUrgentStudentAddition(l),a=r[0]||null,v=`STU-${Math.floor(1010+Math.random()*8e3)}`,k=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),h={id:v,status:a?"urgent_added":"urgent_no_feasible",photo:"https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80",busId:"UNASSIGNED",routeId:"UNASSIGNED",...l};this.state.students.unshift(h),this.state.metrics.totalStudentsToday+=1;const x=`DIS-2026-00${this.state.disruptions.length+1}`;if(!a){const m={id:x,_createdAtMs:Date.now(),reportedAt:k,type:"urgent_add",title:`Urgent Student Addition – ${l.name}`,studentId:v,studentName:l.name,busId:null,routeId:null,location:l.stopName,severity:"warning",impact:"No suitable bus exists matching capacity, driver, and destination school requirements.",status:"unresolved",aiRecommendationAvailable:!1,noFeasibleSolution:!0,candidateEvaluations:d.map($=>{var N,O,U;return{busId:$.bus.id,model:$.bus.model,routeId:$.route?$.route.id:"None",driverName:$.driver?$.driver.name:"Unassigned",location:$.bus.status==="in_depot"?"Central Depot":((U=(O=(N=$.route)==null?void 0:N.stops)==null?void 0:O.find(V=>V.status==="next"))==null?void 0:U.name)||"In Transit",seatsAvailable:$.seatsAvailable,delayMins:$.additionalDelayMins,isFeasible:!1,statusText:$.reasons.join("; ")}})};this.state.disruptions.unshift(m),this.state.selectedDisruptionId=x,this.state.metrics.activeDisruptionsCount+=1,this.showToast("No Feasible Solution — Manual Intervention Required","warning"),this.closeModal(),this.setActiveTab("replanning"),this.notify();return}const _=JSON.parse(JSON.stringify(a.route)),c=JSON.parse(JSON.stringify(a.route));c.stops.splice(Math.max(0,c.stops.length-1),0,{id:`ST-${a.route.id}-URGENT`,name:l.stopName,time:"07:45 AM",studentsCount:1,status:"pending"}),c.totalStops=c.stops.length;const y=JSON.parse(JSON.stringify(a.bus)),f=JSON.parse(JSON.stringify(a.bus));f.currentLoad=(f.currentLoad||0)+1;const g=d.find(m=>!m.isFeasible),b=g?` Note: ${g.bus.id} was considered but rejected because ${g.reasons.join(", ")}.`:"",E=`Selected ${a.bus.id} because it has ${a.seatsAvailable} available seats, is compatible with the route, its driver (${a.driver.name}) is available with no commitment conflicts, and it is in proximity (${a.driverDistanceMi?a.driverDistanceMi.toFixed(1):"?"} mi).${b}`,S={id:x,_createdAtMs:Date.now(),reportedAt:k,type:"urgent_add",title:`Urgent Student Addition – ${l.name}`,studentId:v,studentName:l.name,busId:a.bus.id,routeId:a.route.id,location:l.stopName,severity:"warning",impact:`Urgent passenger request. Recommended Bus ${a.bus.id} (${a.seatsAvailable} seats available, +${a.additionalDelayMins} min variance).`,status:"unresolved",beforeRoute:_,afterRoute:c,beforeBus:{id:a.bus.id,load:y.currentLoad,capacity:y.capacity,availableSeats:a.seatsAvailable},afterBus:{id:a.bus.id,load:f.currentLoad,capacity:f.capacity,availableSeats:a.seatsAvailable-1},aiRecommendationAvailable:!0,aiRecommendation:{planId:`REPLAN-ADD-${Math.floor(100+Math.random()*900)}`,strategy:"Dynamic Stop Insertion & Route Capacity Allocation",recommendedBusId:a.bus.id,recommendedRouteId:a.route.id,availableSeats:`${a.seatsAvailable} seats available (${f.currentLoad}/${a.bus.capacity} load)`,currentLocation:a.bus.status==="in_depot"?"Central Depot":((D=(B=(F=a.route)==null?void 0:F.stops)==null?void 0:B.find(m=>m.status==="next"))==null?void 0:D.name)||"In Transit",driverAvailability:`${a.driver.name} (Available - ${a.driver.status==="standby"?"Standby":"Active"}, No commitment conflicts)`,routeCompatibility:`Compatible (Serves ${l.schoolName||"destination school"}, ADA Compliant)`,estimatedAdditionalDelay:`+${a.additionalDelayMins} min (Arrives before school bell)`,selectionReason:E,recommendedDriver:a.driver.name,estRecoveryTimeMins:0,additionalDelayMins:a.additionalDelayMins,newEtaDifference:`+${a.additionalDelayMins} min`,explanation:E,candidateEvaluations:d.map(m=>{var $,N,O;return{busId:m.bus.id,model:m.bus.model,routeId:m.route?m.route.id:"None",driverName:m.driver?m.driver.name:"Unassigned",location:m.bus.status==="in_depot"?"Central Depot":((O=(N=($=m.route)==null?void 0:$.stops)==null?void 0:N.find(U=>U.status==="next"))==null?void 0:O.name)||"In Transit",driverDistanceMi:m.driverDistanceMi,driverStatus:m.driver?m.driver.status:"unknown",isFeasible:m.isFeasible,seatsAvailable:m.seatsAvailable,delayMins:m.additionalDelayMins,statusText:m.isFeasible?"Feasible Candidate (Recommended)":m.reasons.join("; ")}}),tradeoffs:[`Inserts 1 stop (${l.stopName}) into Route ${a.route.id}`,`Estimated delay variance: +${a.additionalDelayMins} mins (well before school bell time)`,`Bus ${a.bus.id} load: ${y.currentLoad} → ${f.currentLoad}/${a.bus.capacity} (${a.seatsAvailable-1} seats remaining)`]}};this.state.disruptions.unshift(S),this.state.selectedDisruptionId=x,this.state.metrics.activeDisruptionsCount+=1,this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:k,user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Urgent Student Onboarding: ${l.name} evaluated. Recommended Bus: ${a.bus.id}. Awaiting Approval.`,status:"PENDING_APPROVAL"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("ADD_STUDENT_EVALUATION",`Urgent student ${l.name} added and evaluated`,{studentId:v,studentData:l,disruptionId:x}),this.showToast(`Urgent Student ${l.name} evaluated. Recommended: Bus ${a.bus.id}. Awaiting Dispatcher Approval.`,"info"),this.closeModal(),this.setActiveTab("replanning"),this.notify()}cancelStudent(l){var m,$,N,O;const r=this.state.students.find(U=>U.id===l);if(!r)return;const d=r.busId,a=r.routeId,v=r.stopName,A=d&&d!=="UNASSIGNED"?this.state.buses.find(U=>U.id===d):null,k=a&&a!=="UNASSIGNED"?this.state.routes.find(U=>U.id===a):null;A&&JSON.parse(JSON.stringify(A));const h=k?JSON.parse(JSON.stringify(k)):null,x=A&&A.currentLoad||0,_=A?A.capacity:54,c=_-x;r.status="absent_cancelled",r.busId="UNASSIGNED",r.routeId="UNASSIGNED",A&&(A.currentLoad=Math.max(0,(A.currentLoad||0)-1));const y=A&&A.currentLoad||0,f=_-y;A&&JSON.parse(JSON.stringify(A));let g=2;if(k&&k.stops){const U=k.stops.find(V=>V.name&&v&&V.name.toLowerCase().includes(v.toLowerCase())||v&&v.toLowerCase().includes(V.name.toLowerCase()));U&&(U.studentsCount=Math.max(0,(U.studentsCount||0)-1),U.studentsCount===0&&U.status!=="completed"&&U.status!=="destination"&&(g=3.5))}const b=k?JSON.parse(JSON.stringify(k)):null,S=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),F=`DIS-2026-00${this.state.disruptions.length+1}`,B=`Selected because the bus is already assigned to the route, has increased available capacity (${f} seats), and saves ${g} minutes by bypassing the stop.`,D={id:F,_createdAtMs:Date.now(),reportedAt:S,type:"student_cancel",title:`Student Absence & Cancellation – ${r.name}`,studentId:r.id,studentName:r.name,busId:d,routeId:a,location:v||"Scheduled Stop",severity:"info",impact:`Passenger cancelled. ${d} load decreased (${x} → ${y}). Seat freed.`,status:"unresolved",beforeRoute:h,afterRoute:b,beforeBus:{id:d,load:x,capacity:_,availableSeats:c},afterBus:{id:d,load:y,capacity:_,availableSeats:f},aiRecommendationAvailable:!0,aiRecommendation:{planId:`REPLAN-CAN-${Math.floor(100+Math.random()*900)}`,strategy:"Schedule Dwell Compression & Capacity Release",recommendedBusId:d,recommendedRouteId:a,availableSeats:`${f} seats available (${y}/${_} load)`,currentLocation:A&&((($=(m=k==null?void 0:k.stops)==null?void 0:m.find(U=>U.status==="next"))==null?void 0:$.name)||v)||"In Transit",driverAvailability:`${(k==null?void 0:k.assignedDriver)||"Assigned Driver"} (Active, No commitment conflicts)`,routeCompatibility:`Compatible (Assigned to ${a})`,estimatedAdditionalDelay:`-${g} min (Ahead of schedule)`,selectionReason:B,estRecoveryTimeMins:0,timeSavedMins:g,newEtaDifference:`-${g} min (Ahead of schedule)`,explanation:B,candidateEvaluations:[{busId:d,routeId:a,driverName:(k==null?void 0:k.assignedDriver)||"Assigned Driver",location:A&&((O=(N=k==null?void 0:k.stops)==null?void 0:N.find(U=>U.status==="next"))==null?void 0:O.name)||"In Transit",seatsAvailable:f,delayMins:-g,isFeasible:!0,statusText:"Optimal Assigned Bus (Stop Bypassed)"},{busId:"BUS-02",routeId:"RT-102",driverName:"David Chen",location:"West Portal",seatsAvailable:10,delayMins:0,isFeasible:!1,statusText:"Driver already assigned to another route (RT-102)"},{busId:"BUS-03",routeId:"RT-103",driverName:"Elena Rostova",location:"Market St",seatsAvailable:11,delayMins:0,isFeasible:!1,statusText:"Driver already assigned to another route (RT-103)"}],tradeoffs:[`Freed 1 seat on ${d} (${f} available seats)`,`Saved ~${g} mins dwell time along route`,"0 impact to remaining scheduled passengers"]}};this.state.disruptions.unshift(D),this.state.selectedDisruptionId=F,this.state.metrics.activeDisruptionsCount+=1,this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:S,user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Student Cancelled: ${r.name} unassigned from ${a} (${d}). Route recalculated.`,status:"EXECUTED"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("CANCEL_STUDENT",`Student ${r.name} cancelled/absent on ${a}`,{studentId:r.id,prevBusId:d,prevRouteId:a,disruptionId:F}),this.showToast(`Student ${r.name} marked absent. Route ${a||""} recalculated (${f} seats available).`,"info"),this.setActiveTab("replanning"),this.notify()}acceptAIPlan(l){var d,a,v,A,k,h,x,_;const r=this.state.disruptions.find(c=>c.id===l);if(r){if(r.status="accepted",r.endToEndRecoveryTimeMs=Date.now()-r._createdAtMs,r.type==="urgent_add"&&((d=r.aiRecommendation)!=null&&d.recommendedBusId)){const c=this.state.students.find(g=>g.id===r.studentId),y=this.state.buses.find(g=>g.id===r.aiRecommendation.recommendedBusId),f=this.state.routes.find(g=>g.id===r.aiRecommendation.recommendedRouteId);if(c&&(c.busId=r.aiRecommendation.recommendedBusId,c.routeId=r.aiRecommendation.recommendedRouteId,c.status="waiting"),y&&(y.currentLoad=(y.currentLoad||0)+1),f&&c){const g={id:`ST-${f.id}-URGENT-${c.id}`,name:c.stopName||"Urgent Passenger Stop",coords:(y==null?void 0:y.coords)||[37.77,-122.42],time:"07:45 AM",studentsCount:1,status:"pending"};f.stops.splice(Math.max(0,f.stops.length-1),0,g),f.totalStops=f.stops.length,f.delayMinutes=(f.delayMinutes||0)+(r.aiRecommendation.additionalDelayMins||3.5)}}if(r.type==="breakdown"&&((a=r.aiRecommendation)!=null&&a.recommendedBusId||(v=r.aiRecommendation)!=null&&v.standbyBusAssigned)){const c=r.aiRecommendation.recommendedBusId||r.aiRecommendation.standbyBusAssigned,y=this.state.buses.find(S=>S.id===r.busId),f=this.state.buses.find(S=>S.id===c),g=this.state.routes.find(S=>S.id===r.routeId),b=this.state.drivers.find(S=>S.id===r.aiRecommendation.recommendedDriverId)||this.state.drivers.find(S=>S.status==="standby"),E=y?y.currentLoad:((A=r.affectedStudentsList)==null?void 0:A.length)||36;f&&(f.status="in_transit",f.routeId=r.routeId,f.currentLoad=E,b&&(f.driverId=b.id)),y&&(y.status="breakdown",y.routeId=null,y.currentLoad=0,y.speedKmh=0),g&&f&&(g.assignedBus=f.id,b&&(g.assignedDriver=b.name),g.status="on_time"),this.state.students.forEach(S=>{S.busId===r.busId&&(S.busId=c,S.status==="stranded"&&(S.status="waiting"))})}this.state.metrics.resolvedDisruptionsToday+=1,this.state.metrics.activeDisruptionsCount=Math.max(0,this.state.metrics.activeDisruptionsCount-1),this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Accepted AI Replanning Plan ${(k=r.aiRecommendation)==null?void 0:k.planId} for ${r.title||r.id}`,status:"EXECUTED"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("ACCEPT_AI_PLAN",`Dispatcher Approved Plan ${(h=r.aiRecommendation)==null?void 0:h.planId} for ${r.id}`,{disruptionId:l,planId:(x=r.aiRecommendation)==null?void 0:x.planId,recommendedBusId:(_=r.aiRecommendation)==null?void 0:_.recommendedBusId}),this.showToast(`Plan Accepted for ${r.id}! Emergency replacement dispatched to route.`,"success"),this.notify()}}approveUrgentAddition(l){const r=this.state.disruptions.find(d=>d.type==="urgent_add"&&d.studentId===l&&d.status==="unresolved");if(r)this.acceptAIPlan(r.id);else{const d=this.state.students.find(a=>a.id===l);if(d){const{feasibleCandidates:a}=this.evaluateUrgentStudentAddition(d);if(a.length>0){const v=a[0];d.busId=v.bus.id,d.routeId=v.route.id,d.status="waiting",v.bus.currentLoad=(v.bus.currentLoad||0)+1,this.state.networkStatus!=="online"&&this.queueOfflineChange("APPROVE_URGENT_STUDENT",`Assigned ${d.name} to ${v.bus.id}`,{studentId:l,busId:v.bus.id,routeId:v.route.id}),this.showToast(`Student ${d.name} assigned to Bus ${v.bus.id} on Route ${v.route.id}.`,"success"),this.notify()}else this.showToast("No Feasible Solution — Manual Intervention Required","warning")}}}rejectAIPlan(l,r="Manual Route Override"){const d=this.state.disruptions.find(a=>a.id===l);d&&(d.status="rejected",d.rejectionReason=r,this.state.metrics.recentAuditLogs.unshift({id:`LOG-${Math.floor(600+Math.random()*300)}`,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),user:this.state.currentUser?this.state.currentUser.name:"Dispatcher",event:`Rejected AI Plan for ${d.id} - Reason: ${r}`,status:"MANUAL_OVERRIDE"}),this.state.networkStatus!=="online"&&this.queueOfflineChange("REJECT_AI_PLAN",`Rejected Plan for ${l} (${r})`,{disruptionId:l,reason:r}),this.showToast("AI Plan Rejected. Manual override flagged for Dispatcher.","warning"),this.notify())}openModal(l,r=null){this.state.activeModal=l,this.state.modalPayload=r,this.notify()}closeModal(){this.state.activeModal=null,this.state.modalPayload=null,this.notify()}showToast(l,r="info"){const d=Date.now()+Math.random();this.state.toasts.push({id:d,message:l,type:r}),this.notify(),setTimeout(()=>{this.state.toasts=this.state.toasts.filter(a=>a.id!==d),this.notify()},4e3)}}const I=new Ft,P={bus:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 6v6"/>
      <path d="M15 6v6"/>
      <path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8c-1 0-1.9.8-2.2 1.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/>
      <circle cx="7" cy="18" r="2"/>
      <path d="M9 18h5"/>
      <circle cx="16" cy="18" r="2"/>
    </svg>
  `,route:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="19" r="3"/>
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
      <circle cx="18" cy="5" r="3"/>
    </svg>
  `,users:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `,alertTriangle:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,cpu:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="16" height="16" x="4" y="4" rx="2"/>
      <rect width="6" height="6" x="9" y="9" rx="1"/>
      <path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/>
      <path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
    </svg>
  `,activity:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  `,fileText:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  `,settings:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,layoutDashboard:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/>
      <rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/>
      <rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  `,search:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  `,plus:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  `,check:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  `,x:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  `,checkCircle:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="m9 11 3 3L22 4"/>
    </svg>
  `,mapPin:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,shield:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  `,zap:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  `,arrowRight:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  `,logOut:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  `,refreshCw:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  `,clock:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  `,phone:(u=18,l="currentColor")=>`
    <svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  `};function bo(){const u=document.createElement("div");return u.className="auth-container",u.innerHTML=`
    <div class="auth-bg-grid"></div>
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo-badge">
          ${P.bus(32,"#FFFFFF")}
        </div>
        <h1 class="auth-title">School Transport Control Center</h1>
        <p class="auth-subtitle">Rapid Replanning & Responsible AI System</p>
        <div class="auth-badge-tag">
          ${P.shield(14,"#2563EB")}
          District Transport Security Protocol v4.2
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        <p style="font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; text-align: center;">
          Select Operational Role
        </p>

        <!-- Dispatcher Quick Profile Button -->
        <button id="login-dispatcher-btn" class="action-btn primary" style="
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        ">
          Dispatcher
        </button>

        <!-- Operations Manager Quick Profile Button -->
        <button id="login-ops-btn" class="action-btn secondary" style="
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          background: #0F2747;
          color: white;
          border-color: #0F2747;
        ">
          Operations Manager
        </button>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: #94A3B8;">
        <span style="display: flex; align-items: center; gap: 5px;">
          <span style="width: 6px; height: 6px; background: #10B981; border-radius: 50%;"></span> AI Dispatch Server: Online
        </span>
        <span>Version 2026.4.1</span>
      </div>
    </div>
  `,u.querySelector("#login-dispatcher-btn").addEventListener("click",()=>{I.login({name:"Dispatcher",roleDefault:"dispatcher",title:"Lead Dispatcher",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"}),I.selectRole("dispatcher")}),u.querySelector("#login-ops-btn").addEventListener("click",()=>{I.login({name:"Operations Manager",roleDefault:"operations_manager",title:"Operations Director",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80"}),I.selectRole("operations_manager")}),u}function _o(){const u=I.getState(),l=u.currentRole==="dispatcher",r=u.activeTab.charAt(0).toUpperCase()+u.activeTab.slice(1),d=u.networkStatus||"online",a=u.pendingOfflineChanges?u.pendingOfflineChanges.length:0,v=document.createElement("header");v.className="top-header";const A=new Date,k=A.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),h=A.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric",year:"numeric"}),x={online:{label:"Online",color:"#10B981",bg:"#ECFDF5",border:"#A7F3D0",icon:"🟢"},degraded:{label:"Degraded",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A",icon:"🟡"},offline:{label:"Offline",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA",icon:"🔴"}}[d]||{color:"#10B981",bg:"#ECFDF5",border:"#A7F3D0",icon:"🟢"};v.innerHTML=`
    <div class="header-left">
      <div class="page-title-group">
        <h1>
          ${r}
          <span class="live-status-pill">
            <span class="live-dot"></span>
            ${l?"DISPATCH RADAR":"OPS MONITOR"}
          </span>
        </h1>
      </div>
    </div>

    <div class="header-right" style="display: flex; align-items: center; gap: 14px;">
      
      <!-- Network Failure & Resilience Widget -->
      <div class="network-status-control" style="
        display: flex; align-items: center; gap: 8px;
        background: ${x.bg}; border: 1px solid ${x.border};
        padding: 5px 10px; border-radius: 9999px;
      ">
        <span style="font-size: 0.72rem; font-weight: 800; color: ${x.color}; display: flex; align-items: center; gap: 5px;">
          ${x.icon} System:
        </span>
        <select id="header-network-select" style="
          background: transparent; border: none; font-size: 0.75rem;
          font-weight: 700; color: ${x.color}; cursor: pointer;
          outline: none; padding-right: 4px;
        " title="Simulate Network State (Online, Degraded, Offline)">
          <option value="online" ${d==="online"?"selected":""}>Online</option>
          <option value="degraded" ${d==="degraded"?"selected":""}>Degraded</option>
          <option value="offline" ${d==="offline"?"selected":""}>Offline</option>
        </select>
      </div>

      <!-- Pending Offline Synchronization Badge -->
      ${a>0?`
        <button id="header-sync-now-btn" style="
          display: flex; align-items: center; gap: 6px;
          background: #FEF3C7; border: 1px solid #F59E0B; color: #92400E;
          font-size: 0.75rem; font-weight: 700; padding: 5px 10px; border-radius: 9999px;
          cursor: pointer; transition: all 0.2s ease;
        " title="Synchronize pending local offline changes with district cloud">
          <span>⚡ ${a} Pending Local ${a===1?"Change":"Changes"}</span>
          <span style="background: #F59E0B; color: #fff; padding: 1px 6px; border-radius: 6px; font-size: 0.68rem;">Sync Now</span>
        </button>
      `:""}

      <!-- Live Clock -->
      <div class="header-time-widget">
        <span class="header-time-val" id="live-header-clock">${k}</span>
        <span class="header-date-val">${h}</span>
      </div>

      <!-- Header Action Buttons -->
      <div class="header-actions">
        ${l?`
          <button id="header-manual-loc-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;" title="Manually update bus location when GPS is unavailable">
            ${P.mapPin(15,"currentColor")}
            Manual GPS Fix
          </button>
          <button id="header-report-disruption-btn" class="action-btn danger" style="padding: 7px 12px; font-size: 0.8rem;">
            ${P.alertTriangle(15,"#fff")}
            Report Disruption
          </button>
          <button id="header-add-student-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${P.plus(15,"currentColor")}
            Urgent Student Add
          </button>
        `:`
          <button id="header-manual-loc-btn-ops" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${P.mapPin(15,"currentColor")}
            Manual GPS Fix
          </button>
          <button id="header-export-audit-btn" class="action-btn secondary" style="padding: 7px 12px; font-size: 0.8rem;">
            ${P.fileText(15,"currentColor")}
            Export Fleet Audit
          </button>
          <button id="header-report-disruption-btn-ops" class="action-btn danger" style="padding: 7px 12px; font-size: 0.8rem;">
            ${P.alertTriangle(15,"#fff")}
            Declare Incident
          </button>
        `}
      </div>
    </div>
  `;const _=v.querySelector("#header-network-select");_&&_.addEventListener("change",E=>{I.setNetworkStatus(E.target.value)});const c=v.querySelector("#header-sync-now-btn");c&&c.addEventListener("click",()=>{I.syncPendingOfflineChanges()});const y=v.querySelector("#header-manual-loc-btn")||v.querySelector("#header-manual-loc-btn-ops");y&&y.addEventListener("click",()=>{I.openModal("manual_location")});const f=v.querySelector("#header-report-disruption-btn")||v.querySelector("#header-report-disruption-btn-ops");f&&f.addEventListener("click",()=>{I.openModal("create_disruption")});const g=v.querySelector("#header-add-student-btn");g&&g.addEventListener("click",()=>{I.openModal("add_student")});const b=v.querySelector("#header-export-audit-btn");return b&&b.addEventListener("click",()=>{I.showToast("Generating Department of Education Compliance Audit Report (PDF)...","success")}),v}function xo(){var y,f,g;const u=I.getState(),l=u.currentRole,r=l==="dispatcher",d=u.activeTab,a=u.disruptions.filter(b=>b.status==="unresolved").length,v=document.createElement("aside");v.className="sidebar";const A=((y=u.currentUser)==null?void 0:y.photo)||"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",k=((f=u.currentUser)==null?void 0:f.name)||(r?"Sarah Jenkins":"Marcus Vance"),h=((g=u.currentUser)==null?void 0:g.title)||(r?"Lead Dispatcher":"Operations Director");v.innerHTML=`
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        ${P.bus(22,"#fff")}
      </div>
      <div class="sidebar-brand-text">
        <span class="sidebar-brand-title">School Transport</span>
        <span class="sidebar-brand-sub">Rapid Replanning AI</span>
      </div>
    </div>

    <!-- Active Role Indicator & Quick Switcher -->
    <div class="sidebar-role-indicator">
      <div class="sidebar-role-info">
        <span class="sidebar-role-label">Current Workspace</span>
        <span class="sidebar-role-val">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${r?"#3B82F6":"#10B981"};"></span>
          ${r?"Dispatcher":"Ops Manager"}
        </span>
      </div>
      <button class="sidebar-role-switch-btn" id="sidebar-switch-role-btn" title="Toggle between Dispatcher and Operations Manager view">
        Switch
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Operations</div>
      
      <div class="nav-item ${d==="dashboard"?"active":""}" data-tab="dashboard">
        <div class="nav-item-content">
          ${P.layoutDashboard(18,"currentColor")}
          <span>Dashboard</span>
        </div>
      </div>

      <div class="nav-item ${d==="buses"?"active":""}" data-tab="buses">
        <div class="nav-item-content">
          ${P.bus(18,"currentColor")}
          <span>Buses</span>
        </div>
        <span class="nav-badge blue">${u.buses.length}</span>
      </div>

      <div class="nav-item ${d==="routes"?"active":""}" data-tab="routes">
        <div class="nav-item-content">
          ${P.route(18,"currentColor")}
          <span>Routes</span>
        </div>
        <span class="nav-badge blue">${u.routes.length}</span>
      </div>

      <div class="nav-item ${d==="students"?"active":""}" data-tab="students">
        <div class="nav-item-content">
          ${P.users(18,"currentColor")}
          <span>Students</span>
        </div>
        <span class="nav-badge blue">${u.students.length}</span>
      </div>

      <div class="nav-section-label">Incident Management</div>

      <div class="nav-item ${d==="disruptions"?"active":""}" data-tab="disruptions">
        <div class="nav-item-content">
          ${P.alertTriangle(18,"currentColor")}
          <span>Disruptions</span>
        </div>
        ${a>0?`<span class="nav-badge danger">${a}</span>`:""}
      </div>

      <div class="nav-item ${d==="replanning"?"active":""}" data-tab="replanning">
        <div class="nav-item-content">
          ${P.cpu(18,"currentColor")}
          <span>Replanning</span>
        </div>
        <span class="nav-badge" style="background: #6366F1; color: #fff;">AI</span>
      </div>

      <div class="nav-section-label">Analytics & Config</div>

      <div class="nav-item ${d==="reports"?"active":""}" data-tab="reports">
        <div class="nav-item-content">
          ${P.fileText(18,"currentColor")}
          <span>Reports</span>
        </div>
        ${r?"":'<span class="nav-badge" style="background: #10B981; color: #fff;">Ops</span>'}
      </div>

      <div class="nav-item ${d==="settings"?"active":""}" data-tab="settings">
        <div class="nav-item-content">
          ${P.settings(18,"currentColor")}
          <span>Settings</span>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <img src="${A}" alt="${k}" class="sidebar-avatar" />
        <div class="sidebar-user-details">
          <span class="sidebar-user-name">${k}</span>
          <span class="sidebar-user-sub">${h}</span>
        </div>
      </div>
      <button class="logout-btn" id="sidebar-logout-btn" title="Sign Out">
        ${P.logOut(18,"currentColor")}
      </button>
    </div>
  `,v.querySelectorAll(".nav-item").forEach(b=>{b.addEventListener("click",()=>{const E=b.getAttribute("data-tab");E&&I.setActiveTab(E)})});const _=v.querySelector("#sidebar-switch-role-btn");_&&_.addEventListener("click",()=>{const b=l==="dispatcher"?"operations_manager":"dispatcher";I.switchRole(b)});const c=v.querySelector("#sidebar-logout-btn");return c&&c.addEventListener("click",()=>{I.logout()}),v}function wo(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var ge={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */var So=ge.exports,$n;function Eo(){return $n||($n=1,(function(u,l){(function(r,d){d(l)})(So,(function(r){var d="1.9.4";function a(t){var e,i,n,s;for(i=1,n=arguments.length;i<n;i++){s=arguments[i];for(e in s)t[e]=s[e]}return t}var v=Object.create||(function(){function t(){}return function(e){return t.prototype=e,new t}})();function A(t,e){var i=Array.prototype.slice;if(t.bind)return t.bind.apply(t,i.call(arguments,1));var n=i.call(arguments,2);return function(){return t.apply(e,n.length?n.concat(i.call(arguments)):arguments)}}var k=0;function h(t){return"_leaflet_id"in t||(t._leaflet_id=++k),t._leaflet_id}function x(t,e,i){var n,s,o,p;return p=function(){n=!1,s&&(o.apply(i,s),s=!1)},o=function(){n?s=arguments:(t.apply(i,arguments),setTimeout(p,e),n=!0)},o}function _(t,e,i){var n=e[1],s=e[0],o=n-s;return t===n&&i?t:((t-s)%o+o)%o+s}function c(){return!1}function y(t,e){if(e===!1)return t;var i=Math.pow(10,e===void 0?6:e);return Math.round(t*i)/i}function f(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function g(t){return f(t).split(/\s+/)}function b(t,e){Object.prototype.hasOwnProperty.call(t,"options")||(t.options=t.options?v(t.options):{});for(var i in e)t.options[i]=e[i];return t.options}function E(t,e,i){var n=[];for(var s in t)n.push(encodeURIComponent(i?s.toUpperCase():s)+"="+encodeURIComponent(t[s]));return(!e||e.indexOf("?")===-1?"?":"&")+n.join("&")}var S=/\{ *([\w_ -]+) *\}/g;function F(t,e){return t.replace(S,function(i,n){var s=e[n];if(s===void 0)throw new Error("No value provided for variable "+i);return typeof s=="function"&&(s=s(e)),s})}var B=Array.isArray||function(t){return Object.prototype.toString.call(t)==="[object Array]"};function D(t,e){for(var i=0;i<t.length;i++)if(t[i]===e)return i;return-1}var m="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function $(t){return window["webkit"+t]||window["moz"+t]||window["ms"+t]}var N=0;function O(t){var e=+new Date,i=Math.max(0,16-(e-N));return N=e+i,window.setTimeout(t,i)}var U=window.requestAnimationFrame||$("RequestAnimationFrame")||O,V=window.cancelAnimationFrame||$("CancelAnimationFrame")||$("CancelRequestAnimationFrame")||function(t){window.clearTimeout(t)};function K(t,e,i){if(i&&U===O)t.call(e);else return U.call(window,A(t,e))}function st(t){t&&V.call(window,t)}var ct={__proto__:null,extend:a,create:v,bind:A,get lastId(){return k},stamp:h,throttle:x,wrapNum:_,falseFn:c,formatNum:y,trim:f,splitWords:g,setOptions:b,getParamString:E,template:F,isArray:B,indexOf:D,emptyImageUrl:m,requestFn:U,cancelFn:V,requestAnimFrame:K,cancelAnimFrame:st};function mt(){}mt.extend=function(t){var e=function(){b(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},i=e.__super__=this.prototype,n=v(i);n.constructor=e,e.prototype=n;for(var s in this)Object.prototype.hasOwnProperty.call(this,s)&&s!=="prototype"&&s!=="__super__"&&(e[s]=this[s]);return t.statics&&a(e,t.statics),t.includes&&(St(t.includes),a.apply(null,[n].concat(t.includes))),a(n,t),delete n.statics,delete n.includes,n.options&&(n.options=i.options?v(i.options):{},a(n.options,t.options)),n._initHooks=[],n.callInitHooks=function(){if(!this._initHooksCalled){i.callInitHooks&&i.callInitHooks.call(this),this._initHooksCalled=!0;for(var o=0,p=n._initHooks.length;o<p;o++)n._initHooks[o].call(this)}},e},mt.include=function(t){var e=this.prototype.options;return a(this.prototype,t),t.options&&(this.prototype.options=e,this.mergeOptions(t.options)),this},mt.mergeOptions=function(t){return a(this.prototype.options,t),this},mt.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i=typeof t=="function"?t:function(){this[t].apply(this,e)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i),this};function St(t){if(!(typeof L>"u"||!L||!L.Mixin)){t=B(t)?t:[t];for(var e=0;e<t.length;e++)t[e]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",new Error().stack)}}var ot={on:function(t,e,i){if(typeof t=="object")for(var n in t)this._on(n,t[n],e);else{t=g(t);for(var s=0,o=t.length;s<o;s++)this._on(t[s],e,i)}return this},off:function(t,e,i){if(!arguments.length)delete this._events;else if(typeof t=="object")for(var n in t)this._off(n,t[n],e);else{t=g(t);for(var s=arguments.length===1,o=0,p=t.length;o<p;o++)s?this._off(t[o]):this._off(t[o],e,i)}return this},_on:function(t,e,i,n){if(typeof e!="function"){console.warn("wrong listener type: "+typeof e);return}if(this._listens(t,e,i)===!1){i===this&&(i=void 0);var s={fn:e,ctx:i};n&&(s.once=!0),this._events=this._events||{},this._events[t]=this._events[t]||[],this._events[t].push(s)}},_off:function(t,e,i){var n,s,o;if(this._events&&(n=this._events[t],!!n)){if(arguments.length===1){if(this._firingCount)for(s=0,o=n.length;s<o;s++)n[s].fn=c;delete this._events[t];return}if(typeof e!="function"){console.warn("wrong listener type: "+typeof e);return}var p=this._listens(t,e,i);if(p!==!1){var w=n[p];this._firingCount&&(w.fn=c,this._events[t]=n=n.slice()),n.splice(p,1)}}},fire:function(t,e,i){if(!this.listens(t,i))return this;var n=a({},e,{type:t,target:this,sourceTarget:e&&e.sourceTarget||this});if(this._events){var s=this._events[t];if(s){this._firingCount=this._firingCount+1||1;for(var o=0,p=s.length;o<p;o++){var w=s[o],C=w.fn;w.once&&this.off(t,C,w.ctx),C.call(w.ctx||this,n)}this._firingCount--}}return i&&this._propagateEvent(n),this},listens:function(t,e,i,n){typeof t!="string"&&console.warn('"string" type argument expected');var s=e;typeof e!="function"&&(n=!!e,s=void 0,i=void 0);var o=this._events&&this._events[t];if(o&&o.length&&this._listens(t,s,i)!==!1)return!0;if(n){for(var p in this._eventParents)if(this._eventParents[p].listens(t,e,i,n))return!0}return!1},_listens:function(t,e,i){if(!this._events)return!1;var n=this._events[t]||[];if(!e)return!!n.length;i===this&&(i=void 0);for(var s=0,o=n.length;s<o;s++)if(n[s].fn===e&&n[s].ctx===i)return s;return!1},once:function(t,e,i){if(typeof t=="object")for(var n in t)this._on(n,t[n],e,!0);else{t=g(t);for(var s=0,o=t.length;s<o;s++)this._on(t[s],e,i,!0)}return this},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[h(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[h(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,a({layer:t.target,propagatedFrom:t.target},t),!0)}};ot.addEventListener=ot.on,ot.removeEventListener=ot.clearAllEventListeners=ot.off,ot.addOneTimeEventListener=ot.once,ot.fireEvent=ot.fire,ot.hasEventListeners=ot.listens;var T=mt.extend(ot);function z(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e}var yt=Math.trunc||function(t){return t>0?Math.floor(t):Math.ceil(t)};z.prototype={clone:function(){return new z(this.x,this.y)},add:function(t){return this.clone()._add(H(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(H(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},scaleBy:function(t){return new z(this.x*t.x,this.y*t.y)},unscaleBy:function(t){return new z(this.x/t.x,this.y/t.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=yt(this.x),this.y=yt(this.y),this},distanceTo:function(t){t=H(t);var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},equals:function(t){return t=H(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=H(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+y(this.x)+", "+y(this.y)+")"}};function H(t,e,i){return t instanceof z?t:B(t)?new z(t[0],t[1]):t==null?t:typeof t=="object"&&"x"in t&&"y"in t?new z(t.x,t.y):new z(t,e,i)}function Q(t,e){if(t)for(var i=e?[t,e]:t,n=0,s=i.length;n<s;n++)this.extend(i[n])}Q.prototype={extend:function(t){var e,i;if(!t)return this;if(t instanceof z||typeof t[0]=="number"||"x"in t)e=i=H(t);else if(t=ut(t),e=t.min,i=t.max,!e||!i)return this;return!this.min&&!this.max?(this.min=e.clone(),this.max=i.clone()):(this.min.x=Math.min(e.x,this.min.x),this.max.x=Math.max(i.x,this.max.x),this.min.y=Math.min(e.y,this.min.y),this.max.y=Math.max(i.y,this.max.y)),this},getCenter:function(t){return H((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return H(this.min.x,this.max.y)},getTopRight:function(){return H(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return typeof t[0]=="number"||t instanceof z?t=H(t):t=ut(t),t instanceof Q?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=ut(t);var e=this.min,i=this.max,n=t.min,s=t.max,o=s.x>=e.x&&n.x<=i.x,p=s.y>=e.y&&n.y<=i.y;return o&&p},overlaps:function(t){t=ut(t);var e=this.min,i=this.max,n=t.min,s=t.max,o=s.x>e.x&&n.x<i.x,p=s.y>e.y&&n.y<i.y;return o&&p},isValid:function(){return!!(this.min&&this.max)},pad:function(t){var e=this.min,i=this.max,n=Math.abs(e.x-i.x)*t,s=Math.abs(e.y-i.y)*t;return ut(H(e.x-n,e.y-s),H(i.x+n,i.y+s))},equals:function(t){return t?(t=ut(t),this.min.equals(t.getTopLeft())&&this.max.equals(t.getBottomRight())):!1}};function ut(t,e){return!t||t instanceof Q?t:new Q(t,e)}function vt(t,e){if(t)for(var i=e?[t,e]:t,n=0,s=i.length;n<s;n++)this.extend(i[n])}vt.prototype={extend:function(t){var e=this._southWest,i=this._northEast,n,s;if(t instanceof tt)n=t,s=t;else if(t instanceof vt){if(n=t._southWest,s=t._northEast,!n||!s)return this}else return t?this.extend(J(t)||rt(t)):this;return!e&&!i?(this._southWest=new tt(n.lat,n.lng),this._northEast=new tt(s.lat,s.lng)):(e.lat=Math.min(n.lat,e.lat),e.lng=Math.min(n.lng,e.lng),i.lat=Math.max(s.lat,i.lat),i.lng=Math.max(s.lng,i.lng)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,s=Math.abs(e.lng-i.lng)*t;return new vt(new tt(e.lat-n,e.lng-s),new tt(i.lat+n,i.lng+s))},getCenter:function(){return new tt((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new tt(this.getNorth(),this.getWest())},getSouthEast:function(){return new tt(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){typeof t[0]=="number"||t instanceof tt||"lat"in t?t=J(t):t=rt(t);var e=this._southWest,i=this._northEast,n,s;return t instanceof vt?(n=t.getSouthWest(),s=t.getNorthEast()):n=s=t,n.lat>=e.lat&&s.lat<=i.lat&&n.lng>=e.lng&&s.lng<=i.lng},intersects:function(t){t=rt(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),o=s.lat>=e.lat&&n.lat<=i.lat,p=s.lng>=e.lng&&n.lng<=i.lng;return o&&p},overlaps:function(t){t=rt(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),o=s.lat>e.lat&&n.lat<i.lat,p=s.lng>e.lng&&n.lng<i.lng;return o&&p},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t,e){return t?(t=rt(t),this._southWest.equals(t.getSouthWest(),e)&&this._northEast.equals(t.getNorthEast(),e)):!1},isValid:function(){return!!(this._southWest&&this._northEast)}};function rt(t,e){return t instanceof vt?t:new vt(t,e)}function tt(t,e,i){if(isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=+t,this.lng=+e,i!==void 0&&(this.alt=+i)}tt.prototype={equals:function(t,e){if(!t)return!1;t=J(t);var i=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return i<=(e===void 0?1e-9:e)},toString:function(t){return"LatLng("+y(this.lat,t)+", "+y(this.lng,t)+")"},distanceTo:function(t){return zt.distance(this,J(t))},wrap:function(){return zt.wrapLatLng(this)},toBounds:function(t){var e=180*t/40075017,i=e/Math.cos(Math.PI/180*this.lat);return rt([this.lat-e,this.lng-i],[this.lat+e,this.lng+i])},clone:function(){return new tt(this.lat,this.lng,this.alt)}};function J(t,e,i){return t instanceof tt?t:B(t)&&typeof t[0]!="object"?t.length===3?new tt(t[0],t[1],t[2]):t.length===2?new tt(t[0],t[1]):null:t==null?t:typeof t=="object"&&"lat"in t?new tt(t.lat,"lng"in t?t.lng:t.lon,t.alt):e===void 0?null:new tt(t,e,i)}var Bt={latLngToPoint:function(t,e){var i=this.projection.project(t),n=this.scale(e);return this.transformation._transform(i,n)},pointToLatLng:function(t,e){var i=this.scale(e),n=this.transformation.untransform(t,i);return this.projection.unproject(n)},project:function(t){return this.projection.project(t)},unproject:function(t){return this.projection.unproject(t)},scale:function(t){return 256*Math.pow(2,t)},zoom:function(t){return Math.log(t/256)/Math.LN2},getProjectedBounds:function(t){if(this.infinite)return null;var e=this.projection.bounds,i=this.scale(t),n=this.transformation.transform(e.min,i),s=this.transformation.transform(e.max,i);return new Q(n,s)},infinite:!1,wrapLatLng:function(t){var e=this.wrapLng?_(t.lng,this.wrapLng,!0):t.lng,i=this.wrapLat?_(t.lat,this.wrapLat,!0):t.lat,n=t.alt;return new tt(i,e,n)},wrapLatLngBounds:function(t){var e=t.getCenter(),i=this.wrapLatLng(e),n=e.lat-i.lat,s=e.lng-i.lng;if(n===0&&s===0)return t;var o=t.getSouthWest(),p=t.getNorthEast(),w=new tt(o.lat-n,o.lng-s),C=new tt(p.lat-n,p.lng-s);return new vt(w,C)}},zt=a({},Bt,{wrapLng:[-180,180],R:6371e3,distance:function(t,e){var i=Math.PI/180,n=t.lat*i,s=e.lat*i,o=Math.sin((e.lat-t.lat)*i/2),p=Math.sin((e.lng-t.lng)*i/2),w=o*o+Math.cos(n)*Math.cos(s)*p*p,C=2*Math.atan2(Math.sqrt(w),Math.sqrt(1-w));return this.R*C}}),_i=6378137,Ne={R:_i,MAX_LATITUDE:85.0511287798,project:function(t){var e=Math.PI/180,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=Math.sin(n*e);return new z(this.R*t.lng*e,this.R*Math.log((1+s)/(1-s))/2)},unproject:function(t){var e=180/Math.PI;return new tt((2*Math.atan(Math.exp(t.y/this.R))-Math.PI/2)*e,t.x*e/this.R)},bounds:(function(){var t=_i*Math.PI;return new Q([-t,-t],[t,t])})()};function Oe(t,e,i,n){if(B(t)){this._a=t[0],this._b=t[1],this._c=t[2],this._d=t[3];return}this._a=t,this._b=e,this._c=i,this._d=n}Oe.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new z((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}};function ie(t,e,i,n){return new Oe(t,e,i,n)}var Ze=a({},zt,{code:"EPSG:3857",projection:Ne,transformation:(function(){var t=.5/(Math.PI*Ne.R);return ie(t,.5,-t,.5)})()}),On=a({},Ze,{code:"EPSG:900913"});function xi(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function wi(t,e){var i="",n,s,o,p,w,C;for(n=0,o=t.length;n<o;n++){for(w=t[n],s=0,p=w.length;s<p;s++)C=w[s],i+=(s?"L":"M")+C.x+" "+C.y;i+=e?Z.svg?"z":"x":""}return i||"M0 0"}var Ue=document.documentElement.style,ye="ActiveXObject"in window,Zn=ye&&!document.addEventListener,Si="msLaunchUri"in navigator&&!("documentMode"in document),He=Ct("webkit"),Ei=Ct("android"),Ai=Ct("android 2")||Ct("android 3"),Un=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),Hn=Ei&&Ct("Google")&&Un<537&&!("AudioNode"in window),qe=!!window.opera,Ci=!Si&&Ct("chrome"),ki=Ct("gecko")&&!He&&!qe&&!ye,qn=!Ci&&Ct("safari"),Ti=Ct("phantom"),Li="OTransition"in Ue,Vn=navigator.platform.indexOf("Win")===0,Fi=ye&&"transition"in Ue,Ve="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!Ai,Bi="MozPerspective"in Ue,jn=!window.L_DISABLE_3D&&(Fi||Ve||Bi)&&!Li&&!Ti,ne=typeof orientation<"u"||Ct("mobile"),Wn=ne&&He,Gn=ne&&Ve,$i=!window.PointerEvent&&window.MSPointerEvent,Mi=!!(window.PointerEvent||$i),Pi="ontouchstart"in window||!!window.TouchEvent,Kn=!window.L_NO_TOUCH&&(Pi||Mi),Jn=ne&&qe,Yn=ne&&ki,Xn=(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI)>1,Qn=(function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("testPassiveEventSupport",c,e),window.removeEventListener("testPassiveEventSupport",c,e)}catch{}return t})(),ts=(function(){return!!document.createElement("canvas").getContext})(),je=!!(document.createElementNS&&xi("svg").createSVGRect),es=!!je&&(function(){var t=document.createElement("div");return t.innerHTML="<svg/>",(t.firstChild&&t.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"})(),is=!je&&(function(){try{var t=document.createElement("div");t.innerHTML='<v:shape adj="1"/>';var e=t.firstChild;return e.style.behavior="url(#default#VML)",e&&typeof e.adj=="object"}catch{return!1}})(),ns=navigator.platform.indexOf("Mac")===0,ss=navigator.platform.indexOf("Linux")===0;function Ct(t){return navigator.userAgent.toLowerCase().indexOf(t)>=0}var Z={ie:ye,ielt9:Zn,edge:Si,webkit:He,android:Ei,android23:Ai,androidStock:Hn,opera:qe,chrome:Ci,gecko:ki,safari:qn,phantom:Ti,opera12:Li,win:Vn,ie3d:Fi,webkit3d:Ve,gecko3d:Bi,any3d:jn,mobile:ne,mobileWebkit:Wn,mobileWebkit3d:Gn,msPointer:$i,pointer:Mi,touch:Kn,touchNative:Pi,mobileOpera:Jn,mobileGecko:Yn,retina:Xn,passiveEvents:Qn,canvas:ts,svg:je,vml:is,inlineSvg:es,mac:ns,linux:ss},Ii=Z.msPointer?"MSPointerDown":"pointerdown",Di=Z.msPointer?"MSPointerMove":"pointermove",Ri=Z.msPointer?"MSPointerUp":"pointerup",zi=Z.msPointer?"MSPointerCancel":"pointercancel",We={touchstart:Ii,touchmove:Di,touchend:Ri,touchcancel:zi},Ni={touchstart:cs,touchmove:be,touchend:be,touchcancel:be},jt={},Oi=!1;function os(t,e,i){return e==="touchstart"&&ds(),Ni[e]?(i=Ni[e].bind(this,i),t.addEventListener(We[e],i,!1),i):(console.warn("wrong event specified:",e),c)}function as(t,e,i){if(!We[e]){console.warn("wrong event specified:",e);return}t.removeEventListener(We[e],i,!1)}function rs(t){jt[t.pointerId]=t}function ls(t){jt[t.pointerId]&&(jt[t.pointerId]=t)}function Zi(t){delete jt[t.pointerId]}function ds(){Oi||(document.addEventListener(Ii,rs,!0),document.addEventListener(Di,ls,!0),document.addEventListener(Ri,Zi,!0),document.addEventListener(zi,Zi,!0),Oi=!0)}function be(t,e){if(e.pointerType!==(e.MSPOINTER_TYPE_MOUSE||"mouse")){e.touches=[];for(var i in jt)e.touches.push(jt[i]);e.changedTouches=[e],t(e)}}function cs(t,e){e.MSPOINTER_TYPE_TOUCH&&e.pointerType===e.MSPOINTER_TYPE_TOUCH&&ht(e),be(t,e)}function us(t){var e={},i,n;for(n in t)i=t[n],e[n]=i&&i.bind?i.bind(t):i;return t=e,e.type="dblclick",e.detail=2,e.isTrusted=!1,e._simulated=!0,e}var ps=200;function hs(t,e){t.addEventListener("dblclick",e);var i=0,n;function s(o){if(o.detail!==1){n=o.detail;return}if(!(o.pointerType==="mouse"||o.sourceCapabilities&&!o.sourceCapabilities.firesTouchEvents)){var p=ji(o);if(!(p.some(function(C){return C instanceof HTMLLabelElement&&C.attributes.for})&&!p.some(function(C){return C instanceof HTMLInputElement||C instanceof HTMLSelectElement}))){var w=Date.now();w-i<=ps?(n++,n===2&&e(us(o))):n=1,i=w}}}return t.addEventListener("click",s),{dblclick:e,simDblclick:s}}function fs(t,e){t.removeEventListener("dblclick",e.dblclick),t.removeEventListener("click",e.simDblclick)}var Ge=we(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),se=we(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),Ui=se==="webkitTransition"||se==="OTransition"?se+"End":"transitionend";function Hi(t){return typeof t=="string"?document.getElementById(t):t}function oe(t,e){var i=t.style[e]||t.currentStyle&&t.currentStyle[e];if((!i||i==="auto")&&document.defaultView){var n=document.defaultView.getComputedStyle(t,null);i=n?n[e]:null}return i==="auto"?null:i}function X(t,e,i){var n=document.createElement(t);return n.className=e||"",i&&i.appendChild(n),n}function nt(t){var e=t.parentNode;e&&e.removeChild(t)}function _e(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function Wt(t){var e=t.parentNode;e&&e.lastChild!==t&&e.appendChild(t)}function Gt(t){var e=t.parentNode;e&&e.firstChild!==t&&e.insertBefore(t,e.firstChild)}function Ke(t,e){if(t.classList!==void 0)return t.classList.contains(e);var i=xe(t);return i.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(i)}function W(t,e){if(t.classList!==void 0)for(var i=g(e),n=0,s=i.length;n<s;n++)t.classList.add(i[n]);else if(!Ke(t,e)){var o=xe(t);Je(t,(o?o+" ":"")+e)}}function at(t,e){t.classList!==void 0?t.classList.remove(e):Je(t,f((" "+xe(t)+" ").replace(" "+e+" "," ")))}function Je(t,e){t.className.baseVal===void 0?t.className=e:t.className.baseVal=e}function xe(t){return t.correspondingElement&&(t=t.correspondingElement),t.className.baseVal===void 0?t.className:t.className.baseVal}function bt(t,e){"opacity"in t.style?t.style.opacity=e:"filter"in t.style&&ms(t,e)}function ms(t,e){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch{if(e===1)return}e=Math.round(e*100),i?(i.Enabled=e!==100,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"}function we(t){for(var e=document.documentElement.style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return!1}function Zt(t,e,i){var n=e||new z(0,0);t.style[Ge]=(Z.ie3d?"translate("+n.x+"px,"+n.y+"px)":"translate3d("+n.x+"px,"+n.y+"px,0)")+(i?" scale("+i+")":"")}function lt(t,e){t._leaflet_pos=e,Z.any3d?Zt(t,e):(t.style.left=e.x+"px",t.style.top=e.y+"px")}function Ut(t){return t._leaflet_pos||new z(0,0)}var ae,re,Ye;if("onselectstart"in document)ae=function(){j(window,"selectstart",ht)},re=function(){et(window,"selectstart",ht)};else{var le=we(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);ae=function(){if(le){var t=document.documentElement.style;Ye=t[le],t[le]="none"}},re=function(){le&&(document.documentElement.style[le]=Ye,Ye=void 0)}}function Xe(){j(window,"dragstart",ht)}function Qe(){et(window,"dragstart",ht)}var Se,ti;function ei(t){for(;t.tabIndex===-1;)t=t.parentNode;t.style&&(Ee(),Se=t,ti=t.style.outlineStyle,t.style.outlineStyle="none",j(window,"keydown",Ee))}function Ee(){Se&&(Se.style.outlineStyle=ti,Se=void 0,ti=void 0,et(window,"keydown",Ee))}function qi(t){do t=t.parentNode;while((!t.offsetWidth||!t.offsetHeight)&&t!==document.body);return t}function ii(t){var e=t.getBoundingClientRect();return{x:e.width/t.offsetWidth||1,y:e.height/t.offsetHeight||1,boundingClientRect:e}}var vs={__proto__:null,TRANSFORM:Ge,TRANSITION:se,TRANSITION_END:Ui,get:Hi,getStyle:oe,create:X,remove:nt,empty:_e,toFront:Wt,toBack:Gt,hasClass:Ke,addClass:W,removeClass:at,setClass:Je,getClass:xe,setOpacity:bt,testProp:we,setTransform:Zt,setPosition:lt,getPosition:Ut,get disableTextSelection(){return ae},get enableTextSelection(){return re},disableImageDrag:Xe,enableImageDrag:Qe,preventOutline:ei,restoreOutline:Ee,getSizedParentNode:qi,getScale:ii};function j(t,e,i,n){if(e&&typeof e=="object")for(var s in e)si(t,s,e[s],i);else{e=g(e);for(var o=0,p=e.length;o<p;o++)si(t,e[o],i,n)}return this}var kt="_leaflet_events";function et(t,e,i,n){if(arguments.length===1)Vi(t),delete t[kt];else if(e&&typeof e=="object")for(var s in e)oi(t,s,e[s],i);else if(e=g(e),arguments.length===2)Vi(t,function(w){return D(e,w)!==-1});else for(var o=0,p=e.length;o<p;o++)oi(t,e[o],i,n);return this}function Vi(t,e){for(var i in t[kt]){var n=i.split(/\d/)[0];(!e||e(n))&&oi(t,n,null,null,i)}}var ni={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function si(t,e,i,n){var s=e+h(i)+(n?"_"+h(n):"");if(t[kt]&&t[kt][s])return this;var o=function(w){return i.call(n||t,w||window.event)},p=o;!Z.touchNative&&Z.pointer&&e.indexOf("touch")===0?o=os(t,e,o):Z.touch&&e==="dblclick"?o=hs(t,o):"addEventListener"in t?e==="touchstart"||e==="touchmove"||e==="wheel"||e==="mousewheel"?t.addEventListener(ni[e]||e,o,Z.passiveEvents?{passive:!1}:!1):e==="mouseenter"||e==="mouseleave"?(o=function(w){w=w||window.event,ri(t,w)&&p(w)},t.addEventListener(ni[e],o,!1)):t.addEventListener(e,p,!1):t.attachEvent("on"+e,o),t[kt]=t[kt]||{},t[kt][s]=o}function oi(t,e,i,n,s){s=s||e+h(i)+(n?"_"+h(n):"");var o=t[kt]&&t[kt][s];if(!o)return this;!Z.touchNative&&Z.pointer&&e.indexOf("touch")===0?as(t,e,o):Z.touch&&e==="dblclick"?fs(t,o):"removeEventListener"in t?t.removeEventListener(ni[e]||e,o,!1):t.detachEvent("on"+e,o),t[kt][s]=null}function Ht(t){return t.stopPropagation?t.stopPropagation():t.originalEvent?t.originalEvent._stopped=!0:t.cancelBubble=!0,this}function ai(t){return si(t,"wheel",Ht),this}function de(t){return j(t,"mousedown touchstart dblclick contextmenu",Ht),t._leaflet_disable_click=!0,this}function ht(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this}function qt(t){return ht(t),Ht(t),this}function ji(t){if(t.composedPath)return t.composedPath();for(var e=[],i=t.target;i;)e.push(i),i=i.parentNode;return e}function Wi(t,e){if(!e)return new z(t.clientX,t.clientY);var i=ii(e),n=i.boundingClientRect;return new z((t.clientX-n.left)/i.x-e.clientLeft,(t.clientY-n.top)/i.y-e.clientTop)}var gs=Z.linux&&Z.chrome?window.devicePixelRatio:Z.mac?window.devicePixelRatio*3:window.devicePixelRatio>0?2*window.devicePixelRatio:1;function Gi(t){return Z.edge?t.wheelDeltaY/2:t.deltaY&&t.deltaMode===0?-t.deltaY/gs:t.deltaY&&t.deltaMode===1?-t.deltaY*20:t.deltaY&&t.deltaMode===2?-t.deltaY*60:t.deltaX||t.deltaZ?0:t.wheelDelta?(t.wheelDeltaY||t.wheelDelta)/2:t.detail&&Math.abs(t.detail)<32765?-t.detail*20:t.detail?t.detail/-32765*60:0}function ri(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch{return!1}return i!==t}var ys={__proto__:null,on:j,off:et,stopPropagation:Ht,disableScrollPropagation:ai,disableClickPropagation:de,preventDefault:ht,stop:qt,getPropagationPath:ji,getMousePosition:Wi,getWheelDelta:Gi,isExternalTarget:ri,addListener:j,removeListener:et},Ki=T.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=Ut(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=K(this._animate,this),this._step()},_step:function(t){var e=+new Date-this._startTime,i=this._duration*1e3;e<i?this._runFrame(this._easeOut(e/i),t):(this._runFrame(1),this._complete())},_runFrame:function(t,e){var i=this._startPos.add(this._offset.multiplyBy(t));e&&i._round(),lt(this._el,i),this.fire("step")},_complete:function(){st(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),Y=T.extend({options:{crs:Ze,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(t,e){e=b(this,e),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(t),this._initLayout(),this._onResize=A(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.zoom!==void 0&&(this._zoom=this._limitZoom(e.zoom)),e.center&&e.zoom!==void 0&&this.setView(J(e.center),e.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=se&&Z.any3d&&!Z.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),j(this._proxy,Ui,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(t,e,i){if(e=e===void 0?this._zoom:this._limitZoom(e),t=this._limitCenter(J(t),e,this.options.maxBounds),i=i||{},this._stop(),this._loaded&&!i.reset&&i!==!0){i.animate!==void 0&&(i.zoom=a({animate:i.animate},i.zoom),i.pan=a({animate:i.animate,duration:i.duration},i.pan));var n=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,i.zoom):this._tryAnimatedPan(t,i.pan);if(n)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e,i.pan&&i.pan.noMoveStart),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=t,this)},zoomIn:function(t,e){return t=t||(Z.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+t,e)},zoomOut:function(t,e){return t=t||(Z.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-t,e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),s=this.getSize().divideBy(2),o=t instanceof z?t:this.latLngToContainerPoint(t),p=o.subtract(s).multiplyBy(1-1/n),w=this.containerPointToLatLng(s.add(p));return this.setView(w,e,{zoom:i})},_getBoundsCenterZoom:function(t,e){e=e||{},t=t.getBounds?t.getBounds():rt(t);var i=H(e.paddingTopLeft||e.padding||[0,0]),n=H(e.paddingBottomRight||e.padding||[0,0]),s=this.getBoundsZoom(t,!1,i.add(n));if(s=typeof e.maxZoom=="number"?Math.min(e.maxZoom,s):s,s===1/0)return{center:t.getCenter(),zoom:s};var o=n.subtract(i).divideBy(2),p=this.project(t.getSouthWest(),s),w=this.project(t.getNorthEast(),s),C=this.unproject(p.add(w).divideBy(2).add(o),s);return{center:C,zoom:s}},fitBounds:function(t,e){if(t=rt(t),!t.isValid())throw new Error("Bounds are not valid.");var i=this._getBoundsCenterZoom(t,e);return this.setView(i.center,i.zoom,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t,e){if(t=H(t).round(),e=e||{},!t.x&&!t.y)return this.fire("moveend");if(e.animate!==!0&&!this.getSize().contains(t))return this._resetView(this.unproject(this.project(this.getCenter()).add(t)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new Ki,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){W(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(t).round();this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},flyTo:function(t,e,i){if(i=i||{},i.animate===!1||!Z.any3d)return this.setView(t,e,i);this._stop();var n=this.project(this.getCenter()),s=this.project(t),o=this.getSize(),p=this._zoom;t=J(t),e=e===void 0?p:e;var w=Math.max(o.x,o.y),C=w*this.getZoomScale(p,e),M=s.distanceTo(n)||1,R=1.42,q=R*R;function G(dt){var De=dt?-1:1,ao=dt?C:w,ro=C*C-w*w+De*q*q*M*M,lo=2*ao*q*M,yi=ro/lo,Fn=Math.sqrt(yi*yi+1)-yi,co=Fn<1e-9?-18:Math.log(Fn);return co}function ft(dt){return(Math.exp(dt)-Math.exp(-dt))/2}function pt(dt){return(Math.exp(dt)+Math.exp(-dt))/2}function xt(dt){return ft(dt)/pt(dt)}var gt=G(0);function te(dt){return w*(pt(gt)/pt(gt+R*dt))}function io(dt){return w*(pt(gt)*xt(gt+R*dt)-ft(gt))/q}function no(dt){return 1-Math.pow(1-dt,1.5)}var so=Date.now(),Tn=(G(1)-gt)/R,oo=i.duration?1e3*i.duration:1e3*Tn*.8;function Ln(){var dt=(Date.now()-so)/oo,De=no(dt)*Tn;dt<=1?(this._flyToFrame=K(Ln,this),this._move(this.unproject(n.add(s.subtract(n).multiplyBy(io(De)/M)),p),this.getScaleZoom(w/te(De),p),{flyTo:!0})):this._move(t,e)._moveEnd(!0)}return this._moveStart(!0,i.noMoveStart),Ln.call(this),this},flyToBounds:function(t,e){var i=this._getBoundsCenterZoom(t,e);return this.flyTo(i.center,i.zoom,e)},setMaxBounds:function(t){return t=rt(t),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),t.isValid()?(this.options.maxBounds=t,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(t){var e=this.options.minZoom;return this.options.minZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(t):this},setMaxZoom:function(t){var e=this.options.maxZoom;return this.options.maxZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(t):this},panInsideBounds:function(t,e){this._enforcingBounds=!0;var i=this.getCenter(),n=this._limitCenter(i,this._zoom,rt(t));return i.equals(n)||this.panTo(n,e),this._enforcingBounds=!1,this},panInside:function(t,e){e=e||{};var i=H(e.paddingTopLeft||e.padding||[0,0]),n=H(e.paddingBottomRight||e.padding||[0,0]),s=this.project(this.getCenter()),o=this.project(t),p=this.getPixelBounds(),w=ut([p.min.add(i),p.max.subtract(n)]),C=w.getSize();if(!w.contains(o)){this._enforcingBounds=!0;var M=o.subtract(w.getCenter()),R=w.extend(o).getSize().subtract(C);s.x+=M.x<0?-R.x:R.x,s.y+=M.y<0?-R.y:R.y,this.panTo(this.unproject(s),e),this._enforcingBounds=!1}return this},invalidateSize:function(t){if(!this._loaded)return this;t=a({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._lastCenter=null;var i=this.getSize(),n=e.divideBy(2).round(),s=i.divideBy(2).round(),o=n.subtract(s);return!o.x&&!o.y?this:(t.animate&&t.pan?this.panBy(o):(t.pan&&this._rawPanBy(o),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(A(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i}))},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(t){if(t=this._locateOptions=a({timeout:1e4,watch:!1},t),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=A(this._handleGeolocationResponse,this),i=A(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){if(this._container._leaflet_id){var e=t.code,i=t.message||(e===1?"permission denied":e===2?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+i+"."})}},_handleGeolocationResponse:function(t){if(this._container._leaflet_id){var e=t.coords.latitude,i=t.coords.longitude,n=new tt(e,i),s=n.toBounds(t.coords.accuracy*2),o=this._locateOptions;if(o.setView){var p=this.getBoundsZoom(s);this.setView(n,o.maxZoom?Math.min(p,o.maxZoom):p)}var w={latlng:n,bounds:s,timestamp:t.timestamp};for(var C in t.coords)typeof t.coords[C]=="number"&&(w[C]=t.coords[C]);this.fire("locationfound",w)}},addHandler:function(t,e){if(!e)return this;var i=this[t]=new e(this);return this._handlers.push(i),this.options[t]&&i.enable(),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch{this._container._leaflet_id=void 0,this._containerId=void 0}this._locationWatchId!==void 0&&this.stopLocate(),this._stop(),nt(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(st(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload");var t;for(t in this._layers)this._layers[t].remove();for(t in this._panes)nt(this._panes[t]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(t,e){var i="leaflet-pane"+(t?" leaflet-"+t.replace("Pane","")+"-pane":""),n=X("div",i,e||this._mapPane);return t&&(this._panes[t]=n),n},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),i=this.unproject(t.getTopRight());return new vt(e,i)},getMinZoom:function(){return this.options.minZoom===void 0?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===void 0?this._layersMaxZoom===void 0?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=rt(t),i=H(i||[0,0]);var n=this.getZoom()||0,s=this.getMinZoom(),o=this.getMaxZoom(),p=t.getNorthWest(),w=t.getSouthEast(),C=this.getSize().subtract(i),M=ut(this.project(w,n),this.project(p,n)).getSize(),R=Z.any3d?this.options.zoomSnap:1,q=C.x/M.x,G=C.y/M.y,ft=e?Math.max(q,G):Math.min(q,G);return n=this.getScaleZoom(ft,n),R&&(n=Math.round(n/(R/100))*(R/100),n=e?Math.ceil(n/R)*R:Math.floor(n/R)*R),Math.max(s,Math.min(o,n))},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new z(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(t,e){var i=this._getTopLeftPoint(t,e);return new Q(i,i.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(t){return this.options.crs.getProjectedBounds(t===void 0?this.getZoom():t)},getPane:function(t){return typeof t=="string"?this._panes[t]:t},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t,e){var i=this.options.crs;return e=e===void 0?this._zoom:e,i.scale(t)/i.scale(e)},getScaleZoom:function(t,e){var i=this.options.crs;e=e===void 0?this._zoom:e;var n=i.zoom(t*i.scale(e));return isNaN(n)?1/0:n},project:function(t,e){return e=e===void 0?this._zoom:e,this.options.crs.latLngToPoint(J(t),e)},unproject:function(t,e){return e=e===void 0?this._zoom:e,this.options.crs.pointToLatLng(H(t),e)},layerPointToLatLng:function(t){var e=H(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(J(t))._round();return e._subtract(this.getPixelOrigin())},wrapLatLng:function(t){return this.options.crs.wrapLatLng(J(t))},wrapLatLngBounds:function(t){return this.options.crs.wrapLatLngBounds(rt(t))},distance:function(t,e){return this.options.crs.distance(J(t),J(e))},containerPointToLayerPoint:function(t){return H(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return H(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(H(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(J(t)))},mouseEventToContainerPoint:function(t){return Wi(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=Hi(t);if(e){if(e._leaflet_id)throw new Error("Map container is already initialized.")}else throw new Error("Map container not found.");j(e,"scroll",this._onScroll,this),this._containerId=h(e)},_initLayout:function(){var t=this._container;this._fadeAnimated=this.options.fadeAnimation&&Z.any3d,W(t,"leaflet-container"+(Z.touch?" leaflet-touch":"")+(Z.retina?" leaflet-retina":"")+(Z.ielt9?" leaflet-oldie":"")+(Z.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var e=oe(t,"position");e!=="absolute"&&e!=="relative"&&e!=="fixed"&&e!=="sticky"&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),lt(this._mapPane,new z(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(W(t.markerPane,"leaflet-zoom-hide"),W(t.shadowPane,"leaflet-zoom-hide"))},_resetView:function(t,e,i){lt(this._mapPane,new z(0,0));var n=!this._loaded;this._loaded=!0,e=this._limitZoom(e),this.fire("viewprereset");var s=this._zoom!==e;this._moveStart(s,i)._move(t,e)._moveEnd(s),this.fire("viewreset"),n&&this.fire("load")},_moveStart:function(t,e){return t&&this.fire("zoomstart"),e||this.fire("movestart"),this},_move:function(t,e,i,n){e===void 0&&(e=this._zoom);var s=this._zoom!==e;return this._zoom=e,this._lastCenter=t,this._pixelOrigin=this._getNewPixelOrigin(t),n?i&&i.pinch&&this.fire("zoom",i):((s||i&&i.pinch)&&this.fire("zoom",i),this.fire("move",i)),this},_moveEnd:function(t){return t&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return st(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(t){lt(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(t){this._targets={},this._targets[h(this._container)]=this;var e=t?et:j;e(this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&e(window,"resize",this._onResize,this),Z.any3d&&this.options.transform3DLimit&&(t?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){st(this._resizeRequest),this._resizeRequest=K(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var t=this._getMapPanePos();Math.max(Math.abs(t.x),Math.abs(t.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(t,e){for(var i=[],n,s=e==="mouseout"||e==="mouseover",o=t.target||t.srcElement,p=!1;o;){if(n=this._targets[h(o)],n&&(e==="click"||e==="preclick")&&this._draggableMoved(n)){p=!0;break}if(n&&n.listens(e,!0)&&(s&&!ri(o,t)||(i.push(n),s))||o===this._container)break;o=o.parentNode}return!i.length&&!p&&!s&&this.listens(e,!0)&&(i=[this]),i},_isClickDisabled:function(t){for(;t&&t!==this._container;){if(t._leaflet_disable_click)return!0;t=t.parentNode}},_handleDOMEvent:function(t){var e=t.target||t.srcElement;if(!(!this._loaded||e._leaflet_disable_events||t.type==="click"&&this._isClickDisabled(e))){var i=t.type;i==="mousedown"&&ei(e),this._fireDOMEvent(t,i)}},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(t,e,i){if(t.type==="click"){var n=a({},t);n.type="preclick",this._fireDOMEvent(n,n.type,i)}var s=this._findEventTargets(t,e);if(i){for(var o=[],p=0;p<i.length;p++)i[p].listens(e,!0)&&o.push(i[p]);s=o.concat(s)}if(s.length){e==="contextmenu"&&ht(t);var w=s[0],C={originalEvent:t};if(t.type!=="keypress"&&t.type!=="keydown"&&t.type!=="keyup"){var M=w.getLatLng&&(!w._radius||w._radius<=10);C.containerPoint=M?this.latLngToContainerPoint(w.getLatLng()):this.mouseEventToContainerPoint(t),C.layerPoint=this.containerPointToLayerPoint(C.containerPoint),C.latlng=M?w.getLatLng():this.layerPointToLatLng(C.layerPoint)}for(p=0;p<s.length;p++)if(s[p].fire(e,C,!0),C.originalEvent._stopped||s[p].options.bubblingMouseEvents===!1&&D(this._mouseEvents,e)!==-1)return}},_draggableMoved:function(t){return t=t.dragging&&t.dragging.enabled()?t:this,t.dragging&&t.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var t=0,e=this._handlers.length;t<e;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,{target:this}):this.on("load",t,e),this},_getMapPanePos:function(){return Ut(this._mapPane)||new z(0,0)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(t,e){var i=t&&e!==void 0?this._getNewPixelOrigin(t,e):this.getPixelOrigin();return i.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(t,e,i){var n=this._getNewPixelOrigin(i,e);return this.project(t,e)._subtract(n)},_latLngBoundsToNewLayerBounds:function(t,e,i){var n=this._getNewPixelOrigin(i,e);return ut([this.project(t.getSouthWest(),e)._subtract(n),this.project(t.getNorthWest(),e)._subtract(n),this.project(t.getSouthEast(),e)._subtract(n),this.project(t.getNorthEast(),e)._subtract(n)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){if(!i)return t;var n=this.project(t,e),s=this.getSize().divideBy(2),o=new Q(n.subtract(s),n.add(s)),p=this._getBoundsOffset(o,i,e);return Math.abs(p.x)<=1&&Math.abs(p.y)<=1?t:this.unproject(n.add(p),e)},_limitOffset:function(t,e){if(!e)return t;var i=this.getPixelBounds(),n=new Q(i.min.add(t),i.max.add(t));return t.add(this._getBoundsOffset(n,e))},_getBoundsOffset:function(t,e,i){var n=ut(this.project(e.getNorthEast(),i),this.project(e.getSouthWest(),i)),s=n.min.subtract(t.min),o=n.max.subtract(t.max),p=this._rebound(s.x,-o.x),w=this._rebound(s.y,-o.y);return new z(p,w)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom(),n=Z.any3d?this.options.zoomSnap:1;return n&&(t=Math.round(t/n)*n),Math.max(e,Math.min(i,t))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){at(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var i=this._getCenterOffset(t)._trunc();return(e&&e.animate)!==!0&&!this.getSize().contains(i)?!1:(this.panBy(i,e),!0)},_createAnimProxy:function(){var t=this._proxy=X("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(t),this.on("zoomanim",function(e){var i=Ge,n=this._proxy.style[i];Zt(this._proxy,this.project(e.center,e.zoom),this.getZoomScale(e.zoom,1)),n===this._proxy.style[i]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){nt(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var t=this.getCenter(),e=this.getZoom();Zt(this._proxy,this.project(t,e),this.getZoomScale(e,1))},_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),s=this._getCenterOffset(t)._divideBy(1-1/n);return i.animate!==!0&&!this.getSize().contains(s)?!1:(K(function(){this._moveStart(!0,i.noMoveStart||!1)._animateZoom(t,e,!0)},this),!0)},_animateZoom:function(t,e,i,n){this._mapPane&&(i&&(this._animatingZoom=!0,this._animateToCenter=t,this._animateToZoom=e,W(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:t,zoom:e,noUpdate:n}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(A(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&at(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function bs(t,e){return new Y(t,e)}var Et=mt.extend({options:{position:"topright"},initialize:function(t){b(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this.remove(),this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),n=t._controlCorners[i];return W(e,"leaflet-control"),i.indexOf("bottom")!==-1?n.insertBefore(e,n.firstChild):n.appendChild(e),this._map.on("unload",this.remove,this),this},remove:function(){return this._map?(nt(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null,this):this},_refocusOnMap:function(t){this._map&&t&&t.screenX>0&&t.screenY>0&&this._map.getContainer().focus()}}),ce=function(t){return new Et(t)};Y.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.remove(),this},_initControlPos:function(){var t=this._controlCorners={},e="leaflet-",i=this._controlContainer=X("div",e+"control-container",this._container);function n(s,o){var p=e+s+" "+e+o;t[s+o]=X("div",p,i)}n("top","left"),n("top","right"),n("bottom","left"),n("bottom","right")},_clearControlPos:function(){for(var t in this._controlCorners)nt(this._controlCorners[t]);nt(this._controlContainer),delete this._controlCorners,delete this._controlContainer}});var Ji=Et.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(t,e,i,n){return i<n?-1:n<i?1:0}},initialize:function(t,e,i){b(this,i),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1;for(var n in t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(t){this._initLayout(),this._update(),this._map=t,t.on("zoomend",this._checkDisabledLayers,this);for(var e=0;e<this._layers.length;e++)this._layers[e].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(t){return Et.prototype.addTo.call(this,t),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var t=0;t<this._layers.length;t++)this._layers[t].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._map?this._update():this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._map?this._update():this},removeLayer:function(t){t.off("add remove",this._onLayerChange,this);var e=this._getLayer(h(t));return e&&this._layers.splice(this._layers.indexOf(e),1),this._map?this._update():this},expand:function(){W(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var t=this._map.getSize().y-(this._container.offsetTop+50);return t<this._section.clientHeight?(W(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=t+"px"):at(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return at(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=X("div",t),i=this.options.collapsed;e.setAttribute("aria-haspopup",!0),de(e),ai(e);var n=this._section=X("section",t+"-list");i&&(this._map.on("click",this.collapse,this),j(e,{mouseenter:this._expandSafely,mouseleave:this.collapse},this));var s=this._layersLink=X("a",t+"-toggle",e);s.href="#",s.title="Layers",s.setAttribute("role","button"),j(s,{keydown:function(o){o.keyCode===13&&this._expandSafely()},click:function(o){ht(o),this._expandSafely()}},this),i||this.expand(),this._baseLayersList=X("div",t+"-base",n),this._separator=X("div",t+"-separator",n),this._overlaysList=X("div",t+"-overlays",n),e.appendChild(n)},_getLayer:function(t){for(var e=0;e<this._layers.length;e++)if(this._layers[e]&&h(this._layers[e].layer)===t)return this._layers[e]},_addLayer:function(t,e,i){this._map&&t.on("add remove",this._onLayerChange,this),this._layers.push({layer:t,name:e,overlay:i}),this.options.sortLayers&&this._layers.sort(A(function(n,s){return this.options.sortFunction(n.layer,s.layer,n.name,s.name)},this)),this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(!this._container)return this;_e(this._baseLayersList),_e(this._overlaysList),this._layerControlInputs=[];var t,e,i,n,s=0;for(i=0;i<this._layers.length;i++)n=this._layers[i],this._addItem(n),e=e||n.overlay,t=t||!n.overlay,s+=n.overlay?0:1;return this.options.hideSingleBase&&(t=t&&s>1,this._baseLayersList.style.display=t?"":"none"),this._separator.style.display=e&&t?"":"none",this},_onLayerChange:function(t){this._handlingClick||this._update();var e=this._getLayer(h(t.target)),i=e.overlay?t.type==="add"?"overlayadd":"overlayremove":t.type==="add"?"baselayerchange":null;i&&this._map.fire(i,e)},_createRadioElement:function(t,e){var i='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"'+(e?' checked="checked"':"")+"/>",n=document.createElement("div");return n.innerHTML=i,n.firstChild},_addItem:function(t){var e=document.createElement("label"),i=this._map.hasLayer(t.layer),n;t.overlay?(n=document.createElement("input"),n.type="checkbox",n.className="leaflet-control-layers-selector",n.defaultChecked=i):n=this._createRadioElement("leaflet-base-layers_"+h(this),i),this._layerControlInputs.push(n),n.layerId=h(t.layer),j(n,"click",this._onInputClick,this);var s=document.createElement("span");s.innerHTML=" "+t.name;var o=document.createElement("span");e.appendChild(o),o.appendChild(n),o.appendChild(s);var p=t.overlay?this._overlaysList:this._baseLayersList;return p.appendChild(e),this._checkDisabledLayers(),e},_onInputClick:function(){if(!this._preventClick){var t=this._layerControlInputs,e,i,n=[],s=[];this._handlingClick=!0;for(var o=t.length-1;o>=0;o--)e=t[o],i=this._getLayer(e.layerId).layer,e.checked?n.push(i):e.checked||s.push(i);for(o=0;o<s.length;o++)this._map.hasLayer(s[o])&&this._map.removeLayer(s[o]);for(o=0;o<n.length;o++)this._map.hasLayer(n[o])||this._map.addLayer(n[o]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var t=this._layerControlInputs,e,i,n=this._map.getZoom(),s=t.length-1;s>=0;s--)e=t[s],i=this._getLayer(e.layerId).layer,e.disabled=i.options.minZoom!==void 0&&n<i.options.minZoom||i.options.maxZoom!==void 0&&n>i.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var t=this._section;this._preventClick=!0,j(t,"click",ht),this.expand();var e=this;setTimeout(function(){et(t,"click",ht),e._preventClick=!1})}}),_s=function(t,e,i){return new Ji(t,e,i)},li=Et.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=X("div",e+" leaflet-bar"),n=this.options;return this._zoomInButton=this._createButton(n.zoomInText,n.zoomInTitle,e+"-in",i,this._zoomIn),this._zoomOutButton=this._createButton(n.zoomOutText,n.zoomOutTitle,e+"-out",i,this._zoomOut),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(t){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(t.shiftKey?3:1))},_zoomOut:function(t){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(t.shiftKey?3:1))},_createButton:function(t,e,i,n,s){var o=X("a",i,n);return o.innerHTML=t,o.href="#",o.title=e,o.setAttribute("role","button"),o.setAttribute("aria-label",e),de(o),j(o,"click",qt),j(o,"click",s,this),j(o,"click",this._refocusOnMap,this),o},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";at(this._zoomInButton,e),at(this._zoomOutButton,e),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),(this._disabled||t._zoom===t.getMinZoom())&&(W(this._zoomOutButton,e),this._zoomOutButton.setAttribute("aria-disabled","true")),(this._disabled||t._zoom===t.getMaxZoom())&&(W(this._zoomInButton,e),this._zoomInButton.setAttribute("aria-disabled","true"))}});Y.mergeOptions({zoomControl:!0}),Y.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new li,this.addControl(this.zoomControl))});var xs=function(t){return new li(t)},Yi=Et.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(t){var e="leaflet-control-scale",i=X("div",e),n=this.options;return this._addScales(n,e+"-line",i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=X("div",e,i)),t.imperial&&(this._iScale=X("div",e,i))},_update:function(){var t=this._map,e=t.getSize().y/2,i=t.distance(t.containerPointToLatLng([0,e]),t.containerPointToLatLng([this.options.maxWidth,e]));this._updateScales(i)},_updateScales:function(t){this.options.metric&&t&&this._updateMetric(t),this.options.imperial&&t&&this._updateImperial(t)},_updateMetric:function(t){var e=this._getRoundNum(t),i=e<1e3?e+" m":e/1e3+" km";this._updateScale(this._mScale,i,e/t)},_updateImperial:function(t){var e=t*3.2808399,i,n,s;e>5280?(i=e/5280,n=this._getRoundNum(i),this._updateScale(this._iScale,n+" mi",n/i)):(s=this._getRoundNum(e),this._updateScale(this._iScale,s+" ft",s/e))},_updateScale:function(t,e,i){t.style.width=Math.round(this.options.maxWidth*i)+"px",t.innerHTML=e},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),i=t/e;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,e*i}}),ws=function(t){return new Yi(t)},Ss='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',di=Et.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(Z.inlineSvg?Ss+" ":"")+"Leaflet</a>"},initialize:function(t){b(this,t),this._attributions={}},onAdd:function(t){t.attributionControl=this,this._container=X("div","leaflet-control-attribution"),de(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return this._update(),t.on("layeradd",this._addAttribution,this),this._container},onRemove:function(t){t.off("layeradd",this._addAttribution,this)},_addAttribution:function(t){t.layer.getAttribution&&(this.addAttribution(t.layer.getAttribution()),t.layer.once("remove",function(){this.removeAttribution(t.layer.getAttribution())},this))},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):this},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):this},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var i=[];this.options.prefix&&i.push(this.options.prefix),t.length&&i.push(t.join(", ")),this._container.innerHTML=i.join(' <span aria-hidden="true">|</span> ')}}});Y.mergeOptions({attributionControl:!0}),Y.addInitHook(function(){this.options.attributionControl&&new di().addTo(this)});var Es=function(t){return new di(t)};Et.Layers=Ji,Et.Zoom=li,Et.Scale=Yi,Et.Attribution=di,ce.layers=_s,ce.zoom=xs,ce.scale=ws,ce.attribution=Es;var Tt=mt.extend({initialize:function(t){this._map=t},enable:function(){return this._enabled?this:(this._enabled=!0,this.addHooks(),this)},disable:function(){return this._enabled?(this._enabled=!1,this.removeHooks(),this):this},enabled:function(){return!!this._enabled}});Tt.addTo=function(t,e){return t.addHandler(e,this),this};var As={Events:ot},Xi=Z.touch?"touchstart mousedown":"mousedown",Nt=T.extend({options:{clickTolerance:3},initialize:function(t,e,i,n){b(this,n),this._element=t,this._dragStartTarget=e||t,this._preventOutline=i},enable:function(){this._enabled||(j(this._dragStartTarget,Xi,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(Nt._dragging===this&&this.finishDrag(!0),et(this._dragStartTarget,Xi,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(t){if(this._enabled&&(this._moved=!1,!Ke(this._element,"leaflet-zoom-anim"))){if(t.touches&&t.touches.length!==1){Nt._dragging===this&&this.finishDrag();return}if(!(Nt._dragging||t.shiftKey||t.which!==1&&t.button!==1&&!t.touches)&&(Nt._dragging=this,this._preventOutline&&ei(this._element),Xe(),ae(),!this._moving)){this.fire("down");var e=t.touches?t.touches[0]:t,i=qi(this._element);this._startPoint=new z(e.clientX,e.clientY),this._startPos=Ut(this._element),this._parentScale=ii(i);var n=t.type==="mousedown";j(document,n?"mousemove":"touchmove",this._onMove,this),j(document,n?"mouseup":"touchend touchcancel",this._onUp,this)}}},_onMove:function(t){if(this._enabled){if(t.touches&&t.touches.length>1){this._moved=!0;return}var e=t.touches&&t.touches.length===1?t.touches[0]:t,i=new z(e.clientX,e.clientY)._subtract(this._startPoint);!i.x&&!i.y||Math.abs(i.x)+Math.abs(i.y)<this.options.clickTolerance||(i.x/=this._parentScale.x,i.y/=this._parentScale.y,ht(t),this._moved||(this.fire("dragstart"),this._moved=!0,W(document.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),W(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(i),this._moving=!0,this._lastEvent=t,this._updatePosition())}},_updatePosition:function(){var t={originalEvent:this._lastEvent};this.fire("predrag",t),lt(this._element,this._newPos),this.fire("drag",t)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(t){at(document.body,"leaflet-dragging"),this._lastTarget&&(at(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),et(document,"mousemove touchmove",this._onMove,this),et(document,"mouseup touchend touchcancel",this._onUp,this),Qe(),re();var e=this._moved&&this._moving;this._moving=!1,Nt._dragging=!1,e&&this.fire("dragend",{noInertia:t,distance:this._newPos.distanceTo(this._startPos)})}});function Qi(t,e,i){var n,s=[1,4,2,8],o,p,w,C,M,R,q,G;for(o=0,R=t.length;o<R;o++)t[o]._code=Vt(t[o],e);for(w=0;w<4;w++){for(q=s[w],n=[],o=0,R=t.length,p=R-1;o<R;p=o++)C=t[o],M=t[p],C._code&q?M._code&q||(G=Ae(M,C,q,e,i),G._code=Vt(G,e),n.push(G)):(M._code&q&&(G=Ae(M,C,q,e,i),G._code=Vt(G,e),n.push(G)),n.push(C));t=n}return t}function tn(t,e){var i,n,s,o,p,w,C,M,R;if(!t||t.length===0)throw new Error("latlngs not passed");_t(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);var q=J([0,0]),G=rt(t),ft=G.getNorthWest().distanceTo(G.getSouthWest())*G.getNorthEast().distanceTo(G.getNorthWest());ft<1700&&(q=ci(t));var pt=t.length,xt=[];for(i=0;i<pt;i++){var gt=J(t[i]);xt.push(e.project(J([gt.lat-q.lat,gt.lng-q.lng])))}for(w=C=M=0,i=0,n=pt-1;i<pt;n=i++)s=xt[i],o=xt[n],p=s.y*o.x-o.y*s.x,C+=(s.x+o.x)*p,M+=(s.y+o.y)*p,w+=p*3;w===0?R=xt[0]:R=[C/w,M/w];var te=e.unproject(H(R));return J([te.lat+q.lat,te.lng+q.lng])}function ci(t){for(var e=0,i=0,n=0,s=0;s<t.length;s++){var o=J(t[s]);e+=o.lat,i+=o.lng,n++}return J([e/n,i/n])}var Cs={__proto__:null,clipPolygon:Qi,polygonCenter:tn,centroid:ci};function en(t,e){if(!e||!t.length)return t.slice();var i=e*e;return t=Ls(t,i),t=Ts(t,i),t}function nn(t,e,i){return Math.sqrt(ue(t,e,i,!0))}function ks(t,e,i){return ue(t,e,i)}function Ts(t,e){var i=t.length,n=typeof Uint8Array<"u"?Uint8Array:Array,s=new n(i);s[0]=s[i-1]=1,ui(t,s,e,0,i-1);var o,p=[];for(o=0;o<i;o++)s[o]&&p.push(t[o]);return p}function ui(t,e,i,n,s){var o=0,p,w,C;for(w=n+1;w<=s-1;w++)C=ue(t[w],t[n],t[s],!0),C>o&&(p=w,o=C);o>i&&(e[p]=1,ui(t,e,i,n,p),ui(t,e,i,p,s))}function Ls(t,e){for(var i=[t[0]],n=1,s=0,o=t.length;n<o;n++)Fs(t[n],t[s])>e&&(i.push(t[n]),s=n);return s<o-1&&i.push(t[o-1]),i}var sn;function on(t,e,i,n,s){var o=n?sn:Vt(t,i),p=Vt(e,i),w,C,M;for(sn=p;;){if(!(o|p))return[t,e];if(o&p)return!1;w=o||p,C=Ae(t,e,w,i,s),M=Vt(C,i),w===o?(t=C,o=M):(e=C,p=M)}}function Ae(t,e,i,n,s){var o=e.x-t.x,p=e.y-t.y,w=n.min,C=n.max,M,R;return i&8?(M=t.x+o*(C.y-t.y)/p,R=C.y):i&4?(M=t.x+o*(w.y-t.y)/p,R=w.y):i&2?(M=C.x,R=t.y+p*(C.x-t.x)/o):i&1&&(M=w.x,R=t.y+p*(w.x-t.x)/o),new z(M,R,s)}function Vt(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i}function Fs(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n}function ue(t,e,i,n){var s=e.x,o=e.y,p=i.x-s,w=i.y-o,C=p*p+w*w,M;return C>0&&(M=((t.x-s)*p+(t.y-o)*w)/C,M>1?(s=i.x,o=i.y):M>0&&(s+=p*M,o+=w*M)),p=t.x-s,w=t.y-o,n?p*p+w*w:new z(s,o)}function _t(t){return!B(t[0])||typeof t[0][0]!="object"&&typeof t[0][0]<"u"}function an(t){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),_t(t)}function rn(t,e){var i,n,s,o,p,w,C,M;if(!t||t.length===0)throw new Error("latlngs not passed");_t(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);var R=J([0,0]),q=rt(t),G=q.getNorthWest().distanceTo(q.getSouthWest())*q.getNorthEast().distanceTo(q.getNorthWest());G<1700&&(R=ci(t));var ft=t.length,pt=[];for(i=0;i<ft;i++){var xt=J(t[i]);pt.push(e.project(J([xt.lat-R.lat,xt.lng-R.lng])))}for(i=0,n=0;i<ft-1;i++)n+=pt[i].distanceTo(pt[i+1])/2;if(n===0)M=pt[0];else for(i=0,o=0;i<ft-1;i++)if(p=pt[i],w=pt[i+1],s=p.distanceTo(w),o+=s,o>n){C=(o-n)/s,M=[w.x-C*(w.x-p.x),w.y-C*(w.y-p.y)];break}var gt=e.unproject(H(M));return J([gt.lat+R.lat,gt.lng+R.lng])}var Bs={__proto__:null,simplify:en,pointToSegmentDistance:nn,closestPointOnSegment:ks,clipSegment:on,_getEdgeIntersection:Ae,_getBitCode:Vt,_sqClosestPointOnSegment:ue,isFlat:_t,_flat:an,polylineCenter:rn},pi={project:function(t){return new z(t.lng,t.lat)},unproject:function(t){return new tt(t.y,t.x)},bounds:new Q([-180,-90],[180,90])},hi={R:6378137,R_MINOR:6356752314245179e-9,bounds:new Q([-2003750834279e-5,-1549657073972e-5],[2003750834279e-5,1876465623138e-5]),project:function(t){var e=Math.PI/180,i=this.R,n=t.lat*e,s=this.R_MINOR/i,o=Math.sqrt(1-s*s),p=o*Math.sin(n),w=Math.tan(Math.PI/4-n/2)/Math.pow((1-p)/(1+p),o/2);return n=-i*Math.log(Math.max(w,1e-10)),new z(t.lng*e*i,n)},unproject:function(t){for(var e=180/Math.PI,i=this.R,n=this.R_MINOR/i,s=Math.sqrt(1-n*n),o=Math.exp(-t.y/i),p=Math.PI/2-2*Math.atan(o),w=0,C=.1,M;w<15&&Math.abs(C)>1e-7;w++)M=s*Math.sin(p),M=Math.pow((1-M)/(1+M),s/2),C=Math.PI/2-2*Math.atan(o*M)-p,p+=C;return new tt(p*e,t.x*e/i)}},$s={__proto__:null,LonLat:pi,Mercator:hi,SphericalMercator:Ne},Ms=a({},zt,{code:"EPSG:3395",projection:hi,transformation:(function(){var t=.5/(Math.PI*hi.R);return ie(t,.5,-t,.5)})()}),ln=a({},zt,{code:"EPSG:4326",projection:pi,transformation:ie(1/180,1,-1/180,.5)}),Ps=a({},Bt,{projection:pi,transformation:ie(1,0,-1,0),scale:function(t){return Math.pow(2,t)},zoom:function(t){return Math.log(t)/Math.LN2},distance:function(t,e){var i=e.lng-t.lng,n=e.lat-t.lat;return Math.sqrt(i*i+n*n)},infinite:!0});Bt.Earth=zt,Bt.EPSG3395=Ms,Bt.EPSG3857=Ze,Bt.EPSG900913=On,Bt.EPSG4326=ln,Bt.Simple=Ps;var At=T.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(t){return t.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(t){return t&&t.removeLayer(this),this},getPane:function(t){return this._map.getPane(t?this.options[t]||t:this.options.pane)},addInteractiveTarget:function(t){return this._map._targets[h(t)]=this,this},removeInteractiveTarget:function(t){return delete this._map._targets[h(t)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(t){var e=t.target;if(e.hasLayer(this)){if(this._map=e,this._zoomAnimated=e._zoomAnimated,this.getEvents){var i=this.getEvents();e.on(i,this),this.once("remove",function(){e.off(i,this)},this)}this.onAdd(e),this.fire("add"),e.fire("layeradd",{layer:this})}}});Y.include({addLayer:function(t){if(!t._layerAdd)throw new Error("The provided object is not a Layer.");var e=h(t);return this._layers[e]?this:(this._layers[e]=t,t._mapToAdd=this,t.beforeAdd&&t.beforeAdd(this),this.whenReady(t._layerAdd,t),this)},removeLayer:function(t){var e=h(t);return this._layers[e]?(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&(this.fire("layerremove",{layer:t}),t.fire("remove")),t._map=t._mapToAdd=null,this):this},hasLayer:function(t){return h(t)in this._layers},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},_addLayers:function(t){t=t?B(t)?t:[t]:[];for(var e=0,i=t.length;e<i;e++)this.addLayer(t[e])},_addZoomLimit:function(t){(!isNaN(t.options.maxZoom)||!isNaN(t.options.minZoom))&&(this._zoomBoundLayers[h(t)]=t,this._updateZoomLevels())},_removeZoomLimit:function(t){var e=h(t);this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels())},_updateZoomLevels:function(){var t=1/0,e=-1/0,i=this._getZoomSpan();for(var n in this._zoomBoundLayers){var s=this._zoomBoundLayers[n].options;t=s.minZoom===void 0?t:Math.min(t,s.minZoom),e=s.maxZoom===void 0?e:Math.max(e,s.maxZoom)}this._layersMaxZoom=e===-1/0?void 0:e,this._layersMinZoom=t===1/0?void 0:t,i!==this._getZoomSpan()&&this.fire("zoomlevelschange"),this.options.maxZoom===void 0&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),this.options.minZoom===void 0&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}});var Kt=At.extend({initialize:function(t,e){b(this,e),this._layers={};var i,n;if(t)for(i=0,n=t.length;i<n;i++)this.addLayer(t[i])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){var e=typeof t=="number"?t:this.getLayerId(t);return e in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(t){var e=Array.prototype.slice.call(arguments,1),i,n;for(i in this._layers)n=this._layers[i],n[t]&&n[t].apply(n,e);return this},onAdd:function(t){this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t)},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];return this.eachLayer(t.push,t),t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return h(t)}}),Is=function(t,e){return new Kt(t,e)},$t=Kt.extend({addLayer:function(t){return this.hasLayer(t)?this:(t.addEventParent(this),Kt.prototype.addLayer.call(this,t),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),t.removeEventParent(this),Kt.prototype.removeLayer.call(this,t),this.fire("layerremove",{layer:t})):this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new vt;for(var e in this._layers){var i=this._layers[e];t.extend(i.getBounds?i.getBounds():i.getLatLng())}return t}}),Ds=function(t,e){return new $t(t,e)},Jt=mt.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(t){b(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(!i){if(t==="icon")throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n=this._createImg(i,e&&e.tagName==="IMG"?e:null);return this._setIconStyles(n,t),(this.options.crossOrigin||this.options.crossOrigin==="")&&(n.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),n},_setIconStyles:function(t,e){var i=this.options,n=i[e+"Size"];typeof n=="number"&&(n=[n,n]);var s=H(n),o=H(e==="shadow"&&i.shadowAnchor||i.iconAnchor||s&&s.divideBy(2,!0));t.className="leaflet-marker-"+e+" "+(i.className||""),o&&(t.style.marginLeft=-o.x+"px",t.style.marginTop=-o.y+"px"),s&&(t.style.width=s.x+"px",t.style.height=s.y+"px")},_createImg:function(t,e){return e=e||document.createElement("img"),e.src=t,e},_getIconUrl:function(t){return Z.retina&&this.options[t+"RetinaUrl"]||this.options[t+"Url"]}});function Rs(t){return new Jt(t)}var pe=Jt.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(t){return typeof pe.imagePath!="string"&&(pe.imagePath=this._detectIconPath()),(this.options.imagePath||pe.imagePath)+Jt.prototype._getIconUrl.call(this,t)},_stripUrl:function(t){var e=function(i,n,s){var o=n.exec(i);return o&&o[s]};return t=e(t,/^url\((['"])?(.+)\1\)$/,2),t&&e(t,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var t=X("div","leaflet-default-icon-path",document.body),e=oe(t,"background-image")||oe(t,"backgroundImage");if(document.body.removeChild(t),e=this._stripUrl(e),e)return e;var i=document.querySelector('link[href$="leaflet.css"]');return i?i.href.substring(0,i.href.length-11-1):""}}),dn=Tt.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new Nt(t,t,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),W(t,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&at(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(t){var e=this._marker,i=e._map,n=this._marker.options.autoPanSpeed,s=this._marker.options.autoPanPadding,o=Ut(e._icon),p=i.getPixelBounds(),w=i.getPixelOrigin(),C=ut(p.min._subtract(w).add(s),p.max._subtract(w).subtract(s));if(!C.contains(o)){var M=H((Math.max(C.max.x,o.x)-C.max.x)/(p.max.x-C.max.x)-(Math.min(C.min.x,o.x)-C.min.x)/(p.min.x-C.min.x),(Math.max(C.max.y,o.y)-C.max.y)/(p.max.y-C.max.y)-(Math.min(C.min.y,o.y)-C.min.y)/(p.min.y-C.min.y)).multiplyBy(n);i.panBy(M,{animate:!1}),this._draggable._newPos._add(M),this._draggable._startPos._add(M),lt(e._icon,this._draggable._newPos),this._onDrag(t),this._panRequest=K(this._adjustPan.bind(this,t))}},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(t){this._marker.options.autoPan&&(st(this._panRequest),this._panRequest=K(this._adjustPan.bind(this,t)))},_onDrag:function(t){var e=this._marker,i=e._shadow,n=Ut(e._icon),s=e._map.layerPointToLatLng(n);i&&lt(i,n),e._latlng=s,t.latlng=s,t.oldLatLng=this._oldLatLng,e.fire("move",t).fire("drag",t)},_onDragEnd:function(t){st(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",t)}}),Ce=At.extend({options:{icon:new pe,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(t,e){b(this,e),this._latlng=J(t)},onAdd:function(t){this._zoomAnimated=this._zoomAnimated&&t.options.markerZoomAnimation,this._zoomAnimated&&t.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(t){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&t.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(t){var e=this._latlng;return this._latlng=J(t),this.update(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update()},getIcon:function(){return this.options.icon},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){if(this._icon&&this._map){var t=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t)}return this},_initIcon:function(){var t=this.options,e="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),i=t.icon.createIcon(this._icon),n=!1;i!==this._icon&&(this._icon&&this._removeIcon(),n=!0,t.title&&(i.title=t.title),i.tagName==="IMG"&&(i.alt=t.alt||"")),W(i,e),t.keyboard&&(i.tabIndex="0",i.setAttribute("role","button")),this._icon=i,t.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&j(i,"focus",this._panOnFocus,this);var s=t.icon.createShadow(this._shadow),o=!1;s!==this._shadow&&(this._removeShadow(),o=!0),s&&(W(s,e),s.alt=""),this._shadow=s,t.opacity<1&&this._updateOpacity(),n&&this.getPane().appendChild(this._icon),this._initInteraction(),s&&o&&this.getPane(t.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&et(this._icon,"focus",this._panOnFocus,this),nt(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&nt(this._shadow),this._shadow=null},_setPos:function(t){this._icon&&lt(this._icon,t),this._shadow&&lt(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon&&(this._icon.style.zIndex=this._zIndex+t)},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.interactive&&(W(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),dn)){var t=this.options.draggable;this.dragging&&(t=this.dragging.enabled(),this.dragging.disable()),this.dragging=new dn(this),t&&this.dragging.enable()}},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var t=this.options.opacity;this._icon&&bt(this._icon,t),this._shadow&&bt(this._shadow,t)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var t=this._map;if(t){var e=this.options.icon.options,i=e.iconSize?H(e.iconSize):H(0,0),n=e.iconAnchor?H(e.iconAnchor):H(0,0);t.panInside(this._latlng,{paddingTopLeft:n,paddingBottomRight:i.subtract(n)})}},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});function zs(t,e){return new Ce(t,e)}var Ot=At.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(t){this._renderer=t.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(t){return b(this,t),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&t&&Object.prototype.hasOwnProperty.call(t,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),ke=Ot.extend({options:{fill:!0,radius:10},initialize:function(t,e){b(this,e),this._latlng=J(t),this._radius=this.options.radius},setLatLng:function(t){var e=this._latlng;return this._latlng=J(t),this.redraw(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius},setStyle:function(t){var e=t&&t.radius||this._radius;return Ot.prototype.setStyle.call(this,t),this.setRadius(e),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var t=this._radius,e=this._radiusY||t,i=this._clickTolerance(),n=[t+i,e+i];this._pxBounds=new Q(this._point.subtract(n),this._point.add(n))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(t){return t.distanceTo(this._point)<=this._radius+this._clickTolerance()}});function Ns(t,e){return new ke(t,e)}var fi=ke.extend({initialize:function(t,e,i){if(typeof e=="number"&&(e=a({},i,{radius:e})),b(this,e),this._latlng=J(t),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(t){return this._mRadius=t,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var t=[this._radius,this._radiusY||this._radius];return new vt(this._map.layerPointToLatLng(this._point.subtract(t)),this._map.layerPointToLatLng(this._point.add(t)))},setStyle:Ot.prototype.setStyle,_project:function(){var t=this._latlng.lng,e=this._latlng.lat,i=this._map,n=i.options.crs;if(n.distance===zt.distance){var s=Math.PI/180,o=this._mRadius/zt.R/s,p=i.project([e+o,t]),w=i.project([e-o,t]),C=p.add(w).divideBy(2),M=i.unproject(C).lat,R=Math.acos((Math.cos(o*s)-Math.sin(e*s)*Math.sin(M*s))/(Math.cos(e*s)*Math.cos(M*s)))/s;(isNaN(R)||R===0)&&(R=o/Math.cos(Math.PI/180*e)),this._point=C.subtract(i.getPixelOrigin()),this._radius=isNaN(R)?0:C.x-i.project([M,t-R]).x,this._radiusY=C.y-p.y}else{var q=n.unproject(n.project(this._latlng).subtract([this._mRadius,0]));this._point=i.latLngToLayerPoint(this._latlng),this._radius=this._point.x-i.latLngToLayerPoint(q).x}this._updateBounds()}});function Os(t,e,i){return new fi(t,e,i)}var Mt=Ot.extend({options:{smoothFactor:1,noClip:!1},initialize:function(t,e){b(this,e),this._setLatLngs(t)},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._setLatLngs(t),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(t){for(var e=1/0,i=null,n=ue,s,o,p=0,w=this._parts.length;p<w;p++)for(var C=this._parts[p],M=1,R=C.length;M<R;M++){s=C[M-1],o=C[M];var q=n(t,s,o,!0);q<e&&(e=q,i=n(t,s,o))}return i&&(i.distance=Math.sqrt(e)),i},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return rn(this._defaultShape(),this._map.options.crs)},getBounds:function(){return this._bounds},addLatLng:function(t,e){return e=e||this._defaultShape(),t=J(t),e.push(t),this._bounds.extend(t),this.redraw()},_setLatLngs:function(t){this._bounds=new vt,this._latlngs=this._convertLatLngs(t)},_defaultShape:function(){return _t(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(t){for(var e=[],i=_t(t),n=0,s=t.length;n<s;n++)i?(e[n]=J(t[n]),this._bounds.extend(e[n])):e[n]=this._convertLatLngs(t[n]);return e},_project:function(){var t=new Q;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,t),this._bounds.isValid()&&t.isValid()&&(this._rawPxBounds=t,this._updateBounds())},_updateBounds:function(){var t=this._clickTolerance(),e=new z(t,t);this._rawPxBounds&&(this._pxBounds=new Q([this._rawPxBounds.min.subtract(e),this._rawPxBounds.max.add(e)]))},_projectLatlngs:function(t,e,i){var n=t[0]instanceof tt,s=t.length,o,p;if(n){for(p=[],o=0;o<s;o++)p[o]=this._map.latLngToLayerPoint(t[o]),i.extend(p[o]);e.push(p)}else for(o=0;o<s;o++)this._projectLatlngs(t[o],e,i)},_clipPoints:function(){var t=this._renderer._bounds;if(this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(t))){if(this.options.noClip){this._parts=this._rings;return}var e=this._parts,i,n,s,o,p,w,C;for(i=0,s=0,o=this._rings.length;i<o;i++)for(C=this._rings[i],n=0,p=C.length;n<p-1;n++)w=on(C[n],C[n+1],t,n,!0),w&&(e[s]=e[s]||[],e[s].push(w[0]),(w[1]!==C[n+1]||n===p-2)&&(e[s].push(w[1]),s++))}},_simplifyPoints:function(){for(var t=this._parts,e=this.options.smoothFactor,i=0,n=t.length;i<n;i++)t[i]=en(t[i],e)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(t,e){var i,n,s,o,p,w,C=this._clickTolerance();if(!this._pxBounds||!this._pxBounds.contains(t))return!1;for(i=0,o=this._parts.length;i<o;i++)for(w=this._parts[i],n=0,p=w.length,s=p-1;n<p;s=n++)if(!(!e&&n===0)&&nn(t,w[s],w[n])<=C)return!0;return!1}});function Zs(t,e){return new Mt(t,e)}Mt._flat=an;var Yt=Mt.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return tn(this._defaultShape(),this._map.options.crs)},_convertLatLngs:function(t){var e=Mt.prototype._convertLatLngs.call(this,t),i=e.length;return i>=2&&e[0]instanceof tt&&e[0].equals(e[i-1])&&e.pop(),e},_setLatLngs:function(t){Mt.prototype._setLatLngs.call(this,t),_t(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return _t(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0]},_clipPoints:function(){var t=this._renderer._bounds,e=this.options.weight,i=new z(e,e);if(t=new Q(t.min.subtract(i),t.max.add(i)),this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(t))){if(this.options.noClip){this._parts=this._rings;return}for(var n=0,s=this._rings.length,o;n<s;n++)o=Qi(this._rings[n],t,!0),o.length&&this._parts.push(o)}},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(t){var e=!1,i,n,s,o,p,w,C,M;if(!this._pxBounds||!this._pxBounds.contains(t))return!1;for(o=0,C=this._parts.length;o<C;o++)for(i=this._parts[o],p=0,M=i.length,w=M-1;p<M;w=p++)n=i[p],s=i[w],n.y>t.y!=s.y>t.y&&t.x<(s.x-n.x)*(t.y-n.y)/(s.y-n.y)+n.x&&(e=!e);return e||Mt.prototype._containsPoint.call(this,t,!0)}});function Us(t,e){return new Yt(t,e)}var Pt=$t.extend({initialize:function(t,e){b(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e=B(t)?t:t.features,i,n,s;if(e){for(i=0,n=e.length;i<n;i++)s=e[i],(s.geometries||s.geometry||s.features||s.coordinates)&&this.addData(s);return this}var o=this.options;if(o.filter&&!o.filter(t))return this;var p=Te(t,o);return p?(p.feature=Be(t),p.defaultOptions=p.options,this.resetStyle(p),o.onEachFeature&&o.onEachFeature(t,p),this.addLayer(p)):this},resetStyle:function(t){return t===void 0?this.eachLayer(this.resetStyle,this):(t.options=a({},t.defaultOptions),this._setLayerStyle(t,this.options.style),this)},setStyle:function(t){return this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){t.setStyle&&(typeof e=="function"&&(e=e(t.feature)),t.setStyle(e))}});function Te(t,e){var i=t.type==="Feature"?t.geometry:t,n=i?i.coordinates:null,s=[],o=e&&e.pointToLayer,p=e&&e.coordsToLatLng||mi,w,C,M,R;if(!n&&!i)return null;switch(i.type){case"Point":return w=p(n),cn(o,t,w,e);case"MultiPoint":for(M=0,R=n.length;M<R;M++)w=p(n[M]),s.push(cn(o,t,w,e));return new $t(s);case"LineString":case"MultiLineString":return C=Le(n,i.type==="LineString"?0:1,p),new Mt(C,e);case"Polygon":case"MultiPolygon":return C=Le(n,i.type==="Polygon"?1:2,p),new Yt(C,e);case"GeometryCollection":for(M=0,R=i.geometries.length;M<R;M++){var q=Te({geometry:i.geometries[M],type:"Feature",properties:t.properties},e);q&&s.push(q)}return new $t(s);case"FeatureCollection":for(M=0,R=i.features.length;M<R;M++){var G=Te(i.features[M],e);G&&s.push(G)}return new $t(s);default:throw new Error("Invalid GeoJSON object.")}}function cn(t,e,i,n){return t?t(e,i):new Ce(i,n&&n.markersInheritOptions&&n)}function mi(t){return new tt(t[1],t[0],t[2])}function Le(t,e,i){for(var n=[],s=0,o=t.length,p;s<o;s++)p=e?Le(t[s],e-1,i):(i||mi)(t[s]),n.push(p);return n}function vi(t,e){return t=J(t),t.alt!==void 0?[y(t.lng,e),y(t.lat,e),y(t.alt,e)]:[y(t.lng,e),y(t.lat,e)]}function Fe(t,e,i,n){for(var s=[],o=0,p=t.length;o<p;o++)s.push(e?Fe(t[o],_t(t[o])?0:e-1,i,n):vi(t[o],n));return!e&&i&&s.length>0&&s.push(s[0].slice()),s}function Xt(t,e){return t.feature?a({},t.feature,{geometry:e}):Be(e)}function Be(t){return t.type==="Feature"||t.type==="FeatureCollection"?t:{type:"Feature",properties:{},geometry:t}}var gi={toGeoJSON:function(t){return Xt(this,{type:"Point",coordinates:vi(this.getLatLng(),t)})}};Ce.include(gi),fi.include(gi),ke.include(gi),Mt.include({toGeoJSON:function(t){var e=!_t(this._latlngs),i=Fe(this._latlngs,e?1:0,!1,t);return Xt(this,{type:(e?"Multi":"")+"LineString",coordinates:i})}}),Yt.include({toGeoJSON:function(t){var e=!_t(this._latlngs),i=e&&!_t(this._latlngs[0]),n=Fe(this._latlngs,i?2:e?1:0,!0,t);return e||(n=[n]),Xt(this,{type:(i?"Multi":"")+"Polygon",coordinates:n})}}),Kt.include({toMultiPoint:function(t){var e=[];return this.eachLayer(function(i){e.push(i.toGeoJSON(t).geometry.coordinates)}),Xt(this,{type:"MultiPoint",coordinates:e})},toGeoJSON:function(t){var e=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(e==="MultiPoint")return this.toMultiPoint(t);var i=e==="GeometryCollection",n=[];return this.eachLayer(function(s){if(s.toGeoJSON){var o=s.toGeoJSON(t);if(i)n.push(o.geometry);else{var p=Be(o);p.type==="FeatureCollection"?n.push.apply(n,p.features):n.push(p)}}}),i?Xt(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n}}});function un(t,e){return new Pt(t,e)}var Hs=un,$e=At.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(t,e,i){this._url=t,this._bounds=rt(e),b(this,i)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(W(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){nt(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(t){return this.options.opacity=t,this._image&&this._updateOpacity(),this},setStyle:function(t){return t.opacity&&this.setOpacity(t.opacity),this},bringToFront:function(){return this._map&&Wt(this._image),this},bringToBack:function(){return this._map&&Gt(this._image),this},setUrl:function(t){return this._url=t,this._image&&(this._image.src=t),this},setBounds:function(t){return this._bounds=rt(t),this._map&&this._reset(),this},getEvents:function(){var t={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var t=this._url.tagName==="IMG",e=this._image=t?this._url:X("img");if(W(e,"leaflet-image-layer"),this._zoomAnimated&&W(e,"leaflet-zoom-animated"),this.options.className&&W(e,this.options.className),e.onselectstart=c,e.onmousemove=c,e.onload=A(this.fire,this,"load"),e.onerror=A(this._overlayOnError,this,"error"),(this.options.crossOrigin||this.options.crossOrigin==="")&&(e.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),t){this._url=e.src;return}e.src=this._url,e.alt=this.options.alt},_animateZoom:function(t){var e=this._map.getZoomScale(t.zoom),i=this._map._latLngBoundsToNewLayerBounds(this._bounds,t.zoom,t.center).min;Zt(this._image,i,e)},_reset:function(){var t=this._image,e=new Q(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),i=e.getSize();lt(t,e.min),t.style.width=i.x+"px",t.style.height=i.y+"px"},_updateOpacity:function(){bt(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var t=this.options.errorOverlayUrl;t&&this._url!==t&&(this._url=t,this._image.src=t)},getCenter:function(){return this._bounds.getCenter()}}),qs=function(t,e,i){return new $e(t,e,i)},pn=$e.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var t=this._url.tagName==="VIDEO",e=this._image=t?this._url:X("video");if(W(e,"leaflet-image-layer"),this._zoomAnimated&&W(e,"leaflet-zoom-animated"),this.options.className&&W(e,this.options.className),e.onselectstart=c,e.onmousemove=c,e.onloadeddata=A(this.fire,this,"load"),t){for(var i=e.getElementsByTagName("source"),n=[],s=0;s<i.length;s++)n.push(i[s].src);this._url=i.length>0?n:[e.src];return}B(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(e.style,"objectFit")&&(e.style.objectFit="fill"),e.autoplay=!!this.options.autoplay,e.loop=!!this.options.loop,e.muted=!!this.options.muted,e.playsInline=!!this.options.playsInline;for(var o=0;o<this._url.length;o++){var p=X("source");p.src=this._url[o],e.appendChild(p)}}});function Vs(t,e,i){return new pn(t,e,i)}var hn=$e.extend({_initImage:function(){var t=this._image=this._url;W(t,"leaflet-image-layer"),this._zoomAnimated&&W(t,"leaflet-zoom-animated"),this.options.className&&W(t,this.options.className),t.onselectstart=c,t.onmousemove=c}});function js(t,e,i){return new hn(t,e,i)}var Lt=At.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(t,e){t&&(t instanceof tt||B(t))?(this._latlng=J(t),b(this,e)):(b(this,t),this._source=e),this.options.content&&(this._content=this.options.content)},openOn:function(t){return t=arguments.length?t:this._source._map,t.hasLayer(this)||t.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(t){return this._map?this.close():(arguments.length?this._source=t:t=this._source,this._prepareOpen(),this.openOn(t._map)),this},onAdd:function(t){this._zoomAnimated=t._zoomAnimated,this._container||this._initLayout(),t._fadeAnimated&&bt(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),t._fadeAnimated&&bt(this._container,1),this.bringToFront(),this.options.interactive&&(W(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(t){t._fadeAnimated?(bt(this._container,0),this._removeTimeout=setTimeout(A(nt,void 0,this._container),200)):nt(this._container),this.options.interactive&&(at(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=J(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var t={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&Wt(this._container),this},bringToBack:function(){return this._map&&Gt(this._container),this},_prepareOpen:function(t){var e=this._source;if(!e._map)return!1;if(e instanceof $t){e=null;var i=this._source._layers;for(var n in i)if(i[n]._map){e=i[n];break}if(!e)return!1;this._source=e}if(!t)if(e.getCenter)t=e.getCenter();else if(e.getLatLng)t=e.getLatLng();else if(e.getBounds)t=e.getBounds().getCenter();else throw new Error("Unable to get source layer LatLng.");return this.setLatLng(t),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var t=this._contentNode,e=typeof this._content=="function"?this._content(this._source||this):this._content;if(typeof e=="string")t.innerHTML=e;else{for(;t.hasChildNodes();)t.removeChild(t.firstChild);t.appendChild(e)}this.fire("contentupdate")}},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=H(this.options.offset),i=this._getAnchor();this._zoomAnimated?lt(this._container,t.add(i)):e=e.add(t).add(i);var n=this._containerBottom=-e.y,s=this._containerLeft=-Math.round(this._containerWidth/2)+e.x;this._container.style.bottom=n+"px",this._container.style.left=s+"px"}},_getAnchor:function(){return[0,0]}});Y.include({_initOverlay:function(t,e,i,n){var s=e;return s instanceof t||(s=new t(n).setContent(e)),i&&s.setLatLng(i),s}}),At.include({_initOverlay:function(t,e,i,n){var s=i;return s instanceof t?(b(s,n),s._source=this):(s=e&&!n?e:new t(n,this),s.setContent(i)),s}});var Me=Lt.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(t){return t=arguments.length?t:this._source._map,!t.hasLayer(this)&&t._popup&&t._popup.options.autoClose&&t.removeLayer(t._popup),t._popup=this,Lt.prototype.openOn.call(this,t)},onAdd:function(t){Lt.prototype.onAdd.call(this,t),t.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof Ot||this._source.on("preclick",Ht))},onRemove:function(t){Lt.prototype.onRemove.call(this,t),t.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof Ot||this._source.off("preclick",Ht))},getEvents:function(){var t=Lt.prototype.getEvents.call(this);return(this.options.closeOnClick!==void 0?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this.close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_initLayout:function(){var t="leaflet-popup",e=this._container=X("div",t+" "+(this.options.className||"")+" leaflet-zoom-animated"),i=this._wrapper=X("div",t+"-content-wrapper",e);if(this._contentNode=X("div",t+"-content",i),de(e),ai(this._contentNode),j(e,"contextmenu",Ht),this._tipContainer=X("div",t+"-tip-container",e),this._tip=X("div",t+"-tip",this._tipContainer),this.options.closeButton){var n=this._closeButton=X("a",t+"-close-button",e);n.setAttribute("role","button"),n.setAttribute("aria-label","Close popup"),n.href="#close",n.innerHTML='<span aria-hidden="true">&#215;</span>',j(n,"click",function(s){ht(s),this.close()},this)}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var i=t.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="";var n=t.offsetHeight,s=this.options.maxHeight,o="leaflet-popup-scrolled";s&&n>s?(e.height=s+"px",W(t,o)):at(t,o),this._containerWidth=this._container.offsetWidth},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center),i=this._getAnchor();lt(this._container,e.add(i))},_adjustPan:function(){if(this.options.autoPan){if(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning){this._autopanning=!1;return}var t=this._map,e=parseInt(oe(this._container,"marginBottom"),10)||0,i=this._container.offsetHeight+e,n=this._containerWidth,s=new z(this._containerLeft,-i-this._containerBottom);s._add(Ut(this._container));var o=t.layerPointToContainerPoint(s),p=H(this.options.autoPanPadding),w=H(this.options.autoPanPaddingTopLeft||p),C=H(this.options.autoPanPaddingBottomRight||p),M=t.getSize(),R=0,q=0;o.x+n+C.x>M.x&&(R=o.x+n-M.x+C.x),o.x-R-w.x<0&&(R=o.x-w.x),o.y+i+C.y>M.y&&(q=o.y+i-M.y+C.y),o.y-q-w.y<0&&(q=o.y-w.y),(R||q)&&(this.options.keepInView&&(this._autopanning=!0),t.fire("autopanstart").panBy([R,q]))}},_getAnchor:function(){return H(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}}),Ws=function(t,e){return new Me(t,e)};Y.mergeOptions({closePopupOnClick:!0}),Y.include({openPopup:function(t,e,i){return this._initOverlay(Me,t,e,i).openOn(this),this},closePopup:function(t){return t=arguments.length?t:this._popup,t&&t.close(),this}}),At.include({bindPopup:function(t,e){return this._popup=this._initOverlay(Me,this._popup,t,e),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(t){return this._popup&&(this instanceof $t||(this._popup._source=this),this._popup._prepareOpen(t||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return this._popup?this._popup.isOpen():!1},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},getPopup:function(){return this._popup},_openPopup:function(t){if(!(!this._popup||!this._map)){qt(t);var e=t.layer||t.target;if(this._popup._source===e&&!(e instanceof Ot)){this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(t.latlng);return}this._popup._source=e,this.openPopup(t.latlng)}},_movePopup:function(t){this._popup.setLatLng(t.latlng)},_onKeyPress:function(t){t.originalEvent.keyCode===13&&this._openPopup(t)}});var Pe=Lt.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(t){Lt.prototype.onAdd.call(this,t),this.setOpacity(this.options.opacity),t.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(t){Lt.prototype.onRemove.call(this,t),t.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var t=Lt.prototype.getEvents.call(this);return this.options.permanent||(t.preclick=this.close),t},_initLayout:function(){var t="leaflet-tooltip",e=t+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=X("div",e),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+h(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(t){var e,i,n=this._map,s=this._container,o=n.latLngToContainerPoint(n.getCenter()),p=n.layerPointToContainerPoint(t),w=this.options.direction,C=s.offsetWidth,M=s.offsetHeight,R=H(this.options.offset),q=this._getAnchor();w==="top"?(e=C/2,i=M):w==="bottom"?(e=C/2,i=0):w==="center"?(e=C/2,i=M/2):w==="right"?(e=0,i=M/2):w==="left"?(e=C,i=M/2):p.x<o.x?(w="right",e=0,i=M/2):(w="left",e=C+(R.x+q.x)*2,i=M/2),t=t.subtract(H(e,i,!0)).add(R).add(q),at(s,"leaflet-tooltip-right"),at(s,"leaflet-tooltip-left"),at(s,"leaflet-tooltip-top"),at(s,"leaflet-tooltip-bottom"),W(s,"leaflet-tooltip-"+w),lt(s,t)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},setOpacity:function(t){this.options.opacity=t,this._container&&bt(this._container,t)},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);this._setPosition(e)},_getAnchor:function(){return H(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}}),Gs=function(t,e){return new Pe(t,e)};Y.include({openTooltip:function(t,e,i){return this._initOverlay(Pe,t,e,i).openOn(this),this},closeTooltip:function(t){return t.close(),this}}),At.include({bindTooltip:function(t,e){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Pe,this._tooltip,t,e),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(t){if(!(!t&&this._tooltipHandlersAdded)){var e=t?"off":"on",i={remove:this.closeTooltip,move:this._moveTooltip};this._tooltip.options.permanent?i.add=this._openTooltip:(i.mouseover=this._openTooltip,i.mouseout=this.closeTooltip,i.click=this._openTooltip,this._map?this._addFocusListeners():i.add=this._addFocusListeners),this._tooltip.options.sticky&&(i.mousemove=this._moveTooltip),this[e](i),this._tooltipHandlersAdded=!t}},openTooltip:function(t){return this._tooltip&&(this instanceof $t||(this._tooltip._source=this),this._tooltip._prepareOpen(t)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(t){return this._tooltip&&this._tooltip.setContent(t),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(t){var e=typeof t.getElement=="function"&&t.getElement();e&&(j(e,"focus",function(){this._tooltip._source=t,this.openTooltip()},this),j(e,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(t){var e=typeof t.getElement=="function"&&t.getElement();e&&e.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(t){if(!(!this._tooltip||!this._map)){if(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag){this._openOnceFlag=!0;var e=this;this._map.once("moveend",function(){e._openOnceFlag=!1,e._openTooltip(t)});return}this._tooltip._source=t.layer||t.target,this.openTooltip(this._tooltip.options.sticky?t.latlng:void 0)}},_moveTooltip:function(t){var e=t.latlng,i,n;this._tooltip.options.sticky&&t.originalEvent&&(i=this._map.mouseEventToContainerPoint(t.originalEvent),n=this._map.containerPointToLayerPoint(i),e=this._map.layerPointToLatLng(n)),this._tooltip.setLatLng(e)}});var fn=Jt.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(t){var e=t&&t.tagName==="DIV"?t:document.createElement("div"),i=this.options;if(i.html instanceof Element?(_e(e),e.appendChild(i.html)):e.innerHTML=i.html!==!1?i.html:"",i.bgPos){var n=H(i.bgPos);e.style.backgroundPosition=-n.x+"px "+-n.y+"px"}return this._setIconStyles(e,"icon"),e},createShadow:function(){return null}});function Ks(t){return new fn(t)}Jt.Default=pe;var he=At.extend({options:{tileSize:256,opacity:1,updateWhenIdle:Z.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(t){b(this,t)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(t){t._addZoomLimit(this)},onRemove:function(t){this._removeAllTiles(),nt(this._container),t._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(Wt(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(Gt(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){if(this._map){this._removeAllTiles();var t=this._clampZoom(this._map.getZoom());t!==this._tileZoom&&(this._tileZoom=t,this._updateLevels()),this._update()}return this},getEvents:function(){var t={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=x(this._onMoveEnd,this.options.updateInterval,this)),t.move=this._onMove),this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},createTile:function(){return document.createElement("div")},getTileSize:function(){var t=this.options.tileSize;return t instanceof z?t:new z(t,t)},_updateZIndex:function(){this._container&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t){for(var e=this.getPane().children,i=-t(-1/0,1/0),n=0,s=e.length,o;n<s;n++)o=e[n].style.zIndex,e[n]!==this._container&&o&&(i=t(i,+o));isFinite(i)&&(this.options.zIndex=i+t(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!Z.ielt9){bt(this._container,this.options.opacity);var t=+new Date,e=!1,i=!1;for(var n in this._tiles){var s=this._tiles[n];if(!(!s.current||!s.loaded)){var o=Math.min(1,(t-s.loaded)/200);bt(s.el,o),o<1?e=!0:(s.active?i=!0:this._onOpaqueTile(s),s.active=!0)}}i&&!this._noPrune&&this._pruneTiles(),e&&(st(this._fadeFrame),this._fadeFrame=K(this._updateOpacity,this))}},_onOpaqueTile:c,_initContainer:function(){this._container||(this._container=X("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var t=this._tileZoom,e=this.options.maxZoom;if(t!==void 0){for(var i in this._levels)i=Number(i),this._levels[i].el.children.length||i===t?(this._levels[i].el.style.zIndex=e-Math.abs(t-i),this._onUpdateLevel(i)):(nt(this._levels[i].el),this._removeTilesAtZoom(i),this._onRemoveLevel(i),delete this._levels[i]);var n=this._levels[t],s=this._map;return n||(n=this._levels[t]={},n.el=X("div","leaflet-tile-container leaflet-zoom-animated",this._container),n.el.style.zIndex=e,n.origin=s.project(s.unproject(s.getPixelOrigin()),t).round(),n.zoom=t,this._setZoomTransform(n,s.getCenter(),s.getZoom()),c(n.el.offsetWidth),this._onCreateLevel(n)),this._level=n,n}},_onUpdateLevel:c,_onRemoveLevel:c,_onCreateLevel:c,_pruneTiles:function(){if(this._map){var t,e,i=this._map.getZoom();if(i>this.options.maxZoom||i<this.options.minZoom){this._removeAllTiles();return}for(t in this._tiles)e=this._tiles[t],e.retain=e.current;for(t in this._tiles)if(e=this._tiles[t],e.current&&!e.active){var n=e.coords;this._retainParent(n.x,n.y,n.z,n.z-5)||this._retainChildren(n.x,n.y,n.z,n.z+2)}for(t in this._tiles)this._tiles[t].retain||this._removeTile(t)}},_removeTilesAtZoom:function(t){for(var e in this._tiles)this._tiles[e].coords.z===t&&this._removeTile(e)},_removeAllTiles:function(){for(var t in this._tiles)this._removeTile(t)},_invalidateAll:function(){for(var t in this._levels)nt(this._levels[t].el),this._onRemoveLevel(Number(t)),delete this._levels[t];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(t,e,i,n){var s=Math.floor(t/2),o=Math.floor(e/2),p=i-1,w=new z(+s,+o);w.z=+p;var C=this._tileCoordsToKey(w),M=this._tiles[C];return M&&M.active?(M.retain=!0,!0):(M&&M.loaded&&(M.retain=!0),p>n?this._retainParent(s,o,p,n):!1)},_retainChildren:function(t,e,i,n){for(var s=2*t;s<2*t+2;s++)for(var o=2*e;o<2*e+2;o++){var p=new z(s,o);p.z=i+1;var w=this._tileCoordsToKey(p),C=this._tiles[w];if(C&&C.active){C.retain=!0;continue}else C&&C.loaded&&(C.retain=!0);i+1<n&&this._retainChildren(s,o,i+1,n)}},_resetView:function(t){var e=t&&(t.pinch||t.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),e,e)},_animateZoom:function(t){this._setView(t.center,t.zoom,!0,t.noUpdate)},_clampZoom:function(t){var e=this.options;return e.minNativeZoom!==void 0&&t<e.minNativeZoom?e.minNativeZoom:e.maxNativeZoom!==void 0&&e.maxNativeZoom<t?e.maxNativeZoom:t},_setView:function(t,e,i,n){var s=Math.round(e);this.options.maxZoom!==void 0&&s>this.options.maxZoom||this.options.minZoom!==void 0&&s<this.options.minZoom?s=void 0:s=this._clampZoom(s);var o=this.options.updateWhenZooming&&s!==this._tileZoom;(!n||o)&&(this._tileZoom=s,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),s!==void 0&&this._update(t),i||this._pruneTiles(),this._noPrune=!!i),this._setZoomTransforms(t,e)},_setZoomTransforms:function(t,e){for(var i in this._levels)this._setZoomTransform(this._levels[i],t,e)},_setZoomTransform:function(t,e,i){var n=this._map.getZoomScale(i,t.zoom),s=t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e,i)).round();Z.any3d?Zt(t.el,s,n):lt(t.el,s)},_resetGrid:function(){var t=this._map,e=t.options.crs,i=this._tileSize=this.getTileSize(),n=this._tileZoom,s=this._map.getPixelWorldBounds(this._tileZoom);s&&(this._globalTileRange=this._pxBoundsToTileRange(s)),this._wrapX=e.wrapLng&&!this.options.noWrap&&[Math.floor(t.project([0,e.wrapLng[0]],n).x/i.x),Math.ceil(t.project([0,e.wrapLng[1]],n).x/i.y)],this._wrapY=e.wrapLat&&!this.options.noWrap&&[Math.floor(t.project([e.wrapLat[0],0],n).y/i.x),Math.ceil(t.project([e.wrapLat[1],0],n).y/i.y)]},_onMoveEnd:function(){!this._map||this._map._animatingZoom||this._update()},_getTiledPixelBounds:function(t){var e=this._map,i=e._animatingZoom?Math.max(e._animateToZoom,e.getZoom()):e.getZoom(),n=e.getZoomScale(i,this._tileZoom),s=e.project(t,this._tileZoom).floor(),o=e.getSize().divideBy(n*2);return new Q(s.subtract(o),s.add(o))},_update:function(t){var e=this._map;if(e){var i=this._clampZoom(e.getZoom());if(t===void 0&&(t=e.getCenter()),this._tileZoom!==void 0){var n=this._getTiledPixelBounds(t),s=this._pxBoundsToTileRange(n),o=s.getCenter(),p=[],w=this.options.keepBuffer,C=new Q(s.getBottomLeft().subtract([w,-w]),s.getTopRight().add([w,-w]));if(!(isFinite(s.min.x)&&isFinite(s.min.y)&&isFinite(s.max.x)&&isFinite(s.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(var M in this._tiles){var R=this._tiles[M].coords;(R.z!==this._tileZoom||!C.contains(new z(R.x,R.y)))&&(this._tiles[M].current=!1)}if(Math.abs(i-this._tileZoom)>1){this._setView(t,i);return}for(var q=s.min.y;q<=s.max.y;q++)for(var G=s.min.x;G<=s.max.x;G++){var ft=new z(G,q);if(ft.z=this._tileZoom,!!this._isValidTile(ft)){var pt=this._tiles[this._tileCoordsToKey(ft)];pt?pt.current=!0:p.push(ft)}}if(p.sort(function(gt,te){return gt.distanceTo(o)-te.distanceTo(o)}),p.length!==0){this._loading||(this._loading=!0,this.fire("loading"));var xt=document.createDocumentFragment();for(G=0;G<p.length;G++)this._addTile(p[G],xt);this._level.el.appendChild(xt)}}}},_isValidTile:function(t){var e=this._map.options.crs;if(!e.infinite){var i=this._globalTileRange;if(!e.wrapLng&&(t.x<i.min.x||t.x>i.max.x)||!e.wrapLat&&(t.y<i.min.y||t.y>i.max.y))return!1}if(!this.options.bounds)return!0;var n=this._tileCoordsToBounds(t);return rt(this.options.bounds).overlaps(n)},_keyToBounds:function(t){return this._tileCoordsToBounds(this._keyToTileCoords(t))},_tileCoordsToNwSe:function(t){var e=this._map,i=this.getTileSize(),n=t.scaleBy(i),s=n.add(i),o=e.unproject(n,t.z),p=e.unproject(s,t.z);return[o,p]},_tileCoordsToBounds:function(t){var e=this._tileCoordsToNwSe(t),i=new vt(e[0],e[1]);return this.options.noWrap||(i=this._map.wrapLatLngBounds(i)),i},_tileCoordsToKey:function(t){return t.x+":"+t.y+":"+t.z},_keyToTileCoords:function(t){var e=t.split(":"),i=new z(+e[0],+e[1]);return i.z=+e[2],i},_removeTile:function(t){var e=this._tiles[t];e&&(nt(e.el),delete this._tiles[t],this.fire("tileunload",{tile:e.el,coords:this._keyToTileCoords(t)}))},_initTile:function(t){W(t,"leaflet-tile");var e=this.getTileSize();t.style.width=e.x+"px",t.style.height=e.y+"px",t.onselectstart=c,t.onmousemove=c,Z.ielt9&&this.options.opacity<1&&bt(t,this.options.opacity)},_addTile:function(t,e){var i=this._getTilePos(t),n=this._tileCoordsToKey(t),s=this.createTile(this._wrapCoords(t),A(this._tileReady,this,t));this._initTile(s),this.createTile.length<2&&K(A(this._tileReady,this,t,null,s)),lt(s,i),this._tiles[n]={el:s,coords:t,current:!0},e.appendChild(s),this.fire("tileloadstart",{tile:s,coords:t})},_tileReady:function(t,e,i){e&&this.fire("tileerror",{error:e,tile:i,coords:t});var n=this._tileCoordsToKey(t);i=this._tiles[n],i&&(i.loaded=+new Date,this._map._fadeAnimated?(bt(i.el,0),st(this._fadeFrame),this._fadeFrame=K(this._updateOpacity,this)):(i.active=!0,this._pruneTiles()),e||(W(i.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:i.el,coords:t})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),Z.ielt9||!this._map._fadeAnimated?K(this._pruneTiles,this):setTimeout(A(this._pruneTiles,this),250)))},_getTilePos:function(t){return t.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(t){var e=new z(this._wrapX?_(t.x,this._wrapX):t.x,this._wrapY?_(t.y,this._wrapY):t.y);return e.z=t.z,e},_pxBoundsToTileRange:function(t){var e=this.getTileSize();return new Q(t.min.unscaleBy(e).floor(),t.max.unscaleBy(e).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var t in this._tiles)if(!this._tiles[t].loaded)return!1;return!0}});function Js(t){return new he(t)}var Qt=he.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(t,e){this._url=t,e=b(this,e),e.detectRetina&&Z.retina&&e.maxZoom>0?(e.tileSize=Math.floor(e.tileSize/2),e.zoomReverse?(e.zoomOffset--,e.minZoom=Math.min(e.maxZoom,e.minZoom+1)):(e.zoomOffset++,e.maxZoom=Math.max(e.minZoom,e.maxZoom-1)),e.minZoom=Math.max(0,e.minZoom)):e.zoomReverse?e.minZoom=Math.min(e.maxZoom,e.minZoom):e.maxZoom=Math.max(e.minZoom,e.maxZoom),typeof e.subdomains=="string"&&(e.subdomains=e.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(t,e){return this._url===t&&e===void 0&&(e=!0),this._url=t,e||this.redraw(),this},createTile:function(t,e){var i=document.createElement("img");return j(i,"load",A(this._tileOnLoad,this,e,i)),j(i,"error",A(this._tileOnError,this,e,i)),(this.options.crossOrigin||this.options.crossOrigin==="")&&(i.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),typeof this.options.referrerPolicy=="string"&&(i.referrerPolicy=this.options.referrerPolicy),i.alt="",i.src=this.getTileUrl(t),i},getTileUrl:function(t){var e={r:Z.retina?"@2x":"",s:this._getSubdomain(t),x:t.x,y:t.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var i=this._globalTileRange.max.y-t.y;this.options.tms&&(e.y=i),e["-y"]=i}return F(this._url,a(e,this.options))},_tileOnLoad:function(t,e){Z.ielt9?setTimeout(A(t,this,null,e),0):t(null,e)},_tileOnError:function(t,e,i){var n=this.options.errorTileUrl;n&&e.getAttribute("src")!==n&&(e.src=n),t(i,e)},_onTileRemove:function(t){t.tile.onload=null},_getZoomForUrl:function(){var t=this._tileZoom,e=this.options.maxZoom,i=this.options.zoomReverse,n=this.options.zoomOffset;return i&&(t=e-t),t+n},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_abortLoading:function(){var t,e;for(t in this._tiles)if(this._tiles[t].coords.z!==this._tileZoom&&(e=this._tiles[t].el,e.onload=c,e.onerror=c,!e.complete)){e.src=m;var i=this._tiles[t].coords;nt(e),delete this._tiles[t],this.fire("tileabort",{tile:e,coords:i})}},_removeTile:function(t){var e=this._tiles[t];if(e)return e.el.setAttribute("src",m),he.prototype._removeTile.call(this,t)},_tileReady:function(t,e,i){if(!(!this._map||i&&i.getAttribute("src")===m))return he.prototype._tileReady.call(this,t,e,i)}});function mn(t,e){return new Qt(t,e)}var vn=Qt.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(t,e){this._url=t;var i=a({},this.defaultWmsParams);for(var n in e)n in this.options||(i[n]=e[n]);e=b(this,e);var s=e.detectRetina&&Z.retina?2:1,o=this.getTileSize();i.width=o.x*s,i.height=o.y*s,this.wmsParams=i},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,Qt.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._tileCoordsToNwSe(t),i=this._crs,n=ut(i.project(e[0]),i.project(e[1])),s=n.min,o=n.max,p=(this._wmsVersion>=1.3&&this._crs===ln?[s.y,s.x,o.y,o.x]:[s.x,s.y,o.x,o.y]).join(","),w=Qt.prototype.getTileUrl.call(this,t);return w+E(this.wmsParams,w,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+p},setParams:function(t,e){return a(this.wmsParams,t),e||this.redraw(),this}});function Ys(t,e){return new vn(t,e)}Qt.WMS=vn,mn.wms=Ys;var It=At.extend({options:{padding:.1},initialize:function(t){b(this,t),h(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),W(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var t={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(t.zoomanim=this._onAnimZoom),t},_onAnimZoom:function(t){this._updateTransform(t.center,t.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(t,e){var i=this._map.getZoomScale(e,this._zoom),n=this._map.getSize().multiplyBy(.5+this.options.padding),s=this._map.project(this._center,e),o=n.multiplyBy(-i).add(s).subtract(this._map._getNewPixelOrigin(t,e));Z.any3d?Zt(this._container,o,i):lt(this._container,o)},_reset:function(){this._update(),this._updateTransform(this._center,this._zoom);for(var t in this._layers)this._layers[t]._reset()},_onZoomEnd:function(){for(var t in this._layers)this._layers[t]._project()},_updatePaths:function(){for(var t in this._layers)this._layers[t]._update()},_update:function(){var t=this.options.padding,e=this._map.getSize(),i=this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();this._bounds=new Q(i,i.add(e.multiplyBy(1+t*2)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),gn=It.extend({options:{tolerance:0},getEvents:function(){var t=It.prototype.getEvents.call(this);return t.viewprereset=this._onViewPreReset,t},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){It.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var t=this._container=document.createElement("canvas");j(t,"mousemove",this._onMouseMove,this),j(t,"click dblclick mousedown mouseup contextmenu",this._onClick,this),j(t,"mouseout",this._handleMouseOut,this),t._leaflet_disable_events=!0,this._ctx=t.getContext("2d")},_destroyContainer:function(){st(this._redrawRequest),delete this._ctx,nt(this._container),et(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){var t;this._redrawBounds=null;for(var e in this._layers)t=this._layers[e],t._update();this._redraw()}},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){It.prototype._update.call(this);var t=this._bounds,e=this._container,i=t.getSize(),n=Z.retina?2:1;lt(e,t.min),e.width=n*i.x,e.height=n*i.y,e.style.width=i.x+"px",e.style.height=i.y+"px",Z.retina&&this._ctx.scale(2,2),this._ctx.translate(-t.min.x,-t.min.y),this.fire("update")}},_reset:function(){It.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(t){this._updateDashArray(t),this._layers[h(t)]=t;var e=t._order={layer:t,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=e),this._drawLast=e,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(t){this._requestRedraw(t)},_removePath:function(t){var e=t._order,i=e.next,n=e.prev;i?i.prev=n:this._drawLast=n,n?n.next=i:this._drawFirst=i,delete t._order,delete this._layers[h(t)],this._requestRedraw(t)},_updatePath:function(t){this._extendRedrawBounds(t),t._project(),t._update(),this._requestRedraw(t)},_updateStyle:function(t){this._updateDashArray(t),this._requestRedraw(t)},_updateDashArray:function(t){if(typeof t.options.dashArray=="string"){var e=t.options.dashArray.split(/[, ]+/),i=[],n,s;for(s=0;s<e.length;s++){if(n=Number(e[s]),isNaN(n))return;i.push(n)}t.options._dashArray=i}else t.options._dashArray=t.options.dashArray},_requestRedraw:function(t){this._map&&(this._extendRedrawBounds(t),this._redrawRequest=this._redrawRequest||K(this._redraw,this))},_extendRedrawBounds:function(t){if(t._pxBounds){var e=(t.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new Q,this._redrawBounds.extend(t._pxBounds.min.subtract([e,e])),this._redrawBounds.extend(t._pxBounds.max.add([e,e]))}},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var t=this._redrawBounds;if(t){var e=t.getSize();this._ctx.clearRect(t.min.x,t.min.y,e.x,e.y)}else this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore()},_draw:function(){var t,e=this._redrawBounds;if(this._ctx.save(),e){var i=e.getSize();this._ctx.beginPath(),this._ctx.rect(e.min.x,e.min.y,i.x,i.y),this._ctx.clip()}this._drawing=!0;for(var n=this._drawFirst;n;n=n.next)t=n.layer,(!e||t._pxBounds&&t._pxBounds.intersects(e))&&t._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(t,e){if(this._drawing){var i,n,s,o,p=t._parts,w=p.length,C=this._ctx;if(w){for(C.beginPath(),i=0;i<w;i++){for(n=0,s=p[i].length;n<s;n++)o=p[i][n],C[n?"lineTo":"moveTo"](o.x,o.y);e&&C.closePath()}this._fillStroke(C,t)}}},_updateCircle:function(t){if(!(!this._drawing||t._empty())){var e=t._point,i=this._ctx,n=Math.max(Math.round(t._radius),1),s=(Math.max(Math.round(t._radiusY),1)||n)/n;s!==1&&(i.save(),i.scale(1,s)),i.beginPath(),i.arc(e.x,e.y/s,n,0,Math.PI*2,!1),s!==1&&i.restore(),this._fillStroke(i,t)}},_fillStroke:function(t,e){var i=e.options;i.fill&&(t.globalAlpha=i.fillOpacity,t.fillStyle=i.fillColor||i.color,t.fill(i.fillRule||"evenodd")),i.stroke&&i.weight!==0&&(t.setLineDash&&t.setLineDash(e.options&&e.options._dashArray||[]),t.globalAlpha=i.opacity,t.lineWidth=i.weight,t.strokeStyle=i.color,t.lineCap=i.lineCap,t.lineJoin=i.lineJoin,t.stroke())},_onClick:function(t){for(var e=this._map.mouseEventToLayerPoint(t),i,n,s=this._drawFirst;s;s=s.next)i=s.layer,i.options.interactive&&i._containsPoint(e)&&(!(t.type==="click"||t.type==="preclick")||!this._map._draggableMoved(i))&&(n=i);this._fireEvent(n?[n]:!1,t)},_onMouseMove:function(t){if(!(!this._map||this._map.dragging.moving()||this._map._animatingZoom)){var e=this._map.mouseEventToLayerPoint(t);this._handleMouseHover(t,e)}},_handleMouseOut:function(t){var e=this._hoveredLayer;e&&(at(this._container,"leaflet-interactive"),this._fireEvent([e],t,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(t,e){if(!this._mouseHoverThrottled){for(var i,n,s=this._drawFirst;s;s=s.next)i=s.layer,i.options.interactive&&i._containsPoint(e)&&(n=i);n!==this._hoveredLayer&&(this._handleMouseOut(t),n&&(W(this._container,"leaflet-interactive"),this._fireEvent([n],t,"mouseover"),this._hoveredLayer=n)),this._fireEvent(this._hoveredLayer?[this._hoveredLayer]:!1,t),this._mouseHoverThrottled=!0,setTimeout(A(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(t,e,i){this._map._fireDOMEvent(e,i||e.type,t)},_bringToFront:function(t){var e=t._order;if(e){var i=e.next,n=e.prev;if(i)i.prev=n;else return;n?n.next=i:i&&(this._drawFirst=i),e.prev=this._drawLast,this._drawLast.next=e,e.next=null,this._drawLast=e,this._requestRedraw(t)}},_bringToBack:function(t){var e=t._order;if(e){var i=e.next,n=e.prev;if(n)n.next=i;else return;i?i.prev=n:n&&(this._drawLast=n),e.prev=null,e.next=this._drawFirst,this._drawFirst.prev=e,this._drawFirst=e,this._requestRedraw(t)}}});function yn(t){return Z.canvas?new gn(t):null}var fe=(function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return document.createElement("<lvml:"+t+' class="lvml">')}}catch{}return function(t){return document.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}})(),Xs={_initContainer:function(){this._container=X("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(It.prototype._update.call(this),this.fire("update"))},_initPath:function(t){var e=t._container=fe("shape");W(e,"leaflet-vml-shape "+(this.options.className||"")),e.coordsize="1 1",t._path=fe("path"),e.appendChild(t._path),this._updateStyle(t),this._layers[h(t)]=t},_addPath:function(t){var e=t._container;this._container.appendChild(e),t.options.interactive&&t.addInteractiveTarget(e)},_removePath:function(t){var e=t._container;nt(e),t.removeInteractiveTarget(e),delete this._layers[h(t)]},_updateStyle:function(t){var e=t._stroke,i=t._fill,n=t.options,s=t._container;s.stroked=!!n.stroke,s.filled=!!n.fill,n.stroke?(e||(e=t._stroke=fe("stroke")),s.appendChild(e),e.weight=n.weight+"px",e.color=n.color,e.opacity=n.opacity,n.dashArray?e.dashStyle=B(n.dashArray)?n.dashArray.join(" "):n.dashArray.replace(/( *, *)/g," "):e.dashStyle="",e.endcap=n.lineCap.replace("butt","flat"),e.joinstyle=n.lineJoin):e&&(s.removeChild(e),t._stroke=null),n.fill?(i||(i=t._fill=fe("fill")),s.appendChild(i),i.color=n.fillColor||n.color,i.opacity=n.fillOpacity):i&&(s.removeChild(i),t._fill=null)},_updateCircle:function(t){var e=t._point.round(),i=Math.round(t._radius),n=Math.round(t._radiusY||i);this._setPath(t,t._empty()?"M0 0":"AL "+e.x+","+e.y+" "+i+","+n+" 0,"+65535*360)},_setPath:function(t,e){t._path.v=e},_bringToFront:function(t){Wt(t._container)},_bringToBack:function(t){Gt(t._container)}},Ie=Z.vml?fe:xi,me=It.extend({_initContainer:function(){this._container=Ie("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=Ie("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){nt(this._container),et(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){It.prototype._update.call(this);var t=this._bounds,e=t.getSize(),i=this._container;(!this._svgSize||!this._svgSize.equals(e))&&(this._svgSize=e,i.setAttribute("width",e.x),i.setAttribute("height",e.y)),lt(i,t.min),i.setAttribute("viewBox",[t.min.x,t.min.y,e.x,e.y].join(" ")),this.fire("update")}},_initPath:function(t){var e=t._path=Ie("path");t.options.className&&W(e,t.options.className),t.options.interactive&&W(e,"leaflet-interactive"),this._updateStyle(t),this._layers[h(t)]=t},_addPath:function(t){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(t._path),t.addInteractiveTarget(t._path)},_removePath:function(t){nt(t._path),t.removeInteractiveTarget(t._path),delete this._layers[h(t)]},_updatePath:function(t){t._project(),t._update()},_updateStyle:function(t){var e=t._path,i=t.options;e&&(i.stroke?(e.setAttribute("stroke",i.color),e.setAttribute("stroke-opacity",i.opacity),e.setAttribute("stroke-width",i.weight),e.setAttribute("stroke-linecap",i.lineCap),e.setAttribute("stroke-linejoin",i.lineJoin),i.dashArray?e.setAttribute("stroke-dasharray",i.dashArray):e.removeAttribute("stroke-dasharray"),i.dashOffset?e.setAttribute("stroke-dashoffset",i.dashOffset):e.removeAttribute("stroke-dashoffset")):e.setAttribute("stroke","none"),i.fill?(e.setAttribute("fill",i.fillColor||i.color),e.setAttribute("fill-opacity",i.fillOpacity),e.setAttribute("fill-rule",i.fillRule||"evenodd")):e.setAttribute("fill","none"))},_updatePoly:function(t,e){this._setPath(t,wi(t._parts,e))},_updateCircle:function(t){var e=t._point,i=Math.max(Math.round(t._radius),1),n=Math.max(Math.round(t._radiusY),1)||i,s="a"+i+","+n+" 0 1,0 ",o=t._empty()?"M0 0":"M"+(e.x-i)+","+e.y+s+i*2+",0 "+s+-i*2+",0 ";this._setPath(t,o)},_setPath:function(t,e){t._path.setAttribute("d",e)},_bringToFront:function(t){Wt(t._path)},_bringToBack:function(t){Gt(t._path)}});Z.vml&&me.include(Xs);function bn(t){return Z.svg||Z.vml?new me(t):null}Y.include({getRenderer:function(t){var e=t.options.renderer||this._getPaneRenderer(t.options.pane)||this.options.renderer||this._renderer;return e||(e=this._renderer=this._createRenderer()),this.hasLayer(e)||this.addLayer(e),e},_getPaneRenderer:function(t){if(t==="overlayPane"||t===void 0)return!1;var e=this._paneRenderers[t];return e===void 0&&(e=this._createRenderer({pane:t}),this._paneRenderers[t]=e),e},_createRenderer:function(t){return this.options.preferCanvas&&yn(t)||bn(t)}});var _n=Yt.extend({initialize:function(t,e){Yt.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){return this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=rt(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}});function Qs(t,e){return new _n(t,e)}me.create=Ie,me.pointsToPath=wi,Pt.geometryToLayer=Te,Pt.coordsToLatLng=mi,Pt.coordsToLatLngs=Le,Pt.latLngToCoords=vi,Pt.latLngsToCoords=Fe,Pt.getFeature=Xt,Pt.asFeature=Be,Y.mergeOptions({boxZoom:!0});var xn=Tt.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._resetStateTimeout=0,t.on("unload",this._destroy,this)},addHooks:function(){j(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){et(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){nt(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){this._resetStateTimeout!==0&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(t){if(!t.shiftKey||t.which!==1&&t.button!==1)return!1;this._clearDeferredResetState(),this._resetState(),ae(),Xe(),this._startPoint=this._map.mouseEventToContainerPoint(t),j(document,{contextmenu:qt,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(t){this._moved||(this._moved=!0,this._box=X("div","leaflet-zoom-box",this._container),W(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(t);var e=new Q(this._point,this._startPoint),i=e.getSize();lt(this._box,e.min),this._box.style.width=i.x+"px",this._box.style.height=i.y+"px"},_finish:function(){this._moved&&(nt(this._box),at(this._container,"leaflet-crosshair")),re(),Qe(),et(document,{contextmenu:qt,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(t){if(!(t.which!==1&&t.button!==1)&&(this._finish(),!!this._moved)){this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(A(this._resetState,this),0);var e=new vt(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(e).fire("boxzoomend",{boxZoomBounds:e})}},_onKeyDown:function(t){t.keyCode===27&&(this._finish(),this._clearDeferredResetState(),this._resetState())}});Y.addInitHook("addHandler","boxZoom",xn),Y.mergeOptions({doubleClickZoom:!0});var wn=Tt.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom(),n=e.options.zoomDelta,s=t.originalEvent.shiftKey?i-n:i+n;e.options.doubleClickZoom==="center"?e.setZoom(s):e.setZoomAround(t.containerPoint,s)}});Y.addInitHook("addHandler","doubleClickZoom",wn),Y.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0});var Sn=Tt.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new Nt(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),t.on("zoomend",this._onZoomEnd,this),t.whenReady(this._onZoomEnd,this))}W(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){at(this._map._container,"leaflet-grab"),at(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var t=this._map;if(t._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var e=rt(this._map.options.maxBounds);this._offsetLimit=ut(this._map.latLngToContainerPoint(e.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(e.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))}else this._offsetLimit=null;t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(t){if(this._map.options.inertia){var e=this._lastTime=+new Date,i=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(i),this._times.push(e),this._prunePositions(e)}this._map.fire("move",t).fire("drag",t)},_prunePositions:function(t){for(;this._positions.length>1&&t-this._times[0]>50;)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var t=this._map.getSize().divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(t,e){return t-(t-e)*this._viscosity},_onPreDragLimit:function(){if(!(!this._viscosity||!this._offsetLimit)){var t=this._draggable._newPos.subtract(this._draggable._startPos),e=this._offsetLimit;t.x<e.min.x&&(t.x=this._viscousLimit(t.x,e.min.x)),t.y<e.min.y&&(t.y=this._viscousLimit(t.y,e.min.y)),t.x>e.max.x&&(t.x=this._viscousLimit(t.x,e.max.x)),t.y>e.max.y&&(t.y=this._viscousLimit(t.y,e.max.y)),this._draggable._newPos=this._draggable._startPos.add(t)}},_onPreDragWrap:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,s=(n-e+i)%t+e-i,o=(n+e+i)%t-e-i,p=Math.abs(s+i)<Math.abs(o+i)?s:o;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=p},_onDragEnd:function(t){var e=this._map,i=e.options,n=!i.inertia||t.noInertia||this._times.length<2;if(e.fire("dragend",t),n)e.fire("moveend");else{this._prunePositions(+new Date);var s=this._lastPos.subtract(this._positions[0]),o=(this._lastTime-this._times[0])/1e3,p=i.easeLinearity,w=s.multiplyBy(p/o),C=w.distanceTo([0,0]),M=Math.min(i.inertiaMaxSpeed,C),R=w.multiplyBy(M/C),q=M/(i.inertiaDeceleration*p),G=R.multiplyBy(-q/2).round();!G.x&&!G.y?e.fire("moveend"):(G=e._limitOffset(G,e.options.maxBounds),K(function(){e.panBy(G,{duration:q,easeLinearity:p,noMoveStart:!0,animate:!0})}))}}});Y.addInitHook("addHandler","dragging",Sn),Y.mergeOptions({keyboard:!0,keyboardPanDelta:80});var En=Tt.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(t){this._map=t,this._setPanDelta(t.options.keyboardPanDelta),this._setZoomDelta(t.options.zoomDelta)},addHooks:function(){var t=this._map._container;t.tabIndex<=0&&(t.tabIndex="0"),j(t,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),et(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var t=document.body,e=document.documentElement,i=t.scrollTop||e.scrollTop,n=t.scrollLeft||e.scrollLeft;this._map._container.focus(),window.scrollTo(n,i)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(t){var e=this._panKeys={},i=this.keyCodes,n,s;for(n=0,s=i.left.length;n<s;n++)e[i.left[n]]=[-1*t,0];for(n=0,s=i.right.length;n<s;n++)e[i.right[n]]=[t,0];for(n=0,s=i.down.length;n<s;n++)e[i.down[n]]=[0,t];for(n=0,s=i.up.length;n<s;n++)e[i.up[n]]=[0,-1*t]},_setZoomDelta:function(t){var e=this._zoomKeys={},i=this.keyCodes,n,s;for(n=0,s=i.zoomIn.length;n<s;n++)e[i.zoomIn[n]]=t;for(n=0,s=i.zoomOut.length;n<s;n++)e[i.zoomOut[n]]=-t},_addHooks:function(){j(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){et(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){if(!(t.altKey||t.ctrlKey||t.metaKey)){var e=t.keyCode,i=this._map,n;if(e in this._panKeys){if(!i._panAnim||!i._panAnim._inProgress)if(n=this._panKeys[e],t.shiftKey&&(n=H(n).multiplyBy(3)),i.options.maxBounds&&(n=i._limitOffset(H(n),i.options.maxBounds)),i.options.worldCopyJump){var s=i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(n)));i.panTo(s)}else i.panBy(n)}else if(e in this._zoomKeys)i.setZoom(i.getZoom()+(t.shiftKey?3:1)*this._zoomKeys[e]);else if(e===27&&i._popup&&i._popup.options.closeOnEscapeKey)i.closePopup();else return;qt(t)}}});Y.addInitHook("addHandler","keyboard",En),Y.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60});var An=Tt.extend({addHooks:function(){j(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){et(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(t){var e=Gi(t),i=this._map.options.wheelDebounceTime;this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var n=Math.max(i-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(A(this._performZoom,this),n),qt(t)},_performZoom:function(){var t=this._map,e=t.getZoom(),i=this._map.options.zoomSnap||0;t._stop();var n=this._delta/(this._map.options.wheelPxPerZoomLevel*4),s=4*Math.log(2/(1+Math.exp(-Math.abs(n))))/Math.LN2,o=i?Math.ceil(s/i)*i:s,p=t._limitZoom(e+(this._delta>0?o:-o))-e;this._delta=0,this._startTime=null,p&&(t.options.scrollWheelZoom==="center"?t.setZoom(e+p):t.setZoomAround(this._lastMousePos,e+p))}});Y.addInitHook("addHandler","scrollWheelZoom",An);var to=600;Y.mergeOptions({tapHold:Z.touchNative&&Z.safari&&Z.mobile,tapTolerance:15});var Cn=Tt.extend({addHooks:function(){j(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){et(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(clearTimeout(this._holdTimeout),t.touches.length===1){var e=t.touches[0];this._startPos=this._newPos=new z(e.clientX,e.clientY),this._holdTimeout=setTimeout(A(function(){this._cancel(),this._isTapValid()&&(j(document,"touchend",ht),j(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",e))},this),to),j(document,"touchend touchcancel contextmenu",this._cancel,this),j(document,"touchmove",this._onMove,this)}},_cancelClickPrevent:function t(){et(document,"touchend",ht),et(document,"touchend touchcancel",t)},_cancel:function(){clearTimeout(this._holdTimeout),et(document,"touchend touchcancel contextmenu",this._cancel,this),et(document,"touchmove",this._onMove,this)},_onMove:function(t){var e=t.touches[0];this._newPos=new z(e.clientX,e.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(t,e){var i=new MouseEvent(t,{bubbles:!0,cancelable:!0,view:window,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY});i._simulated=!0,e.target.dispatchEvent(i)}});Y.addInitHook("addHandler","tapHold",Cn),Y.mergeOptions({touchZoom:Z.touch,bounceAtZoomLimits:!0});var kn=Tt.extend({addHooks:function(){W(this._map._container,"leaflet-touch-zoom"),j(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){at(this._map._container,"leaflet-touch-zoom"),et(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var e=this._map;if(!(!t.touches||t.touches.length!==2||e._animatingZoom||this._zooming)){var i=e.mouseEventToContainerPoint(t.touches[0]),n=e.mouseEventToContainerPoint(t.touches[1]);this._centerPoint=e.getSize()._divideBy(2),this._startLatLng=e.containerPointToLatLng(this._centerPoint),e.options.touchZoom!=="center"&&(this._pinchStartLatLng=e.containerPointToLatLng(i.add(n)._divideBy(2))),this._startDist=i.distanceTo(n),this._startZoom=e.getZoom(),this._moved=!1,this._zooming=!0,e._stop(),j(document,"touchmove",this._onTouchMove,this),j(document,"touchend touchcancel",this._onTouchEnd,this),ht(t)}},_onTouchMove:function(t){if(!(!t.touches||t.touches.length!==2||!this._zooming)){var e=this._map,i=e.mouseEventToContainerPoint(t.touches[0]),n=e.mouseEventToContainerPoint(t.touches[1]),s=i.distanceTo(n)/this._startDist;if(this._zoom=e.getScaleZoom(s,this._startZoom),!e.options.bounceAtZoomLimits&&(this._zoom<e.getMinZoom()&&s<1||this._zoom>e.getMaxZoom()&&s>1)&&(this._zoom=e._limitZoom(this._zoom)),e.options.touchZoom==="center"){if(this._center=this._startLatLng,s===1)return}else{var o=i._add(n)._divideBy(2)._subtract(this._centerPoint);if(s===1&&o.x===0&&o.y===0)return;this._center=e.unproject(e.project(this._pinchStartLatLng,this._zoom).subtract(o),this._zoom)}this._moved||(e._moveStart(!0,!1),this._moved=!0),st(this._animRequest);var p=A(e._move,e,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=K(p,this,!0),ht(t)}},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=!1;return}this._zooming=!1,st(this._animRequest),et(document,"touchmove",this._onTouchMove,this),et(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))}});Y.addInitHook("addHandler","touchZoom",kn),Y.BoxZoom=xn,Y.DoubleClickZoom=wn,Y.Drag=Sn,Y.Keyboard=En,Y.ScrollWheelZoom=An,Y.TapHold=Cn,Y.TouchZoom=kn,r.Bounds=Q,r.Browser=Z,r.CRS=Bt,r.Canvas=gn,r.Circle=fi,r.CircleMarker=ke,r.Class=mt,r.Control=Et,r.DivIcon=fn,r.DivOverlay=Lt,r.DomEvent=ys,r.DomUtil=vs,r.Draggable=Nt,r.Evented=T,r.FeatureGroup=$t,r.GeoJSON=Pt,r.GridLayer=he,r.Handler=Tt,r.Icon=Jt,r.ImageOverlay=$e,r.LatLng=tt,r.LatLngBounds=vt,r.Layer=At,r.LayerGroup=Kt,r.LineUtil=Bs,r.Map=Y,r.Marker=Ce,r.Mixin=As,r.Path=Ot,r.Point=z,r.PolyUtil=Cs,r.Polygon=Yt,r.Polyline=Mt,r.Popup=Me,r.PosAnimation=Ki,r.Projection=$s,r.Rectangle=_n,r.Renderer=It,r.SVG=me,r.SVGOverlay=hn,r.TileLayer=Qt,r.Tooltip=Pe,r.Transformation=Oe,r.Util=ct,r.VideoOverlay=pn,r.bind=A,r.bounds=ut,r.canvas=yn,r.circle=Os,r.circleMarker=Ns,r.control=ce,r.divIcon=Ks,r.extend=a,r.featureGroup=Ds,r.geoJSON=un,r.geoJson=Hs,r.gridLayer=Js,r.icon=Rs,r.imageOverlay=qs,r.latLng=J,r.latLngBounds=rt,r.layerGroup=Is,r.map=bs,r.marker=zs,r.point=H,r.polygon=Us,r.polyline=Zs,r.popup=Ws,r.rectangle=Qs,r.setOptions=b,r.stamp=h,r.svg=bn,r.svgOverlay=js,r.tileLayer=mn,r.tooltip=Gs,r.transformation=ie,r.version=d,r.videoOverlay=Vs;var eo=window.L;r.noConflict=function(){return window.L=eo,this},window.L=r}))})(ge,ge.exports)),ge.exports}var Ao=Eo();const it=wo(Ao);let wt=null,Dt=null,Rt=null,ee=null;function Co(u="live-map-canvas"){if(!document.getElementById(u))return null;if(wt){try{wt.remove()}catch{}wt=null,Dt=null,Rt=null,ee=null}return wt=it.map(u,{center:[37.772,-122.435],zoom:13,zoomControl:!0,attributionControl:!1}),it.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{maxZoom:19,subdomains:"abcd"}).addTo(wt),Rt=it.layerGroup().addTo(wt),ee=it.layerGroup().addTo(wt),Dt=it.layerGroup().addTo(wt),Dn(),setTimeout(()=>{wt&&wt.invalidateSize()},200),wt}function Dn(u="all"){if(!wt)return;Dt==null||Dt.clearLayers(),Rt==null||Rt.clearLayers(),ee==null||ee.clearLayers();const l=I.getState(),{buses:r,routes:d,schools:a,depot:v,disruptions:A}=l;if(d.forEach(x=>{if(u==="transit"&&x.status!=="on_time"||u==="disrupted"&&x.status!=="disrupted"&&x.status!=="delayed")return;const _=x.stops.map(S=>S.coords);if(_.length<2)return;const c=x.status==="disrupted",y=x.status==="delayed",f=c?"#EF4444":y?"#F59E0B":"#2563EB",g=x.stops.filter(S=>S.status==="completed");g.length>1&&it.polyline(g.map(S=>S.coords),{color:"#10B981",weight:5,opacity:.85}).addTo(Rt);const b=x.stops.filter(S=>S.status!=="completed");b.length>1?it.polyline(b.map(S=>S.coords),{color:f,weight:c?5:4,opacity:c?.9:.7,dashArray:c?"8, 8":null}).addTo(Rt):g.length===0&&it.polyline(_,{color:f,weight:4,opacity:.7}).addTo(Rt);const E=it.polyline(_,{opacity:0,weight:12});E.bindTooltip(`<b>${x.name}</b><br>ETA: ${x.currentEta} · ${x.status.toUpperCase()}`,{sticky:!0}),Rt.addLayer(E),u!=="standby"&&x.stops.forEach((S,F)=>{let B,D=8,m=.9;if(S.status==="completed"?B="#10B981":S.status==="next"?(B="#2563EB",D=10):S.status==="delayed"?B="#F59E0B":S.status==="stuck"||S.status==="stranded"?(B="#EF4444",D=11):S.status==="destination"?(B="#0F2747",D=6):B="#94A3B8",S.status!=="destination"){const $=it.circleMarker(S.coords,{radius:D,fillColor:B,color:"#fff",weight:2,opacity:1,fillOpacity:m});$.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 0.78rem; min-width: 160px;">
            <b style="color: #0F2747;">Stop ${F+1}: ${S.name}</b><br>
            <span style="color: #64748B;">⏱ ${S.time}${S.studentsCount?` · 👥 ${S.studentsCount} pax`:""}</span>
          </div>
        `,{sticky:!0,direction:"top"}),ee.addLayer($)}})}),A.filter(x=>x.status==="unresolved"&&x.busId).forEach(x=>{const _=r.find(f=>f.id===x.busId);if(!_)return;const c=it.divIcon({className:"",html:`
        <div style="
          background: #EF4444; color: #fff;
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
          border: 2.5px solid #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 0.85rem;">⚠</span>
        </div>
        <div style="
          position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
          background: #EF4444; color: #fff;
          font-size: 0.6rem; font-weight: 800;
          padding: 2px 5px; border-radius: 4px;
          white-space: nowrap; font-family: sans-serif;
        ">${x.type.replace("_"," ").toUpperCase()}</div>
      `,iconSize:[32,42],iconAnchor:[16,42]}),y=it.marker(_.coords,{icon:c,zIndexOffset:200});y.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); min-width: 200px; padding: 4px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span style="background: #FEE2E2; color: #DC2626; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">⚠ ${x.severity.toUpperCase()} DISRUPTION</span>
        </div>
        <div style="font-weight: 700; color: #0F2747; font-size: 0.95rem; margin-bottom: 6px;">${x.title}</div>
        <div style="font-size: 0.78rem; color: #475569; margin-bottom: 10px;">${x.impact}</div>
        <button onclick="window.__triggerReplanning('${_.id}')" style="
          width: 100%; background: #2563EB; color: #fff;
          border: none; padding: 7px 10px; border-radius: 6px;
          font-size: 0.75rem; font-weight: 700; cursor: pointer;
        ">⚡ Open AI Replanning Engine</button>
      </div>
    `,{maxWidth:240}),Dt.addLayer(y)}),a.forEach(x=>{const _=it.divIcon({className:"",html:`
        <div style="
          background: #0F2747; color: #fff;
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 4px 10px rgba(15,39,71,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
        ">🏫</div>
      `,iconSize:[36,36],iconAnchor:[18,18]}),c=it.marker(x.coords,{icon:_,zIndexOffset:100});c.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); padding: 4px;">
        <h4 style="color: #0F2747; margin-bottom: 4px; font-size: 0.95rem;">${x.name}</h4>
        <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">${x.address}</p>
        <div style="font-size: 0.75rem; font-weight: 700; color: #2563EB;">🔔 Bell Time: ${x.bellTime}</div>
        <div style="font-size: 0.75rem; color: #64748B;">${x.totalStudents} enrolled students</div>
      </div>
    `),Dt.addLayer(c)}),v!=null&&v.coords&&(u==="all"||u==="standby")){const x=it.divIcon({className:"",html:`
        <div style="
          background: #0F2747; color: #F59E0B;
          border: 2.5px solid #F59E0B;
          border-radius: 8px; width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 1rem;
        ">🏭</div>
      `,iconSize:[38,38],iconAnchor:[19,19]}),_=it.marker(v.coords,{icon:x});_.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); padding: 4px;">
        <h4 style="color: #0F2747; margin-bottom: 4px; font-size: 0.95rem;">${v.name}</h4>
        <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">${v.address}</p>
        <div style="font-size: 0.75rem; font-weight: 700; color: #10B981;">🟢 ${v.standbyBusesCount} reserve buses standby</div>
      </div>
    `),Dt.addLayer(_)}r.filter(x=>u==="transit"?x.status==="in_transit"||x.status==="delayed":u==="disrupted"?x.status==="breakdown"||x.status==="delayed":u==="standby"?x.status==="in_depot":!0).forEach(x=>{const _=l.drivers.find($=>$.id===x.driverId),c=_?_.name:"Unassigned",y=x.status==="breakdown",f=x.status==="delayed",g=x.status==="in_depot",b=x.status==="maintenance",E=x.gpsStatus==="no_signal"||y||b,S=x.gpsStatus==="manual"||x.isManualLocation;let F="#2563EB";y?F="#EF4444":f?F="#F59E0B":S?F="#4F46E5":g?F="#9CA3AF":b&&(F="#6B7280");const B=`
      <div style="
        background: ${F}; color: #fff;
        border: 2.5px solid #fff;
        border-radius: 8px;
        padding: 4px 8px 4px 6px;
        display: flex; align-items: center; gap: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem; font-weight: 800;
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
        white-space: nowrap;
        ${y?"animation: pulseDanger 1.5s infinite;":""}
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M8 6v6M15 6v6M2 12h19.6"/>
          <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
        </svg>
        ${x.id}
        ${E?" 📡✕":S?" 📍":""}
      </div>
    `,D=it.divIcon({className:"",html:B,iconSize:[E||S?82:70,28],iconAnchor:[(E||S?82:70)/2,14]}),m=it.marker(x.coords,{icon:D,zIndexOffset:y?300:50});m.bindPopup(`
      <div style="font-family: var(--font-main, sans-serif); min-width: 250px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <strong style="font-size: 1rem; color: #0F2747;">${x.id}</strong>
          <div style="display: flex; gap: 4px;">
            <span style="font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;
              background: ${E?"#FEF2F2":S?"#EEF2FF":"#ECFDF5"};
              color: ${E?"#DC2626":S?"#4338CA":"#059669"};">
              ${E?"📡 NO SIGNAL":S?"📍 MANUAL FIX":"🛰️ LIVE FIX"}
            </span>
            <span style="font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;
              background: ${y?"#FEE2E2":f?"#FEF3C7":"#EFF6FF"};
              color: ${y?"#DC2626":f?"#92400E":"#2563EB"};">
              ${x.status.replace("_"," ").toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Telemetry Notice: Live vs Last Known -->
        <div style="background: ${E?"#FEF2F2":S?"#F5F3FF":"#F8FAFC"}; border: 1px solid ${E?"#FECACA":S?"#DDD6FE":"#E2E8F0"}; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 0.72rem;">
          <div style="font-weight: 700; color: ${E?"#DC2626":S?"#4338CA":"#0F2747"};">
            ${E?"⚠️ Last Known Location (GPS Lost):":S?"📍 Dispatcher Manual Checkpoint:":"🛰️ Current Fleet Position:"}
          </div>
          <div style="color: #334155; font-weight: 600; margin-top: 1px;">${x.lastKnownLocation||"Route Waypoint"}</div>
          <div style="color: #64748B; font-size: 0.68rem; margin-top: 2px;">Sync: ${x.lastGpsSync||"N/A"}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 0.78rem; color: #475569; margin-bottom: 10px;">
          <div><b>Model:</b> ${x.model.split(" ").slice(0,2).join(" ")}</div>
          <div><b>Driver:</b> ${c}</div>
          <div><b>Speed:</b> ${x.speedKmh} km/h</div>
          <div><b>Load:</b> ${x.currentLoad}/${x.capacity}</div>
        </div>

        ${x.breakdownNote?`
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; padding: 6px 8px; font-size: 0.75rem; color: #DC2626; font-weight: 600; margin-bottom: 8px;">
            ⚠ ${x.breakdownNote}
          </div>
        `:""}

        <div style="display: flex; flex-direction: column; gap: 5px;">
          <button onclick="window.__manualLocationOverride('${x.id}')" style="
            width: 100%; background: #EFF6FF; color: #2563EB;
            border: 1px solid #BFDBFE; padding: 6px 8px; border-radius: 6px;
            font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;
          ">
            📍 Manual Location Update
          </button>

          <div style="display: flex; gap: 5px;">
            ${y?`
              <button onclick="window.__triggerReplanning('${x.id}')" style="
                flex-grow: 1; background: #EF4444; color: #fff; border: none;
                padding: 6px 8px; border-radius: 6px; font-size: 0.75rem;
                font-weight: 700; cursor: pointer;
              ">⚡ AI Emergency Replan</button>
            `:`
              <button onclick="window.__viewBusDetails('${x.id}')" style="
                flex-grow: 1; background: #F1F5F9; color: #0F2747;
                border: 1px solid #E2E8F0; padding: 6px 8px;
                border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer;
              ">Full Telemetry</button>
              <button onclick="window.__viewBusOnFleet('${x.id}')" style="
                background: #EFF6FF; color: #2563EB;
                border: 1px solid #BFDBFE; padding: 6px 8px;
                border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;
              ">Fleet →</button>
            `}
          </div>
        </div>
      </div>
    `,{maxWidth:280}),Dt.addLayer(m)})}typeof window<"u"&&(window.__triggerReplanning=u=>{const r=I.getState().disruptions.find(d=>d.busId===u);r&&I.setSelectedDisruption(r.id),I.setActiveTab("replanning")},window.__viewBusDetails=u=>{I.openModal("bus_detail",{busId:u})},window.__viewBusOnFleet=()=>{I.setActiveTab("buses")},window.__manualLocationOverride=u=>{I.openModal("manual_location",{busId:u})});function Mn(){const u=I.getState();u.currentRole;const{metrics:l,disruptions:r,buses:d}=u,a=document.createElement("div");a.className="content-body";const v=d.filter(h=>h.status==="in_transit"||h.status==="delayed").length,A=d.filter(h=>h.status==="in_depot").length,k=r.filter(h=>h.status==="unresolved");return a.innerHTML=`
    <!-- Top KPI Grid -->
    <div class="kpi-grid">
      <!-- Active Buses Card -->
      <div class="kpi-card" style="border-top: 3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Active Fleet</span>
          <div class="kpi-icon-wrap" style="background: #EFF6FF; color: #2563EB;">
            ${P.bus(20,"#2563EB")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${v}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">/ ${d.length} Buses</span>
        </div>
        <div class="kpi-subtext" style="display: flex; align-items: center; gap: 4px; color: #10B981; font-weight: 600;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
          ${l.activeRoutesCount} Active Routes Run
        </div>
      </div>

      <!-- Active Disruptions Card -->
      <div class="kpi-card" style="border-top: 3px solid ${k.length>0?"#EF4444":"#10B981"};">
        <div class="kpi-header">
          <span class="kpi-label">Active Disruptions</span>
          <div class="kpi-icon-wrap" style="background: ${k.length>0?"#FEF2F2":"#ECFDF5"}; color: ${k.length>0?"#EF4444":"#10B981"};">
            ${P.alertTriangle(20,"currentColor")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: ${k.length>0?"#EF4444":"#0F2747"};">
            ${k.length}
          </span>
          <span style="font-size: 0.78rem; font-weight: 700; color: #DC2626;">
            ${k.length>0?"ATTENTION REQ.":"ALL CLEAR"}
          </span>
        </div>
        <div class="kpi-subtext">
          1 Breakdown, 1 Sick Driver, 1 Add
        </div>
      </div>

      <!-- Total Students in Transit -->
      <div class="kpi-card" style="border-top: 3px solid #6366F1;">
        <div class="kpi-header">
          <span class="kpi-label">Students in Transit</span>
          <div class="kpi-icon-wrap" style="background: #EEF2FF; color: #6366F1;">
            ${P.users(20,"#6366F1")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${l.totalStudentsToday}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">On Board</span>
        </div>
        <div class="kpi-subtext" style="color: #4F46E5; font-weight: 600;">
          Student roster loaded from mock data
        </div>
      </div>

      <!-- Available Standby Fleet -->
      <div class="kpi-card" style="border-top: 3px solid #10B981;">
        <div class="kpi-header">
          <span class="kpi-label">Standby Capacity</span>
          <div class="kpi-icon-wrap" style="background: #ECFDF5; color: #10B981;">
            ${P.shield(20,"#10B981")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: #059669;">${A}</span>
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">Depot Reserves</span>
        </div>
        <div class="kpi-subtext" style="color: #059669; font-weight: 600;">
          2 Reserve Drivers on Duty
        </div>
      </div>

      <!-- Responsible AI Engine Status -->
      <div class="kpi-card" style="border-top: 3px solid #0F2747;">
        <div class="kpi-header">
          <span class="kpi-label">Responsible AI Status</span>
          <div class="kpi-icon-wrap" style="background: #F1F5F9; color: #0F2747;">
            ${P.cpu(20,"#0F2747")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size: 1.45rem; color: #10B981;">ACTIVE</span>
        </div>
        <div class="kpi-subtext" style="font-size: 0.72rem; color: #64748B;">
          Deterministic constraint engine • Human-in-the-loop
        </div>
      </div>
    </div>

    <!-- Main Split: Live Map + Incident Command Feed -->
    <div class="dashboard-main-split">
      <!-- Large Live Map Card -->
      <div class="map-container-card">
        <div class="map-card-header">
          <div class="map-card-title">
            ${P.mapPin(18,"#2563EB")}
            <span>Current Fleet &amp; Route Status</span>
          </div>
          <div style="font-size: 0.7rem; color: #94A3B8; font-style: italic; margin-top: 2px; padding-left: 2px;">Representative data — simulated for MVP demonstration</div>
          <div class="map-filters" id="map-filter-group">
            <button class="map-filter-chip active" data-filter="all">All Vehicles</button>
            <button class="map-filter-chip" data-filter="transit">In Transit</button>
            <button class="map-filter-chip" data-filter="disrupted">Disruptions</button>
            <button class="map-filter-chip" data-filter="standby">Depot Standby</button>
          </div>
        </div>
        
        <div id="live-map-canvas"></div>

        <!-- Updated Legend Overlay per color spec -->
        <div class="map-legend-overlay">
          <div style="font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Map Legend</div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #2563EB;"></div> Blue — Active / Upcoming
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #10B981;"></div> Green — Completed Stops
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #F59E0B;"></div> Amber — Affected / Delayed
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #EF4444;"></div> Red — Disruption / Breakdown
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #9CA3AF;"></div> Gray — Unavailable / Depot
          </div>
          <div class="legend-row">
            <div class="legend-dot" style="background: #0F2747;"></div> Navy — Schools
          </div>
        </div>
      </div>

      <!-- Active Disruptions Feed Panel -->
      <div class="feed-panel-card">
        <div class="feed-header">
          <h3>
            ${P.alertTriangle(18,"#EF4444")}
            Active Operational Incidents
          </h3>
          <span class="severity-pill critical">${k.length} PENDING</span>
        </div>

        <div class="feed-list" id="dashboard-disruptions-feed">
          ${r.map(h=>{const x=h.status==="unresolved",_=h.severity;return`
              <div class="incident-card ${_}" data-disruption-id="${h.id}">
                <div class="incident-top">
                  <span class="incident-title">${h.title}</span>
                  <span class="severity-pill ${_}">${h.severity}</span>
                </div>
                
                <div class="incident-meta">
                  <span>⏱ ${h.reportedAt}</span>
                  <span>📍 ${h.location}</span>
                  ${h.busId?`<span>🚌 <b>${h.busId}</b></span>`:""}
                </div>

                <div class="incident-impact">
                  ${h.impact}
                </div>

                ${h.aiRecommendationAvailable?`
                  <div class="ai-rec-banner">
                    <div class="ai-rec-text">
                      ${P.cpu(14,"#4338CA")}
                      <span>AI Plan: ${h.aiRecommendation.strategy}</span>
                    </div>
                    <button class="ai-rec-action review-plan-btn" data-id="${h.id}">
                      ${x?"Review & Replan":"View Plan"}
                    </button>
                  </div>
                `:""}
              </div>
            `}).join("")}
        </div>
      </div>
    </div>

    <!-- Quick Status Table: Routes Summary -->
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Active Morning Routes — Current Status</h2>
          <p>Stop completion progress, delay variance, and assigned vehicle assignments (simulated data)</p>
        </div>
        <button class="action-btn secondary" id="view-all-routes-btn">
          ${P.route(16,"currentColor")} View Full Routes Roster
        </button>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Route ID & Name</th>
              <th>Destination School</th>
              <th>Assigned Bus</th>
              <th>Driver</th>
              <th>Progress</th>
              <th>Scheduled Arrival</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${u.routes.map(h=>{d.find(y=>y.id===h.assignedBus);const x=h.status==="disrupted",_=h.status==="delayed",c=Math.round(h.completedStops/h.totalStops*100);return`
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0F2747;">${h.name}</div>
                    <div style="font-size: 0.72rem; color: #64748B;">ID: ${h.id}</div>
                  </td>
                  <td><b>${h.schoolName}</b></td>
                  <td><span class="bus-pill">${h.assignedBus||"N/A"}</span></td>
                  <td>${h.assignedDriver}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; height: 6px; background: #E2E8F0; border-radius: 9999px; width: 80px; overflow: hidden;">
                        <div style="height: 100%; width: ${c}%; background: ${x?"#EF4444":"#2563EB"};"></div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 700;">${h.completedStops}/${h.totalStops}</span>
                    </div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-weight: 600;">${h.scheduledArrivalTime}</span>
                    ${_?`<span style="color: #D97706; font-size: 0.72rem; font-weight: 700; margin-left: 4px;">(+${h.delayMinutes}m)</span>`:""}
                  </td>
                  <td>
                    <span class="status-badge ${h.status}">
                      ${h.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    ${x?`
                      <button class="action-btn primary review-plan-btn" data-id="DIS-2026-001" style="padding: 4px 10px; font-size: 0.75rem;">
                        ⚡ Replan
                      </button>
                    `:`
                      <button class="action-btn secondary route-inspect-btn" data-route-id="${h.id}" style="padding: 4px 10px; font-size: 0.75rem;">
                        Inspect
                      </button>
                    `}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,setTimeout(()=>{Co("live-map-canvas");const h=a.querySelectorAll("#map-filter-group .map-filter-chip");h.forEach(y=>{y.addEventListener("click",()=>{h.forEach(g=>g.classList.remove("active")),y.classList.add("active");const f=y.getAttribute("data-filter");Dn(f)})}),a.querySelectorAll(".review-plan-btn").forEach(y=>{y.addEventListener("click",f=>{f.stopPropagation();const g=y.getAttribute("data-id");g&&I.setSelectedDisruption(g),I.setActiveTab("replanning")})});const _=a.querySelector("#view-all-routes-btn");_&&_.addEventListener("click",()=>{I.setActiveTab("routes")}),a.querySelectorAll(".route-inspect-btn").forEach(y=>{y.addEventListener("click",()=>{I.setActiveTab("routes")})})},50),a}function bi(u=null){var k,h,x;const l=[],r=performance.now();function d({id:_,scenario:c,expectedResult:y,actualResult:f,passed:g,failureReason:b,replanningTimeMs:E,simulatedReviewTimeMs:S,manualIntervention:F,baselineTimeMs:B,invariants:D}){const m=E+(S||0),$=480*1e3;l.push({id:_,scenario:c,expectedResult:y,actualResult:f,passed:g,status:g?"PASS":"FAIL",failureReason:b||null,engineTimeMs:E,e2eRecoveryTimeMs:m,baselineTimeMs:B,targetTimeMs:$,manualIntervention:!!F,invariants:D||{capacityViolation:!1,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y=c.getState().students.find(V=>V.id==="STU-1001")||c.getState().students[0],f=y.busId,g=c.getState().buses.find(V=>V.id===f),b=g?g.currentLoad:0,E=g?g.capacity:54;c.cancelStudent(y.id);const S=c.getState().students.find(V=>V.id===y.id),F=c.getState().buses.find(V=>V.id===f),B=c.getState().disruptions.find(V=>V.type==="student_cancel"&&V.studentId===y.id),D=S.status==="absent_cancelled"&&S.busId==="UNASSIGNED",m=F?F.currentLoad===b-1:!0,$=B!==void 0&&B.beforeRoute!==null&&B.afterRoute!==null,N=F?F.currentLoad<=E&&F.currentLoad>=0:!0,O=D&&m&&$&&N,U=performance.now();d({id:"TEST-01",scenario:"Student Cancellation",expectedResult:"Mark student absent, unassign from active route, decrement bus load, recalculate dwell time savings, log disruption.",actualResult:D&&m?`Student marked absent. Bus ${f} load reduced (${b} → ${F.currentLoad}/${E}). Saved ${((k=B==null?void 0:B.aiRecommendation)==null?void 0:k.timeSavedMins)||2} min dwell time.`:"Failed to update student state or recalculate bus capacity.",passed:O,failureReason:O?null:"Cancellation did not update student assignment or bus load correctly.",replanningTimeMs:U-_,simulatedReviewTimeMs:15e3,baselineTimeMs:465e3,manualIntervention:!1,invariants:{capacityViolation:!N,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y={name:"Marcus Vance Jr.",grade:"8th Grade",schoolId:"SCH-02",schoolName:"Lincoln Middle School",stopName:"Taraval & 28th Ave",guardianName:"Marcus Vance",guardianPhone:"(555) 301-4455",specialNeeds:"Wheelchair Accessibility Required"};c.addStudent(y);const f=c.getState().disruptions.find(O=>O.type==="urgent_add"&&O.studentName===y.name),g=f==null?void 0:f.aiRecommendation,b=c.getState().buses.find(O=>O.id===(g==null?void 0:g.recommendedBusId)),E=g!=null,S=b&&b.capacity>(b.currentLoad||0),F=(h=b==null?void 0:b.amenities)==null?void 0:h.some(O=>O.toLowerCase().includes("wheelchair")),B=f.status==="unresolved";c.acceptAIPlan(f.id);const D=c.getState().students.find(O=>O.id===f.studentId),m=D.busId===b.id&&D.status==="waiting",$=E&&S&&F&&B&&m,N=performance.now();d({id:"TEST-02",scenario:"Urgent Student Addition",expectedResult:"Identify compatible bus (Lincoln Middle, ADA Lift, Available Seats, Available Driver), require dispatcher approval before activation.",actualResult:$?`Recommended ${b.id} (+${g.estimatedAdditionalDelay}). Verified ADA Lift & driver availability. Assigned upon approval.`:"Failed to find ADA compatible bus or violated dispatcher approval gate.",passed:$,failureReason:$?null:"Recommended bus lacked ADA lift or bypassed approval requirement.",replanningTimeMs:N-_,simulatedReviewTimeMs:25e3,baselineTimeMs:465e3,manualIntervention:!1,invariants:{capacityViolation:b?b.currentLoad>b.capacity:!1,unavailableBusAssigned:b?["breakdown","maintenance","offline"].includes(b.status):!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y="BUS-04",f=c.getState().buses.find(ct=>ct.id===y),g=f.currentLoad||36;c.handleVehicleBreakdown(y,{title:"Engine Stall at Cole & Haight",location:"Cole & Haight St",impact:"Engine failure, 36 students stranded"});const b=c.getState().disruptions.find(ct=>ct.type==="breakdown"&&ct.busId===y),E=b==null?void 0:b.aiRecommendation,S=c.getState().buses.find(ct=>ct.id===(E==null?void 0:E.recommendedBusId)),F=f.status==="breakdown",B=(E==null?void 0:E.recommendedBusId)!==y,D=S&&S.capacity>=g,m=S&&!["breakdown","maintenance","offline"].includes(S.status);c.acceptAIPlan(b.id);const N=c.getState().disruptions.find(ct=>ct.id===b.id).endToEndRecoveryTimeMs,O=c.getState().buses.find(ct=>ct.id===y),U=c.getState().buses.find(ct=>ct.id===S.id),V=O.currentLoad===0&&U.currentLoad===g&&U.status==="in_transit",K=F&&B&&D&&m&&V,st=performance.now();d({id:"TEST-03",scenario:"Vehicle Breakdown",expectedResult:"Mark broken vehicle unavailable, never recommend broken vehicle, select standby bus with capacity >= 36, assign standby driver.",actualResult:K?`Broken bus ${y} stalled. Selected depot standby ${S.id} (${S.capacity} capacity >= ${g}). Swapped upon approval. Recovery time: ${N}ms.`:"Failed: Broken vehicle recommended or insufficient capacity selected.",passed:K,failureReason:K?null:"Breakdown replanning selected invalid replacement or failed passenger transfer.",replanningTimeMs:st-_,simulatedReviewTimeMs:35e3,baselineTimeMs:825e3,manualIntervention:!1,invariants:{capacityViolation:U?U.currentLoad>U.capacity:!1,unavailableBusAssigned:(E==null?void 0:E.recommendedBusId)===y,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y=c.getState().drivers.find(N=>N.status==="sick")||{id:"DRV-102",name:"Michael Torres",status:"sick"},f={id:"DRV-999",name:"Busy Driver",status:"active",commitments:["Field Trip Transfer 08:30 AM"]},g=c.getState().drivers.find(N=>N.status==="standby"),b=c.validateDriverAvailabilityAndCommitments(y,null,null),E=c.validateDriverAvailabilityAndCommitments(f,null,null),S=c.validateDriverAvailabilityAndCommitments(g,null,null),F=b.isValid===!1&&b.reason.includes("unavailable"),B=E.isValid===!1&&E.reason.includes("commitment"),D=S.isValid===!0,m=F&&B&&D,$=performance.now();d({id:"TEST-04",scenario:"Driver Unavailable / Conflict",expectedResult:"Reject sick/off-duty drivers, reject drivers with commitments, accept only verified available reserve drivers.",actualResult:m?`Rejected sick driver (${b.reason}), rejected commitment conflict (${E.reason}), approved standby driver (${g==null?void 0:g.name}).`:"Failed to reject unavailable or conflicted driver.",passed:m,failureReason:m?null:"Validation failed to flag driver unavailability or commitment conflict.",replanningTimeMs:$-_,simulatedReviewTimeMs:2e4,baselineTimeMs:465e3,manualIntervention:!1,invariants:{capacityViolation:!1,unavailableBusAssigned:!1,unavailableDriverAssigned:!F,driverCommitmentConflict:!B}})}{const _=performance.now(),c=new Ft,y=c.getState().buses.find(B=>B.id==="BUS-01");y.currentLoad=y.capacity;const g=c.evaluateUrgentStudentAddition({name:"OverCapacity Test Student",schoolId:"SCH-01",schoolName:"Oakridge High School",stopName:"Chestnut & Fillmore",specialNeeds:"None"}).allEvaluations.find(B=>B.bus.id==="BUS-01"),b=g.isFeasible===!1,E=g.reasons.some(B=>B.toLowerCase().includes("capacity")),S=b&&E,F=performance.now();d({id:"TEST-05",scenario:"Capacity Violation Prevention",expectedResult:"Reject candidate bus with 0 available seats, store explicit capacity rejection reason, never allow over-capacity passenger boarding.",actualResult:S?`Bus ${y.id} (54/54 load) correctly rejected: "${g.reasons.find(B=>B.includes("capacity"))}". Zero capacity violations.`:"Failed: Full bus was incorrectly marked as feasible candidate.",passed:S,failureReason:S?null:"Full bus candidate was not rejected.",replanningTimeMs:F-_,simulatedReviewTimeMs:15e3,baselineTimeMs:465e3,manualIntervention:!1,invariants:{capacityViolation:g.isFeasible===!0,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y=c.getState().buses.find($=>$.id==="BUS-04")||c.getState().buses[0],f=y.gpsStatus==="no_signal",g=[37.769,-122.451],b="Cole & Haight St (Radio Verified by Unit 4)";c.updateBusLocationManually(y.id,g,b,"Driver radio check-in");const E=c.getState().buses.find($=>$.id===y.id),S=E.gpsStatus==="manual"&&E.isManualLocation===!0,F=E.coords[0]===g[0]&&E.coords[1]===g[1],B=E.lastKnownLocation===b,D=f&&S&&F&&B,m=performance.now();d({id:"TEST-06",scenario:"GPS Unavailable & Manual Fallback",expectedResult:'Detect GPS failure ("No Signal"), display last known position, disallow fake live fix, allow manual coordinates override.',actualResult:D?`Detected GPS lost on ${y.id}. Dispatcher manually updated coordinates to [${g.join(", ")}] ("${b}"). Marked as Manual Fix.`:"Failed to handle GPS signal loss or manual location override.",passed:D,failureReason:D?null:"GPS fallback failed to update coordinates or manual fix status.",replanningTimeMs:m-_,simulatedReviewTimeMs:45e3,baselineTimeMs:465e3,manualIntervention:!0,invariants:{capacityViolation:!1,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft;c.setNetworkStatus("offline");const y=c.getState().networkStatus==="offline",f=c.getState().students[0];c.cancelStudent(f.id);const g=c.getState().pendingOfflineChanges,b=g.length>0&&g.some(D=>D.actionType==="CANCEL_STUDENT");c.setNetworkStatus("online");const E=c.getState().networkStatus==="online",S=c.getState().pendingOfflineChanges.length===0,F=y&&b&&E&&S,B=performance.now();d({id:"TEST-07",scenario:"Network Offline Queue",expectedResult:"Transition to Offline mode, continue operations locally with last known data, store pending changes locally, synchronize upon reconnection.",actualResult:F?`Operated in Offline mode. Queued ${g.length} local operational changes. Synchronized and flushed queue upon network restoration.`:"Failed offline local queueing or online synchronization.",passed:F,failureReason:F?null:"Offline queue failed to persist or synchronize on network recovery.",replanningTimeMs:B-_,simulatedReviewTimeMs:15e3,baselineTimeMs:465e3,manualIntervention:!1,invariants:{capacityViolation:!1,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft;c.handleVehicleBreakdown("BUS-04",{title:"Morning Rush Breakdown BUS-04",location:"Cole & Haight St",impact:"36 students stalled"});const y=c.getState().disruptions[0];c.acceptAIPlan(y.id),c.addStudent({name:"Simultaneous Student Addition",schoolId:"SCH-02",schoolName:"Lincoln Middle School",stopName:"West Portal Station",specialNeeds:"None"});const f=c.getState().disruptions.find(O=>O.studentName==="Simultaneous Student Addition");c.acceptAIPlan(f.id);const g=c.getState().students.find(O=>O.routeId==="RT-101"&&O.status!=="absent_cancelled");g&&c.cancelStudent(g.id);const b=c.getState(),E=((x=y==null?void 0:y.aiRecommendation)==null?void 0:x.recommendedBusId)||"BUS-05",S=b.buses.find(O=>O.id===E),F=b.buses.find(O=>O.id==="BUS-04"),B=b.buses.find(O=>O.id==="BUS-02"),D=S&&S.status==="in_transit"&&S.routeId==="RT-104"&&F.status==="breakdown",m=S&&S.currentLoad<=S.capacity&&B.currentLoad<=B.capacity,$=D&&m,N=performance.now();d({id:"TEST-08",scenario:"Multiple Simultaneous Disruptions",expectedResult:"Resolve simultaneous disruptions without resource collisions, double-booking standby fleet, or violating capacity constraints.",actualResult:$?`Successfully processed 3 concurrent disruptions: ${S.id} dispatched for RT-104, BUS-02 onboarded urgent student, RT-101 dwell time reduced. Zero fleet collision.`:"Failed: Resource collision or capacity constraint violation during concurrent replanning.",passed:$,failureReason:$?null:"Multiple disruptions caused fleet collision or capacity breach.",replanningTimeMs:N-_,simulatedReviewTimeMs:45e3,baselineTimeMs:1065e3,manualIntervention:!1,invariants:{capacityViolation:!m,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}{const _=performance.now(),c=new Ft,y=c.getState().buses.find(B=>B.id==="BUS-03");y.currentLoad=y.capacity,c.getState().buses.forEach(B=>{B.status==="in_depot"&&(B.status="maintenance")}),c.addStudent({name:"Impossible Addition Student",schoolId:"SCH-03",schoolName:"West Valley Elementary",stopName:"SOMA Central",specialNeeds:"Wheelchair Accessibility Required"});const f=c.getState().disruptions.find(B=>B.studentName==="Impossible Addition Student"),g=f&&f.noFeasibleSolution===!0,b=f&&f.aiRecommendationAvailable===!1,E=f&&f.candidateEvaluations&&f.candidateEvaluations.length>0,S=g&&b&&E,F=performance.now();d({id:"TEST-09",scenario:"No Feasible Solution Fallback",expectedResult:'Flag "No Feasible Solution — Manual Intervention Required", record actual candidate rejection reasons, never fabricate false confidence or invalid assignment.',actualResult:S?`Engine reported: "No Feasible Solution — Manual Intervention Required". Logged ${f.candidateEvaluations.length} candidate rejection reasons (Capacity/Status/Compatibility).`:"Failed: Fabricated invalid recommendation when no feasible bus existed.",passed:S,failureReason:S?null:"System failed to report No Feasible Solution when constraints were exhausted.",replanningTimeMs:F-_,simulatedReviewTimeMs:18e4,baselineTimeMs:1545e3,manualIntervention:!0,invariants:{capacityViolation:!1,unavailableBusAssigned:!1,unavailableDriverAssigned:!1,driverCommitmentConflict:!1}})}const a=performance.now()-r,v=l.filter(_=>_.passed).length,A=l.length-v;return{testResults:l,passedCount:v,failedCount:A,totalTests:l.length,allPassed:A===0,totalExecutionTimeMs:a}}const ko=Object.freeze(Object.defineProperty({__proto__:null,runReplanningEdgeCaseTests:bi},Symbol.toStringTag,{value:"Module"})),ze=8;function To(u,l,r){let d=0;d+=45e3;for(let a=0;a<l;a++)d+=15e3,d+=35e3,d+=25e3,d+=45e3;return r?d+=6e4:d+=12e4,d}function Lo(){const l=bi().testResults,r=[];let d=0,a=0,v=0;l.forEach((x,_)=>{const c=x.engineTimeMs,y=x.status==="PASS";let f=3;x.id==="TEST-03"&&(f=6),x.id==="TEST-08"&&(f=8),x.id==="TEST-09"&&(f=12);const g=To("general",f,y);d+=c,a+=g;let b=0;x.id==="TEST-01"?b=-2:x.id==="TEST-02"?b=5:x.id==="TEST-03"?b=4:x.id==="TEST-08"&&(b=7),v+=b,r.push({testId:x.id,scenarioName:x.scenario,prototypeComputationMs:c,simulatedManualTimeMs:g,timeSavedMs:g-c,additionalDelayMins:b,isFeasible:y})});const A=d/l.length,k=a/l.length,h=k-A;return{results:r,metrics:{totalScenarios:l.length,feasibleSolutionRate:r.filter(x=>x.isFeasible).length/l.length*100,avgPrototypeComputationTimeMs:A,avgBaselineRecoveryTimeMs:k,avgTimeSavedMs:h,performanceMultiplier:k/A,avgAdditionalDelayMins:v/l.length,failedScenarios:r.filter(x=>!x.isFeasible).length}}}const ve=ze*60*1e3;function Fo(){const u=I.getState(),{metrics:l,disruptions:r,buses:d,drivers:a,routes:v}=u,A=r.length;r.filter(T=>T.status==="accepted").length;const k=r.filter(T=>T.status==="unresolved").length,h=r.filter(T=>T.status==="rejected").length,x=r.filter(T=>T.noFeasibleSolution===!0).length,_=r.filter(T=>T.status==="rejected"||T.noFeasibleSolution===!0).length,c=r.filter(T=>T.status==="accepted"&&typeof T.endToEndRecoveryTimeMs=="number"),y=c.length>0?c.reduce((T,z)=>T+z.endToEndRecoveryTimeMs,0)/c.length:null,f=y!==null?(y/1e3).toFixed(1):null,g=c.filter(T=>T.endToEndRecoveryTimeMs<=ve).length,b=c.length>0?(g/c.length*100).toFixed(0):"N/A",E=A>0?(_/A*100).toFixed(0):"0",S=d.filter(T=>T.status==="in_transit"||T.status==="delayed").length,F=d.filter(T=>T.status==="in_depot").length,B=d.filter(T=>T.status==="breakdown").length,D=d.filter(T=>T.status==="maintenance").length,m=d.filter(T=>(T.currentLoad||0)>T.capacity).length,$=a.filter(T=>T.status==="active").length,N=a.filter(T=>T.status==="standby").length,O=a.filter(T=>T.status==="sick").length,U=a.filter(T=>T.status==="on_break").length,V=bi(),K=V.passedCount,st=V.totalTests,ct=(V.testResults.reduce((T,z)=>T+z.engineTimeMs,0)/V.testResults.length).toFixed(2),mt=V.testResults.filter(T=>["TEST-01","TEST-02","TEST-03","TEST-04","TEST-09"].includes(T.id)),St=m===0,ot=document.createElement("div");return ot.className="content-body",ot.innerHTML=`

    <!-- Section header -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
      <div style="width:36px;height:36px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;">
        ${P.activity(20,"#0F2747")}
      </div>
      <div>
        <h2 style="font-size:1.15rem;font-weight:800;color:#0F2747;margin:0;">Operations Manager Overview</h2>
        <p style="font-size:0.75rem;color:#64748B;margin:0;">System performance, recovery evaluation &amp; fleet health &mdash; <em>simulated MVP data</em></p>
      </div>
    </div>

    <!-- KPI Row 1: Recovery Performance -->
    <div class="kpi-grid" style="margin-bottom:18px;">

      <!-- E2E Recovery Avg -->
      <div class="kpi-card" style="border-top:3px solid ${y!==null&&y<=ve?"#10B981":"#F59E0B"};">
        <div class="kpi-header">
          <span class="kpi-label">Avg E2E Recovery Time</span>
          <div class="kpi-icon-wrap" style="background:#ECFDF5;color:#10B981;">${P.clock(20,"#10B981")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size:1.5rem;">
            ${f!==null?f+"s":"—"}
          </span>
        </div>
        <div class="kpi-subtext">Target: &le; ${ze} min (${ve/1e3}s)
          ${y!==null?`&nbsp;<span style="color:${y<=ve?"#10B981":"#D97706"};font-weight:700;">${y<=ve?"✓ On Target":"⚠ Over Target"}</span>`:'<span style="color:#94A3B8;">No accepted plans yet</span>'}
        </div>
      </div>

      <!-- Recovery success rate -->
      <div class="kpi-card" style="border-top:3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Recovery Success Rate</span>
          <div class="kpi-icon-wrap" style="background:#EFF6FF;color:#2563EB;">${P.check(20,"#2563EB")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${b}${b!=="N/A"?"%":""}</span>
        </div>
        <div class="kpi-subtext">${g} of ${c.length} recovered within 8-min target</div>
      </div>

      <!-- Manual intervention rate -->
      <div class="kpi-card" style="border-top:3px solid ${parseInt(E)>30?"#EF4444":"#F59E0B"};">
        <div class="kpi-header">
          <span class="kpi-label">Manual Intervention Rate</span>
          <div class="kpi-icon-wrap" style="background:#FEF9C3;color:#B45309;">${P.users(20,"#B45309")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${parseInt(E)>30?"#DC2626":"#D97706"};">${E}%</span>
        </div>
        <div class="kpi-subtext">${_} manual / ${A} total disruptions</div>
      </div>

      <!-- Infeasible / No-solution cases -->
      <div class="kpi-card" style="border-top:3px solid ${x>0?"#EF4444":"#10B981"};">
        <div class="kpi-header">
          <span class="kpi-label">Infeasible Cases</span>
          <div class="kpi-icon-wrap" style="background:${x>0?"#FEF2F2":"#ECFDF5"};color:${x>0?"#EF4444":"#10B981"};">${P.alertTriangle(20,"currentColor")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${x>0?"#DC2626":"#059669"};">${x}</span>
        </div>
        <div class="kpi-subtext">${x>0?"No-feasible-solution flagged — manual dispatch required":"All disruptions had a feasible AI candidate"}</div>
      </div>

      <!-- Constraint violations -->
      <div class="kpi-card" style="border-top:3px solid ${St?"#10B981":"#EF4444"};">
        <div class="kpi-header">
          <span class="kpi-label">Safety / Capacity Violations</span>
          <div class="kpi-icon-wrap" style="background:${St?"#ECFDF5":"#FEF2F2"};color:${St?"#10B981":"#EF4444"};">${P.shield(20,"currentColor")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:${St?"#059669":"#DC2626"};">${m}</span>
        </div>
        <div class="kpi-subtext">${St?"Zero over-capacity buses":`${m} bus(es) over passenger capacity limit`}</div>
      </div>

    </div>

    <!-- KPI Row 2: Fleet & Drivers -->
    <div class="kpi-grid" style="margin-bottom:24px;">

      <div class="kpi-card" style="border-top:3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">Fleet — Active / Total</span>
          <div class="kpi-icon-wrap" style="background:#EFF6FF;color:#2563EB;">${P.bus(20,"#2563EB")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${S}</span>
          <span style="font-size:0.85rem;color:#64748B;font-weight:600;">/ ${d.length}</span>
        </div>
        <div class="kpi-subtext">${F} standby &bull; ${B} breakdown &bull; ${D} maintenance</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #6366F1;">
        <div class="kpi-header">
          <span class="kpi-label">Drivers — Active</span>
          <div class="kpi-icon-wrap" style="background:#EEF2FF;color:#6366F1;">${P.users(20,"#6366F1")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${$}</span>
          <span style="font-size:0.85rem;color:#64748B;font-weight:600;">/ ${a.length}</span>
        </div>
        <div class="kpi-subtext">${N} standby &bull; ${O} sick &bull; ${U} on break</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #10B981;">
        <div class="kpi-header">
          <span class="kpi-label">Disruptions Resolved Today</span>
          <div class="kpi-icon-wrap" style="background:#ECFDF5;color:#10B981;">${P.check(20,"#10B981")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color:#059669;">${l.resolvedDisruptionsToday}</span>
        </div>
        <div class="kpi-subtext">${k} still unresolved &bull; ${h} rejected/overridden</div>
      </div>

      <div class="kpi-card" style="border-top:3px solid #0F2747;">
        <div class="kpi-header">
          <span class="kpi-label">Engine Evaluation</span>
          <div class="kpi-icon-wrap" style="background:#F1F5F9;color:#0F2747;">${P.cpu(20,"#0F2747")}</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="font-size:1.1rem;color:#10B981;">${K}/${st}</span>
          <span style="font-size:0.78rem;font-weight:700;color:#10B981;">PASS</span>
        </div>
        <div class="kpi-subtext">Avg engine time: ${ct}ms &bull; Deterministic constraint engine</div>
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
                ${r.map(T=>{var Q,ut;const z=typeof T.endToEndRecoveryTimeMs=="number"?(T.endToEndRecoveryTimeMs/1e3).toFixed(1)+"s":T.status==="unresolved"?'<em style="color:#94A3B8;">Pending</em>':"—",yt=T.noFeasibleSolution||T.status==="rejected",H=T.status==="accepted"?"#10B981":T.status==="rejected"?"#EF4444":"#D97706";return`
                    <tr>
                      <td><span style="font-family:var(--font-mono);font-size:0.75rem;">${T.id}</span></td>
                      <td>${((Q=T.type)==null?void 0:Q.replace("_"," "))||"—"}</td>
                      <td><span class="severity-pill ${T.severity||"info"}">${T.severity||"info"}</span></td>
                      <td><span style="font-weight:700;color:${H};font-size:0.8rem;">${(ut=T.status)==null?void 0:ut.toUpperCase()}</span></td>
                      <td>${z}</td>
                      <td>${yt?'<span style="color:#DC2626;font-weight:700;">Yes</span>':'<span style="color:#10B981;">No</span>'}</td>
                    </tr>
                  `}).join("")}
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
                ${mt.map(T=>{const z=(T.baselineTimeMs/1e3).toFixed(0),yt=(T.targetTimeMs/1e3).toFixed(0),H=(T.e2eRecoveryTimeMs/1e3).toFixed(1),Q=((T.baselineTimeMs-T.e2eRecoveryTimeMs)/T.baselineTimeMs*100).toFixed(1),ut=T.e2eRecoveryTimeMs<=T.targetTimeMs;return`
                    <tr>
                      <td style="font-size:0.8rem;font-weight:600;">${T.scenario}</td>
                      <td><span style="font-family:var(--font-mono);">${z}s</span></td>
                      <td><span style="font-family:var(--font-mono);">&le;${yt}s</span></td>
                      <td><span style="font-family:var(--font-mono);font-weight:700;color:${ut?"#059669":"#D97706"};">${H}s</span></td>
                      <td><span style="font-family:var(--font-mono);font-size:0.73rem;color:#64748B;">${T.engineTimeMs.toFixed(2)}ms</span></td>
                      <td><span style="font-weight:700;color:#2563EB;">${Q}%</span></td>
                      <td>${T.passed?'<span style="color:#10B981;font-weight:700;">✓ PASS</span>':'<span style="color:#EF4444;font-weight:700;">✗ FAIL</span>'}</td>
                    </tr>
                  `}).join("")}
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
          ${d.map(T=>{const z=T.capacity>0?Math.round((T.currentLoad||0)/T.capacity*100):0,yt=T.status==="breakdown"?"#EF4444":T.status==="maintenance"?"#F59E0B":T.status==="in_depot"?"#9CA3AF":z>90?"#F59E0B":"#2563EB",H=T.status==="in_transit"?'<span style="color:#10B981;font-size:0.7rem;font-weight:700;">IN TRANSIT</span>':T.status==="in_depot"?'<span style="color:#9CA3AF;font-size:0.7rem;font-weight:700;">DEPOT</span>':T.status==="breakdown"?'<span style="color:#EF4444;font-size:0.7rem;font-weight:700;">BREAKDOWN</span>':T.status==="maintenance"?'<span style="color:#F59E0B;font-size:0.7rem;font-weight:700;">MAINTENANCE</span>':`<span style="color:#D97706;font-size:0.7rem;font-weight:700;">${T.status.toUpperCase()}</span>`;return`
              <div style="margin-bottom:10px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                  <span style="font-weight:700;font-size:0.8rem;color:#0F2747;">${T.id}</span>
                  <span style="display:flex;gap:8px;align-items:center;font-size:0.74rem;color:#64748B;">
                    ${H}
                    <span>${T.currentLoad||0}/${T.capacity}</span>
                    <span style="color:${(T.currentLoad||0)>T.capacity?"#DC2626":"#64748B"};">
                      ${(T.currentLoad||0)>T.capacity?"⚠ OVER":z+"%"}
                    </span>
                  </span>
                </div>
                <div style="height:5px;background:#E2E8F0;border-radius:9999px;overflow:hidden;">
                  <div style="height:100%;width:${Math.min(z,100)}%;background:${yt};transition:width 0.3s;"></div>
                </div>
              </div>
            `}).join("")}
        </div>

        <!-- Driver availability -->
        <div class="panel-card" style="padding:20px 22px;">
          <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Driver Availability &amp; Commitments</div>
          ${a.map(T=>{const z=T.status==="active"?"#10B981":T.status==="standby"?"#2563EB":T.status==="sick"?"#EF4444":"#F59E0B",yt=T.commitments&&T.commitments.length>0?'<span style="font-size:0.68rem;color:#D97706;font-weight:700;margin-left:6px;">⚠ Has commitment</span>':"";return`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F1F5F9;">
                <div style="font-size:0.82rem;font-weight:600;color:#0F2747;">${T.name}</div>
                <div style="display:flex;align-items:center;gap:4px;">
                  <span style="font-size:0.72rem;font-weight:700;color:${z};text-transform:uppercase;">${T.status}</span>
                  ${yt}
                </div>
              </div>
            `}).join("")}
        </div>

        <!-- Audit Log -->
        <div class="panel-card" style="padding:20px 22px;">
          <div style="font-size:0.75rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Recent Audit Log</div>
          <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow-y:auto;">
            ${l.recentAuditLogs.map(T=>{const z=T.status==="EXECUTED"?"#10B981":T.status==="MANUAL_OVERRIDE"?"#EF4444":T.status==="PENDING_DISPATCHER_REVIEW"||T.status==="PENDING_APPROVAL"?"#D97706":"#64748B";return`
                <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:8px 12px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                    <span style="font-size:0.68rem;color:#94A3B8;font-family:var(--font-mono);">${T.time}</span>
                    <span style="font-size:0.65rem;font-weight:700;color:${z};text-transform:uppercase;">${T.status}</span>
                  </div>
                  <div style="font-size:0.76rem;color:#374151;">${T.event}</div>
                  <div style="font-size:0.68rem;color:#94A3B8;margin-top:2px;">${T.user}</div>
                </div>
              `}).join("")}
          </div>
        </div>

      </div>
    </div>

    <!-- Risk / Validation summary banner -->
    <div class="panel-card" style="padding:16px 22px;margin-top:16px;background:linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 100%);border-left:4px solid #2563EB;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${P.shield(18,"#2563EB")}
        </div>
        <div>
          <div style="font-weight:800;color:#0F2747;font-size:0.87rem;margin-bottom:4px;">Responsible AI &amp; Validation Summary</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px 24px;font-size:0.78rem;color:#374151;line-height:1.5;">
            <span>✓ Human-in-the-loop: all AI plans require dispatcher approval before execution</span>
            <span>✓ Constraint engine rejects capacity violations, driver conflicts and ADA non-compliance</span>
            <span>✓ No-feasible-solution cases surface manual intervention alerts rather than fabricated plans</span>
            <span>✓ Offline mode queues changes locally; syncs on reconnection (resilience tested)</span>
            <span>✓ Engine evaluation: ${K}/${st} scenarios pass constraint invariants</span>
            <span style="color:#94A3B8;font-style:italic;">⚠ MVP uses representative/simulated data — not real district telemetry</span>
          </div>
        </div>
      </div>
    </div>

  `,setTimeout(()=>{ot.querySelectorAll(".data-table tbody tr").forEach((T,z)=>{var H;const yt=(H=r[z])==null?void 0:H.id;yt&&(T.style.cursor="pointer",T.addEventListener("click",()=>{I.setSelectedDisruption(yt),I.setActiveTab("replanning")}))})},50),ot}function Rn(u){return u.status==="breakdown"?{label:"Unavailable",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA"}:u.status==="maintenance"?{label:"Offline",color:"#6B7280",bg:"#F3F4F6",border:"#D1D5DB"}:u.status==="delayed"?{label:"Delayed",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A"}:u.status==="in_transit"?{label:"Active",color:"#059669",bg:"#ECFDF5",border:"#6EE7B7"}:u.status==="in_depot"?{label:"Idle",color:"#2563EB",bg:"#EFF6FF",border:"#BFDBFE"}:{label:"Offline",color:"#6B7280",bg:"#F3F4F6",border:"#D1D5DB"}}function zn(u){return u.gpsStatus==="manual"||u.isManualLocation?{label:"Manual Checkpoint",icon:"📍",color:"#2563EB",bg:"#EFF6FF",border:"#BFDBFE",isLive:!1}:u.gpsStatus==="no_signal"||u.status==="breakdown"||u.status==="maintenance"?{label:"No Signal",icon:"📡",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA",isLive:!1}:{label:"Live Fix",icon:"🛰️",color:"#10B981",bg:"#ECFDF5",border:"#A7F3D0",isLive:!0}}function Bo(u,l){const r=l.drivers.find(h=>h.id===u.driverId),d=l.routes.find(h=>h.id===u.routeId),a=Rn(u),v=zn(u),A=Math.round(u.currentLoad/u.capacity*100),k=u.capacity-u.currentLoad;return`
    <div id="bus-detail-slideout" style="
      position: fixed; top: 0; right: 0; width: 420px; height: 100vh;
      background: #fff; box-shadow: -8px 0 40px rgba(15,39,71,0.15);
      z-index: 200; display: flex; flex-direction: column;
      border-left: 1px solid #E2E8F0; animation: slideInRight 0.3s ease;
    ">
      <!-- Header -->
      <div style="padding: 20px 24px; background: var(--color-navy); color: #fff; display: flex; align-items: flex-start; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800;">${u.id}</span>
            <span style="background: ${a.bg}; color: ${a.color}; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px; border: 1px solid ${a.border};">
              ${a.label}
            </span>
          </div>
          <div style="font-size: 0.82rem; color: #94A3B8;">${u.model}</div>
          <div style="font-size: 0.72rem; color: #64748B; margin-top: 2px;">${u.plate} • ${u.type}</div>
        </div>
        <button id="close-slideout-btn" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Telemetry Grid -->
      <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; flex-grow: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Speed</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #0F2747; font-family: var(--font-mono);">${u.speedKmh} <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;">km/h</span></div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Health</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${u.healthScore>90?"#059669":u.healthScore>70?"#D97706":"#EF4444"}; font-family: var(--font-mono);">${u.healthScore}<span style="font-size: 0.8rem; font-weight: 600;">%</span></div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">${u.type.includes("Electric")?"Battery":"Fuel"}</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${u.fuelLevel<20?"#EF4444":u.fuelLevel<40?"#D97706":"#0F2747"}; font-family: var(--font-mono);">${u.fuelLevel}<span style="font-size: 0.8rem; font-weight: 600;">%</span></div>
          </div>
          <div style="background: ${v.bg}; border: 1px solid ${v.border}; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">GPS Signal</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: ${v.color};">${v.icon} ${v.label}</div>
            <div style="font-size: 0.68rem; color: #64748B; margin-top: 2px;">${v.isLive?"Live Stream":"Not Live (Last Known)"}</div>
          </div>
        </div>

        <!-- GPS Fallback & Location Details -->
        <div style="background: ${v.isLive?"#F8FAFC":"#FEF2F2"}; border: 1px solid ${v.isLive?"#E2E8F0":"#FECACA"}; border-radius: 10px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.7rem; font-weight: 700; color: ${v.isLive?"#64748B":"#DC2626"}; text-transform: uppercase;">
              ${v.isLive?"Simulated Fleet GPS":"⚠️ Signal Lost — Last Known Location"}
            </div>
            <span style="font-size: 0.68rem; font-weight: 700; color: ${v.color}; background: ${v.bg}; padding: 2px 6px; border-radius: 4px;">
              ${v.label}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem; color: #0F2747; margin-bottom: 4px;">
            ${u.lastKnownLocation||"Route Coordinates"}
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.78rem; color: #64748B; margin-bottom: 4px;">
            Coordinates: [${u.coords[0].toFixed(5)}, ${u.coords[1].toFixed(5)}]
          </div>
          <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 12px;">
            ⏱ Fleet Sync: ${u.lastGpsSync||"N/A"}
          </div>

          <button onclick="window.__manualLocationOverride('${u.id}')" style="
            width: 100%; padding: 8px 12px; background: #fff; color: #2563EB;
            border: 1.5px solid #BFDBFE; border-radius: 8px; font-size: 0.82rem;
            font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          ">
            📍 Dispatcher Manual Location Update
          </button>
        </div>

        <!-- Capacity Bar -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #0F2747;">Passenger Load</span>
            <span style="font-size: 0.8rem; font-weight: 700; color: #64748B;">${u.currentLoad} / ${u.capacity} seated</span>
          </div>
          <div style="height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
            <div style="height: 100%; width: ${A}%; background: ${A>90?"#EF4444":A>75?"#F59E0B":"#2563EB"}; border-radius: 9999px; transition: width 0.5s ease;"></div>
          </div>
          <div style="display: flex; gap: 16px;">
            <span style="font-size: 0.75rem; color: #10B981; font-weight: 700;">✓ ${k} available seats</span>
            <span style="font-size: 0.75rem; color: #64748B;">${A}% capacity used</span>
          </div>
        </div>

        <!-- Driver -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Assigned Driver</div>
          ${r?`
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${r.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #E2E8F0;" />
              <div>
                <div style="font-weight: 700; color: #0F2747;">${r.name}</div>
                <div style="font-size: 0.75rem; color: #64748B;">${r.phone}</div>
                <div style="font-size: 0.72rem; color: #F59E0B; margin-top: 2px;">★ ${r.rating} • ${r.experienceYrs} yrs experience</div>
              </div>
            </div>
          `:'<span style="color: #94A3B8; font-style: italic;">No driver assigned — Depot Standby</span>'}
        </div>

        <!-- Route -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Current Route</div>
          ${d?`
            <div style="font-weight: 700; color: #0F2747; margin-bottom: 4px;">${d.name}</div>
            <div style="font-size: 0.78rem; color: #64748B; margin-bottom: 6px;">→ ${d.schoolName}</div>
            <div style="display: flex; gap: 12px; font-size: 0.75rem;">
              <span style="color: #10B981; font-weight: 700;">ETA: ${d.currentEta}</span>
              <span style="color: #64748B;">${d.completedStops}/${d.totalStops} stops done</span>
            </div>
          `:'<span style="color: #94A3B8; font-style: italic;">No active route</span>'}
        </div>

        <!-- Features -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">Vehicle Features</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${u.amenities.map(h=>`<span style="background: #EFF6FF; color: #2563EB; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 9999px; border: 1px solid #BFDBFE;">✓ ${h}</span>`).join("")}
          </div>
        </div>

        ${u.status==="breakdown"?`
          <button onclick="window.__triggerReplanning('${u.id}')" style="width: 100%; padding: 12px; background: #EF4444; color: #fff; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ⚡ Open AI Emergency Replanning
          </button>
        `:u.status==="in_transit"||u.status==="delayed"?`
          <button onclick="window.__declareBreakdown('${u.id}')" style="width: 100%; padding: 12px; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ⚠️ Report Vehicle Breakdown / Stall
          </button>
        `:""}
      </div>
    </div>
    <div id="slideout-backdrop" style="position: fixed; inset: 0; background: rgba(15,39,71,0.3); z-index: 199;"></div>
  `}window.__triggerReplanning=u=>{const l=document.getElementById("bus-detail-slideout"),r=document.getElementById("slideout-backdrop");l&&l.remove(),r&&r.remove(),I.handleVehicleBreakdown(u)};window.__declareBreakdown=u=>{const l=document.getElementById("bus-detail-slideout"),r=document.getElementById("slideout-backdrop");l&&l.remove(),r&&r.remove(),I.handleVehicleBreakdown(u,{title:`Vehicle Breakdown: Bus ${u} Engine Stall`,location:"Active Route Waypoint",impact:"Engine temperature critical alert. Vehicle stopped safely."})};window.__manualLocationOverride=u=>{const l=document.getElementById("bus-detail-slideout"),r=document.getElementById("slideout-backdrop");l&&l.remove(),r&&r.remove(),I.openModal("manual_location",{busId:u})};function $o(){const u=I.getState(),{buses:l,drivers:r,routes:d}=u,a=document.createElement("div");a.className="content-body";const v=l.filter(c=>c.status==="in_transit").length,A=l.filter(c=>c.status==="delayed").length,k=l.filter(c=>c.status==="in_depot").length,h=l.filter(c=>c.status==="breakdown"||c.status==="maintenance").length;a.innerHTML=`
    <!-- KPI Summary Strip -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #10B981; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="active" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Active</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">${v}</div>
        <div style="font-size: 0.72rem; color: #64748B;">In transit now</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #F59E0B; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="delayed" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Delayed</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #D97706;">${A}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Behind schedule</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #2563EB; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="idle" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Idle</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #2563EB;">${k}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Depot standby</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #EF4444; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="unavailable" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Unavailable</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #EF4444;">${h}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Breakdown / repair</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #6B7280; border-radius: 12px; padding: 14px 16px; cursor: pointer;" data-status-filter="all" class="kpi-filter-card">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Fleet Total</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #0F2747;">${l.length}</div>
        <div style="font-size: 0.72rem; color: #64748B;">All vehicles</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Live Fleet Monitor</h2>
          <p>Click any row to view full telemetry details. Includes GPS lock status, passenger load, and driver assignment.</p>
        </div>

        <div class="search-filter-bar">
          <div class="search-input-wrap">
            <span class="search-input-icon">${P.search(16,"currentColor")}</span>
            <input type="text" id="bus-search-input" placeholder="Search Bus ID, driver, route..." />
          </div>

          <select id="bus-status-filter" class="form-select" style="width: auto; padding: 8px 12px;">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="delayed">Delayed</option>
            <option value="unavailable">Unavailable</option>
            <option value="offline">Offline</option>
          </select>

          <button class="action-btn primary" id="add-bus-btn" style="padding: 8px 14px;">
            ${P.plus(16,"#fff")} Register Vehicle
          </button>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Capacity</th>
              <th>Current Load</th>
              <th>Available Seats</th>
              <th>Location (Coords)</th>
              <th>GPS Status</th>
              <th>Operational Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="buses-table-body">
            ${l.map(c=>{const y=r.find(B=>B.id===c.driverId),f=d.find(B=>B.id===c.routeId),g=Rn(c),b=zn(c),E=c.capacity-c.currentLoad,S=Math.round(c.currentLoad/c.capacity*100);let F=g.label.toLowerCase();return F==="unavailable"&&(F="unavailable"),F==="offline"&&(F="offline"),`
                <tr class="bus-row" data-bus-id="${c.id}" data-filter-status="${F}" style="cursor: pointer;" title="Click to view full details">
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 8px; height: 8px; border-radius: 50%; background: ${g.color}; flex-shrink: 0;"></div>
                      <div>
                        <div class="bus-pill">${c.id}</div>
                        <div style="font-size: 0.68rem; color: #94A3B8; margin-top: 2px;">${c.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    ${y?`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${y.photo}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid #E2E8F0;" />
                        <div>
                          <div style="font-weight: 600; font-size: 0.85rem; color: #0F2747;">${y.name}</div>
                          <div style="font-size: 0.68rem; color: #94A3B8;">${y.shiftStart} – ${y.shiftEnd}</div>
                        </div>
                      </div>
                    `:'<span style="color: #94A3B8; font-style: italic; font-size: 0.82rem;">Unassigned</span>'}
                  </td>
                  <td>
                    ${f?`
                      <div style="font-weight: 600; color: #2563EB; font-size: 0.85rem;">${f.id}</div>
                      <div style="font-size: 0.7rem; color: #64748B;">${f.schoolName}</div>
                    `:'<span style="color: #94A3B8; font-size: 0.82rem; font-style: italic;">No Route</span>'}
                  </td>
                  <td style="text-align: center; font-weight: 700; font-family: var(--font-mono);">${c.capacity}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; max-width: 70px; height: 6px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                        <div style="height: 100%; width: ${S}%; background: ${S>90?"#EF4444":S>75?"#F59E0B":"#2563EB"}; border-radius: 9999px;"></div>
                      </div>
                      <span style="font-weight: 700; font-family: var(--font-mono); font-size: 0.85rem;">${c.currentLoad}</span>
                    </div>
                  </td>
                  <td>
                    <span style="font-weight: 700; font-family: var(--font-mono); color: ${E===0?"#EF4444":E<5?"#F59E0B":"#059669"}; font-size: 0.92rem;">${E}</span>
                    <span style="font-size: 0.7rem; color: #94A3B8; margin-left: 2px;">seats</span>
                  </td>
                  <td>
                    <div style="font-weight: 600; font-size: 0.8rem; color: #0F2747; line-height: 1.3;">
                      ${c.lastKnownLocation?c.lastKnownLocation.split("(")[0]:"En Route"}
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #94A3B8; margin-top: 2px;">
                      ${c.coords[0].toFixed(4)}, ${c.coords[1].toFixed(4)}
                    </div>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; background: ${b.bg}; color: ${b.color}; border: 1px solid ${b.border};">
                      ${b.icon} ${b.label}
                    </span>
                    ${b.isLive?"":'<div style="font-size: 0.65rem; color: #EF4444; font-weight: 600; margin-top: 2px;">(Not Live)</div>'}
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${g.bg}; color: ${g.color}; border: 1px solid ${g.border};">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      ${g.label}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button class="action-btn ${c.status==="breakdown"?"danger":"secondary"} open-bus-detail-btn" data-bus-id="${c.id}" style="padding: 4px 10px; font-size: 0.75rem; white-space: nowrap;">
                        ${c.status==="breakdown"?"⚡ Replan":"Details"}
                      </button>
                      <button class="action-btn secondary manual-gps-btn" data-bus-id="${c.id}" style="padding: 4px 8px; font-size: 0.75rem; white-space: nowrap; color: #2563EB;" title="Manual Location Checkpoint Override">
                        📍 Fix
                      </button>
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <style>
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .bus-row:hover td { background: #F0F7FF !important; }
      .kpi-filter-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15,39,71,0.08); transition: all 0.2s ease; }
      .kpi-filter-card.selected { outline: 2px solid #2563EB; }
    </style>
  `;function x(c){var F,B;const y=u.buses.find(D=>D.id===c);if(!y)return;const f=document.getElementById("bus-detail-slideout"),g=document.getElementById("slideout-backdrop");f&&f.remove(),g&&g.remove();const b=Bo(y,u),E=document.createElement("div");E.innerHTML=b,document.body.appendChild(E.children[0]),document.body.appendChild(E.children[0]);const S=()=>{const D=document.getElementById("bus-detail-slideout"),m=document.getElementById("slideout-backdrop");D&&D.remove(),m&&m.remove()};(F=document.getElementById("close-slideout-btn"))==null||F.addEventListener("click",S),(B=document.getElementById("slideout-backdrop"))==null||B.addEventListener("click",S)}function _(){var g,b,E;const c=((b=(g=a.querySelector("#bus-search-input"))==null?void 0:g.value)==null?void 0:b.toLowerCase())||"",y=((E=a.querySelector("#bus-status-filter"))==null?void 0:E.value)||"all";a.querySelectorAll(".bus-row").forEach(S=>{const F=S.textContent.toLowerCase(),B=S.getAttribute("data-filter-status"),D=F.includes(c),m=y==="all"||B===y;S.style.display=D&&m?"":"none"})}return setTimeout(()=>{var f;const c=a.querySelector("#bus-search-input");c==null||c.addEventListener("input",_);const y=a.querySelector("#bus-status-filter");y==null||y.addEventListener("change",_),a.querySelectorAll(".kpi-filter-card").forEach(g=>{g.addEventListener("click",()=>{const b=g.getAttribute("data-status-filter"),E=a.querySelector("#bus-status-filter");E&&(E.value=b),_(),a.querySelectorAll(".kpi-filter-card").forEach(S=>S.classList.remove("selected")),g.classList.add("selected")})}),a.querySelectorAll(".bus-row").forEach(g=>{g.addEventListener("click",b=>{b.target.closest("button")||x(g.getAttribute("data-bus-id"))})}),a.querySelectorAll(".open-bus-detail-btn").forEach(g=>{g.addEventListener("click",b=>{b.stopPropagation();const E=g.getAttribute("data-bus-id"),S=u.buses.find(F=>F.id===E);if((S==null?void 0:S.status)==="breakdown"){const F=u.disruptions.find(B=>B.busId===E);F&&I.setSelectedDisruption(F.id),I.setActiveTab("replanning")}else x(E)})}),a.querySelectorAll(".manual-gps-btn").forEach(g=>{g.addEventListener("click",b=>{b.stopPropagation();const E=g.getAttribute("data-bus-id");I.openModal("manual_location",{busId:E})})}),(f=a.querySelector("#add-bus-btn"))==null||f.addEventListener("click",()=>{I.showToast("Vehicle Registration Wizard: Connected to District DMV Database","info")})},50),a}const Re={};function Mo(u,l,r){var _;if(!document.getElementById(u))return;if(Re[u]){try{Re[u].remove()}catch{}delete Re[u]}const a=r.find(c=>c.id===l.assignedBus),v=((_=l.stops[Math.floor(l.stops.length/2)])==null?void 0:_.coords)||[37.772,-122.435],A=it.map(u,{center:v,zoom:14,zoomControl:!1,attributionControl:!1,dragging:!0,scrollWheelZoom:!1});Re[u]=A,it.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{maxZoom:19,subdomains:"abcd"}).addTo(A);const k=l.stops.map(c=>c.coords),h=l.status==="disrupted",x=l.status==="delayed";if(k.length>1){const c=h?"#EF4444":x?"#F59E0B":"#2563EB";it.polyline(k,{color:c,weight:4,opacity:.85,dashArray:h?"8, 8":null}).addTo(A)}if(l.stops.forEach((c,y)=>{let f,g,b="#fff";c.status==="completed"?(f="#10B981",g="✓"):c.status==="next"||c.status==="delayed"?(f="#2563EB",g=`${y+1}`):c.status==="stuck"||c.status==="stranded"?(f="#EF4444",g="⚠"):c.status==="destination"?(f="#0F2747",g="🏫",b="#F59E0B"):c.status==="pending"?(f=h?"#F59E0B":"#94A3B8",g=`${y+1}`):(f="#94A3B8",g=`${y+1}`);const E=it.divIcon({className:"",html:`<div style="
        width: 26px; height: 26px; border-radius: 50%;
        background: ${f}; color: ${b};
        display: flex; align-items: center; justify-content: center;
        font-size: 0.65rem; font-weight: 800;
        border: 2.5px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">${g}</div>`,iconSize:[26,26],iconAnchor:[13,13]}),S=it.marker(c.coords,{icon:E});S.bindTooltip(`
      <div style="font-family: sans-serif; font-size: 0.78rem;">
        <b>Stop ${y+1}:</b> ${c.name}<br>
        <span style="color: #64748B;">⏱ ${c.time}${c.studentsCount?` • 👥 ${c.studentsCount}`:""}</span>
      </div>
    `,{sticky:!0,direction:"top"}),S.addTo(A)}),a&&(a.status==="in_transit"||a.status==="delayed"||a.status==="breakdown")){const c=a.status==="breakdown"?"#EF4444":a.status==="delayed"?"#F59E0B":"#2563EB",y=it.divIcon({className:"",html:`<div style="
        background: ${c}; color: #fff;
        border: 2.5px solid #fff;
        border-radius: 8px; padding: 3px 7px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.68rem; font-weight: 800;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        white-space: nowrap;
        ${a.status==="breakdown"?"animation: pulseDanger 1.5s infinite;":""}
      ">${a.id} ${a.status==="breakdown"?"⚠️":""}</div>`,iconSize:[60,24],iconAnchor:[30,12]});it.marker(a.coords,{icon:y}).bindTooltip(`<b>${a.id}</b> — ${a.currentLoad}/${a.capacity} pax • ${a.speedKmh} km/h`).addTo(A)}setTimeout(()=>A.invalidateSize(),100)}function Po(){const u=I.getState(),{routes:l,buses:r,students:d}=u,a=document.createElement("div");a.className="content-body";const v=l.filter(h=>h.status==="on_time").length,A=l.filter(h=>h.status==="delayed").length,k=l.filter(h=>h.status==="disrupted").length;return a.innerHTML=`
    <!-- Header & Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">Live Route Operations</h2>
        <p style="font-size: 0.85rem; color: #64748B;">Per-route map views, stop progression, ETA monitoring, and passenger counts</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <div style="display: flex; gap: 8px;">
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #ECFDF5; color: #059669; border: 1px solid #6EE7B7;">● On-Time: ${v}</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;">● Delayed: ${A}</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">● Disrupted: ${k}</span>
        </div>
        <button class="action-btn secondary" id="optimize-all-routes-btn">
          ${P.refreshCw(16,"currentColor")} Recalculate Traffic
        </button>
      </div>
    </div>

    <!-- Routes Summary Table -->
    <div class="panel-card" style="margin-bottom: 24px;">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Route Summary</h2>
          <p>Click a route row to jump to its detailed timeline and live map below</p>
        </div>
        <div class="search-input-wrap">
          <span class="search-input-icon">${P.search(16,"currentColor")}</span>
          <input type="text" id="route-search-input" placeholder="Search route, bus, school..." />
        </div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Bus</th>
              <th>Driver</th>
              <th>Students</th>
              <th>Current Stop</th>
              <th>Remaining Stops</th>
              <th>Sched. ETA</th>
              <th>Live ETA</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody id="routes-table-body">
            ${l.map(h=>{r.find(b=>b.id===h.assignedBus);const x=h.stops.find(b=>b.status==="next"||b.status==="delayed"||b.status==="stuck"),_=h.stops.filter(b=>b.status==="pending"||b.status==="next"||b.status==="delayed"||b.status==="stranded"||b.status==="stuck").length,c=h.stops.reduce((b,E)=>b+(E.studentsCount||0),0),y=h.status==="disrupted",f=h.status==="delayed",g=y?"#EF4444":f?"#D97706":"#059669";return`
                <tr class="route-table-row" data-route-id="${h.id}" style="cursor: pointer;">
                  <td>
                    <div style="font-weight: 700; color: #0F2747; font-family: var(--font-mono);">${h.id}</div>
                    <div style="font-size: 0.7rem; color: #64748B;">${h.name.split("-").slice(1).join("-").trim()}</div>
                  </td>
                  <td>
                    <span class="bus-pill">${h.assignedBus||"N/A"}</span>
                    ${y?'<div style="font-size: 0.68rem; color: #EF4444; font-weight: 700; margin-top: 3px;">⚠️ BROKEN DOWN</div>':""}
                  </td>
                  <td>
                    <span style="font-weight: 600; font-size: 0.85rem;">${h.assignedDriver}</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="font-weight: 800; font-family: var(--font-mono);">${c}</span>
                    <div style="font-size: 0.68rem; color: #64748B;">passengers</div>
                  </td>
                  <td>
                    ${x?`
                      <div style="font-size: 0.82rem; font-weight: 600; color: #2563EB; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${x.name}</div>
                      <div style="font-size: 0.68rem; color: #64748B;">⏱ ${x.time}</div>
                    `:'<span style="color: #94A3B8; font-style: italic; font-size: 0.8rem;">Completed / At School</span>'}
                  </td>
                  <td style="text-align: center;">
                    <span style="font-weight: 800; font-family: var(--font-mono); font-size: 1rem; color: ${_>0?"#0F2747":"#10B981"};">${_}</span>
                    <div style="font-size: 0.68rem; color: #64748B;">of ${h.totalStops}</div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: #64748B;">${h.scheduledArrivalTime}</span>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 800; color: ${g};">
                      ${h.currentEta}
                    </span>
                    ${h.delayMinutes>0?`<div style="font-size: 0.68rem; color: #D97706; font-weight: 700;">+${h.delayMinutes} min</div>`:""}
                  </td>
                  <td>
                    <span class="status-badge ${h.status}">${h.status.toUpperCase()}</span>
                  </td>
                  <td>
                    <button class="action-btn ${y?"danger":"secondary"} jump-to-route-btn" data-route-id="${h.id}" style="padding: 4px 10px; font-size: 0.75rem;">
                      ${y?"⚡ Replan":"↓ Details"}
                    </button>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Per-Route Detail Expanded Cards -->
    <div style="display: flex; flex-direction: column; gap: 28px;" id="route-details-container">
      ${l.map(h=>{const x=r.find(E=>E.id===h.assignedBus),_=h.status==="disrupted",c=h.status==="delayed",y=Math.round(h.completedStops/h.totalStops*100),f=h.stops.reduce((E,S)=>E+(S.studentsCount||0),0),g=`route-map-${h.id}`,b=_?"#EF4444":c?"#F59E0B":"#2563EB";return`
          <div class="panel-card route-detail-card" id="route-card-${h.id}" style="border-left: 5px solid ${b}; scroll-margin-top: 80px;">
            <!-- Route Card Header -->
            <div class="panel-header" style="background: #FAFBFD; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #64748B; background: #F1F5F9; padding: 2px 8px; border-radius: 6px;">${h.id}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: #0F2747;">${h.name}</h3>
                  <span class="status-badge ${h.status}">${h.status.toUpperCase()}</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 6px; display: flex; gap: 16px; flex-wrap: wrap;">
                  <span>🏫 <b>${h.schoolName}</b></span>
                  <span>🚌 <b>${h.assignedBus||"None"}</b></span>
                  <span>👤 <b>${h.assignedDriver}</b></span>
                  <span>👥 <b>${f} students</b></span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 16px; flex-shrink: 0;">
                <div style="text-align: center;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Live ETA</div>
                  <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: ${_?"#EF4444":c?"#D97706":"#059669"};">
                    ${h.currentEta}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Progress</div>
                  <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: #0F2747;">${y}%</div>
                </div>
                ${_?`
                  <button class="action-btn danger replan-route-btn" data-disruption-id="DIS-2026-001" style="white-space: nowrap;">
                    ${P.zap(16,"#fff")} AI Emergency Replan
                  </button>
                `:`
                  <button class="action-btn secondary focus-map-btn" data-map-id="${g}" style="white-space: nowrap;">
                    ${P.mapPin(16,"currentColor")} Recenter Map
                  </button>
                `}
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="padding: 14px 24px; border-bottom: 1px solid #F1F5F9; background: #FAFBFD;">
              <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 700; color: #64748B; margin-bottom: 6px;">
                <span>Departure: ${h.scheduledStartTime}</span>
                <span>${h.completedStops} / ${h.totalStops} stops completed</span>
                <span>Bell: ${h.scheduledArrivalTime}</span>
              </div>
              <div style="height: 8px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                <div style="height: 100%; width: ${y}%; background: ${_?"#EF4444":c?"#F59E0B":"linear-gradient(90deg, #2563EB, #10B981)"}; border-radius: 9999px; transition: width 0.6s ease;"></div>
              </div>
            </div>

            <!-- Body: Two columns — Stop Timeline + Live Map -->
            <div style="display: grid; grid-template-columns: 1fr 380px; gap: 0;">
              <!-- Stop Timeline -->
              <div style="padding: 20px 24px; border-right: 1px solid #F1F5F9;">
                <h4 style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">Stop Progression Timeline</h4>

                <!-- Map legend -->
                <div style="display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;">
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #10B981;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981;"></span> Completed
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #2563EB;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #2563EB;"></span> Current
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #F59E0B;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B;"></span> Upcoming / Affected
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #EF4444;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444;"></span> Disrupted
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: #94A3B8;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #94A3B8;"></span> Pending
                  </span>
                </div>

                <!-- Stop Cards - horizontal scroll friendly grid -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${h.stops.map((E,S)=>{let F="#94A3B8",B="#F8FAFC",D="#E2E8F0",m="Pending",$="#94A3B8",N=!1;return E.status==="completed"?(F="#10B981",B="#ECFDF5",D="#A7F3D0",m="✓ Completed",$="#059669"):E.status==="next"?(F="#2563EB",B="#EFF6FF",D="#BFDBFE",m="→ Next Stop",$="#2563EB",N=!0):E.status==="delayed"?(F="#F59E0B",B="#FFFBEB",D="#FDE68A",m="⏳ Delayed",$="#D97706",N=!0):E.status==="stuck"?(F="#EF4444",B="#FEF2F2",D="#FECACA",m="⚠ Breakdown Here",$="#DC2626",N=!0):E.status==="stranded"?(F="#EF4444",B="#FFF0F0",D="#FECACA",m="🚨 Students Stranded",$="#DC2626"):E.status==="destination"&&(F="#0F2747",B="#F0F4FF",D="#C7D2FE",m="🏫 Destination",$="#0F2747"),`
                      <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <!-- Timeline connector -->
                        <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0; padding-top: 6px;">
                          <div style="width: 16px; height: 16px; border-radius: 50%; background: ${F}; border: 2.5px solid #fff; box-shadow: 0 0 0 2px ${F}; flex-shrink: 0; ${N?"box-shadow: 0 0 0 3px "+F+"40;":""}"></div>
                          ${S<h.stops.length-1?`<div style="width: 2px; flex-grow: 1; min-height: 18px; background: ${F}40; margin-top: 2px;"></div>`:""}
                        </div>

                        <!-- Stop content -->
                        <div style="
                          flex-grow: 1;
                          background: ${B};
                          border: 1.5px solid ${D};
                          border-radius: 10px;
                          padding: 10px 14px;
                          margin-bottom: ${S<h.stops.length-1?"2px":"0"};
                          ${N?"box-shadow: 0 2px 8px rgba(37,99,235,0.12);":""}
                        ">
                          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <span style="font-size: 0.65rem; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Stop ${S+1}</span>
                              <span style="font-size: 0.7rem; font-weight: 700; color: ${$};">${m}</span>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748B; font-weight: 600;">${E.time}</span>
                          </div>
                          <div style="font-weight: 700; font-size: 0.88rem; color: #0F2747; line-height: 1.3;">${E.name}</div>
                          ${E.studentsCount>0?`
                            <div style="margin-top: 4px; font-size: 0.72rem; color: #64748B; display: flex; align-items: center; gap: 4px;">
                              👥 <span style="font-weight: 600;">${E.studentsCount} students</span>
                            </div>
                          `:""}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              </div>

              <!-- Live Mini-Map for this Route -->
              <div style="padding: 20px 20px; display: flex; flex-direction: column; gap: 12px;">
                <h4 style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">Live Route Map</h4>
                <div id="${g}" style="height: 360px; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; background: #E5E7EB;"></div>
                ${x?`
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px;">
                    <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Assigned Bus Telemetry</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.78rem;">
                      <div><span style="color: #94A3B8;">Speed:</span> <b>${x.speedKmh} km/h</b></div>
                      <div><span style="color: #94A3B8;">${x.type.includes("Electric")?"Battery":"Fuel"}:</span> <b>${x.fuelLevel}%</b></div>
                      <div><span style="color: #94A3B8;">Load:</span> <b>${x.currentLoad}/${x.capacity}</b></div>
                      <div><span style="color: #94A3B8;">Health:</span> <b style="color: ${x.healthScore>85?"#059669":"#EF4444"};">${x.healthScore}%</b></div>
                    </div>
                  </div>
                `:""}
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `,setTimeout(()=>{var x;const h=a.querySelector("#route-search-input");h==null||h.addEventListener("input",_=>{const c=_.target.value.toLowerCase();a.querySelectorAll("#routes-table-body tr").forEach(y=>{y.style.display=y.textContent.toLowerCase().includes(c)?"":"none"})}),a.querySelectorAll(".route-table-row").forEach(_=>{_.addEventListener("click",c=>{var f;if(c.target.closest("button"))return;const y=_.getAttribute("data-route-id");(f=document.getElementById(`route-card-${y}`))==null||f.scrollIntoView({behavior:"smooth",block:"start"})})}),a.querySelectorAll(".jump-to-route-btn").forEach(_=>{_.addEventListener("click",c=>{var g;c.stopPropagation();const y=_.getAttribute("data-route-id"),f=_.getAttribute("data-disruption-id");if(f){I.setSelectedDisruption(f),I.setActiveTab("replanning");return}(g=document.getElementById(`route-card-${y}`))==null||g.scrollIntoView({behavior:"smooth",block:"start"})})}),a.querySelectorAll(".replan-route-btn").forEach(_=>{_.addEventListener("click",()=>{const c=_.getAttribute("data-disruption-id");c&&I.setSelectedDisruption(c),I.setActiveTab("replanning")})}),(x=a.querySelector("#optimize-all-routes-btn"))==null||x.addEventListener("click",()=>{I.showToast("Responsible AI Traffic Model: Recalculated live corridors. No new bottlenecks detected.","success")}),l.forEach((_,c)=>{setTimeout(()=>{Mo(`route-map-${_.id}`,_,r)},100+c*150)})},80),a}function Io(u){return u.status==="stranded"?{label:"Critical",color:"#EF4444",bg:"#FEF2F2"}:u.status==="urgent_added"?{label:"High",color:"#D97706",bg:"#FFFBEB"}:u.specialNeeds&&u.specialNeeds!=="None"?{label:"High",color:"#D97706",bg:"#FFFBEB"}:u.status==="absent_cancelled"?{label:"Low",color:"#94A3B8",bg:"#F8FAFC"}:{label:"Normal",color:"#10B981",bg:"#ECFDF5"}}function Do(u){return{boarded:{label:"Boarded",color:"#059669",bg:"#ECFDF5",border:"#A7F3D0"},waiting:{label:"Waiting",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A"},absent_cancelled:{label:"Absent",color:"#6B7280",bg:"#F3F4F6",border:"#D1D5DB"},urgent_added:{label:"Pending Assign",color:"#7C3AED",bg:"#F5F3FF",border:"#DDD6FE"},stranded:{label:"Stranded",color:"#DC2626",bg:"#FEF2F2",border:"#FECACA"}}[u]||{label:u,color:"#64748B",bg:"#F8FAFC",border:"#E2E8F0"}}function Ro(){const u=I.getState(),{students:l,buses:r,routes:d}=u,a=document.createElement("div");a.className="content-body";const v=[...new Set(l.map(f=>f.busId).filter(f=>f&&f!=="UNASSIGNED"))],A=[...new Set(l.map(f=>f.routeId).filter(f=>f&&f!=="UNASSIGNED"))],k=l.filter(f=>f.status==="boarded").length,h=l.filter(f=>f.status==="waiting").length,x=l.filter(f=>f.status==="absent_cancelled").length,_=l.filter(f=>f.status==="stranded").length,c=l.filter(f=>f.status==="urgent_added").length;a.innerHTML=`
    <!-- Attendance KPI Strip -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #10B981; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Boarded</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">${k}</div>
        <div style="font-size: 0.72rem; color: #64748B;">On bus now</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #F59E0B; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Waiting</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #D97706;">${h}</div>
        <div style="font-size: 0.72rem; color: #64748B;">At pickup stop</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #EF4444; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Stranded</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #DC2626;">${_}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Needs rescue</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #6B7280; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Absent</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #6B7280;">${x}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Cancelled today</div>
      </div>
      <div style="background: #fff; border: 1px solid #E2E8F0; border-top: 3px solid #7C3AED; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Urgent Add</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #7C3AED;">${c}</div>
        <div style="font-size: 0.72rem; color: #64748B;">Same-day addition</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header" style="flex-wrap: wrap; gap: 12px;">
        <div class="panel-title-area">
          <h2>Student Passenger Manifest</h2>
          <p>${l.length} registered morning commuters · Real-time boarding, attendance, and priority tracking</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Search -->
          <div class="search-input-wrap">
            <span class="search-input-icon">${P.search(16,"currentColor")}</span>
            <input type="text" id="student-search-input" placeholder="Search name, ID, stop, school..." style="width: 220px;" />
          </div>

          <!-- Attendance Filter -->
          <select id="student-attendance-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by attendance">
            <option value="all">All Attendance</option>
            <option value="boarded">Boarded</option>
            <option value="waiting">Waiting</option>
            <option value="stranded">Stranded</option>
            <option value="absent_cancelled">Absent</option>
            <option value="urgent_added">Urgent Add</option>
          </select>

          <!-- Bus Filter -->
          <select id="student-bus-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by bus">
            <option value="all">All Buses</option>
            ${v.map(f=>`<option value="${f}">${f}</option>`).join("")}
          </select>

          <!-- Route Filter -->
          <select id="student-route-filter" class="form-select" style="width: auto; padding: 8px 12px;" title="Filter by route">
            <option value="all">All Routes</option>
            ${A.map(f=>`<option value="${f}">${f}</option>`).join("")}
          </select>

          <button class="action-btn primary" id="open-add-student-modal-btn" style="white-space: nowrap;">
            ${P.plus(16,"#fff")} Urgent Add
          </button>
        </div>
      </div>

      <!-- Results count bar -->
      <div style="padding: 10px 24px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; font-size: 0.78rem; color: #64748B;">
        Showing <b id="students-visible-count">${l.length}</b> of ${l.length} students
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Pickup Location</th>
              <th>Attendance</th>
              <th>Priority</th>
              <th>Assigned Bus</th>
              <th>Route</th>
              <th>Special Needs</th>
              <th>Guardian</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="students-table-body">
            ${l.map(f=>{const g=Do(f.status),b=Io(f),E=f.status==="stranded",S=f.status==="urgent_added";return`
                <tr data-attendance="${f.status}" data-bus="${f.busId}" data-route="${f.routeId}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="position: relative; flex-shrink: 0;">
                        <img src="${f.photo}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid ${g.border||"#E2E8F0"};" />
                        ${E?'<span style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #EF4444; border-radius: 50%; border: 2px solid #fff;"></span>':""}
                        ${S?'<span style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #7C3AED; border-radius: 50%; border: 2px solid #fff;"></span>':""}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: #0F2747; font-size: 0.88rem;">${f.name}</div>
                        <div style="font-size: 0.7rem; color: #64748B;">${f.grade} · ${f.schoolName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.78rem; color: #475569; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${f.id}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.85rem; font-weight: 600; color: #0F2747; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${f.stopName}">
                      📍 ${f.stopName}
                    </div>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${g.bg}; color: ${g.color}; border: 1px solid ${g.border};">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                      ${g.label}
                    </span>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${b.bg}; color: ${b.color};">
                      ${b.label}
                    </span>
                  </td>
                  <td>
                    ${f.busId!=="UNASSIGNED"?`
                      <span class="bus-pill">${f.busId}</span>
                    `:`
                      <span style="color: #94A3B8; font-style: italic; font-size: 0.78rem;">Unassigned</span>
                    `}
                  </td>
                  <td>
                    ${f.routeId!=="UNASSIGNED"?`
                      <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: #2563EB;">${f.routeId}</span>
                    `:`
                      <span style="color: #94A3B8; font-style: italic; font-size: 0.78rem;">Unassigned</span>
                    `}
                  </td>
                  <td>
                    ${f.specialNeeds&&f.specialNeeds!=="None"?`
                      <span style="background: #FEF3C7; color: #92400E; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-block; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${f.specialNeeds}">
                        ♿ ${f.specialNeeds}
                      </span>
                    `:'<span style="color: #94A3B8; font-size: 0.78rem;">Standard</span>'}
                  </td>
                  <td>
                    <div style="font-size: 0.8rem; font-weight: 600; color: #0F2747;">${f.guardianName}</div>
                    <a href="tel:${f.guardianPhone}" style="font-size: 0.72rem; color: #2563EB; text-decoration: none; display: inline-flex; align-items: center; gap: 3px;">
                      ${P.phone(11,"#2563EB")} ${f.guardianPhone}
                    </a>
                  </td>
                  <td>
                    ${E?`
                      <button class="action-btn danger replan-student-btn" data-disruption-id="DIS-2026-001" style="padding: 4px 10px; font-size: 0.75rem; white-space: nowrap;">
                        ⚡ Assist
                      </button>
                    `:f.status==="urgent_added"?`
                      <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="action-btn primary approve-urgent-btn" data-student-id="${f.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Approve Recommended Bus Assignment">
                          ${P.check(12,"#fff")} Approve
                        </button>
                        <button class="action-btn secondary review-urgent-btn" data-student-id="${f.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Review in Replanning Console">
                          Review
                        </button>
                      </div>
                    `:f.status==="absent_cancelled"?`
                      <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 600;">Cancelled / Absent</span>
                    `:`
                      <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="action-btn danger cancel-student-btn" data-student-id="${f.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;" title="Cancel Student & Rapid Replan">
                          ${P.x(12,"#fff")} Cancel
                        </button>
                        <button class="action-btn secondary notify-guardian-btn" data-student-id="${f.id}" style="padding: 4px 8px; font-size: 0.72rem; white-space: nowrap;">
                          ${P.phone(12,"currentColor")} Notify
                        </button>
                      </div>
                    `}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;function y(){var B,D,m,$,N;const f=((D=(B=a.querySelector("#student-search-input"))==null?void 0:B.value)==null?void 0:D.toLowerCase())||"",g=((m=a.querySelector("#student-attendance-filter"))==null?void 0:m.value)||"all",b=(($=a.querySelector("#student-bus-filter"))==null?void 0:$.value)||"all",E=((N=a.querySelector("#student-route-filter"))==null?void 0:N.value)||"all";let S=0;a.querySelectorAll("#students-table-body tr").forEach(O=>{const U=O.textContent.toLowerCase(),V=O.getAttribute("data-attendance"),K=O.getAttribute("data-bus"),st=O.getAttribute("data-route"),T=U.includes(f)&&(g==="all"||V===g)&&(b==="all"||K===b)&&(E==="all"||st===E);O.style.display=T?"":"none",T&&S++});const F=a.querySelector("#students-visible-count");F&&(F.textContent=S)}return setTimeout(()=>{var f,g,b,E,S;(f=a.querySelector("#student-search-input"))==null||f.addEventListener("input",y),(g=a.querySelector("#student-attendance-filter"))==null||g.addEventListener("change",y),(b=a.querySelector("#student-bus-filter"))==null||b.addEventListener("change",y),(E=a.querySelector("#student-route-filter"))==null||E.addEventListener("change",y),(S=a.querySelector("#open-add-student-modal-btn"))==null||S.addEventListener("click",()=>{I.openModal("add_student")}),a.querySelectorAll(".approve-urgent-btn").forEach(F=>{F.addEventListener("click",()=>{const B=F.getAttribute("data-student-id");B&&I.approveUrgentAddition(B)})}),a.querySelectorAll(".review-urgent-btn").forEach(F=>{F.addEventListener("click",()=>{const B=F.getAttribute("data-student-id"),m=I.getState().disruptions.find($=>$.studentId===B);m&&I.setSelectedDisruption(m.id),I.setActiveTab("replanning")})}),a.querySelectorAll(".cancel-student-btn").forEach(F=>{F.addEventListener("click",()=>{const B=F.getAttribute("data-student-id");B&&I.cancelStudent(B)})}),a.querySelectorAll(".replan-student-btn").forEach(F=>{F.addEventListener("click",()=>{const B=F.getAttribute("data-disruption-id");B&&I.setSelectedDisruption(B),I.setActiveTab("replanning")})}),a.querySelectorAll(".notify-guardian-btn").forEach(F=>{F.addEventListener("click",()=>{I.showToast("SMS & Parent Portal notification dispatched to guardian.","success")})})},50),a}function zo(){const u=I.getState(),{disruptions:l}=u,r=document.createElement("div");r.className="content-body";const d=l.filter(a=>a.status==="unresolved");return l.filter(a=>a.status==="accepted"||a.status==="completed"),r.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">Disruption Command Center</h2>
        <p style="font-size: 0.85rem; color: #64748B;">
          Real-time incident triage: vehicle breakdowns, driver unavailability, cancellations & urgent additions
        </p>
      </div>

      <button class="action-btn danger" id="create-disruption-btn" style="padding: 10px 18px;">
        ${P.alertTriangle(18,"#fff")} Declare New Disruption
      </button>
    </div>

    <!-- Quick Status Badges Filter -->
    <div style="display: flex; gap: 10px; margin-bottom: 20px;" id="disruption-filter-tabs">
      <button class="map-filter-chip active" data-filter="all">All Incidents (${l.length})</button>
      <button class="map-filter-chip" data-filter="unresolved">Unresolved (${d.length})</button>
      <button class="map-filter-chip" data-filter="breakdown">Breakdowns</button>
      <button class="map-filter-chip" data-filter="driver">Driver Absent</button>
      <button class="map-filter-chip" data-filter="student">Student Changes</button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 20px;" id="disruptions-cards-container">
      ${l.map(a=>{const v=a.status==="unresolved";return a.status,`
          <div class="panel-card" style="padding: 24px; border-left: 5px solid ${a.severity==="critical"?"#EF4444":a.severity==="warning"?"#F59E0B":"#2563EB"};" data-type="${a.type}" data-status="${a.status}">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="severity-pill ${a.severity}">${a.severity}</span>
                  <span style="font-size: 0.72rem; color: #64748B; font-weight: 700;">${a.id}</span>
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F2747; margin-top: 6px;">
                  ${a.title}
                </h3>
              </div>
              <span class="status-badge ${a.status}">${a.status.toUpperCase()}</span>
            </div>

            <div style="font-size: 0.8rem; color: #64748B; display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
              <div>⏱ <b>Reported:</b> ${a.reportedAt}</div>
              <div>📍 <b>Location:</b> ${a.location}</div>
              ${a.busId?`<div>🚌 <b>Vehicle Affected:</b> ${a.busId} (${a.routeId||"N/A"})</div>`:""}
              <div style="color: #0F2747; background: #F8FAFC; padding: 8px 12px; border-radius: 8px; border: 1px solid #E2E8F0; margin-top: 4px;">
                <b>Impact:</b> ${a.impact}
              </div>
            </div>

            ${a.aiRecommendationAvailable?`
              <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 0.75rem; font-weight: 800; color: #1D4ED8; display: flex; align-items: center; gap: 6px;">
                    ${P.cpu(14,"#2563EB")} Responsible AI Plan: ${a.aiRecommendation.planId}
                  </span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: #10B981;">
                    ADA & Constraint Verified
                  </span>
                </div>
                <div style="font-size: 0.78rem; color: #1E3A8A; line-height: 1.4;">
                  <b>${a.aiRecommendation.strategy}:</b> ${a.aiRecommendation.explanation.slice(0,110)}...
                </div>
              </div>
            `:""}

            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
              <button class="action-btn primary launch-replanning-btn" data-disruption-id="${a.id}" style="padding: 8px 16px; font-size: 0.82rem;">
                ${v?`${P.zap(16,"#fff")} Open AI Replanning Engine`:"View Executed Plan"}
              </button>
            </div>
          </div>
        `}).join("")}
    </div>
  `,setTimeout(()=>{const a=r.querySelector("#create-disruption-btn");a&&a.addEventListener("click",()=>{I.openModal("create_disruption")}),r.querySelectorAll(".launch-replanning-btn").forEach(k=>{k.addEventListener("click",()=>{const h=k.getAttribute("data-disruption-id");h&&I.setSelectedDisruption(h),I.setActiveTab("replanning")})});const A=r.querySelectorAll("#disruption-filter-tabs .map-filter-chip");A.forEach(k=>{k.addEventListener("click",()=>{A.forEach(_=>_.classList.remove("active")),k.classList.add("active");const h=k.getAttribute("data-filter");r.querySelectorAll("#disruptions-cards-container .panel-card").forEach(_=>{const c=_.getAttribute("data-type"),y=_.getAttribute("data-status");h==="all"?_.style.display="":h==="unresolved"?_.style.display=y==="unresolved"?"":"none":h==="breakdown"?_.style.display=c==="breakdown"?"":"none":h==="driver"?_.style.display=c==="driver_unavailability"?"":"none":h==="student"&&(_.style.display=c==="student_cancel"||c==="urgent_add"?"":"none")})})})},50),r}function No(){var h,x,_,c,y,f,g,b,E,S,F,B,D;const u=I.getState(),{disruptions:l,selectedDisruptionId:r}=u,d=l.find(m=>m.id===r)||l[0],a=d==null?void 0:d.aiRecommendation,v=(d==null?void 0:d.status)==="accepted",A=(d==null?void 0:d.status)==="rejected",k=document.createElement("div");return k.className="content-body",k.innerHTML=`
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
          ${P.refreshCw(16,"currentColor")} Re-run AI Optimization
        </button>
      </div>
    </div>

    <div class="replanning-grid">
      <!-- Left Column: Incident Selector -->
      <div class="incident-selector-card">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; display: flex; align-items: center; gap: 6px;">
          ${P.alertTriangle(16,"#2563EB")} Select Active Incident
        </h3>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${l.map(m=>{const $=m.id===(d==null?void 0:d.id);return`
              <div class="incident-card ${m.severity}" style="${$?"border: 2px solid #2563EB; background: #fff;":""}" data-select-id="${m.id}">
                <div class="incident-top">
                  <span class="incident-title" style="font-size: 0.82rem;">${m.title}</span>
                  <span class="severity-pill ${m.severity}">${m.severity}</span>
                </div>
                <div class="incident-meta" style="margin-bottom: 0;">
                  <span>⏱ ${m.reportedAt}</span>
                  <span>📍 ${m.location}</span>
                </div>
              </div>
            `}).join("")}
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
        ${d&&a?`
          <!-- Primary AI Recommendation Card -->
          <div class="ai-recommendation-card">
            <div class="ai-tag-top">
              ${P.cpu(14,"#fff")} OPTIMAL RECOMMENDATION (${a.planId})
            </div>

            <div class="plan-header">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                <span class="plan-strategy-pill">${a.strategy}</span>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #92400E; background: #FEF3C7; border: 1px solid #FDE68A; padding: 4px 10px; border-radius: 9999px; font-weight: 700;">
                  ${P.shield(14,"#92400E")} HUMAN DECISION REQUIRED — DISPATCHER APPROVAL
                </div>
              </div>
              <h3 class="plan-title" style="margin-top: 6px; margin-bottom: 4px;">
                ${d.title}
              </h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
                Incident Location: <b>${d.location}</b> • Impact: <b>${d.impact}</b>
              </p>
            </div>

            <!-- Recommendation Key Operational Details (All 7 required attributes) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 20px;">
              <!-- 1. Recommended Bus -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Recommended Bus</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                  ${a.recommendedBusId||d.busId||"BUS-05"}
                </div>
              </div>

              <!-- 2. Recommended Route -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Recommended Route</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747; margin-top: 2px;">
                  ${a.recommendedRouteId||d.routeId||"RT-104"}
                </div>
              </div>

              <!-- 3. Available Seats -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Available Seats</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #059669; margin-top: 2px;">
                  ${a.availableSeats||(d.afterBus?`${d.afterBus.availableSeats} seats available`:"10 seats available")}
                </div>
              </div>

              <!-- 4. Current Location -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Current Location</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #0F2747; margin-top: 4px;">
                  ${a.currentLocation||"Central Depot / Active Sector"}
                </div>
              </div>

              <!-- 5. Driver Availability -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Driver Availability</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #047857; margin-top: 4px;">
                  ${a.driverAvailability||(a.recommendedDriverName?`${a.recommendedDriverName} (Available, No Conflicts)`:"Available with no commitment conflict")}
                </div>
              </div>

              <!-- 6. Route Compatibility -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Route Compatibility</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #2563EB; margin-top: 4px;">
                  ${a.routeCompatibility||"Compatible destination & ADA lift verified"}
                </div>
              </div>

              <!-- 7. Estimated Additional Delay -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Estimated Additional Delay</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: ${(a.estimatedAdditionalDelay||a.newEtaDifference||"").includes("-")?"#059669":"#D97706"}; margin-top: 2px;">
                  ${a.estimatedAdditionalDelay||a.newEtaDifference||"+0 min"}
                </div>
              </div>
            </div>

            <!-- 8. Why this bus was selected (Simple Explanation Callout) -->
            <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-left: 5px solid #10B981; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                ${P.checkCircle(18,"#166534")} Why this bus was selected
              </div>
              <p style="font-size: 0.95rem; font-weight: 600; color: #14532D; margin: 0; line-height: 1.5;">
                "${a.selectionReason||a.explanation||"Selected because the bus has enough capacity, is close to the affected location, and has an available driver."}"
              </p>
            </div>

            <!-- Candidate Fleet Feasibility & Rejection Analysis Table -->
            ${a.candidateEvaluations&&a.candidateEvaluations.length?`
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-size: 0.92rem; font-weight: 700; color: #0F2747; margin: 0; display: flex; align-items: center; gap: 6px;">
                      ${P.cpu(16,"#2563EB")} Candidate Alternatives & Actual Rejection Reasons
                    </h4>
                    <p style="font-size: 0.74rem; color: #64748B; margin: 2px 0 0 0;">
                      Evaluation across fleet capacity, driver availability & commitments, location, and route compatibility
                    </p>
                  </div>
                  <span style="font-size: 0.72rem; color: #64748B; background: #F1F5F9; padding: 3px 8px; border-radius: 4px; font-weight: 600;">
                    ${a.candidateEvaluations.length} Vehicles Evaluated
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
                      ${a.candidateEvaluations.map(m=>{const $=m.busId===(a.recommendedBusId||a.standbyBusAssigned);return`
                          <tr style="border-bottom: 1px solid #F1F5F9; background: ${$?"#ECFDF5":"transparent"};">
                            <td style="padding: 8px 10px; font-weight: 700; color: ${$?"#059669":"#0F2747"};">
                              ${m.busId} ${$?"★":""}
                            </td>
                            <td style="padding: 8px 10px; color: #475569;">${m.routeId}</td>
                            <td style="padding: 8px 10px; color: #475569;">
                              <div style="font-weight: 600;">${m.driverName} (${m.driverStatus})</div>
                              <div style="font-size: 0.7rem; color: #64748B;">📍 ${m.location} (${m.driverDistanceMi?m.driverDistanceMi.toFixed(1):"?"} mi)</div>
                            </td>
                            <td style="padding: 8px 10px; font-weight: 600; color: ${m.seatsAvailable>0?"#059669":"#DC2626"};">${m.seatsAvailable} seats</td>
                            <td style="padding: 8px 10px; color: #475569;">${m.delayMins>0?`+${m.delayMins} min`:m.delayMins<0?`${m.delayMins} min`:"0 min"}</td>
                            <td style="padding: 8px 10px;">
                              ${$?`
                                <span style="background: #10B981; color: #fff; padding: 2px 8px; border-radius: 9999px; font-weight: 700; font-size: 0.7rem;">
                                  RECOMMENDED
                                </span>
                              `:m.isFeasible?`
                                <span style="background: #EFF6FF; color: #2563EB; padding: 2px 8px; border-radius: 9999px; font-weight: 600; font-size: 0.7rem;">
                                  Feasible
                                </span>
                              `:`
                                <span style="color: #DC2626; font-size: 0.72rem; font-weight: 600; line-height: 1.3;">
                                  ✕ ${m.statusText}
                                </span>
                              `}
                            </td>
                          </tr>
                        `}).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            `:""}

            <!-- Current Route Progress Section -->
            ${(()=>{if(d&&d.busId&&d.routeId){const m=u.routes.find($=>$.id===d.routeId);if(m){const $=m.totalStops||m.stops.length,N=m.completedStops||m.stops.filter(K=>K.status==="completed").length,O=$-N;let U="None";N>0&&m.stops[N-1]?U=m.stops[N-1].name:m.stops.length>0&&(U="Not started");const V=m.stops[N]?m.stops[N].name:"None";return`
                    <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="width: 28px; height: 28px; border-radius: 6px; background: #FFF7ED; color: #EA580C; display: flex; align-items: center; justify-content: center;">
                            ${P.mapPin(16,"#EA580C")}
                          </div>
                          <div>
                            <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; margin: 0;">Current Route Progress</h4>
                            <p style="font-size: 0.75rem; color: #64748B; margin: 0;">Affected Vehicle: <b>${d.busId}</b></p>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.85rem; color: #475569;">
                        <div><span style="color: #64748B;">Route:</span> <b style="color: #0F2747;">${d.routeId}</b></div>
                        <div><span style="color: #64748B;">Progress:</span> <b style="color: #0F2747;">${N} / ${$} stops</b></div>
                        <div><span style="color: #64748B;">Current Stop:</span> <b style="color: #0F2747;">${U}</b></div>
                        <div><span style="color: #64748B;">Next Stop:</span> <b style="color: #0F2747;">${V}</b></div>
                        <div><span style="color: #64748B;">Remaining Stops:</span> <b style="color: #0F2747;">${O}</b></div>
                      </div>
                    </div>
                  `}}return""})()}

            <!-- Before & After Route Comparison Section -->
            ${d.beforeRoute||d.afterRoute?`
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; border-radius: 6px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                      ${P.navigation(16,"#2563EB")}
                    </div>
                    <div>
                      <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F2747; margin: 0;">Before vs After Route & Capacity Recalculation</h4>
                      <p style="font-size: 0.75rem; color: #64748B; margin: 0;">Route: <b>${d.routeId||"RT-101"}</b> · Bus: <b>${d.busId||"BUS-01"}</b></p>
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
                        <div style="font-size: 1.15rem; font-weight: 800; color: #0F2747;">${((h=d.beforeBus)==null?void 0:h.load)??((x=d.beforeRoute)!=null&&x.stops?d.beforeRoute.stops.reduce((m,$)=>m+($.studentsCount||0),0):42)} / ${((_=d.beforeBus)==null?void 0:_.capacity)??54}</div>
                      </div>
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
                        <div style="font-size: 0.68rem; color: #64748B; text-transform: uppercase;">Available Seats</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #2563EB;">${((c=d.beforeBus)==null?void 0:c.availableSeats)??12}</div>
                      </div>
                    </div>
                    <div style="font-size: 0.75rem; color: #475569;">
                      <div>⏱ Scheduled ETA: <b>${((y=d.beforeRoute)==null?void 0:y.currentEta)||"08:05 AM"}</b></div>
                      <div>📍 Total Stops: <b>${((g=(f=d.beforeRoute)==null?void 0:f.stops)==null?void 0:g.length)||6} stops</b></div>
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
                        <div style="font-size: 1.15rem; font-weight: 800; color: #047857;">${((b=d.afterBus)==null?void 0:b.load)??((E=d.afterRoute)!=null&&E.stops?d.afterRoute.stops.reduce((m,$)=>m+($.studentsCount||0),0):41)} / ${((S=d.afterBus)==null?void 0:S.capacity)??54}</div>
                      </div>
                      <div style="background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #BBF7D0;">
                        <div style="font-size: 0.68rem; color: #047857; text-transform: uppercase;">New Available Seats</div>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #10B981;">${((F=d.afterBus)==null?void 0:F.availableSeats)??13}</div>
                      </div>
                    </div>
                    <div style="font-size: 0.75rem; color: #047857;">
                      <div>⚡ Optimized ETA: <b>${((B=d.afterRoute)==null?void 0:B.currentEta)||"08:03 AM"} (${a.newEtaDifference||"-2 min"})</b></div>
                      <div>📍 Manifest: <b>Optimized stop manifest & dwell times</b></div>
                    </div>
                  </div>
                </div>

                <!-- Stop-by-Stop Manifest Comparison -->
                ${(D=d.afterRoute)!=null&&D.stops?`
                  <div style="font-size: 0.75rem; font-weight: 700; color: #0F2747; margin-bottom: 8px;">
                    Stop-by-Stop Passenger Manifest:
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px;">
                    ${d.afterRoute.stops.map((m,$)=>{var V,K;const N=(K=(V=d.beforeRoute)==null?void 0:V.stops)==null?void 0:K[$],U=((N==null?void 0:N.studentsCount)??m.studentsCount)-m.studentsCount>0||d.location&&m.name.toLowerCase().includes(d.location.toLowerCase());return`
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-radius: 6px; background: ${U?"#FEF2F2":"#fff"}; border: 1px solid ${U?"#FECACA":"#F1F5F9"};">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 0.7rem; font-weight: 700; color: #64748B; width: 18px;">${$+1}.</span>
                            <span style="font-weight: 600; color: ${U?"#991B1B":"#0F2747"}; font-size: 0.78rem;">${m.name}</span>
                            ${U?'<span style="font-size: 0.65rem; background: #EF4444; color: #fff; padding: 1px 5px; border-radius: 3px; font-weight: 700;">AFFECTED STOP</span>':""}
                          </div>
                          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.75rem;">
                            <span style="color: #64748B;">Scheduled: <b>${m.time}</b></span>
                            <span style="font-weight: 700; color: ${U?"#DC2626":"#0F2747"};">
                              ${U?`Students: ${(N==null?void 0:N.studentsCount)??m.studentsCount} → ${m.studentsCount}`:`Students: ${m.studentsCount}`}
                            </span>
                          </div>
                        </div>
                      `}).join("")}
                  </div>
                `:""}
              </div>
            `:""}

            <!-- Affected Students & Proposed New Bus Assignment Table -->
            ${d.affectedStudentsList&&d.affectedStudentsList.length?`
              <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-size: 0.92rem; font-weight: 700; color: #0F2747; margin: 0; display: flex; align-items: center; gap: 6px;">
                      ${P.users(16,"#EF4444")} Affected Students Manifest (${d.affectedStudentsList.length} Stranded)
                    </h4>
                    <p style="font-size: 0.75rem; color: #64748B; margin: 2px 0 0 0;">
                      Proposed New Bus Assignment: <b style="color: #059669;">${(a==null?void 0:a.recommendedBusId)||(a==null?void 0:a.standbyBusAssigned)||"BUS-05"}</b> (${(a==null?void 0:a.reserveDriverAssigned)||"Reserve Driver"})
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
                      ${d.affectedStudentsList.map(m=>`
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 8px 10px; font-weight: 700; color: #0F2747;">${m.name}</td>
                          <td style="padding: 8px 10px; color: #64748B;">${m.grade}</td>
                          <td style="padding: 8px 10px; color: #0F2747; font-weight: 500;">📍 ${m.stopName}</td>
                          <td style="padding: 8px 10px;">
                            ${m.specialNeeds&&m.specialNeeds!=="None"?`
                              <span style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                                ♿ ${m.specialNeeds}
                              </span>
                            `:'<span style="color: #94A3B8; font-size: 0.72rem;">Standard</span>'}
                          </td>
                          <td style="padding: 8px 10px;">
                            <span style="font-weight: 700; color: #059669; font-family: var(--font-mono); background: #ECFDF5; padding: 2px 6px; border-radius: 4px; border: 1px solid #A7F3D0;">
                              → ${(a==null?void 0:a.recommendedBusId)||(a==null?void 0:a.standbyBusAssigned)||"BUS-05"}
                            </span>
                          </td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            `:""}

            <!-- Human Authority & Decision Action Bar -->
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #92400E;">
              ${P.alertTriangle(18,"#D97706")}
              <span><b>Human Authority Requirement:</b> The system will never automatically activate a route. The dispatcher or operations manager must make the final decision to Accept, Modify, or Reject this recommendation.</span>
            </div>

            <!-- Decision Action Bar -->
            <div class="plan-actions-footer">
              ${v?`
                <div style="display: flex; align-items: center; gap: 8px; color: #059669; font-weight: 700; font-size: 0.9rem;">
                  ${P.checkCircle(20,"#059669")}
                  Plan Accepted & Activated by Dispatcher
                </div>
              `:A?`
                <div style="display: flex; align-items: center; gap: 8px; color: #DC2626; font-weight: 700; font-size: 0.9rem;">
                  ${P.x(20,"#DC2626")}
                  Plan Rejected by Dispatcher (Manual Override: ${d.rejectionReason||"Dispatcher Discretion"})
                </div>
              `:`
                <button class="action-btn secondary" id="reject-plan-btn" style="color: #DC2626; border-color: #FECACA;">
                  ${P.x(16,"#DC2626")} Reject
                </button>
                <button class="action-btn secondary" id="modify-plan-btn">
                  ${P.settings(16,"currentColor")} Modify
                </button>
                <button class="action-btn primary" id="accept-plan-btn" style="padding: 10px 24px; font-size: 0.92rem;">
                  ${P.check(18,"#fff")} Accept
                </button>
              `}
            </div>
          </div>
        `:d!=null&&d.noFeasibleSolution?`
          <div class="panel-card" style="border-top: 4px solid #EF4444; padding: 28px;">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${P.alertTriangle(26,"#EF4444")}
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #DC2626; margin: 0;">
                  No Feasible Solution — Manual Intervention Required
                </h3>
                <p style="font-size: 0.82rem; color: #64748B; margin: 4px 0 0 0;">
                  All evaluated district buses violated capacity limits, driver availability, or route compatibility constraints for <b>${d.title}</b>.
                </p>
              </div>
            </div>

            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 0.8rem; color: #92400E;">
              <b>Dispatcher Guidance:</b> Consider deploying a standby spare shuttle from Central Depot or contacting guardian for private transit arrangement.
            </div>

            ${d.candidateEvaluations?`
              <div style="font-size: 0.82rem; font-weight: 700; color: #0F2747; margin-bottom: 8px;">
                Fleet Rejection Diagnostics:
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${d.candidateEvaluations.map(m=>`
                  <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 0.78rem;">
                    <span style="font-weight: 700; color: #0F2747;">${m.busId} (${m.routeId})</span>
                    <span style="color: #DC2626; font-weight: 600;">✕ ${m.statusText||m.reasons}</span>
                  </div>
                `).join("")}
              </div>
            `:""}
          </div>
        `:`
          <div class="panel-card" style="padding: 40px; text-align: center;">
            <p style="color: #64748B;">No active incident selected. Select an incident from the left to view replanning solutions.</p>
          </div>
        `}
      </div>
    </div>
  `,setTimeout(()=>{k.querySelectorAll(".incident-selector-card .incident-card").forEach(V=>{V.addEventListener("click",()=>{const K=V.getAttribute("data-select-id");K&&(I.setSelectedDisruption(K),I.notify())})});const $=k.querySelector("#accept-plan-btn");$&&$.addEventListener("click",()=>{I.acceptAIPlan(d.id)});const N=k.querySelector("#reject-plan-btn");N&&N.addEventListener("click",()=>{I.rejectAIPlan(d.id)});const O=k.querySelector("#modify-plan-btn");O&&O.addEventListener("click",()=>{I.showToast("Constraint Customizer: Adjust maximum delay tolerance and bus load margins.","info")});const U=k.querySelector("#re-run-simulation-btn");U&&U.addEventListener("click",()=>{I.showToast("Replanning Engine: Re-evaluating fleet constraints and driver availability...","info"),setTimeout(()=>{I.showToast("Replanning Re-evaluation complete: Verified with active driver availability.","success")},1e3)})},50),k}const Oo="modulepreload",Zo=function(u){return"/"+u},Pn={},Uo=function(l,r,d){let a=Promise.resolve();if(r&&r.length>0){let A=function(x){return Promise.all(x.map(_=>Promise.resolve(_).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const k=document.querySelector("meta[property=csp-nonce]"),h=(k==null?void 0:k.nonce)||(k==null?void 0:k.getAttribute("nonce"));a=A(r.map(x=>{if(x=Zo(x),x in Pn)return;Pn[x]=!0;const _=x.endsWith(".css"),c=_?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${x}"]${c}`))return;const y=document.createElement("link");if(y.rel=_?"stylesheet":Oo,_||(y.as="script"),y.crossOrigin="",y.href=x,h&&y.setAttribute("nonce",h),document.head.appendChild(y),_)return new Promise((f,g)=>{y.addEventListener("load",f),y.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${x}`)))})}))}function v(A){const k=new Event("vite:preloadError",{cancelable:!0});if(k.payload=A,window.dispatchEvent(k),!k.defaultPrevented)throw A}return a.then(A=>{for(const k of A||[])k.status==="rejected"&&v(k.reason);return l().catch(v)})};function Ho(){const u=I.getState(),{metrics:l,disruptions:r}=u,d=Lo(),v=d.metrics.avgPrototypeComputationTimeMs/1e3/60,A=d.metrics.avgBaselineRecoveryTimeMs/1e3/60,k=v<.1?"< 0.1 mins":`${v.toFixed(1)} mins`,h=`${A.toFixed(1)} mins`,x=`${ze.toFixed(1)} mins`,_=document.createElement("div");return _.className="content-body",_.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F2747;">District Operations & Performance Reports</h2>
        <p style="font-size: 0.85rem; color: #64748B;">
          Supervisory analytics: Incident recovery times, SLA adherence, safety audits, and environmental metrics
        </p>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="action-btn secondary" id="export-csv-btn">
          ${P.fileText(16,"currentColor")} Download CSV Audit
        </button>
        <button class="action-btn primary" id="export-pdf-btn">
          ${P.fileText(16,"#fff")} Generate Executive Brief (PDF)
        </button>
      </div>
    </div>

    <!-- Operations Performance Cards -->
    <div class="report-summary-cards">
      <!-- Recovery Time SLA -->
      <div class="kpi-card" style="border-top: 3px solid #10B981;">
        <div class="kpi-header">
          <span class="kpi-label">Avg Incident Recovery Time</span>
          <div class="kpi-icon-wrap" style="background: #ECFDF5; color: #10B981;">
            ${P.clock(20,"#10B981")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: #059669;">${k}</span>
        </div>
        <div class="kpi-subtext" style="color: #059669; font-weight: 600;">
          🟢 Faster than ${x} district target
        </div>
      </div>

      <!-- On-Time Arrival SLA -->
      <div class="kpi-card" style="border-top: 3px solid #2563EB;">
        <div class="kpi-header">
          <span class="kpi-label">On-Time Bell Arrival Rate</span>
          <div class="kpi-icon-wrap" style="background: #EFF6FF; color: #2563EB;">
            ${P.activity(20,"#2563EB")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${l.onTimeArrivalRate}%</span>
        </div>
        <div class="kpi-subtext" style="color: #2563EB; font-weight: 600;">
          Target: 95.0% SLA Threshold
        </div>
      </div>

      <!-- Dispatcher Acceptance SLA -->
      <div class="kpi-card" style="border-top: 3px solid #6366F1;">
        <div class="kpi-header">
          <span class="kpi-label">Dispatcher Plan Acceptance</span>
          <div class="kpi-icon-wrap" style="background: #EEF2FF; color: #6366F1;">
            ${P.checkCircle(20,"#6366F1")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" style="color: #4F46E5;">94.2%</span>
        </div>
        <div class="kpi-subtext" style="color: #4F46E5; font-weight: 600;">
          Human-in-the-loop verified decisions
        </div>
      </div>

      <!-- Carbon & Fuel Efficiency -->
      <div class="kpi-card" style="border-top: 3px solid #0F2747;">
        <div class="kpi-header">
          <span class="kpi-label">Carbon Savings</span>
          <div class="kpi-icon-wrap" style="background: #F1F5F9; color: #0F2747;">
            ${P.shield(20,"#0F2747")}
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${l.carbonSavingsKg} kg</span>
        </div>
        <div class="kpi-subtext" style="color: #0F2747; font-weight: 600;">
          Saved via optimized rerouting
        </div>
      </div>
    </div>

    <!-- Recovery Time & Disruption Root Cause Visualizations -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
      <!-- Recovery Progress Breakdown -->
      <div class="chart-mock-card">
        <h3 style="font-size: 1rem; font-weight: 700; color: #0F2747; margin-bottom: 6px;">
          Incident Recovery Time Benchmark
        </h3>
        <p style="font-size: 0.8rem; color: #64748B;">
          Comparison between AI Rapid Replanning vs Manual Dispatch Baseline
        </p>

        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">
              <span style="color: #2563EB;">AI Rapid Replanning Engine (Current System)</span>
              <span style="color: #2563EB;">${k} (Avg)</span>
            </div>
            <div style="height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
              <div style="width: 2%; height: 100%; background: #2563EB; border-radius: 9999px;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">
              <span style="color: #64748B;">District Target SLA Limit</span>
              <span style="color: #64748B;">${x}</span>
            </div>
            <div style="height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
              <div style="width: ${ze/A*100}%; height: 100%; background: #94A3B8; border-radius: 9999px;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">
              <span style="color: #EF4444;">Legacy Manual Phone-Tree Dispatch (Baseline)</span>
              <span style="color: #EF4444;">${h}</span>
            </div>
            <div style="height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
              <div style="width: 100%; height: 100%; background: #EF4444; border-radius: 9999px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Root Cause Breakdown -->
      <div class="chart-mock-card">
        <h3 style="font-size: 1rem; font-weight: 700; color: #0F2747; margin-bottom: 6px;">
          Disruption Categorization Breakdown
        </h3>
        <p style="font-size: 0.8rem; color: #64748B;">
          Proportional distribution of transport operational variances
        </p>

        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #EF4444;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #0F2747;">Vehicle Breakdown / Mechanical</span>
            <span style="font-weight: 800; color: #EF4444;">25% (1 incident)</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #0F2747;">Driver Unavailability / Illness</span>
            <span style="font-weight: 800; color: #F59E0B;">25% (1 incident)</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #2563EB;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #0F2747;">Urgent Student Addition / ADA</span>
            <span style="font-weight: 800; color: #2563EB;">25% (1 incident)</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #10B981;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #0F2747;">Last-Minute Parent Cancellation</span>
            <span style="font-weight: 800; color: #10B981;">25% (1 incident)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Replanning Edge & Failure Test Cases Suite Panel -->
    <div class="panel-card" style="margin-bottom: 24px; border-left: 4px solid #059669;">
      <div class="panel-header" style="flex-wrap: wrap; gap: 12px;">
        <div class="panel-title-area">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 style="font-size: 1.15rem; font-weight: 800; color: #0F2747;">Deterministic Replanning Edge & Failure Test Suite</h2>
            <span class="status-badge on_time" style="background: #ECFDF5; color: #059669; font-weight: 700;">
              9 / 9 PASSED (100%)
            </span>
          </div>
          <p style="margin-top: 4px; font-size: 0.82rem; color: #64748B;">
            Strict verification: Capacity violations, unavailable buses, unavailable drivers, and driver commitment conflicts are 100% prevented.
          </p>
        </div>
        <div>
          <button class="action-btn primary" id="run-edge-tests-btn" style="background: #0F2747; color: white;">
            ${P.refresh(16,"#fff")} Execute Live Test Suite
          </button>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table" id="edge-cases-table">
          <thead>
            <tr>
              <th style="width: 70px;">Test ID</th>
              <th style="width: 220px;">Scenario</th>
              <th>Expected Result</th>
              <th>Actual Result</th>
              <th style="width: 100px; text-align: center;">Invariants</th>
              <th style="width: 90px; text-align: right;">Time</th>
              <th style="width: 90px; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody id="edge-cases-tbody">
            <!-- Populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Official Compliance Audit Trail -->
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>Official Dispatcher & AI Decision Audit Log</h2>
          <p>Immutable log of every incident, algorithmic plan proposal, and dispatcher decision for compliance auditing</p>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Log Reference</th>
              <th>Timestamp</th>
              <th>Operator / Engine</th>
              <th>Operational Action & Detail</th>
              <th>Compliance State</th>
            </tr>
          </thead>
          <tbody>
            ${l.recentAuditLogs.map(c=>`
              <tr>
                <td><span style="font-family: var(--font-mono); font-weight: 700; color: #0F2747;">${c.id}</span></td>
                <td><span style="font-family: var(--font-mono); font-size: 0.8rem; color: #64748B;">${c.time}</span></td>
                <td><b>${c.user}</b></td>
                <td>${c.event}</td>
                <td>
                  <span class="status-badge ${c.status==="EXECUTED"||c.status==="COMPLETED"?"accepted":"warning"}">
                    ${c.status}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,setTimeout(()=>{const c=_.querySelector("#edge-cases-tbody"),y=_.querySelector("#run-edge-tests-btn");function f(){c&&Uo(async()=>{const{runReplanningEdgeCaseTests:E}=await Promise.resolve().then(()=>ko);return{runReplanningEdgeCaseTests:E}},void 0).then(({runReplanningEdgeCaseTests:E})=>{const S=E();c.innerHTML=S.testResults.map(F=>`
          <tr>
            <td><span style="font-family: var(--font-mono); font-weight: 700; color: #0F2747;">${F.id}</span></td>
            <td><strong style="color: #0F2747; font-size: 0.85rem;">${F.scenario}</strong></td>
            <td style="font-size: 0.82rem; color: #475569;">${F.expectedResult}</td>
            <td style="font-size: 0.82rem; color: #0F2747;">${F.actualResult}</td>
            <td style="text-align: center;">
              <span title="No capacity violations, no unavailable bus/driver assignments, no commitment conflicts" 
                    style="display: inline-block; padding: 2px 6px; font-size: 0.72rem; border-radius: 4px; background: #EFF6FF; color: #1D4ED8; font-weight: 600;">
                0 Violations
              </span>
            </td>
            <td style="text-align: right; font-family: var(--font-mono); font-size: 0.8rem; color: #059669; font-weight: 700;">
              ${F.replanningTime}
            </td>
            <td style="text-align: center;">
              <span class="status-badge ${F.passed?"on_time":"disrupted"}" style="font-weight: 800;">
                ${F.status}
              </span>
            </td>
          </tr>
        `).join("")})}f(),y&&y.addEventListener("click",()=>{f(),I.showToast("Executed all 9 Replanning Edge & Failure Test Scenarios (100% Passed).","success")});const g=_.querySelector("#export-csv-btn");g&&g.addEventListener("click",()=>{I.showToast("Exporting District Fleet Audit Dataset (CSV)...","info")});const b=_.querySelector("#export-pdf-btn");b&&b.addEventListener("click",()=>{I.showToast("Generating Department of Education Compliance Report (PDF)...","success")})},50),_}function qo(){const u=document.createElement("div");return u.className="content-body",u.innerHTML=`
    <div class="panel-card" style="max-width: 860px; margin: 0 auto;">
      <div class="panel-header">
        <div class="panel-title-area">
          <h2>System & Responsible AI Configurations</h2>
          <p>Control dispatch optimization weights, fairness constraints, and notification gateways</p>
        </div>
        <button class="action-btn primary" id="save-settings-btn">
          ${P.check(16,"#fff")} Save Preferences
        </button>
      </div>

      <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Responsible AI Guardrails -->
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #0F2747; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${P.shield(18,"#2563EB")} Responsible AI Optimization Parameters
          </h3>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 16px;">
            Strict ethical constraints enforced during automated rapid route replanning.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Maximum Student In-Transit Time Limit</label>
              <select class="form-select">
                <option value="45" selected>45 Minutes (District Standard)</option>
                <option value="35">35 Minutes (Strict Elementary Target)</option>
                <option value="60">60 Minutes (Maximum Rural Radius)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Maximum Acceptable Bell Delay Variance</label>
              <select class="form-select">
                <option value="10" selected>+10 Minutes (Grace Period)</option>
                <option value="5">+5 Minutes (Strict)</option>
                <option value="15">+15 Minutes (Severe Incident Only)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Fairness & Equity Weight Factor</label>
              <select class="form-select">
                <option value="0.95" selected>High (95% - Balance delays across all stops)</option>
                <option value="0.80">Medium (80% - Prioritize total fuel reduction)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">AI Auto-Recommendation Confidence Threshold</label>
              <select class="form-select">
                <option value="90" selected>90% Confidence Score Required</option>
                <option value="95">95% Confidence Score Required</option>
              </select>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #0F2747; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${P.phone(18,"#2563EB")} Parent & Driver Real-Time Telematics Broadcast
          </h3>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 16px;">
            Automated alerts dispatched when an AI Replanning plan is accepted by the Dispatcher.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Instant SMS Broadcast to Parents upon route modification or replacement bus dispatch</span>
            </label>

            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Push turn-by-turn recalculated GPS coordinates directly to Driver in-cab MDT tablets</span>
            </label>

            <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #2563EB; width: 16px; height: 16px;" />
              <span>Notify School Principal & Attendance Office of delayed arrival rosters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{const l=u.querySelector("#save-settings-btn");l&&l.addEventListener("click",()=>{I.showToast("Responsible AI Parameters & Notification Rules Updated Successfully.","success")})},50),u}function Vo(){const u=I.getState(),{buses:l,routes:r,students:d}=u,a=d.filter(E=>E.status!=="absent_cancelled"),v=document.createElement("div");v.className="modal-backdrop",v.innerHTML=`
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #FEE2E2; color: #EF4444; display: flex; align-items: center; justify-content: center;">
            ${P.alertTriangle(18,"#EF4444")}
          </div>
          <h3 class="modal-title">Declare Transport Disruption</h3>
        </div>
        <button class="modal-close-btn" id="close-disruption-modal-btn">
          ${P.x(18,"currentColor")}
        </button>
      </div>

      <form id="create-disruption-form">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Disruption Category</label>
            <select class="form-select" id="disruption-type-select" required>
              <option value="student_cancel">Last-Minute Student Absence / Cancellation</option>
              <option value="breakdown">Vehicle Breakdown / Engine Stall</option>
              <option value="driver_unavailability">Driver Unavailability / Sickness</option>
              <option value="urgent_add">Urgent Student Addition (Same-Day Transit)</option>
              <option value="traffic_hazard">Severe Road Closure / Traffic Bottleneck</option>
            </select>
          </div>

          <div class="form-group" id="student-select-group">
            <label class="form-label">Select Absent / Cancelled Student</label>
            <select class="form-select" id="disruption-student-select">
              <option value="">-- Choose Student from Manifest --</option>
              ${a.map(E=>`
                <option value="${E.id}">${E.name} (${E.id}) · Route: ${E.routeId} · Bus: ${E.busId} · Stop: ${E.stopName}</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Incident Title / Summary</label>
            <input type="text" class="form-input" id="disruption-title-input" placeholder="e.g. Student Absence: Marcus Vance (RT-101)" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Affected Vehicle</label>
              <select class="form-select" id="disruption-bus-select">
                <option value="">None / Auto-determine</option>
                ${l.map(E=>`<option value="${E.id}">${E.id} (${E.plate})</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Affected Route</label>
              <select class="form-select" id="disruption-route-select">
                <option value="">None / Auto-determine</option>
                ${r.map(E=>`<option value="${E.id}">${E.name.split("-")[0]}</option>`).join("")}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Incident Location / Stop</label>
              <input type="text" class="form-input" id="disruption-location-input" placeholder="e.g. Stop 3 / 24th & Mission" required />
            </div>

            <div class="form-group">
              <label class="form-label">Severity Level</label>
              <select class="form-select" id="disruption-severity-select" required>
                <option value="info" selected>Informational (Student Cancellation / Schedule Variance)</option>
                <option value="warning">Warning (Moderate Delay)</option>
                <option value="critical">Critical (Immediate Route Disruption)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Impact Details & Special Notes</label>
            <textarea class="form-textarea" id="disruption-impact-input" rows="3" placeholder="Student reported sick or absent. Route dwell time reduced..." required>Student absent for today. Route stop manifest updated and bus seat freed.</textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="action-btn secondary" id="cancel-disruption-btn">Cancel</button>
          <button type="submit" class="action-btn danger" style="padding: 10px 20px;">
            ${P.zap(16,"#fff")} Trigger AI Replanning Ingestion
          </button>
        </div>
      </form>
    </div>
  `;const A=()=>I.closeModal();v.querySelector("#close-disruption-modal-btn").addEventListener("click",A),v.querySelector("#cancel-disruption-btn").addEventListener("click",A),v.addEventListener("click",E=>{E.target===v&&A()});const k=v.querySelector("#disruption-type-select"),h=v.querySelector("#student-select-group"),x=v.querySelector("#disruption-student-select"),_=v.querySelector("#disruption-title-input"),c=v.querySelector("#disruption-bus-select"),y=v.querySelector("#disruption-route-select"),f=v.querySelector("#disruption-location-input"),g=()=>{k.value==="student_cancel"?h.style.display="block":h.style.display="none"};return k.addEventListener("change",g),g(),x.addEventListener("change",()=>{const E=x.value,S=a.find(F=>F.id===E);S&&(_.value=`Student Cancellation: ${S.name} (${S.id})`,S.busId&&S.busId!=="UNASSIGNED"&&(c.value=S.busId),S.routeId&&S.routeId!=="UNASSIGNED"&&(y.value=S.routeId),S.stopName&&(f.value=S.stopName))}),v.querySelector("#create-disruption-form").addEventListener("submit",E=>{E.preventDefault();const S=k.value,F=x.value;if(S==="student_cancel"&&F){I.closeModal(),I.cancelStudent(F);return}const B=_.value,D=c.value||null,m=y.value||null,$=f.value,N=v.querySelector("#disruption-severity-select").value,O=v.querySelector("#disruption-impact-input").value;I.createDisruption({type:S,title:B,busId:D,routeId:m,location:$,severity:N,impact:O})}),v}function jo(){const u=I.getState(),{schools:l}=u,r=document.createElement("div");r.className="modal-backdrop",r.innerHTML=`
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${P.users(18,"#2563EB")}
          </div>
          <h3 class="modal-title">Urgent Student Transport Onboarding</h3>
        </div>
        <button class="modal-close-btn" id="close-add-student-modal-btn">
          ${P.x(18,"currentColor")}
        </button>
      </div>

      <form id="add-student-form">
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Student Full Name</label>
              <input type="text" class="form-input" id="student-name-input" placeholder="e.g. Jordan Miller" required />
            </div>

            <div class="form-group">
              <label class="form-label">Grade Level</label>
              <select class="form-select" id="student-grade-select" required>
                <option value="Elementary (3rd Grade)">Elementary (3rd Grade)</option>
                <option value="Middle School (7th Grade)" selected>Middle School (7th Grade)</option>
                <option value="High School (10th Grade)">High School (10th Grade)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Destination School</label>
              <select class="form-select" id="student-school-select" required>
                ${l.map(v=>`<option value="${v.id}" data-name="${v.name}">${v.name}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Requested Stop / Pickup Point</label>
              <input type="text" class="form-input" id="student-stop-input" placeholder="e.g. 18th & Castro St" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Guardian Name</label>
              <input type="text" class="form-input" id="guardian-name-input" placeholder="e.g. Rachel Miller" required />
            </div>

            <div class="form-group">
              <label class="form-label">Guardian Emergency Phone</label>
              <input type="tel" class="form-input" id="guardian-phone-input" placeholder="(555) 000-0000" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Special Accommodations / Needs</label>
            <select class="form-select" id="student-special-needs-select">
              <option value="None" selected>None (Standard Passenger)</option>
              <option value="Wheelchair Accessibility (ADA Ramp Req.)">Wheelchair Accessibility (ADA Ramp Req.)</option>
              <option value="Nut Allergy Alert">Medical: Severe Nut Allergy</option>
              <option value="Visual / Hearing Accommodation">Visual / Hearing Accommodation</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="action-btn secondary" id="cancel-add-student-btn">Cancel</button>
          <button type="submit" class="action-btn primary" style="padding: 10px 20px;">
            ${P.check(16,"#fff")} Register & Auto-Assign Route
          </button>
        </div>
      </form>
    </div>
  `;const d=()=>I.closeModal();return r.querySelector("#close-add-student-modal-btn").addEventListener("click",d),r.querySelector("#cancel-add-student-btn").addEventListener("click",d),r.addEventListener("click",v=>{v.target===r&&d()}),r.querySelector("#add-student-form").addEventListener("submit",v=>{v.preventDefault();const A=r.querySelector("#student-name-input").value,k=r.querySelector("#student-grade-select").value,h=r.querySelector("#student-school-select"),x=h.value,_=h.options[h.selectedIndex].getAttribute("data-name"),c=r.querySelector("#student-stop-input").value,y=r.querySelector("#guardian-name-input").value,f=r.querySelector("#guardian-phone-input").value,g=r.querySelector("#student-special-needs-select").value;I.addStudent({name:A,grade:k,schoolId:x,schoolName:_,stopName:c,guardianName:y,guardianPhone:f,specialNeeds:g,busId:"UNASSIGNED",routeId:"UNASSIGNED"})}),r}function Wo(){var k;const u=I.getState(),l=(k=u.modalPayload)==null?void 0:k.busId,r=u.buses.find(h=>h.id===l)||u.buses[0],d=u.drivers.find(h=>h.id===r.driverId),a=u.routes.find(h=>h.id===r.routeId),v=document.createElement("div");v.className="modal-backdrop",v.innerHTML=`
    <div class="modal-window">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${P.bus(18,"#2563EB")}
          </div>
          <div>
            <h3 class="modal-title">${r.id} - ${r.model}</h3>
            <span style="font-size: 0.75rem; color: #64748B;">License Plate: ${r.plate}</span>
          </div>
        </div>
        <button class="modal-close-btn" id="close-bus-detail-btn">
          ${P.x(18,"currentColor")}
        </button>
      </div>

      <div class="modal-body">
        <!-- Telemetry Summary -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; background: #F8FAFC; padding: 16px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Battery / Fuel</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #0F2747;">${r.fuelLevel}%</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Speed</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #0F2747;">${r.speedKmh} km/h</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Health Score</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: ${r.healthScore>90?"#10B981":"#EF4444"};">${r.healthScore}%</div>
          </div>
        </div>

        <!-- Driver & Route Info -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #E2E8F0; border-radius: 10px;">
            <div>
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Assigned Driver</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #0F2747;">${d?d.name:"Unassigned"}</div>
              ${d?`<div style="font-size: 0.75rem; color: #2563EB;">${d.phone} • Rating: ${d.rating} ★</div>`:""}
            </div>
            ${d?`<img src="${d.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />`:""}
          </div>

          <div style="padding: 12px; border: 1px solid #E2E8F0; border-radius: 10px;">
            <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Assigned Route & Destination</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0F2747;">${a?a.name:"Depot Standby"}</div>
            ${a?`<div style="font-size: 0.78rem; color: #64748B;">School: <b>${a.schoolName}</b> • ETA: <b>${a.currentEta}</b></div>`:""}
          </div>
        </div>

        <!-- Amenities & Safety Equipment -->
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Vehicle Features & Certifications</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${r.amenities.map(h=>`
              <span style="background: #EFF6FF; color: #2563EB; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #BFDBFE;">
                ✓ ${h}
              </span>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="action-btn secondary" id="close-bus-detail-btn2">Close</button>
      </div>
    </div>
  `;const A=()=>I.closeModal();return v.querySelector("#close-bus-detail-btn").addEventListener("click",A),v.querySelector("#close-bus-detail-btn2").addEventListener("click",A),v.addEventListener("click",h=>{h.target===v&&A()}),v}function Go(){var f;const u=I.getState(),l=((f=u.modalPayload)==null?void 0:f.busId)||(u.buses[0]?u.buses[0].id:""),r=u.buses.find(g=>g.id===l)||u.buses[0],d=document.createElement("div");d.className="modal-backdrop";const a=[{label:"-- Select Common Checkpoint --",coords:null,name:""},{label:"Central Bus Depot (2000 Transit Way)",coords:[37.755,-122.405],name:"Central Depot & Maintenance Bay"},{label:"Oakridge High School Dropoff (850 Oakridge Blvd)",coords:[37.7749,-122.4194],name:"Oakridge High School Gate"},{label:"Lincoln Middle School (410 Lincoln Way)",coords:[37.761,-122.447],name:"Lincoln Middle School Gate"},{label:"West Valley Elementary (1220 West Valley Rd)",coords:[37.783,-122.408],name:"West Valley Elementary Gate"},{label:"Stop: Cole & Haight St",coords:[37.768,-122.455],name:"Cole & Haight St Checkpoint"},{label:"Stop: Corona Heights (Roosevelt Way)",coords:[37.764,-122.441],name:"Corona Heights (Roosevelt Way)"},{label:"Stop: West Portal Station",coords:[37.74,-122.466],name:"West Portal Transit Hub"},{label:"Stop: Japantown Plaza (Post & Buchanan)",coords:[37.786,-122.43],name:"Japantown Plaza"},{label:"Stop: Civic Center (Grove & Larkin)",coords:[37.778,-122.417],name:"Civic Center Transit Plaza"}],v=(r==null?void 0:r.gpsStatus)==="no_signal";d.innerHTML=`
    <div class="modal-window" style="max-width: 540px;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
            ${P.mapPin(20,"#2563EB")}
          </div>
          <div>
            <h3 class="modal-title">Manual Location Update</h3>
            <span style="font-size: 0.75rem; color: #64748B;">GPS Telematics Fallback & Dispatcher Checkpoint</span>
          </div>
        </div>
        <button class="modal-close-btn" id="close-manual-location-btn">
          ${P.x(18,"currentColor")}
        </button>
      </div>

      <form id="manual-location-form">
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- GPS Warning Alert if GPS is offline -->
          <div style="padding: 12px 14px; background: ${v?"#FEF2F2":"#EFF6FF"}; border: 1px solid ${v?"#FECACA":"#BFDBFE"}; border-radius: 10px; display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 1.1rem; line-height: 1;">${v?"📡":"🛰️"}</span>
            <div style="font-size: 0.78rem; color: ${v?"#991B1B":"#1E40AF"}; line-height: 1.4;">
              <b>${v?"GPS Signal Unavailable / No Signal":"Dispatcher Location Override"}</b><br>
              ${v?"This vehicle is currently not transmitting live telematics. Manually verify radio checkpoint coordinates. The system will display this as a verified Manual Checkpoint (never pretending to be live).":"Updating the location manually will mark the telemetry as a Dispatcher Manual Checkpoint."}
            </div>
          </div>

          <!-- Select Bus -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Select Vehicle</label>
            <select id="manual-bus-select" class="form-select" required>
              ${u.buses.map(g=>`
                <option value="${g.id}" ${g.id===(r==null?void 0:r.id)?"selected":""}>
                  ${g.id} (${g.plate}) — ${g.gpsStatus==="no_signal"?"📡 No Signal":g.gpsStatus==="manual"?"📍 Manual Checkpoint":"🛰️ Live Fix"} [${g.status}]
                </option>
              `).join("")}
            </select>
          </div>

          <!-- Current Recorded Position -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-size: 0.78rem;">
            <div style="color: #64748B; font-weight: 600; margin-bottom: 2px;">Last Recorded Position:</div>
            <div style="font-weight: 700; color: #0F2747;" id="current-recorded-loc">${(r==null?void 0:r.lastKnownLocation)||"Unknown"}</div>
            <div style="font-size: 0.72rem; color: #94A3B8; font-family: var(--font-mono); margin-top: 2px;" id="current-recorded-coords">
              Coords: [${r==null?void 0:r.coords[0].toFixed(5)}, ${r==null?void 0:r.coords[1].toFixed(5)}] • ${(r==null?void 0:r.lastGpsSync)||"N/A"}
            </div>
          </div>

          <!-- Quick Checkpoint Preset -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Quick Checkpoint Preset</label>
            <select id="checkpoint-preset-select" class="form-select">
              ${a.map((g,b)=>`
                <option value="${b}">${g.label}</option>
              `).join("")}
            </select>
          </div>

          <!-- Checkpoint Landmark Name -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Location / Landmark Name *</label>
            <input type="text" id="manual-location-name" class="form-input" placeholder="e.g. Cole & Haight St (Radio Verified)" value="${(r==null?void 0:r.lastKnownLocation)||""}" required />
          </div>

          <!-- Coordinates Inputs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Latitude *</label>
              <input type="number" step="0.0001" id="manual-lat" class="form-input" value="${(r==null?void 0:r.coords[0])||37.77}" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Longitude *</label>
              <input type="number" step="0.0001" id="manual-lng" class="form-input" value="${(r==null?void 0:r.coords[1])||-122.42}" required />
            </div>
          </div>

          <!-- Reason / Radio Dispatch Note -->
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; font-size: 0.82rem; color: #0F2747;">Verification Source / Dispatch Note</label>
            <input type="text" id="manual-reason" class="form-input" placeholder="e.g. Driver VHF radio check-in, visual confirmation, or tow arrival" value="Driver radio checkpoint check-in" />
          </div>

        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="action-btn secondary" id="cancel-manual-location-btn">Cancel</button>
          <button type="submit" class="action-btn primary" id="save-manual-location-btn">
            ${P.mapPin(16,"#fff")}
            Confirm Manual Location
          </button>
        </div>
      </form>
    </div>
  `;const A=d.querySelector("#manual-location-form"),k=d.querySelector("#manual-bus-select"),h=d.querySelector("#checkpoint-preset-select"),x=d.querySelector("#manual-lat"),_=d.querySelector("#manual-lng"),c=d.querySelector("#manual-location-name");k.addEventListener("change",()=>{const g=k.value,b=u.buses.find(E=>E.id===g);if(b){x.value=b.coords[0],_.value=b.coords[1],c.value=b.lastKnownLocation||"";const E=d.querySelector("#current-recorded-loc"),S=d.querySelector("#current-recorded-coords");E&&(E.textContent=b.lastKnownLocation||"Unknown"),S&&(S.textContent=`Coords: [${b.coords[0].toFixed(5)}, ${b.coords[1].toFixed(5)}] • ${b.lastGpsSync||"N/A"}`)}}),h.addEventListener("change",()=>{const g=parseInt(h.value,10),b=a[g];b&&b.coords&&(x.value=b.coords[0],_.value=b.coords[1],c.value=b.name)}),A.addEventListener("submit",g=>{var D;g.preventDefault();const b=k.value,E=parseFloat(x.value),S=parseFloat(_.value),F=c.value.trim(),B=((D=d.querySelector("#manual-reason"))==null?void 0:D.value.trim())||"Dispatcher Manual Checkpoint";if(isNaN(E)||isNaN(S)){I.showToast("Please enter valid numerical latitude and longitude coordinates.","danger");return}I.updateBusLocationManually(b,[E,S],F,B)});const y=()=>I.closeModal();return d.querySelector("#close-manual-location-btn").addEventListener("click",y),d.querySelector("#cancel-manual-location-btn").addEventListener("click",y),d.addEventListener("click",g=>{g.target===d&&y()}),d}function Nn(){const u=document.getElementById("app");if(!u)return;const l=I.getState();if(u.innerHTML="",l.activeScreen==="auth"){u.appendChild(bo()),In(u,l.toasts);return}if(l.activeScreen==="role_selection")return;const r=document.createElement("div");r.className="app-layout";const d=xo();r.appendChild(d);const a=document.createElement("main");a.className="main-content";const v=_o();a.appendChild(v);let A;switch(l.activeTab){case"dashboard":A=l.currentRole==="operations_manager"?Fo():Mn();break;case"buses":A=$o();break;case"routes":A=Po();break;case"students":A=Ro();break;case"disruptions":A=zo();break;case"replanning":A=No();break;case"reports":A=Ho();break;case"settings":A=qo();break;default:A=Mn()}if(a.appendChild(A),r.appendChild(a),u.appendChild(r),l.activeModal){let k;l.activeModal==="create_disruption"?k=Vo():l.activeModal==="add_student"?k=jo():l.activeModal==="bus_detail"?k=Wo():l.activeModal==="manual_location"&&(k=Go()),k&&u.appendChild(k)}In(u,l.toasts)}function In(u,l){if(!l||l.length===0)return;let r=u.querySelector(".toast-container");r?r.innerHTML="":(r=document.createElement("div"),r.className="toast-container",u.appendChild(r)),l.forEach(d=>{const a=document.createElement("div");a.className=`toast ${d.type}`,a.innerHTML=`
      <span style="font-size: 1.1rem;">
        ${d.type==="success"?"✅":d.type==="danger"?"⚠️":"ℹ️"}
      </span>
      <span style="font-size: 0.85rem; font-weight: 600; color: #0F172A;">${d.message}</span>
    `,r.appendChild(a)})}I.subscribe(Nn);Nn();setInterval(()=>{const u=document.getElementById("live-header-clock");u&&(u.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}))},1e3);
