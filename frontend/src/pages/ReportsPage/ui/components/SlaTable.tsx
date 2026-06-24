import { Table } from 'antd';
import type { FC } from 'react';
import { makeReportColumns } from '../makeReportColumns';
import styles from '../ReportsPage.module.scss';

interface SlaTableProps {
  slaData: Array<{
    key: string;
    label: string;
    ip: string;
    sla: number;
    downtime: string;
    status: 'excellent' | 'good' | 'warning';
  }>;
}

export const SlaTable: FC<SlaTableProps> = ({ slaData }) => {
  return (
    <Table
      dataSource={slaData}
      columns={makeReportColumns}
      pagination={false}
      size="middle"
      className={styles.table}
    />
  );
};
