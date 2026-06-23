import { SettingOutlined } from '@ant-design/icons';
import { Card, Form, Slider } from 'antd';
import type { FC } from 'react';

export const ThresholdsCard: FC = () => {
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
          <SettingOutlined />
          Пороговые лимиты NOC (Thresholds)
        </span>
      }
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
    >
      <Form.Item label="Порог предупреждения CPU (%)" name="cpuWarning">
        <Slider min={50} max={90} marks={{ 50: '50%', 80: '80%', 90: '90%' }} />
      </Form.Item>

      <Form.Item label="Критический порог CPU (%)" name="cpuCritical">
        <Slider min={80} max={99} marks={{ 80: '80%', 90: '90%', 99: '99%' }} />
      </Form.Item>

      <Form.Item label="Критическая температура нагрева ядра (°C)" name="tempLimit">
        <Slider min={50} max={95} marks={{ 50: '50°C', 75: '75°C', 95: '95°C' }} />
      </Form.Item>

      <Form.Item label="Порог предупреждения памяти RAM (%)" name="ramWarning">
        <Slider min={60} max={95} marks={{ 60: '60%', 85: '85%', 95: '95%' }} />
      </Form.Item>
    </Card>
  );
};
