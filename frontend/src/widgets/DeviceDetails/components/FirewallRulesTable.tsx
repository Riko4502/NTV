import { Table } from 'antd';
import type { FC } from 'react';
import type { FirewallRule } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';

interface FirewallRulesTableProps {
  rules: FirewallRule[];
  // biome-ignore lint/suspicious/noExplicitAny: Table columns can have complex nested types from Antd
  columns: any[];
}

export const FirewallRulesTable: FC<FirewallRulesTableProps> = ({ rules, columns }) => {
  return (
    <Table
      dataSource={rules}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
      className={styles.transparentTable}
    />
  );
};
