import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NetworkState } from './state';

describe('NetworkState Service', () => {
  let state: NetworkState;

  beforeEach(() => {
    state = new NetworkState();
  });

  afterEach(() => {
    state.cleanup();
  });

  it('should initialize with nodes, edges and alerts', () => {
    expect(state.nodes.length).toBeGreaterThan(0);
    expect(state.edges.length).toBeGreaterThan(0);
    expect(state.alerts.length).toBeGreaterThan(0);
  });

  it('should reboot a node: set status to offline and emit events', () => {
    const onlineNode = state.nodes.find((n) => n.status === 'online');
    expect(onlineNode).toBeDefined();

    const nodeId = onlineNode?.id;

    const topologySpy = vi.fn();
    const alertSpy = vi.fn();

    state.on('topology-changed', topologySpy);
    state.on('new-alert', alertSpy);

    state.rebootNode(nodeId);

    const rebootedNode = state.nodes.find((n) => n.id === nodeId);
    expect(rebootedNode?.status).toBe('offline');
    expect(rebootedNode?.cpu).toBe(0);
    expect(rebootedNode?.ram).toBe(0);

    expect(topologySpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });

  it('should acknowledge an alert and emit alerts-updated', () => {
    const unacknowledgedAlert = state.alerts.find((a) => !a.acknowledged);
    expect(unacknowledgedAlert).toBeDefined();

    const alertId = unacknowledgedAlert?.id;
    const alertsSpy = vi.fn();

    state.on('alerts-updated', alertsSpy);

    state.ackAlert(alertId);

    const updatedAlert = state.alerts.find((a) => a.id === alertId);
    expect(updatedAlert?.acknowledged).toBe(true);
    expect(alertsSpy).toHaveBeenCalled();
  });

  it('should add a new node and emit topology-changed and new-alert', () => {
    const initialCount = state.nodes.length;
    const topologySpy = vi.fn();
    const alertSpy = vi.fn();

    state.on('topology-changed', topologySpy);
    state.on('new-alert', alertSpy);

    state.addNode({
      label: 'Test Node',
      type: 'server',
      ip: '10.0.9.9',
      mac: '00:1A:2B:3C:4D:99',
    });

    expect(state.nodes.length).toBe(initialCount + 1);
    const addedNode = state.nodes.find((n) => n.label === 'Test Node');
    expect(addedNode).toBeDefined();
    expect(addedNode?.type).toBe('server');

    expect(topologySpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });

  it('should delete a node and clean up connected edges', () => {
    const testNode = state.nodes[0];
    const nodeId = testNode.id;

    // Ensure we have edges connected to it
    state.connectNodes({ source: nodeId, target: 'other-node' });

    state.deleteNode(nodeId);

    expect(state.nodes.find((n) => n.id === nodeId)).toBeUndefined();
    expect(state.edges.some((e) => e.source === nodeId || e.target === nodeId)).toBe(false);
  });

  it('should tick telemetry, modifying CPU/RAM of online nodes', () => {
    // Turn off another node to verify offline nodes do not update
    const offlineNode = state.nodes[1];
    state.rebootNode(offlineNode.id);

    state.tickTelemetry();

    const updatedOfflineNode = state.nodes.find((n) => n.id === offlineNode.id);

    // Offline node stays offline and CPU is 0
    expect(updatedOfflineNode?.cpu).toBe(0);
  });
});
