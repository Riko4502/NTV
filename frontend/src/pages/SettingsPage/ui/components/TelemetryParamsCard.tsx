import { SecurityScanOutlined } from '@ant-design/icons';
import { Card, Flex, Form, InputNumber, Slider } from 'antd';
import type { FC } from 'react';
import styles from '../SettingsPage.module.scss';

export const TelemetryParamsCard: FC = () => {
  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <SecurityScanOutlined />
          Параметры сбора телеметрии
        </Flex>
      }
      className={styles.card}
    >
      <Form.Item
        label="Интервал опроса телеметрии устройств (ms)"
        name="telemetryInterval"
        rules={[{ required: true, message: 'Укажите интервал' }]}
      >
        <InputNumber min={1000} max={30000} step={1000} className={styles.inputNumber} />
      </Form.Item>

      <Form.Item label="Максимальный уровень колебания шума показаний (%)" name="noiseLevel">
        <Slider min={0} max={25} marks={{ 0: '0%', 5: '5%', 25: '25%' }} />
      </Form.Item>
    </Card>
  );
};
