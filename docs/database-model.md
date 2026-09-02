# SAP HANA Cloud & CDS Data Model Specification

## Domain Entities Relationship Diagram

```
Company (1) ───► (N) Trucks (1) ───► (N) Telemetry
                       │ (1)             │ (N)
                       ▼                 ▼
                     Device            Alerts
                       ▲                 ▲
                       │ (1)             │ (N)
Driver (1)  ───► (N) Trips  (1) ──────────┘
```

## Entity Table Summary

- `Companies`: Logistics enterprise details.
- `Users`: Platform accounts with role mappings.
- `Drivers`: Driver profiles, safety rating, and overall trust score.
- `Trucks`: Registration, weight capacity, vehicle document links.
- `Devices`: ESP32 device ID, firmware version, connection status.
- `Cargo`: Cargo description, type, declared value, required safety level.
- `Trips`: Origin, destination, assigned route, route tolerance.
- `Telemetry`: High-frequency sensor payload storage.
- `Alerts`: Audit log of system safety and compliance alerts.
- `VehicleDocuments`: Expiry tracking for RC, Insurance, PUC, Fitness, Permit.
- `HardwareCommands`: Dispatch log for buzzer, LED, and LCD hardware commands.
