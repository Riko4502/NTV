import { Button, Form, Modal, Select } from 'antd';
import type { FC } from 'react';

interface AddEdgeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bandwidth: number) => void;
  sourceLabel: string;
  targetLabel: string;
}

export const AddEdgeModal: FC<AddEdgeModalProps> = ({
  open,
  onClose,
  onSubmit,
  sourceLabel,
  targetLabel,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { bandwidth: number }) => {
    onSubmit(values.bandwidth);
    form.resetFields();
  };

  return (
    <Modal
      title="Создать сетевое соединение"
      open={open}
      onCancel={onClose}
      footer={null}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
      styles={{
        body: {
          padding: '12px 0 0 0',
        },
      }}
    >
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Установка связи между узлами: <strong>{sourceLabel}</strong> и{' '}
        <strong>{targetLabel}</strong>
      </div>

      <Form form={form} layout="vertical" initialValues={{ bandwidth: 1 }} onFinish={handleFinish}>
        <Form.Item
          name="bandwidth"
          label="Тип линии / Пропускная способность"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: '1 Gbps (Медный кабель Cat6)', value: 1 },
              { label: '10 Gbps (Оптический кабель Multi-mode)', value: 10 },
              { label: '40 Gbps (Оптическая магистраль QSFP)', value: 40 },
              { label: '100 Gbps (Core Backbone QSFP28)', value: 100 },
            ]}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onClose}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            Создать канал
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEdgeModal;
