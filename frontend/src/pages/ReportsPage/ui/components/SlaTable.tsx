import { Table } from 'antd';
import type { FC } from 'react';
import { makeReportColumns } from '../makeReportColumns';

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
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};
