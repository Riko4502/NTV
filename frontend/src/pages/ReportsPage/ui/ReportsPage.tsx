import { Col, Layout, Row } from 'antd';
import type { FC } from 'react';
import { ExportReportCard } from './components/ExportReportCard';
import { SlaKpis } from './components/SlaKpis';
import { SlaTable } from './components/SlaTable';
import { useReports } from './hooks/useReports';
import styles from './ReportsPage.module.scss';

export const ReportsPage: FC = () => {
  const {
    averageSla,
    activeIncidents,
    downloadingPdf,
    downloadingCsv,
    handleDownloadPdf,
    handleDownloadCsv,
    slaData,
  } = useReports();

  return (
    <Layout className={styles.pageLayout}>
      <div className={styles.printOnlyHeader}>
        <h1 className={styles.printTitle}>Отчет о доступности и эффективности сети NOC</h1>
        <p className={styles.printSub}>Дата генерации: {new Date().toLocaleString()}</p>
      </div>

      <SlaKpis averageSla={averageSla} activeIncidents={activeIncidents} />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <SlaTable slaData={slaData} />
        </Col>

        <Col xs={24} lg={8}>
          <ExportReportCard
            downloadingPdf={downloadingPdf}
            downloadingCsv={downloadingCsv}
            onDownloadPdf={handleDownloadPdf}
            onDownloadCsv={handleDownloadCsv}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default ReportsPage;
