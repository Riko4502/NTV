/** biome-ignore-all lint/suspicious/noConsole: console.log нужен для отладки */
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { networkState } from './store/state';
import { initWebSocketServer } from './websocket/server';

const app = express();
app.use(cors());
const httpServer = createServer(app);

// Initialize WebSocket server
initWebSocketServer(httpServer);

const PORT = 3001;

// --- Telemetry Simulation Ticker (runs every 1 second) ---
const telemetryInterval = setInterval(() => {
  networkState.tickTelemetry();
}, 1000);

// --- Random Alert Generator Ticker (runs every 12 seconds) ---
const alertInterval = setInterval(() => {
  networkState.tickRandomAlert();
}, 12000);

// --- REST Endpoint for simple check ---
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    nodeCount: networkState.nodes.length,
    edgeCount: networkState.edges.length,
  });
});

httpServer.listen(PORT, () => {
  console.log(`Topology simulation server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(telemetryInterval);
  clearInterval(alertInterval);
  networkState.cleanup();
  httpServer.close(() => {
    console.log('Server stopped.');
  });
});

process.on('SIGINT', () => {
  clearInterval(telemetryInterval);
  clearInterval(alertInterval);
  networkState.cleanup();
  httpServer.close(() => {
    console.log('Server stopped.');
  });
});
