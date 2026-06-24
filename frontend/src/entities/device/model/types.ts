import type { Node, NodeProps } from '@xyflow/react';
import type { DeviceData } from '@/shared/libs';

export type NodeDto = DeviceData;

export type DeviceNodeData = Node<NodeDto>;
export type DeviceNodeProps = NodeProps<DeviceNodeData>;
