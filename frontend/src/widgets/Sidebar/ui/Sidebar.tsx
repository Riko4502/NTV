import { Button, Tooltip } from 'antd';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { type FC, useState } from 'react';
import { useLogoutMutation } from '@/shared/api';
import { NAV_ITEMS } from '../constants';
import { SidebarItem } from './components';
import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = NAV_ITEMS.map((item) => (
    <SidebarItem key={item.id} {...item} collapsed={collapsed} />
  ));

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.navSection}>
        {!collapsed && <span className={styles.sectionTitle}>Навигация</span>}

        {navLinks}
      </div>

      <div className={styles.logoutSection}>
        <Tooltip title="Выйти из системы" placement="right">
          <Button
            type="text"
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            className={styles.logoutButton}
            danger
            block={!collapsed}
          >
            {!collapsed && <span className={styles.logoutText}>Выйти</span>}
          </Button>
        </Tooltip>
      </div>

      <div className={styles.collapseToggleWrapper}>
        <Tooltip title={collapsed ? 'Развернуть меню' : 'Свернуть меню'} placement="right">
          <Button
            type="text"
            icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
          />
        </Tooltip>
      </div>
    </aside>
  );
};
