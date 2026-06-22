import type { Node, NodeProps } from '@xyflow/react';
import type { DeviceType, Status } from '@/shared/libs';

export type NodeDto = {
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

export type DeviceNodeData = Node<NodeDto>;
export type DeviceNodeProps = NodeProps<DeviceNodeData>;
