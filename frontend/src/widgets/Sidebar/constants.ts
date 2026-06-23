import { Activity, type LucideIcon, TrendingUp } from 'lucide-react';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'topology', path: '/', label: 'Топология', icon: Activity },
  { id: 'analytics', path: '/analytics', label: 'Аналитика', icon: TrendingUp },
] as const;
