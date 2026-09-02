/**
 * BHARAT LOAD RAKSHAK - Telemetry & Business Rules Unit Tests
 */

const { validateTelemetry } = require('../backend/srv/telemetry-validator');

describe('Telemetry Contract & Validation Unit Tests', () => {
  test('Valid Telemetry Payload should pass validation', () => {
    const payload = {
      deviceId: 'BLR-DEVICE-001',
      truckId: 'BLR-TRUCK-001',
      timestamp: new Date().toISOString(),
      weightKg: 8500.0,
      humidityPercent: 61.5,
      rainDetected: false,
      gasValue: 120.0,
      alcoholValue: 0.0,
      latitude: 28.6139,
      longitude: 77.2090,
      speedKmph: 54.2
    };

    const result = validateTelemetry(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitized.truckId).toBe('BLR-TRUCK-001');
    expect(result.sanitized.weightKg).toBe(8500.0);
  });

  test('Missing deviceId or truckId should fail validation', () => {
    const payload = {
      timestamp: new Date().toISOString(),
      weightKg: 8500.0,
      humidityPercent: 61.5,
      rainDetected: false,
      gasValue: 120.0,
      alcoholValue: 0.0,
      latitude: 28.6139,
      longitude: 77.2090,
      speedKmph: 54.2
    };

    const result = validateTelemetry(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing or invalid deviceId');
    expect(result.errors).toContain('Missing or invalid truckId');
  });

  test('Invalid weight or non-boolean rainDetected should fail validation', () => {
    const payload = {
      deviceId: 'BLR-DEV-001',
      truckId: 'BLR-TRK-001',
      timestamp: new Date().toISOString(),
      weightKg: -50.0, // Invalid
      humidityPercent: 120.0, // Invalid
      rainDetected: "YES", // Invalid type
      gasValue: 120.0,
      alcoholValue: 0.0,
      latitude: 28.6139,
      longitude: 77.2090,
      speedKmph: 54.2
    };

    const result = validateTelemetry(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
