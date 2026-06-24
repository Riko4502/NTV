import { DownloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import type { FC } from 'react';
import styles from '../AnalyticsDashboard.module.scss';
import type { MetricType } from '../types';
import { exportToCsv } from '../utils/exportUtils';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

interface AnalyticsExportButtonProps {
  chartData: ChartGroup[];
  activeTab: MetricType;
}

export const AnalyticsExportButton: FC<AnalyticsExportButtonProps> = ({ chartData, activeTab }) => {
  const hasData = !!chartData.length && chartData.some((g) => !!g.data.length);

  return (
    <Tooltip
      title={hasData ? 'Экспортировать отфильтрованные данные в CSV' : 'Нет данных для экспорта'}
    >
      <Button
        type="default"
        icon={<DownloadOutlined />}
        disabled={!hasData}
        onClick={() => exportToCsv(chartData, activeTab)}
        className={styles.reloadBtn}
      >
        Экспорт
      </Button>
    </Tooltip>
  );
};
