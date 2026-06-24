import {
  DeleteOutlined,
  EditOutlined,
  PoweroffOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Flex, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { DeviceData, DeviceType } from '@/shared/libs';
import { STATUS_BADGES, TYPE_TAGS } from './constants';
import styles from './DevicesPage.module.scss';

interface MakeDeviceColumnsProps {
  pingingNodeId: string | null;
  isEditMode: boolean;
  handlePing: (nodeId: string, nodeLabel: string) => void;
  handleReboot: (nodeId: string, nodeLabel: string) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
  handleEdit: (device: DeviceData) => void;
}

export const makeDeviceColumns = ({
  pingingNodeId,
  isEditMode,
  handlePing,
  handleReboot,
  handleDelete,
  handleEdit,
}: MakeDeviceColumnsProps) => [
  {
    title: 'Устройство',
    dataIndex: 'label',
    key: 'label',
    sorter: (a: DeviceData, b: DeviceData) => a.label.localeCompare(b.label),
    render: (value: string, record: DeviceData) => {
      const isFirewall = record.type === 'firewall';

      return (
        <div>
          <div className={styles.labelWrapper}>
            {isFirewall ? <Link to={`/devices/${record.id}/firewall`}>{value}</Link> : value}
          </div>
          <Flex align="center" gap={6} className={styles.subRow}>
            <span className={styles.ipSpan}>{record.ip}</span>
            {(record.vendor || record.model) && (
              <span className={styles.vendorSpan}>
                {record.vendor} {record.model} {record.version ? `[${record.version}]` : ''}
              </span>
            )}
          </Flex>
        </div>
      );
    },
  },
  {
    title: 'Тип',
    dataIndex: 'type',
    key: 'type',
    sorter: (a: DeviceData, b: DeviceData) => a.type.localeCompare(b.type),
    render: (type: DeviceType) => {
      const { color, label } = TYPE_TAGS[type] || { color: 'default', label: type };
      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    sorter: (a: DeviceData, b: DeviceData) => a.status.localeCompare(b.status),
    render: (status: keyof typeof STATUS_BADGES) => {
      const { color, label } = STATUS_BADGES[status] || { color: 'default', label: status };
      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: 'Команды',
    key: 'actions',
    render: (_: unknown, record: DeviceData) => {
      const isOffline = record.status === 'offline';
      return (
        <Flex gap={8}>
          <Button
            type="primary"
            size="small"
            icon={<ThunderboltOutlined />}
            disabled={isOffline}
            loading={pingingNodeId === record.id}
            onClick={() => handlePing(record.id, record.label)}
          >
            Ping
          </Button>
          <Button
            size="small"
            danger={!isOffline}
            icon={<PoweroffOutlined />}
            onClick={() => handleReboot(record.id, record.label)}
          >
            {isOffline ? 'Запуск' : 'Ребут'}
          </Button>
          {isEditMode && (
            <Flex gap={4}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                className={styles.editBtn}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id, record.label)}
              />
            </Flex>
          )}
        </Flex>
      );
    },
  },
];
