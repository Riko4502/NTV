import { Form, Input, Modal, Select } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import styles from '../DeviceDetails.module.scss';

interface EditDeviceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  device: {
    label: string;
    ip: string;
    mac: string;
    vendor?: string;
    model?: string;
    version?: string;
  };
  onFinish: (values: {
    label: string;
    ip: string;
    mac: string;
    vendor: string;
    model: string;
    version: string;
  }) => void;
}

const VENDOR_OPTIONS = [
  { label: 'Cisco', value: 'Cisco' },
  { label: 'Check Point', value: 'Check Point' },
  { label: 'Fortinet', value: 'Fortinet' },
  { label: 'Mikrotik', value: 'Mikrotik' },
  { label: 'Dell', value: 'Dell' },
  { label: 'HP', value: 'HP' },
  { label: 'Huawei', value: 'Huawei' },
  { label: 'Juniper', value: 'Juniper' },
  { label: 'Eltex', value: 'Eltex' },
  { label: 'Lenovo', value: 'Lenovo' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Generic', value: 'Generic' },
];

export const EditDeviceModal: FC<EditDeviceModalProps> = ({
  isOpen,
  onCancel,
  device,
  onFinish,
}) => {
  const [form] = Form.useForm();

  // Reset/populate form values when active device changes or modal opens
  useEffect(() => {
    if (isOpen && device) {
      form.setFieldsValue({
        label: device.label,
        vendor: device.vendor || 'Generic',
        model: device.model || '',
        version: device.version || '',
        ip: device.ip,
        mac: device.mac,
      });
    }
  }, [isOpen, device, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onFinish(values);
    });
  };

  return (
    <Modal
      title={`Редактировать параметры устройства: ${device?.label}`}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Сохранить"
      cancelText="Отмена"
      classNames={{ body: styles.modalBody }}
    >
      <Form form={form} layout="vertical" name="edit_device_form">
        <Form.Item
          name="label"
          label="Имя устройства"
          rules={[{ required: true, message: 'Пожалуйста, введите имя устройства' }]}
        >
          <Input placeholder="Например, srv-backup" />
        </Form.Item>

        <Form.Item
          name="vendor"
          label="Вендор / Производитель"
          rules={[{ required: true, message: 'Пожалуйста, выберите или укажите вендора' }]}
        >
          <Select
            showSearch
            options={VENDOR_OPTIONS}
            placeholder="Выберите или введите вендора"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(menu) => <>{menu}</>}
          />
        </Form.Item>

        <Form.Item name="model" label="Модель устройства">
          <Input placeholder="Например, Catalyst 9300" />
        </Form.Item>

        <Form.Item name="version" label="Версия ПО / Прошивки">
          <Input placeholder="Например, v15.2(4)M1 или OS Sonoma" />
        </Form.Item>

        <Form.Item
          name="ip"
          label="IP-адрес"
          rules={[
            { required: true, message: 'Пожалуйста, введите IP-адрес' },
            {
              pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
              message: 'Пожалуйста, введите корректный IPv4-адрес',
            },
          ]}
        >
          <Input placeholder="Например, 10.0.3.50" />
        </Form.Item>

        <Form.Item
          name="mac"
          label="MAC-адрес"
          rules={[
            { required: true, message: 'Пожалуйста, введите MAC-адрес' },
            {
              pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
              message: 'Пожалуйста, введите корректный MAC-адрес (например, 00:1A:2B:3C:4D:5E)',
            },
          ]}
        >
          <Input placeholder="Например, 00:1A:2B:3C:4D:5E" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
