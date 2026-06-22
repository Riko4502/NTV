"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsHandlers = void 0;
const state_1 = require("../store/state");
exports.wsHandlers = {
    'ping-node': (ws, payload) => {
        const p = payload;
        ws.send(JSON.stringify({
            type: 'pong',
            payload: {
                nodeId: p.nodeId,
                timestamp: p.timestamp,
            },
        }));
    },
    'reboot-node': (_ws, payload) => {
        const p = payload;
        state_1.networkState.rebootNode(p.nodeId);
    },
    'ack-alert': (_ws, payload) => {
        const p = payload;
        state_1.networkState.ackAlert(p.alertId);
    },
    'ack-all-alerts': () => {
        state_1.networkState.ackAllAlerts();
    },
    'clear-alerts': () => {
        state_1.networkState.clearAlerts();
    },
    'add-node': (_ws, payload) => {
        const p = payload;
        state_1.networkState.addNode(p);
    },
    'connect-nodes': (_ws, payload) => {
        const p = payload;
        state_1.networkState.connectNodes(p);
    },
    'disconnect-nodes': (_ws, payload) => {
        const p = payload;
        state_1.networkState.disconnectNodes(p.edgeId);
    },
    'delete-node': (_ws, payload) => {
        const p = payload;
        state_1.networkState.deleteNode(p.nodeId);
    },
};
