import type { Node, NodeProps } from '@xyflow/react';
import type { Status } from './types';

export type DeviceType = 'router' | 'switch' | 'server' | 'client' | 'firewall';

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

export interface FirewallRuleFormData {
  nodeId: string;
  name: string;
  source: string;
  destination: string;
  port: string;
  protocol: ProtocolType;
  action: ActionType;
}

export interface AddRuleFormData {
  name: string;
  source: string;
  destination: string;
  port: string;
  protocol: ProtocolType;
  action: ActionType;
}

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

export type DeviceData = {
  id: string;
  label: string;
  type: DeviceType;
  status: Status;
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
};

export type NodeBase = Node<DeviceData>;
export type DeviceNodeProps = NodeProps<NodeBase>;
