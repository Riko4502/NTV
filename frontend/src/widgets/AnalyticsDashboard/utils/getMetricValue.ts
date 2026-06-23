import type { MetricType } from '../types';

export const getMetricValue = (
  point: { cpu: number; ram: number; temp: number; traffic: number },
  tab: MetricType,
): number => {
  if (tab === 'cpu') return point.cpu;
  if (tab === 'ram') return point.ram;
  if (tab === 'temp') return point.temp;
  return point.traffic;
};
