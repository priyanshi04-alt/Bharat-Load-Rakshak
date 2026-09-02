using { bharat.load.rakshak as db } from '../db/schema';

service FleetService @(path:'/odata/v4/fleet') {

  entity Companies as projection on db.Companies;
  entity Users as projection on db.Users;
  entity Drivers as projection on db.Drivers;
  entity Trucks as projection on db.Trucks;
  entity Devices as projection on db.Devices;
  entity Cargo as projection on db.Cargo;
  entity Trips as projection on db.Trips;
  entity Telemetry as projection on db.Telemetry;
  entity Alerts as projection on db.Alerts;
  entity DriverPerformances as projection on db.DriverPerformances;
  entity DriverRatings as projection on db.DriverRatings;
  entity VehicleDocuments as projection on db.VehicleDocuments;
  entity MaintenanceRecords as projection on db.MaintenanceRecords;
  entity Notifications as projection on db.Notifications;
  entity HardwareCommands as projection on db.HardwareCommands;

  type FleetSummary {
    totalTrucks      : Integer;
    activeTrucks     : Integer;
    safeTrucks       : Integer;
    alertTrucks      : Integer;
    ongoingTrips     : Integer;
    completedTrips   : Integer;
    openAlerts       : Integer;
    criticalAlerts   : Integer;
    averageTrustScore: Double;
  }

  type DriverRecommendation {
    recommendedDriverId   : String;
    driverName            : String;
    overallTrustScore     : Double;
    safetyScore           : Double;
    routeComplianceScore  : Double;
    drivingEfficiencyScore: Double;
    reliabilityScore      : Double;
    recommendationReason  : String;
    isMlRecommendation    : Boolean;
  }

  function getFleetSummary() returns FleetSummary;
  
  action recommendDriver(
    cargoType           : String,
    cargoValue          : Double,
    destination         : String,
    priority            : String,
    requiredSafetyLevel : String
  ) returns DriverRecommendation;

  action acknowledgeAlert(alertId: String, acknowledgedBy: String) returns Alerts;
  action resolveAlert(alertId: String) returns Alerts;
  
  action sendHardwareCommand(
    deviceId    : String,
    truckId     : String,
    commandType : String,
    parameter   : String
  ) returns HardwareCommands;
}
