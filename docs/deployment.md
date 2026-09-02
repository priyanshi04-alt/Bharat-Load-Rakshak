# Deployment Guide - Local & SAP BTP Cloud Foundry

## Local Execution (`MODE=LOCAL`)

1. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../iot/simulator && npm install
   ```

2. **Start Backend Server**:
   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend Dashboard**:
   ```bash
   cd frontend && npm run dev
   ```

4. **Start Hardware Telemetry Simulator**:
   ```bash
   cd iot/simulator && npm start
   ```

## SAP BTP Cloud Foundry Deployment (`MODE=SAP`)

1. Build MTA archive:
   ```bash
   mbt build
   ```
2. Deploy to Cloud Foundry org and space:
   ```bash
   cf deploy mta_archives/bharat-load-rakshak_1.0.0.mtar
   ```
