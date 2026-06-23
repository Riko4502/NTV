import { SecurityScanOutlined } from '@ant-design/icons';
import { Card, Form, InputNumber, Slider } from 'antd';
import type { FC } from 'react';

export const TelemetryParamsCard: FC = () => {
  return (
    <Card
      title={
        <span
          style={{
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <SecurityScanOutlined />
          Параметры сбора телеметрии
        </span>
      }
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
    >
      <Form.Item
        label="Интервал опроса телеметрии устройств (ms)"
        name="telemetryInterval"
        rules={[{ required: true, message: 'Укажите интервал' }]}
      >
        <InputNumber min={1000} max={30000} step={1000} style={{ width: '200px' }} />
      </Form.Item>

      <Form.Item label="Максимальный уровень колебания шума показаний (%)" name="noiseLevel">
        <Slider min={0} max={25} marks={{ 0: '0%', 5: '5%', 25: '25%' }} />
      </Form.Item>
    </Card>
  );
};
