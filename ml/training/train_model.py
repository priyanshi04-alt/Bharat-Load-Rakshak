"""
BHARAT LOAD RAKSHAK - ML Model Training Script
Trains a Scikit-Learn Random Forest Classifier on driver historical telemetry & violation records.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def train_and_save_model():
    print("[ML Training] Generating historical synthetic trip training dataset...")
    np.random.seed(42)

    # 1,000 Historical Trip Records
    n_samples = 1000
    safety_score = np.random.uniform(50, 100, n_samples)
    route_compliance = np.random.uniform(60, 100, n_samples)
    driving_efficiency = np.random.uniform(55, 100, n_samples)
    reliability_score = np.random.uniform(60, 100, n_samples)
    cargo_value_lakhs = np.random.uniform(1, 250, n_samples)
    cargo_safety_req = np.random.choice([1, 2, 3], n_samples) # 1=Standard, 2=High, 3=Maximum

    # Risk Label Calculation (0 = Low Risk / Match, 1 = High Risk)
    risk_score = (
        (100 - safety_score) * 0.4 +
        (100 - route_compliance) * 0.25 +
        (100 - driving_efficiency) * 0.15 +
        (100 - reliability_score) * 0.2 +
        (cargo_safety_req * 5.0)
    )
    y = (risk_score > 25.0).astype(int)

    X = pd.DataFrame({
        'safetyScore': safety_score,
        'routeComplianceScore': route_compliance,
        'drivingEfficiencyScore': driving_efficiency,
        'reliabilityScore': reliability_score,
        'cargoValueLakhs': cargo_value_lakhs,
        'cargoSafetyReq': cargo_safety_req
    })

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("[ML Training] Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[ML Training] Model trained successfully! Accuracy: {acc * 100:.2f}%")

    output_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, 'driver_risk_model.joblib')
    joblib.dump(model, model_path)
    print(f"[ML Training] Model saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model()
