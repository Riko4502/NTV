import { useEffect, useState } from 'react';
import type { Status } from '@/shared/libs';

interface UseDeviceTelemetryHistoryProps {
  cpu: number;
  ram: number;
  temp: number;
  status: Status;
}

export const useDeviceTelemetryHistory = ({
  cpu,
  ram,
  temp,
  status,
}: UseDeviceTelemetryHistoryProps) => {
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [ramHistory, setRamHistory] = useState<number[]>([]);
  const [tempHistory, setTempHistory] = useState<number[]>([]);

  useEffect(() => {
    if (status === 'offline') return;

    setCpuHistory((prev) => {
      const next = [...prev, cpu];
      return next.slice(-15);
    });
    setRamHistory((prev) => {
      const next = [...prev, ram];
      return next.slice(-15);
    });
    setTempHistory((prev) => {
      const next = [...prev, temp];
      return next.slice(-15);
    });
  }, [cpu, ram, temp, status]);

  return { cpuHistory, ramHistory, tempHistory };
};
