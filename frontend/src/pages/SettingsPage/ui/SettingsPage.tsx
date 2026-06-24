import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Layout, Row } from 'antd';
import type { FC } from 'react';
import { RecoveryCard } from './components/RecoveryCard';
import { TelemetryParamsCard } from './components/TelemetryParamsCard';
import { ThresholdsCard } from './components/ThresholdsCard';
import { INITIAL_SETTING } from './constants';
import { useSettings } from './hooks/useSettings';
import styles from './SettingsPage.module.scss';

export const SettingsPage: FC = () => {
  const { form, saving, handleFinish, handleResetSimulation } = useSettings();

  return (
    <Layout className={styles.pageLayout}>
      <Form
        form={form}
        layout="vertical"
        initialValues={INITIAL_SETTING}
        onFinish={handleFinish}
        className={styles.form}
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
                className={styles.saveBtn}
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
