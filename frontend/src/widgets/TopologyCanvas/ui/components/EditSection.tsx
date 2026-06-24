import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { Pencil } from 'lucide-react';
import type { FC } from 'react';
import { toggleEditMode, useAppDispatch, useAppSelector } from '@/app/providers/store';
import styles from '../../TopologyCanvas.module.scss';

interface EditSectionProps {
  onOpenAddNode: () => void;
}

export const EditSection: FC<EditSectionProps> = ({ onOpenAddNode }) => {
  const dispatch = useAppDispatch();
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);

  const icon = !isEditMode ? <Pencil size={14} /> : void 0;

  return (
    <>
      <Tooltip
        title={isEditMode ? 'Выключить режим редактирования' : 'Включить режим редактирования'}
      >
        <Button
          onClick={() => dispatch(toggleEditMode())}
          type={isEditMode ? 'primary' : 'default'}
          icon={icon}
          danger={isEditMode}
          className={`${styles.toolbarBtn} ${isEditMode ? styles.editActive : ''}`}
        >
          {isEditMode ? 'Отмена' : ''}
        </Button>
      </Tooltip>

      {isEditMode && (
        <Tooltip title="Добавить новое устройство на карту">
          <Button
            onClick={onOpenAddNode}
            icon={<PlusOutlined />}
            type="primary"
            className={styles.toolbarBtn}
          >
            Добавить узел
          </Button>
        </Tooltip>
      )}
    </>
  );
};
