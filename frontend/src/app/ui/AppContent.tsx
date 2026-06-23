import { ConfigProvider, Drawer, Layout, Spin } from 'antd';
import { type FC, useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { AlertsPanel } from '@/widgets/AlertsPanel';
import { HeaderStats } from '@/widgets/HeaderStats';
import { Sidebar } from '@/widgets/Sidebar';
import { toggleAlerts, useAppDispatch, useAppSelector } from '../providers/store';
import { getAntdThemeConfig } from '../styles/themeConfig';

export const AppContent: FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const theme = useAppSelector((state) => state.ui.theme);
  const isAlertsOpen = useAppSelector((state) => state.ui.isAlertsOpen);

  const isLoading = navigation.state === 'loading';

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

        <Layout
          style={{ flexDirection: 'row', flex: 1, overflow: 'hidden', background: 'transparent' }}
        >
          <Sidebar />
          <Layout.Content
            style={{ flex: 1, overflow: 'hidden', position: 'relative', background: 'transparent' }}
          >
            {isLoading ? <Spin /> : <Outlet />}
          </Layout.Content>
        </Layout>

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
