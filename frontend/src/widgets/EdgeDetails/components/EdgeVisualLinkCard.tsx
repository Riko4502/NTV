import { Card, Flex } from 'antd';
import { ArrowLeftRight } from 'lucide-react';
import type { FC } from 'react';
import type { NodeDto } from '@/entities/device/model/types';

interface EdgeVisualLinkCardProps {
  sourceNode?: NodeDto;
  targetNode?: NodeDto;
  sourceId: string;
  targetId: string;
  lineColor: string;
}

export const EdgeVisualLinkCard: FC<EdgeVisualLinkCardProps> = ({
  sourceNode,
  targetNode,
  sourceId,
  targetId,
  lineColor,
}) => {
  return (
    <Card
      size="small"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
    >
      <Flex justify="space-between" align="center" style={{ padding: '8px 0' }}>
        <Flex vertical align="center" style={{ width: '40%' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {sourceNode?.label || sourceId}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
            }}
          >
            {sourceNode?.ip || 'N/A'}
          </span>
        </Flex>

        <Flex
          vertical
          align="center"
          justify="center"
          style={{ width: '20%', position: 'relative' }}
        >
          <ArrowLeftRight size={18} style={{ color: lineColor }} />
          <div
            style={{
              width: '100%',
              height: '2px',
              background: lineColor,
              marginTop: '4px',
              boxShadow: `0 0 8px ${lineColor}`,
            }}
          />
        </Flex>

        <Flex vertical align="center" style={{ width: '40%' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {targetNode?.label || targetId}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
            }}
          >
            {targetNode?.ip || 'N/A'}
          </span>
        </Flex>
      </Flex>
    </Card>
  );
};
