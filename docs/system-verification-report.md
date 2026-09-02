# BHARAT LOAD RAKSHAK - System Verification Report

**Initial Audit Status**: NOT VERIFIED  
**Audit Date**: 2026-09-01  
**System Mode**: Dual Mode (`MODE=LOCAL` / `MODE=SAP`)

---

## Initial Verification Matrix

| Component | Sub-System / Rule | Expected Behavior | Actual Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ESP32 Firmware** | Hardware C++ Code | Real sensor pin reading & PubSubClient MQTT payload | Hardware not physically connected | **NOT VERIFIED (PHYSICAL)** |
| **Software Simulator** | Hardware Telemetry Payload | Identical JSON telemetry payload generation | Software simulation active | **NOT VERIFIED** |
| **Telemetry Validator** | Schema & Range Validator | Reject malformed, stale, or out-of-bound payloads | Pending test execution | **NOT VERIFIED** |
| **Load Cell / HX711** | Weight & Overload Logic | Compare against truck `maximumAllowedWeightKg` | Pending test execution | **NOT VERIFIED** |
| **GPS & Route** | Location & Speed | Haversine route deviation formula & overspeed check | Pending test execution | **NOT VERIFIED** |
| **Humidity Sensor** | Cargo Container Humidity | High humidity alert threshold (>85%) | Pending test execution | **NOT VERIFIED** |
| **Rain Drop Sensor** | Water Ingress Detection | Water contact alert (`WATER_INGRESS`) | Pending test execution | **NOT VERIFIED** |
| **MQ135 Gas Sensor** | Abnormal Gas Concentration | Wording: `"Abnormal Gas Concentration Detected — Inspection Required."` | Pending test execution | **NOT VERIFIED** |
| **MQ3 Alcohol Sensor** | Driver Alcohol Monitoring | Wording: `"Alcohol sensor threshold exceeded — verification required."` | Pending test execution | **NOT VERIFIED** |
| **MQTT Pipeline** | Ingestion Broker & Consumer | Pub-sub topic parsing & message routing | Pending test execution | **NOT VERIFIED** |
| **HTTP Pipeline** | REST Endpoint Fallback | Identical database record & alert processing as MQTT | Pending test execution | **NOT VERIFIED** |
| **Database Persistence** | SQLite / SAP HANA Schema | Direct SQL verification of persisted records & FKs | Pending test execution | **NOT VERIFIED** |
| **Alert Engine** | Status & Threshold Engine | Transition `SAFE` -> `WARNING` -> `OVERLOAD` | Pending test execution | **NOT VERIFIED** |
| **Alert Lifecycle** | Resolution Workflow | Transition `OPEN` -> `ACKNOWLEDGED` -> `RESOLVED` in DB | Pending test execution | **NOT VERIFIED** |
| **Event Bus Adapter** | Local & SAP Event Mesh | Publish application-level events (`OverloadDetected`, etc.) | Pending test execution | **NOT VERIFIED** |
| **SAP HANA Cloud Config**| HDI & MTA Descriptors | HANA container schema & deployment descriptor | Configuration exists | **NOT VERIFIED (LIVE)** |
| **SAP Event Mesh** | SAP BTP Messaging Service | Event Mesh topic binding & cloud publisher | Pending credentials | **NOT VERIFIED (LIVE)** |
| **CAP OData v4 APIs** | OData Service Handlers | `/odata/v4/fleet` OData endpoints response accuracy | Pending test execution | **NOT VERIFIED** |
| **WebSocket Stream** | Real-Time Push Engine | Stream live telemetry & alert payloads to UI | Pending test execution | **NOT VERIFIED** |
| **Document Expiry** | Compliance Tracker | 30/15/7-day and expired status transitions | Pending test execution | **NOT VERIFIED** |
| **Device Health** | Quiet Interval Tracker | Transition `ONLINE` -> `DEGRADED` -> `OFFLINE` | Pending test execution | **NOT VERIFIED** |
| **Driver Scoring** | Explainable Scoring Model | Multi-factor Driver Trust Score calculation | Pending test execution | **NOT VERIFIED** |
| **ML Microservice** | Python Scikit-Learn Model | Random Forest driver match prediction API | Pending test execution | **NOT VERIFIED** |
| **Frontend Data Binding**| React Dashboard State | Zero hardcoded numbers; 100% database/API backed | Pending audit | **NOT VERIFIED** |
| **Hardware Commands** | Command Dispatch Channel | Dispatch `BUZZER_ON`, `LED_RED`, `LCD_ALERT` over MQTT | Pending test execution | **NOT VERIFIED** |
| **Multi-Truck Isolation**| Data Segregation | Zero cross-truck data leakage | Pending test execution | **NOT VERIFIED** |
