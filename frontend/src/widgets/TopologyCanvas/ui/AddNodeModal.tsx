import { Form, Input, Modal, Select } from 'antd';
import type { FC } from 'react';
import { useAddNodeMutation } from '@/shared/api';
import type { AddNodePayload } from '@/shared/libs';
import styles from './AddNodeModal.module.scss';
import { DEVICE_TYPE_OPTIONS } from './constants';

interface AddNodeModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddNodeModal: FC<AddNodeModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<AddNodePayload>();
  const [addNode] = useAddNodeMutation();

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        await addNode(values).unwrap();
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
      classNames={{
        container: styles.modalContainer,
      }}
    >
      <Form form={form} layout="vertical" className={styles.form}>
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
