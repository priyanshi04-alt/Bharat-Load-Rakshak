# Driver Intelligence & Machine Learning Architecture

## Transparent Driver Trust Scoring Engine

The platform calculates a 0–100 **Overall Driver Trust Score** using an explainable multi-factor formula:

$$\text{Overall Trust Score} = 0.35 \times S + 0.25 \times C + 0.20 \times E + 0.20 \times R$$

Where:
- **$S$ (Safety Score)**: Penalizes overspeed events (-5), overload violations (-15), and alcohol threshold alerts (-50).
- **$C$ (Route Compliance Score)**: Penalizes route deviation alerts (-15).
- **$E$ (Driving Efficiency Score - Proxy)**: Evaluates speed consistency, route efficiency, and trip duration. Explicitly labeled as a proxy until physical fuel-flow sensors are installed.
- **$R$ (Delivery Reliability Score)**: Based on completed trip history and violation count.

## Python Scikit-Learn Random Forest Model

When historical trip datasets are accumulated, the backend calls the Python Flask microservice (`/predict-driver-match`) running a trained Scikit-Learn Random Forest Classifier to evaluate risk probability and recommend optimal driver dispatch for sensitive cargo.
