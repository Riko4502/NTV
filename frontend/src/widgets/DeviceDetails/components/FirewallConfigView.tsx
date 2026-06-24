import type { CSSProperties, FC } from 'react';
import styles from '../DeviceDetails.module.scss';

interface FirewallConfigViewProps {
  vendor: string;
  firewallConfig: string;
}

export const FirewallConfigView: FC<FirewallConfigViewProps> = ({ vendor, firewallConfig }) => {
  return (
    <pre
      className={styles.configPre}
      style={
        {
          '--config-color': vendor.toLowerCase().includes('checkpoint') ? '#a78bfa' : '#4ade80',
        } as CSSProperties
      }
    >
      {firewallConfig}
    </pre>
  );
};
