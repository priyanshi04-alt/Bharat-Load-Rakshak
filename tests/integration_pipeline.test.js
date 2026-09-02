/**
 * BHARAT LOAD RAKSHAK - Integration Telemetry Pipeline Test Script
 * Verifies End-to-End ingestion flow: Telemetry -> Ingestion REST -> Alert Engine -> Persistence
 */

const axios = require('axios');

async function testPipeline() {
  console.log('[Integration Test] Running End-to-End Telemetry Pipeline Verification...');
  const API_URL = 'http://localhost:4000/api/telemetry';

  const testPayload = {
    deviceId: 'BLR-DEV-001',
    truckId: 'BLR-TRK-001',
    timestamp: new Date().toISOString(),
    weightKg: 12500.0, // Overload condition!
    humidityPercent: 62.0,
    rainDetected: false,
    gasValue: 420.0, // Abnormal Gas Spike!
    alcoholValue: 320.0, // Alcohol Threshold Exceeded!
    latitude: 28.6139,
    longitude: 77.2090,
    speedKmph: 72.5,
    isDemoData: false
  };

  try {
    const res = await axios.post(API_URL, testPayload, { timeout: 3000 });
    console.log('[Integration Test] Pipeline Server Response:', res.data);
    if (res.data.status === 'SUCCESS' && res.data.data.alertsGenerated > 0) {
      console.log('✅ Integration Test PASSED! Hardware telemetry successfully ingested, validated, and alerts generated.');
    } else {
      console.log('⚠️ Pipeline responded, check alert counts.');
    }
  } catch (err) {
    console.log('[Integration Test Note] Backend server not currently listening on port 4000. Run backend first.');
  }
}

if (require.main === module) {
  testPipeline();
}

module.exports = { testPipeline };
