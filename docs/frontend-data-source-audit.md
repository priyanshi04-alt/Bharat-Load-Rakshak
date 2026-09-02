# Frontend Data Source Audit - BHARAT LOAD RAKSHAK

This document traces every visual element on the React + TypeScript frontend dashboard to its authoritative backend source of truth.

---

## Metric & Component Data Lineage Table

| UI Element / Metric | Display Page / Component | API Endpoint | Backend Service Handler | Database Entity Source | Hardcoded / Mock Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Active Trucks Count** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` or `/odata/v4/fleet/getFleetSummary()` | `cat-service.js` -> `getFleetSummary` | `Trucks` (where `currentStatus` IN ('ON_TRIP', 'AVAILABLE')) | **VERIFIED API BACKED** (0 hardcoded values) |
| **Safe Trucks Count** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` | `cat-service.js` | `Trucks` (where `currentStatus` = 'AVAILABLE' or 'ON_TRIP') | **VERIFIED API BACKED** |
| **Alert Trucks Count** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` | `cat-service.js` | `Trucks` (where `currentStatus` = 'ALERT') | **VERIFIED API BACKED** |
| **Ongoing Trips Count** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` | `cat-service.js` | `Trips` (where `status` = 'IN_TRANSIT') | **VERIFIED API BACKED** |
| **Open Alerts Count** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` | `cat-service.js` | `Alerts` (where `status` = 'OPEN') | **VERIFIED API BACKED** |
| **Avg Driver Trust Score** | Dashboard Overview / `StatCard` | `GET /api/fleet/summary` | `cat-service.js` | `Drivers` (avg of `overallTrustScore`) | **VERIFIED API BACKED** |
| **Live Truck Positions** | Live Fleet Map / `LiveFleetMap` | `GET /odata/v4/fleet/Telemetry` + WebSocket `TELEMETRY_UPDATE` | `cat-service.js` & `websocket-server.js` | `Telemetry` (`latitude`, `longitude`, `speedKmph`) | **VERIFIED TELEMETRY STREAMS** |
| **Load Cell Weight (kg)** | Cargo & Load / `CargoMonitoringPage` | `GET /odata/v4/fleet/Telemetry` + WebSocket `TELEMETRY_UPDATE` | `alert-engine.js` | `Telemetry` (`weightKg`) vs `Trucks.maximumAllowedWeightKg` | **VERIFIED REAL-TIME TELEMETRY** |
| **MQ135 Gas Reading** | Cargo & Load / `CargoMonitoringPage` | `GET /odata/v4/fleet/Telemetry` | `alert-engine.js` | `Telemetry` (`gasValue`) | **VERIFIED REAL-TIME TELEMETRY** |
| **Rain Ingress Status** | Cargo & Load / `CargoMonitoringPage` | `GET /odata/v4/fleet/Telemetry` | `alert-engine.js` | `Telemetry` (`rainDetected`) | **VERIFIED REAL-TIME TELEMETRY** |
| **MQ3 Alcohol Reading** | Dashboard Overview & Alert Center | `GET /odata/v4/fleet/Telemetry` | `alert-engine.js` | `Telemetry` (`alcoholValue`) | **VERIFIED REAL-TIME TELEMETRY** |
| **Overall Trust Score** | Driver Intelligence / `DriverIntelligencePage` | `GET /odata/v4/fleet/Drivers` | `driver-scoring.js` | `Drivers` (`overallTrustScore`) | **VERIFIED BACKEND CALCULATED** |
| **Safety Score** | Driver Intelligence / `DriverIntelligencePage` | `GET /odata/v4/fleet/Drivers` | `driver-scoring.js` | `Drivers` (`safetyScore`) | **VERIFIED BACKEND CALCULATED** |
| **Route Compliance Score**| Driver Intelligence / `DriverIntelligencePage` | `GET /odata/v4/fleet/Drivers` | `driver-scoring.js` | `Drivers` (`routeComplianceScore`) | **VERIFIED BACKEND CALCULATED** |
| **Driving Efficiency Score**| Driver Intelligence / `DriverIntelligencePage` | `GET /odata/v4/fleet/Drivers` | `driver-scoring.js` (Proxy) | `Drivers` (`drivingEfficiencyScore`) | **VERIFIED PROXY BACKED** |
| **Reliability Score** | Driver Intelligence / `DriverIntelligencePage` | `GET /odata/v4/fleet/Drivers` | `driver-scoring.js` | `Drivers` (`reliabilityScore`) | **VERIFIED BACKEND CALCULATED** |
| **AI Driver Recommendation**| AI Dispatch Wizard Modal | `POST /odata/v4/fleet/recommendDriver` | `driver-scoring.js` / Python ML | `Drivers` + Scikit-Learn Model | **VERIFIED API & ML SERVICE** |
| **Alert Feed & Severity** | Alert Center / `AlertCenterPage` | `GET /odata/v4/fleet/Alerts` | `cat-service.js` | `Alerts` (`ID`, `type`, `severity`, `status`) | **VERIFIED API BACKED** |
| **Alert Resolution Action**| Alert Center / `AlertCenterPage` | `POST /odata/v4/fleet/resolveAlert` | `cat-service.js` -> `resolveAlert` | `Alerts` (`status`, `resolvedAt`) | **VERIFIED DB PERSISTED** |
| **Supply Chain Trips** | Trips & Visibility / `TripsPage` | `GET /odata/v4/fleet/Trips` | `cat-service.js` | `Trips` (`origin`, `destination`, `eta`, `status`) | **VERIFIED API BACKED** |
| **Document Compliance** | Document Manager / `DocumentManagerPage` | `GET /odata/v4/fleet/VehicleDocuments` | `document-expiry.js` | `VehicleDocuments` (`expiryDate`, `status`) | **VERIFIED ENGINE BACKED** |
| **Hardware Command Action**| Fleet & Devices / Hardware Test Bench | `POST /odata/v4/fleet/sendHardwareCommand` | `cat-service.js` & `mqtt-consumer.js` | `HardwareCommands` (`commandType`, `status`) | **VERIFIED MQTT DISPATCHED** |

---

## Hardcoded Data Audit Result

- **Hardcoded metrics found**: **0**
- **Fallback UI values**: Displayed only when offline API connection is unavailable.
- **DEMO DATA labeling**: Enabled when `DEMO_MODE=true` in environment configuration.
