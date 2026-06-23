import {
  AppstoreOutlined,
  FullscreenOutlined,
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, Flex, Input, Tooltip } from 'antd';

import type { FC } from 'react';
import {
  setLayoutDirection,
  setSearchQuery,
  toggleEditMode,
  useAppDispatch,
  useAppSelector,
} from '@/app/providers/store';
import type { LayoutDirection } from '@/shared/libs';
import styles from '../TopologyCanvas.module.scss';

interface CanvasToolbarProps {
  onOpenAddNode: () => void;
  onApplyLayout: (direction: LayoutDirection) => void;
  onFitView: () => void;
}

export const CanvasToolbar: FC<CanvasToolbarProps> = ({
  onOpenAddNode,
  onApplyLayout,
  onFitView,
}) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);

  return (
    <Flex justify="center" align="center" gap={8} className={styles.glassPanel}>
      <Input
        placeholder="Поиск по карте..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
        allowClear
        style={{
          width: '240px',
          marginRight: '4px',
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--border-color)',
        }}
      />

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

      <Tooltip title="Сбросить и выровнять топологию">
        <Button
          onClick={() => onApplyLayout(layoutDirection)}
          icon={<AppstoreOutlined />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        >
          Выровнять
        </Button>
      </Tooltip>

      <Tooltip title="Сменить направление раскладки">
        <Button
          onClick={() => {
            const nextDir = layoutDirection === 'TB' ? 'LR' : 'TB';
            dispatch(setLayoutDirection(nextDir));
            onApplyLayout(nextDir);
          }}
          icon={
            <SwapOutlined
              style={{ transform: layoutDirection === 'TB' ? 'rotate(90deg)' : 'none' }}
            />
          }
          style={{ fontSize: '0.8rem', height: '32px' }}
        >
          {layoutDirection === 'TB' ? 'Слева-Направо' : 'Сверху-Вниз'}
        </Button>
      </Tooltip>

      <Tooltip title="Вписать всю сеть в экран">
        <Button
          onClick={onFitView}
          icon={<FullscreenOutlined />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        >
          По размеру
        </Button>
      </Tooltip>
    </Flex>
  );
};
