import { DownloadOutlined, LineChartOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Flex } from 'antd';
import type { FC } from 'react';
import styles from '../ReportsPage.module.scss';

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
        <Flex align="center" gap={8}>
          <LineChartOutlined />
          Отчетность и Экспорт
        </Flex>
      }
      className={styles.exportCard}
    >
      <Flex gap="12px">
        <div className={styles.exportDesc}>
          Выгрузите текущие показатели эффективности NOC для отчетности перед руководством или для
          внешнего аудита.
        </div>

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          loading={downloadingPdf}
          onClick={onDownloadPdf}
        >
          Печать отчета (PDF)
        </Button>

        <Button icon={<DownloadOutlined />} loading={downloadingCsv} onClick={onDownloadCsv}>
          Экспорт SLA в CSV
        </Button>
      </Flex>
    </Card>
  );
};
