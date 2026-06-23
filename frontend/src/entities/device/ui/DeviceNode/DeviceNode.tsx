import { Handle, Position } from '@xyflow/react';
import { Flex, Progress } from 'antd';
import { HelpCircle, Laptop, type LucideIcon, Network, Server, Shield, Split } from 'lucide-react';

import { type CSSProperties, type FC, memo, useEffect, useState } from 'react';
import { useAppSelector } from '@/app/providers/store';
import type { DeviceNodeProps, DeviceType, Status, StatusStyle } from '@/shared/libs';
import { getSeverityColor } from '@/shared/libs';
import styles from './DeviceNode.module.scss';

const DEVICE_ICON: Record<DeviceType, LucideIcon> = {
  router: Network,
  switch: Split,
  server: Server,
  client: Laptop,
  firewall: Shield,
};

const STATUS_THEMES: Record<Status, StatusStyle> = {
  online: {
    color: 'var(--color-success)',
    glow: 'var(--color-success-glow)',
    label: 'В сети',
  },
  warning: {
    color: 'var(--color-warning)',
    glow: 'var(--color-warning-glow)',
    label: 'Предупреждение',
  },
  error: {
    color: 'var(--color-error)',
    glow: 'var(--color-error-glow)',
    label: 'Сбой',
  },
  offline: {
    color: 'var(--color-offline)',
    glow: 'var(--color-offline-glow)',
    label: 'Не в сети',
  },
};

export const DeviceNode: FC<DeviceNodeProps> = memo(
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: heatmap metric calculations add complexity
  ({ data, selected }) => {
    const { status = 'offline', label, ip, cpu } = data;
    const { color, glow } = STATUS_THEMES[status];
    const Icon = DEVICE_ICON[data.type] || HelpCircle;
    const isEditMode = useAppSelector((state) => state.ui.isEditMode);
    const heatmapMetric = useAppSelector((state) => state.ui.heatmapMetric);

    // Heatmap mode override
    let displayColor = color;
    let displayGlow = glow;

    if (status !== 'offline' && heatmapMetric && heatmapMetric !== 'none') {
      const val = data[heatmapMetric];
      if (typeof val === 'number') {
        const metricColor = getSeverityColor(val);
        displayColor = metricColor;
        displayGlow =
          metricColor === 'var(--color-error)'
            ? 'var(--color-error-glow)'
            : metricColor === 'var(--color-warning)'
              ? 'var(--color-warning-glow)'
              : 'var(--color-success-glow)';
      }
    }

    const [cpuHistory, setCpuHistory] = useState<number[]>([]);

    useEffect(() => {
      if (status === 'offline') {
        setCpuHistory([]);
        return;
      }
      setCpuHistory((prev) => {
        const next = [...prev, cpu];
        return next.slice(-12);
      });
    }, [cpu, status]);

    const isCpuHistory = !!cpuHistory.length;

    const sparklineWidth = 136;
    const sparklineHeight = 24;
    const sparklinePoints = cpuHistory
      .map((val, idx) => {
        const x = cpuHistory.length > 1 ? (idx / (cpuHistory.length - 1)) * sparklineWidth : 0;
        const y = sparklineHeight - (val / 100) * sparklineHeight;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div
        className={`${styles.customNode} glass-panel ${selected ? styles.selected : ''}`}
        style={{
          border: selected ? `1.5px solid ${displayColor}` : `1px solid var(--border-color)`,
          backgroundColor: 'var(--bg-card)',
          boxShadow: selected
            ? `0 0 20px ${displayGlow}, inset 0 0 8px ${displayGlow}`
            : '0 8px 32px 0 var(--panel-shadow)',
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isEditMode}
          style={{ opacity: isEditMode ? 1 : 0, transition: 'opacity 0.2s' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isEditMode}
          style={{ opacity: isEditMode ? 1 : 0, transition: 'opacity 0.2s' }}
        />

        {/* Status glowing ring indicator */}
        <div
          className={styles.pulseRing}
          style={
            {
              backgroundColor: displayColor,
              '--pulse-color': displayGlow,
            } as CSSProperties
          }
        />

        {/* Device Icon */}
        <div
          style={{
            color: displayColor,
            backgroundColor: `var(--btn-secondary-bg)`,
            padding: '10px',
            borderRadius: '50%',
            marginBottom: '8px',
            boxShadow: `inset 0 0 10px rgba(0, 0, 0, 0.05)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid var(--border-color)`,
          }}
        >
          <Icon size={20} />
        </div>

        {/* Device Name */}
        <div
          style={{
            fontWeight: 600,
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            marginBottom: '2px',
          }}
        >
          {label}
        </div>

        {/* Device IP */}
        <div
          style={{
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
            marginBottom: '8px',
          }}
        >
          {ip}
        </div>

        {/* Device CPU utilization bar (if online) */}
        {status !== 'offline' ? (
          <div style={{ width: '100%', marginTop: '4px' }}>
            <Flex
              justify="space-between"
              style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3px' }}
            >
              <span>CPU</span>
              <span style={{ color: getSeverityColor(cpu) }}>{cpu}%</span>
            </Flex>
            <Progress percent={cpu} strokeColor={getSeverityColor(cpu)} showInfo={false} />
            {isCpuHistory && (
              <div className={styles.sparklineWrapper}>
                <svg
                  width={sparklineWidth}
                  height={sparklineHeight}
                  style={{ overflow: 'visible' }}
                >
                  <title>История CPU</title>
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    points={sparklinePoints}
                    style={{ transition: 'points 0.3s ease' }}
                  />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              marginTop: '8px',
              letterSpacing: '0.5px',
            }}
          >
            ВЫКЛЮЧЕН
          </div>
        )}

        {/* Source handles — visible and connectable only in edit mode */}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isEditMode}
          style={{ opacity: isEditMode ? 1 : 0, transition: 'opacity 0.2s' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isEditMode}
          style={{ opacity: isEditMode ? 1 : 0, transition: 'opacity 0.2s' }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selected === nextProps.selected &&
      prevProps.data.status === nextProps.data.status &&
      prevProps.data.cpu === nextProps.data.cpu &&
      prevProps.data.ram === nextProps.data.ram &&
      prevProps.data.temp === nextProps.data.temp &&
      prevProps.data.traffic === nextProps.data.traffic &&
      prevProps.data.label === nextProps.data.label &&
      prevProps.data.ip === nextProps.data.ip
    );
  },
);

export default DeviceNode;
