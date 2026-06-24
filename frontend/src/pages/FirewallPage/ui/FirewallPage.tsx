import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Flex, Layout, Result, Row, Spin, Tabs, Tag } from 'antd';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paths } from '@/app/router/paths';
import { useStreamTopologyQuery } from '@/shared/api';
import { FirewallRulesTab } from '@/widgets/DeviceDetails/components/FirewallRulesTab';
import { ThreatAnalysisTab } from '@/widgets/DeviceDetails/components/ThreatAnalysisTab';
import styles from './FirewallPage.module.scss';

export const FirewallPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useStreamTopologyQuery();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" className={styles.spinnerWrapper}>
        <Spin size="large" delay={2000} />
      </Flex>
    );
  }

  const device = data?.nodes.find((n) => n.id === id);

  if (!device) {
    return (
      <Layout className={styles.resultLayout}>
        <Result
          status="404"
          title="Устройство не найдено"
          subTitle={`Устройство с ID "${id}" не зарегистрировано в системе.`}
          extra={
            <Button type="primary" onClick={() => navigate(paths.root)}>
              На главную
            </Button>
          }
        />
      </Layout>
    );
  }

  if (device.type !== 'firewall') {
    return (
      <Layout className={styles.resultLayout}>
        <Result
          status="warning"
          title="Неверный тип устройства"
          subTitle={`Устройство "${device.label}" не является межсетевым экраном.`}
          extra={
            <Button type="primary" onClick={() => navigate(paths.root)}>
              На главную
            </Button>
          }
        />
      </Layout>
    );
  }

  const isOffline = device.status === 'offline';

  return (
    <Layout className={styles.pageLayout}>
      <Flex align="center" gap="12px" className={styles.headerRow}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          Назад
        </Button>
        <h2 className={styles.titleText}>Панель управления безопасностью МСЭ</h2>
      </Flex>

      <Card className={styles.infoCard} styles={{ body: { padding: '20px' } }}>
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} md={12}>
            <Flex align="center" gap="12px">
              <div>
                <h1 className={styles.deviceName}>{device.label}</h1>
                <div className={styles.deviceDesc}>
                  {device.vendor} {device.model} {device.version ? `(ПО: ${device.version})` : ''}
                </div>
              </div>
            </Flex>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]} justify="end">
              <Col className={styles.metaCol}>
                <div className={styles.metaLabel}>IP-адрес</div>
                <div className={styles.metaValue}>{device.ip}</div>
              </Col>
              <Col className={styles.metaColBordered}>
                <div className={styles.metaLabel}>MAC-адрес</div>
                <div className={styles.metaValue}>{device.mac}</div>
              </Col>
              <Col className={styles.statusColBordered}>
                <div className={styles.statusLabel}>Статус</div>
                <Tag color={isOffline ? 'error' : 'success'} className={styles.statusTag}>
                  {isOffline ? 'Offline' : 'Online'}
                </Tag>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Main Tabs Container */}
      {isOffline ? (
        <Alert
          message="Устройство отключено"
          description="Этот межсетевой экран находится в автономном режиме. Управление правилами и симуляция угроз станут доступны, как только связь с устройством будет восстановлена."
          type="error"
          showIcon
          className={styles.offlineAlert}
        />
      ) : (
        <Card className={styles.tabsCard} styles={{ body: { padding: '20px' } }}>
          <Tabs
            defaultActiveKey="rules"
            items={[
              {
                key: 'rules',
                label: 'Правила фильтрации',
                children: (
                  <div className={styles.tabContent}>
                    <FirewallRulesTab
                      nodeId={device.id}
                      vendor={device.vendor}
                      rules={device.rules}
                      isOffline={isOffline}
                      firewallConfig={device.firewallConfig}
                    />
                  </div>
                ),
              },
              {
                key: 'threats',
                label: 'Анализ угроз безопасности',
                children: (
                  <div className={styles.tabContent}>
                    <ThreatAnalysisTab
                      nodeId={device.id}
                      threats={device.threats}
                      isOffline={isOffline}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}
    </Layout>
  );
};

export default FirewallPage;
