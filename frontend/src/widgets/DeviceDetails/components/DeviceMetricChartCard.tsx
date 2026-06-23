import { Card, Flex } from 'antd';
import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';
import { Area, AreaSeries, AreaSparklineChart, Gradient, Line } from 'reaviz';

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
    <Card
      size="small"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
      }}
      styles={{ body: { padding: '12px' } }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
        <Flex align="center" gap="6px" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          <Icon size={14} style={{ color: chartColor }} />
          <span>{title}</span>
        </Flex>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: chartColor }}>
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
        <Flex
          align="center"
          justify="center"
          style={{ height: '64px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          Накапливаем метрики...
        </Flex>
      )}
    </Card>
  );
};
