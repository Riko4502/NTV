import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { paths } from './paths';

export const routes: RouteObject[] = [
  {
    path: paths.root,
    lazy: async () => {
      const { AppContent } = await import('@/app/ui/AppContent');
      return {
        Component: AppContent,
      };
    },
    children: [
      {
        index: true,
        handle: { crumb: 'Рабочий стол' },
        lazy: async () => {
          const { DashboardPage } = await import('@/pages/DashboardPage/ui/DashboardPage');
          return { Component: DashboardPage };
        },
      },
      {
        path: paths.analytics,
        handle: { crumb: 'Аналитика' },
        lazy: async () => {
          const { AnalyticsPage } = await import('@/pages/AnalyticsPage/ui/AnalyticsPage');
          return { Component: AnalyticsPage };
        },
      },
      {
        path: paths.devices,
        handle: { crumb: 'Устройства' },
        lazy: async () => {
          const { DevicesPage } = await import('@/pages/DevicesPage/ui/DevicesPage');
          return { Component: DevicesPage };
        },
      },
      {
        path: paths.alerts,
        handle: { crumb: 'Тревоги' },
        lazy: async () => {
          const { AlertsPage } = await import('@/pages/AlertsPage/ui/AlertsPage');
          return { Component: AlertsPage };
        },
      },
      {
        path: paths.settings,
        handle: { crumb: 'Настройки' },
        lazy: async () => {
          const { SettingsPage } = await import('@/pages/SettingsPage/ui/SettingsPage');
          return { Component: SettingsPage };
        },
      },
      {
        path: paths.reports,
        handle: { crumb: 'Отчеты' },
        lazy: async () => {
          const { ReportsPage } = await import('@/pages/ReportsPage/ui/ReportsPage');
          return { Component: ReportsPage };
        },
      },
    ],
  },
];

export const createRouter = (basename?: string) =>
  createBrowserRouter(routes, {
    basename,
    future: {
      v7_normalizeFormMethod: true,
    },
  });
