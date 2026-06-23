import { useGetMetricsHistoryQuery } from './topologyApi';

/**
 * Хук для получения и авто-обновления истории метрик устройств.
 * Запрашивает историю с заданной частотой (intervalMs).
 */
export const useMetricsHistory = ({
  nodeId,
  intervalMs = 30000,
}: {
  nodeId?: string;
  intervalMs?: number;
} = {}) => {
  const { data: history = {}, refetch } = useGetMetricsHistoryQuery(nodeId ? { nodeId } : {}, {
    pollingInterval: intervalMs,
  });

  return { history, refresh: refetch };
};
