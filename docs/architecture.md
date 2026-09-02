# BHARAT LOAD RAKSHAK - Architecture & System Blueprint

## System Architecture Diagram

```
[ ESP32 Hardware / Simulator ]
         │ (MQTT / HTTP Telemetry Payload)
         ▼
[ MQTT Broker / SAP Advanced Event Mesh ]
         │
         ▼
[ SAP CAP Node.js Backend Engine ]
   ├── Schema Validator & Ingestion Router
   ├── Business Rules Alert Engine (Overload, Alcohol, Route Deviation, Gas, Water Ingress)
   ├── Event Adapter (EventEmitter Local / SAP Event Mesh)
   ├── Document Expiry Checker
   └── WebSocket Event Broadcaster
         │
         ├───► [ Persistence: SQLite (LOCAL) / SAP HANA Cloud (SAP) ]
         ├───► [ ML Microservice: Scikit-Learn Driver Intelligence Scoring ]
         └───► [ OData v4 & REST APIs ]
                  │
                  ▼
         [ Vite + React TypeScript Logistics Dashboard ]
```

## Architectural Decoupling & Dual Mode Design

### 1. `MODE=LOCAL`
Designed for zero-dependency local development, hackathons, and offline testing:
- **Broker**: Embedded/Local MQTT Broker (Aedes / Mosquitto).
- **Database**: Local CAP SQLite database (`db.sqlite`).
- **Events**: Node.js `EventEmitter` in-memory pub-sub.
- **ML Engine**: Transparent weighted scoring engine with local Python microservice option.

### 2. `MODE=SAP`
Configures production BTP cloud services via environment variables without code modification:
- **Broker**: SAP Event Mesh / Advanced Event Mesh.
- **Database**: SAP HANA Cloud Instance.
- **Auth**: SAP XSUAA OAuth 2.0 / JWT integration.
