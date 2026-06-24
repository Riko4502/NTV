import { Form, Input, Modal, Select } from 'antd';
import type { FC } from 'react';
import type { AddRuleFormData } from '@/shared/libs';
import { INITIAL_ADD_FORM_VALUES, RULE_ACTION_OPTIONS, RULE_PROTOCOL_OPTIONS } from './constants';

interface AddRuleModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: AddRuleFormData) => Promise<void>;
  confirmLoading: boolean;
}

export const AddRuleModal: FC<AddRuleModalProps> = ({
  open,
  onCancel,
  onFinish,
  confirmLoading,
}) => {
  const [form] = Form.useForm<AddRuleFormData>();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleFormFinish = async (values: AddRuleFormData) => {
    await onFinish(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Добавить правило фильтрации"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Добавить"
      cancelText="Отмена"
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        initialValues={{ ...INITIAL_ADD_FORM_VALUES }}
        layout="vertical"
        onFinish={handleFormFinish}
        name="add_rule_form"
      >
        <Form.Item
          name="name"
          label="Имя правила"
          rules={[{ required: true, message: 'Введите имя правила' }]}
        >
          <Input placeholder="Например, Block SSH Attacks" />
        </Form.Item>

        <Form.Item name="protocol" label="Протокол" rules={[{ required: true }]}>
          <Select options={RULE_PROTOCOL_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="source"
          label="IP Источник"
          rules={[{ required: true, message: 'Укажите источник' }]}
        >
          <Input placeholder="Например, Any или CIDR 192.168.1.0/24" />
        </Form.Item>

        <Form.Item
          name="destination"
          label="IP Назначение"
          rules={[{ required: true, message: 'Укажите назначение' }]}
        >
          <Input placeholder="Например, Any или IP устройства" />
        </Form.Item>

        <Form.Item
          name="port"
          label="Порт назначения"
          rules={[{ required: true, message: 'Укажите порт' }]}
        >
          <Input placeholder="Например, 22, 80, 443 или Any" />
        </Form.Item>

        <Form.Item name="action" label="Действие" rules={[{ required: true }]}>
          <Select options={RULE_ACTION_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
