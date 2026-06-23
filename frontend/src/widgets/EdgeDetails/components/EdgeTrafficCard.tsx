import { Card, Flex, Progress } from 'antd';
import type { FC } from 'react';

interface EdgeTrafficCardProps {
  currentUsage: number;
  maxMbps: number;
  usagePercent: number;
  lineColor: string;
  isCongested: boolean;
}

export const EdgeTrafficCard: FC<EdgeTrafficCardProps> = ({
  currentUsage,
  maxMbps,
  usagePercent,
  lineColor,
  isCongested,
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
          Нагрузка канала
        </span>
      }
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
      styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' } }}
    >
      <Flex justify="space-between" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span>Текущий трафик:</span>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {currentUsage} Mbps / {maxMbps} Mbps
        </span>
      </Flex>

      <div style={{ marginTop: '8px' }}>
        <Flex
          justify="space-between"
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}
        >
          <span>Загрузка:</span>
          <span style={{ color: lineColor, fontWeight: 600 }}>{usagePercent}%</span>
        </Flex>
        <Progress
          percent={usagePercent}
          strokeColor={lineColor}
          showInfo={false}
          status={isCongested ? 'exception' : 'normal'}
        />
      </div>
    </Card>
  );
};
