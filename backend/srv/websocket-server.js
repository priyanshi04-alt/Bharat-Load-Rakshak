/**
 * BHARAT LOAD RAKSHAK - Real-Time WebSocket Event Server
 * Streams telemetry updates and system alerts live to connected frontend clients.
 */

const WebSocket = require('ws');

class RealtimeWebSocketServer {
  init(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log(`[WebSocket Hub] Client connected. Active clients: ${this.clients.size}`);

      ws.send(JSON.stringify({
        type: 'SYSTEM_CONNECTED',
        timestamp: new Date().toISOString(),
        message: 'Connected to BHARAT LOAD RAKSHAK Real-Time Telemetry Stream'
      }));

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WebSocket Hub] Client disconnected. Active clients: ${this.clients.size}`);
      });

      ws.on('error', (err) => {
        console.error('[WebSocket Client Error]', err.message);
        this.clients.delete(ws);
      });
    });
  }

  broadcast(eventType, data) {
    if (!this.clients || this.clients.size === 0) return;

    const payload = JSON.stringify({
      type: eventType,
      timestamp: new Date().toISOString(),
      data
    });

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }
}

module.exports = new RealtimeWebSocketServer();
