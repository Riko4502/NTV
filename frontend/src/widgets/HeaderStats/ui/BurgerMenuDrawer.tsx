import { BulbFilled, BulbOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Flex, Input } from 'antd';
import { Bell } from 'lucide-react';
import type { CSSProperties, FC } from 'react';
import { NavLink } from 'react-router-dom';
import { setSearchQuery, toggleAlerts, toggleTheme, useAppDispatch } from '@/app/providers/store';
import type { Theme } from '@/shared/libs';
import { NAV_ITEMS } from '@/widgets/Sidebar/constants';
import styles from './BurgerMenuDrawer.module.scss';

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
      <Flex vertical gap="12px">
        <span className={styles.sectionTitle}>Навигация</span>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.drawerNavLink} ${isActive ? styles.drawerNavLinkActive : ''}`
            }
          >
            <item.icon size={16} className={styles.navIcon} />
            {item.label}
          </NavLink>
        ))}
      </Flex>

      <Flex vertical gap="8px" className={styles.mobileOnly}>
        <span className={styles.sectionTitle}>Поиск</span>
        <Input
          placeholder="Поиск устройств..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
          allowClear
          className={styles.searchInput}
        />
      </Flex>

      <Flex vertical gap="12px" className={styles.mobileOnly}>
        <span className={styles.sectionTitle}>Статус сети</span>
        <div className={styles.gridStats}>
          <Card size="small" className={styles.statCard}>
            <span className={styles.cardLabel}>Здоровье</span>
            <strong
              className={styles.cardValue}
              style={
                {
                  '--value-color':
                    stats.health > 80 ? 'var(--color-success)' : 'var(--color-warning)',
                } as CSSProperties
              }
            >
              {stats.health}%
            </strong>
          </Card>
          <Card size="small" className={styles.statCard}>
            <span className={styles.cardLabel}>Трафик</span>
            <strong className={styles.cardValue}>{stats.trafficGbps} Gbps</strong>
          </Card>
        </div>
      </Flex>

      <Flex vertical gap="12px" className={`${styles.mobileOnly} ${styles.actionsWrapper}`}>
        <span className={styles.sectionTitle}>Панель управления</span>
        <Button
          type="default"
          icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
          onClick={() => dispatch(toggleTheme())}
          className={styles.actionBtn}
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
          className={styles.actionBtn}
        >
          Лог событий ({stats.activeIncidents})
        </Button>
      </Flex>
    </Drawer>
  );
};
