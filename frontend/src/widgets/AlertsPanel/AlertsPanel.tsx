import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Segmented } from 'antd';
import { AlertTriangle } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { selectNode, setAlertFilter, useAppDispatch, useAppSelector } from '@/app/providers/store';
import type { NetworkAlertData } from '@/entities/alert/model/types';
import { AlertCard } from '@/entities/alert/ui/AlertCard/AlertCard';
import { sendWsMessage, useStreamTopologyQuery } from '@/shared/api/topologyApi';
import type { Alert } from '@/shared/libs';
import { EmptyState } from '@/shared/ui';
import styles from './AlertsPanel.module.scss';

const ALERT_FILTER_OPTIONS: { label: string; value: Alert }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Критические', value: 'critical' },
  { label: 'Предупреждения', value: 'warning' },
  { label: 'Информация', value: 'info' },
];

export const AlertsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useStreamTopologyQuery();

  const activeFilter = useAppSelector((state) => state.ui.alertFilter);

  const alerts = data?.alerts || [];

  const filteredAlerts = useMemo(() => {
    if (activeFilter === 'all') return alerts;
    return alerts.filter((alert) => alert.severity === activeFilter);
  }, [alerts, activeFilter]);

  const handleAck = (alertId: string) => {
    sendWsMessage('ack-alert', { alertId });
  };

  const handleFocus = (nodeId: string) => {
    dispatch(selectNode(nodeId));
  };

  const handleAckAll = () => {
    sendWsMessage('ack-all-alerts');
  };

  const handleClear = () => {
    sendWsMessage('clear-alerts');
  };

  return (
    <Flex align="center" gap="10px" vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Flex
        style={{
          padding: '12px 16px',
          width: '100%',
        }}
      >
        <Segmented
          options={ALERT_FILTER_OPTIONS}
          value={activeFilter}
          onChange={(val: Alert) => dispatch(setAlertFilter(val))}
          block
        />
      </Flex>

      <Flex className={styles.panelBody}>
        {filteredAlerts.length ? (
          <Virtuoso
            style={{ height: '100%', width: '100%' }}
            data={filteredAlerts}
            itemContent={(_index, alert: NetworkAlertData) => (
              <AlertCard key={alert.id} {...alert} onAck={handleAck} onFocus={handleFocus} />
            )}
          />
        ) : (
          <EmptyState
            icon={<AlertTriangle size={24} style={{ opacity: 0.3 }} />}
            title="Инциденты отсутствуют"
          />
        )}
      </Flex>

      {alerts.length && (
        <Flex
          style={{
            width: '100%',
            padding: '12px 16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <Button
            onClick={handleAckAll}
            icon={<CheckOutlined />}
            style={{
              flex: 1,
              height: '36px',
              fontSize: '0.8rem',
              borderColor: 'var(--border-color)',
            }}
          >
            Подтвердить все
          </Button>

          <Button
            onClick={handleClear}
            danger
            icon={<DeleteOutlined />}
            style={{ height: '36px' }}
            title="Очистить всю историю лога"
          />
        </Flex>
      )}
    </Flex>
  );
};

export default AlertsPanel;
