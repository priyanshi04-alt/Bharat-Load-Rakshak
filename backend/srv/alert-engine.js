/**
 * BHARAT LOAD RAKSHAK - Business Rules & Alert Engine
 * Evaluates real-time telemetry against truck, trip, and threshold parameters.
 */

const eventMesh = require('./event-mesh-adapter');

// Haversine distance calculator in Kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Distance from point to line segment (Route deviation estimation)
function calculateRouteDeviationKm(currLat, currLng, origLat, origLng, destLat, destLng) {
  const dOrig = calculateHaversineDistance(currLat, currLng, origLat, origLng);
  const dDest = calculateHaversineDistance(currLat, currLng, destLat, destLng);
  const dRoute = calculateHaversineDistance(origLat, origLng, destLat, destLng);

  // Triangular estimation of off-track distance
  if (dRoute === 0) return dOrig;
  const s = (dOrig + dDest + dRoute) / 2;
  const area = Math.sqrt(Math.max(0, s * (s - dOrig) * (s - dDest) * (s - dRoute)));
  const perpendicularDist = (2 * area) / dRoute;

  return isNaN(perpendicularDist) ? 0 : perpendicularDist;
}

class AlertEngine {
  async processTelemetry(db, telemetry) {
    const alertsToCreate = [];
    const commandsToDispatch = [];

    const { truckId, deviceId, tripId, weightKg, humidityPercent, rainDetected, gasValue, alcoholValue, latitude, longitude, speedKmph, timestamp, isDemoData } = telemetry;

    // 1. Fetch Truck Information
    const truck = await db.run(SELECT.one.from('bharat.load.rakshak.Trucks').where({ truckId }));
    let driverId = truck ? truck.assignedDriverId : null;

    // 2. Fetch Active Trip if any
    let activeTrip = null;
    if (tripId) {
      activeTrip = await db.run(SELECT.one.from('bharat.load.rakshak.Trips').where({ tripId }));
    } else if (truckId) {
      activeTrip = await db.run(SELECT.one.from('bharat.load.rakshak.Trips').where({ truckId, status: 'IN_TRANSIT' }));
    }

    if (activeTrip && !driverId) {
      driverId = activeTrip.driverId;
    }

    // --- RULE A: OVERLOAD MONITORING ---
    const maxWeight = (truck && truck.maximumAllowedWeightKg) ? truck.maximumAllowedWeightKg : 10000;
    if (weightKg > maxWeight) {
      let severity = 'MEDIUM';
      if (weightKg > 1.2 * maxWeight) severity = 'CRITICAL';
      else if (weightKg > 1.05 * maxWeight) severity = 'HIGH';

      alertsToCreate.push({
        type: 'OVERLOAD',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity,
        message: `Truck ${truck ? truck.registrationNumber : truckId} overloaded! Current: ${weightKg} kg, Max allowed: ${maxWeight} kg.`,
        status: 'OPEN',
        isDemoData
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'BUZZER_ON',
        parameter: 'OVERLOAD_ALERT',
        status: 'PENDING',
        timestamp
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'LED_RED',
        parameter: 'ON',
        status: 'PENDING',
        timestamp
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'LCD_ALERT',
        parameter: `OVERLOAD: ${weightKg}kg`,
        status: 'PENDING',
        timestamp
      });

      // Update truck status to ALERT
      if (truck) {
        await db.run(UPDATE('bharat.load.rakshak.Trucks').set({ currentStatus: 'ALERT' }).where({ truckId }));
      }
    }

    // --- RULE B: ALCOHOL THRESHOLD MONITORING ---
    const ALCOHOL_THRESHOLD = 150; // MQ3 raw analog threshold
    if (alcoholValue > ALCOHOL_THRESHOLD) {
      alertsToCreate.push({
        type: 'ALCOHOL_THRESHOLD',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity: 'CRITICAL',
        message: 'Alcohol sensor threshold exceeded — verification required.',
        status: 'OPEN',
        isDemoData
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'BUZZER_ON',
        parameter: 'ALCOHOL_ALERT',
        status: 'PENDING',
        timestamp
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'LED_RED',
        parameter: 'ON',
        status: 'PENDING',
        timestamp
      });

      commandsToDispatch.push({
        deviceId,
        truckId,
        commandType: 'LCD_ALERT',
        parameter: 'ALCOHOL VERIFY!',
        status: 'PENDING',
        timestamp
      });
    }

    // --- RULE C: ROUTE DEVIATION MONITORING ---
    if (activeTrip && activeTrip.originLat && activeTrip.destLat) {
      const toleranceKm = activeTrip.routeToleranceKm || 5.0;
      const deviationKm = calculateRouteDeviationKm(
        latitude, longitude,
        activeTrip.originLat, activeTrip.originLng,
        activeTrip.destLat, activeTrip.destLng
      );

      if (deviationKm > toleranceKm) {
        alertsToCreate.push({
          type: 'ROUTE_DEVIATION',
          truckId,
          driverId,
          tripId: activeTrip.tripId,
          timestamp,
          severity: 'HIGH',
          message: `Route deviation detected! Vehicle is ${deviationKm.toFixed(1)} km away from approved route (Tolerance: ${toleranceKm} km).`,
          status: 'OPEN',
          isDemoData
        });
      }
    }

    // --- RULE D: OVERSPEED MONITORING ---
    if (speedKmph > 80) {
      const severity = speedKmph > 100 ? 'HIGH' : 'MEDIUM';
      alertsToCreate.push({
        type: 'OVERSPEED',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity,
        message: `Overspeed alert! Vehicle travelling at ${speedKmph.toFixed(1)} km/h (Limit: 80 km/h).`,
        status: 'OPEN',
        isDemoData
      });
    }

    // --- RULE E: CARGO ENVIRONMENT MONITORING ---
    // E1. MQ135 Air Quality / Gas Concentration
    const GAS_THRESHOLD = 300;
    if (gasValue > GAS_THRESHOLD) {
      alertsToCreate.push({
        type: 'ABNORMAL_GAS',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity: 'HIGH',
        message: 'Abnormal Gas Concentration Detected — Inspection Required.',
        status: 'OPEN',
        isDemoData
      });
    }

    // E2. Rain / Water Ingress Sensor
    if (rainDetected) {
      alertsToCreate.push({
        type: 'WATER_INGRESS',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity: 'HIGH',
        message: 'Water Ingress Alert: Moisture/Rain detected on cargo container cover.',
        status: 'OPEN',
        isDemoData
      });
    }

    // E3. High Humidity
    if (humidityPercent > 85) {
      alertsToCreate.push({
        type: 'HIGH_HUMIDITY',
        truckId,
        driverId,
        tripId: activeTrip ? activeTrip.tripId : null,
        timestamp,
        severity: 'MEDIUM',
        message: `High humidity detected in container (${humidityPercent.toFixed(1)}%).`,
        status: 'OPEN',
        isDemoData
      });
    }

    // --- PERSIST ALERTS & DISPATCH EVENTS ---
    const createdAlerts = [];
    for (const alertData of alertsToCreate) {
      // Check if duplicate open alert created in last 5 minutes to prevent spam
      const existing = await db.run(
        SELECT.one.from('bharat.load.rakshak.Alerts')
          .where({ truckId: alertData.truckId, type: alertData.type, status: 'OPEN' })
      );

      if (!existing) {
        const result = await db.run(INSERT.into('bharat.load.rakshak.Alerts').entries(alertData));
        createdAlerts.push(alertData);

        // Publish to SAP Event Mesh / Event Adapter
        await eventMesh.publish(alertData.type, alertData);
      }
    }

    // Persist Hardware Commands
    for (const cmdData of commandsToDispatch) {
      await db.run(INSERT.into('bharat.load.rakshak.HardwareCommands').entries(cmdData));
    }

    // Update Device status & lastSeen
    await db.run(
      UPDATE('bharat.load.rakshak.Devices')
        .set({ lastSeen: timestamp, connectionStatus: 'ONLINE' })
        .where({ deviceId })
    );

    return {
      alertsCreated: createdAlerts.length,
      commandsDispatched: commandsToDispatch.length,
      alerts: createdAlerts
    };
  }
}

module.exports = new AlertEngine();
