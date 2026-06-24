import { DeleteOutlined } from '@ant-design/icons';
import { Button, Switch, Tag } from 'antd';
import type { FirewallRule } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';

interface MakeFirewallRuleTabColumnsProps {
  handleDeleteRule: (id: string) => void;
  handleToggleRule: (id: string) => void;
  isOffline: boolean;
}

export const makeFirewallRuleTabColumns = ({
  handleDeleteRule,
  handleToggleRule,
  isOffline,
}: MakeFirewallRuleTabColumnsProps) => [
  {
    title: 'Правило',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span className={styles.ruleName}>{text}</span>,
  },
  {
    title: 'Параметры',
    key: 'params',
    render: (_: unknown, record: FirewallRule) => (
      <div className={styles.ruleParams}>
        <div>
          {record.protocol} {record.source} →
        </div>
        <div>
          {record.destination}:{record.port}
        </div>
      </div>
    ),
  },
  {
    title: 'Действие',
    dataIndex: 'action',
    key: 'action',
    render: (action: 'ALLOW' | 'DENY') => (
      <Tag color={action === 'ALLOW' ? 'success' : 'error'} className={styles.tag}>
        {action}
      </Tag>
    ),
  },
  {
    title: 'Вкл',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'active' | 'inactive', record: FirewallRule) => (
      <Switch
        size="small"
        checked={status === 'active'}
        disabled={isOffline}
        onChange={() => handleToggleRule(record.id)}
      />
    ),
  },
  {
    title: '',
    key: 'actions',
    render: (_: unknown, record: FirewallRule) => (
      <Button
        type="text"
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => handleDeleteRule(record.id)}
      />
    ),
  },
];
