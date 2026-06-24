/** biome-ignore-all lint/suspicious/noConsole: console.log is used for connection logging */
import type { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { networkState } from '../store/state';
import { wsHandlers } from './handlers';

export function initWebSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  function broadcast(data: unknown) {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Subscribe to state changes to broadcast to all clients
  networkState.on('topology-changed', (payload) => {
    broadcast({ type: 'topology-changed', payload });
  });

  networkState.on('new-alert', (payload) => {
    broadcast({ type: 'new-alert', payload });
  });

  networkState.on('alerts-updated', (payload) => {
    broadcast({ type: 'alerts-updated', payload });
  });

  networkState.on('metrics-update', (payload) => {
    broadcast({ type: 'metrics-update', payload });
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected.');

    // Immediately send current topology state
    ws.send(
      JSON.stringify({
        type: 'init',
        payload: {
          nodes: networkState.nodes,
          edges: networkState.edges,
          alerts: networkState.alerts,
        },
      }),
    );

    ws.on('message', (message: string) => {
      try {
        const parsed = JSON.parse(message);
        const { type, payload } = parsed;

        const handler = wsHandlers[type];
        if (handler) {
          handler(ws, payload);
        } else {
          console.warn(`Unhandled WebSocket message type: ${type}`);
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected.');
    });
  });

  return wss;
}
