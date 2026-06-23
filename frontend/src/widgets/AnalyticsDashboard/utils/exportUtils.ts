import { getDateTimeString } from '@/shared/libs/utils';
import type { MetricType } from '../types';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

const METRIC_LABELS: Record<MetricType, string> = {
  cpu: 'Загрузка CPU (%)',
  ram: 'Использование RAM (%)',
  temp: 'Температура (°C)',
  traffic: 'Трафик (Mbps)',
};

export const exportToCsv = (chartData: ChartGroup[], activeTab: MetricType) => {
  if (!chartData || chartData.length === 0) return;

  const metricName = METRIC_LABELS[activeTab] || activeTab;
  const headers = ['Устройство', 'Время', metricName];

  const rows: string[][] = [];
  for (let i = 0; i < chartData.length; i++) {
    const group = chartData[i];
    if (group.key === 'Критический порог') continue;

    for (let j = 0; j < group.data.length; j++) {
      const item = group.data[j];
      const timeStr = getDateTimeString(item.key);
      const val = item.data;
      rows.push([group.key, timeStr, val.toString()]);
    }
  }

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // Excel support with UTF-8 BOM (\uFEFF)
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `analytics_${activeTab}_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
