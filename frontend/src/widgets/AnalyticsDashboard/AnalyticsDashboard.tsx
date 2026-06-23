import { Flex } from 'antd';
import type { Dayjs } from 'dayjs';

import { type FC, useCallback, useMemo, useState } from 'react';
import { useStreamTopologyQuery } from '@/shared/api';
import { useMetricsHistory } from '@/shared/api/useMetricsHistory';
import { Spinner } from '@/shared/ui';
import { AnalyticsChart } from './components/AnalyticsChart';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { DeviceMetricsGrid } from './components/DeviceMetricsGrid';
import { palette } from './constants';
import type { MetricType } from './types';
import { filterNodeHistoryPoints, getCutoffTimes } from './utils';

interface AnalyticsDashboardProps {
  initialNodeId?: string;
}

export const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ initialNodeId }) => {
  const { data: topologyData, isLoading } = useStreamTopologyQuery();

  const nodes = useMemo(() => topologyData?.nodes || [], [topologyData]);

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>(() => {
    if (initialNodeId) return [initialNodeId];
    return [];
  });

  const [activeTab, setActiveTab] = useState<MetricType>('cpu');
  const [timePeriod, setTimePeriod] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000);
  const [showThreshold, setShowThreshold] = useState<boolean>(false);

  const { history: metricsHistory, refresh: refreshMetrics } = useMetricsHistory({
    intervalMs: refreshInterval,
  });

  const availableNodes = useMemo(() => {
    return nodes.filter((n) => n.status !== 'offline');
  }, [nodes]);

  const nodesToPlot = useMemo(() => {
    return availableNodes.filter((n) => selectedNodeIds.includes(n.id));
  }, [availableNodes, selectedNodeIds]);

  const chartData = useMemo(() => {
    if (!metricsHistory || !Object.keys(metricsHistory).length) {
      return [];
    }

    const { cutoffMs, endCutoffMs } = getCutoffTimes(timePeriod, customDateRange);

    const seriesList = [];
    for (let i = 0; i < nodesToPlot.length; i++) {
      const node = nodesToPlot[i];
      const history = metricsHistory[node.id] || [];
      const points = filterNodeHistoryPoints(history, cutoffMs, activeTab, endCutoffMs);

      if (points.length >= 2) {
        seriesList.push({
          key: node.label,
          data: points,
        });
      }
    }
    return seriesList;
  }, [metricsHistory, nodesToPlot, activeTab, timePeriod, customDateRange]);

  // Colors mapping for charts to give a harmonious aesthetic
  const chartColorScheme = useMemo(() => {
    const colors = [];
    for (let idx = 0; idx < nodesToPlot.length; idx++) {
      colors.push(palette[idx % palette.length]);
    }
    return colors;
  }, [nodesToPlot]);

  const handleSelectAll = useCallback((value: string[]) => {
    setSelectedNodeIds(value);
  }, []);

  const nodesOptions = useMemo(() => {
    return availableNodes.map((node) => ({
      label: `${node.label} (${node.ip})`,
      value: node.id,
    }));
  }, [availableNodes]);

  const handleTabChange = useCallback((key: MetricType) => {
    setActiveTab(key);
  }, []);

  if (isLoading || !topologyData || !topologyData.nodes.length) {
    return <Spinner loading={true} tip="Загрузка данных аналитики..." />;
  }

  return (
    <Flex
      vertical
      gap="20px"
      style={{
        padding: '24px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <AnalyticsHeader
        selectedNodeIds={selectedNodeIds}
        onChange={handleSelectAll}
        options={nodesOptions}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={setRefreshInterval}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
        onRefresh={refreshMetrics}
        showThreshold={showThreshold}
        onShowThresholdChange={setShowThreshold}
        chartData={chartData}
        activeTab={activeTab}
      />

      <AnalyticsSummary chartData={chartData} activeTab={activeTab} />

      <AnalyticsChart
        activeTab={activeTab}
        onTabChange={handleTabChange}
        chartData={chartData}
        chartColorScheme={chartColorScheme}
        timePeriod={timePeriod}
        hasSelectedDevices={selectedNodeIds.length > 0}
        showThreshold={showThreshold}
      />

      <DeviceMetricsGrid
        nodesToPlot={nodesToPlot}
        chartColorScheme={chartColorScheme}
        metricsHistory={metricsHistory}
      />
    </Flex>
  );
};
