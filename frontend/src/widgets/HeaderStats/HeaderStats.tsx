import { BulbFilled, BulbOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Input, Layout, Tooltip } from 'antd';
import { Activity, Bell } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import {
  setSearchQuery,
  toggleAlerts,
  toggleTheme,
  useAppDispatch,
  useAppSelector,
} from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import styles from './HeaderStats.module.scss';
import { NetworkHealth } from './ui/NetworkHealth';

export const HeaderStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const theme = useAppSelector((state) => state.ui.theme);
  const isAlertsOpen = useAppSelector((state) => state.ui.isAlertsOpen);
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

  return (
    <Layout.Header className={styles.header}>
      {/* Title block */}
      <Flex align="center" gap="10px">
        <Flex align="center" justify="center" className={styles.logoWrapper}>
          <Activity size={20} />
        </Flex>
        <Flex vertical>
          <span className={styles.logoText}>TOPOLOGY MONITOR</span>
        </Flex>
      </Flex>

      {/* Global search */}
      <div className={styles.searchContainer}>
        <Input
          placeholder="Поиск по устройствам или IP-адресу..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
          allowClear
          className={styles.searchInput}
        />
      </div>

      {/* Real-time stats panel */}
      <Flex className="kpi-container" justify="flex-end" align="center" gap="10px">
        <NetworkHealth />

        <div className={styles.divider} />

        {/* Theme Switcher */}
        <Tooltip
          title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        >
          <Button
            type="text"
            icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
            onClick={() => dispatch(toggleTheme())}
            className={styles.headerButton}
          />
        </Tooltip>

        <Tooltip title={isAlertsOpen ? 'Скрыть лог событий' : 'Открыть лог событий'}>
          <Badge
            count={stats.activeIncidents}
            offset={[-2, 4]}
            className={`${styles.bellBadge} ${stats.activeIncidents ? styles.hasAlerts : ''}`}
          >
            <Button
              type="text"
              icon={
                <Bell size={18} className={stats.activeIncidents ? styles.bellIconAlert : ''} />
              }
              onClick={() => dispatch(toggleAlerts())}
              className={`${styles.bellButton} ${isAlertsOpen ? styles.bellButtonActive : ''}`}
            />
          </Badge>
        </Tooltip>
      </Flex>
    </Layout.Header>
  );
};

export default HeaderStats;
