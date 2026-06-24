import { Card, Tag } from 'antd';
import { Cpu, HardDrive, Radio, Thermometer } from 'lucide-react';

import type { CSSProperties, FC } from 'react';
import type { NodeDto } from '@/entities/device/model/types';
import type { MetricPoint } from '@/shared/api';
import styles from '../AnalyticsDashboard.module.scss';

interface DeviceMetricCardProps {
  node: NodeDto;
  color: string;
  history: MetricPoint[];
}

const DeviceMetricCard: FC<DeviceMetricCardProps> = ({ node, color, history }) => {
  const currentPoint = history[history.length - 1];

  return (
    <Card
      size="small"
      className={styles.metricCard}
      style={{ '--border-color-left': color } as CSSProperties}
    >
      <div className={styles.cardHeader}>
        <div>
          <h4 className={styles.cardTitleText}>{node.label}</h4>
          <span className={styles.cardIpText}>{node.ip}</span>
        </div>
        <Tag color={node.status === 'online' ? 'success' : 'warning'} variant="filled">
          {node.status}
        </Tag>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricItemRow}>
          <Cpu size={12} className={styles.metricIcon} />
          <span>
            CPU: <strong>{currentPoint ? `${currentPoint.cpu}%` : `${node.cpu}%`}</strong>
          </span>
        </div>
        <div className={styles.metricItemRow}>
          <HardDrive size={12} className={styles.metricIcon} />
          <span>
            RAM: <strong>{currentPoint ? `${currentPoint.ram}%` : `${node.ram}%`}</strong>
          </span>
        </div>
        <div className={styles.metricItemRow}>
          <Thermometer size={12} className={styles.metricIcon} />
          <span>
            Temp: <strong>{currentPoint ? `${currentPoint.temp}°C` : `${node.temp}°C`}</strong>
          </span>
        </div>
        <div className={styles.metricItemRow}>
          <Radio size={12} className={styles.metricIcon} />
          <span>
            Traffic:{' '}
            <strong>
              {currentPoint ? `${currentPoint.traffic} Mbps` : `${node.traffic} Mbps`}
            </strong>
          </span>
        </div>
      </div>
    </Card>
  );
};

interface DeviceMetricsGridProps {
  nodesToPlot: NodeDto[];
  chartColorScheme: string[];
  metricsHistory: Record<string, MetricPoint[]>;
}

export const DeviceMetricsGrid: FC<DeviceMetricsGridProps> = ({
  nodesToPlot,
  chartColorScheme,
  metricsHistory,
}) => {
  return (
    <div className={styles.gridContainer}>
      {nodesToPlot.map((node, index) => {
        const color = chartColorScheme[index % chartColorScheme.length];
        const history = metricsHistory[node.id] || [];

        return <DeviceMetricCard key={node.id} node={node} color={color} history={history} />;
      })}
    </div>
  );
};
