import { AlertOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, message, Row, Statistic, Table } from 'antd';
import type { CSSProperties, FC } from 'react';
import { useSimulateThreatMutation } from '@/shared/api';
import type { SeverityType, ThreatEvent } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';
import { SEVERITY_LABELS } from './constants';
import { makeThreatAnalysisTabColumns } from './makeThreatAnalysisTabColumns';

interface ThreatAnalysisTabProps {
  nodeId: string;
  threats?: ThreatEvent[];
  isOffline: boolean;
}

export const ThreatAnalysisTab: FC<ThreatAnalysisTabProps> = ({
  nodeId,
  threats = [],
  isOffline,
}) => {
  const [simulateThreat, { isLoading: isSimulating }] = useSimulateThreatMutation();

  const handleSimulate = async () => {
    try {
      await simulateThreat({ nodeId }).unwrap();
      message.info('Симуляция атаки запущена. Проверьте системные тревоги.');
    } catch {
      message.error('Не удалось симулировать атаку');
    }
  };

  // Compute statistics
  const totalCount = threats.length;
  const blockedCount = threats.filter((t) => t.actionTaken === 'Blocked').length;
  const blockRate = totalCount ? Math.round((blockedCount / totalCount) * 100) : 100;

  // Determine threat level based on threats severity
  let currentLevel: SeverityType = 'low';

  if (threats.some((t) => t.severity === 'high')) {
    currentLevel = 'high';
  } else if (threats.some((t) => t.severity === 'medium')) {
    currentLevel = 'medium';
  }

  const statusLabel = SEVERITY_LABELS[currentLevel];
  const statusColor =
    currentLevel === 'high' ? '#cf1322' : currentLevel === 'medium' ? '#d46b08' : '#389e0d';

  return (
    <Flex vertical gap="16px" className={styles.tabContainer}>
      {/* Stats Cards */}
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <Card size="small" className={styles.statsCard}>
            <Statistic
              title={<span className={styles.statsTitle}>Всего угроз</span>}
              value={<span className={styles.totalStatsValue}>{totalCount}</span>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className={styles.statsCard}>
            <Statistic
              title={<span className={styles.statsTitle}>Заблокировано</span>}
              value={<span className={styles.blockedStatsValue}>{blockRate}%</span>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className={styles.statsCard}>
            <Statistic
              title={<span className={styles.statsTitle}>Уровень риска</span>}
              value={
                <span
                  className={styles.riskStatsValue}
                  style={{ '--risk-color': statusColor } as CSSProperties}
                >
                  {statusLabel}
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Action Button */}
      <Button
        danger
        type="primary"
        icon={<AlertOutlined />}
        loading={isSimulating}
        disabled={isOffline}
        onClick={handleSimulate}
        className={styles.simulateBtn}
      >
        Симулировать атаку (DDoS / Brute Force)
      </Button>

      {/* Log list */}
      <div className={styles.logListContainer}>
        <h3 className={styles.logTitle}>Журнал событий безопасности</h3>
        <Table
          dataSource={threats}
          columns={makeThreatAnalysisTabColumns}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ y: 280 }}
          className={styles.transparentTable}
        />
      </div>
    </Flex>
  );
};
