# MQTT Topic & Payload Specification

## Topic Hierarchy

All telemetry and command messages follow a structured topic format:

```text
bharatloadrakshak/{truckId}/telemetry   -> ESP32 device telemetry stream
bharatloadrakshak/{truckId}/location    -> Dedicated GPS position stream
bharatloadrakshak/{truckId}/alerts      -> Hardware-originating alert messages
bharatloadrakshak/{truckId}/status      -> Device status & battery heartbeats
bharatloadrakshak/{truckId}/commands    -> Backend -> ESP32 hardware commands
```

## Telemetry JSON Contract

```json
{
  "deviceId": "BLR-DEV-001",
  "truckId": "BLR-TRK-001",
  "tripId": "TRP-1001",
  "timestamp": "2026-09-01T22:30:00Z",
  "weightKg": 8450.0,
  "humidityPercent": 58.5,
  "rainDetected": false,
  "gasValue": 110.0,
  "alcoholValue": 0.0,
  "latitude": 28.6139,
  "longitude": 77.2090,
  "speedKmph": 54.2
}
```
