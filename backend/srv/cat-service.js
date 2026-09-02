/**
 * BHARAT LOAD RAKSHAK - SAP CAP FleetService Implementation
 * Handlers for OData queries, driver scoring, alert lifecycle, and hardware commands.
 */

const cds = require('@sap/cds');
const driverScoringEngine = require('./driver-scoring');
const mqttConsumer = require('./mqtt-consumer');

module.exports = cds.service.impl(async function () {
  const { Trucks, Drivers, Trips, Alerts, Telemetry, HardwareCommands } = this.entities;

  // 1. Function: getFleetSummary
  this.on('getFleetSummary', async (req) => {
    const db = cds.db;
    const totalTrucks = await db.run(SELECT.from(Trucks));
    const activeTrucks = totalTrucks.filter(t => t.currentStatus === 'ON_TRIP' || t.currentStatus === 'AVAILABLE');
    const safeTrucks = totalTrucks.filter(t => t.currentStatus === 'AVAILABLE' || t.currentStatus === 'ON_TRIP');
    const alertTrucks = totalTrucks.filter(t => t.currentStatus === 'ALERT');

    const ongoingTrips = await db.run(SELECT.from(Trips).where({ status: 'IN_TRANSIT' }));
    const completedTrips = await db.run(SELECT.from(Trips).where({ status: 'COMPLETED' }));

    const openAlerts = await db.run(SELECT.from(Alerts).where({ status: 'OPEN' }));
    const criticalAlerts = openAlerts.filter(a => a.severity === 'CRITICAL');

    const drivers = await db.run(SELECT.from(Drivers));
    const avgTrustScore = drivers.length > 0
      ? (drivers.reduce((acc, d) => acc + (d.overallTrustScore || 100), 0) / drivers.length)
      : 100;

    return {
      totalTrucks: totalTrucks.length,
      activeTrucks: activeTrucks.length,
      safeTrucks: safeTrucks.length,
      alertTrucks: alertTrucks.length,
      ongoingTrips: ongoingTrips.length,
      completedTrips: completedTrips.length,
      openAlerts: openAlerts.length,
      criticalAlerts: criticalAlerts.length,
      averageTrustScore: Math.round(avgTrustScore * 10) / 10
    };
  });

  // 2. Function: recommendDriver
  this.on('recommendDriver', async (req) => {
    const { cargoType, cargoValue, destination, priority, requiredSafetyLevel } = req.data;
    const recommendation = await driverScoringEngine.recommendDriverForCargo(cds.db, {
      cargoType,
      cargoValue,
      destination,
      priority,
      requiredSafetyLevel
    });
    return recommendation;
  });

  // 3. Action: acknowledgeAlert
  this.on('acknowledgeAlert', async (req) => {
    const { alertId, acknowledgedBy } = req.data;
    const timestamp = new Date().toISOString();
    await cds.db.run(
      UPDATE(Alerts)
        .set({ status: 'ACKNOWLEDGED', acknowledgedBy, acknowledgedAt: timestamp })
        .where({ ID: alertId })
    );

    const updated = await cds.db.run(SELECT.one.from(Alerts).where({ ID: alertId }));
    return updated;
  });

  // 4. Action: resolveAlert
  this.on('resolveAlert', async (req) => {
    const { alertId } = req.data;
    const timestamp = new Date().toISOString();
    await cds.db.run(
      UPDATE(Alerts)
        .set({ status: 'RESOLVED', resolvedAt: timestamp })
        .where({ ID: alertId })
    );

    const updated = await cds.db.run(SELECT.one.from(Alerts).where({ ID: alertId }));

    // Reset truck status to AVAILABLE if no more open alerts for that truck
    if (updated && updated.truckId) {
      const remainingAlerts = await cds.db.run(
        SELECT.from(Alerts).where({ truckId: updated.truckId, status: 'OPEN' })
      );
      if (remainingAlerts.length === 0) {
        await cds.db.run(
          UPDATE(Trucks).set({ currentStatus: 'AVAILABLE' }).where({ truckId: updated.truckId })
        );
      }
    }

    return updated;
  });

  // 5. Action: sendHardwareCommand
  this.on('sendHardwareCommand', async (req) => {
    const { deviceId, truckId, commandType, parameter } = req.data;
    const timestamp = new Date().toISOString();

    const entry = {
      deviceId,
      truckId,
      commandType,
      parameter,
      status: 'DISPATCHED',
      timestamp
    };

    await cds.db.run(INSERT.into(HardwareCommands).entries(entry));

    // Dispatch via MQTT Consumer
    mqttConsumer.publishCommand(deviceId, truckId, commandType, parameter);

    return entry;
  });
});
