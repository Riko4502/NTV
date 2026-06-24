import { Tag } from 'antd';
import type { CSSProperties } from 'react';
import { SLA_COLOR_RULES, STATUS } from './constants';
import styles from './ReportsPage.module.scss';

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
        <div className={styles.deviceName}>{text}</div>
        <span className={styles.deviceIp}>{record.ip}</span>
      </div>
    ),
  },
  {
    title: 'Показатель доступности (SLA)',
    dataIndex: 'sla',
    key: 'sla',
    render: (sla: number) => {
      const color = getSlaColor(sla);
      return (
        <span className={styles.slaValue} style={{ '--sla-color': color } as CSSProperties}>
          {sla}%
        </span>
      );
    },
  },
  {
    title: 'Время простоя (Downtime)',
    dataIndex: 'downtime',
    key: 'downtime',
    render: (downtime: string) => <span className={styles.downtimeValue}>{downtime}</span>,
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
