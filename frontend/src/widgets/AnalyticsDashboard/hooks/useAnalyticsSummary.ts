import { useMemo } from 'react';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

export interface SummaryStatItem {
  value: number;
  device: string;
  timestamp: Date | number;
}

export interface AnalyticsSummaryResult {
  min: SummaryStatItem;
  max: SummaryStatItem;
  avg: number;
}

interface CalcResult {
  minVal: number;
  maxVal: number;
  minDevice: string;
  maxDevice: string;
  minTime: Date | number;
  maxTime: Date | number;
  sum: number;
  count: number;
  hasData: boolean;
}

const calculateStats = (chartData: ChartGroup[]): CalcResult => {
  let minVal = Number.MAX_VALUE;
  let maxVal = -Number.MAX_VALUE;
  let minDevice = '';
  let maxDevice = '';
  let minTime: Date | number = 0;
  let maxTime: Date | number = 0;

  let sum = 0;
  let count = 0;
  let hasData = false;

  for (let i = 0; i < chartData.length; i++) {
    const group = chartData[i];
    if (group.key === 'Критический порог') continue;

    const data = group.data;
    for (let j = 0; j < data.length; j++) {
      const item = data[j];
      const val = item.data;
      sum += val;
      count++;
      hasData = true;

      if (val < minVal) {
        minVal = val;
        minDevice = group.key;
        minTime = item.key;
      }

      if (val > maxVal) {
        maxVal = val;
        maxDevice = group.key;
        maxTime = item.key;
      }
    }
  }

  return {
    minVal,
    maxVal,
    minDevice,
    maxDevice,
    minTime,
    maxTime,
    sum,
    count,
    hasData,
  };
};

export const useAnalyticsSummary = (chartData: ChartGroup[]): AnalyticsSummaryResult | null => {
  return useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    const stats = calculateStats(chartData);

    if (!stats.hasData) return null;

    return {
      min: { value: stats.minVal, device: stats.minDevice, timestamp: stats.minTime },
      max: { value: stats.maxVal, device: stats.maxDevice, timestamp: stats.maxTime },
      avg: Math.round((stats.sum / stats.count) * 10) / 10,
    };
  }, [chartData]);
};
