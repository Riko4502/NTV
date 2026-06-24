import type { RouteKey } from './types';

export const paths: Record<RouteKey, string> = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  analytics: '/analytics',
  devices: '/devices',
  alerts: '/alerts',
  settings: '/settings',
  reports: '/reports',
  firewall: '/devices/:id/firewall',
  forbidden: '/403',
  notFound: '/404',
};
