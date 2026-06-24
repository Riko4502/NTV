import {
  AlertOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Empty, Flex, Input, Layout, notification, Select, Table } from 'antd';
import { type FC, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectNode, useAppDispatch } from '@/app/providers/store';
import { paths } from '@/app/router/paths';
import { useAckAlertMutation, useClearAlertsMutation, useStreamTopologyQuery } from '@/shared/api';
import styles from './AlertsPage.module.scss';
import { ALERT_SEVERITY_OPTIONS, STATUS_OPTIONS } from './constants';
import { makeAlerColumns } from './makeAlerColumns';

export const AlertsPage: FC = () => {
  const { data } = useStreamTopologyQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [ackAlert] = useAckAlertMutation();
  const [clearAlerts] = useClearAlertsMutation();

  const [searchText, setSearchText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const alerts = useMemo(() => data?.alerts || [], [data]);

  const isDisabledAlerts = !alerts.length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.message.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.nodeLabel?.toLowerCase().includes(searchText.toLowerCase());

      const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;

      const isAck = alert.acknowledged;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'ack' && isAck) ||
        (selectedStatus === 'new' && !isAck);

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, searchText, selectedSeverity, selectedStatus]);

  const handleAck = useCallback(
    async (alertId: string) => {
      try {
        await ackAlert({ alertId }).unwrap();
        notification.success({
          message: 'Инцидент подтвержден',
          description: 'Статус инцидента обновлен на подтвержденный.',
          placement: 'bottomRight',
        });
      } catch (_err) {
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось подтвердить инцидент.',
          placement: 'bottomRight',
        });
      }
    },
    [ackAlert],
  );

  const handleAckAll = useCallback(async () => {
    try {
      await ackAlert({}).unwrap();
      notification.success({
        message: 'Сброс предупреждений',
        description: 'Все активные инциденты переведены в статус подтвержденных.',
        placement: 'bottomRight',
      });
    } catch (_err) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось подтвердить предупреждения.',
        placement: 'bottomRight',
      });
    }
  }, [ackAlert]);

  const handleClear = async () => {
    try {
      await clearAlerts().unwrap();
      notification.info({
        message: 'Очистка лога сбоев',
        description: 'Все записи журнала успешно очищены.',
        placement: 'bottomRight',
      });
    } catch (_err) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось очистить журнал.',
        placement: 'bottomRight',
      });
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(alerts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `alerts-export-${Date.now()}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
    notification.success({
      message: 'Экспорт журнала',
      description: 'Файл с логами сбоев успешно скачан.',
      placement: 'bottomRight',
    });
  };

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      dispatch(selectNode(nodeId));
      navigate(paths.root);
    },
    [dispatch, navigate],
  );

  const columns = useMemo(
    () => makeAlerColumns({ handleAck, onNodeClick: handleNodeClick }),
    [handleAck, handleNodeClick],
  );

  return (
    <Layout className={styles.pageLayout}>
      <Flex wrap="wrap" justify="space-between" align="center" className={styles.headerRow}>
        <Flex gap={12} wrap="wrap">
          <Input
            placeholder="Поиск по сообщению или устройству..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className={styles.searchIcon} />}
            className={styles.searchInput}
            allowClear
          />

          <Select
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            className={styles.severitySelect}
            options={ALERT_SEVERITY_OPTIONS}
          />

          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            className={styles.statusSelect}
            options={STATUS_OPTIONS}
          />
        </Flex>

        <Flex gap={8}>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={handleAckAll}
            disabled={isDisabledAlerts}
            className={styles.actionBtn}
          >
            Подтвердить все
          </Button>

          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportJson}
            disabled={isDisabledAlerts}
            className={styles.actionBtn}
          >
            Экспорт JSON
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={isDisabledAlerts}
            className={styles.actionBtn}
          >
            Очистить
          </Button>
        </Flex>
      </Flex>

      <Table
        dataSource={filteredAlerts}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className={styles.alertsTable}
        locale={{
          emptyText: <Empty image={<AlertOutlined />} description="Инциденты отсутствуют" />,
        }}
      />
    </Layout>
  );
};

export default AlertsPage;
