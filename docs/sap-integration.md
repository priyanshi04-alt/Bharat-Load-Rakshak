# SAP Platform Integration Specification

## SAP BTP Services Architecture

1. **SAP Cloud Application Programming Model (CAP)**: Core backend domain model (`schema.cds`) and OData v4 protocol layer.
2. **SAP Event Mesh / Advanced Event Mesh**: Asynchronous business event bus emitting `OverloadDetected`, `AlcoholThresholdExceeded`, `RouteDeviationDetected`, `CargoEnvironmentAlert`, `DeviceOffline`.
3. **SAP HANA Cloud**: Enterprise multi-tenant relational persistence storing truck history, driver performance, telemetry records, and alerts.
4. **SAP XSUAA (Authorization & Trust Management)**: Role-based access control enforcing OAuth 2.0 scopes (`FleetAdmin`, `LogisticsManager`, `TruckOwner`, `Driver`, `WarehouseUser`).
