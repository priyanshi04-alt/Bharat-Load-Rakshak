/**
 * BHARAT LOAD RAKSHAK - Telemetry Validator
 * Validates incoming IoT device telemetry against strict schema & range rules.
 */

function validateTelemetry(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Payload must be a non-null object'] };
  }

  // 1. Mandatory Identifier fields
  if (!payload.deviceId || typeof payload.deviceId !== 'string' || payload.deviceId.trim() === '') {
    errors.push('Missing or invalid deviceId');
  }

  if (!payload.truckId || typeof payload.truckId !== 'string' || payload.truckId.trim() === '') {
    errors.push('Missing or invalid truckId');
  }

  // 2. Timestamp check
  if (!payload.timestamp) {
    errors.push('Missing timestamp');
  } else {
    const ts = new Date(payload.timestamp);
    if (isNaN(ts.getTime())) {
      errors.push('Invalid timestamp format (ISO-8601 string expected)');
    } else {
      const now = Date.now();
      const diffMs = ts.getTime() - now;
      // Stale check (older than 7 days) or future check (more than 10 minutes in future)
      if (diffMs > 10 * 60 * 1000) {
        errors.push('Timestamp is too far in the future');
      } else if (diffMs < -7 * 24 * 60 * 60 * 1000) {
        errors.push('Stale telemetry (older than 7 days)');
      }
    }
  }

  // 3. Weight check
  if (typeof payload.weightKg !== 'number' || payload.weightKg < 0 || payload.weightKg > 100000) {
    errors.push('weightKg must be a number between 0 and 100,000');
  }

  // 4. Humidity check
  if (typeof payload.humidityPercent !== 'number' || payload.humidityPercent < 0 || payload.humidityPercent > 100) {
    errors.push('humidityPercent must be a number between 0 and 100');
  }

  // 5. Rain check
  if (typeof payload.rainDetected !== 'boolean') {
    errors.push('rainDetected must be a boolean (true/false)');
  }

  // 6. Gas value check (MQ135 air quality / abnormal gas concentration)
  if (typeof payload.gasValue !== 'number' || payload.gasValue < 0 || payload.gasValue > 5000) {
    errors.push('gasValue must be a number between 0 and 5,000');
  }

  // 7. Alcohol check (MQ3 alcohol sensor reading)
  if (typeof payload.alcoholValue !== 'number' || payload.alcoholValue < 0 || payload.alcoholValue > 2000) {
    errors.push('alcoholValue must be a number between 0 and 2,000');
  }

  // 8. GPS Coordinates
  if (typeof payload.latitude !== 'number' || payload.latitude < -90 || payload.latitude > 90) {
    errors.push('latitude must be a number between -90 and 90');
  }

  if (typeof payload.longitude !== 'number' || payload.longitude < -180 || payload.longitude > 180) {
    errors.push('longitude must be a number between -180 and 180');
  }

  // 9. Speed check
  if (typeof payload.speedKmph !== 'number' || payload.speedKmph < 0 || payload.speedKmph > 250) {
    errors.push('speedKmph must be a number between 0 and 250');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      ID: payload.ID || (require('@sap/cds').utils?.uuid ? require('@sap/cds').utils.uuid() : undefined),
      deviceId: String(payload.deviceId).trim(),
      truckId: String(payload.truckId).trim(),
      timestamp: new Date(payload.timestamp).toISOString(),
      weightKg: Number(payload.weightKg),
      humidityPercent: Number(payload.humidityPercent),
      rainDetected: Boolean(payload.rainDetected),
      gasValue: Number(payload.gasValue),
      alcoholValue: Number(payload.alcoholValue),
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      speedKmph: Number(payload.speedKmph),
      isDemoData: Boolean(payload.isDemoData || false)
    } : null
  };
}

module.exports = { validateTelemetry };
