import { DownloadOutlined, LineChartOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import type { FC } from 'react';

interface ExportReportCardProps {
  downloadingPdf: boolean;
  downloadingCsv: boolean;
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
}

export const ExportReportCard: FC<ExportReportCardProps> = ({
  downloadingPdf,
  downloadingCsv,
  onDownloadPdf,
  onDownloadCsv,
}) => {
  return (
    <Card
      title={
        <span
          style={{
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <LineChartOutlined />
          Отчетность и Экспорт
        </span>
      }
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Выгрузите текущие показатели эффективности NOC для отчетности перед руководством или для
          внешнего аудита.
        </div>

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          loading={downloadingPdf}
          onClick={onDownloadPdf}
          style={{ width: '100%', height: '40px', fontWeight: 600 }}
        >
          Печать отчета (PDF)
        </Button>

        <Button
          icon={<DownloadOutlined />}
          loading={downloadingCsv}
          onClick={onDownloadCsv}
          style={{ width: '100%', height: '40px' }}
        >
          Экспорт SLA в CSV
        </Button>
      </div>
    </Card>
  );
};
