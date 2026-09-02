"""
BHARAT LOAD RAKSHAK - Python ML Microservice
Provides REST endpoints for Driver Risk Prediction & Match Recommendations.
"""

from flask import Flask, request, jsonify
import numpy as np
import os
import joblib

app = Flask(__name__)

# Load trained Random Forest model if available
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/driver_risk_model.joblib')
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"[ML Service] Successfully loaded model from {MODEL_PATH}")
    except Exception as e:
        print(f"[ML Service Error] Could not load model: {e}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ONLINE',
        'service': 'BHARAT LOAD RAKSHAK ML Engine',
        'modelLoaded': model is not None
    })

@app.route('/predict-driver-match', methods=['POST'])
def predict_driver_match():
    data = request.json or {}
    drivers = data.get('drivers', [])
    cargo_type = data.get('cargoType', 'GENERAL')
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
            risk_prob = model.predict_proba(features)[0][1] # Probability of High Risk
        else:
            # Baseline Transparent Risk Index Formula
            risk_prob = 1.0 - (
                (safety * 0.4 + route * 0.3 + efficiency * 0.15 + reliability * 0.15) / 100.0
            )

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
        'modelName': 'Scikit-Learn Random Forest Classifier v1.0' if model is not None else 'Transparent Baseline Engine'
    })

if __name__ == '__main__':
    print("[ML Service] Starting Flask Microservice on Port 5000...")
    app.run(host='0.0.0.0', port=5000)
