"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const state_1 = require("./state");
(0, vitest_1.describe)('NetworkState Service', () => {
    let state;
    (0, vitest_1.beforeEach)(() => {
        state = new state_1.NetworkState();
    });
    (0, vitest_1.afterEach)(() => {
        state.cleanup();
    });
    (0, vitest_1.it)('should initialize with nodes, edges and alerts', () => {
        (0, vitest_1.expect)(state.nodes.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(state.edges.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(state.alerts.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should reboot a node: set status to offline and emit events', () => {
        const onlineNode = state.nodes.find((n) => n.status === 'online');
        (0, vitest_1.expect)(onlineNode).toBeDefined();
        if (!onlineNode)
            return;
        const nodeId = onlineNode.id;
        const topologySpy = vitest_1.vi.fn();
        const alertSpy = vitest_1.vi.fn();
        state.on('topology-changed', topologySpy);
        state.on('new-alert', alertSpy);
        state.rebootNode(nodeId);
        const rebootedNode = state.nodes.find((n) => n.id === nodeId);
        (0, vitest_1.expect)(rebootedNode?.status).toBe('offline');
        (0, vitest_1.expect)(rebootedNode?.cpu).toBe(0);
        (0, vitest_1.expect)(rebootedNode?.ram).toBe(0);
        (0, vitest_1.expect)(topologySpy).toHaveBeenCalled();
        (0, vitest_1.expect)(alertSpy).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should acknowledge an alert and emit alerts-updated', () => {
        const unacknowledgedAlert = state.alerts.find((a) => !a.acknowledged);
        (0, vitest_1.expect)(unacknowledgedAlert).toBeDefined();
        if (!unacknowledgedAlert)
            return;
        const alertId = unacknowledgedAlert.id;
        const alertsSpy = vitest_1.vi.fn();
        state.on('alerts-updated', alertsSpy);
        state.ackAlert(alertId);
        const updatedAlert = state.alerts.find((a) => a.id === alertId);
        (0, vitest_1.expect)(updatedAlert?.acknowledged).toBe(true);
        (0, vitest_1.expect)(alertsSpy).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should add a new node and emit topology-changed and new-alert', () => {
        const initialCount = state.nodes.length;
        const topologySpy = vitest_1.vi.fn();
        const alertSpy = vitest_1.vi.fn();
        state.on('topology-changed', topologySpy);
        state.on('new-alert', alertSpy);
        state.addNode({
            label: 'Test Node',
            type: 'server',
            ip: '10.0.9.9',
            mac: '00:1A:2B:3C:4D:99',
        });
        (0, vitest_1.expect)(state.nodes.length).toBe(initialCount + 1);
        const addedNode = state.nodes.find((n) => n.label === 'Test Node');
        (0, vitest_1.expect)(addedNode).toBeDefined();
        (0, vitest_1.expect)(addedNode?.type).toBe('server');
        (0, vitest_1.expect)(topologySpy).toHaveBeenCalled();
        (0, vitest_1.expect)(alertSpy).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should delete a node and clean up connected edges', () => {
        const testNode = state.nodes[0];
        const nodeId = testNode.id;
        // Ensure we have edges connected to it
        state.connectNodes({ source: nodeId, target: 'other-node' });
        state.deleteNode(nodeId);
        (0, vitest_1.expect)(state.nodes.find((n) => n.id === nodeId)).toBeUndefined();
        (0, vitest_1.expect)(state.edges.some((e) => e.source === nodeId || e.target === nodeId)).toBe(false);
    });
    (0, vitest_1.it)('should tick telemetry, modifying CPU/RAM of online nodes', () => {
        // Turn off another node to verify offline nodes do not update
        const offlineNode = state.nodes[1];
        state.rebootNode(offlineNode.id);
        state.tickTelemetry();
        const updatedOfflineNode = state.nodes.find((n) => n.id === offlineNode.id);
        // Offline node stays offline and CPU is 0
        (0, vitest_1.expect)(updatedOfflineNode?.cpu).toBe(0);
    });
});
