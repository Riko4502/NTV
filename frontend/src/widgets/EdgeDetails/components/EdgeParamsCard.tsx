import { Card, Flex, Tag } from 'antd';
import type { FC } from 'react';
import type { ConnectionEdgeStatus } from '@/entities/connection/model/types';

interface EdgeParamsCardProps {
  statusLabel: string;
  tagColor: string;
  bandwidth: number;
  latency: number;
  status: ConnectionEdgeStatus;
}

export const EdgeParamsCard: FC<EdgeParamsCardProps> = ({
  statusLabel,
  tagColor,
  bandwidth,
  latency,
  status,
}) => {
  return (
    <Card
      size="small"
      title={
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Параметры соединения
        </span>
      }
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
      styles={{
        body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
      }}
    >
      <Flex justify="space-between" align="center">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Статус:</span>
        <Tag color={tagColor}>{statusLabel}</Tag>
      </Flex>

      <Flex justify="space-between" align="center">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Пропускная способность:
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {bandwidth} Gbps
        </span>
      </Flex>

      <Flex justify="space-between" align="center">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Задержка (Latency):
        </span>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: status === 'congested' ? 'var(--color-error)' : 'var(--color-success)',
          }}
        >
          {latency} ms
        </span>
      </Flex>
    </Card>
  );
};
