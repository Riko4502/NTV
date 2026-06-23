import { Layout } from 'antd';

import type { FC } from 'react';
import { AnalyticsDashboard } from '@/widgets/AnalyticsDashboard';

export const AnalyticsPage: FC = () => {
  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Layout.Content
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnalyticsDashboard />
      </Layout.Content>
    </Layout>
  );
};

export default AnalyticsPage;
