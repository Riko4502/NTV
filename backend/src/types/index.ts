export interface NetworkNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'client' | 'firewall';
  status: 'online' | 'warning' | 'error' | 'offline';
  ip: string;
  mac: string;
  cpu: number;
  ram: number;
  temp: number;
  traffic: number; // in Mbps
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  bandwidth: number; // in Gbps
  currentUsage: number; // in Mbps
  latency: number; // in ms
  status: 'active' | 'inactive' | 'congested';
}

export interface NetworkAlert {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
}

export interface PingNodePayload {
  nodeId: string;
  timestamp: unknown;
}

export interface RebootNodePayload {
  nodeId: string;
}

export interface AckAlertPayload {
  alertId: string;
}

export interface AddNodePayload {
  id?: string;
  label?: string;
  type?: NetworkNode['type'];
  ip?: string;
  mac?: string;
}

export interface ConnectNodesPayload {
  source: string;
  target: string;
  bandwidth?: number;
}

export interface DisconnectNodesPayload {
  edgeId: string;
}

export interface DeleteNodePayload {
  nodeId: string;
}
