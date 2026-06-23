import { Card } from 'antd';
import { Radio } from 'lucide-react';
import type { FC } from 'react';

interface DeviceTrafficCardProps {
  traffic: number;
}

export const DeviceTrafficCard: FC<DeviceTrafficCardProps> = ({ traffic }) => {
  return (
    <Card
      size="small"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
      styles={{
        body: {
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        <Radio size={14} style={{ color: 'var(--color-success)' }} />
        <span>Использование трафика</span>
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
        {traffic} Mbps
      </span>
    </Card>
  );
};
