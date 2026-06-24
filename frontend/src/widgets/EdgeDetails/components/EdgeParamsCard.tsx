import { Card, Flex, Tag } from 'antd';
import type { CSSProperties, FC } from 'react';
import type { ConnectionEdgeStatus } from '@/entities/connection/model/types';
import styles from '../EdgeDetails.module.scss';

interface EdgeParamsCardProps {
  statusLabel: string;
  tagColor: string;
  bandwidth: number;
  latency: number;
  status: ConnectionEdgeStatus;
}

export const EdgeParamsCard: FC<EdgeParamsCardProps> = ({
  statusLabel,
  tagColor,
  bandwidth,
  latency,
  status,
}) => {
  return (
    <Card
      size="small"
      title={<span className={styles.cardTitle}>Параметры соединения</span>}
      className={styles.card}
    >
      <Flex justify="space-between" align="center">
        <span className={styles.paramLabel}>Статус:</span>
        <Tag color={tagColor}>{statusLabel}</Tag>
      </Flex>

      <Flex justify="space-between" align="center">
        <span className={styles.paramLabel}>Пропускная способность:</span>
        <span className={styles.paramValue}>{bandwidth} Gbps</span>
      </Flex>

      <Flex justify="space-between" align="center">
        <span className={styles.paramLabel}>Задержка (Latency):</span>
        <span
          className={styles.latencyValue}
          style={
            {
              '--latency-color':
                status === 'congested' ? 'var(--color-error)' : 'var(--color-success)',
            } as CSSProperties
          }
        >
          {latency} ms
        </span>
      </Flex>
    </Card>
  );
};
