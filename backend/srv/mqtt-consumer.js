/**
 * BHARAT LOAD RAKSHAK - MQTT Consumer Engine
 * Subscribes to hardware telemetry topics and routes payloads to validation and alert pipeline.
 */

const mqtt = require('mqtt');
const { validateTelemetry } = require('./telemetry-validator');
const alertEngine = require('./alert-engine');
const wsServer = require('./websocket-server');

class MqttConsumer {
  init(db, options = {}) {
    this.db = db;
    const brokerUrl = options.brokerUrl || process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    
    console.log(`[MQTT Consumer] Connecting to MQTT Broker at ${brokerUrl}...`);

    try {
      this.client = mqtt.connect(brokerUrl, {
        clientId: `blr_backend_${Math.random().toString(16).substring(2, 8)}`,
        reconnectPeriod: 3000,
        connectTimeout: 5000
      });

      this.client.on('connect', () => {
        console.log(`[MQTT Consumer] Connected successfully to broker.`);
        const topicPattern = `${process.env.MQTT_TOPIC_PREFIX || 'bharatloadrakshak'}/+/telemetry`;
        this.client.subscribe(topicPattern, (err) => {
          if (err) console.error('[MQTT Subscribe Error]', err);
          else console.log(`[MQTT Consumer] Subscribed to topic pattern: ${topicPattern}`);
        });
      });

      this.client.on('message', async (topic, message) => {
        try {
          const raw = message.toString();
          const payload = JSON.parse(raw);

          // Validate telemetry payload
          const validation = validateTelemetry(payload);
          if (!validation.isValid) {
            console.warn(`[MQTT Validation Rejected] Topic ${topic} errors:`, validation.errors);
            return;
          }

          const sanitized = validation.sanitized;

          // 1. Insert Telemetry into Database
          await db.run(INSERT.into('bharat.load.rakshak.Telemetry').entries(sanitized));

          // 2. Process Business Rules & Alerts
          const result = await alertEngine.processTelemetry(db, sanitized);

          // 3. Broadcast to Real-Time WebSocket Subscribers
          wsServer.broadcast('TELEMETRY_UPDATE', sanitized);

          if (result.alertsCreated > 0) {
            wsServer.broadcast('ALERT_GENERATED', result.alerts);
          }

        } catch (err) {
          console.error('[MQTT Message Processing Error]', err.message);
        }
      });

      this.client.on('error', (err) => {
        console.error('[MQTT Client Error]', err.message);
      });

    } catch (err) {
      console.error('[MQTT Initialization Error]', err.message);
    }
  }

  publishCommand(deviceId, truckId, commandType, parameter) {
    if (!this.client || !this.client.connected) {
      console.warn(`[MQTT Command] Client not connected. Command buffered.`);
      return false;
    }
    const topic = `${process.env.MQTT_TOPIC_PREFIX || 'bharatloadrakshak'}/${truckId}/commands`;
    const payload = JSON.stringify({
      deviceId,
      truckId,
      commandType,
      parameter,
      timestamp: new Date().toISOString()
    });

    this.client.publish(topic, payload);
    console.log(`[MQTT Command Dispatched] Topic: ${topic}, Command: ${commandType}`);
    return true;
  }
}

module.exports = new MqttConsumer();
