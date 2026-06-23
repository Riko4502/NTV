import { useState } from 'react';
import { registerWsCallback, sendWsMessage } from '@/shared/api';
import type { Status } from '@/shared/libs';

export const useDeviceActions = (id: string, status: Status) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

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
        setPingLatency(Math.round(endTime - startTime));
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
        }
        return false;
      });
    }, 4000);
  };

  const handleReboot = () => {
    sendWsMessage('reboot-node', { nodeId: id });
  };

  return { isPinging, pingLatency, handlePing, handleReboot };
};
