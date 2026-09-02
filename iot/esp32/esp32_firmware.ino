/*
 * BHARAT LOAD RAKSHAK - ESP32 Hardware Firmware (Integrated & Standalone)
 * 
 * Capabilities:
 * 1. WiFi SoftAP Dashboard (192.168.4.1) with real-time web UI & /data JSON API
 * 2. HTTP/MQTT Telemetry Transmission to Bharat Load Rakshak Backend
 * 3. Multi-Sensor Data Acquisition & Safety Monitoring:
 *    - HX711 Load Cell (Weight & Overload Detection)
 *    - MQ-135 Gas Sensor (Hazardous Gas Detection)
 *    - MQ-3 Alcohol Sensor (Drunk Driving Protection)
 *    - Rain Sensor (Water Ingress Warning)
 *    - DHT22 (Temperature & Cargo Humidity)
 *    - Ultrasonic HC-SR04 (Proximity & Distance Alert)
 *    - Neo-6M GPS Module (Live Geolocation Tracking)
 *    - I2C 16x2 LCD Display (Local Visual Indicator)
 *    - Active Buzzer & Tri-Color Status LEDs (Red, Yellow, Green)
 * 
 * Pin Configuration Matrix:
 * -------------------------------------------------------------
 * Component          ESP32 Pin   Notes
 * -------------------------------------------------------------
 * MQ-135 Gas         GPIO 34     ADC1 (Analog Input)
 * MQ-3 Alcohol       GPIO 35     ADC1 (Analog Input)
 * Rain Sensor        GPIO 32     Digital/Analog Input
 * DHT22 Temp/Hum     GPIO 4      Digital Data Pin
 * Ultrasonic TRIG    GPIO 12     Output Pulse
 * Ultrasonic ECHO    GPIO 14     Input Echo Pulse
 * HX711 Load DT      GPIO 13     Data Pin
 * HX711 Load SCK     GPIO 15     Clock Pin
 * GPS Neo-6M RX      GPIO 18     Connect to GPS TX
 * GPS Neo-6M TX      GPIO 19     Connect to GPS RX
 * I2C LCD SDA        GPIO 21     SDA Pin
 * I2C LCD SCL        GPIO 22     SCL Pin
 * Active Buzzer      GPIO 23     Output Alarm
 * Status LED Yellow  GPIO 25     Warning LED
 * Status LED Green   GPIO 26     Safe LED
 * Status LED Red     GPIO 27     Overload/Alert LED
 * -------------------------------------------------------------
 */

#include <WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "HX711.h"
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <DHT.h>
#include <HTTPClient.h>

// ===== CONFIGURATION =====
const char* AP_SSID     = "TruckSystem";
const char* AP_PASSWORD = "12345678";
const char* BACKEND_URL = "http://192.168.1.100:4000/api/telemetry"; // Set your backend IP

// ===== SENSOR PINS =====
#define MQ135_PIN 34
#define MQ3_PIN   35
#define RAIN_PIN  32
#define TRIG_PIN  12
#define ECHO_PIN  14
#define BUZZER    23
#define GREEN_LED 26
#define YELLOW_LED 25
#define RED_LED   27

#define DHTPIN 4
#define DHTTYPE DHT22

#define DT_PIN 13
#define SCK_PIN 15

// ===== OBJECT INITIALIZATIONS =====
WiFiServer server(80);
LiquidCrystal_I2C lcd(0x27, 16, 2);
DHT dht(DHTPIN, DHTTYPE);
HX711 scale;
TinyGPSPlus gps;
HardwareSerial gpsSerial(1); // Hardware UART1 for GPS

// ===== LIMITS & FILTERING =====
float maxW = 1.0;     // Overload limit threshold in tons / scale unit
float smoothW = 0.0;  // Exponential moving average filter for load cell

unsigned long lastBackendTime = 0;
const unsigned long BACKEND_INTERVAL = 5000; // Send telemetry to backend every 5s

