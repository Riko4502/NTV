import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import type { FC } from 'react';

interface RecoveryCardProps {
  onResetSimulation: () => void;
}

export const RecoveryCard: FC<RecoveryCardProps> = ({ onResetSimulation }) => {
  return (
    <Card
      title="Системное восстановление"
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
    >
      <div
        style={{
          marginBottom: '16px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
        }}
      >
        Если симуляция инцидентов перегрузила сеть и вы хотите вернуть все метрики к базовым зеленым
        значениям:
      </div>
      <Button type="default" danger icon={<ReloadOutlined />} onClick={onResetSimulation}>
        Сбросить показатели симуляции
      </Button>
    </Card>
  );
};
