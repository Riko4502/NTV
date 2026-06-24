import { AppstoreOutlined, FullscreenOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps, Tooltip } from 'antd';
import { Sliders } from 'lucide-react';
import type { FC } from 'react';
import { setLayoutDirection, useAppDispatch, useAppSelector } from '@/app/providers/store';
import type { LayoutDirection } from '@/shared/libs';
import styles from '../../TopologyCanvas.module.scss';
import { LAYOUT_DIRECTIONS } from '../constants';

interface LayoutSectionProps {
  onApplyLayout: (direction: LayoutDirection) => void;
  onFitView: () => void;
  setSimulatorOpen: (open: boolean) => void;
}

export const LayoutSection: FC<LayoutSectionProps> = ({
  onApplyLayout,
  onFitView,
  setSimulatorOpen,
}) => {
  const dispatch = useAppDispatch();
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);

  const items: MenuProps['items'] = LAYOUT_DIRECTIONS.map((direction) => {
    return {
      key: direction.value,
      label: direction.label,
      icon: <direction.icon className={styles.menuIcon} />,
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
          className={styles.toolbarBtn}
        />
      </Tooltip>

      <Dropdown menu={{ items }} trigger={['click']}>
        <Button icon={<SettingOutlined />} className={styles.toolbarBtn} />
      </Dropdown>

      <Tooltip title="Вписать всю сеть в экран">
        <Button onClick={onFitView} icon={<FullscreenOutlined />} className={styles.toolbarBtn} />
      </Tooltip>

      <Tooltip title="Симулятор инцидентов">
        <Button
          icon={<Sliders size={16} />}
          data-test-id="simulator-btn"
          onClick={() => setSimulatorOpen(true)}
          className={styles.toolbarBtn}
        />
      </Tooltip>
    </>
  );
};
