export type Language = 'en' | 'hi' | 'mr' | 'pa';

export interface TranslationKeys {
  title: string;
  subtitle: string;
  livePipelineActive: string;
  disconnected: string;
  currentRole: string;
  lightMode: string;
  darkMode: string;
  // Roles
  roleOwner: string;
  roleAdmin: string;
  roleLogisticsManager: string;
  roleDriver: string;
  roleWarehouse: string;
  // Tabs
  tabOverview: string;
  tabTracking: string;
  tabCargo: string;
  tabDriver: string;
  tabFleet: string;
  tabAlerts: string;
  tabTrips: string;
  tabDocuments: string;
  tabReports: string;
  tabTestbench: string;
  // KPIs & Stat Card Subtitles
  activeTrucks: string;
  safeFleetStatus: string;
  alertTrucks: string;
  ongoingTrips: string;
  openAlerts: string;
  avgDriverScore: string;
  outOfFleetTrucks: string;
  operatingWithinLimits: string;
  actionRequiredSub: string;
  activeCargoTransitsSub: string;
  criticalAlertsSub: string;
  driverSafetyIndexSub: string;
  // KPI Badges
  badgeOnline: string;
  badgeSafe: string;
  badgeActionReq: string;
  badgeAllClear: string;
  badgeInTransit: string;
  badgeUnresolved: string;
  badgeCleared: string;
  badgeExplainableAi: string;
  badgeTopRated: string;
  badgeSafeSpeed: string;
  badgePassed: string;
  badgeLegalLoad: string;
  badgeWeighed: string;
  badgeHighValue: string;
  badgeSecure: string;
  badgeOverloaded: string;
  badgeLoadCompliant: string;
  // Map Legend
  normalTransit: string;
  alertOverloadEvent: string;
  // Buttons
  aiDispatchWizard: string;
  hardwareTestBench: string;
  recommendDriver: string;
  runAiRecommendation: string;
  evaluatingDrivers: string;
  assignDriverToTrip: string;
  manageFleet: string;
  viewFullscreenMap: string;
  resolveBtn: string;
  acknowledgeBtn: string;
  // AI Modal
  aiRecommendationTitle: string;
  aiRecommendationDesc: string;
  cargoType: string;
  declaredValue: string;
  tripPriority: string;
  requiredSafetyLevel: string;
  recommendedDriver: string;
  trustScore: string;
  // Driver Scores
  safetyScoreLabel: string;
  routeComplianceLabel: string;
  drivingEfficiencyLabel: string;
  reliabilityLabel: string;
  drivingEfficiencyNote: string;
  // Dashboard & Pages
  fleetSafetyHeader: string;
  activeAlertFeed: string;
  registration: string;
  model: string;
  status: string;
  maxAllowedWeight: string;
  currentWeight: string;
  loadStatus: string;
  gasConcentration: string;
  alcoholSensor: string;
  overloadAlert: string;
  safeLoad: string;
  abnormalGas: string;
  verifyRequire: string;
  normalState: string;
  driverName: string;
  licenseNumber: string;
  tripsCompleted: string;
  totalViolations: string;
  documentsManager: string;
  expiryDate: string;
  valid: string;
  expired: string;
  warning: string;
  tripOrigin: string;
  tripDestination: string;
  cargoTypeLabel: string;
  // Driver Portal Specific
  driverPortal: string;
  assignedVehicle: string;
  activeTrip: string;
  driverTrustScore: string;
  mySafetyScore: string;
  currentSpeedLimit: string;
  alcoholSobrietySensor: string;
  cargoAxleLoad: string;
  liveRouteMap: string;
  driverEmergencyChecklist: string;
  sosEmergencyBtn: string;
  sosTriggerTitle: string;
  sosTriggerDesc: string;
  preDepartureVerification: string;
  // Warehouse Specific
  warehouseTerminalTitle: string;
  warehouseTerminalSubtitle: string;
  axleLimit: string;
  cargoTypeValue: string;
  declaredValueLabel: string;
  containerRainSeal: string;
  currentLoadingQueue: string;
  cargoItem: string;
  reWeighScale: string;
  weighbridgeScale: string;
  // TestBench Specific
  circuitScreenTitle: string;
  physicalHardwareSignals: string;
  redAlertLed: string;
  greenSafeLed: string;
  activeBuzzer: string;
  alarmActiveText: string;
  customPayloadTitle: string;
  transmitTelemetryBtn: string;
  // Page Specific Titles & Subtitles
  liveTrackingTitle: string;
  liveTrackingSubtitle: string;
  gpsBreadcrumbHistory: string;
  selectTruck: string;
  liveVehicleReadings: string;
  currentSpeed: string;
  coordinates: string;
  lastConnection: string;
  cargoMonitoringTitle: string;
  cargoMonitoringSubtitle: string;
  overloadDetected: string;
  safeCapacity: string;
  weightLoadGauge: string;
  mq135GasSensor: string;
  abnormalGasDesc: string;
  normalAirQuality: string;
  rainWaterIngress: string;
  rainDetected: string;
  drySeal: string;
  waterIngressWarning: string;
  tarpaulinSecure: string;
  humiditySensor: string;
  fleetManagementTitle: string;
  fleetManagementSubtitle: string;
  deviceId: string;
  firmwareVersion: string;
  batteryVoltage: string;
  hardwareStatus: string;
  alertEngineTitle: string;
  alertEngineSubtitle: string;
  allSeverities: string;
  criticalOnly: string;
  highOnly: string;
  mediumOnly: string;
  severity: string;
  alertType: string;
  truckDriver: string;
  message: string;
  timestamp: string;
  resolutionAction: string;
  noAlertsFound: string;
  tripsTitle: string;
  tripsSubtitle: string;
  planned: string;
  inTransit: string;
  completed: string;
  origin: string;
  destination: string;
  driver: string;
  eta: string;
  documentsTitle: string;
  documentsSubtitle: string;
  docType: string;
  docNumber: string;
  issuer: string;
  daysRemaining: string;
  reportsTitle: string;
  reportsSubtitle: string;
  testbenchTitle: string;
  testbenchSubtitle: string;
  injectOverload: string;
  injectAlcohol: string;
  injectRain: string;
  injectGas: string;
  injectDeviation: string;
  resetNormal: string;
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    title: "BHARAT LOAD RAKSHAK",
    subtitle: "AI + IoT Fleet Safety, Cargo Monitoring & Driver Intelligence",
    livePipelineActive: "Live Pipeline Active",
    disconnected: "Disconnected",
    currentRole: "Current Role",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    // Roles
    roleOwner: "Truck Fleet Owner",
    roleAdmin: "System Admin",
    roleLogisticsManager: "Logistics Manager",
    roleDriver: "Driver",
    roleWarehouse: "Warehouse Manager",
    // Tabs
    tabOverview: "Overview",
    tabTracking: "Live Fleet Map",
    tabCargo: "Cargo & Load",
    tabDriver: "Driver Intelligence",
    tabFleet: "Fleet & Devices",
    tabAlerts: "Alert Center",
    tabTrips: "Trips & Visibility",
    tabDocuments: "Documents",
    tabReports: "Analytics",
    tabTestbench: "Hardware Test Bench",
    // KPIs & Subtitles
    activeTrucks: "Active Trucks",
    safeFleetStatus: "Safe Fleet Status",
    alertTrucks: "Alert Trucks",
    ongoingTrips: "Ongoing Trips",
    openAlerts: "Open Alerts",
    avgDriverScore: "Avg Driver Trust Score",
    outOfFleetTrucks: "Out of 3 Total Fleet Trucks",
    operatingWithinLimits: "Operating within safety limits",
    actionRequiredSub: "Requires immediate manager action",
    activeCargoTransitsSub: "Active cargo transits",
    criticalAlertsSub: "Critical level alerts",
    driverSafetyIndexSub: "Calculated driver safety index",
    // KPI Badges
    badgeOnline: "ONLINE",
    badgeSafe: "SAFE",
    badgeActionReq: "ACTION REQ",
    badgeAllClear: "ALL CLEAR",
    badgeInTransit: "IN TRANSIT",
    badgeUnresolved: "UNRESOLVED",
    badgeCleared: "CLEARED",
    badgeExplainableAi: "EXPLAINABLE AI",
    badgeTopRated: "TOP RATED",
    badgeSafeSpeed: "SAFE SPEED",
    badgePassed: "PASSED ✓",
    badgeLegalLoad: "LEGAL LOAD",
    badgeWeighed: "WEIGHED",
    badgeHighValue: "HIGH VALUE",
    badgeSecure: "SECURE",
    badgeOverloaded: "OVERLOADED 🚨",
    badgeLoadCompliant: "LOAD COMPLIANT ✓",
    // Map Legend
    normalTransit: "Normal Transit",
    alertOverloadEvent: "Alert / Overload / Alcohol Event",
    // Buttons
    aiDispatchWizard: "AI Driver Dispatch Wizard",
    hardwareTestBench: "Hardware Test Bench",
    recommendDriver: "Recommend Driver",
    runAiRecommendation: "Run AI Recommendation",
    evaluatingDrivers: "Evaluating Drivers...",
    assignDriverToTrip: "Assign Driver to Trip",
    manageFleet: "Manage Fleet →",
    viewFullscreenMap: "View Fullscreen Map",
    resolveBtn: "Resolve →",
    acknowledgeBtn: "Acknowledge",
    // AI Modal
    aiRecommendationTitle: "AI Driver Recommendation Engine",
    aiRecommendationDesc: "Evaluates safety ratings, compliance, and ML risk models for dispatch matching",
    cargoType: "Cargo Type",
    declaredValue: "Declared Value (INR)",
    tripPriority: "Trip Priority",
    requiredSafetyLevel: "Required Safety Level",
    recommendedDriver: "Recommended Driver",
    trustScore: "Trust Score",
    // Driver Scores
    safetyScoreLabel: "Safety Score",
    routeComplianceLabel: "Route Compliance Score",
    drivingEfficiencyLabel: "Driving Efficiency Score (Proxy)*",
    reliabilityLabel: "Reliability Score",
    drivingEfficiencyNote: "* Driving Efficiency Score is a transparent proxy based on speed consistency, trip duration, and route efficiency.",
    // Dashboard & Pages
    fleetSafetyHeader: "Fleet Safety & Supply Chain Dashboard",
    activeAlertFeed: "Active Alert Feed",
    registration: "Registration",
    model: "Model",
    status: "Status",
    maxAllowedWeight: "Max Allowed Weight",
    currentWeight: "Current Weight",
    loadStatus: "Load Status",
    gasConcentration: "Gas Concentration",
    alcoholSensor: "Alcohol Sensor",
    overloadAlert: "OVERLOAD ALERT",
    safeLoad: "SAFE LOAD",
    abnormalGas: "⚠️ Abnormal",
    verifyRequire: "⚠️ VERIFY REQUIRE",
    normalState: "0 (NORMAL)",
    driverName: "Driver Name",
    licenseNumber: "License Number",
    tripsCompleted: "Trips Completed",
    totalViolations: "Total Violations",
    documentsManager: "Vehicle & Driver Document Manager",
    expiryDate: "Expiry Date",
    valid: "VALID",
    expired: "EXPIRED",
    warning: "WARNING",
    tripOrigin: "Origin",
    tripDestination: "Destination",
    cargoTypeLabel: "Cargo Type",
    // Driver Portal Specific
    driverPortal: "Driver Portal",
    assignedVehicle: "Assigned Vehicle",
    activeTrip: "Active Trip",
    driverTrustScore: "Driver Safety Trust Score",
    mySafetyScore: "My Safety Trust Score",
    currentSpeedLimit: "Current Vehicle Speed",
    alcoholSobrietySensor: "Alcohol Sobriety Sensor",
    cargoAxleLoad: "Cargo Axle Load Status",
    liveRouteMap: "Live Route Navigation Map",
    driverEmergencyChecklist: "Driver Emergency & Checklist",
    sosEmergencyBtn: "PRESS FOR SOS EMERGENCY",
    sosTriggerTitle: "🚨 SOS Emergency Trigger",
    sosTriggerDesc: "Instantly notifies fleet control tower & dispatch manager.",
    preDepartureVerification: "Pre-Departure Verification",
    // Warehouse Specific
    warehouseTerminalTitle: "Warehouse & Weighbridge Loading Terminal",
    warehouseTerminalSubtitle: "Weighbridge Scale Ingestion | Cargo Seal & Ingress Verification | Overload Prevention Gate",
    axleLimit: "Axle Limit",
    cargoTypeValue: "Cargo Type & Value",
    declaredValueLabel: "Declared Value: ₹2.5 Crore",
    containerRainSeal: "Container Rain Seal",
    currentLoadingQueue: "Current Warehouse Loading Queue",
    cargoItem: "Cargo Item",
    reWeighScale: "Re-Weigh Scale",
    weighbridgeScale: "Weighbridge Scale",
    // TestBench Specific
    circuitScreenTitle: "Simulated ESP32 Hardware Circuit Screen & Signals",
    physicalHardwareSignals: "Physical Hardware Signals",
    redAlertLed: "Red Alert LED",
    greenSafeLed: "Green Safe LED",
    activeBuzzer: "Active Buzzer",
    alarmActiveText: "ALARM ACTIVE (2.4kHz)",
    customPayloadTitle: "Custom Telemetry Payload Generator",
    transmitTelemetryBtn: "Transmit Telemetry to Backend Pipeline",
    // Page Specific Titles & Subtitles
    liveTrackingTitle: "Live Fleet GPS Tracking & Corridor Monitoring",
    liveTrackingSubtitle: "Real-time location breadcrumbs, speed consistency, and route tolerance validation",
    gpsBreadcrumbHistory: "GPS Breadcrumb Telemetry History",
    selectTruck: "Select Truck",
    liveVehicleReadings: "Live Vehicle Readings",
    currentSpeed: "Current Speed",
    coordinates: "Coordinates",
    lastConnection: "Last Connection",
    cargoMonitoringTitle: "Cargo Load & Container Environment Monitoring",
    cargoMonitoringSubtitle: "Real-time telemetry for HX711 Load Cell, MQ135 Air Quality/Gas Sensor, Rain Ingress, and Container Humidity",
    overloadDetected: "OVERLOAD DETECTED",
    safeCapacity: "SAFE CAPACITY",
    weightLoadGauge: "Weight Load Gauge",
    mq135GasSensor: "MQ135 Gas Sensor",
    abnormalGasDesc: "Abnormal Gas Concentration Detected — Inspection Required.",
    normalAirQuality: "Normal Air Quality",
    rainWaterIngress: "Rain / Water Ingress",
    rainDetected: "DETECTED",
    drySeal: "DRY SEAL",
    waterIngressWarning: "Water Ingress Warning on Cover",
    tarpaulinSecure: "Container Tarpaulin Secure",
    humiditySensor: "Humidity Sensor",
    fleetManagementTitle: "Fleet Vehicles & IoT Hardware Devices",
    fleetManagementSubtitle: "Manage registered trucks, OBD-II telemetry devices, ESP32 microcontrollers, and firmware status",
    deviceId: "Device ID",
    firmwareVersion: "Firmware Version",
    batteryVoltage: "Battery Voltage",
    hardwareStatus: "Hardware Status",
    alertEngineTitle: "Centralized Fleet Alert Engine",
    alertEngineSubtitle: "Real-time audit trail of Overload, Alcohol Threshold, Route Deviation, Gas Concentration, and Water Ingress alerts",
    allSeverities: "All Severities",
    criticalOnly: "CRITICAL Only",
    highOnly: "HIGH Only",
    mediumOnly: "MEDIUM Only",
    severity: "Severity",
    alertType: "Alert Type",
    truckDriver: "Truck / Driver",
    message: "Message",
    timestamp: "Timestamp",
    resolutionAction: "Resolution Action",
    noAlertsFound: "No alerts match the selected filter.",
    tripsTitle: "Trip & Route Visibility Management",
    tripsSubtitle: "Monitor active cargo transit corridors, assigned drivers, estimated arrivals, and SLA compliance",
    planned: "PLANNED",
    inTransit: "IN TRANSIT",
    completed: "COMPLETED",
    origin: "Origin",
    destination: "Destination",
    driver: "Driver",
    eta: "Estimated Arrival (ETA)",
    documentsTitle: "Vehicle & Driver Document Manager",
    documentsSubtitle: "Compliance tracking for Registration Certificates, Insurance Policies, Pollution Certificates, and Fitness Certificates",
    docType: "Document Type",
    docNumber: "Document Number",
    issuer: "Issuing Authority",
    daysRemaining: "Days Remaining",
    reportsTitle: "Fleet Safety Analytics & SLA Compliance Reports",
    reportsSubtitle: "Deep-dive analytics on trip completion rates, safety violation trends, and driver risk distributions",
    testbenchTitle: "Hardware Telemetry Injector & Test Bench",
    testbenchSubtitle: "Simulate ESP32 hardware sensor signals, trigger live alerts, and test WebSocket streaming pipeline",
    injectOverload: "Inject Overload Event",
    injectAlcohol: "Inject Alcohol Breach",
    injectRain: "Inject Rain / Water Ingress",
    injectGas: "Inject Gas Spike",
    injectDeviation: "Inject Route Deviation",
    resetNormal: "Reset Normal Sensor State"
  },
  hi: {
    title: "भारत लोड रक्षक",
    subtitle: "एआई + आईओटी लॉजिस्टिक्स, कार्गो निगरानी और चालक इंटेलिजेंस",
    livePipelineActive: "लाइव पाइपलाइन सक्रिय",
    disconnected: "डिस्कनेक्ट हुआ",
    currentRole: "वर्तमान भूमिका",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    // Roles
    roleOwner: "ट्रक बेड़ा मालिक",
    roleAdmin: "सिस्टम एडमिन",
    roleLogisticsManager: "लॉजिस्टिक्स मैनेजर",
    roleDriver: "चालक",
    roleWarehouse: "वेयरहाउस मैनेजर",
    // Tabs
    tabOverview: "अवलोकन",
    tabTracking: "लाइव नक्शा",
    tabCargo: "कार्गो और लोड",
    tabDriver: "चालक इंटेलिजेंस",
    tabFleet: "बेड़ा और उपकरण",
    tabAlerts: "अलर्ट केंद्र",
    tabTrips: "यात्राएं और दृश्यता",
    tabDocuments: "दस्तावेज़",
    tabReports: "विश्लेषण",
    tabTestbench: "हार्डवेयर टेस्ट बेंच",
    // KPIs & Subtitles
    activeTrucks: "सक्रिय ट्रक",
    safeFleetStatus: "सुरक्षित बेड़ा स्थिति",
    alertTrucks: "अलर्ट ट्रक",
    ongoingTrips: "चालू यात्राएं",
    openAlerts: "खुले अलर्ट",
    avgDriverScore: "औसत चालक ट्रस्ट स्कोर",
    outOfFleetTrucks: "कुल 3 बेड़ा ट्रकों में से",
    operatingWithinLimits: "सुरक्षा सीमाओं के भीतर संचालित",
    actionRequiredSub: "प्रबंधक कार्रवाई आवश्यक",
    activeCargoTransitsSub: "सक्रिय कार्गो परिवहन",
    criticalAlertsSub: "गंभीर स्तर के अलर्ट",
    driverSafetyIndexSub: "गणना किया गया चालक सुरक्षा सूचकांक",
    // KPI Badges
    badgeOnline: "ऑनलाइन",
    badgeSafe: "सुरक्षित",
    badgeActionReq: "कार्रवाई आवश्यक",
    badgeAllClear: "सब सुरक्षित",
    badgeInTransit: "मार्ग में",
    badgeUnresolved: "अनसुलझे",
    badgeCleared: "समाधान हुआ",
    badgeExplainableAi: "स्पष्टीकरण योग्य AI",
    badgeTopRated: "शीर्ष रेटेड",
    badgeSafeSpeed: "सुरक्षित गति",
    badgePassed: "सफल ✓",
    badgeLegalLoad: "वैध लोड",
    badgeWeighed: "मापा गया",
    badgeHighValue: "उच्च मूल्य",
    badgeSecure: "सुरक्षित",
    badgeOverloaded: "ओवरलोड 🚨",
    badgeLoadCompliant: "लोड अनुपालन ✓",
    // Map Legend
    normalTransit: "सामान्य आवागमन",
    alertOverloadEvent: "अलर्ट / ओवरलोड / अल्कोहल घटना",
    // Buttons
    aiDispatchWizard: "एआई चालक प्रेषण विज़ार्ड",
    hardwareTestBench: "हार्डवेयर टेस्ट बेंच",
    recommendDriver: "चालक की सिफारिश करें",
    runAiRecommendation: "एआई सिफारिश चलाएं",
    evaluatingDrivers: "चालकों का मूल्यांकन किया जा रहा है...",
    assignDriverToTrip: "चालक को यात्रा असाइन करें",
    manageFleet: "बेड़ा प्रबंधित करें →",
    viewFullscreenMap: "पूर्ण नक्शा देखें",
    resolveBtn: "समाधान करें →",
    acknowledgeBtn: "स्वीकार करें",
    // AI Modal
    aiRecommendationTitle: "एआई ड्राइवर सिफारिश इंजन",
    aiRecommendationDesc: "सुरक्षा रेटिंग, अनुपालन और एमएल जोखिम मॉडल का मूल्यांकन करता है",
    cargoType: "कार्गो प्रकार",
    declaredValue: "घोषित मूल्य (रुपये)",
    tripPriority: "यात्रा प्राथमिकता",
    requiredSafetyLevel: "आवश्यक सुरक्षा स्तर",
    recommendedDriver: "अनुशंसित चालक",
    trustScore: "ट्रस्ट स्कोर",
    // Driver Scores
    safetyScoreLabel: "सुरक्षा स्कोर",
    routeComplianceLabel: "मार्ग अनुपालन स्कोर",
    drivingEfficiencyLabel: "ड्राइविंग दक्षता स्कोर (प्रॉक्सी)*",
    reliabilityLabel: "विश्वसनीयता स्कोर",
    drivingEfficiencyNote: "* ड्राइविंग दक्षता स्कोर गति स्थिरता और यात्रा अवधि पर आधारित एक पारदर्शी प्रॉक्सी है।",
    // Dashboard & Pages
    fleetSafetyHeader: "बेड़ा सुरक्षा और आपूर्ति श्रृंखला डैशबोर्ड",
    activeAlertFeed: "सक्रिय अलर्ट फ़ीड",
    registration: "पंजीकरण संख्या",
    model: "मॉडल",
    status: "स्थिति",
    maxAllowedWeight: "अधिकतम अनुमत वजन",
    currentWeight: "वर्तमान वजन",
    loadStatus: "लोड स्थिति",
    gasConcentration: "गैस सांद्रता",
    alcoholSensor: "अल्कोहल सेंसर",
    overloadAlert: "ओवरलोड अलर्ट",
    safeLoad: "सुरक्षित लोड",
    abnormalGas: "⚠️ असामान्य",
    verifyRequire: "⚠️ सत्यापन आवश्यक",
    normalState: "0 (सामान्य)",
    driverName: "चालक का नाम",
    licenseNumber: "लाइसेंस नंबर",
    tripsCompleted: "पूर्ण यात्राएं",
    totalViolations: "कुल उल्लंघन",
    documentsManager: "वाहन और चालक दस्तावेज़ प्रबंधक",
    expiryDate: "समाप्ति तिथि",
    valid: "वैध",
    expired: "समाप्त",
    warning: "चेतावनी",
    tripOrigin: "प्रस्थान",
    tripDestination: "गंतव्य",
    cargoTypeLabel: "कार्गो प्रकार",
    // Driver Portal Specific
    driverPortal: "चालक पोर्टल",
    assignedVehicle: "आवंटित वाहन",
    activeTrip: "सक्रिय यात्रा",
    driverTrustScore: "चालक सुरक्षा ट्रस्ट स्कोर",
    mySafetyScore: "मेरा सुरक्षा ट्रस्ट स्कोर",
    currentSpeedLimit: "वर्तमान वाहन गति",
    alcoholSobrietySensor: "अल्कोहल संयम सेंसर",
    cargoAxleLoad: "कार्गो एक्सेल लोड स्थिति",
    liveRouteMap: "लाइव मार्ग नेविगेशन नक्शा",
    driverEmergencyChecklist: "चालक आपातकालीन जाँच सूची",
    sosEmergencyBtn: "एसओएस आपात स्थिति के लिए दबाएं",
    sosTriggerTitle: "🚨 एसओएस आपातकालीन ट्रिगर",
    sosTriggerDesc: "नियंत्रण कक्ष और प्रेषण प्रबंधक को तुरंत सूचित करता है।",
    preDepartureVerification: "प्रस्थान पूर्व सत्यापन",
    // Warehouse Specific
    warehouseTerminalTitle: "वेयरहाउस और वेब्रिज लोडिंग टर्मिनल",
    warehouseTerminalSubtitle: "वेब्रिज स्केल इनजेस्टन | कार्गो सील सत्यापन | ओवरलोड रोकथाम",
    axleLimit: "एक्सेल सीमा",
    cargoTypeValue: "कार्गो प्रकार और मूल्य",
    declaredValueLabel: "घोषित मूल्य: ₹2.5 करोड़",
    containerRainSeal: "कंटेनर वर्षा सील",
    currentLoadingQueue: "वर्तमान वेयरहाउस लोडिंग कतार",
    cargoItem: "कार्गो वस्तु",
    reWeighScale: "पुनः वजन मापें",
    weighbridgeScale: "वेब्रिज कांटा",
    // TestBench Specific
    circuitScreenTitle: "इमिडिएट इएसपी32 हार्डवेयर सर्किट स्क्रीन और सिग्नल",
    physicalHardwareSignals: "भौतिक हार्डवेयर सिग्नल",
    redAlertLed: "लाल अलर्ट एलईडी",
    greenSafeLed: "हरा सुरक्षित एलईडी",
    activeBuzzer: "सक्रिय बजर अलार्म",
    alarmActiveText: "अलार्म सक्रिय (2.4kHz)",
    customPayloadTitle: "कस्टम टेलीमेट्री पेलोड जनरेटर",
    transmitTelemetryBtn: "बैकएंड पाइपलाइन में टेलीमेट्री भेजें",
    // Page Specific Titles & Subtitles
    liveTrackingTitle: "लाइव जीपीएस ट्रैकिंग और कॉरिडोर निगरानी",
    liveTrackingSubtitle: "वास्तविक समय स्थान, गति स्थिरता और मार्ग अनुपालन",
    gpsBreadcrumbHistory: "जीपीएस टेलीमेट्री इतिहास",
    selectTruck: "ट्रक चुनें",
    liveVehicleReadings: "लाइव वाहन रीडिंग",
    currentSpeed: "वर्तमान गति",
    coordinates: "निर्देशांक",
    lastConnection: "अंतिम कनेक्शन",
    cargoMonitoringTitle: "कार्गो लोड और कंटेनर पर्यावरण निगरानी",
    cargoMonitoringSubtitle: "एचएक्स711 लोड सेल, एमक्यू135 वायु गुणवत्ता, वर्षा और आर्द्रता की लाइव टेलीमेट्री",
    overloadDetected: "ओवरलोड पाया गया",
    safeCapacity: "सुरक्षित क्षमता",
    weightLoadGauge: "वजन लोड गेज",
    mq135GasSensor: "एमक्यू135 गैस सेंसर",
    abnormalGasDesc: "असामान्य गैस सांद्रता पाई गई — निरीक्षण आवश्यक।",
    normalAirQuality: "सामान्य वायु गुणवत्ता",
    rainWaterIngress: "वर्षा / पानी प्रवेश",
    rainDetected: "पाया गया",
    drySeal: "सुरक्षित सील",
    waterIngressWarning: "कंटेनर पर पानी प्रवेश की चेतावनी",
    tarpaulinSecure: "कंटेनर त्रिपाल सुरक्षित",
    humiditySensor: "आर्द्रता सेंसर",
    fleetManagementTitle: "बेड़ा वाहन और आईओटी उपकरण",
    fleetManagementSubtitle: "पंजीकृत ट्रक, ओबीडी-द्वितीय उपकरण और फर्मवेयर स्थिति",
    deviceId: "उपकरण आईडी",
    firmwareVersion: "फर्मवेयर संस्करण",
    batteryVoltage: "बैटरी वोल्टेज",
    hardwareStatus: "हार्डवेयर स्थिति",
    alertEngineTitle: "केन्द्रीकृत बेड़ा अलर्ट इंजन",
    alertEngineSubtitle: "ओवरलोड, अल्कोहल, मार्ग विचलन और गैस अलर्ट का ऑडिट ट्रेल",
    allSeverities: "सभी गंभीरताएं",
    criticalOnly: "केवल गंभीर (CRITICAL)",
    highOnly: "केवल उच्च (HIGH)",
    mediumOnly: "केवल मध्यम (MEDIUM)",
    severity: "गंभीरता",
    alertType: "अलर्ट प्रकार",
    truckDriver: "ट्रक / चालक",
    message: "संदेश",
    timestamp: "समय",
    resolutionAction: "समाधान कार्रवाई",
    noAlertsFound: "चयनित फ़िल्टर से कोई अलर्ट मेल नहीं खाता।",
    tripsTitle: "यात्रा और मार्ग दृश्यता प्रबंधन",
    tripsSubtitle: "सक्रिय कार्गो ट्रांजिट, निर्दिष्ट चालक और अनुमानित आगमन समय",
    planned: "योजनाबद्ध",
    inTransit: "मार्ग में",
    completed: "पूर्ण",
    origin: "प्रस्थान",
    destination: "गंतव्य",
    driver: "चालक",
    eta: "अनुमानित आगमन (ETA)",
    documentsTitle: "वाहन और चालक दस्तावेज़ प्रबंधक",
    documentsSubtitle: "आरसी, बीमा, प्रदूषण और फिटनेस प्रमाणपत्र का अनुपालन",
    docType: "दस्तावेज़ प्रकार",
    docNumber: "दस्तावेज़ संख्या",
    issuer: "जारीकर्ता प्राधिकरण",
    daysRemaining: "शेष दिन",
    reportsTitle: "बेड़ा सुरक्षा विश्लेषण और रिपोर्ट",
    reportsSubtitle: "यात्रा पूर्णता दर और चालक जोखिम वितरण की गहन रिपोर्ट",
    testbenchTitle: "हार्डवेयर टेलीमेट्री इंजेक्टर और टेस्ट बेंच",
    testbenchSubtitle: "इएसपी32 सेंसर सिग्नल का सिमुलेशन और लाइव अलर्ट परीक्षण",
    injectOverload: "ओवरलोड घटना इंजेक्ट करें",
    injectAlcohol: "अल्कोहल उल्लंघन इंजेक्ट करें",
    injectRain: "वर्षा / पानी प्रवेश इंजेक्ट करें",
    injectGas: "गैस वृद्धि इंजेक्ट करें",
    injectDeviation: "मार्ग विचलन इंजेक्ट करें",
    resetNormal: "सामान्य स्थिति रीसेट करें"
  },
  mr: {
    title: "भारत लोड रक्षक",
    subtitle: "एआय + आयओटी ताफा सुरक्षितता आणि चालक बुद्धिमत्ता",
    livePipelineActive: "थेट पाइपलाइन सक्रिय",
    disconnected: "खंडित",
    currentRole: "सध्याची भूमिका",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    // Roles
    roleOwner: "ट्रक ताफा मालक",
    roleAdmin: "सिस्टम ॲडमिन",
    roleLogisticsManager: "लॉजिस्टिक्स मॅनेजर",
    roleDriver: "चालक",
    roleWarehouse: "वेअरहाऊस मॅनेजर",
    // Tabs
    tabOverview: "आढावा",
    tabTracking: "थेट नकाशा",
    tabCargo: "कार्गो आणि वजन",
    tabDriver: "चालक बुद्धिमत्ता",
    tabFleet: "ताफा आणि उपकरणे",
    tabAlerts: "अलर्ट केंद्र",
    tabTrips: "फेऱ्या आणि पारदर्शकता",
    tabDocuments: "कागदपत्रे",
    tabReports: "विश्लेषण",
    tabTestbench: "हार्डवेयर चाचणी बेंच",
    // KPIs & Subtitles
    activeTrucks: "सक्रिय ट्रक",
    safeFleetStatus: "सुरक्षित ताफा",
    alertTrucks: "अलर्ट ट्रक",
    ongoingTrips: "सुरू असलेल्या फेऱ्या",
    openAlerts: "उघडे अलर्ट",
    avgDriverScore: "सरासरी चालक विश्वास स्कोर",
    outOfFleetTrucks: "एकूण 3 ट्रकांमधील",
    operatingWithinLimits: "सुरक्षित मर्यादेत कार्यरत",
    actionRequiredSub: "व्यवस्थापक कृती आवश्यक",
    activeCargoTransitsSub: "सक्रिय कार्गो वाहतूक",
    criticalAlertsSub: "गंभीर पातळीवरील इशारे",
    driverSafetyIndexSub: "चालक सुरक्षा निर्देशांक",
    // KPI Badges
    badgeOnline: "ऑनलाइन",
    badgeSafe: "सुरक्षित",
    badgeActionReq: "कृती आवश्यक",
    badgeAllClear: "सर्व स्पष्ट",
    badgeInTransit: "मार्गावर",
    badgeUnresolved: "अपरिहार्य",
    badgeCleared: "निरस्त",
    badgeExplainableAi: "स्पष्टीकरणयोग्य AI",
    badgeTopRated: "सर्वोत्तम",
    badgeSafeSpeed: "सुरक्षित वेग",
    badgePassed: "मंजूर ✓",
    badgeLegalLoad: "मंजूर लोड",
    badgeWeighed: "मोजले",
    badgeHighValue: "उच्च मूल्य",
    badgeSecure: "सुरक्षित",
    badgeOverloaded: "ओवरलोड 🚨",
    badgeLoadCompliant: "योग्य लोड ✓",
    // Map Legend
    normalTransit: "सामान्य रहदारी",
    alertOverloadEvent: "इशारा / ओवरलोड / अल्कोहोल घटना",
    // Buttons
    aiDispatchWizard: "एआय चालक निवड विझार्ड",
    hardwareTestBench: "हार्डवेयर चाचणी",
    recommendDriver: "चालकाची शिफारस करा",
    runAiRecommendation: "एआय शिफारस चालवा",
    evaluatingDrivers: "चालकांचे मूल्यांकन सुरू आहे...",
    assignDriverToTrip: "फेरीसाठी चालक नियुक्त करा",
    manageFleet: "ताफा व्यवस्थापित करा →",
    viewFullscreenMap: "पूर्ण नकाशा पहा",
    resolveBtn: "निराकरण करा →",
    acknowledgeBtn: "स्वीकार करा",
    // AI Modal
    aiRecommendationTitle: "एआय ड्रायव्हर शिफारस इंजिन",
    aiRecommendationDesc: "सुरक्षा रेटिंग आणि जोखीम मॉडेलचे मूल्यांकन करते",
    cargoType: "कार्गो प्रकार",
    declaredValue: "घोषण मूल्य (रुपये)",
    tripPriority: "फेरी प्राधान्य",
    requiredSafetyLevel: "आवश्यक सुरक्षा पातळी",
    recommendedDriver: "शिफारस केलेला चालक",
    trustScore: "विश्वास स्कोर",
    // Driver Scores
    safetyScoreLabel: "सुरक्षा स्कोर",
    routeComplianceLabel: "मार्ग पालन स्कोर",
    drivingEfficiencyLabel: "ड्राइव्ह कार्यक्षमता स्कोर (प्रॉक्सी)*",
    reliabilityLabel: "विश्वासार्हता स्कोर",
    drivingEfficiencyNote: "* ड्राईव्ह कार्यक्षमता स्कोर वेग सुसंगततेवर आधारित पारदर्शक प्रॉक्सी आहे.",
    // Dashboard & Pages
    fleetSafetyHeader: "ताफा सुरक्षितता आणि पुरवठा साखळी",
    activeAlertFeed: "थेट अलर्ट फीड",
    registration: "नोंदणी क्रमांक",
    model: "मॉडेल",
    status: "स्थिती",
    maxAllowedWeight: "कमाल मंजूर वजन",
    currentWeight: "सध्याचे वजन",
    loadStatus: "लोड स्थिती",
    gasConcentration: "गॅस प्रमाण",
    alcoholSensor: "अल्कोहोल सेन्सर",
    overloadAlert: "ओवरलोड अलर्ट",
    safeLoad: "सुरक्षित लोड",
    abnormalGas: "⚠️ असामान्य",
    verifyRequire: "⚠️ तपासणी आवश्यक",
    normalState: "0 (सामान्य)",
    driverName: "चालकाचे नाव",
    licenseNumber: "परवाना क्रमांक",
    tripsCompleted: "पूर्ण झालेल्या फेऱ्या",
    totalViolations: "एकूण उल्लंघन",
    documentsManager: "कागदपत्र व्यवस्थापक",
    expiryDate: "मुदत समाप्ती",
    valid: "वैध",
    expired: "कालबाह्य",
    warning: "इशारा",
    tripOrigin: "प्रारंभ",
    tripDestination: "गंतव्य",
    cargoTypeLabel: "कार्गो प्रकार",
    // Driver Portal Specific
    driverPortal: "चालक पोर्टल",
    assignedVehicle: "नियुक्त वाहन",
    activeTrip: "सक्रिय फेरी",
    driverTrustScore: "चालक सुरक्षा विश्वास स्कोर",
    mySafetyScore: "माझा सुरक्षा विश्वास स्कोर",
    currentSpeedLimit: "सध्याचा वाहन वेग",
    alcoholSobrietySensor: "अल्कोहोल सेन्सर तपासणी",
    cargoAxleLoad: "कार्गो वजन स्थिती",
    liveRouteMap: "थेट मार्ग नकाशा",
    driverEmergencyChecklist: "चालक आणीबाणी यादी",
    sosEmergencyBtn: "एसओएस आणीबाणीसाठी दाबा",
    sosTriggerTitle: "🚨 एसओएस आणीबाणी ट्रिगर",
    sosTriggerDesc: "नियंत्रण कक्षास त्वरित सूचित करते.",
    preDepartureVerification: "प्रस्थानापूर्वी तपासणी",
    // Warehouse Specific
    warehouseTerminalTitle: "वेअरहाऊस आणि वेब्रिज लोडिंग टर्मिनल",
    warehouseTerminalSubtitle: "वेब्रिज वजन | कार्गो सील तपासणी | ओवरलोड रोखणे",
    axleLimit: "कमाल वजन मर्यादा",
    cargoTypeValue: "कार्गो प्रकार आणि मूल्य",
    declaredValueLabel: "घोषण मूल्य: ₹2.5 कोटी",
    containerRainSeal: "कंटेनर पाऊस सील",
    currentLoadingQueue: "सध्याची वेअरहाऊस लोडिंग रांग",
    cargoItem: "कार्गो वस्तू",
    reWeighScale: "पुन्हा वजन मोजा",
    weighbridgeScale: "वेब्रिज काटा",
    // TestBench Specific
    circuitScreenTitle: "इएसपी32 हार्डवेअर सर्किट स्क्रीन आणि सिग्नल",
    physicalHardwareSignals: "भौतिक हार्डवेअर सिग्नल",
    redAlertLed: "लाल अलर्ट एलईडी",
    greenSafeLed: "हिरवा सुरक्षित एलईडी",
    activeBuzzer: "सक्रिय बझर अलार्म",
    alarmActiveText: "अलार्म सक्रिय (2.4kHz)",
    customPayloadTitle: "कस्टम टेलिमेट्री जनरेटर",
    transmitTelemetryBtn: "बैकएंड कडे टेलिमेट्री पाठवा",
    // Page Specific Titles & Subtitles
    liveTrackingTitle: "थेट जीपीएस ट्रॅकिंग आणि मार्ग देखरेख",
    liveTrackingSubtitle: "स्थान, वेग आणि मार्ग सुसंगतता",
    gpsBreadcrumbHistory: "जीपीएस टेलिमेट्री इतिहास",
    selectTruck: "ट्रक निवडा",
    liveVehicleReadings: "थेट वाहन वाचन",
    currentSpeed: "सध्याचा वेग",
    coordinates: "अक्षंश-रेखांश",
    lastConnection: "शेवटचे कनेक्शन",
    cargoMonitoringTitle: "कार्गो आणि कंटेनर पर्यावरण देखरेख",
    cargoMonitoringSubtitle: "वजन, हवेची गुणवत्ता आणि पावसाच्या पाण्याची थेट माहिती",
    overloadDetected: "ओवरलोड आढळले",
    safeCapacity: "सुरक्षित क्षमता",
    weightLoadGauge: "वजन लोड गेज",
    mq135GasSensor: "एमक्यू135 गॅस सेन्सर",
    abnormalGasDesc: "असामान्य गॅस आढळला — तपासणी आवश्यक.",
    normalAirQuality: "सामान्य हवा गुणवत्ता",
    rainWaterIngress: "पाऊस / पाणी प्रवेश",
    rainDetected: "आढळले",
    drySeal: "सुरक्षित सील",
    waterIngressWarning: "पाणी प्रवेशाचा इशारा",
    tarpaulinSecure: "ताडपत्री सुरक्षित",
    humiditySensor: "आर्द्रता सेन्सर",
    fleetManagementTitle: "ताफा वाहने आणि उपकरणे",
    fleetManagementSubtitle: "ट्रक, ओबीडी उपकरणे आणि फर्मवेअर स्थिती",
    deviceId: "उपकरण आयडी",
    firmwareVersion: "फर्मवेअर आवृत्ती",
    batteryVoltage: "बॅटरी व्होल्टेज",
    hardwareStatus: "हार्डवेअर स्थिती",
    alertEngineTitle: "मध्यवर्ती ताफा अलर्ट इंजिन",
    alertEngineSubtitle: "ओवरलोड, अल्कोहोल आणि मार्ग विचलनाचा इतिहास",
    allSeverities: "सर्व पातळी",
    criticalOnly: "कमाल गंभीर (CRITICAL)",
    highOnly: "उच्च (HIGH)",
    mediumOnly: "मध्यम (MEDIUM)",
    severity: "गंभीरता",
    alertType: "अलर्ट प्रकार",
    truckDriver: "ट्रक / चालक",
    message: "संदेश",
    timestamp: "वेळ",
    resolutionAction: "निराकरण कृती",
    noAlertsFound: "निवडलेल्या फिल्टरनुसार अलर्ट आढळला नाही.",
    tripsTitle: "फेरी आणि मार्ग पारदर्शकता",
    tripsSubtitle: "सुरू असलेल्या फेऱ्या आणि चालकाची माहिती",
    planned: "नियोजित",
    inTransit: "मार्गावर",
    completed: "पूर्ण",
    origin: "प्रारंभ",
    destination: "गंतव्य",
    driver: "चालक",
    eta: "अंदाजे वेळ (ETA)",
    documentsTitle: "कागदपत्र व्यवस्थापक",
    documentsSubtitle: "आरसी, विमा आणि फिटनेस प्रमाणपत्रे",
    docType: "कागदपत्र प्रकार",
    docNumber: "क्रमांक",
    issuer: "प्राधिकरण",
    daysRemaining: "उरलेले दिवस",
    reportsTitle: "ताफा विश्लेषण अहवाल",
    reportsSubtitle: "सुरक्षा आणि फेऱ्यांचे सखोल विश्लेषण",
    testbenchTitle: "हार्डवेअर चाचणी बेंच",
    testbenchSubtitle: "सेंसर सिग्नल चाचणी आणि अलर्ट सिमुलेशन",
    injectOverload: "ओवरलोड घटना सिम्युलेट करा",
    injectAlcohol: "अल्કોહोल उल्लंघन सिम्युलेट करा",
    injectRain: "पाणी प्रवेश सिम्युलेट करा",
    injectGas: "गॅस वाढ सिम्युलेट करा",
    injectDeviation: "मार्ग विचलन सिम्युलेट करा",
    resetNormal: "सामान्य स्थिती रीसेट करा"
  },
  pa: {
    title: "ਭਾਰਤ ਲੋਡ ਰਕਸ਼ਕ",
    subtitle: "ਏਆਈ + ਆਈਓਟੀ ਫਲੀਟ ਸੁਰੱਖਿਆ ਅਤੇ ਡਰਾਈਵਰ ਬੁੱਧੀਮਤਾ",
    livePipelineActive: "ਲਾਈਵ ਪਾਈਪਲਾਈਨ ਸਰਗਰਮ",
    disconnected: "ਡਿਸਕਨੈਕਟ ਕੀਤਾ",
    currentRole: "ਮੌਜੂਦਾ ਭੂਮਿਕਾ",
    lightMode: "ਲਾਈਟ ਮੋਡ",
    darkMode: "ਡਾਰਕ ਮੋਡ",
    // Roles
    roleOwner: "ਟਰੱਕ ਫਲੀਟ ਮਾਲਕ",
    roleAdmin: "ਿਸਸਟਮ ਐਡਮਿਨ",
    roleLogisticsManager: "ਲੌਜਿਸਟਿਕਸ ਮੈਨੇਜਰ",
    roleDriver: "ਡਰਾਈਵਰ",
    roleWarehouse: "ਵੇਅਰਹਾਊਸ ਮੈਨੇਜਰ",
    // Tabs
    tabOverview: "ਸੰਖੇਪ",
    tabTracking: "ਲਾਈਵ ਨਕਸ਼ਾ",
    tabCargo: "ਕਾਰਗੋ ਅਤੇ ਲੋਡ",
    tabDriver: "ਡਰਾਈਵਰ ਬੁੱਧੀਮਤਾ",
    tabFleet: "ਫਲੀਟ ਅਤੇ ਉਪਕਰਣ",
    tabAlerts: "ਅਲਰਟ ਕੇਂਦਰ",
    tabTrips: "ਯਾਤਰਾਵਾਂ",
    tabDocuments: "ਦਸਤਾਵੇਜ਼",
    tabReports: "ਵਿਸ਼ਲੇਸ਼ਣ",
    tabTestbench: "ਹਾਰਡਵੇਅਰ ਟੈਸਟ ਬੈਂਚ",
    // KPIs & Subtitles
    activeTrucks: "ਸਰਗਰਮ ਟਰੱਕ",
    safeFleetStatus: "ਸੁਰੱਖਿਅਤ ਫਲੀਟ",
    alertTrucks: "ਅਲਰਟ ਟਰੱਕ",
    ongoingTrips: "ਚਲ ਰਹੀਆਂ ਯਾਤਰਾਵਾਂ",
    openAlerts: "ਖੁੱਲ੍ਹੇ ਅਲਰਟ",
    avgDriverScore: "ਔਸਤ ਡਰਾਈਵਰ ਟਰੱਸਟ ਸਕੋਰ",
    outOfFleetTrucks: "ਕੁੱਲ 3 ਟਰੱਕਾਂ ਵਿੱਚੋਂ",
    operatingWithinLimits: "ਸੁਰੱਖਿਆ ਸੀਮਾਵਾਂ ਦੇ ਅੰਦਰ ਚੱਲ ਰਿਹਾ",
    actionRequiredSub: "ਪ੍ਰਬੰਧਕ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ",
    activeCargoTransitsSub: "ਸਰਗਰਮ ਕਾਰਗੋ ਯਾਤਰਾਵਾਂ",
    criticalAlertsSub: "ਗੰਭੀਰ ਪੱਧਰ ਦੇ ਅਲਰਟ",
    driverSafetyIndexSub: "ਹਿਸਾਬ ਲਗਾਇਆ ਡਰਾਈਵਰ ਸੂਚਕਾਂਕ",
    // KPI Badges
    badgeOnline: "ਲਾਈਵ",
    badgeSafe: "ਸੁਰੱਖਿਅਤ",
    badgeActionReq: "ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ",
    badgeAllClear: "ਸਭ ਸਪੱਸ਼ਟ",
    badgeInTransit: "ਰਸਤੇ ਵਿੱਚ",
    badgeUnresolved: "ਅਣਸੁਲਝੇ",
    badgeCleared: "ਹੱਲ ਕੀਤਾ",
    badgeExplainableAi: "ਸਪੱਸ਼ਟ ਏਆਈ",
    badgeTopRated: "ਟੌਪ ਰੇਟਡ",
    badgeSafeSpeed: "ਸੁਰੱਖਿਅਤ ਗਤੀ",
    badgePassed: "ਪਾਸ ✓",
    badgeLegalLoad: "ਕਾਨੂਨੀ ਲੋਡ",
    badgeWeighed: "ਜੋਖਿਆ ਗਿਆ",
    badgeHighValue: "ਉੱਚ ਮੁੱਲ",
    badgeSecure: "ਸੁਰੱਖਿਅਤ",
    badgeOverloaded: "ਓਵਰਲੋਡ 🚨",
    badgeLoadCompliant: "ਭਾਰ ਅਨੁਕੂਲ ✓",
    // Map Legend
    normalTransit: "ਸਧਾਰਨ ਯਾਤਰਾ",
    alertOverloadEvent: "ਅਲਰਟ / ਓਵਰਲੋਡ / ਸ਼ਰਾਬ ਘਟਨਾ",
    // Buttons
    aiDispatchWizard: "ਏਆਈ ਡਰਾਈਵਰ ਚੋਣ ਵਿਜ਼ਾਰਡ",
    hardwareTestBench: "ਹਾਰਡਵੇਅਰ ਟੈਸਟ ਬੈਂਚ",
    recommendDriver: "ਡਰਾਈਵਰ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ",
    runAiRecommendation: "ਏਆਈ ਸਿਫਾਰਸ਼ ਚਲਾਓ",
    evaluatingDrivers: "ਡਰਾਈਵਰਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    assignDriverToTrip: "ਡਰਾਈਵਰ ਨਿਯੁਕਤ ਕਰੋ",
    manageFleet: "ਫਲੀਟ ਪ੍ਰਬੰਧਿਤ ਕਰੋ →",
    viewFullscreenMap: "ਪੂਰਾ ਨਕਸ਼ਾ ਵੇਖੋ",
    resolveBtn: "ਹੱਲ ਕਰੋ →",
    acknowledgeBtn: "ਪ੍ਰਵਾਨ ਕਰੋ",
    // AI Modal
    aiRecommendationTitle: "ਏਆਈ ਡਰਾਈਵਰ ਸਿਫਾਰਸ਼ ਇੰਜਣ",
    aiRecommendationDesc: "ਸੁਰੱਖਿਆ ਰੇਟਿੰਗਾਂ ਅਤੇ ਜੋਖਮ ਮਾਡਲਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰਦਾ ਹੈ",
    cargoType: "ਕਾਰਗੋ ਕਿਸਮ",
    declaredValue: "ਘੋਸ਼ਿਤ ਮੁੱਲ (ਰੁਪਏ)",
    tripPriority: "ਯਾਤਰਾ ਪ੍ਰਾਥਮਿਕਤਾ",
    requiredSafetyLevel: "ਲੋੜੀਂਦਾ ਸੁਰੱਖਿਆ ਪੱਧਰ",
    recommendedDriver: "ਸਿਫਾਰਸ਼ੀ ਡਰਾਈਵਰ",
    trustScore: "ਟਰੱਸਟ ਸਕੋਰ",
    // Driver Scores
    safetyScoreLabel: "ਸੁਰੱਖਿਆ ਸਕੋਰ",
    routeComplianceLabel: "ਰੂਟ ਪਾਲਣਾ ਸਕੋਰ",
    drivingEfficiencyLabel: "ਡਰਾਈਵਿੰਗ ਕੁਸ਼ਲਤਾ ਸਕੋਰ (ਪ੍ਰੋਕਸੀ)*",
    reliabilityLabel: "ਭਰੋਸੇਯੋਗਤਾ ਸਕੋਰ",
    drivingEfficiencyNote: "* ਡਰਾਈਵਿੰਗ ਕੁਸ਼ਲਤਾ ਸਕੋਰ ਗਤੀ ਦੀ ਸਥਿਰਤਾ 'ਤੇ ਅਧਾਰਤ ਇੱਕ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰੋਕਸੀ ਹੈ।",
    // Dashboard & Pages
    fleetSafetyHeader: "ਫਲੀਟ ਸੁਰੱਖਿਆ ਡੈਸ਼ਬੋਰਡ",
    activeAlertFeed: "ਸਰਗਰਮ ਅਲਰਟ ਫੀਡ",
    registration: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ",
    model: "ਮਾਡਲ",
    status: "ਸਥਿਤੀ",
    maxAllowedWeight: "ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਰ",
    currentWeight: "ਮੌਜੂਦਾ ਭਾਰ",
    loadStatus: "ਲੋਡ ਸਥਿਤੀ",
    gasConcentration: "ਗੈਸ ਦੀ ਮਾਤਰਾ",
    alcoholSensor: "ਸ਼ਰਾਬ ਸੈਂਸਰ",
    overloadAlert: "ਓਵਰਲੋਡ ਅਲਰਟ",
    safeLoad: "ਸੁਰੱਖਿਅਤ ਲੋਡ",
    abnormalGas: "⚠️ ਅਸਧਾਰਨ",
    verifyRequire: "⚠️ ਜਾਂਚ ਦੀ ਲੋੜ",
    normalState: "0 (ਸਧਾਰਨ)",
    driverName: "ਡਰਾਈਵਰ ਦਾ ਨਾਮ",
    licenseNumber: "ਲਾਇਸੈਂਸ ਨੰਬਰ",
    tripsCompleted: "ਪੂਰੀਆਂ ਹੋਈਆਂ ਯਾਤਰਾਵਾਂ",
    totalViolations: "ਕੁੱਲ ਉਲੰਘਣਾਵਾਂ",
    documentsManager: "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਬੰਧਕ",
    expiryDate: "ਮਿਆਦ ਪੁੱਗਣ ਦੀ ਮਿਤੀ",
    valid: "ਜਾਇਜ਼",
    expired: "ਮਿਆਦ ਪੁੱਗੀ",
    warning: "ਚੇਤਾਵਨੀ",
    tripOrigin: "ਸ਼ੁਰੂਆਤ",
    tripDestination: "ਮੰਜ਼ਿਲ",
    cargoTypeLabel: "ਕਾਰਗੋ ਕਿਸਮ",
    // Driver Portal Specific
    driverPortal: "ਡਰਾਈਵਰ ਪੋਰਟਲ",
    assignedVehicle: "ਨਿਯੁਕਤ ਵਾਹਨ",
    activeTrip: "ਚਲ ਰਹੀ ਯਾਤਰਾ",
    driverTrustScore: "ਡਰਾਈਵਰ ਸੁਰੱਖਿਆ ਟਰੱਸਟ ਸਕੋਰ",
    mySafetyScore: "ਮੇਰਾ ਸੁਰੱਖਿਆ ਟਰੱਸਟ ਸਕੋਰ",
    currentSpeedLimit: "ਮੌਜੂਦਾ ਗਤੀ",
    alcoholSobrietySensor: "ਸ਼ਰਾਬ ਸੈਂਸਰ ਜਾਂਚ",
    cargoAxleLoad: "ਕਾਰਗੋ ਭਾਰ ਸਥਿਤੀ",
    liveRouteMap: "ਲਾਈਵ ਰੂਟ ਨਕਸ਼ਾ",
    driverEmergencyChecklist: "ਡਰਾਈਵਰ ਐਮਰਜੈਂਸੀ ਸੂਚੀ",
    sosEmergencyBtn: "ਐਸਓਐਸ ਐਮਰਜੈਂਸੀ ਲਈ ਦਬਾਓ",
    sosTriggerTitle: "🚨 ਐਸਓਐਸ ਐਮਰਜੈਂਸੀ ਟ੍ਰਿਗਰ",
    sosTriggerDesc: "ਕੰਟਰੋਲ ਰੂਮ ਅਤੇ ਪ੍ਰਬੰਧਕ ਨੂੰ ਤੁਰੰਤ ਸੂਚਿਤ ਕਰਦਾ ਹੈ।",
    preDepartureVerification: "ਸ਼ੁਰੂਆਤ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ",
    // Warehouse Specific
    warehouseTerminalTitle: "ਵੇਅਰਹਾਊਸ ਅਤੇ ਵੇਅਬ੍ਰਿਜ ਲੋਡਿੰਗ ਟਰਮੀਨਲ",
    warehouseTerminalSubtitle: "ਵੇਅਬ੍ਰਿਜ ਭਾਰ | ਕਾਰਗੋ ਸੀਲ ਜਾਂਚ | ਓਵਰਲੋਡ ਰੋਕਥਾਮ",
    axleLimit: "ਐਕਸਲ ਸੀਮਾ",
    cargoTypeValue: "ਕਾਰਗੋ ਕਿਸਮ ਅਤੇ ਮੁੱਲ",
    declaredValueLabel: "ਘੋਸ਼ਿਤ ਮੁੱਲ: ₹2.5 ਕਰੋੜ",
    containerRainSeal: "ਕੰਟੇਨਰ ਮੀਂਹ ਸੀਲ",
    currentLoadingQueue: "ਮੌਜੂਦਾ ਵੇਅਰਹਾਊਸ ਲੋਡਿੰਗ ਲਾਈਨ",
    cargoItem: "ਕਾਰਗੋ ਵਸਤੂ",
    reWeighScale: "ਦੁਬਾਰਾ ਭਾਰ ਜੋਖੋ",
    weighbridgeScale: "ਵੇਅਬ੍ਰਿਜ ਕਾਂਟਾ",
    // TestBench Specific
    circuitScreenTitle: "ਈਐਸਪੀ32 ਹਾਰਡਵੇਅਰ ਸਰਕਟ ਸਕ੍ਰੀਨ ਅਤੇ ਸਿਗਨਲ",
    physicalHardwareSignals: "ਭੌਤਿਕ ਹਾਰਡਵੇਅਰ ਸਿਗਨਲ",
    redAlertLed: "ਲਾਲ ਅਲਰਟ ਐਲਈਡੀ",
    greenSafeLed: "ਹਰਾ ਸੁਰੱਖਿਅਤ ਐਲਈਡੀ",
    activeBuzzer: "ਸਰਗਰਮ ਬਜ਼ਰ ਅਲਾਰਮ",
    alarmActiveText: "ਅਲਾਰਮ ਸਰਗਰਮ (2.4kHz)",
    customPayloadTitle: "ਕਸਟਮ ਟੈਲੀਮੈਟਰੀ ਜਨਰੇਟਰ",
    transmitTelemetryBtn: "ਬੈਕਐਂਡ ਨੂੰ ਟੈਲੀਮੈਟਰੀ ਭੇਜੋ",
    // Page Specific Titles & Subtitles
    liveTrackingTitle: "ਲਾਈਵ ਜੀਪੀਐਸ ਟ੍ਰੈਕਿੰਗ",
    liveTrackingSubtitle: "ਸਥਾਨ, ਗਤੀ ਅਤੇ ਰੂਟ ਪਾਲਣਾ",
    gpsBreadcrumbHistory: "ਜੀਪੀਐਸ ਟੈਲੀਮੈਟਰੀ ਇਤਿਹਾਸ",
    selectTruck: "ਟਰੱਕ ਚੁਣੋ",
    liveVehicleReadings: "ਲਾਈਵ ਵਾਹਨ ਰੀਡਿੰਗ",
    currentSpeed: "ਮੌਜੂਦਾ ਗਤੀ",
    coordinates: "ਨਿਰਦੇਸ਼ਾਂਕ",
    lastConnection: "ਆਖਰੀ ਕਨੈਕਸ਼ਨ",
    cargoMonitoringTitle: "ਕਾਰਗੋ ਅਤੇ ਕੰਟੇਨਰ ਵਾਤਾਵਰਣ ਨਿਗਰਾਨੀ",
    cargoMonitoringSubtitle: "ਭਾਰ, ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਮੀਂਹ ਦੀ ਜਾਣਕਾਰੀ",
    overloadDetected: "ਓਵਰਲੋਡ ਮਿਲਿਆ",
    safeCapacity: "ਸੁਰੱਖਿਅਤ ਸਮਰੱਥਾ",
    weightLoadGauge: "ਭਾਰ ਲੋਡ ਗੇਜ",
    mq135GasSensor: "ਐਮਕਿਊ135 ਗੈਸ ਸੈਂਸਰ",
    abnormalGasDesc: "ਅਸਧਾਰਨ ਗੈਸ ਮਿਲੀ — ਜਾਂਚ ਲੋੜੀਂਦੀ।",
    normalAirQuality: "ਸਧਾਰਨ ਹਵਾ ਗੁਣਵੱਤਾ",
    rainWaterIngress: "ਮੀਂਹ / ਪਾਣੀ ਪ੍ਰਵੇਸ਼",
    rainDetected: "ਮਿਲਿਆ",
    drySeal: "ਸੁਰੱਖਿਅਤ ਸੀਲ",
    waterIngressWarning: "ਪਾਣੀ ਪ੍ਰਵੇਸ਼ ਦੀ ਚੇਤਾਵਨੀ",
    tarpaulinSecure: "ਤ੍ਰਿਪਾਲ ਸੁਰੱਖਿਅਤ",
    humiditySensor: "ਨਮੀ ਸੈਂਸਰ",
    fleetManagementTitle: "ਫਲੀਟ ਵਾਹਨ ਅਤੇ ਉਪਕਰਣ",
    fleetManagementSubtitle: "ਟਰੱਕ ਅਤੇ ਸੈਂਸਰ ਪ੍ਰਬੰਧਨ",
    deviceId: "ਉਪਕਰਣ ਆਈਡੀ",
    firmwareVersion: "ਫਰਮਵੇਅਰ ਸੰਸਕਰਣ",
    batteryVoltage: "ਬੈਟਰੀ ਵੋਲਟੇਜ",
    hardwareStatus: "ਹਾਰਡਵੇਅਰ ਸਥਿਤੀ",
    alertEngineTitle: "ਕੇਂਦਰੀ ਅਲਰਟ ਇੰਜਣ",
    alertEngineSubtitle: "ਓਵਰਲੋਡ ਅਤੇ ਸੁਰੱਖਿਆ ਅਲਰਟ ਇਤਿਹਾਸ",
    allSeverities: "ਸਾਰੇ ਪੱਧਰ",
    criticalOnly: "ਗੰਭੀਰ (CRITICAL)",
    highOnly: "ਉੱਚ (HIGH)",
    mediumOnly: "ਮੱਧਮ (MEDIUM)",
    severity: "ਗੰਭੀਰਤਾ",
    alertType: "ਅਲਰਟ ਕਿਸਮ",
    truckDriver: "ਟਰੱਕ / ਡਰਾਈਵਰ",
    message: "ਸੰਦੇਸ਼",
    timestamp: "ਸਮਾਂ",
    resolutionAction: "ਹੱਲ ਕਾਰਵਾਈ",
    noAlertsFound: "ਕੋਈ ਅਲਰਟ ਨਹੀਂ ਮਿਲਿਆ।",
    tripsTitle: "ਯਾਤਰਾ ਅਤੇ ਰੂਟ ਪ੍ਰਬੰਧਨ",
    tripsSubtitle: "ਚਲ ਰਹੀਆਂ ਯਾਤਰਾਵਾਂ ਅਤੇ ਸਮਾਂ-ਸਾਰਣੀ",
    planned: "ਯੋਜਨਾਬੱਧ",
    inTransit: "ਰਸਤੇ ਵਿੱਚ",
    completed: "ਪੂਰੀ",
    origin: "ਸ਼ੁਰੂਆਤ",
    destination: "ਮੰਜ਼ਿਲ",
    driver: "ਡਰਾਈਵਰ",
    eta: "ਅੰਦਾਜ਼ਨ ਸਮਾਂ (ETA)",
    documentsTitle: "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਬੰਧਕ",
    documentsSubtitle: "ਆਰਸੀ, ਬੀਮਾ ਅਤੇ ਫਿਟਨੈਸ ਸਰਟੀਫਿਕੇਟ",
    docType: "ਕਿਸਮ",
    docNumber: "ਨੰਬਰ",
    issuer: "ਅਥਾਰਟੀ",
    daysRemaining: "ਬਾਕੀ ਦਿਨ",
    reportsTitle: "ਫਲੀਟ ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟਾਂ",
    reportsSubtitle: "ਸੁਰੱਖਿਆ ਅਤੇ ਯਾਤਰਾਵਾਂ ਦਾ ਡੂੰਘਾ ਵਿਸ਼ਲੇਸ਼ਣ",
    testbenchTitle: "ਹਾਰਡਵੇਅਰ ਟੈਸਟ ਬੈਂਚ",
    testbenchSubtitle: "ਸੈਂਸਰ ਸਿਗਨਲ ਜਾਂਚ",
    injectOverload: "ਓਵਰਲੋਡ ਸਿਮੂਲੇਟ ਕਰੋ",
    injectAlcohol: "ਸ਼ਰਾਬ ਉਲੰਘਣਾ ਸਿਮੂਲੇਟ ਕਰੋ",
    injectRain: "ਪਾਣੀ ਪ੍ਰਵੇਸ਼ ਸਿਮੂਲੇਟ ਕਰੋ",
    injectGas: "ਗੈਸ ਵਾਧਾ ਸਿਮੂਲੇਟ ਕਰੋ",
    injectDeviation: "ਰੂਟ ਭਟਕਣਾ ਸਿਮੂਲੇਟ ਕਰੋ",
    resetNormal: "ਸਧਾਰਨ ਸਥਿਤੀ ਰੀਸੈਟ ਕਰੋ"
  }
};

