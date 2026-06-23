import { useMemo } from 'react';
import type { NetworkAlertData } from '@/entities/alert/model/types';
import type { ConnectionEdgeDto } from '@/entities/connection/model/types';
import type { NodeDto } from '@/entities/device/model/types';

export const useNocStats = (
  nodes: NodeDto[],
  edges: ConnectionEdgeDto[],
  alerts: NetworkAlertData[],
) => {
  return useMemo(() => {
    if (nodes.length === 0) {
      return { health: 100, trafficGbps: '0.00', activeIncidents: 0, onlineRatio: '0/0' };
    }

    let totalScore = 0;
    let onlineCount = 0;
    nodes.forEach((node) => {
      if (node.status === 'online') {
        totalScore += 100;
        onlineCount++;
      } else if (node.status === 'warning') {
        totalScore += 70;
        onlineCount++;
      } else if (node.status === 'error') {
        totalScore += 30;
        onlineCount++;
      }
    });

    const health = Math.round(totalScore / nodes.length);

    const totalTrafficMbps = edges.reduce((acc, edge) => {
      return acc + (edge.status !== 'inactive' ? edge.currentUsage : 0);
    }, 0);

    const trafficGbps = (totalTrafficMbps / 1000).toFixed(2);

    const activeIncidents = alerts.filter(
      (a) => !a.acknowledged && (a.severity === 'critical' || a.severity === 'warning'),
    ).length;

    const onlineRatio = `${onlineCount}/${nodes.length}`;

    return { health, trafficGbps, activeIncidents, onlineRatio };
  }, [nodes, edges, alerts]);
};
