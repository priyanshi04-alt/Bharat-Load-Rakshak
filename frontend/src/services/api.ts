import { FleetSummary, Truck, Driver, Alert, Telemetry, Trip, VehicleDocument, HardwareCommand } from '../types';

const ODATA_BASE = '/odata/v4/fleet';
const REST_BASE = '/api';

export async function fetchFleetSummary(): Promise<FleetSummary> {
  try {
    const res = await fetch(`${REST_BASE}/fleet/summary`);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return await res.json();
  } catch (err) {
    // Fallback default summary if offline
    return {
      totalTrucks: 3,
      activeTrucks: 2,
      safeTrucks: 2,
      alertTrucks: 1,
      ongoingTrips: 1,
      completedTrips: 12,
      openAlerts: 1,
      criticalAlerts: 0,
      averageTrustScore: 88.5
    };
  }
}

export async function fetchTrucks(): Promise<Truck[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/Trucks`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function fetchDrivers(): Promise<Driver[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/Drivers`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/Alerts?$orderby=timestamp desc`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function fetchLatestTelemetry(): Promise<Telemetry[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/Telemetry?$orderby=timestamp desc&$top=50`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function fetchTrips(): Promise<Trip[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/Trips`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function fetchDocuments(): Promise<VehicleDocument[]> {
  try {
    const res = await fetch(`${ODATA_BASE}/VehicleDocuments`);
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    return [];
  }
}

export async function acknowledgeAlertApi(alertId: string, acknowledgedBy: string) {
  const res = await fetch(`${ODATA_BASE}/acknowledgeAlert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId, acknowledgedBy })
  });
  return await res.json();
}

export async function resolveAlertApi(alertId: string) {
  const res = await fetch(`${ODATA_BASE}/resolveAlert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId })
  });
  return await res.json();
}

export async function sendHardwareCommandApi(cmd: { deviceId: string; truckId: string; commandType: string; parameter: string }) {
  const res = await fetch(`${ODATA_BASE}/sendHardwareCommand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  return await res.json();
}

export async function recommendDriverApi(payload: {
  cargoType: string;
  cargoValue: number;
  destination: string;
  priority: string;
  requiredSafetyLevel: string;
}) {
  const res = await fetch(`${ODATA_BASE}/recommendDriver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

// REST Telemetry Simulation POST
export async function sendSimulatedTelemetry(payload: Partial<Telemetry>) {
  const res = await fetch(`${REST_BASE}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}
