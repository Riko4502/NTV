import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Flex, Select, Space, Switch, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';

import type { FC } from 'react';
import { formatInterval } from '@/shared/libs';
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
    <Card
      size="small"
      style={{
        background: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap="16px">
        <div>
          <Typography.Title
            level={5}
            style={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Исторические метрики
            <Tag color="processing" variant="filled">
              Обновление: {formatInterval(refreshInterval)}
            </Tag>
          </Typography.Title>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Мониторинг производительности и трафика в реальном времени.
          </p>
        </div>

        <Space size="middle" style={{ flexWrap: 'wrap' }}>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            title="Обновить данные сейчас"
            style={{ borderRadius: '6px' }}
          >
            Обновить
          </Button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Порог:</span>
          <Switch
            checked={showThreshold}
            onChange={onShowThresholdChange}
            checkedChildren="Вкл"
            unCheckedChildren="Выкл"
          />

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Обновление:</span>
          <Select
            value={refreshInterval}
            onChange={onRefreshIntervalChange}
            style={{ width: '90px' }}
            options={REFRESH_INTERVAL_OPTIONS}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Период:</span>
          <Select
            value={timePeriod}
            onChange={onTimePeriodChange}
            style={{ width: '170px' }}
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
              style={{ width: '320px' }}
            />
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Устройства:</span>
          <Select
            mode="multiple"
            placeholder="Все активные устройства"
            style={{ minWidth: '240px', maxWidth: '300px' }}
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
