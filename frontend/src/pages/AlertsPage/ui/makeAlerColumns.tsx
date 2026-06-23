import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import type { NetworkAlertData } from '@/entities/alert/model/types';
import type { AlertType } from '@/shared/libs';
import { SEVERITY_TAGS } from './constants';

interface MakeAlerColumns {
  handleAck: (id: string) => void;
  onNodeClick: (nodeId: string) => void;
}

export const makeAlerColumns = ({ handleAck, onNodeClick }: MakeAlerColumns) => [
  {
    title: 'Время',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: '180px',
    render: (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        return date.toLocaleString();
      } catch {
        return timestamp;
      }
    },
  },
  {
    title: 'Устройство',
    dataIndex: 'nodeLabel',
    key: 'nodeLabel',
    width: '180px',
    render: (text: string, record: NetworkAlertData) => {
      if (!record.nodeId) return 'Система';
      return (
        <Button
          type="link"
          style={{ padding: 0, height: 'auto', fontWeight: 500 }}
          onClick={() => onNodeClick(record.nodeId)}
        >
          {text}
        </Button>
      );
    },
  },
  {
    title: 'Критичность',
    dataIndex: 'severity',
    key: 'severity',
    width: '150px',
    render: (severity: AlertType) => {
      const { color, label } = SEVERITY_TAGS[severity] ?? { color: 'default', label: severity };
      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: 'Сообщение',
    dataIndex: 'message',
    key: 'message',
    render: (text: string) => (
      <span style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>{text}</span>
    ),
  },
  {
    title: 'Статус',
    key: 'status',
    width: '150px',
    render: (_: unknown, record: NetworkAlertData) => {
      if (record.acknowledged) {
        return <Tag color="default">Подтвержден</Tag>;
      }
      return (
        <Button
          type="text"
          size="small"
          icon={<CheckCircleOutlined style={{ color: 'var(--color-success)' }} />}
          onClick={() => handleAck(record.id)}
        >
          Подтвердить
        </Button>
      );
    },
  },
];
