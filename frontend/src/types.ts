export type UserRole = 'ADMIN' | 'OWNER' | 'LOGISTICS_MANAGER' | 'DRIVER' | 'WAREHOUSE_USER';

export interface Truck {
  truckId: string;
  companyId: string;
  registrationNumber: string;
  model: string;
  maximumAllowedWeightKg: number;
  currentStatus: 'AVAILABLE' | 'ON_TRIP' | 'IDLE' | 'ALERT' | 'OFFLINE' | 'MAINTENANCE';
  assignedDriverId?: string;
  deviceId: string;
  insuranceExpiry?: string;
  pucExpiry?: string;
  fitnessExpiry?: string;
  permitExpiry?: string;
  lastMaintenanceDate?: string;
}

export interface Driver {
  driverId: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'INACTIVE';
  safetyScore: number;
  routeComplianceScore: number;
  drivingEfficiencyScore: number; // Proxy score
  reliabilityScore: number;
  overallTrustScore: number;
  tripsCompleted: number;
  totalViolations: number;
}

export interface Device {
  deviceId: string;
  truckId: string;
  firmwareVersion: string;
  lastSeen: string;
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  batteryVoltage: number;
}

export interface Telemetry {
  ID?: string;
  deviceId: string;
  truckId: string;
  tripId?: string;
  timestamp: string;
  weightKg: number;
  humidityPercent: number;
  rainDetected: boolean;
  gasValue: number;
  alcoholValue: number;
  latitude: number;
  longitude: number;
  speedKmph: number;
  isDemoData?: boolean;
}

export interface Alert {
  ID: string;
  type: 'OVERLOAD' | 'ALCOHOL_THRESHOLD' | 'ROUTE_DEVIATION' | 'OVERSPEED' | 'WATER_INGRESS' | 'HIGH_HUMIDITY' | 'ABNORMAL_GAS' | 'DOCUMENT_EXPIRY' | 'DEVICE_OFFLINE';
  truckId: string;
  driverId?: string;
  tripId?: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  isDemoData?: boolean;
}

export interface Cargo {
  cargoId: string;
  description: string;
  cargoType: 'HAZARDOUS' | 'PERISHABLE' | 'GENERAL' | 'HIGH_VALUE';
  weightKg: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requiredSafetyLevel: 'STANDARD' | 'HIGH' | 'MAXIMUM';
  declaredValue: number;
}

export interface Trip {
  tripId: string;
  truckId: string;
  driverId: string;
  cargoId: string;
  origin: string;
  destination: string;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
  routeToleranceKm?: number;
  status: 'PLANNED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  eta: string;
}

export interface VehicleDocument {
  ID: string;
  truckId: string;
  documentType: 'RC' | 'INSURANCE' | 'PUC' | 'FITNESS' | 'PERMIT' | 'DRIVER_LICENSE';
  documentNumber: string;
  expiryDate: string;
  status: 'VALID' | 'WARNING_30' | 'WARNING_15' | 'WARNING_7' | 'EXPIRED';
  fileUrl?: string;
  fileName?: string;
}

export interface FleetSummary {
  totalTrucks: number;
  activeTrucks: number;
  safeTrucks: number;
  alertTrucks: number;
  ongoingTrips: number;
  completedTrips: number;
  openAlerts: number;
  criticalAlerts: number;
  averageTrustScore: number;
}

export interface HardwareCommand {
  ID?: string;
  deviceId: string;
  truckId: string;
  commandType: 'BUZZER_ON' | 'BUZZER_OFF' | 'LED_RED' | 'LED_GREEN' | 'LCD_ALERT';
  parameter: string;
  status: string;
  timestamp: string;
}
