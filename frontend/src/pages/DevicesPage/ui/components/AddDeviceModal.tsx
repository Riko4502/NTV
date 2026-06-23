import type { FormInstance } from 'antd';
import { Form, Input, Modal, Select } from 'antd';
import type { FC } from 'react';
import type { AddNodePayload } from '@/shared/libs';
import { DEVICE_TYPE_OPTIONS_EXTENDED } from '../constants';

interface AddDeviceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  form: FormInstance;
  onFinish: (values: AddNodePayload) => void;
}

export const AddDeviceModal: FC<AddDeviceModalProps> = ({ isOpen, onCancel, form, onFinish }) => {
  return (
    <Modal
      title="Добавить новое устройство"
      open={isOpen}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Добавить"
      cancelText="Отмена"
      styles={{ body: { paddingTop: '12px' } }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="label"
          label="Имя устройства"
          rules={[{ required: true, message: 'Пожалуйста, введите имя устройства' }]}
        >
          <Input placeholder="Например, srv-backup" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Тип устройства"
          initialValue="client"
          rules={[{ required: true, message: 'Пожалуйста, выберите тип' }]}
        >
          <Select options={DEVICE_TYPE_OPTIONS_EXTENDED} />
        </Form.Item>
        <Form.Item
          name="ip"
          label="IP-адрес (необязательно)"
          rules={[
            {
              pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
              message: 'Пожалуйста, введите корректный IPv4-адрес',
            },
          ]}
        >
          <Input placeholder="Например, 10.0.3.50 (оставьте пустым для автогенерации)" />
        </Form.Item>
        <Form.Item name="mac" label="MAC-адрес (необязательно)">
          <Input placeholder="Например, 00:1A:2B:3C:4D:5E (оставьте пустым для автогенерации)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
