"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocketServer = initWebSocketServer;
const ws_1 = require("ws");
const state_1 = require("../store/state");
const handlers_1 = require("./handlers");
function initWebSocketServer(server) {
    const wss = new ws_1.WebSocketServer({ server });
    function broadcast(data) {
        const message = JSON.stringify(data);
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
    // Subscribe to state changes to broadcast to all clients
    state_1.networkState.on('topology-changed', (payload) => {
        broadcast({ type: 'topology-changed', payload });
    });
    state_1.networkState.on('new-alert', (payload) => {
        broadcast({ type: 'new-alert', payload });
    });
    state_1.networkState.on('alerts-updated', (payload) => {
        broadcast({ type: 'alerts-updated', payload });
    });
    state_1.networkState.on('metrics-update', (payload) => {
        broadcast({ type: 'metrics-update', payload });
    });
    wss.on('connection', (ws) => {
        console.log('Client connected.');
        // Immediately send current topology state
        ws.send(JSON.stringify({
            type: 'init',
            payload: {
                nodes: state_1.networkState.nodes,
                edges: state_1.networkState.edges,
                alerts: state_1.networkState.alerts,
            },
        }));
        ws.on('message', (message) => {
            try {
                const parsed = JSON.parse(message);
                const { type, payload } = parsed;
                const handler = handlers_1.wsHandlers[type];
                if (handler) {
                    handler(ws, payload);
                }
                else {
                    console.warn(`Unhandled WebSocket message type: ${type}`);
                }
            }
            catch (err) {
                console.error('Error handling WebSocket message:', err);
            }
        });
        ws.on('close', () => {
            console.log('Client disconnected.');
        });
    });
    return wss;
}
