import { Card, Flex, Progress } from 'antd';
import type { CSSProperties, FC } from 'react';
import styles from '../EdgeDetails.module.scss';

interface EdgeTrafficCardProps {
  currentUsage: number;
  maxMbps: number;
  usagePercent: number;
  lineColor: string;
  isCongested: boolean;
}

export const EdgeTrafficCard: FC<EdgeTrafficCardProps> = ({
  currentUsage,
  maxMbps,
  usagePercent,
  lineColor,
  isCongested,
}) => {
  return (
    <Card
      size="small"
      title={<span className={styles.cardTitle}>Нагрузка канала</span>}
      className={styles.card}
    >
      <Flex justify="space-between" className={styles.trafficFlex}>
        <span>Текущий трафик:</span>
        <span className={styles.paramValue}>
          {currentUsage} Mbps / {maxMbps} Mbps
        </span>
      </Flex>

      <div className={styles.progressWrapper}>
        <Flex justify="space-between" className={styles.progressFlex}>
          <span>Загрузка:</span>
          <span
            className={styles.usagePercent}
            style={{ '--usage-color': lineColor } as CSSProperties}
          >
            {usagePercent}%
          </span>
        </Flex>
        <Progress
          percent={usagePercent}
          strokeColor={lineColor}
          showInfo={false}
          status={isCongested ? 'exception' : 'normal'}
        />
      </div>
    </Card>
  );
};
