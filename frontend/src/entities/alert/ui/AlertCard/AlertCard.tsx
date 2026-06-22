import { AimOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Tooltip, Typography } from 'antd';
import { AlertTriangle, Info } from 'lucide-react';
import { type FC, useCallback } from 'react';
import { getTimeString } from '@/shared/libs';
import type { NetworkAlertData } from '../../model/types';

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
      style={{
        border: `1px solid ${acknowledged ? 'var(--border-color)' : border}`,
        backgroundColor: acknowledged ? 'rgba(255, 255, 255, 0.01)' : background,
        borderRadius: '8px',
        marginBottom: '10px',
        transition: 'all 0.2s',
        boxShadow: acknowledged ? 'none' : `0 2px 8px var(--panel-shadow)`,
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
        <Flex align="center" gap={6} style={{ color, fontWeight: 600, fontSize: '0.75rem' }}>
          <Icon size={14} />
          <Typography.Text>{severity.toUpperCase()}</Typography.Text>
        </Flex>
        <Typography.Text style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {formattedTime}
        </Typography.Text>
      </Flex>

      <Typography.Text
        style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}
      >
        {message}
      </Typography.Text>

      <Flex justify="space-between" align="center" style={{ marginTop: '4px' }}>
        <Flex align="center" gap={4}>
          <Typography.Text style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Узел:
          </Typography.Text>
          <Typography.Text style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {nodeLabel}
          </Typography.Text>
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
                icon={<CheckOutlined style={{ color: 'var(--color-success)' }} />}
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
