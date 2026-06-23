import { Tag } from 'antd';
import { SLA_COLOR_RULES, STATUS } from './constants';

const getSlaColor = (sla: number) => {
  const rule = SLA_COLOR_RULES.find((r) => r.check(sla));
  return rule ? rule.color : 'var(--color-error)';
};

export const makeReportColumns = [
  {
    title: 'Устройство',
    dataIndex: 'label',
    key: 'label',
    render: (text: string, record: { ip: string }) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          {record.ip}
        </span>
      </div>
    ),
  },
  {
    title: 'Показатель доступности (SLA)',
    dataIndex: 'sla',
    key: 'sla',
    render: (sla: number) => {
      const color = getSlaColor(sla);
      return <span style={{ fontWeight: 600, color }}>{sla}%</span>;
    },
  },
  {
    title: 'Время простоя (Downtime)',
    dataIndex: 'downtime',
    key: 'downtime',
    render: (downtime: string) => (
      <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{downtime}</span>
    ),
  },
  {
    title: 'Статус SLA',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'excellent' | 'good' | 'warning') => {
      const { color, label } = STATUS[status] || { color: 'default', label: status };
      return <Tag color={color}>{label}</Tag>;
    },
  },
];
