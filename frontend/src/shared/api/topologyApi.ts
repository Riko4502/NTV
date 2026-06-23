import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NetworkAlertData } from '../../entities/alert/model/types';
import type { ConnectionEdgeDto } from '../../entities/connection/model/types';
import type { NodeDto } from '../../entities/device/model/types';
import type { ConnectionEdgeStatus, Status } from '../libs';

export type WsMessageType =
  | 'init'
  | 'metrics-update'
  | 'new-alert'
  | 'alerts-updated'
  | 'topology-changed'
  | 'metrics-history'
  | 'pong';

export interface WsMessage<T extends WsMessageType = WsMessageType, P = unknown> {
  type: T;
  payload: P;
}

export interface NodeMetricsUpdate {
  id: string;
  status: Status;
  cpu: number;
  ram: number;
  temp: number;
  traffic: number;
}

export interface EdgeMetricsUpdate {
  id: string;
  currentUsage: number;
  latency: number;
  status: ConnectionEdgeStatus;
}

export interface MetricsUpdatePayload {
  nodes: NodeMetricsUpdate[];
  edges: EdgeMetricsUpdate[];
}

export interface TopologyState {
  nodes: NodeDto[];
  edges: ConnectionEdgeDto[];
  alerts: NetworkAlertData[];
}

export interface MetricPoint {
  timestamp: string;
  cpu: number;
  ram: number;
  temp: number;
  traffic: number;
}

export type MetricsHistory = Record<string, MetricPoint[]>;

interface PingPongPayload {
  timestamp: string;
  nodeId?: string;
  latency?: number;
}

type MessageCallback = (data: WsMessage) => void;
type PendingMessage = { type: string; payload?: unknown };

let ws: WebSocket | null = null;
const messageCallbacks = new Set<MessageCallback>();
const pendingMessages: PendingMessage[] = [];

export const sendWsMessage = (type: string, payload?: unknown): void => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  } else {
    console.warn('WebSocket is not open. Queuing message:', type, payload);
    pendingMessages.push({ type, payload });
  }
};

export const registerWsCallback = (callback: MessageCallback): (() => void) => {
  messageCallbacks.add(callback);
  return () => {
    messageCallbacks.delete(callback);
  };
};

export const topologyApi = createApi({
  reducerPath: 'topologyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    streamTopology: builder.query<TopologyState, void>({
      queryFn: () => ({ data: { nodes: [], edges: [], alerts: [] } }),

      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const socketUrl = 'ws://localhost:3001';
        ws = new WebSocket(socketUrl);

        ws.addEventListener('open', () => {
          while (pendingMessages.length > 0) {
            const msg = pendingMessages.shift();
            if (msg) {
              sendWsMessage(msg.type, msg.payload);
            }
          }
        });

        const handleMessage = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data as string) as WsMessage;

            messageCallbacks.forEach((cb) => {
              cb(message);
            });

            updateCachedData((draft) => {
              applyMessageToDraft(draft, message);
            });
          } catch (err) {
            console.error('Error handling WS message:', err);
          }
        };

        ws.addEventListener('message', handleMessage);

        await cacheDataLoaded;
        await cacheEntryRemoved;

        ws?.close();
        ws = null;
      },
    }),
  }),
});

function applyMessageToDraft(draft: TopologyState, { type, payload }: WsMessage): void {
  switch (type) {
    case 'init': {
      const { nodes, edges, alerts } = payload as TopologyState;
      draft.nodes = nodes;
      draft.edges = edges;
      draft.alerts = alerts;
      break;
    }

    case 'metrics-update': {
      const { nodes, edges } = payload as MetricsUpdatePayload;

      for (const update of nodes) {
        const node = draft.nodes.find((n) => n.id === update.id);
        if (node) Object.assign(node, update);
      }

      for (const update of edges) {
        const edge = draft.edges.find((e) => e.id === update.id);
        if (edge) Object.assign(edge, update);
      }
      break;
    }

    case 'new-alert': {
      const alert = payload as NetworkAlertData;
      if (!draft.alerts.some((a) => a.id === alert.id)) {
        draft.alerts.unshift(alert);
      }
      break;
    }

    case 'alerts-updated': {
      draft.alerts = payload as NetworkAlertData[];
      break;
    }

    case 'topology-changed': {
      const { nodes, edges } = payload as Omit<TopologyState, 'alerts'>;
      draft.nodes = nodes;
      draft.edges = edges;
      break;
    }

    case 'metrics-history': {
      const _history = payload as MetricsHistory;
      break;
    }

    case 'pong': {
      const _ping = payload as PingPongPayload;
      break;
    }

    default:
      console.warn('Unknown WS message type:', type);
  }
}

export const { useStreamTopologyQuery } = topologyApi;
