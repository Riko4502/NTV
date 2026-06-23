import { useEffect, useState } from 'react';
import { useDeleteNodeMutation, usePingNodeMutation, useRebootNodeMutation } from '@/shared/api';
import type { Status } from '@/shared/libs';

export const useDeviceActions = (id: string, status: Status) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [pingHistory, setPingHistory] = useState<number[]>([]);

  const [pingNode] = usePingNodeMutation();
  const [rebootNode] = useRebootNodeMutation();
  const [deleteNode] = useDeleteNodeMutation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset state when active node changes
  useEffect(() => {
    setPingLatency(null);
    setPingHistory([]);
  }, [id]);

  const handlePing = async () => {
    if (status === 'offline') return;

    setIsPinging(true);
    setPingLatency(null);

    try {
      const response = await pingNode({ nodeId: id }).unwrap();
      const latency = response.latency;
      setPingLatency(latency);
      setPingHistory((prev) => [...prev, latency].slice(-8));
    } catch (_) {
      setPingLatency(-1);
      setPingHistory((prev) => [...prev, -1].slice(-8));
    } finally {
      setIsPinging(false);
    }
  };

  const handleReboot = async () => {
    try {
      await rebootNode({ nodeId: id }).unwrap();
    } catch (err) {
      console.error('Failed to reboot node:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNode({ nodeId: id }).unwrap();
    } catch (err) {
      console.error('Failed to delete node:', err);
    }
  };

  return { isPinging, pingLatency, pingHistory, handlePing, handleReboot, handleDelete };
};
