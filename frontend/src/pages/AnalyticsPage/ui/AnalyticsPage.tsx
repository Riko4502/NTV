import { Layout } from 'antd';

import type { FC } from 'react';
import { AnalyticsDashboard } from '@/widgets/AnalyticsDashboard';
import styles from './AnalyticsPage.module.scss';

export const AnalyticsPage: FC = () => {
  return (
    <Layout className={styles.pageLayout}>
      <Layout.Content className={styles.contentWrapper}>
        <AnalyticsDashboard />
      </Layout.Content>
    </Layout>
  );
};

export default AnalyticsPage;
