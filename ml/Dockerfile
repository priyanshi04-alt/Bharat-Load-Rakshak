# BHARAT LOAD RAKSHAK - Dockerfile for SAP AI Core / SAP AI Launchpad
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy training script, models, and service code
COPY training/ ./training/
COPY models/ ./models/
COPY service/ ./service/

# Train model if joblib binary is missing
RUN python training/train_model.py

# SAP AI Core standard serving port is 9000 (fallback 5000)
ENV PORT=9000
EXPOSE 9000

CMD ["python", "service/ai_core_serving.py"]
