import { PlusOutlined } from '@ant-design/icons';
import { Button, Segmented } from 'antd';
import type { FC } from 'react';
import styles from '../DeviceDetails.module.scss';
import type { FirewallTabType } from '../model';
import { FIREWALL_TAB_OPTIONS } from './constants';

interface FirewallRulesHeaderProps {
  viewMode: FirewallTabType;
  onViewModeChange: (val: FirewallTabType) => void;
  onAddClick: () => void;
  isOffline: boolean;
}

export const FirewallRulesHeader: FC<FirewallRulesHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onAddClick,
  isOffline,
}) => {
  return (
    <div className={styles.tabHeaderRow}>
      <Segmented<FirewallTabType>
        value={viewMode}
        onChange={(val) => onViewModeChange(val)}
        options={FIREWALL_TAB_OPTIONS}
        className={styles.tabSegmented}
      />
      <Button type="primary" icon={<PlusOutlined />} disabled={isOffline} onClick={onAddClick}>
        Добавить
      </Button>
    </div>
  );
};
