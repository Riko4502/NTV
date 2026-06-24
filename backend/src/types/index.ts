export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'ANY';
export type ActionType = 'ALLOW' | 'DENY';

export type FirewallRuleStatus = 'active' | 'inactive';

export type ThreatType =
  | 'DDoS Attack'
  | 'Port Scan'
  | 'Brute Force'
  | 'Malware Traffic'
  | 'SQL Injection';
export type SeverityType = 'high' | 'medium' | 'low';
export type ActionTakenType = 'Blocked' | 'Log Only';

export interface FirewallRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  port: string;
  protocol: ProtocolType;
  action: ActionType;
  status: FirewallRuleStatus;
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  threatType: ThreatType;
  severity: SeverityType;
  actionTaken: ActionTakenType;
}

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
  vendor?: string;
  model?: string;
  version?: string;
  rules?: FirewallRule[];
  threats?: ThreatEvent[];
  firewallConfig?: string;
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

export interface MetricPoint {
  timestamp: string;
  cpu: number;
  ram: number;
  temp: number;
  traffic: number;
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
  vendor?: string;
  model?: string;
  version?: string;
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

export interface GetMetricsHistoryPayload {
  nodeId?: string;
}
