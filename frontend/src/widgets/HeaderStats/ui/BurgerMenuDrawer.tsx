import { BulbFilled, BulbOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Flex, Input } from 'antd';
import { Activity, Bell, TrendingUp } from 'lucide-react';

import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { setSearchQuery, toggleAlerts, toggleTheme, useAppDispatch } from '@/app/providers/store';
import type { Theme } from '@/shared/libs';
import styles from '../HeaderStats.module.scss';

interface BurgerMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  theme: Theme;
  stats: {
    health: number;
    trafficGbps: string;
    activeIncidents: number;
  };
}

export const BurgerMenuDrawer: FC<BurgerMenuDrawerProps> = ({
  open,
  onClose,
  searchQuery,
  theme,
  stats,
}) => {
  const dispatch = useAppDispatch();

  return (
    <Drawer
      title={
        <Flex align="center" gap="10px">
          <Flex align="center" justify="center" className={styles.logoWrapper}>
            <Activity size={20} />
          </Flex>
          <span className={styles.logoText}>TOPOLOGY MONITOR</span>
        </Flex>
      }
      placement="left"
      onClose={onClose}
      open={open}
      styles={{
        body: {
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'var(--bg-panel)',
        },
        header: {
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-color)',
        },
      }}
      size={280}
    >
      {/* Navigation links in drawer */}
      <Flex vertical gap="12px">
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Навигация
        </span>
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            `${styles.drawerNavLink} ${isActive ? styles.drawerNavLinkActive : ''}`
          }
        >
          <Activity size={16} style={{ marginRight: '8px' }} />
          Топология
        </NavLink>
        <NavLink
          to="/analytics"
          onClick={onClose}
          className={({ isActive }) =>
            `${styles.drawerNavLink} ${isActive ? styles.drawerNavLinkActive : ''}`
          }
        >
          <TrendingUp size={16} style={{ marginRight: '8px' }} />
          Аналитика
        </NavLink>
      </Flex>

      {/* Mobile Search */}
      <Flex vertical gap="8px" className={styles.mobileOnly}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Поиск
        </span>
        <Input
          placeholder="Поиск устройств..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
          allowClear
          className={styles.searchInput}
        />
      </Flex>

      {/* Mobile KPIs */}
      <Flex vertical gap="12px" className={styles.mobileOnly}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Статус сети
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Card
            size="small"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Здоровье
            </span>
            <strong
              style={{
                fontSize: '1rem',
                color: stats.health > 80 ? 'var(--color-success)' : 'var(--color-warning)',
              }}
            >
              {stats.health}%
            </strong>
          </Card>
          <Card
            size="small"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Трафик
            </span>
            <strong style={{ fontSize: '1rem' }}>{stats.trafficGbps} Gbps</strong>
          </Card>
        </div>
      </Flex>

      {/* Mobile quick actions */}
      <Flex vertical gap="12px" style={{ marginTop: 'auto' }} className={styles.mobileOnly}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Панель управления
        </span>
        <Button
          type="default"
          icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
          onClick={() => dispatch(toggleTheme())}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Тема: {theme === 'dark' ? 'Темная' : 'Светлая'}
        </Button>

        <Button
          type="default"
          icon={<Bell size={16} />}
          onClick={() => {
            dispatch(toggleAlerts());
            onClose();
          }}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Лог событий ({stats.activeIncidents})
        </Button>
      </Flex>
    </Drawer>
  );
};
