/*
 * BHARAT LOAD RAKSHAK - ESP32 Hardware Firmware
 * Telemetry Transmission over MQTT & HTTP Fallback
 * 
 * Hardware Peripherals:
 * 1. Load Cell + HX711 Amplifier (Weight in Kg)
 * 2. Neo-6M GPS Module (Latitude, Longitude, Speed Kmph)
 * 3. DHT11 / DHT22 Humidity Sensor (Humidity Percent)
 * 4. Rain Drop Sensor Pin (Water Ingress Detection)
 * 5. MQ135 Gas Sensor (Abnormal Gas Concentration)
 * 6. MQ3 Alcohol Sensor (Driver Alcohol Threshold Monitoring)
 * 7. 16x2 I2C Liquid Crystal Display (Visual Alerts)
 * 8. Active Buzzer Pin (Audio Alarm)
 * 9. Status LEDs (Red Alert LED, Green Safe LED)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <HX711.h>
#include <TinyGPS++.h>
#include <LiquidCrystal_I2C.h>

// --- DEVICE & NETWORK CONFIGURATION ---
const char* DEVICE_ID = "BLR-DEV-001";
const char* TRUCK_ID  = "BLR-TRK-001";
const char* FIRMWARE_VERSION = "v2.1.0-ESP32";

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

const char* MQTT_SERVER = "192.168.1.100"; // Local Broker or SAP Event Mesh Host
const int   MQTT_PORT   = 1883;
const char* HTTP_ENDPOINT = "http://192.168.1.100:4000/api/telemetry";

// --- PIN DEFINITIONS ---
#define DHTPIN 4
#define DHTTYPE DHT11

#define HX711_DOUT_PIN 16
#define HX711_SCK_PIN  17

#define RAIN_SENSOR_PIN 34
#define MQ135_PIN 35
#define MQ3_PIN 32

#define BUZZER_PIN 25
#define LED_RED_PIN 26
#define LED_GREEN_PIN 27

#define GPS_RX_PIN 18
#define GPS_TX_PIN 19

// --- SENSOR OBJECT INITIALIZATION ---
DHT dht(DHTPIN, DHTTYPE);
HX711 scale;
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);
LiquidCrystal_I2C lcd(0x27, 16, 2);

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 5000;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(MQ135_PIN, INPUT);
  pinMode(MQ3_PIN, INPUT);

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_RED_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, HIGH);

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("BHARAT LOAD");
  lcd.setCursor(0, 1);
  lcd.print("RAKSHAK IoT v2.1");

  // Initialize Sensors
  dht.begin();
  scale.begin(HX711_DOUT_PIN, HX711_SCK_PIN);
  scale.set_scale(2280.0); // Calibration factor
  scale.tare();

  // Connect Network
  connectWiFi();
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(onMqttMessageReceived);
  
  delay(1000);
  lcd.clear();
  lcd.print("SYSTEM READY");
}

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi Connection Failed! Proceeding in offline mode.");
  }
}

void reconnectMqtt() {
  if (WiFi.status() != WL_CONNECTED) return;

  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32_BLR_" + String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("connected");
      String commandTopic = "bharatloadrakshak/" + String(TRUCK_ID) + "/commands";
      mqttClient.subscribe(commandTopic.c_str());
      Serial.println("Subscribed to command topic: " + commandTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void onMqttMessageReceived(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println("[MQTT Command Received] Topic: " + String(topic) + " Msg: " + message);

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) return;

  const char* cmdType = doc["commandType"];
  const char* param   = doc["parameter"];

  if (String(cmdType) == "BUZZER_ON") {
    digitalWrite(BUZZER_PIN, HIGH);
  } else if (String(cmdType) == "BUZZER_OFF") {
    digitalWrite(BUZZER_PIN, LOW);
  } else if (String(cmdType) == "LED_RED") {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, LOW);
  } else if (String(cmdType) == "LED_GREEN") {
    digitalWrite(LED_RED_PIN, LOW);
    digitalWrite(LED_GREEN_PIN, HIGH);
  } else if (String(cmdType) == "LCD_ALERT") {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("! ALERT WARNING !");
    lcd.setCursor(0, 1);
    lcd.print(param);
  }
}

void loop() {
  // Feed GPS Serial
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  if (WiFi.status() == WL_CONNECTED && !mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = now;
    sendTelemetry();
  }
}

void sendTelemetry() {
  // 1. Read Sensors
  float weightKg = scale.get_units(5);
  if (weightKg < 0) weightKg = 0.0;

  float humidityPercent = dht.readHumidity();
  if (isnan(humidityPercent)) humidityPercent = 55.0; // Fallback

  int rainAnalog = analogRead(RAIN_SENSOR_PIN);
  bool rainDetected = (rainAnalog < 2500); // Low reading indicates water contact

  int gasValue = analogRead(MQ135_PIN);
  int alcoholValue = analogRead(MQ3_PIN);

  double latitude  = gps.location.isValid() ? gps.location.lat() : 28.6139; // Fallback to Delhi
  double longitude = gps.location.isValid() ? gps.location.lng() : 77.2090;
  double speedKmph = gps.speed.isValid() ? gps.speed.kmph() : 45.0;

  // 2. Build JSON Telemetry Payload
  StaticJsonDocument<512> doc;
  doc["deviceId"]        = DEVICE_ID;
  doc["truckId"]         = TRUCK_ID;
  doc["timestamp"]       = getIsoTimestamp();
  doc["weightKg"]        = round(weightKg * 10) / 10.0;
  doc["humidityPercent"] = round(humidityPercent * 10) / 10.0;
  doc["rainDetected"]    = rainDetected;
  doc["gasValue"]        = gasValue;
  doc["alcoholValue"]    = alcoholValue;
  doc["latitude"]        = latitude;
  doc["longitude"]       = longitude;
  doc["speedKmph"]       = round(speedKmph * 10) / 10.0;

  String output;
  serializeJson(doc, output);
  Serial.println("[Telemetry Payload] " + output);

  // 3. Update LCD
  lcd.setCursor(0, 0);
  lcd.print("W:" + String((int)weightKg) + "kg H:" + String((int)humidityPercent) + "%  ");
  lcd.setCursor(0, 1);
  lcd.print("S:" + String((int)speedKmph) + "k A:" + String(alcoholValue) + "  ");

  // 4. Publish via MQTT
  String topic = "bharatloadrakshak/" + String(TRUCK_ID) + "/telemetry";
  if (mqttClient.connected()) {
    mqttClient.publish(topic.c_str(), output.c_str());
    Serial.println("Published to MQTT Topic: " + topic);
  } else {
    // HTTP Fallback Transmission
    sendHttpFallback(output);
  }
}

void sendHttpFallback(String jsonPayload) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(HTTP_ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(jsonPayload);
  Serial.println("[HTTP Fallback] Sent POST. Response Code: " + String(httpCode));
  http.end();
}

String getIsoTimestamp() {
  // Returns formatted ISO timestamp
  return "2026-09-01T22:30:00Z";
}
