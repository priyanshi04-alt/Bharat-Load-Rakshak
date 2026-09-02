namespace bharat.load.rakshak;

using { managed, cuid } from '@sap/cds/common';

entity Companies : managed {
  key companyId   : String(36);
      name        : String(100);
      email       : String(100);
      phone       : String(20);
      address     : String(255);
      trucks      : Association to many Trucks on trucks.companyId = $self.companyId;
      drivers     : Association to many Drivers on drivers.companyId = $self.companyId;
}

entity Users : managed {
  key userId    : String(36);
      username  : String(50);
      email     : String(100);
      role      : String(30); // ADMIN, OWNER, LOGISTICS_MANAGER, DRIVER, WAREHOUSE_USER
      companyId : String(36);
      name      : String(100);
}

entity Drivers : managed {
  key driverId               : String(36);
      companyId              : String(36);
      name                   : String(100);
      licenseNumber          : String(50);
      phone                  : String(20);
      status                 : String(20); // AVAILABLE, ON_TRIP, INACTIVE
      licenseExpiryDate      : Date;
      safetyScore            : Double default 100;
      routeComplianceScore   : Double default 100;
      drivingEfficiencyScore : Double default 100; // Proxy score based on speed consistency, route efficiency, trip duration
      reliabilityScore       : Double default 100;
      overallTrustScore      : Double default 100;
      tripsCompleted         : Integer default 0;
      totalViolations        : Integer default 0;
      trips                  : Association to many Trips on trips.driverId = $self.driverId;
      performance            : Association to many DriverPerformances on performance.driverId = $self.driverId;
}

entity Trucks : managed {
  key truckId                : String(36);
      companyId              : String(36);
      registrationNumber     : String(20);
      model                  : String(50);
      maximumAllowedWeightKg : Double;
      currentStatus          : String(20); // AVAILABLE, ON_TRIP, IDLE, ALERT, OFFLINE, MAINTENANCE
      assignedDriverId       : String(36);
      deviceId               : String(36);
      insuranceExpiry        : Date;
      pucExpiry              : Date;
      fitnessExpiry          : Date;
      permitExpiry           : Date;
      lastMaintenanceDate    : Date;
      device                 : Association to Devices on device.deviceId = deviceId;
      trips                  : Association to many Trips on trips.truckId = $self.truckId;
      telemetryHistory       : Association to many Telemetry on telemetryHistory.truckId = $self.truckId;
      documents              : Association to many VehicleDocuments on documents.truckId = $self.truckId;
}

entity Devices : managed {
  key deviceId         : String(36);
      truckId          : String(36);
      firmwareVersion  : String(20);
      lastSeen         : Timestamp;
      connectionStatus : String(20); // ONLINE, OFFLINE, DEGRADED
      batteryVoltage   : Double default 5.0;
}

entity Cargo : managed {
  key cargoId             : String(36);
      description         : String(255);
      cargoType           : String(50); // HAZARDOUS, PERISHABLE, GENERAL, HIGH_VALUE
      weightKg            : Double;
      priority            : String(20); // LOW, MEDIUM, HIGH, CRITICAL
      requiredSafetyLevel : String(20); // STANDARD, HIGH, MAXIMUM
      declaredValue       : Double;
}

entity Trips : managed {
  key tripId           : String(36);
      truckId          : String(36);
      driverId         : String(36);
      cargoId          : String(36);
      origin           : String(100);
      destination      : String(100);
      originLat        : Double;
      originLng        : Double;
      destLat          : Double;
      destLng          : Double;
      routeToleranceKm : Double default 5.0;
      status           : String(20); // PLANNED, IN_TRANSIT, COMPLETED, CANCELLED
      startTime        : Timestamp;
      endTime          : Timestamp;
      eta              : Timestamp;
      truck            : Association to Trucks on truck.truckId = truckId;
      driver           : Association to Drivers on driver.driverId = driverId;
      cargo            : Association to Cargo on cargo.cargoId = cargoId;
      telemetry        : Association to many Telemetry on telemetry.tripId = $self.tripId;
      alerts           : Association to many Alerts on alerts.tripId = $self.tripId;
}

entity Telemetry : cuid, managed {
  deviceId        : String(36);
  truckId         : String(36);
  tripId          : String(36);
  timestamp       : Timestamp;
  weightKg        : Double;
  humidityPercent : Double;
  rainDetected    : Boolean;
  gasValue        : Double;
  alcoholValue    : Double;
  latitude        : Double;
  longitude       : Double;
  speedKmph       : Double;
  isDemoData      : Boolean default false;
}

entity Alerts : cuid, managed {
  type           : String(40); // OVERLOAD, ALCOHOL_THRESHOLD, ROUTE_DEVIATION, OVERSPEED, WATER_INGRESS, HIGH_HUMIDITY, ABNORMAL_GAS, DOCUMENT_EXPIRY, DEVICE_OFFLINE
  truckId        : String(36);
  driverId       : String(36);
  tripId         : String(36);
  timestamp      : Timestamp;
  severity       : String(20); // LOW, MEDIUM, HIGH, CRITICAL
  message        : String(255);
  status         : String(20); // OPEN, ACKNOWLEDGED, RESOLVED
  acknowledgedBy : String(50);
  acknowledgedAt : Timestamp;
  resolvedAt     : Timestamp;
  isDemoData     : Boolean default false;
}

entity DriverPerformances : cuid, managed {
  driverId             : String(36);
  tripId               : String(36);
  safetyScore          : Double;
  routeComplianceScore : Double;
  drivingEfficiencyScore: Double;
  reliabilityScore     : Double;
  overallScore         : Double;
  evaluationDate       : Date;
  violationsCount      : Integer;
  remarks              : String(255);
}

entity DriverRatings : cuid, managed {
  driverId   : String(36);
  tripId     : String(36);
  ratedBy    : String(50);
  rating     : Double; // 1.0 to 5.0
  feedback   : String(255);
}

entity VehicleDocuments : cuid, managed {
  truckId        : String(36);
  documentType   : String(30); // RC, INSURANCE, PUC, FITNESS, PERMIT, DRIVER_LICENSE
  documentNumber : String(50);
  expiryDate     : Date;
  status         : String(20); // VALID, WARNING_30, WARNING_15, WARNING_7, EXPIRED
}

entity MaintenanceRecords : cuid, managed {
  truckId         : String(36);
  maintenanceDate : Date;
  type            : String(50);
  description     : String(255);
  cost            : Double;
  servicedBy      : String(100);
}

entity Notifications : cuid, managed {
  userId    : String(36);
  title     : String(100);
  message   : String(255);
  type      : String(30);
  isRead    : Boolean default false;
  timestamp : Timestamp;
}

entity HardwareCommands : cuid, managed {
  deviceId    : String(36);
  truckId     : String(36);
  commandType : String(30); // BUZZER_ON, BUZZER_OFF, LED_RED, LED_GREEN, LCD_ALERT
  parameter   : String(100);
  status      : String(20); // PENDING, DISPATCHED, EXECUTED, FAILED
  timestamp   : Timestamp;
}
