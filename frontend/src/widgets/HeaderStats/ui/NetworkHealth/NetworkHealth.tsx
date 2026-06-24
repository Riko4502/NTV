import { Space } from 'antd';
import { Activity, AlertTriangle, Server, TrendingUp } from 'lucide-react';
import { type CSSProperties, type FC, useMemo } from 'react';
import { useStreamTopologyQuery } from '@/shared/api';
import { getHealthColor } from '@/shared/libs';
import { KpiCard } from './components/KpiCard';
import styles from './NetworkHealth.module.scss';

export const NetworkHealth: FC = () => {
  const { data } = useStreamTopologyQuery();

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];
  const alerts = data?.alerts || [];

  // Calculate live NOC stats
  const stats = useMemo(() => {
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

  const healthColor = getHealthColor(stats.health);

  const activeAlertsColor = stats.activeIncidents ? 'var(--color-error)' : 'var(--text-secondary)';

  return (
    <Space size={8}>
      <KpiCard
        title="Здоровье сети"
        value={stats.health}
        valueColor={healthColor}
        prefix={
          <Activity
            size={12}
            className={styles.kpiIcon}
            style={{ '--icon-color': healthColor } as CSSProperties}
          />
        }
        suffix={<span className={styles.suffix}>%</span>}
      />

      <KpiCard
        title="Общий трафик"
        value={stats.trafficGbps}
        valueColor="var(--color-success)"
        prefix={
          <TrendingUp
            size={12}
            className={styles.kpiIcon}
            style={{ '--icon-color': 'var(--color-success)' } as CSSProperties}
          />
        }
        suffix={<span className={styles.suffix}>Gbps</span>}
      />

      <KpiCard
        title="Активные сбои"
        value={stats.activeIncidents}
        valueColor={activeAlertsColor}
        prefix={
          <AlertTriangle
            size={12}
            className={styles.kpiIcon}
            style={{ '--icon-color': activeAlertsColor } as CSSProperties}
          />
        }
      />

      <KpiCard
        title="Устройства"
        value={stats.onlineRatio}
        valueColor="var(--color-primary)"
        prefix={
          <Server
            size={12}
            className={styles.kpiIcon}
            style={{ '--icon-color': 'var(--color-primary)' } as CSSProperties}
          />
        }
      />
    </Space>
  );
};
