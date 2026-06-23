import { Card, Statistic } from 'antd';
import type { FC, ReactNode } from 'react';
import styles from './KpiCard.module.scss';

interface KpiCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const KpiCard: FC<KpiCardProps> = ({ title, value, valueColor, prefix, suffix }) => {
  return (
    <Card size="small" className={styles.kpiCard} styles={{ body: { padding: '4px 10px' } }}>
      <Statistic
        className={styles.statistic}
        title={<span className={styles.title}>{title}</span>}
        value={value}
        style={{
          color: valueColor || 'var(--text-primary)',
        }}
        prefix={prefix}
        suffix={suffix}
      />
    </Card>
  );
};
