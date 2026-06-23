import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import type { FC } from 'react';
import { toggleEditMode, useAppDispatch, useAppSelector } from '@/app/providers/store';

interface EditSectionProps {
  onOpenAddNode: () => void;
}

export const EditSection: FC<EditSectionProps> = ({ onOpenAddNode }) => {
  const dispatch = useAppDispatch();
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);

  return (
    <>
      <Tooltip
        title={isEditMode ? 'Выключить режим редактирования' : 'Включить режим редактирования'}
      >
        <Button
          onClick={() => dispatch(toggleEditMode())}
          type={isEditMode ? 'primary' : 'default'}
          danger={isEditMode}
          style={{
            fontSize: '0.8rem',
            height: '32px',
            fontWeight: isEditMode ? 600 : 400,
            boxShadow: isEditMode ? '0 0 10px rgba(239, 68, 68, 0.4)' : undefined,
          }}
        >
          {isEditMode ? 'Отмена' : 'Редактировать'}
        </Button>
      </Tooltip>

      {isEditMode && (
        <Tooltip title="Добавить новое устройство на карту">
          <Button
            onClick={onOpenAddNode}
            icon={<PlusOutlined />}
            type="primary"
            style={{ fontSize: '0.8rem', height: '32px' }}
          >
            Добавить узел
          </Button>
        </Tooltip>
      )}
    </>
  );
};
