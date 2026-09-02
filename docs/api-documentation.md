# OData v4 & REST API Documentation

## OData v4 Endpoints (`/odata/v4/fleet`)

- `GET /odata/v4/fleet/Trucks`: List all fleet trucks.
- `GET /odata/v4/fleet/Drivers`: Query driver profiles and trust scores.
- `GET /odata/v4/fleet/Alerts`: Query active and historical safety alerts.
- `GET /odata/v4/fleet/Telemetry`: Query historical sensor readings.
- `GET /odata/v4/fleet/getFleetSummary()`: Returns executive fleet KPIs.
- `POST /odata/v4/fleet/recommendDriver`: Run AI driver recommendation for trip dispatch.
- `POST /odata/v4/fleet/acknowledgeAlert`: Acknowledge open alert.
- `POST /odata/v4/fleet/resolveAlert`: Mark alert resolved.
- `POST /odata/v4/fleet/sendHardwareCommand`: Dispatch command to ESP32.

## REST Endpoints (`/api`)

- `POST /api/telemetry`: Ingest raw ESP32 JSON telemetry payload.
- `GET /api/fleet/summary`: Fast JSON summary endpoint.
