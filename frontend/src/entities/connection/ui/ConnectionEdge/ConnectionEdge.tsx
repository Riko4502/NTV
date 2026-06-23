import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import { type FC, memo } from 'react';
import type { ConnectionEdgeStatus, EdgeBase } from '../../model/types';

// Map load to color
const getEdgeColors = (status: ConnectionEdgeStatus, usageMbps: number, bandwidthGbps: number) => {
  const maxMbps = bandwidthGbps * 1000;
  const loadFactor = usageMbps / maxMbps;

  if (status === 'inactive' || usageMbps === 0) {
    return {
      color: 'rgba(107, 114, 128, 0.2)', // dim gray
      flowColor: 'transparent',
      animationSpeed: '0s',
      glowColor: 'transparent',
    };
  }

  if (status === 'congested' || loadFactor > 0.8) {
    return {
      color: 'rgba(239, 68, 68, 0.4)', // semi-trans red
      flowColor: 'var(--color-error)', // glowing red
      animationSpeed: '0.8s', // fast movement
      glowColor: 'var(--color-error-glow)',
    };
  }

  if (loadFactor > 0.5) {
    return {
      color: 'rgba(245, 158, 11, 0.4)', // semi-trans warning amber
      flowColor: 'var(--color-warning)', // amber glow
      animationSpeed: '1.5s', // moderate movement
      glowColor: 'var(--color-warning-glow)',
    };
  }

  // Normal active state
  return {
    color: 'rgba(59, 130, 246, 0.25)', // semi-trans blue
    flowColor: 'var(--color-primary)', // bright blue
    animationSpeed: '3s', // slow steady flow
    glowColor: 'var(--color-primary-glow)',
  };
};

export const ConnectionEdge: FC<EdgeProps<EdgeBase>> = memo(
  (props) => {
    const {
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      style = {},
      markerEnd,
      data,
      selected,
    } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const edgeData = data;
    const currentUsage = edgeData?.currentUsage ?? 0;
    const bandwidth = edgeData?.bandwidth ?? 1;
    const edgeStatus = edgeData?.status ?? 'active';

    // Base colors and animation speed based on telemetry
    const edgeStyles = getEdgeColors(edgeStatus, currentUsage, bandwidth);

    // Bandwidth indicates wire thickness (10Gbps = thick, 1Gbps = thin)
    const isCoreLink = bandwidth >= 10;
    const baseStrokeWidth = isCoreLink ? 4 : 2;
    const flowStrokeWidth = isCoreLink ? 2.5 : 1.5;

    return (
      <>
        {/* Base selection glow path */}
        {selected && (
          <path
            id={`${id}-selection`}
            d={edgePath}
            fill="none"
            stroke={edgeStyles.flowColor}
            strokeWidth={baseStrokeWidth + 4}
            opacity={0.3}
            style={{ filter: 'blur(3px)' }}
          />
        )}

        {/* Main Base Path (the physical wire) */}
        <BaseEdge
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: selected ? edgeStyles.flowColor : edgeStyles.color,
            strokeWidth: baseStrokeWidth,
            transition: 'stroke 0.5s, stroke-width 0.3s',
          }}
        />

        {/* Dynamic Animated Flow Path overlay */}
        {edgeStyles.flowColor !== 'transparent' && (
          <>
            <path
              d={edgePath}
              fill="none"
              stroke={edgeStyles.flowColor}
              strokeWidth={flowStrokeWidth}
              strokeDasharray="6, 8"
              style={{
                animation: `dash ${edgeStyles.animationSpeed} linear infinite`,
                filter: `drop-shadow(0px 0px 3px ${edgeStyles.flowColor})`,
                pointerEvents: 'none',
              }}
            />
            {/* Staggered Packet flow particles */}
            <circle
              r={isCoreLink ? 3.5 : 2.5}
              fill={edgeStyles.flowColor}
              style={{ filter: `drop-shadow(0px 0px 4px ${edgeStyles.flowColor})` }}
            >
              <animateMotion
                dur={edgeStyles.animationSpeed}
                repeatCount="indefinite"
                path={edgePath}
              />
            </circle>
            <circle
              r={isCoreLink ? 3.5 : 2.5}
              fill={edgeStyles.flowColor}
              style={{ filter: `drop-shadow(0px 0px 4px ${edgeStyles.flowColor})` }}
            >
              <animateMotion
                dur={edgeStyles.animationSpeed}
                repeatCount="indefinite"
                path={edgePath}
                begin={`${parseFloat(edgeStyles.animationSpeed) / 3}s`}
              />
            </circle>
            <circle
              r={isCoreLink ? 3.5 : 2.5}
              fill={edgeStyles.flowColor}
              style={{ filter: `drop-shadow(0px 0px 4px ${edgeStyles.flowColor})` }}
            >
              <animateMotion
                dur={edgeStyles.animationSpeed}
                repeatCount="indefinite"
                path={edgePath}
                begin={`${(parseFloat(edgeStyles.animationSpeed) / 3) * 2}s`}
              />
            </circle>
          </>
        )}

        {/* Connection details badge overlay */}
        {edgeStatus !== 'inactive' && (
          <g transform={`translate(${labelX - 35}, ${labelY - 10})`}>
            <rect
              width={70}
              height={20}
              rx={4}
              fill="var(--bg-panel)"
              stroke="var(--border-color)"
              strokeWidth={1}
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
            />
            <text
              x={35}
              y={13}
              textAnchor="middle"
              fill="var(--text-primary)"
              style={{
                fontSize: '8px',
                fontFamily: 'monospace',
                fontWeight: 600,
                pointerEvents: 'none',
              }}
            >
              {bandwidth}G | {currentUsage}M
            </text>
          </g>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selected === nextProps.selected &&
      prevProps.sourceX === nextProps.sourceX &&
      prevProps.sourceY === nextProps.sourceY &&
      prevProps.targetX === nextProps.targetX &&
      prevProps.targetY === nextProps.targetY &&
      prevProps.data?.status === nextProps.data?.status &&
      prevProps.data?.currentUsage === nextProps.data?.currentUsage &&
      prevProps.data?.bandwidth === nextProps.data?.bandwidth
    );
  },
);

export default ConnectionEdge;
