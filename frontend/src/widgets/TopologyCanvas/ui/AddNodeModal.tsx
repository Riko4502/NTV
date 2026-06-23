import { Form, Input, Modal, Select } from 'antd';

import type { FC } from 'react';
import { useAddNodeMutation } from '@/shared/api';

const DEVICE_TYPE_OPTIONS = [
  { value: 'router', label: 'Маршрутизатор' },
  { value: 'switch', label: 'Коммутатор' },
  { value: 'server', label: 'Сервер' },
  { value: 'client', label: 'Хост / ПК' },
  { value: 'firewall', label: 'Межсетевой экран' },
];

interface AddNodeModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddNodeModal: FC<AddNodeModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [addNode] = useAddNodeMutation();

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values: { label: string; type: string; ip?: string }) => {
        await addNode({
          label: values.label,
          type: values.type as 'router' | 'switch' | 'server' | 'client' | 'firewall',
          ip: values.ip || undefined,
        }).unwrap();
        form.resetFields();
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Добавить новое устройство"
      open={open}
      onOk={handleAdd}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      okText="Добавить"
      cancelText="Отмена"
      styles={{
        container: { background: 'var(--bg-panel)', border: '1px solid var(--border-color)' },
      }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="label"
          label="Название устройства"
          rules={[{ required: true, message: 'Введите название устройства' }]}
        >
          <Input placeholder="Например: Core Switch 3" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Тип устройства"
          rules={[{ required: true, message: 'Выберите тип устройства' }]}
        >
          <Select placeholder="Выберите тип" options={DEVICE_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item name="ip" label="IP-адрес (опционально)">
          <Input placeholder="Например: 10.0.4.10" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
