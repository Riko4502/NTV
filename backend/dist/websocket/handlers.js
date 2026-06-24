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
    'trigger-ddos': (_ws, payload) => {
        const p = payload;
        state_1.networkState.triggerDdos(p.nodeId);
    },
    'trigger-overheat': (_ws, payload) => {
        const p = payload;
        state_1.networkState.triggerOverheat(p.nodeId);
    },
    'trigger-latency': (_ws, payload) => {
        const p = payload;
        state_1.networkState.triggerLatencySpike(p.edgeId);
    },
    'recover-all': () => {
        state_1.networkState.recoverAll();
    },
    'set-topology': (_ws, payload) => {
        const p = payload;
        state_1.networkState.setTopology(p);
    },
    'get-metrics-history': (ws, payload) => {
        const p = payload;
        const history = state_1.networkState.getMetricsHistory(p?.nodeId);
        ws.send(JSON.stringify({
            type: 'metrics-history',
            payload: history,
        }));
    },
};
