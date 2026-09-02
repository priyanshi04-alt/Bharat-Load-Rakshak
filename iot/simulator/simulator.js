/**
 * BHARAT LOAD RAKSHAK - Hardware Telemetry Simulator
 * Simulates physical ESP32 devices publishing real telemetry via MQTT/HTTP REST.
 */

const mqtt = require('mqtt');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const HTTP_API_URL = process.env.HTTP_API_URL || 'http://localhost:4000/api/telemetry';

console.log(`=======================================================`);
console.log(`🛰️ BHARAT LOAD RAKSHAK Hardware Telemetry Simulator`);
console.log(`Connecting to MQTT Broker: ${BROKER_URL}`);
console.log(`HTTP REST Fallback API: ${HTTP_API_URL}`);
console.log(`=======================================================`);

// Simulated Truck Route Coordinates (NH-48 Route: Gurugram -> Jaipur -> Udaipur -> Ahmedabad -> Mumbai)
const WAYPOINTS = [
  { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
  { name: 'Rewari', lat: 28.1800, lng: 76.6172 },
  { name: 'Neemrana', lat: 27.9890, lng: 76.3812 },
  { name: 'Kotputli', lat: 27.7024, lng: 76.2008 },
  { name: 'Shahpura', lat: 27.3872, lng: 75.9600 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
  { name: 'Bhilwara', lat: 25.3407, lng: 74.6313 },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 }
];

let simState = {
  'BLR-TRK-001': {
    deviceId: 'BLR-DEV-001',
    truckId: 'BLR-TRK-001',
    tripId: 'TRP-1001',
    waypointIndex: 2,
    weightKg: 8450.0,
    humidityPercent: 58.5,
    rainDetected: false,
    gasValue: 110.0,
    alcoholValue: 0.0,
    speedKmph: 64.0,
    isOverloaded: false,
    isAlcoholAlert: false,
    isRainAlert: false,
    isGasAlert: false,
    isDeviated: false
  },
  'BLR-TRK-002': {
    deviceId: 'BLR-DEV-002',
    truckId: 'BLR-TRK-002',
    tripId: 'TRP-1002',
    waypointIndex: 0,
    weightKg: 7800.0,
    humidityPercent: 52.0,
    rainDetected: false,
    gasValue: 95.0,
    alcoholValue: 0.0,
    speedKmph: 55.0,
    isOverloaded: false,
    isAlcoholAlert: false,
    isRainAlert: false,
    isGasAlert: false,
    isDeviated: false
  }
};

let mqttClient = null;

try {
  mqttClient = mqtt.connect(BROKER_URL, { clientId: 'BLR_SIMULATOR_ENGINE' });
  mqttClient.on('connect', () => {
    console.log(`[Simulator MQTT] Connected to MQTT broker.`);
  });
  mqttClient.on('error', (err) => {
    console.warn(`[Simulator MQTT Error] Broker connection failed: ${err.message}. Will transmit over HTTP REST.`);
  });
} catch (err) {
  console.warn(`[Simulator MQTT Init Error] ${err.message}`);
}

async function transmitTelemetry(truckId) {
  const truck = simState[truckId];
  if (!truck) return;

  // Move along waypoints
  const wp = WAYPOINTS[truck.waypointIndex];
  let currentLat = wp.lat + (Math.random() - 0.5) * 0.01;
  let currentLng = wp.lng + (Math.random() - 0.5) * 0.01;

  if (truck.isDeviated) {
    currentLat += 0.45; // Shift ~50km off route
    currentLng += 0.45;
  }

  // Update speed variation
  const speed = Math.max(0, truck.speedKmph + (Math.random() - 0.5) * 6.0);

  const payload = {
    deviceId: truck.deviceId,
    truckId: truck.truckId,
    tripId: truck.tripId,
    timestamp: new Date().toISOString(),
    weightKg: truck.isOverloaded ? 12450.0 : truck.weightKg + (Math.random() - 0.5) * 10,
    humidityPercent: truck.isRainAlert ? 92.5 : Math.max(30, Math.min(95, truck.humidityPercent + (Math.random() - 0.5) * 2)),
    rainDetected: truck.isRainAlert,
    gasValue: truck.isGasAlert ? 480.0 : Math.max(50, Math.min(300, truck.gasValue + (Math.random() - 0.5) * 10)),
    alcoholValue: truck.isAlcoholAlert ? 340.0 : 0.0,
    latitude: Math.round(currentLat * 10000) / 10000,
    longitude: Math.round(currentLng * 10000) / 10000,
    speedKmph: Math.round(speed * 10) / 10,
    isDemoData: process.env.DEMO_MODE === 'true'
  };

  // Advance waypoint
  truck.waypointIndex = (truck.waypointIndex + 1) % WAYPOINTS.length;

  console.log(`[Simulator Publish] ${truckId} -> Weight: ${payload.weightKg}kg | Speed: ${payload.speedKmph}kmh | Gas: ${payload.gasValue} | Alc: ${payload.alcoholValue}`);

  // Transmit via MQTT if connected
  if (mqttClient && mqttClient.connected) {
    const topic = `${process.env.MQTT_TOPIC_PREFIX || 'bharatloadrakshak'}/${truckId}/telemetry`;
    mqttClient.publish(topic, JSON.stringify(payload));
  } else {
    // HTTP Fallback
    try {
      await axios.post(HTTP_API_URL, payload, { timeout: 2000 });
    } catch (err) {
      console.error(`[Simulator HTTP Error] ${err.message}`);
    }
  }
}

// Start Periodic Simulator Interval
setInterval(() => {
  transmitTelemetry('BLR-TRK-001');
}, 4000);

setInterval(() => {
  transmitTelemetry('BLR-TRK-002');
}, 7000);

// CLI Control Instructions
console.log(`\n-------------------------------------------------------`);
console.log(`🎮 SIMULATOR INTERACTIVE TEST COMMANDS:`);
console.log(`Inject Overload:        simInject('BLR-TRK-001', 'overload')`);
console.log(`Inject Alcohol Event:   simInject('BLR-TRK-001', 'alcohol')`);
console.log(`Inject Rain/Water:      simInject('BLR-TRK-001', 'rain')`);
console.log(`Inject Gas Spike:       simInject('BLR-TRK-001', 'gas')`);
console.log(`Inject Route Deviation: simInject('BLR-TRK-001', 'deviation')`);
console.log(`Reset Normal State:     simInject('BLR-TRK-001', 'reset')`);
console.log(`-------------------------------------------------------\n`);

function simInject(truckId, eventType) {
  if (!simState[truckId]) return;
  if (eventType === 'overload') simState[truckId].isOverloaded = true;
  if (eventType === 'alcohol') simState[truckId].isAlcoholAlert = true;
  if (eventType === 'rain') simState[truckId].isRainAlert = true;
  if (eventType === 'gas') simState[truckId].isGasAlert = true;
  if (eventType === 'deviation') simState[truckId].isDeviated = true;
  if (eventType === 'reset') {
    simState[truckId].isOverloaded = false;
    simState[truckId].isAlcoholAlert = false;
    simState[truckId].isRainAlert = false;
    simState[truckId].isGasAlert = false;
    simState[truckId].isDeviated = false;
  }
  console.log(`[Simulator Event Injected] ${truckId} -> ${eventType.toUpperCase()}`);
}

module.exports = { simState, transmitTelemetry, simInject };
