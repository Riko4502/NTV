import { Handle, Position } from '@xyflow/react';
import { Flex, Progress } from 'antd';
import { HelpCircle, Laptop, type LucideIcon, Network, Server, Shield, Split } from 'lucide-react';
import type React from 'react';
import { memo } from 'react';
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

export const DeviceNode: React.FC<DeviceNodeProps> = memo(
  ({ data, selected }) => {
    const { status = 'offline', label, ip, cpu } = data;
    const statusColors = STATUS_THEMES[status];
    const Icon = DEVICE_ICON[data.type] || HelpCircle;

    return (
      <div
        className={`${styles.customNode} glass-panel ${selected ? styles.selected : ''}`}
        style={{
          border: `1px solid var(--border-color)`,
          backgroundColor: 'var(--bg-card)',
          boxShadow: selected
            ? `0 0 16px ${statusColors.glow}`
            : '0 8px 32px 0 var(--panel-shadow)',
        }}
      >
        {/* Target handles for all 4 sides so Dagre layout handles either TB or LR automatically */}
        <Handle type="target" position={Position.Top} style={{ opacity: 0.8 }} />
        <Handle type="target" position={Position.Left} style={{ opacity: 0.8 }} />

        {/* Status glowing ring indicator */}
        <div
          className={styles.pulseRing}
          style={
            {
              backgroundColor: statusColors.color,
              '--pulse-color': statusColors.glow,
            } as React.CSSProperties
          }
        />

        {/* Device Icon */}
        <div
          style={{
            color: statusColors.color,
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

        {/* Source handles for all 4 sides */}
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0.8 }} />
        <Handle type="source" position={Position.Right} style={{ opacity: 0.8 }} />
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