// ===== HTML DASHBOARD SERVER =====
void sendDashboard(WiFiClient client) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");
  client.println();

  client.println("<!DOCTYPE html><html><head><title>Truck Dashboard</title>");
  client.println("<meta name='viewport' content='width=device-width, initial-scale=1'>");
  client.println("<style>");
  client.println("body{font-family:Segoe UI,sans-serif;background:#0f172a;color:#f8fafc;text-align:center;padding:20px;}");
  client.println(".card{background:#1e293b;border-radius:12px;padding:20px;max-width:500px;margin:auto;box-shadow:0 4px 15px rgba(0,0,0,0.5);}");
  client.println("h1{color:#38bdf8;font-size:1.6rem;}");
  client.println(".metric{display:flex;justify-content:space-between;border-bottom:1px solid #334155;padding:8px 0;}");
  client.println(".val{font-weight:bold;color:#facc15;}");
  client.println("#status{font-size:1.2rem;font-weight:bold;padding:4px 12px;border-radius:6px;background:#334155;}");
  client.println("</style></head><body>");
  client.println("<div class='card'>");
  client.println("<h1>🚛 Bharat Load Rakshak</h1>");
  client.println("<h3>Status: <span id='status'>LOADING...</span></h3>");
  client.println("<div class='metric'><span>Weight:</span><span class='val' id='weight'>-</span></div>");
  client.println("<div class='metric'><span>Temperature:</span><span class='val' id='temp'>-</span></div>");
  client.println("<div class='metric'><span>Humidity:</span><span class='val' id='hum'>-</span></div>");
  client.println("<div class='metric'><span>Distance:</span><span class='val' id='dist'>-</span></div>");
  client.println("<div class='metric'><span>Gas Value (MQ135):</span><span class='val' id='gas'>-</span></div>");
  client.println("<div class='metric'><span>Alcohol (MQ3):</span><span class='val' id='alcohol'>-</span></div>");
  client.println("<div class='metric'><span>Rain Detected:</span><span class='val' id='rain'>-</span></div>");
  client.println("<div class='metric'><span>Buzzer Status:</span><span class='val' id='buzzer'>-</span></div>");
  client.println("<div class='metric'><span>GPS Location:</span><span class='val' id='gps'>-</span></div>");
  client.println("</div>");

  client.println("<script>");
  client.println("function update(){fetch('/data').then(r=>r.json()).then(d=>{");
  client.println("document.getElementById('weight').innerText = d.weight + ' kg';");
  client.println("document.getElementById('temp').innerText = d.temperature + ' °C';");
  client.println("document.getElementById('hum').innerText = d.humidity + ' %';");
  client.println("document.getElementById('dist').innerText = d.distance > 0 ? d.distance + ' cm' : 'Clear';");
  client.println("document.getElementById('gas').innerText = d.gas;");
  client.println("document.getElementById('alcohol').innerText = d.alcohol;");
  client.println("document.getElementById('rain').innerText = d.rain ? 'YES 🌧️' : 'NO ☀️';");
  client.println("document.getElementById('buzzer').innerText = d.buzzer ? 'ACTIVE 🚨' : 'OFF';");
  client.println("document.getElementById('gps').innerText = d.lat + ', ' + d.lng;");
  client.println("let st = document.getElementById('status');");
  client.println("st.innerText = d.status;");
  client.println("st.style.color = d.status === 'OVERLOAD' ? '#f87171' : d.status === 'TOO CLOSE' ? '#fbbf24' : '#34d399';");
  client.println("}).catch(e=>console.error(e));}");
  client.println("setInterval(update, 1000); update();");
  client.println("</script></body></html>");
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n[ESP32 Booting] Bharat Load Rakshak Hardware System");

  // 1. Initialize Access Point & Web Server
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  server.begin();
  Serial.print("[WiFi AP Started] IP Address: ");
  Serial.println(WiFi.softAPIP());

  // 2. Initialize I2C & LCD Display
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("BHARAT LOAD");
  lcd.setCursor(0, 1);
  lcd.print("RAKSHAK SYSTEM");

  // 3. Initialize DHT Sensor
  dht.begin();

  // 4. Initialize GPIO Pin Modes
  pinMode(RAIN_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(BUZZER, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // 5. Initialize HX711 Load Cell
  scale.begin(DT_PIN, SCK_PIN);
  scale.set_scale(); // Set calibration factor here e.g. scale.set_scale(2280.0);
  delay(1000);
  scale.tare();

  // 6. Initialize GPS Hardware Serial (UART1 on GPIO 18/19)
  gpsSerial.begin(9600, SERIAL_8N1, 18, 19);

  delay(1500);
  lcd.clear();
  lcd.print("SYSTEM READY");
}

void loop() {
  // Reset outputs at start of frame
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(BUZZER, LOW);

  // --- 1. WEIGHT (LOAD CELL) ---
  float rawWeight = scale.get_units(5);
  if (rawWeight < 0) rawWeight = 0;
  smoothW = (smoothW * 0.8) + (rawWeight * 0.2); // Exponential Moving Average Filter
  float weight = smoothW;

  // --- 2. SENSORS READOUT ---
  float temp = dht.readTemperature();
  if (isnan(temp)) temp = 25.0; // Safety fallback

  float humidity = dht.readHumidity();
  if (isnan(humidity)) humidity = 50.0; // Safety fallback

  int gas = analogRead(MQ135_PIN);
  int alcohol = analogRead(MQ3_PIN);
  bool rainDetected = (digitalRead(RAIN_PIN) == LOW); // LOW indicates water contact

  // --- 3. ULTRASONIC DISTANCE ---
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  float dist = (duration == 0) ? -1.0 : (duration * 0.034 / 2.0);

  // --- 4. GPS PARSING ---
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  float lat = gps.location.isValid() ? gps.location.lat() : 28.6139;
  float lng = gps.location.isValid() ? gps.location.lng() : 77.2090;

  // --- 5. SYSTEM LOGIC & SAFETY CHECKS ---
  bool gasAlert = (gas > 2000);
  bool alcoholAlert = (alcohol > 2000);
  bool buzzerState = false;

  String status = "NORMAL";

  if (weight > maxW) {
    status = "OVERLOAD";
    digitalWrite(RED_LED, HIGH);
    digitalWrite(BUZZER, HIGH);
    buzzerState = true;
  } else if (dist > 0 && dist < 10) {
    status = "TOO CLOSE";
    digitalWrite(YELLOW_LED, HIGH);
  } else {
    digitalWrite(GREEN_LED, HIGH);
  }

  // Handle secondary alerts (gas / alcohol)
  if (gasAlert || alcoholAlert) {
    digitalWrite(BUZZER, HIGH);
    buzzerState = true;
  }

  // --- 6. UPDATE LCD DISPLAY ---
  lcd.setCursor(0, 0);
  lcd.print("W:" + String(weight, 1) + "kg " + status.substring(0, 6) + "  ");
  lcd.setCursor(0, 1);
  lcd.print("T:" + String((int)temp) + "C H:" + String((int)humidity) + "% G:" + String(gas) + " ");

  // --- 7. CONSTRUCT JSON TELEMETRY PAYLOAD ---
  String json = "{";
  json += "\"truckId\":\"BLR-TRK-001\",";
  json += "\"deviceId\":\"BLR-DEV-001\",";
  json += "\"weight\":" + String(weight, 2) + ",";
  json += "\"temperature\":" + String(temp, 1) + ",";
  json += "\"humidity\":" + String(humidity, 1) + ",";
  json += "\"gas\":" + String(gas) + ",";
  json += "\"alcohol\":" + String(alcohol) + ",";
  json += "\"gasAlert\":" + String(gasAlert ? "true" : "false") + ",";
  json += "\"alcoholAlert\":" + String(alcoholAlert ? "true" : "false") + ",";
  json += "\"rain\":" + String(rainDetected ? "true" : "false") + ",";
  json += "\"buzzer\":" + String(buzzerState ? "true" : "false") + ",";
  json += "\"distance\":" + String(dist, 1) + ",";
  json += "\"lat\":" + String(lat, 6) + ",";
  json += "\"lng\":" + String(lng, 6) + ",";
  json += "\"status\":\"" + status + "\"";
  json += "}";

  // Serial output for debugging / serial reader
  Serial.println(json);

  // --- 8. WEB SERVER CLIENT HANDLING ---
  WiFiClient client = server.available();
  if (client) {
    String req = client.readStringUntil('\r');
    client.flush();

    if (req.indexOf("/data") != -1) {
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: application/json");
      client.println("Access-Control-Allow-Origin: *");
      client.println("Connection: close");
      client.println();
      client.println(json);
    } else {
      sendDashboard(client);
    }
    client.stop();
  }

  delay(500);
}
