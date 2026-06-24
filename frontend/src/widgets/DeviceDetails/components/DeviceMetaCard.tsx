import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Flex, message } from 'antd';
import type { CSSProperties, FC } from 'react';
import { useState } from 'react';
import { useUpdateNodeMutation } from '@/shared/api';
import type { DeviceType, Status } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';
import { EditDeviceModal } from './EditDeviceModal';

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
  id: string;
  label: string;
  type: DeviceType;
  ip: string;
  mac: string;
  status: Status;
  vendor?: string;
  model?: string;
  version?: string;
}

export const DeviceMetaCard: FC<DeviceMetaCardProps> = (props) => {
  const { id, label, type, ip, mac, status, vendor, model, version } = props;
  const statusColor = STATUS_COLOR[status];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateNode] = useUpdateNodeMutation();

  const handleEditFinish = async (values: {
    label: string;
    ip: string;
    mac: string;
    vendor: string;
    model: string;
    version: string;
  }) => {
    try {
      await updateNode({ nodeId: id, ...values }).unwrap();
      setIsEditModalOpen(false);
      message.success('Параметры устройства успешно обновлены');
    } catch {
      message.error('Не удалось обновить параметры устройства');
    }
  };

  return (
    <Card
      size="small"
      className={`${styles.card} ${styles.metaCard}`}
      style={{ '--status-color': statusColor } as CSSProperties}
    >
      <Flex justify="space-between" align="flex-start" className={styles.headerFlex}>
        <div className={styles.headerLeft}>
          <h2 className={styles.metaTitle}>{label}</h2>
          <span className={styles.metaSubtitle}>{DEVICE_LABLE[type] || 'Неизвестно'}</span>
        </div>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => setIsEditModalOpen(true)}
          className={styles.editBtn}
        />
      </Flex>

      <div className={styles.metaList}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Вендор:</span>
          <span className={styles.metaValue}>{vendor || '-'}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Модель:</span>
          <span className={styles.metaValue}>{model || '-'}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Версия ПО:</span>
          <span className={styles.metaValue}>{version || '-'}</span>
        </div>
        <div className={styles.metaDivider} />
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>IP:</span>
          <span className={styles.metaValue}>{ip}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>MAC:</span>
          <span className={styles.metaValue}>{mac}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Статус:</span>
          <span className={styles.statusText}>{status}</span>
        </div>
      </div>

      <EditDeviceModal
        isOpen={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        device={props}
        onFinish={handleEditFinish}
      />
    </Card>
  );
};
