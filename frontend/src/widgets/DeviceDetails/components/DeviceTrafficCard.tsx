import { Card } from 'antd';
import { Radio } from 'lucide-react';
import type { FC } from 'react';
import styles from '../DeviceDetails.module.scss';

interface DeviceTrafficCardProps {
  traffic: number;
}

export const DeviceTrafficCard: FC<DeviceTrafficCardProps> = ({ traffic }) => {
  return (
    <Card size="small" className={`${styles.card} ${styles.trafficCard}`}>
      <div className={styles.trafficTitle}>
        <Radio size={14} className={styles.trafficIcon} />
        <span>Использование трафика</span>
      </div>
      <span className={styles.trafficValue}>{traffic} Mbps</span>
    </Card>
  );
};
