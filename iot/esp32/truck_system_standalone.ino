#include <WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "HX711.h"
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <DHT.h>

// ===== WiFi =====
const char* ssid = "TruckSystem";
const char* password = "12345678";
WiFiServer server(80);

// ===== LCD =====
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ===== Pins =====
#define MQ135 34
#define MQ3 35
#define RAIN 32
#define TRIG 12
#define ECHO 14
#define BUZZER 23
#define GREEN 26
#define YELLOW 25
#define RED 27

// ===== DHT =====
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ===== HX711 =====
#define DT 13
#define SCK 15
HX711 scale;

// ===== GPS =====
TinyGPSPlus gps;
HardwareSerial gpsSerial(1);

// ===== LIMIT =====
float maxW = 1.0;
float smooth = 0;

// ===== DASHBOARD =====
void sendDashboard(WiFiClient client) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html; charset=utf-8");
  client.println("Connection: close");
  client.println();

  client.println("<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'>");
  client.println("<style>");
  client.println("body{font-family:'Segoe UI',Arial,sans-serif;background:#0f172a;color:#f8fafc;text-align:center;padding:20px;}");
  client.println(".card{background:#1e293b;border-radius:12px;padding:24px;max-width:460px;margin:auto;box-shadow:0 10px 25px rgba(0,0,0,0.5);border:1px solid #334155;}");
  client.println("h1{color:#38bdf8;font-size:1.6rem;margin-top:0;}");
  client.println(".metric{display:flex;justify-content:space-between;border-bottom:1px solid #334155;padding:10px 0;font-size:0.95rem;}");
  client.println(".val{font-weight:bold;color:#facc15;}");
  client.println("#statusVal{font-size:1.2rem;font-weight:bold;padding:4px 12px;border-radius:6px;background:#334155;color:#34d399;}");
  client.println("</style></head><body>");
  client.println("<div class='card'>");
  client.println("<h1>🚛 Truck Dashboard</h1>");
  client.println("<h2>Status: <span id='statusVal'>NORMAL</span></h2>");
  client.println("<div class='metric'><span>Weight:</span><span class='val' id='weight'>-</span></div>");
  client.println("<div class='metric'><span>Temp:</span><span class='val' id='temp'>-</span></div>");
  client.println("<div class='metric'><span>Humidity:</span><span class='val' id='hum'>-</span></div>");
  client.println("<div class='metric'><span>Distance:</span><span class='val' id='dist'>-</span></div>");
  client.println("<div class='metric'><span>Gas:</span><span class='val' id='gas'>-</span></div>");
  client.println("<div class='metric'><span>Alcohol:</span><span class='val' id='alcohol'>-</span></div>");
  client.println("<div class='metric'><span>Rain:</span><span class='val' id='rain'>-</span></div>");
  client.println("<div class='metric'><span>Buzzer:</span><span class='val' id='buzzer'>-</span></div>");
  client.println("<div class='metric'><span>GPS:</span><span class='val' id='gps'>-</span></div>");
  client.println("</div>");

  client.println("<script>");
  client.println("function update(){fetch('/data').then(r=>r.json()).then(d=>{");
  client.println("document.getElementById('weight').innerText=d.weight;");
  client.println("document.getElementById('temp').innerText=d.temperature;");
  client.println("document.getElementById('hum').innerText=d.humidity;");
  client.println("document.getElementById('dist').innerText=d.distance;");
  client.println("document.getElementById('gas').innerText=d.gas;");
  client.println("document.getElementById('alcohol').innerText=d.alcohol;");
  client.println("document.getElementById('rain').innerText=d.rain;");
  client.println("document.getElementById('buzzer').innerText=d.buzzer;");
  client.println("document.getElementById('gps').innerText=d.lat+','+d.lng;");
  client.println("let st=document.getElementById('statusVal');st.innerText=d.status;");
  client.println("st.style.color=d.status==='OVERLOAD'?'#f87171':d.status==='TOO CLOSE'?'#fbbf24':'#34d399';");
  client.println("}).catch(e=>console.error(e));}");
  client.println("setInterval(update,1000);update();");
  client.println("</script></body></html>");
}

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  server.begin();

  Wire.begin(21,22);
  lcd.init();
  lcd.backlight();

  dht.begin();

  pinMode(RAIN, INPUT);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  pinMode(BUZZER, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);

  scale.begin(DT, SCK);
  scale.set_scale();
  delay(2000);
  scale.tare();

  gpsSerial.begin(9600, SERIAL_8N1, 18, 19);

  lcd.print("IoTians");
}

void loop() {

  // RESET
  digitalWrite(GREEN, LOW);
  digitalWrite(YELLOW, LOW);
  digitalWrite(RED, LOW);
  digitalWrite(BUZZER, LOW);

  // WEIGHT
  float weight = scale.get_units(15);
  if (weight < 0) weight = 0;
  smooth = (smooth * 0.8) + (weight * 0.2);
  weight = smooth;

  // SENSORS
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gas = analogRead(MQ135);
  int alcohol = analogRead(MQ3);
  bool rainDetected = (digitalRead(RAIN) == 0);

  // DISTANCE
  digitalWrite(TRIG, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duration = pulseIn(ECHO, HIGH, 30000);
  float dist = (duration == 0) ? -1 : duration * 0.034 / 2;

  // GPS
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  float lat = gps.location.isValid() ? gps.location.lat() : 0;
  float lng = gps.location.isValid() ? gps.location.lng() : 0;

  // FLAGS
  bool beef = gas > 2000;
  bool alcoholFlag = alcohol > 2000;
  bool buzzerState = false;

  String status = "NORMAL";

  // LOGIC
  if (weight > maxW) {
    status = "OVERLOAD";
    digitalWrite(RED, HIGH);
    digitalWrite(BUZZER, HIGH);
    buzzerState = true;
  }
  else if (dist > 0 && dist < 10) {
    status = "TOO CLOSE";
    digitalWrite(YELLOW, HIGH);
  }
  else {
    digitalWrite(GREEN, HIGH);
  }

  // JSON
  String json = "{";
  json += "\"weight\":" + String(weight) + ",";
  json += "\"temperature\":" + String(temp) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"gas\":" + String(gas) + ",";
  json += "\"alcohol\":" + String(alcohol) + ",";
  json += "\"beef\":" + String(beef ? "true":"false") + ",";
  json += "\"alcohol_detected\":" + String(alcoholFlag ? "true":"false") + ",";
  json += "\"rain\":" + String(rainDetected ? "true":"false") + ",";
  json += "\"buzzer\":" + String(buzzerState ? "true":"false") + ",";
  json += "\"distance\":" + String(dist) + ",";
  json += "\"lat\":" + String(lat,6) + ",";
  json += "\"lng\":" + String(lng,6) + ",";
  json += "\"status\":\"" + status + "\"";
  json += "}";

  Serial.println(json);

  // WIFI SERVER
  WiFiClient client = server.available();

  if (client) {
    String req = client.readStringUntil('\r');
    client.flush();

    if (req.indexOf("/data") != -1) {
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: application/json; charset=utf-8");
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
