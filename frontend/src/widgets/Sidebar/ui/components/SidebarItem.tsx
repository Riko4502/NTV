import { Tooltip } from 'antd';
import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavItem } from '../../constants';
import styles from '../Sidebar.module.scss';

interface SidebarItemProps extends NavItem {
  collapsed: boolean;
}

export const SidebarItem: FC<SidebarItemProps> = ({ label, path, icon: Icon, collapsed }) => {
  return (
    <Tooltip title={label} placement="right">
      <NavLink
        to={path}
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
      >
        <Icon size={16} className={styles.navIcon} />
        {!collapsed && <span className={styles.navText}>{label}</span>}
      </NavLink>
    </Tooltip>
  );
};
