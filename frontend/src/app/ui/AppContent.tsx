import { ConfigProvider, Drawer, Flex, Layout, Spin } from 'antd';
import { type FC, useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { AlertsPanel } from '@/widgets/AlertsPanel';
import { HeaderStats } from '@/widgets/HeaderStats';
import { Sidebar } from '@/widgets/Sidebar';
import { toggleAlerts, useAppDispatch, useAppSelector } from '../providers/store';
import { getAntdThemeConfig } from '../styles/themeConfig';
import styles from './AppContent.module.scss';

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
      <Layout className={styles.layoutRoot}>
        <HeaderStats />

        <Layout className={styles.layoutInner}>
          <Sidebar />
          <Layout.Content className={styles.content}>
            {isLoading ? (
              <Flex justify="center" align="center" style={{ height: '100%' }}>
                <Spin size="large" description="Загрузка..." />
              </Flex>
            ) : (
              <Outlet />
            )}
          </Layout.Content>
        </Layout>

        <Drawer
          placement="left"
          title="Лог событий и сбоев"
          mask={false}
          onClose={() => dispatch(toggleAlerts())}
          open={isAlertsOpen}
          size={480}
          className={styles.drawer}
        >
          <AlertsPanel />
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default AppContent;
