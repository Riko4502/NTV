import { Card, Flex } from 'antd';
import { ArrowLeftRight } from 'lucide-react';
import type { CSSProperties, FC } from 'react';
import type { NodeDto } from '@/entities/device/model/types';
import styles from '../EdgeDetails.module.scss';

interface EdgeVisualLinkCardProps {
  sourceNode?: NodeDto;
  targetNode?: NodeDto;
  sourceId: string;
  targetId: string;
  lineColor: string;
}

export const EdgeVisualLinkCard: FC<EdgeVisualLinkCardProps> = ({
  sourceNode,
  targetNode,
  sourceId,
  targetId,
  lineColor,
}) => {
  return (
    <Card size="small" className={styles.card}>
      <Flex justify="space-between" align="center" className={styles.flexContainer}>
        <Flex vertical align="center" className={styles.nodeWrapper}>
          <span className={styles.nodeLabel}>{sourceNode?.label || sourceId}</span>
          <span className={styles.nodeIp}>{sourceNode?.ip || 'N/A'}</span>
        </Flex>

        <Flex vertical align="center" justify="center" className={styles.centerWrapper}>
          <ArrowLeftRight
            size={18}
            className={styles.arrowIcon}
            style={{ '--line-color': lineColor } as CSSProperties}
          />
          <div
            className={styles.visualLine}
            style={{ '--line-color': lineColor } as CSSProperties}
          />
        </Flex>

        <Flex vertical align="center" className={styles.nodeWrapper}>
          <span className={styles.nodeLabel}>{targetNode?.label || targetId}</span>
          <span className={styles.nodeIp}>{targetNode?.ip || 'N/A'}</span>
        </Flex>
      </Flex>
    </Card>
  );
};
