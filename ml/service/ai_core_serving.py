"""
BHARAT LOAD RAKSHAK - SAP AI Core Compliant Model Serving Wrapper
Serves REST inference endpoints compatible with SAP AI Launchpad.
"""

from flask import Flask, request, jsonify
import numpy as np
import os
import joblib

app = Flask(__name__)

# Model loading logic
MODEL_PATH = os.environ.get('MODEL_PATH', os.path.join(os.path.dirname(__file__), '../models/driver_risk_model.joblib'))
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"[SAP AI Core Serving] Successfully loaded model from {MODEL_PATH}")
    except Exception as e:
        print(f"[SAP AI Core Serving Error] Could not load model: {e}")

@app.route('/v1/health', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ONLINE',
        'engine': 'SAP AI Core - BHARAT LOAD RAKSHAK Serving',
        'modelLoaded': model is not None,
        'modelPath': MODEL_PATH
    })

@app.route('/v1/predict', methods=['POST'])
@app.route('/predict-driver-match', methods=['POST'])
def predict():
    data = request.json or {}
    drivers = data.get('drivers', [])
    cargo_value = float(data.get('cargoValue', 100000))
    required_safety = data.get('requiredSafetyLevel', 'STANDARD')

    if not drivers:
        return jsonify({'error': 'No drivers provided'}), 400

    safety_req_val = 1
    if required_safety == 'HIGH': safety_req_val = 2
    if required_safety == 'MAXIMUM': safety_req_val = 3

    cargo_lakhs = cargo_value / 100000.0
    best_driver = None
    min_risk_prob = 1.0

    for d in drivers:
        safety = float(d.get('safetyScore', 100))
        route = float(d.get('routeComplianceScore', 100))
        efficiency = float(d.get('drivingEfficiencyScore', 100))
        reliability = float(d.get('reliabilityScore', 100))

        if model is not None:
            features = np.array([[safety, route, efficiency, reliability, cargo_lakhs, safety_req_val]])
            risk_prob = float(model.predict_proba(features)[0][1])
        else:
            risk_prob = float(1.0 - ((safety * 0.4 + route * 0.3 + efficiency * 0.15 + reliability * 0.15) / 100.0))

        if risk_prob < min_risk_prob:
            min_risk_prob = risk_prob
            best_driver = d

    if not best_driver:
        best_driver = drivers[0]

    return jsonify({
        'recommendedDriverId': best_driver.get('driverId'),
        'recommendedDriverName': best_driver.get('name'),
        'riskIndex': round(min_risk_prob, 4),
        'isMlRecommendation': model is not None,
        'deploymentTarget': 'SAP AI Core / SAP AI Launchpad'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9000))
    print(f"[SAP AI Core Serving] Starting server on Port {port}...")
    app.run(host='0.0.0.0', port=port)
