import type { Edge } from '@xyflow/react';

export type Priority = 'high' | 'medium' | 'low';

export type AlertType = 'critical' | 'warning' | 'info';

export type Alert = 'all' | AlertType;

export type LayoutDirection = 'TB' | 'LR';

export type Status = 'online' | 'warning' | 'error' | 'offline';

export type StatusStyle = { color: string; glow: string; label: string };

export type ConnectionEdgeStatus = 'active' | 'inactive' | 'congested';

type ConnectionEdgeDto = {
  id: string;
  source: string;
  target: string;
  bandwidth: number; // in Gbps
  currentUsage: number; // in Mbps
  latency: number; // in ms
  status: ConnectionEdgeStatus;
};

export type EdgeBase = Edge<ConnectionEdgeDto, ConnectionEdgeStatus>;
