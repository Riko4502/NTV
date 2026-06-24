import { Card, Statistic } from 'antd';
import type { CSSProperties, FC, ReactNode } from 'react';
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
    <Card size="small" className={styles.kpiCard}>
      <Statistic
        className={styles.statistic}
        title={<span className={styles.title}>{title}</span>}
        value={value}
        style={
          {
            '--kpi-value-color': valueColor,
          } as CSSProperties
        }
        prefix={prefix}
        suffix={suffix}
      />
    </Card>
  );
};
