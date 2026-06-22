import { theme as antdTheme, ConfigProvider, Layout } from 'antd';
import type React from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { DashboardPage } from '@/pages/DashboardPage/ui/DashboardPage';
import { HeaderStats } from '@/widgets/HeaderStats';
import { store, useAppSelector } from './providers/store';
import './styles/index.scss';

const AppContent: React.FC = () => {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 8,
          fontFamily: 'var(--font-sans)',
        },
        components: {
          Card: {
            colorBgContainer: 'var(--bg-card)',
            colorBorderSecondary: 'var(--border-color)',
          },
          Input: {
            colorBgContainer: 'var(--input-bg)',
            colorBorder: 'var(--border-color)',
          },
        },
      }}
    >
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

        <DashboardPage />
      </Layout>
    </ConfigProvider>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
