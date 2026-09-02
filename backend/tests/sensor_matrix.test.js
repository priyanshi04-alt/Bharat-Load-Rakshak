/**
 * BHARAT LOAD RAKSHAK - Automated Sensor Test Matrix
 * Verifies Load Cell, GPS, Humidity, Rain Drop, MQ135 Gas, and MQ3 Alcohol sensors.
 */

const { validateTelemetry } = require('../srv/telemetry-validator');
const alertEngine = require('../srv/alert-engine');

describe('Comprehensive Sensor Test Matrix', () => {

  // --- 1. LOAD CELL / HX711 MATRIX ---
  describe('Load Cell / HX711 Tests', () => {
    const truckMax = 10000; // 10,000 kg threshold

    test('weight = 0 kg (SAFE state)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 0, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      const val = validateTelemetry(payload);
      expect(val.isValid).toBe(true);
    });

    test('weight = 500 kg (SAFE state)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 500, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('weight = maximum allowed (10,000 kg - SAFE boundary)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 10000, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('weight = max + 1 (10,001 kg - OVERLOAD state)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 10001, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('extreme overload (15,000 kg)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 15000, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('negative weight should fail validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: -100, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(false);
    });

    test('non-numeric weight should fail validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 'HEAVY', humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6, longitude: 77.2, speedKmph: 40 };
      expect(validateTelemetry(payload).isValid).toBe(false);
    });
  });

  // --- 2. GPS MATRIX ---
  describe('GPS Coordinates & Speed Matrix', () => {
    test('valid lat/lng passes validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('invalid latitude (>90) fails validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 120.0, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(false);
    });

    test('invalid speed (>250 km/h) fails validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 50, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 400 };
      expect(validateTelemetry(payload).isValid).toBe(false);
    });
  });

  // --- 3. HUMIDITY MATRIX ---
  describe('Container Humidity Sensor Matrix', () => {
    test('normal humidity (55%) passes validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('out of range humidity (>100%) fails validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 120.0, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(false);
    });
  });

  // --- 4. RAIN / WATER INGRESS MATRIX ---
  describe('Rain Drop / Water Ingress Matrix', () => {
    test('rainDetected = false passes validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('rainDetected = true passes validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: true, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });
  });

  // --- 5. MQ135 ABNORMAL GAS CONCENTRATION MATRIX ---
  describe('MQ135 Gas Sensor Wording Standard Matrix', () => {
    test('valid gas value passes validation', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: false, gasValue: 450.0, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });
  });

  // --- 6. MQ3 ALCOHOL MONITORING MATRIX ---
  describe('MQ3 Alcohol Sensor Wording Standard Matrix', () => {
    test('alcohol reading 0 (NORMAL)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: false, gasValue: 100, alcoholValue: 0, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });

    test('alcohol threshold exceeded (reading 350)', () => {
      const payload = { deviceId: 'DEV-1', truckId: 'TRK-1', timestamp: new Date().toISOString(), weightKg: 5000, humidityPercent: 55.0, rainDetected: false, gasValue: 100, alcoholValue: 350, latitude: 28.6139, longitude: 77.2090, speedKmph: 60 };
      expect(validateTelemetry(payload).isValid).toBe(true);
    });
  });
});
