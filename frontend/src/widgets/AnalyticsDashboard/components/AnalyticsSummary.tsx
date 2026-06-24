import { Card, Col, Row } from 'antd';
import { Activity, ArrowDown, ArrowUp } from 'lucide-react';

import type { CSSProperties, FC } from 'react';
import { getDateTimeString } from '@/shared/libs/utils';
import styles from '../AnalyticsDashboard.module.scss';
import { useAnalyticsSummary } from '../hooks/useAnalyticsSummary';
import type { MetricType } from '../types';

interface ChartItem {
  key: Date | number;
  data: number;
}

interface ChartGroup {
  key: string;
  data: ChartItem[];
}

interface AnalyticsSummaryProps {
  chartData: ChartGroup[];
  activeTab: MetricType;
}

const getMetricSuffix = (type: MetricType): string => {
  if (type === 'cpu' || type === 'ram') return '%';
  if (type === 'temp') return '°C';
  return ' Mbps';
};

export const AnalyticsSummary: FC<AnalyticsSummaryProps> = ({ chartData, activeTab }) => {
  const summary = useAnalyticsSummary(chartData);

  if (!summary) return null;

  const suffix = getMetricSuffix(activeTab);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card size="small" className={`${styles.summaryCard} ${styles.minCard}`}>
          <div className={styles.flexContainer}>
            <div
              className={styles.iconWrapper}
              style={
                {
                  '--icon-bg-color': 'rgba(82, 196, 26, 0.1)',
                  '--icon-color': '#52c41a',
                } as CSSProperties
              }
            >
              <ArrowDown size={20} />
            </div>
            <div className={styles.flex1}>
              <span className={styles.metaLabel}>Минимум</span>
              <div className={styles.statValue}>
                {summary.min.value}
                <span className={styles.suffix}>{suffix}</span>
              </div>
              <div className={styles.subText}>
                {summary.min.device} • {getDateTimeString(summary.min.timestamp)}
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" className={`${styles.summaryCard} ${styles.maxCard}`}>
          <div className={styles.flexContainer}>
            <div
              className={styles.iconWrapper}
              style={
                {
                  '--icon-bg-color': 'rgba(255, 77, 79, 0.1)',
                  '--icon-color': '#ff4d4f',
                } as CSSProperties
              }
            >
              <ArrowUp size={20} />
            </div>
            <div className={styles.flex1}>
              <span className={styles.metaLabel}>Максимум</span>
              <div className={styles.statValue}>
                {summary.max.value}
                <span className={styles.suffix}>{suffix}</span>
              </div>
              <div className={styles.subText}>
                {summary.max.device} • {getDateTimeString(summary.max.timestamp)}
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card size="small" className={`${styles.summaryCard} ${styles.avgCard}`}>
          <div className={styles.flexContainer}>
            <div
              className={styles.iconWrapper}
              style={
                {
                  '--icon-bg-color': 'rgba(22, 119, 255, 0.1)',
                  '--icon-color': '#1677ff',
                } as CSSProperties
              }
            >
              <Activity size={20} />
            </div>
            <div className={styles.flex1}>
              <span className={styles.metaLabel}>Среднее значение</span>
              <div className={styles.statValue}>
                {summary.avg}
                <span className={styles.suffix}>{suffix}</span>
              </div>
              <div className={styles.subText}>За выбранный временной интервал</div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