// Alert Message Translation Helper Function
export function getLocalizedAlertMessage(msg: string, lang: Language): string {
  if (!msg) return '';
  if (lang === 'en') return msg;

  if (msg.includes('Abnormal Gas Concentration')) {
    if (lang === 'hi') return 'असामान्य गैस सांद्रता पाई गई — निरीक्षण आवश्यक।';
    if (lang === 'mr') return 'असामान्य गॅस आढळला — तपासणी आवश्यक.';
    if (lang === 'pa') return 'ਅਸਧਾਰਨ ਗੈਸ ਮਿਲੀ — ਜਾਂਚ ਲੋੜੀਂਦੀ।';
  }
  if (msg.includes('overloaded!')) {
    if (lang === 'hi') return 'ट्रक ओवरलोड पाया गया! सुरक्षा सीमा से अधिक भार।';
    if (lang === 'mr') return 'ट्रक ओवरलोड आढळला! सुरक्षेपेक्षा जास्त वजन.';
    if (lang === 'pa') return 'ਟਰੱਕ ਓਵਰਲੋਡ ਮਿਲਿਆ! ਸੁਰੱਖਿਆ ਸੀਮਾ ਤੋਂ ਵੱਧ ਭਾਰ।';
  }
  if (msg.includes('Route deviation')) {
    if (lang === 'hi') return 'मार्ग विचलन पाया गया! वाहन स्वीकृत मार्ग से दूर है।';
    if (lang === 'mr') return 'मार्ग विचलन आढळले! वाहन मंजूर मार्गापासून दूर आहे.';
    if (lang === 'pa') return 'ਰੂਟ ਭਟਕਣਾ ਮਿਲੀ! ਵਾਹਨ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਰੂਟ ਤੋਂ ਦੂਰ ਹੈ।';
  }
  if (msg.includes('Alcohol sensor threshold')) {
    if (lang === 'hi') return 'अल्कोहल सेंसर सीमा पार हुई — सत्यापन आवश्यक।';
    if (lang === 'mr') return 'अल्कोहोल सेन्सर मर्यादा ओलांडली — तपासणी आवश्यक.';
    if (lang === 'pa') return 'ਸ਼ਰਾਬ ਸੈਂਸਰ ਸੀਮਾ ਪਾਰ ਹੋਈ — ਜਾਂਚ ਲੋੜੀਂਦੀ।';
  }
  if (msg.includes('Water Ingress Detected')) {
    if (lang === 'hi') return 'कंटेनर कवर पर पानी प्रवेश पाया गया! वर्षा चेतावनी।';
    if (lang === 'mr') return 'कंटेनरवर पाणी प्रवेश आढळला! पावसाचा इशारा.';
    if (lang === 'pa') return "ਕੰਟੇਨਰ 'ਤੇ ਪਾਣੀ ਪ੍ਰਵੇਸ਼ ਮਿਲਿਆ! ਮੀਂਹ ਚੇਤਾਵਨੀ।";
  }

  return msg;
}
