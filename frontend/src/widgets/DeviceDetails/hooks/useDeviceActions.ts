import { useEffect, useState } from 'react';
import { registerWsCallback, sendWsMessage } from '@/shared/api';
import type { Status } from '@/shared/libs';

export const useDeviceActions = (id: string, status: Status) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [pingHistory, setPingHistory] = useState<number[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset state when active node changes
  useEffect(() => {
    setPingLatency(null);
    setPingHistory([]);
  }, [id]);

  const handlePing = () => {
    if (status === 'offline') return;

    setIsPinging(true);
    setPingLatency(null);

    const startTime = performance.now();
    const correlationId = `${id}-${Date.now()}`;

    sendWsMessage('ping-node', { nodeId: id, timestamp: correlationId });

    const cleanup = registerWsCallback((msg) => {
      const payload = msg.payload as { timestamp?: string } | undefined;
      if (msg.type === 'pong' && payload?.timestamp === correlationId) {
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        setPingLatency(latency);
        setPingHistory((prev) => [...prev, latency].slice(-8));
        setIsPinging(false);
        cleanup();
      }
    });

    setTimeout(() => {
      cleanup();
      setIsPinging((pinging) => {
        if (pinging) {
          setIsPinging(false);
          setPingLatency(-1);
          setPingHistory((prev) => [...prev, -1].slice(-8));
        }
        return false;
      });
    }, 4000);
  };

  const handleReboot = () => {
    sendWsMessage('reboot-node', { nodeId: id });
  };

  return { isPinging, pingLatency, pingHistory, handlePing, handleReboot };
};
