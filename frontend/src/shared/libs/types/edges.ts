import type { Edge } from '@xyflow/react';

export type ConnectionEdgeStatus = 'active' | 'inactive' | 'congested';

export type ConnectionEdgeDto = {
  id: string;
  source: string;
  target: string;
  bandwidth: number; // in Gbps
  currentUsage: number; // in Mbps
  latency: number; // in ms
  status: ConnectionEdgeStatus;
};

export type EdgeBase = Edge<ConnectionEdgeDto, ConnectionEdgeStatus>;
