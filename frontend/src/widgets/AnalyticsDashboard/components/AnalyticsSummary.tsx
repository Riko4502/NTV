import { Card, Col, Row } from 'antd';
import { Activity, ArrowDown, ArrowUp } from 'lucide-react';

import type { FC } from 'react';
import { getDateTimeString } from '@/shared/libs/utils';
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
        <Card
          size="small"
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid #52c41a',
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(82, 196, 26, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                color: '#52c41a',
              }}
            >
              <ArrowDown size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Минимум</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {summary.min.value}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, marginLeft: '2px' }}>
                  {suffix}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {summary.min.device} • {getDateTimeString(summary.min.timestamp)}
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card
          size="small"
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid #ff4d4f',
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255, 77, 79, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                color: '#ff4d4f',
              }}
            >
              <ArrowUp size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Максимум</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {summary.max.value}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, marginLeft: '2px' }}>
                  {suffix}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {summary.max.device} • {getDateTimeString(summary.max.timestamp)}
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card
          size="small"
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid #1677ff',
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(22, 119, 255, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                color: '#1677ff',
              }}
            >
              <Activity size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Среднее значение
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {summary.avg}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, marginLeft: '2px' }}>
                  {suffix}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                За выбранный временной интервал
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
