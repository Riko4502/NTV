import { AimOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Tooltip, Typography } from 'antd';
import { AlertTriangle, Info } from 'lucide-react';
import { type CSSProperties, type FC, useCallback } from 'react';
import { getTimeString } from '@/shared/libs';
import type { NetworkAlertData } from '../../model/types';
import styles from './AlertCard.module.scss';

const SEVERITY_STYLE = {
  critical: {
    border: 'rgba(239, 68, 68, 0.25)',
    background: 'rgba(239, 68, 68, 0.08)',
    color: 'var(--color-error)',
    Icon: AlertTriangle,
  },
  warning: {
    border: 'rgba(245, 158, 11, 0.25)',
    background: 'rgba(245, 158, 11, 0.08)',
    color: 'var(--color-warning)',
    Icon: AlertTriangle,
  },
  info: {
    border: 'rgba(59, 130, 246, 0.25)',
    background: 'rgba(59, 130, 246, 0.08)',
    color: 'var(--color-primary)',
    Icon: Info,
  },
};

interface AlertCardProps extends NetworkAlertData {
  onAck: (alertId: string) => void;
  onFocus: (nodeId: string) => void;
}

export const AlertCard: FC<AlertCardProps> = ({ id, severity, onAck, onFocus, ...other }) => {
  const { Icon, color, background, border } = SEVERITY_STYLE[severity];
  const { acknowledged, message, nodeLabel, timestamp, nodeId } = other;

  const formattedTime = getTimeString(timestamp);

  const handleFocus = useCallback(() => {
    onFocus(nodeId);
  }, [nodeId, onFocus]);

  const handleAck = useCallback(() => {
    onAck(id);
  }, [id, onAck]);

  return (
    <Card
      size="small"
      className={styles.alertCard}
      style={
        {
          '--alert-border': acknowledged ? '1px solid var(--border-color)' : `1px solid ${border}`,
          '--alert-bg': acknowledged ? 'rgba(255, 255, 255, 0.01)' : background,
          '--alert-shadow': acknowledged ? 'none' : '0 2px 8px var(--panel-shadow)',
        } as CSSProperties
      }
    >
      <Flex justify="space-between" align="center" className={styles.header}>
        <Flex
          align="center"
          gap={6}
          className={styles.severityText}
          style={{ '--severity-color': color } as CSSProperties}
        >
          <Icon size={14} />
          <Typography.Text>{severity.toUpperCase()}</Typography.Text>
        </Flex>
        <Typography.Text className={styles.timeText}>{formattedTime}</Typography.Text>
      </Flex>

      <Typography.Text className={styles.messageText}>{message}</Typography.Text>

      <Flex justify="space-between" align="center" className={styles.footer}>
        <Flex align="center" gap={4}>
          <Typography.Text className={styles.nodeLabel}>Узел:</Typography.Text>
          <Typography.Text className={styles.nodeValue}>{nodeLabel}</Typography.Text>
        </Flex>

        <Flex gap={6} align="center">
          <Tooltip title="Фокусироваться на узле" mouseEnterDelay={0.5}>
            <Button type="text" size="small" icon={<AimOutlined />} onClick={handleFocus} />
          </Tooltip>

          {!acknowledged && (
            <Tooltip title="Подтвердить прочтение" mouseEnterDelay={0.5}>
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined className={styles.successIcon} />}
                onClick={handleAck}
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
export default AlertCard;
