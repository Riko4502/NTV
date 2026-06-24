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
        style={
          {
            '--node-border': selected ? `1.5px solid ${displayColor}` : undefined,
            '--node-shadow': selected
              ? `0 0 20px ${displayGlow}, inset 0 0 8px ${displayGlow}`
              : undefined,
          } as CSSProperties
        }
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isEditMode}
          className={`${styles.handle} ${isEditMode ? styles.editable : ''}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isEditMode}
          className={`${styles.handle} ${isEditMode ? styles.editable : ''}`}
        />

        {/* Status glowing ring indicator */}
        <div
          className={styles.pulseRing}
          style={
            {
              '--pulse-bg-color': displayColor,
              '--pulse-color': displayGlow,
            } as CSSProperties
          }
        />

        {/* Device Icon */}
        <Flex
          align="center"
          justify="center"
          className={styles.iconWrapper}
          style={
            {
              '--icon-color': displayColor,
            } as CSSProperties
          }
        >
          <Icon size={20} />
        </Flex>

        {/* Device Name */}
        <div className={styles.deviceName}>{label}</div>

        {/* Device IP */}
        <div className={styles.deviceIp}>{ip}</div>

        {/* Device CPU utilization bar (if online) */}
        {status !== 'offline' ? (
          <div className={styles.cpuContainer}>
            <Flex justify="space-between" className={styles.cpuHeader}>
              <span>CPU</span>
              <span
                className={styles.cpuValue}
                style={{ '--cpu-color': getSeverityColor(cpu) } as CSSProperties}
              >
                {cpu}%
              </span>
            </Flex>
            <Progress percent={cpu} strokeColor={getSeverityColor(cpu)} showInfo={false} />
            {isCpuHistory && (
              <div className={styles.sparklineWrapper}>
                <svg
                  width={sparklineWidth}
                  height={sparklineHeight}
                  className={styles.sparklineSvg}
                >
                  <title>История CPU</title>
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    points={sparklinePoints}
                    className={styles.sparklinePolyline}
                  />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.offlineText}>ВЫКЛЮЧЕН</div>
        )}

        {/* Source handles — visible and connectable only in edit mode */}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isEditMode}
          className={`${styles.handle} ${isEditMode ? styles.editable : ''}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isEditMode}
          className={`${styles.handle} ${isEditMode ? styles.editable : ''}`}
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
