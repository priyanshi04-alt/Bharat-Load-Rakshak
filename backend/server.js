/**
 * BHARAT LOAD RAKSHAK - Server Bootstrap
 * Boots CAP Backend, Express REST endpoints, WebSocket Hub, MQTT Consumer, and DB Seed.
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const cds = require('@sap/cds');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { validateTelemetry } = require('./srv/telemetry-validator');
const alertEngine = require('./srv/alert-engine');
const wsServer = require('./srv/websocket-server');
const mqttConsumer = require('./srv/mqtt-consumer');
const documentEngine = require('./srv/document-expiry');
const driverScoringEngine = require('./srv/driver-scoring');

async function seedInitialDatabase(db) {
  console.log('[Database Seed] Checking initial seed data...');

  const existingTrucks = await db.run(SELECT.from('bharat.load.rakshak.Trucks'));
  if (existingTrucks.length > 0) {
    console.log('[Database Seed] Database already seeded.');
    return;
  }

  console.log('[Database Seed] Seeding initial trucks, drivers, devices, and documents...');

  // 1. Company
  await db.run(INSERT.into('bharat.load.rakshak.Companies').entries({
    companyId: 'COMP-001',
    name: 'Bharat Logistics & Express Transports Ltd.',
    email: 'contact@bharatlogistics.in',
    phone: '+91 9876543210',
    address: 'Logistics Park, NH-48, Gurugram, Haryana'
  }));

  // 2. Users (Role-based access)
  const users = [
    { userId: 'USR-001', username: 'admin', email: 'admin@bharatload.in', role: 'ADMIN', companyId: 'COMP-001', name: 'System Administrator' },
    { userId: 'USR-002', username: 'owner', email: 'owner@bharatload.in', role: 'OWNER', companyId: 'COMP-001', name: 'Rajesh Sharma (Fleet Owner)' },
    { userId: 'USR-003', username: 'manager', email: 'manager@bharatload.in', role: 'LOGISTICS_MANAGER', companyId: 'COMP-001', name: 'Vikram Singh (Logistics Mgr)' },
    { userId: 'USR-004', username: 'driver1', email: 'ramesh@bharatload.in', role: 'DRIVER', companyId: 'COMP-001', name: 'Ramesh Kumar (Driver)' },
    { userId: 'USR-005', username: 'warehouse', email: 'warehouse@bharatload.in', role: 'WAREHOUSE_USER', companyId: 'COMP-001', name: 'Suresh Patel (Warehouse Head)' }
  ];
  for (const u of users) await db.run(INSERT.into('bharat.load.rakshak.Users').entries(u));

  // 3. Drivers
  const drivers = [
    {
      driverId: 'BLR-DRV-001',
      companyId: 'COMP-001',
      name: 'Ramesh Kumar',
      licenseNumber: 'DL-0420110098765',
      phone: '+91 9811223344',
      status: 'ON_TRIP',
      licenseExpiryDate: '2027-12-31',
      safetyScore: 95.0,
      routeComplianceScore: 98.0,
      drivingEfficiencyScore: 92.0,
      reliabilityScore: 96.0,
      overallTrustScore: 95.2,
      tripsCompleted: 42,
      totalViolations: 1
    },
    {
      driverId: 'BLR-DRV-002',
      companyId: 'COMP-001',
      name: 'Suresh Singh',
      licenseNumber: 'DL-1420180012345',
      phone: '+91 9822334455',
      status: 'AVAILABLE',
      licenseExpiryDate: '2028-06-15',
      safetyScore: 88.0,
      routeComplianceScore: 90.0,
      drivingEfficiencyScore: 85.0,
      reliabilityScore: 89.0,
      overallTrustScore: 88.3,
      tripsCompleted: 28,
      totalViolations: 3
    },
    {
      driverId: 'BLR-DRV-003',
      companyId: 'COMP-001',
      name: 'Amit Verma',
      licenseNumber: 'DL-0920190055443',
      phone: '+91 9833445566',
      status: 'AVAILABLE',
      licenseExpiryDate: '2026-10-15',
      safetyScore: 78.0,
      routeComplianceScore: 82.0,
      drivingEfficiencyScore: 76.0,
      reliabilityScore: 80.0,
      overallTrustScore: 79.1,
      tripsCompleted: 15,
      totalViolations: 6
    }
  ];
  for (const d of drivers) await db.run(INSERT.into('bharat.load.rakshak.Drivers').entries(d));

  // 4. Devices
  const devices = [
    { deviceId: 'BLR-DEV-001', truckId: 'BLR-TRK-001', firmwareVersion: 'v2.1.0-ESP32', lastSeen: new Date().toISOString(), connectionStatus: 'ONLINE', batteryVoltage: 4.95 },
    { deviceId: 'BLR-DEV-002', truckId: 'BLR-TRK-002', firmwareVersion: 'v2.1.0-ESP32', lastSeen: new Date().toISOString(), connectionStatus: 'ONLINE', batteryVoltage: 4.88 },
    { deviceId: 'BLR-DEV-003', truckId: 'BLR-TRK-003', firmwareVersion: 'v2.0.4-ESP32', lastSeen: new Date().toISOString(), connectionStatus: 'OFFLINE', batteryVoltage: 4.20 }
  ];
  for (const dev of devices) await db.run(INSERT.into('bharat.load.rakshak.Devices').entries(dev));

  // 5. Trucks
  const trucks = [
    {
      truckId: 'BLR-TRK-001',
      companyId: 'COMP-001',
      registrationNumber: 'HR-55-AB-1234',
      model: 'Tata Prima 3530.K Heavy Hauler',
      maximumAllowedWeightKg: 10000.0,
      currentStatus: 'ON_TRIP',
      assignedDriverId: 'BLR-DRV-001',
      deviceId: 'BLR-DEV-001',
      insuranceExpiry: '2027-05-20',
      pucExpiry: '2026-11-15',
      fitnessExpiry: '2027-08-10',
      permitExpiry: '2028-01-01',
      lastMaintenanceDate: '2026-08-01'
    },
    {
      truckId: 'BLR-TRK-002',
      companyId: 'COMP-001',
      registrationNumber: 'MH-12-PQ-9876',
      model: 'Ashok Leyland 2820 Cargo Hauler',
      maximumAllowedWeightKg: 8500.0,
      currentStatus: 'AVAILABLE',
      assignedDriverId: 'BLR-DRV-002',
      deviceId: 'BLR-DEV-002',
      insuranceExpiry: '2026-09-20', // Upcoming 20 days warning!
      pucExpiry: '2027-01-10',
      fitnessExpiry: '2027-03-15',
      permitExpiry: '2027-11-30',
      lastMaintenanceDate: '2026-07-15'
    },
    {
      truckId: 'BLR-TRK-003',
      companyId: 'COMP-001',
      registrationNumber: 'DL-01-XY-5555',
      model: 'Eicher Pro 6028 Logistics Truck',
      maximumAllowedWeightKg: 7000.0,
      currentStatus: 'MAINTENANCE',
      assignedDriverId: 'BLR-DRV-003',
      deviceId: 'BLR-DEV-003',
      insuranceExpiry: '2026-08-15', // EXPIRED!
      pucExpiry: '2026-09-05',
      fitnessExpiry: '2026-12-01',
      permitExpiry: '2027-04-10',
      lastMaintenanceDate: '2026-06-01'
    }
  ];
  for (const t of trucks) await db.run(INSERT.into('bharat.load.rakshak.Trucks').entries(t));

  // 6. Cargo
  const cargo = [
    {
      cargoId: 'CRG-001',
      description: 'High Precision Semiconductor Electronic Chips',
      cargoType: 'HIGH_VALUE',
      weightKg: 8450.0,
      priority: 'CRITICAL',
      requiredSafetyLevel: 'MAXIMUM',
      declaredValue: 25000000.0
    },
    {
      cargoId: 'CRG-002',
      description: 'Perishable Organic Food Grains & Spices',
      cargoType: 'PERISHABLE',
      weightKg: 6200.0,
      priority: 'HIGH',
      requiredSafetyLevel: 'HIGH',
      declaredValue: 1200000.0
    }
  ];
  for (const c of cargo) await db.run(INSERT.into('bharat.load.rakshak.Cargo').entries(c));

  // 7. Trips
  const trips = [
    {
      tripId: 'TRP-1001',
      truckId: 'BLR-TRK-001',
      driverId: 'BLR-DRV-001',
      cargoId: 'CRG-001',
      origin: 'Gurugram Industrial Hub, Haryana',
      destination: 'Bhiwandi Logistics Hub, Mumbai, Maharashtra',
      originLat: 28.4595,
      originLng: 77.0266,
      destLat: 19.2812,
      destLng: 73.0482,
      routeToleranceKm: 10.0,
      status: 'IN_TRANSIT',
      startTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      eta: new Date(Date.now() + 18 * 3600 * 1000).toISOString()
    }
  ];
  for (const trp of trips) await db.run(INSERT.into('bharat.load.rakshak.Trips').entries(trp));

  // 8. Initial Telemetry Point
  const initTelemetry = {
    deviceId: 'BLR-DEV-001',
    truckId: 'BLR-TRK-001',
    tripId: 'TRP-1001',
    timestamp: new Date().toISOString(),
    weightKg: 8450.0,
    humidityPercent: 58.5,
    rainDetected: false,
    gasValue: 110.0,
    alcoholValue: 0.0,
    latitude: 26.9124, // Near Jaipur along NH-48 route
    longitude: 75.7873,
    speedKmph: 62.4,
    isDemoData: false
  };
  await db.run(INSERT.into('bharat.load.rakshak.Telemetry').entries(initTelemetry));

  // 9. Initial Vehicle Documents
  const docs = [
    { truckId: 'BLR-TRK-001', documentType: 'RC', documentNumber: 'RC-HR55AB1234-2022', expiryDate: '2032-05-10', status: 'VALID' },
    { truckId: 'BLR-TRK-001', documentType: 'INSURANCE', documentNumber: 'INS-POL-99887766', expiryDate: '2027-05-20', status: 'VALID' },
    { truckId: 'BLR-TRK-002', documentType: 'INSURANCE', documentNumber: 'INS-POL-44332211', expiryDate: '2026-09-20', status: 'WARNING_30' },
    { truckId: 'BLR-TRK-003', documentType: 'INSURANCE', documentNumber: 'INS-POL-11223344', expiryDate: '2026-08-15', status: 'EXPIRED' }
  ];
  for (const doc of docs) await db.run(INSERT.into('bharat.load.rakshak.VehicleDocuments').entries(doc));

  console.log('[Database Seed] Seeding completed successfully!');
}

async function startServer() {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  // Initialize Real-time WebSockets
  wsServer.init(server);

  // Bootstrap CAP
  console.log('[CAP Core] Serving CAP OData services...');
  cds.model = await cds.load([path.join(__dirname, 'db/schema'), path.join(__dirname, 'srv/cat-service')]);
  await cds.connect('db');
  const db = cds.db;

  // Run Seed Script
  await seedInitialDatabase(db);

  // Run Initial Document Expiry Check
  await documentEngine.checkDocumentExpirations(db);

  // Attach CAP Express Router
  await cds.serve('all').from(cds.model).in(app);

  // Body parser for REST API routes only
  app.use('/api', express.json());

  // --- REST API Endpoint: POST /api/telemetry ---
  app.post('/api/telemetry', async (req, res) => {
    try {
      const payload = req.body;
      const validation = validateTelemetry(payload);

      if (!validation.isValid) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Telemetry payload failed validation',
          errors: validation.errors
        });
      }

      const sanitized = validation.sanitized;

      // 1. Insert Telemetry
      await db.run(INSERT.into('bharat.load.rakshak.Telemetry').entries(sanitized));

      // 2. Evaluate Business Rules & Generate Alerts
      const alertResult = await alertEngine.processTelemetry(db, sanitized);

      // 3. Broadcast over WebSockets
      wsServer.broadcast('TELEMETRY_UPDATE', sanitized);
      if (alertResult.alertsCreated > 0) {
        wsServer.broadcast('ALERT_GENERATED', alertResult.alerts);
      }

      return res.status(201).json({
        status: 'SUCCESS',
        message: 'Telemetry ingested and processed successfully',
        data: {
          deviceId: sanitized.deviceId,
          truckId: sanitized.truckId,
          alertsGenerated: alertResult.alertsCreated,
          commandsDispatched: alertResult.commandsDispatched,
          alerts: alertResult.alerts
        }
      });
    } catch (err) {
      console.error('[REST Ingestion Error]', err);
      return res.status(500).json({ status: 'ERROR', message: err.message });
    }
  });

  // REST API Endpoint: GET /api/fleet/summary
  app.get('/api/fleet/summary', async (req, res) => {
    try {
      const trucks = await db.run(SELECT.from('bharat.load.rakshak.Trucks'));
      const activeTrips = await db.run(SELECT.from('bharat.load.rakshak.Trips').where({ status: 'IN_TRANSIT' }));
      const openAlerts = await db.run(SELECT.from('bharat.load.rakshak.Alerts').where({ status: 'OPEN' }));
      const drivers = await db.run(SELECT.from('bharat.load.rakshak.Drivers'));

      const avgScore = drivers.length > 0
        ? (drivers.reduce((acc, d) => acc + (d.overallTrustScore || 100), 0) / drivers.length)
        : 100;

      res.json({
        totalTrucks: trucks.length,
        activeTrucks: trucks.filter(t => t.currentStatus === 'ON_TRIP' || t.currentStatus === 'AVAILABLE').length,
        alertTrucks: trucks.filter(t => t.currentStatus === 'ALERT').length,
        ongoingTrips: activeTrips.length,
        openAlerts: openAlerts.length,
        criticalAlerts: openAlerts.filter(a => a.severity === 'CRITICAL').length,
        averageTrustScore: Math.round(avgScore * 10) / 10
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Initialize MQTT Consumer
  mqttConsumer.init(db);

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 BHARAT LOAD RAKSHAK Backend Server Running!`);
    console.log(`📡 REST Ingestion Endpoint: http://localhost:${PORT}/api/telemetry`);
    console.log(`📊 OData v4 Endpoint: http://localhost:${PORT}/odata/v4/fleet`);
    console.log(`⚡ WebSocket Stream Server: ws://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(console.error);
