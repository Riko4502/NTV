import { Card, Tag } from 'antd';
import { Cpu, HardDrive, Radio, Thermometer } from 'lucide-react';

import type { FC } from 'react';
import type { NodeDto } from '@/entities/device/model/types';
import type { MetricPoint } from '@/shared/api/useMetricsHistory';

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
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{node.label}</h4>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
            }}
          >
            {node.ip}
          </span>
        </div>
        <Tag color={node.status === 'online' ? 'success' : 'warning'} variant="filled">
          {node.status}
        </Tag>
      </div>

      <div
        style={{
          marginTop: '12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={12} style={{ color: 'var(--text-muted)' }} />
          <span>
            CPU: <strong>{currentPoint ? `${currentPoint.cpu}%` : `${node.cpu}%`}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HardDrive size={12} style={{ color: 'var(--text-muted)' }} />
          <span>
            RAM: <strong>{currentPoint ? `${currentPoint.ram}%` : `${node.ram}%`}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Thermometer size={12} style={{ color: 'var(--text-muted)' }} />
          <span>
            Temp: <strong>{currentPoint ? `${currentPoint.temp}°C` : `${node.temp}°C`}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={12} style={{ color: 'var(--text-muted)' }} />
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      {nodesToPlot.map((node, index) => {
        const color = chartColorScheme[index % chartColorScheme.length];
        const history = metricsHistory[node.id] || [];

        return <DeviceMetricCard key={node.id} node={node} color={color} history={history} />;
      })}
    </div>
  );
};
