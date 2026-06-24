import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RouteErrorFallback } from '@/shared/ui';
import { OnlyPublic } from './OnlyPublic';
import { paths } from './paths';
import { RequireAuth } from './RequireAuth';

export const routes: RouteObject[] = [
  {
    path: paths.login,
    lazy: async () => {
      const { LoginPage } = await import('@/pages/LoginPage/ui/LoginPage');
      return {
        Component: () => (
          <OnlyPublic>
            <LoginPage />
          </OnlyPublic>
        ),
      };
    },
  },
  {
    path: paths.root,
    errorElement: <RouteErrorFallback />,
    lazy: async () => {
      const { AppContent } = await import('@/app/ui/AppContent');
      return {
        Component: () => (
          <RequireAuth>
            <AppContent />
          </RequireAuth>
        ),
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
      {
        path: paths.firewall,
        handle: { crumb: 'Межсетевой экран' },
        lazy: async () => {
          const { FirewallPage } = await import('@/pages/FirewallPage/ui/FirewallPage');
          return { Component: FirewallPage };
        },
      },
      {
        path: paths.forbidden,
        handle: { crumb: 'Доступ ограничен' },
        lazy: async () => {
          const { ErrorPage } = await import('@/pages/ErrorPage/ui/ErrorPage');
          return { Component: () => <ErrorPage code="403" /> };
        },
      },
      {
        path: paths.notFound,
        handle: { crumb: 'Страница не найдена' },
        lazy: async () => {
          const { ErrorPage } = await import('@/pages/ErrorPage/ui/ErrorPage');
          return { Component: () => <ErrorPage code="404" /> };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { ErrorPage } = await import('@/pages/ErrorPage/ui/ErrorPage');
          return { Component: () => <ErrorPage code="404" /> };
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
