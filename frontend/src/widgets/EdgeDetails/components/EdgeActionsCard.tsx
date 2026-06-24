import { Button, Card } from 'antd';
import { Trash2 } from 'lucide-react';
import type { FC } from 'react';
import styles from '../EdgeDetails.module.scss';

interface EdgeActionsCardProps {
  isEditMode: boolean;
  onDelete: () => void;
}

export const EdgeActionsCard: FC<EdgeActionsCardProps> = ({ isEditMode, onDelete }) => {
  return (
    <Card
      size="small"
      title={<span className={styles.cardTitle}>Команды управления</span>}
      className={`${styles.card} ${styles.actionsCard}`}
    >
      {isEditMode ? (
        <Button
          type="primary"
          danger
          icon={<Trash2 size={16} />}
          onClick={onDelete}
          className={styles.deleteBtn}
        >
          Удалить сетевую связь
        </Button>
      ) : (
        <p className={styles.helperText}>
          Для изменения топологии (удаления связей) включите режим редактирования на карте.
        </p>
      )}
    </Card>
  );
};
