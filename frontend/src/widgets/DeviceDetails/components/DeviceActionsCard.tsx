import { LoadingOutlined, PoweroffOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import type { FC } from 'react';
import { sendWsMessage } from '@/shared/api';

interface DeviceActionsCardProps {
  nodeId: string;
  isOffline: boolean;
  isEditMode: boolean;
  isPinging: boolean;
  pingLatency: number | null;
  onPing: () => void;
  onReboot: () => void;
}

export const DeviceActionsCard: FC<DeviceActionsCardProps> = ({
  nodeId,
  isOffline,
  isEditMode,
  isPinging,
  pingLatency,
  onPing,
  onReboot,
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
          Удалённые Команды
        </span>
      }
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
        marginTop: 'auto',
      }}
      styles={{
        body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Ping Device Button */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button
            onClick={onPing}
            disabled={isOffline}
            loading={isPinging}
            type="primary"
            icon={!isPinging && <ThunderboltOutlined />}
            style={{
              flex: 1,
              height: '36px',
              fontSize: '0.8rem',
            }}
          >
            {isPinging ? 'Отправка...' : 'Тест связи (Ping)'}
          </Button>

          {/* RTT display */}
          {pingLatency !== null && (
            <div
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                color: pingLatency === -1 ? 'var(--color-error)' : 'var(--color-success)',
                minWidth: '70px',
                textAlign: 'center',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pingLatency === -1 ? 'Таймаут' : `${pingLatency} ms`}
            </div>
          )}
        </div>

        {/* Reboot Device Button */}
        <Button
          onClick={onReboot}
          danger={!isOffline}
          type={isOffline ? 'default' : 'primary'}
          icon={isOffline ? <LoadingOutlined /> : <PoweroffOutlined />}
          style={{
            height: '36px',
            fontSize: '0.8rem',
            backgroundColor: isOffline ? 'rgba(16, 185, 129, 0.1)' : undefined,
            color: isOffline ? 'var(--color-success)' : undefined,
            borderColor: isOffline ? 'rgba(16, 185, 129, 0.3)' : undefined,
          }}
        >
          {isOffline ? 'Инициализация запуска...' : 'Перезапустить устройство'}
        </Button>

        {/* Delete Node Button — only in edit mode */}
        {isEditMode && (
          <>
            <div
              style={{
                height: '1px',
                background: 'var(--border-color)',
                margin: '4px 0',
                opacity: 0.5,
              }}
            />
            <Button
              danger
              onClick={() => sendWsMessage('delete-node', { id: nodeId })}
              style={{
                height: '36px',
                fontSize: '0.8rem',
                background: 'rgba(239, 68, 68, 0.08)',
                borderColor: 'rgba(239, 68, 68, 0.4)',
              }}
            >
              🗑 Удалить устройство
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
