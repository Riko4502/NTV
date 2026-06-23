import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, Layout, Tooltip } from 'antd';
import { Activity, Bell, Menu } from 'lucide-react';

import { type FC, useState } from 'react';
import { toggleAlerts, toggleTheme, useAppDispatch, useAppSelector } from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import styles from './HeaderStats.module.scss';
import { useNocStats } from './hooks/useNocStats';
import { BurgerMenuDrawer } from './ui/BurgerMenuDrawer';
import { NetworkHealth } from './ui/NetworkHealth';

export const HeaderStats: FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const theme = useAppSelector((state) => state.ui.theme);
  const isAlertsOpen = useAppSelector((state) => state.ui.isAlertsOpen);
  const { data } = useStreamTopologyQuery();

  const [menuOpen, setMenuOpen] = useState(false);

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];
  const alerts = data?.alerts || [];

  const stats = useNocStats(nodes, edges, alerts);

  return (
    <Layout.Header className={styles.header}>
      <Flex align="center" gap="10px">
        <Button
          type="text"
          icon={<Menu size={20} />}
          onClick={() => setMenuOpen(true)}
          className={styles.burgerButton}
        />
        <Flex align="center" justify="center" className={styles.logoWrapper}>
          <Activity size={20} />
        </Flex>
        <Flex vertical>
          <span className={styles.logoText}>TOPOLOGY MONITOR</span>
        </Flex>
      </Flex>

      <Flex className="kpi-container" justify="flex-end" align="center" gap="10px">
        <div className={styles.networkHealthWrapper}>
          <NetworkHealth />
        </div>

        <div className={styles.divider} />

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

      {/* Responsive Burger Drawer */}
      <BurgerMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        searchQuery={searchQuery}
        theme={theme}
        stats={stats}
      />
    </Layout.Header>
  );
};

export default HeaderStats;
