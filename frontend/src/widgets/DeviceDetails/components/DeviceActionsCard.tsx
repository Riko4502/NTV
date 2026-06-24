import { LoadingOutlined, PoweroffOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Tooltip } from 'antd';
import type { CSSProperties, FC } from 'react';
import styles from '../DeviceDetails.module.scss';

interface DeviceActionsCardProps {
  isOffline: boolean;
  isEditMode: boolean;
  isPinging: boolean;
  pingLatency: number | null;
  pingHistory: number[];
  onPing: () => void;
  onReboot: () => void;
  onDelete: () => void;
}

export const DeviceActionsCard: FC<DeviceActionsCardProps> = ({
  isOffline,
  isEditMode,
  isPinging,
  pingLatency,
  pingHistory,
  onPing,
  onReboot,
  onDelete,
}) => {
  return (
    <Card
      size="small"
      title={<span className={styles.cardTitle}>Удалённые Команды</span>}
      className={`${styles.card} ${styles.actionsCard}`}
    >
      <div className={styles.actionsContainer}>
        {/* Ping Device Button */}
        <div className={styles.pingRow}>
          <Button
            onClick={onPing}
            disabled={isOffline}
            loading={isPinging}
            type="primary"
            icon={!isPinging && <ThunderboltOutlined />}
            className={styles.pingBtn}
          >
            {isPinging ? 'Отправка...' : 'Тест связи (Ping)'}
          </Button>

          {/* RTT display */}
          {pingLatency !== null && (
            <div
              className={styles.rttDisplay}
              style={
                {
                  '--rtt-color': pingLatency === -1 ? 'var(--color-error)' : 'var(--color-success)',
                } as CSSProperties
              }
            >
              {pingLatency === -1 ? 'Таймаут' : `${pingLatency} ms`}
            </div>
          )}
        </div>

        {!!pingHistory.length && (
          <Flex vertical gap="6px" className={styles.pingHistoryWrapper}>
            <span className={styles.historyLabel}>История пинг-тестов:</span>
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
                  // biome-ignore lint/suspicious/noArrayIndexKey: временное решение
                  <Tooltip key={idx} title={tooltipText}>
                    <div
                      className={styles.historyDot}
                      style={
                        {
                          '--dot-color': color,
                        } as CSSProperties
                      }
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
          className={`${styles.rebootBtn} ${isOffline ? styles.offlineInit : ''}`}
        >
          {isOffline ? 'Инициализация запуска...' : 'Перезапустить устройство'}
        </Button>

        {/* Delete Node Button — only in edit mode */}
        {isEditMode && (
          <>
            <div className={styles.deleteDivider} />
            <Button danger onClick={onDelete} className={styles.deleteBtn}>
              🗑 Удалить устройство
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
