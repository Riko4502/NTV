import { Card, Col, Flex, Progress, Row } from 'antd';
import type { FC } from 'react';

interface SlaKpisProps {
  averageSla: number;
  activeIncidents: number;
}

export const SlaKpis: FC<SlaKpisProps> = ({ averageSla, activeIncidents }) => {
  return (
    <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
      <Col xs={24} md={8}>
        <Card
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            height: '100%',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Flex align="center" gap="20px">
            <Progress
              type="circle"
              percent={averageSla}
              strokeColor="var(--color-success)"
              size={70}
              format={(percent) => `${percent}%`}
            />
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Глобальный Uptime SLA
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Доступность сети
              </span>
            </div>
          </Flex>
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            height: '100%',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Flex align="center" gap="20px">
            <Progress
              type="circle"
              percent={100}
              success={{ percent: 100 }}
              size={70}
              format={() => '4.8м'}
            />
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Среднее время ремонта (MTTR)
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Быстрое восстановление
              </span>
            </div>
          </Flex>
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            height: '100%',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Flex align="center" gap="20px">
            <Flex
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor:
                  activeIncidents > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeIncidents > 0 ? 'var(--color-error)' : 'var(--color-success)',
                fontSize: '1.5rem',
                fontWeight: 700,
                border: `1px solid ${
                  activeIncidents > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                }`,
              }}
            >
              {activeIncidents}
            </Flex>
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Активные инциденты
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeIncidents > 0 ? 'Требуется реакция' : 'Всё работает штатно'}
              </span>
            </div>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
