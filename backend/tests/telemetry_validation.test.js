/**
 * BHARAT LOAD RAKSHAK - Malformed Telemetry & Validation Tests
 */

const { validateTelemetry } = require('../srv/telemetry-validator');

describe('Malformed Telemetry Payload Ingestion Safety', () => {
  test('Empty object {} fails validation safely', () => {
    const val = validateTelemetry({});
    expect(val.isValid).toBe(false);
    expect(val.errors.length).toBeGreaterThan(0);
  });

  test('Missing timestamp fails validation', () => {
    const payload = { deviceId: 'BLR-DEV-001', truckId: 'BLR-TRK-001', weightKg: 8500, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 50 };
    const val = validateTelemetry(payload);
    expect(val.isValid).toBe(false);
    expect(val.errors).toContain('Missing timestamp');
  });

  test('Future timestamp (>10 mins in future) fails validation', () => {
    const futureTs = new Date(Date.now() + 3600 * 1000).toISOString();
    const payload = { deviceId: 'BLR-DEV-001', truckId: 'BLR-TRK-001', timestamp: futureTs, weightKg: 8500, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 50 };
    const val = validateTelemetry(payload);
    expect(val.isValid).toBe(false);
    expect(val.errors).toContain('Timestamp is too far in the future');
  });

  test('Stale timestamp (>7 days old) fails validation', () => {
    const staleTs = new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString();
    const payload = { deviceId: 'BLR-DEV-001', truckId: 'BLR-TRK-001', timestamp: staleTs, weightKg: 8500, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 50 };
    const val = validateTelemetry(payload);
    expect(val.isValid).toBe(false);
    expect(val.errors).toContain('Stale telemetry (older than 7 days)');
  });
});
