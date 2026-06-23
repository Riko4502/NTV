import { Col, Layout, Row } from 'antd';
import type { FC } from 'react';
import { ExportReportCard } from './components/ExportReportCard';
import { SlaKpis } from './components/SlaKpis';
import { SlaTable } from './components/SlaTable';
import { useReports } from './hooks/useReports';

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
    <Layout
      style={{ height: '100%', background: 'transparent', padding: '24px', overflowY: 'auto' }}
    >
      <div className="print-only-header" style={{ display: 'none' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
            textAlign: 'center',
            color: '#000',
          }}
        >
          Отчет о доступности и эффективности сети NOC
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#555', fontSize: '14px' }}>
          Дата генерации: {new Date().toLocaleString()}
        </p>
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
