import { AppstoreOutlined, FullscreenOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps, Tooltip } from 'antd';
import type { FC } from 'react';
import { setLayoutDirection, useAppDispatch, useAppSelector } from '@/app/providers/store';
import type { LayoutDirection } from '@/shared/libs';
import { LAYOUT_DIRECTIONS } from '../constants';

interface LayoutSectionProps {
  onApplyLayout: (direction: LayoutDirection) => void;
  onFitView: () => void;
}

export const LayoutSection: FC<LayoutSectionProps> = ({ onApplyLayout, onFitView }) => {
  const dispatch = useAppDispatch();
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);

  const items: MenuProps['items'] = LAYOUT_DIRECTIONS.map((direction) => {
    return {
      key: direction.value,
      label: direction.label,
      icon: <direction.icon style={{ color: 'var(--text-secondary)' }} />,
      onClick: () => {
        dispatch(setLayoutDirection(direction.value));
        onApplyLayout(direction.value);
      },
    };
  });

  return (
    <>
      <Tooltip title="Сбросить и выровнять топологию">
        <Button
          onClick={() => onApplyLayout(layoutDirection)}
          icon={<AppstoreOutlined />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        />
      </Tooltip>

      <Dropdown menu={{ items }} trigger={['click']}>
        <Button icon={<SettingOutlined />} style={{ fontSize: '0.8rem', height: '32px' }} />
      </Dropdown>

      <Tooltip title="Вписать всю сеть в экран">
        <Button
          onClick={onFitView}
          icon={<FullscreenOutlined />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        />
      </Tooltip>
    </>
  );
};
