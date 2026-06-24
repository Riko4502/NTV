/** biome-ignore-all lint/suspicious/noConsole: console.log нужен для отладки */
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { networkState } from './store/state';
import { initWebSocketServer } from './websocket/server';

const app = express();
app.use(cors());
app.use(express.json());

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

// --- REST Endpoints ---
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    nodeCount: networkState.nodes.length,
    edgeCount: networkState.edges.length,
  });
});

app.get('/api/topology', (_req, res) => {
  res.json({
    nodes: networkState.nodes,
    edges: networkState.edges,
    alerts: networkState.alerts,
  });
});

app.post('/api/topology', (req, res) => {
  const { nodes, edges } = req.body;
  networkState.setTopology({ nodes, edges });
  res.json({ success: true });
});

app.post('/api/nodes', (req, res) => {
  networkState.addNode(req.body);
  const newNode = networkState.nodes[networkState.nodes.length - 1];
  res.json({ success: true, node: newNode });
});

app.delete('/api/nodes/:id', (req, res) => {
  networkState.deleteNode(req.params.id);
  res.json({ success: true });
});

app.put('/api/nodes/:id', (req, res) => {
  const { label, ip, mac, vendor, model, version } = req.body;
  networkState.updateNode(req.params.id, { label, ip, mac, vendor, model, version });
  res.json({ success: true });
});

app.post('/api/nodes/:id/firewall/rules', (req, res) => {
  const { name, source, destination, port, protocol, action } = req.body;
  networkState.addFirewallRule(req.params.id, {
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
  networkState.deleteFirewallRule(req.params.id, req.params.ruleId);
  res.json({ success: true });
});

app.post('/api/nodes/:id/firewall/rules/:ruleId/toggle', (req, res) => {
  networkState.toggleFirewallRule(req.params.id, req.params.ruleId);
  res.json({ success: true });
});

app.post('/api/nodes/:id/firewall/threats/simulate', (req, res) => {
  networkState.simulateThreat(req.params.id);
  res.json({ success: true });
});

app.post('/api/nodes/:id/reboot', (req, res) => {
  networkState.rebootNode(req.params.id);
  res.json({ success: true });
});

app.post('/api/nodes/:id/ping', (req, res) => {
  setTimeout(() => {
    const node = networkState.nodes.find((n) => n.id === req.params.id);
    if (!node || node.status === 'offline') {
      res.status(504).json({ success: false, error: 'Request timeout' });
    } else {
      res.json({ success: true, latency: Math.floor(Math.random() * 15) + 2 });
    }
  }, 200);
});

app.post('/api/connections', (req, res) => {
  networkState.connectNodes(req.body);
  res.json({ success: true });
});

app.delete('/api/connections/:id', (req, res) => {
  networkState.disconnectNodes(req.params.id);
  res.json({ success: true });
});

app.post('/api/alerts/ack', (req, res) => {
  const { alertId } = req.body;
  if (alertId) {
    networkState.ackAlert(alertId);
  } else {
    networkState.ackAllAlerts();
  }
  res.json({ success: true });
});

app.delete('/api/alerts', (_req, res) => {
  networkState.clearAlerts();
  res.json({ success: true });
});

app.post('/api/recover-all', (_req, res) => {
  networkState.recoverAll();
  res.json({ success: true });
});

app.get('/api/settings/thresholds', (_req, res) => {
  res.json(networkState.thresholds);
});

app.post('/api/settings/thresholds', (req, res) => {
  const { cpuWarning, cpuCritical, tempLimit, ramWarning, telemetryInterval, noiseLevel } =
    req.body;
  if (cpuWarning !== undefined) networkState.thresholds.cpuWarning = Number(cpuWarning);
  if (cpuCritical !== undefined) networkState.thresholds.cpuCritical = Number(cpuCritical);
  if (tempLimit !== undefined) networkState.thresholds.tempLimit = Number(tempLimit);
  if (ramWarning !== undefined) networkState.thresholds.ramWarning = Number(ramWarning);
  if (telemetryInterval !== undefined)
    networkState.thresholds.telemetryInterval = Number(telemetryInterval);
  if (noiseLevel !== undefined) networkState.thresholds.noiseLevel = Number(noiseLevel);
  res.json({ success: true, thresholds: networkState.thresholds });
});

app.get('/api/metrics/history', (req, res) => {
  const nodeId = req.query.nodeId as string | undefined;
  const history = networkState.getMetricsHistory(nodeId);
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
