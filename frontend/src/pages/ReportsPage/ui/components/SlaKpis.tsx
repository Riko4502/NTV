import { Card, Col, Flex, Progress, Row } from 'antd';
import type { CSSProperties, FC } from 'react';
import styles from '../ReportsPage.module.scss';

interface SlaKpisProps {
  averageSla: number;
  activeIncidents: number;
}

export const SlaKpis: FC<SlaKpisProps> = ({ averageSla, activeIncidents }) => {
  return (
    <Row gutter={[20, 20]} className={styles.kpisRow}>
      <Col xs={24} md={8}>
        <Card className={styles.kpiCard}>
          <Flex align="center" gap="20px">
            <Progress
              type="circle"
              percent={averageSla}
              strokeColor="var(--color-success)"
              size={70}
              format={(percent) => `${percent}%`}
            />
            <div>
              <span className={styles.kpiLabel}>Глобальный Uptime SLA</span>
              <span className={styles.kpiValue}>Доступность сети</span>
            </div>
          </Flex>
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card className={styles.kpiCard}>
          <Flex align="center" gap="20px">
            <Progress
              type="circle"
              percent={100}
              success={{ percent: 100 }}
              size={70}
              format={() => '4.8м'}
            />
            <div>
              <span className={styles.kpiLabel}>Среднее время ремонта (MTTR)</span>
              <span className={styles.kpiValue}>Быстрое восстановление</span>
            </div>
          </Flex>
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card className={styles.kpiCard}>
          <Flex align="center" gap="20px">
            <Flex
              className={styles.incidentsCircle}
              style={
                {
                  '--incidents-bg-color': activeIncidents
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)',
                  '--incidents-color': activeIncidents
                    ? 'var(--color-error)'
                    : 'var(--color-success)',
                  '--incidents-border-color': activeIncidents
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(16, 185, 129, 0.3)',
                } as CSSProperties
              }
            >
              {activeIncidents}
            </Flex>
            <div>
              <span className={styles.kpiLabel}>Активные инциденты</span>
              <span className={styles.kpiValue}>
                {activeIncidents ? 'Требуется реакция' : 'Всё работает штатно'}
              </span>
            </div>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
