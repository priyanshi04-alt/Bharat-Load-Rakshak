# Hardware Integration Specification - ESP32

## Physical Sensors & Pinout Diagram

| Sensor / Component | Model | ESP32 Interface Pin | Function |
| :--- | :--- | :--- | :--- |
| **Load Cell + HX711** | 20kg - 50t Load Cell | GPIO 16 (DOUT), GPIO 17 (SCK) | Cargo Weight Ingestion (kg) |
| **GPS Module** | Neo-6M GPS | GPIO 18 (RX), GPIO 19 (TX) | Latitude, Longitude, Speed (km/h) |
| **Humidity Sensor** | DHT11 / DHT22 | GPIO 4 (Digital Data) | Cargo Container Humidity (% RH) |
| **Rain Ingress Sensor**| Water Level Module | GPIO 34 (Analog In) | Moisture / Tarpaulin Seal Leak Detection |
| **Air Quality Sensor** | MQ135 Gas Sensor | GPIO 35 (Analog In) | Abnormal Gas Concentration Detection |
| **Alcohol Sensor** | MQ3 Alcohol Sensor | GPIO 32 (Analog In) | Driver Alcohol Threshold Verification |
| **Visual LCD Display** | 16x2 I2C LCD | GPIO 21 (SDA), GPIO 22 (SCL) | Live Sensor Readings & Local Warnings |
| **Audio Alarm** | Active Buzzer 5V | GPIO 25 (Digital Output) | Local Overload & Alcohol Audio Alarm |
| **Status Indicators** | Red / Green 5mm LEDs| GPIO 26 (Red), GPIO 27 (Green) | System Safety Status Visual Indicator |

## Bidirectional Command Channel Interface

The ESP32 listens on MQTT topic `bharatloadrakshak/{truckId}/commands` for incoming hardware commands dispatched by the CAP backend:
- `BUZZER_ON`: Triggers continuous audio warning.
- `BUZZER_OFF`: Silences active audio alarm.
- `LED_RED`: Switches status LED to Red (Alert state).
- `LED_GREEN`: Switches status LED to Green (Safe state).
- `LCD_ALERT`: Updates local LCD screen with alert parameter string.
