"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** biome-ignore-all lint/suspicious/noConsole: console.log нужен для отладки */
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const state_1 = require("./store/state");
const server_1 = require("./websocket/server");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
// Initialize WebSocket server
(0, server_1.initWebSocketServer)(httpServer);
const PORT = 3001;
// --- Telemetry Simulation Ticker (runs every 1 second) ---
const telemetryInterval = setInterval(() => {
    state_1.networkState.tickTelemetry();
}, 1000);
// --- Random Alert Generator Ticker (runs every 12 seconds) ---
const alertInterval = setInterval(() => {
    state_1.networkState.tickRandomAlert();
}, 12000);
// --- REST Endpoint for simple check ---
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        nodeCount: state_1.networkState.nodes.length,
        edgeCount: state_1.networkState.edges.length,
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
    state_1.networkState.cleanup();
    httpServer.close(() => {
        console.log('Server stopped.');
    });
});
process.on('SIGINT', () => {
    clearInterval(telemetryInterval);
    clearInterval(alertInterval);
    state_1.networkState.cleanup();
    httpServer.close(() => {
        console.log('Server stopped.');
    });
});
