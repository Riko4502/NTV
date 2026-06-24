import { Card, Flex } from 'antd';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, FC } from 'react';
import { Area, AreaSeries, AreaSparklineChart, Gradient, Line } from 'reaviz';
import styles from '../DeviceDetails.module.scss';

interface DeviceMetricChartCardProps {
  title: string;
  value: number;
  history: number[];
  color: string;
  icon: LucideIcon;
  suffix?: string;
}

export const DeviceMetricChartCard: FC<DeviceMetricChartCardProps> = ({
  title,
  value,
  history,
  color,
  icon: Icon,
  suffix = '%',
}) => {
  const chartColor = color.startsWith('var(') ? color : `var(--color-${color})`;
  const chartData = history.map((val, idx) => ({ key: idx, data: val }));

  return (
    <Card size="small" className={styles.card}>
      <Flex justify="space-between" align="center" className={styles.chartHeaderFlex}>
        <Flex align="center" gap="6px" className={styles.titleFlex}>
          <Icon
            size={14}
            className={styles.metricIcon}
            style={{ '--icon-color': chartColor } as CSSProperties}
          />
          <span>{title}</span>
        </Flex>
        <span
          className={styles.metricValue}
          style={{ '--metric-color': chartColor } as CSSProperties}
        >
          {value}
          {suffix}
        </span>
      </Flex>
      {history.length >= 2 ? (
        <AreaSparklineChart
          height={64}
          data={chartData}
          series={
            <AreaSeries
              colorScheme={[chartColor]}
              line={<Line strokeWidth={2} />}
              area={<Area gradient={<Gradient />} />}
              symbols={null}
              tooltip={undefined}
            />
          }
        />
      ) : (
        <Flex align="center" justify="center" className={styles.emptyChartFlex}>
          Накапливаем метрики...
        </Flex>
      )}
    </Card>
  );
};
