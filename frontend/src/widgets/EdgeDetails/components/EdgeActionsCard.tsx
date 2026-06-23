import { Button, Card } from 'antd';
import { Trash2 } from 'lucide-react';
import type { FC } from 'react';

interface EdgeActionsCardProps {
  isEditMode: boolean;
  onDelete: () => void;
}

export const EdgeActionsCard: FC<EdgeActionsCardProps> = ({ isEditMode, onDelete }) => {
  return (
    <Card
      size="small"
      title={
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Команды управления
        </span>
      }
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px',
        marginTop: 'auto',
      }}
      styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' } }}
    >
      {isEditMode ? (
        <Button
          type="primary"
          danger
          icon={<Trash2 size={16} />}
          onClick={onDelete}
          style={{
            height: '36px',
            fontSize: '0.8rem',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: 500,
          }}
        >
          Удалить сетевую связь
        </Button>
      ) : (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Для изменения топологии (удаления связей) включите режим редактирования на карте.
        </p>
      )}
    </Card>
  );
};
