import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NetworkAlertData } from '../../entities/alert/model/types';
import type { ConnectionEdgeDto } from '../../entities/connection/model/types';
import type { NodeDto } from '../../entities/device/model/types';
import type { AddNodePayload, ConnectionEdgeStatus, Status } from '../libs';

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

export interface ConnectNodesPayload {
  source: string;
  target: string;
  bandwidth?: number;
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
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/' }),
  endpoints: (builder) => ({
    streamTopology: builder.query<TopologyState, void>({
      query: () => 'topology',

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

    addNode: builder.mutation<{ success: boolean; node: NodeDto }, AddNodePayload>({
      query: (body) => ({
        url: 'nodes',
        method: 'POST',
        body,
      }),
    }),

    deleteNode: builder.mutation<{ success: boolean }, { nodeId: string }>({
      query: ({ nodeId }) => ({
        url: `nodes/${nodeId}`,
        method: 'DELETE',
      }),
    }),

    rebootNode: builder.mutation<{ success: boolean }, { nodeId: string }>({
      query: ({ nodeId }) => ({
        url: `nodes/${nodeId}/reboot`,
        method: 'POST',
      }),
    }),

    pingNode: builder.mutation<{ success: boolean; latency: number }, { nodeId: string }>({
      query: ({ nodeId }) => ({
        url: `nodes/${nodeId}/ping`,
        method: 'POST',
      }),
    }),

    connectNodes: builder.mutation<{ success: boolean }, ConnectNodesPayload>({
      query: (body) => ({
        url: 'connections',
        method: 'POST',
        body,
      }),
    }),

    disconnectNodes: builder.mutation<{ success: boolean }, { edgeId: string }>({
      query: ({ edgeId }) => ({
        url: `connections/${edgeId}`,
        method: 'DELETE',
      }),
    }),

    ackAlert: builder.mutation<{ success: boolean }, { alertId?: string }>({
      query: (body) => ({
        url: 'alerts/ack',
        method: 'POST',
        body,
      }),
    }),

    clearAlerts: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: 'alerts',
        method: 'DELETE',
      }),
    }),

    recoverAll: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: 'recover-all',
        method: 'POST',
      }),
    }),

    setTopology: builder.mutation<
      { success: boolean },
      { nodes: NodeDto[]; edges: ConnectionEdgeDto[] }
    >({
      query: (body) => ({
        url: 'topology',
        method: 'POST',
        body,
      }),
    }),

    getMetricsHistory: builder.query<MetricsHistory, { nodeId?: string }>({
      query: (arg) => ({
        url: 'metrics/history',
        params: arg?.nodeId ? { nodeId: arg.nodeId } : undefined,
      }),
    }),

    getThresholds: builder.query<
      {
        cpuWarning: number;
        cpuCritical: number;
        tempLimit: number;
        ramWarning: number;
        telemetryInterval: number;
        noiseLevel: number;
      },
      void
    >({
      query: () => 'settings/thresholds',
    }),

    updateThresholds: builder.mutation<
      { success: boolean },
      {
        cpuWarning: number;
        cpuCritical: number;
        tempLimit: number;
        ramWarning: number;
        telemetryInterval: number;
        noiseLevel: number;
      }
    >({
      query: (body) => ({
        url: 'settings/thresholds',
        method: 'POST',
        body,
      }),
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
      break;
    }

    case 'pong': {
      break;
    }

    default:
      console.warn('Unknown WS message type:', type);
  }
}

export const {
  useStreamTopologyQuery,
  useAddNodeMutation,
  useDeleteNodeMutation,
  useRebootNodeMutation,
  usePingNodeMutation,
  useConnectNodesMutation,
  useDisconnectNodesMutation,
  useAckAlertMutation,
  useClearAlertsMutation,
  useRecoverAllMutation,
  useSetTopologyMutation,
  useGetMetricsHistoryQuery,
  useGetThresholdsQuery,
  useUpdateThresholdsMutation,
} = topologyApi;
