import type { FormInstance } from 'antd';
import { Form, Input, Modal, Select } from 'antd';
import type { FC } from 'react';
import type { AddNodePayload } from '@/shared/libs';
import { DEVICE_TYPE_OPTIONS_EXTENDED } from '../constants';
import styles from '../DevicesPage.module.scss';

interface AddDeviceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  form: FormInstance;
  onFinish: (values: AddNodePayload) => void;
}

const VENDOR_OPTIONS = [
  { label: 'Cisco', value: 'Cisco' },
  { label: 'Check Point', value: 'Check Point' },
  { label: 'Fortinet', value: 'Fortinet' },
  { label: 'Huawei', value: 'Huawei' },
  { label: 'Juniper', value: 'Juniper' },
  { label: 'Eltex', value: 'Eltex' },
  { label: 'Generic', value: 'Generic' },
];

export const AddDeviceModal: FC<AddDeviceModalProps> = ({ isOpen, onCancel, form, onFinish }) => {
  return (
    <Modal
      title="Добавить новое устройство"
      open={isOpen}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Добавить"
      cancelText="Отмена"
      classNames={{ body: styles.modalBody }}
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
          name="vendor"
          label="Вендор / Производитель"
          initialValue="Generic"
          rules={[{ required: true, message: 'Пожалуйста, выберите вендора' }]}
        >
          <Select showSearch options={VENDOR_OPTIONS} placeholder="Выберите вендора" />
        </Form.Item>
        <Form.Item name="model" label="Модель устройства">
          <Input placeholder="Например, ISR 4431 или MES2424" />
        </Form.Item>
        <Form.Item name="version" label="Версия ПО">
          <Input placeholder="Например, v17.3 или OS Sonoma" />
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
