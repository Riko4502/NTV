import {
  DeleteOutlined,
  HddOutlined,
  PoweroffOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Progress, Tag } from 'antd';
import type { DeviceData, DeviceType } from '@/shared/libs';
import { STATUS_BADGES, TYPE_TAGS } from './constants';

interface MakeDeviceColumnsProps {
  pingingNodeId: string | null;
  isEditMode: boolean;
  handlePing: (nodeId: string, nodeLabel: string) => void;
  handleReboot: (nodeId: string, nodeLabel: string) => void;
  handleDelete: (nodeId: string, nodeLabel: string) => void;
}

export const makeDeviceColumns = ({
  pingingNodeId,
  isEditMode,
  handlePing,
  handleReboot,
  handleDelete,
}: MakeDeviceColumnsProps) => [
  {
    title: 'Устройство',
    dataIndex: 'label',
    key: 'label',
    sorter: (a: DeviceData, b: DeviceData) => a.label.localeCompare(b.label),
    render: (text: string, record: DeviceData) => (
      <div>
        <div
          style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <HddOutlined size={14} style={{ color: 'var(--color-primary)' }} />
          {text}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          {record.ip}
        </span>
      </div>
    ),
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
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    sorter: (a: DeviceData, b: DeviceData) => (a.cpu || 0) - (b.cpu || 0),
    render: (cpu: number, record: DeviceData) => {
      if (record.status === 'offline') return '-';
      let status: 'success' | 'active' | 'exception' = 'success';
      if (cpu > 90) status = 'exception';
      else if (cpu > 70) status = 'active';
      return (
        <Progress
          percent={cpu}
          size="small"
          status={status}
          strokeColor={cpu > 80 ? 'var(--color-error)' : undefined}
          style={{ flex: 1, marginBottom: 0 }}
        />
      );
    },
  },
  {
    title: 'RAM',
    dataIndex: 'ram',
    key: 'ram',
    sorter: (a: DeviceData, b: DeviceData) => (a.ram || 0) - (b.ram || 0),
    render: (ram: number, record: DeviceData) => {
      if (record.status === 'offline') return '-';
      return (
        <Progress
          percent={ram}
          size="small"
          strokeColor={ram > 85 ? 'var(--color-warning)' : undefined}
          style={{ flex: 1, marginBottom: 0 }}
        />
      );
    },
  },
  {
    title: 'Темп.',
    dataIndex: 'temp',
    key: 'temp',
    sorter: (a: DeviceData, b: DeviceData) => (a.temp || 0) - (b.temp || 0),
    render: (temp: number, record: DeviceData) => {
      if (record.status === 'offline') return '-';
      const isHot = temp > 70;
      return (
        <span
          style={{
            color: isHot ? 'var(--color-error)' : 'var(--text-primary)',
            fontWeight: isHot ? 600 : 400,
          }}
        >
          {temp}°C
        </span>
      );
    },
  },
  {
    title: 'Команды',
    key: 'actions',
    render: (_: unknown, record: DeviceData) => {
      const isOffline = record.status === 'offline';
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
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
            {isOffline ? 'Запуск' : 'Ре reboot'}
          </Button>
          {isEditMode && (
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.label)}
            />
          )}
        </div>
      );
    },
  },
];
