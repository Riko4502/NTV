import { Tag } from 'antd';
import type { CSSProperties } from 'react';
import type { SeverityType, ThreatEvent } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';
import { SEVERITY_COLORS, SEVERITY_LABELS } from './constants';

export const makeThreatAnalysisTabColumns = [
  {
    title: 'Время',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (ts: string) => {
      const d = new Date(ts);
      return <span className={styles.timestampText}>{d.toLocaleTimeString()}</span>;
    },
  },
  {
    title: 'Тип / Атакующий',
    key: 'type',
    render: (_: unknown, record: ThreatEvent) => (
      <div>
        <div className={styles.threatType}>{record.threatType}</div>
        <span className={styles.threatSource}>src: {record.source}</span>
      </div>
    ),
  },
  {
    title: 'Крит.',
    dataIndex: 'severity',
    key: 'severity',
    render: (severity: SeverityType) => {
      const color = SEVERITY_COLORS[severity];
      const label = SEVERITY_LABELS[severity];

      return (
        <Tag color={color} className={styles.tag}>
          {label}
        </Tag>
      );
    },
  },
  {
    title: 'Статус',
    dataIndex: 'actionTaken',
    key: 'actionTaken',
    render: (action: 'Blocked' | 'Log Only') => (
      <span
        className={styles.threatStatusText}
        style={
          {
            '--status-color':
              action === 'Blocked' ? 'var(--color-success)' : 'var(--color-warning)',
          } as CSSProperties
        }
      >
        {action === 'Blocked' ? 'Заблокировано' : 'Записано'}
      </span>
    ),
  },
];
