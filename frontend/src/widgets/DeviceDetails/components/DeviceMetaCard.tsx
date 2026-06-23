import { Card } from 'antd';
import type { FC } from 'react';
import type { DeviceType, Status } from '@/shared/libs';

const DEVICE_LABLE: Record<DeviceType, string> = {
  router: 'Маршрутизатор',
  switch: 'Коммутатор',
  server: 'Сервер',
  client: 'Хост',
  firewall: 'Межсетевой экран',
};

const STATUS_COLOR: Record<Status, string> = {
  online: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  offline: 'var(--color-offline)',
};

interface DeviceMetaCardProps {
  label: string;
  type: DeviceType;
  ip: string;
  mac: string;
  status: Status;
}

export const DeviceMetaCard: FC<DeviceMetaCardProps> = ({ label, type, ip, mac, status }) => {
  const statusColor = STATUS_COLOR[status];

  return (
    <Card
      size="small"
      style={{
        borderLeft: `4px solid ${statusColor}`,
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
      styles={{ body: { padding: '16px' } }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          marginBottom: '4px',
          lineHeight: 1.2,
        }}
      >
        {label}
      </h2>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'block',
          marginBottom: '12px',
        }}
      >
        {DEVICE_LABLE[type] || 'Неизвестно'}
      </span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>IP:</span>
          <span>{ip}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>MAC:</span>
          <span>{mac}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Статус:</span>
          <span
            style={{
              color: statusColor,
              fontWeight: 'bold',
            }}
          >
            {status}
          </span>
        </div>
      </div>
    </Card>
  );
};
