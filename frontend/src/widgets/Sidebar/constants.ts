import {
  FileText,
  type LucideIcon,
  Map as MapIcon,
  Server,
  Settings,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'topology', path: '/', label: 'Топология', icon: MapIcon },
  { id: 'analytics', path: '/analytics', label: 'Аналитика', icon: TrendingUp },
  { id: 'devices', path: '/devices', label: 'Устройства', icon: Server },
  { id: 'alerts', path: '/alerts', label: 'Инциденты', icon: ShieldAlert },
  { id: 'reports', path: '/reports', label: 'Отчеты', icon: FileText },
  { id: 'settings', path: '/settings', label: 'Настройки', icon: Settings },
] as const;
