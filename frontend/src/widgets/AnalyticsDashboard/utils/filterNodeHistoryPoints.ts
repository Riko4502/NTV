import type { MetricPoint } from '@/shared/api';
import type { MetricType } from '../types';
import { getMetricValue } from './getMetricValue';

// Вспомогательная функция для фильтрации и преобразования точек истории метрик
export const filterNodeHistoryPoints = (
  history: MetricPoint[],
  cutoffMs: number,
  activeTab: MetricType,
  endCutoffMs = 0,
) => {
  const points = [];
  for (let j = 0; j < history.length; j++) {
    const p = history[j];
    const pointTime = new Date(p.timestamp).getTime();

    if (cutoffMs && pointTime < cutoffMs) {
      continue;
    }
    if (endCutoffMs && pointTime > endCutoffMs) {
      continue;
    }

    points.push({
      key: new Date(p.timestamp),
      data: getMetricValue(p, activeTab),
    });
  }
  return points;
};
