import { LoadingOutlined, PoweroffOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Tooltip } from 'antd';
import type { FC } from 'react';
import { sendWsMessage } from '@/shared/api';

interface DeviceActionsCardProps {
  nodeId: string;
  isOffline: boolean;
  isEditMode: boolean;
  isPinging: boolean;
  pingLatency: number | null;
  pingHistory: number[];
  onPing: () => void;
  onReboot: () => void;
}

export const DeviceActionsCard: FC<DeviceActionsCardProps> = ({
  nodeId,
  isOffline,
  isEditMode,
  isPinging,
  pingLatency,
  pingHistory,
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

        {/* Ping History Dots */}
        {pingHistory.length > 0 && (
          <Flex vertical gap="6px" style={{ marginTop: '4px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              История пинг-тестов:
            </span>
            <Flex gap="6px" align="center">
              {pingHistory.map((latency, idx) => {
                let color = 'var(--color-offline)';
                let tooltipText = '';

                if (latency === -1) {
                  color = 'var(--color-error)';
                  tooltipText = 'Таймаут';
                } else if (latency < 30) {
                  color = 'var(--color-success)';
                  tooltipText = `${latency} ms (Отлично)`;
                } else if (latency <= 100) {
                  color = 'var(--color-warning)';
                  tooltipText = `${latency} ms (Норма)`;
                } else {
                  color = '#fa8c16';
                  tooltipText = `${latency} ms (Задержка)`;
                }

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: pingHistory is simple order-preserving list of status dots
                  <Tooltip key={idx} title={tooltipText}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: `0 0 6px ${color}`,
                        cursor: 'help',
                        transition: 'all 0.2s',
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Flex>
          </Flex>
        )}

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
