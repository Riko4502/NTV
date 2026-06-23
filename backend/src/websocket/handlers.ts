import type { WebSocket } from 'ws';
import { networkState } from '../store/state';
import type {
  AckAlertPayload,
  AddNodePayload,
  ConnectNodesPayload,
  DeleteNodePayload,
  DisconnectNodesPayload,
  GetMetricsHistoryPayload,
  PingNodePayload,
  RebootNodePayload,
} from '../types';

export type WSHandler = (ws: WebSocket, payload: unknown) => void;

export const wsHandlers: Record<string, WSHandler> = {
  'ping-node': (ws, payload) => {
    const p = payload as PingNodePayload;
    ws.send(
      JSON.stringify({
        type: 'pong',
        payload: {
          nodeId: p.nodeId,
          timestamp: p.timestamp,
        },
      }),
    );
  },

  'reboot-node': (_ws, payload) => {
    const p = payload as RebootNodePayload;
    networkState.rebootNode(p.nodeId);
  },

  'ack-alert': (_ws, payload) => {
    const p = payload as AckAlertPayload;
    networkState.ackAlert(p.alertId);
  },

  'ack-all-alerts': () => {
    networkState.ackAllAlerts();
  },

  'clear-alerts': () => {
    networkState.clearAlerts();
  },

  'add-node': (_ws, payload) => {
    const p = payload as AddNodePayload;
    networkState.addNode(p);
  },

  'connect-nodes': (_ws, payload) => {
    const p = payload as ConnectNodesPayload;
    networkState.connectNodes(p);
  },

  'disconnect-nodes': (_ws, payload) => {
    const p = payload as DisconnectNodesPayload;
    networkState.disconnectNodes(p.edgeId);
  },

  'delete-node': (_ws, payload) => {
    const p = payload as DeleteNodePayload;
    networkState.deleteNode(p.nodeId);
  },

  'get-metrics-history': (ws, payload) => {
    const p = payload as GetMetricsHistoryPayload;
    const history = networkState.getMetricsHistory(p?.nodeId);
    ws.send(
      JSON.stringify({
        type: 'metrics-history',
        payload: history,
      }),
    );
  },
};
