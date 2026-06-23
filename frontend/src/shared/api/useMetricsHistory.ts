import { useCallback, useEffect, useRef, useState } from 'react';
import { type MetricsHistory, registerWsCallback, sendWsMessage } from './topologyApi';

/**
 * Хук для получения и авто-обновления истории метрик устройств.
 * Запрашивает историю с заданной частотой (intervalMs) и обновляется при каждом ответе сервера.
 */
export const useMetricsHistory = ({
  nodeId,
  intervalMs = 30000,
}: {
  nodeId?: string;
  intervalMs?: number;
}) => {
  const [history, setHistory] = useState<MetricsHistory>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestHistory = useCallback(() => {
    sendWsMessage('get-metrics-history', nodeId ? { nodeId } : {});
  }, [nodeId]);

  useEffect(() => {
    // Немедленный первый запрос
    requestHistory();

    // Авто-обновление каждые intervalMs миллисекунд
    intervalRef.current = setInterval(requestHistory, intervalMs);

    // Подписываемся на ответ 'metrics-history'
    const unregister = registerWsCallback((msg) => {
      if (msg.type === 'metrics-history') {
        setHistory(msg.payload as MetricsHistory);
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      unregister();
    };
  }, [requestHistory, intervalMs]);

  return { history, refresh: requestHistory };
};
