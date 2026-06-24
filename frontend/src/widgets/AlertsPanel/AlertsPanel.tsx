import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Segmented } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { selectNode, setAlertFilter, useAppDispatch, useAppSelector } from '@/app/providers/store';
import type { NetworkAlertData } from '@/entities/alert/model/types';
import { AlertCard } from '@/entities/alert/ui/AlertCard/AlertCard';
import {
  useAckAlertMutation,
  useClearAlertsMutation,
  useStreamTopologyQuery,
} from '@/shared/api/topologyApi';
import type { Alert } from '@/shared/libs';
import { EmptyState } from '@/shared/ui';
import styles from './AlertsPanel.module.scss';

const ALERT_FILTER_OPTIONS: { label: string; value: Alert }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Критические', value: 'critical' },
  { label: 'Предупреждения', value: 'warning' },
  { label: 'Информация', value: 'info' },
];

export const AlertsPanel: FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useStreamTopologyQuery();

  const [ackAlert] = useAckAlertMutation();
  const [clearAlerts] = useClearAlertsMutation();

  const activeFilter = useAppSelector((state) => state.ui.alertFilter);

  const alerts = data?.alerts || [];

  const filteredAlerts = useMemo(() => {
    if (activeFilter === 'all') return alerts;
    return alerts.filter((alert) => alert.severity === activeFilter);
  }, [alerts, activeFilter]);

  const handleAck = async (alertId: string) => {
    try {
      await ackAlert({ alertId }).unwrap();
    } catch (err) {
      console.error('Failed to ack alert:', err);
    }
  };

  const handleFocus = (nodeId: string) => {
    dispatch(selectNode(nodeId));
  };

  const handleAckAll = async () => {
    try {
      await ackAlert({}).unwrap();
    } catch (err) {
      console.error('Failed to ack all alerts:', err);
    }
  };

  const handleClear = async () => {
    try {
      await clearAlerts().unwrap();
    } catch (err) {
      console.error('Failed to clear alerts:', err);
    }
  };

  const handleAckSelected = (value: Alert) => {
    dispatch(setAlertFilter(value));
  };

  return (
    <Flex align="center" gap="10px" vertical className={styles.panelRoot}>
      <div className={styles.filterWrapper}>
        <Segmented
          options={ALERT_FILTER_OPTIONS}
          value={activeFilter}
          onChange={handleAckSelected}
          block
        />
      </div>

      <div className={styles.panelBody}>
        {filteredAlerts.length ? (
          <Virtuoso
            data={filteredAlerts}
            itemContent={(_index, alert: NetworkAlertData) => (
              <AlertCard key={alert.id} {...alert} onAck={handleAck} onFocus={handleFocus} />
            )}
          />
        ) : (
          <EmptyState
            icon={<AlertTriangle size={24} className={styles.emptyIcon} />}
            title="Инциденты отсутствуют"
          />
        )}
      </div>

      {!!alerts.length && (
        <Flex className={styles.panelFooter}>
          <Button onClick={handleAckAll} icon={<CheckOutlined />} className={styles.ackAllBtn}>
            Подтвердить все
          </Button>

          <Button
            onClick={handleClear}
            danger
            icon={<DeleteOutlined />}
            className={styles.clearBtn}
            title="Очистить всю историю лога"
          />
        </Flex>
      )}
    </Flex>
  );
};

export default AlertsPanel;
