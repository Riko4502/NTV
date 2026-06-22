import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NetworkAlertData } from '../../entities/alert/model/types';
import type { ConnectionEdgeDto } from '../../entities/connection/model/types';
import type { NodeDto } from '../../entities/device/model/types';

export interface WsMessage {
  type: string;
  payload?: Record<string, unknown>;
}

export interface MetricsUpdatePayload {
  nodes: {
    id: string;
    status: NodeDto['status'];
    cpu: number;
    ram: number;
    temp: number;
    traffic: number;
  }[];
  edges: {
    id: string;
    currentUsage: number;
    latency: number;
    status: ConnectionEdgeDto['status'];
  }[];
}

export interface TopologyState {
  nodes: NodeDto[];
  edges: ConnectionEdgeDto[];
  alerts: NetworkAlertData[];
}

let ws: WebSocket | null = null;
const messageCallbacks = new Set<(data: WsMessage) => void>();

export const sendWsMessage = (type: string, payload?: unknown) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  } else {
    console.warn('WebSocket is not open. Message not sent:', type, payload);
  }
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

        const handleMessage = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data) as WsMessage;
            const { type, payload } = message;

            // Trigger any custom message callbacks
            messageCallbacks.forEach((callback) => {
              callback(message);
            });

            updateCachedData((draft) => {
              switch (type) {
                case 'init': {
                  const initPayload = payload as unknown as TopologyState;
                  draft.nodes = initPayload.nodes;
                  draft.edges = initPayload.edges;
                  draft.alerts = initPayload.alerts;
                  break;
                }

                case 'metrics-update': {
                  const metricsPayload = payload as unknown as MetricsUpdatePayload;
                  metricsPayload.nodes.forEach((updatedNode) => {
                    const node = draft.nodes.find((n) => n.id === updatedNode.id);
                    if (node) {
                      node.status = updatedNode.status;
                      node.cpu = updatedNode.cpu;
                      node.ram = updatedNode.ram;
                      node.temp = updatedNode.temp;
                      node.traffic = updatedNode.traffic;
                    }
                  });
                  metricsPayload.edges.forEach((updatedEdge) => {
                    const edge = draft.edges.find((e) => e.id === updatedEdge.id);
                    if (edge) {
                      edge.currentUsage = updatedEdge.currentUsage;
                      edge.latency = updatedEdge.latency;
                      edge.status = updatedEdge.status;
                    }
                  });
                  break;
                }

                case 'new-alert': {
                  const alertPayload = payload as unknown as NetworkAlertData;
                  // Add to the beginning of the list, avoid duplicates just in case
                  if (!draft.alerts.some((a) => a.id === alertPayload.id)) {
                    draft.alerts.unshift(alertPayload);
                  }
                  break;
                }

                case 'alerts-updated': {
                  draft.alerts = payload as unknown as NetworkAlertData[];
                  break;
                }

                case 'topology-changed': {
                  const topologyPayload = payload as unknown as Omit<TopologyState, 'alerts'>;
                  draft.nodes = topologyPayload.nodes;
                  draft.edges = topologyPayload.edges;
                  break;
                }
              }
            });
          } catch (err) {
            console.error('Error handling WS message on client:', err);
          }
        };

        ws.addEventListener('message', handleMessage);

        await cacheDataLoaded;

        await cacheEntryRemoved;
        if (ws) {
          ws.close();
          ws = null;
        }
      },
    }),
  }),
});

export const { useStreamTopologyQuery } = topologyApi;

export const registerWsCallback = (callback: (data: WsMessage) => void) => {
  messageCallbacks.add(callback);
  return () => {
    messageCallbacks.delete(callback);
  };
};
