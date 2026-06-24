import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Flex, Select, Space, Switch, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';

import type { FC } from 'react';
import { formatInterval } from '@/shared/libs';
import styles from '../AnalyticsDashboard.module.scss';
import type { MetricType } from '../types';
import { AnalyticsExportButton } from './AnalyticsExportButton';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

const TIME_OPTIONS = [
  { label: '1 мин', value: '1m' },
  { label: '3 мин', value: '3m' },
  { label: '5 мин', value: '5m' },
  { label: 'Диапазон дат', value: 'custom' },
  { label: 'Всё время', value: 'all' },
];

const REFRESH_INTERVAL_OPTIONS = [
  { label: '15 с', value: 15000 },
  { label: '30 с', value: 30000 },
  { label: '1 мин', value: 60000 },
  { label: '3 мин', value: 180000 },
  { label: '5 мин', value: 300000 },
];

interface AnalyticsHeaderProps {
  selectedNodeIds: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  timePeriod: string;
  onTimePeriodChange: (value: string) => void;
  refreshInterval: number;
  onRefreshIntervalChange: (value: number) => void;
  customDateRange: [Dayjs | null, Dayjs | null] | null;
  onCustomDateRangeChange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  onRefresh: () => void;
  showThreshold: boolean;
  onShowThresholdChange: (checked: boolean) => void;
  chartData: ChartGroup[];
  activeTab: MetricType;
}

export const AnalyticsHeader: FC<AnalyticsHeaderProps> = ({
  selectedNodeIds,
  onChange,
  options,
  timePeriod,
  onTimePeriodChange,
  refreshInterval,
  onRefreshIntervalChange,
  customDateRange,
  onCustomDateRangeChange,
  onRefresh,
  showThreshold,
  onShowThresholdChange,
  chartData,
  activeTab,
}) => {
  return (
    <Card size="small" className={styles.headerCard}>
      <Flex justify="space-between" align="center" wrap="wrap" gap="16px">
        <div>
          <Typography.Title level={5} className={styles.titleText}>
            Исторические метрики
            <Tag color="processing" variant="filled">
              Обновление: {formatInterval(refreshInterval)}
            </Tag>
          </Typography.Title>
          <p className={styles.descText}>
            Мониторинг производительности и трафика в реальном времени.
          </p>
        </div>

        <Space size="middle" className={styles.spaceWrap}>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            title="Обновить данные сейчас"
            className={styles.reloadBtn}
          >
            Обновить
          </Button>

          <span className={styles.labelText}>Порог:</span>
          <Switch
            checked={showThreshold}
            onChange={onShowThresholdChange}
            checkedChildren="Вкл"
            unCheckedChildren="Выкл"
          />

          <span className={styles.labelText}>Обновление:</span>
          <Select
            value={refreshInterval}
            onChange={onRefreshIntervalChange}
            className={styles.updateSelect}
            options={REFRESH_INTERVAL_OPTIONS}
          />
          <span className={styles.labelText}>Период:</span>
          <Select
            value={timePeriod}
            onChange={onTimePeriodChange}
            className={styles.periodSelect}
            options={TIME_OPTIONS}
          />
          {timePeriod === 'custom' && (
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={customDateRange}
              onChange={(dates) => {
                onCustomDateRangeChange(dates ? [dates[0], dates[1]] : null);
              }}
              placeholder={['Начало', 'Конец']}
              className={styles.datePicker}
            />
          )}
          <span className={styles.labelText}>Устройства:</span>
          <Select
            mode="multiple"
            placeholder="Все активные устройства"
            className={styles.devicesSelect}
            value={selectedNodeIds}
            onChange={onChange}
            allowClear
            maxTagCount="responsive"
            options={options}
          />

          <AnalyticsExportButton chartData={chartData} activeTab={activeTab} />
        </Space>
      </Flex>
    </Card>
  );
};
