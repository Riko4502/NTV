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
app.use(express_1.default.json());
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
// --- REST Endpoints ---
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        nodeCount: state_1.networkState.nodes.length,
        edgeCount: state_1.networkState.edges.length,
    });
});
app.get('/api/topology', (_req, res) => {
    res.json({
        nodes: state_1.networkState.nodes,
        edges: state_1.networkState.edges,
        alerts: state_1.networkState.alerts,
    });
});
app.post('/api/topology', (req, res) => {
    const { nodes, edges } = req.body;
    state_1.networkState.setTopology({ nodes, edges });
    res.json({ success: true });
});
app.post('/api/nodes', (req, res) => {
    state_1.networkState.addNode(req.body);
    const newNode = state_1.networkState.nodes[state_1.networkState.nodes.length - 1];
    res.json({ success: true, node: newNode });
});
app.delete('/api/nodes/:id', (req, res) => {
    state_1.networkState.deleteNode(req.params.id);
    res.json({ success: true });
});
app.put('/api/nodes/:id', (req, res) => {
    const { label, ip, mac, vendor, model, version } = req.body;
    state_1.networkState.updateNode(req.params.id, { label, ip, mac, vendor, model, version });
    res.json({ success: true });
});
app.post('/api/nodes/:id/firewall/rules', (req, res) => {
    const { name, source, destination, port, protocol, action } = req.body;
    state_1.networkState.addFirewallRule(req.params.id, {
        name,
        source,
        destination,
        port,
        protocol,
        action,
    });
    res.json({ success: true });
});
app.delete('/api/nodes/:id/firewall/rules/:ruleId', (req, res) => {
    state_1.networkState.deleteFirewallRule(req.params.id, req.params.ruleId);
    res.json({ success: true });
});
app.post('/api/nodes/:id/firewall/rules/:ruleId/toggle', (req, res) => {
    state_1.networkState.toggleFirewallRule(req.params.id, req.params.ruleId);
    res.json({ success: true });
});
app.post('/api/nodes/:id/firewall/threats/simulate', (req, res) => {
    state_1.networkState.simulateThreat(req.params.id);
    res.json({ success: true });
});
app.post('/api/nodes/:id/reboot', (req, res) => {
    state_1.networkState.rebootNode(req.params.id);
    res.json({ success: true });
});
app.post('/api/nodes/:id/ping', (req, res) => {
    setTimeout(() => {
        const node = state_1.networkState.nodes.find((n) => n.id === req.params.id);
        if (!node || node.status === 'offline') {
            res.status(504).json({ success: false, error: 'Request timeout' });
        }
        else {
            res.json({ success: true, latency: Math.floor(Math.random() * 15) + 2 });
        }
    }, 200);
});
app.post('/api/connections', (req, res) => {
    state_1.networkState.connectNodes(req.body);
    res.json({ success: true });
});
app.delete('/api/connections/:id', (req, res) => {
    state_1.networkState.disconnectNodes(req.params.id);
    res.json({ success: true });
});
app.post('/api/alerts/ack', (req, res) => {
    const { alertId } = req.body;
    if (alertId) {
        state_1.networkState.ackAlert(alertId);
    }
    else {
        state_1.networkState.ackAllAlerts();
    }
    res.json({ success: true });
});
app.delete('/api/alerts', (_req, res) => {
    state_1.networkState.clearAlerts();
    res.json({ success: true });
});
app.post('/api/recover-all', (_req, res) => {
    state_1.networkState.recoverAll();
    res.json({ success: true });
});
app.get('/api/settings/thresholds', (_req, res) => {
    res.json(state_1.networkState.thresholds);
});
app.post('/api/settings/thresholds', (req, res) => {
    const { cpuWarning, cpuCritical, tempLimit, ramWarning, telemetryInterval, noiseLevel } = req.body;
    if (cpuWarning !== undefined)
        state_1.networkState.thresholds.cpuWarning = Number(cpuWarning);
    if (cpuCritical !== undefined)
        state_1.networkState.thresholds.cpuCritical = Number(cpuCritical);
    if (tempLimit !== undefined)
        state_1.networkState.thresholds.tempLimit = Number(tempLimit);
    if (ramWarning !== undefined)
        state_1.networkState.thresholds.ramWarning = Number(ramWarning);
    if (telemetryInterval !== undefined)
        state_1.networkState.thresholds.telemetryInterval = Number(telemetryInterval);
    if (noiseLevel !== undefined)
        state_1.networkState.thresholds.noiseLevel = Number(noiseLevel);
    res.json({ success: true, thresholds: state_1.networkState.thresholds });
});
app.get('/api/metrics/history', (req, res) => {
    const nodeId = req.query.nodeId;
    const history = state_1.networkState.getMetricsHistory(nodeId);
    res.json(history);
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
