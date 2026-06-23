import { BarChartOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';

import { type FC, useMemo } from 'react';
import {
  Area,
  AreaChart,
  AreaSeries,
  Gradient,
  GridlineSeries,
  Line,
  LinearXAxis,
  LinearXAxisTickLabel,
  LinearXAxisTickSeries,
  LinearYAxis,
  LinearYAxisTickLabel,
  LinearYAxisTickSeries,
} from 'reaviz';
import { getDateTimeString } from '@/shared/libs/utils';
import { EmptyState } from '@/shared/ui';
import { METRICS_ITEMS, PERIOD_CONFIG, PERIOD_MINUTES } from '../constants';
import type { MetricType } from '../types';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

interface AnalyticsChartProps {
  activeTab: MetricType;
  onTabChange: (key: MetricType) => void;
  chartData: ChartGroup[];
  chartColorScheme: string[];
  timePeriod: string;
  hasSelectedDevices: boolean;
  showThreshold: boolean;
}

const getMinMaxTime = (chartData: ChartGroup[]) => {
  let minTime = Infinity;
  let maxTime = -Infinity;

  for (const group of chartData) {
    for (const item of group.data) {
      const t = new Date(item.key).getTime();
      if (t < minTime) minTime = t;
      if (t > maxTime) maxTime = t;
    }
  }

  return { minTime, maxTime };
};

const DEFAULT_CONFIG = { minutes: 5, stepMs: 60 * 1000 };

const getPeriodConfig = (timePeriod: string, maxTime: number) => {
  const config = PERIOD_CONFIG[timePeriod] ?? DEFAULT_CONFIG;

  return {
    minTime: maxTime - config.minutes * 60 * 1000,
    stepMs: config.stepMs,
    isAll: !PERIOD_CONFIG[timePeriod],
  };
};

const METRIC_THRESHOLDS: Record<MetricType, number> = {
  cpu: 85,
  ram: 90,
  temp: 75,
  traffic: 80,
};

export const AnalyticsChart: FC<AnalyticsChartProps> = ({
  activeTab,
  onTabChange,
  chartData,
  chartColorScheme,
  timePeriod,
  hasSelectedDevices,
  showThreshold,
}) => {
  const xAxisDomain = useMemo(() => {
    const minutes = (PERIOD_MINUTES as Record<string, number>)[timePeriod];
    if (!minutes) return undefined;

    const maxTime = Date.now();
    const minTime = maxTime - minutes * 60 * 1000;

    return [new Date(minTime), new Date(maxTime)] as [Date, Date];
  }, [timePeriod]);

  const tickValues = useMemo(() => {
    const maxTime = Date.now();
    const { minTime: configMin, stepMs, isAll } = getPeriodConfig(timePeriod, maxTime);
    let minTime = configMin;
    let limitTime = maxTime;

    if (isAll) {
      if (!chartData || chartData.length === 0) return undefined;
      const { minTime: dMin, maxTime: dMax } = getMinMaxTime(chartData);
      if (dMin === Number.MAX_SAFE_INTEGER) return undefined;
      minTime = dMin;
      limitTime = dMax;
    }

    const ticks = [];
    const start = Math.ceil(minTime / stepMs) * stepMs;
    for (let t = start; t <= limitTime; t += stepMs) {
      ticks.push(new Date(t));
    }
    return ticks.length > 0 ? ticks : undefined;
  }, [chartData, timePeriod]);

  const tabItems = useMemo(() => {
    return METRICS_ITEMS.map((item) => ({
      key: item.id,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <item.icon size={16} /> {item.label}
        </span>
      ),
    }));
  }, []);

  const { displayChartData, displayColorScheme } = useMemo(() => {
    if (!showThreshold || !chartData.length) {
      return { displayChartData: chartData, displayColorScheme: chartColorScheme };
    }

    const { minTime, maxTime } = xAxisDomain
      ? { minTime: xAxisDomain[0].getTime(), maxTime: xAxisDomain[1].getTime() }
      : getMinMaxTime(chartData);

    const thresholdVal = METRIC_THRESHOLDS[activeTab] ?? 85;

    const thresholdSeries = {
      key: 'Критический порог',
      data: [
        { key: new Date(minTime), data: thresholdVal },
        { key: new Date(maxTime), data: thresholdVal },
      ],
    };

    return {
      displayChartData: [...chartData, thresholdSeries],
      displayColorScheme: [...chartColorScheme, '#ff4d4f'],
    };
  }, [chartData, chartColorScheme, showThreshold, activeTab, xAxisDomain]);

  return (
    <Card
      style={{
        background: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
      styles={{ body: { padding: '20px' } }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange as (key: string) => void}
        style={{ marginBottom: '16px' }}
        items={tabItems}
      />

      {!hasSelectedDevices ? (
        <EmptyState
          icon={<BarChartOutlined style={{ fontSize: '24px' }} />}
          title="Устройства не выбраны"
          description="Пожалуйста, выберите одно или несколько устройств в панели выше для отображения графиков."
        />
      ) : !chartData.length ? (
        <EmptyState
          icon={<BarChartOutlined style={{ fontSize: '24px' }} />}
          title="Нет данных за выбранный период"
          description="За выбранный временной интервал телеметрия отсутствует. Попробуйте выбрать другой диапазон или подождите накопления данных."
        />
      ) : (
        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
          <AreaChart
            height={320}
            data={displayChartData}
            series={
              <AreaSeries
                type="grouped"
                colorScheme={displayColorScheme}
                animated={false}
                line={<Line strokeWidth={2.5} animated={false} />}
                area={<Area gradient={<Gradient />} animated={false} />}
              />
            }
            xAxis={
              <LinearXAxis
                type="time"
                domain={xAxisDomain}
                tickSeries={
                  <LinearXAxisTickSeries
                    tickValues={tickValues}
                    label={
                      <LinearXAxisTickLabel
                        rotation={0}
                        fill="var(--text-muted)"
                        fontSize={11}
                        format={getDateTimeString}
                      />
                    }
                  />
                }
              />
            }
            yAxis={
              <LinearYAxis
                type="value"
                tickSeries={
                  <LinearYAxisTickSeries
                    label={<LinearYAxisTickLabel fill="var(--text-muted)" fontSize={11} />}
                  />
                }
              />
            }
            gridlines={<GridlineSeries />}
          />
        </div>
      )}
    </Card>
  );
};
