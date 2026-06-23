import type { FC } from 'react';
import { useAppSelector } from '@/app/providers/store';
import type { ConnectionEdgeDto } from '@/entities/connection/model/types';
import type { NodeDto } from '@/entities/device/model/types';
import { sendWsMessage } from '@/shared/api';
import { EdgeActionsCard } from './components/EdgeActionsCard';
import { EdgeParamsCard } from './components/EdgeParamsCard';
import { EdgeTrafficCard } from './components/EdgeTrafficCard';
import { EdgeVisualLinkCard } from './components/EdgeVisualLinkCard';

interface EdgeDetailsProps {
  edge: ConnectionEdgeDto;
  nodes: NodeDto[];
  onClose: () => void;
}

const STATUS_CONFIG = {
  active: {
    color: 'var(--color-success)',
    label: 'Активно',
    tagColor: 'success',
  },
  congested: {
    color: 'var(--color-error)',
    label: 'Перегружено',
    tagColor: 'error',
  },
  inactive: {
    color: 'var(--color-offline)',
    label: 'Неактивно',
    tagColor: 'default',
  },
};

export const EdgeDetails: FC<EdgeDetailsProps> = ({ edge, nodes, onClose }) => {
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);

  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  const statusInfo = STATUS_CONFIG[edge.status] || STATUS_CONFIG.inactive;
  const maxMbps = edge.bandwidth * 1000;
  const usagePercent = Math.min(100, Math.round((edge.currentUsage / maxMbps) * 100));

  const handleDelete = () => {
    sendWsMessage('disconnect-nodes', { edgeId: edge.id });
    onClose();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px',
        gap: '20px',
        overflowY: 'auto',
      }}
    >
      <EdgeVisualLinkCard
        sourceNode={sourceNode}
        targetNode={targetNode}
        sourceId={edge.source}
        targetId={edge.target}
        lineColor={statusInfo.color}
      />

      <EdgeParamsCard
        statusLabel={statusInfo.label}
        tagColor={statusInfo.tagColor}
        bandwidth={edge.bandwidth}
        latency={edge.latency}
        status={edge.status}
      />

      <EdgeTrafficCard
        currentUsage={edge.currentUsage}
        maxMbps={maxMbps}
        usagePercent={usagePercent}
        lineColor={statusInfo.color}
        isCongested={edge.status === 'congested'}
      />

      <EdgeActionsCard isEditMode={isEditMode} onDelete={handleDelete} />
    </div>
  );
};
