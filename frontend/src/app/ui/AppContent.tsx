import { ConfigProvider, Drawer, Layout } from 'antd';
import { type FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnalyticsPage } from '@/pages/AnalyticsPage/ui/AnalyticsPage';
import { DashboardPage } from '@/pages/DashboardPage/ui/DashboardPage';
import { AlertsPanel } from '@/widgets/AlertsPanel';
import { HeaderStats } from '@/widgets/HeaderStats';
import { toggleAlerts, useAppDispatch, useAppSelector } from '../providers/store';
import { getAntdThemeConfig } from '../styles/themeConfig';

export const AppContent: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const isAlertsOpen = useAppSelector((state) => state.ui.isAlertsOpen);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ConfigProvider theme={getAntdThemeConfig(theme)}>
      <Layout
        style={{
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <HeaderStats />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>

        <Drawer
          placement="left"
          title="Лог событий и сбоев"
          mask={false}
          onClose={() => dispatch(toggleAlerts())}
          open={isAlertsOpen}
          size={480}
          styles={{ body: { padding: 0 } }}
          style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border-color)' }}
        >
          <AlertsPanel />
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default AppContent;
