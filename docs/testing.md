# Automated Testing & Verification Strategy

## Test Suite Structure

- `/tests/unit_validator.test.js`: Unit tests for telemetry schema validation, range checks, and stale timestamps.
- `/tests/unit_alert_engine.test.js`: Unit tests for overload threshold calculations, alcohol alerts, route deviation, and MQ135 gas warning wording.
- `/tests/integration_pipeline.test.js`: End-to-end telemetry pipeline test verifying `Simulator -> REST Ingestion -> Validation -> Alert Engine -> Database -> OData API`.

## Running Tests

```bash
cd backend && npm test
```
