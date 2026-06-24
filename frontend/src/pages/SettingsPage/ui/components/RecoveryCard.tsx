import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import type { FC } from 'react';
import styles from '../SettingsPage.module.scss';

interface RecoveryCardProps {
  onResetSimulation: () => void;
}

export const RecoveryCard: FC<RecoveryCardProps> = ({ onResetSimulation }) => {
  return (
    <Card title="Системное восстановление" className={styles.card}>
      <div className={styles.descText}>
        Если симуляция инцидентов перегрузила сеть и вы хотите вернуть все метрики к базовым зеленым
        значениям:
      </div>
      <Button type="default" danger icon={<ReloadOutlined />} onClick={onResetSimulation}>
        Сбросить показатели симуляции
      </Button>
    </Card>
  );
};
