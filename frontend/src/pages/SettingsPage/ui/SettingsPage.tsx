import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Layout, Row } from 'antd';
import type { FC } from 'react';
import { RecoveryCard } from './components/RecoveryCard';
import { TelemetryParamsCard } from './components/TelemetryParamsCard';
import { ThresholdsCard } from './components/ThresholdsCard';
import { INITIAL_SETTING } from './constants';
import { useSettings } from './hooks/useSettings';

export const SettingsPage: FC = () => {
  const { form, saving, handleFinish, handleResetSimulation } = useSettings();

  return (
    <Layout
      style={{ height: '100%', background: 'transparent', padding: '24px', overflowY: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={INITIAL_SETTING}
        onFinish={handleFinish}
        style={{ maxWidth: '800px' }}
      >
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <ThresholdsCard />
          </Col>

          <Col span={24}>
            <TelemetryParamsCard />
          </Col>

          <Col span={24}>
            <RecoveryCard onResetSimulation={handleResetSimulation} />
          </Col>

          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                style={{ height: '40px', fontWeight: 600 }}
              >
                Сохранить конфигурацию
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default SettingsPage;
