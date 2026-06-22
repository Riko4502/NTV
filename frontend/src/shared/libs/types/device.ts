import type { Node, NodeProps } from '@xyflow/react';
import type { Status } from './types';

export type DeviceType = 'router' | 'switch' | 'server' | 'client' | 'firewall';

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
};

export type NodeBase = Node<DeviceData>;
export type DeviceNodeProps = NodeProps<NodeBase>;
