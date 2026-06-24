import { Table, type TableColumnsType } from 'antd';
import type { FC } from 'react';
import type { FirewallRule } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';

interface FirewallRulesTableProps {
  rules: FirewallRule[];
  columns: TableColumnsType<FirewallRule>;
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
